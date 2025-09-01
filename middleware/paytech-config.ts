// middleware/paytech-config.ts
export default defineNuxtRouteMiddleware((to) => {
  // Ne s'applique qu'aux routes liées au paiement
  if (!to.path.includes("/payment") && !to.path.includes("/checkout")) {
    return;
  }

  const config = useRuntimeConfig();

  // Vérifier que les clés PayTech sont configurées
  if (!config.paytech.apiKey || !config.paytech.secretKey) {
    console.error("Configuration PayTech manquante !");

    if (process.dev) {
      // En développement, rediriger vers une page d'erreur de configuration
      throw createError({
        statusCode: 500,
        statusMessage:
          "Configuration PayTech manquante. Veuillez configurer PAYTECH_API_KEY et PAYTECH_SECRET_KEY dans votre fichier .env",
      });
    } else {
      // En production, rediriger vers la page d'accueil
      return navigateTo("/");
    }
  }

  // Vérifier que l'URL de base est configurée
  if (
    !config.public.baseUrl ||
    config.public.baseUrl === "http://localhost:3000"
  ) {
    console.warn("BASE_URL non configurée pour la production !");

    if (process.env.NODE_ENV === "production") {
      throw createError({
        statusCode: 500,
        statusMessage:
          "Configuration de production manquante. Veuillez configurer BASE_URL.",
      });
    }
  }
});
