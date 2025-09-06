// scripts/simple-sync-products.js
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
    image:
      "https://i.pinimg.com/1200x/a9/ee/92/a9ee9212b025b90fd7d2a14529c7c6c5.jpg",
    originalPrice: 400,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Petit cahier de 32 pages",
  },
  {
    id: "stylo-bille-bleu",
    name: "Stylo Bille Bleu",
    price: 100,
    image:
      "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg",
    inStock: true,
    originalPrice: null,
    isPromotion: false,
    category: "Stylos",
    description: "Stylo bille encre bleue, pointe fine",
  },
  {
    id: "crayon-hb",
    name: "Crayon HB",
    price: 100,
    image:
      "https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Crayons",
    description: "Crayon à papier HB",
  },
];

async function syncProducts() {
  console.log("🛍️ Synchronisation des produits...");

  try {
    // Structure simple avec les colonnes existantes dans Airtable
    const productsToCreate = PRODUCTS_SAMPLE.map((product) => ({
      fields: {
        Description: `${product.description}. ${product.name}`, // On met tout dans Description
        Level: product.category, // On utilise Level pour la catégorie
        Price: product.price,
        "Original Price": product.originalPrice || product.price,
        Contents: `ID: ${product.id}, Category: ${product.category}`, // Métadonnées
        "Is Popular": false,
        "In Stock": product.inStock,
        "Is Promotion": product.isPromotion,
        "Promotion End Date": null,
      },
    }));

    // Nettoyer d'abord la table Products si elle existe
    try {
      const existingProducts = await base("Products").select().all();
      if (existingProducts.length > 0) {
        const productIds = existingProducts.map((record) => record.id);
        for (let i = 0; i < productIds.length; i += 10) {
          const batch = productIds.slice(i, i + 10);
          await base("Products").destroy(batch);
        }
        console.log(`✅ ${existingProducts.length} anciens produits supprimés`);
      }
    } catch (error) {
      console.log("ℹ️ Table Products introuvable, création...");
    }

    // Créer les nouveaux produits
    for (let i = 0; i < productsToCreate.length; i += 10) {
      const batch = productsToCreate.slice(i, i + 10);
      await base("Products").create(batch);
    }

    console.log(
      `✅ ${PRODUCTS_SAMPLE.length} produits synchronisés avec la structure Packs`
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
    console.log("💡 Essayons d'utiliser la table Packs existante...");

    try {
      // Utiliser la table Packs existante pour stocker nos produits
      for (let i = 0; i < productsToCreate.length; i += 10) {
        const batch = productsToCreate.slice(i, i + 10);
        await base("Packs").create(batch);
      }
      console.log(
        `✅ ${PRODUCTS_SAMPLE.length} produits ajoutés à la table Packs`
      );
    } catch (fallbackError) {
      console.error("❌ Erreur de fallback:", fallbackError);
    }
  }
}

syncProducts()
  .then(() => {
    console.log("🎉 Terminé !");
  })
  .catch(console.error);
