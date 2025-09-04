export default defineEventHandler(async (event) => {
  console.log("🧪 Test WhatsApp POST endpoint called");

  try {
    const body = await readBody(event);
    console.log("🧪 Body:", body);

    return {
      success: true,
      message: "WhatsApp POST endpoint working",
      timestamp: new Date().toISOString(),
      hasBody: !!body,
      bodyKeys: body ? Object.keys(body) : [],
    };
  } catch (error) {
    console.error("🧪 Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
});
