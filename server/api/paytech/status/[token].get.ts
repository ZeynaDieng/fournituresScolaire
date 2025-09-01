// server/api/paytech/status/[token].get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getRouterParam(event, "token");

  try {
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: "Token de paiement requis",
      });
    }

    // Appel à l'API Paytech pour récupérer le statut
    const response = await fetch(
      `https://paytech.sn/api/payment/get-status?token_payment=${token}`,
      {
        method: "GET",
        headers: {
          API_KEY: config.paytech.apiKey,
          API_SECRET: config.paytech.secretKey,
        },
      }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: "Erreur lors de la récupération du statut",
      });
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
      status: result.status || "unknown",
      payment_method: result.payment_method || null,
      amount: result.item_price || null,
      ref_command: result.ref_command || null,
    };
  } catch (error: any) {
    console.error("Erreur statut Paytech:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur interne du serveur",
    });
  }
});
