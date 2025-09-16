#!/usr/bin/env node

/**
 * Script pour corriger l'URL PayTech IPN
 * Ce script aide à identifier et corriger le problème d'URL PayTech
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Correction de l'URL PayTech IPN");
console.log("=====================================\n");

// URLs actuelles vs correctes
const CURRENT_URL = "https://fournitures-scolaire.vercel.app";
const CORRECT_URL = "https://www.e-du.shop";

console.log("📋 Configuration actuelle vs correcte :");
console.log(`❌ URL actuelle (incorrecte) : ${CURRENT_URL}`);
console.log(`✅ URL correcte : ${CORRECT_URL}\n`);

// Vérifier les fichiers de configuration
console.log("🔍 Vérification des fichiers de configuration...\n");

// 1. Vérifier env.example
const envExamplePath = path.join(__dirname, "..", "env.example");
if (fs.existsSync(envExamplePath)) {
  const envContent = fs.readFileSync(envExamplePath, "utf8");
  if (envContent.includes(CURRENT_URL)) {
    console.log("⚠️  env.example contient l'ancienne URL");
  } else {
    console.log("✅ env.example ne contient pas l'ancienne URL");
  }
}

// 2. Vérifier les fichiers de configuration
const configFiles = ["nuxt.config.ts", "vercel.json", "package.json"];

configFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    if (content.includes(CURRENT_URL)) {
      console.log(`⚠️  ${file} contient l'ancienne URL`);
    } else {
      console.log(`✅ ${file} ne contient pas l'ancienne URL`);
    }
  }
});

console.log("\n📋 Actions à effectuer :");
console.log("========================\n");

console.log("1. 🔧 Configuration Vercel :");
console.log("   - Connectez-vous à https://vercel.com");
console.log("   - Allez dans votre projet > Settings > Environment Variables");
console.log(
  "   - Ajoutez/modifiez : NUXT_PUBLIC_BASE_URL = https://www.e-du.shop"
);
console.log("   - Redéployez le projet\n");

console.log("2. 🔧 Configuration PayTech Dashboard :");
console.log("   - Connectez-vous à https://paytech.sn");
console.log("   - Allez dans Paramètres > Configuration");
console.log(
  "   - Modifiez l'URL IPN vers : https://www.e-du.shop/api/paytech/webhook-simple"
);
console.log("   - Sauvegardez la configuration\n");

console.log("3. 🧪 Test du webhook :");
console.log(
  '   curl -X POST "https://www.e-du.shop/api/paytech/webhook-simple" \\'
);
console.log('     -H "Content-Type: application/json" \\');
console.log(
  '     -d \'{"ref_command": "TEST_CMD_123", "amount": 100, "payment_method": "card", "client_phone": "+221777780456", "status": "sale_complete"}\'\n'
);

console.log("4. 🧪 Test d'un paiement :");
console.log("   - Allez sur https://www.e-du.shop");
console.log("   - Effectuez un paiement test");
console.log("   - Vérifiez que la notification arrive\n");

console.log("✅ Résultat attendu :");
console.log("====================");
console.log(
  "- ✅ URL IPN correcte : https://www.e-du.shop/api/paytech/webhook-simple"
);
console.log("- ✅ Notifications PayTech reçues automatiquement");
console.log("- ✅ Statut des commandes mis à jour dans Airtable");
console.log("- ✅ Factures envoyées par email et WhatsApp");
console.log("- ✅ Système entièrement fonctionnel\n");

console.log("🚨 Important :");
console.log("==============");
console.log(
  "Le webhook fonctionne parfaitement ! Le seul problème est l'URL incorrecte."
);
console.log(
  "Une fois corrigée, vous recevrez automatiquement toutes les notifications PayTech.\n"
);

console.log("🎯 Prochaine étape :");
console.log("===================");
console.log(
  "Configurer NUXT_PUBLIC_BASE_URL = https://www.e-du.shop dans Vercel ! 🚀"
);

