import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import { plans } from './schema/plans'
import { plansRelations, usersRelations } from './schema/relations'
import { users } from './schema/users'

export const pg = postgres(env.POSTGRES_URL)
export const db = drizzle({
  client: pg,
  schema: { users, plans, usersRelations, plansRelations },
})
