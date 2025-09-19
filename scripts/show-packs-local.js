#!/usr/bin/env node

/**
 * Script pour afficher les données locales de la table Packs
 * Usage: node scripts/show-packs-local.js
 */

// Données des packs (copiées depuis /server/api/airtable/packs.get.ts)
const packsData = [
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
      "1 Trousse complète",
      "1 Boîte de 12 feutres de couleur",
      "1 Kit de traçage (règle 30cm, équerre, rapporteur)",
      "1 Compas",
      "1 Agenda scolaire",
      "8 Protège-cahiers",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: false,
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
      "10 Cahiers 100p, 5cahiers 200P petit format",
      "3 Classeurs A4 souples",
      "1 Paquet de 200 copies doubles A4",
      "1 Paquet de 100 copies simples A4",
      "1 Trousse complète",
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
    isPromotion: false,
  },
  {
    id: "pack-cm1",
    name: "Pack Primaire CM1",
    level: "CM1",
    price: 24000,
    originalPrice: 28000,
    image:
      "https://i.pinimg.com/736x/1a/2b/3c/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.jpg",
    description: "Pack adapté aux exigences du CM1.",
    contents: [
      "12 Cahiers 192 pages",
      "1 Classeur A4",
      "1 Trousse complète",
      "1 Calculatrice scientifique",
      "1 Kit géométrie complet",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: false,
  },
  {
    id: "pack-cm2",
    name: "Pack Réussite CM2",
    level: "CM2",
    price: 26000,
    originalPrice: 30000,
    image:
      "https://i.pinimg.com/736x/2b/3c/4d/2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q.jpg",
    description: "Pack complet pour préparer l'entrée au collège.",
    contents: [
      "15 Cahiers 192 pages",
      "2 Classeurs A4",
      "1 Trousse complète",
      "1 Calculatrice scientifique",
      "1 Kit géométrie complet",
      "1 Dictionnaire",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-12-15"),
  },
];

console.log("📦 DONNÉES DES PACKS SCOLAIRES");
console.log("==============================");
console.log(`📊 Nombre total de packs: ${packsData.length}`);
console.log("");

// Afficher chaque pack
packsData.forEach((pack, index) => {
  console.log(`${index + 1}. 🎒 ${pack.name}`);
  console.log(`   🆔 ID: ${pack.id}`);
  console.log(`   📚 Niveau: ${pack.level}`);
  console.log(`   💰 Prix: ${pack.price.toLocaleString("fr-FR")} FCFA`);

  if (pack.originalPrice) {
    const discount = Math.round(
      ((pack.originalPrice - pack.price) / pack.originalPrice) * 100
    );
    console.log(
      `   💸 Prix original: ${pack.originalPrice.toLocaleString("fr-FR")} FCFA`
    );
    console.log(`   🏷️  Réduction: ${discount}%`);
  }

  console.log(`   📝 Description: ${pack.description}`);
  console.log(`   ⭐ Populaire: ${pack.isPopular ? "Oui" : "Non"}`);
  console.log(`   📦 En stock: ${pack.inStock ? "Oui" : "Non"}`);
  console.log(`   🔥 Promotion: ${pack.isPromotion ? "Oui" : "Non"}`);

  if (pack.promotionEndDate) {
    console.log(
      `   ⏰ Fin promotion: ${pack.promotionEndDate.toLocaleDateString(
        "fr-FR"
      )}`
    );
  }

  console.log(`   🖼️  Image: ${pack.image}`);
  console.log(`   📋 Contenu (${pack.contents.length} éléments):`);

  pack.contents.forEach((item, i) => {
    console.log(`      ${i + 1}. ${item}`);
  });

  console.log("   " + "─".repeat(60));
  console.log("");
});

// Statistiques
console.log("📈 STATISTIQUES GÉNÉRALES");
console.log("=========================");

const levels = [...new Set(packsData.map((pack) => pack.level))];
console.log(`🎯 Niveaux disponibles (${levels.length}): ${levels.join(", ")}`);

const popularPacks = packsData.filter((pack) => pack.isPopular).length;
console.log(
  `⭐ Packs populaires: ${popularPacks}/${packsData.length} (${Math.round(
    (popularPacks / packsData.length) * 100
  )}%)`
);

const promotions = packsData.filter((pack) => pack.isPromotion).length;
console.log(
  `🏷️  Packs en promotion: ${promotions}/${packsData.length} (${Math.round(
    (promotions / packsData.length) * 100
  )}%)`
);

const inStock = packsData.filter((pack) => pack.inStock).length;
console.log(
  `📦 Packs en stock: ${inStock}/${packsData.length} (${Math.round(
    (inStock / packsData.length) * 100
  )}%)`
);

const prices = packsData.map((pack) => pack.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

console.log("");
console.log("💰 ANALYSE DES PRIX");
console.log("==================");
console.log(`Prix minimum: ${minPrice.toLocaleString("fr-FR")} FCFA`);
console.log(`Prix maximum: ${maxPrice.toLocaleString("fr-FR")} FCFA`);
console.log(`Prix moyen: ${avgPrice.toLocaleString("fr-FR")} FCFA`);

// Analyse par niveau
console.log("");
console.log("📊 RÉPARTITION PAR NIVEAU");
console.log("=========================");
levels.forEach((level) => {
  const levelPacks = packsData.filter((pack) => pack.level === level);
  const levelPrices = levelPacks.map((pack) => pack.price);
  const levelAvg = Math.round(
    levelPrices.reduce((a, b) => a + b, 0) / levelPrices.length
  );
  console.log(
    `${level}: ${
      levelPacks.length
    } pack(s) - Prix moyen: ${levelAvg.toLocaleString("fr-FR")} FCFA`
  );
});

console.log("");
console.log("✅ Analyse terminée !");
