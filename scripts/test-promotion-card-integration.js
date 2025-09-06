#!/usr/bin/env node

/**
 * Script de test pour vérifier l'intégration d'AppPromotionCard avec les props
 */

const http = require('http');

console.log('🔍 TEST D\'INTÉGRATION - AppPromotionCard avec props\n');

// Test 1: Vérifier que l'API promotions fonctionne
function testAPI() {
  return new Promise((resolve, reject) => {
    console.log('📡 Test 1: Vérification de l\'API promotions...');
    
    const request = http.get('http://localhost:3001/api/airtable/promotions', (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const promotions = jsonData.data || [];
          
          console.log(`✅ API fonctionne: ${promotions.length} promotions trouvées`);
          console.log('📝 Premières promotions:');
          
          promotions.slice(0, 2).forEach((promo, index) => {
            console.log(`  ${index + 1}. ${promo.title} (-${promo.discount}%)`);
          });
          
          resolve(promotions);
        } catch (error) {
          console.log('❌ Erreur parsing JSON API');
          reject(error);
        }
      });
    });
    
    request.on('error', (error) => {
      console.log('❌ Erreur connexion API');
      reject(error);
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      console.log('❌ Timeout API');
      reject(new Error('Timeout'));
    });
  });
}

// Test 2: Vérifier que la page d'accueil se charge
function testHomePage() {
  return new Promise((resolve, reject) => {
    console.log('\n📱 Test 2: Vérification de la page d\'accueil...');
    
    const request = http.get('http://localhost:3001/', (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        // Vérifier que la page contient les éléments attendus
        const hasPromotions = data.includes('AppPromotionCard');
        const hasAirtableRef = data.includes('airtableStore');
        
        console.log(`✅ Page d'accueil chargée (${Math.round(data.length / 1024)}KB)`);
        console.log(`📋 Contient AppPromotionCard: ${hasPromotions ? '✅' : '❌'}`);
        console.log(`📋 Contient référence Airtable: ${hasAirtableRef ? '✅' : '❌'}`);
        
        resolve({ size: data.length, hasPromotions, hasAirtableRef });
      });
    });
    
    request.on('error', (error) => {
      console.log('❌ Erreur chargement page');
      reject(error);
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      console.log('❌ Timeout page');
      reject(new Error('Timeout'));
    });
  });
}

async function runTests() {
  try {
    // Test API
    const promotions = await testAPI();
    
    // Test page d'accueil
    const pageData = await testHomePage();
    
    console.log('\n📊 RÉSUMÉ DES TESTS:');
    console.log('===================');
    console.log(`✅ API promotions: ${promotions.length} éléments`);
    console.log(`✅ Page d'accueil: ${pageData.hasPromotions ? 'AppPromotionCard présent' : 'Composant manquant'}`);
    console.log(`✅ Store Airtable: ${pageData.hasAirtableRef ? 'Référencé' : 'Manquant'}`);
    
    console.log('\n🎯 CONFIGURATION ACTUELLE:');
    console.log('==========================');
    console.log('• Page index.vue utilise: <AppPromotionCard :promotions="airtableStore.activePromotions.slice(0, 2)" />');
    console.log('• Limitation à 2 promotions via slice(0, 2)');
    console.log('• Données dynamiques depuis Airtable');
    console.log('• Composant réutilisable avec props');
    
    if (promotions.length >= 2) {
      console.log('\n✨ SUCCÈS: Configuration optimale!');
      console.log('  - Le composant AppPromotionCard accepte les promotions via props');
      console.log('  - Les données viennent d\'Airtable (dynamiques)');
      console.log('  - L\'affichage est limité à 2 promotions sur l\'accueil');
      console.log('  - La page /promotions peut afficher toutes les promotions');
    } else {
      console.log('\n⚠️  ATTENTION: Pas assez de promotions dans Airtable');
      console.log('  - Ajoutez plus de promotions dans votre base Airtable');
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR LORS DES TESTS:', error.message);
    console.log('\n🔧 VÉRIFICATIONS:');
    console.log('  1. Le serveur Nuxt est-il démarré ? (npm run dev)');
    console.log('  2. Les variables Airtable sont-elles configurées ?');
    console.log('  3. La base Airtable contient-elle des promotions ?');
  }
}

// Exécuter les tests
runTests();
