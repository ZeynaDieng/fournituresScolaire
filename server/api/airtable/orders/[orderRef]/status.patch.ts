// server/api/airtable/orders/[orderRef]/status.patch.ts

import { updateOrderStatusInAirtable } from "../../../../../utils/airtable-orders";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = getRouterParam(event, "orderRef");
    const body = await readBody(event);

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Order reference is required",
      });
    }

    if (!body.status) {
      throw createError({
        statusCode: 400,
        statusMessage: "Status is required",
      });
    }

    // Valider les statuts autorisés
    const validStatuses = ["Pending", "Paid", "Shipped", "Delivered"];
    if (!validStatuses.includes(body.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid status. Must be one of: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const result = await updateOrderStatusInAirtable(orderRef, body.status);

    return {
      success: true,
      orderRef,
      newStatus: body.status,
      airtableRecord: result,
    };
  } catch (error) {
    console.error("Error updating order status:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update order status",
    });
  }
});
