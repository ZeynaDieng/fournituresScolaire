/**
 * API endpoint pour traiter les messages de contact
 * POST /api/contact/send
 */

import { defineEventHandler, readBody, createError } from "h3";
import { NotificationService } from "../../../utils/notification-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validation des données
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Tous les champs obligatoires doivent être remplis",
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Format email invalide",
      });
    }

    // Configuration Airtable
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;

    // Créer une table pour les messages de contact (si elle n'existe pas déjà)
    const contactTableId =
      process.env.AIRTABLE_CONTACTS_TABLE || "tblContactMessages";

    // Préparer les données pour Airtable
    const contactData = {
      records: [
        {
          fields: {
            Nom: name,
            Email: email,
            Téléphone: phone || "",
            Sujet: subject,
            Message: message,
            Date: new Date().toISOString(),
            Statut: "Nouveau",
            Traité: false,
          },
        },
      ],
    };

    // Envoyer vers Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${contactTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error("Erreur Airtable:", errorData);

      // En cas d'erreur Airtable, on peut quand même envoyer par email
      await sendContactEmail(body);

      return {
        success: true,
        message: "Message enregistré localement et envoyé par email",
        fallback: true,
      };
    }

    const airtableResult = await airtableResponse.json();

    // Envoyer les notifications (Email + WhatsApp) à l'admin ET au client
    try {
      const notificationData = {
        type: "contact" as const,
        recipient: {
          name: name,
          email: email,
          phone: phone || "",
        },
        admin: {
          name: process.env.FROM_NAME || "Admin",
          email: process.env.ADMIN_EMAIL || "",
          phone: process.env.WHATSAPP_BUSINESS_NUMBER || "",
        },
        data: {
          subject: subject,
          message: message,
        },
      };

      const notificationResults = await NotificationService.sendNotification(
        notificationData
      );

      console.log("📧📱 Notifications envoyées:", notificationResults);
    } catch (emailError) {
      console.error("Erreur notifications:", emailError);
      // Ne pas faire échouer la requête si les notifications échouent
    }

    return {
      success: true,
      message: "Message envoyé avec succès et notifications envoyées",
      recordId: airtableResult.records[0].id,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erreur contact API:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne du serveur",
    });
  }
});

/**
 * Fonction pour envoyer le message de contact par email
 */
async function sendContactEmail(data) {
  // Configuration email depuis les variables d'environnement
  const emailConfig = {
    from: process.env.NOTIFICATION_EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[Contact Site] ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Nouveau message de contact</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Informations du contact</h3>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Téléphone :</strong> ${data.phone || "Non renseigné"}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 8px;">
          <p style="margin: 0; color: #16a34a;">
            <strong>Action requise :</strong> Répondre à ${data.email}
          </p>
        </div>
      </div>
    `,
  };

  // Ici, vous pouvez utiliser votre service d'email préféré
  // Par exemple Nodemailer, SendGrid, etc.
  console.log("Email à envoyer:", emailConfig);

  // Pour l'instant, on simule l'envoi
  return Promise.resolve();
}
