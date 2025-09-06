// utils/airtable-orders.ts

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  ref: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city?: string;
    method?: string;
    cost?: number;
  };
  items: OrderItem[];
  amounts: {
    total: number;
    subtotal?: number;
    shipping?: number;
    discount?: number;
  };
  status?: string;
}

export async function addOrderToAirtable(orderData: OrderData) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      throw new Error("Missing Airtable configuration for orders");
    }

    // Préparer l'adresse complète
    const fullAddress = `${orderData.shipping.address}${
      orderData.shipping.city ? ", " + orderData.shipping.city : ""
    }`;

    // Préparer les données pour Airtable
    const airtableRecord = {
      fields: {
        "Order ID": orderData.ref,
        "Customer Name": orderData.customer.name,
        "Customer Email": orderData.customer.email,
        "Customer Phone": orderData.customer.phone,
        "Total Amount": orderData.amounts.total,
        // "Created Date": new Date().toISOString().split('T')[0], // Désactivé temporairement
        Items: orderData.items
          .map((item) => `${item.name} (x${item.quantity}) - ${item.price}€`)
          .join("\n"),
        "Shipping Address": fullAddress,
        // Le champ Status sera ajouté quand il sera créé dans Airtable
        ...(orderData.status && { Status: orderData.status }),
      },
    };

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtableRecord),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Airtable API error: ${error.error?.message || "Unknown error"}`
      );
    }

    const result = await response.json();
    console.log("✅ Commande enregistrée dans Airtable:", orderData.ref);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement dans Airtable:", error);
    throw error;
  }
}

export async function updateOrderStatusInAirtable(
  orderRef: string,
  status: string
) {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      throw new Error("Missing Airtable configuration for orders");
    }

    // D'abord, récupérer l'enregistrement par Order ID
    const listResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?filterByFormula={Order ID}='${orderRef}'`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!listResponse.ok) {
      throw new Error("Failed to find order in Airtable");
    }

    const listResult = await listResponse.json();

    if (!listResult.records || listResult.records.length === 0) {
      throw new Error(`Order ${orderRef} not found in Airtable`);
    }

    const recordId = listResult.records[0].id;

    // Mettre à jour le statut
    const updateResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Status: status,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(
        `Failed to update order status: ${
          error.error?.message || "Unknown error"
        }`
      );
    }

    const result = await updateResponse.json();
    console.log(`✅ Statut de la commande ${orderRef} mis à jour: ${status}`);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
}
