#!/usr/bin/env node

/**
 * Script de configuration complète Airtable
 * Ce script automatise tout le processus de configuration et synchronisation
 */

const { spawn } = require("child_process");
const path = require("path");

function runScript(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}...`);
    console.log(`   Commande: ${command}`);

    const [cmd, ...args] = command.split(" ");
    const process = spawn(cmd, args, {
      cwd: path.resolve(__dirname, ".."),
      stdio: "inherit",
    });

    process.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${description} terminé avec succès`);
        resolve();
      } else {
        console.error(`❌ ${description} a échoué avec le code ${code}`);
        reject(new Error(`Script failed with code ${code}`));
      }
    });

    process.on("error", (error) => {
      console.error(`❌ Erreur lors de l'exécution de ${description}:`, error);
      reject(error);
    });
  });
}

async function waitForUser(message) {
  console.log(`\n⏸️  ${message}`);
  console.log("   Appuyez sur Entrée pour continuer...");

  return new Promise((resolve) => {
    process.stdin.once("data", () => {
      resolve();
    });
  });
}

async function main() {
  console.log("🚀 Configuration complète d'Airtable");
  console.log("=====================================\n");

  try {
    // Étape 1: Vérifier la configuration actuelle
    console.log("📋 ÉTAPE 1: Vérification de la configuration");
    await runScript(
      "npm run test:airtable-config",
      "Vérification de la configuration Airtable"
    );

    await waitForUser(
      "Vérifiez les résultats ci-dessus. Si des tables ou champs sont manquants, continuez."
    );

    // Étape 2: Créer les champs manquants automatiquement
    console.log("\n📋 ÉTAPE 2: Création automatique des champs");
    await runScript("npm run create:fields", "Création des champs manquants");

    await waitForUser(
      "Vérifiez si la création automatique a fonctionné. Si certains champs n'ont pas pu être créés, ajoutez-les manuellement dans Airtable avant de continuer."
    );

    // Étape 3: Vérifier à nouveau la configuration
    console.log("\n📋 ÉTAPE 3: Vérification post-création");
    await runScript(
      "npm run test:airtable-config",
      "Vérification après création des champs"
    );

    await waitForUser(
      "Si tous les champs sont présents, continuez. Sinon, ajoutez manuellement les champs manquants."
    );

    // Étape 4: Réinitialiser et synchroniser
    console.log("\n📋 ÉTAPE 4: Synchronisation complète");
    await runScript(
      "npm run reset:airtable",
      "Nettoyage des données existantes"
    );

    console.log("\n⏱️  Attente de 3 secondes...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await runScript(
      "npm run sync:tables",
      "Synchronisation vers les tables séparées"
    );

    // Étape 5: Vérification finale
    console.log("\n📋 ÉTAPE 5: Vérification finale");
    await runScript(
      "npm run inspect:airtable",
      "Inspection finale des données"
    );

    console.log("\n🎉 Configuration complète terminée!");
    console.log("=====================================");
    console.log("✅ Airtable est maintenant configuré et synchronisé");
    console.log(
      "💡 Vous pouvez maintenant gérer votre catalogue directement depuis Airtable"
    );
    console.log(
      "📖 Consultez le AIRTABLE_SETUP_GUIDE.md pour plus d'informations"
    );
  } catch (error) {
    console.error("\n❌ Erreur lors de la configuration:", error.message);
    console.log("\n🔧 Actions recommandées:");
    console.log("1. Vérifiez vos variables d'environnement (.env)");
    console.log("2. Assurez-vous que vos tables Airtable existent");
    console.log("3. Vérifiez vos permissions API Airtable");
    console.log("4. Consultez le AIRTABLE_SETUP_GUIDE.md");
    process.exit(1);
  }
}

// Permettre l'interruption propre
process.on("SIGINT", () => {
  console.log("\n\n⏹️  Configuration interrompue par l'utilisateur");
  process.exit(0);
});

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}
