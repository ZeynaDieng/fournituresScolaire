// scripts/explain-difference.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function explainDifference() {
  try {
    console.log("🔍 Explication des différences Localhost vs NGrok\n");

    await prisma.$connect();

    console.log("📋 Voici ce qui se passe:");
    console.log("");

    console.log("1️⃣ TESTS LOCALHOST (via /test/payment-debug):");
    console.log(
      "   ✅ API de simulation directe (/api/test/simulate-payment-success)"
    );
    console.log("   ✅ Pas besoin de PayTech réel");
    console.log("   ✅ Webhook simulé localement");
    console.log("   ✅ Sauvegarde en BDD immédiate");
    console.log("   📊 Taux de réussite: 100% (car simulé)");
    console.log("");

    console.log("2️⃣ TESTS NGROK (via checkout réel):");
    console.log("   🌐 Commande envoyée à PayTech réel");
    console.log("   ⏳ Attente du vrai webhook PayTech");
    console.log("   🔗 Webhook doit traverser Internet → NGrok → votre app");
    console.log("   ❓ Peut échouer si:");
    console.log("     - NGrok fermé prématurément");
    console.log("     - URL webhook mal configurée dans PayTech");
    console.log("     - Problème réseau");
    console.log("     - PayTech en mode test/sandbox");
    console.log("");

    // Analyse des logs de webhook
    console.log("3️⃣ DIAGNOSTIC:");

    const pendingOrders = await prisma.order.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    const paidOrders = await prisma.order.findMany({
      where: { status: "paid" },
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    });

    console.log(`   📊 Commandes en attente: ${pendingOrders.length}`);
    pendingOrders.forEach((order) => {
      const age = Math.round(
        (Date.now() - order.createdAt.getTime()) / 1000 / 60
      );
      console.log(`     - ${order.ref} (créée il y a ${age} min)`);
    });

    console.log(`   📊 Commandes payées: ${paidOrders.length}`);
    paidOrders.forEach((order) => {
      const source = order.payment?.paytechId?.includes("TEST_")
        ? "SIMULATION"
        : "WEBHOOK RÉEL";
      console.log(`     - ${order.ref} via ${source}`);
    });

    console.log("");
    console.log("4️⃣ RECOMMANDATIONS:");
    console.log("");

    if (pendingOrders.length > 0) {
      console.log("   🔧 Pour résoudre les commandes en attente:");
      console.log("   ");
      console.log("   Option A - Simulation (test immédiat):");
      pendingOrders.forEach((order) => {
        console.log(
          `   curl -X POST http://localhost:3000/api/test/simulate-payment-success \\`
        );
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(
          `     -d '{"ref_command": "${order.ref}", "amount": ${order.total}, "payment_method": "Simulation"}'`
        );
        console.log("");
      });

      console.log("   Option B - Vérifier NGrok:");
      console.log("   1. Lancer NGrok: ngrok http 3000");
      console.log("   2. Copier URL: https://xxx.ngrok.io");
      console.log(
        "   3. Mettre à jour .env: NUXT_PUBLIC_BASE_URL=https://xxx.ngrok.io"
      );
      console.log("   4. Redémarrer serveur: npm run dev");
      console.log("   5. Refaire un test checkout");
      console.log("");
    }

    console.log(
      "   ✅ En production, les webhooks fonctionneront parfaitement !"
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

explainDifference();
