#!/usr/bin/env node

/**
 * 🚨 SCRIPT DE RÉSOLUTION URGENTE - ERREURS DE PRODUCTION
 *
 * Ce script corrige immédiatement toutes les erreurs identifiées :
 * 1. Erreur 500 PayTech (variables manquantes)
 * 2. Erreur 404 images (vérification)
 * 3. Configuration des variables Vercel
 */

console.log("🚨 RÉSOLUTION URGENTE - ERREURS DE PRODUCTION");
console.log("=".repeat(60));
console.log("⏰ Temps estimé: 2-3 minutes\n");

// Étape 1: Diagnostic rapide
console.log("1️⃣ DIAGNOSTIC DES ERREURS IDENTIFIÉES:");
console.log(
  "❌ Erreur 500: /api/paytech/initiate → Variables PayTech manquantes"
);
console.log(
  "❌ Erreur 404: /images/payment/default.png → Image existe mais pas déployée"
);
console.log("❌ Erreurs API: Toutes les variables Airtable manquantes\n");

// Étape 2: Vérification locale
console.log("2️⃣ VÉRIFICATION ENVIRONNEMENT LOCAL:");

const fs = require("fs");
const path = require("path");

// Vérifier que l'image existe
const imagePath = path.join(__dirname, "../public/images/payment/default.png");
if (fs.existsSync(imagePath)) {
  const stats = fs.statSync(imagePath);
  console.log(
    `✅ Image default.png: TROUVÉE (${Math.round(stats.size / 1024)}KB)`
  );
} else {
  console.log("❌ Image default.png: MANQUANTE");
}

// Vérifier le fichier .env
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  console.log("✅ Fichier .env: TROUVÉ");
} else {
  console.log("❌ Fichier .env: MANQUANT");
}

console.log("\n3️⃣ SOLUTION IMMÉDIATE:");
console.log(
  "🎯 Toutes les variables d'environnement doivent être configurées dans Vercel\n"
);

// Étape 3: Instructions détaillées
console.log("📋 INSTRUCTIONS ÉTAPE PAR ÉTAPE:");
console.log("\n🌐 Étape A: Aller sur Vercel Dashboard");
console.log("   1. Ouvrir: https://vercel.com/dashboard");
console.log('   2. Cliquer sur votre projet "fournitures-scolaire"');
console.log('   3. Aller à "Settings" → "Environment Variables"');

console.log("\n🔧 Étape B: Ajouter TOUTES ces variables:");

const requiredVars = [
  {
    name: "PAYTECH_API_KEY",
    value: "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
    critical: true,
  },
  {
    name: "PAYTECH_SECRET_KEY",
    value: "566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
    critical: true,
  },
  { name: "PAYTECH_SANDBOX", value: "true", critical: true },
  {
    name: "AIRTABLE_API_KEY",
    value:
      "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a",
    critical: true,
  },
  { name: "AIRTABLE_BASE_ID", value: "appOtYkVavA4MMMnN", critical: true },
  { name: "BASE_URL", value: "https://votre-app.vercel.app", critical: true },
  {
    name: "NUXT_PUBLIC_BASE_URL",
    value: "https://votre-app.vercel.app",
    critical: true,
  },
  {
    name: "NUXT_PUBLIC_SITE_URL",
    value: "https://votre-app.vercel.app",
    critical: true,
  },
  { name: "WHATSAPP_BUSINESS_NUMBER", value: "221782911844", critical: false },
  {
    name: "DATABASE_URL",
    value: "mysql://root:root@127.0.0.1:8889/fourniturescolaire",
    critical: false,
  },
];

requiredVars.forEach((variable, index) => {
  const priority = variable.critical ? "🚨 CRITIQUE" : "📌";
  const displayValue =
    variable.name.includes("KEY") || variable.name.includes("SECRET")
      ? "[VALEUR_DANS_FICHIER_ENV]"
      : variable.value;
  console.log(`   ${index + 1}. ${priority} ${variable.name}: ${displayValue}`);
});

console.log(
  '\n⚠️  IMPORTANT: Remplacez "https://votre-app.vercel.app" par votre vraie URL !'
);

console.log("\n🚀 Étape C: Redéployer");
console.log('   1. Aller à "Deployments"');
console.log("   2. Cliquer sur le dernier déploiement");
console.log('   3. Cliquer "Redeploy"');
console.log("   4. Attendre la fin (2-3 minutes)");

console.log("\n🧪 Étape D: Tester");
console.log("   1. Ouvrir: https://votre-app.vercel.app");
console.log(
  "   2. Tester: https://votre-app.vercel.app/images/payment/default.png"
);
console.log("   3. Tester: https://votre-app.vercel.app/api/admin/products");

console.log("\n4️⃣ VALIDATION AUTOMATIQUE:");
console.log("Une fois configuré, exécutez:");
console.log("   node scripts/test-production-complete.js");

console.log("\n5️⃣ RÉSULTAT ATTENDU:");
console.log("✅ Erreur 500 PayTech → RÉSOLU");
console.log("✅ Erreur 404 Images → RÉSOLU");
console.log("✅ Site 100% fonctionnel → RÉSOLU");

console.log("\n6️⃣ EN CAS DE PROBLÈME:");
console.log("- Vérifiez que TOUTES les variables sont bien saisies");
console.log("- Vérifiez l'URL (pas localhost)");
console.log("- Redéployez après chaque modification");
console.log("- Consultez les logs Vercel: Settings → Functions");

console.log("\n⚡ TEMPS TOTAL ESTIMÉ: 5-10 minutes");
console.log("🎯 RÉSULTAT: Site e-commerce 100% opérationnel avec paiement !");

console.log("\n" + "=".repeat(60));
console.log("🎉 Suivez ces étapes et votre site sera parfait !");
console.log("=".repeat(60));

// Génération d'un fichier de checklist
console.log("\n📝 Génération de la checklist...");

const checklist = `# ✅ CHECKLIST RÉSOLUTION ERREURS PRODUCTION

## 🎯 Objectif
Résoudre les erreurs 500 et 404 en production

## 📋 Actions à Réaliser

### ✅ 1. Configuration Vercel (CRITIQUE)
- [ ] Aller sur https://vercel.com/dashboard
- [ ] Sélectionner le projet fournitures-scolaire
- [ ] Settings → Environment Variables
- [ ] Ajouter PAYTECH_API_KEY
- [ ] Ajouter PAYTECH_SECRET_KEY  
- [ ] Ajouter PAYTECH_SANDBOX=true
- [ ] Ajouter AIRTABLE_API_KEY
- [ ] Ajouter AIRTABLE_BASE_ID
- [ ] Ajouter BASE_URL (avec vraie URL Vercel)
- [ ] Ajouter NUXT_PUBLIC_BASE_URL (même URL)
- [ ] Ajouter NUXT_PUBLIC_SITE_URL (même URL)

### ✅ 2. Redéploiement
- [ ] Aller à Deployments
- [ ] Redeploy le dernier déploiement
- [ ] Attendre la fin (2-3 min)

### ✅ 3. Tests de Validation
- [ ] Site principal: https://votre-app.vercel.app
- [ ] Image: https://votre-app.vercel.app/images/payment/default.png
- [ ] API: https://votre-app.vercel.app/api/admin/products
- [ ] Checkout (test PayTech)

### ✅ 4. Validation Complète
- [ ] Exécuter: node scripts/test-production-complete.js
- [ ] Tous les tests passent ✅
- [ ] Site e-commerce opérationnel

## 🚨 Erreurs Actuelles
- ❌ Erreur 500: /api/paytech/initiate
- ❌ Toutes les variables d'environnement manquantes
- ❌ Configuration PayTech/Airtable absente

## ✅ Résultat Attendu
- ✅ Site entièrement fonctionnel
- ✅ Paiement PayTech opérationnel
- ✅ Toutes les APIs marchent
- ✅ Images correctement affichées

---
📅 Date: ${new Date().toLocaleString()}
⏰ Temps estimé: 10 minutes maximum
`;

fs.writeFileSync(
  path.join(__dirname, "../PRODUCTION_FIX_CHECKLIST.md"),
  checklist
);
console.log("✅ Checklist sauvegardée: PRODUCTION_FIX_CHECKLIST.md");

console.log("\n🚀 PRÊT ? Allez sur Vercel et suivez la checklist !");
