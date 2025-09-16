#!/usr/bin/env node

// Script de diagnostic pour tester les pages de détails des packs

const testPackIds = [
  "pack-cp",
  "pack-college",
  "pack-cm2",
  "pack-ce1",
  "pack-ce2",
  "pack-cm1",
  "pack-terminale",
];

async function testPackDetails() {
  console.log("🔍 Test des pages de détails des packs...\n");

  for (const packId of testPackIds) {
    try {
      console.log(`📦 Test du pack: ${packId}`);

      // Test de l'API
      const apiUrl = `http://localhost:3000/api/airtable/packs/${packId}`;
      const apiResponse = await fetch(apiUrl);

      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData.success && apiData.data) {
          console.log(`  ✅ API OK - ${apiData.data.name}`);
        } else {
          console.log(`  ❌ API Error - ${apiData.message || "Unknown error"}`);
        }
      } else {
        console.log(`  ❌ API HTTP Error - ${apiResponse.status}`);
      }

      // Test de la page
      const pageUrl = `http://localhost:3000/packs/${packId}`;
      const pageResponse = await fetch(pageUrl);

      if (pageResponse.ok) {
        const pageHtml = await pageResponse.text();
        if (
          pageHtml.includes("Pack") &&
          (pageHtml.includes("FCFA") || pageHtml.includes("Ajouter au panier"))
        ) {
          console.log(`  ✅ Page OK - Contenu chargé`);
        } else if (pageHtml.includes("Pack")) {
          console.log(`  ⚠️  Page partiellement chargée`);
        } else {
          console.log(`  ❌ Page vide - Pas de contenu`);
        }
      } else {
        console.log(`  ❌ Page HTTP Error - ${pageResponse.status}`);
      }
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }

    console.log("");
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/ping");
    if (response.ok) {
      console.log("✅ Serveur en cours d'exécution\n");
      return true;
    }
  } catch (error) {
    console.log(
      "❌ Serveur non accessible. Démarrez le serveur avec: npm run dev\n"
    );
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testPackDetails();
  }
}

main().catch(console.error);
