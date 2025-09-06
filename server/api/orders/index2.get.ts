/**
 * API endpoint simple pour récupérer toutes les commandes
 * GET /api/airtable/orders - Version simplifiée qui redirige vers Airtable
 */

import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Appel direct à l'API Airtable
    const airtableResponse = await fetch(
      `${
        process.env.NUXT_PUBLIC_SITE_URL ||
        "https://fournitures-scolaire.vercel.app"
      }/api/airtable/orders`
    );
    const orders = await airtableResponse.json();

    // Reformater pour compatibilité
    return {
      success: true,
      orders: (orders as any).data || [],
      count: (orders as any).total || 0,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur récupération commandes",
    });
  }
});
