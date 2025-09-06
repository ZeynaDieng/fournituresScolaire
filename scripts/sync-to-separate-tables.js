// scripts/sync-to-separate-tables.js
// Script pour synchroniser les données du store vers des tables Airtable séparées
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// Tables séparées selon le .env
const PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE || "Packs";
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || "Products";
const ORDERS_TABLE = process.env.AIRTABLE_ORDERS_TABLE || "Orders";

// Données exactes du store local
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
      "1 Trousse garnie (2 stylos bleus, 1 stylo vert, 1 crayon noir, 1 gomme, 1 taille-crayon)",
      "1 Boîte de 12 crayons de couleur",
      "1 Règle plate 20cm",
      "5 Protège-cahiers (couleurs assorties)",
      "1 Paquet de 100 étiquettes",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-12-31"),
  },
  {
    id: "pack-ce",
    name: "Pack Avancé CE1-CE2",
    level: "CE1-CE2",
    price: 21000,
    originalPrice: 25000,
    image:
      "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    description: "Un pack complet pour les élèves du Cours Élémentaire.",
    contents: [
      "8 Cahiers 96 pages (17x22cm)",
      "4 Cahiers 192 pages (21x29.7cm)",
      "1 Cahier de poésie/chant",
      "1 Trousse (2 stylos bleus, 1 vert, 1 rouge, 1 noir, 1 crayon, 1 gomme, 1 taille-crayon)",
      "1 Boîte de 12 feutres de couleur",
      "1 Kit de traçage (règle 30cm, équerre, rapporteur)",
      "1 Compas",
      "1 Agenda scolaire ou cahier de texte",
      "8 Protège-cahiers (formats assortis)",
    ],
    isPopular: true,
    inStock: true,
  },
  {
    id: "pack-college",
    name: "Pack Collège 6ème-3ème",
    level: "Collège",
    price: 28000,
    originalPrice: 33000,
    image:
      "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    description: "L'équipement idéal pour réussir ses années de collège.",
    contents: [
      "5 Cahiers 200 pages grand format (24x32cm)",
      "3 Classeurs A4 souples",
      "1 Paquet de 200 copies doubles A4",
      "1 Paquet de 100 copies simples A4",
      "1 Trousse complète (stylos, surligneurs, correcteur)",
      "1 Calculatrice scientifique type collège",
      "1 Kit de géométrie complet et résistant",
      "1 Agenda scolaire",
      "1 Trieur 8 compartiments",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-12-15"),
  },
  {
    id: "pack-lycee",
    name: "Pack Lycée Seconde-Terminale",
    level: "Lycée",
    price: 38500,
    originalPrice: 45000,
    image: "https://placehold.co/600x400/F4ECF7/17202A?text=Pack+Lycee",
    description:
      "Un pack robuste et complet pour affronter les défis du lycée.",
    contents: [
      "4 Classeurs A4 rigides grand format",
      "1 Paquet de 400 copies doubles A4 perforées",
      "1 Paquet de 200 copies simples A4 perforées",
      "1 Trieur 12 compartiments",
      "1 Lot de 4 surligneurs de couleurs différentes",
      "1 Calculatrice scientifique graphique (avec mode examen)",
      "1 Agenda grand format",
      "1 Ramette de papier 500 feuilles",
      "Stylos et porte-mine de qualité supérieure",
    ],
    isPopular: false,
    inStock: true,
  },
];

const PRODUCTS_DATA = [
  // Cahiers
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
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "100g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Alice",
        rating: 4,
        comment: "Bonne qualité.",
        date: "1 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 280, discount: 5 },
      { quantity: 10, unitPrice: 270, discount: 10 },
    ],
  },
  {
    id: "cahier-48p",
    name: "Cahier 48 pages",
    price: 350,
    image:
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier de 48 pages, format standard",
    images: [
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
      "https://i.pinimg.com/736x/6a/50/2d/6a502d7a2f0932ce229a52941eba7050.jpg",
    ],
    features: [
      { label: "Pages", value: "48 pages" },
      { label: "Format", value: "A5" },
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "150g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Bob",
        rating: 5,
        comment: "Très pratique pour les cours.",
        date: "3 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 330, discount: 5 },
      { quantity: 10, unitPrice: 320, discount: 10 },
    ],
  },
  {
    id: "cahier-64p",
    name: "Cahier 64 pages",
    price: 400,
    image:
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier de 64 pages",
    images: [
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    ],
    features: [
      { label: "Pages", value: "64 pages" },
      { label: "Format", value: "A5" },
      { label: "Reliure", value: "Agrafée" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "200g" },
      { label: "Dimensions", value: "14.8 x 21 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Souple" },
    ],
    reviews: [
      {
        id: 1,
        user: "Charlie",
        rating: 4,
        comment: "Pratique et solide.",
        date: "4 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 380, discount: 5 },
      { quantity: 10, unitPrice: 370, discount: 10 },
    ],
  },
  {
    id: "cahier-96p",
    name: "Cahier 96 pages",
    price: 500,
    image:
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    originalPrice: 600,
    isPromotion: true,
    promotionEndDate: new Date("2024-11-30"),
    inStock: true,
    category: "Cahiers",
    description: "Cahier grand format 96 pages, seyes",
    images: [
      "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
      "https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg",
    ],
    features: [
      { label: "Pages", value: "96 pages" },
      { label: "Format", value: "A4" },
      { label: "Reliure", value: "Spirale" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "400g" },
      { label: "Dimensions", value: "21 x 29.7 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Cartonnée" },
    ],
    reviews: [
      {
        id: 1,
        user: "David",
        rating: 5,
        comment: "Parfait pour la rentrée.",
        date: "5 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 480, discount: 5 },
      { quantity: 10, unitPrice: 460, discount: 10 },
    ],
  },
  {
    id: "cahier-120p",
    name: "Cahier 200 pages",
    price: 600,
    image:
      "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Cahiers",
    description: "Cahier grand format 200 pages",
    images: [
      "https://i.pinimg.com/736x/e5/44/ce/e544ce7cb84568b5b424144f80353325.jpg",
      "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    ],
    features: [
      { label: "Pages", value: "200 pages" },
      { label: "Format", value: "A4" },
      { label: "Reliure", value: "Spirale" },
      { label: "Couleur", value: "Blanc" },
    ],
    specs: [
      { label: "Poids", value: "500g" },
      { label: "Dimensions", value: "21 x 29.7 cm" },
      { label: "Matériau", value: "Papier standard" },
      { label: "Couverture", value: "Cartonnée" },
    ],
    reviews: [
      {
        id: 1,
        user: "Emma",
        rating: 5,
        comment: "Très bon cahier.",
        date: "6 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 580, discount: 5 },
      { quantity: 10, unitPrice: 560, discount: 10 },
    ],
  },

  // Stylos
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
    images: [
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
      "https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Bleu" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Eve",
        rating: 4,
        comment: "Bonne écriture.",
        date: "2 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  {
    id: "stylo-bille-noir",
    name: "Stylo Bille Noir",
    price: 100,
    image:
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo bille encre noire, pointe fine",
    images: [
      "https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg",
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Noir" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Franck",
        rating: 5,
        comment: "Excellent stylo.",
        date: "5 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  {
    id: "stylo-bille-rouge",
    name: "Stylo Bille Rouge",
    price: 100,
    image:
      "https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo bille encre rouge, pointe fine",
    images: [
      "https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg",
      "https://i.pinimg.com/1200x/38/4d/b4/384db45c3749c146649aa3c0cf257625.jpg",
    ],
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Rouge" },
      { label: "Pointe", value: "Fine" },
    ],
    specs: [
      { label: "Poids", value: "20g" },
      { label: "Dimensions", value: "14 cm" },
      { label: "Matériau", value: "Plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Gisèle",
        rating: 4,
        comment: "Bonne qualité.",
        date: "6 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 190, discount: 5 },
      { quantity: 10, unitPrice: 180, discount: 10 },
    ],
  },
  {
    id: "stylo-plume",
    name: "Stylo Plume",
    price: 1200,
    image:
      "https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Stylos",
    description: "Stylo plume avec recharge d'encre",
    images: [
      "https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg",
      "https://i.pinimg.com/1200x/63/ab/a6/63aba6b4baae61d3f6af75fc5c86e54b.jpg",
    ],
    features: [
      { label: "Type", value: "Plume" },
      { label: "Couleur encre", value: "Noir" },
      { label: "Recharge", value: "Oui" },
    ],
    specs: [
      { label: "Poids", value: "30g" },
      { label: "Dimensions", value: "15 cm" },
      { label: "Matériau", value: "Métal et plastique" },
    ],
    reviews: [
      {
        id: 1,
        user: "Hugo",
        rating: 5,
        comment: "Écriture fluide et agréable.",
        date: "7 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 5, unitPrice: 1150, discount: 5 },
      { quantity: 10, unitPrice: 1100, discount: 10 },
    ],
  },

  // Plus de produits... (raccourci pour l'exemple)
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
    images: [
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB",
      "https://placehold.co/600x400/FCF3CF/17202A?text=Crayon+HB-1",
    ],
    features: [
      { label: "Type", value: "HB" },
      { label: "Pour", value: "Écriture" },
    ],
    specs: [
      { label: "Poids", value: "10g" },
      { label: "Dimensions", value: "17 cm" },
      { label: "Matériau", value: "Bois" },
    ],
    reviews: [
      {
        id: 1,
        user: "Isabelle",
        rating: 5,
        comment: "Très bon crayon.",
        date: "8 août 2025",
      },
    ],
    bulkOptions: [
      { quantity: 10, unitPrice: 90, discount: 10 },
      { quantity: 20, unitPrice: 80, discount: 20 },
    ],
  },
];

// Fonctions de synchronisation
async function clearAllTables() {
  console.log("🗑️  Suppression de toutes les données existantes...");

  try {
    // Supprimer tous les packs
    console.log(`   🧹 Nettoyage de la table Packs (${PACKS_TABLE})...`);
    const existingPacks = await base(PACKS_TABLE).select().all();
    if (existingPacks.length > 0) {
      const packIds = existingPacks.map((record) => record.id);
      for (let i = 0; i < packIds.length; i += 10) {
        const batch = packIds.slice(i, i + 10);
        await base(PACKS_TABLE).destroy(batch);
      }
      console.log(`   ✅ ${existingPacks.length} packs supprimés`);
    } else {
      console.log(`   ℹ️  Table Packs déjà vide`);
    }

    // Supprimer tous les produits
    console.log(`   🧹 Nettoyage de la table Products (${PRODUCTS_TABLE})...`);
    try {
      const existingProducts = await base(PRODUCTS_TABLE).select().all();
      if (existingProducts.length > 0) {
        const productIds = existingProducts.map((record) => record.id);
        for (let i = 0; i < productIds.length; i += 10) {
          const batch = productIds.slice(i, i + 10);
          await base(PRODUCTS_TABLE).destroy(batch);
        }
        console.log(`   ✅ ${existingProducts.length} produits supprimés`);
      } else {
        console.log(`   ℹ️  Table Products déjà vide`);
      }
    } catch (error) {
      console.log(`   ⚠️  Table Products non accessible: ${error.message}`);
    }

    // Supprimer toutes les commandes (optionnel)
    console.log(`   🧹 Nettoyage de la table Orders (${ORDERS_TABLE})...`);
    try {
      const existingOrders = await base(ORDERS_TABLE).select().all();
      if (existingOrders.length > 0) {
        const orderIds = existingOrders.map((record) => record.id);
        for (let i = 0; i < orderIds.length; i += 10) {
          const batch = orderIds.slice(i, i + 10);
          await base(ORDERS_TABLE).destroy(batch);
        }
        console.log(`   ✅ ${existingOrders.length} commandes supprimées`);
      } else {
        console.log(`   ℹ️  Table Orders déjà vide`);
      }
    } catch (error) {
      console.log(`   ⚠️  Table Orders non accessible: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
  }
}

async function syncPacks() {
  console.log(`📦 Synchronisation des packs vers ${PACKS_TABLE}...`);

  try {
    const packsToCreate = PACKS_DATA.map((pack) => ({
      fields: {
        Name: pack.name,
        Level: pack.level,
        Price: pack.price,
        "Original Price": pack.originalPrice || pack.price,
        "Image URL": pack.image,
        Description: pack.description,
        Contents: pack.contents.join(", "),
        "Is Popular": pack.isPopular || false,
        "In Stock": pack.inStock,
        "Is Promotion": pack.isPromotion || false,
        "Promotion End Date": pack.promotionEndDate
          ? pack.promotionEndDate.toISOString().split("T")[0]
          : null,
        "Local ID": pack.id,
      },
    }));

    // Créer par lots de 10
    for (let i = 0; i < packsToCreate.length; i += 10) {
      const batch = packsToCreate.slice(i, i + 10);
      await base(PACKS_TABLE).create(batch);
    }

    console.log(`✅ ${PACKS_DATA.length} packs synchronisés`);
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation des packs:", error);
    console.error("Détail de l'erreur:", error.message);
  }
}

async function syncProducts() {
  console.log(`🛍️  Synchronisation des produits vers ${PRODUCTS_TABLE}...`);

  try {
    const productsToCreate = PRODUCTS_DATA.map((product) => ({
      fields: {
        Name: product.name,
        Price: product.price,
        "Original Price": product.originalPrice || product.price,
        "Image URL": product.image,
        Category: product.category,
        Description: product.description,
        "In Stock": product.inStock,
        "Is Promotion": product.isPromotion || false,
        "Promotion End Date": product.promotionEndDate
          ? product.promotionEndDate.toISOString().split("T")[0]
          : null,
        Images: Array.isArray(product.images)
          ? product.images.join(", ")
          : product.image,
        Features: product.features ? JSON.stringify(product.features) : "",
        Specs: product.specs ? JSON.stringify(product.specs) : "",
        Reviews: product.reviews ? JSON.stringify(product.reviews) : "",
        "Bulk Options": product.bulkOptions
          ? JSON.stringify(product.bulkOptions)
          : "",
        "Local ID": product.id,
      },
    }));

    // Créer par lots de 10
    for (let i = 0; i < productsToCreate.length; i += 10) {
      const batch = productsToCreate.slice(i, i + 10);
      await base(PRODUCTS_TABLE).create(batch);
    }

    console.log(`✅ ${PRODUCTS_DATA.length} produits synchronisés`);
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation des produits:", error);
    console.error("Détail de l'erreur:", error.message);
  }
}

async function fullSyncToSeparateTables() {
  console.log("🚀 Démarrage de la synchronisation vers des tables séparées...");
  console.log(`📊 Configuration des tables:`);
  console.log(`   - Packs: ${PACKS_TABLE}`);
  console.log(`   - Products: ${PRODUCTS_TABLE}`);
  console.log(`   - Orders: ${ORDERS_TABLE}`);
  console.log("");
  console.log(`📊 Données à synchroniser:`);
  console.log(`   - ${PACKS_DATA.length} packs`);
  console.log(`   - ${PRODUCTS_DATA.length} produits`);
  console.log("");

  await clearAllTables();
  await syncPacks();
  await syncProducts();

  console.log("");
  console.log("🎉 Synchronisation vers tables séparées terminée !");
  console.log("💡 Maintenant vous avez :");
  console.log("   📦 Les packs dans leur propre table");
  console.log("   🛍️  Les produits dans leur propre table");
  console.log("   📝 Les commandes dans leur propre table");
  console.log("");
  console.log("🔗 APIs disponibles :");
  console.log("   - /api/airtable/packs pour les packs");
  console.log("   - /api/airtable/products pour les produits");
}

// Exécuter le script
fullSyncToSeparateTables().catch(console.error);
