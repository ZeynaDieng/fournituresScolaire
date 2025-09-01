// scripts/check-db-status.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkStatus() {
  try {
    console.log("🔍 Vérification des données après simulation...");

    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion réussie");

    // Compter les commandes et paiements
    const orderCount = await prisma.order.count();
    const paymentCount = await prisma.payment.count();

    console.log("📊 Statistiques:");
    console.log(`   Commandes: ${orderCount}`);
    console.log(`   Paiements: ${paymentCount}`);

    // Récupérer les dernières commandes
    const lastOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        payment: true,
      },
    });

    console.log("📋 Dernières commandes:");
    lastOrders.forEach((order) => {
      const paymentInfo = order.payment
        ? `✅ Paiement: ${order.payment.status} (${order.payment.provider})`
        : "❌ Pas de paiement";

      console.log(
        `   ${order.ref} - Status: ${order.status} - ${order.total} CFA - ${paymentInfo}`
      );
    });

    // Vérifier spécifiquement notre commande de test
    const testOrder = await prisma.order.findUnique({
      where: { ref: "CMD_TEST_MANUAL_123" },
      include: { payment: true },
    });

    if (testOrder) {
      console.log("\n🎯 Commande de test CMD_TEST_MANUAL_123:");
      console.log(`   Status: ${testOrder.status}`);
      console.log(`   Montant: ${testOrder.total} CFA`);
      console.log(
        `   Paiement: ${
          testOrder.payment
            ? `✅ ${testOrder.payment.status} - ID: ${testOrder.payment.paytechId}`
            : "❌ Aucun"
        }`
      );
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus();
