// server/api/admin/packs/[id].ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  if (event.method === 'DELETE') {
    await prisma.pack.delete({ where: { id } })
    return { success: true }
  } else if (event.method === 'PUT') {
    const body = await readBody(event)
    return await prisma.pack.update({ where: { id }, data: body })
  }
})
