// server/api/admin/products/[id].ts
import { defineEventHandler, readBody, createError } from "h3";
import { getAirtableBase } from "~/utils/airtable-base";

async function syncProductToAirtable(product: any) {
  const base = getAirtableBase();
  const table = base("Products");
  const fields: any = {
    Name: product.name,
    Price: Number(product.sellingPrice || product.price) || 0,
    Category: product.category || "Fournitures",
    Description: product.description || "",
    "Image URL": product.image || "",
    "In Stock": product.inStock !== false && (product.stock ?? 50) > 0,
    "Local ID": product.id,
  };

  if (product.originalPrice) fields["Original Price"] = Number(product.originalPrice);

  let existingRecordId: string | null = null;
  if (product.id && product.id.startsWith("rec")) {
    existingRecordId = product.id;
  } else {
    const records = await table.select().all();
    const match = records.find(
      (r: any) =>
        r.get("Local ID") === product.id ||
        (r.get("Name") || "").toLowerCase().trim() === (product.name || "").toLowerCase().trim()
    );
    if (match) {
      existingRecordId = match.id;
    }
  }

  if (existingRecordId) {
    await table.update(existingRecordId, fields);
    console.log(`✅ Airtable Product ${existingRecordId} mis à jour dans le Cloud!`);
  } else {
    const created = await table.create([{ fields }]);
    console.log(`✅ Airtable Product ${created[0].id} créé dans le Cloud!`);
  }
}

async function deleteProductFromAirtable(id: string) {
  const base = getAirtableBase();
  const table = base("Products");
  const records = await table.select().all();
  const match = records.find((r: any) => r.id === id || r.get("Local ID") === id);
  if (match) {
    await table.destroy(match.id);
  }
}

export default defineEventHandler(async (event) => {
  const id = String(event.context?.params?.id || "");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing product id" });
  }

  if (event.method === "DELETE") {
    await deleteProductFromAirtable(id);
    return { success: true };
  }

  if (event.method === "PUT") {
    const body = await readBody(event);
    const updatedProduct = {
      id,
      ...body,
      price: Number(body.sellingPrice || body.price) || 300,
    };

    await syncProductToAirtable(updatedProduct);
    return { success: true, product: updatedProduct };
  }

  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
