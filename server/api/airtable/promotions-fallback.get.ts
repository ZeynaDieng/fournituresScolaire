// server/api/airtable/promotions.get.ts
export default defineEventHandler(async (event) => {
  console.log(
    "🔄 Utilisation temporaire des données de fallback pour les promotions..."
  );

  // Force l'utilisation des données de fallback temporairement
  const fallbackPromotions = [
    {
      id: "fallback-1",
      title: "Pack Rentrée Scolaire - 25% OFF",
      description:
        "Profitez de -25% sur tous les packs scolaires pour une rentrée réussie ! Inclut cahiers, stylos, crayons et plus encore.",
      discount: 25,
      type: "percentage",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      products: [],
      category: "Packs Scolaires",
      trending: true,
      featured: true,
      icon: "🎒",
      rating: 5,
      features: [
        "Livraison gratuite",
        "Garantie qualité",
        "Pack complet",
        "Satisfaction garantie",
      ],
      originalPrice: 20000,
      currentPrice: 15000,
      isActive: true,
      createdTime: new Date().toISOString(),
    },
    {
      id: "fallback-2",
      title: "Fournitures Collège - 30% OFF",
      description:
        "Réduction exceptionnelle de 30% sur tous les articles pour collégiens. Préparez la rentrée sereinement !",
      discount: 30,
      type: "percentage",
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      products: [],
      category: "Fournitures",
      trending: false,
      featured: true,
      icon: "📚",
      rating: 4,
      features: [
        "Calculatrice scientifique incluse",
        "Kit géométrie complet",
        "Cahiers grand format",
      ],
      originalPrice: 35000,
      currentPrice: 24500,
      isActive: true,
      createdTime: new Date().toISOString(),
    },
    {
      id: "fallback-3",
      title: "Kit Art & Créativité - 40% OFF",
      description:
        "Dernière chance ! 40% de réduction sur notre kit complet d'art et créativité. Parfait pour développer la créativité !",
      discount: 40,
      type: "percentage",
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      products: [],
      category: "Art & Créativité",
      trending: true,
      featured: false,
      icon: "🎨",
      rating: 5,
      features: [
        "Crayons de couleur premium",
        "Feutres lavables",
        "Peinture acrylique",
        "Pinceaux assortis",
      ],
      originalPrice: 12000,
      currentPrice: 7200,
      isActive: true,
      createdTime: new Date().toISOString(),
    },
    {
      id: "fallback-4",
      title: "Calculatrices Scientifiques - 20% OFF",
      description:
        "Spécial étudiants ! 20% de réduction sur toutes nos calculatrices scientifiques. Indispensables pour les maths avancées.",
      discount: 20,
      type: "percentage",
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      products: [],
      category: "Calculatrices",
      trending: false,
      featured: false,
      icon: "🧮",
      rating: 4,
      features: [
        "Écran haute résolution",
        "Fonction graphique",
        "Pile longue durée",
        "Manuel en français",
      ],
      originalPrice: 8500,
      currentPrice: 6800,
      isActive: true,
      createdTime: new Date().toISOString(),
    },
  ];

  return {
    success: true,
    data: fallbackPromotions,
    total: fallbackPromotions.length,
    fallback: true,
    message: "Données de démonstration - Configuration Airtable en cours",
  };
});
