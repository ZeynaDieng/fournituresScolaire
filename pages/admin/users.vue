<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des utilisateurs</h1>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden mb-6">
      <thead>
        <tr>
          <th class="px-4 py-2">Nom</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Téléphone</th>
          <th class="px-4 py-2">Adresse</th>
          <th class="px-4 py-2">Créé le</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.phone }}</td>
          <td class="px-4 py-2">{{ user.address }}</td>
          <td class="px-4 py-2">{{ new Date(user.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-2">
            <button @click="edit(user)" class="text-blue-600 hover:underline mr-2">Modifier</button>
            <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showEdit" class="mb-6 p-4 bg-yellow-50 rounded-lg">
      <h2 class="font-semibold mb-2">Modifier l'utilisateur</h2>
      <form @submit.prevent="updateUser">
        <input v-model="editUser.name" placeholder="Nom" class="form-input mb-2" required />
        <input v-model="editUser.email" placeholder="Email" class="form-input mb-2" required />
        <input v-model="editUser.phone" placeholder="Téléphone" class="form-input mb-2" />
        <input v-model="editUser.address" placeholder="Adresse" class="form-input mb-2" />
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary ml-2">Annuler</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const users = ref<any[]>([])
const showEdit = ref(false)
const editUser = ref({ id: null, name: '', email: '', phone: '', address: '' })
async function fetchUsers() {
  users.value = await $fetch('/api/admin/users')
}
onMounted(fetchUsers)
function edit(user: any) {
  editUser.value = { ...user }
  showEdit.value = true
}
async function updateUser() {
  await $fetch(`/api/admin/users/${editUser.value.id}`, {
    method: 'PUT',
    body: editUser.value
  })
  showEdit.value = false
  editUser.value = { id: null, name: '', email: '', phone: '', address: '' }
  fetchUsers()
}
function cancelEdit() {
  showEdit.value = false
  editUser.value = { id: null, name: '', email: '', phone: '', address: '' }
}
async function deleteUser(id: number) {
  await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
  fetchUsers()
}
</script>
