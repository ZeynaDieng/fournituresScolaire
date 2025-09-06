#!/usr/bin/env node

/**
 * Script pour récupérer automatiquement l'URL de déploiement Vercel
 * et tester la production avec la bonne URL
 */

const { execSync } = require("child_process");

console.log("🔍 DÉTECTION AUTOMATIQUE DE L'URL VERCEL...\n");

try {
  // Récupérer l'URL depuis la configuration Vercel locale ou git
  let productionUrl = null;

  // Méthode 1: Essayer de lire vercel.json ou .vercel
  const fs = require("fs");
  const path = require("path");

  const vercelConfigPath = path.join(__dirname, "../vercel.json");
  if (fs.existsSync(vercelConfigPath)) {
    console.log("📄 Vérification vercel.json...");
    // vercel.json ne contient généralement pas l'URL de production
  }

  // Méthode 2: Regarder dans les variables d'environnement
  if (process.env.VERCEL_URL) {
    productionUrl = `https://${process.env.VERCEL_URL}`;
    console.log(`✅ URL trouvée via VERCEL_URL: ${productionUrl}`);
  }

  // Méthode 3: Vérifier s'il y a une URL dans le git remote
  try {
    const gitRemote = execSync("git remote get-url origin", {
      encoding: "utf8",
    }).trim();
    console.log(`🔗 Git remote: ${gitRemote}`);

    if (gitRemote.includes("github.com")) {
      const match = gitRemote.match(/github\.com[:/](.+)\/(.+)\.git/);
      if (match) {
        const [, owner, repo] = match;
        // L'URL Vercel suit souvent le pattern: https://repo-name.vercel.app
        const guessedUrl = `https://${repo.toLowerCase()}.vercel.app`;
        console.log(`💡 URL probable basée sur le repo: ${guessedUrl}`);
        if (!productionUrl) {
          productionUrl = guessedUrl;
        }
      }
    }
  } catch (error) {
    console.log("⚠️  Impossible de récupérer l'URL depuis git");
  }

  // Méthode 4: URLs communes trouvées dans le code
  console.log("\n🔍 URLs trouvées dans la configuration:");

  const nuxtConfigPath = path.join(__dirname, "../nuxt.config.ts");
  if (fs.existsSync(nuxtConfigPath)) {
    const nuxtConfig = fs.readFileSync(nuxtConfigPath, "utf8");
    const urlMatches = nuxtConfig.match(/https:\/\/[^\s"'`]+\.vercel\.app/g);
    if (urlMatches) {
      urlMatches.forEach((url) => {
        console.log(`   📌 Trouvée: ${url}`);
        if (!productionUrl && url.includes("vercel.app")) {
          productionUrl = url;
        }
      });
    }
  }

  console.log("\n" + "=".repeat(60));

  if (productionUrl) {
    console.log(`🎯 URL DE PRODUCTION DÉTECTÉE: ${productionUrl}`);
    console.log("\n✅ CONFIGURATION VERCEL MISE À JOUR:");
    console.log(`BASE_URL=${productionUrl}`);
    console.log(`NUXT_PUBLIC_BASE_URL=${productionUrl}`);
    console.log(`NUXT_PUBLIC_SITE_URL=${productionUrl}`);

    console.log("\n🧪 TEST AUTOMATIQUE DE CETTE URL:");

    // Mettre à jour le script de test avec la bonne URL
    const testScriptPath = path.join(__dirname, "test-production-complete.js");
    if (fs.existsSync(testScriptPath)) {
      let testScript = fs.readFileSync(testScriptPath, "utf8");
      testScript = testScript.replace(
        /const PRODUCTION_URL = .+;/,
        `const PRODUCTION_URL = '${productionUrl}';`
      );
      fs.writeFileSync(testScriptPath, testScript);
      console.log(`✅ Script de test mis à jour avec: ${productionUrl}`);

      // Exécuter le test
      console.log("\n🚀 Exécution du test...\n");
      try {
        execSync(`node "${testScriptPath}"`, { stdio: "inherit" });
      } catch (error) {
        console.log(
          "\n❌ Erreurs détectées - configurez les variables Vercel !"
        );
      }
    }
  } else {
    console.log("❌ URL DE PRODUCTION NON TROUVÉE AUTOMATIQUEMENT");
    console.log("\n📋 ACTIONS MANUELLES REQUISES:");
    console.log("1. Allez sur https://vercel.com/dashboard");
    console.log("2. Ouvrez votre projet");
    console.log("3. Copiez l'URL de production");
    console.log("4. Utilisez cette URL pour les variables BASE_URL, etc.");

    console.log("\n💡 L'URL suit généralement le format:");
    console.log("   https://votre-projet-nom.vercel.app");
    console.log("   ou");
    console.log("   https://votre-projet-git-main-username.vercel.app");
  }

  console.log("\n🔗 LIENS UTILES:");
  console.log("   📊 Vercel Dashboard: https://vercel.com/dashboard");
  console.log(
    "   ⚙️  Variables d'env: [votre-projet] → Settings → Environment Variables"
  );
  console.log("   🚀 Redéploiement: [votre-projet] → Deployments → Redeploy");

  console.log("\n" + "=".repeat(60));
} catch (error) {
  console.error("❌ Erreur lors de la détection:", error.message);
  console.log("\n📋 SOLUTION MANUELLE:");
  console.log("1. Allez sur https://vercel.com/dashboard");
  console.log("2. Trouvez votre projet");
  console.log("3. Copiez l'URL de production");
  console.log("4. Configurez les variables avec cette URL");
}
