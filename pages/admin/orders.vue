<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des commandes</h1>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden mb-6">
      <thead>
        <tr>
          <th class="px-4 py-2">Référence</th>
          <th class="px-4 py-2">Utilisateur</th>
          <th class="px-4 py-2">Total</th>
          <th class="px-4 py-2">Statut</th>
          <th class="px-4 py-2">Créée le</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="px-4 py-2">{{ order.ref }}</td>
          <td class="px-4 py-2">{{ order.user?.email || '-' }}</td>
          <td class="px-4 py-2">{{ order.total }} CFA</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">{{ new Date(order.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-2">
            <button @click="edit(order)" class="text-blue-600 hover:underline mr-2">Modifier</button>
            <button @click="deleteOrder(order.id)" class="text-red-600 hover:underline">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showEdit" class="mb-6 p-4 bg-yellow-50 rounded-lg">
      <h2 class="font-semibold mb-2">Modifier la commande</h2>
      <form @submit.prevent="updateOrder">
        <input v-model="editOrder.status" placeholder="Statut" class="form-input mb-2" required />
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary ml-2">Annuler</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const orders = ref<any[]>([])
const showEdit = ref(false)
const editOrder = ref({ id: null, status: '' })
async function fetchOrders() {
  orders.value = await $fetch('/api/admin/orders')
}
onMounted(fetchOrders)
function edit(order: any) {
  editOrder.value = { id: order.id, status: order.status }
  showEdit.value = true
}
async function updateOrder() {
  await $fetch(`/api/admin/orders/${editOrder.value.id}`, {
    method: 'PUT',
    body: { status: editOrder.value.status }
  })
  showEdit.value = false
  editOrder.value = { id: null, status: '' }
  fetchOrders()
}
function cancelEdit() {
  showEdit.value = false
  editOrder.value = { id: null, status: '' }
}
async function deleteOrder(id: number) {
  await $fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
  fetchOrders()
}
</script>
