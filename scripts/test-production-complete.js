#!/usr/bin// 🌐 URL Vercel confirmée
const PRODUCTION_URL = 'https://fournitures-scolaire.vercel.app';nv node

/**
 * Script de test automatique de la production Vercel
 * À exécuter APRÈS avoir configuré les variables d'environnement
 */

const https = require('https');
const http = require('http');

// 🌐 Remplacez par votre vraie URL Vercel !
const PRODUCTION_URL = 'https://fournituresscolaire.vercel.app';

console.log('🧪 Test Automatique de Production - Fournitures Scolaires');
console.log('=' .repeat(60));
console.log(`🌐 URL testée: ${PRODUCTION_URL}\n`);

// Tests à effectuer
const tests = [
  {
    name: '🏠 Page d\'accueil',
    path: '/',
    method: 'GET',
    expectedStatus: 200,
    critical: true
  },
  {
    name: '🖼️  Image default.png',
    path: '/images/payment/default.png',
    method: 'GET',
    expectedStatus: 200,
    critical: true
  },
  {
    name: '📦 API Produits',
    path: '/api/admin/products',
    method: 'GET',
    expectedStatus: 200,
    critical: true
  },
  {
    name: '🎁 API Promotions',
    path: '/api/admin/promotions',
    method: 'GET',
    expectedStatus: 200,
    critical: true
  },
  {
    name: '📋 API Packs',
    path: '/api/admin/packs',
    method: 'GET',
    expectedStatus: 200,
    critical: false
  },
  {
    name: '💬 API Testimonials',
    path: '/api/admin/testimonials',
    method: 'GET',
    expectedStatus: 200,
    critical: false
  },
  {
    name: '📄 Page Produits',
    path: '/products',
    method: 'GET',
    expectedStatus: 200,
    critical: false
  },
  {
    name: '🛒 Page Checkout',
    path: '/checkout',
    method: 'GET',
    expectedStatus: 200,
    critical: false
  }
];

// Fonction pour faire un test HTTP
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      timeout: 10000,
      headers: {
        'User-Agent': 'Fournitures-Scolaire-Test/1.0'
      }
    };

    const req = lib.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.slice(0, 500), // Premier 500 caractères
          size: Buffer.byteLength(data)
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
}

// Fonction de test principal
async function runTests() {
  let passed = 0;
  let failed = 0;
  let criticalFailed = 0;

  console.log('🚀 Démarrage des tests...\n');

  for (const test of tests) {
    const url = PRODUCTION_URL + test.path;
    
    try {
      console.log(`Testing ${test.name}...`);
      const startTime = Date.now();
      const response = await makeRequest(url, test.method);
      const duration = Date.now() - startTime;
      
      const success = response.status === test.expectedStatus;
      const icon = success ? '✅' : '❌';
      const critical = test.critical ? ' [CRITIQUE]' : '';
      
      console.log(`${icon} ${test.name}${critical}`);
      console.log(`   Status: ${response.status} (attendu: ${test.expectedStatus})`);
      console.log(`   Temps: ${duration}ms`);
      console.log(`   Taille: ${response.size} bytes`);
      
      if (success) {
        passed++;
      } else {
        failed++;
        if (test.critical) {
          criticalFailed++;
          console.log(`   🚨 ERREUR CRITIQUE sur ${url}`);
        }
        
        // Informations supplémentaires en cas d'erreur
        if (response.status >= 400) {
          console.log(`   Détails: ${response.data.substring(0, 200)}...`);
        }
      }
      
      console.log();
    } catch (error) {
      failed++;
      if (test.critical) criticalFailed++;
      
      console.log(`❌ ${test.name}${test.critical ? ' [CRITIQUE]' : ''}`);
      console.log(`   Erreur: ${error.message}`);
      console.log(`   URL: ${url}`);
      console.log();
    }
  }

  // Résumé final
  console.log('=' .repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('=' .repeat(60));
  console.log(`✅ Tests réussis: ${passed}`);
  console.log(`❌ Tests échoués: ${failed}`);
  console.log(`🚨 Erreurs critiques: ${criticalFailed}`);
  console.log(`📊 Taux de réussite: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  console.log('\n🎯 STATUT GLOBAL:');
  if (criticalFailed === 0 && failed === 0) {
    console.log('🎉 PARFAIT ! Toutes les fonctionnalités marchent !');
  } else if (criticalFailed === 0) {
    console.log('✅ BON ! Fonctionnalités principales OK (erreurs mineures)');
  } else {
    console.log('🚨 ATTENTION ! Des fonctionnalités critiques ne marchent pas');
    console.log('\n🔧 Actions à faire:');
    console.log('1. Vérifier les variables d\'environnement Vercel');
    console.log('2. Redéployer l\'application');
    console.log('3. Vérifier les logs Vercel pour plus de détails');
  }

  // Suggestions selon les erreurs
  if (failed > 0) {
    console.log('\n💡 SUGGESTIONS:');
    console.log('- Erreur 500: Variables d\'environnement manquantes');
    console.log('- Erreur 404: Fichiers manquants ou routes incorrectes');
    console.log('- Timeout: Problème de performance ou d\'hébergement');
    console.log('- Erreur de connexion: Problème DNS ou serveur');
  }

  console.log(`\n🌐 Site testé: ${PRODUCTION_URL}`);
  console.log('📅 Test effectué:', new Date().toLocaleString());
}

// Fonction pour vérifier que l'URL est bien configurée
function checkUrl() {
  if (PRODUCTION_URL.includes('localhost') || PRODUCTION_URL.includes('example.com')) {
    console.log('🚨 ATTENTION: URL de test détectée !');
    console.log('⚠️  Remplacez PRODUCTION_URL dans ce script par votre vraie URL Vercel');
    console.log('📝 Format attendu: https://votre-projet.vercel.app');
    console.log('\n❓ Trouvez votre URL sur: https://vercel.com/dashboard');
    return false;
  }
  return true;
}

// Exécution
if (require.main === module) {
  if (checkUrl()) {
    runTests().catch(error => {
      console.error('💥 Erreur lors des tests:', error.message);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

module.exports = { runTests };
