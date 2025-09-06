// server/api/airtable/promotions.get.ts
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const AIRTABLE_API_KEY = config.airtableApiKey;
    const AIRTABLE_BASE_ID = config.airtableBaseId;
    const AIRTABLE_TABLE_NAME = "tblrUYgl2PgYIEMY5"; // ID de la table Promotions dans Airtable

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw createError({
        statusCode: 500,
        statusMessage: "Configuration Airtable manquante",
      });
    }

    console.log("🔄 Récupération des promotions depuis Airtable...");

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?view=Grid%20view`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `❌ Erreur Airtable: ${response.status} ${response.statusText}`
      );
      throw createError({
        statusCode: response.status,
        statusMessage: `Erreur Airtable: ${response.statusText}`,
      });
    }

    const data = await response.json();
    console.log(
      `✅ ${data.records?.length || 0} promotions récupérées depuis Airtable`
    );

    // Transformer les données Airtable en format utilisable
    const promotions =
      data.records?.map((record: any) => {
        const promo = record.fields;
        return {
          id: record.id,
          title: promo["Title"] || promo["Titre"] || "",
          description: promo["Description"] || "",
          discount: promo["Discount"] || 0,
          type: promo["Type"] || "percentage", // percentage, fixed, bogo
          endDate:
            promo["End Date"] || promo["Date Fin"]
              ? new Date(promo["End Date"] || promo["Date Fin"])
              : null,
          products: promo["Products"] || [], // IDs des produits liés
          category: promo["Category"] || promo["Categorie"] || "Offre spéciale",
          trending: Boolean(promo["Trending"] || promo["Tendance"]),
          featured: Boolean(promo["Featured"] || promo["Mise en avant"]),
          icon: promo["Icon"] || promo["Icone"] || "🏷️",
          rating: promo["Rating"] || promo["Note"] || null,
          features:
            promo["Features"] || promo["Caracteristiques"]
              ? (() => {
                  try {
                    const featuresRaw =
                      promo["Features"] || promo["Caracteristiques"];
                    // Si c'est déjà un array, le retourner
                    if (Array.isArray(featuresRaw)) return featuresRaw;
                    // Si c'est une string avec des retours à la ligne
                    if (
                      typeof featuresRaw === "string" &&
                      featuresRaw.includes("\n")
                    ) {
                      return featuresRaw.split("\n").filter((f) => f.trim());
                    }
                    // Si c'est du JSON, le parser
                    if (
                      typeof featuresRaw === "string" &&
                      (featuresRaw.startsWith("[") ||
                        featuresRaw.startsWith('{"'))
                    ) {
                      return JSON.parse(featuresRaw);
                    }
                    // Sinon, retourner comme array d'un élément
                    return [featuresRaw];
                  } catch (e) {
                    console.warn("Erreur parsing features:", e);
                    return [];
                  }
                })()
              : [],
          originalPrice:
            promo["Original Price"] || promo["Prix Original"] || null,
          currentPrice: promo["Current Price"] || promo["Prix Actuel"] || null,
          isActive: promo["Is Active"] !== false, // Par défaut actif
          createdTime: record.createdTime,
        };
      }) || [];

    // Filtrer les promotions actives seulement
    const activePromotions = promotions.filter((promo: any) => {
      if (!promo.isActive) return false;
      if (!promo.endDate) return true; // Pas de date de fin = toujours actif
      return new Date(promo.endDate) > new Date(); // Date de fin dans le futur
    });

    return {
      success: true,
      data: activePromotions,
      total: activePromotions.length,
      source: "airtable",
    };
  } catch (error: any) {
    console.error("❌ Erreur lors de la récupération des promotions:", error);
    console.log("🔄 Utilisation des données de fallback...");

    // Fallback vers les promotions locales en cas d'erreur
    const fallbackPromotions = [
      {
        id: "fallback-1",
        title: "Pack Rentrée Scolaire",
        description: "Profitez de -20% sur tous les packs scolaires",
        discount: 20,
        type: "percentage",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        products: [],
        category: "Pack",
        trending: true,
        featured: true,
        icon: "🎒",
        rating: 5,
        features: ["Livraison gratuite", "Garantie qualité", "Pack complet"],
        originalPrice: null,
        currentPrice: null,
        isActive: true,
        createdTime: new Date().toISOString(),
      },
      {
        id: "fallback-2",
        title: "Fournitures Premium",
        description: "Réduction sur les fournitures de qualité supérieure",
        discount: 15,
        type: "percentage",
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
        products: [],
        category: "Fournitures",
        trending: false,
        featured: false,
        icon: "📚",
        rating: 4,
        features: ["Qualité premium", "Durabilité testée"],
        originalPrice: null,
        currentPrice: null,
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
  }
});
