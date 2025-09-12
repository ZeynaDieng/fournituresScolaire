// server/api/admin/packs/[id].ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, readBody } from "h3";

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
    const body = await readBody(event);
    const updated = await base(process.env.AIRTABLE_PACKS_TABLE!).update([
      { id, fields: body },
    ]);
    return { id: updated[0].id, ...updated[0].fields };
  }
});
