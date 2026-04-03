import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'

const DEV_PROVIDER_ID = 'dev-user'

export default defineNitroPlugin((nitroApp) => {
  if (!import.meta.dev) return

  const name = process.env.NUXT_DEV_USER_NAME
  const email = process.env.NUXT_DEV_USER_EMAIL
  const avatar = process.env.NUXT_DEV_USER_AVATAR

  if (!name || !email || !avatar) return

  let devUser: typeof schema.users.$inferSelect | null = null

  nitroApp.hooks.hook('request', async (event) => {
    const session = await getUserSession(event)
    if (session.user) return

    if (!devUser) {
      devUser = await db.query.users.findFirst({
        where: () => and(
          eq(schema.users.provider, 'github'),
          eq(schema.users.providerId, DEV_PROVIDER_ID)
        )
      }) ?? null

      if (!devUser) {
        const [inserted] = await db.insert(schema.users).values({
          name,
          email,
          avatar,
          username: name,
          provider: 'github',
          providerId: DEV_PROVIDER_ID
        }).returning()
        devUser = inserted!
      }
    }

    await setUserSession(event, { user: devUser })
  })
})
