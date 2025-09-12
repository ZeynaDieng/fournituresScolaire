// /server/api/test/create-order.post.ts
import { sendOrderNotification } from "../../../utils/email-notifications";
import { saveOrder } from "../../../utils/local-storage";

export default defineEventHandler(async (event) => {
  try {
    // Données de test
    const orderData = {
      ref: `TEST-${Date.now()}`,
      customer: {
        name: "Seynabou Dieng",
        email: "zeynash1@gmail.com",
        phone: "+221 78 291 18 44",
      },
      shipping: {
        address: "Parcelle, Thiès",
        city: "Thiès",
        method: "Standard",
        cost: 500,
      },
      items: [
        {
          name: "Pack CE2 - Fournitures scolaires",
          quantity: 1,
          price: 4800,
        },
      ],
      amounts: {
        subtotal: 4800,
        shipping: 500,
        discount: 0,
        total: 5300,
      },
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "test",
      source: "web" as const,
      metadata: {
        userAgent: "Test Agent",
        createdVia: "test",
      },
    };

    // Sauvegarder la commande
    const savedOrder = await saveOrder(orderData);
    console.log("✅ Commande test sauvegardée:", savedOrder.ref);

    // Envoyer notification email
    try {
      const emailData = {
        ...orderData,
        createdAt: new Date().toISOString(),
      };

      await sendOrderNotification(emailData);
      console.log("✅ Email de test envoyé");

      return {
        success: true,
        message: "Commande test créée et email envoyé",
        orderId: savedOrder.id,
        orderRef: savedOrder.ref,
        emailSent: true,
      };
    } catch (emailError) {
      console.warn("⚠️ Erreur email (commande sauvegardée):", emailError);

      return {
        success: true,
        message: "Commande test créée mais email échoué",
        orderId: savedOrder.id,
        orderRef: savedOrder.ref,
        emailSent: false,
        emailError:
          emailError instanceof Error ? emailError.message : "Erreur inconnue",
      };
    }
  } catch (error) {
    console.error("❌ Erreur création commande test:", error);

    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la commande test",
    });
  }
});
