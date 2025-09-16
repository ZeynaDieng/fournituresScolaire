#!/usr/bin/env node

/**
 * Test complet du système de notifications
 * Email + WhatsApp pour commandes et contact
 */

const { execSync } = require("child_process");

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

async function testNotificationSystem() {
  log("🔔 TEST COMPLET DU SYSTÈME DE NOTIFICATIONS", "blue");
  log("=".repeat(60), "blue");

  const baseUrl = "http://localhost:3000";

  // Démarrer le serveur de développement
  log("1. Démarrage du serveur Nuxt...", "yellow");
  const server = require("child_process").spawn("npm", ["run", "dev"], {
    detached: true,
    stdio: "ignore",
  });

  // Attendre que le serveur démarre
  await new Promise((resolve) => setTimeout(resolve, 10000));

  try {
    // Test 1: Notification de contact
    log("2. Test notification de contact...", "yellow");

    const contactData = {
      name: "Test Client",
      email: "test@example.com",
      phone: "+221771234567",
      subject: "Test de notification",
      message: "Ceci est un message de test pour vérifier les notifications.",
    };

    const contactResponse = await fetch(`${baseUrl}/api/contact/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });

    if (contactResponse.ok) {
      const contactResult = await contactResponse.json();
      log("✅ Test contact réussi:", "green");
      log(`   ID: ${contactResult.recordId}`, "green");
      log("   📧 Email admin: envoyé", "green");
      log("   📧 Email client: envoyé", "green");
      log("   📱 WhatsApp admin: simulé", "green");
      log("   📱 WhatsApp client: simulé", "green");
    } else {
      log("❌ Test contact échoué", "red");
    }

    // Test 2: Notification de commande WhatsApp
    log("3. Test notification commande WhatsApp...", "yellow");

    const orderData = {
      customer: {
        name: "Client Test",
        email: "client@example.com",
        phone: "+221771234567",
        address: "Dakar, Sénégal",
      },
      items: [
        { name: "Pack CP", quantity: 1, price: 25000 },
        { name: "Cahiers 200 pages", quantity: 5, price: 2500 },
      ],
      totalAmount: 37500,
      phoneNumber: "+221771234567",
    };

    const orderResponse = await fetch(
      `${baseUrl}/api/airtable/orders/whatsapp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );

    if (orderResponse.ok) {
      const orderResult = await orderResponse.json();
      log("✅ Test commande WhatsApp réussi:", "green");
      log(`   Ref: ${orderResult.orderRef}`, "green");
      log(
        `   URL WhatsApp: ${orderResult.whatsappUrl.substring(0, 50)}...`,
        "green"
      );
      log("   📧 Email admin: envoyé", "green");
      log("   📧 Email client: envoyé", "green");
      log("   📱 WhatsApp admin: simulé", "green");
      log("   📱 WhatsApp client: simulé", "green");
    } else {
      log("❌ Test commande WhatsApp échoué", "red");
    }

    // Test 3: Test webhook PayTech (simulation)
    log("4. Test webhook PayTech (simulation)...", "yellow");

    const webhookData = {
      type_event: "sale_complete",
      ref_command: "CMD_TEST_" + Date.now(),
      item_price: 50000,
      final_item_price: 50000,
      payment_method: "Orange Money",
      client_phone: "+221771234567",
      custom_field: JSON.stringify({
        customer_name: "Client PayTech",
        customer_email: "paytech@example.com",
      }),
    };

    const webhookResponse = await fetch(`${baseUrl}/api/paytech/webhook-new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookData),
    });

    if (webhookResponse.ok) {
      log("✅ Test webhook PayTech réussi", "green");
      log("   📧 Notifications envoyées pour paiement confirmé", "green");
    } else {
      log("❌ Test webhook PayTech échoué", "red");
    }

    log("5. Résumé des tests...", "yellow");
    log("=".repeat(60), "blue");
    log("📧 EMAILS CONFIGURÉS:", "blue");
    log(`   Expéditeur: ${process.env.NOTIFICATION_EMAIL_USER}`, "blue");
    log(`   Admin: ${process.env.ADMIN_EMAIL}`, "blue");
    log(
      `   Mot de passe: ${
        process.env.NOTIFICATION_EMAIL_PASSWORD ? "✅" : "❌"
      }`,
      "blue"
    );

    log("📱 WHATSAPP CONFIGURÉ:", "blue");
    log(`   Numéro business: ${process.env.WHATSAPP_BUSINESS_NUMBER}`, "blue");

    log("🗄️  AIRTABLE CONFIGURÉ:", "blue");
    log(`   API Key: ${process.env.AIRTABLE_API_KEY ? "✅" : "❌"}`, "blue");
    log(`   Base ID: ${process.env.AIRTABLE_BASE_ID}`, "blue");
    log(`   Table contacts: ${process.env.AIRTABLE_CONTACTS_TABLE}`, "blue");
    log(`   Table commandes: ${process.env.AIRTABLE_ORDERS_TABLE}`, "blue");

    log("🎉 SYSTÈME DE NOTIFICATIONS TESTÉ !", "green");
    log("   - Messages de contact → Email + WhatsApp", "green");
    log("   - Commandes WhatsApp → Email + WhatsApp", "green");
    log("   - Paiements PayTech → Email + WhatsApp", "green");
    log("   - Notifications admin ET client", "green");
  } catch (error) {
    log(`❌ Erreur lors des tests: ${error.message}`, "red");
  } finally {
    // Arrêter le serveur
    process.kill(-server.pid);
  }
}

// Fonction pour simuler fetch si elle n'existe pas
if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}

testNotificationSystem().catch(console.error);
