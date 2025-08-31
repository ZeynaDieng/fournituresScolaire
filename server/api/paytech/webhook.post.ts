// server/api/paytech/webhook.post.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    try {
      console.log('PayTech Webhook received:', body)
      
      // Vérifier la signature PayTech ici si nécessaire
      // const signature = getHeader(event, 'x-paytech-signature')
      
      const {
        type_event,
        custom_field,
        ref_command,
        item_price,
        payment_method,
        phone_number,
        status
      } = body
      
      if (type_event === 'sale_complete' && status === '1') {
        // Paiement réussi
        console.log(`Paiement réussi pour la commande ${ref_command}`)
        
        // Ici vous pouvez :
        // - Mettre à jour le statut de la commande dans votre base de données
        // - Envoyer un email de confirmation
        // - Déclencher la préparation de la commande
        // - etc.
        
        const orderData = JSON.parse(custom_field || '{}')
        
        // Exemple de traitement
        await processSuccessfulPayment({
          orderId: ref_command,
          amount: item_price,
          paymentMethod: payment_method,
          customerPhone: phone_number,
          orderData
        })
        
        return { success: true, message: 'Payment processed successfully' }
      } else {
        // Paiement échoué ou en attente
        console.log(`Paiement ${status === '0' ? 'échoué' : 'en attente'} pour la commande ${ref_command}`)
        return { success: false, message: 'Payment not completed' }
      }
      
    } catch (error: any) {
      console.error('Webhook processing error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur webhook: ${error.message}`
      })
    }
  })
  
  // Fonction pour traiter les paiements réussis
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()

  async function processSuccessfulPayment(paymentData: any) {
    // Mettre à jour la commande et le paiement en base
    try {
      // Mettre à jour le statut de la commande
      await prisma.order.update({
        where: { ref: paymentData.orderId },
        data: { status: 'paid' }
      })

      // Mettre à jour le paiement
      await prisma.payment.updateMany({
        where: { amount: Number(paymentData.amount) },
        data: {
          status: 'paid',
          paytechId: paymentData.orderId
        }
      })

      // (Optionnel) Envoyer une notification ou email ici

      console.log('Commande et paiement mis à jour en base pour', paymentData.orderId)
      return true
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la commande/paiement:', err)
      return false
    }
  }