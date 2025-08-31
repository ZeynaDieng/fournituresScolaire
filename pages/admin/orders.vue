<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des commandes</h1>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr>
          <th class="px-4 py-2">Référence</th>
          <th class="px-4 py-2">Utilisateur</th>
          <th class="px-4 py-2">Total</th>
          <th class="px-4 py-2">Statut</th>
          <th class="px-4 py-2">Créée le</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="px-4 py-2">{{ order.ref }}</td>
          <td class="px-4 py-2">{{ order.user?.email || '-' }}</td>
          <td class="px-4 py-2">{{ order.total }} CFA</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">{{ new Date(order.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const orders = ref<any[]>([])
async function fetchOrders() {
  orders.value = await $fetch('/api/admin/orders')
}
onMounted(fetchOrders)
</script>
