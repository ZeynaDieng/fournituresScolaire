import { prisma } from '@/lib/prisma'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const id = Number(event.context.params.id)
    const order = await prisma.order.findUnique({ where: { id } })
    return order
  }

  if (event.method === 'PUT') {
    const id = Number(event.context.params.id)
    const body = await readBody(event)
    return await prisma.order.update({ where: { id }, data: body })
  }

  if (event.method === 'DELETE') {
    const id = Number(event.context.params.id)
    await prisma.order.delete({ where: { id } })
    return { success: true }
  }

  return null
})