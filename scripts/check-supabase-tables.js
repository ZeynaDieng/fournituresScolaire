#!/usr/bin/env node

/**
 * Script pour vérifier les tables créées dans Supabase
 * Utilisation: node scripts/check-supabase-tables.js
 */

const { PrismaClient } = require("@prisma/client");

async function checkTables() {
  console.log("🗄️ VÉRIFICATION DES TABLES SUPABASE");
  console.log("=".repeat(50));

  const prisma = new PrismaClient();

  try {
    console.log("🔗 Connexion à Supabase...");

    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion Supabase réussie");

    console.log("\n📋 Vérification des tables:");

    // Vérifier chaque table
    const tables = [
      { name: "User", model: prisma.user },
      { name: "Pack", model: prisma.pack },
      { name: "Product", model: prisma.product },
      { name: "Order", model: prisma.order },
      { name: "Payment", model: prisma.payment },
      { name: "Promotion", model: prisma.promotion },
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(
          `✅ Table ${table.name}: existe (${count} enregistrements)`
        );
      } catch (error) {
        console.log(`❌ Table ${table.name}: erreur -`, error.message);
      }
    }

    // Test d'insertion simple pour vérifier que tout fonctionne
    console.log("\n🧪 Test d'insertion...");

    try {
      // Insérer un produit de test
      const testProduct = await prisma.product.create({
        data: {
          name: "Produit de test",
          price: 1000,
          category: "test",
          image: "/test.jpg",
          description: "Produit créé pour tester la base",
          inStock: true,
        },
      });

      console.log("✅ Insertion test réussie - ID:", testProduct.id);

      // Nettoyer le test
      await prisma.product.delete({ where: { id: testProduct.id } });
      console.log("✅ Nettoyage test réussi");
    } catch (error) {
      console.log("❌ Erreur insertion test:", error.message);
    }

    console.log("\n🎉 Base de données Supabase opérationnelle !");
  } catch (error) {
    console.error("❌ Erreur de connexion Supabase:", error.message);
    console.log("\n🔧 Solutions possibles:");
    console.log("1. Vérifiez l'URL DATABASE_URL dans .env.production");
    console.log("2. Relancez: npx prisma db push");
    console.log("3. Vérifiez les permissions Supabase");
  } finally {
    await prisma.$disconnect();
  }
}

checkTables().catch(console.error);
