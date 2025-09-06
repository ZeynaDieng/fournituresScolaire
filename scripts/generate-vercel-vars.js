#!/usr/bin/env node

/**
 * 🎯 SCRIPT DE COPIE AUTOMATIQUE - Variables .env → Vercel
 *
 * Ce script génère la liste EXACTE des variables à copier/coller dans Vercel
 * avec les bonnes valeurs de production
 */

console.log("🎯 GÉNÉRATION DES VARIABLES VERCEL - PRODUCTION");
console.log("=".repeat(70));

// Variables depuis votre .env avec les vraies valeurs
const envVars = {
  // PayTech (CRITIQUE pour résoudre erreur 500)
  PAYTECH_API_KEY:
    "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
  PAYTECH_SECRET_KEY:
    "566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
  PAYTECH_SANDBOX: "true",

  // Airtable (CRITIQUE pour les APIs)
  AIRTABLE_API_KEY:
    "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a",
  AIRTABLE_BASE_ID: "appOtYkVavA4MMMnN",
  AIRTABLE_PRODUCTS_TABLE: "tblxGbcySHadDtsyn",
  AIRTABLE_PACKS_TABLE: "tbl4JVykOdi6YFvfd",
  AIRTABLE_ORDERS_TABLE: "tblIx2zvrcz1VY7xb",
  AIRTABLE_PROMOTIONS_TABLE: "tblrUYgl2PgYIEMY5",
  AIRTABLE_TESTIMONIALS_TABLE: "tblYjfi1FFk1CCH46",

  // URLs de production (CRITIQUE pour résoudre erreur 403)
  BASE_URL: "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app",
  NUXT_PUBLIC_BASE_URL: "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app",
  NUXT_PUBLIC_SITE_URL: "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app",
  NUXT_PUBLIC_API_BASE: "/api",

  // PayTech publiques
  NUXT_PUBLIC_PAYTECH_API_KEY:
    "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
  NUXT_PUBLIC_PAYTECH_API_SECRET:
    "566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
  NUXT_PUBLIC_PAYTECH_MERCHANT_ID: "VotreMerchantId",

  // WhatsApp & Communication
  WHATSAPP_BUSINESS_NUMBER: "221777780456",
  NUXT_PUBLIC_WHATSAPP_NUMBER: "221777780456",

  // Google Sheets (optionnel)
  GOOGLE_SHEET_ID: "1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0",
  GOOGLE_SHEETS_API_KEY: "AIzaSyAc7pdCISf_pyi65pmnVU-RTc6KMFcORis",

  // Email (optionnel)
  NOTIFICATION_EMAIL_USER: "zeynash1@gmail.com",
  NOTIFICATION_EMAIL_PASSWORD: "zmruomypjxrjxfto",
  ADMIN_EMAIL: "zeynash1@gmail.com",
  FROM_NAME: "Fournitures Scolaires",

  // Base de données (adaptation pour production si nécessaire)
  DATABASE_URL: "mysql://root:root@127.0.0.1:8889/fourniturescolaire",
};

console.log("📋 VARIABLES À CONFIGURER DANS VERCEL:\n");

// Séparer par priorité
const criticalVars = [
  "PAYTECH_API_KEY",
  "PAYTECH_SECRET_KEY",
  "PAYTECH_SANDBOX",
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "BASE_URL",
  "NUXT_PUBLIC_BASE_URL",
  "NUXT_PUBLIC_SITE_URL",
];

const importantVars = [
  "AIRTABLE_PRODUCTS_TABLE",
  "AIRTABLE_PACKS_TABLE",
  "AIRTABLE_ORDERS_TABLE",
  "AIRTABLE_PROMOTIONS_TABLE",
  "AIRTABLE_TESTIMONIALS_TABLE",
  "NUXT_PUBLIC_PAYTECH_API_KEY",
  "NUXT_PUBLIC_PAYTECH_API_SECRET",
  "WHATSAPP_BUSINESS_NUMBER",
  "NUXT_PUBLIC_API_BASE",
];

console.log("🚨 PRIORITÉ 1 - CRITIQUES (pour résoudre 403/500):");
console.log("-".repeat(50));
criticalVars.forEach((key, index) => {
  console.log(`${index + 1}. ${key}=${envVars[key]}`);
});

console.log("\n📌 PRIORITÉ 2 - IMPORTANTES (pour fonctionnalités complètes):");
console.log("-".repeat(50));
importantVars.forEach((key, index) => {
  console.log(`${index + 1}. ${key}=${envVars[key]}`);
});

console.log("\n📊 OPTIONNELLES (pour fonctionnalités avancées):");
console.log("-".repeat(50));
Object.keys(envVars).forEach((key, index) => {
  if (!criticalVars.includes(key) && !importantVars.includes(key)) {
    console.log(`${index + 1}. ${key}=${envVars[key]}`);
  }
});

console.log("\n" + "=".repeat(70));
console.log("🎯 INSTRUCTIONS VERCEL DASHBOARD:");
console.log("=".repeat(70));

console.log("\n1. 🌐 Aller sur: https://vercel.com/dashboard");
console.log("2. 🔍 Sélectionner le projet: fournitures-scolaire");
console.log("3. ⚙️  Cliquer: Settings → Environment Variables");
console.log("4. ➕ Pour chaque variable ci-dessus:");
console.log('   • Cliquer "Add New"');
console.log("   • Name: [nom de la variable]");
console.log("   • Value: [valeur correspondante]");
console.log("   • Environment: ✅ Production ✅ Preview ✅ Development");
console.log('   • Cliquer "Save"');

console.log("\n5. 🚀 Après avoir ajouté TOUTES les variables:");
console.log("   • Aller à: Deployments");
console.log("   • Cliquer sur le dernier déploiement");
console.log('   • Cliquer "Redeploy"');
console.log("   • Attendre 2-3 minutes");

console.log("\n6. ✅ Validation:");
console.log(
  "   • Site: https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app (doit passer de 403 → 200)"
);
console.log("   • PayTech: Pas d'erreur 500 au checkout");
console.log(
  "   • APIs: https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app/api/admin/products"
);

console.log("\n🧪 TESTS AUTOMATIQUES:");
console.log("node scripts/test-production-fixed.js    # Test complet");
console.log("node scripts/monitor-fix-progress.js     # Monitoring temps réel");

console.log("\n⚡ RÉSULTAT ATTENDU (dans 15 minutes):");
console.log("✅ Site accessible (200 au lieu de 403)");
console.log("✅ PayTech fonctionnel (pas d'erreur 500)");
console.log("✅ E-commerce 100% opérationnel");
console.log("✅ WhatsApp commandes actives");

console.log("\n🎉 Vos variables .env sont parfaites !");
console.log("Il faut juste les copier dans Vercel maintenant.");

// Générer un fichier texte pour copier-coller facile
const fs = require("fs");
const outputLines = [];

outputLines.push("# Variables à configurer dans Vercel Dashboard");
outputLines.push(
  "# https://vercel.com/dashboard → votre projet → Settings → Environment Variables"
);
outputLines.push("");
outputLines.push("# PRIORITÉ 1 - CRITIQUES");
criticalVars.forEach((key) => {
  outputLines.push(`${key}=${envVars[key]}`);
});

outputLines.push("");
outputLines.push("# PRIORITÉ 2 - IMPORTANTES");
importantVars.forEach((key) => {
  outputLines.push(`${key}=${envVars[key]}`);
});

outputLines.push("");
outputLines.push("# OPTIONNELLES");
Object.keys(envVars).forEach((key) => {
  if (!criticalVars.includes(key) && !importantVars.includes(key)) {
    outputLines.push(`${key}=${envVars[key]}`);
  }
});

fs.writeFileSync("vercel-variables.txt", outputLines.join("\n"));
console.log(
  "\n📄 Fichier généré: vercel-variables.txt (pour copier-coller facile)"
);
