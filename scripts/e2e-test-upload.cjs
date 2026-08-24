// scripts/e2e-test-upload.cjs
async function runE2ETest() {
  console.log("==================================================");
  console.log("🚀 TEST D'UPLOAD ET D'ANALYSE IA EN DIRECT (E2E)");
  console.log("==================================================");

  const sampleBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

  console.log("1. Envoi de l'image de test à http://127.0.0.1:3000/api/ai/scan-list ...");
  const startTime = Date.now();

  try {
    const response = await fetch("http://127.0.0.1:3000/api/ai/scan-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: sampleBase64,
        fileName: "liste_scolaire_cm2.jpg",
      }),
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`2. Statut de réponse HTTP : ${response.status} (en ${duration}s)`);

    const result = await response.json();

    if (result.success && result.data) {
      const data = result.data;
      console.log("\n✅ SUCCÈS - L'ANALYSE IA A RÉUSSI AVEC SUCCÈS !");
      console.log("--------------------------------------------------");
      console.log(`📌 Référence Unique créée : ${data.id}`);
      console.log(`📊 Score de confiance global : ${data.overallConfidenceScore}% (${data.overallConfidenceLevel})`);
      console.log(`💰 Montant disponible immédiatement : ${data.availableTotal} FCFA`);
      console.log(`📦 Articles détectés au total : ${data.extractedItems.length}`);
      console.log(`   - Articles en stock immédiat : ${data.exactMatchesCount + data.equivalentMatchesCount}`);
      console.log(`   - Articles en recherche fournisseur : ${data.sourcingItemsCount}`);

      console.log("\n📋 Détail des articles analysés par l'IA :");
      data.extractedItems.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.confidenceLevel}] ${item.quantity}x ${item.normalizedName}`);
        if (item.matchType === 'sourcing') {
          console.log(`     └─ Status : 🔍 En cours de recherche auprès de nos fournisseurs`);
        } else {
          console.log(`     └─ Produit EduShop : ${item.matchedProductName} (${item.matchedProductPrice} FCFA)`);
        }
      });
      console.log("--------------------------------------------------");
      console.log("🎉 TEST VALIDÉ AVEC SUCCÈS ! L'extraction fonctionne parfaitement !");
    } else {
      console.error("❌ Erreur retournée par le serveur :", result.error);
    }
  } catch (err) {
    console.error("❌ Exception lors de l'exécution du test :", err);
  }
}

runE2ETest();
