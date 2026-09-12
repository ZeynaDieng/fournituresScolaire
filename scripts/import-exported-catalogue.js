// scripts/import-exported-catalogue.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = process.argv[2] || path.join(__dirname, "../data/export.json");

if (!fs.existsSync(jsonFilePath)) {
  console.error(`❌ Fichier d'export non trouvé : ${jsonFilePath}`);
  console.log(`Usage: node scripts/import-exported-catalogue.js <chemin_fichier.json>`);
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(jsonFilePath, "utf-8");
  const parsed = JSON.parse(rawData);

  const importedProducts = Array.isArray(parsed) 
    ? parsed 
    : (parsed.allProductsInAdmin || parsed.customProductsFromLocalStorage || []);

  if (!importedProducts || importedProducts.length === 0) {
    console.error("❌ Aucun produit trouvé dans le fichier d'export JSON.");
    process.exit(1);
  }

  const catalogFilePath = path.join(__dirname, "../data/products-senegal.js");
  const catalogContent = fs.readFileSync(catalogFilePath, "utf-8");

  const existingCatalogMatch = catalogContent.match(/export const officialCatalog = (\[[\s\S]*\]);/);
  
  if (!existingCatalogMatch) {
    console.error("❌ Impossible de lire la structure d'officialCatalog dans products-senegal.js");
    process.exit(1);
  }

  console.log(`📦 ${importedProducts.length} produits détectés dans l'export.`);
  
  const formattedCatalog = JSON.stringify(importedProducts, null, 2);
  const newContent = catalogContent.replace(
    /export const officialCatalog = \[[\s\S]*\];/,
    `export const officialCatalog = ${formattedCatalog};`
  );

  fs.writeFileSync(catalogFilePath, newContent, "utf-8");
  console.log(`✅ ${importedProducts.length} produits et images importés avec succès dans data/products-senegal.js !`);

} catch (err) {
  console.error("❌ Erreur lors de l'importation du catalogue:", err);
}
