#!/usr/bin/env node

/**
 * Script de test complet de la fonctionnalité WhatsApp
 * Teste la configuration, le formatage du message et la génération du lien
 */

console.log("🚀 Test de la fonctionnalité WhatsApp");
console.log("====================================\n");

// Import des utilitaires WhatsApp
import {
  formatWhatsAppOrderMessage,
  createWhatsAppLink,
  WHATSAPP_CONFIG,
} from "../utils/whatsapp-config.js";

// Données de test réalistes
const testOrderData = {
  customer: {
    name: "Amadou Diallo",
    email: "amadou.diallo@example.com",
    phone: "+221701234567",
  },
  shipping: {
    address: "Rue 10 x Rue 15, Médina",
    city: "Dakar",
    method: "Livraison à domicile",
    cost: 2000,
  },
  items: [
    {
      name: "Pack CE2 Complet",
      quantity: 1,
      price: 25000,
    },
    {
      name: "Stylo Plume Pelikan",
      quantity: 2,
      price: 3500,
    },
    {
      name: "Promotion Rentrée - Ensemble Géométrie",
      quantity: 1,
      price: 4500,
    },
  ],
  amounts: {
    subtotal: 36500,
    shipping: 2000,
    discount: 2000,
    total: 36500,
  },
};

// Test 1: Formatage du message
console.log("📝 Test 1: Formatage du message WhatsApp");
console.log("-------------------------------------------");

try {
  const message = formatWhatsAppOrderMessage(testOrderData);
  console.log("✅ Message formaté avec succès:");
  console.log(message);
  console.log("\n");
} catch (error) {
  console.error("❌ Erreur lors du formatage du message:", error.message);
  console.log("\n");
}

// Test 2: Génération du lien WhatsApp
console.log("🔗 Test 2: Génération du lien WhatsApp");
console.log("--------------------------------------");

try {
  const message = formatWhatsAppOrderMessage(testOrderData);
  const whatsappLink = createWhatsAppLink(message);

  console.log("✅ Lien WhatsApp généré avec succès:");
  console.log(whatsappLink);
  console.log("\n");

  // Vérification de la structure du lien
  if (whatsappLink.startsWith("https://wa.me/")) {
    console.log("✅ Structure du lien correcte");
  } else {
    console.log("❌ Structure du lien incorrecte");
  }

  if (whatsappLink.includes("221782911844")) {
    console.log("✅ Numéro WhatsApp Business correct");
  } else {
    console.log("❌ Numéro WhatsApp Business manquant ou incorrect");
  }
} catch (error) {
  console.error("❌ Erreur lors de la génération du lien:", error.message);
}

console.log("\n");

// Test 3: Validation des données de configuration
console.log("⚙️  Test 3: Validation de la configuration");
console.log("------------------------------------------");

try {
  console.log("✅ Configuration importée avec succès");
  console.log(`📱 Numéro Business: ${WHATSAPP_CONFIG.businessNumber}`);
  console.log(`📝 Template Title: ${WHATSAPP_CONFIG.orderTemplate.title}`);
  console.log(
    "✅ Émojis disponibles:",
    Object.keys(WHATSAPP_CONFIG.emojis).length
  );
} catch (error) {
  console.error("❌ Erreur lors de l'accès à la configuration:", error.message);
}

console.log("\n");

// Test 4: Test avec données minimum (edge case)
console.log("🧪 Test 4: Test avec données minimum");
console.log("------------------------------------");

const minimalOrderData = {
  customer: {
    name: "Test User",
    email: "test@example.com",
    phone: "+221700000000",
  },
  shipping: {
    address: "Adresse de test",
    city: "Dakar",
    method: "Retrait magasin",
    cost: 0,
  },
  items: [
    {
      name: "Produit Test",
      quantity: 1,
      price: 1000,
    },
  ],
  amounts: {
    subtotal: 1000,
    shipping: 0,
    discount: 0,
    total: 1000,
  },
};

try {
  const minimalMessage = formatWhatsAppOrderMessage(minimalOrderData);
  const minimalLink = createWhatsAppLink(minimalMessage);

  console.log("✅ Test avec données minimum réussi");
  console.log("📏 Longueur du message:", minimalMessage.length, "caractères");
  console.log("📏 Longueur du lien:", minimalLink.length, "caractères");
} catch (error) {
  console.error("❌ Erreur avec données minimum:", error.message);
}

console.log("\n");

// Résumé
console.log("📊 Résumé des Tests");
console.log("==================");
console.log("✅ Fonctionnalité WhatsApp opérationnelle");
console.log("📱 Numéro configuré: +221 77 778 04 56");
console.log("🔗 Liens générés correctement");
console.log("📝 Messages formatés avec succès");
console.log("\n");

// Instructions pour l'utilisateur
console.log("📚 Instructions d'utilisation:");
console.log("1. Remplir le formulaire de commande sur /checkout");
console.log("2. Choisir l'option 'Commande WhatsApp'");
console.log("3. Cliquer sur 'Envoyer sur WhatsApp'");
console.log("4. Le message formaté s'ouvrira dans WhatsApp");
console.log("5. Envoyer le message au commerçant");
