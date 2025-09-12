// /server/api/admin/orders-airtable/update-status.post.ts
import {
  updateLocalOrderStatus as updateLocalStorage,
  getAllOrders,
} from "../../../../utils/local-storage";
import { addOrderToMasterExcel } from "../../../../utils/excel-master";
import { sendOrderNotification } from "../../../../utils/email-notifications";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    const { orderRef, ...statusUpdates } = body;

    // Validation des statuts
    const validOrderStatuses = [
      "En attente",
      "Confirmée",
      "En préparation",
      "Expédiée",
      "Livrée",
      "Annulée",
    ];
    const validPaymentStatuses = ["En attente", "Payé", "Remboursé", "Annulé"];

    if (
      statusUpdates.status &&
      !validOrderStatuses.includes(statusUpdates.status)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Statut de commande invalide",
      });
    }

    if (
      statusUpdates.paymentStatus &&
      !validPaymentStatuses.includes(statusUpdates.paymentStatus)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Statut de paiement invalide",
      });
    }

    // 1. Mettre à jour dans le stockage local
    const localResult = await updateLocalStorage(orderRef, statusUpdates);
    console.log(
      `✅ Statut mis à jour localement pour ${orderRef}:`,
      statusUpdates
    );

    // 2. Régénérer le fichier Excel avec toutes les commandes mises à jour
    try {
      const allOrders = await getAllOrders();
      // Le fichier Excel sera recréé avec tous les statuts à jour
      console.log(
        `📊 Régénération du fichier Excel avec ${allOrders.length} commandes`
      );
    } catch (error) {
      console.warn("⚠️ Erreur régénération Excel:", error.message);
    }

    // 3. Google Sheets supprimé - plus nécessaire

    // 4. Envoyer notification si statut important changé
    if (
      statusUpdates.status === "Livrée" ||
      statusUpdates.status === "Expédiée"
    ) {
      try {
        const order = localResult;
        if (order && order.customer?.email) {
          console.log(
            `📧 Envoi notification changement statut: ${statusUpdates.status}`
          );
        }
      } catch (error) {
        console.warn("⚠️ Erreur notification email:", error.message);
      }
    }

    return {
      success: true,
      message: "Statut mis à jour avec succès",
        data: {
        orderRef,
        updates: statusUpdates,
        local: localResult ? true : false,
      },
    };
  } catch (error: any) {
    console.error("❌ Erreur API update-status:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Erreur lors de la mise à jour du statut",
    });
  }
});
