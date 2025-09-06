#!/usr/bin/env node

/**
 * Script de diagnostic de déploiement
 * Identifie les problèmes potentiels qui empêchent le déploiement
 */

import fs from "fs";
import path from "path";

console.log("🚀 Diagnostic de déploiement");
console.log("============================\n");

const diagnosticChecks = [
  {
    name: "Configuration des variables d'environnement",
    check: () => {
      const envFile = ".env";
      if (!fs.existsSync(envFile)) {
        return { status: "❌", message: "Fichier .env manquant" };
      }

      const envContent = fs.readFileSync(envFile, "utf8");
      const requiredVars = [
        "AIRTABLE_API_KEY",
        "AIRTABLE_BASE_ID",
        "WHATSAPP_BUSINESS_NUMBER",
        "NUXT_PUBLIC_SITE_URL",
      ];

      const missingVars = requiredVars.filter(
        (varName) =>
          !envContent.includes(varName) || envContent.includes(`${varName}=`)
      );

      if (missingVars.length > 0) {
        return {
          status: "⚠️",
          message: `Variables manquantes: ${missingVars.join(", ")}`,
        };
      }

      return { status: "✅", message: "Variables d'environnement configurées" };
    },
  },

  {
    name: "Structure des fichiers de build",
    check: () => {
      const buildDir = ".nuxt";
      if (!fs.existsSync(buildDir)) {
        return {
          status: "❌",
          message: "Dossier .nuxt manquant - lancez npm run build",
        };
      }

      const outputDir = ".output";
      if (!fs.existsSync(outputDir)) {
        return {
          status: "❌",
          message: "Dossier .output manquant - lancez npm run build",
        };
      }

      return { status: "✅", message: "Structure de build présente" };
    },
  },

  {
    name: "Configuration Nuxt",
    check: () => {
      const nuxtConfig = "nuxt.config.ts";
      if (!fs.existsSync(nuxtConfig)) {
        return { status: "❌", message: "nuxt.config.ts manquant" };
      }

      const configContent = fs.readFileSync(nuxtConfig, "utf8");

      // Vérifier les modules requis
      const requiredModules = ["@nuxtjs/tailwindcss", "@pinia/nuxt"];
      const missingModules = requiredModules.filter(
        (module) => !configContent.includes(module)
      );

      if (missingModules.length > 0) {
        return {
          status: "⚠️",
          message: `Modules manquants: ${missingModules.join(", ")}`,
        };
      }

      return { status: "✅", message: "Configuration Nuxt valide" };
    },
  },

  {
    name: "Dépendances du package.json",
    check: () => {
      const packageFile = "package.json";
      if (!fs.existsSync(packageFile)) {
        return { status: "❌", message: "package.json manquant" };
      }

      const packageContent = JSON.parse(fs.readFileSync(packageFile, "utf8"));

      // Vérifier les dépendances critiques
      const criticalDeps = ["nuxt", "airtable", "pinia", "@nuxtjs/tailwindcss"];
      const missingDeps = criticalDeps.filter(
        (dep) =>
          !packageContent.dependencies?.[dep] &&
          !packageContent.devDependencies?.[dep]
      );

      if (missingDeps.length > 0) {
        return {
          status: "❌",
          message: `Dépendances manquantes: ${missingDeps.join(", ")}`,
        };
      }

      // Vérifier la version de Node
      const nodeEngine = packageContent.engines?.node;
      if (!nodeEngine) {
        return {
          status: "⚠️",
          message: "Version Node.js non spécifiée dans engines",
        };
      }

      return { status: "✅", message: "Dépendances configurées" };
    },
  },

  {
    name: "Fichiers de déploiement",
    check: () => {
      const deploymentFiles = [
        "vercel.json",
        "netlify.toml",
        "Dockerfile",
        "docker-compose.yml",
      ];

      const existingFiles = deploymentFiles.filter((file) =>
        fs.existsSync(file)
      );

      if (existingFiles.length === 0) {
        return {
          status: "⚠️",
          message: "Aucun fichier de déploiement détecté",
        };
      }

      return {
        status: "✅",
        message: `Fichiers trouvés: ${existingFiles.join(", ")}`,
      };
    },
  },

  {
    name: "Vérification des routes API",
    check: () => {
      const serverDir = "server/api";
      if (!fs.existsSync(serverDir)) {
        return { status: "❌", message: "Dossier server/api manquant" };
      }

      // Compter les fichiers API
      const apiFiles = [];
      const scanDir = (dir) => {
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
          } else if (item.endsWith(".ts") || item.endsWith(".js")) {
            apiFiles.push(fullPath);
          }
        });
      };

      scanDir(serverDir);

      return {
        status: "✅",
        message: `${apiFiles.length} routes API trouvées`,
      };
    },
  },

  {
    name: "Vérification des assets",
    check: () => {
      const publicDir = "public";
      const assetsDir = "assets";

      if (!fs.existsSync(publicDir)) {
        return { status: "⚠️", message: "Dossier public manquant" };
      }

      if (!fs.existsSync(assetsDir)) {
        return { status: "⚠️", message: "Dossier assets manquant" };
      }

      // Vérifier les images essentielles
      const essentialImages = [
        "public/favicon.ico",
        "assets/images/fournitureBanniere.png",
      ];

      const missingImages = essentialImages.filter(
        (img) => !fs.existsSync(img)
      );

      if (missingImages.length > 0) {
        return {
          status: "⚠️",
          message: `Images manquantes: ${missingImages.join(", ")}`,
        };
      }

      return { status: "✅", message: "Assets présents" };
    },
  },

  {
    name: "Vérification des composants",
    check: () => {
      const componentsDir = "components";
      if (!fs.existsSync(componentsDir)) {
        return { status: "❌", message: "Dossier components manquant" };
      }

      // Vérifier les composants critiques
      const criticalComponents = [
        "components/AppHeader.vue",
        "components/AppFooter.vue",
        "components/CheckoutForm.vue",
      ];

      const missingComponents = criticalComponents.filter(
        (comp) => !fs.existsSync(comp)
      );

      if (missingComponents.length > 0) {
        return {
          status: "❌",
          message: `Composants manquants: ${missingComponents.join(", ")}`,
        };
      }

      return { status: "✅", message: "Composants critiques présents" };
    },
  },
];

// Exécuter tous les diagnostics
console.log("📋 Résultats du diagnostic :");
console.log("-".repeat(50));

let errorCount = 0;
let warningCount = 0;

diagnosticChecks.forEach(({ name, check }) => {
  try {
    const result = check();
    console.log(`${result.status} ${name}`);
    console.log(`   ${result.message}\n`);

    if (result.status === "❌") errorCount++;
    if (result.status === "⚠️") warningCount++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Erreur: ${error.message}\n`);
    errorCount++;
  }
});

// Résumé
console.log("📊 Résumé du diagnostic :");
console.log("-".repeat(30));

if (errorCount === 0 && warningCount === 0) {
  console.log("✅ Aucun problème détecté - Prêt pour le déploiement !");
} else {
  console.log(`❌ ${errorCount} erreur(s) critique(s)`);
  console.log(`⚠️  ${warningCount} avertissement(s)`);

  if (errorCount > 0) {
    console.log("\n🔧 Actions requises :");
    console.log("- Corriger les erreurs critiques avant le déploiement");
    console.log("- Lancer 'npm run build' pour générer les fichiers");
    console.log("- Vérifier la configuration des variables d'environnement");
  }
}

// Recommandations de déploiement
console.log("\n🚀 Recommandations de déploiement :");
console.log("-".repeat(40));
console.log("1. Plateformes recommandées :");
console.log("   • Vercel (optimisé pour Nuxt)");
console.log("   • Netlify (bon support SSG/SSR)");
console.log("   • Heroku (avec buildpack Node.js)");
console.log("\n2. Variables d'environnement à configurer :");
console.log("   • AIRTABLE_API_KEY");
console.log("   • AIRTABLE_BASE_ID");
console.log("   • WHATSAPP_BUSINESS_NUMBER");
console.log("   • NUXT_PUBLIC_SITE_URL");
console.log("\n3. Commandes de build :");
console.log("   • Build: npm run build");
console.log("   • Start: node .output/server/index.mjs");

console.log("\n✨ Diagnostic terminé !");
