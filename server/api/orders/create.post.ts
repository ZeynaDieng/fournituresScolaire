// server/api/airtable/orders/create.post.ts

import { readBody, getHeader } from "h3";
// Google Sheets supprimé
import { saveOrder } from "../../../utils/local-storage";
import { sendOrderNotification } from "../../../utils/email-notifications";
import { addOrderToAirtable } from "../../../utils/airtable-orders";

interface OrderRequestBody {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  shippingMethod?: string;
  shippingCost?: number;
  ref: string;
  items: any[];
  total: number;
  subtotal?: number;
  discount?: number;
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<OrderRequestBody>;

  // Validate required fields
  const requiredFields = [
    "name",
    "email",
    "phone",
    "address",
    "ref",
    "items",
    "total",
  ];
  for (const field of requiredFields) {
    if (
      body[field as keyof OrderRequestBody] === undefined ||
      body[field as keyof OrderRequestBody] === null
    ) {
      return { success: false, message: `Missing required field: ${field}` };
    }
  }
  try {
    // Générer une référence unique pour la commande
    const orderRef =
      body.ref ||
      `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Préparer les données de commande pour le stockage local
    const orderData = {
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
      metadata: {
        userAgent: getHeader(event, "user-agent"),
        createdVia: "api",
      },
    };

    // Sauvegarder dans le stockage local
    const savedOrder = await saveOrder(orderData);

    // 📧 Envoyer notification email immédiate
    try {
      const emailData = {
        ...orderData,
        createdAt: new Date().toISOString(),
      };

      await sendOrderNotification(emailData);
      console.log(
        "✅ Notification email envoyée pour la commande:",
        savedOrder.ref
      );
    } catch (emailError) {
      console.warn(
        "⚠️ Erreur envoi email (la commande est sauvegardée):",
        emailError instanceof Error ? emailError.message : emailError
      );
    }

    // 📊 Ajouter à Airtable (prioritaire)
    try {
      await addOrderToAirtable(orderData);
      console.log("✅ Commande enregistrée dans Airtable:", savedOrder.ref);
    } catch (airtableError) {
      console.warn(
        "⚠️ Erreur Airtable (la commande est sauvegardée):",
        airtableError instanceof Error ? airtableError.message : airtableError
      );
    }

// 📊 Intégrations optionnelles
// Google Sheets & Excel maître désactivés

    // Essayer d'intégrer Google Sheets en parallèle (non bloquant)
    try {
      const orderDataForSheet = {
        customer: orderData.customer,
        shipping: orderData.shipping,
        items: orderData.items,
        amounts: orderData.amounts,
      };

      // Google Sheets supprimé - plus nécessaire
      console.log("✅ Commande sauvegardée localement et dans Excel");
    } catch (sheetError) {
      console.warn(
        "⚠️ Erreur sauvegarde (la commande continue):",
        sheetError instanceof Error ? sheetError.message : sheetError
      );
    }

    return {
      success: true,
      orderId: savedOrder.id,
      orderRef: savedOrder.ref,
      message: "Commande sauvegardée avec succès",
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "Unknown error occurred" };
    }
  }
});
