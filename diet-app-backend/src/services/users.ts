import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { users } from '../drizzle/schema/users'

type NewUser = typeof users.$inferInsert

export async function findUser(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function insertUser(user: NewUser) {
  const [newUser] = await db.insert(users).values(user).returning()

  return newUser
}
