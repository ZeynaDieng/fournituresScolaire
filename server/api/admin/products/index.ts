// server/api/admin/products/index.ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const base = getAirtableBase();
  if (event.method === "GET") {
    const records = await base(process.env.AIRTABLE_PRODUCTS_TABLE!)
      .select()
      .all();
    return records.map((r) => ({ id: r.id, ...r.fields }));
  }
  if (event.method === "POST") {
    const body = await readBody(event);
    console.log("ADD PRODUCT BODY:", body);
    // Mapping pour Airtable (name -> Name)
    if (body.name) {
      body.Name = body.name;
      delete body.name;
    }
    try {
      const created = await base(process.env.AIRTABLE_PRODUCTS_TABLE!).create([
        { fields: body },
      ]);
      return { id: created[0].id, ...created[0].fields };
    } catch (err) {
      console.error("AIRTABLE ERROR:", err);
      throw createError({
        statusCode: 422,
        statusMessage: err.message || "Airtable error",
      });
    }
  }
});
