#!/usr/bin/env node

/**
 * Script de diagnostic rapide CORS - Sans redéploiement
 * Tests des endpoints existants sur Vercel
 */

const https = require('https');

// Configuration
const PROD_URL = 'https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app';
const TIMEOUT = 10000; // 10 secondes

// Couleurs console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const url = new URL(path, PROD_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'User-Agent': 'CORS-Test-Script/1.0',
        'Accept': 'application/json',
        'Origin': 'https://test-cors.com'
      },
      timeout: TIMEOUT
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 500) // Limiter la taille
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ 
        status: 'TIMEOUT', 
        error: `Timeout après ${TIMEOUT}ms` 
      });
    });

    req.on('error', (error) => {
      resolve({ 
        status: 'ERROR', 
        error: error.message 
      });
    });

    req.end();
  });
}

async function runDiagnostic() {
  log('blue', '🔍 DIAGNOSTIC CORS RAPIDE - SANS REDÉPLOIEMENT');
  log('blue', '='.repeat(60));
  
  const tests = [
    { name: 'Site principal', path: '/' },
    { name: 'Test endpoint', path: '/api/test' },
    { name: 'Products endpoint', path: '/api/products' },
    { name: 'Airtable products', path: '/api/airtable/products' },
    { name: 'Ping endpoint', path: '/api/ping' },
    { name: 'OPTIONS test', path: '/api/test', method: 'OPTIONS' }
  ];

  const results = [];

  for (const test of tests) {
    log('yellow', `\nTest: ${test.name} (${test.method || 'GET'}) ${test.path}`);
    
    const result = await testEndpoint(test.path, test.method);
    results.push({ ...test, result });

    if (result.status === 200) {
      log('green', `✅ SUCCESS (200)`);
      if (test.path === '/api/test' && result.body) {
        try {
          const json = JSON.parse(result.body);
          log('blue', `   Message: ${json.message}`);
          log('blue', `   Timestamp: ${json.timestamp}`);
        } catch (e) {
          log('blue', `   Body: ${result.body.substring(0, 100)}...`);
        }
      }
    } else if (result.status === 401) {
      log('red', `❌ UNAUTHORIZED (401) - CORS ou Auth problem`);
    } else if (result.status === 404) {
      log('yellow', `⚠️  NOT FOUND (404) - Endpoint manquant`);
    } else if (result.status === 500) {
      log('red', `❌ SERVER ERROR (500)`);
    } else if (result.status === 'TIMEOUT') {
      log('red', `❌ TIMEOUT - ${result.error}`);
    } else if (result.status === 'ERROR') {
      log('red', `❌ ERROR - ${result.error}`);
    } else {
      log('yellow', `⚠️  ${result.status}`);
    }

    // Vérifier les headers CORS
    if (result.headers && result.headers['access-control-allow-origin']) {
      log('green', `   ✅ CORS headers présents`);
      log('blue', `   Allow-Origin: ${result.headers['access-control-allow-origin']}`);
    } else if (result.headers) {
      log('red', `   ❌ CORS headers manquants`);
    }
  }

  // Résumé final
  log('blue', '\n' + '='.repeat(60));
  log('blue', '📊 RÉSUMÉ DU DIAGNOSTIC:');
  
  const successful = results.filter(r => r.result.status === 200);
  const unauthorized = results.filter(r => r.result.status === 401);
  const errors = results.filter(r => r.result.status >= 400);

  log('green', `✅ Succès: ${successful.length}/${results.length}`);
  log('red', `❌ Erreurs 401: ${unauthorized.length}`);
  log('yellow', `⚠️  Autres erreurs: ${errors.length - unauthorized.length}`);

  if (unauthorized.length > 0) {
    log('red', '\n🚨 PROBLÈME CORS/AUTH DÉTECTÉ:');
    log('yellow', '   1. Le middleware CORS n\'est peut-être pas activé');
    log('yellow', '   2. Vérifier que les fichiers ont été déployés');
    log('yellow', '   3. Redéployer avec: npm run deploy');
  }

  if (successful.length === results.length - 1) {
    log('green', '\n🎉 PRESQUE PARFAIT ! Un seul problème mineur');
  } else if (successful.length >= results.length / 2) {
    log('yellow', '\n⚠️  PARTIELLEMENT FONCTIONNEL');
  } else {
    log('red', '\n🚨 PROBLÈMES MAJEURS DÉTECTÉS');
  }
}

runDiagnostic().catch(console.error);
