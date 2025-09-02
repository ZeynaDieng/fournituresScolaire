// scripts/test-supabase.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Charger .env.supabase si disponible
dotenv.config({ path: ".env.supabase" });

const prisma = new PrismaClient();

async function testSupabase() {
  try {
    console.log("🐘 TEST CONNEXION SUPABASE (PostgreSQL)\n");

    // Afficher l'URL de connexion (masquée)
    const dbUrl = process.env.DATABASE_URL || "Non définie";
    const maskedUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
    console.log(`📡 URL: ${maskedUrl}\n`);

    if (dbUrl.includes("[PASSWORD]")) {
      console.log("❌ ERREUR : Mot de passe non configuré");
      console.log(
        "💡 Remplacez [PASSWORD] par votre vrai mot de passe Supabase dans .env.supabase"
      );
      console.log(
        "🔍 Trouvez-le dans : https://app.supabase.com/ → Settings → Database"
      );
      return;
    }

    // Test de connexion
    console.log("⏳ Connexion à Supabase...");
    await prisma.$connect();
    console.log("✅ Connexion PostgreSQL réussie!\n");

    // Test des tables (peuvent ne pas exister encore)
    console.log("🔍 Vérification des tables...");

    try {
      const orderCount = await prisma.order.count();
      console.log(`✅ Table Order: ${orderCount} enregistrements`);
    } catch (e) {
      console.log("⚠️  Table Order: Inexistante (normal pour nouveau projet)");
      console.log("   💡 Exécutez: npx prisma db push");
    }

    try {
      const paymentCount = await prisma.payment.count();
      console.log(`✅ Table Payment: ${paymentCount} enregistrements`);
    } catch (e) {
      console.log(
        "⚠️  Table Payment: Inexistante (normal pour nouveau projet)"
      );
    }

    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Table User: ${userCount} enregistrements`);
    } catch (e) {
      console.log("⚠️  Table User: Inexistante (normal pour nouveau projet)");
    }

    // Afficher les informations Supabase
    console.log("\n📊 Configuration Supabase:");
    console.log(`   Project URL: ${process.env.SUPABASE_URL || "Non définie"}`);
    console.log(
      `   API Key: ${
        process.env.SUPABASE_ANON_KEY ? "Définie ✅" : "Non définie ❌"
      }`
    );

    console.log("\n🎯 Prochaines étapes:");
    console.log("1. npx prisma db push  (créer les tables)");
    console.log("2. Configurer variables Vercel");
    console.log("3. vercel --prod  (redéployer)");
    console.log("4. Tester sur https://fournitures-scolaire.vercel.app");
  } catch (error) {
    console.error("\n❌ Erreur de connexion Supabase:");
    console.error(`   ${error.message}\n`);

    if (error.message.includes("password authentication failed")) {
      console.log("💡 Problème de mot de passe");
      console.log("   Vérifiez le mot de passe dans DATABASE_URL");
      console.log(
        "   Format: postgresql://postgres.xxx:[PASSWORD]@xxx.supabase.com:6543/postgres"
      );
    } else if (error.message.includes("connection refused")) {
      console.log("💡 Problème de connexion réseau");
      console.log("   Vérifiez l'URL Supabase complète");
    } else if (
      error.message.includes("database") &&
      error.message.includes("does not exist")
    ) {
      console.log("💡 Base de données non trouvée");
      console.log("   Vérifiez le nom de la base dans l'URL");
    }

    console.log("\n📝 Pour obtenir la bonne URL:");
    console.log("1. https://app.supabase.com/");
    console.log("2. Votre projet → Settings → Database");
    console.log("3. Connection string → URI");
  } finally {
    await prisma.$disconnect();
  }
}

testSupabase();
