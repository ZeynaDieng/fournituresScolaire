#!/usr/bin/env node

/**
 * 🚨 SCRIPT DE MONITORING FINAL - Surveillance du Fix en Temps Réel
 *
 * Ce script surveille le déploiement après configuration des variables
 * et vous guide étape par étape vers la résolution complète
 */

const https = require("https");

const SITE_URL = "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app";
const CHECK_INTERVAL = 30000; // 30 secondes
const MAX_CHECKS = 20; // 10 minutes maximum

console.log("🚨 MONITORING DE RÉSOLUTION - FOURNITURES SCOLAIRES");
console.log("=".repeat(70));
console.log(`📍 URL surveillée: ${SITE_URL}`);
console.log(`⏱️  Vérification toutes les 30 secondes`);
console.log(`🎯 Objectif: Passer de 403/500 → 200 OK\n`);

let checkCount = 0;
let lastStatus = null;

// Tests de base
const quickTests = [
  { name: "Site Principal", path: "/", critical: true },
  { name: "API Produits", path: "/api/admin/products", critical: true },
  {
    name: "API PayTech",
    path: "/api/paytech/initiate",
    method: "POST",
    critical: true,
  },
];

// Fonction de test simple
function quickCheck(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 5000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          size: Buffer.byteLength(data),
          responseTime: Date.now(),
        });
      });
    });

    req.on("error", () => resolve({ status: "ERROR", size: 0 }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: "TIMEOUT", size: 0 });
    });
  });
}

// Fonction principale de monitoring
async function monitorSite() {
  checkCount++;
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\n🔍 Check #${checkCount} - ${timestamp}`);
  console.log("-".repeat(50));

  try {
    // Test principal
    const result = await quickCheck(SITE_URL);
    const status = result.status;

    // Analyse du statut
    let statusIcon, statusMessage, nextAction;

    switch (status) {
      case 200:
        statusIcon = "🎉";
        statusMessage = "SITE OPÉRATIONNEL !";
        nextAction = "Testez toutes les fonctionnalités";
        break;
      case 403:
        statusIcon = "🔧";
        statusMessage = "Variables d'environnement manquantes";
        nextAction = "Configurez les variables Vercel + Redéployez";
        break;
      case 500:
        statusIcon = "⚙️";
        statusMessage = "Erreur serveur (config en cours)";
        nextAction = "Attendez le redéploiement ou vérifiez les logs";
        break;
      case 404:
        statusIcon = "❌";
        statusMessage = "Déploiement non trouvé";
        nextAction = "Vérifiez l'URL ou redéployez";
        break;
      default:
        statusIcon = "⚠️";
        statusMessage = `Code ${status}`;
        nextAction = "Vérifiez la configuration";
    }

    console.log(`${statusIcon} Statut: ${status} - ${statusMessage}`);
    console.log(`📏 Taille: ${result.size} bytes`);
    console.log(`💡 Action: ${nextAction}`);

    // Évolution par rapport au check précédent
    if (lastStatus !== null && lastStatus !== status) {
      if (status === 200) {
        console.log("🚀 CHANGEMENT: Site maintenant OPÉRATIONNEL !");
        console.log("\n✅ SUCCÈS ! Testez maintenant:");
        console.log(`   🏠 Site: ${SITE_URL}`);
        console.log(`   📦 API: ${SITE_URL}/api/admin/products`);
        console.log(`   🛒 Checkout: ${SITE_URL}/checkout`);
        console.log("\n🧪 Test complet: node scripts/test-production-fixed.js");
        process.exit(0);
      } else if (lastStatus === 403 && status === 500) {
        console.log("⚡ PROGRESSION: Redéploiement détecté (403→500)");
      } else if (lastStatus === 500 && status === 403) {
        console.log(
          "🔄 RÉGRESSION: Retour à 403 (variables pas prises en compte)"
        );
      }
    }

    lastStatus = status;

    // Guide contextuel selon le statut
    if (status === 403) {
      console.log("\n📋 GUIDE ÉTAPE PAR ÉTAPE:");
      console.log("1. 🌐 https://vercel.com/dashboard → votre projet");
      console.log("2. ⚙️  Settings → Environment Variables");
      console.log("3. ➕ Ajouter: PAYTECH_API_KEY, PAYTECH_SECRET_KEY, etc.");
      console.log("4. 🚀 Deployments → Redeploy");
      console.log("5. ⏳ Attendre ~3 minutes");
    }
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
  }

  // Continuer le monitoring
  if (checkCount < MAX_CHECKS) {
    console.log(
      `\n⏳ Prochaine vérification dans 30 secondes... (${
        MAX_CHECKS - checkCount
      } restantes)`
    );
    setTimeout(monitorSite, CHECK_INTERVAL);
  } else {
    console.log("\n⏰ Monitoring terminé après 10 minutes");
    console.log("🔧 Si le problème persiste:");
    console.log("   1. Vérifiez que TOUTES les variables sont configurées");
    console.log("   2. Redéployez manuellement");
    console.log("   3. Consultez les logs Vercel");
  }
}

// Fonction pour tester les variables nécessaires
function showRequiredVars() {
  console.log("🔧 VARIABLES CRITIQUES À CONFIGURER:");
  console.log("-".repeat(50));

  const vars = [
    "PAYTECH_API_KEY",
    "PAYTECH_SECRET_KEY",
    "PAYTECH_SANDBOX",
    "AIRTABLE_API_KEY",
    "AIRTABLE_BASE_ID",
    "BASE_URL",
    "NUXT_PUBLIC_BASE_URL",
    "NUXT_PUBLIC_SITE_URL",
  ];

  vars.forEach((varName, index) => {
    console.log(`${index + 1}. ${varName}`);
  });

  console.log("\n💡 Valeurs disponibles dans le fichier .env local");
  console.log("📋 Guide détaillé: FINAL_SOLUTION_GUIDE.md\n");
}

// Démarrage
console.log("🎯 OBJECTIFS:");
console.log("✅ Passer de 403 → 200 (site opérationnel)");
console.log("✅ APIs fonctionnelles");
console.log("✅ PayTech sans erreur 500");
console.log("✅ E-commerce 100% opérationnel\n");

showRequiredVars();

console.log("🚀 Démarrage du monitoring...");
console.log(
  "Configurez les variables Vercel MAINTENANT pendant que ce script surveille!\n"
);

// Lancer le monitoring
monitorSite();
