#!/usr/bin/env node

/**
 * Script pour ajouter des données de test dans Supabase
 * Utilisation: node scripts/seed-supabase.js
 */

const { PrismaClient } = require("@prisma/client");

async function seedDatabase() {
  console.log("🌱 AJOUT DE DONNÉES DE TEST DANS SUPABASE");
  console.log("=".repeat(50));

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Connexion Supabase réussie");

    console.log("\n📦 Ajout de packs scolaires...");

    // Ajouter des packs scolaires
    const packs = await Promise.all([
      prisma.pack.create({
        data: {
          name: "Pack CP Complet",
          level: "CP",
          price: 25000,
          originalPrice: 30000,
          image: "/images/pack-cp.jpg",
          description: "Pack complet pour les élèves de CP",
          contents: JSON.stringify([
            "Cahiers d'écriture",
            "Crayons de couleur",
            "Stylos",
            "Gomme et taille-crayon",
            "Règle",
          ]),
          isPopular: true,
          inStock: true,
        },
      }),
      prisma.pack.create({
        data: {
          name: "Pack CE2 Standard",
          level: "CE2",
          price: 35000,
          originalPrice: 40000,
          image: "/images/pack-ce2.jpg",
          description: "Pack adapté aux élèves de CE2",
          contents: JSON.stringify([
            "Cahiers grands carreaux",
            "Stylos bleus et noirs",
            "Crayons HB",
            "Compas et équerre",
            "Classeurs",
          ]),
          isPopular: false,
          inStock: true,
        },
      }),
    ]);

    console.log(`✅ ${packs.length} packs ajoutés`);

    console.log("\n🖊️ Ajout de produits individuels...");

    // Ajouter des produits individuels
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Stylo Plume Classique",
          price: 2500,
          originalPrice: 3000,
          category: "Stylos",
          image: "/images/products/stylo-plume.jpg",
          description:
            "Stylo plume de qualité pour l'apprentissage de l'écriture",
          specs: JSON.stringify([
            { label: "Marque", value: "Pilot" },
            { label: "Couleur", value: "Bleu" },
            { label: "Plume", value: "Moyenne" },
          ]),
          inStock: true,
          isPromotion: true,
          promotionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
      }),
      prisma.product.create({
        data: {
          name: "Cahier Spiral 96 pages",
          price: 1500,
          category: "Cahiers",
          image: "/images/products/cahier-spiral.jpg",
          description: "Cahier spiral avec couverture rigide",
          specs: JSON.stringify([
            { label: "Pages", value: "96" },
            { label: "Format", value: "A4" },
            { label: "Réglure", value: "Grands carreaux" },
          ]),
          inStock: true,
          bulkOptions: JSON.stringify([
            { quantity: 5, unitPrice: 1400, discount: 5 },
            { quantity: 10, unitPrice: 1300, discount: 10 },
            { quantity: 20, unitPrice: 1200, discount: 15 },
          ]),
        },
      }),
    ]);

    console.log(`✅ ${products.length} produits ajoutés`);

    console.log("\n🎯 Ajout d'une promotion...");

    // Ajouter une promotion
    const promotion = await prisma.promotion.create({
      data: {
        title: "Rentrée Scolaire 2025",
        description: "Réduction sur tous les packs scolaires",
        discount: 15,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
        products: JSON.stringify([products[0].id, products[1].id]),
        type: "percentage",
      },
    });

    console.log("✅ Promotion ajoutée");

    console.log("\n👤 Ajout d'un utilisateur de test...");

    // Ajouter un utilisateur de test
    const user = await prisma.user.create({
      data: {
        name: "Mamadou Diallo",
        email: "mamadou.test@example.com",
        phone: "+221 77 123 45 67",
        address: "Dakar, Sénégal",
      },
    });

    console.log("✅ Utilisateur de test ajouté");

    console.log("\n🛒 Ajout d'une commande de test...");

    // Ajouter une commande de test
    const order = await prisma.order.create({
      data: {
        ref: "CMD-TEST-001",
        userId: user.id,
        items: JSON.stringify([
          {
            productId: products[0].id,
            quantity: 2,
            name: products[0].name,
            price: products[0].price,
          },
          {
            packId: packs[0].id,
            quantity: 1,
            name: packs[0].name,
            price: packs[0].price,
          },
        ]),
        total: products[0].price * 2 + packs[0].price,
        status: "pending",
      },
    });

    console.log("✅ Commande de test ajoutée");

    // Résumé
    console.log("\n🎉 DONNÉES DE TEST AJOUTÉES AVEC SUCCÈS !");
    console.log("-".repeat(40));
    console.log(`📦 Packs: ${packs.length}`);
    console.log(`🖊️  Produits: ${products.length}`);
    console.log(`🎯 Promotions: 1`);
    console.log(`👤 Utilisateurs: 1`);
    console.log(`🛒 Commandes: 1`);

    console.log("\n🌐 Vérifiez sur Supabase Dashboard:");
    console.log(
      "https://supabase.com/dashboard/project/[votre-projet-id]/editor"
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des données:", error.message);
    console.log("\n🔧 Solutions:");
    console.log("1. Vérifiez que les tables existent: npm run check:tables");
    console.log("2. Poussez le schéma: npx prisma db push");
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().catch(console.error);
