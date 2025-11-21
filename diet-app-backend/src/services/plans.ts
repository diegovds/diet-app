import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { plans } from '../drizzle/schema/plan'
import { Plan } from '../schemas/plans'

export async function insertPlan(plan: Plan) {
  const [newPlan] = await db.insert(plans).values(plan).returning()

  return newPlan.id
}

export async function getPlan(userId: string) {
  const [plan] = await db.select().from(plans).where(eq(plans.userId, userId))

  return plan
}
