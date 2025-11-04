import { FastifyInstance } from 'fastify'
import { plan } from '../controllers/plan'
import { env } from '../env'

export async function routes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.send({
      DIET_APP_API: `Go to ${env.BASE_URL}/docs to see the documentation.`,
    })
  })

  app.register(plan)
}
