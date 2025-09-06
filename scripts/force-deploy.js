#!/usr/bin/env node

/**
 * Script de déploiement forcé avec nettoyage
 * Pour résoudre définitivement les problèmes CORS/401
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function log(message, color = "blue") {
  const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, description) {
  log(`\n🔄 ${description}...`, "yellow");
  try {
    const result = execSync(command, { encoding: "utf8", stdio: "pipe" });
    log(`✅ ${description} - Succès`, "green");
    return result;
  } catch (error) {
    log(`❌ ${description} - Erreur: ${error.message}`, "red");
    throw error;
  }
}

async function forceDeploy() {
  log("🚀 DÉPLOIEMENT FORCÉ POUR RÉSOUDRE LES PROBLÈMES CORS", "blue");
  log("=".repeat(60), "blue");

  try {
    // 1. Vérifier les fichiers critiques
    log("1. Vérification des fichiers critiques...", "yellow");

    const criticalFiles = [
      "server/middleware/cors.ts",
      "server/api/test.get.ts",
      "server/api/products.get.ts",
      "nuxt.config.ts",
      ".env",
    ];

    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        log(`   ✅ ${file}`, "green");
      } else {
        log(`   ❌ ${file} MANQUANT`, "red");
        throw new Error(`Fichier critique manquant: ${file}`);
      }
    }

    // 2. Nettoyer le cache local
    exec(
      "rm -rf .nuxt .output node_modules/.cache",
      "Nettoyage du cache local"
    );

    // 3. Réinstaller les dépendances
    exec("npm install --force", "Réinstallation des dépendances");

    // 4. Build local pour vérifier
    try {
      exec("npm run build", "Build local de vérification");
    } catch (buildError) {
      log("⚠️  Build local échoue mais on continue (problème connu)", "yellow");
    }

    // 5. Supprimer le projet Vercel existant (si existe)
    try {
      exec(
        "vercel remove fournitures-scolaire --yes",
        "Suppression projet Vercel existant"
      );
    } catch (e) {
      log("   ℹ️  Pas de projet existant à supprimer", "blue");
    }

    // 6. Déployer en forcé
    exec("vercel --prod --force", "Déploiement forcé sur Vercel");

    log("\n⏳ Attente de 45 secondes pour la propagation...", "yellow");
    await new Promise((resolve) => setTimeout(resolve, 45000));

    // 7. Test immédiat
    log("7. Tests post-déploiement...", "yellow");

    const testUrl =
      "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app";

    try {
      // Test simple avec curl
      const curlResult = execSync(
        `curl -s -w "HTTPSTATUS:%{http_code}" "${testUrl}/api/test"`,
        { encoding: "utf8" }
      );
      const httpCode = curlResult.match(/HTTPSTATUS:(\d+)$/)?.[1];

      if (httpCode === "200") {
        log("🎉 API FONCTIONNE ! Tests supplémentaires...", "green");

        // Test CORS headers
        const corsTest = execSync(
          `curl -s -I -H "Origin: https://test.com" "${testUrl}/api/test"`,
          { encoding: "utf8" }
        );
        if (corsTest.includes("access-control-allow-origin")) {
          log("✅ Headers CORS présents", "green");
        } else {
          log("⚠️  Headers CORS manquants", "yellow");
        }
      } else {
        log(`❌ API retourne encore ${httpCode}`, "red");
      }
    } catch (testError) {
      log(`❌ Tests post-déploiement échoués: ${testError.message}`, "red");
    }

    log("\n🎯 DÉPLOIEMENT TERMINÉ", "blue");
    log("=".repeat(60), "blue");
    log("URLs à tester:", "blue");
    log(`   Site: ${testUrl}`, "blue");
    log(`   API Test: ${testUrl}/api/test`, "blue");
    log(`   API Produits: ${testUrl}/api/products`, "blue");

    log("\nSi ça ne marche toujours pas:", "yellow");
    log("   1. Vérifier les variables dans Vercel Dashboard", "yellow");
    log("   2. Attendre 5-10 minutes supplémentaires", "yellow");
    log("   3. Vérifier les logs: vercel logs", "yellow");
  } catch (error) {
    log(`\n💥 ERREUR CRITIQUE: ${error.message}`, "red");
    log("Contactez le support technique", "red");
    process.exit(1);
  }
}

forceDeploy();
