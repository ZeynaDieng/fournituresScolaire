// scripts/full-sync-airtable.js
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// Données statiques du store (copiées pour éviter les imports complexes)
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
    images: [
      "https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg",
      "https://i.pinimg.com/736x/bb/d8/a2/bbd8a25b8d8337928749a63520a30e7c.jpg",
    ],
  },
  // Ajoutez plus de produits selon vos besoins...
];

async function clearAllData() {
  console.log("🗑️  Suppression de toutes les données existantes...");

  try {
    // Supprimer tous les packs
    const existingPacks = await base("Packs").select().all();
    if (existingPacks.length > 0) {
      const packIds = existingPacks.map((record) => record.id);
      // Supprimer par lots de 10 (limite Airtable)
      for (let i = 0; i < packIds.length; i += 10) {
        const batch = packIds.slice(i, i + 10);
        await base("Packs").destroy(batch);
      }
      console.log(`✅ ${existingPacks.length} packs supprimés`);
    }

    // Supprimer tous les produits
    const existingProducts = await base("Products").select().all();
    if (existingProducts.length > 0) {
      const productIds = existingProducts.map((record) => record.id);
      for (let i = 0; i < productIds.length; i += 10) {
        const batch = productIds.slice(i, i + 10);
        await base("Products").destroy(batch);
      }
      console.log(`✅ ${existingProducts.length} produits supprimés`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
  }
}

async function syncPacks() {
  console.log("📦 Synchronisation des packs...");

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
      await base("Packs").create(batch);
    }

    console.log(`✅ ${PACKS_DATA.length} packs synchronisés`);
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation des packs:", error);
  }
}

async function syncProducts() {
  console.log("🛍️  Synchronisation des produits...");

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
      await base("Products").create(batch);
    }

    console.log(`✅ ${PRODUCTS_DATA.length} produits synchronisés`);
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation des produits:", error);
  }
}

async function fullSync() {
  console.log("🚀 Démarrage de la synchronisation complète...");

  await clearAllData();
  await syncPacks();
  await syncProducts();

  console.log("🎉 Synchronisation terminée avec succès !");
}

// Exécuter le script
fullSync().catch(console.error);
