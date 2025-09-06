#!/usr/bin/env node

/**
 * 🔍 Vérification des URLs dans le fichier .env
 * S'assure que toutes les URLs pointent vers la production Vercel
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 VÉRIFICATION DES URLs - FICHIER .ENV");
console.log("=".repeat(50));

const envPath = path.join(__dirname, "../.env");

if (!fs.existsSync(envPath)) {
  console.log("❌ Fichier .env non trouvé !");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");

const CORRECT_PRODUCTION_URL = "https://fournitures-scolaire.vercel.app";

console.log(`🎯 URL de production attendue: ${CORRECT_PRODUCTION_URL}\n`);

// Variables d'URL à vérifier
const urlVariables = [
  "BASE_URL",
  "NUXT_PUBLIC_SITE_URL",
  "NUXT_PUBLIC_BASE_URL",
];

let hasErrors = false;
let foundVariables = {};

// Analyser chaque ligne
lines.forEach((line, index) => {
  const trimmedLine = line.trim();

  // Ignorer les commentaires et lignes vides
  if (!trimmedLine || trimmedLine.startsWith("#")) return;

  // Vérifier si c'est une variable d'URL
  urlVariables.forEach((varName) => {
    if (trimmedLine.startsWith(`${varName}=`)) {
      const value = trimmedLine.split("=")[1];
      foundVariables[varName] = value;

      console.log(`📍 ${varName}: ${value}`);

      if (value === CORRECT_PRODUCTION_URL) {
        console.log("   ✅ Correct (URL de production)");
      } else if (value && value.includes("localhost")) {
        console.log("   ❌ ERREUR: URL localhost détectée !");
        console.log(`   🔧 Doit être: ${CORRECT_PRODUCTION_URL}`);
        hasErrors = true;
      } else if (value && value.includes("vercel.app")) {
        if (value !== CORRECT_PRODUCTION_URL) {
          console.log("   ⚠️  URL Vercel différente détectée");
          console.log(`   💡 Vérifiez que c'est la bonne: ${value}`);
        } else {
          console.log("   ✅ Correct (URL de production)");
        }
      } else if (!value || value.trim() === "") {
        console.log("   ❌ ERREUR: Variable vide !");
        hasErrors = true;
      } else {
        console.log("   ⚠️  URL non reconnue");
      }
      console.log();
    }
  });
});

// Vérifier les variables manquantes
const missingVariables = urlVariables.filter(
  (varName) => !foundVariables[varName]
);

if (missingVariables.length > 0) {
  console.log("❌ VARIABLES MANQUANTES:");
  missingVariables.forEach((varName) => {
    console.log(`   - ${varName}=${CORRECT_PRODUCTION_URL}`);
    hasErrors = true;
  });
  console.log();
}

// Résumé final
console.log("=".repeat(50));
console.log("📊 RÉSUMÉ DE LA VÉRIFICATION");
console.log("=".repeat(50));

if (!hasErrors && missingVariables.length === 0) {
  console.log("✅ PARFAIT ! Toutes les URLs sont correctes !");
  console.log("\n🎯 PROCHAINES ÉTAPES:");
  console.log("1. 🌐 Configurer ces variables dans Vercel Dashboard");
  console.log("2. 🚀 Redéployer l'application");
  console.log("3. ✅ Tester le site en production");

  console.log("\n🔧 VARIABLES VERCEL À CONFIGURER:");
  Object.keys(foundVariables).forEach((varName) => {
    console.log(`   ${varName}=${foundVariables[varName]}`);
  });
} else {
  console.log("❌ CORRECTIONS NÉCESSAIRES:");

  if (hasErrors) {
    console.log("\n🔧 URLs à corriger dans .env:");
    Object.keys(foundVariables).forEach((varName) => {
      const value = foundVariables[varName];
      if (value.includes("localhost") || !value.trim()) {
        console.log(`   ${varName}=${CORRECT_PRODUCTION_URL}`);
      }
    });
  }

  if (missingVariables.length > 0) {
    console.log("\n➕ Variables à ajouter dans .env:");
    missingVariables.forEach((varName) => {
      console.log(`   ${varName}=${CORRECT_PRODUCTION_URL}`);
    });
  }
}

console.log("\n💡 URL DE PRODUCTION CONFIRMÉE:");
console.log(`   ${CORRECT_PRODUCTION_URL}`);
console.log("\n📅 Vérification effectuée:", new Date().toLocaleString());
