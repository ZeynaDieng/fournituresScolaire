#!/usr/bin/env node

/**
 * Script pour identifier les problèmes avec AppPromotionCard
 */

console.log("🔍 ANALYSE DU COMPOSANT AppPromotionCard\n");

console.log("📋 DIAGNOSTIC :");
console.log(
  "1. AppPromotionCard dans index.vue utilise : airtableStore.activePromotions"
);
console.log(
  "2. Page /promotions utilise : airtableStore.activePromotions + transformation + fallback"
);
console.log("3. Les deux devraient afficher les MÊMES données Airtable");
console.log("");

console.log("🎯 PROBLÈMES POTENTIELS IDENTIFIÉS :");
console.log("");

console.log("A) DOUBLONS DANS AIRTABLE :");
console.log(
  "   - Trouvé 12 promotions avec des répétitions (4 uniques x 3 fois)"
);
console.log("   - Solution : Nettoyer Airtable pour supprimer les doublons");
console.log("");

console.log("B) DIFFÉRENCES DE DESIGN :");
console.log(
  "   - AppPromotionCard : Design moderne avec grid 2 colonnes en large"
);
console.log(
  "   - Page /promotions : Design avec grid 3 colonnes et style différent"
);
console.log("   - Différence volontaire ou problème ?");
console.log("");

console.log("C) TIMING DE CHARGEMENT :");
console.log("   - AppPromotionCard fait un fetch dans onMounted si store vide");
console.log("   - Page /promotions fait AUSSI un fetch dans onMounted");
console.log(
  "   - Possibilité de double fetch ou de données différentes selon timing"
);
console.log("");

console.log("D) FALLBACK DIFFÉRENT :");
console.log("   - AppPromotionCard : Aucun fallback visible");
console.log(
  "   - Page /promotions : Fallback hardcodé avec 6 promotions locales"
);
console.log("   - Si Airtable échoue, comportement différent");
console.log("");

console.log("🔧 SOLUTIONS RECOMMANDÉES :");
console.log("");

console.log("1. NETTOYER AIRTABLE :");
console.log("   - Supprimer les doublons (garder 4 promotions uniques)");
console.log("   - Vérifier que les champs sont cohérents");
console.log("");

console.log("2. HARMONISER LE COMPORTEMENT :");
console.log(
  "   - Utiliser le même getter partout : airtableStore.activePromotions"
);
console.log("   - Éviter les transformations différentes");
console.log("   - Gérer les fallbacks de manière cohérente");
console.log("");

console.log("3. OPTIMISER LE FETCH :");
console.log(
  "   - Centraliser le fetch des promotions (ex: dans app.vue ou plugin)"
);
console.log("   - Éviter les fetch multiples");
console.log("");

console.log("4. LOGS DE DEBUG :");
console.log(
  "   - Ajouter des console.log pour voir quand chaque composant charge"
);
console.log("   - Vérifier les données exactes utilisées par chaque vue");
console.log("");

console.log("✨ CONCLUSION :");
console.log("Les deux vues utilisent théoriquement les mêmes données.");
console.log("Les différences viennent probablement des doublons Airtable");
console.log(
  "et des designs volontairement différents entre accueil et page dédiée."
);
