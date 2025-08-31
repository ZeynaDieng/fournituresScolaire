// server/api/admin/users/index.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await prisma.user.findMany()
  }
})
