<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Gestion des utilisateurs
      </h2>
      <div class="flex space-x-3">
        <button
          @click="refreshUsers"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg
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
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">
          Total des utilisateurs
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ users.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">Nouveaux ce mois</div>
        <div class="text-2xl font-bold text-blue-600">
          {{ getNewUsersThisMonth() }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">Utilisateurs actifs</div>
        <div class="text-2xl font-bold text-green-600">
          {{ getActiveUsersCount() }}
        </div>
      </div>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="showEdit" class="mb-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Modifier l'utilisateur
      </h3>
      <form @submit.prevent="updateUser" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nom complet</label
            >
            <input
              v-model="editUser.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email</label
            >
            <input
              v-model="editUser.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Téléphone</label
            >
            <input
              v-model="editUser.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Adresse</label
            >
            <input
              v-model="editUser.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Liste des utilisateurs
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Adresse
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date d'inscription
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.name || "Nom non renseigné" }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.phone || "-" }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ user.address || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(user.createdAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  Actif
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="edit(user)"
                  class="text-emerald-600 hover:text-emerald-900 mr-3 transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucun utilisateur -->
        <div v-if="users.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Aucun utilisateur
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucun utilisateur n'est encore inscrit.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Protection par middleware
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

// Typage des données
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

// Reactive state
const users = ref<User[]>([]);
const showEdit = ref(false);
const editUser = ref<{
  id: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
}>({
  id: null,
  name: "",
  email: "",
  phone: "",
  address: "",
});

// Fonctions utilitaires pour le formatage
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Fonctions de statistiques
const getNewUsersThisMonth = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return users.value.filter((user) => {
    const userDate = new Date(user.createdAt);
    return (
      userDate.getMonth() === currentMonth &&
      userDate.getFullYear() === currentYear
    );
  }).length;
};

const getActiveUsersCount = () => {
  // Pour l'instant, on considère tous les utilisateurs comme actifs
  // Dans une vraie application, on aurait une logique basée sur la dernière connexion
  return users.value.length;
};

// Fonctions de gestion des utilisateurs
async function fetchUsers() {
  try {
    users.value = await $fetch<User[]>("/api/admin/users");
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  }
}

// Fonction pour actualiser les utilisateurs
const refreshUsers = async () => {
  await fetchUsers();
};

function edit(user: User) {
  editUser.value = {
    id: user.id,
    name: user.name || "",
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
  };
  showEdit.value = true;
}

async function updateUser() {
  if (!editUser.value.id) return;

  try {
    await $fetch(`/api/admin/users/${editUser.value.id}`, {
      method: "PUT",
      body: editUser.value,
    });

    showEdit.value = false;
    editUser.value = {
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
    };

    await fetchUsers();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
  }
}

function cancelEdit() {
  showEdit.value = false;
  editUser.value = {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  };
}

async function deleteUser(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    try {
      await $fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      await fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  }
}

// Charger les utilisateurs au montage
onMounted(fetchUsers);
</script>
