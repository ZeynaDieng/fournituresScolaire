// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";

// Données de fallback au cas où Airtable ne fonctionne pas
const fallbackPacksData = [
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
];

function transformAirtableToPublicFormat(
  airtableRecord: any,
  recordId: string
) {
  return {
    id: recordId, // Utiliser l'ID du record Airtable
    name: airtableRecord.Name,
    level: airtableRecord.Level,
    price: Number(airtableRecord.Price) || 0,
    originalPrice: airtableRecord["Original Price"]
      ? Number(airtableRecord["Original Price"])
      : undefined,
    image: airtableRecord["Image URL"] || airtableRecord.Image || "",
    description: airtableRecord.Description || "",
    contents: airtableRecord.Contents
      ? typeof airtableRecord.Contents === "string"
        ? airtableRecord.Contents.split(", ")
        : airtableRecord.Contents
      : [],
    isPopular: airtableRecord["Is Popular"] || false,
    inStock: airtableRecord["In Stock"] !== false,
    isPromotion: airtableRecord["Is Promotion"] || false,
    promotionEndDate: airtableRecord["Promotion End Date"]
      ? new Date(airtableRecord["Promotion End Date"])
      : null,
  };
}

export default defineEventHandler(async (event) => {
  try {
    console.log("📦 API publique des packs - tentative Airtable");

    // Essayer d'abord de récupérer depuis Airtable
    try {
      const base = getAirtableBase();
      const records = await base(process.env.AIRTABLE_PACKS_TABLE!)
        .select()
        .all();

      console.log(`✅ ${records.length} packs récupérés depuis Airtable`);

      const transformedPacks = records.map((record) =>
        transformAirtableToPublicFormat(record.fields, record.id)
      );

      return {
        success: true,
        data: transformedPacks,
        source: "airtable",
      };
    } catch (airtableError: any) {
      console.warn(
        "⚠️ Erreur Airtable, utilisation des données de fallback:",
        airtableError.message
      );

      // En cas d'erreur Airtable, utiliser les données de fallback
      return {
        success: true,
        data: fallbackPacksData,
        source: "fallback",
        warning: "Données de fallback utilisées - Airtable indisponible",
      };
    }
  } catch (error: any) {
    console.error("❌ Erreur générale API packs:", error);

    return {
      success: false,
      error: error.message || "Erreur inconnue",
      data: fallbackPacksData,
      source: "fallback",
    };
  }
});
