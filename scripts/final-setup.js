#!/usr/bin/env node
// scripts/final-setup.js
// Script final pour configurer complètement Airtable

console.log(`
🚀 CONFIGURATION FINALE D'AIRTABLE - FOURNITURES SCOLAIRES
============================================================

📊 STATUT ACTUEL: Site fonctionnel avec données de démonstration
⚠️  AIRTABLE: Tables vides, fallback actif

🎯 MISSION: Remplir Airtable pour éliminer complètement les fallbacks

📋 ÉTAPES À SUIVRE:

1️⃣  CRÉER LES CHAMPS DANS AIRTABLE (MANUEL)
   🔗 Allez sur: https://airtable.com/appOtYkVavA4MMMnN

   📣 TABLE PROMOTIONS (tblrUYgl2PgYIEMY5):
      • Title (Single line text)
      • Description (Long text)
      • Discount (Number)
      • Type (Single select: percentage, fixed, bogo)
      • End Date (Date)
      • Category (Single line text)
      • Trending (Checkbox)
      • Featured (Checkbox)
      • Icon (Single line text)
      • Rating (Number)
      • Features (Long text)
      • Original Price (Currency - CFA)
      • Current Price (Currency - CFA)
      • Is Active (Checkbox)

   💬 TABLE TESTIMONIALS (tblYjfi1FFk1CCH46):
      • Name (Single line text)
      • Role (Single line text)
      • Avatar_URL (URL)
      • Text (Long text)
      • Rating (Number)
      • Location (Single line text)
      • Is_Active (Checkbox)
      • Order (Number)

2️⃣  REMPLIR AUTOMATIQUEMENT LES DONNÉES
   Une fois les champs créés, exécutez:
   
   $ node scripts/fill-airtable-data.js

3️⃣  VÉRIFIER LA DYNAMISATION COMPLÈTE
   
   $ node scripts/final-audit.js
   $ curl http://localhost:3000/api/airtable/promotions
   $ curl http://localhost:3000/api/airtable/testimonials

4️⃣  TESTER LE SITE WEB
   
   🌐 http://localhost:3000/ (promotions et témoignages visibles)
   🌐 http://localhost:3000/promotions (page dédiée)

🎯 RÉSULTAT ATTENDU:
   ✅ Plus de mode fallback
   ✅ Données 100% dynamiques depuis Airtable
   ✅ Site complètement opérationnel
   ✅ Prêt pour la production

💡 SI LES CHAMPS EXISTENT DÉJÀ:
   Lancez directement: node scripts/fill-airtable-data.js

📧 PROBLÈMES:
   • Inspectez: node scripts/inspect-airtable-structure.js
   • Guide: cat CREATION_CHAMPS_AIRTABLE.md

============================================================
🎉 LE SITE EST DÉJÀ FONCTIONNEL AVEC DES DONNÉES DE DÉMO !
🔧 Cette étape finalise la configuration Airtable complète.
============================================================
`);

console.log(
  "⏳ Prêt à continuer ? Appuyez sur Ctrl+C pour annuler ou attendez 10 secondes..."
);

// Attendre 10 secondes puis proposer d'exécuter les scripts
setTimeout(() => {
  console.log("\n🚀 Lancement automatique des vérifications...\n");

  // Test rapide des endpoints
  console.log("🔍 Test rapide des endpoints...");

  Promise.all([
    fetch("http://localhost:3000/api/airtable/promotions"),
    fetch("http://localhost:3000/api/airtable/testimonials"),
  ])
    .then(async ([promoRes, testRes]) => {
      const promos = await promoRes.json();
      const tests = await testRes.json();

      console.log(
        `✅ Promotions: ${promos.data?.length || 0} éléments${
          promos.fallback ? " (FALLBACK)" : ""
        }`
      );
      console.log(
        `✅ Témoignages: ${tests.data?.length || 0} éléments${
          tests.fallback ? " (FALLBACK)" : ""
        }`
      );

      if (promos.fallback || tests.fallback) {
        console.log("\n⚠️  MODE FALLBACK ACTIF - Airtable à configurer");
        console.log("📖 Consultez: cat CREATION_CHAMPS_AIRTABLE.md");
      } else {
        console.log("\n🎉 AIRTABLE COMPLÈTEMENT OPÉRATIONNEL !");
      }

      console.log("\n🌐 Testez le site: http://localhost:3000");
    })
    .catch((err) => {
      console.error("❌ Erreur lors du test:", err.message);
      console.log(
        "💡 Assurez-vous que le serveur dev est démarré: npm run dev"
      );
    });
}, 5000);
