import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const base = getAirtableBase();
  const userId = event.context?.params?.id;

  if (event.method === "GET") {
    try {
      const record = await base(process.env.AIRTABLE_USERS_TABLE!).find(userId);
      return { id: record.id, ...record.fields };
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur non trouvé",
      });
    }
  }

  if (event.method === "PUT") {
    try {
      const body = await readBody(event);
      const updated = await base(process.env.AIRTABLE_USERS_TABLE!).update(
        userId,
        { fields: body }
      );
      return { id: updated.id, ...updated.fields };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Erreur lors de la mise à jour de l'utilisateur",
      });
    }
  }

  if (event.method === "DELETE") {
    try {
      await base(process.env.AIRTABLE_USERS_TABLE!).destroy(userId);
      return { success: true };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Erreur lors de la suppression de l'utilisateur",
      });
    }
  }

  return null;
});
