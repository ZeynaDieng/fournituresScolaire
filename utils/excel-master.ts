// /utils/excel-master.ts
import * as XLSX from "xlsx";
import { promises as fs } from "fs";
import path from "path";

// Interface pour les données Excel
interface ExcelOrderData {
  id: string;
  ref: string;
  dateHeure: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  adresseLivraison: string;
  ville: string;
  methodeLivraison: string;
  articles: string;
  sousTotal: number;
  fraisLivraison: number;
  reduction: number;
  totalFinal: number;
  statutCommande: string;
  statutPaiement: string;
  methodePaiement: string;
  source: string;
  notes: string;
}

// Chemin vers le fichier Excel maître
const EXCEL_MASTER_PATH = path.join(
  process.cwd(),
  "data",
  "COMMANDES_MAITRE.xlsx"
);
const DATA_DIR = path.join(process.cwd(), "data");

// S'assurer que le dossier existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log("📁 Dossier data créé");
  }
}

// Créer le fichier Excel maître avec style
export async function createMasterExcel(): Promise<void> {
  try {
    await ensureDataDir();
    console.log("📁 Dossier data vérifié");

    // Créer un nouveau workbook avec une approche plus simple
    const wb = XLSX.utils.book_new();

    // En-têtes simplifiés mais complets
    const headers = [
      "ID",
      "Référence",
      "Date",
      "Client",
      "Email",
      "Téléphone",
      "Adresse",
      "Ville",
      "Articles",
      "Total",
      "Statut",
      "Source",
    ];

    // Créer la feuille avec seulement les en-têtes
    const ws = XLSX.utils.aoa_to_sheet([headers]);

    // Largeurs de colonnes optimisées
    ws["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 40 },
      { wch: 12 },
      { wch: 15 },
      { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Commandes");

    // Feuille statistiques simplifiée
    const statsData = [
      ["STATISTIQUES", ""],
      ["Total Commandes", "0"],
      ["CA Total (CFA)", "0"],
      ["Dernière MAJ", new Date().toLocaleString("fr-FR")],
    ];

    const statsWs = XLSX.utils.aoa_to_sheet(statsData);
    statsWs["!cols"] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, statsWs, "Stats");

    console.log("💾 Écriture du fichier vers:", EXCEL_MASTER_PATH);

    // Utiliser writeFileSync qui est plus robuste
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    await fs.writeFile(EXCEL_MASTER_PATH, buffer);

    console.log("✅ Fichier Excel maître créé:", EXCEL_MASTER_PATH);
  } catch (error) {
    console.error("❌ Erreur création fichier Excel:", error);
    throw new Error(`Impossible de créer le fichier Excel: ${error.message}`);
  }
}

// Ajouter une commande au fichier Excel maître
export async function addOrderToMasterExcel(orderData: any): Promise<boolean> {
  try {
    await ensureDataDir();

    let wb;
    let ws;

    // Vérifier si le fichier existe
    try {
      const buffer = await fs.readFile(EXCEL_MASTER_PATH);
      wb = XLSX.read(buffer);
      ws = wb.Sheets["Commandes"];
    } catch {
      // Le fichier n'existe pas, le créer
      await createMasterExcel();
      const buffer = await fs.readFile(EXCEL_MASTER_PATH);
      wb = XLSX.read(buffer);
      ws = wb.Sheets["Commandes"];
    }

    // Préparer les données de la nouvelle ligne (format simplifié)
    const newRowData = [
      orderData.id || `ORDER_${Date.now()}`,
      orderData.ref,
      new Date().toLocaleDateString("fr-FR"),
      orderData.customer?.name || orderData.name || "",
      orderData.customer?.email || orderData.email || "",
      orderData.customer?.phone || orderData.phone || "",
      orderData.shipping?.address || orderData.address || "",
      orderData.shipping?.city || orderData.city || "N/A",
      Array.isArray(orderData.items)
        ? orderData.items
            .map((item) => `${item.name} (${item.quantity})`)
            .join(", ")
        : orderData.items || "",
      orderData.amounts?.total || orderData.total || 0,
      orderData.status || "En attente",
      orderData.source === "whatsapp" ? "WhatsApp" : "Site Web",
    ];

    // Convertir la feuille en array
    const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Ajouter la nouvelle ligne
    data.push(newRowData);

    // Recréer la feuille
    const newWs = XLSX.utils.aoa_to_sheet(data);

    // Conserver les largeurs de colonnes
    newWs["!cols"] = ws["!cols"];

    // Remplacer la feuille
    wb.Sheets["Commandes"] = newWs;

    // Sauvegarder avec la méthode buffer
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    await fs.writeFile(EXCEL_MASTER_PATH, buffer);

    console.log("✅ Commande ajoutée au fichier Excel maître:", orderData.ref);
    return true;
  } catch (error) {
    console.error("❌ Erreur ajout Excel:", error);
    return false;
  }
}

// Mettre à jour les statistiques dans Excel
async function updateExcelStats(
  wb: XLSX.WorkBook,
  ordersData: any[]
): Promise<void> {
  try {
    // Ignorer la ligne d'en-têtes
    const orders = ordersData.slice(1);

    const stats = {
      totalCommandes: orders.length,
      chiffreAffaires: orders.reduce(
        (sum, row) => sum + (parseFloat(row[13]) || 0),
        0
      ), // Colonne Total Final
      enAttente: orders.filter((row) => row[14] === "En attente").length, // Colonne Statut Commande
      confirmees: orders.filter((row) => row[14] === "Confirmée").length,
      livrees: orders.filter((row) => row[14] === "Livrée").length,
      annulees: orders.filter((row) => row[14] === "Annulée").length,
      today: orders.filter((row) => {
        const orderDate = new Date(row[2]).toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        return orderDate === today;
      }).length,
      caToday: orders
        .filter((row) => {
          const orderDate = new Date(row[2]).toISOString().split("T")[0];
          const today = new Date().toISOString().split("T")[0];
          return orderDate === today;
        })
        .reduce((sum, row) => sum + (parseFloat(row[13]) || 0), 0),
      web: orders.filter((row) => row[17] === "Site Web").length,
      whatsapp: orders.filter((row) => row[17] === "WhatsApp").length,
    };

    // Mettre à jour la feuille de statistiques
    const statsData = [
      ["STATISTIQUES GÉNÉRALES", ""],
      ["", ""],
      ["Total Commandes", stats.totalCommandes],
      [
        "Chiffre d'Affaires Total (CFA)",
        stats.chiffreAffaires.toLocaleString("fr-FR"),
      ],
      ["Commandes En Attente", stats.enAttente],
      ["Commandes Confirmées", stats.confirmees],
      ["Commandes Livrées", stats.livrees],
      ["Commandes Annulées", stats.annulees],
      ["", ""],
      ["STATISTIQUES AUJOURD'HUI", ""],
      ["Commandes du jour", stats.today],
      ["CA du jour (CFA)", stats.caToday.toLocaleString("fr-FR")],
      ["", ""],
      ["SOURCES DE COMMANDES", ""],
      ["Site Web", stats.web],
      ["WhatsApp", stats.whatsapp],
      ["", ""],
      [
        "Dernière mise à jour",
        new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" }),
      ],
    ];

    const statsWs = XLSX.utils.aoa_to_sheet(statsData);
    statsWs["!cols"] = [{ wch: 25 }, { wch: 20 }];
    wb.Sheets["Statistiques"] = statsWs;
  } catch (error) {
    console.error("❌ Erreur mise à jour stats Excel:", error);
  }
}

// Obtenir le chemin du fichier Excel pour téléchargement
export function getMasterExcelPath(): string {
  return EXCEL_MASTER_PATH;
}

// Exporter toutes les commandes vers un nouveau fichier Excel
export async function exportToNewExcel(orders: any[]): Promise<string> {
  const exportPath = path.join(DATA_DIR, `export-commandes-${Date.now()}.xlsx`);

  const wb = XLSX.utils.book_new();

  // Préparer les données
  const headers = [
    "ID",
    "Référence",
    "Date/Heure",
    "Client",
    "Email",
    "Téléphone",
    "Adresse",
    "Ville",
    "Articles",
    "Total (CFA)",
    "Statut",
    "Source",
  ];

  const data = [headers];

  orders.forEach((order) => {
    data.push([
      order.id,
      order.ref,
      new Date(order.timestamp).toLocaleString("fr-FR"),
      order.customer?.name || "",
      order.customer?.email || "",
      order.customer?.phone || "",
      order.shipping?.address || "",
      order.shipping?.city || "",
      Array.isArray(order.items)
        ? order.items
            .map((item) => `${item.name} (${item.quantity})`)
            .join(", ")
        : JSON.stringify(order.items),
      order.amounts?.total || order.total || 0,
      order.status || "",
      order.source === "whatsapp" ? "WhatsApp" : "Site Web",
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 25 },
    { wch: 30 },
    { wch: 18 },
    { wch: 40 },
    { wch: 15 },
    { wch: 50 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Commandes Export");
  XLSX.writeFile(wb, exportPath);

  return exportPath;
}
