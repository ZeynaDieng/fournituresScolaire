// server/api/admin/promotions/[id].ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  if (event.method === 'DELETE') {
    await prisma.promotion.delete({ where: { id } })
    return { success: true }
  }
})
