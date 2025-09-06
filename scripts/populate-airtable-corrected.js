#!/usr/bin/env node
// scripts/populate-airtable-corrected.js
// Script pour remplir automatiquement les tables Airtable avec des données d'exemple

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

// IDs des tables
const TABLES = {
  PRODUCTS: "tblxGbcySHadDtsyn",
  PACKS: "tbl4JVykOdi6YFvfd",
  PROMOTIONS: "tblrUYgl2PgYIEMY5",
  TESTIMONIALS: "tblYjfi1FFk1CCH46",
};

// Fonction pour créer les champs manquants dans une table
async function createFieldsForTable(tableId, fieldDefinitions) {
  console.log(`🔧 Création des champs pour la table ${tableId}...`);

  for (const field of fieldDefinitions) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${tableId}/fields`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(field),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.error &&
          errorData.error.type === "DUPLICATE_FIELD_NAME"
        ) {
          console.log(`   ✅ Champ "${field.name}" existe déjà`);
        } else {
          console.error(
            `   ❌ Erreur pour le champ "${field.name}":`,
            errorData
          );
        }
      } else {
        const result = await response.json();
        console.log(`   ✅ Champ "${field.name}" créé avec succès`);
      }
    } catch (error) {
      console.error(
        `   ❌ Erreur lors de la création du champ "${field.name}":`,
        error
      );
    }
  }
}

// Définitions des champs pour la table Promotions
const PROMOTIONS_FIELDS = [
  { name: "Title", type: "singleLineText" },
  { name: "Description", type: "multilineText" },
  { name: "Discount", type: "number", options: { precision: 0 } },
  {
    name: "Type",
    type: "singleSelect",
    options: {
      choices: [{ name: "percentage" }, { name: "fixed" }, { name: "bogo" }],
    },
  },
  { name: "End Date", type: "date" },
  { name: "Category", type: "singleLineText" },
  { name: "Trending", type: "checkbox" },
  { name: "Featured", type: "checkbox" },
  { name: "Icon", type: "singleLineText" },
  { name: "Rating", type: "number", options: { precision: 0 } },
  { name: "Features", type: "multilineText" },
  { name: "Original Price", type: "currency", options: { symbol: "CFA" } },
  { name: "Current Price", type: "currency", options: { symbol: "CFA" } },
  { name: "Is Active", type: "checkbox" },
];

// Définitions des champs pour la table Testimonials
const TESTIMONIALS_FIELDS = [
  { name: "Name", type: "singleLineText" },
  { name: "Role", type: "singleLineText" },
  { name: "Avatar_URL", type: "url" },
  { name: "Text", type: "multilineText" },
  { name: "Rating", type: "number", options: { precision: 0 } },
  { name: "Location", type: "singleLineText" },
  { name: "Is_Active", type: "checkbox" },
  { name: "Order", type: "number", options: { precision: 0 } },
];

// Données d'exemple pour les promotions
const PROMOTIONS_DATA = [
  {
    fields: {
      Title: "Pack Rentrée CP - Offre Spéciale",
      Description:
        "Profitez de -25% sur tous les packs CP pour bien commencer l'année scolaire. Inclut tous les essentiels : cahiers, stylos, crayons et plus encore !",
      Discount: 25,
      Type: "percentage",
      "End Date": "2025-10-15",
      Category: "Packs Scolaires",
      Trending: true,
      Featured: true,
      Icon: "🎒",
      Rating: 5,
      Features: JSON.stringify([
        "Livraison gratuite",
        "Qualité premium",
        "Pack complet",
        "Garantie satisfaction",
      ]),
      "Original Price": 20000,
      "Current Price": 15000,
      "Is Active": true,
    },
  },
  {
    fields: {
      Title: "Fournitures Collège - Super Promo",
      Description:
        "Réduction exceptionnelle de 30% sur tous les articles pour collégiens. Préparez la rentrée sereinement avec notre sélection premium !",
      Discount: 30,
      Type: "percentage",
      "End Date": "2025-09-30",
      Category: "Fournitures",
      Trending: false,
      Featured: true,
      Icon: "📚",
      Rating: 4,
      Features: JSON.stringify([
        "Calculatrice scientifique incluse",
        "Kit géométrie complet",
        "Cahiers grands formats",
        "Stylos de qualité",
      ]),
      "Original Price": 35000,
      "Current Price": 24500,
      "Is Active": true,
    },
  },
  {
    fields: {
      Title: "Kit Art & Créativité - Liquidation",
      Description:
        "Dernière chance ! 40% de réduction sur notre kit complet d'art et créativité. Parfait pour développer la créativité des enfants.",
      Discount: 40,
      Type: "percentage",
      "End Date": "2025-09-25",
      Category: "Art & Créativité",
      Trending: true,
      Featured: false,
      Icon: "🎨",
      Rating: 5,
      Features: JSON.stringify([
        "Crayons de couleur premium",
        "Feutres lavables",
        "Peinture acrylique",
        "Pinceaux assortis",
      ]),
      "Original Price": 12000,
      "Current Price": 7200,
      "Is Active": true,
    },
  },
  {
    fields: {
      Title: "Calculatrices Scientifiques - Promo Étudiants",
      Description:
        "Spécial étudiants ! 20% de réduction sur toutes nos calculatrices scientifiques. Indispensables pour les mathématiques avancées.",
      Discount: 20,
      Type: "percentage",
      "End Date": "2025-12-31",
      Category: "Calculatrices",
      Trending: false,
      Featured: false,
      Icon: "🧮",
      Rating: 4,
      Features: JSON.stringify([
        "Écran haute résolution",
        "Fonction graphique",
        "Pile longue durée",
        "Manuel en français",
      ]),
      "Original Price": 8500,
      "Current Price": 6800,
      "Is Active": true,
    },
  },
];

// Données d'exemple pour les témoignages
const TESTIMONIALS_DATA = [
  {
    fields: {
      Name: "Awa Diop",
      Role: "Maman de 2 enfants",
      Avatar_URL: "https://i.pravatar.cc/150?img=1",
      Text: "Service exceptionnel ! J'ai commandé les packs CP et CE1 pour mes enfants. Tout était parfait, livraison rapide et fournitures de qualité. Je recommande vivement !",
      Rating: 5,
      Location: "Dakar",
      Is_Active: true,
      Order: 1,
    },
  },
  {
    fields: {
      Name: "Moussa Sall",
      Role: "Enseignant primaire",
      Avatar_URL: "https://i.pravatar.cc/150?img=2",
      Text: "En tant qu'enseignant, je recommande ce site à tous les parents. Les packs sont bien pensés et correspondent exactement aux besoins des élèves. Bravo !",
      Rating: 5,
      Location: "Thiès",
      Is_Active: true,
      Order: 2,
    },
  },
  {
    fields: {
      Name: "Fatima Ndiaye",
      Role: "Directrice d'école",
      Avatar_URL: "https://i.pravatar.cc/150?img=3",
      Text: "Site très professionnel avec un excellent service client. Les commandes groupées pour notre école se sont très bien passées. Merci pour votre sérieux !",
      Rating: 5,
      Location: "Saint-Louis",
      Is_Active: true,
      Order: 3,
    },
  },
  {
    fields: {
      Name: "Omar Ba",
      Role: "Papa d'un collégien",
      Avatar_URL: "https://i.pravatar.cc/150?img=4",
      Text: "Très satisfait de mon achat. Le pack collège était complet et de bonne qualité. Prix très compétitifs par rapport aux magasins traditionnels.",
      Rating: 4,
      Location: "Kaolack",
      Is_Active: true,
      Order: 4,
    },
  },
  {
    fields: {
      Name: "Aissatou Diouf",
      Role: "Maman de 3 enfants",
      Avatar_URL: "https://i.pravatar.cc/150?img=5",
      Text: "Gain de temps énorme ! Plus besoin de courir les magasins. Tout arrive à domicile et c'est moins cher. Site au top pour les mamans débordées comme moi !",
      Rating: 5,
      Location: "Rufisque",
      Is_Active: true,
      Order: 5,
    },
  },
  {
    fields: {
      Name: "Ibrahima Dieng",
      Role: "Étudiant en master",
      Avatar_URL: "https://i.pravatar.cc/150?img=6",
      Text: "Parfait pour les étudiants ! Bons prix, large choix et livraison efficace. J'ai trouvé tout ce dont j'avais besoin pour mes cours. Top service !",
      Rating: 4,
      Location: "Touba",
      Is_Active: true,
      Order: 6,
    },
  },
];

async function createRecords(tableId, records) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  // Traiter par lots de 10 (limite Airtable)
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: batch }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `❌ Erreur ${response.status}:`,
          JSON.stringify(errorData, null, 2)
        );
        throw new Error(
          `Erreur ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      const result = await response.json();
      console.log(
        `✅ Lot ${Math.floor(i / 10) + 1}: ${
          result.records.length
        } enregistrements ajoutés`
      );
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'ajout du lot ${Math.floor(i / 10) + 1}:`,
        error
      );
      throw error;
    }
  }
}

async function populateAirtableData() {
  console.log("🚀 CRÉATION DES CHAMPS ET REMPLISSAGE DES TABLES AIRTABLE");
  console.log("=".repeat(60));

  try {
    // 1. Créer les champs pour la table Promotions
    console.log("\n🔧 Création des champs pour la table PROMOTIONS...");
    await createFieldsForTable(TABLES.PROMOTIONS, PROMOTIONS_FIELDS);

    // 2. Créer les champs pour la table Testimonials
    console.log("\n🔧 Création des champs pour la table TESTIMONIALS...");
    await createFieldsForTable(TABLES.TESTIMONIALS, TESTIMONIALS_FIELDS);

    // Attendre un peu pour que les champs soient bien créés
    console.log("\n⏳ Attendre la création des champs...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Ajouter les promotions
    console.log("\n📣 Ajout des promotions...");
    await createRecords(TABLES.PROMOTIONS, PROMOTIONS_DATA);
    console.log(`✅ ${PROMOTIONS_DATA.length} promotions ajoutées`);

    // 4. Ajouter les témoignages
    console.log("\n💬 Ajout des témoignages...");
    await createRecords(TABLES.TESTIMONIALS, TESTIMONIALS_DATA);
    console.log(`✅ ${TESTIMONIALS_DATA.length} témoignages ajoutés`);

    console.log("\n🎉 DONNÉES AJOUTÉES AVEC SUCCÈS !");
    console.log("=".repeat(60));
    console.log(`📣 Promotions: ${PROMOTIONS_DATA.length}`);
    console.log(`💬 Témoignages: ${TESTIMONIALS_DATA.length}`);

    console.log("\n🔗 LIENS UTILES:");
    console.log(
      `Voir les promotions: http://localhost:3000/api/airtable/promotions`
    );
    console.log(
      `Voir les témoignages: http://localhost:3000/api/airtable/testimonials`
    );
    console.log(`Page promotions: http://localhost:3000/promotions`);
    console.log(`Page d'accueil: http://localhost:3000/`);

    console.log("\n🎯 PROCHAINES ÉTAPES:");
    console.log("1. Vérifiez que les données s'affichent sur le site");
    console.log("2. Lancez l'audit final: node scripts/final-audit.js");
    console.log(
      "3. Testez le site: node scripts/test-website-functionality.js"
    );
  } catch (error) {
    console.error("❌ Erreur lors du remplissage des données:", error);
    process.exit(1);
  }
}

// Fonction pour vider une table (optionnel)
async function clearTable(tableId) {
  try {
    console.log(`🧹 Nettoyage de la table ${tableId}...`);

    // Récupérer tous les enregistrements
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();
    const recordIds = data.records.map((record) => record.id);

    if (recordIds.length === 0) {
      console.log("Table déjà vide");
      return;
    }

    // Supprimer par lots de 10 (limite Airtable)
    for (let i = 0; i < recordIds.length; i += 10) {
      const batch = recordIds.slice(i, i + 10);
      const deleteUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?${batch
        .map((id) => `records[]=${id}`)
        .join("&")}`;

      await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });
    }

    console.log(`✅ ${recordIds.length} enregistrements supprimés`);
  } catch (error) {
    console.error(`Erreur lors du nettoyage:`, error);
  }
}

// Exécution du script
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--clear")) {
    console.log("🧹 MODE NETTOYAGE ACTIVÉ");
    await clearTable(TABLES.PROMOTIONS);
    await clearTable(TABLES.TESTIMONIALS);
    console.log("✅ Nettoyage terminé\n");
  }

  await populateAirtableData();
}

main().catch(console.error);
