<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des produits</h1>
    <div class="mb-4 flex justify-between items-center">
      <button @click="showAdd = !showAdd" class="btn btn-primary">Ajouter un produit</button>
    </div>
    <div v-if="showAdd" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="font-semibold mb-2">Nouveau produit</h2>
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="Nom" class="form-input mb-2" required />
        <input v-model.number="newProduct.price" placeholder="Prix" type="number" class="form-input mb-2" required />
        <input v-model="newProduct.category" placeholder="Catégorie" class="form-input mb-2" required />
        <input v-model="newProduct.image" placeholder="Image (URL)" class="form-input mb-2" />
        <textarea v-model="newProduct.description" placeholder="Description" class="form-input mb-2" />
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr>
          <th class="px-4 py-2">Nom</th>
          <th class="px-4 py-2">Prix</th>
          <th class="px-4 py-2">Catégorie</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="px-4 py-2">{{ product.name }}</td>
          <td class="px-4 py-2">{{ product.price }} CFA</td>
          <td class="px-4 py-2">{{ product.category }}</td>
          <td class="px-4 py-2">
            <button @click="deleteProduct(product.id)" class="text-red-600 hover:underline">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const products = ref<any[]>([])
const showAdd = ref(false)
const newProduct = ref({ name: '', price: 0, category: '', image: '', description: '' })

async function fetchProducts() {
  products.value = await $fetch('/api/admin/products')
}
onMounted(fetchProducts)

async function addProduct() {
  await $fetch('/api/admin/products', {
    method: 'POST',
    body: newProduct.value
  })
  showAdd.value = false
  newProduct.value = { name: '', price: 0, category: '', image: '', description: '' }
  fetchProducts()
}

async function deleteProduct(id: number) {
  await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
  fetchProducts()
}
</script>
