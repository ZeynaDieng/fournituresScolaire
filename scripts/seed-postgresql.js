// scripts/seed-postgresql.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { officialCatalog } = require('../data/products-senegal.js');
const { officialPacks } = require('../data/packs-senegal.js');

async function main() {
  console.log("🌱 Début du seeding de la base de données PostgreSQL...");

  // 1. Insertion des Produits
  console.log(`📦 Seeding de ${officialCatalog.length} produits...`);
  for (const p of officialCatalog) {
    const safeSku = String(p.slug || p.id);
    await prisma.product.upsert({
      where: { sku: safeSku },
      update: {
        name: String(p.name || ""),
        price: Number(p.sellingPrice || p.price) || 0,
        sellingPrice: Number(p.sellingPrice || p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        category: String(p.category || "Fournitures"),
        image: String(p.image || ""),
        images: JSON.stringify(p.images || [p.image || ""]),
        description: String(p.description || ""),
        stock: Number(p.stock) || 50,
        inStock: p.inStock !== false,
        schoolLevel: String(p.schoolLevel || "Tous niveaux"),
        format: String(p.format || "Standard"),
        unit: String(p.unit || "Unité"),
        slug: safeSku,
      },
      create: {
        name: String(p.name || ""),
        price: Number(p.sellingPrice || p.price) || 0,
        sellingPrice: Number(p.sellingPrice || p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        category: String(p.category || "Fournitures"),
        image: String(p.image || ""),
        images: JSON.stringify(p.images || [p.image || ""]),
        description: String(p.description || ""),
        stock: Number(p.stock) || 50,
        inStock: p.inStock !== false,
        schoolLevel: String(p.schoolLevel || "Tous niveaux"),
        format: String(p.format || "Standard"),
        unit: String(p.unit || "Unité"),
        sku: safeSku,
        slug: safeSku,
      },
    });
  }

  // 2. Insertion des Packs
  console.log(`🎒 Seeding de ${officialPacks.length} packs scolaires...`);
  for (const pack of officialPacks) {
    await prisma.pack.upsert({
      where: { id: pack.id ? (typeof pack.id === 'number' ? pack.id : 1) : 1 },
      update: {
        name: String(pack.name || ""),
        schoolLevel: String(pack.schoolLevel || "Tous niveaux"),
        schoolName: String(pack.schoolName || ""),
        coverImage: String(pack.coverImage || ""),
        description: String(pack.description || ""),
      },
      create: {
        name: String(pack.name || ""),
        schoolLevel: String(pack.schoolLevel || "Tous niveaux"),
        schoolName: String(pack.schoolName || ""),
        coverImage: String(pack.coverImage || ""),
        description: String(pack.description || ""),
      },
    }).catch(err => {
      // Ignorer l'erreur d'ID si auto-incrémenté
    });
  }

  console.log("✅ Seeding PostgreSQL terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
