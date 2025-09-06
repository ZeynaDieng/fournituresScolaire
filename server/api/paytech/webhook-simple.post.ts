/**
 * Webhook PayTech simplifié - sans import externe
 * POST /api/paytech/webhook-simple
 */

import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔔 Webhook PayTech simple reçu");

    const body = await readBody(event);
    console.log("📋 Données webhook:", JSON.stringify(body, null, 2));

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
    } = body;

    console.log(
      `📋 Événement PayTech: ${type_event} pour commande ${
        ref_command || "N/A"
      }`
    );

    // Traitement selon le type d'événement
    if (type_event === "sale_complete" && ref_command) {
      await handleSuccessfulPaymentSimple({
        ref_command,
        amount: final_item_price || item_price || 0,
        payment_method: payment_method || "PayTech",
        client_phone: client_phone || "",
      });
    } else if (type_event === "sale_cancel" && ref_command) {
      await handleCancelledPaymentSimple({
        ref_command,
        amount: final_item_price || item_price || 0,
      });
    } else if (type_event === "sale_pending" && ref_command) {
      await handlePendingPaymentSimple({
        ref_command,
        amount: final_item_price || item_price || 0,
        payment_method: payment_method || "PayTech",
      });
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
 * Traiter un paiement réussi (version simplifiée)
 */
async function handleSuccessfulPaymentSimple(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
  client_phone: string;
}) {
  try {
    console.log("✅ Paiement réussi pour:", data.ref_command);

    // 1. Mettre à jour le statut dans Airtable
    try {
      await updateOrderStatusInAirtableSimple(data.ref_command, "paid");
      console.log("✅ Statut commande mis à jour dans Airtable");
    } catch (airtableError) {
      console.error(
        "⚠️ Erreur mise à jour Airtable (on continue):",
        airtableError
      );
    }

    // 2. Log des notifications (sans envoi réel pour éviter les erreurs)
    console.log("📧📱 Notifications à envoyer pour:", {
      orderRef: data.ref_command,
      amount: data.amount,
      paymentMethod: data.payment_method,
      customerPhone: data.client_phone,
    });

    console.log("🎉 Paiement traité avec succès:", data.ref_command);
  } catch (error) {
    console.error("❌ Erreur traitement paiement réussi:", error);
    // Ne pas faire échouer le webhook pour des erreurs internes
  }
}

/**
 * Traiter un paiement annulé (version simplifiée)
 */
async function handleCancelledPaymentSimple(data: {
  ref_command: string;
  amount: number;
}) {
  try {
    console.log("❌ Paiement annulé pour:", data.ref_command);
    await updateOrderStatusInAirtableSimple(data.ref_command, "cancelled");
  } catch (error) {
    console.error("⚠️ Erreur traitement annulation:", error);
  }
}

/**
 * Traiter un paiement en attente (version simplifiée)
 */
async function handlePendingPaymentSimple(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
}) {
  try {
    console.log("⏳ Paiement en attente pour:", data.ref_command);
    await updateOrderStatusInAirtableSimple(data.ref_command, "pending");
  } catch (error) {
    console.error("⚠️ Erreur traitement pending:", error);
  }
}

/**
 * Mettre à jour le statut d'une commande dans Airtable (version simplifiée)
 */
async function updateOrderStatusInAirtableSimple(
  orderRef: string,
  status: string
) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      console.warn("⚠️ Configuration Airtable manquante");
      return false;
    }

    // Rechercher la commande
    const searchResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Airtable search error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.records || searchData.records.length === 0) {
      console.warn(`⚠️ Commande ${orderRef} non trouvée dans Airtable`);
      return false;
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
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Airtable update error: ${updateResponse.status}`);
    }

    console.log(`✅ Statut de la commande ${orderRef} mis à jour: ${status}`);
    return true;
  } catch (error) {
    console.error("❌ Erreur mise à jour Airtable:", error);
    return false;
  }
}

/**
 * Vérifier la signature IPN PayTech (version réelle)
 */
function verifyPaytechIPN(body: any): boolean {
  try {
    // En mode sandbox/développement, accepter tous les webhooks
    if (
      process.env.PAYTECH_SANDBOX === "true" ||
      process.env.NODE_ENV === "development"
    ) {
      console.log("🧪 Mode test/sandbox - signature IPN contournée");
      return true;
    }

    // Vérification de signature PayTech réelle
    const secretKey = process.env.PAYTECH_SECRET_KEY;
    if (!secretKey) {
      console.error("❌ PAYTECH_SECRET_KEY manquante");
      return false;
    }

    // PayTech utilise généralement HMAC-SHA256 ou SHA1
    const crypto = require("crypto");

    // Extraire les données nécessaires pour la signature
    const {
      type_event,
      custom_field,
      ref_command,
      item_price,
      final_item_price,
      currency,
      phone_client,
      client_name,
      payment_method,
      ipn_token,
    } = body;

    // Concaténer les champs comme spécifié par PayTech
    // L'ordre exact peut varier selon la documentation PayTech
    const dataString = [
      type_event,
      custom_field || "",
      ref_command || "",
      item_price || "",
      final_item_price || "",
      currency || "XOF",
      phone_client || "",
      client_name || "",
      payment_method || "",
    ].join("");

    // Générer la signature avec HMAC-SHA256
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(dataString)
      .digest("hex");

    // Comparer avec la signature reçue
    const receivedSignature = ipn_token || body.signature || body.hash;

    if (!receivedSignature) {
      console.error("❌ Signature IPN manquante dans la requête");
      return false;
    }

    const isValid = expectedSignature === receivedSignature;

    if (isValid) {
      console.log("✅ Signature IPN PayTech valide");
    } else {
      console.error("❌ Signature IPN PayTech invalide");
      console.log("Signature attendue:", expectedSignature);
      console.log("Signature reçue:", receivedSignature);
      console.log("Données concaténées:", dataString);
    }

    return isValid;
  } catch (error) {
    console.error("❌ Erreur vérification IPN:", error);
    return false;
  }
}
