<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Gestion des utilisateurs
      </h2>
      <div class="flex space-x-3">
        <button
          @click="showAdd = true"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Ajouter</span>
        </button>
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

    <!-- Drawer Ajout -->
    <Transition name="drawer-slide" appear>
      <div v-if="showAdd" class="fixed inset-0 z-40 flex">
        <div
          class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          @click="showAdd = false"
        ></div>
        <div
          class="ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 transition-transform duration-300"
        >
          <AddDrawer @close="showAdd = false" @refresh="fetchUsers" />
        </div>
      </div>
    </Transition>
    <!-- Drawer Edition -->
    <Transition name="drawer-slide" appear>
      <div v-if="showEdit" class="fixed inset-0 z-40 flex">
        <div
          class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          @click="showEdit = false"
        ></div>
        <div
          class="ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 transition-transform duration-300"
        >
          <EditDrawer
            :user="editUser"
            @close="showEdit = false"
            @refresh="fetchUsers"
          />
        </div>
      </div>
    </Transition>
    <!-- Overlay Détail -->
    <UserDetail
      v-if="showDetail"
      :user="detailUser"
      @close="showDetail = false"
    />

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

    <!-- Barre de recherche -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom, email..."
        class="w-full md:w-80 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
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
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rôle
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Inscription
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <span class="text-emerald-600 font-bold text-sm">
                        {{ user.Name?.charAt(0)?.toUpperCase() || "U" }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.Name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ user.Phone || "Pas de téléphone" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.Email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 text-sm font-medium rounded-full"
                  :class="getRoleClass(user.Role)"
                  >{{ user.Role }}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="user.Active"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >Actif</span
                >
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                  >Inactif</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ formatDate(user["Created At"]) }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2"
              >
                <button
                  @click="showUserDetail(user)"
                  class="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Voir
                </button>
                <button
                  @click="edit(user)"
                  class="text-emerald-600 hover:text-emerald-900 font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  class="text-orange-600 hover:text-orange-900 font-medium"
                >
                  {{ user.Active ? "Désactiver" : "Activer" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

import { ref, computed, onMounted } from "vue";
import AddDrawer from "./users/add.vue";
import EditDrawer from "./users/edit.vue";
import UserDetail from "./users/[id].vue";

// Reactive state pour les utilisateurs
const users = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const editUser = ref(null);
const detailUser = ref(null);
const searchQuery = ref("");

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Fonction pour obtenir la classe CSS du rôle
const getRoleClass = (role: string) => {
  const classes = {
    admin: "bg-red-100 text-red-800",
    moderator: "bg-blue-100 text-blue-800",
    customer: "bg-green-100 text-green-800",
  };
  return classes[role] || "bg-gray-100 text-gray-800";
};

// Fonctions de gestion des utilisateurs
async function fetchUsers() {
  try {
    users.value = await $fetch("/api/admin/users");
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) =>
      (u.Name && u.Name.toLowerCase().includes(q)) ||
      (u.Email && u.Email.toLowerCase().includes(q))
  );
});

function edit(user: any) {
  editUser.value = { ...user };
  showEdit.value = true;
}

function showUserDetail(user: any) {
  detailUser.value = user;
  showDetail.value = true;
}

async function toggleUserStatus(user: any) {
  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: "PUT",
      body: { ...user, Active: !user.Active },
    });
    await fetchUsers();
  } catch (error) {
    console.error("Erreur lors de la modification du statut:", error);
  }
}

function refreshUsers() {
  fetchUsers();
}

// Statistiques
function getNewUsersThisMonth() {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  return users.value.filter((user) => {
    const userDate = new Date(user["Created At"]);
    return (
      userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear
    );
  }).length;
}

function getActiveUsersCount() {
  return users.value.filter((user) => user.Active).length;
}

// Charger les utilisateurs au montage
onMounted(fetchUsers);
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
