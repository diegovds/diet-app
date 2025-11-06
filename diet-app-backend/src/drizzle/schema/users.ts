import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const activityLevelEnum = pgEnum('activity_level', [
  'sedentario',
  '2x_semana',
  '4x_semana',
])
export const genreEnum = pgEnum('genre', ['masculino', 'feminino', 'outro'])
export const goalEnum = pgEnum('goal', [
  'perda_de_peso',
  'hipertrofia',
  'manter_massa_muscular',
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  weight: numeric('weight'),
  height: numeric('height'),
  age: integer('age'),
  activityLevel: activityLevelEnum('activity_level'),
  genre: genreEnum('genre'),
  goal: goalEnum('goal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
