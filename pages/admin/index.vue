<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Backoffice Administration</h1>
    <ul class="space-y-4">
      <li>
        <NuxtLink to="/admin/products" class="text-blue-600 hover:underline font-medium">Gérer les produits</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/packs" class="text-blue-600 hover:underline font-medium">Gérer les packs</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/promotions" class="text-blue-600 hover:underline font-medium">Gérer les promotions</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/orders" class="text-blue-600 hover:underline font-medium">Gérer les commandes</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/users" class="text-blue-600 hover:underline font-medium">Gérer les utilisateurs</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Page d'accueil du backoffice
</script>
