import z from 'zod'

export const DietDataSchema = z.object({
  name: z.string().min(2),
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().positive().int(),
  activity_level: z.enum(['sedentario', '2x_semana', '4x_semana']),
  genre: z.enum(['masculino', 'feminino', 'outro']),
  goal: z.enum(['perda_de_peso', 'hipertrofia', 'manter_massa_muscular']),
})

export type DietData = z.infer<typeof DietDataSchema>
