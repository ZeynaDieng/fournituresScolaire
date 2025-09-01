// Script de débogage pour le bouton "Valider la commande"
// À coller dans la console du navigateur

console.log("🔍 Débogage du bouton 'Valider la commande'");

// 1. Vérifier si le bouton existe
const button =
  document.querySelector('button:contains("Valider la commande")') ||
  document.querySelector('[href="/checkout"]') ||
  Array.from(document.querySelectorAll("button")).find((btn) =>
    btn.textContent.includes("Valider la commande")
  );

if (button) {
  console.log("✅ Bouton trouvé:", button);
  console.log("📋 Classes CSS:", button.className);
  console.log("🔒 Désactivé?", button.disabled);
  console.log(
    "🖱️ Event listeners:",
    getEventListeners ? getEventListeners(button) : "Non disponible"
  );
} else {
  console.log("❌ Bouton 'Valider la commande' non trouvé");
}

// 2. Vérifier l'état du panier
console.log("\n🛒 État du panier:");
const cartStore =
  window.__NUXT__?.vueApp?.config?.globalProperties?.$pinia?.state?.value?.cart;
if (cartStore) {
  console.log("📦 Articles dans le panier:", cartStore.items?.length || 0);
  console.log("💰 Total:", cartStore.total || 0);
  console.log("🏪 Panier ouvert:", cartStore.isOpen);
} else {
  console.log("❌ Store du panier non accessible");
}

// 3. Vérifier si le panier est visible
const cartSidebar = document.querySelector(
  '[class*="fixed"][class*="inset-0"]'
);
if (cartSidebar) {
  console.log("✅ Sidebar du panier trouvée");
  console.log(
    "👁️ Visible?",
    window.getComputedStyle(cartSidebar).display !== "none"
  );
} else {
  console.log("❌ Sidebar du panier non trouvée");
}

// 4. Forcer l'ouverture du panier pour tester
console.log("\n🧪 Test d'ouverture du panier...");
const cartIcon =
  document.querySelector('[class*="cart"]') ||
  document.querySelector('svg[viewBox*="24 24"]');
if (cartIcon) {
  console.log("🖱️ Clic sur l'icône du panier...");
  cartIcon.click();
}
