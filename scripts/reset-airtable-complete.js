// scripts/reset-airtable-complete.js
import Airtable from "airtable";
import { config } from "dotenv";

config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

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
    promotionEndDate: "2024-12-31",
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
    isPromotion: false,
    promotionEndDate: null,
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
    promotionEndDate: "2024-12-15",
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
    isPromotion: false,
    promotionEndDate: null,
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
    features: [
      { label: "Type", value: "Bille" },
      { label: "Couleur encre", value: "Bleu" },
      { label: "Pointe", value: "Fine" },
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
  {
    id: "calculatrice-scientifique",
    name: "Calculatrice Scientifique",
    price: 12000,
    image:
      "https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg",
    originalPrice: null,
    isPromotion: false,
    inStock: true,
    category: "Calculatrices",
    description: "Calculatrice scientifique programmable",
  },
  {
    id: "sac-a-dos-enfant",
    name: "Sac à dos enfant",
    price: 8000,
    image:
      "https://i.pinimg.com/1200x/66/9d/4d/669d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg",
    originalPrice: 10000,
    isPromotion: true,
    inStock: true,
    promotionEndDate: "2024-12-20",
    category: "Sacs",
    description: "Sac à dos coloré et résistant pour enfants",
  },
];

async function clearAllData() {
  console.log("🗑️  Suppression complète de toutes les données...");

  try {
    // Supprimer tous les packs existants
    const existingPacks = await base("Packs").select().all();
    if (existingPacks.length > 0) {
      console.log(
        `📦 Suppression de ${existingPacks.length} packs existants...`
      );
      const packIds = existingPacks.map((record) => record.id);
      for (let i = 0; i < packIds.length; i += 10) {
        const batch = packIds.slice(i, i + 10);
        await base("Packs").destroy(batch);
      }
      console.log("✅ Packs supprimés");
    } else {
      console.log("ℹ️  Aucun pack à supprimer");
    }

    // Supprimer tous les produits existants
    try {
      const existingProducts = await base("Products").select().all();
      if (existingProducts.length > 0) {
        console.log(
          `🛍️  Suppression de ${existingProducts.length} produits existants...`
        );
        const productIds = existingProducts.map((record) => record.id);
        for (let i = 0; i < productIds.length; i += 10) {
          const batch = productIds.slice(i, i + 10);
          await base("Products").destroy(batch);
        }
        console.log("✅ Produits supprimés");
      } else {
        console.log("ℹ️  Aucun produit à supprimer");
      }
    } catch (error) {
      console.log("ℹ️  Table Products n'existe pas encore");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
    throw error;
  }
}

async function createPacksInAirtable() {
  console.log("📦 Création des packs dans Airtable...");

  try {
    const packsToCreate = PACKS_DATA.map((pack) => ({
      fields: {
        // On utilise la structure actuelle d'Airtable
        Description: `${pack.description}. ${pack.name}`,
        Level: pack.level,
        Price: pack.price,
        "Original Price": pack.originalPrice || pack.price,
        Contents: pack.contents.join(", "),
        "Is Popular": pack.isPopular || false,
        "In Stock": pack.inStock,
        "Is Promotion": pack.isPromotion || false,
        "Promotion End Date": pack.promotionEndDate,
      },
    }));

    // Créer par lots de 10 (limite Airtable)
    for (let i = 0; i < packsToCreate.length; i += 10) {
      const batch = packsToCreate.slice(i, i + 10);
      const created = await base("Packs").create(batch);
      console.log(
        `✅ Lot ${Math.floor(i / 10) + 1}: ${created.length} packs créés`
      );
    }

    console.log(`🎉 Total: ${PACKS_DATA.length} packs ajoutés avec succès !`);
  } catch (error) {
    console.error("❌ Erreur lors de la création des packs:", error);
    throw error;
  }
}

async function createProductsInAirtable() {
  console.log("🛍️  Création des produits dans Airtable...");

  try {
    // Créer une table Products si elle n'existe pas
    // On va utiliser la même structure que les Packs pour commencer
    const productsToCreate = PRODUCTS_DATA.map((product) => ({
      fields: {
        Description: `${product.description}. ${product.name}`,
        Level: product.category, // On utilise Level pour la catégorie
        Price: product.price,
        "Original Price": product.originalPrice || product.price,
        Contents: JSON.stringify({
          id: product.id,
          category: product.category,
          features: product.features || [],
          specs: product.specs || [],
          reviews: product.reviews || [],
          bulkOptions: product.bulkOptions || [],
          images: product.images || [product.image],
        }),
        "Is Popular": false, // Les produits ne sont pas "populaires" par défaut
        "In Stock": product.inStock,
        "Is Promotion": product.isPromotion || false,
        "Promotion End Date": product.promotionEndDate || null,
      },
    }));

    // Essayer d'abord avec la table Products
    try {
      for (let i = 0; i < productsToCreate.length; i += 10) {
        const batch = productsToCreate.slice(i, i + 10);
        const created = await base("Products").create(batch);
        console.log(
          `✅ Lot ${Math.floor(i / 10) + 1}: ${created.length} produits créés`
        );
      }
      console.log(
        `🎉 Total: ${PRODUCTS_DATA.length} produits ajoutés à la table Products !`
      );
    } catch (error) {
      if (error.message.includes("NOT_FOUND")) {
        console.log(
          "⚠️  Table Products non trouvée, ajout dans la table Packs..."
        );

        // Fallback: ajouter à la table Packs avec un marqueur
        const productsForPacks = productsToCreate.map((product) => ({
          fields: {
            ...product.fields,
            Description: `[PRODUIT] ${product.fields.Description}`,
          },
        }));

        for (let i = 0; i < productsForPacks.length; i += 10) {
          const batch = productsForPacks.slice(i, i + 10);
          const created = await base("Packs").create(batch);
          console.log(
            `✅ Lot ${Math.floor(i / 10) + 1}: ${
              created.length
            } produits ajoutés à Packs`
          );
        }
        console.log(
          `🎉 Total: ${PRODUCTS_DATA.length} produits ajoutés à la table Packs !`
        );
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création des produits:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 RESET COMPLET D'AIRTABLE - Transfert du store local");
  console.log("=".repeat(60));

  try {
    // 1. Vider complètement la base
    await clearAllData();

    console.log("\n" + "⏱️  Pause de 2 secondes...".padEnd(60));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Recréer tous les packs
    await createPacksInAirtable();

    console.log("\n" + "⏱️  Pause de 2 secondes...".padEnd(60));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Recréer tous les produits
    await createProductsInAirtable();

    console.log("\n" + "=".repeat(60));
    console.log("🎉 SUCCÈS COMPLET !");
    console.log("📊 Données transférées:");
    console.log(`   • ${PACKS_DATA.length} packs scolaires`);
    console.log(`   • ${PRODUCTS_DATA.length} produits individuels`);
    console.log("\n💡 Tu peux maintenant:");
    console.log("   1. Aller sur airtable.com");
    console.log("   2. Modifier directement les données");
    console.log("   3. Le site se mettra à jour automatiquement !");
    console.log("\n🔗 Lien Airtable: https://airtable.com/");
  } catch (error) {
    console.error("\n❌ ERREUR CRITIQUE:", error);
    process.exit(1);
  }
}

// Exécuter le script
main();
