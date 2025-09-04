export default defineEventHandler(async (event) => {
  console.log("🧪 Test API endpoint called");

  return {
    success: true,
    message: "API endpoint working",
    timestamp: new Date().toISOString(),
    method: event.node.req.method,
    url: event.node.req.url,
  };
});
