// scripts/seed-postgresql.js
const { PrismaClient } = require('@prisma/client');
const Airtable = require('airtable');

const prisma = new PrismaClient();
const { officialCatalog } = require('../data/products-senegal.js');
const { officialPacks } = require('../data/packs-senegal.js');

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

async function main() {
  console.log("🌱 Début du seeding complet de la base de données PostgreSQL...");

  let airtableProducts = [];
  let airtablePacks = [];

  try {
    const base = new Airtable({ apiKey }).base(baseId);
    console.log("📡 Connexion à Airtable pour récupérer l'intégralité du catalogue...");

    const prodRecords = await base('Products').select().all();
    airtableProducts = prodRecords.map((r) => ({ id: r.id, ...r.fields }));
    console.log(`✅ ${airtableProducts.length} produits trouvés sur Airtable.`);

    const packRecords = await base('Packs').select().all();
    airtablePacks = packRecords.map((r) => ({ id: r.id, ...r.fields }));
    console.log(`✅ ${airtablePacks.length} packs trouvés sur Airtable.`);
  } catch (err) {
    console.warn("⚠️ Connexion Airtable directe impossible, fallback vers catalogue local:", err.message);
  }

  // 1. Insertion des 127 Produits
  const productsToSeed = airtableProducts.length > 0 ? airtableProducts : officialCatalog;
  console.log(`📦 Insertion/Mise à jour de ${productsToSeed.length} produits dans PostgreSQL...`);

  let pCount = 0;
  for (const p of productsToSeed) {
    pCount++;
    const safeName = String(p.Name || p.name || `Produit #${pCount}`);
    const safeSku = String(p['Local ID'] || p.slug || p.id || `prod-${pCount}`);
    const safePrice = Number(p.Price || p.price || p.sellingPrice) || 0;
    const safeCategory = String(p.Category || p.category || "Fournitures");
    const safeImage = String(p['Image URL'] || p.image || "");
    const safeDesc = String(p.Description || p.description || "");

    await prisma.product.upsert({
      where: { sku: safeSku },
      update: {
        name: safeName,
        price: safePrice,
        sellingPrice: safePrice,
        costPrice: Number(p.costPrice || p['Cost Price']) || Math.round(safePrice * 0.65),
        originalPrice: p['Original Price'] ? Number(p['Original Price']) : (p.originalPrice ? Number(p.originalPrice) : null),
        category: safeCategory,
        image: safeImage,
        images: JSON.stringify(p.images || [safeImage]),
        description: safeDesc,
        stock: Number(p.Stock || p.stock) || 50,
        inStock: p['In Stock'] !== false && p.inStock !== false,
        schoolLevel: String(p['School Level'] || p.schoolLevel || "Tous niveaux"),
        format: String(p.Format || p.format || "Standard"),
        unit: String(p.Unit || p.unit || "Unité"),
        slug: safeSku,
      },
      create: {
        name: safeName,
        price: safePrice,
        sellingPrice: safePrice,
        costPrice: Number(p.costPrice || p['Cost Price']) || Math.round(safePrice * 0.65),
        originalPrice: p['Original Price'] ? Number(p['Original Price']) : (p.originalPrice ? Number(p.originalPrice) : null),
        category: safeCategory,
        image: safeImage,
        images: JSON.stringify(p.images || [safeImage]),
        description: safeDesc,
        stock: Number(p.Stock || p.stock) || 50,
        inStock: p['In Stock'] !== false && p.inStock !== false,
        schoolLevel: String(p['School Level'] || p.schoolLevel || "Tous niveaux"),
        format: String(p.Format || p.format || "Standard"),
        unit: String(p.Unit || p.unit || "Unité"),
        sku: safeSku,
        slug: safeSku,
      },
    });
  }

  // 2. Insertion des 12 Packs
  const packsToSeed = airtablePacks.length > 0 ? airtablePacks : officialPacks;
  console.log(`🎒 Insertion/Mise à jour de ${packsToSeed.length} packs scolaires dans PostgreSQL...`);

  let packCount = 0;
  for (const pack of packsToSeed) {
    packCount++;
    const safePackName = String(pack.Name || pack.name || `Pack #${packCount}`);
    const safePackLevel = String(pack.Level || pack['School Level'] || pack.schoolLevel || "Tous niveaux");
    const safePackDesc = String(pack.Description || pack.description || "");
    const safePackImage = String(pack['Image URL'] || pack.coverImage || pack.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg");

    await prisma.pack.upsert({
      where: { id: packCount },
      update: {
        name: safePackName,
        schoolLevel: safePackLevel,
        schoolName: String(pack.schoolName || "Écoles du Sénégal"),
        coverImage: safePackImage,
        description: safePackDesc,
      },
      create: {
        id: packCount,
        name: safePackName,
        schoolLevel: safePackLevel,
        schoolName: String(pack.schoolName || "Écoles du Sénégal"),
        coverImage: safePackImage,
        description: safePackDesc,
      },
    });
  }

  console.log(`✅ Seeding PostgreSQL terminé : ${productsToSeed.length} produits et ${packsToSeed.length} packs enregistrés !`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
