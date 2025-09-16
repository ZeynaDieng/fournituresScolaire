/**
 * Webhook IPN PayTech conforme à la documentation officielle
 * POST /api/paytech/ipn
 * 
 * Documentation: https://docs.intech.sn/doc_paytech.php
 */

import { defineEventHandler, readBody, createError } from "h3";
import crypto from "crypto";
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from "~/utils/email-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    console.log("🔔 PayTech IPN reçu:", JSON.stringify(body, null, 2));

    // Vérifier l'authenticité de la notification selon la documentation PayTech
    const isValidIPN = verifyPaytechIPN(body);

    if (!isValidIPN) {
      console.error("❌ IPN invalide - signature non valide");
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    // Extraire les données selon la documentation PayTech
    const {
      type_event,
      custom_field,
      ref_command,
      item_name,
      item_price,
      final_item_price,
      promo_enabled,
      promo_value_percent,
      token,
      api_key_sha256,
      api_secret_sha256,
      hmac_compute,
      client_phone,
      client_name,
      payment_method,
    } = body;

    console.log(`📋 Événement PayTech: ${type_event} pour commande ${ref_command}`);

    // Décoder custom_field depuis Base64
    let customData = {};
    try {
      if (custom_field) {
        const decodedCustomField = Buffer.from(custom_field, 'base64').toString('utf-8');
        customData = JSON.parse(decodedCustomField);
        console.log("📦 Données personnalisées:", customData);
      }
    } catch (e) {
      console.log("⚠️ Custom field non-JSON:", custom_field);
    }

    // Traitement selon le type d'événement
    if (type_event === 'sale_complete') {
      console.log(`💰 Paiement réussi pour ${ref_command}`);
      console.log(`Prix initial: ${item_price}, Prix final: ${final_item_price}`);

      if (promo_enabled) {
        console.log(`🎉 Promotion appliquée: ${promo_value_percent}%`);
      }

      // Mettre à jour le statut de la commande
      await updateOrderStatus(ref_command, 'paid', {
        finalPrice: final_item_price,
        promoApplied: promo_enabled,
        customData: customData
      });

      // Envoyer les emails de notification
      if (customData.email || customData.customer?.email) {
        const emailData = {
          orderRef: ref_command,
          customerName: customData.customer?.name || client_name || "Client",
          customerEmail: customData.customer?.email || customData.email,
          customerPhone: customData.customer?.phone || client_phone || "",
          amount: final_item_price || item_price,
          paymentMethod: payment_method || "PayTech",
          items: customData.items || []
        };

        // Envoyer email client
        await sendCustomerConfirmationEmail(emailData);
        
        // Envoyer email admin
        await sendAdminNotificationEmail(emailData);
      }

    } else if (type_event === 'sale_canceled') {
      console.log(`❌ Paiement annulé pour ${ref_command}`);
      await updateOrderStatus(ref_command, 'canceled');
      
    } else if (type_event === 'sale_pending') {
      console.log(`⏳ Paiement en attente pour ${ref_command}`);
      await updateOrderStatus(ref_command, 'pending');
    }

    // Répondre OK à PayTech
    return "OK";

  } catch (error) {
    console.error("❌ Erreur IPN PayTech:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});

/**
 * Vérifier l'authenticité de la notification PayTech
 * Selon la documentation: https://docs.intech.sn/doc_paytech.php
 */
function verifyPaytechIPN(body: any): boolean {
  try {
    const myApiKey = process.env.PAYTECH_API_KEY;
    const myApiSecret = process.env.PAYTECH_SECRET_KEY;

    if (!myApiKey || !myApiSecret) {
      console.error("❌ Clés PayTech manquantes dans l'environnement");
      return false;
    }

    // En mode sandbox/développement, accepter tous les webhooks
    if (process.env.PAYTECH_SANDBOX === "true" || process.env.NODE_ENV === "development") {
      console.log("🧪 Mode test/sandbox - vérification IPN contournée");
      return true;
    }

    const { hmac_compute, api_key_sha256, api_secret_sha256, final_item_price, ref_command } = body;

    // Méthode 1: Vérification HMAC (Recommandée par PayTech)
    if (hmac_compute) {
      const message = `${final_item_price || body.item_price}|${ref_command}|${myApiKey}`;
      const expectedHmac = crypto.createHmac('sha256', myApiSecret)
                                .update(message)
                                .digest('hex');

      if (expectedHmac === hmac_compute) {
        console.log('✅ Notification authentifiée via HMAC');
        return true;
      } else {
        console.log('❌ HMAC invalide');
        return false;
      }
    }

    // Méthode 2: Vérification SHA256 (Alternative)
    if (api_key_sha256 && api_secret_sha256) {
      const expectedApiKey = crypto.createHash('sha256')
          .update(myApiKey)
          .digest('hex');
      const expectedApiSecret = crypto.createHash('sha256')
          .update(myApiSecret)
          .digest('hex');

      if (expectedApiKey === api_key_sha256 && expectedApiSecret === api_secret_sha256) {
        console.log('✅ Notification authentifiée via SHA256');
        return true;
      } else {
        console.log('❌ Clés SHA256 invalides');
        return false;
      }
    }

    console.log('❌ Aucune méthode d\'authentification trouvée');
    return false;

  } catch (error) {
    console.error('❌ Erreur vérification IPN:', error);
    return false;
  }
}

/**
 * Mettre à jour le statut de la commande
 */
async function updateOrderStatus(orderRef: string, status: string, additionalData?: any) {
  try {
    // Ici vous pouvez mettre à jour votre base de données
    // Par exemple, Airtable, MySQL, etc.
    console.log(`📝 Mise à jour commande ${orderRef} -> ${status}`, additionalData);
    
    // Exemple de mise à jour Airtable
    // await updateOrderInAirtable(orderRef, status, additionalData);
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour commande ${orderRef}:`, error);
  }
}
