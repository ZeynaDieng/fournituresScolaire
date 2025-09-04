<!-- /pages/config-email.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold mb-6">📧 Configuration Email Gmail</h1>

        <div class="space-y-6">
          <!-- Instructions -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-yellow-800 mb-4">
              ⚠️ Configuration Requise
            </h2>
            <p class="text-yellow-700 mb-4">
              Votre configuration email utilise un mot de passe standard. Pour
              Gmail, vous devez utiliser un "Mot de passe d'application".
            </p>

            <ol class="list-decimal list-inside space-y-2 text-yellow-700">
              <li><strong>Connectez-vous à votre compte Gmail</strong></li>
              <li>
                <strong>Activez l'authentification à 2 facteurs</strong> (si pas
                encore fait)
              </li>
              <li>
                <strong>Allez dans "Gestion du compte Google"</strong> →
                "Sécurité"
              </li>
              <li>
                <strong>Cherchez "Mots de passe d'application"</strong> et
                cliquez dessus
              </li>
              <li>
                <strong>Sélectionnez "Mail"</strong> et générez un mot de passe
              </li>
              <li>
                <strong>Copiez ce mot de passe</strong> (16 caractères) et
                remplacez dans le .env
              </li>
            </ol>
          </div>

          <!-- Configuration actuelle -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">
              ⚙️ Configuration Actuelle
            </h3>
            <div class="space-y-2 font-mono text-sm">
              <div>
                <strong>NOTIFICATION_EMAIL_USER:</strong> zeynash1@gmail.com ✅
              </div>
              <div>
                <strong>NOTIFICATION_EMAIL_PASSWORD:</strong>
                YOUR_GMAIL_APP_PASSWORD_HERE ❌
              </div>
              <div><strong>ADMIN_EMAIL:</strong> zeynash1@gmail.com ✅</div>
              <div><strong>FROM_NAME:</strong> Fournitures Scolaires ✅</div>
            </div>
          </div>

          <!-- Test email -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-800 mb-4">
              🧪 Test d'Envoi Email
            </h3>
            <p class="text-blue-700 mb-4">
              Une fois la configuration Gmail terminée, testez l'envoi d'email :
            </p>

            <button
              @click="testEmail"
              :disabled="testing"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {{ testing ? "📧 Envoi en cours..." : "📧 Tester l'Envoi Email" }}
            </button>

            <div
              v-if="testResult"
              class="mt-4 p-4 rounded-lg"
              :class="
                testResult.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              <strong
                >{{ testResult.success ? "✅ Succès" : "❌ Erreur" }}:</strong
              >
              {{ testResult.message }}
            </div>
          </div>

          <!-- Exemple de fichier .env -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">
              📋 Exemple de Configuration .env
            </h3>
            <pre
              class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"
            >
# Configuration Email Notifications
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=abcd efgh ijkl mnop  # Mot de passe d'application Gmail (16 caractères)
ADMIN_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires</pre
            >

            <p class="text-gray-600 text-sm mt-2">
              ⚠️ Remplacez <code>abcd efgh ijkl mnop</code> par votre vrai mot
              de passe d'application Gmail
            </p>
          </div>

          <!-- Alternative sans Gmail -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-purple-800 mb-4">
              🔄 Alternative Temporaire
            </h3>
            <p class="text-purple-700 mb-4">
              En attendant la configuration Gmail, le système fonctionne déjà
              parfaitement :
            </p>

            <ul class="list-disc list-inside space-y-2 text-purple-700">
              <li>
                <strong>✅ Stockage local</strong> - Toutes les commandes sont
                sauvegardées
              </li>
              <li>
                <strong>✅ Interface de gestion</strong> - Vous pouvez consulter
                les commandes
              </li>
              <li>
                <strong>✅ Export CSV</strong> - Pour traiter les commandes
              </li>
              <li>
                <strong>⏳ Notifications email</strong> - En attente de
                configuration Gmail
              </li>
            </ul>

            <div class="mt-4 space-x-4">
              <NuxtLink
                to="/commandes-simple"
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg inline-block"
              >
                📦 Voir les Commandes
              </NuxtLink>

              <button
                @click="createTestOrder"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                🧪 Créer Commande Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const testing = ref(false);
const testResult = ref(null);

const testEmail = async () => {
  testing.value = true;
  testResult.value = null;

  try {
    const response = await $fetch("/api/test/create-order", { method: "POST" });

    if (response.success && response.emailSent) {
      testResult.value = {
        success: true,
        message: `Email envoyé avec succès pour la commande ${response.orderRef} !`,
      };
    } else if (response.success && !response.emailSent) {
      testResult.value = {
        success: false,
        message: `Commande créée mais email échoué: ${
          response.emailError || "Configuration Gmail incorrecte"
        }`,
      };
    } else {
      testResult.value = {
        success: false,
        message: "Erreur lors de la création de la commande test",
      };
    }
  } catch (error) {
    console.error("Erreur test email:", error);
    testResult.value = {
      success: false,
      message: "Erreur de communication avec le serveur",
    };
  } finally {
    testing.value = false;
  }
};

const createTestOrder = async () => {
  try {
    const response = await $fetch("/api/test/create-order", { method: "POST" });
    if (response.success) {
      await navigateTo("/commandes-simple");
    }
  } catch (error) {
    console.error("Erreur création commande:", error);
  }
};
</script>
