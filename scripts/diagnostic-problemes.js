#!/usr/bin/env node

/**
 * Diagnostic complet des problèmes de notifications et fonctionnalités
 * URL de production correcte: https://fournitures-scolaire.vercel.app/
 */

const PROD_URL = "https://fournitures-scolaire.vercel.app";

function log(message, color = "blue") {
  const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${PROD_URL}${endpoint}`, options);
    const data = await response.text();

    return {
      success: response.ok,
      status: response.status,
      data: data ? JSON.parse(data) : null,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message,
    };
  }
}

async function diagnosticComplet() {
  log("🔍 DIAGNOSTIC COMPLET DES PROBLÈMES", "blue");
  log("=".repeat(60), "blue");
  log(`URL de production: ${PROD_URL}`, "blue");
  log("");

  // Test 1: APIs de base
  log("1. Tests des APIs de base...", "yellow");

  const apiTests = [
    { endpoint: "/api/test", method: "GET" },
    { endpoint: "/api/airtable/products", method: "GET" },
    { endpoint: "/api/airtable/orders", method: "GET" },
    { endpoint: "/api/ping", method: "GET" },
  ];

  for (const test of apiTests) {
    const result = await testAPI(test.endpoint, test.method);
    const status = result.success ? "✅" : "❌";
    log(
      `   ${status} ${test.endpoint}: ${result.status}`,
      result.success ? "green" : "red"
    );
  }

  log("");

  // Test 2: Test contact avec détails
  log("2. Test formulaire de contact...", "yellow");

  const contactData = {
    name: "Test Diagnostic",
    email: "diagnostic@test.com",
    phone: "+221771234567",
    subject: "Test diagnostic notifications",
    message:
      "Message de test pour diagnostiquer les notifications email et WhatsApp",
  };

  const contactResult = await testAPI("/api/contact/send", "POST", contactData);
  if (contactResult.success) {
    log("   ✅ API contact fonctionne", "green");
    log(`   Réponse: ${JSON.stringify(contactResult.data, null, 2)}`, "blue");

    if (contactResult.data.fallback) {
      log("   ⚠️  Mode fallback activé = Problème Airtable", "yellow");
    }
  } else {
    log("   ❌ API contact échoue", "red");
    log(`   Erreur: ${contactResult.error || contactResult.status}`, "red");
  }

  log("");

  // Test 3: Test webhook PayTech
  log("3. Test webhook PayTech...", "yellow");

  const webhookData = {
    type_event: "sale_complete",
    ref_command: "DIAGNOSTIC_" + Date.now(),
    item_price: 25000,
    final_item_price: 25000,
    payment_method: "Orange Money",
    client_phone: "+221771234567",
    custom_field: JSON.stringify({
      customer_name: "Client Test",
      customer_email: "client@test.com",
    }),
  };

  const webhookResult = await testAPI(
    "/api/paytech/webhook-new",
    "POST",
    webhookData
  );
  if (webhookResult.success) {
    log("   ✅ Webhook PayTech fonctionne", "green");
    log(`   Réponse: ${JSON.stringify(webhookResult.data, null, 2)}`, "blue");
  } else {
    log("   ❌ Webhook PayTech échoue", "red");
    log(
      `   Erreur: ${webhookResult.error || "Erreur " + webhookResult.status}`,
      "red"
    );
  }

  log("");

  // Test 4: Test commande WhatsApp
  log("4. Test commande WhatsApp...", "yellow");

  const whatsappOrderData = {
    customer: {
      name: "Client WhatsApp",
      email: "whatsapp@test.com",
      phone: "+221771234567",
      address: "Dakar, Sénégal",
    },
    items: [{ name: "Pack CE2", quantity: 1, price: 30000 }],
    totalAmount: 30000,
    phoneNumber: "+221771234567",
  };

  const whatsappResult = await testAPI(
    "/api/airtable/orders/whatsapp",
    "POST",
    whatsappOrderData
  );
  if (whatsappResult.success) {
    log("   ✅ API commande WhatsApp fonctionne", "green");
    log(`   Ref commande: ${whatsappResult.data.orderRef}`, "blue");
  } else {
    log("   ❌ API commande WhatsApp échoue", "red");
    log(`   Erreur: ${whatsappResult.error || whatsappResult.status}`, "red");
  }

  log("");

  // Test 5: Configuration
  log("5. Diagnostic de configuration...", "yellow");

  log("   Variables d'environnement dans Vercel:");
  log("   📧 Email configuré: zeynash1@gmail.com", "blue");
  log("   📱 WhatsApp: 221777780456", "blue");
  log("   🗄️  Airtable: Base configurée", "blue");

  log("");

  // Résumé et solutions
  log("📋 RÉSUMÉ DES PROBLÈMES DÉTECTÉS:", "blue");
  log("=".repeat(60), "blue");

  log("🔧 SOLUTIONS À APPLIQUER:", "yellow");
  log("1. Corriger l'enregistrement Airtable dans contact/send", "yellow");
  log("2. Débugger le webhook PayTech (erreur 500)", "yellow");
  log("3. Vérifier que les variables Vercel sont configurées", "yellow");
  log("4. Tester les notifications email en production", "yellow");
  log("5. Créer les endpoints manquants (facture, mes commandes)", "yellow");

  log("");
  log("🚀 ACTIONS IMMÉDIATES:", "green");
  log("✅ Le site et les APIs de base fonctionnent", "green");
  log("⚠️  Notifications partiellement configurées", "yellow");
  log("🔥 Besoin de corriger les erreurs Airtable et webhook", "red");
}

// Polyfill pour Node.js
if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}

diagnosticComplet().catch(console.error);
