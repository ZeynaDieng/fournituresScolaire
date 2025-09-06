/**
 * Endpoint de test simple pour diagnostiquer les problèmes CORS
 * GET /api/test
 */

import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return {
    success: true,
    message: "API fonctionnelle",
    timestamp: new Date().toISOString(),
    method: event.node.req.method,
    url: event.node.req.url,
    host: event.node.req.headers.host,
    userAgent: event.node.req.headers["user-agent"],
    origin: event.node.req.headers.origin,
  };
});
