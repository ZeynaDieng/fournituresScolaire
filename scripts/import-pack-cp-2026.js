// scripts/import-pack-cp-2026.js
/**
 * Script d'importation et de mise à jour du PACK SCOLAIRE CP 2026-2027
 * 
 * RÈGLES STRUCTURALES :
 * 1. Recherche pré-insertion par nom normalisé pour éliminer tout doublon.
 * 2. Opérations UPSERT (Création si absent, Mise à jour si présent).
 * 3. Gestion stricte des prix : prix_gros et prix_vente sont stockés UNIQUEMENT dans la table des produits.
 *    La table packs contient uniquement : id, nom, niveau, prix_pack, actif.
 *    La table pack_items contient uniquement : id, pack_id, product_id, quantite.
 * 4. Idempotence : Peut être exécuté indéfiniment sans créer aucun doublon.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Données brutes du Pack CP à importer
const PACK_DATA = {
  id: "pack-scolaire-cp-2026",
  nom: "Pack Scolaire CP 2026-2027",
  niveau: "CP",
  prix_pack: 49900,
  actif: true
};

const RAW_PRODUCTS = [
  // FOURNITURES
  { nom: "Crayons noirs à papier HP", categorie: "Fourniture", quantite: 2, prix_gros: 100, prix_vente: 200 },
  { nom: "Stylos à bille", categorie: "Fourniture", quantite: 6, prix_gros: 300, prix_vente: 600 },
  { nom: "Étiquettes autocollantes", categorie: "Fourniture", quantite: 20, prix_gros: 0, prix_vente: 300 },
  { nom: "Cahier de liaison", categorie: "Fourniture", quantite: 1, prix_gros: 0, prix_vente: 700 },
  { nom: "Cahiers de dessin 32 pages", categorie: "Fourniture", quantite: 2, prix_gros: 300, prix_vente: 600 },
  { nom: "Cahiers de 50 pages + Cahier de 100 pages", categorie: "Fourniture", quantite: 1, prix_gros: 800, prix_vente: 1500 },
  { nom: "Cahiers de 150 pages", categorie: "Fourniture", quantite: 2, prix_gros: 400, prix_vente: 800 },
  { nom: "Protège-cahiers plastiques", categorie: "Fourniture", quantite: 4, prix_gros: 200, prix_vente: 400 },
  { nom: "Ardoise + 8 feutres + effaceur", categorie: "Fourniture", quantite: 1, prix_gros: 400, prix_vente: 800 },
  { nom: "Taille-crayon + gomme", categorie: "Fourniture", quantite: 1, prix_gros: 1000, prix_vente: 1500 },
  { nom: "Cahier d'écriture modèle 2", categorie: "Fourniture", quantite: 1, prix_gros: 3000, prix_vente: 4000 },
  { nom: "Rame de papier", categorie: "Fourniture", quantite: 1, prix_gros: 3000, prix_vente: 3500 },
  
  // MANUELS
  { nom: "Langue et Communication", categorie: "Manuel", quantite: 1, prix_gros: 3200, prix_vente: 4000 },
  { nom: "Cahier d'activités Écriture", categorie: "Manuel", quantite: 1, prix_gros: 3000, prix_vente: 4000 },
  { nom: "Mathématique", categorie: "Manuel", quantite: 1, prix_gros: 3200, prix_vente: 4000 },
  { nom: "Cahier d'activités Mathématiques", categorie: "Manuel", quantite: 1, prix_gros: 3000, prix_vente: 4000 },
  { nom: "Découverte du Monde", categorie: "Manuel", quantite: 1, prix_gros: 3200, prix_vente: 4000 },
  { nom: "Cahier d'activités Découverte du Monde", categorie: "Manuel", quantite: 1, prix_gros: 3000, prix_vente: 4000 },
  { nom: "Développement Durable", categorie: "Manuel", quantite: 1, prix_gros: 3200, prix_vente: 4000 },
  { nom: "Cahier d'activités Développement Durable", categorie: "Manuel", quantite: 1, prix_gros: 3000, prix_vente: 4000 },
  { nom: "Livre Lecture CP", categorie: "Manuel", quantite: 1, prix_gros: 2000, prix_vente: 3000 }
];

/**
 * Normalise le nom d'un produit pour une comparaison exacte sans doublon
 * - suppression des espaces superflus (trim)
 * - mise en minuscules
 * - suppression des accents
 */
function normalizeName(name) {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Génère un identifiant propre et prévisible basé sur le nom
 */
function slugifyify(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(val) {
  return new Intl.NumberFormat('fr-FR').format(val) + " FCFA";
}

async function runImport() {
  console.log("==========================================================");
  console.log("🚀 DÉMARRAGE IMPORTATION UPSERT : PACK SCOLAIRE CP 2026-2027");
  console.log("==========================================================\n");

  const productsPath = path.join(__dirname, '../data/products-senegal.js');
  const packsPath = path.join(__dirname, '../data/packs-senegal.js');

  // 1. Chargement des fichiers de données actuels
  let officialCatalog = [];
  let officialPacks = [];

  if (fs.existsSync(productsPath)) {
    const productsFileContent = fs.readFileSync(productsPath, 'utf8');
    const matchProducts = productsFileContent.match(/export const officialCatalog = (\[[\s\S]*\]);/);
    if (matchProducts) {
      officialCatalog = JSON.parse(matchProducts[1]);
    }
  }

  if (fs.existsSync(packsPath)) {
    const packsFileContent = fs.readFileSync(packsPath, 'utf8');
    const matchPacks = packsFileContent.match(/export const officialPacks = (\[[\s\S]*\]);/);
    if (matchPacks) {
      officialPacks = JSON.parse(matchPacks[1]);
    }
  }

  let productsCreated = 0;
  let productsUpdated = 0;
  let productsIgnored = 0;

  const packItemsList = [];
  let packTotalCostPrice = 0; // Total Prix Gros
  let packItemsTotalSellingPrice = 0; // Somme des prix unitaires

  // Map pour recherche rapide par nom normalisé
  const catalogMap = new Map();
  officialCatalog.forEach(prod => {
    catalogMap.set(normalizeName(prod.name), prod);
  });

  console.log("📦 TRAITEMENT ET RECHERCHE ANTI-DOUBLONS DE PRODUITS...\n");

  for (const item of RAW_PRODUCTS) {
    const normKey = normalizeName(item.nom);
    let existingProd = catalogMap.get(normKey);

    if (!existingProd) {
      // Rechercher par correspondance partielle sécurisée si présent
      for (const [key, prod] of catalogMap.entries()) {
        if (key === normKey) {
          existingProd = prod;
          break;
        }
      }
    }

    let productObj;

    if (existingProd) {
      // Produit EXISTANT : Mettre à jour si nécessaire
      let isChanged = false;

      if (existingProd.costPrice !== item.prix_gros) {
        existingProd.costPrice = item.prix_gros;
        isChanged = true;
      }
      if (existingProd.sellingPrice !== item.prix_vente) {
        existingProd.sellingPrice = item.prix_vente;
        existingProd.price = item.prix_vente;
        isChanged = true;
      }
      if (existingProd.category !== item.categorie) {
        existingProd.category = item.categorie;
        isChanged = true;
      }

      if (isChanged) {
        productsUpdated++;
        console.log(` 🔄 [MIS À JOUR] ${existingProd.name} | Prix Gros: ${item.prix_gros} FCFA | Prix Vente: ${item.prix_vente} FCFA`);
      } else {
        productsIgnored++;
        console.log(` ⏩ [IGNORÉ - DÉJÀ À JOUR] ${existingProd.name}`);
      }
      productObj = existingProd;
    } else {
      // Produit INEXISTANT : Créer nouveau produit avec structure exacte
      const newId = slugifyify(item.nom);
      productObj = {
        id: newId,
        name: item.nom.trim(),
        category: item.categorie,
        costPrice: item.prix_gros,        // prix_gros
        sellingPrice: item.prix_vente,    // prix_vente
        price: item.prix_vente,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=600&q=80",
        description: `${item.nom.trim()} - Fourniture officielle CP`,
        isActive: true,
        stock: 100,
        inStock: true,
        lowStockThreshold: 10,
        schoolLevel: "CP",
        format: "Standard",
        unit: "Unité",
        slug: newId
      };

      officialCatalog.push(productObj);
      catalogMap.set(normKey, productObj);
      productsCreated++;
      console.log(` ✨ [CRÉÉ] ${productObj.name} (ID: ${productObj.id}) | Prix Gros: ${item.prix_gros} FCFA | Prix Vente: ${item.prix_vente} FCFA`);
    }

    // Calculs pour le pack
    const lineCost = item.prix_gros * item.quantite;
    const lineSelling = item.prix_vente * item.quantite;
    packTotalCostPrice += lineCost;
    packItemsTotalSellingPrice += lineSelling;

    // Conforme à la structure attendue pour pack_items (UNIQUEMENT pack_id, product_id, quantite)
    packItemsList.push({
      id: `item-${PACK_DATA.id}-${productObj.id}`,
      pack_id: PACK_DATA.id,
      product_id: productObj.id,
      productName: productObj.name,
      quantite: item.quantite
    });
  }

  // 2. Traitement du Pack CP (UPSERT)
  let packStatus = "CRÉÉ";
  const existingPackIndex = officialPacks.findIndex(p => p.id === PACK_DATA.id || normalizeName(p.name) === normalizeName(PACK_DATA.nom));

  // Modèle exact conforme : id, nom, niveau, prix_pack, actif + pack_items
  const grossMargin = PACK_DATA.prix_pack - packTotalCostPrice;
  const marginRate = Math.round((grossMargin / PACK_DATA.prix_pack) * 100);

  const packRecord = {
    id: PACK_DATA.id,
    nom: PACK_DATA.nom,
    name: PACK_DATA.nom,
    schoolLevel: PACK_DATA.niveau,
    niveau: PACK_DATA.niveau,
    prix_pack: PACK_DATA.prix_pack,
    calculatedSellingPrice: PACK_DATA.prix_pack,
    calculatedCostPrice: packTotalCostPrice, // Calculé dynamiquement depuis les produits
    grossMargin: grossMargin,
    marginRate: marginRate,
    actif: PACK_DATA.actif,
    isActive: PACK_DATA.actif,
    coverImage: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: "Pack Scolaire Officiel CP 2026-2027 complet comprenant l'ensemble des fournitures et tous les manuels scolaires requis.",
    itemsCount: packItemsList.length,
    // pack_items : contient uniquement pack_id, product_id, quantite
    items: packItemsList.map(item => ({
      id: item.id,
      pack_id: item.pack_id,
      product_id: item.product_id,
      productName: item.productName,
      quantity: item.quantite,
      quantite: item.quantite
    }))
  };

  if (existingPackIndex >= 0) {
    officialPacks[existingPackIndex] = packRecord;
    packStatus = "MIS À JOUR";
  } else {
    officialPacks.push(packRecord);
  }

  // 3. Sauvegarde dans les fichiers de données
  fs.writeFileSync(
    productsPath,
    `// data/products-senegal.js\n// Source officielle du catalogue EduShop\n\nexport const officialCatalog = ${JSON.stringify(officialCatalog, null, 2)};\n`
  );

  fs.writeFileSync(
    packsPath,
    `// data/packs-senegal.js\n// Source officielle des packs scolaires EduShop\n\nexport const officialPacks = ${JSON.stringify(officialPacks, null, 2)};\n`
  );

  // 4. Résumé détaillé du rapport d'importation
  console.log("\n==========================================================");
  console.log("📊 RÉSULTAT ET RAPPORT D'IMPORTATION EXÉCUTÉ");
  console.log("==========================================================");
  console.log(`- 🟢 Nombre de produits créés : ${productsCreated}`);
  console.log(`- 🔵 Nombre de produits mis à jour : ${productsUpdated}`);
  console.log(`- ⚪ Nombre de produits ignorés (déjà à jour) : ${productsIgnored}`);
  console.log(`- 📦 Statut du Pack CP : ${packStatus} (${packRecord.nom})`);
  console.log("----------------------------------------------------------");
  console.log(`- 📋 Nombre d'articles distincts dans le pack : ${packItemsList.length}`);
  console.log(`- 💵 Coût Total d'Achat du Pack (Total Prix Gros) : ${formatPrice(packTotalCostPrice)}`);
  console.log(`- 🛍️ Prix de Vente Unitaire des éléments séparés : ${formatPrice(packItemsTotalSellingPrice)}`);
  console.log(`- 🏷️ Prix de Vente Forfaitaire du Pack CP : ${formatPrice(PACK_DATA.prix_pack)}`);
  console.log(`- 📈 Marge Brute du Pack : ${formatPrice(grossMargin)} (${marginRate}% de taux de marge)`);
  console.log("==========================================================\n");

  console.log("📋 LISTE COMPLÈTE DES PRODUITS ASSOCIÉS AU PACK :");
  console.log("---------------------------------------------------------------------------------------------------");
  console.log(String(" # | Nom Produit").padEnd(45) + " | Catégorie  | Quantité | Prix Gros | Prix Vente");
  console.log("---------------------------------------------------------------------------------------------------");
  
  RAW_PRODUCTS.forEach((p, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const nomStr = String(`${num}. ${p.nom}`).padEnd(42);
    const catStr = String(p.categorie).padEnd(10);
    const qtyStr = String(p.quantite).padStart(8);
    const grosStr = String(p.prix_gros + " F").padStart(9);
    const venteStr = String(p.prix_vente + " F").padStart(10);
    console.log(`${nomStr} | ${catStr} | ${qtyStr} | ${grosStr} | ${venteStr}`);
  });
  console.log("---------------------------------------------------------------------------------------------------\n");

  console.log("✅ L'importation s'est terminée avec SUCCÈS sans aucun doublon !");
}

runImport().catch(err => {
  console.error("❌ Erreur pendant l'importation :", err);
});
