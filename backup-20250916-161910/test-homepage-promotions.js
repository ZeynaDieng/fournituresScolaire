#!/usr/bin/env node

/**
 * Test pour vérifier l'affichage des promotions sur la page d'accueil
 */

const http = require('http');

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testPromotionsOnHomepage() {
  console.log('🏠 Test des promotions sur la page d\'accueil\n');

  try {
    // 1. Tester l'API promotions
    console.log('1. Test API promotions...');
    const promotionsData = await fetchData('http://localhost:3000/api/airtable/promotions');
    const promotions = JSON.parse(promotionsData);
    console.log(`   ✅ ${promotions.data?.length || 0} promotions trouvées dans l'API`);
    
    // 2. Afficher les 2 premières promotions (comme sur la page d'accueil)
    if (promotions.data && promotions.data.length >= 2) {
      console.log('\n2. Les 2 premières promotions qui seront affichées :');
      promotions.data.slice(0, 2).forEach((promo, index) => {
        console.log(`   ${index + 1}. ${promo.title}`);
        console.log(`      - Réduction: ${promo.discount}%`);
        console.log(`      - Prix original: ${promo.originalPrice || 'N/A'} CFA`);
        console.log(`      - Features: ${promo.features ? promo.features.length : 0} éléments`);
        console.log(`      - Actif: ${promo.isActive ? 'Oui' : 'Non'}`);
        console.log(`      - Date fin: ${promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Aucune'}`);
        console.log('');
      });
    } else {
      console.log('   ⚠️  Moins de 2 promotions disponibles');
    }

    // 3. Test d'accès à la page d'accueil (vérifier que le serveur répond)
    console.log('3. Test d\'accès à la page d\'accueil...');
    const homepageResponse = await fetchData('http://localhost:3000');
    const isHomepageOk = homepageResponse.includes('<title>') && homepageResponse.length > 1000;
    console.log(`   ${isHomepageOk ? '✅' : '❌'} Page d'accueil ${isHomepageOk ? 'accessible' : 'problème'}`);

    // 4. Résumé
    console.log('\n📊 RÉSUMÉ :');
    console.log(`- API promotions: ${promotions.data ? '✅ Fonctionnelle' : '❌ Erreur'}`);
    console.log(`- Nombre total: ${promotions.data?.length || 0} promotions`);
    console.log(`- Affichées sur accueil: ${Math.min(2, promotions.data?.length || 0)} promotions`);
    console.log(`- Page d'accueil: ${isHomepageOk ? '✅ OK' : '❌ Problème'}`);

    if (promotions.data && promotions.data.length >= 2) {
      console.log('\n✨ SUCCESS: La page d\'accueil devrait afficher 2 promotions depuis Airtable !');
    } else if (promotions.data && promotions.data.length > 0) {
      console.log(`\n⚠️  WARNING: Seulement ${promotions.data.length} promotion(s) disponible(s)`);
    } else {
      console.log('\n❌ ERROR: Aucune promotion disponible');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testPromotionsOnHomepage().catch(console.error);
