import { db } from '../drizzle/drizzle'
import { plans } from '../drizzle/schema/plan'
import { Plan } from '../schemas/plans'

export async function insertPlan(plan: Plan) {
  const [newPlan] = await db.insert(plans).values(plan).returning()

  return newPlan
}
