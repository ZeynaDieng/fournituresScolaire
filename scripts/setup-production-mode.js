#!/usr/bin/env node

// Script pour configurer PayTech en mode production

const fs = require("fs");
const path = require("path");

console.log("🚀 Configuration PayTech en mode PRODUCTION...\n");

// Contenu du fichier .env pour la production
const envContent = `# Configuration Email (REQUIS)
EMAIL_SERVICE=gmail
EMAIL_USER=zeynash1@gmail.com
EMAIL_PASSWORD=zmruomypjxrjxfto
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=gion kziz jxvc izsu
ADMIN_EMAIL=zeynash1@gmail.com
FROM_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires

# Configuration SMTP (Optionnel mais recommandé)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_PASS=zmruomypjxrjxfto

# Configuration Airtable (REQUIS)
AIRTABLE_API_KEY=patvDhKsKBJRGRXnx.3d8b4b9d8e2f4c1e9a7b3f5d8c2e6a9b4f7c1d5e8a2b6c9f3d7e1a4b8c5f2e9a6d3b7c
AIRTABLE_BASE_ID=appNfAqzPEZYgkBvL
AIRTABLE_PRODUCTS_TABLE=tblJFcp2ORo8vM5gN
AIRTABLE_PACKS_TABLE=tblPmR3GlHkJ9YfKs
AIRTABLE_ORDERS_TABLE=tblWx8YvNm2KqR5Ht
AIRTABLE_USERS_TABLE=tblJFcp2ORo8vM5gN

# Configuration PayTech (PRODUCTION)
NODE_ENV=production
PAYTECH_SANDBOX=false
PAYTECH_API_KEY=VOTRE_CLE_API_PRODUCTION_PAYTECH
PAYTECH_SECRET_KEY=VOTRE_CLE_SECRETE_PRODUCTION_PAYTECH

# Configuration WhatsApp
WHATSAPP_BUSINESS_NUMBER=221777780456

# Configuration Site
BASE_URL=https://www.e-du.shop
NUXT_PUBLIC_SITE_URL=https://www.e-du.shop
`;

// Chemin du fichier .env
const envPath = path.join(process.cwd(), ".env");

try {
  // Écrire le fichier .env
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Fichier .env créé avec la configuration de production");

  console.log("\n🔧 Configuration appliquée :");
  console.log("   ✅ NODE_ENV=production");
  console.log("   ✅ PAYTECH_SANDBOX=false");
  console.log("   ✅ Toutes les autres variables conservées");

  console.log("\n⚠️  IMPORTANT - Actions requises :");
  console.log(
    '   1. 🔑 Remplacez "VOTRE_CLE_API_PRODUCTION_PAYTECH" par votre vraie clé API PayTech de production'
  );
  console.log(
    '   2. 🔐 Remplacez "VOTRE_CLE_SECRETE_PRODUCTION_PAYTECH" par votre vraie clé secrète PayTech de production'
  );
  console.log(
    "   3. 🔄 Redémarrez votre serveur de développement (npm run dev)"
  );
  console.log(
    "   4. 🧪 Testez avec une vraie carte bancaire (les transactions seront réelles)"
  );

  console.log("\n📋 Variables Vercel à configurer :");
  console.log("   NODE_ENV=production");
  console.log("   PAYTECH_SANDBOX=false");
  console.log("   PAYTECH_API_KEY=votre-vraie-cle-production");
  console.log("   PAYTECH_SECRET_KEY=votre-vraie-cle-secrete-production");

  console.log("\n⚠️  ATTENTION :");
  console.log("   🚨 En mode production, les transactions seront RÉELLES");
  console.log("   💳 L'argent sera effectivement débité des cartes");
  console.log("   🛡️  Testez d'abord en mode sandbox si vous n'êtes pas sûr");

  console.log("\n✨ Configuration terminée !");
} catch (error) {
  console.error(
    "❌ Erreur lors de la création du fichier .env:",
    error.message
  );

  console.log("\n📝 Configuration manuelle requise :");
  console.log(
    "   Créez un fichier .env dans la racine du projet avec ce contenu :"
  );
  console.log("\n" + envContent);
}
