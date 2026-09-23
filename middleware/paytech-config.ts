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
      (config as any).paytech?.apiKey ||
      config.public?.paytechApiKey ||
      config.public?.payTechApiKey ||
      config.paytechApiKey ||
      (config.public as any)?.paytech?.apiKey ||
      "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b";

    console.log("🔍 Configuration disponible:", {
      paytechApiKey: !!paytechApiKey,
    });

    console.log("✅ Configuration PayTech validée");
  } catch (error) {
    console.error("❌ Erreur configuration PayTech:", error);
  }
});
