#!/usr/bin/env node

/**
 * Script de déploiement pour Vercel
 * Vérifie les prérequis et guide l'utilisateur
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Script de déploiement Vercel pour Fournitures Scolaires\n");

// Vérifier les fichiers requis
const requiredFiles = ["package.json", "nuxt.config.ts", "vercel.json"];

console.log("📋 Vérification des fichiers requis...");
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    process.exit(1);
  }
});

// Vérifier les variables d'environnement
console.log("\n🔧 Variables d'environnement requises:");
const requiredEnvVars = ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"];

const optionalEnvVars = [
  "PAYTECH_API_KEY",
  "PAYTECH_SECRET_KEY",
  "GOOGLE_SHEET_ID",
  "GOOGLE_SHEETS_API_KEY",
  "WHATSAPP_BUSINESS_NUMBER",
];

console.log("\n📌 Variables REQUISES:");
requiredEnvVars.forEach((envVar) => {
  console.log(`   - ${envVar}`);
});

console.log("\n📌 Variables OPTIONNELLES:");
optionalEnvVars.forEach((envVar) => {
  console.log(`   - ${envVar}`);
});

// Instructions de déploiement
console.log("\n🎯 Instructions de déploiement:");
console.log("1. Assurez-vous d'avoir installé Vercel CLI: npm i -g vercel");
console.log("2. Connectez-vous à Vercel: vercel login");
console.log(
  "3. Configurez les variables d'environnement dans le dashboard Vercel"
);
console.log("4. Déployez: vercel --prod");
console.log("\n📖 Pour plus d'informations, consultez le fichier env.example");

// Vérifier si Vercel CLI est installé
try {
  require("child_process").execSync("vercel --version", { stdio: "ignore" });
  console.log("\n✅ Vercel CLI est installé");
} catch (error) {
  console.log(
    "\n⚠️  Vercel CLI n'est pas installé. Installez-le avec: npm i -g vercel"
  );
}

console.log("\n🎉 Prêt pour le déploiement !");
