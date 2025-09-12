// /server/api/admin/orders-airtable/export.get.ts
import { exportOrdersToCSV } from "../../../../utils/local-storage";
import { promises as fs } from "fs";

export default defineEventHandler(async (event) => {
  try {
    console.log("📊 Export CSV des commandes demandé...");

    // Créer l'export CSV
    const csvFilePath = await exportOrdersToCSV();

    // Lire le contenu du fichier
    const csvContent = await fs.readFile(csvFilePath, "utf8");

    // Définir les headers pour le téléchargement
    setHeader(event, "Content-Type", "text/csv");
    setHeader(
      event,
      "Content-Disposition",
      `attachment; filename="commandes-${
        new Date().toISOString().split("T")[0]
      }.csv"`
    );

    return csvContent;
  } catch (error) {
    console.error("❌ Erreur lors de l'export CSV:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
});
