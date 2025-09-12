import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = event.context?.params?.orderRef;

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Configuration Airtable manquante",
      });
    }

    // Récupérer tous les records et chercher par Order ID
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=500`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Erreur Airtable: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Aucune commande trouvée",
      });
    }

    // Chercher la commande par Order ID
    const targetRecord = data.records.find(
      (record: any) => record.fields["Order ID"] === orderRef
    );

    if (!targetRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: `Commande ${orderRef} non trouvée`,
      });
    }

    // Transformer les données Airtable en format attendu
    const orderData = {
      id: targetRecord.id,
      orderRef: targetRecord.fields["Order ID"],
      amount: targetRecord.fields["Total Amount"] || 0,
      paymentMethod: "PayTech", // Par défaut
      status: targetRecord.fields["Status"] || "Pending",
      customerName: targetRecord.fields["Customer Name"] || "",
      customerEmail: targetRecord.fields["Customer Email"] || "",
      customerPhone: targetRecord.fields["Customer Phone"] || "",
      createdAt: targetRecord.createdTime,
      items: targetRecord.fields["Items"]
        ? targetRecord.fields["Items"].split("\n").map((item: string) => {
            // Parser le format "Nom (x1) - 100FCFA"
            const match = item.match(/^(.+?)\s*\(x(\d+)\)\s*-\s*(\d+)FCFA?$/);
            if (match) {
              return {
                name: match[1].trim(),
                quantity: parseInt(match[2]),
                price: parseInt(match[3]),
              };
            }
            return {
              name: item,
              quantity: 1,
              price: 0,
            };
          })
        : [],
    };

    return {
      success: true,
      order: orderData,
    };
  } catch (error: any) {
    console.error("Erreur récupération commande:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération de la commande",
    });
  }
});
