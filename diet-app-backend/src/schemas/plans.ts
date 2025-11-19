import { z } from 'zod'

export const planSchema = z.object({
  userId: z.uuid(),
  content: z.string(),
})

export type Plan = z.infer<typeof planSchema>
