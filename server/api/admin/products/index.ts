// server/api/admin/products/index.ts
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
  if (event.method === "GET") {
    return officialCatalog;
  }

  if (event.method === "POST") {
    const body = await readBody(event);
    const newId = body.id || `prod-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: body.name || body.Name || "Nouveau Produit",
      category: body.category || body.Category || "Fournitures",
      costPrice: Number(body.costPrice) || 200,
      sellingPrice: Number(body.sellingPrice || body.price) || 350,
      price: Number(body.sellingPrice || body.price) || 350,
      image: body.image || body["Image URL"] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=600&q=80",
      description: body.description || "",
      isActive: body.isActive !== false,
      stock: Number(body.stock) || 50,
      inStock: body.inStock !== false,
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      schoolLevel: body.schoolLevel || "Tous niveaux",
      format: body.format || "Standard",
      unit: body.unit || "Unité",
      slug: (body.name || "produit").toLowerCase().replace(/\s+/g, "-"),
    };

    officialCatalog.unshift(newProduct);
    persistCatalogToDisk();

    return { success: true, product: newProduct };
  }
});
