// server/api/orders/search.post.ts
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { query } = body;

    if (!query || typeof query !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "Query parameter is required",
      });
    }

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Airtable configuration missing",
      });
    }

    // Normaliser la requête de recherche
    const searchQuery = query.trim().toLowerCase();

    // Récupérer tous les enregistrements (limité à 100 pour les performances)
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=100`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: "Failed to fetch orders from Airtable",
      });
    }

    const data = await response.json();
    const allOrders = data.records || [];

    // Filtrer les commandes selon la requête
    const matchingOrders = allOrders.filter((record: any) => {
      const fields = record.fields;

      // Rechercher dans les différents champs
      const orderId = (fields["Order ID"] || "").toLowerCase();
      const customerEmail = (fields["Customer Email"] || "").toLowerCase();
      const customerPhone = (fields["Customer Phone"] || "").toLowerCase();
      const customerName = (fields["Customer Name"] || "").toLowerCase();

      // Vérifier si la requête correspond à l'un des champs
      return (
        orderId.includes(searchQuery) ||
        customerEmail.includes(searchQuery) ||
        customerPhone.includes(searchQuery) ||
        customerName.includes(searchQuery)
      );
    });

    // Transformer les données pour la réponse
    const orders = matchingOrders.map((record: any) => {
      const fields = record.fields;

      // Parser les items si c'est une chaîne
      let items = [];
      if (fields["Items"]) {
        try {
          // Si c'est une chaîne, essayer de la parser
          if (typeof fields["Items"] === "string") {
            // Format: "Item 1 (x2) - 1000FCFA\nItem 2 (x1) - 500FCFA"
            const itemLines = fields["Items"].split("\n");
            items = itemLines
              .map((line: string) => {
                const match = line.match(
                  /^(.+?)\s*\(x(\d+)\)\s*-\s*(\d+)FCFA$/
                );
                if (match) {
                  return {
                    name: match[1].trim(),
                    quantity: parseInt(match[2]),
                    price: parseInt(match[3]),
                  };
                }
                return null;
              })
              .filter(Boolean);
          } else if (Array.isArray(fields["Items"])) {
            items = fields["Items"];
          }
        } catch (error) {
          console.warn("Erreur parsing items:", error);
          items = [];
        }
      }

      return {
        id: record.id,
        orderRef: fields["Order ID"] || "",
        amount: fields["Total Amount"] || 0,
        status: fields["Status"] || "pending",
        customerName: fields["Customer Name"] || "",
        customerEmail: fields["Customer Email"] || "",
        customerPhone: fields["Customer Phone"] || "",
        createdAt: fields["Created Date"] || new Date().toISOString(),
        items: items,
      };
    });

    // Trier par date de création (plus récent en premier)
    orders.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      success: true,
      orders: orders,
      message: `${orders.length} commande(s) trouvée(s)`,
    };
  } catch (error: any) {
    console.error("Erreur recherche commandes:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Erreur lors de la recherche des commandes",
    });
  }
});
