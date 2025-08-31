// server/api/orders/create.post.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    // Création ou récupération de l'utilisateur
    let user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          address: body.address
        }
      })
    }

    // Création de la commande
    const order = await prisma.order.create({
      data: {
        ref: body.ref,
        userId: user.id,
        items: JSON.stringify(body.items),
        total: body.total,
        status: 'pending'
      }
    })

    // Création du paiement (statut en attente)
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'paytech',
        status: 'pending',
        amount: body.total
      }
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    return { success: false, message: error.message }
  }
})
