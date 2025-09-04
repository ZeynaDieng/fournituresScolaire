// /utils/google-sheets.ts
interface OrderData {
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
}

// Configuration Google Sheets avec variables d'environnement
export const GOOGLE_SHEETS_CONFIG = {
  // ID de votre Google Sheet (à récupérer dans l'URL)
  SHEET_ID: process.env.GOOGLE_SHEET_ID || "VOTRE_SHEET_ID_ICI",

  // Nom de l'onglet où ajouter les données
  SHEET_NAME: "Commandes",

  // API Key Google (à créer dans Google Cloud Console)
  API_KEY: process.env.GOOGLE_SHEETS_API_KEY || "VOTRE_API_KEY_ICI",
};

// Fonction pour ajouter une commande dans Google Sheets
export const addOrderToGoogleSheets = async (orderData: OrderData) => {
  try {
    // Vérifier que la configuration est valide
    if (
      !GOOGLE_SHEETS_CONFIG.SHEET_ID ||
      GOOGLE_SHEETS_CONFIG.SHEET_ID === "VOTRE_SHEET_ID_ICI"
    ) {
      throw new Error(
        "GOOGLE_SHEET_ID n'est pas configuré dans les variables d'environnement"
      );
    }

    if (
      !GOOGLE_SHEETS_CONFIG.API_KEY ||
      GOOGLE_SHEETS_CONFIG.API_KEY === "VOTRE_API_KEY_ICI"
    ) {
      throw new Error(
        "GOOGLE_SHEETS_API_KEY n'est pas configuré dans les variables d'environnement"
      );
    }
    // Préparer les données pour le sheet
    const timestamp = new Date().toLocaleString("fr-FR", {
      timeZone: "Africa/Dakar",
    });

    const orderRef = `WA-${Date.now()}`;

    // Formater les articles en une seule cellule
    const itemsList = orderData.items
      .map(
        (item) =>
          `${item.name} (Qté: ${item.quantity}, Prix: ${item.price} CFA)`
      )
      .join(" | ");

    // Données à insérer (une ligne)
    const rowData = [
      timestamp, // A: Date/Heure
      orderRef, // B: Référence
      orderData.customer.name, // C: Nom client
      orderData.customer.email, // D: Email
      orderData.customer.phone, // E: Téléphone
      orderData.shipping.address, // F: Adresse
      orderData.shipping.city, // G: Ville
      orderData.shipping.method, // H: Mode livraison
      itemsList, // I: Articles
      orderData.amounts.subtotal, // J: Sous-total
      orderData.amounts.shipping, // K: Frais livraison
      orderData.amounts.discount, // L: Réduction
      orderData.amounts.total, // M: Total
      "En attente", // N: Statut commande
      "Non payé", // O: État paiement
      "WhatsApp", // P: Méthode paiement
      "", // Q: Date paiement (vide initialement)
      "", // R: Notes Admin (vide initialement)
    ];

    // URL de l'API Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur Google Sheets: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    console.log("✅ Commande ajoutée à Google Sheets:", {
      orderRef,
      updatedRange: result.updates?.updatedRange,
      updatedRows: result.updates?.updatedRows,
    });

    return {
      success: true,
      orderRef,
      sheetResponse: result,
    };
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout à Google Sheets:", error);
    throw error;
  }
};

// Fonction pour créer les en-têtes du sheet (à exécuter une seule fois)
export const createSheetHeaders = async () => {
  const headers = [
    "Date/Heure",
    "Référence",
    "Nom Client",
    "Email",
    "Téléphone",
    "Adresse",
    "Ville",
    "Mode Livraison",
    "Articles",
    "Sous-total (CFA)",
    "Livraison (CFA)",
    "Réduction (CFA)",
    "Total (CFA)",
    "Statut Commande",
    "État Paiement",
    "Méthode Paiement",
    "Date Paiement",
    "Notes Admin",
  ];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!A1:R1?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [headers],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la création des en-têtes: ${response.status}`
      );
    }

    console.log("✅ En-têtes créés dans Google Sheets");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la création des en-têtes:", error);
    throw error;
  }
};

// Fonction pour mettre à jour le statut d'une commande
export const updateOrderStatus = async (
  orderRef: string,
  status: {
    orderStatus?:
      | "En attente"
      | "Confirmée"
      | "Expédiée"
      | "Livrée"
      | "Annulée";
    paymentStatus?: "Non payé" | "Payé" | "Remboursé";
    paymentDate?: string;
    adminNotes?: string;
  }
) => {
  try {
    // D'abord, trouver la ligne de la commande
    const searchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!B:B?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`Erreur lors de la recherche: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const rows = searchData.values || [];

    // Trouver l'index de la ligne (en commençant par 1 car les arrays commencent à 0)
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === orderRef) {
        rowIndex = i + 1; // +1 car Google Sheets commence à 1
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error(`Commande ${orderRef} non trouvée`);
    }

    // Préparer les mises à jour
    const updates: Array<{ range: string; values: string[][] }> = [];

    if (status.orderStatus) {
      updates.push({
        range: `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!N${rowIndex}`,
        values: [[status.orderStatus]],
      });
    }

    if (status.paymentStatus) {
      updates.push({
        range: `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!O${rowIndex}`,
        values: [[status.paymentStatus]],
      });
    }

    if (status.paymentDate) {
      updates.push({
        range: `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!Q${rowIndex}`,
        values: [[status.paymentDate]],
      });
    }

    if (status.adminNotes) {
      updates.push({
        range: `${GOOGLE_SHEETS_CONFIG.SHEET_NAME}!R${rowIndex}`,
        values: [[status.adminNotes]],
      });
    }

    // Effectuer les mises à jour
    for (const update of updates) {
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${update.range}?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

      const updateResponse = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: update.values,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(
          `Erreur lors de la mise à jour: ${updateResponse.status}`
        );
      }
    }

    console.log(`✅ Statut mis à jour pour la commande ${orderRef}`);
    return { success: true, rowIndex, updatesCount: updates.length };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
};

// Fonction pour formater les montants
export const formatAmountForSheet = (amount: number): number => {
  return Math.round(amount);
};

// Fonction pour synchroniser le fichier Excel vers Google Sheets
export const syncExcelToGoogleSheets = async () => {
  try {
    console.log("🔄 Début de la synchronisation Excel vers Google Sheets...");

    // Importer les données locales
    const { getAllOrders } = await import("./local-storage");
    const orders = await getAllOrders();

    if (orders.length === 0) {
      console.log("ℹ️ Aucune commande à synchroniser");
      return { success: true, message: "Aucune commande à synchroniser" };
    }

    console.log(`📊 Synchronisation de ${orders.length} commandes...`);

    // Préparer les données pour Google Sheets
    const sheetData = orders.map((order) => [
      // Format Google Sheets : même ordre que les en-têtes
      new Date(order.timestamp).toLocaleString("fr-FR", {
        timeZone: "Africa/Dakar",
      }),
      order.ref,
      order.customer?.name || order.name || "",
      order.customer?.email || order.email || "",
      order.customer?.phone || order.phone || "",
      order.shipping?.address || order.address || "",
      order.shipping?.city || order.city || "",
      order.shipping?.method || "Standard",
      Array.isArray(order.items)
        ? order.items
            .map((item) => `${item.name} (${item.quantity})`)
            .join(", ")
        : order.items || "",
      order.amounts?.subtotal || 0,
      order.amounts?.shipping || 0,
      order.amounts?.discount || 0,
      order.amounts?.total || order.total || 0,
      order.status || "En attente",
      order.paymentStatus || "En attente",
      order.source === "whatsapp" ? "WhatsApp" : "Site Web",
      order.adminNotes || "",
    ]);

    // Ajouter les en-têtes
    const headers = [
      "Date/Heure",
      "Référence",
      "Nom Client",
      "Email",
      "Téléphone",
      "Adresse",
      "Ville",
      "Mode Livraison",
      "Articles",
      "Sous-total (CFA)",
      "Livraison (CFA)",
      "Réduction (CFA)",
      "Total (CFA)",
      "Statut Commande",
      "Statut Paiement",
      "Source",
      "Notes Admin",
    ];

    const allData = [headers, ...sheetData];

    // Remplacer toutes les données dans Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: allData,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur Google Sheets: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    console.log(
      `✅ Synchronisation réussie: ${orders.length} commandes dans Google Sheets`
    );

    return {
      success: true,
      message: `${orders.length} commandes synchronisées`,
      sheetResponse: result,
      ordersCount: orders.length,
    };
  } catch (error) {
    console.error("❌ Erreur synchronisation Google Sheets:", error);
    return {
      success: false,
      error: error.message,
      message: "Erreur lors de la synchronisation",
    };
  }
};

// Fonction pour synchroniser automatiquement après une mise à jour de statut
export const autoSyncAfterStatusUpdate = async (orderRef: string) => {
  try {
    console.log(`🔄 Auto-sync après mise à jour statut: ${orderRef}`);
    const result = await syncExcelToGoogleSheets();

    if (result.success) {
      console.log(`✅ Auto-sync réussie pour ${orderRef}`);
    } else {
      console.warn(`⚠️ Auto-sync échouée pour ${orderRef}:`, result.error);
    }

    return result;
  } catch (error) {
    console.error(`❌ Erreur auto-sync pour ${orderRef}:`, error);
    return { success: false, error: error.message };
  }
};
