// /server/api/admin/orders/index.get.ts
import { getAllOrders, getOrdersStats } from "../../../../utils/local-storage";

export default defineEventHandler(async (event) => {
  try {
    // Récupérer toutes les commandes
    const orders = await getAllOrders();

    // Récupérer les statistiques
    const stats = await getOrdersStats();

    // Pagination simple (côté serveur)
    const query = getQuery(event);
    const limit = parseInt(query.limit as string) || 50;
    const offset = parseInt(query.offset as string) || 0;

    const paginatedOrders = orders.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        orders: paginatedOrders.map((order) => ({
          id: order.id,
          ref: order.ref,
          customerName: order.customer.name,
          total: order.amounts?.total || order.total || 0,
          status: order.status,
          createdAt: order.timestamp,
        })),
        pagination: {
          total: orders.length,
          limit,
          offset,
          pages: Math.ceil(orders.length / limit),
          currentPage: Math.floor(offset / limit) + 1,
        },
        stats: {
          totalOrders: orders.length,
          totalRevenue: orders.reduce(
            (sum, order) => sum + (order.amounts?.total || order.total || 0),
            0
          ),
          pendingOrders: orders.filter((order) =>
            order.status?.includes("pending")
          ).length,
          todayOrders: orders.filter((order) => {
            const today = new Date().toISOString().split("T")[0];
            return order.timestamp.split("T")[0] === today;
          }).length,
        },
      },
    };
  } catch (error) {
    console.error("❌ Erreur récupération commandes:", error);

    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des commandes",
    });
  }
});
