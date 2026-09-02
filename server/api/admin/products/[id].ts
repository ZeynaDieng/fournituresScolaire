// server/api/admin/products/[id].ts
import { defineEventHandler, readBody, createError } from "h3";
import { officialCatalog } from "~/data/products-senegal";
import { getAirtableBase } from "~/utils/airtable-base";
import fs from "fs";
import path from "path";

function persistCatalogToDisk() {
  try {
    const filePath = path.resolve(process.cwd(), "data/products-senegal.js");
    const content = `// data/products-senegal.js\n// Source officielle du catalogue EduShop\n\nexport const officialCatalog = ${JSON.stringify(officialCatalog, null, 2)};\n\nexport const senegaleseProducts = officialCatalog;\n`;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("✅ data/products-senegal.js sauvegardé sur le disque!");
  } catch (err) {
    console.error("⚠️ Impossible d'écrire dans data/products-senegal.js:", err);
  }
}

async function syncProductToAirtable(product: any) {
  try {
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

    if (product.costPrice) fields["Cost Price"] = Number(product.costPrice);
    if (product.originalPrice) fields["Original Price"] = Number(product.originalPrice);

    let existingRecordId: string | null = null;
    if (product.id && product.id.startsWith("rec")) {
      existingRecordId = product.id;
    } else {
      const records = await table
        .select({
          filterByFormula: `OR({Local ID} = '${product.id}', LOWER({Name}) = '${(product.name || '').toLowerCase().replace(/'/g, "\\'")}')`,
          maxRecords: 1,
        })
        .all();

      if (records.length > 0) {
        existingRecordId = records[0].id;
      }
    }

    if (existingRecordId) {
      await table.update(existingRecordId, fields);
      console.log(`✅ Airtable Product ${existingRecordId} mis à jour dans le Cloud!`);
    } else {
      const created = await table.create([{ fields }]);
      console.log(`✅ Airtable Product ${created[0].id} créé dans le Cloud!`);
    }
  } catch (err: any) {
    console.warn("⚠️ Airtable Cloud sync warning:", err?.message || err);
  }
}

async function deleteProductFromAirtable(id: string) {
  try {
    const base = getAirtableBase();
    const table = base("Products");
    if (id.startsWith("rec")) {
      await table.destroy(id);
    } else {
      const records = await table.select({ filterByFormula: `{Local ID} = '${id}'`, maxRecords: 1 }).all();
      if (records.length > 0) {
        await table.destroy(records[0].id);
      }
    }
  } catch (e: any) {
    console.warn("⚠️ Airtable delete warning:", e?.message);
  }
}

export default defineEventHandler(async (event) => {
  const id = String(event.context?.params?.id || "");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing product id" });
  }

  try {
    if (event.method === "DELETE") {
      const idx = officialCatalog.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        officialCatalog.splice(idx, 1);
        persistCatalogToDisk();
      }
      await deleteProductFromAirtable(id);
      return { success: true };
    }

    if (event.method === "PUT") {
      const body = await readBody(event);
      const idx = officialCatalog.findIndex((p: any) => p.id === id);
      let updatedProduct: any;

      if (idx !== -1) {
        officialCatalog[idx] = {
          ...officialCatalog[idx],
          ...body,
          price: body.sellingPrice || body.price || officialCatalog[idx].price,
        };
        updatedProduct = officialCatalog[idx];
        persistCatalogToDisk();
      } else {
        updatedProduct = {
          id,
          ...body,
          price: body.sellingPrice || body.price || 300,
        };
        officialCatalog.push(updatedProduct);
        persistCatalogToDisk();
      }

      await syncProductToAirtable(updatedProduct);

      return { success: true, product: updatedProduct };
    }

    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  } catch (err: any) {
    console.error("ADMIN PRODUCTS [id] ERROR:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Server error",
    });
  }
});
