// utils/airtable.ts
import Airtable from "airtable";

// Configuration Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error("Variables d'environnement Airtable manquantes");
}

// Initialisation d'Airtable
const airtable = new Airtable({
  apiKey: AIRTABLE_API_KEY,
});

const base = airtable.base(AIRTABLE_BASE_ID!);

// Types pour les données Airtable
export interface AirtableProduct {
  id?: string;
  Name: string;
  Price: number;
  "Original Price"?: number;
  Category: string;
  "Image URL": string;
  Images?: string;
  Description?: string;
  "In Stock": boolean;
  "Is Promotion": boolean;
  "Promotion End Date"?: string;
  Features?: string;
  Specs?: string;
  Reviews?: string;
  "Bulk Options"?: string;
  "Local ID"?: string;
}

export interface AirtablePack {
  id?: string;
  Name: string;
  Level?: string;
  Price: number;
  "Original Price"?: number;
  Image: string;
  Description?: string;
  Contents?: string[];
  "Is Popular": boolean;
  "In Stock": boolean;
  "Is Promotion": boolean;
  "Promotion End Date"?: string;
}

export interface AirtableOrder {
  id?: string;
  Reference: string;
  "Customer Name": string;
  "Customer Email"?: string;
  "Customer Phone"?: string;
  Items: string; // JSON string
  Total: number;
  Status: string;
  "Payment Status": string;
  "Created At": string;
}

// Service Airtable
export class AirtableService {
  // ===== PRODUITS =====

  static async getProducts(): Promise<AirtableProduct[]> {
    try {
      const records = await base(
        process.env.AIRTABLE_PRODUCTS_TABLE || "Products"
      )
        .select({
          view: "Grid view",
          filterByFormula: "{In Stock} = TRUE()",
          sort: [{ field: "Name", direction: "asc" }],
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        Name: record.get("Name") as string,
        Price: record.get("Price") as number,
        "Original Price": record.get("Original Price") as number,
        Category: record.get("Category") as string,
        "Image URL": record.get("Image URL") as string,
        Images: record.get("Images") as string,
        Description: record.get("Description") as string,
        "In Stock": record.get("In Stock") as boolean,
        "Is Promotion": record.get("Is Promotion") as boolean,
        "Promotion End Date": record.get("Promotion End Date") as string,
        Features: record.get("Features") as string,
        Specs: record.get("Specs") as string,
        Reviews: record.get("Reviews") as string,
        "Bulk Options": record.get("Bulk Options") as string,
        "Local ID": record.get("Local ID") as string,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return [];
    }
  }

  static async getProductById(id: string): Promise<AirtableProduct | null> {
    try {
      const record = await base(
        process.env.AIRTABLE_PRODUCTS_TABLE || "Products"
      ).find(id);

      return {
        id: record.id,
        Name: record.get("Name") as string,
        Price: record.get("Price") as number,
        "Original Price": record.get("Original Price") as number,
        Category: record.get("Category") as string,
        "Image URL": record.get("Image URL") as string,
        Images: record.get("Images") as string,
        Description: record.get("Description") as string,
        "In Stock": record.get("In Stock") as boolean,
        "Is Promotion": record.get("Is Promotion") as boolean,
        "Promotion End Date": record.get("Promotion End Date") as string,
        Features: record.get("Features") as string,
        Specs: record.get("Specs") as string,
        Reviews: record.get("Reviews") as string,
        "Bulk Options": record.get("Bulk Options") as string,
        "Local ID": record.get("Local ID") as string,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return null;
    }
  }

  // ===== PACKS =====

  static async getPacks(): Promise<AirtablePack[]> {
    try {
      const records = await base(process.env.AIRTABLE_PACKS_TABLE || "Packs")
        .select({
          view: "Grid view",
          filterByFormula: "{In Stock} = TRUE()",
          sort: [{ field: "Is Popular", direction: "desc" }],
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        Name: record.get("Name") as string,
        Level: record.get("Level") as string,
        Price: record.get("Price") as number,
        "Original Price": record.get("Original Price") as number,
        Image: record.get("Image") as string,
        Description: record.get("Description") as string,
        Contents: record.get("Contents") as string[],
        "Is Popular": record.get("Is Popular") as boolean,
        "In Stock": record.get("In Stock") as boolean,
        "Is Promotion": record.get("Is Promotion") as boolean,
        "Promotion End Date": record.get("Promotion End Date") as string,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des packs:", error);
      return [];
    }
  }

  static async getPopularPacks(): Promise<AirtablePack[]> {
    try {
      const records = await base(process.env.AIRTABLE_PACKS_TABLE || "Packs")
        .select({
          view: "Grid view",
          filterByFormula: "AND({In Stock} = TRUE(), {Is Popular} = TRUE())",
          maxRecords: 6,
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        Name: record.get("Name") as string,
        Level: record.get("Level") as string,
        Price: record.get("Price") as number,
        "Original Price": record.get("Original Price") as number,
        Image: record.get("Image") as string,
        Description: record.get("Description") as string,
        Contents: record.get("Contents") as string[],
        "Is Popular": record.get("Is Popular") as boolean,
        "In Stock": record.get("In Stock") as boolean,
        "Is Promotion": record.get("Is Promotion") as boolean,
        "Promotion End Date": record.get("Promotion End Date") as string,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des packs populaires:",
        error
      );
      return [];
    }
  }

  // ===== COMMANDES =====

  static async createOrder(
    orderData: Omit<AirtableOrder, "id">
  ): Promise<string | null> {
    try {
      const record = await base(
        process.env.AIRTABLE_ORDERS_TABLE || "Orders"
      ).create([
        {
          fields: {
            Reference: orderData.Reference,
            "Customer Name": orderData["Customer Name"],
            "Customer Email": orderData["Customer Email"],
            "Customer Phone": orderData["Customer Phone"],
            Items: orderData.Items,
            Total: orderData.Total,
            Status: orderData.Status,
            "Payment Status": orderData["Payment Status"],
            "Created At": orderData["Created At"],
          },
        },
      ]);

      return record[0].id;
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      return null;
    }
  }

  static async getOrders(): Promise<AirtableOrder[]> {
    try {
      const records = await base(process.env.AIRTABLE_ORDERS_TABLE || "Orders")
        .select({
          view: "Grid view",
          sort: [{ field: "Created At", direction: "desc" }],
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        Reference: record.get("Reference") as string,
        "Customer Name": record.get("Customer Name") as string,
        "Customer Email": record.get("Customer Email") as string,
        "Customer Phone": record.get("Customer Phone") as string,
        Items: record.get("Items") as string,
        Total: record.get("Total") as number,
        Status: record.get("Status") as string,
        "Payment Status": record.get("Payment Status") as string,
        "Created At": record.get("Created At") as string,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      return [];
    }
  }

  // ===== CATÉGORIES =====

  static async getCategories(): Promise<string[]> {
    try {
      const records = await base(
        process.env.AIRTABLE_PRODUCTS_TABLE || "Products"
      )
        .select({
          view: "Grid view",
          fields: ["Category"],
        })
        .all();

      const categories = records
        .map((record) => record.get("Category") as string)
        .filter(Boolean)
        .filter((category, index, self) => self.indexOf(category) === index)
        .sort();

      return categories;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  }
}

export default AirtableService;
