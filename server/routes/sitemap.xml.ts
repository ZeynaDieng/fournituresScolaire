// server/routes/sitemap.xml.ts
import { defineEventHandler, setHeader } from "h3";
import { prisma } from "../utils/prisma";
import { officialCatalog } from "../../data/products-senegal.js";
import { officialPacks } from "../../data/packs-senegal.js";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function formatDate(dateInput?: Date | string | null): string {
  if (!dateInput) {
    return new Date().toISOString().split("T")[0];
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export default defineEventHandler(async (event) => {
  const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.BASE_URL || "https://www.edushop.sn";
  const today = formatDate();

  const staticPages: SitemapUrl[] = [
    { loc: `${baseUrl}/`, lastmod: today, changefreq: "daily", priority: 1.0 },
    { loc: `${baseUrl}/products`, lastmod: today, changefreq: "daily", priority: 0.9 },
    { loc: `${baseUrl}/packs`, lastmod: today, changefreq: "daily", priority: 0.9 },
    { loc: `${baseUrl}/categories`, lastmod: today, changefreq: "daily", priority: 0.9 },
    { loc: `${baseUrl}/promotions`, lastmod: today, changefreq: "daily", priority: 0.8 },
    { loc: `${baseUrl}/scan-liste`, lastmod: today, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/configurator`, lastmod: today, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/about`, lastmod: today, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/contact`, lastmod: today, changefreq: "monthly", priority: 0.6 },
    { loc: `${baseUrl}/blog`, lastmod: today, changefreq: "weekly", priority: 0.6 },
    { loc: `${baseUrl}/cgv`, lastmod: today, changefreq: "monthly", priority: 0.3 },
    { loc: `${baseUrl}/confidentialite`, lastmod: today, changefreq: "monthly", priority: 0.3 },
    { loc: `${baseUrl}/mentions-legales`, lastmod: today, changefreq: "monthly", priority: 0.3 },
  ];

  const urls: SitemapUrl[] = [...staticPages];
  const categorySet = new Set<string>();

  // 1. Charger les Produits depuis PostgreSQL avec fallback sur catalogue local
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, category: true, updatedAt: true },
    });

    if (dbProducts && dbProducts.length > 0) {
      for (const p of dbProducts) {
        const productSlug = p.slug || String(p.id);
        urls.push({
          loc: `${baseUrl}/products/${productSlug}`,
          lastmod: formatDate(p.updatedAt),
          changefreq: "daily",
          priority: 0.8,
        });

        if (p.category) {
          categorySet.add(p.category);
        }
      }
    } else {
      throw new Error("Aucun produit dans PostgreSQL");
    }
  } catch (err) {
    console.warn("⚠️ Sitemap: Fallback vers catalogue local pour les produits");
    if (officialCatalog && Array.isArray(officialCatalog)) {
      for (const p of officialCatalog) {
        if (p.isActive !== false) {
          const productSlug = p.slug || p.id;
          urls.push({
            loc: `${baseUrl}/products/${productSlug}`,
            lastmod: today,
            changefreq: "daily",
            priority: 0.8,
          });

          if (p.category) {
            categorySet.add(p.category);
          }
        }
      }
    }
  }

  // 2. Charger les Packs depuis PostgreSQL avec fallback sur catalogue local
  try {
    const dbPacks = await prisma.pack.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    if (dbPacks && dbPacks.length > 0) {
      for (const pack of dbPacks) {
        urls.push({
          loc: `${baseUrl}/packs/${pack.id}`,
          lastmod: formatDate(pack.updatedAt),
          changefreq: "weekly",
          priority: 0.8,
        });
      }
    } else {
      throw new Error("Aucun pack dans PostgreSQL");
    }
  } catch (err) {
    console.warn("⚠️ Sitemap: Fallback vers catalogue local pour les packs");
    if (officialPacks && Array.isArray(officialPacks)) {
      for (const pack of officialPacks) {
        if (pack.isActive !== false) {
          urls.push({
            loc: `${baseUrl}/packs/${pack.id}`,
            lastmod: today,
            changefreq: "weekly",
            priority: 0.8,
          });
        }
      }
    }
  }

  // 3. Charger les Catégories depuis PostgreSQL et fusionner avec celles extraites des produits
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true },
    });

    if (dbCategories && dbCategories.length > 0) {
      for (const cat of dbCategories) {
        categorySet.add(cat.name);
      }
    }
  } catch {
    // Si la table category n'est pas dispo, categorySet contient déjà les catégories issues des produits
  }

  // S'assurer qu'au moins les catégories standards soient présentes si l'ensemble est pauvre
  const defaultCategories = [
    "Cahiers",
    "Écriture",
    "Géométrie",
    "Fournitures",
    "Protège-cahiers",
    "Livres",
    "Stylos",
    "Sacs",
    "Ardoises",
    "Calculatrices",
  ];
  for (const catName of defaultCategories) {
    categorySet.add(catName);
  }

  // Générer les URL des catégories
  for (const catName of categorySet) {
    const catSlug = slugify(catName);
    if (catSlug) {
      urls.push({
        loc: `${baseUrl}/categories/${catSlug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  }

  // Construction du document XML
  const xmlUrls = urls
    .map((item) => {
      let xml = `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n`;
      if (item.lastmod) {
        xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      }
      if (item.changefreq) {
        xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      }
      if (item.priority !== undefined) {
        xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
      }
      xml += `  </url>`;
      return xml;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=14400");

  return sitemapXml;
});
