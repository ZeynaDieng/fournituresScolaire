#!/usr/bin/env node

/**
 * Script pour corriger les erreurs de production identifiées
 * 1. Erreur 500 sur /api/paytech/initiate (variables d'environnement manquantes)
 * 2. Erreur 404 sur default.png (chemin ou déploiement)
 * 3. Configuration des variables d'environnement Vercel
 */

console.log("🔧 Correction des erreurs de production...\n");

// 1. Vérifier les variables d'environnement locales
console.log("1️⃣ Vérification des variables d'environnement locales:");
const requiredEnvVars = [
  "PAYTECH_API_KEY",
  "PAYTECH_SECRET_KEY",
  "PAYTECH_SANDBOX",
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "NUXT_PUBLIC_BASE_URL",
  "NUXT_PUBLIC_WHATSAPP_NUMBER",
  "DATABASE_URL",
];

const missingVars = [];
const presentVars = [];

requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    presentVars.push(varName);
    console.log(
      `   ✅ ${varName}: ${
        varName.includes("KEY") ? "[MASQUÉ]" : process.env[varName]
      }`
    );
  } else {
    missingVars.push(varName);
    console.log(`   ❌ ${varName}: NON DÉFINIE`);
  }
});

console.log(
  `\n📊 Résumé: ${presentVars.length}/${requiredEnvVars.length} variables définies`
);

if (missingVars.length > 0) {
  console.log("\n🚨 Variables manquantes à configurer dans Vercel:");
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
}

// 2. Vérifier la structure des images
console.log("\n2️⃣ Vérification des images:");
const fs = require("fs");
const path = require("path");

const paymentImagesDir = path.join(process.cwd(), "public/images/payment");
console.log(`   📁 Dossier: ${paymentImagesDir}`);

if (fs.existsSync(paymentImagesDir)) {
  const files = fs.readdirSync(paymentImagesDir);
  console.log(`   📸 Images trouvées (${files.length}):`);
  files.forEach((file) => {
    const filePath = path.join(paymentImagesDir, file);
    const stats = fs.statSync(filePath);
    console.log(`      - ${file} (${Math.round(stats.size / 1024)}KB)`);
  });
} else {
  console.log("   ❌ Dossier images/payment non trouvé");
}

// 3. Générer le guide de configuration Vercel
console.log("\n3️⃣ Génération du guide de configuration Vercel...");

const vercelConfigGuide = `# 🚀 Configuration des Variables d'Environnement Vercel

## Variables à configurer dans Vercel Dashboard

### 1. PayTech (Paiement)
\`\`\`
PAYTECH_API_KEY=your_paytech_api_key_here
PAYTECH_SECRET_KEY=your_paytech_secret_key_here
PAYTECH_SANDBOX=true
\`\`\`

### 2. Airtable (Base de données)
\`\`\`
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
\`\`\`

### 3. Application
\`\`\`
NUXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
NUXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
NUXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number_here
DATABASE_URL=your_database_connection_string_here
\`\`\`

## 📋 Étapes de Configuration

1. **Aller sur Vercel Dashboard**
   - Connectez-vous à https://vercel.com
   - Sélectionnez votre projet

2. **Accéder aux Variables d'Environnement**
   - Onglet "Settings"
   - Section "Environment Variables"

3. **Ajouter chaque variable**
   - Nom: PAYTECH_API_KEY
   - Valeur: [votre clé API PayTech]
   - Environnement: Production, Preview, Development

4. **Redéployer après configuration**
   - Onglet "Deployments"
   - Bouton "Redeploy" sur le dernier déploiement

## 🔧 Variables Critiques Manquantes

${
  missingVars.length > 0
    ? missingVars.map((v) => `- ${v}`).join("\n")
    : "Aucune variable manquante détectée localement"
}

## 🌐 URLs de Test Après Configuration

- Site principal: https://your-app.vercel.app
- Test PayTech: https://your-app.vercel.app/checkout
- Test API: https://your-app.vercel.app/api/paytech/initiate (POST)
- Images: https://your-app.vercel.app/images/payment/default.png
`;

fs.writeFileSync("VERCEL_CONFIG_GUIDE.md", vercelConfigGuide);
console.log("   ✅ Guide sauvegardé: VERCEL_CONFIG_GUIDE.md");

// 4. Créer un script de test des endpoints
console.log("\n4️⃣ Création du script de test des endpoints...");

const testScript = `#!/usr/bin/env node

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
      
      console.log(\`\${result} \${test.name}: \${status} (\${test.url})\`);
      
      if (status !== test.expectedStatus) {
        console.log(\`   Attendu: \${test.expectedStatus}, Reçu: \${status}\`);
      }
    } catch (error) {
      console.log(\`❌ \${test.name}: ERREUR - \${error.message}\`);
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  testEndpoints().catch(console.error);
}

module.exports = { testEndpoints };
`;

fs.writeFileSync("scripts/test-production-endpoints.js", testScript);
fs.chmodSync("scripts/test-production-endpoints.js", "755");
console.log("   ✅ Script de test créé: scripts/test-production-endpoints.js");

// 5. Résumé des actions
console.log("\n📋 RÉSUMÉ DES ACTIONS REQUISES:");
console.log("\n🔧 Actions Immédiates:");
console.log(
  "1. Configurer les variables d'environnement dans Vercel Dashboard"
);
console.log("2. Redéployer l'application après configuration");
console.log("3. Tester les endpoints avec le script de test");

console.log("\n📁 Fichiers Générés:");
console.log("- VERCEL_CONFIG_GUIDE.md (guide de configuration)");
console.log("- scripts/test-production-endpoints.js (script de test)");

console.log("\n🌐 Prochaines Étapes:");
console.log("1. Ouvrir https://vercel.com et configurer les variables");
console.log("2. Redéployer depuis l'interface Vercel");
console.log("3. Exécuter: node scripts/test-production-endpoints.js");

console.log("\n✨ Une fois configuré, votre site sera 100% opérationnel !");
