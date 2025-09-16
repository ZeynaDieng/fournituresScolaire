// scripts/test-payment-flow.js
// Script de diagnostic pour tester le flux de paiement

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log("🔍 Test de connexion à la base de données...");

  try {
    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    // Vérifier les tables
    const orderCount = await prisma.order.count();
    const paymentCount = await prisma.payment.count();
    const userCount = await prisma.user.count();

    console.log(`📊 Statistiques de la base de données:`);
    console.log(`   - Commandes: ${orderCount}`);
    console.log(`   - Paiements: ${paymentCount}`);
    console.log(`   - Utilisateurs: ${userCount}`);

    // Afficher les dernières commandes
    if (orderCount > 0) {
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { payment: true },
      });

      console.log(`\n📋 Dernières commandes:`);
      recentOrders.forEach((order) => {
        console.log(`   - ${order.ref}: ${order.status} - ${order.total} XOF`);
        if (order.payment) {
          console.log(
            `     💳 Paiement: ${order.payment.status} (${order.payment.provider})`
          );
        } else {
          console.log(`     ❌ Aucun paiement associé`);
        }
      });
    }
  } catch (error) {
    console.error(
      "❌ Erreur de connexion à la base de données:",
      error.message
    );

    if (error.code === "P1001") {
      console.log("💡 Solution: Vérifiez que votre serveur MySQL est démarré");
    } else if (error.code === "P1003") {
      console.log("💡 Solution: Vérifiez que la base de données existe");
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function testPaytechConfig() {
  console.log("\n🔍 Test de configuration PayTech...");

  const config = {
    apiKey: process.env.PAYTECH_API_KEY,
    secretKey: process.env.PAYTECH_SECRET_KEY,
    sandbox: process.env.PAYTECH_SANDBOX,
    baseUrl: process.env.BASE_URL,
  };

  console.log(`📋 Configuration PayTech:`);
  console.log(`   - API Key: ${config.apiKey ? "✅ Définie" : "❌ Manquante"}`);
  console.log(
    `   - Secret Key: ${config.secretKey ? "✅ Définie" : "❌ Manquante"}`
  );
  console.log(`   - Sandbox: ${config.sandbox}`);
  console.log(`   - Base URL: ${config.baseUrl}`);

  if (!config.apiKey || !config.secretKey) {
    console.log("❌ Les clés PayTech ne sont pas configurées");
    return false;
  }

  return true;
}

async function createTestOrder() {
  console.log("\n🧪 Création d'une commande de test...");

  try {
    const testRef = `TEST_${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        ref: testRef,
        status: "pending",
        total: 10000,
        items: JSON.stringify([
          { id: 1, name: "Test Product", quantity: 1, price: 10000 },
        ]),
      },
    });

    console.log(`✅ Commande de test créée: ${order.ref}`);

    // Test de création du paiement
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "paytech",
        status: "pending",
        amount: 10000,
      },
    });

    console.log(`✅ Paiement de test créé: ID ${payment.id}`);

    // Simulation d'un paiement réussi
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "completed", paytechId: "TEST_TOKEN_123" },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });

    console.log(`✅ Commande et paiement mis à jour avec succès`);

    return { order, payment };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de la commande de test:",
      error.message
    );
    return null;
  }
}

async function main() {
  console.log("🚀 Diagnostic du flux de paiement PayTech\n");

  // Test 1: Connexion base de données
  await testDatabaseConnection();

  // Test 2: Configuration PayTech
  const configOk = await testPaytechConfig();

  // Test 3: Création d'une commande de test
  if (configOk) {
    await createTestOrder();
  }

  console.log("\n✅ Diagnostic terminé");
}

main().catch(console.error);
