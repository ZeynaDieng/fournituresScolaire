// server/api/paytech-mock/initiate.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log("Mock PayTech Request:", body);

  // Simulation de validation PayTech
  if (!body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Mock PayTech: Montant invalide",
    });
  }

  if (!body.customer?.name || !body.customer?.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Mock PayTech: Informations client manquantes",
    });
  }

  // Génération d'un token fictif
  const mockToken = `mock_token_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 8)}`;
  const ref =
    body.ref_command ||
    `CMD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // URLs de redirection mock
  const mockRedirectUrl = `http://localhost:3000/mock-paytech-gateway?token=${mockToken}&ref=${ref}&amount=${body.amount}`;

  // Réponse mock identique à PayTech
  const mockResponse = {
    success: 1,
    token: mockToken,
    redirect_url: mockRedirectUrl,
    redirectUrl: mockRedirectUrl,
    message: "Mock PayTech: Demande de paiement créée avec succès",
  };

  console.log("Mock PayTech Response:", mockResponse);

  return {
    success: true,
    token: mockToken,
    redirect_url: mockRedirectUrl,
    ref_command: ref,
    amount: body.amount,
    payment_method: body.target_payment || "Mock",
    data: mockResponse,
  };
});
