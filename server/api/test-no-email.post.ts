export default defineEventHandler(async (event) => {
  try {
    console.log("🧪 Testing endpoint without email...");

    const body = await readBody(event);
    console.log("🧪 Request body received:", JSON.stringify(body, null, 2));

    // Validate basic data like the main endpoint
    if (!body.customer || !body.customer.name || !body.customer.phone) {
      throw new Error("Customer data missing or invalid");
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      throw new Error("Items missing or invalid");
    }

    if (
      !body.amounts ||
      typeof body.amounts.total !== "number" ||
      body.amounts.total <= 0
    ) {
      throw new Error("Amount total missing or invalid");
    }

    // Generate order reference
    const orderRef = `TEST-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log("🧪 Validation successful for order:", orderRef);

    return {
      success: true,
      message: "Test endpoint working without email",
      order: {
        ref: orderRef,
        customer: body.customer.name,
        total: body.amounts.total,
        itemCount: body.items.length,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("🧪 Test endpoint error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };
  }
});
