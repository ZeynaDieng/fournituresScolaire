// scripts/test-db-connection.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("🔍 Test de connexion à la base de données...");

    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion réussie");

    // Créer une commande de test
    const testOrder = await prisma.order.create({
      data: {
        ref: "CMD_TEST_MANUAL_123",
        status: "pending",
        total: 5000,
        items: JSON.stringify([
          {
            id: "test-item-1",
            name: "Article de test",
            price: 5000,
            quantity: 1,
          },
        ]),
        userId: null,
        createdAt: new Date(),
      },
    });

    console.log("✅ Commande de test créée:", testOrder);

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
      console.log(
        `   ${order.ref} - ${order.status} - ${order.total} CFA - ${
          order.payment
            ? "Paiement: " + order.payment.status
            : "Pas de paiement"
        }`
      );
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
