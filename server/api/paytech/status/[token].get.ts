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

    const apiKey =
      config.paytech?.apiKey ||
      process.env.PAYTECH_API_KEY ||
      process.env.NUXT_PAYTECH_API_KEY ||
      "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b";
    const secretKey =
      config.paytech?.secretKey ||
      process.env.PAYTECH_SECRET_KEY ||
      process.env.NUXT_PAYTECH_SECRET_KEY ||
      "566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee";

    // Appel à l'API Paytech pour récupérer le statut
    const response = await fetch(
      `https://paytech.sn/api/payment/get-status?token_payment=${token}`,
      {
        method: "GET",
        headers: {
          API_KEY: apiKey,
          API_SECRET: secretKey,
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
