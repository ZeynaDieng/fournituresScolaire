// /server/api/admin/orders/create-excel-master.get.ts
import { createMasterExcel } from "../../../../utils/excel-master";
import { getAllOrders } from "../../../../utils/local-storage";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔧 Création du fichier Excel maître...");

    // Récupérer toutes les commandes existantes
    const orders = await getAllOrders();
    console.log(`📊 ${orders.length} commandes trouvées pour le fichier Excel`);

    // Créer le fichier Excel maître
    await createMasterExcel();
    console.log("✅ Fichier Excel maître créé avec succès");

    // Si des commandes existent, les ajouter au fichier
    if (orders.length > 0) {
      const { addOrderToMasterExcel } = await import(
        "../../../../utils/excel-master"
      );

      for (const order of orders) {
        try {
          await addOrderToMasterExcel(order);
          console.log(`✅ Commande ${order.ref} ajoutée au fichier Excel`);
        } catch (error) {
          console.warn(`⚠️ Erreur ajout commande ${order.ref}:`, error.message);
        }
      }
    }

    return {
      success: true,
      message: "Fichier Excel maître créé avec succès",
      ordersCount: orders.length,
      filePath: "/data/COMMANDES_MAITRE.xlsx",
    };
  } catch (error) {
    console.error("❌ Erreur création fichier Excel maître:", error);

    return {
      success: false,
      error:
        error.message || "Erreur lors de la création du fichier Excel maître",
      statusCode: 500,
    };
  }
});
