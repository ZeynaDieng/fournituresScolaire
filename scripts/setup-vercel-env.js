#!/usr/bin/env node

/**
 * Script pour afficher les variables d'environnement à ajouter sur Vercel
 * Utilisation: node scripts/setup-vercel-env.js
 */

console.log("🚀 CONFIGURATION VERCEL - Variables d'environnement à ajouter");
console.log("=".repeat(70));
console.log("");

console.log(
  "📋 Allez sur https://vercel.com/dashboard > Votre projet > Settings > Environment Variables"
);
console.log("");

const envVars = [
  {
    key: "DATABASE_URL",
    value:
      "postgresql://postgres.sigjxcnrthaxoceclmdi:Fekam5460@aws-1-eu-north-1.pooler.supabase.com:6543/postgres",
    environment: "Production",
    description: "URL PostgreSQL Supabase",
  },
  {
    key: "NUXT_PAYTECH_API_KEY",
    value: "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
    environment: "Production",
    description: "Clé API PayTech (privée - serveur)",
  },
  {
    key: "NUXT_PAYTECH_SECRET_KEY",
    value: "566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee",
    environment: "Production",
    description: "Clé secrète PayTech (privée - serveur)",
  },
  {
    key: "NUXT_PAYTECH_SANDBOX",
    value: "false",
    environment: "Production",
    description: "Mode PayTech (false = production)",
  },
  {
    key: "NUXT_PUBLIC_PAYTECH_API_KEY",
    value: "0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b",
    environment: "Production",
    description: "Clé API PayTech (publique - client)",
  },
  {
    key: "NUXT_PUBLIC_PAYTECH_SANDBOX",
    value: "false",
    environment: "Production",
    description: "Mode PayTech publique (false = production)",
  },
  {
    key: "NUXT_PUBLIC_BASE_URL",
    value: "https://fournitures-scolaire.vercel.app",
    environment: "Production",
    description: "URL de base du site",
  },
  {
    key: "NUXT_PUBLIC_SITE_URL",
    value: "https://fournitures-scolaire.vercel.app",
    environment: "Production",
    description: "URL publique du site",
  },
  {
    key: "NUXT_PUBLIC_API_BASE",
    value: "/api",
    environment: "Production",
    description: "Base path pour les API",
  },
  {
    key: "NUXT_PUBLIC_PAYTECH_MERCHANT_ID",
    value: "VotreMerchantId",
    environment: "Production",
    description: "⚠️  À MODIFIER - Votre vrai Merchant ID PayTech",
  },
];

console.log("📝 VARIABLES À AJOUTER UNE PAR UNE :");
console.log("-".repeat(50));

envVars.forEach((envVar, index) => {
  console.log(`\n${index + 1}. ${envVar.key}`);
  console.log(`   Valeur: ${envVar.value}`);
  console.log(`   Environnement: ${envVar.environment}`);
  console.log(`   Description: ${envVar.description}`);

  if (envVar.key === "NUXT_PUBLIC_PAYTECH_MERCHANT_ID") {
    console.log(
      '   ⚠️  IMPORTANT: Remplacez "VotreMerchantId" par votre vrai Merchant ID PayTech'
    );
  }
});

console.log("\n" + "=".repeat(70));
console.log("🔧 ÉTAPES SUIVANTES :");
console.log("1. Ajoutez toutes ces variables sur Vercel");
console.log(
  "2. Remplacez NUXT_PUBLIC_PAYTECH_MERCHANT_ID par votre vrai Merchant ID"
);
console.log('3. Redéployez le site (git push ou bouton "Redeploy" sur Vercel)');
console.log("4. Testez la configuration avec: npm run check:production");
console.log("5. Visitez https://fournitures-scolaire.vercel.app pour vérifier");
console.log("");

console.log("🔍 VÉRIFICATION RAPIDE :");
console.log(
  "- Le middleware PayTech devrait maintenant détecter la configuration"
);
console.log(
  '- Plus d\'erreur "Configuration PayTech manquante en production !"'
);
console.log("- Le flux de paiement devrait fonctionner");
console.log("");

console.log("📞 Si des erreurs persistent, lancez: npm run test:production");
