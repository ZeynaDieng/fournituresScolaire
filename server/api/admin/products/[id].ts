// server/api/admin/products/[id].ts
import { defineEventHandler, readBody, createError } from "h3";
import { getAirtableBase } from "~/utils/airtable-base";

function mapToAirtableFields(input: any) {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, any> = {};
  if (input.name !== undefined) out["Name"] = input.name;
  if (input.price !== undefined) out["Price"] = Number(input.price) || 0;
  if (input.originalPrice !== undefined)
    out["Original Price"] = input.originalPrice;
  if (input.category !== undefined) out["Category"] = input.category;
  if (input.image !== undefined) out["Image URL"] = input.image;
  if (input.images !== undefined)
    out["Images"] = Array.isArray(input.images)
      ? input.images.join(", ")
      : input.images;
  if (input.description !== undefined) out["Description"] = input.description;
  if (input.inStock !== undefined) out["In Stock"] = Boolean(input.inStock);
  if (input.isPromotion !== undefined)
    out["Is Promotion"] = Boolean(input.isPromotion);
  if (input.promotionEndDate !== undefined)
    out["Promotion End Date"] = input.promotionEndDate;
  // Allow raw Airtable field keys passthrough as well
  const passthroughKeys = [
    "Name",
    "Price",
    "Original Price",
    "Category",
    "Image URL",
    "Images",
    "Description",
    "In Stock",
    "Is Promotion",
    "Promotion End Date",
    "Features",
    "Specs",
    "Reviews",
    "Bulk Options",
  ];
  for (const k of passthroughKeys) {
    if (input[k] !== undefined) out[k] = input[k];
  }
  return out;
}

export default defineEventHandler(async (event) => {
  const id = String(event.context?.params?.id || "");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing product id" });
  }

  const base = getAirtableBase();
  const tableName = process.env.AIRTABLE_PRODUCTS_TABLE!;

  try {
    if (event.method === "DELETE") {
      await base(tableName).destroy(id);
      return { success: true };
    }

    if (event.method === "PUT") {
      const body = await readBody(event);
      const fields = mapToAirtableFields(body);
      if (Object.keys(fields).length === 0) {
        throw createError({
          statusCode: 422,
          statusMessage: "No updatable fields provided",
        });
      }
      const updated = await base(tableName).update([{ id, fields }]);
      return { id: updated[0].id, ...updated[0].fields };
    }

    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  } catch (err: any) {
    console.error("AIRTABLE ADMIN PRODUCTS [id] ERROR:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Airtable error",
    });
  }
});
