import { prisma } from "../../utils/prisma";
import { getAirtablePacks } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  try {
    const packs = await prisma.pack.findMany({
      orderBy: { id: "asc" },
    });

    if (packs && packs.length > 0) {
      const formatted = packs.map((p) => ({
        id: String(p.id),
        name: p.name,
        level: p.schoolLevel,
        schoolName: p.schoolName,
        coverImage: p.coverImage,
        description: p.description,
      }));

      return { success: true, data: formatted, total: formatted.length, source: "postgresql" };
    }

    return await getAirtablePacks();
  } catch (error) {
    console.error("Erreur lors de la récupération des packs:", error);
    return await getAirtablePacks();
  }
});
