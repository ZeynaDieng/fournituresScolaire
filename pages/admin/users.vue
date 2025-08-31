<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des utilisateurs</h1>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr>
          <th class="px-4 py-2">Nom</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Téléphone</th>
          <th class="px-4 py-2">Adresse</th>
          <th class="px-4 py-2">Créé le</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.phone }}</td>
          <td class="px-4 py-2">{{ user.address }}</td>
          <td class="px-4 py-2">{{ new Date(user.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const users = ref<any[]>([])
async function fetchUsers() {
  users.value = await $fetch('/api/admin/users')
}
onMounted(fetchUsers)
</script>
