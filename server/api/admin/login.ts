// server/api/admin/login.ts
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'
const ADMIN_TOKEN = 'supersecrettoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body.username === ADMIN_USER && body.password === ADMIN_PASS) {
    return { success: true, token: ADMIN_TOKEN }
  }
  return { success: false, message: 'Identifiants invalides' }
})
