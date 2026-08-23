import { getAllOrders } from "../../../utils/local-storage";

export default defineEventHandler(async (event) => {
  try {
    // Vérifier le stockage local
    const orders = await getAllOrders();

    // Statistiques des commandes
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "En attente").length,
      confirmed: orders.filter((o) => o.status === "Confirmée").length,
      delivered: orders.filter((o) => o.status === "Livrée").length,
      paid: orders.filter((o) => o.paymentStatus === "Payé").length,
    };

    return {
      success: true,
      system: {
        localStorage: {
          configured: true,
          status: "operational",
          ordersCount: orders.length,
        },
        excel: {
          configured: false,
          status: "disabled",
          filePath: null,
        },
      },
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Erreur vérification système:", error);

    return {
      success: false,
      error: error.message,
      system: {
        localStorage: { configured: false, status: "error" },
        excel: { configured: false, status: "error" },
      },
      stats: { total: 0, pending: 0, confirmed: 0, delivered: 0, paid: 0 },
    };
  }
});
