// /utils/local-storage.ts
import { promises as fs } from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const ORDERS_FILE = path.join(STORAGE_DIR, "orders.json");
const BACKUP_DIR = path.join(STORAGE_DIR, "backups");

interface StoredOrder {
  id: string;
  ref: string;
  timestamp: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    method: string;
    cost: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  amounts: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  source: "whatsapp" | "web" | "api";
  metadata?: any;
}

// Initialiser le système de stockage
export const initStorage = async () => {
  try {
    // Créer les dossiers si ils n'existent pas
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Créer le fichier orders.json si il n'existe pas
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
      console.log("✅ Fichier orders.json créé");
    }

    console.log("✅ Système de stockage local initialisé");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du stockage:", error);
    throw error;
  }
};

// Lire toutes les commandes
export const getAllOrders = async (): Promise<StoredOrder[]> => {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.warn("⚠️ Erreur lecture commandes, retour tableau vide:", error);
    return [];
  }
};

// Sauvegarder une nouvelle commande
export const saveOrder = async (
  orderData: Omit<StoredOrder, "id" | "timestamp">
): Promise<StoredOrder> => {
  try {
    await initStorage();

    const orders = await getAllOrders();

    const newOrder: StoredOrder = {
      ...orderData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    orders.push(newOrder);

    // Sauvegarder dans le fichier principal
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // Créer une sauvegarde quotidienne
    await createDailyBackup(orders);

    console.log("✅ Commande sauvegardée localement:", {
      id: newOrder.id,
      ref: newOrder.ref,
      total: newOrder.amounts.total,
      customer: newOrder.customer.name,
    });

    return newOrder;
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde:", error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateLocalOrderStatus = async (
  orderRef: string,
  updates: {
    status?: string;
    paymentStatus?: string;
    metadata?: any;
  }
): Promise<StoredOrder | null> => {
  try {
    const orders = await getAllOrders();
    const orderIndex = orders.findIndex((order) => order.ref === orderRef);

    if (orderIndex === -1) {
      console.warn(`⚠️ Commande ${orderRef} non trouvée`);
      return null;
    }

    // Mettre à jour la commande
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      timestamp: new Date().toISOString(), // Mettre à jour le timestamp
    };

    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    console.log(`✅ Statut mis à jour pour ${orderRef}:`, updates);
    return orders[orderIndex];
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    throw error;
  }
};

// Chercher une commande par référence
export const findOrderByRef = async (
  orderRef: string
): Promise<StoredOrder | null> => {
  try {
    const orders = await getAllOrders();
    return orders.find((order) => order.ref === orderRef) || null;
  } catch (error) {
    console.error("❌ Erreur lors de la recherche:", error);
    return null;
  }
};

// Créer une sauvegarde quotidienne
const createDailyBackup = async (orders: StoredOrder[]) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const backupFile = path.join(BACKUP_DIR, `orders-${today}.json`);

    // Ne créer qu'une sauvegarde par jour
    try {
      await fs.access(backupFile);
      return; // Le fichier existe déjà
    } catch {
      await fs.writeFile(backupFile, JSON.stringify(orders, null, 2));
      console.log(`✅ Sauvegarde quotidienne créée: orders-${today}.json`);
    }
  } catch (error) {
    console.warn("⚠️ Erreur lors de la sauvegarde quotidienne:", error);
  }
};

// Exporter les commandes au format CSV
export const exportOrdersToCSV = async (): Promise<string> => {
  try {
    const orders = await getAllOrders();

    if (orders.length === 0) {
      return "";
    }

    // En-têtes CSV
    const headers = [
      "ID",
      "Référence",
      "Date/Heure",
      "Nom Client",
      "Email",
      "Téléphone",
      "Adresse",
      "Ville",
      "Mode Livraison",
      "Articles",
      "Sous-total",
      "Livraison",
      "Réduction",
      "Total",
      "Statut",
      "Paiement",
      "Source",
    ];

    // Données
    const rows = orders.map((order) => [
      order.id,
      order.ref,
      new Date(order.timestamp).toLocaleString("fr-FR"),
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.shipping.address,
      order.shipping.city,
      order.shipping.method,
      order.items
        .map((item) => `${item.name} (${item.quantity}x${item.price})`)
        .join(" | "),
      order.amounts.subtotal,
      order.amounts.shipping,
      order.amounts.discount,
      order.amounts.total,
      order.status,
      order.paymentStatus,
      order.source,
    ]);

    // Formatter en CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    // Sauvegarder le CSV
    const csvFile = path.join(
      STORAGE_DIR,
      `commandes-export-${Date.now()}.csv`
    );
    await fs.writeFile(csvFile, csvContent);

    console.log(`✅ Export CSV créé: ${csvFile}`);
    return csvFile;
  } catch (error) {
    console.error("❌ Erreur lors de l'export CSV:", error);
    throw error;
  }
};

// Statistiques des commandes
export const getOrdersStats = async () => {
  try {
    const orders = await getAllOrders();

    const stats = {
      total: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.amounts.total, 0),
      byStatus: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySource: orders.reduce((acc, order) => {
        acc[order.source] = (acc[order.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPaymentStatus: orders.reduce((acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentOrders: orders.slice(-5).reverse(), // 5 dernières commandes
    };

    return stats;
  } catch (error) {
    console.error("❌ Erreur lors du calcul des statistiques:", error);
    return null;
  }
};
