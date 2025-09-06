// scripts/setup-and-sync-tables.js
// Script pour créer la structure et synchroniser les données dans des tables séparées
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE;
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;

// Données exactes du store local (version courte pour le test)
const PACKS_DATA = [
  {
    id: "pack-cp",
    name: "Pack Essentiel CP",
    level: "CP",
    price: 16500,
    originalPrice: 19000,
    image:
      "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description:
      "Le nécessaire pour bien démarrer le Cours Préparatoire (CI/CP).",
    contents: [
      "5 Cahiers 96 pages (17x22cm)",
      "2 Cahiers de dessin 48 pages",
      "1 Ardoise Velleda + 2 feutres + 1 chiffon",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-12-31"),
  },
];

const PRODUCTS_DATA = [
  {
    id: "cahier-32p",
    name: "Cahier 32 pages",
    price: 300,
    image:
      "https://i.pinimg.com/1200x/a9/ee/92/a9ee9212b025b90fd7d2a14529c7c6c5.jpg",
    originalPrice: 400,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Petit cahier de 32 pages",
    images: [
      "https://i.pinimg.com/736x/13/0a/97/130a97c6155ea06d2080a9fd0f75e9d6.jpg",
      "https://i.pinimg.com/736x/c5/fd/a0/c5fda0023a4a3e7fa7c68c5c27c00182.jpg",
    ],
    features: [
      { label: "Pages", value: "32 pages" },
      { label: "Format", value: "A5" },
    ],
  },
];

async function setupPacksTable() {
  console.log("📦 Configuration de la table Packs...");

  try {
    // Créer un pack exemple avec une structure simple
    const pack = PACKS_DATA[0];
    const record = await base(PACKS_TABLE).create({
      Name: pack.name,
      Level: pack.level,
      Price: pack.price,
      Description: pack.description,
      Contents: pack.contents.join(", "),
      "In Stock": pack.inStock,
    });

    console.log(`✅ Structure Packs créée avec l'ID: ${record.id}`);
    return record.id;
  } catch (error) {
    console.error(`❌ Erreur configuration Packs: ${error.message}`);
    return null;
  }
}

async function setupProductsTable() {
  console.log("🛍️  Configuration de la table Products...");

  try {
    // Créer un produit exemple avec une structure simple
    const product = PRODUCTS_DATA[0];
    const record = await base(PRODUCTS_TABLE).create({
      Name: product.name,
      Price: product.price,
      Category: product.category,
      Description: product.description,
      "In Stock": product.inStock,
    });

    console.log(`✅ Structure Products créée avec l'ID: ${record.id}`);
    return record.id;
  } catch (error) {
    console.error(`❌ Erreur configuration Products: ${error.message}`);
    return null;
  }
}

async function clearAndSetupTables() {
  console.log("🚀 Configuration des tables Airtable...");

  // Nettoyer les tables existantes
  try {
    const existingPacks = await base(PACKS_TABLE).select().all();
    if (existingPacks.length > 0) {
      const packIds = existingPacks.map((record) => record.id);
      for (let i = 0; i < packIds.length; i += 10) {
        const batch = packIds.slice(i, i + 10);
        await base(PACKS_TABLE).destroy(batch);
      }
      console.log(`🗑️  ${existingPacks.length} packs supprimés`);
    }
  } catch (error) {
    console.log("ℹ️  Table Packs vide ou non accessible");
  }

  try {
    const existingProducts = await base(PRODUCTS_TABLE).select().all();
    if (existingProducts.length > 0) {
      const productIds = existingProducts.map((record) => record.id);
      for (let i = 0; i < productIds.length; i += 10) {
        const batch = productIds.slice(i, i + 10);
        await base(PRODUCTS_TABLE).destroy(batch);
      }
      console.log(`🗑️  ${existingProducts.length} produits supprimés`);
    }
  } catch (error) {
    console.log("ℹ️  Table Products vide ou non accessible");
  }

  // Créer les structures
  const packId = await setupPacksTable();
  const productId = await setupProductsTable();

  console.log("\n💡 Tables configurées avec succès !");
  console.log("📝 Vous pouvez maintenant aller dans Airtable pour :");
  console.log("   1. Voir les structures créées");
  console.log("   2. Ajouter des champs supplémentaires si nécessaire");
  console.log("   3. Relancer une synchronisation complète");

  return { packId, productId };
}

// Exécuter la configuration
clearAndSetupTables().catch(console.error);
