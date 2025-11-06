import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { generateDietPlan } from '../agent'
import { DietPlanRequest, DietPlanRequestSchema } from '../schemas/diets'

export const plan: FastifyPluginAsyncZod = async (app) => {
  app.post<{ Body: DietPlanRequest }>(
    '/plan',
    {
      schema: {
        tags: ['Diet Plan'],
        security: [],
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
