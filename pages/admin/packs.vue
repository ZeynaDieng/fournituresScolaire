<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des packs</h1>
    <div class="mb-4 flex justify-between items-center">
      <button @click="showAdd = !showAdd" class="btn btn-primary">Ajouter un pack</button>
    </div>
    <div v-if="showAdd" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="font-semibold mb-2">Nouveau pack</h2>
      <form @submit.prevent="addPack">
        <input v-model="newPack.name" placeholder="Nom" class="form-input mb-2" required />
        <input v-model="newPack.level" placeholder="Niveau (CP, CE1, etc.)" class="form-input mb-2" required />
        <input v-model.number="newPack.price" placeholder="Prix" type="number" class="form-input mb-2" required />
        <input v-model="newPack.image" placeholder="Image (URL)" class="form-input mb-2" />
        <textarea v-model="newPack.description" placeholder="Description" class="form-input mb-2" />
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
    <div v-if="showEdit" class="mb-6 p-4 bg-yellow-50 rounded-lg">
      <h2 class="font-semibold mb-2">Modifier le pack</h2>
      <form @submit.prevent="updatePack">
        <input v-model="editPack.name" placeholder="Nom" class="form-input mb-2" required />
        <input v-model="editPack.level" placeholder="Niveau (CP, CE1, etc.)" class="form-input mb-2" required />
        <input v-model.number="editPack.price" placeholder="Prix" type="number" class="form-input mb-2" required />
        <input v-model="editPack.image" placeholder="Image (URL)" class="form-input mb-2" />
        <textarea v-model="editPack.description" placeholder="Description" class="form-input mb-2" />
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary ml-2">Annuler</button>
      </form>
    </div>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr>
          <th class="px-4 py-2">Nom</th>
          <th class="px-4 py-2">Niveau</th>
          <th class="px-4 py-2">Prix</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pack in packs" :key="pack.id">
          <td class="px-4 py-2">{{ pack.name }}</td>
          <td class="px-4 py-2">{{ pack.level }}</td>
          <td class="px-4 py-2">{{ pack.price }} CFA</td>
          <td class="px-4 py-2">
            <button @click="edit(pack)" class="text-blue-600 hover:underline mr-2">Modifier</button>
            <button @click="deletePack(pack.id)" class="text-red-600 hover:underline">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const packs = ref<any[]>([])
const showAdd = ref(false)
const showEdit = ref(false)
const newPack = ref({ name: '', level: '', price: 0, image: '', description: '' })
const editPack = ref({ id: null, name: '', level: '', price: 0, image: '', description: '' })

async function fetchPacks() {
  packs.value = await $fetch('/api/admin/packs')
}
onMounted(fetchPacks)

async function addPack() {
  await $fetch('/api/admin/packs', {
    method: 'POST',
    body: newPack.value
  })
  showAdd.value = false
  newPack.value = { name: '', level: '', price: 0, image: '', description: '' }
  fetchPacks()
}

function edit(pack: any) {
  editPack.value = { ...pack }
  showEdit.value = true
}

async function updatePack() {
  await $fetch(`/api/admin/packs/${editPack.value.id}`, {
    method: 'PUT',
    body: editPack.value
  })
  showEdit.value = false
  editPack.value = { id: null, name: '', level: '', price: 0, image: '', description: '' }
  fetchPacks()
}

function cancelEdit() {
  showEdit.value = false
  editPack.value = { id: null, name: '', level: '', price: 0, image: '', description: '' }
}

async function deletePack(id: number) {
  await $fetch(`/api/admin/packs/${id}`, { method: 'DELETE' })
  fetchPacks()
}
</script>
