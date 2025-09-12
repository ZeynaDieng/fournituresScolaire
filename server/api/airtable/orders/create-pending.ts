// /server/api/airtable/orders/create-pending.ts
import { addOrderToAirtable } from "~/utils/airtable-orders";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    return { status: 405, message: "Method Not Allowed" };
  }

  try {
    const body = await readBody(event);
    if (!body || !body.customer || !body.items || !body.amounts) {
      return { status: 400, message: "Champs obligatoires manquants" };
    }

    // Création de la commande dans Airtable
    const airtableResult = await addOrderToAirtable(body);

    // Optionnel : Ajout Google Sheets ou autre intégration ici
    // ...

    return {
      status: 200,
      message: "Commande enregistrée dans Airtable",
      airtable: airtableResult,
    };
  } catch (error: any) {
    console.error("Erreur API /airtable/orders/create-pending:", error);
    return {
      status: 500,
      message: "Erreur lors de la création de la commande",
      error: error?.message || error,
    };
  }
});
