#!/usr/bin/env node

/**
 * Script pour générer toutes les variables d'environnement à configurer dans Vercel
 */

const fs = require("fs");
const path = require("path");

function generateVercelVars() {
  const NEW_URL =
    "https://fournitures-scolaire-5grcy526c-pa-assanes-projects.vercel.app";

  console.log("🔧 VARIABLES D'ENVIRONNEMENT POUR VERCEL");
  console.log("=".repeat(60));
  console.log("📋 COPIEZ ET COLLEZ CES VARIABLES DANS LE DASHBOARD VERCEL:");
  console.log(
    "   https://vercel.com/pa-assanes-projects/fournitures-scolaire/settings/environment-variables"
  );
  console.log("=".repeat(60));

  const variables = [
    // PayTech
    "PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
    "PAYTECH_SECRET_KEY=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
    "PAYTECH_SANDBOX=true",

    // Google Sheets
    "GOOGLE_SHEET_ID=1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0",
    "GOOGLE_SHEETS_API_KEY=AIzaSyAc7pdCISf_pyi65pmnVU-RTc6KMFcORis",

    // WhatsApp
    "WHATSAPP_BUSINESS_NUMBER=221777780456",

    // Email
    "NOTIFICATION_EMAIL_USER=zeynash1@gmail.com",
    "NOTIFICATION_EMAIL_PASSWORD=zmruomypjxrjxfto",
    "ADMIN_EMAIL=zeynash1@gmail.com",
    "FROM_NAME=Fournitures Scolaires",

    // URLs (NOUVELLES)
    `BASE_URL=${NEW_URL}`,
    `NUXT_PUBLIC_SITE_URL=${NEW_URL}`,
    "NUXT_PUBLIC_API_BASE=/api",
    `NUXT_PUBLIC_BASE_URL=${NEW_URL}`,
    "NUXT_PUBLIC_PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
    "NUXT_PUBLIC_PAYTECH_API_SECRET=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
    "NUXT_PUBLIC_PAYTECH_MERCHANT_ID=VotreMerchantId",

    // Database (optionnel car pas utilisé sur Vercel)
    "DATABASE_URL=mysql://root:root@127.0.0.1:8889/fourniturescolaire",

    // Airtable
    "AIRTABLE_API_KEY=patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a",
    "AIRTABLE_BASE_ID=appOtYkVavA4MMMnN",
    "AIRTABLE_PRODUCTS_TABLE=tblxGbcySHadDtsyn",
    "AIRTABLE_PACKS_TABLE=tbl4JVykOdi6YFvfd",
    "AIRTABLE_ORDERS_TABLE=tblIx2zvrcz1VY7xb",
    "AIRTABLE_PROMOTIONS_TABLE=tblrUYgl2PgYIEMY5",
    "AIRTABLE_TESTIMONIALS_TABLE=tblYjfi1FFk1CCH46",
  ];

  // Afficher les variables
  variables.forEach((variable, index) => {
    console.log(`${index + 1}. ${variable}`);
  });

  // Sauvegarder dans un fichier
  const content = variables.join("\n");
  fs.writeFileSync("vercel-env-vars-final.txt", content);

  console.log("=".repeat(60));
  console.log("✅ Variables sauvegardées dans: vercel-env-vars-final.txt");
  console.log("");
  console.log("🚀 PROCHAINES ÉTAPES:");
  console.log(
    "1. Aller sur: https://vercel.com/pa-assanes-projects/fournitures-scolaire/settings/environment-variables"
  );
  console.log("2. Ajouter chaque variable une par une");
  console.log("3. Redéployer avec: vercel --prod");
  console.log("4. Tester avec: node scripts/test-final-paytech.js");

  // Créer aussi le script de test final
  const testScript = `#!/usr/bin/env node

/**
 * Test final de l'endpoint PayTech après configuration des variables
 */

const fetch = require('node-fetch');

async function testFinalPaytech() {
  const BASE_URL = '${NEW_URL}';
  
  console.log('🧪 TEST FINAL PAYTECH');
  console.log('=' + '='.repeat(40));
  
  // Test 1: Site principal
  try {
    const siteResponse = await fetch(BASE_URL);
    console.log('📱 Site principal:', siteResponse.status, siteResponse.statusText);
  } catch (e) {
    console.log('❌ Site principal:', e.message);
  }
  
  // Test 2: API Test
  try {
    const testResponse = await fetch(BASE_URL + '/api/test');
    console.log('🔧 API Test:', testResponse.status, testResponse.statusText);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('   Response:', testData.message);
    }
  } catch (e) {
    console.log('❌ API Test:', e.message);
  }
  
  // Test 3: PayTech Initiate
  const testData = {
    amount: 1000,
    currency: 'XOF',
    target_payment: 'Wave',
    customer: {
      name: 'Test User',
      email: 'test@example.com', 
      phone: '777777777'
    }
  };
  
  try {
    const paytechResponse = await fetch(BASE_URL + '/api/paytech/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('💳 PayTech Initiate:', paytechResponse.status, paytechResponse.statusText);
    
    if (paytechResponse.ok) {
      const result = await paytechResponse.json();
      console.log('✅ PayTech fonctionne ! URL de paiement générée');
      console.log('   Redirect URL:', result.redirect_url || 'Présente');
    } else {
      const error = await paytechResponse.text();
      console.log('❌ Erreur PayTech:', error.substring(0, 200) + '...');
    }
  } catch (e) {
    console.log('❌ PayTech Error:', e.message);
  }
}

testFinalPaytech();`;

  fs.writeFileSync("scripts/test-final-paytech.js", testScript);
  console.log("5. Script de test créé: scripts/test-final-paytech.js");
}

generateVercelVars();
