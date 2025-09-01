// scripts/test-ngrok-vs-localhost.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDifferences() {
  try {
    console.log("🔍 Comparaison Localhost vs NGrok...");

    await prisma.$connect();

    // 1. Créer une commande de test pour NGrok
    const ngrokOrder = await prisma.order.create({
      data: {
        ref: `CMD_NGROK_TEST_${Date.now()}`,
        status: "pending",
        total: 7500,
        items: JSON.stringify([
          {
            id: "ngrok-test-item",
            name: "Test NGrok",
            price: 7500,
            quantity: 1,
          },
        ]),
        userId: null,
        createdAt: new Date(),
      },
    });

    console.log("✅ Commande NGrok créée:", ngrokOrder.ref);

    // 2. Lister toutes les commandes par source
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { payment: true },
    });

    console.log("\n📊 Analyse des commandes par source:");

    const localhostOrders = allOrders.filter(
      (order) => order.ref.includes("MANUAL") || order.ref.includes("TEST_1")
    );

    const ngrokOrders = allOrders.filter((order) =>
      order.ref.includes("NGROK")
    );

    console.log(`\n🏠 Commandes Localhost (${localhostOrders.length}):`);
    localhostOrders.forEach((order) => {
      const hasPayment = order.payment ? "✅ Payé" : "❌ Non payé";
      console.log(`   ${order.ref} - ${order.status} - ${hasPayment}`);
    });

    console.log(`\n🌐 Commandes NGrok (${ngrokOrders.length}):`);
    ngrokOrders.forEach((order) => {
      const hasPayment = order.payment ? "✅ Payé" : "❌ Non payé";
      console.log(`   ${order.ref} - ${order.status} - ${hasPayment}`);
    });

    // 3. Statistiques de réussite
    const localhostPaid = localhostOrders.filter(
      (o) => o.status === "paid"
    ).length;
    const ngrokPaid = ngrokOrders.filter((o) => o.status === "paid").length;

    console.log("\n📈 Taux de réussite:");
    console.log(
      `   Localhost: ${localhostPaid}/${localhostOrders.length} (${
        localhostOrders.length > 0
          ? Math.round((localhostPaid / localhostOrders.length) * 100)
          : 0
      }%)`
    );
    console.log(
      `   NGrok: ${ngrokPaid}/${ngrokOrders.length} (${
        ngrokOrders.length > 0
          ? Math.round((ngrokPaid / ngrokOrders.length) * 100)
          : 0
      }%)`
    );

    // 4. Analyse des timestamps
    console.log("\n⏰ Analyse temporelle:");
    allOrders.forEach((order) => {
      const source = order.ref.includes("MANUAL")
        ? "LOCALHOST"
        : order.ref.includes("NGROK")
        ? "NGROK"
        : "AUTRE";
      const created = order.createdAt.toLocaleString("fr-FR");
      const paymentTime = order.payment
        ? order.payment.createdAt.toLocaleString("fr-FR")
        : "N/A";
      console.log(
        `   [${source}] ${order.ref} - Créé: ${created} - Payé: ${paymentTime}`
      );
    });

    return ngrokOrder.ref;
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDifferences().then((newOrderRef) => {
  if (newOrderRef) {
    console.log(
      `\n🧪 Pour tester NGrok, utilisez cette commande: ${newOrderRef}`
    );
    console.log("📝 Commande curl pour simuler le paiement:");
    console.log(
      `curl -X POST http://localhost:3000/api/test/simulate-payment-success \\`
    );
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(
      `  -d '{"ref_command": "${newOrderRef}", "amount": 7500, "payment_method": "NGrok Test"}'`
    );
  }
});
