import { getAirtableBase } from "./airtable-base";

export async function getAirtableStats() {
  const base = getAirtableBase();
  const [orders, products, packs] = await Promise.all([
    base("Orders").select().all(),
    base("Products").select().all(),
    base("Packs").select().all(),
  ]);
  const revenue = orders.reduce((sum, o) => sum + (o.fields.total || 0), 0);
  // Regrouper par mois
  const ordersByMonth = {};
  const revenueByMonth = {};
  orders.forEach((o) => {
    const date = o.fields.date ? new Date(o.fields.date) : null;
    if (!date) return;
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
    revenueByMonth[month] =
      (revenueByMonth[month] || 0) + (o.fields.total || 0);
  });
  return {
    orders: orders.length,
    revenue,
    products: products.length,
    packs: packs.length,
    ordersByMonth: Object.entries(ordersByMonth).map(([month, count]) => ({
      month,
      count,
    })),
    revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue,
    })),
  };
}

export async function getAirtableOrders({ limit = 10 } = {}) {
  const base = getAirtableBase();
  const records = await base("Orders")
    .select({ sort: [{ field: "date", direction: "desc" }], maxRecords: limit })
    .all();
  return records.map((r) => ({
    id: r.id,
    customer: r.fields.customer,
    total: r.fields.total,
    date: r.fields.date,
    status: r.fields.status,
  }));
}

export async function getAirtableAlerts() {
  // Ex: alertes sur commandes en attente, stocks faibles, etc.
  const base = getAirtableBase();
  const orders = await base("Orders")
    .select({ filterByFormula: `status = 'pending'` })
    .all();
  const alerts = [];
  if (orders.length > 0) {
    alerts.push({
      id: "pending-orders",
      message: `${orders.length} commande(s) en attente de traitement`,
    });
  }
  // Ajoutez d'autres alertes selon vos besoins
  return alerts;
}

export async function getAirtableProducts() {
  const base = getAirtableBase();
  const records = await base("Products").select().all();
  return records.map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

export async function getAirtablePacks() {
  const base = getAirtableBase();
  const records = await base("Packs").select().all();
  return records.map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

export async function getAirtableProductById(id: string) {
  const base = getAirtableBase();
  const records = await base("Products")
    .select({ filterByFormula: `RECORD_ID() = '${id}'` })
    .all();

  if (records.length === 0) {
    return null;
  }

  return {
    id: records[0].id,
    ...records[0].fields,
  };
}
