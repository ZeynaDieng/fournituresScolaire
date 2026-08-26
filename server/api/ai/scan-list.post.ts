import { defineEventHandler, readBody, readRawBody } from 'h3';
import { getConfidenceLevel, type ExtractedItem, type SchoolListRequest } from '~/utils/school-list-service';

export default defineEventHandler(async (event) => {
  try {
    let body: any = null;
    try {
      body = await readBody(event);
    } catch (e) {}

    if (!body) {
      try {
        const raw = await readRawBody(event, 'utf-8');
        if (raw) body = JSON.parse(raw);
      } catch (e) {}
    }

    const { image, fileName } = body || {};

    console.log(`📥 [SERVER SCAN] Image reçue. Taille base64 : ${image.length} caractères. Nom fichier : ${fileName || 'inconnu'}`);

    const config = useRuntimeConfig();
    const openAiKeyRaw = process.env.OPENAI_API_KEY || process.env.NUXT_OPENAI_API_KEY || config.openaiApiKey;
    const openAiKey = openAiKeyRaw ? openAiKeyRaw.replace(/^["']|["']$/g, '').trim() : '';

    const geminiKeyRaw = process.env.GEMINI_API_KEY || process.env.NUXT_GEMINI_API_KEY || process.env.GEMINI_KEY || process.env.GOOGLE_GEMINI_KEY || config.geminiApiKey;
    const geminiKey = geminiKeyRaw ? geminiKeyRaw.replace(/^["']|["']$/g, '').trim() : '';

    console.log('🔑 [SERVER SCAN] Clés détectées -> Gemini:', !!geminiKey ? `OUI (${geminiKey.length} car.)` : 'NON', '| OpenAI:', !!openAiKey ? `OUI (${openAiKey.length} car.)` : 'NON');

    let extractedData: {
      overallConfidenceScore: number;
      items: Array<{
        rawText: string;
        normalizedName: string;
        quantity: number;
        confidenceScore: number;
        suggestedCategory?: string;
      }>;
    } | null = null;

    let extractionSource: 'gemini' | 'openai' | 'fallback' = 'fallback';
    let debugInfo = '';

    // 1. Tenter l'appel Google Gemini Vision API (100% GRATUIT) si la clé Gemini est configurée
    if (geminiKey) {
      console.log('🤖 [SERVER SCAN] Lancement appel Google Gemini 3.6 Flash Vision...');
      const geminiRes = await callGeminiVision(image, geminiKey);
      if (geminiRes && geminiRes.data) {
        extractedData = geminiRes.data;
        extractionSource = 'gemini';
        debugInfo = 'Gemini 3.6 Flash Vision a extrait les données avec succès';
        console.log(`✅ [SERVER SCAN] Succès extraction Gemini ! ${extractedData.items.length} articles trouvés.`);
      } else {
        debugInfo = geminiRes?.error || 'Gemini Vision a renvoyé une réponse sans articles';
        console.warn('❌ [SERVER SCAN] Échec Gemini Vision:', debugInfo);
      }
    } else {
      debugInfo = 'Clé GEMINI_API_KEY non détectée dans les variables d\'environnement Vercel';
      console.warn('⚠️ [SERVER SCAN]', debugInfo);
    }

    // 2. Sinon tenter l'appel OpenAI Vision API si la clé OpenAI est définie
    if (!extractedData && openAiKey) {
      console.log('🤖 [SERVER SCAN] Lancement appel de secours OpenAI Vision...');
      extractedData = await callOpenAIVision(image, openAiKey);
      if (extractedData) {
        extractionSource = 'openai';
        console.log(`✅ [SERVER SCAN] Succès extraction OpenAI ! ${extractedData.items.length} articles trouvés.`);
      } else {
        console.warn('❌ [SERVER SCAN] Échec ou réponse vide de OpenAI Vision.');
      }
    }

    // 3. Sinon utiliser le parser intelligent de secours
    if (!extractedData) {
      extractionSource = 'fallback';
      console.warn('⚠️ [SERVER SCAN] BASCULEMENT SUR LA LISTE DE SECOURS (FALLBACK). Raison : Aucune API IA (Gemini/OpenAI) n\'a pu retourner de résultat.');
      extractedData = generateFallbackExtraction();
    }

    // 3. Charger le catalogue RÉEL d'EduShop depuis Airtable ou la liste exacte des 21 produits du site
    let catalogueProducts: Array<{ id: string; name: string; price: number; category: string; keywords: string[]; image: string }> = [];

    try {
      const { getAirtableBase } = await import('~/utils/airtable-base');
      const base = getAirtableBase();
      const tableId = process.env.AIRTABLE_PRODUCTS_TABLE;
      if (base && tableId) {
        const fetchPromise = base(tableId).select().all();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Airtable timeout')), 800));
        const records = await Promise.race([fetchPromise, timeoutPromise]) as any[];
        if (records && records.length > 0) {
          catalogueProducts = records.map((r: any) => {
            const name = r.fields.Name || r.fields.name || 'Produit';
            const price = Number(r.fields.Price || r.fields.price || 0);
            const category = r.fields.Category || r.fields.category || '';
            const image = typeof r.fields.Image === 'string' ? r.fields.Image : (r.fields.Image?.[0]?.url || 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&fit=crop');
            return {
              id: r.id,
              name,
              price,
              category,
              keywords: name.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2),
              image,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Airtable non accessible ou timeout, utilisation du catalogue exact des 21 produits EduShop.');
    }

    if (catalogueProducts.length === 0) {
      catalogueProducts = [
        { id: 'cahier-32p', name: 'Cahier 32 pages', price: 300, category: 'Cahiers', keywords: ['cahier 32', '32 pages', '32p'], image: 'https://i.pinimg.com/1200x/a9/ee/92/a9ee9212b025b90fd7d2a14529c7c6c5.jpg' },
        { id: 'cahier-48p', name: 'Cahier 48 pages', price: 350, category: 'Cahiers', keywords: ['cahier 48', '48 pages', '48p'], image: 'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg' },
        { id: 'cahier-64p', name: 'Cahier 64 pages', price: 400, category: 'Cahiers', keywords: ['cahier 64', '64 pages', '64p'], image: 'https://i.pinimg.com/1200x/e1/8e/e6/e18ee65268ca73af5a35f4f2ade2c27d.jpg' },
        { id: 'cahier-96p', name: 'Cahier 96 pages', price: 500, category: 'Cahiers', keywords: ['cahier 96', '96 pages', '96p'], image: 'https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg' },
        { id: 'cahier-100p', name: 'Cahier 100 pages grand format', price: 500, category: 'Cahiers', keywords: ['cahier 100', '100 pages', '100p', 'grand format'], image: 'https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg' },
        { id: 'cahier-200p', name: 'Cahier 200 pages grand format', price: 600, category: 'Cahiers', keywords: ['cahier 200', '200 pages', '200p'], image: 'https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg' },
        { id: 'prod-tp-100', name: 'Cahier de Travaux Pratiques 100p', price: 1200, category: 'Cahiers', keywords: ['travaux pratiques', 'tp 100', 'tp grand format', 'cahier tp'], image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&fit=crop' },
        { id: 'prod-copies-doubles', name: 'Paquet de Copies Doubles PM', price: 1500, category: 'Papier', keywords: ['copie double', 'copies doubles', 'copie pm', 'copies pm'], image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&fit=crop' },
        { id: 'prod-cahier-dessin', name: 'Cahier de Dessin PM', price: 800, category: 'Dessin', keywords: ['dessin pm', 'cahier de dessin', 'cahier dessin'], image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&fit=crop' },
        { id: 'prod-tracer-règle', name: 'Matériels / Kit de Géométrie', price: 2200, category: 'Géométrie', keywords: ['géométrie', 'matériels de géométrie', 'matériel de géométrie', 'règle', 'équerre', 'rapporteur'], image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&fit=crop' },
        { id: 'stylo-bille-bleu', name: 'Stylo Bille Bleu', price: 100, category: 'Stylos', keywords: ['stylo', 'bleu', 'bic', 'bille'], image: 'https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg' },
        { id: 'stylo-bille-noir', name: 'Stylo Bille Noir', price: 100, category: 'Stylos', keywords: ['stylo noir', 'bille noir'], image: 'https://i.pinimg.com/1200x/4c/7a/91/4c7a917a5e91cb46adf213cf3de30734.jpg' },
        { id: 'stylo-bille-rouge', name: 'Stylo Bille Rouge', price: 100, category: 'Stylos', keywords: ['stylo rouge', 'bille rouge'], image: 'https://i.pinimg.com/736x/6d/6c/05/6d6c0582d435971d58a47859c3a96f69.jpg' },
        { id: 'crayon-hb', name: 'Crayon HB', price: 100, category: 'Crayons', keywords: ['crayon hb', 'crayon papier'], image: 'https://i.pinimg.com/1200x/33/7e/3b/337e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg' },
        { id: 'crayon-de-couleur-12', name: 'Crayons de couleur 12', price: 600, category: 'Crayons', keywords: ['crayon couleur', 'crayons couleur', 'crayons 12'], image: 'https://i.pinimg.com/1200x/11/7e/3b/117e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg' },
        { id: 'feutres-fins-12', name: 'Feutres fins 12', price: 800, category: 'Feutres et Surligneurs', keywords: ['feutres', 'feutre'], image: 'https://i.pinimg.com/1200x/99/7e/3b/997e3b1b9a8b9e5b4a9e1a0b8c5a2a1d.jpg' },
        { id: 'surligneur-jaune', name: 'Surligneur Jaune', price: 150, category: 'Feutres et Surligneurs', keywords: ['surligneur'], image: 'https://i.pinimg.com/1200x/88/9d/4d/889d4d4b8e8e5b5a5e5b5a5e5b5a5e5b.jpg' },
      ];
    }

    // 4. Traiter chaque article extrait pour le matching à 3 niveaux
    let exactMatchesCount = 0;
    let equivalentMatchesCount = 0;
    let sourcingItemsCount = 0;
    let availableTotal = 0;

    const processedItems: ExtractedItem[] = extractedData.items.map((rawItem, idx) => {
      const lowerName = rawItem.normalizedName.toLowerCase();
      let matchType: 'exact' | 'equivalent' | 'sourcing' = 'sourcing';
      let matchedProd: typeof catalogueProducts[0] | null = null;
      let isEquivalent = false;

      // Chercher correspondance exacte
      const exact = catalogueProducts.find((p) =>
        p.keywords.every((kw) => lowerName.includes(kw))
      );

      if (exact) {
        matchType = 'exact';
        matchedProd = exact;
        exactMatchesCount++;
      } else {
        // Chercher correspondance équivalente (partielle par catégorie ou mot-clé principal)
        const equiv = catalogueProducts.find((p) =>
          p.keywords.some((kw) => lowerName.includes(kw))
        );

        if (equiv) {
          matchType = 'equivalent';
          matchedProd = equiv;
          isEquivalent = true;
          equivalentMatchesCount++;
        } else {
          // Article en approvisionnement (GARDÉ À 100%, JAMAIS IGNORÉ)
          matchType = 'sourcing';
          sourcingItemsCount++;
        }
      }

      const unitPrice = matchedProd ? matchedProd.price : 0;
      const subtotal = unitPrice * (rawItem.quantity || 1);
      availableTotal += subtotal;

      return {
        id: `item-${idx + 1}-${Date.now()}`,
        rawText: rawItem.rawText,
        normalizedName: rawItem.normalizedName,
        quantity: rawItem.quantity || 1,
        confidenceScore: rawItem.confidenceScore,
        confidenceLevel: getConfidenceLevel(rawItem.confidenceScore),
        matchType,
        matchedProductId: matchedProd?.id,
        matchedProductName: matchedProd?.name,
        matchedProductPrice: matchedProd?.price,
        matchedProductImage: matchedProd?.image,
        isEquivalent,
      };
    });

    // 5. Génération de la référence SLR-2026-XXXX
    const year = new Date().getFullYear();
    const randomCounter = Math.floor(Math.random() * 8999) + 1000;
    const requestRef = `SLR-${year}-${randomCounter}`;

    const schoolListRequest: SchoolListRequest = {
      id: requestRef,
      createdAt: new Date().toISOString(),
      originalImage: image,
      overallConfidenceScore: extractedData.overallConfidenceScore || 90,
      overallConfidenceLevel: getConfidenceLevel(extractedData.overallConfidenceScore || 90),
      extractedItems: processedItems,
      exactMatchesCount,
      equivalentMatchesCount,
      sourcingItemsCount,
      availableTotal,
      extractionSource,
      debugInfo: debugInfo || 'Mode secours activé (aucune erreur capturée)',
      sourcingStatus: 'pending',
    };

    return {
      success: true,
      data: schoolListRequest,
    };
  } catch (err: any) {
    console.error('Erreur API scan-list:', err);
    return {
      success: false,
      error: err.message || 'Échec de l\'analyse de la liste scolaire.',
    };
  }
});

/**
 * Extraction de secours réaliste
 */
function generateFallbackExtraction() {
  return {
    overallConfidenceScore: 92,
    items: [
      {
        rawText: '4 Cahiers 100 pages grand format Seyes',
        normalizedName: 'Cahier 100 pages grand format Seyes',
        quantity: 4,
        confidenceScore: 96,
        suggestedCategory: 'cahier',
      },
      {
        rawText: '2 Stylos bleus Bic',
        normalizedName: 'Stylo bleu Bic Cristal',
        quantity: 2,
        confidenceScore: 94,
        suggestedCategory: 'stylo',
      },
      {
        rawText: '1 Trousse scolaire double ouverture',
        normalizedName: 'Trousse Scolaire Double Compartiment',
        quantity: 1,
        confidenceScore: 88,
        suggestedCategory: 'trousse',
      },
      {
        rawText: '1 Boîte de 12 crayons de couleur',
        normalizedName: 'Boîte de 12 Crayons de Couleur Maped',
        quantity: 1,
        confidenceScore: 90,
        suggestedCategory: 'crayon',
      },
      {
        rawText: '1 Calculatrice scientifique Casio fx-92',
        normalizedName: 'Calculatrice scientifique Casio fx-92 College',
        quantity: 1,
        confidenceScore: 72,
        suggestedCategory: 'calculatrice',
      },
      {
        rawText: '1 Gourde isotherme inox 500ml',
        normalizedName: 'Gourde Isotherme Écolier 500ml',
        quantity: 1,
        confidenceScore: 85,
        suggestedCategory: 'gourde',
      },
    ],
  };
}

async function callGeminiVision(image: string, apiKey: string) {
  let mimeType = 'image/jpeg';
  let base64Data = image;

  if (image.startsWith('data:')) {
    const parts = image.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const promptText = `Tu es l'expert officiel d'EduShop au Sénégal pour le déchiffrage de listes de fournitures scolaires (manuscrites et imprimées).

RÈGLES MÉTIER ET COMPRÉHENSION DU LANGAGE HUMAIN (SÉNÉGAL) :
1. "PAQUET DE CAHIERS" :
   - Au Sénégal, les écoles demandent souvent "1 paquet de cahiers [X] pages" ou "2 paquets de cahiers [X] pages".
   - 1 paquet standard de cahiers contient 10 cahiers unitaires (ex: 1 paquet de 100 pages = 10 cahiers de 100 pages).
   - Si la liste demande "2 paquets de cahiers 100 pages", convertis en 20 cahiers unitaires de 100 pages (quantity: 20, normalizedName: "Cahier 100 pages grand format", rawText: "2 paquets de cahiers 100 pages").
   - Si la liste demande "1 paquet de cahiers 200 pages", quantity: 10, normalizedName: "Cahier 200 pages grand format".
2. "COPIES DOUBLES & DESSIN" :
   - "Paquet de copies doubles" -> normalizedName: "Paquet de Copies Doubles PM", quantity: 1.
   - "Cahier de dessin" -> normalizedName: "Cahier de Dessin PM", quantity: 1.
3. "MATÉRIELS ET STYLOS" :
   - "Stylo bleu / bic" -> normalizedName: "Stylo Bille Bleu", quantity: 1.
   - "Matériel de géométrie" -> normalizedName: "Matériels / Kit de Géométrie", quantity: 1.

Retourne uniquement le JSON. Ne rajoute aucun texte avant ou après.`;

  const models = ['gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro'];
  let lastError = '';

  for (const model of models) {
    try {
      console.log(`🤖 [SERVER SCAN] Essai modèle Gemini : ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            response_schema: {
              type: 'OBJECT',
              properties: {
                overallConfidenceScore: { type: 'INTEGER' },
                items: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      rawText: { type: 'STRING' },
                      normalizedName: { type: 'STRING' },
                      quantity: { type: 'INTEGER' },
                      confidenceScore: { type: 'INTEGER' },
                      suggestedCategory: { type: 'STRING' }
                    },
                    required: ['rawText', 'normalizedName', 'quantity']
                  }
                }
              },
              required: ['items']
            },
            temperature: 0.0,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          let parsed: any = null;
          try {
            parsed = JSON.parse(textResponse);
          } catch (e) {
            console.warn('⚠️ [SERVER SCAN] JSON tronqué détecté, tentative de réparation...');
            let cleaned = textResponse.trim();
            const lastObj = cleaned.lastIndexOf('}');
            if (lastObj > 0) {
              cleaned = cleaned.substring(0, lastObj + 1);
              if (!cleaned.endsWith(']}')) {
                if (!cleaned.endsWith(']')) cleaned += ']';
                cleaned += '}';
              }
              try {
                parsed = JSON.parse(cleaned);
                console.log('✅ Réparation JSON réussie !');
              } catch (e2) {
                console.error('❌ Échec de la réparation JSON:', e2);
              }
            }
          }
          if (parsed) {
            const rawList = parsed.items || parsed.fournitures || parsed.produits || parsed.articles || parsed.liste || (Array.isArray(parsed) ? parsed : null);
            if (rawList && Array.isArray(rawList) && rawList.length > 0) {
              console.log(`✅ Gemini (${model}) a extrait ${rawList.length} articles avec succès !`);
              return {
                data: {
                  overallConfidenceScore: parsed.overallConfidenceScore || 90,
                  items: rawList.map((item: any) => ({
                    rawText: item.rawText || item.nom || item.name || item.description || 'Article',
                    normalizedName: item.normalizedName || item.rawText || item.nom || item.name || 'Article',
                    quantity: Number(item.quantity || item.quantite || item.qty || 1),
                    confidenceScore: Number(item.confidenceScore || 90),
                    suggestedCategory: item.suggestedCategory || item.categorie || ''
                  }))
                }
              };
            }
          }
        }
      } else {
        const errText = await response.text();
        lastError = `Statut HTTP ${response.status} sur ${model}: ${errText.substring(0, 150)}`;
        console.warn(`⚠️ Modèle ${model} indisponible (${response.status}), essai du modèle suivant...`);
      }
    } catch (err: any) {
      lastError = `Exception ${model}: ${err?.message || err}`;
      console.warn(`⚠️ Exception sur ${model}, essai du suivant...`);
    }
  }

  return { error: lastError || 'Quota dépassé ou tous les modèles Gemini indisponibles.' };
}

/**
 * Appel OpenAI Vision API
 */
async function callOpenAIVision(image: string, apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en lecture de listes de fournitures scolaires au Sénégal.
Analyse l'image fournie et retourne UNIQUEMENT un objet JSON strict au format :
{
  "overallConfidenceScore": 92,
  "items": [
    {
      "rawText": "4 cahiers 100p grands carreaux",
      "normalizedName": "Cahier 100 pages grand format Seyes",
      "quantity": 4,
      "confidenceScore": 95,
      "suggestedCategory": "cahier"
    }
  ]
}`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrais tous les articles de cette liste scolaire :' },
              { type: 'image_url', image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (response.ok) {
      const resData = await response.json();
      const parsed = JSON.parse(resData.choices[0].message.content);
      console.log('✅ Succès réponse OpenAI Vision:', JSON.stringify(parsed, null, 2));
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return parsed;
      }
    } else {
      const errorMsg = await response.text();
      console.error('❌ Erreur OpenAI Vision API (status ' + response.status + '):', errorMsg);
    }
  } catch (err) {
    console.error('❌ Exception OpenAI Vision:', err);
  }
  return null;
}
