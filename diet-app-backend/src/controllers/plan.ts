import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateDietPlan } from '../agent'
import { DietPlanRequest, DietPlanRequestSchema } from '../schemas/diets'
import { planResponseSchema } from '../schemas/plans'
import {
  deletePlan as _deletePlan,
  getPlan as _getPlan,
  insertPlan,
} from '../services/plans'

export const plan: FastifyPluginAsyncZod = async (app) => {
  app.post<{ Body: DietPlanRequest }>(
    '/genPlan',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Diet Plan'],
        security: [{ bearerAuth: [] }],
        summary: 'Gera um plano alimentar personalizado',
        description:
          'Recebe os dados do usuário e retorna o plano alimentar em streaming (SSE).',
        body: DietPlanRequestSchema,
        response: {
          200: z.string().describe('Plano gerado via stream de texto'),
          400: z.object({
            error: z.string(),
            details: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      // Configura SSE (Server-Sent Events)
      reply.raw.setHeader('Access-Control-Allow-Origin', '*')
      reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      reply.raw.setHeader('Cache-Control', 'no-cache')
      reply.raw.setHeader('Connection', 'keep-alive')

      const body = request.body

      try {
        for await (const delta of generateDietPlan(body)) {
          reply.raw.write(delta)
        }

        reply.raw.end()
      } catch (err) {
        request.log.error(err)
        const message =
          err instanceof Error ? err.message : 'Erro inesperado no servidor.'
        reply.raw.write(`event: error\ndata: ${JSON.stringify(message)}\n\n`)
        reply.raw.end()
      }

      return reply
    },
  )
}

export const planInsertion: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/postPlan',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Diet Plan'],
        security: [{ bearerAuth: [] }],
        summary: 'Cria o plano alimentar do usuário',
        description:
          'Insere o plano alimentar de um usuário (cada usuário só pode ter 1 plano).',
        body: z.object({
          content: z.string(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            planId: z.uuid(),
          }),
          400: z.object({
            error: z.string(),
            details: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { content } = request.body

      try {
        const newPlan = await insertPlan({ content, userId })

        return reply.send({
          success: true,
          planId: newPlan,
        })
      } catch (err) {
        request.log.error(err)
        return reply.status(400).send({
          error: 'Erro ao salvar plano.',
          details: err,
        })
      }
    },
  )
}

export const getPlan: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/getPlan',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Diet Plan'],
        security: [{ bearerAuth: [] }],
        summary: 'Pega o plano alimentar do usuário',
        description:
          'Pega o plano alimentar de um usuário (cada usuário só pode ter 1 plano).',
        response: {
          200: planResponseSchema,
          400: z.object({
            error: z.string(),
            details: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      try {
        const plan = await _getPlan(userId)

        return reply.send({ ...plan })
      } catch (err) {
        request.log.error(err)
        return reply.status(400).send({
          error: 'Erro ao pegar plano alimentar.',
          details: err,
        })
      }
    },
  )
}

export const deletePlan: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/deletePlan',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Diet Plan'],
        security: [{ bearerAuth: [] }],
        summary: 'Deleta o plano alimentar do usuário',
        description: 'Deleta o plano alimentar de um usuário.',
        response: {
          200: z.object({
            planId: z.uuid(),
          }),
          400: z.object({
            error: z.string(),
            details: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      try {
        const planId = await _deletePlan(userId)

        return reply.send({ planId })
      } catch (err) {
        request.log.error(err)
        return reply.status(400).send({
          error: 'Erro ao deletar plano alimentar.',
          details: err,
        })
      }
    },
  )
}
