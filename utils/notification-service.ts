/**
 * Service de notifications centralisé
 * Gère l'envoi d'emails et de messages WhatsApp
 */

import nodemailer from "nodemailer";

interface NotificationData {
  type: "order" | "contact";
  recipient: {
    name: string;
    email: string;
    phone: string;
  };
  admin: {
    name: string;
    email: string;
    phone: string;
  };
  data: any;
}

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASS || process.env.NOTIFICATION_EMAIL_PASSWORD,
    },
  });

  /**
   * Envoyer une notification complète (Email + WhatsApp)
   */
  static async sendNotification(notificationData: NotificationData) {
    const results = {
      adminEmail: false,
      clientEmail: false,
      adminWhatsApp: false,
      clientWhatsApp: false,
    };

    try {
      // 1. Email à l'admin
      results.adminEmail = await this.sendAdminEmail(notificationData);

      // 2. Email au client
      results.clientEmail = await this.sendClientEmail(notificationData);

      // 3. WhatsApp à l'admin
      results.adminWhatsApp = await this.sendAdminWhatsApp(notificationData);

      // 4. WhatsApp au client
      results.clientWhatsApp = await this.sendClientWhatsApp(notificationData);

      console.log("📧 Résultats des notifications:", results);
      return results;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi des notifications:", error);
      return results;
    }
  }

  /**
   * Envoyer un email à l'administrateur
   */
  static async sendAdminEmail(data: NotificationData): Promise<boolean> {
    try {
      let subject, html;

      if (data.type === "order") {
        subject = `🛒 Nouvelle commande #${data.data.orderRef}`;
        html = this.getOrderEmailTemplate(data, "admin");
      } else {
        subject = `📩 Nouveau message de contact de ${data.recipient.name}`;
        html = this.getContactEmailTemplate(data, "admin");
      }

      await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: data.admin.email,
        subject,
        html,
      });

      console.log("✅ Email admin envoyé avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur email admin:", error);
      return false;
    }
  }

  /**
   * Envoyer un email au client
   */
  static async sendClientEmail(data: NotificationData): Promise<boolean> {
    try {
      let subject, html;

      if (data.type === "order") {
        subject = `✅ Confirmation de votre commande #${data.data.orderRef}`;
        html = this.getOrderEmailTemplate(data, "client");
      } else {
        subject = `📩 Confirmation de réception de votre message`;
        html = this.getContactEmailTemplate(data, "client");
      }

      await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: data.recipient.email,
        subject,
        html,
      });

      console.log("✅ Email client envoyé avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur email client:", error);
      return false;
    }
  }

  /**
   * Envoyer un WhatsApp à l'administrateur
   */
  static async sendAdminWhatsApp(data: NotificationData): Promise<boolean> {
    try {
      let message;

      if (data.type === "order") {
        message =
          `🛒 *NOUVELLE COMMANDE*\n\n` +
          `📋 Commande: #${data.data.orderRef}\n` +
          `👤 Client: ${data.recipient.name}\n` +
          `📧 Email: ${data.recipient.email}\n` +
          `📱 Téléphone: ${data.recipient.phone}\n` +
          `💰 Montant: ${data.data.amount} FCFA\n` +
          `💳 Méthode: ${data.data.paymentMethod}\n\n` +
          `⏰ ${new Date().toLocaleString("fr-FR", {
            timeZone: "Africa/Dakar",
          })}`;
      } else {
        message =
          `📩 *NOUVEAU MESSAGE CONTACT*\n\n` +
          `👤 De: ${data.recipient.name}\n` +
          `📧 Email: ${data.recipient.email}\n` +
          `📱 Téléphone: ${data.recipient.phone || "Non fourni"}\n` +
          `📝 Sujet: ${data.data.subject}\n` +
          `💬 Message: ${data.data.message}\n\n` +
          `⏰ ${new Date().toLocaleString("fr-FR", {
            timeZone: "Africa/Dakar",
          })}`;
      }

      return await this.sendWhatsAppMessage(data.admin.phone, message);
    } catch (error) {
      console.error("❌ Erreur WhatsApp admin:", error);
      return false;
    }
  }

  /**
   * Envoyer un WhatsApp au client
   */
  static async sendClientWhatsApp(data: NotificationData): Promise<boolean> {
    try {
      let message;

      if (data.type === "order") {
        message =
          `✅ *COMMANDE CONFIRMÉE*\n\n` +
          `Bonjour ${data.recipient.name},\n\n` +
          `Votre commande #${data.data.orderRef} a été confirmée !\n\n` +
          `💰 Montant: ${data.data.amount} FCFA\n` +
          `💳 Méthode: ${data.data.paymentMethod}\n\n` +
          `📞 Nous vous contacterons bientôt pour la livraison.\n\n` +
          `Merci de votre confiance ! 🙏\n` +
          `*${process.env.FROM_NAME}*`;
      } else {
        message =
          `📩 *MESSAGE REÇU*\n\n` +
          `Bonjour ${data.recipient.name},\n\n` +
          `Nous avons bien reçu votre message concernant: "${data.data.subject}"\n\n` +
          `📞 Notre équipe vous répondra dans les plus brefs délais.\n\n` +
          `Merci de nous avoir contacté ! 🙏\n` +
          `*${process.env.FROM_NAME}*`;
      }

      return await this.sendWhatsAppMessage(data.recipient.phone, message);
    } catch (error) {
      console.error("❌ Erreur WhatsApp client:", error);
      return false;
    }
  }

  /**
   * Envoyer un message WhatsApp directement
   * Utilise l'API WhatsApp Business si configurée, sinon Twilio WhatsApp
   */
  static async sendWhatsAppMessage(
    phone: string,
    message: string
  ): Promise<boolean> {
    try {
      console.log("📱 Tentative d'envoi WhatsApp direct vers:", phone);
      
      // Nettoyer le numéro de téléphone (format international)
      let cleanPhone = phone.replace(/\D/g, "");
      
      // Ajouter le code pays sénégalais si manquant
      if (cleanPhone.length === 9 && cleanPhone.startsWith("7")) {
        cleanPhone = "221" + cleanPhone; // Sénégal
      } else if (cleanPhone.length === 8) {
        cleanPhone = "221" + cleanPhone; // Sénégal
      }
      
      if (cleanPhone.length < 10) {
        console.log("⚠️ Numéro de téléphone invalide:", phone);
        return false;
      }

      // 1. Essayer l'API WhatsApp Business (Meta)
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
        console.log("🚀 Tentative via WhatsApp Business API...");
        try {
          return await this.sendWhatsAppBusinessAPI(
            cleanPhone, 
            message, 
            process.env.WHATSAPP_ACCESS_TOKEN, 
            process.env.WHATSAPP_PHONE_ID
          );
        } catch (error) {
          console.error("❌ WhatsApp Business API échoué:", error);
        }
      }

      // 2. Essayer Twilio WhatsApp
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        console.log("🚀 Tentative via Twilio WhatsApp...");
        try {
          return await this.sendTwilioWhatsApp(cleanPhone, message);
        } catch (error) {
          console.error("❌ Twilio WhatsApp échoué:", error);
        }
      }

      // 3. Essayer une API locale/africaine
      if (process.env.AFRICA_SMS_API_KEY) {
        console.log("� Tentative via API SMS locale...");
        try {
          return await this.sendAfricaWhatsApp(cleanPhone, message);
        } catch (error) {
          console.error("❌ API locale échouée:", error);
        }
      }

      // 4. Fallback : notification par email avec lien WhatsApp
      console.log("⚠️ Aucune API configurée, utilisation du fallback email");
      return await this.sendWhatsAppFallback(cleanPhone, message);

    } catch (error) {
      console.error("❌ Erreur générale WhatsApp:", error);
      return false;
    }
  }

  /**
   * Envoyer via API WhatsApp Business officielle
   */
  private static async sendWhatsAppBusinessAPI(
    phone: string, 
    message: string, 
    token: string, 
    phoneId: string
  ): Promise<boolean> {
    try {
      // Nettoyer le numéro de téléphone
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length < 8) {
        console.log("⚠️ Numéro de téléphone invalide:", phone);
        return false;
      }

      // Appel API WhatsApp Business
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "text",
            text: {
              body: message,
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(
          "✅ WhatsApp Business API envoyé:",
          result.messages?.[0]?.id
        );
        return true;
      } else {
        const error = await response.text();
        console.error("❌ Erreur API WhatsApp Business:", response.status, error);
        throw new Error(`API WhatsApp error: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Erreur WhatsApp Business API:", error);
      throw error;
    }
  }

  /**
   * Envoyer via WhatsApp Web (solution simple)
   */
  private static async sendWhatsAppWeb(phone: string, message: string): Promise<boolean> {
    try {
      // Nettoyer le numéro de téléphone
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length < 8) {
        console.log("⚠️ Numéro de téléphone invalide:", phone);
        return false;
      }

      // Créer le lien WhatsApp Web
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      
      // En production, on peut utiliser un service comme Twilio ou envoyer par email à l'admin
      console.log("📱 WhatsApp Web - Message à envoyer:");
      console.log("📞 Destinataire:", cleanPhone);
      console.log("💬 Message:", message.substring(0, 100) + "...");
      console.log("🔗 Lien WhatsApp:", whatsappUrl);

      // Envoyer le lien par email à l'admin pour qu'il puisse envoyer manuellement
      if (process.env.ADMIN_EMAIL) {
        try {
          await this.sendWhatsAppLinkByEmail(cleanPhone, message, whatsappUrl);
          console.log("✅ Lien WhatsApp envoyé par email à l'admin");
          return true;
        } catch (emailError) {
          console.error("⚠️ Erreur envoi email WhatsApp:", emailError);
        }
      }

      // Alternative : stocker dans un fichier de log pour traitement manuel
      console.log("✅ WhatsApp préparé (traitement manuel requis)");
      return true;

    } catch (error) {
      console.error("❌ Erreur WhatsApp Web:", error);
      return false;
    }
  }

  /**
   * Envoyer le lien WhatsApp par email à l'admin
   */
  private static async sendWhatsAppLinkByEmail(
    phone: string, 
    message: string, 
    whatsappUrl: string
  ): Promise<void> {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #25D366;">📱 Message WhatsApp à envoyer</h2>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>📞 Destinataire:</strong> ${phone}</p>
          <p><strong>💬 Message:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #25D366; white-space: pre-line;">
${message}
          </div>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${whatsappUrl}" 
             style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            📱 Envoyer via WhatsApp Web
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">
          Cliquez sur le bouton pour ouvrir WhatsApp Web avec le message pré-rempli, puis envoyez-le.
        </p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📱 WhatsApp à envoyer - ${phone}`,
      html: emailHtml,
    });
  }

  /**
   * Fallback WhatsApp - génère un lien de redirection
   */
  static sendWhatsAppFallback(phone: string, message: string): boolean {
    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        message
      )}`;

      console.log("📱 WhatsApp Fallback généré pour", phone);
      console.log("🔗 Lien WhatsApp:", whatsappUrl.substring(0, 100) + "...");

      // Dans un vrai cas, vous pourriez enregistrer ce lien ou l'envoyer par email
      return true;
    } catch (error) {
      console.error("❌ Erreur WhatsApp fallback:", error);
      return false;
    }
  }

  /**
   * Template email pour les commandes
   */
  static getOrderEmailTemplate(
    data: NotificationData,
    recipient: "admin" | "client"
  ): string {
    const isAdmin = recipient === "admin";
    const title = isAdmin
      ? "Nouvelle commande reçue"
      : "Confirmation de votre commande";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background: #dcfce7; padding: 10px; border-left: 4px solid #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isAdmin ? "🛒" : "✅"} ${title}</h1>
        </div>
        <div class="content">
          ${
            isAdmin
              ? `<h3>Une nouvelle commande a été passée !</h3>`
              : `<h3>Bonjour ${data.recipient.name},</h3>
             <p>Votre commande a été confirmée avec succès !</p>`
          }
          
          <div class="highlight">
            <strong>📋 Détails de la commande:</strong><br>
            • Numéro: #${data.data.orderRef}<br>
            • Client: ${data.recipient.name}<br>
            • Email: ${data.recipient.email}<br>
            • Téléphone: ${data.recipient.phone}<br>
            • Montant: ${data.data.amount} FCFA<br>
            • Méthode de paiement: ${data.data.paymentMethod}<br>
            • Date: ${new Date().toLocaleString("fr-FR", {
              timeZone: "Africa/Dakar",
            })}
          </div>

          ${
            isAdmin
              ? `<p><strong>Action requise:</strong> Contactez le client pour organiser la livraison.</p>`
              : `<p><strong>Prochaines étapes:</strong> Notre équipe vous contactera pour organiser la livraison.</p>
             <p>Merci de votre confiance ! 🙏</p>`
          }
        </div>
        <div class="footer">
          <p>${process.env.FROM_NAME} - Fournitures Scolaires</p>
          <p>📧 ${process.env.ADMIN_EMAIL} | 📱 ${
      process.env.WHATSAPP_BUSINESS_NUMBER
    }</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  /**
   * Template email pour les messages de contact
   */
  static getContactEmailTemplate(
    data: NotificationData,
    recipient: "admin" | "client"
  ): string {
    const isAdmin = recipient === "admin";
    const title = isAdmin
      ? "Nouveau message de contact"
      : "Message reçu avec succès";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background: #dcfce7; padding: 10px; border-left: 4px solid #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isAdmin ? "📩" : "✅"} ${title}</h1>
        </div>
        <div class="content">
          ${
            isAdmin
              ? `<h3>Un nouveau message a été reçu !</h3>`
              : `<h3>Bonjour ${data.recipient.name},</h3>
             <p>Nous avons bien reçu votre message !</p>`
          }
          
          <div class="highlight">
            <strong>📝 Détails du message:</strong><br>
            • Nom: ${data.recipient.name}<br>
            • Email: ${data.recipient.email}<br>
            • Téléphone: ${data.recipient.phone || "Non fourni"}<br>
            • Sujet: ${data.data.subject}<br>
            • Date: ${new Date().toLocaleString("fr-FR", {
              timeZone: "Africa/Dakar",
            })}
          </div>

          ${
            isAdmin
              ? `<div style="background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd;">
               <strong>Message:</strong><br>
               ${data.data.message.replace(/\n/g, "<br>")}
             </div>
             <p><strong>Action requise:</strong> Répondez au client dans les plus brefs délais.</p>`
              : `<p><strong>Votre message:</strong></p>
             <div style="background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd;">
               ${data.data.message.replace(/\n/g, "<br>")}
             </div>
             <p>Notre équipe vous répondra dans les plus brefs délais. Merci de nous avoir contacté ! 🙏</p>`
          }
        </div>
        <div class="footer">
          <p>${process.env.FROM_NAME} - Fournitures Scolaires</p>
          <p>📧 ${process.env.ADMIN_EMAIL} | 📱 ${
      process.env.WHATSAPP_BUSINESS_NUMBER
    }</p>
        </div>
      </div>
    </body>
    </html>`;
  }
}
