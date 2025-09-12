/**
 * Test final de tous les endpoints critiques
 */

const ENDPOINTS = [
  {
    name: "API Test",
    url: "https://fournitures-scolaire.vercel.app/api/test",
    method: "GET",
  },
  {
    name: "Airtable Orders",
    url: "https://fournitures-scolaire.vercel.app/api/airtable/orders",
    method: "GET",
  },
  {
    name: "Single Order (Airtable)",
    url: "https://fournitures-scolaire.vercel.app/api/airtable/orders/CMD_1757151589937_qdhzyb4cq",
    method: "GET",
  },
  {
    name: "Order Invoice",
    url: "https://fournitures-scolaire.vercel.app/api/airtable/orders/CMD_1757151589937_qdhzyb4cq/invoice",
    method: "GET",
  },
  {
    name: "Order PDF Download",
    url: "https://fournitures-scolaire.vercel.app/api/airtable/orders/CMD_1757151589937_qdhzyb4cq/download-pdf",
    method: "GET",
  },
  {
    name: "Contact Form",
    url: "https://fournitures-scolaire.vercel.app/api/contact/send",
    method: "POST",
    body: {
      name: "Test Final",
      email: "test@example.com",
      message: "Test final endpoints",
    },
  },
  {
    name: "WhatsApp Order",
    url: "https://fournitures-scolaire.vercel.app/api/airtable/orders/whatsapp",
    method: "POST",
    body: {
      name: "Test WhatsApp",
      email: "test@wa.com",
      phone: "221782911844",
      items: ["Test item"],
      total: 1000,
    },
  },
  {
    name: "PayTech Webhook (New)",
    url: "https://fournitures-scolaire.vercel.app/api/paytech/webhook-new",
    method: "POST",
    body: {
      type_event: "sale_complete",
      ref_command: "TEST123",
      item_price: 5000,
      client_phone: "221782911844",
    },
  },
];

async function testEndpoint(endpoint) {
  try {
    const options = {
      method: endpoint.method,
      headers: { "Content-Type": "application/json" },
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(endpoint.url, options);
    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = text.substring(0, 100);
    }

    return {
      name: endpoint.name,
      status: response.status,
      success: response.status >= 200 && response.status < 400,
      result: result,
    };
  } catch (error) {
    return {
      name: endpoint.name,
      status: "ERROR",
      success: false,
      result: error.message,
    };
  }
}

async function runFinalTests() {
  console.log("🔍 TEST FINAL DE TOUS LES ENDPOINTS CRITIQUES");
  console.log("============================================");

  const results = [];

  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);

    const status = result.success ? "✅" : "❌";
    console.log(`${status} ${result.name}: ${result.status}`);

    if (!result.success) {
      console.log(`   Error: ${JSON.stringify(result.result)}`);
    }

    // Pause entre les requêtes
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n📊 RÉSUMÉ FINAL:");
  const successful = results.filter((r) => r.success).length;
  const total = results.length;

  console.log(`✅ Endpoints OK: ${successful}/${total}`);
  console.log(`❌ Endpoints KO: ${total - successful}/${total}`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log("\n🔧 ENDPOINTS À CORRIGER:");
    failed.forEach((f) => {
      console.log(`   - ${f.name} (${f.status})`);
    });
  }

  console.log("\n🎯 STATUT FINAL:");
  if (successful >= total * 0.8) {
    console.log("🟢 EXCELLENT - Site opérationnel");
  } else if (successful >= total * 0.6) {
    console.log("🟡 CORRECT - Quelques ajustements nécessaires");
  } else {
    console.log("🔴 PROBLÈMES - Corrections importantes requises");
  }
}

runFinalTests().catch(console.error);
