import { AirtableService } from "~/utils/airtable";

export default defineEventHandler(async (event) => {
  try {
    const packId = getRouterParam(event, "id");

    if (!packId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Pack ID is required",
      });
    }

    console.log("🔍 Recherche du pack avec ID:", packId);

    const packs = await AirtableService.getPacks();

    // Mapping des IDs Airtable vers les IDs personnalisés
    const idMapping: { [key: string]: string } = {
      recGwsGcGdl8iGpov: "pack-college",
      recL9XrvTjGEORPXj: "pack-cp",
      recrMlITCW66BdhxA: "pack-ce",
      rec5hUm7kqxGzhNcs: "pack-lycee",
      // Ajoutez d'autres mappings si nécessaire
    };

    // Trouver le pack avec l'ID personnalisé
    const foundPack = packs.find((p) => {
      const customId = idMapping[p.id] || p.id;
      return customId === packId;
    });

    if (!foundPack) {
      throw createError({
        statusCode: 404,
        statusMessage: `Pack with ID ${packId} not found`,
      });
    }

    console.log("✅ Pack trouvé:", foundPack.Name);

    // Transformer les données comme dans packs.get.ts
    const name = String(foundPack.Name || "");
    const parts = name.split(" - ");
    const level = String(foundPack.Level || "");
    const contents = foundPack.Contents
      ? String(foundPack.Contents).split(", ")
      : [];

    const transformedPack = {
      id: idMapping[foundPack.id] || foundPack.id,
      name: name,
      level: level,
      price: foundPack.Price,
      originalPrice: foundPack["Original Price"],
      image: foundPack["Image URL"],
      description: parts[0] || foundPack.Description,
      contents: contents,
      isPopular: foundPack["Is Popular"],
      inStock: foundPack["In Stock"],
      isPromotion: foundPack["Is Promotion"],
      promotionEndDate: foundPack["Promotion End Date"]
        ? new Date(foundPack["Promotion End Date"])
        : null,
    };

    return {
      success: true,
      data: transformedPack,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du pack:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
