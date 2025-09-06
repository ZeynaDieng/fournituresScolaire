#!/usr/bin/env node

/**
 * Checklist post-déploiement
 * À exécuter une fois que Vercel a terminé le build
 */

console.log("✅ Checklist Post-Déploiement");
console.log("=============================\n");

console.log("🎯 Une fois que Vercel affiche 'Build Completed' et donne l'URL:");
console.log(
  "================================================================\n"
);

const postDeploymentChecks = [
  {
    category: "🌐 Accès de base",
    checks: [
      "□ Site accessible via l'URL Vercel",
      "□ Page d'accueil se charge correctement",
      "□ Navigation fonctionne",
      "□ Images s'affichent",
      "□ CSS/styles appliqués",
    ],
  },
  {
    category: "🛒 Fonctionnalités e-commerce",
    checks: [
      "□ Produits s'affichent depuis Airtable",
      "□ Packs se chargent correctement",
      "□ Promotions visibles sur la page d'accueil",
      "□ Témoignages s'affichent",
      "□ Ajout au panier fonctionne",
      "□ Page checkout accessible",
    ],
  },
  {
    category: "📱 WhatsApp (CRITIQUE)",
    checks: [
      "□ Option WhatsApp visible dans checkout",
      "□ Formulaire de commande fonctionnel",
      "□ Validation des champs active",
      "□ Bouton 'Envoyer sur WhatsApp' présent",
      "□ Clic sur le bouton génère le lien WhatsApp",
      "□ Message WhatsApp bien formaté",
      "□ Numéro +221777780456 correct dans l'URL",
      "□ Redirection vers page de succès",
    ],
  },
  {
    category: "🔌 API Endpoints",
    checks: [
      "□ /api/airtable/products retourne des données",
      "□ /api/airtable/packs fonctionne",
      "□ /api/airtable/promotions répond",
      "□ /api/airtable/testimonials accessible",
      "□ /api/status retourne OK",
    ],
  },
  {
    category: "⚙️ Configuration technique",
    checks: [
      "□ Variables d'environnement configurées",
      "□ HTTPS activé automatiquement",
      "□ Compression gzip active",
      "□ Headers de sécurité présents",
    ],
  },
];

postDeploymentChecks.forEach(({ category, checks }) => {
  console.log(category);
  console.log("-".repeat(category.length));
  checks.forEach((check) => console.log(`   ${check}`));
  console.log("");
});

console.log("🚨 Test prioritaire WhatsApp:");
console.log("=============================");
console.log("1. Aller sur https://votre-site.vercel.app/checkout");
console.log("2. Remplir le formulaire avec ces données test:");
console.log("   • Nom: Test Deployment");
console.log("   • Email: test@example.com");
console.log("   • Téléphone: +221 70 123 45 67");
console.log("   • Adresse: Test Address, Dakar");
console.log("3. Cliquer 'Envoyer sur WhatsApp'");
console.log("4. Vérifier que le lien commence par:");
console.log("   https://wa.me/221777780456?text=...");
console.log("5. Vérifier le contenu du message\n");

console.log("🔧 Si des problèmes surviennent:");
console.log("=================================");
console.log("❌ Site ne se charge pas:");
console.log("   → Vérifier les logs Vercel");
console.log("   → Checker les erreurs de build");
console.log("   → Redéployer si nécessaire");
console.log("");
console.log("❌ API ne répond pas:");
console.log("   → Vérifier les variables d'environnement");
console.log("   → Tester la connectivité Airtable");
console.log("   → Vérifier les clés API");
console.log("");
console.log("❌ WhatsApp ne fonctionne pas:");
console.log("   → Vérifier WHATSAPP_BUSINESS_NUMBER");
console.log("   → Tester en local d'abord");
console.log("   → Vérifier la console pour les erreurs JS");

console.log("\n💡 URLs importantes à tester:");
console.log("============================");
console.log("🏠 Accueil: https://votre-site.vercel.app/");
console.log("🛍️  Produits: https://votre-site.vercel.app/products");
console.log("📦 Packs: https://votre-site.vercel.app/packs");
console.log("🏷️  Promotions: https://votre-site.vercel.app/promotions");
console.log("🛒 Checkout: https://votre-site.vercel.app/checkout");
console.log("📊 API Status: https://votre-site.vercel.app/api/status");

console.log("\n📞 Test WhatsApp complet:");
console.log("=========================");
console.log(
  "curl 'https://votre-site.vercel.app/api/airtable/products' | head -20"
);
console.log("# Doit retourner des données JSON des produits");

console.log("\n🎉 Une fois tous les checks validés:");
console.log("===================================");
console.log("✅ Votre site EduShop Sénégal est opérationnel !");
console.log("📱 WhatsApp fonctionne pour les commandes");
console.log("🛒 E-commerce totalement dynamique avec Airtable");
console.log("🚀 Prêt pour la production !");

console.log("\n📈 Prochaines étapes recommandées:");
console.log("==================================");
console.log("1. Configurer un domaine personnalisé");
console.log("2. Ajouter Google Analytics");
console.log("3. Configurer les notifications par email");
console.log("4. Tester avec de vrais clients");
console.log("5. Optimiser le SEO");

console.log("\n🎊 Félicitations pour votre déploiement !");
