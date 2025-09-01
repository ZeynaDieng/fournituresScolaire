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
    const paytechApiKey =
      config.public?.paytechApiKey || config.public?.payTechApiKey;

    if (!paytechApiKey) {
      console.error("❌ Configuration PayTech manquante en production !");
      return navigateTo("/");
    }

    console.log("✅ Configuration PayTech validée");
  } catch (error) {
    console.error("❌ Erreur configuration PayTech:", error);
    return navigateTo("/");
  }
});
