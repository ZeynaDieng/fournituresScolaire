// Test direct de l'envoi d'email
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const EMAIL_CONFIG = {
  service: "gmail",
  user: process.env.NOTIFICATION_EMAIL_USER || "votre-email@gmail.com",
  password: process.env.NOTIFICATION_EMAIL_PASSWORD || "votre-mot-de-passe-app",
  adminEmail: process.env.ADMIN_EMAIL || "admin@fourniturescolaire.com",
  fromName: process.env.FROM_NAME || "Fournitures Scolaires",
};

console.log("Configuration email:", {
  user: EMAIL_CONFIG.user,
  adminEmail: EMAIL_CONFIG.adminEmail,
  fromName: EMAIL_CONFIG.fromName,
  hasPassword: !!EMAIL_CONFIG.password,
});

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.service,
      auth: {
        user: EMAIL_CONFIG.user,
        pass: EMAIL_CONFIG.password,
      },
    });

    const result = await transporter.sendMail({
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
      to: EMAIL_CONFIG.adminEmail,
      subject: "Test Direct Email - Nouvelle Commande TEST-DIRECT-001",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #2563eb;">🎒 Test Direct - Nouvelle Commande</h1>
          <p>Ceci est un test direct de l'envoi d'email depuis Node.js</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <h2>📋 Détails de la commande test</h2>
            <p><strong>Référence:</strong> TEST-DIRECT-001</p>
            <p><strong>Client:</strong> Test Direct Client</p>
            <p><strong>Total:</strong> 1000 CFA</p>
          </div>
          <p>Si vous recevez cet email, la configuration fonctionne !</p>
        </div>
      `,
    });

    console.log("✅ Email envoyé avec succès:", result.messageId);
    console.log("Response:", result.response);
    return true;
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
    return false;
  }
}

testEmail();
