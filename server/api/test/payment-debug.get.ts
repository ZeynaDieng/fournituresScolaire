// server/api/test/payment-debug.get.ts
// Endpoint de diagnostic pour les paiements

import { PrismaClient } from "@prisma/client";
import type { PaymentDiagnosticsResult, PaymentDiagnostics } from "~/types/api";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: any): Promise<PaymentDiagnosticsResult> => {
    const config = useRuntimeConfig();

    try {
      const diagnostics: PaymentDiagnostics = {
        timestamp: new Date().toISOString(),
        config: {
          paytechConfigured: !!(
            config.paytech?.apiKey && config.paytech?.secretKey
          ),
          sandbox: config.paytech?.sandbox || false,
          baseUrl: config.public?.baseUrl || "",
          databaseUrl: !!process.env.DATABASE_URL,
        },
        database: {
          connected: false,
          orders: 0,
          payments: 0,
          lastOrders: [],
        },
        recommendations: [],
      };

      // Test de connexion à la base de données
      try {
        await prisma.$connect();
        diagnostics.database.connected = true;

        // Statistiques
        diagnostics.database.orders = await prisma.order.count();
        diagnostics.database.payments = await prisma.payment.count();

        // Dernières commandes
        const lastOrders = await prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { payment: true },
        });
        diagnostics.database.lastOrders = lastOrders.map((order) => ({
          ref: order.ref,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt.toISOString(),
          hasPayment: !!order.payment,
          paymentStatus: order.payment?.status || null,
        }));
      } catch (dbError: any) {
        diagnostics.database.error = dbError.message;
        diagnostics.recommendations.push(
          "Vérifiez la connexion à la base de données"
        );
      }

      // Recommendations
      if (!diagnostics.config.paytechConfigured) {
        diagnostics.recommendations.push(
          "Configurez les clés PayTech dans .env"
        );
      }

      if (!diagnostics.config.baseUrl) {
        diagnostics.recommendations.push("Configurez BASE_URL dans .env");
      }

      if (diagnostics.database.orders === 0) {
        diagnostics.recommendations.push(
          "Aucune commande trouvée - testez une commande"
        );
      }

      if (diagnostics.database.payments === 0) {
        diagnostics.recommendations.push(
          "Aucun paiement trouvé - vérifiez les webhooks"
        );
      }

      // Ordres avec paiements manquants
      const ordersWithoutPayments = diagnostics.database.lastOrders.filter(
        (order) => order.status === "pending" && !order.hasPayment
      );

      if (ordersWithoutPayments.length > 0) {
        diagnostics.recommendations.push(
          `${ordersWithoutPayments.length} commande(s) sans paiement associé`
        );
      }

      return {
        success: true,
        data: diagnostics,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        recommendations: [
          "Vérifiez les logs du serveur",
          "Assurez-vous que Prisma est correctement configuré",
          "Vérifiez les variables d'environnement",
        ],
      };
    } finally {
      await prisma.$disconnect();
    }
  }
);
