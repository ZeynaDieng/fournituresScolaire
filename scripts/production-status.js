// scripts/production-status.js
import fs from "fs";

function checkProductionStatus() {
  console.log("🚀 STATUT DÉPLOIEMENT PRODUCTION\n");

  // Vérifier les fichiers
  const files = {
    ".env.production": fs.existsSync(".env.production"),
    "DATABASE_PRODUCTION_GUIDE.md": fs.existsSync(
      "DATABASE_PRODUCTION_GUIDE.md"
    ),
    "PRODUCTION_15MIN.md": fs.existsSync("PRODUCTION_15MIN.md"),
  };

  console.log("📁 Fichiers de configuration:");
  Object.entries(files).forEach(([file, exists]) => {
    console.log(`   ${exists ? "✅" : "❌"} ${file}`);
  });

  // Lire .env.production
  if (files[".env.production"]) {
    const envProd = fs.readFileSync(".env.production", "utf8");

    console.log("\n🔐 Variables de production:");

    const hasRealDB = !envProd.includes("mysql://user:password@host/database");
    const hasPaytech = envProd.includes("NUXT_PAYTECH_API_KEY");
    const hasProdURL = envProd.includes("vercel.app");

    console.log(`   ${hasRealDB ? "✅" : "❌"} DATABASE_URL configurée`);
    console.log(`   ${hasPaytech ? "✅" : "❌"} Clés PayTech présentes`);
    console.log(`   ${hasProdURL ? "✅" : "❌"} URL de production`);

    if (!hasRealDB) {
      console.log("\n🎯 PROCHAINE ÉTAPE : Configurer la base de données");
      console.log("\n1️⃣ Créer compte PlanetScale (5 min):");
      console.log("   → https://planetscale.com/");
      console.log('   → Créer base: "edushop-prod"');
      console.log("   → Copier URL de connexion");

      console.log("\n2️⃣ Mettre à jour .env.production:");
      console.log('   → Remplacer DATABASE_URL="mysql://user:password..."');
      console.log("   → Par votre vraie URL PlanetScale");

      console.log("\n3️⃣ Tester:");
      console.log("   → npm run test:prod-db");

      console.log("\n4️⃣ Déployer:");
      console.log("   → npm install -g vercel");
      console.log("   → vercel");
    } else {
      console.log("\n✅ Configuration complète !");
      console.log("\n🚀 Prêt pour le déploiement:");
      console.log("   1. npm run test:prod-db");
      console.log("   2. vercel");
      console.log("   3. Configurer variables sur vercel.com");
      console.log("   4. vercel --prod");
    }
  }

  console.log("\n📚 Guides disponibles:");
  console.log(
    "   📖 DATABASE_PRODUCTION_GUIDE.md - Guide détaillé bases de données"
  );
  console.log("   ⚡ PRODUCTION_15MIN.md - Guide rapide 15 minutes");

  console.log("\n💡 Aide:");
  console.log("   🧪 npm run test:db - Tester base locale");
  console.log("   🌐 npm run test:prod-db - Tester base production");
  console.log("   📊 /test/payment-debug - Interface de diagnostic");
}

checkProductionStatus();
