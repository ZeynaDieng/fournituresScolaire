#!/usr/bin/env node

/**
 * Script de correction et redéploiement Vercel
 * Commit et push automatique de la correction
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function fixAndRedeploy() {
  console.log("🚀 Correction et Redéploiement Vercel");
  console.log("====================================\n");

  try {
    console.log("1. Vérification du statut Git...");
    const { stdout: statusOutput } = await execAsync("git status --porcelain");

    if (statusOutput.includes("vercel.json")) {
      console.log("✅ vercel.json modifié détecté");
    } else {
      console.log("ℹ️  Aucune modification détectée");
    }

    console.log("\n2. Ajout des fichiers modifiés...");
    await execAsync("git add vercel.json");
    console.log("✅ vercel.json ajouté");

    console.log("\n3. Commit de la correction...");
    await execAsync(
      'git commit -m "fix: correct vercel.json configuration for Nuxt 3 deployment"'
    );
    console.log("✅ Commit créé avec succès");

    console.log("\n4. Push vers GitHub...");
    const { stdout: pushOutput } = await execAsync("git push origin main");
    console.log("✅ Push terminé:", pushOutput.trim());

    console.log("\n🎉 Correction appliquée avec succès !");
    console.log("=====================================");
    console.log("✅ vercel.json corrigé et poussé");
    console.log("🔄 Vercel va redéployer automatiquement");
    console.log("⏱️  Temps estimé: 5-8 minutes");

    console.log("\n📋 Prochaines étapes:");
    console.log("1. Surveiller le déploiement sur vercel.com");
    console.log("2. Attendre 'Build Completed' ✅");
    console.log("3. Configurer les variables d'environnement");
    console.log("4. Tester le site déployé");

    console.log("\n🔗 Liens utiles:");
    console.log("• Dashboard Vercel: https://vercel.com/dashboard");
    console.log("• Logs en temps réel: Voir votre projet > Deployments");
  } catch (error) {
    console.error("❌ Erreur lors du processus:", error.message);

    if (error.message.includes("nothing to commit")) {
      console.log("\n💡 Les changements ont peut-être déjà été committés");
      console.log(
        "Vérifiez le dashboard Vercel pour voir le status du déploiement"
      );
    }

    if (error.message.includes("rejected")) {
      console.log("\n🔧 Solution: Synchroniser avec le repository distant");
      console.log("git pull origin main");
      console.log("puis relancer ce script");
    }
  }
}

// Exécution du script
fixAndRedeploy();
