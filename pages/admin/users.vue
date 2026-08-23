<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Gestion des Comptes Clients (CRUD Complet)</h2>
        <p class="text-xs text-slate-500 font-medium">Consultez, modifiez, créez ou désactivez les comptes utilisateurs inscrits</p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-6 py-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
      >
        <span>+ Créer un compte client</span>
      </button>
    </div>

    <!-- Users Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Client / Parent</th>
              <th class="py-4 px-6">Téléphone</th>
              <th class="py-4 px-6">Ville / Adresse</th>
              <th class="py-4 px-6">Rôle</th>
              <th class="py-4 px-6">Statut</th>
              <th class="py-4 px-6 text-right">Actions CRUD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="user in userList" :key="user.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-[#0F3D91] text-white font-extrabold flex items-center justify-center text-xs">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-950 block">{{ user.name }}</span>
                    <span class="text-[10px] text-slate-400 block">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 font-semibold text-slate-800">{{ user.phone }}</td>
              <td class="py-4 px-6 text-slate-600 font-medium">{{ user.city }}</td>
              <td class="py-4 px-6">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0F3D91] border border-blue-200">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 px-6">
                <button
                  @click="toggleUserStatus(user)"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-all"
                  :class="user.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  {{ user.active ? '✓ Actif' : '✕ Suspendu' }}
                </button>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(user)" class="text-[#0F3D91] font-bold hover:underline cursor-pointer">
                  Modifier
                </button>
                <button @click="deleteUser(user.id)" class="text-rose-600 font-bold hover:underline cursor-pointer">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: CREATE User -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Nouveau compte utilisateur</h3>
        
        <form @submit.prevent="addNewUser" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nom complet</label>
            <input v-model="newUser.name" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" placeholder="Aïssatou Diop" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone</label>
            <input v-model="newUser.phone" type="tel" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" placeholder="+221 77 123 45 67" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input v-model="newUser.email" type="email" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" placeholder="client@exemple.sn" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ville</label>
            <input v-model="newUser.city" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" placeholder="Dakar" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white text-xs font-bold rounded-full">Créer compte</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: UPDATE User -->
    <div v-if="showEditModal && editUserForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Modifier les informations client</h3>
        
        <form @submit.prevent="saveEditUser" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nom complet</label>
            <input v-model="editUserForm.name" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone</label>
            <input v-model="editUserForm.phone" type="tel" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input v-model="editUserForm.email" type="email" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white text-xs font-bold rounded-full">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editUserForm = ref<any>(null);

const newUser = ref({
  name: "",
  phone: "",
  email: "",
  city: "Dakar",
});

const userList = ref([
  { id: "usr-1", name: "Modou Ndiaye", phone: "+221 77 123 45 67", email: "modou.ndiaye@gmail.com", city: "Dakar (Sacré-Cœur)", role: "Parent / Client", active: true },
  { id: "usr-2", name: "Aïssatou Diop", phone: "+221 78 987 65 43", email: "aissatou.diop@yahoo.fr", city: "Dakar (Plateau)", role: "Parent / Client", active: true },
  { id: "usr-3", name: "Ousmane Fall", phone: "+221 70 456 78 90", email: "ousmane.fall@outlook.sn", city: "Thiès", role: "Parent / Client", active: true },
  { id: "usr-4", name: "Fatou Sow", phone: "+221 77 888 99 00", email: "fatou.sow@gmail.com", city: "Saint-Louis", role: "Parent / Client", active: true },
]);

onMounted(() => {
  if (process.client) {
    const savedUsers = JSON.parse(localStorage.getItem("all_users") || "[]");
    savedUsers.forEach((su: any) => {
      if (!userList.value.some((u: any) => u.phone === su.phone || u.email === su.email)) {
        userList.value.unshift({
          id: `usr-auto-${Date.now()}`,
          name: su.name || `${su.firstName} ${su.lastName}`,
          phone: su.phone,
          email: su.email,
          city: su.city || "Dakar",
          role: "Parent / Client",
          active: true,
        });
      }
    });
  }
});

// CREATE
const addNewUser = () => {
  if (!newUser.value.name) return;
  userList.value.unshift({
    id: `usr-${Date.now()}`,
    name: newUser.value.name,
    phone: newUser.value.phone,
    email: newUser.value.email,
    city: newUser.value.city,
    role: "Parent / Client",
    active: true,
  });
  showAddModal.value = false;
  alert("Compte client créé avec succès !");
};

// UPDATE
const openEditModal = (user: any) => {
  editUserForm.value = { ...user };
  showEditModal.value = true;
};

const saveEditUser = () => {
  if (!editUserForm.value) return;
  const idx = userList.value.findIndex(u => u.id === editUserForm.value.id);
  if (idx !== -1) {
    userList.value[idx] = { ...editUserForm.value };
  }
  showEditModal.value = false;
  alert("Informations utilisateur mises à jour.");
};

const toggleUserStatus = (user: any) => {
  user.active = !user.active;
};

// DELETE
const deleteUser = (id: string) => {
  if (confirm("Voulez-vous vraiment supprimer ce compte client ?")) {
    userList.value = userList.value.filter(u => u.id !== id);
    alert("Compte client supprimé.");
  }
};

useHead({
  title: "Gestion des Utilisateurs (CRUD) - Back-Office EduShop",
});
</script>
