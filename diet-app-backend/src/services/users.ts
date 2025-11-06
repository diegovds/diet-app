import { eq } from 'drizzle-orm'
import { db } from '../drizzle/drizzle'
import { users } from '../drizzle/schema/users'

type NewUser = typeof users.$inferInsert
type UpdateUser = Partial<NewUser>

export async function findUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      name: true,
      weight: true,
      height: true,
      age: true,
      activityLevel: true,
      genre: true,
      goal: true,
    },
  })
}

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function insertUser(user: NewUser) {
  const [newUser] = await db.insert(users).values(user).returning()

  return newUser
}

export async function updateUserById(id: string, data: UpdateUser) {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}
