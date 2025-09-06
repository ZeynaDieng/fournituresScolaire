// server/api/paytech/initiate.post.ts
import { addOrderToAirtable } from "../../../utils/airtable-orders";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  console.log("PayTech Request Body:", body);

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

    // Préparation des données Paytech
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
      ipn_url: `${config.public.baseUrl}/api/paytech/webhook`,
      success_url: `${config.public.baseUrl}/payment/success?ref=${ref}`,
      cancel_url: `${config.public.baseUrl}/payment/cancel?ref=${ref}`,
      refund_notif_url: `${config.public.baseUrl}/api/paytech/refund-webhook`,
    };

    // 📊 Enregistrer directement dans Airtable (plus de Prisma)
    try {
      // Préparer les données pour Airtable
      let parsedItems = [];
      let shippingAddress = "";
      try {
        const customData = JSON.parse(paytechData.custom_field || "{}");
        parsedItems = customData.items || [];
        shippingAddress = customData.shipping?.address || "";
      } catch (e) {
        console.warn("Erreur parsing custom_field pour Airtable:", e);
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
          city: "",
          method: "Standard",
          cost: 0,
        },
        items:
          parsedItems.length > 0
            ? parsedItems
            : [{ name: itemName, quantity: 1, price: itemPrice }],
        amounts: {
          total: itemPrice,
          subtotal: itemPrice,
          shipping: 0,
          discount: 0,
        },
        status: "Pending",
      };

      await addOrderToAirtable(airtableOrderData);
      console.log("✅ Commande PayTech enregistrée dans Airtable:", ref);
    } catch (airtableError) {
      console.warn(
        "⚠️ Erreur Airtable lors de l'initiation PayTech:",
        airtableError instanceof Error ? airtableError.message : airtableError
      );
      // Ne pas arrêter le processus, continuer avec PayTech même si Airtable échoue
    }

    // URL de l'API PayTech
    const apiUrl = "https://paytech.sn/api/payment/request-payment";

    console.log("PayTech Request Data:", JSON.stringify(paytechData, null, 2));

    // Appel à l'API PayTech avec les bons headers
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        API_KEY: config.paytech.apiKey,
        API_SECRET: config.paytech.secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paytechData),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      throw createError({
        statusCode: 502,
        statusMessage:
          "Réponse PayTech invalide. Veuillez réessayer plus tard.",
      });
    }

    console.log("PayTech Response:", result);

    if (!response.ok || result.success !== 1) {
      throw createError({
        statusCode: 400,
        statusMessage: `Erreur PayTech: ${
          result.message || "Impossible de générer le lien de paiement."
        }`,
      });
    }

    // Ajouter les paramètres d'auto-remplissage si méthode unique
    let finalRedirectUrl = result.redirect_url || result.redirectUrl;

    if (
      body.target_payment &&
      !body.target_payment.includes(",") &&
      body.target_payment.trim() !== ""
    ) {
      // Formatage du numéro de téléphone
      const phoneNumber = customer.phone.startsWith("+")
        ? customer.phone
        : `+221${customer.phone}`;
      const nationalNumber = phoneNumber.replace("+221", "");

      const autoFillParams = new URLSearchParams({
        pn: phoneNumber,
        nn: nationalNumber,
        fn: customer.name,
        tp: body.target_payment,
        nac: body.target_payment === "Carte Bancaire" ? "0" : "1",
      });

      finalRedirectUrl += "?" + autoFillParams.toString();
    }

    return {
      success: true,
      token: result.token,
      redirect_url: finalRedirectUrl,
      ref_command: ref,
      amount: itemPrice,
      payment_method: body.target_payment || "Multiple",
      data: result,
    };
  } catch (error: any) {
    console.error("PayTech Integration Error:", error);

    // Erreur déjà formatée par createError
    if (error.statusCode) {
      throw error;
    }

    // Erreur générique
    throw createError({
      statusCode: 500,
      statusMessage:
        error.message ||
        "Erreur inconnue lors de la communication avec PayTech.",
    });
  }
});
