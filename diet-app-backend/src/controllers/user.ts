import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { planResponseSchema } from '../schemas/plans'
import {
  findUserByEmail,
  findUserById,
  insertUser,
  updateUserById,
} from '../services/users'

export const auth: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth',
    {
      schema: {
        tags: ['User'],
        security: [],
        summary: 'Cria uma nova conta ou autentica um usuário existente',
        description:
          'Se o usuário não existir, uma nova conta será criada. Se o usuário já existir, ele será autenticado.',
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
            .optional(),
          email: z.email({ message: 'E-mail não válido' }),
          password: z
            .string()
            .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      let passwordVerify = false
      let passwordHash = ''

      let user = await findUserByEmail(email)

      if (user && name) {
        return reply.status(400).send({
          message: 'Email já cadastrado',
        })
      }

      if (user) {
        passwordVerify = await app.bcrypt.compare(password, user.password)

        if (!passwordVerify) {
          return reply.status(401).send({
            message: 'Verifique as credenciais.',
          })
        }
      }

      if (!user && name) {
        passwordHash = await app.bcrypt.hash(password)

        user = await insertUser({
          name,
          email,
          password: passwordHash,
        })
      }

      if ((passwordVerify || passwordHash.length > 0) && user) {
        const token = app.jwt.sign(
          {
            name: user.name,
          },
          {
            sub: user.id,
            expiresIn: '30 days',
          },
        )

        return reply.status(200).send({ token })
      }

      if (!user) {
        return reply.status(404).send({
          message: 'Usuário não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}

export const updateUser: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/user',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        summary: 'Atualiza os dados do usuário autenticado',
        description:
          'Permite ao usuário autenticado atualizar seus próprios dados. Todos os campos são opcionais.',
        body: z.object({
          name: z.string().min(2).optional(),
          weight: z.number().positive().optional(),
          height: z.number().positive().optional(),
          age: z.number().int().positive().optional(),
          activityLevel: z
            .enum(['sedentario', '2x_semana', '4x_semana'])
            .optional(),
          genre: z.enum(['masculino', 'feminino', 'outro']).optional(),
          goal: z
            .enum(['perda_de_peso', 'hipertrofia', 'manter_massa_muscular'])
            .optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { ...data } = request.body

      const updateData = {
        ...data,
        weight: data.weight !== undefined ? data.weight.toString() : undefined,
        height: data.height !== undefined ? data.height.toString() : undefined,
      }

      const updatedUser = await updateUserById(userId, updateData)

      if (!updatedUser) {
        return reply.status(400).send({ message: 'Erro ao atualizar usuário.' })
      }

      return reply.status(200).send({
        message: 'Usuário atualizado com sucesso.',
      })
    },
  )
}

export const getUser: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/user',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        summary: 'Retorna os dados do usuário autenticado',
        response: {
          200: z.object({
            name: z.string(),
            weight: z.number().nullable().optional(),
            height: z.number().nullable().optional(),
            age: z.number().nullable().optional(),
            activityLevel: z
              .enum(['sedentario', '2x_semana', '4x_semana'])
              .nullable()
              .optional(),
            genre: z
              .enum(['masculino', 'feminino', 'outro'])
              .nullable()
              .optional(),
            goal: z
              .enum(['perda_de_peso', 'hipertrofia', 'manter_massa_muscular'])
              .nullable()
              .optional(),
            plan: planResponseSchema.optional(),
          }),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const formattedUser = {
          ...user,
          weight:
            user.weight !== null && user.weight !== undefined
              ? Number(user.weight)
              : null,
          height:
            user.height !== null && user.height !== undefined
              ? Number(user.height)
              : null,
        }

        return reply.send(formattedUser)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
