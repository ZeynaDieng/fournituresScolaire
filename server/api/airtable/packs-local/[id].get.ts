import { defineEventHandler, createError, getRouterParam } from "h3";

// Données locales des packs (identiques à packs-local.get.ts)
const localPacks = [
  {
    id: "pack-cp",
    name: "Pack Essentiel CP-CI",
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
    id: "pack-ce1",
    name: "Pack Complet CE1",
    level: "CE1",
    price: 21000,
    originalPrice: 25000,
    image:
      "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    description: "Un pack complet pour les élèves du Cours Élémentaire 1.",
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
    id: "pack-ce2",
    name: "Pack Excellence CE2",
    level: "CE2",
    price: 22500,
    originalPrice: 26000,
    image:
      "https://i.pinimg.com/736x/8f/9e/2d/8f9e2d5c7b8a9e1f2d3c4b5a6e7f8g9h.jpg",
    description: "Pack optimisé pour la réussite en CE2.",
    contents: [
      "10 Cahiers 96 pages",
      "5 Cahiers 192 pages",
      "1 Trousse complète",
      "1 Kit géométrie avancé",
      "1 Calculatrice",
      "1 Agenda scolaire",
    ],
    isPopular: false,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-11-30"),
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
      "10 Cahiers 100p",
      "5cahiers 200P patit format",
      "3 Classeurs A4 souples",
      "1 Paquet de 200 copies doubles A4",
      "1 Paquet de 100 copies simples A4",
      "1 Trousse complète ",
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
    id: "pack-terminale",
    name: "Pack Lycée",
    level: "Terminale",
    price: 42000,
    originalPrice: 48000,
    image:
      "https://i.pinimg.com/736x/5e/6f/7g/5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t.jpg",
    description: "Pack spécialisé pour la classe de Terminale.",
    contents: [
      "6 Classeurs A4 rigides",
      "1 Paquet de 500 copies doubles A4",
      "1 Calculatrice graphique avancée",
      "1 Kit géométrie professionnel",
      "1 Agenda de Terminale",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2024-12-20"),
  },
];

export default defineEventHandler(async (event) => {
  try {
    const packId = getRouterParam(event, "id");

    if (!packId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Pack ID is required",
      });
    }

    console.log("🔍 Recherche du pack local avec ID:", packId);

    // Trouver le pack dans les données locales
    const foundPack = localPacks.find((pack) => pack.id === packId);

    if (!foundPack) {
      throw createError({
        statusCode: 404,
        statusMessage: `Pack with ID ${packId} not found`,
      });
    }

    console.log("✅ Pack trouvé:", foundPack.name);

    return {
      success: true,
      data: foundPack,
    };
  } catch (error: any) {
    console.error("❌ Erreur lors de la récupération du pack local:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal server error",
    });
  }
});
