import { relations } from 'drizzle-orm'
import { plans } from './plans'
import { users } from './users'

// 1:1 -> user has one plan (nome 'plan' singular é mais apropriado)
export const usersRelations = relations(users, ({ one }) => ({
  plan: one(plans, {
    fields: [users.id],
    references: [plans.userId],
  }),
}))

// inverse relation (plan -> user)
export const plansRelations = relations(plans, ({ one }) => ({
  user: one(users, {
    fields: [plans.userId],
    references: [users.id],
  }),
}))
