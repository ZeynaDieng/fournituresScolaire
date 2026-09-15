import { prisma } from "../../utils/prisma";
import { getAirtableOrders } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  const limit = Number(getQuery(event).limit) || 20;

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (orders && orders.length > 0) {
      const formatted = orders.map((o) => ({
        id: String(o.id),
        orderRef: o.ref,
        customerName: o.source || "Client",
        customerEmail: "",
        customerPhone: "",
        totalAmount: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus || "COD",
        createdDate: o.createdAt.toISOString(),
        createdAt: o.createdAt.toISOString(),
        items: o.items,
      }));

      return { success: true, data: formatted, total: formatted.length, source: "postgresql" };
    }
  } catch (err) {
    console.warn("⚠️ Erreur Prisma admin orders:", err);
  }

  return await getAirtableOrders({ limit });
});
