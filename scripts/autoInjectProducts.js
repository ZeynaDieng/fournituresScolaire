// Script pour extraire automatiquement le tableau de produits du store et l'injecter dans le script d'import
// Place ce fichier dans /scripts/autoInjectProducts.js
// Lance-le avec: node scripts/autoInjectProducts.js

const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "../stores/products.ts");
const importScriptPath = path.join(__dirname, "importProductsToAirtable.js");

// Extraction du tableau products du store
const storeContent = fs.readFileSync(storePath, "utf8");
const match = storeContent.match(/this\.products\s*=\s*\[((.|\n|\r)*?)\n\s*];/);
if (!match) {
  console.error("❌ Impossible de trouver le tableau products dans le store.");
  process.exit(1);
}
const productsArray = match[1].trim();

// Remplacement dans le script d'import
let importScript = fs.readFileSync(importScriptPath, "utf8");
importScript = importScript.replace(
  /const products = \[[\s\S]*?];/,
  `const products = [\n${productsArray}\n];`
);
fs.writeFileSync(importScriptPath, importScript, "utf8");
console.log(
  "✅ Tableau products injecté automatiquement dans importProductsToAirtable.js"
);
