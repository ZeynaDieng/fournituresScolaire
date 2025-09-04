export default defineEventHandler(async (event) => {
  console.log("🔍 API Status endpoint called");

  // Get environment information
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    hasEmailConfig: !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ),
    hasWhatsAppConfig: !!process.env.WHATSAPP_BUSINESS_NUMBER,
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
    "/api/orders/create-pending",
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
