// /server/api/admin/orders/list.get.ts
import { getAllOrders, getOrdersStats } from "../../../../utils/local-storage";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const includeStats = query.stats === "true";

    // Récupérer toutes les commandes
    const orders = await getAllOrders();

    let response: any = {
      success: true,
      orders: orders.reverse(), // Plus récentes en premier
      total: orders.length,
    };

    // Ajouter les statistiques si demandées
    if (includeStats) {
      const stats = await getOrdersStats();
      response.stats = stats;
    }

    return response;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des commandes:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      orders: [],
      total: 0,
    };
  }
});
