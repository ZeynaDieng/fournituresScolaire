// server/api/airtable/orders.get.ts

export default defineEventHandler(async (event) => {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Missing Airtable configuration for orders",
      });
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?sort[0][field]=Created Date&sort[0][direction]=desc`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Airtable API error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Transformer les données pour le frontend
    const orders = data.records.map((record: any) => ({
      id: record.id,
      orderRef: record.fields["Order ID"],
      customerName: record.fields["Customer Name"],
      customerEmail: record.fields["Customer Email"],
      customerPhone: record.fields["Customer Phone"],
      totalAmount: record.fields["Total Amount"],
      createdDate: record.fields["Created Date"],
      items: record.fields["Items"] || "",
      shippingAddress: record.fields["Shipping Address"],
      status: record.fields["Status"] || "Pending",
      createdAt: record.createdTime,
    }));

    return {
      success: true,
      data: orders,
      total: orders.length,
    };
  } catch (error) {
    console.error("Error fetching orders from Airtable:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch orders from Airtable",
    });
  }
});
