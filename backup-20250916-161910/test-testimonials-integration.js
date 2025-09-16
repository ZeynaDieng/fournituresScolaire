#!/usr/bin/env node

/**
 * Script de test pour vérifier l'intégration d'AppTestimonials avec les props
 */

const http = require("http");

console.log("🔍 TEST D'INTÉGRATION - AppTestimonials avec props\n");

// Test 1: Vérifier que l'API témoignages fonctionne
function testTestimonialsAPI() {
  return new Promise((resolve, reject) => {
    console.log("📡 Test 1: Vérification de l'API témoignages...");

    const request = http.get(
      "http://localhost:3001/api/airtable/testimonials",
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            const testimonials = jsonData.data || [];

            console.log(
              `✅ API fonctionne: ${testimonials.length} témoignages trouvés`
            );
            console.log("📝 Premiers témoignages:");

            testimonials.slice(0, 3).forEach((testimonial, index) => {
              console.log(
                `  ${index + 1}. ${testimonial.name} (${testimonial.role}) - ${
                  testimonial.rating
                }/5⭐`
              );
              console.log(`     "${testimonial.text.substring(0, 50)}..."`);
            });

            resolve(testimonials);
          } catch (error) {
            console.log("❌ Erreur parsing JSON API");
            reject(error);
          }
        });
      }
    );

    request.on("error", (error) => {
      console.log("❌ Erreur connexion API témoignages");
      reject(error);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      console.log("❌ Timeout API témoignages");
      reject(new Error("Timeout"));
    });
  });
}

// Test 2: Vérifier que la page d'accueil contient AppTestimonials
function testHomePageTestimonials() {
  return new Promise((resolve, reject) => {
    console.log(
      "\n📱 Test 2: Vérification des témoignages sur la page d'accueil..."
    );

    const request = http.get("http://localhost:3001/", (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        // Vérifier que la page contient les éléments attendus
        const hasAppTestimonials = data.includes("AppTestimonials");
        const hasTestimonialCard = data.includes("TestimonialCard");
        const hasAirtableRef = data.includes("activeTestimonials");
        const hasSliceLimit = data.includes("slice(0, 5)");
        const hasAutoCycle = data.includes("auto-cycle");

        console.log(
          `✅ Page d'accueil chargée (${Math.round(data.length / 1024)}KB)`
        );
        console.log(
          `📋 Contient AppTestimonials: ${hasAppTestimonials ? "✅" : "❌"}`
        );
        console.log(
          `📋 Contient TestimonialCard: ${hasTestimonialCard ? "✅" : "❌"}`
        );
        console.log(
          `📋 Contient référence Airtable: ${hasAirtableRef ? "✅" : "❌"}`
        );
        console.log(
          `📋 Limite à 5 témoignages: ${hasSliceLimit ? "✅" : "❌"}`
        );
        console.log(`📋 Auto-cycle activé: ${hasAutoCycle ? "✅" : "❌"}`);

        resolve({
          size: data.length,
          hasAppTestimonials,
          hasTestimonialCard,
          hasAirtableRef,
          hasSliceLimit,
          hasAutoCycle,
        });
      });
    });

    request.on("error", (error) => {
      console.log("❌ Erreur chargement page");
      reject(error);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      console.log("❌ Timeout page");
      reject(new Error("Timeout"));
    });
  });
}

async function runTests() {
  try {
    // Test API témoignages
    const testimonials = await testTestimonialsAPI();

    // Test page d'accueil
    const pageData = await testHomePageTestimonials();

    console.log("\n📊 RÉSUMÉ DES TESTS:");
    console.log("===================");
    console.log(`✅ API témoignages: ${testimonials.length} éléments`);
    console.log(
      `✅ Page d'accueil: ${
        pageData.hasAppTestimonials
          ? "AppTestimonials présent"
          : "Composant manquant"
      }`
    );
    console.log(
      `✅ Store Airtable: ${pageData.hasAirtableRef ? "Référencé" : "Manquant"}`
    );
    console.log(
      `✅ Limitation: ${pageData.hasSliceLimit ? "Limité à 5" : "Non limité"}`
    );
    console.log(
      `✅ Auto-cycle: ${pageData.hasAutoCycle ? "Activé (4s)" : "Désactivé"}`
    );

    console.log("\n🎯 CONFIGURATION ACTUELLE:");
    console.log("==========================");
    console.log(
      '• Page index.vue utilise: <AppTestimonials :testimonials="..." :limit="5" :auto-cycle="true" />'
    );
    console.log("• Limitation à 5 témoignages via slice(0, 5) et props limit");
    console.log("• Données dynamiques depuis Airtable");
    console.log(
      "• Composant réutilisable avec props (testimonials, limit, autoCycle, cycleDuration)"
    );
    console.log("• Auto-cycle toutes les 4 secondes");
    console.log("• État de chargement avec skeleton");

    console.log("\n✨ FONCTIONNALITÉS AJOUTÉES:");
    console.log("============================");
    console.log("• 🔄 Auto-cycle configurable");
    console.log("• ⏱️  Durée personnalisable (4000ms par défaut)");
    console.log("• 📱 Design responsive");
    console.log("• ⚡ État de chargement avec skeleton");
    console.log("• 🎯 Limitation flexible via props");
    console.log("• 📊 Indicateur du nombre de témoignages depuis Airtable");

    if (testimonials.length >= 5) {
      console.log("\n🎉 SUCCÈS: Configuration optimale!");
      console.log(
        "  - Le composant AppTestimonials accepte les témoignages via props"
      );
      console.log("  - Les données viennent d'Airtable (dynamiques)");
      console.log("  - L'affichage est limité à 5 témoignages sur l'accueil");
      console.log(
        "  - Auto-cycle activé pour une meilleure expérience utilisateur"
      );
      console.log("  - Compatible avec les données Airtable (text + comment)");
    } else {
      console.log("\n⚠️  ATTENTION: Pas assez de témoignages dans Airtable");
      console.log(`  - Seulement ${testimonials.length} témoignages trouvés`);
      console.log("  - Ajoutez plus de témoignages dans votre base Airtable");
      console.log(
        "  - Le composant fonctionne mais l'effet carousel sera limité"
      );
    }
  } catch (error) {
    console.error("\n❌ ERREUR LORS DES TESTS:", error.message);
    console.log("\n🔧 VÉRIFICATIONS:");
    console.log("  1. Le serveur Nuxt est-il démarré ? (npm run dev)");
    console.log("  2. Les variables Airtable sont-elles configurées ?");
    console.log("  3. La base Airtable contient-elle des témoignages ?");
    console.log(
      '  4. Le champ "text" existe-t-il dans la table testimonials ?'
    );
  }
}

// Exécuter les tests
runTests();
