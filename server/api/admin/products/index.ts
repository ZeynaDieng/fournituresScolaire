// server/api/admin/products/index.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    // Liste des produits
    return await prisma.product.findMany()
  }
  if (event.method === 'POST') {
    const body = await readBody(event)
    return await prisma.product.create({ data: body })
  }
})
