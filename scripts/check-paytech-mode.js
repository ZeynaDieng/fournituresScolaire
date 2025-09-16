#!/usr/bin/env node

// Script pour vérifier le mode PayTech (test/production)

console.log("🔍 Vérification du mode PayTech...\n");

// 1. Variables d'environnement
console.log("📋 Variables d'environnement :");
console.log(
  `   NODE_ENV: ${
    process.env.NODE_ENV || "❌ Non défini (par défaut: development)"
  }`
);
console.log(
  `   PAYTECH_SANDBOX: ${process.env.PAYTECH_SANDBOX || "❌ Non défini"}`
);
console.log(
  `   PAYTECH_API_KEY: ${
    process.env.PAYTECH_API_KEY ? "✅ Défini" : "❌ Non défini"
  }`
);
console.log(
  `   PAYTECH_SECRET_KEY: ${
    process.env.PAYTECH_SECRET_KEY ? "✅ Défini" : "❌ Non défini"
  }`
);

// 2. Configuration Nuxt calculée
console.log("\n⚙️  Configuration PayTech calculée :");
const isSandbox =
  process.env.PAYTECH_SANDBOX === "true" ||
  process.env.NODE_ENV !== "production";
console.log(
  `   Mode Sandbox: ${
    isSandbox ? "✅ ACTIVÉ (Mode Test)" : "🚀 DÉSACTIVÉ (Mode Production)"
  }`
);

// 3. Détermination du mode
console.log("\n🎯 Résultat final :");
if (isSandbox) {
  console.log("   🧪 PAYTECH EN MODE TEST/SANDBOX");
  console.log("   ➡️  Les transactions sont simulées");
  console.log("   ➡️  Aucun argent réel ne sera débité");
  console.log("   ➡️  Utilisez les cartes de test PayTech");
} else {
  console.log("   🚀 PAYTECH EN MODE PRODUCTION");
  console.log("   ⚠️  Les transactions sont réelles");
  console.log("   ⚠️  L'argent sera effectivement débité");
  console.log("   ⚠️  Utilisez uniquement de vraies cartes");
}

// 4. URL d'environnement PayTech
console.log("\n🌐 URLs PayTech utilisées :");
const baseUrl = isSandbox
  ? "https://paytech.sn/api/payment/request-payment"
  : "https://paytech.sn/api/payment/request-payment";
console.log(`   API PayTech: ${baseUrl}`);
console.log(`   Mode: ${isSandbox ? "test" : "prod"}`);

// 5. Recommandations
console.log("\n💡 Recommandations :");
if (isSandbox) {
  console.log("   ✅ Parfait pour les tests et le développement");
  console.log("   ✅ Vous pouvez tester sans risque");
  console.log("   📝 Pour passer en production, définissez:");
  console.log("      - NODE_ENV=production");
  console.log("      - PAYTECH_SANDBOX=false (ou supprimez la variable)");
} else {
  console.log("   ⚠️  Mode production actif");
  console.log("   ⚠️  Vérifiez que vos clés API sont correctes");
  console.log("   ⚠️  Testez d'abord en mode sandbox si nécessaire");
}

console.log("\n✨ Vérification terminée !");
