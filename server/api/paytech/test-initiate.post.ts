// server/api/paytech/test-initiate.post.ts (version avec ngrok)

import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { addOrderToAirtable } from "../../../utils/airtable-orders";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  console.log("PayTech Test Request Body:", body);

  try {
    // Vérification des clés API
    if (!config.paytech.apiKey || !config.paytech.secretKey) {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Configuration Paytech manquante. Veuillez vérifier vos variables d'environnement.",
      });
    }

    // Validation des données requises
    if (!body.amount || body.amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Le montant est requis et doit être supérieur à 0",
      });
    }

    if (
      !body.customer?.name ||
      !body.customer?.email ||
      !body.customer?.phone
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Les informations du client (nom, email, téléphone) sont requises",
      });
    }

    // Génération d'une référence unique si non fournie
    const ref =
      body.ref_command ||
      `CMD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const customer = body.customer;

    // Construction des données selon la documentation Paytech
    const itemName = body.item_name || `Commande EduShop #${ref}`;
    const commandName = `Commande ${customer.name} - EduShop`;
    const itemPrice = parseInt(body.amount.toString());

    // URL ngrok pour les tests HTTPS
    const ngrokBaseUrl = "https://af232a290731.ngrok-free.app";

    // Préparation des données Paytech avec URLs HTTPS
    const paytechData = {
      item_name: itemName,
      item_price: itemPrice,
      currency: body.currency || "XOF",
      ref_command: ref,
      command_name: commandName,
      target_payment: body.target_payment || "",
      env: config.paytech.sandbox ? "test" : "prod",
      custom_field: JSON.stringify({
        order_id: ref,
        customer_id: customer.id || null,
        items: body.items || [],
        customer: customer,
        shipping: body.shipping || {},
        promo_code: body.promoCode || null,
        promo_discount: body.promoDiscount || 0,
      }),
      ipn_url: `${ngrokBaseUrl}/api/paytech/webhook`,
      success_url: `${ngrokBaseUrl}/payment/success?ref=${ref}`,
      cancel_url: `${ngrokBaseUrl}/payment/cancel?ref=${ref}`,
      refund_notif_url: `${ngrokBaseUrl}/api/paytech/refund-webhook`,
    };

    console.log(
      "PayTech Test Request Data:",
      JSON.stringify(paytechData, null, 2)
    );

    // 📊 Enregistrer dans Airtable au moment de l'initiation PayTech
    try {
      // Préparer les données pour Airtable
      let parsedItems = [];
      let shippingAddress = "";
      try {
        const customData = JSON.parse(paytechData.custom_field || "{}");
        parsedItems = customData.items || [];
        shippingAddress = customData.shipping?.address || "";
      } catch (parseError) {
        console.warn("Erreur parsing custom_field pour Airtable:", parseError);
      }

      const airtableOrderData = {
        ref: ref,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        shipping: {
          address: shippingAddress,
          city: body.shipping?.city || "",
          method: "PayTech",
          cost: 0,
        },
        items: parsedItems.map((item) => ({
          name: item.name || "Article",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        amounts: {
          subtotal: itemPrice,
          shipping: 0,
          discount: 0,
          total: itemPrice,
        },
        status: "Pending", // Statut initial pour PayTech
      };

      await addOrderToAirtable(airtableOrderData);
      console.log("✅ Commande PayTech enregistrée dans Airtable:", ref);
    } catch (airtableError) {
      console.warn(
        "⚠️ Erreur Airtable pour PayTech (commande continue):",
        airtableError instanceof Error ? airtableError.message : airtableError
      );
    }

    // Construction de la signature MD5 selon la documentation Paytech
    const dataToSign = `${paytechData.item_name};${paytechData.item_price};${paytechData.currency};${paytechData.ref_command}`;
    const signature = crypto
      .createHash("md5")
      .update(`${dataToSign};${config.paytech.secretKey}`)
      .digest("hex");

    // Préparation des headers pour l'API Paytech
    const headers = {
      API_KEY: config.paytech.apiKey,
      API_SECRET: config.paytech.secretKey,
      "Content-Type": "application/json",
    };

    // Appel à l'API Paytech
    const paytechResponse = await fetch(
      "https://paytech.sn/api/payment/request-payment",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          ...paytechData,
          signature: signature,
        }),
      }
    );

    const responseData = await paytechResponse.json();
    console.log("PayTech Test Response:", responseData);

    if (!paytechResponse.ok || responseData.success === -1) {
      const errorMessage = responseData.message || "Erreur PayTech inconnue";
      throw createError({
        statusCode: 400,
        statusMessage: `Erreur PayTech: ${errorMessage}`,
      });
    }

    // Succès - retour des données de paiement
    return {
      success: true,
      payment_url: responseData.redirect_url,
      reference: ref,
      token: responseData.token,
      airtable_saved: true,
      message:
        "Paiement PayTech initié avec succès et sauvegardé dans Airtable",
    };
  } catch (error) {
    console.error("PayTech Test Integration Error:", error);
    throw error;
  }
});
