import { defineEventHandler, readBody } from "h3";
import { updateOrderStatusInAirtable } from "~/utils/airtable-orders";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const orderRef = body.orderRef || "CMD_1757985940663_uuub964np";
    const status = body.status || "Paid";

    console.log(`🧪 Test de mise à jour du statut: ${orderRef} -> ${status}`);

    const result = await updateOrderStatusInAirtable(orderRef, status);

    return {
      success: true,
      message: `Statut mis à jour avec succès: ${orderRef} -> ${status}`,
      result,
    };
  } catch (error) {
    console.error("❌ Erreur lors du test de mise à jour du statut:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec de la mise à jour du statut.",
    };
  }
});
