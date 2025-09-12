// server/api/admin/promotions/index.ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const base = getAirtableBase();
  if (event.method === "GET") {
    const records = await base(process.env.AIRTABLE_PROMOTIONS_TABLE!)
      .select()
      .all();
    return records.map((r) => ({ id: r.id, ...r.fields }));
  }
  if (event.method === "POST") {
    const body = await readBody(event);
    const created = await base(process.env.AIRTABLE_PROMOTIONS_TABLE!).create([
      { fields: body },
    ]);
    return { id: created[0].id, ...created[0].fields };
  }
});
