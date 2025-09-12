<!-- pages/admin/contact.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Messages de Contact
            </h1>
            <p class="text-gray-600 mt-2">
              Gérer les messages reçus via le formulaire de contact
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="refreshMessages"
              :disabled="loading"
              class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg
                v-if="!loading"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <div
                v-else
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Messages</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ messages.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En Attente</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ pendingCount }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Traités</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ processedCount }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Cette Semaine</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ thisWeekCount }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages List -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Messages Récents</h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <div
              class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3"
            ></div>
            Chargement des messages...
          </div>
        </div>

        <div
          v-else-if="messages.length === 0"
          class="p-8 text-center text-gray-500"
        >
          <p>Aucun message trouvé.</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="message in messages"
            :key="message.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ message.name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        message.status === 'Nouveau',
                      'bg-blue-100 text-blue-800':
                        message.status === 'En cours',
                      'bg-green-100 text-green-800':
                        message.status === 'Traité',
                    }"
                  >
                    {{ message.status }}
                  </span>
                </div>

                <div class="text-sm text-gray-600 mb-2">
                  <div class="flex items-center gap-4">
                    <span>📧 {{ message.email }}</span>
                    <span v-if="message.phone">📞 {{ message.phone }}</span>
                    <span>📅 {{ formatDate(message.date) }}</span>
                  </div>
                </div>

                <div class="mb-3">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {{ getSubjectLabel(message.subject) }}
                  </span>
                </div>

                <div class="text-gray-800 bg-gray-50 p-4 rounded-lg">
                  <p class="whitespace-pre-wrap">{{ message.message }}</p>
                </div>
              </div>

              <div class="ml-6 flex flex-col gap-2">
                <button
                  @click="replyToMessage(message)"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm"
                >
                  Répondre
                </button>

                <button
                  v-if="!message.processed"
                  @click="markAsProcessed(message)"
                  class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                >
                  Marquer traité
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

import { ref, computed, onMounted } from "vue";

// État
const loading = ref(false);
const messages = ref([]);

// Computed
const pendingCount = computed(
  () =>
    messages.value.filter((m) => m.status === "Nouveau" || !m.processed).length
);

const processedCount = computed(
  () => messages.value.filter((m) => m.processed).length
);

const thisWeekCount = computed(() => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return messages.value.filter((m) => {
    const messageDate = new Date(m.date);
    return messageDate >= oneWeekAgo;
  }).length;
});

// Méthodes
async function fetchMessages() {
  loading.value = true;
  try {
    const response = await $fetch("/api/contact/messages");
    if (response.success) {
      messages.value = response.data;
    } else {
      console.error("Erreur:", response.error);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
  } finally {
    loading.value = false;
  }
}

function refreshMessages() {
  fetchMessages();
}

function formatDate(dateString) {
  if (!dateString) return "Date inconnue";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

function getSubjectLabel(subject) {
  const subjects = {
    commande: "📦 Question sur une commande",
    produit: "🛍️ Information produit",
    livraison: "🚚 Livraison",
    partenariat: "🤝 Partenariat",
    autre: "💬 Autre",
  };

  return subjects[subject] || subject;
}

function replyToMessage(message) {
  // Créer un lien mailto avec les informations pré-remplies
  const subject = `Re: ${message.subject}`;
  const body = `Bonjour ${message.name},\n\nMerci pour votre message.\n\n\n\n---\nMessage original:\n${message.message}`;

  const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink);
}

function markAsProcessed(message) {
  // TODO: Implémenter la mise à jour du statut dans Airtable
  console.log("Marquer comme traité:", message.id);
  // Mettre à jour localement en attendant
  message.processed = true;
  message.status = "Traité";
}

// Lifecycle
onMounted(() => {
  fetchMessages();
});

// Meta
useHead({
  title: "Administration - Messages de Contact",
});
</script>
