#!/usr/bin/env node

/**
 * Script pour trouver la vraie URL Vercel en testant les variations courantes
 */

const https = require("https");

console.log("🔍 RECHERCHE DE LA VRAIE URL VERCEL...\n");

// URLs possibles basées sur le nom du projet
const possibleUrls = [
  "https://fournitures-scolaire.vercel.app",
  "https://fournituresscolaire.vercel.app",
  "https://fourniture-scolaire.vercel.app",
  "https://fourniturescolaire.vercel.app",
  "https://fournitures-scolaire-git-main-zeynadieng.vercel.app",
  "https://fournitures-scolaire-zeynadieng.vercel.app",
  "https://fournitures-scolaire-zeynadiengs-projects.vercel.app",
];

// Fonction pour tester une URL
function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 5000 }, (res) => {
      resolve({
        url: url,
        status: res.statusCode,
        success: res.statusCode < 400,
        headers: res.headers,
      });
    });

    req.on("error", (error) => {
      resolve({
        url: url,
        status: "ERROR",
        success: false,
        error: error.message,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        url: url,
        status: "TIMEOUT",
        success: false,
        error: "Timeout",
      });
    });
  });
}

// Tester toutes les URLs
async function findWorkingUrl() {
  console.log("🧪 Test des URLs possibles...\n");

  const results = [];

  for (const url of possibleUrls) {
    console.log(`Testing: ${url}...`);
    const result = await testUrl(url);
    results.push(result);

    const icon = result.success ? "✅" : "❌";
    const status = result.status;
    console.log(`${icon} ${url} → ${status}`);

    if (result.success) {
      console.log(`\n🎯 URL FONCTIONNELLE TROUVÉE: ${url}`);
      console.log("=".repeat(60));
      return url;
    }
  }

  console.log("\n❌ Aucune URL fonctionnelle trouvée automatiquement");
  console.log("\n📋 ACTIONS MANUELLES REQUISES:");
  console.log("1. Allez sur https://vercel.com/dashboard");
  console.log("2. Trouvez votre projet dans la liste");
  console.log("3. Cliquez sur le projet pour voir l'URL de production");
  console.log("4. Copiez l'URL exacte affichée");

  console.log("\n🔍 URLs testées:");
  results.forEach((result) => {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${result.url} (${result.status})`);
  });

  return null;
}

// Fonction pour mettre à jour les fichiers avec la bonne URL
function updateConfigFiles(correctUrl) {
  const fs = require("fs");
  const path = require("path");

  console.log(
    `\n🔧 Mise à jour des fichiers de configuration avec: ${correctUrl}\n`
  );

  const filesToUpdate = [
    "../nuxt.config.ts",
    "../scripts/test-production-complete.js",
    "../URGENT_RESOLUTION_GUIDE.md",
    "../URGENT_VERCEL_CONFIG.md",
  ];

  const urlsToReplace = [
    "https://fournitures-scolaire.vercel.app",
    "https://fournituresscolaire.vercel.app",
    "https://votre-app.vercel.app",
    "https://your-app.vercel.app",
  ];

  filesToUpdate.forEach((filePath) => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, "utf8");
        let updated = false;

        urlsToReplace.forEach((oldUrl) => {
          if (content.includes(oldUrl)) {
            content = content.replace(new RegExp(oldUrl, "g"), correctUrl);
            updated = true;
          }
        });

        if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Mis à jour: ${filePath.replace("../", "")}`);
        } else {
          console.log(`⏭️  Aucun changement: ${filePath.replace("../", "")}`);
        }
      } catch (error) {
        console.log(`❌ Erreur mise à jour ${filePath}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    }
  });
}

// Exécution principale
async function main() {
  const workingUrl = await findWorkingUrl();

  if (workingUrl) {
    updateConfigFiles(workingUrl);

    console.log("\n🎯 PROCHAINES ÉTAPES:");
    console.log(`1. Configurez les variables Vercel avec: ${workingUrl}`);
    console.log("2. Redéployez l'application");
    console.log("3. Testez avec: node scripts/test-production-complete.js");

    console.log("\n✅ VARIABLES VERCEL À CONFIGURER:");
    console.log(`BASE_URL=${workingUrl}`);
    console.log(`NUXT_PUBLIC_BASE_URL=${workingUrl}`);
    console.log(`NUXT_PUBLIC_SITE_URL=${workingUrl}`);
  } else {
    console.log("\n🔍 SOLUTION ALTERNATIVE:");
    console.log("Récupérez l'URL exacte depuis votre tableau de bord Vercel");
    console.log("puis exécutez ce script avec l'URL correcte en paramètre:");
    console.log(
      "node scripts/find-vercel-url.js https://votre-vraie-url.vercel.app"
    );
  }
}

// Support pour URL en paramètre
if (process.argv[2]) {
  const providedUrl = process.argv[2];
  console.log(`🎯 Test de l'URL fournie: ${providedUrl}`);

  testUrl(providedUrl).then((result) => {
    if (result.success) {
      console.log(`✅ URL valide: ${providedUrl}`);
      updateConfigFiles(providedUrl);
    } else {
      console.log(`❌ URL invalide: ${providedUrl} (${result.status})`);
    }
  });
} else {
  main().catch(console.error);
}
