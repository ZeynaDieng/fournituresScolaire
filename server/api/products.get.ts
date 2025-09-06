/**
 * Endpoint simple pour tester les produits - Redirection vers Airtable
 * GET /api/products
 */

import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Appel interne vers l'endpoint Airtable
    const baseUrl = event.node.req.headers.host?.includes("localhost")
      ? "http://localhost:3000"
      : `https://${event.node.req.headers.host}`;

    const response = await $fetch(`${baseUrl}/api/airtable/products`);

    return response;
  } catch (error) {
    console.error("Erreur dans /api/products:", error);

    // Retourner une réponse d'erreur claire
    return {
      success: false,
      error: "Service temporairement indisponible",
      data: [],
      debug: {
        timestamp: new Date().toISOString(),
        host: event.node.req.headers.host,
        userAgent: event.node.req.headers["user-agent"],
        method: event.node.req.method,
        url: event.node.req.url,
      },
    };
  }
});
