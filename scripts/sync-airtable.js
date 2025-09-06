// scripts/sync-airtable.js
// Script pour synchroniser les données du store local vers Airtable

import Airtable from "airtable";
import "dotenv/config";

// Configuration Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_PACKS_TABLE);

// Données exactes du store local
const packsData = [
  {
    Name: "Pack Essentiel CP",
    Level: "CP",
    Price: 16500,
    "Original Price": 19000,
    "Image URL":
      "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    Description:
      "Le nécessaire pour bien démarrer le Cours Préparatoire (CI/CP).",
    Contents:
      "5 Cahiers 96 pages (17x22cm), 2 Cahiers de dessin 48 pages, 1 Ardoise Velleda + 2 feutres + 1 chiffon, 1 Trousse garnie (2 stylos bleus, 1 stylo vert, 1 crayon noir, 1 gomme, 1 taille-crayon), 1 Boîte de 12 crayons de couleur, 1 Règle plate 20cm, 5 Protège-cahiers (couleurs assorties), 1 Paquet de 100 étiquettes",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": true,
    "Promotion End Date": "2024-12-31",
  },
  {
    Name: "Pack Avancé CE1-CE2",
    Level: "CE1-CE2",
    Price: 21000,
    "Original Price": 25000,
    "Image URL":
      "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    Description: "Un pack complet pour les élèves du Cours Élémentaire.",
    Contents:
      "8 Cahiers 96 pages (17x22cm), 4 Cahiers 192 pages (21x29.7cm), 1 Cahier de poésie/chant, 1 Trousse (2 stylos bleus, 1 vert, 1 rouge, 1 noir, 1 crayon, 1 gomme, 1 taille-crayon), 1 Boîte de 12 feutres de couleur, 1 Kit de traçage (règle 30cm, équerre, rapporteur), 1 Compas, 1 Agenda scolaire ou cahier de texte, 8 Protège-cahiers (formats assortis)",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": false,
  },
  {
    Name: "Pack Collège 6ème-3ème",
    Level: "Collège",
    Price: 28000,
    "Original Price": 33000,
    "Image URL":
      "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    Description: "L'équipement idéal pour réussir ses années de collège.",
    Contents:
      "5 Cahiers 200 pages grand format (24x32cm), 3 Classeurs A4 souples, 1 Paquet de 200 copies doubles A4, 1 Paquet de 100 copies simples A4, 1 Trousse complète (stylos, surligneurs, correcteur), 1 Calculatrice scientifique type collège, 1 Kit de géométrie complet et résistant, 1 Agenda scolaire, 1 Trieur 8 compartiments",
    "Is Popular": true,
    "In Stock": true,
    "Is Promotion": true,
    "Promotion End Date": "2024-12-15",
  },
  {
    Name: "Pack Lycée Seconde-Terminale",
    Level: "Lycée",
    Price: 38500,
    "Original Price": 45000,
    "Image URL": "https://placehold.co/600x400/F4ECF7/17202A?text=Pack+Lycee",
    Description:
      "Un pack robuste et complet pour affronter les défis du lycée.",
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
    // Étape 1: Récupérer tous les enregistrements existants
    console.log("📋 Récupération des enregistrements existants...");
    const existingRecords = await table.select().all();

    // Étape 2: Supprimer les anciens enregistrements
    if (existingRecords.length > 0) {
      console.log(
        `🗑️ Suppression de ${existingRecords.length} anciens enregistrements...`
      );
      const recordIds = existingRecords.map((record) => record.id);

      // Supprimer par batches de 10 (limite Airtable)
      for (let i = 0; i < recordIds.length; i += 10) {
        const batch = recordIds.slice(i, i + 10);
        await table.destroy(batch);
        console.log(`   Supprimé ${batch.length} enregistrements...`);
      }
    }

    // Étape 3: Ajouter les nouveaux enregistrements
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
    process.exit(1);
  }
}

// Exécuter la synchronisation
syncToAirtable();
