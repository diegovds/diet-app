import { z } from 'zod'

export const planSchema = z.object({
  userId: z.uuid(),
  content: z.string(),
})

export type Plan = z.infer<typeof planSchema>

export const planResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  content: z.string(),
  createdAt: z.date().nullable(),
})

export type PlanResponse = z.infer<typeof planResponseSchema>
