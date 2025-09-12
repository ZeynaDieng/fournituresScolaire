<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 bg-gray-50">
          <h1 class="text-3xl font-bold text-gray-900">Mentions Légales</h1>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            En vigueur au 30/08/2025
          </p>
        </div>

        <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <!-- Éditeur du site -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Éditeur du site</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>EduShop Sénégal</p>
                <p>Ouakam Cité Avion, Dakar</p>
                <p>Email : contact@edushop.sn</p>
                <p>Téléphone : +221 78 291 18 44</p>
                <p class="mt-2">RCCM : SN-DKR-2023-B-12345</p>
                <p>NINEA : 0043212345</p>
              </dd>
            </div>

            <!-- Directeur de la publication -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Directeur de la publication
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>Zeyna Dieng</p>
                <p>Gérante</p>
              </dd>
            </div>

            <!-- Hébergement -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Hébergement</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>Netlify Inc.</p>
                <p>
                  2325 3rd Street, Suite 215, San Francisco, California 94107,
                  États-Unis
                </p>
                <p>
                  Site web :
                  <a
                    href="https://www.netlify.com"
                    class="text-primary-600 hover:text-primary-800"
                    >www.netlify.com</a
                  >
                </p>
              </dd>
            </div>

            <!-- Propriété intellectuelle -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Propriété intellectuelle
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p class="mb-2">
                  L'ensemble des éléments constituant le site (textes, images,
                  vidéos, logos, etc.) est la propriété exclusive d'EduShop ou
                  de ses partenaires. Toute reproduction, représentation,
                  utilisation ou adaptation, sous quelque forme que ce soit, de
                  tout ou partie des éléments du site sans l'accord préalable et
                  écrit d'EduShop est strictement interdite et constituerait un
                  acte de contrefaçon sanctionné par les articles L.335-2 et
                  suivants du Code de la propriété intellectuelle.
                </p>
                <p>
                  Les marques et logos figurant sur le site sont des marques
                  déposées. Toute reproduction, imitation ou usage, total ou
                  partiel, de ces marques sans l'accord préalable et écrit de
                  leurs propriétaires est strictement interdite.
                </p>
              </dd>
            </div>

            <!-- Protection des données -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Protection des données personnelles
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p class="mb-2">
                  Conformément à la loi n°2008-12 du 25 janvier 2008 portant sur
                  la protection des données à caractère personnel, vous disposez
                  d'un droit d'accès, de rectification, de modification et de
                  suppression des données qui vous concernent.
                </p>
                <p>Pour exercer ce droit, vous pouvez nous contacter :</p>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    Par email :
                    <a
                      href="mailto:donnees-personnelles@edushop.sn"
                      class="text-primary-600 hover:text-primary-800"
                      >donnees-personnelles@edushop.sn</a
                    >
                  </li>
                  <li>
                    Par courrier : EduShop - Service Données Personnelles,
                    Ouakam Cité Avion, Dakar, Sénégal
                  </li>
                </ul>
                <p class="mt-2">
                  Pour plus d'informations sur la manière dont nous traitons vos
                  données, consultez notre
                  <NuxtLink
                    to="/confidentialite"
                    class="text-primary-600 hover:text-primary-800"
                    >Politique de confidentialité</NuxtLink
                  >.
                </p>
              </dd>
            </div>

            <!-- Cookies -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Cookies</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p class="mb-2">
                  Le site utilise des cookies pour améliorer votre expérience de
                  navigation et vous proposer des services et offres adaptés. En
                  poursuivant votre navigation, vous acceptez l'utilisation de
                  ces cookies.
                </p>
                <p>
                  Pour en savoir plus et paramétrer les cookies, consultez notre
                  <NuxtLink
                    to="/cookies"
                    class="text-primary-600 hover:text-primary-800"
                    >Politique relative aux cookies</NuxtLink
                  >.
                </p>
              </dd>
            </div>

            <!-- Droit applicable et juridiction compétente -->
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Droit applicable et juridiction compétente
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p class="mb-2">
                  Les présentes mentions légales sont soumises au droit
                  sénégalais. En cas de litige, les tribunaux sénégalais seront
                  seuls compétents.
                </p>
                <p>
                  La langue du présent contrat est la langue française. En cas
                  de contradiction entre la version française et une traduction,
                  la version française prévaudra.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
// Utilisation du layout par défaut
definePageMeta({
  layout: "default",
});

// SEO et métadonnées
useHead({
  title: "Mentions Légales - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Consultez les mentions légales du site EduShop, votre partenaire pour les fournitures scolaires au Sénégal.",
    },
  ],
});
</script>

<style scoped>
/* Styles spécifiques à la page Mentions Légales */
dl {
  margin: 0;
}

dt {
  font-weight: 500;
  color: #4b5563;
}

dd {
  margin: 0;
}

/* Style pour les liens dans le contenu */
a {
  @apply text-primary-600 hover:text-primary-800 transition-colors duration-200;
}

/* Amélioration de la lisibilité sur mobile */
@media (max-width: 640px) {
  .sm\:grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .sm\:col-span-2 {
    grid-column: 1;
  }

  .sm\:px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .sm\:py-5 {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }
}
</style>
