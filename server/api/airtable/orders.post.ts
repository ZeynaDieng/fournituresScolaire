// server/api/airtable/orders.post.ts
import { AirtableService } from "../../../utils/airtable";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Génération d'une référence unique
    const reference = `EDU-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    const orderData = {
      Reference: reference,
      "Customer Name": body.customerName,
      "Customer Email": body.customerEmail,
      "Customer Phone": body.customerPhone,
      Items: JSON.stringify(body.items),
      Total: body.total,
      Status: "pending",
      "Payment Status": "pending",
      "Created At": new Date().toISOString(),
    };

    const orderId = await AirtableService.createOrder(orderData);

    if (!orderId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erreur lors de la création de la commande",
      });
    }

    return {
      success: true,
      data: {
        id: orderId,
        reference,
        status: "pending",
      },
    };
  } catch (error) {
    console.error("Erreur API create order:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la commande",
    });
  }
});
