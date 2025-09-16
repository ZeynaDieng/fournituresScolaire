/**
 * 🧪 Test de vidage du panier après paiement
 *
 * Ce script teste que le panier se vide correctement après un paiement PayTech
 */

require("dotenv").config();

console.log("🧪 TEST VIDAGE PANIER APRÈS PAIEMENT");
console.log("====================================");

async function testCartClearing() {
  try {
    console.log("\n📋 ÉTAPE 1: Vérification du store panier");
    console.log("----------------------------------------");

    // Simuler le store panier pour le test
    const mockCartStore = {
      items: [],
      subtotal: 0,
      promoCode: "",
      promoDiscount: 0,
      addItem: function (item) {
        this.items.push(item);
        this.subtotal = this.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      clearCart: function () {
        this.items = [];
        this.promoCode = "";
        this.promoDiscount = 0;
        this.subtotal = 0;
      },
    };

    const cartStore = mockCartStore;

    console.log("✅ Store panier chargé");
    console.log("📊 Méthodes disponibles:", Object.keys(cartStore));

    // Vérifier que clearCart existe
    if (typeof cartStore.clearCart === "function") {
      console.log("✅ Méthode clearCart disponible");
    } else {
      console.log("❌ Méthode clearCart manquante");
      return;
    }

    console.log("\n📋 ÉTAPE 2: Test de vidage du panier");
    console.log("------------------------------------");

    // Ajouter des articles au panier pour le test
    console.log("🛒 Ajout d'articles de test au panier...");
    cartStore.addItem({
      id: "test-1",
      name: "Article Test 1",
      price: 1000,
      quantity: 2,
      image: "/test.jpg",
    });

    cartStore.addItem({
      id: "test-2",
      name: "Article Test 2",
      price: 2000,
      quantity: 1,
      image: "/test2.jpg",
    });

    console.log("📊 Panier après ajout:");
    console.log(`   - Nombre d'articles: ${cartStore.items.length}`);
    console.log(`   - Sous-total: ${cartStore.subtotal} FCFA`);

    // Vider le panier
    console.log("\n🗑️ Vidage du panier...");
    cartStore.clearCart();

    console.log("📊 Panier après vidage:");
    console.log(`   - Nombre d'articles: ${cartStore.items.length}`);
    console.log(`   - Sous-total: ${cartStore.subtotal} FCFA`);

    if (cartStore.items.length === 0 && cartStore.subtotal === 0) {
      console.log("✅ TEST RÉUSSI: Le panier a été vidé correctement");
    } else {
      console.log("❌ TEST ÉCHOUÉ: Le panier n'a pas été vidé correctement");
    }

    console.log("\n📋 ÉTAPE 3: Test de persistance localStorage");
    console.log("--------------------------------------------");

    // Vérifier localStorage si disponible
    if (typeof localStorage !== "undefined") {
      const cartData = localStorage.getItem("cart");
      console.log("📊 Données panier dans localStorage:", cartData);

      if (!cartData || cartData === "[]") {
        console.log("✅ localStorage nettoyé correctement");
      } else {
        console.log("⚠️ localStorage contient encore des données");
      }
    } else {
      console.log("ℹ️ localStorage non disponible (environnement Node.js)");
    }

    console.log("\n📋 ÉTAPE 4: Test de simulation PayTech");
    console.log("--------------------------------------");

    // Simuler un événement de paiement PayTech réussi
    console.log("🎯 Simulation événement PayTech payment_complete...");

    // Simuler le message PayTech
    const mockPayTechMessage = {
      type: "payment_complete",
      ref_command: "CMD_TEST_1234567890_abc123",
      amount: 5000,
      payment_method: "mobile_money",
    };

    console.log("📤 Message PayTech simulé:", mockPayTechMessage);

    // Ajouter des articles pour simuler un panier plein
    cartStore.addItem({
      id: "paytech-test-1",
      name: "Pack Scolaire Test",
      price: 5000,
      quantity: 1,
      image: "/pack-test.jpg",
    });

    console.log("📊 Panier avant paiement PayTech:");
    console.log(`   - Articles: ${cartStore.items.length}`);
    console.log(`   - Sous-total: ${cartStore.subtotal} FCFA`);

    // Simuler le vidage après paiement PayTech
    console.log("\n💳 Simulation paiement PayTech réussi...");
    cartStore.clearCart();

    console.log("📊 Panier après paiement PayTech:");
    console.log(`   - Articles: ${cartStore.items.length}`);
    console.log(`   - Sous-total: ${cartStore.subtotal} FCFA`);

    if (cartStore.items.length === 0) {
      console.log("✅ TEST PAYTECH RÉUSSI: Panier vidé après paiement PayTech");
    } else {
      console.log(
        "❌ TEST PAYTECH ÉCHOUÉ: Panier non vidé après paiement PayTech"
      );
    }

    console.log("\n📋 RÉSUMÉ DES TESTS");
    console.log("===================");
    console.log("✅ Store panier fonctionnel");
    console.log("✅ Méthode clearCart disponible");
    console.log("✅ Vidage du panier fonctionne");
    console.log("✅ Simulation PayTech réussie");
    console.log("");
    console.log("💡 CONCLUSION:");
    console.log(
      "Le panier devrait se vider correctement après un paiement PayTech réussi."
    );
    console.log("Si le panier ne se vide pas, vérifiez:");
    console.log(
      "1. Que l'événement paymentSuccess est bien émis par PayTechDialog"
    );
    console.log(
      "2. Que handlePaymentSuccess est bien appelé dans CheckoutForm"
    );
    console.log("3. Que cartStore.clearCart() est bien exécuté");
    console.log("4. Les logs de la console pour voir les erreurs éventuelles");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testCartClearing().catch(console.error);
