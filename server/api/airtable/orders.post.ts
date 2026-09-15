// server/api/airtable/orders.post.ts
import { AirtableService } from "../../../utils/airtable";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Génération d'une référence unique
    const reference = `EDU-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    let pgOrder = null;
    try {
      pgOrder = await prisma.order.create({
        data: {
          ref: reference,
          items: JSON.stringify(body.items || []),
          total: Number(body.total) || 0,
          subtotal: Number(body.total) || 0,
          shipping: Number(body.shipping) || 0,
          status: body.status || "pending",
          paymentStatus: body.paymentStatus || "pending",
          source: body.customerName ? `${body.customerName} (${body.customerPhone || ""})` : "web",
          notes: body.notes || "",
        },
      });
      console.log(`✅ Commande enregistrée dans PostgreSQL local (Ref: ${reference})`);
    } catch (dbErr) {
      console.warn("⚠️ Erreur enregistrement PostgreSQL commande:", dbErr);
    }

    // Tentative optionnelle de sync Airtable si configuré
    try {
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
      await AirtableService.createOrder(orderData);
    } catch (atErr) {
      console.warn("⚠️ Sync Airtable non bloquante ignorée.");
    }

    return {
      success: true,
      data: {
        id: pgOrder ? pgOrder.id : reference,
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
