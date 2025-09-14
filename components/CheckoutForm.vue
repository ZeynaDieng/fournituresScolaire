<!-- components/CheckoutForm.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="my-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Finaliser ma commande
      </h1>
      <p class="text-gray-600">
        Commande via WhatsApp - Seuls le nom, téléphone et adresse sont requis
      </p>
    </div>

    <!-- Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
        >
          <div
            :class="[
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
              currentStep >= index + 1
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-500',
            ]"
          >
            {{ index + 1 }}
          </div>
          <div class="ml-2">
            <p
              :class="[
                'text-sm font-medium',
                currentStep >= index + 1 ? 'text-primary-600' : 'text-gray-500',
              ]"
            >
              {{ step.title }}
            </p>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'w-12 h-0.5 mx-4',
              currentStep > index + 1 ? 'bg-primary-600' : 'bg-gray-200',
            ]"
          ></div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto space-y-8">
      <!-- Informations client -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Informations personnelles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet *
            </label>
            <input
              id="name"
              v-model="form.customer.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email (optionnel)
            </label>
            <input
              id="email"
              v-model="form.customer.email"
              type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
              placeholder="votre@email.com (optionnel)"
            />
          </div>

          <div class="md:col-span-2">
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Téléphone *
            </label>
            <div class="flex">
              <select
                v-model="phonePrefix"
                class="px-4 py-3 border border-gray-300 rounded-r-none rounded-l-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900 w-20 text-center"
              >
                <option value="+221">+221</option>
                <option value="+225">+225</option>
                <option value="+223">+223</option>
                <option value="+229">+229</option>
              </select>
              <input
                id="phone"
                v-model="phoneNumber"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-l-none rounded-r-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 flex-1"
                placeholder="77 123 45 67"
                @input="formatPhoneNumber"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé de la commande (après les informations personnelles) -->
      <div
        v-if="cartItems.length > 0"
        class="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Résumé de la commande
        </h3>

        <!-- Articles -->
        <div class="space-y-3 mb-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div class="flex items-center">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded mr-3 bg-white"
              />
              <div>
                <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">Qté: {{ item.quantity }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium">
                {{ formatAmount(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Totaux -->
        <div class="space-y-2 border-t border-gray-200 pt-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Sous-total</span>
            <span>{{ formatAmount(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Livraison</span>
            <span>{{ formatAmount(form.shipping.cost) }}</span>
          </div>
          <div
            v-if="promoDiscount > 0"
            class="flex justify-between text-green-600"
          >
            <span>Réduction</span>
            <span>-{{ formatAmount(promoDiscount) }}</span>
          </div>
          <div
            class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2"
          >
            <span>Total</span>
            <span class="text-primary-600">{{
              formatAmount(totalAmount)
            }}</span>
          </div>
        </div>

        <!-- Bouton Continuer après le résumé -->
        <div class="mt-6">
          <button
            type="button"
            @click="nextStep"
            :disabled="!isStep1Valid"
            class="btn-primary w-full"
          >
            Continuer vers la livraison
          </button>
        </div>
      </div>

      <!-- Informations de livraison -->
      <div
        v-show="currentStep === 2"
        class="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Livraison
        </h2>

        <div class="space-y-4">
          <div>
            <label
              for="address"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse de livraison *
            </label>
            <textarea
              id="address"
              v-model="form.shipping.address"
              required
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 resize-vertical"
              placeholder="Votre adresse complète..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Ville (optionnel)
              </label>
              <select
                id="city"
                v-model="form.shipping.city"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900"
              >
                <option value="">Choisir une ville (optionnel)</option>
                <option value="Dakar">Dakar</option>
                <option value="Thiès">Thiès</option>
                <option value="Saint-Louis">Saint-Louis</option>
                <option value="Kaolack">Kaolack</option>
                <option value="Ziguinchor">Ziguinchor</option>
                <option value="Diourbel">Diourbel</option>
                <option value="Tambacounda">Tambacounda</option>
                <option value="Fatick">Fatick</option>
                <option value="Kaffrine">Kaffrine</option>
                <option value="Kolda">Kolda</option>
                <option value="Louga">Louga</option>
                <option value="Matam">Matam</option>
                <option value="Kédougou">Kédougou</option>
                <option value="Sédhiou">Sédhiou</option>
              </select>
            </div>

            <div>
              <label
                for="delivery-method"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Mode de livraison (optionnel)
              </label>
              <select
                id="delivery-method"
                v-model="form.shipping.method"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white text-gray-900"
                @change="updateShippingCost"
              >
                <option value="">À définir avec vous</option>
                <option value="standard">Livraison standard - 500 FCFA</option>
                <option value="express">Livraison express - 2000 FCFA</option>
                <option value="pickup">Retrait direct - Gratuit</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-6 flex space-x-4">
          <button type="button" @click="prevStep" class="btn-secondary flex-1">
            Retour
          </button>
          <button
            type="button"
            @click="nextStep"
            :disabled="!isStep2Valid"
            class="btn-primary flex-1"
          >
            Continuer vers le paiement
          </button>
        </div>
      </div>

      <!-- Méthode de paiement -->
      <div
        v-show="currentStep === 3"
        class="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Choisissez votre mode de commande
        </h2>

        <!-- Choix du mode de commande -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Option Paiement Direct -->
          <div
            @click="paymentMode = 'direct'"
            :class="[
              'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
              paymentMode === 'direct'
                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 ring-opacity-20'
                : 'border-gray-200 hover:border-gray-300',
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 text-emerald-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  />
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-900">Paiement Direct</h3>
                  <p class="text-sm text-gray-600">Payez maintenant en ligne</p>
                </div>
              </div>
              <div
                :class="[
                  'w-4 h-4 rounded-full border-2',
                  paymentMode === 'direct'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-300',
                ]"
              >
                <div
                  v-if="paymentMode === 'direct'"
                  class="w-2 h-2 bg-white rounded-full m-0.5"
                ></div>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              Sécurisé par PayTech • Paiement instantané
            </div>
          </div>

          <!-- Option WhatsApp -->
          <div
            @click="paymentMode = 'whatsapp'"
            :class="[
              'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
              paymentMode === 'whatsapp'
                ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-opacity-20'
                : 'border-gray-200 hover:border-gray-300',
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="w-8 h-8 text-green-600 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"
                  />
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-900">Commande WhatsApp</h3>
                  <p class="text-sm text-gray-600">
                    Envoyez votre commande sur WhatsApp
                  </p>
                </div>
              </div>
              <div
                :class="[
                  'w-4 h-4 rounded-full border-2',
                  paymentMode === 'whatsapp'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300',
                ]"
              >
                <div
                  v-if="paymentMode === 'whatsapp'"
                  class="w-2 h-2 bg-white rounded-full m-0.5"
                ></div>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              Commande personnalisée • Lien de paiement Wave
            </div>
          </div>
        </div>

        <!-- Section paiement direct -->
        <div v-if="paymentMode === 'direct'" class="mb-6">
          <!-- Indicateur de popup de paiement -->
          <div
            v-if="isPaymentPopupOpen"
            class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div class="flex items-center">
              <div
                class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"
              ></div>
              <div>
                <h4 class="font-medium text-blue-900">Paiement en cours...</h4>
                <p class="text-sm text-blue-700">
                  Veuillez compléter votre paiement dans la fenêtre qui s'est
                  ouverte.
                </p>
              </div>
            </div>
          </div>

          <!-- Message informatif -->
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-emerald-600 mr-3 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div>
                <h4 class="font-medium text-emerald-900">Paiement sécurisé</h4>
                <p class="text-sm text-emerald-700 mt-1">
                  Cliquez sur "Payer maintenant" pour ouvrir l'interface de
                  paiement PayTech. Vous pourrez choisir votre méthode de
                  paiement directement dans leur interface sécurisée.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section WhatsApp -->
        <div
          v-if="paymentMode === 'whatsapp'"
          class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <h4 class="font-medium text-green-800 mb-1">
                Comment ça marche ?
              </h4>
              <ul class="text-sm text-green-700 space-y-1">
                <li>1. Votre commande sera envoyée directement sur WhatsApp</li>
                <li>2. Nous vous contacterons pour confirmer votre commande</li>
                <li>3. Vous recevrez un lien de paiement Wave personnalisé</li>
                <li>4. Livraison après confirmation du paiement</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-6 flex space-x-4">
          <button type="button" @click="prevStep" class="btn-secondary flex-1">
            Retour
          </button>

          <!-- Bouton paiement direct -->
          <!-- PayTech Dialog -->
          <div v-if="paymentMode === 'direct'" class="flex-1">
            <PayTechDialog
              :total-amount="totalAmount"
              :order-data="orderData"
              @initiate-payment="handleInitiatePayment"
              @proceed-to-payment="handleProceedToPayment"
              @payment-success="handlePaymentSuccess"
              @payment-error="handlePaymentError"
            />
          </div>
          <button
            v-if="paymentMode === 'whatsapp'"
            type="button"
            @click="sendToWhatsApp"
            :disabled="isProcessing"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex-1 flex items-center justify-center"
            :title="
              isProcessing
                ? 'Traitement en cours...'
                : 'Envoyer la commande sur WhatsApp'
            "
            id="btn-whatsapp-checkout"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"
              />
            </svg>
            <span v-if="isProcessing">
              <svg
                class="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Envoi WhatsApp...
            </span>
            <span v-else>Envoyer sur WhatsApp</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import {
  formatWhatsAppOrderMessage,
  createWhatsAppLink,
} from "../utils/whatsapp-config";
import PayTechDialog from "./PayTechDialog.vue";

// Props et émissions
interface Props {
  cartItems?: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  cartItems: () => [],
});

// Composables
const router = useRouter();
const cartStore = useCartStore();

// Fonction pour formater les montants
const formatAmount = (amount: number, currency: string = "XOF"): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fonction pour initier un paiement (simulée pour l'exemple)
const initiatePayment = async (paymentData: any) => {
  try {
    const response = await $fetch("/api/paytech/initiate", {
      method: "POST",
      body: paymentData,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// States
const currentStep = ref(1);
const isProcessing = ref(false);
const isApplyingPromo = ref(false);
const phonePrefix = ref("+221");
const phoneNumber = ref("");
const promoCode = ref("");
const promoDiscount = ref(0);
const paymentMode = ref("direct"); // 'direct' ou 'whatsapp' - PayTech activé
const isPaymentPopupOpen = ref(false);

// Données de commande pour PayTech
const orderData = computed(() => ({
  customer: form.customer,
  shipping: form.shipping,
  items: props.cartItems,
  amount: totalAmount.value,
  promoCode: promoCode.value,
  promoDiscount: promoDiscount.value,
}));

// Form data
const form = reactive({
  customer: {
    name: "",
    email: "",
    phone: "",
    id: null as string | number | null,
  },
  shipping: {
    address: "",
    city: "",
    method: "",
    cost: 0,
  },
  target_payment: "",
  amount: 0,
  currency: "XOF",
  items: props.cartItems,
});

// Steps configuration
const steps = [
  { id: 1, title: "Informations" },
  { id: 2, title: "Livraison" },
  { id: 3, title: "Paiement" },
];

// Computed
const subtotal = computed(() => {
  return props.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const totalAmount = computed(() => {
  return subtotal.value + form.shipping.cost - promoDiscount.value;
});

const isStep1Valid = computed(() => {
  return form.customer.name.trim() !== "" && phoneNumber.value.trim() !== "";
});

const isStep2Valid = computed(() => {
  return form.shipping.address.trim() !== "";
});

const isStep3Valid = computed(() => {
  // Plus besoin de valider la méthode de paiement - PayTech s'en charge
  return true;
});

// Methods
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const formatPhoneNumber = () => {
  // Format automatique du numéro de téléphone
  let value = phoneNumber.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  phoneNumber.value = value;

  // Mise à jour du téléphone complet
  form.customer.phone = phonePrefix.value + value.replace(/\s/g, "");
};

const updateShippingCost = () => {
  const costs: Record<string, number> = {
    standard: 500,
    express: 2000,
    pickup: 0,
  };
  form.shipping.cost = costs[form.shipping.method] || 0;
};

const getCountryFromPhone = () => {
  const countryMap: Record<string, string> = {
    "+221": "SN",
    "+225": "CI",
    "+223": "ML",
    "+229": "BJ",
  };
  return countryMap[phonePrefix.value] || "SN";
};

const applyPromoCode = async () => {
  if (!promoCode.value.trim()) return;

  isApplyingPromo.value = true;

  try {
    // Simuler l'appel API pour validation du code promo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Exemple de codes promo
    const promoCodes: Record<string, number> = {
      WELCOME10: subtotal.value * 0.1,
      SCHOOL2024: 5000,
      STUDENT15: subtotal.value * 0.15,
    };

    if (promoCodes[promoCode.value.toUpperCase()]) {
      promoDiscount.value = promoCodes[promoCode.value.toUpperCase()];
      // Afficher un message de succès
    } else {
      // Afficher un message d'erreur
      console.log("Code promo invalide");
    }
  } catch (error) {
    console.error("Erreur lors de l'application du code promo:", error);
  } finally {
    isApplyingPromo.value = false;
  }
};

// Fonction pour envoyer la commande sur WhatsApp
const sendToWhatsApp = async () => {
  console.log("🔄 Fonction sendToWhatsApp appelée");
  // Vérifier les éléments du panier
  console.log("🛒 Cart Items:", props.cartItems);
  console.log("🛒 Cart Items Length:", props.cartItems.length);

  if (props.cartItems.length === 0) {
    console.error("❌ Panier vide - redirection vers /cart");
    alert(
      "Votre panier est vide. Ajoutez des produits avant de passer commande."
    );
    router.push("/cart");
    return;
  }

  // Vérifier que les informations sont complètes
  console.log("✅ Validation Step 1:", isStep1Valid.value);
  console.log("✅ Validation Step 2:", isStep2Valid.value);
  console.log("📋 Form data:", {
    customer: form.customer,
    shipping: form.shipping,
    phonePrefix: phonePrefix.value,
    phoneNumber: phoneNumber.value,
  });

  if (!isStep1Valid.value || !isStep2Valid.value) {
    console.error("❌ Validation échouée - arrêt de l'envoi WhatsApp");
    alert(
      "Veuillez remplir au minimum votre nom, téléphone et adresse avant d'envoyer sur WhatsApp"
    );
    return;
  }

  try {
    // Préparer les données de commande
    const orderData = {
      customer: {
        name: form.customer.name,
        email: form.customer.email,
        phone: `${phonePrefix.value}${phoneNumber.value}`,
      },
      shipping: {
        address: form.shipping.address,
        city: form.shipping.city,
        method: form.shipping.method,
        cost: form.shipping.cost,
      },
      items: props.cartItems,
      amounts: {
        subtotal: subtotal.value,
        shipping: form.shipping.cost,
        discount: promoDiscount.value,
        total: totalAmount.value,
      },
    };

    // Formater le message WhatsApp avec les utilitaires
    const message = formatWhatsAppOrderMessage(orderData);
    console.log("📨 Message WhatsApp généré:", message);

    // Créer le lien WhatsApp
    const whatsappUrl = createWhatsAppLink(message);
    console.log("🔗 Lien WhatsApp généré:", whatsappUrl);

    // Sauvegarder la commande en attente
    let saveOrderResponse = null;
    try {
      saveOrderResponse = await saveOrderAsPending();
      console.log("💾 Commande sauvegardée en attente", saveOrderResponse);
    } catch (errSave) {
      console.error(
        "❌ Erreur lors de la sauvegarde de la commande en attente:",
        errSave
      );
      alert(
        "Erreur lors de la sauvegarde de la commande en attente. Veuillez réessayer ou contacter le support."
      );
      return;
    }

    // Vider le panier après commande WhatsApp réussie
    cartStore.clearCart();

    // Ouvrir WhatsApp
    let opened = false;
    try {
      const win = window.open(whatsappUrl, "_blank");
      if (win) {
        opened = true;
        win.focus();
        console.log("✅ Fenêtre WhatsApp ouverte avec succès");
      } else {
        console.warn("⚠️ window.open a retourné null (popup bloquée ?)");
      }
    } catch (err) {
      console.error("❌ Erreur lors de window.open:", err);
    }

    // Fallback si la fenêtre n'a pas pu s'ouvrir
    if (!opened) {
      try {
        window.location.href = whatsappUrl;
        console.log("➡️ Redirection directe vers WhatsApp");
      } catch (err2) {
        console.error("❌ Impossible d'ouvrir WhatsApp, lien:", whatsappUrl);
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(whatsappUrl);
          alert(
            "Impossible d'ouvrir WhatsApp automatiquement. Le lien a été copié dans votre presse-papier :\n" +
              whatsappUrl
          );
        } else {
          alert(
            "Impossible d'ouvrir WhatsApp automatiquement. Voici le lien à ouvrir manuellement :\n" +
              whatsappUrl
          );
        }
      }
    }

    // Notification de succès (si tout va bien)
    console.log("Commande envoyée sur WhatsApp avec succès");
    setTimeout(() => {
      router.push("/success?mode=whatsapp");
    }, 1500);
  } catch (error) {
    console.error("Erreur lors de l'envoi WhatsApp:", error);
    alert(
      "Erreur lors de la préparation de votre commande WhatsApp. Détail: " +
        (error?.message || error)
    );
  }
};

// Fonction pour sauvegarder la commande en attente
const saveOrderAsPending = async () => {
  try {
    const orderData = {
      customer: {
        name: form.customer.name,
        email: form.customer.email,
        phone: `${phonePrefix.value}${phoneNumber.value}`,
      },
      shipping: form.shipping,
      items: props.cartItems,
      amounts: {
        subtotal: subtotal.value,
        shipping: form.shipping.cost,
        discount: promoDiscount.value,
        total: totalAmount.value,
      },
      status: "pending_whatsapp",
      createdAt: new Date().toISOString(),
    };

    console.log(
      "[DEBUG] saveOrderAsPending - orderData:",
      JSON.stringify(orderData, null, 2)
    );

    const response = (await $fetch("/api/airtable/orders/create-pending", {
      method: "POST",
      body: orderData,
    })) as any;

    console.log("✅ Commande sauvegardée:", response);

    // Afficher un feedback si Google Sheets fonctionne
    if (response.googleSheets?.success) {
      console.log(
        "✅ Ajoutée à Google Sheets:",
        response.googleSheets.orderRef
      );
    } else {
      console.log("⚠️ Google Sheets non disponible, mais commande sauvegardée");
    }

    return response;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la sauvegarde (détail):",
      error,
      error?.response
    );
    if (error?.response) {
      alert("Erreur API: " + JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
};

// Fonction handleSubmit pour PayTech - TEMPORAIREMENT DÉSACTIVÉE
/*
const handleSubmit = async () => {
  if (!isStep3Valid.value || paymentMode.value !== "direct") return;

  isProcessing.value = true;

  try {
    form.amount = totalAmount.value;

    const paymentData = {
      amount: form.amount,
      currency: form.currency,
      customer: form.customer,
      items: form.items,
      shipping: form.shipping,
      target_payment: form.target_payment,
      promoCode: promoCode.value || undefined,
      promoDiscount: promoDiscount.value || undefined,
    };

    console.log("Initiation du paiement:", paymentData);

    const response = (await initiatePayment(paymentData)) as any;

    if (response.success && response.redirect_url) {
      // Redirection vers PayTech
      window.location.href = response.redirect_url;
    } else {
      throw new Error("Erreur lors de l'initiation du paiement");
    }
  } catch (error: any) {
    console.error("Erreur paiement:", error);
    // Afficher le message d'erreur à l'utilisateur
  } finally {
    isProcessing.value = false;
  }
};
*/
// Fonction pour ouvrir PayTech dans une popup
const openPayTechPopup = (paymentUrl: string) => {
  isPaymentPopupOpen.value = true;

  const popup = window.open(
    paymentUrl,
    "paytech-payment",
    "width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no"
  );

  if (!popup) {
    isPaymentPopupOpen.value = false;
    alert(
      "Veuillez autoriser les popups pour ce site pour procéder au paiement"
    );
    return;
  }

  // Surveiller la fermeture de la popup
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed);
      isPaymentPopupOpen.value = false;
      // Vérifier le statut du paiement
      checkPaymentStatus();
    }
  }, 1000);

  // Focus sur la popup
  popup.focus();
};

// Fonction pour vérifier le statut du paiement après fermeture de la popup
const checkPaymentStatus = async () => {
  try {
    // Ici vous pouvez appeler une API pour vérifier le statut du paiement
    // Pour l'instant, on simule une vérification
    console.log("Vérification du statut du paiement...");

    // Vous pouvez implémenter une vraie vérification ici
    // const response = await $fetch('/api/paytech/check-status', { method: 'POST' });

    // Pour l'instant, on affiche un message de succès
    alert(
      "Paiement en cours de traitement. Vous recevrez une confirmation par email."
    );

    // Vider le panier après paiement réussi
    cartStore.clearCart();

    // Rediriger vers la page de succès
    router.push("/payment/success");
  } catch (error) {
    console.error("Erreur lors de la vérification du paiement:", error);
    alert(
      "Erreur lors de la vérification du paiement. Veuillez contacter le support."
    );
  }
};

// Fonction pour initier directement le paiement PayTech
const initiateDirectPayment = async () => {
  console.log("Initiation directe du paiement PayTech");

  // Vérifier que les informations de base sont remplies
  if (!isStep1Valid.value || !isStep2Valid.value) {
    alert(
      "Veuillez d'abord remplir vos informations personnelles et d'adresse"
    );
    return;
  }

  isProcessing.value = true;

  try {
    form.amount = totalAmount.value;
    const paymentData = {
      amount: form.amount,
      currency: form.currency,
      customer: form.customer,
      items: form.items,
      shipping: form.shipping,
      // Pas de target_payment - laisser PayTech gérer le choix
      promoCode: promoCode.value || undefined,
      promoDiscount: promoDiscount.value || undefined,
    };

    console.log("Initiation directe du paiement PayTech:", paymentData);
    const response = (await initiatePayment(paymentData)) as any;

    if (response.success && response.redirect_url) {
      // Ouvrir PayTech dans une popup
      openPayTechPopup(response.redirect_url);
    } else {
      throw new Error("Erreur lors de l'initiation du paiement");
    }
  } catch (error: any) {
    console.error("Erreur paiement direct:", error);
    alert("Erreur lors de l'initiation du paiement. Veuillez réessayer.");
  } finally {
    isProcessing.value = false;
  }
};

// Fonctions de gestion des événements du dialogue PayTech
const handleInitiatePayment = (orderData: any) => {
  console.log("Initiation du paiement PayTech depuis le dialogue");
  // Ici vous pouvez ajouter une logique supplémentaire si nécessaire
};

const handleProceedToPayment = async (orderData: any) => {
  console.log("Procéder au paiement PayTech depuis le dialogue");
  isProcessing.value = true;

  try {
    // Utiliser la logique existante d'initiation du paiement
    await initiateDirectPayment();
  } catch (error) {
    console.error("Erreur lors du paiement PayTech:", error);
  } finally {
    isProcessing.value = false;
  }
};

// Gestion du succès du paiement PayTech
const handlePaymentSuccess = (paymentData: any) => {
  console.log("Paiement PayTech réussi:", paymentData);

  // Afficher un message de succès
  alert(
    `Paiement réussi !\n\nNuméro de commande: ${
      paymentData.orderNumber || "N/A"
    }\nMontant: ${formatPrice(
      paymentData.amount || totalAmount.value
    )}\nMéthode: ${
      paymentData.method || "PayTech"
    }\n\nVotre commande sera traitée sous 24h.`
  );

  // Vider le panier
  cartStore.clearCart();

  // Rediriger vers la page d'accueil
  navigateTo("/");
};

// Gestion des erreurs de paiement PayTech
const handlePaymentError = (error: any) => {
  console.error("Erreur de paiement PayTech:", error);

  // Afficher un message d'erreur
  alert(
    `Erreur lors du paiement:\n\n${
      error.message || "Une erreur inattendue s'est produite"
    }\n\nVeuillez réessayer ou choisir une autre méthode de paiement.`
  );
};

const handleSubmit = async () => {
  if (!isStep3Valid.value) return;
  isProcessing.value = true;
  try {
    form.amount = totalAmount.value;
    if (paymentMode.value === "direct") {
      const paymentData = {
        amount: form.amount,
        currency: form.currency,
        customer: form.customer,
        items: form.items,
        shipping: form.shipping,
        target_payment: form.target_payment,
        promoCode: promoCode.value || undefined,
        promoDiscount: promoDiscount.value || undefined,
      };
      console.log("Initiation du paiement:", paymentData);
      const response = (await initiatePayment(paymentData)) as any;
      if (response.success && response.redirect_url) {
        // Ouvrir PayTech dans une popup au lieu de rediriger
        openPayTechPopup(response.redirect_url);
      } else {
        throw new Error("Erreur lors de l'initiation du paiement");
      }
    } else if (paymentMode.value === "whatsapp") {
      // Rediriger vers sendToWhatsApp pour gérer la logique WhatsApp
      await sendToWhatsApp();
    }
  } catch (error: any) {
    console.error("Erreur paiement:", error);
    // Afficher le message d'erreur à l'utilisateur
  } finally {
    isProcessing.value = false;
  }
};

// Watchers
watch(
  () => phonePrefix.value,
  () => {
    formatPhoneNumber();
  }
);

// Initialization
onMounted(() => {
  // Pré-remplir avec les données du panier si disponible
  if (props.cartItems.length === 0) {
    router.push("/cart");
  }
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.btn-primary {
  background-color: #16a34a; /* primary-600 */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background-color: #15803d; /* primary-700 */
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
