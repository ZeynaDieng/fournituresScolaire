// server/api/admin/promotions/index.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await prisma.promotion.findMany()
  }
  if (event.method === 'POST') {
    const body = await readBody(event)
    return await prisma.promotion.create({ data: body })
  }
})
