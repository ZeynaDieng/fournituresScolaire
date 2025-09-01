// scripts/test-prod-db.js
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Charger .env.production si disponible
if (process.argv.includes("--prod")) {
  dotenv.config({ path: ".env.production" });
  console.log("🔄 Utilisation de .env.production");
} else {
  console.log("🔄 Utilisation de .env local");
}

const prisma = new PrismaClient();

async function testProductionDB() {
  try {
    console.log("🔍 Test de connexion base de données...\n");

    // Afficher l'URL de connexion (masquée)
    const dbUrl = process.env.DATABASE_URL || "Non définie";
    const maskedUrl = dbUrl.replace(/\/\/[^@]+@/, "//***:***@");
    console.log(`📡 URL: ${maskedUrl}\n`);

    // Test de connexion
    console.log("⏳ Connexion...");
    await prisma.$connect();
    console.log("✅ Connexion réussie!\n");

    // Test des tables
    console.log("🔍 Vérification des tables...");

    try {
      const orderCount = await prisma.order.count();
      console.log(`✅ Table Order: ${orderCount} enregistrements`);
    } catch (e) {
      console.log("❌ Table Order: Non accessible ou inexistante");
      console.log("   💡 Exécutez: npx prisma db push");
    }

    try {
      const paymentCount = await prisma.payment.count();
      console.log(`✅ Table Payment: ${paymentCount} enregistrements`);
    } catch (e) {
      console.log("❌ Table Payment: Non accessible ou inexistante");
    }

    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Table User: ${userCount} enregistrements`);
    } catch (e) {
      console.log("❌ Table User: Non accessible ou inexistante");
    }

    // Test d'écriture (si pas de données)
    const totalOrders = await prisma.order.count();
    if (totalOrders === 0) {
      console.log("\n🧪 Test d'écriture (base vide)...");

      const testOrder = await prisma.order.create({
        data: {
          ref: `PROD_TEST_${Date.now()}`,
          status: "pending",
          total: 1000,
          items: JSON.stringify([
            {
              id: "test-prod",
              name: "Test Production",
              price: 1000,
              quantity: 1,
            },
          ]),
          userId: null,
        },
      });

      console.log(`✅ Test d'écriture réussi: ${testOrder.ref}`);

      // Nettoyer le test
      await prisma.order.delete({
        where: { id: testOrder.id },
      });
      console.log("🗑️ Données de test supprimées");
    }

    console.log("\n🎉 Base de données prête pour la production!");
  } catch (error) {
    console.error("\n❌ Erreur de connexion:");
    console.error(`   ${error.message}\n`);

    if (error.message.includes("Unknown database")) {
      console.log("💡 La base de données n'existe pas encore");
      console.log("   Créez-la dans votre interface provider");
    } else if (error.message.includes("Access denied")) {
      console.log("💡 Problème d'authentification");
      console.log("   Vérifiez username/password dans DATABASE_URL");
    } else if (error.message.includes("Connection refused")) {
      console.log("💡 Impossible de se connecter au serveur");
      console.log("   Vérifiez l'host et le port dans DATABASE_URL");
    } else {
      console.log("💡 Vérifiez votre DATABASE_URL dans .env.production");
    }

    console.log("\n📝 Format attendu:");
    console.log("MySQL: mysql://user:password@host:3306/database");
    console.log("PostgreSQL: postgresql://user:password@host:5432/database");
  } finally {
    await prisma.$disconnect();
  }
}

testProductionDB();
