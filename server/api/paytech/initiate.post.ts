// server/api/paytech/initiate.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  console.log("Body reçu pour PayTech:", body);
  try {
    // Vérification des clés API
    if (!config.paytech.apiKey || !config.paytech.secretKey) {
      throw new Error(
        "Configuration Paytech manquante. Veuillez vérifier vos variables d'environnement."
      );
    }

    // URL de l'API PayTech (sandbox ou production)
    const apiUrl = config.paytech.sandbox
      ? "https://paytech.sn/api/payment/request-payment"
      : "https://paytech.sn/api/payment/request-payment";

    // Construction stricte des champs attendus par PayTech
    const ref = body.ref || body.ref_command || "";
    const customer = body.customer || {};
    const itemName =
      body.item_name || body.items?.[0]?.name || `Commande EduShop #${ref}`;
    const commandName =
      body.command_name ||
      (customer.name ? `Commande ${customer.name}` : "Commande EduShop");
    const itemPrice = String(
      body.amount ?? body.item_price ?? body.items?.[0]?.price ?? ""
    );

    const paytechDataRaw = {
      item_name: itemName,
      item_price: itemPrice,
      currency: body.currency || "XOF",
      ref_command: ref,
      command_name: commandName,
      target_payment: body.target_payment || "Orange Money, Wave, Free Money",
      env: config.paytech.sandbox ? "test" : "prod",
      custom_field: JSON.stringify({
        items: body.items || [],
        customer: customer,
        promoCode: body.promoCode,
        promoDiscount: body.promoDiscount,
        shipping: body.shipping,
      }),
      ipn_url: `${config.public.baseUrl}/api/paytech/webhook`,
      success_url: `${config.public.baseUrl}/payment/success?ref=${ref}`,
      cancel_url: `${config.public.baseUrl}/payment/cancel?ref=${ref}`,
    };

    // Nettoyage des champs vides (TypeScript safe)
    const paytechData: Record<string, string> = {};
    (Object.keys(paytechDataRaw) as Array<keyof typeof paytechDataRaw>).forEach(
      (key) => {
        const value = paytechDataRaw[key];
        if (value !== "" && value !== undefined) {
          paytechData[key] = value as string;
        }
      }
    );

    // DEBUG : Affichage du JSON envoyé à PayTech
    console.log(
      "PayTech Request (envoyée):",
      JSON.stringify(paytechData, null, 2)
    );

    // DEBUG : Affichage du JSON envoyé à PayTech (copie/colle ce log si erreur)
    console.log(
      "PayTech Request (envoyée):",
      JSON.stringify(paytechData, null, 2)
    );

    // Appel à l'API PayTech
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "API-KEY": config.paytech.apiKey,
        "API-SECRET": config.paytech.secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paytechData),
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      throw new Error(
        "Réponse PayTech invalide. Veuillez réessayer plus tard."
      );
    }

    console.log("PayTech Response:", result);

    if (!response.ok || !result.redirect_url) {
      throw new Error(
        `Erreur PayTech: ${
          result.message || "Impossible de générer le lien de paiement."
        }`
      );
    }

    return {
      success: true,
      data: result,
      payment_url: result.redirect_url,
    };
  } catch (error: any) {
    console.error("PayTech Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        error.message ||
        "Erreur inconnue lors de la communication avec PayTech.",
    });
  }
});
