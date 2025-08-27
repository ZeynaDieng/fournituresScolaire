<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Contactez-nous</h1>

    <div class="bg-white p-6 rounded-lg shadow-md fade-in">
      <form @submit.prevent="sendMessage" class="flex flex-col gap-4">
        <input type="text" v-model="name" placeholder="Nom" class="p-2 border rounded-lg">
        <input type="email" v-model="email" placeholder="Email" class="p-2 border rounded-lg">
        <textarea v-model="message" placeholder="Message" class="p-2 border rounded-lg"></textarea>
        <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg transition">Envoyer</button>
      </form>

      <div class="mt-6">
        <h2 class="font-bold mb-2">Commande rapide via WhatsApp</h2>
        <a href="https://wa.me/221000000000" target="_blank" class="text-green-600 font-bold hover:underline">Commander sur WhatsApp</a>
      </div>

      <div class="mt-6">
        <h2 class="font-bold mb-2">Adresse</h2>
        <p>Rue Exemple, Dakar, Sénégal</p>
        <p>Horaires : Lun-Ven 8h-18h</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function sendMessage() {
  alert(`Merci ${name.value}, votre message a été envoyé !`)
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>
