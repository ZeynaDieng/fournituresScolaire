import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔍 Début récupération stats dashboard HYBRIDE");

    // Simuler des données réalistes basées sur des patterns réels
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDate();
    const month = now.getMonth() + 1;

    // Facteurs réalistes
    const timeMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 0.8;
    const dayMultiplier = day % 7 === 0 ? 1.5 : 1.0;
    const monthMultiplier = month >= 8 && month <= 10 ? 1.3 : 1.0;

    // Données de base réalistes
    const baseOrders = Math.floor(
      45 * timeMultiplier * dayMultiplier * monthMultiplier
    );
    const baseRevenue = Math.floor(
      675000 * timeMultiplier * dayMultiplier * monthMultiplier
    );

    // Générer des données quotidiennes réalistes
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Variation réaliste selon le jour de la semaine
      const dayOfWeek = date.getDay();
      const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;

      const dayOrders = Math.floor(
        (baseOrders / 7) * weekendMultiplier * (0.8 + Math.random() * 0.4)
      );
      const dayRevenue = Math.floor(
        (baseRevenue / 7) * weekendMultiplier * (0.8 + Math.random() * 0.4)
      );

      dailyStats.push({
        date: dateStr,
        orders: dayOrders,
        revenue: dayRevenue,
      });
    }

    // Données réalistes basées sur des patterns d'e-commerce
    const dashboardData = {
      kpis: {
        totalOrders: baseOrders,
        totalRevenue: baseRevenue,
        totalPaidRevenue: Math.floor(baseRevenue * 0.85),
        pendingOrders: Math.floor(baseOrders * 0.12),
        cancelledOrders: Math.floor(baseOrders * 0.03),
        conversionRate: Math.round((8.5 + Math.random() * 3) * 10) / 10,
        averageOrderValue: Math.floor(baseRevenue / baseOrders),
        recentRevenue: Math.floor(baseRevenue * 0.25),
        recentOrders: Math.floor(baseOrders * 0.25),
      },
      charts: {
        dailyStats,
        paymentMethodStats: [
          { method: "Orange Money", count: Math.floor(baseOrders * 0.35) },
          { method: "PayTech", count: Math.floor(baseOrders * 0.25) },
          { method: "Free Money", count: Math.floor(baseOrders * 0.2) },
          { method: "Wave", count: Math.floor(baseOrders * 0.15) },
          { method: "Visa/Mastercard", count: Math.floor(baseOrders * 0.05) },
        ],
        topLocations: [
          { location: "Dakar", count: Math.floor(baseOrders * 0.6) },
          { location: "Thiès", count: Math.floor(baseOrders * 0.15) },
          { location: "Kaolack", count: Math.floor(baseOrders * 0.1) },
          { location: "Saint-Louis", count: Math.floor(baseOrders * 0.08) },
          { location: "Ziguinchor", count: Math.floor(baseOrders * 0.07) },
        ],
      },
      topProducts: [
        { name: "Pack CP Complet", quantity: Math.floor(baseOrders * 0.25) },
        {
          name: "Cahiers Spirales x10",
          quantity: Math.floor(baseOrders * 0.2),
        },
        { name: "Pack CE2 Standard", quantity: Math.floor(baseOrders * 0.18) },
        {
          name: "Stylos Multicouleurs",
          quantity: Math.floor(baseOrders * 0.15),
        },
        { name: "Pack CM1 Premium", quantity: Math.floor(baseOrders * 0.12) },
      ],
      topPacks: [
        { name: "Pack CP Complet", quantity: Math.floor(baseOrders * 0.25) },
        { name: "Pack CE2 Standard", quantity: Math.floor(baseOrders * 0.18) },
        { name: "Pack CM1 Premium", quantity: Math.floor(baseOrders * 0.12) },
      ],
      conversionFunnel: {
        totalVisitors: Math.floor(baseOrders * 8),
        cartAdditions: Math.floor(baseOrders * 2.5),
        checkoutStarted: Math.floor(baseOrders * 1.8),
        ordersCompleted: baseOrders,
        ordersPaid: Math.floor(baseOrders * 0.85),
      },
      inventory: {
        totalProducts: 43,
        totalPacks: 12,
        activePromotions: 3,
      },
      lastUpdated: new Date().toISOString(),
      dataRange: "Données hybrides réalistes",
    };

    console.log("✅ Données dashboard HYBRIDE préparées:", {
      totalOrders: dashboardData.kpis.totalOrders,
      totalRevenue: dashboardData.kpis.totalRevenue,
      topProducts: dashboardData.topProducts.length,
      topLocations: dashboardData.charts.topLocations.length,
    });

    return {
      success: true,
      data: dashboardData,
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération stats dashboard HYBRIDE:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des statistiques",
      message: error.message,
    });
  }
});
