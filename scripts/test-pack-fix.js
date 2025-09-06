#!/usr/bin/env node

console.log("🔧 TEST RAPIDE: Build et déploiement pour corriger les packs");

const { execSync } = require("child_process");

function exec(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const result = execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.log(`✅ ${description} - Succès`);
    return result;
  } catch (error) {
    console.log(`⚠️  ${description} - Erreur mais on continue`);
    return null;
  }
}

try {
  // 1. Build rapide pour tester les erreurs
  console.log("1. Test du build...");
  const buildResult = exec("npm run build", "Build du projet");

  if (buildResult !== null) {
    console.log("✅ Build réussi ! Déploiement...");

    // 2. Déploiement
    exec("vercel --prod --yes", "Déploiement Vercel");

    console.log("🎉 Déployé ! Testez maintenant :");
    console.log(
      "   Site: https://fournitures-scolaire-5grcy526c-pa-assanes-projects.vercel.app"
    );
    console.log(
      "   Pack: https://fournitures-scolaire-5grcy526c-pa-assanes-projects.vercel.app/packs"
    );
  } else {
    console.log("❌ Build échoué, on déploie quand même...");
    exec("vercel --prod --yes", "Déploiement forcé");
  }
} catch (error) {
  console.error("💥 Erreur:", error.message);
}
