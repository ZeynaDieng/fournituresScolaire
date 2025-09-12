<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Statistiques Simplifiées</h1>
      <div class="text-sm text-gray-500">
        Dernière mise à jour: {{ currentTime }}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Chiffre d'affaires -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
            <p class="text-3xl font-bold text-gray-900">2 847FCFA</p>
            <p class="text-sm text-green-600">
              <span>+12.5%</span>
              <span class="text-gray-500 ml-1">vs mois dernier</span>
            </p>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg">
            <svg
              class="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Commandes -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Commandes</p>
            <p class="text-3xl font-bold text-gray-900">127</p>
            <p class="text-sm text-blue-600">
              <span>+8.2%</span>
              <span class="text-gray-500 ml-1">vs mois dernier</span>
            </p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Produits vendus -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Produits vendus</p>
            <p class="text-3xl font-bold text-gray-900">2,847</p>
            <p class="text-sm text-green-600">
              <span>+15.3%</span>
              <span class="text-gray-500 ml-1">vs mois dernier</span>
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Utilisateurs -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Utilisateurs</p>
            <p class="text-3xl font-bold text-gray-900">1,284</p>
            <p class="text-sm text-purple-600">
              <span>+24 nouveaux</span>
              <span class="text-gray-500 ml-1">ce mois</span>
            </p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Ventes par mois -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Ventes par mois
        </h3>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 40%"></div>
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 65%"></div>
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 80%"></div>
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 60%"></div>
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 75%"></div>
          <div class="bg-emerald-500 w-8 rounded-t" style="height: 90%"></div>
          <div class="bg-emerald-600 w-8 rounded-t" style="height: 100%"></div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-gray-500">
          <span>Jan</span>
          <span>Fév</span>
          <span>Mar</span>
          <span>Avr</span>
          <span>Mai</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
      </div>

      <!-- Produits populaires -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Produits populaires
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-blue-600 font-semibold">1</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Stylo-plume Pilot
                </p>
                <p class="text-xs text-gray-500">423 ventes</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-900">FCFA8,460</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-green-600 font-semibold">2</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Cahier spiral A4
                </p>
                <p class="text-xs text-gray-500">387 ventes</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-900">FCFA1,935</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-yellow-600 font-semibold">3</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Pack CE2 complet
                </p>
                <p class="text-xs text-gray-500">156 ventes</p>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-900">FCFA7,800</span>
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

import { computed } from "vue";

const currentTime = computed(() => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>
