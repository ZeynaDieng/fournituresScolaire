// server/api/admin/orders/index.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await prisma.order.findMany({ include: { user: true } })
  }
})
