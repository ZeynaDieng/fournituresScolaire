<template>
  <table class="min-w-full bg-white rounded shadow">
    <thead>
      <tr>
        <th class="p-2">ID</th>
        <th class="p-2">Client</th>
        <th class="p-2">Total</th>
        <th class="p-2">Date</th>
        <th class="p-2">Statut</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td class="p-2">{{ order.id }}</td>
        <td class="p-2">{{ order.customer }}</td>
        <td class="p-2">{{ order.total }}FCFA</td>
        <td class="p-2">{{ order.date }}</td>
        <td class="p-2">{{ order.status }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
defineProps<{ orders: Array<any> }>();
</script>
