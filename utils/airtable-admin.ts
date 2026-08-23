import { getAirtableBase } from "./airtable-base";
import { senegaleseProducts, senegalesePacks } from "../data/products-senegal";

export async function getAirtableStats() {
  try {
    const base = getAirtableBase();
    const [orders, products, packs] = await Promise.all([
      base("Orders").select().all(),
      base("Products").select().all(),
      base("Packs").select().all(),
    ]);
    const revenue = orders.reduce((sum, o) => sum + (Number(o.fields.total) || 0), 0);
    // Regrouper par mois
    const ordersByMonth: any = {};
    const revenueByMonth: any = {};
    orders.forEach((o) => {
      const date = o.fields.date ? new Date(o.fields.date as string) : null;
      if (!date) return;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
      revenueByMonth[month] =
        (revenueByMonth[month] || 0) + (Number(o.fields.total) || 0);
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
  } catch (error) {
    console.warn("⚠️ getAirtableStats: Erreur Airtable, retour de stats vides");
    return {
      orders: 0,
      revenue: 0,
      products: 0,
      packs: 0,
      ordersByMonth: [],
      revenueByMonth: [],
    };
  }
}

export async function getAirtableOrders({ limit = 10 } = {}) {
  try {
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
  } catch (error) {
    console.warn("⚠️ getAirtableOrders: Erreur Airtable, retour vide");
    return [];
  }
}

export async function getAirtableAlerts() {
  try {
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
    return alerts;
  } catch (error) {
    return [];
  }
}

export async function getAirtableProducts() {
  try {
    const base = getAirtableBase();
    const records = await base("Products").select().all();
    if (records.length === 0) throw new Error("No records found");
    return records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));
  } catch (error) {
    console.warn("⚠️ getAirtableProducts: Utilisation du fallback local");
    // Transformer le format local vers le format attendu
    const allProducts = Object.values(senegaleseProducts).flat();
    return allProducts.map((p: any, index: number) => ({
      id: `local-prod-${index}`,
      Name: p.name,
      Price: p.price,
      Category: p.category,
      "In Stock": p.inStock,
      Description: "",
      ...p.specs,
    }));
  }
}

export async function getAirtablePacks() {
  try {
    const base = getAirtableBase();
    const records = await base("Packs").select().all();
    if (records.length === 0) throw new Error("No records found");
    return records.map((r) => ({
      id: r.id,
      ...r.fields,
    }));
  } catch (error: any) {
    console.warn("⚠️ getAirtablePacks: Utilisation du fallback local", error.message);
    // Aplatir les packs de produits-senegal.js
    const packs: any[] = [
      ...senegalesePacks.primaire.map(p => ({ ...p, Category: "Primaire" })),
      ...senegalesePacks.college.map(p => ({ ...p, Category: "Collège" })),
    ];
    
    return packs.map((p, index) => ({
      id: `local-pack-${index}`,
      Name: p.name,
      Level: p.level,
      Price: p.price,
      "Original Price": p.originalPrice,
      Description: p.description || `Pack complet pour le niveau ${p.level}`,
      Contents: p.contents || [],
      "Is Popular": p.isPopular,
      "In Stock": true,
      Image: p.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg"
    }));
  }
}


export async function getAirtableProductById(id: string) {
  try {
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
  } catch (error) {
    return null;
  }
}
