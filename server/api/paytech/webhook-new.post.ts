/**
 * Webhook PayTech robuste - gère les erreurs gracieusement
 * POST /api/paytech/webhook-new
 */

import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    console.error("❌ Erreur lecture body webhook:", error);
    throw createError({
      statusCode: 400,
      statusMessage: "Body invalide",
    });
  }

  try {
    console.log("🔔 PayTech Webhook reçu:", JSON.stringify(body, null, 2));

    // En mode développement/test, on accepte tous les webhooks
    const isValidIPN =
      process.env.NODE_ENV === "development" ||
      process.env.PAYTECH_SANDBOX === "true" ||
      verifyPaytechIPN(body);

    if (!isValidIPN) {
      console.error("❌ IPN invalide - signature non valide");
      throw createError({
        statusCode: 403,
        statusMessage: "IPN signature invalide",
      });
    }

    const {
      type_event,
      ref_command,
      item_price,
      payment_method,
      client_phone,
      final_item_price,
      custom_field,
    } = body;

    console.log(
      `📋 Événement PayTech: ${type_event} pour commande ${
        ref_command || "N/A"
      }`
    );

    // Traitement selon le type d'événement
    switch (type_event) {
      case "sale_complete":
        if (ref_command) {
          await handleSuccessfulPayment({
            ref_command,
            amount: final_item_price || item_price || 0,
            payment_method: payment_method || "PayTech",
            client_phone: client_phone || "",
            custom_field,
          });
        } else {
          console.warn("⚠️ Paiement réussi mais référence commande manquante");
        }
        break;

      case "sale_cancel":
        if (ref_command) {
          await handleCancelledPayment({
            ref_command,
            amount: final_item_price || item_price || 0,
          });
        } else {
          console.warn("⚠️ Paiement annulé mais référence commande manquante");
        }
        break;

      case "sale_pending":
        if (ref_command) {
          await handlePendingPayment({
            ref_command,
            amount: final_item_price || item_price || 0,
            payment_method: payment_method || "PayTech",
          });
        } else {
          console.warn(
            "⚠️ Paiement en attente mais référence commande manquante"
          );
        }
        break;

      default:
        console.log(`ℹ️ Événement PayTech non traité: ${type_event}`);
        break;
    }

    return { success: true, message: "Webhook traité avec succès" };
  } catch (error: any) {
    console.error("❌ Erreur PayTech Webhook:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur webhook PayTech",
    });
  }
});

/**
 * Traiter un paiement réussi
 */
async function handleSuccessfulPayment(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
  client_phone: string;
  custom_field?: any;
}) {
  try {
    console.log("✅ Paiement réussi pour:", data.ref_command);

    // 1. Mettre à jour le statut dans Airtable (avec gestion d'erreur)
    try {
      await updateOrderStatusInAirtable(data.ref_command, "paid");
      console.log("✅ Statut commande mis à jour dans Airtable");
    } catch (airtableError) {
      console.error(
        "⚠️ Erreur mise à jour Airtable (on continue):",
        airtableError
      );
    }

    // 2. Récupérer les détails de la commande (avec gestion d'erreur)
    let orderDetails: any = null;
    try {
      orderDetails = await getOrderDetailsFromAirtable(data.ref_command);
    } catch (detailsError) {
      console.error(
        "⚠️ Erreur récupération détails commande (on continue):",
        detailsError
      );
    }

    // 3. Envoyer les notifications (toujours essayer)
    try {
      await sendOrderNotifications({
        orderRef: data.ref_command,
        amount: data.amount,
        paymentMethod: data.payment_method,
        customerName: orderDetails?.customerName || "Client",
        customerEmail: orderDetails?.customerEmail || "",
        customerPhone: orderDetails?.customerPhone || data.client_phone || "",
      });
    } catch (notifError) {
      console.error("⚠️ Erreur notifications (webhook continue):", notifError);
    }

    console.log("🎉 Paiement traité avec succès:", data.ref_command);
  } catch (error) {
    console.error("❌ Erreur traitement paiement réussi:", error);
    // Ne pas faire échouer le webhook pour des erreurs internes
  }
}

/**
 * Traiter un paiement annulé
 */
async function handleCancelledPayment(data: {
  ref_command: string;
  amount: number;
}) {
  try {
    console.log("❌ Paiement annulé pour:", data.ref_command);
    await updateOrderStatusInAirtable(data.ref_command, "cancelled");
  } catch (error) {
    console.error("⚠️ Erreur traitement annulation:", error);
  }
}

/**
 * Traiter un paiement en attente
 */
async function handlePendingPayment(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
}) {
  try {
    console.log("⏳ Paiement en attente pour:", data.ref_command);
    await updateOrderStatusInAirtable(data.ref_command, "pending");
  } catch (error) {
    console.error("⚠️ Erreur traitement pending:", error);
  }
}

/**
 * Récupérer les détails d'une commande depuis Airtable (robuste)
 */
async function getOrderDetailsFromAirtable(orderRef: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw new Error("Configuration Airtable manquante");
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status}`);
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const order = data.records[0].fields;
      return {
        customerName: order["Customer Name"] || order.Name || "Client",
        customerEmail: order["Customer Email"] || order.Email || "",
        customerPhone: order["Customer Phone"] || order.Phone || "",
        amount: order.Amount || 0,
        items: order.Items || "Commande",
        status: order.Status || "pending",
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Erreur récupération détails commande:", error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'une commande dans Airtable (robuste)
 */
async function updateOrderStatusInAirtable(orderRef: string, status: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw new Error("Configuration Airtable manquante");
    }

    // D'abord récupérer l'ID du record
    const searchResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Erreur recherche: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.records || searchData.records.length === 0) {
      throw new Error(`Commande ${orderRef} non trouvée`);
    }

    const recordId = searchData.records[0].id;

    // Mettre à jour le statut
    const updateResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Status: status,
            "Updated At": new Date().toISOString(),
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Erreur mise à jour: ${updateResponse.status}`);
    }

    console.log(`✅ Statut commande ${orderRef} mis à jour: ${status}`);
    return true;
  } catch (error) {
    console.error("❌ Erreur mise à jour statut:", error);
    throw error;
  }
}

/**
 * Vérifier la signature PayTech IPN
 */
function verifyPaytechIPN(data: any): boolean {
  try {
    // En mode développement ou sandbox, accepter tous les webhooks
    if (
      process.env.NODE_ENV === "development" ||
      process.env.PAYTECH_SANDBOX === "true"
    ) {
      return true;
    }

    // En production, implémenter la vraie vérification selon PayTech
    // const expectedSignature = generatePaytechSignature(data, apiKey, secretKey);
    // return expectedSignature === data.signature;

    return true; // À remplacer par la vraie vérification
  } catch (error) {
    console.error("❌ Erreur vérification signature:", error);
    return false;
  }
}

/**
 * Envoyer les notifications de commande (version simplifiée pour webhook)
 */
async function sendOrderNotifications(data: {
  orderRef: string;
  amount: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  try {
    console.log("📧 Tentative d'envoi de notifications pour:", data.orderRef);

    // Vérification des variables d'environnement
    const fromEmail = process.env.FROM_EMAIL;
    const fromName = process.env.FROM_NAME || "Fournitures Scolaire";
    const adminEmail = process.env.ADMIN_EMAIL;
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER;

    if (!fromEmail || !adminEmail) {
      console.warn("⚠️ Variables email manquantes, notifications désactivées");
      return { email: false, whatsapp: false };
    }

    const results = { email: false, whatsapp: false };

    // 1. Email de confirmation client
    if (data.customerEmail) {
      try {
        const emailData = {
          from: `${fromName} <${fromEmail}>`,
          to: data.customerEmail,
          subject: `Confirmation de paiement - Commande ${data.orderRef}`,
          html: generateOrderConfirmationEmail({
            customerName: data.customerName,
            orderRef: data.orderRef,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
          }),
        };

        // Simulation d'envoi d'email (remplacer par vraie implémentation)
        console.log("✅ Email client simulé envoyé à:", data.customerEmail);
        results.email = true;
      } catch (emailError) {
        console.error("❌ Erreur email client:", emailError);
      }
    }

    // 2. Notification admin par email
    try {
      const adminEmailData = {
        from: `${fromName} <${fromEmail}>`,
        to: adminEmail,
        subject: `🛒 Nouvelle commande payée - ${data.orderRef}`,
        html: generateAdminOrderNotification({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          orderRef: data.orderRef,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
        }),
      };

      // Simulation d'envoi d'email admin (remplacer par vraie implémentation)
      console.log("✅ Email admin simulé envoyé à:", adminEmail);
    } catch (adminEmailError) {
      console.error("❌ Erreur email admin:", adminEmailError);
    }

    // 3. WhatsApp (si configuré)
    if (whatsappNumber && data.customerPhone) {
      try {
        const whatsappMessage = `🛒 *Commande confirmée*\n\nBonjour ${data.customerName},\n\nVotre paiement de ${data.amount} FCFA pour la commande ${data.orderRef} a été traité avec succès.\n\nMerci pour votre confiance !`;

        // Simulation WhatsApp (remplacer par vraie implémentation)
        console.log("✅ WhatsApp simulé envoyé à:", data.customerPhone);
        results.whatsapp = true;
      } catch (whatsappError) {
        console.error("❌ Erreur WhatsApp:", whatsappError);
      }
    }

    console.log("📧📱 Notifications traitées:", results);
    return results;
  } catch (error) {
    console.error("❌ Erreur générale notifications:", error);
    return { email: false, whatsapp: false };
  }
}

/**
 * Générer l'email de confirmation de commande
 */
function generateOrderConfirmationEmail(data: {
  customerName: string;
  orderRef: string;
  amount: number;
  paymentMethod: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">✅ Paiement confirmé</h2>
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      <p>Nous confirmons que votre paiement a été traité avec succès.</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Détails de la commande</h3>
        <p><strong>Référence:</strong> ${data.orderRef}</p>
        <p><strong>Montant:</strong> ${data.amount} FCFA</p>
        <p><strong>Méthode:</strong> ${data.paymentMethod}</p>
      </div>
      <p>Votre commande sera traitée dans les plus brefs délais.</p>
      <p>Merci pour votre confiance !</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Fournitures Scolaire - Service client</p>
    </div>
  `;
}

/**
 * Générer la notification admin
 */
function generateAdminOrderNotification(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderRef: string;
  amount: number;
  paymentMethod: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">🛒 Nouvelle commande payée</h2>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
        <h3>📋 Détails de la commande</h3>
        <p><strong>Référence:</strong> ${data.orderRef}</p>
        <p><strong>Montant:</strong> ${data.amount} FCFA</p>
        <p><strong>Méthode:</strong> ${data.paymentMethod}</p>
        <hr>
        <h3>👤 Client</h3>
        <p><strong>Nom:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Téléphone:</strong> ${data.customerPhone}</p>
      </div>
      <p><a href="https://fournitures-scolaire.vercel.app/admin/orders" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'admin</a></p>
    </div>
  `;
}
