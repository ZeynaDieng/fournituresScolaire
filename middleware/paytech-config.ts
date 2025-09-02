// middleware/paytech-config.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip ce middleware en développement pour éviter les erreurs de configuration
  if (process.dev) {
    console.log("🧪 Mode développement - PayTech middleware skippé");
    return;
  }

  // Ne s'applique qu'aux routes liées au paiement en production
  if (!to.path.includes("/payment") && !to.path.includes("/checkout")) {
    return;
  }

  console.log("🔍 Vérification configuration PayTech en production...");

  // En production, vérifier la configuration PayTech
  try {
    const config = useRuntimeConfig();

    // Chercher dans différents formats possibles avec typage sécurisé
    const paytechApiKey =
      config.public?.paytechApiKey ||
      config.public?.payTechApiKey ||
      config.paytechApiKey ||
      (config.public as any)?.paytech?.apiKey;

    console.log("🔍 Configuration disponible:", {
      publicPaytechApiKey: !!config.public?.paytechApiKey,
      publicPayTechApiKey: !!config.public?.payTechApiKey,
      paytechApiKey: !!config.paytechApiKey,
      allPublicKeys: Object.keys(config.public || {}),
    });

    if (!paytechApiKey) {
      console.error("❌ Configuration PayTech manquante en production !");
      console.error("Variables disponibles:", Object.keys(config.public || {}));
      return navigateTo("/");
    }

    console.log("✅ Configuration PayTech validée");
  } catch (error) {
    console.error("❌ Erreur configuration PayTech:", error);
    return navigateTo("/");
  }
});
