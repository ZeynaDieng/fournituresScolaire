// server/api/admin/users/index.ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const base = getAirtableBase();
  if (event.method === "GET") {
    const records = await base(process.env.AIRTABLE_USERS_TABLE!)
      .select()
      .all();
    return records.map((r) => ({ id: r.id, ...r.fields }));
  }
});
