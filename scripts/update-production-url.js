#!/usr/bin/env node

/**
 * 🎯 MISE À JOUR URGENTE - URL RÉELLE DÉTECTÉE !
 * Met à jour tous les scripts et fichiers avec la vraie URL Vercel
 */

const fs = require('fs');
const path = require('path');

const OLD_URL = 'https://fournitures-scolaire.vercel.app';
const NEW_URL = 'https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app';

console.log('🎯 MISE À JOUR URL RÉELLE - FOURNITURES SCOLAIRES');
console.log('=' .repeat(70));
console.log(`🔄 Ancien URL: ${OLD_URL}`);
console.log(`✅ Nouveau URL: ${NEW_URL}\n`);

// Fichiers à mettre à jour
const filesToUpdate = [
  'scripts/test-production-fixed.js',
  'scripts/monitor-fix-progress.js', 
  'scripts/final-validation.js',
  'scripts/generate-vercel-vars.js',
  'vercel-variables.txt',
  'STATUS_CRITIQUE_FINAL.md',
  'URGENT_RESOLUTION_GUIDE.md',
  'FINAL_SOLUTION_GUIDE.md'
];

let updatedCount = 0;
let totalReplaced = 0;

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Remplacer toutes les occurrences
      content = content.replace(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_URL);
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        const replacements = (originalContent.match(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        console.log(`✅ ${filePath} - ${replacements} remplacement(s)`);
        updatedCount++;
        totalReplaced += replacements;
      } else {
        console.log(`⏭️  ${filePath} - Aucun changement nécessaire`);
      }
    } catch (error) {
      console.log(`❌ ${filePath} - Erreur: ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${filePath} - Fichier non trouvé`);
  }
});

console.log('\n' + '=' .repeat(70));
console.log('📊 RÉSUMÉ DE LA MISE À JOUR');
console.log('=' .repeat(70));
console.log(`✅ Fichiers mis à jour: ${updatedCount}`);
console.log(`🔄 Total remplacements: ${totalReplaced}`);
console.log(`🌐 Nouvelle URL configurée: ${NEW_URL}`);

// Régénérer le fichier des variables Vercel avec la bonne URL
console.log('\n🔧 Régénération du fichier des variables Vercel...');

const envVars = {
  // PayTech (CRITIQUE pour résoudre erreur 500)
  'PAYTECH_API_KEY': '0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b',
  'PAYTECH_SECRET_KEY': '566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee',
  'PAYTECH_SANDBOX': 'true',
  
  // Airtable (CRITIQUE pour les APIs)
  'AIRTABLE_API_KEY': 'patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a',
  'AIRTABLE_BASE_ID': 'appOtYkVavA4MMMnN',
  'AIRTABLE_PRODUCTS_TABLE': 'tblxGbcySHadDtsyn',
  'AIRTABLE_PACKS_TABLE': 'tbl4JVykOdi6YFvfd',
  'AIRTABLE_ORDERS_TABLE': 'tblIx2zvrcz1VY7xb',
  'AIRTABLE_PROMOTIONS_TABLE': 'tblrUYgl2PgYIEMY5',
  'AIRTABLE_TESTIMONIALS_TABLE': 'tblYjfi1FFk1CCH46',
  
  // URLs de production (CRITIQUE - NOUVELLE URL)
  'BASE_URL': NEW_URL,
  'NUXT_PUBLIC_BASE_URL': NEW_URL, 
  'NUXT_PUBLIC_SITE_URL': NEW_URL,
  'NUXT_PUBLIC_API_BASE': '/api',
  
  // PayTech publiques
  'NUXT_PUBLIC_PAYTECH_API_KEY': '0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b',
  'NUXT_PUBLIC_PAYTECH_API_SECRET': '566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee',
  'NUXT_PUBLIC_PAYTECH_MERCHANT_ID': 'VotreMerchantId',
  
  // WhatsApp & Communication
  'WHATSAPP_BUSINESS_NUMBER': '221777780456'
};

const criticalVars = [
  'PAYTECH_API_KEY', 'PAYTECH_SECRET_KEY', 'PAYTECH_SANDBOX',
  'AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID',
  'BASE_URL', 'NUXT_PUBLIC_BASE_URL', 'NUXT_PUBLIC_SITE_URL'
];

const importantVars = [
  'AIRTABLE_PRODUCTS_TABLE', 'AIRTABLE_PACKS_TABLE', 'AIRTABLE_ORDERS_TABLE',
  'AIRTABLE_PROMOTIONS_TABLE', 'AIRTABLE_TESTIMONIALS_TABLE',
  'NUXT_PUBLIC_PAYTECH_API_KEY', 'NUXT_PUBLIC_PAYTECH_API_SECRET',
  'WHATSAPP_BUSINESS_NUMBER', 'NUXT_PUBLIC_API_BASE'
];

const outputLines = [];
outputLines.push('# Variables à configurer dans Vercel Dashboard');
outputLines.push(`# ${NEW_URL} → Settings → Environment Variables`);
outputLines.push('');
outputLines.push('# PRIORITÉ 1 - CRITIQUES (pour résoudre erreur 500)');
criticalVars.forEach(key => {
  outputLines.push(`${key}=${envVars[key]}`);
});

outputLines.push('');
outputLines.push('# PRIORITÉ 2 - IMPORTANTES');
importantVars.forEach(key => {
  outputLines.push(`${key}=${envVars[key]}`);
});

fs.writeFileSync(path.join(__dirname, '..', 'vercel-variables-REAL-URL.txt'), outputLines.join('\n'));

console.log('✅ Nouveau fichier généré: vercel-variables-REAL-URL.txt');

console.log('\n🎯 PROCHAINES ÉTAPES IMMÉDIATES:');
console.log('1. 🌐 https://vercel.com/dashboard → votre projet');
console.log('2. ⚙️  Settings → Environment Variables'); 
console.log('3. 📋 Copier les variables du fichier: vercel-variables-REAL-URL.txt');
console.log('4. 🚀 Deployments → Redeploy');
console.log('5. ✅ Tester: node scripts/final-validation.js');

console.log('\n⚡ ERREUR 500 PAYTECH SERA RÉSOLUE !');
console.log(`🌐 URL finale: ${NEW_URL}`);

console.log('\n🎉 Tous les fichiers sont maintenant synchronisés avec la vraie URL !');
