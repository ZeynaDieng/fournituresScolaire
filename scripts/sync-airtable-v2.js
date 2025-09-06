// scripts/sync-airtable.js
// Script pour synchroniser les données du store local vers Airtable

import Airtable from "airtable";
import "dotenv/config";

// Configuration Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_PACKS_TABLE);

// Données exactes du store local - avec les colonnes qui existent dans Airtable
const packsData = [
  {
    Level: "CP",
    Price: 16500,
    "Original Price": 19000,
    Description:
      "Le nécessaire pour bien démarrer le Cours Préparatoire (CI/CP). Pack Essentiel CP",
    Contents:
      "5 Cahiers 96 pages (17x22cm), 2 Cahiers de dessin 48 pages, 1 Ardoise Velleda + 2 feutres + 1 chiffon, 1 Trousse garnie (2 stylos bleus, 1 stylo vert, 1 crayon noir, 1 gomme, 1 taille-crayon), 1 Boîte de 12 crayons de couleur, 1 Règle plate 20cm, 5 Protège-cahiers (couleurs assorties), 1 Paquet de 100 étiquettes",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": true,
    "Promotion End Date": "2024-12-31",
  },
  {
    Level: "CE1-CE2",
    Price: 21000,
    "Original Price": 25000,
    Description:
      "Un pack complet pour les élèves du Cours Élémentaire. Pack Avancé CE1-CE2",
    Contents:
      "8 Cahiers 96 pages (17x22cm), 4 Cahiers 192 pages (21x29.7cm), 1 Cahier de poésie/chant, 1 Trousse (2 stylos bleus, 1 vert, 1 rouge, 1 noir, 1 crayon, 1 gomme, 1 taille-crayon), 1 Boîte de 12 feutres de couleur, 1 Kit de traçage (règle 30cm, équerre, rapporteur), 1 Compas, 1 Agenda scolaire ou cahier de texte, 8 Protège-cahiers (formats assortis)",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": false,
  },
  {
    Level: "Collège",
    Price: 28000,
    "Original Price": 33000,
    Description:
      "L'équipement idéal pour réussir ses années de collège. Pack Collège 6ème-3ème",
    Contents:
      "5 Cahiers 200 pages grand format (24x32cm), 3 Classeurs A4 souples, 1 Paquet de 200 copies doubles A4, 1 Paquet de 100 copies simples A4, 1 Trousse complète (stylos, surligneurs, correcteur), 1 Calculatrice scientifique type collège, 1 Kit de géométrie complet et résistant, 1 Agenda scolaire, 1 Trieur 8 compartiments",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": true,
    "Promotion End Date": "2024-12-15",
  },
  {
    Level: "Lycée",
    Price: 38500,
    "Original Price": 45000,
    Description:
      "Un pack robuste et complet pour affronter les défis du lycée. Pack Lycée Seconde-Terminale",
    Contents:
      "4 Classeurs A4 rigides grand format, 1 Paquet de 400 copies doubles A4 perforées, 1 Paquet de 200 copies simples A4 perforées, 1 Trieur 12 compartiments, 1 Lot de 4 surligneurs de couleurs différentes, 1 Calculatrice scientifique graphique (avec mode examen), 1 Agenda grand format, 1 Ramette de papier 500 feuilles, Stylos et porte-mine de qualité supérieure",
    "Is Popular": false,
    "In Stock": true,
    "Is Promotion": false,
  },
];

async function syncToAirtable() {
  console.log("🚀 Début de la synchronisation Airtable...");

  try {
    // Ajouter les nouveaux enregistrements
    console.log("✨ Ajout des nouveaux packs...");
    const records = packsData.map((pack) => ({
      fields: pack,
    }));

    // Créer par batches de 10 (limite Airtable)
    for (let i = 0; i < records.length; i += 10) {
      const batch = records.slice(i, i + 10);
      await table.create(batch);
      console.log(`   Créé ${batch.length} nouveaux packs...`);
    }

    console.log("✅ Synchronisation terminée avec succès !");
    console.log(
      `📦 ${packsData.length} packs ont été synchronisés dans Airtable.`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
    if (error.error === "UNKNOWN_FIELD_NAME") {
      console.log(
        "\n💡 Conseil: Vérifiez que ces colonnes existent dans votre table Airtable:"
      );
      console.log("- Level, Price, Original Price, Description, Contents");
      console.log("- Is Popular, In Stock, Is Promotion, Promotion End Date");
    }
    process.exit(1);
  }
}

// Exécuter la synchronisation
syncToAirtable();
