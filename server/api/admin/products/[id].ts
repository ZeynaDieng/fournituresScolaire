// server/api/admin/products/[id].ts
import { defineEventHandler, readBody, createError } from "h3";
import { officialCatalog } from "~/data/products-senegal";
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
      return { success: true };
    }

    if (event.method === "PUT") {
      const body = await readBody(event);
      const idx = officialCatalog.findIndex((p: any) => p.id === id);

      if (idx !== -1) {
        officialCatalog[idx] = {
          ...officialCatalog[idx],
          ...body,
          price: body.sellingPrice || body.price || officialCatalog[idx].price,
        };
        persistCatalogToDisk();
      } else {
        const newProduct = {
          id,
          ...body,
          price: body.sellingPrice || body.price || 300,
        };
        officialCatalog.push(newProduct);
        persistCatalogToDisk();
      }

      const updatedProd = officialCatalog.find((p: any) => p.id === id) || body;
      return { success: true, product: updatedProd };
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
