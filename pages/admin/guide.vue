<!-- /pages/admin/guide.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          📚 Guide du Système de Gestion des Commandes
        </h1>
        <p class="mt-2 text-gray-600">
          Découvrez toutes les fonctionnalités de votre système de gestion
        </p>
      </div>

      <!-- Fonctionnalités principales -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-medium text-gray-900">
            ✨ Fonctionnalités Disponibles
          </h2>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Stockage Local Automatique
                </h3>
                <p class="text-gray-600">
                  Toutes vos commandes sont automatiquement sauvegardées
                  localement dans des fichiers JSON, même sans connexion
                  Internet.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Fichier Excel Maître
                </h3>
                <p class="text-gray-600">
                  Un fichier Excel stylisé et unique se met à jour
                  automatiquement à chaque commande et changement de statut.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Mise à Jour des Statuts
                </h3>
                <p class="text-gray-600">
                  Interface simple pour modifier le statut des commandes et
                  l'état des paiements en temps réel.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Notifications Email
                </h3>
                <p class="text-gray-600">
                  Envoi automatique d'un email avec le fichier Excel en pièce
                  jointe à chaque nouvelle commande.
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Synchronisation Google Sheets (Optionnelle)
                </h3>
                <p class="text-gray-600">
                  Synchronisez toutes vos commandes avec un Google Sheet pour un
                  accès collaboratif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comment utiliser -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-medium text-gray-900">
            🚀 Comment Utiliser le Système
          </h2>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                1. Réception des Commandes
              </h3>
              <p class="text-gray-600 mb-2">
                Les commandes arrivent automatiquement via :
              </p>
              <ul class="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  Votre site web (formulaire de contact, panier e-commerce)
                </li>
                <li>API WhatsApp Business (pour les commandes par message)</li>
                <li>Toute autre source connectée à votre API</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                2. Gestion des Statuts
              </h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <p class="text-gray-700 mb-2">
                  Utilisez le
                  <NuxtLink
                    to="/admin/dashboard"
                    class="text-blue-600 hover:underline"
                    >tableau de bord admin</NuxtLink
                  >
                  pour :
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-1">
                  <li>Saisir la référence de commande (ex: WA-1234567890)</li>
                  <li>
                    Changer le statut : En attente → Confirmée → Expédiée →
                    Livrée
                  </li>
                  <li>Mettre à jour l'état du paiement : En attente → Payé</li>
                  <li>Ajouter des notes administratives</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                3. Export et Sauvegarde
              </h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <ul class="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    📊 **Fichier Excel** : Téléchargeable à tout moment depuis
                    le dashboard
                  </li>
                  <li>
                    📧 **Email automatique** : Reçu à chaque nouvelle commande
                  </li>
                  <li>
                    🔄 **Google Sheets** : Synchronisation manuelle ou
                    automatique
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Google Sheets -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-medium text-gray-900">
            ⚙️ Configuration Google Sheets (Optionnelle)
          </h2>
        </div>
        <div class="px-6 py-4">
          <div class="bg-orange-50 p-4 rounded-md mb-4">
            <div class="flex">
              <svg
                class="w-5 h-5 text-orange-400 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-orange-800">
                  Le système fonctionne parfaitement sans Google Sheets
                </h3>
                <p class="text-sm text-orange-700 mt-1">
                  Cette étape est optionnelle et pour un usage collaboratif
                  seulement.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center">
              <span
                class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >1</span
              >
              <p class="ml-3 text-gray-700">
                Aller sur
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                  >Google Cloud Console</a
                >
              </p>
            </div>

            <div class="flex items-center">
              <span
                class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >2</span
              >
              <p class="ml-3 text-gray-700">
                Créer un projet et activer l'API Google Sheets
              </p>
            </div>

            <div class="flex items-center">
              <span
                class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >3</span
              >
              <p class="ml-3 text-gray-700">
                Créer une API Key dans "APIs & Services > Credentials"
              </p>
            </div>

            <div class="flex items-center">
              <span
                class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >4</span
              >
              <p class="ml-3 text-gray-700">
                Créer un nouveau Google Sheet et récupérer l'ID dans l'URL
              </p>
            </div>

            <div class="flex items-center">
              <span
                class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >5</span
              >
              <p class="ml-3 text-gray-700">
                Mettre à jour votre fichier
                <code class="bg-gray-200 px-1 rounded">.env</code>
              </p>
            </div>
          </div>

          <div class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-md">
            <pre class="text-sm">
GOOGLE_SHEET_ID=1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0
GOOGLE_SHEETS_API_KEY=votre_api_key_ici</pre
            >
          </div>
        </div>
      </div>

      <!-- Statuts disponibles -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-medium text-gray-900">
            📋 Statuts Disponibles
          </h2>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Statuts de Commande
              </h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">En attente</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Confirmée</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">En préparation</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Expédiée</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Livrée</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Annulée</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Statuts de Paiement
              </h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">En attente</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Payé</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Remboursé</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span class="text-gray-700">Annulé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div
        class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow"
      >
        <div class="px-6 py-4">
          <h2 class="text-xl font-medium text-white mb-4">🚀 Accès Rapide</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NuxtLink
              to="/admin/dashboard"
              class="flex items-center justify-center px-4 py-3 bg-white bg-opacity-20 backdrop-blur rounded-md text-white hover:bg-opacity-30 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                />
              </svg>
              Tableau de Bord
            </NuxtLink>

            <NuxtLink
              to="/admin/commandes"
              class="flex items-center justify-center px-4 py-3 bg-white bg-opacity-20 backdrop-blur rounded-md text-white hover:bg-opacity-30 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Gestion Commandes
            </NuxtLink>

            <a
              href="mailto:zeynash1@gmail.com?subject=Support Système Commandes"
              class="flex items-center justify-center px-4 py-3 bg-white bg-opacity-20 backdrop-blur rounded-md text-white hover:bg-opacity-30 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                />
                <path
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                />
              </svg>
              Support Technique
            </a>
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

useHead({
  title: "Guide du Système - Fournitures Scolaires Admin",
});
</script>
