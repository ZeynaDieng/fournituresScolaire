/**
 * Script de vérification post-déploiement
 */

const API_BASE_URL = "https://fournitures-scolaire.vercel.app/api";

const ENDPOINTS_TO_CHECK = [
  { path: "/test", expectedStatus: 200 },
  { path: "/ping", expectedStatus: 200 },
  { path: "/airtable/products", expectedStatus: 200 },
  { path: "/airtable/orders", expectedStatus: 200 },
  { path: "/orders", expectedStatus: [200, 404] },
  { path: "/orders/TEST123", expectedStatus: [404, 500] },
  { path: "/orders/TEST123/invoice", expectedStatus: [404, 500] },
  { path: "/orders/TEST123/download-pdf", expectedStatus: [404, 500] },
  {
    path: "/contact/send",
    method: "POST",
    body: { name: "Test", email: "test@test.com", message: "Test" },
    expectedStatus: [200, 400],
  },
];

async function checkEndpoint(endpoint) {
  try {
    const options = {
      method: endpoint.method || "GET",
      headers: { "Content-Type": "application/json" },
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint.path}`, options);
    const expectedStatuses = Array.isArray(endpoint.expectedStatus)
      ? endpoint.expectedStatus
      : [endpoint.expectedStatus];

    const isExpected = expectedStatuses.includes(response.status);
    const status = isExpected ? "✅" : "❌";

    console.log(
      `${status} ${endpoint.method || "GET"} ${endpoint.path}: ${
        response.status
      } ${isExpected ? "(OK)" : "(UNEXPECTED)"}`
    );

    return {
      endpoint: endpoint.path,
      status: response.status,
      success: isExpected,
    };
  } catch (error) {
    console.log(
      `❌ ${endpoint.method || "GET"} ${endpoint.path}: ERROR - ${
        error.message
      }`
    );
    return { endpoint: endpoint.path, status: "ERROR", success: false };
  }
}

async function main() {
  console.log("🔍 VÉRIFICATION POST-DÉPLOIEMENT");
  console.log("===============================");
  console.log(`Base URL: ${API_BASE_URL}`);
  console.log("");

  const results = [];

  for (const endpoint of ENDPOINTS_TO_CHECK) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Pause entre les requêtes
  }

  console.log("");
  console.log("📋 RÉSUMÉ");
  console.log("=========");

  const successful = results.filter((r) => r.success).length;
  const total = results.length;

  console.log(`✅ Endpoints OK: ${successful}/${total}`);
  console.log(`❌ Endpoints KO: ${total - successful}/${total}`);

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log("");
    console.log("🔧 ENDPOINTS À CORRIGER:");
    failed.forEach((f) => {
      console.log(`   - ${f.endpoint} (Status: ${f.status})`);
    });
  }

  console.log("");
  console.log("🎯 PROCHAINES ÉTAPES:");
  if (
    failed.some((f) => f.endpoint.includes("/orders") && f.status === "ERROR")
  ) {
    console.log("   1. Vérifier le déploiement des routes /orders sur Vercel");
    console.log("   2. Rebuild et redéployer si nécessaire");
  }
  if (failed.some((f) => f.endpoint.includes("webhook"))) {
    console.log("   3. Corriger le webhook PayTech");
  }
  if (failed.some((f) => f.endpoint.includes("contact"))) {
    console.log("   4. Vérifier l'enregistrement Airtable pour les contacts");
  }
}

main().catch(console.error);
