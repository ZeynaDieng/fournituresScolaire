// server/api/airtable/packs.get.ts
import { AirtableService } from "../../../utils/airtable";

export default defineEventHandler(async (event) => {
  try {
    const packs = await AirtableService.getPacks();

    // Transformation des données Airtable vers le format de l'application
    const formattedPacks = packs.map((pack: any) => {
      // Extraction du nom depuis la description (dernière partie après le point)
      const description = String(pack.Description || "");
      const parts = description.split(". ");
      const name =
        parts.length > 1 ? parts[parts.length - 1] : `Pack ${pack.Level}`;

      // Images par niveau - mapping typé
      const images: Record<string, string> = {
        CP: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
        "CE1-CE2":
          "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
        Collège:
          "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
        Lycée: "https://placehold.co/600x400/F4ECF7/17202A?text=Pack+Lycee",
      };

      const level = String(pack.Level || "");
      const contents = pack.Contents ? String(pack.Contents).split(", ") : [];

      // Mapping des IDs Airtable vers les IDs personnalisés
      const idMapping: { [key: string]: string } = {
        recGwsGcGdl8iGpov: "pack-college",
        recL9XrvTjGEORPXj: "pack-cp",
        recrMlITCW66BdhxA: "pack-ce",
        rec5hUm7kqxGzhNcs: "pack-lycee",
        // Ajoutez d'autres mappings si nécessaire
      };

      console.log("🔍 Pack Image pour", name, ":", pack["Image URL"]);
      console.log("🔍 Tous les champs du pack:", Object.keys(pack));

      return {
        id: idMapping[pack.id] || pack.id,
        name: name,
        level: level,
        price: pack.Price,
        originalPrice: pack["Original Price"],
        image: pack["Image URL"],
        description: parts[0] || pack.Description, // Description sans le nom du pack
        contents: contents,
        isPopular: pack["Is Popular"],
        inStock: pack["In Stock"],
        isPromotion: pack["Is Promotion"],
        promotionEndDate: pack["Promotion End Date"]
          ? new Date(pack["Promotion End Date"])
          : null,
      };
    });

    return {
      success: true,
      data: formattedPacks,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des packs:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des packs",
      data: [],
    };
  }
});
