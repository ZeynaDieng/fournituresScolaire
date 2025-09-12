// /server/api/admin/orders-airtable/excel-master.get.ts
import {
  getMasterExcelPath,
  createMasterExcel,
} from "../../../../utils/excel-master";
import { promises as fs } from "fs";

export default defineEventHandler(async (event) => {
  try {
    const excelPath = getMasterExcelPath();

    // Vérifier si le fichier existe, sinon le créer
    try {
      await fs.access(excelPath);
    } catch {
      // Le fichier n'existe pas, le créer
      await createMasterExcel();
    }

    // Lire le fichier et le retourner
    const fileBuffer = await fs.readFile(excelPath);

    // Définir les en-têtes pour le téléchargement
    setHeader(
      event,
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    setHeader(
      event,
      "Content-Disposition",
      'attachment; filename="COMMANDES_MAITRE.xlsx"'
    );

    return fileBuffer;
  } catch (error) {
    console.error("❌ Erreur téléchargement Excel:", error);

    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors du téléchargement du fichier Excel",
    });
  }
});
