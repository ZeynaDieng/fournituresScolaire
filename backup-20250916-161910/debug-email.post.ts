import { defineEventHandler } from "h3";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  try {
    // Vérifier les variables d'environnement
    const emailConfig = {
      service: "gmail",
      user: process.env.NOTIFICATION_EMAIL_USER,
      password: process.env.NOTIFICATION_EMAIL_PASSWORD,
      adminEmail: process.env.ADMIN_EMAIL,
      fromName: process.env.FROM_NAME,
    };

    console.log("🔍 Configuration email détectée:", {
      user: emailConfig.user,
      password: emailConfig.password ? "SET" : "NOT SET",
      adminEmail: emailConfig.adminEmail,
      fromName: emailConfig.fromName,
    });

    // Vérifier si les variables sont définies
    if (!emailConfig.user || !emailConfig.password) {
      return {
        success: false,
        error: "Variables d'environnement manquantes",
        config: emailConfig,
        message:
          "Vérifiez que NOTIFICATION_EMAIL_USER et NOTIFICATION_EMAIL_PASSWORD sont définis dans .env",
      };
    }

    // Créer le transporteur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });

    // Tester la connexion
    console.log("🔌 Test de connexion SMTP...");
    await transporter.verify();
    console.log("✅ Connexion SMTP réussie");

    // Envoyer un email de test simple
    const testEmail = {
      from: `"${emailConfig.fromName}" <${emailConfig.user}>`,
      to: emailConfig.adminEmail,
      subject: "🧪 Test Email - " + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a;">✅ Test Email Réussi</h1>
          <p>Ceci est un email de test pour vérifier que la configuration fonctionne.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
          <p><strong>Serveur:</strong> ${
            process.env.NODE_ENV || "development"
          }</p>
        </div>
      `,
    };

    console.log("📧 Envoi de l'email de test...");
    const result = await transporter.sendMail(testEmail);
    console.log("✅ Email envoyé avec succès:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
      config: {
        user: emailConfig.user,
        adminEmail: emailConfig.adminEmail,
        fromName: emailConfig.fromName,
      },
      message: "Email de test envoyé avec succès ! Vérifiez votre boîte mail.",
    };
  } catch (error) {
    console.error("❌ Erreur détaillée:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      stack: error instanceof Error ? error.stack : undefined,
      message:
        "Échec de l'envoi d'email. Vérifiez les logs pour plus de détails.",
    };
  }
});
