// scripts/setup-production-db.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function setupProductionDB() {
  console.log("🗄️ Configuration Base de Données Production\n");

  // Vérifier si .env.production existe
  const envProdPath = ".env.production";
  const envExists = fs.existsSync(envProdPath);

  if (!envExists) {
    console.log("📝 Création du fichier .env.production...");

    // Lire .env existant
    const envContent = fs.existsSync(".env")
      ? fs.readFileSync(".env", "utf8")
      : "";

    // Template pour production
    const prodTemplate = `# Configuration Production
# Copié depuis .env local le ${new Date().toLocaleDateString("fr-FR")}

${envContent}

# 🗄️ BASE DE DONNÉES PRODUCTION
# Remplacez par votre URL de base de données en ligne
# DATABASE_URL="mysql://user:password@host:port/database"
# DATABASE_URL="postgresql://user:password@host:port/database"

# 🌐 URL DE PRODUCTION
# Sera mise à jour après déploiement Vercel
# NUXT_PUBLIC_BASE_URL="https://votre-app.vercel.app"

# 🔐 PAYTECH PRODUCTION
# Mettre NUXT_PAYTECH_SANDBOX="false" pour la production
NUXT_PAYTECH_SANDBOX="false"
`;

    fs.writeFileSync(envProdPath, prodTemplate);
    console.log("✅ Fichier .env.production créé");
  }

  console.log("\n📋 Checklist configuration production:\n");

  console.log("□ 1. Créer compte base de données en ligne");
  console.log("     Recommandé: PlanetScale (https://planetscale.com/)");
  console.log("     Alternatives: Supabase, Railway, Neon\n");

  console.log("□ 2. Obtenir URL de connexion");
  console.log("     Format MySQL: mysql://user:pass@host/db");
  console.log("     Format PostgreSQL: postgresql://user:pass@host/db\n");

  console.log("□ 3. Mettre à jour .env.production");
  console.log('     DATABASE_URL="votre_url_de_bdd"\n');

  console.log("□ 4. Tester la connexion");
  console.log("     npm run test:prod-db\n");

  console.log("□ 5. Pousser le schéma");
  console.log("     npx prisma db push\n");

  console.log("□ 6. Déployer sur Vercel");
  console.log("     vercel --prod\n");

  // Test de la configuration actuelle
  console.log("🔍 Test configuration actuelle:\n");

  try {
    // Test avec DATABASE_URL actuelle
    const prisma = new PrismaClient();
    await prisma.$connect();

    const orderCount = await prisma.order.count();
    const paymentCount = await prisma.payment.count();

    console.log("✅ Base de données locale connectée");
    console.log(`   📊 ${orderCount} commandes, ${paymentCount} paiements`);
    console.log("   💡 Ces données devront être migrées en production\n");

    await prisma.$disconnect();
  } catch (error) {
    console.log("❌ Erreur connexion base locale:", error.message);
  }

  // Vérifier les variables d'environnement
  console.log("🔐 Variables d'environnement actuelles:");
  console.log(
    `   PAYTECH_API_KEY: ${
      process.env.NUXT_PAYTECH_API_KEY ? "✅ Définie" : "❌ Manquante"
    }`
  );
  console.log(
    `   PAYTECH_SECRET_KEY: ${
      process.env.NUXT_PAYTECH_SECRET_KEY ? "✅ Définie" : "❌ Manquante"
    }`
  );
  console.log(
    `   PAYTECH_SANDBOX: ${process.env.NUXT_PAYTECH_SANDBOX || "true"}`
  );
  console.log(
    `   PUBLIC_BASE_URL: ${
      process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }`
  );

  console.log("\n🎯 Prochaines étapes:");
  console.log("1. Choisir et configurer une base de données en ligne");
  console.log("2. Mettre à jour .env.production avec la nouvelle DATABASE_URL");
  console.log("3. Tester: npm run test:prod-db");
  console.log("4. Déployer: vercel --prod");
}

setupProductionDB().catch(console.error);
