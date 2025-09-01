<template>
  <div class="container mx-auto py-8">
    <h1 class="text-xl font-bold mb-6">Gestion des promotions</h1>
    <div class="mb-4 flex justify-between items-center">
      <button @click="showAdd = !showAdd" class="btn btn-primary">
        Ajouter une promotion
      </button>
    </div>
    <div v-if="showAdd" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="font-semibold mb-2">Nouvelle promotion</h2>
      <form @submit.prevent="addPromotion">
        <input
          v-model="newPromotion.title"
          placeholder="Titre"
          class="form-input mb-2"
          required
        />
        <input
          v-model.number="newPromotion.discount"
          placeholder="Réduction (%)"
          type="number"
          class="form-input mb-2"
          required
        />
        <input
          v-model="newPromotion.type"
          placeholder="Type (percentage, fixed, bogo)"
          class="form-input mb-2"
          required
        />
        <input
          v-model="newPromotion.endDate"
          placeholder="Date de fin (YYYY-MM-DD)"
          class="form-input mb-2"
          required
        />
        <textarea
          v-model="newPromotion.description"
          placeholder="Description"
          class="form-input mb-2"
        />
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
    <div v-if="showEdit" class="mb-6 p-4 bg-yellow-50 rounded-lg">
      <h2 class="font-semibold mb-2">Modifier la promotion</h2>
      <form @submit.prevent="updatePromotion">
        <input
          v-model="editPromotion.title"
          placeholder="Titre"
          class="form-input mb-2"
          required
        />
        <input
          v-model.number="editPromotion.discount"
          placeholder="Réduction (%)"
          type="number"
          class="form-input mb-2"
          required
        />
        <input
          v-model="editPromotion.type"
          placeholder="Type (percentage, fixed, bogo)"
          class="form-input mb-2"
          required
        />
        <input
          v-model="editPromotion.endDate"
          placeholder="Date de fin (YYYY-MM-DD)"
          class="form-input mb-2"
          required
        />
        <textarea
          v-model="editPromotion.description"
          placeholder="Description"
          class="form-input mb-2"
        />
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button
          type="button"
          @click="cancelEdit"
          class="btn btn-secondary ml-2"
        >
          Annuler
        </button>
      </form>
    </div>
    <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead>
        <tr>
          <th class="px-4 py-2">Titre</th>
          <th class="px-4 py-2">Réduction</th>
          <th class="px-4 py-2">Type</th>
          <th class="px-4 py-2">Fin</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promo in promotions" :key="promo.id">
          <td class="px-4 py-2">{{ promo.title }}</td>
          <td class="px-4 py-2">{{ promo.discount }}%</td>
          <td class="px-4 py-2">{{ promo.type }}</td>
          <td class="px-4 py-2">{{ promo.endDate }}</td>
          <td class="px-4 py-2">
            <button
              @click="edit(promo)"
              class="text-blue-600 hover:underline mr-2"
            >
              Modifier
            </button>
            <button
              @click="deletePromotion(promo.id)"
              class="text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const promotions = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const newPromotion = ref({
  title: "",
  discount: 0,
  type: "",
  endDate: "",
  description: "",
});
const editPromotion = ref({
  id: null,
  title: "",
  discount: 0,
  type: "",
  endDate: "",
  description: "",
});

async function fetchPromotions() {
  promotions.value = (await $fetch("/api/admin/promotions")) as any;
}
onMounted(fetchPromotions);

async function addPromotion() {
  await $fetch("/api/admin/promotions", {
    method: "POST",
    body: newPromotion.value,
  });
  showAdd.value = false;
  newPromotion.value = {
    title: "",
    discount: 0,
    type: "",
    endDate: "",
    description: "",
  };
  fetchPromotions();
}

function edit(promo: any) {
  editPromotion.value = { ...promo };
  showEdit.value = true;
}

async function updatePromotion() {
  await $fetch(`/api/admin/promotions/${editPromotion.value.id}`, {
    method: "PUT",
    body: editPromotion.value,
  });
  showEdit.value = false;
  editPromotion.value = {
    id: null,
    title: "",
    discount: 0,
    type: "",
    endDate: "",
    description: "",
  };
  fetchPromotions();
}

function cancelEdit() {
  showEdit.value = false;
  editPromotion.value = {
    id: null,
    title: "",
    discount: 0,
    type: "",
    endDate: "",
    description: "",
  };
}

async function deletePromotion(id: number) {
  await $fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
  fetchPromotions();
}
</script>
