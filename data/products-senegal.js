// data/products-senegal.js
// Base de données des produits pour le marché sénégalais

export const senegaleseProducts = {
  // Cahiers - Prix en FCFA
  cahiers: [
    {
      name: "Cahier 96 pages grands carreaux",
      price: 750,
      category: "Cahiers",
      supplier: "Papeterie Dakar",
      inStock: true,
      specs: { pages: 96, format: "A4", reglure: "Grands carreaux" },
    },
    {
      name: "Cahier 48 pages petits carreaux",
      price: 450,
      category: "Cahiers",
      supplier: "Papeterie Dakar",
      inStock: true,
      specs: { pages: 48, format: "A4", reglure: "Petits carreaux" },
    },
    {
      name: "Cahier de dessin 32 pages",
      price: 600,
      category: "Cahiers",
      supplier: "Papeterie Dakar",
      inStock: true,
      specs: { pages: 32, format: "A4", type: "Dessin" },
    },
  ],

  // Stylos - Prix en FCFA
  stylos: [
    {
      name: "Stylo BIC Cristal - Bleu",
      price: 125,
      category: "Stylos",
      supplier: "BIC Sénégal",
      inStock: true,
      specs: { marque: "BIC", couleur: "Bleu", type: "Bille" },
    },
    {
      name: "Stylo BIC Cristal - Rouge",
      price: 125,
      category: "Stylos",
      supplier: "BIC Sénégal",
      inStock: true,
      specs: { marque: "BIC", couleur: "Rouge", type: "Bille" },
    },
    {
      name: "Stylo BIC Cristal - Noir",
      price: 125,
      category: "Stylos",
      supplier: "BIC Sénégal",
      inStock: true,
      specs: { marque: "BIC", couleur: "Noir", type: "Bille" },
    },
  ],

  // Matériel de géométrie
  geometrie: [
    {
      name: "Règle 30cm",
      price: 350,
      category: "Géométrie",
      supplier: "Maped Sénégal",
      inStock: true,
      specs: { longueur: "30cm", matiere: "Plastique" },
    },
    {
      name: "Équerre 21cm",
      price: 450,
      category: "Géométrie",
      supplier: "Maped Sénégal",
      inStock: true,
      specs: { taille: "21cm", angle: "90°" },
    },
    {
      name: "Compas simple",
      price: 850,
      category: "Géométrie",
      supplier: "Maped Sénégal",
      inStock: true,
      specs: { type: "Simple", matiere: "Métal et plastique" },
    },
    {
      name: "Rapporteur 180°",
      price: 300,
      category: "Géométrie",
      supplier: "Maped Sénégal",
      inStock: true,
      specs: { angle: "180°", matiere: "Plastique transparent" },
    },
  ],

  // Calculatrices
  calculatrices: [
    {
      name: "Calculatrice Casio FX-82MS",
      price: 8500,
      category: "Calculatrices",
      supplier: "Casio Sénégal",
      inStock: true,
      specs: { marque: "Casio", modele: "FX-82MS", fonctions: 240 },
    },
    {
      name: "Calculatrice simple 8 chiffres",
      price: 2500,
      category: "Calculatrices",
      supplier: "Local",
      inStock: true,
      specs: { type: "Basique", chiffres: 8 },
    },
  ],

  // Crayons et couleurs
  crayons: [
    {
      name: "Crayons de couleur 12 couleurs",
      price: 1800,
      category: "Crayons",
      supplier: "Faber Castell",
      inStock: true,
      specs: { couleurs: 12, marque: "Faber Castell" },
    },
    {
      name: "Crayons de couleur 24 couleurs",
      price: 3200,
      category: "Crayons",
      supplier: "Faber Castell",
      inStock: true,
      specs: { couleurs: 24, marque: "Faber Castell" },
    },
    {
      name: "Crayon HB (à l'unité)",
      price: 75,
      category: "Crayons",
      supplier: "Local",
      inStock: true,
      specs: { durete: "HB", type: "Graphite" },
    },
  ],
};

export const senegalesePacks = {
  primaire: [
    {
      name: "Pack CP Complet",
      level: "CP",
      price: 22500,
      originalPrice: 27000,
      contents: [
        "5 Cahiers d'écriture 32 pages",
        "3 Cahiers de dessin",
        "1 Ardoise + craies",
        "12 Crayons de couleur",
        "4 Stylos à bille",
        "2 Crayons HB",
        "1 Gomme",
        "1 Taille-crayon",
        "1 Règle 20cm",
        "1 Trousse",
      ],
      isPopular: true,
    },
    {
      name: "Pack CE1 Standard",
      level: "CE1",
      price: 26500,
      originalPrice: 32000,
      contents: [
        "6 Cahiers 48 pages",
        "3 Cahiers de dessin",
        "12 Crayons de couleur",
        "6 Stylos couleurs",
        "1 Règle 30cm",
        "1 Équerre",
        "1 Compas simple",
        "1 Cartable",
      ],
      isPopular: true,
    },
  ],

  college: [
    {
      name: "Pack 6ème Complet",
      level: "6ème",
      price: 45500,
      originalPrice: 52000,
      contents: [
        "12 Cahiers 96 pages",
        "6 Cahiers petits carreaux",
        "1 Kit géométrie complet",
        "1 Calculatrice scientifique",
        "12 Stylos couleurs",
        "6 Classeurs A4",
        "1 Sac à dos",
        "1 Agenda scolaire",
      ],
      isPopular: true,
    },
  ],
};

export const senegalesePromotions = [
  {
    title: "Rentrée Scolaire 2025",
    description: "Réduction sur tous les packs scolaires",
    discount: 15,
    type: "percentage",
    endDate: "2025-10-31",
  },
  {
    title: "Pack Famille",
    description: "Réduction famille nombreuse - 3 enfants ou +",
    discount: 20,
    type: "family_bulk",
    endDate: "2025-12-31",
  },
];
