/**
 * Middleware CORS global - Plus robuste pour Vercel
 * Résout définitivement les erreurs 401/403
 */

import { defineEventHandler, setHeaders } from "h3";

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || "";

  // Appliquer CORS à toutes les routes (pas seulement /api/)
  // car Vercel peut avoir des problèmes avec les middlewares conditionnels

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  // Appliquer les headers CORS
  setHeaders(event, corsHeaders);

  // Gérer les requêtes OPTIONS (preflight)
  if (event.node.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
});
