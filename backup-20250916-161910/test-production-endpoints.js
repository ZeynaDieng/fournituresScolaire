#!/usr/bin/env node

/**
 * Script de test des endpoints en production
 */

const BASE_URL = process.env.VERCEL_URL || 'https://your-app.vercel.app';

async function testEndpoints() {
  console.log('🧪 Test des endpoints de production...');
  console.log('URL de base:', BASE_URL);
  
  const tests = [
    {
      name: 'Image default.png',
      url: BASE_URL + '/images/payment/default.png',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'API Produits',
      url: BASE_URL + '/api/admin/products',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'API Promotions',
      url: BASE_URL + '/api/admin/promotions',
      method: 'GET',
      expectedStatus: 200
    }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(test.url, { method: test.method });
      const status = response.status;
      const result = status === test.expectedStatus ? '✅' : '❌';
      
      console.log(`${result} ${test.name}: ${status} (${test.url})`);
      
      if (status !== test.expectedStatus) {
        console.log(`   Attendu: ${test.expectedStatus}, Reçu: ${status}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERREUR - ${error.message}`);
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  testEndpoints().catch(console.error);
}

module.exports = { testEndpoints };
