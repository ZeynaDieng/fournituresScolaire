// scripts/add-products-to-airtable.js
import Airtable from "airtable";
import { config } from "dotenv";

config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const PRODUCTS_SAMPLE = [
  {
    id: "cahier-32p",
    name: "Cahier 32 pages",
    price: 300,
    originalPrice: 400,
    category: "Cahiers",
    description: "Petit cahier de 32 pages",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "cahier-48p",
    name: "Cahier 48 pages",
    price: 350,
    category: "Cahiers",
    description: "Cahier de 48 pages, format standard",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "stylo-bille-bleu",
    name: "Stylo Bille Bleu",
    price: 100,
    category: "Stylos",
    description: "Stylo bille encre bleue, pointe fine",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "stylo-bille-noir",
    name: "Stylo Bille Noir",
    price: 100,
    category: "Stylos",
    description: "Stylo bille encre noire, pointe fine",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "crayon-hb",
    name: "Crayon HB",
    price: 100,
    category: "Crayons",
    description: "Crayon à papier HB",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "calculatrice-scientifique",
    name: "Calculatrice Scientifique",
    price: 12000,
    category: "Calculatrices",
    description: "Calculatrice scientifique programmable",
    inStock: true,
    isPromotion: false,
  },
  {
    id: "sac-a-dos-enfant",
    name: "Sac à dos enfant",
    price: 8000,
    originalPrice: 10000,
    category: "Sacs",
    description: "Sac à dos coloré et résistant pour enfants",
    inStock: true,
    isPromotion: true,
    promotionEndDate: "2024-12-20",
  },
];

async function addProductsToPacksTable() {
  console.log("🛍️  Ajout des produits dans la table Packs...");

  try {
    const productsToCreate = PRODUCTS_SAMPLE.map((product) => ({
      fields: {
        Description: `[PRODUIT] ${product.description}. ${product.name}`,
        Level: product.category,
        Price: product.price,
        "Original Price": product.originalPrice || product.price,
        Contents: `Catégorie: ${product.category}, ID: ${product.id}`,
        "Is Popular": false,
        "In Stock": product.inStock,
        "Is Promotion": product.isPromotion || false,
        "Promotion End Date": product.promotionEndDate || null,
      },
    }));

    for (let i = 0; i < productsToCreate.length; i += 10) {
      const batch = productsToCreate.slice(i, i + 10);
      const created = await base("Packs").create(batch);
      console.log(
        `✅ Lot ${Math.floor(i / 10) + 1}: ${created.length} produits ajoutés`
      );
    }

    console.log(
      `🎉 ${PRODUCTS_SAMPLE.length} produits ajoutés à la table Packs !`
    );
    console.log("💡 Les produits sont marqués [PRODUIT] dans la description");
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

addProductsToPacksTable();
