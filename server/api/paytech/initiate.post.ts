// server/api/paytech/initiate.post.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    
    try {
      // URL de l'API PayTech (sandbox ou production)
      const apiUrl = config.paytech.sandbox 
        ? 'https://paytech.sn/api/payment/request-payment'
        : 'https://paytech.sn/api/payment/request-payment'
      
      // Données à envoyer à PayTech
      const paytechData = {
        item_name: `Commande EduShop #${body.ref}`,
        item_price: body.amount,
        currency: 'XOF',
        ref_command: body.ref,
        command_name: `Commande ${body.customer.phone}`,
        env: config.paytech.sandbox ? 'test' : 'prod',
        custom_field: JSON.stringify({
          items: body.items,
          customer: body.customer
        }),
        ipn_url: `${config.public.baseUrl}/api/paytech/webhook`,
        success_url: `${config.public.baseUrl}/payment/success`,
        cancel_url: `${config.public.baseUrl}/payment/cancel`
      }
      
      console.log('PayTech Request:', paytechData)
      
      // Appel à l'API PayTech
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'API-KEY': config.paytech.apiKey,
          'API-SECRET': config.paytech.secretKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paytechData)
      })
      
      const result = await response.json()
      console.log('PayTech Response:', result)
      
      if (!response.ok) {
        throw new Error(`PayTech API Error: ${result.message || 'Unknown error'}`)
      }
      
      return {
        success: true,
        data: result,
        payment_url: result.redirect_url
      }
      
    } catch (error: any) {
      console.error('PayTech Error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur PayTech: ${error.message}`
      })
    }
  })