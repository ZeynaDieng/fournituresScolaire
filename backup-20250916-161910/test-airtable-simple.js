#!/usr/bin/env node

/**
 * Test simple des permissions Airtable
 */

const fetch = require("node-fetch");
require("dotenv").config();

async function testAirtableAccess() {
  console.log("🔍 TEST DES PERMISSIONS AIRTABLE");
  console.log("=".repeat(50));

  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  console.log("Variables:", {
    apiKey: airtableApiKey
      ? `${airtableApiKey.substring(0, 10)}...`
      : "MANQUANT",
    baseId: airtableBaseId || "MANQUANT",
  });

  const tables = [
    { name: "Products", id: process.env.AIRTABLE_PRODUCTS_TABLE },
    { name: "Orders", id: process.env.AIRTABLE_ORDERS_TABLE },
    { name: "Contacts", id: process.env.AIRTABLE_CONTACTS_TABLE },
  ];

  for (const table of tables) {
    console.log(`\n📋 Test ${table.name} (${table.id})...`);

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${table.id}?maxRecords=1`,
        {
          headers: {
            Authorization: `Bearer ${airtableApiKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ ${table.name}: OK (${data.records?.length || 0} records)`
        );
      } else {
        console.log(`❌ ${table.name}: ${response.status}`);
        if (response.status === 404) {
          console.log(`   → Table ${table.name} n'existe pas ou ID incorrect`);
        } else if (response.status === 403) {
          console.log(`   → Permissions insuffisantes pour ${table.name}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${table.name}: Erreur réseau -`, error.message);
    }
  }
}

testAirtableAccess().catch(console.error);
