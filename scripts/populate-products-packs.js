#!/usr/bin/env node
// scripts/populate-products-packs.js
// Script pour ajouter plus de produits et packs d'exemple

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

const TABLES = {
  PRODUCTS: "tblxGbcySHadDtsyn",
  PACKS: "tbl4JVykOdi6YFvfd",
};

// Données d'exemple pour les produits
const ADDITIONAL_PRODUCTS = [
  {
    fields: {
      Name: "Cahier 96 pages grands carreaux",
      Price: 750,
      Category: "Cahiers",
      Image: "/images/products/cahier-96-gc.jpg",
      Description:
        "Cahier de qualité supérieure avec 96 pages grands carreaux, idéal pour les cours de français et d'histoire.",
      "In Stock": true,
      "Is Promotion": false,
    },
  },
  {
    fields: {
      Name: "Stylo BIC Cristal Bleu (Lot de 10)",
      Price: 1250,
      "Original Price": 1500,
      Category: "Stylos",
      Image: "/images/products/stylo-bic-bleu.jpg",
      Description:
        "Lot de 10 stylos BIC Cristal bleus. Écriture fluide et durable. Incontournable pour l'école !",
      "In Stock": true,
      "Is Promotion": true,
      "Promotion End Date": "2025-10-01",
    },
  },
  {
    fields: {
      Name: "Calculatrice Scientifique Casio FX-82MS",
      Price: 8500,
      Category: "Calculatrices",
      Image: "/images/products/casio-fx82ms.jpg",
      Description:
        "Calculatrice scientifique avec 240 fonctions. Parfaite pour le collège et le lycée. Conforme aux examens.",
      "In Stock": true,
      "Is Promotion": false,
    },
  },
  {
    fields: {
      Name: "Kit Géométrie Complet Maped",
      Price: 2500,
      "Original Price": 3200,
      Category: "Géométrie",
      Image: "/images/products/kit-geometrie-maped.jpg",
      Description:
        "Kit complet avec compas, équerre, rapporteur et règles. Qualité Maped pour un tracé précis.",
      "In Stock": true,
      "Is Promotion": true,
      "Promotion End Date": "2025-09-30",
    },
  },
  {
    fields: {
      Name: "Crayons de Couleur Faber-Castell (24 couleurs)",
      Price: 1800,
      Category: "Crayons",
      Image: "/images/products/crayons-faber-castell-24.jpg",
      Description:
        "Boîte de 24 crayons de couleur Faber-Castell. Couleurs vives et pigmentées pour les cours d'arts plastiques.",
      "In Stock": true,
      "Is Promotion": false,
    },
  },
];

// Données d'exemple pour les packs
const ADDITIONAL_PACKS = [
  {
    fields: {
      Name: "Pack Lycée Scientifique - Terminale S",
      Level: "Terminale",
      Price: 45000,
      "Original Price": 55000,
      Image: "/images/packs/pack-terminale-s.jpg",
      Description:
        "Pack complet spécialement conçu pour les élèves de Terminale S. Tout le matériel pour réussir le BAC !",
      Contents: JSON.stringify([
        "Calculatrice graphique TI-82",
        "Kit géométrie professionnel",
        "10 cahiers grands formats",
        "Trousse complète (stylos, surligneurs)",
        "Rapporteur et compas de précision",
        "Bloc de feuilles A4 perforées (500 feuilles)",
        "6 classeurs A4 rigides",
        "Intercalaires et pochettes plastiques",
      ]),
      "Is Popular": true,
      "In Stock": true,
      "Is Promotion": true,
      "Promotion End Date": "2025-09-25",
    },
  },
  {
    fields: {
      Name: "Pack Art & Créativité - Primaire",
      Level: "Primaire",
      Price: 6500,
      "Original Price": 8000,
      Image: "/images/packs/pack-art-primaire.jpg",
      Description:
        "Éveillez la créativité de votre enfant avec ce pack artistique complet pour le primaire.",
      Contents: JSON.stringify([
        "24 crayons de couleur",
        "12 feutres lavables",
        "Set de peinture acrylique (6 couleurs)",
        "4 pinceaux différentes tailles",
        "Papier dessin A4 (50 feuilles)",
        "Gomme malléable",
        "Taille-crayon réservoir",
        "Cahier de dessin spiralé",
      ]),
      "Is Popular": false,
      "In Stock": true,
      "Is Promotion": true,
      "Promotion End Date": "2025-09-20",
    },
  },
];

async function createRecords(tableId, records) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erreur ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Erreur lors de l'ajout des enregistrements:`, error);
    throw error;
  }
}

async function populateProductsAndPacks() {
  console.log("🛒 AJOUT DE PRODUITS ET PACKS SUPPLÉMENTAIRES");
  console.log("=".repeat(55));

  try {
    // 1. Ajouter les produits supplémentaires
    console.log("\n📦 Ajout de produits supplémentaires...");
    const productsResult = await createRecords(
      TABLES.PRODUCTS,
      ADDITIONAL_PRODUCTS
    );
    console.log(`✅ ${productsResult.records.length} produits ajoutés`);

    // 2. Ajouter les packs supplémentaires
    console.log("\n🎒 Ajout de packs supplémentaires...");
    const packsResult = await createRecords(TABLES.PACKS, ADDITIONAL_PACKS);
    console.log(`✅ ${packsResult.records.length} packs ajoutés`);

    console.log("\n🎉 PRODUITS ET PACKS AJOUTÉS AVEC SUCCÈS !");
    console.log("=".repeat(55));
    console.log(`📦 Nouveaux produits: ${productsResult.records.length}`);
    console.log(`🎒 Nouveaux packs: ${packsResult.records.length}`);

    console.log("\n🔗 LIENS DE VÉRIFICATION:");
    console.log(`API Produits: http://localhost:3000/api/airtable/products`);
    console.log(`API Packs: http://localhost:3000/api/airtable/packs`);
    console.log(`Page Produits: http://localhost:3000/products`);
    console.log(`Page Packs: http://localhost:3000/packs`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des produits/packs:", error);
    process.exit(1);
  }
}

// Exécution du script
populateProductsAndPacks().catch(console.error);
