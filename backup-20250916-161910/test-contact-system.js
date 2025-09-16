#!/usr/bin/env node

/**
 * Script pour tester le système de contact
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

async function testContactSystem() {
  log("🧪 TEST DU SYSTÈME DE CONTACT", "blue");
  log("=".repeat(50), "blue");

  const testUrl =
    "https://fournitures-scolaire-n2vw845gq-pa-assanes-projects.vercel.app";

  try {
    // Test 1: Envoyer un message de test
    log("1. Test d'envoi de message...", "yellow");

    const testMessage = {
      name: "Test User",
      email: "test@example.com",
      phone: "+221123456789",
      subject: "autre",
      message:
        "Ceci est un message de test automatique envoyé le " +
        new Date().toLocaleString(),
    };

    const curlCommand = `curl -X POST "${testUrl}/api/contact/send" \\
      -H "Content-Type: application/json" \\
      -d '${JSON.stringify(testMessage)}' \\
      -w "HTTPSTATUS:%{http_code}" \\
      -s`;

    const response = execSync(curlCommand, { encoding: "utf8" });
    const httpCode = response.match(/HTTPSTATUS:(\d+)$/)?.[1];
    const body = response.replace(/HTTPSTATUS:\d+$/, "");

    if (httpCode === "200") {
      log("✅ Envoi de message: SUCCÈS", "green");
      try {
        const parsed = JSON.parse(body);
        if (parsed.success) {
          log(
            `   📧 Message enregistré avec ID: ${parsed.recordId || "N/A"}`,
            "green"
          );
        }
      } catch {
        log("   ⚠️  Réponse reçue mais format inattendu", "yellow");
      }
    } else {
      log(`❌ Envoi de message: ÉCHEC (${httpCode})`, "red");
      log(`   Réponse: ${body}`, "red");
    }

    // Test 2: Récupérer les messages
    log("2. Test de récupération des messages...", "yellow");

    const getResponse = execSync(
      `curl -s -w "HTTPSTATUS:%{http_code}" "${testUrl}/api/contact/messages"`,
      { encoding: "utf8" }
    );
    const getHttpCode = getResponse.match(/HTTPSTATUS:(\d+)$/)?.[1];
    const getBody = getResponse.replace(/HTTPSTATUS:\d+$/, "");

    if (getHttpCode === "200") {
      log("✅ Récupération des messages: SUCCÈS", "green");
      try {
        const parsed = JSON.parse(getBody);
        if (parsed.success) {
          log(
            `   📊 Nombre de messages trouvés: ${parsed.count || 0}`,
            "green"
          );
        }
      } catch {
        log("   ⚠️  Réponse reçue mais format inattendu", "yellow");
      }
    } else {
      log(`❌ Récupération des messages: ÉCHEC (${getHttpCode})`, "red");
      log(`   Réponse: ${getBody}`, "red");
    }

    // Test 3: Test de la page contact
    log("3. Test de la page contact...", "yellow");

    const pageResponse = execSync(
      `curl -s -w "HTTPSTATUS:%{http_code}" "${testUrl}/contact"`,
      { encoding: "utf8" }
    );
    const pageHttpCode = pageResponse.match(/HTTPSTATUS:(\d+)$/)?.[1];

    if (pageHttpCode === "200") {
      log("✅ Page contact: ACCESSIBLE", "green");
    } else {
      log(`❌ Page contact: INACCESSIBLE (${pageHttpCode})`, "red");
    }

    // Test 4: Test de la page admin contact
    log("4. Test de la page admin contact...", "yellow");

    const adminResponse = execSync(
      `curl -s -w "HTTPSTATUS:%{http_code}" "${testUrl}/admin/contact"`,
      { encoding: "utf8" }
    );
    const adminHttpCode = adminResponse.match(/HTTPSTATUS:(\d+)$/)?.[1];

    if (adminHttpCode === "200") {
      log("✅ Page admin contact: ACCESSIBLE", "green");
    } else {
      log(`❌ Page admin contact: INACCESSIBLE (${adminHttpCode})`, "red");
    }

    log("\n📋 RÉSUMÉ:", "blue");
    log("=".repeat(30), "blue");
    log(`- Envoi message: ${httpCode === "200" ? "✅" : "❌"}`, "blue");
    log(`- Récupération: ${getHttpCode === "200" ? "✅" : "❌"}`, "blue");
    log(`- Page contact: ${pageHttpCode === "200" ? "✅" : "❌"}`, "blue");
    log(`- Page admin: ${adminHttpCode === "200" ? "✅" : "❌"}`, "blue");

    if (httpCode === "200" && getHttpCode === "200") {
      log("\n🎉 SYSTÈME DE CONTACT FONCTIONNEL!", "green");
      log("\nLes messages sont maintenant enregistrés dans Airtable", "green");
      log("Consultez-les sur: " + testUrl + "/admin/contact", "green");
    } else {
      log("\n⚠️  PROBLÈMES DÉTECTÉS", "yellow");
      log(
        "Vérifiez la configuration Airtable et les variables d'environnement",
        "yellow"
      );
    }
  } catch (error) {
    log(`💥 ERREUR: ${error.message}`, "red");
  }
}

testContactSystem();
