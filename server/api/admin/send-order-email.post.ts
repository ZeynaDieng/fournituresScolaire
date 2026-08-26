import { defineEventHandler, readBody } from "h3";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const order = body.order || body;

    const targetEmail = "zeynash1@gmail.com";
    const user = "zeynash1@gmail.com";
    const pass = "roaeavueygugiwpt";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: user.replace(/\s+/g, ""),
        pass: pass.replace(/\s+/g, ""),
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: "SSLv3",
      },
    });

    const formatPrice = (val: number) => {
      return new Intl.NumberFormat("fr-FR").format(val || 0) + " F CFA";
    };

    const items = order.items || [];
    const ref = order.orderRef || order.ref || `REF-${Date.now().toString().slice(-6)}`;
    const customerName = order.customerName || order.name || "Client EduShop";
    const phone = order.customerPhone || order.phone || "+221 77 000 00 00";
    const address = order.address || "Dakar";
    const delivery = (order.deliveryType === "store" || address.toLowerCase().includes("retrait")) ? "🏬 Retrait en Magasin (Ouakam, Dakar) — GRATUIT" : `🚚 Livraison à Domicile : ${address}`;
    const total = Number(order.total || order.amount || 0);

    const itemsTableRows = items.map((i: any) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #0f172a;">${i.name || i.title}</td>
        <td style="padding: 10px; text-align: center; font-weight: bold; color: #0F3D91;">${i.quantity || 1}x</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: #0F3D91;">${formatPrice(i.price || 0)}</td>
      </tr>
    `).join("");

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Nouvelle Commande #${ref} — EduShop Sénégal</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="border-bottom: 3px solid #0F3D91; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-space-between; align-items: center;">
          <div>
            <h1 style="color: #0F3D91; margin: 0; font-size: 22px; font-weight: 800;">🎒 EDUSHOP SÉNÉGAL</h1>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 12px;">Notification Automatique de Commande Client</p>
          </div>
          <div style="background-color: #0F3D91; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: bold;">
            RÉF: #${ref}
          </div>
        </div>

        <!-- Alerte Admin -->
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
          <h3 style="color: #0284c7; margin: 0 0 6px 0; font-size: 14px;">🛍️ Nouvelle commande validée sur EduShop !</h3>
          <p style="margin: 0; font-size: 12px; color: #0369a1;">
            Une nouvelle commande a été effectuée et doit être préparée par l'équipe logistique.
          </p>
        </div>

        <!-- Détails Client & Livraison -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
          <tr>
            <td style="width: 50%; padding: 12px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9; vertical-align: top;">
              <strong style="color: #0F3D91; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 6px;">COORDONNÉES CLIENT</strong>
              <strong>Nom :</strong> ${customerName}<br/>
              <strong>Téléphone :</strong> ${phone}<br/>
              <strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </td>
            <td style="width: 50%; padding: 12px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9; vertical-align: top;">
              <strong style="color: #0F3D91; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 6px;">LIVRAISON & PAIEMENT</strong>
              <strong>Mode :</strong> ${delivery}<br/>
              <strong>Moyen Règlement :</strong> ${order.paymentMethod || 'Wave / Orange Money'}<br/>
              <strong>Statut :</strong> <span style="color: #16a34a; font-weight: bold;">ACQUITTÉ</span>
            </td>
          </tr>
        </table>

        <!-- Liste des fournitures commandées -->
        <h3 style="color: #0f172a; font-size: 14px; margin-top: 24px; margin-bottom: 10px; border-left: 4px solid #0F3D91; padding-left: 10px;">
          📋 Fiche des fournitures & articles commandés
        </h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #0F3D91; color: #ffffff;">
              <th style="padding: 10px; text-align: left;">Article / Désignation</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Prix Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows.length > 0 ? itemsTableRows : `
              <tr>
                <td style="padding: 10px; font-weight: bold;">Pack Scolaire Complet</td>
                <td style="padding: 10px; text-align: center;">1x</td>
                <td style="padding: 10px; text-align: right;">${formatPrice(total)}</td>
              </tr>
            `}
          </tbody>
        </table>

        <!-- Total -->
        <div style="text-align: right; background-color: #f1f5f9; padding: 14px; border-radius: 12px; margin-top: 16px;">
          <span style="font-size: 14px; font-weight: 800; color: #0F3D91;">
            TOTAL COMMANDE : ${formatPrice(total)}
          </span>
        </div>

        <!-- Footer -->
        <div style="margin-top: 28px; pt-16px; border-top: 1px border-slate-200; text-align: center; color: #94a3b8; font-size: 11px;">
          EduShop Sénégal — Système d'envoi automatique d'emails<br/>
          Pour toute assistance, contactez +221 77 113 39 26
        </div>

      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: `"EduShop Sénégal" <${user}>`,
      to: targetEmail,
      subject: `🎒 Commande #${ref} (${formatPrice(total)}) — Notification Client & Logistique`,
      html: htmlContent,
    });

    return {
      success: true,
      message: `Email envoyé avec succès à ${targetEmail}`,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("❌ Erreur serveur envoi mail:", error);
    return {
      success: false,
      error: error.message || "Erreur d'envoi mail nodemailer",
    };
  }
});
