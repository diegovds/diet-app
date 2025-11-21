import { FastifyInstance } from 'fastify'
import { getPlan, plan, planInsertion } from '../controllers/plan'
import { auth, getUser, updateUser } from '../controllers/user'
import { env } from '../env'

export async function routes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.send({
      DIET_APP_API: `Go to ${env.BASE_URL}/docs to see the documentation.`,
    })
  })

  app.register(plan)
  app.register(auth)
  app.register(updateUser)
  app.register(getUser)
  app.register(planInsertion)
  app.register(getPlan)
}
