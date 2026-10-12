// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { officialPacks } from "~/data/packs-senegal";
import { prisma } from "../../utils/prisma";

let cachedPacksResponse: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

export function parsePackContents(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item: any) => {
        if (typeof item === "string") return item.trim();
        if (item && (item.productName || item.name)) {
          return `${item.quantity || 1}x ${item.productName || item.name}`;
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsePackContents(parsed);
      } catch {}
    }
    return trimmed
      .split(/\s*,\s*|\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

const defaultLocalPacks: any[] = [
  {
    id: "pack-cp",
    localId: "pack-cp",
    slug: "pack-cp",
    name: "Pack Essentiel CP-CI",
    level: "CP",
    price: 16500,
    originalPrice: 19000,
    image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: "Le nécessaire pour bien démarrer le Cours Préparatoire (CI/CP).",
    contents: [
      "5 Cahiers 100 pages (17x22cm)",
      "2 Cahiers de dessin 48 pages",
      "1 Ardoise + 2 feutres + 1 chiffon",
      "1 Trousse garnie (2 stylos bleus, 1 stylo vert, 1 crayon noir, 1 gomme, 1 taille-crayon)",
      "1 Boîte de 12 crayons de couleur",
      "1 Règle plate 20cm",
      "5 Protège-cahiers",
      "1 Paquet de 100 étiquettes",
      "1 Ciseau",
      "1 Paquet papier Canson",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2026-12-31"),
  },
  {
    id: "pack-ce1",
    localId: "pack-ce1",
    slug: "pack-ce1",
    name: "Pack Complet CE1",
    level: "CE1",
    price: 18000,
    originalPrice: 21000,
    image: "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    description: "Pack complet pour le Cours Élémentaire 1ère année.",
    contents: [
      "10 Cahiers 100p",
      "5 Cahiers 200p",
      "2 Cahiers de dessin",
      "1 Cahier de poésie",
      "5 Protège-cahiers",
      "1 Trousse complète",
      "1 Boîte de 12 feutres",
      "1 Règle 30cm",
      "1 Paire de ciseaux",
      "1 Colle",
      "1 Rame de papier",
      "Ardoise & Éponge",
      "Paquet feuilles Canson",
      "1 Livre Ami & Rémi",
      "1 Manuel BLED",
      "1 Sac à dos scolaire",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
  {
    id: "pack-ce2",
    localId: "pack-ce2",
    slug: "pack-ce2",
    name: "Pack Excellence CE2",
    level: "CE2",
    price: 22000,
    originalPrice: 25000,
    image: "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    description: "Pack premium pour le Cours Élémentaire 2ème année.",
    contents: [
      "10 Cahiers 100p",
      "5 Cahiers 200p",
      "1 Cahier travaux pratiques",
      "2 Cahiers de dessin",
      "1 Cahier de poésie",
      "5 Protège-cahiers",
      "1 Trousse complète",
      "1 Boîte de 12 feutres",
      "1 Règle 30cm",
      "1 Paire de ciseaux",
      "1 Colle",
      "1 Rame de papier",
      "Ardoise & Éponge",
      "Paquet feuilles Canson",
      "1 Livre Ami & Rémi",
      "1 Manuel BLED",
      "1 Sac à dos scolaire",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
  {
    id: "pack-cm1",
    localId: "pack-cm1",
    slug: "pack-cm1",
    name: "Pack Primaire CM1",
    level: "CM1",
    price: 26500,
    originalPrice: 30000,
    image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    description: "Pack complet pour le Cours Moyen 1ère année.",
    contents: [
      "20 Cahiers 100p",
      "2 Livres DIDACTIKOS au choix",
      "3 Cahiers travaux pratiques",
      "1 Cahier de dessin",
      "1 Trousse complète",
      "1 Boîte de 12 crayons de couleur",
      "1 Paquet copies doubles",
      "1 Règle 30cm",
      "1 Compas",
      "1 Rapporteur",
      "1 Colle",
      "1 Paquet de couvertures",
      "1 Sac à dos renforcé",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
  {
    id: "pack-cm2",
    localId: "pack-cm2",
    slug: "pack-cm2",
    name: "Pack Réussite CM2",
    level: "CM2",
    price: 32000,
    originalPrice: 35000,
    image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    description: "Pack optimal pour la préparation à l'entrée au collège.",
    contents: [
      "20 Cahiers 100p",
      "2 Livres DIDACTIKOS au choix",
      "3 Cahiers travaux pratiques",
      "1 Cahier de dessin",
      "1 Trousse complète",
      "1 Boîte de 12 crayons de couleur",
      "1 Paquet copies doubles",
      "1 Règle 30cm",
      "1 Compas",
      "1 Rapporteur",
      "1 Colle",
      "1 Paquet de couvertures",
      "1 Sac à dos renforcé",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
  {
    id: "pack-6eme",
    localId: "pack-6eme",
    slug: "pack-6eme",
    name: "Pack Entrée 6ème",
    level: "6ème",
    price: 35000,
    originalPrice: 39000,
    image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    description: "Pack complet pour l'entrée au collège au Sénégal.",
    contents: [
      "10 Cahiers 200p",
      "10 Cahiers 100p",
      "2 Cahiers travaux pratiques",
      "1 Paquet de 200 copies doubles",
      "1 Paquet de 100 copies simples",
      "1 Trousse complète",
      "1 Calculatrice basique",
      "1 Règle 30cm",
      "1 Compas",
      "1 Rapporteur",
      "1 Colle",
      "1 Sac à dos collège",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
  {
    id: "pack-college",
    localId: "pack-college",
    slug: "pack-college",
    name: "Pack Collège 6ème-3ème",
    level: "Collège",
    price: 28000,
    originalPrice: 33000,
    image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    description: "L'équipement idéal pour réussir ses années de collège.",
    contents: [
      "5 Cahiers 200 pages grand format (24x32cm)",
      "10 Cahiers 100p",
      "5 Cahiers 200p petit format",
      "3 Classeurs A4 souples",
      "1 Paquet de 200 copies doubles A4",
      "1 Paquet de 100 copies simples A4",
      "1 Trousse complète",
      "1 Calculatrice scientifique type collège",
      "1 Kit de géométrie complet et résistant",
      "1 Agenda scolaire",
      "1 Trieur 8 compartiments",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
    promotionEndDate: new Date("2026-12-31"),
  },
  {
    id: "pack-lycee",
    localId: "pack-lycee",
    slug: "pack-lycee",
    name: "Pack Lycée Seconde-Terminale",
    level: "Lycée",
    price: 37000,
    originalPrice: 41000,
    image: "https://i.pinimg.com/736x/4c/96/45/4c9645a3a4b571070228f89132360382.jpg",
    description: "Un pack robuste et complet pour affronter les défis du lycée.",
    contents: [
      "15 Cahiers 200p",
      "10 Cahiers 100p",
      "1 Classeur A4 rigide grand format",
      "1 Paquet de 400 copies doubles A4",
      "1 Trieur 12 compartiments",
      "1 Lot de 4 surligneurs de couleurs différentes",
      "1 Calculatrice scientifique graphique",
      "1 Agenda grand format",
      "1 Ramette de papier 500 feuilles",
      "Matériel géométrique complet",
      "1 Sac à dos lycée",
      "Stylos de qualité supérieure",
    ],
    isPopular: true,
    inStock: true,
    isPromotion: true,
  },
];

const fallbackPacksData: any[] = [
  ...defaultLocalPacks,
  ...(officialPacks || []).map((p: any) => ({
    id: p.id,
    localId: p.id,
    slug: p.id,
    name: p.name || p.nom,
    level: p.schoolLevel || p.niveau,
    price: p.calculatedSellingPrice || p.prix_pack || p.price || 20550,
    originalPrice: p.targetPrice || p.originalPrice || null,
    image: p.coverImage || p.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: p.description || "",
    contents: parsePackContents(p.items || p.contents),
    isPopular: p.isPopular ?? true,
    inStock: p.inStock ?? true,
    isPromotion: !!p.originalPrice,
    promotionEndDate: new Date("2026-12-31"),
  })),
];

function transformAirtableToPublicFormat(
  airtableRecord: any,
  recordId: string
) {
  const localId = airtableRecord["Local ID"] || airtableRecord.Slug || "";
  return {
    id: recordId,
    localId,
    slug: localId || recordId,
    name: airtableRecord.Name || airtableRecord.Title || "",
    level: airtableRecord.Level || airtableRecord["School Level"] || "Tous niveaux",
    price: Number(airtableRecord.Price) || 0,
    originalPrice: airtableRecord["Original Price"]
      ? Number(airtableRecord["Original Price"])
      : null,
    image: airtableRecord["Image URL"] || airtableRecord.Image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: airtableRecord.Description || "",
    contents: parsePackContents(airtableRecord.Contents),
    isPopular: airtableRecord["Is Popular"] !== false,
    inStock: airtableRecord["In Stock"] !== false,
    isPromotion: Boolean(airtableRecord["Is Promotion"] || airtableRecord["Original Price"]),
    promotionEndDate: airtableRecord["Promotion End Date"]
      ? new Date(airtableRecord["Promotion End Date"])
      : null,
  };
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const forceRefresh = query.refresh === "true";
  const now = Date.now();

  if (!forceRefresh && cachedPacksResponse && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedPacksResponse;
  }

  // 1. Priorité aux données Airtable (source officielle complète avec prix & contenus détaillés)
  try {
    const base = getAirtableBase();
    if (base) {
      const records = await base(process.env.AIRTABLE_PACKS_TABLE || "Packs").select().all();
      const formattedData = records.map((record) =>
        transformAirtableToPublicFormat(record.fields, record.id)
      );

      if (formattedData.length > 0) {
        console.log(`📡 GET /api/airtable/packs -> ${formattedData.length} packs Airtable envoyés avec contenus complets.`);
        const response = { success: true, data: formattedData, source: "airtable" };
        cachedPacksResponse = response;
        lastFetchTime = now;
        return response;
      }
    }
  } catch (error: any) {
    console.warn("⚠️ Échec GET Airtable packs:", error.message);
  }

  // 2. Fallback sur PostgreSQL si les packs ont des contenus
  try {
    const dbPacks = await prisma.pack.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { id: "asc" },
    });

    if (dbPacks && dbPacks.length > 0) {
      const formattedPacks = dbPacks.map((p: any) => {
        // Retrouver le pack fallback correspondant pour le prix et les contenus
        const fallback = fallbackPacksData.find(
          (fb) => fb.name.toLowerCase() === p.name.toLowerCase() || String(fb.id) === String(p.id)
        );

        let contents = p.items && p.items.length > 0
          ? p.items.map((i: any) => `${i.quantity}x ${i.product?.name || "Article"}`)
          : (fallback?.contents || []);

        return {
          id: String(p.id),
          localId: fallback?.localId || String(p.id),
          slug: fallback?.slug || String(p.id),
          name: p.name,
          level: p.schoolLevel,
          price: fallback?.price || 22500,
          originalPrice: fallback?.originalPrice || null,
          image: p.coverImage || fallback?.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
          description: p.description || fallback?.description || "",
          contents,
          isPopular: true,
          inStock: true,
          isPromotion: !!fallback?.originalPrice,
          promotionEndDate: new Date("2026-12-31"),
        };
      });

      return { success: true, data: formattedPacks, source: "postgresql" };
    }
  } catch (err) {
    console.warn("⚠️ Échec PostgreSQL packs, utilisation du fallback statique complet:", err);
  }

  // 3. Fallback statique garanti avec 100% des contenus
  return cachedPacksResponse || { success: true, data: fallbackPacksData, source: "fallback" };
});

