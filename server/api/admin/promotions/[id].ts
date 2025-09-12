// server/api/admin/promotions/[id].ts
import { defineEventHandler, readBody, createError } from "h3";
import { getAirtableBase } from "~/utils/airtable-base";

function mapPromotionFields(input: any) {
  const out: Record<string, any> = {};
  if (!input || typeof input !== "object") return out;
  // Common fields
  if (input.title !== undefined) out["Title"] = input.title;
  if (input.description !== undefined) out["Description"] = input.description;
  if (input.discount !== undefined)
    out["Discount"] = Number(input.discount) || 0;
  if (input.type !== undefined) out["Type"] = input.type;
  if (input.endDate !== undefined) out["End Date"] = input.endDate;
  if (input.products !== undefined) out["Products"] = input.products; // could be links/strings
  if (input.category !== undefined) out["Category"] = input.category;
  if (input.trending !== undefined) out["Trending"] = Boolean(input.trending);
  if (input.featured !== undefined) out["Featured"] = Boolean(input.featured);
  if (input.isActive !== undefined) out["Is Active"] = Boolean(input.isActive);

  // Passthrough Airtable keys if provided
  const pass = [
    "Title",
    "Description",
    "Discount",
    "Type",
    "End Date",
    "Products",
    "Category",
    "Trending",
    "Featured",
    "Is Active",
  ];
  for (const k of pass) if (input[k] !== undefined) out[k] = input[k];
  return out;
}

export default defineEventHandler(async (event) => {
  const id = String(event.context?.params?.id || "");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });
  const base = getAirtableBase();
  const table = process.env.AIRTABLE_PROMOTIONS_TABLE!;

  try {
    if (event.method === "DELETE") {
      await base(table).destroy(id);
      return { success: true };
    }
    if (event.method === "PUT") {
      const body = await readBody(event);
      const fields = mapPromotionFields(body);
      if (Object.keys(fields).length === 0) {
        throw createError({
          statusCode: 422,
          statusMessage: "No fields to update",
        });
      }
      const updated = await base(table).update([{ id, fields }]);
      return { id: updated[0].id, ...updated[0].fields };
    }
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  } catch (err: any) {
    console.error("ADMIN PROMOTIONS [id] ERROR:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Airtable error",
    });
  }
});
