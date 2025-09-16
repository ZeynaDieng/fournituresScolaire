/**
 * 🧪 Test de configuration des emails
 *
 * Ce script teste la configuration email et envoie un email de test
 */

require("dotenv").config();

console.log("🧪 TEST CONFIGURATION EMAIL");
console.log("============================");

async function testEmailConfig() {
  try {
    console.log("\n📋 ÉTAPE 1: Vérification des variables d'environnement");
    console.log("------------------------------------------------------");

    // Vérifier les variables d'environnement
    const emailVars = {
      EMAIL_SERVICE: process.env.EMAIL_SERVICE,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
        ? "***configuré***"
        : undefined,
      NOTIFICATION_EMAIL_USER: process.env.NOTIFICATION_EMAIL_USER,
      NOTIFICATION_EMAIL_PASSWORD: process.env.NOTIFICATION_EMAIL_PASSWORD
        ? "***configuré***"
        : undefined,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      FROM_EMAIL: process.env.FROM_EMAIL,
      FROM_NAME: process.env.FROM_NAME,
    };

    console.log("📊 Variables d'environnement email:");
    let allConfigured = true;

    for (const [key, value] of Object.entries(emailVars)) {
      if (value) {
        console.log(`✅ ${key}: ${value}`);
      } else {
        console.log(`❌ ${key}: NON CONFIGURÉ`);
        allConfigured = false;
      }
    }

    if (!allConfigured) {
      console.log("\n❌ PROBLÈME: Variables d'environnement manquantes");
      console.log(
        "💡 SOLUTION: Ajoutez les variables manquantes dans votre fichier .env"
      );
      console.log("");
      console.log("Variables requises:");
      console.log("- EMAIL_SERVICE (ex: gmail)");
      console.log("- EMAIL_USER (votre email)");
      console.log("- EMAIL_PASSWORD (mot de passe d'application)");
      console.log("- ADMIN_EMAIL (email admin)");
      console.log("- FROM_NAME (nom de l'expéditeur)");
      return;
    }

    console.log("\n✅ Toutes les variables d'environnement sont configurées");

    console.log("\n📋 ÉTAPE 2: Test de création du transporteur email");
    console.log("--------------------------------------------------");

    // Tester la création du transporteur
    try {
      const nodemailer = require("nodemailer");

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      console.log("✅ Transporteur email créé avec succès");

      console.log("\n📋 ÉTAPE 3: Test de connexion SMTP");
      console.log("-----------------------------------");

      // Tester la connexion
      await transporter.verify();
      console.log("✅ Connexion SMTP réussie");

      console.log("\n📋 ÉTAPE 4: Envoi d'email de test");
      console.log("----------------------------------");

      // Envoyer un email de test
      const testEmail = {
        from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "🧪 Test de configuration email - Fournitures Scolaires",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0;">✅ Test Email Réussi</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Configuration email fonctionnelle</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Configuration testée :</h2>
              <ul style="color: #333; margin: 0; padding-left: 20px;">
                <li>Service: ${process.env.EMAIL_SERVICE}</li>
                <li>Utilisateur: ${process.env.EMAIL_USER}</li>
                <li>Admin: ${process.env.ADMIN_EMAIL}</li>
                <li>Expéditeur: ${process.env.FROM_NAME}</li>
              </ul>
            </div>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #16a34a; margin-top: 0;">✅ Résultat du test</h3>
              <p style="color: #333; margin: 0;">Votre configuration email est fonctionnelle !</p>
              <p style="color: #333; margin: 10px 0 0 0;">Les emails de commande seront maintenant envoyés automatiquement.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; margin: 0; font-size: 14px;">Test automatique - Système Fournitures Scolaires</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(testEmail);
      console.log("✅ Email de test envoyé avec succès");
      console.log(`📧 Destinataire: ${process.env.ADMIN_EMAIL}`);
    } catch (error) {
      console.log("❌ Erreur lors du test email:", error.message);

      if (error.message.includes("Invalid login")) {
        console.log("💡 SOLUTION: Vérifiez votre mot de passe d'application");
        console.log(
          "   - Assurez-vous que l'authentification à 2 facteurs est activée"
        );
        console.log("   - Générez un nouveau mot de passe d'application");
      } else if (error.message.includes("ENOTFOUND")) {
        console.log("💡 SOLUTION: Vérifiez votre connexion internet");
      } else {
        console.log("💡 SOLUTION: Vérifiez votre configuration email");
      }
      return;
    }

    console.log("\n📋 ÉTAPE 5: Test des fonctions email de l'application");
    console.log("-----------------------------------------------------");

    // Tester les fonctions de l'application
    try {
      const {
        sendCustomerConfirmationEmail,
        sendAdminNotificationEmail,
      } = require("../utils/email-service");

      console.log("✅ Fonctions email importées avec succès");

      // Test avec des données fictives
      const testOrderData = {
        orderRef: "TEST_EMAIL_1234567890_abc123",
        customerName: "Test Client",
        customerEmail: process.env.ADMIN_EMAIL, // Envoyer à l'admin pour le test
        customerPhone: "+221777780456",
        amount: 5000,
        paymentMethod: "Test Email",
        items: [
          {
            name: "Pack Scolaire Test",
            quantity: 1,
            price: 5000,
          },
        ],
      };

      console.log("🧪 Test envoi email client...");
      const clientResult = await sendCustomerConfirmationEmail(testOrderData);
      console.log(
        `📧 Email client: ${clientResult ? "✅ Envoyé" : "❌ Échec"}`
      );

      console.log("🧪 Test envoi email admin...");
      const adminResult = await sendAdminNotificationEmail(testOrderData);
      console.log(`📧 Email admin: ${adminResult ? "✅ Envoyé" : "❌ Échec"}`);
    } catch (error) {
      console.log("❌ Erreur test fonctions email:", error.message);
    }

    console.log("\n📋 RÉSUMÉ DU TEST");
    console.log("==================");
    console.log("✅ Variables d'environnement configurées");
    console.log("✅ Transporteur email créé");
    console.log("✅ Connexion SMTP réussie");
    console.log("✅ Email de test envoyé");
    console.log("✅ Fonctions email testées");
    console.log("");
    console.log("🎉 CONFIGURATION EMAIL FONCTIONNELLE !");
    console.log("");
    console.log("💡 PROCHAINES ÉTAPES:");
    console.log("1. Testez une vraie commande");
    console.log("2. Vérifiez que les emails sont reçus");
    console.log("3. Vérifiez les spams si nécessaire");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testEmailConfig().catch(console.error);
