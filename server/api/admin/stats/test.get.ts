import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  // Générer des données dynamiques basées sur l'heure actuelle
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  // Facteurs dynamiques
  const timeMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 0.8; // Plus d'activité en journée
  const dayMultiplier = day % 7 === 0 ? 1.5 : 1.0; // Plus d'activité le dimanche
  const monthMultiplier = month >= 8 && month <= 10 ? 1.3 : 1.0; // Rentrée scolaire

  const baseOrders = Math.floor(
    150 * timeMultiplier * dayMultiplier * monthMultiplier
  );
  const baseRevenue = Math.floor(
    2500000 * timeMultiplier * dayMultiplier * monthMultiplier
  );

  return {
    success: true,
    data: {
      kpis: {
        totalOrders: baseOrders,
        totalRevenue: baseRevenue,
        totalPaidRevenue: Math.floor(baseRevenue * 0.8),
        pendingOrders: Math.floor(baseOrders * 0.15),
        cancelledOrders: Math.floor(baseOrders * 0.03),
        conversionRate:
          Math.round((12.5 + (Math.random() - 0.5) * 2) * 10) / 10,
        averageOrderValue: Math.floor(baseRevenue / baseOrders),
        recentRevenue: Math.floor(baseRevenue * 0.2),
        recentOrders: Math.floor(baseOrders * 0.2),
      },
      charts: {
        dailyStats: (() => {
          const dailyStats = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            // Générer des données réalistes avec variation
            const baseOrders = Math.floor(10 + Math.random() * 15);
            const baseRevenue = baseOrders * (15000 + Math.random() * 5000);

            dailyStats.push({
              date: dateStr,
              orders: baseOrders,
              revenue: Math.floor(baseRevenue),
            });
          }
          return dailyStats;
        })(),
        paymentMethodStats: [
          {
            method: "Orange Money",
            count: Math.floor(45 + Math.random() * 20),
          },
          { method: "PayTech", count: Math.floor(30 + Math.random() * 15) },
          { method: "Free Money", count: Math.floor(20 + Math.random() * 10) },
          { method: "Wave", count: Math.floor(15 + Math.random() * 8) },
        ],
        topLocations: [
          { location: "Dakar", count: Math.floor(80 + Math.random() * 30) },
          { location: "Thiès", count: Math.floor(25 + Math.random() * 15) },
          { location: "Kaolack", count: Math.floor(15 + Math.random() * 10) },
          {
            location: "Saint-Louis",
            count: Math.floor(10 + Math.random() * 8),
          },
          { location: "Ziguinchor", count: Math.floor(8 + Math.random() * 5) },
        ],
      },
      topProducts: [
        {
          name: "Pack CP Complet",
          quantity: Math.floor(45 + Math.random() * 20),
        },
        {
          name: "Cahiers Spirales x10",
          quantity: Math.floor(38 + Math.random() * 15),
        },
        {
          name: "Pack CE2 Standard",
          quantity: Math.floor(32 + Math.random() * 12),
        },
        {
          name: "Stylos Multicouleurs",
          quantity: Math.floor(28 + Math.random() * 10),
        },
        {
          name: "Pack CM1 Premium",
          quantity: Math.floor(25 + Math.random() * 8),
        },
      ],
      topPacks: [
        {
          name: "Pack CP Complet",
          quantity: Math.floor(45 + Math.random() * 20),
        },
        {
          name: "Pack CE2 Standard",
          quantity: Math.floor(32 + Math.random() * 12),
        },
        {
          name: "Pack CM1 Premium",
          quantity: Math.floor(25 + Math.random() * 8),
        },
      ],
      conversionFunnel: {
        totalVisitors: Math.floor(1500 * timeMultiplier),
        cartAdditions: Math.floor(450 * timeMultiplier),
        checkoutStarted: Math.floor(300 * timeMultiplier),
        ordersCompleted: baseOrders,
        ordersPaid: Math.floor(baseOrders * 0.8),
      },
      inventory: {
        totalProducts: 43,
        totalPacks: 12,
        activePromotions: 3,
      },
      lastUpdated: new Date().toISOString(),
      dataRange: "30 derniers jours",
    },
  };
});
