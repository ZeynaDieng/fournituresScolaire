<template>
  <div class="container">
    <h1>🔍 API Health Check</h1>
    <p>
      Test des endpoints API pour diagnostiquer les problèmes de production.
    </p>

    <div id="status" class="status info">
      <strong>Status:</strong> {{ statusMessage }}
    </div>

    <div>
      <h3>Tests disponibles:</h3>
      <button @click="testEndpoint('/api/status', 'GET')" class="btn">
        Test API Status
      </button>
      <button @click="testEndpoint('/api/test-simple', 'GET')" class="btn">
        Test Simple GET
      </button>
      <button @click="testEndpoint('/api/test-whatsapp', 'POST')" class="btn">
        Test WhatsApp POST
      </button>
      <button
        @click="testEndpoint('/api/orders/create-pending', 'POST')"
        class="btn"
      >
        Test WhatsApp Order
      </button>
      <button @click="clearResults()" class="btn">Clear Results</button>
    </div>

    <div v-if="results.length > 0" class="results">
      <div v-for="(result, index) in results" :key="index" class="result-item">
        <h4>{{ result.method }} {{ result.url }}</h4>
        <div :class="['status', result.success ? 'success' : 'error']">
          <strong>Status:</strong> {{ result.status }} {{ result.statusText }}
        </div>
        <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const statusMessage = ref("Prêt pour les tests");
const results = ref([]);

async function testEndpoint(url, method = "GET") {
  statusMessage.value = `Testing ${method} ${url}...`;

  try {
    let options = { method };

    if (method === "POST") {
      options.headers = { "Content-Type": "application/json" };

      if (url.includes("create-pending")) {
        options.body = JSON.stringify({
          customer: {
            name: "Test User",
            phone: "221123456789",
            email: "test@example.com",
          },
          items: [{ name: "Test Product", quantity: 1, price: 1000 }],
          amounts: { total: 1000, subtotal: 1000, shipping: 0 },
          shipping: { method: "Standard", address: "Test Address" },
        });
      } else {
        options.body = JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    const response = await fetch(url, options);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawResponse: text };
    }

    const result = {
      method,
      url,
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      },
    };

    results.value.unshift(result);

    statusMessage.value = response.ok
      ? `Success - ${response.status} ${response.statusText}`
      : `Error - ${response.status} ${response.statusText}`;
  } catch (error) {
    const result = {
      method,
      url,
      success: false,
      status: 0,
      statusText: "Network Error",
      data: { error: error.message, stack: error.stack },
    };

    results.value.unshift(result);
    statusMessage.value = `Network Error - ${error.message}`;
  }
}

function clearResults() {
  results.value = [];
  statusMessage.value = "Prêt pour les tests";
}

// Test automatically on load
onMounted(() => {
  setTimeout(() => testEndpoint("/api/status", "GET"), 1000);
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.status {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.btn {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: #f8f9fa;
  border-radius: 4px;
}

.btn:hover {
  background: #e9ecef;
}

.results {
  margin-top: 20px;
}

.result-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
