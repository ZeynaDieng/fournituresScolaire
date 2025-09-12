<template>
  <div>
    <!-- Contenu du tableau de bord -->
    <div class="p-6">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
        <p class="text-gray-600">
          Gérez votre boutique de fournitures scolaires
        </p>
      </div>

      <!-- Grille des modules d'administration -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Gestion des produits -->
        <NuxtLink
          to="/admin/products"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <ProductIcon :size="48" class="text-emerald-600" />
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ adminStats.totalProducts || "..." }}
              </div>
              <div class="text-sm text-gray-500">Produits</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Gérer les produits
          </h3>
          <p class="text-gray-600 text-sm">
            Ajouter, modifier et supprimer les produits du catalogue
          </p>
          <div
            class="mt-4 text-emerald-600 font-medium group-hover:text-emerald-700"
          >
            Gérer →
          </div>
        </NuxtLink>
        <!-- Gestion des packs -->
        <NuxtLink
          to="/admin/packs"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <PackageIcon :size="48" class="text-blue-600" />
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ adminStats.totalPacks || "..." }}
              </div>
              <div class="text-sm text-gray-500">Packs</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Gérer les packs
          </h3>
          <p class="text-gray-600 text-sm">
            Créer et modifier les packs de fournitures scolaires
          </p>
          <div class="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
            Gérer →
          </div>
        </NuxtLink>

        <!-- Gestion des promotions -->
        <NuxtLink
          to="/admin/promotions"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <PromoIcon :size="48" class="text-orange-600" />
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ adminStats.totalPromotions || "..." }}
              </div>
              <div class="text-sm text-gray-500">Promos</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Gérer les promotions
          </h3>
          <p class="text-gray-600 text-sm">
            Créer et gérer les offres promotionnelles
          </p>
          <div
            class="mt-4 text-orange-600 font-medium group-hover:text-orange-700"
          >
            Gérer →
          </div>
        </NuxtLink>

        <!-- Gestion des commandes -->
        <NuxtLink
          to="/admin/orders-airtable"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <OrderIcon :size="48" class="text-purple-600" />
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ adminStats.pendingOrders || "..." }}
              </div>
              <div class="text-sm text-gray-500">Commandes</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Gérer les commandes
          </h3>
          <p class="text-gray-600 text-sm">
            Suivre et traiter les commandes clients
          </p>
          <div
            class="mt-4 text-purple-600 font-medium group-hover:text-purple-700"
          >
            Gérer →
          </div>
        </NuxtLink>

        <!-- Gestion des utilisateurs -->
        <NuxtLink
          to="/admin/users"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <UserIcon :size="48" class="text-indigo-600" />
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ adminStats.totalUsers || "..." }}
              </div>
              <div class="text-sm text-gray-500">Utilisateurs</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Gérer les utilisateurs
          </h3>
          <p class="text-gray-600 text-sm">
            Administrer les comptes utilisateurs
          </p>
          <div
            class="mt-4 text-indigo-600 font-medium group-hover:text-indigo-700"
          >
            Gérer →
          </div>
        </NuxtLink>

        <!-- Statistiques -->
        <NuxtLink
          to="/admin/statistics"
          class="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <svg
              class="w-12 h-12 text-teal-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
              />
            </svg>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(adminStats.monthlyRevenue) || "..." }}
              </div>
              <div class="text-sm text-gray-500">CA du mois</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Voir les statistiques
          </h3>
          <p class="text-gray-600 text-sm">
            Analyser les performances et les tendances
          </p>
          <div class="mt-4 text-teal-600 font-medium group-hover:text-teal-700">
            Analyser →
          </div>
        </NuxtLink>
      </div>

      <!-- Statistiques rapides -->
      <div class="mt-12">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Aperçu rapide</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div class="text-3xl font-bold text-emerald-600">
              {{ formatCurrency(adminStats.monthlyRevenue) || "FCFA0" }}
            </div>
            <div class="text-gray-600">Revenus du mois</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div class="text-3xl font-bold text-blue-600">
              {{ adminStats.totalProducts || "0" }}
            </div>
            <div class="text-gray-600">Produits actifs</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div class="text-3xl font-bold text-orange-600">
              {{ adminStats.pendingOrders || "0" }}
            </div>
            <div class="text-gray-600">Commandes en attente</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div class="text-3xl font-bold text-purple-600">
              {{ adminStats.totalUsers || "0" }}
            </div>
            <div class="text-gray-600">Utilisateurs inscrits</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
import { ref, inject } from "vue";
import ProductIcon from "../../components/icons/ProductIcon.vue";
import PackageIcon from "../../components/icons/PackageIcon.vue";
import PromoIcon from "../../components/icons/PromoIcon.vue";
import OrderIcon from "../../components/icons/OrderIcon.vue";
import UserIcon from "../../components/icons/UserIcon.vue";

// Injecter les stats depuis le layout
const adminStats = inject(
  "adminStats",
  ref({
    pendingOrders: 0,
    totalProducts: 0,
    totalPacks: 0,
    totalPromotions: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    lastUpdated: new Date(),
  })
);

// Fonction pour formater la devise
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);
};
</script>
