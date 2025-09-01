// scripts/setup-supabase.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";

async function setupSupabase() {
  console.log("🔧 CONFIGURATION SUPABASE\n");

  console.log("📋 Informations reçues :");
  console.log("   Project URL: https://sigjxcnrthaxoceclmdi.supabase.co");
  console.log("   API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (fournie)");
  console.log("");

  console.log("🔍 Pour obtenir votre URL de base de données PostgreSQL :");
  console.log("");
  console.log("1️⃣ Aller sur : https://app.supabase.com/");
  console.log("2️⃣ Sélectionner votre projet");
  console.log("3️⃣ Aller dans Settings → Database");
  console.log('4️⃣ Copier l\'URL de la section "Connection string" (URI)');
  console.log("");
  console.log("📝 L'URL ressemble à :");
  console.log(
    "postgresql://postgres.sigjxcnrthaxoceclmdi:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
  );
  console.log("");
  console.log("⚠️  Remplacez [PASSWORD] par votre vrai mot de passe Supabase");
  console.log("");

  // Créer un template .env.supabase
  const supabaseEnv = `# Configuration Supabase Production
# Généré le ${new Date().toLocaleDateString("fr-FR")}

# 🗄️ BASE DE DONNÉES SUPABASE (PostgreSQL)
# Remplacez [PASSWORD] par votre mot de passe Supabase
DATABASE_URL="postgresql://postgres.sigjxcnrthaxoceclmdi:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

# 🔐 PAYTECH PRODUCTION
NUXT_PAYTECH_API_KEY="0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b"
NUXT_PAYTECH_SECRET_KEY="566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee"
NUXT_PAYTECH_SANDBOX="false"

# 🌐 VERCEL PRODUCTION
NUXT_PUBLIC_BASE_URL="https://fournitures-scolaire.vercel.app"
NUXT_PUBLIC_SITE_URL="https://fournitures-scolaire.vercel.app"
NUXT_PUBLIC_API_BASE="/api"

# 📱 PAYTECH MERCHANT ID
NUXT_PUBLIC_PAYTECH_MERCHANT_ID="VotreMerchantId"

# 🔑 SUPABASE (optionnel pour certaines fonctionnalités)
SUPABASE_URL="https://sigjxcnrthaxoceclmdi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZ2p4Y25ydGhheG9jZWNsbWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTQzNjksImV4cCI6MjA3MjMzMDM2OX0.qdJA6Yd0rNxvMkITqzq8zOHf_79FNe9sCerg74rstzg"
`;

  fs.writeFileSync(".env.supabase", supabaseEnv);
  console.log("✅ Fichier .env.supabase créé avec template");
  console.log("");

  console.log("🎯 PROCHAINES ÉTAPES :");
  console.log("");
  console.log("1️⃣ Récupérer votre URL PostgreSQL complète depuis Supabase");
  console.log("2️⃣ Mettre à jour .env.supabase avec le bon mot de passe");
  console.log("3️⃣ Tester : npm run test:supabase");
  console.log("4️⃣ Pousser le schéma : npx prisma db push");
  console.log("5️⃣ Configurer variables Vercel");
  console.log("6️⃣ Redéployer : vercel --prod");
  console.log("");

  console.log("💡 Aide :");
  console.log("   Schema Prisma déjà mis à jour pour PostgreSQL ✅");
  console.log("   Guides disponibles : SUPABASE_CONFIG.md");
}

setupSupabase();
