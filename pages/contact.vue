<template>
  <div class="min-h-screen">
    <!-- Hero Section -->

    <!-- Contact Section -->
    <section class="py-16 bg-green-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Envoyez-nous un message
              </h2>
              <p class="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans
                les plus brefs délais.
              </p>
            </div>

            <form @submit.prevent="sendMessage" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Nom complet</label
                  >
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Email</label
                  >
                  <input
                    type="email"
                    id="email"
                    v-model="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Téléphone (optionnel)</label
                >
                <input
                  type="tel"
                  id="phone"
                  v-model="phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div>
                <label
                  for="subject"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Sujet</label
                >
                <select
                  id="subject"
                  v-model="subject"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Information produit</option>
                  <option value="livraison">Livraison</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label
                  for="message"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Message</label
                >
                <textarea
                  id="message"
                  v-model="message"
                  required
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <!-- Boutons d'action -->
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg
                    v-if="isLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  {{ isLoading ? "Envoi en cours..." : "Envoyer le message" }}
                </button>

                <!-- Bouton de test debug -->
              </div>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- WhatsApp Card -->
            <div class="bg-green-700 rounded-2xl shadow-xl p-8 text-white">
              <div class="flex items-center mb-6">
                <div
                  class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.688"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold">Commande rapide</h3>
                  <p class="text-green-100">WhatsApp Business</p>
                </div>
              </div>
              <p class="text-green-100 mb-6">
                Besoin d'une commande urgente ? Contactez-nous directement sur
                WhatsApp pour un service ultra-rapide !
              </p>
              <a
                href="https://wa.me/22177770456"
                target="_blank"
                class="inline-flex items-center bg-white text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.688"
                  />
                </svg>
                Discuter maintenant
              </a>
            </div>

            <!-- Contact Details -->
            <div class="bg-white rounded-2xl shadow-xl p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">
                Nos coordonnées
              </h3>

              <div class="space-y-6">
                <div class="flex items-start">
                  <div
                    class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Adresse</h4>
                    <p class="text-gray-600">Rue Exemple</p>
                    <p class="text-gray-600">Dakar, Sénégal</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div
                    class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Téléphone</h4>
                    <p class="text-gray-600">+221 77 770 456</p>
                    <p class="text-sm text-gray-500">
                      Service client disponible
                    </p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div
                    class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      Horaires d'ouverture
                    </h4>
                    <p class="text-gray-600">Lundi - Vendredi : 8h00 - 18h00</p>
                    <p class="text-gray-600">Samedi : 8h00 - 16h00</p>
                    <p class="text-gray-600">Dimanche : Fermé</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div
                    class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                  >
                    <svg
                      class="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Email</h4>
                    <p class="text-gray-600">contact@fournitures-scolaire.sn</p>
                    <p class="text-sm text-gray-500">Réponse sous 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p class="text-xl text-gray-600">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="border border-gray-200 rounded-lg"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <span class="font-semibold text-gray-900">{{
                faq.question
              }}</span>
              <svg
                :class="{ 'rotate-180': faq.isOpen }"
                class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div v-if="faq.isOpen" class="px-6 pb-4">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Form fields
const name = ref("");
const email = ref("");
const phone = ref("");
const subject = ref("");
const message = ref("");
const isLoading = ref(false);

// Computed pour vérifier si on peut envoyer sur WhatsApp
const canSendWhatsApp = computed(() => {
  return name.value.trim() && subject.value.trim() && message.value.trim();
});

// Configuration WhatsApp
const WHATSAPP_BUSINESS_NUMBER = "221782911844";

// FAQ data
const faqs = ref([
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Nous livrons généralement sous 24-48h à Dakar et 2-3 jours en région. Les commandes passées avant 14h sont traitées le jour même.",
    isOpen: false,
  },
  {
    question: "Proposez-vous des remises pour les écoles ?",
    answer:
      "Oui, nous offrons des tarifs préférentiels pour les commandes groupées d'établissements scolaires. Contactez-nous pour obtenir un devis personnalisé.",
    isOpen: false,
  },
  {
    question: "Comment puis-je passer commande ?",
    answer:
      "Vous pouvez commander directement sur notre site web, via WhatsApp au +221 77 770 456, ou en nous contactant par téléphone.",
    isOpen: false,
  },
  {
    question: "Acceptez-vous les paiements à la livraison ?",
    answer:
      "Oui, nous acceptons le paiement à la livraison ainsi que les virements bancaires et les paiements mobile money.",
    isOpen: false,
  },
  {
    question: "Que faire si un produit est défectueux ?",
    answer:
      "Nous offrons une garantie de satisfaction. Si un produit est défectueux, contactez-nous dans les 7 jours suivant la réception pour un échange ou remboursement.",
    isOpen: false,
  },
]);

// Fonction pour envoyer via WhatsApp
function sendViaWhatsApp() {
  console.log("🟡 Fonction sendViaWhatsApp appelée");
  console.log("🟡 canSendWhatsApp:", canSendWhatsApp.value);
  console.log("🟡 name:", name.value);
  console.log("🟡 subject:", subject.value);
  console.log("🟡 message:", message.value);

  if (!canSendWhatsApp.value) {
    console.log("❌ Impossible d'envoyer - champs manquants");
    alert("Veuillez remplir au minimum votre nom, le sujet et votre message.");
    return;
  }

  // Créer le message WhatsApp formaté
  let whatsappMessage = `*Nouveau Message de Contact*\n\n`;
  whatsappMessage += `👤 *Nom:* ${name.value}\n`;

  if (email.value) {
    whatsappMessage += `📧 *Email:* ${email.value}\n`;
  }

  if (phone.value) {
    whatsappMessage += `📱 *Téléphone:* ${phone.value}\n`;
  }

  whatsappMessage += `📋 *Sujet:* ${subject.value}\n\n`;
  whatsappMessage += `💬 *Message:*\n${message.value}\n\n`;
  whatsappMessage += `---\n⏰ Envoyé depuis le site EduShop Sénégal`;

  // Encoder le message pour l'URL
  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Créer le lien WhatsApp
  const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;

  console.log("🟡 WhatsApp URL:", whatsappUrl);

  // Ouvrir WhatsApp
  try {
    const opened = window.open(whatsappUrl, "_blank");
    if (opened) {
      console.log("✅ WhatsApp ouvert avec succès");
    } else {
      console.log("❌ Popup bloquée, tentative de redirection");
      window.location.href = whatsappUrl;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ouverture WhatsApp:", error);
    // Fallback: copier le lien dans le presse-papier
    navigator.clipboard
      ?.writeText(whatsappUrl)
      .then(() => {
        alert("Le lien WhatsApp a été copié dans votre presse-papier !");
      })
      .catch(() => {
        alert(
          `Impossible d'ouvrir WhatsApp automatiquement. Lien: ${whatsappUrl}`
        );
      });
  }

  // Optionnel: vider le formulaire après envoi
  // name.value = "";
  // email.value = "";
  // phone.value = "";
  // subject.value = "";
  // message.value = "";
}

async function sendMessage() {
  if (!name.value || !email.value || !subject.value || !message.value) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  isLoading.value = true;

  try {
    // Appel API pour enregistrer le message
    const response: any = await $fetch("/api/contact/send", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        phone: phone.value,
        subject: subject.value,
        message: message.value,
      },
    });

    if (response.success) {
      alert(
        `Merci ${name.value}, votre message a été envoyé et enregistré ! Nous vous répondrons dans les plus brefs délais.`
      );

      // Reset form
      name.value = "";
      email.value = "";
      phone.value = "";
      subject.value = "";
      message.value = "";
    } else {
      throw new Error(response.message || "Erreur lors de l'envoi");
    }
  } catch (error) {
    console.error("Erreur envoi message:", error);
    alert(
      "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer ou nous contacter directement."
    );
  } finally {
    isLoading.value = false;
  }
}

function toggleFaq(index: number) {
  faqs.value[index].isOpen = !faqs.value[index].isOpen;
}

// Fonction de test simple pour WhatsApp
function testWhatsApp() {
  const testUrl = `https://wa.me/221782911844?text=Test depuis EduShop`;
  console.log("Test WhatsApp URL:", testUrl);
  window.open(testUrl, "_blank");
}
</script>
