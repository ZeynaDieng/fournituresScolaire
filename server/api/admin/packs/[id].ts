// server/api/admin/packs/[id].ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const base = getAirtableBase();
  const id = event.context?.params?.id;
  if (!id) return { error: "Missing id" };

  if (event.method === "GET") {
    const record = await base(process.env.AIRTABLE_PACKS_TABLE!)
      .find(id)
      .catch(() => null);
    if (!record) return { error: "Not found" };
    return { id: record.id, ...record.fields };
  }
  if (event.method === "DELETE") {
    await base(process.env.AIRTABLE_PACKS_TABLE!).destroy([id]);
    return { success: true };
  }
  if (event.method === "PUT") {
    try {
      const body = await readBody(event);
      console.log("PUT request body:", JSON.stringify(body, null, 2));

      // Validation des champs requis
      if (!body.Name || !body.Level || body.Price === undefined) {
        throw createError({
          statusCode: 422,
          statusMessage: "Champs requis manquants: Name, Level, Price",
        });
      }

      // Nettoyer les champs vides et exclure les champs calculés
      const cleanedBody = { ...body };

      // Exclure les champs calculés par Airtable
      delete cleanedBody.id;
      delete cleanedBody["Discount %"];
      delete cleanedBody["Pack Description Summary"];

      Object.keys(cleanedBody).forEach((key) => {
        if (
          cleanedBody[key] === "" ||
          cleanedBody[key] === null ||
          cleanedBody[key] === undefined
        ) {
          delete cleanedBody[key];
        }
      });

      console.log("Cleaned body:", JSON.stringify(cleanedBody, null, 2));

      const updated = await base(process.env.AIRTABLE_PACKS_TABLE!).update([
        { id, fields: cleanedBody },
      ]);

      return { id: updated[0].id, ...updated[0].fields };
    } catch (error: any) {
      console.error("Error updating pack:", error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message || "Erreur lors de la mise à jour du pack",
      });
    }
  }
});
