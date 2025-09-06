export default defineEventHandler(async (event) => {
  console.log("🔍 API Status endpoint called");

  // Get environment information
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    hasEmailConfig: !!(
      process.env.NOTIFICATION_EMAIL_USER &&
      process.env.NOTIFICATION_EMAIL_PASSWORD &&
      process.env.ADMIN_EMAIL
    ),
    hasWhatsAppConfig: !!process.env.WHATSAPP_BUSINESS_NUMBER,
    emailUser: process.env.NOTIFICATION_EMAIL_USER ? "configured" : "missing",
    emailPassword: process.env.NOTIFICATION_EMAIL_PASSWORD
      ? "configured"
      : "missing",
    adminEmail: process.env.ADMIN_EMAIL ? "configured" : "missing",
    whatsappNumber: process.env.WHATSAPP_BUSINESS_NUMBER
      ? "configured"
      : "missing",
    timestamp: new Date().toISOString(),
  };

  // Get request info
  const requestInfo = {
    method: event.node.req.method,
    url: event.node.req.url,
    userAgent: event.node.req.headers["user-agent"],
    referer: event.node.req.headers.referer,
    host: event.node.req.headers.host,
    origin: event.node.req.headers.origin,
  };

  // Test API routes availability
  const apiRoutes = [
    "/api/test-simple",
    "/api/test-whatsapp",
    "/api/airtable/orders/create-pending",
  ];

  console.log("🔍 Environment:", envInfo);
  console.log("🔍 Request:", requestInfo);

  return {
    success: true,
    message: "API Status Check",
    timestamp: new Date().toISOString(),
    environment: envInfo,
    request: requestInfo,
    availableRoutes: apiRoutes,
    runtime: "vercel-serverless",
  };
});
