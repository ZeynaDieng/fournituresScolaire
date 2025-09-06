// server/api/orders/create-airtable.post.ts
import { readBody, getHeader, defineEventHandler } from "h3";
import { AirtableService } from "../../../utils/airtable";
import { sendOrderNotification } from "../../../utils/email-notifications";

interface OrderRequestBody {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  shippingMethod?: string;
  shippingCost?: number;
  ref?: string;
  items: any[];
  total: number;
  subtotal?: number;
  discount?: number;
}

export default defineEventHandler(async (event) => {
  try {
    console.log("🎯 API create-airtable appelée");
    
    const body = (await readBody(event)) as Partial<OrderRequestBody>;
    console.log("📊 Données reçues:", JSON.stringify(body, null, 2));

    // Validation des champs requis
    const requiredFields = ["name", "email", "phone", "address", "items", "total"];
    for (const field of requiredFields) {
      if (!body[field as keyof OrderRequestBody]) {
        return { 
          success: false, 
          message: `Champ requis manquant: ${field}` 
        };
      }
    }

    // Validation des items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return { 
        success: false, 
        message: "Articles de commande manquants" 
      };
    }

    // Générer une référence unique pour la commande
    const orderRef = body.ref || `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`📝 Création commande avec référence: ${orderRef}`);

    // Préparer les données pour Airtable
    const orderData = {
      Reference: orderRef,
      "Customer Name": body.name!,
      "Customer Email": body.email || "",
      "Customer Phone": body.phone || "",
      Items: JSON.stringify({
        items: body.items!.map((item: any) => ({
          name: item.name || item.title || "Article",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        shipping: {
          address: body.address!,
          city: body.city || "",
          method: body.shippingMethod || "Standard",
          cost: body.shippingCost || 0,
        },
        amounts: {
          subtotal: body.subtotal || body.total!,
          shipping: body.shippingCost || 0,
          discount: body.discount || 0,
          total: body.total!,
        },
        metadata: {
          userAgent: getHeader(event, "user-agent"),
          createdVia: "web-airtable",
        }
      }),
      Total: body.total!,
      Status: "pending",
      "Payment Status": "pending",
      "Created At": new Date().toISOString(),
    };

    console.log("💾 Sauvegarde dans Airtable...");
    
    // Créer la commande dans Airtable
    const airtableOrderId = await AirtableService.createOrder(orderData);
    
    if (!airtableOrderId) {
      throw new Error("Impossible de créer la commande dans Airtable");
    }

    console.log(`✅ Commande créée dans Airtable avec ID: ${airtableOrderId}`);

    // Envoyer notification email (non bloquant)
    try {
      const emailData = {
        ref: orderRef,
        customer: {
          name: body.name!,
          email: body.email!,
          phone: body.phone!,
        },
        shipping: {
          address: body.address!,
          city: body.city || "",
          method: body.shippingMethod || "Standard",
          cost: body.shippingCost || 0,
        },
        items: body.items!.map((item: any) => ({
          name: item.name || item.title || "Article",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        amounts: {
          subtotal: body.subtotal || body.total!,
          shipping: body.shippingCost || 0,
          discount: body.discount || 0,
          total: body.total!,
        },
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "paytech",
        source: "web" as const,
        createdAt: new Date().toISOString(),
      };

      await sendOrderNotification(emailData);
      console.log("✅ Notification email envoyée pour la commande:", orderRef);
    } catch (emailError) {
      console.warn(
        "⚠️ Erreur envoi email (la commande est sauvegardée):",
        emailError instanceof Error ? emailError.message : emailError
      );
    }

    return {
      success: true,
      orderId: airtableOrderId,
      orderRef: orderRef,
      message: "Commande sauvegardée avec succès dans Airtable",
    };

  } catch (error) {
    console.error("❌ Erreur lors de la création de la commande:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erreur inconnue" 
    };
  }
});
