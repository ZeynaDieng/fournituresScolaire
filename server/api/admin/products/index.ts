// server/api/admin/products/index.ts
import { defineEventHandler, readBody } from "h3";
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

  const records = await table.select().all();
  const match = records.find(
    (r: any) =>
      r.get("Local ID") === product.id ||
      (r.get("Name") || "").toLowerCase().trim() === (product.name || "").toLowerCase().trim()
  );

  if (match) {
    await table.update(match.id, fields);
    console.log(`✅ Product ${match.id} mis à jour dans Airtable Cloud!`);
  } else {
    const created = await table.create([{ fields }]);
    console.log(`✅ Product ${created[0].id} créé dans Airtable Cloud!`);
  }
}

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    const body = await readBody(event);
    const newId = body.id || `prod-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: body.name || body.Name || "Nouveau Produit",
      category: body.category || body.Category || "Fournitures",
      sellingPrice: Number(body.sellingPrice || body.price) || 350,
      price: Number(body.sellingPrice || body.price) || 350,
      image: body.image || body["Image URL"] || "",
      description: body.description || "",
      isActive: body.isActive !== false,
      stock: Number(body.stock) || 50,
      inStock: body.inStock !== false,
      schoolLevel: body.schoolLevel || "Tous niveaux",
      format: body.format || "Standard",
      unit: body.unit || "Unité",
    };

    await syncProductToAirtable(newProduct);
    return { success: true, product: newProduct };
  }
});
