import assets from "~/public/images/b64-assets.json";

export interface OrderInvoiceData {
  ref: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  deliveryType?: "home" | "store";
  shippingFee?: number;
  configuratorChoice?: {
    level?: string;
    gender?: string;
    bag?: boolean;
    color?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export function printOfficialInvoice(order: OrderInvoiceData) {
  if (!process.client) return;

  const { logoB64, stampB64, sigB64 } = assets;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val || 0) + " F CFA";
  };

  // 1. Récupération dynamique 100% exacte des articles commandés (depuis order ou localStorage)
  let itemsToRender = (order.items && order.items.length > 0) ? order.items : [];
  if (itemsToRender.length === 0 && process.client) {
    try {
      const savedLast = localStorage.getItem("last_order");
      if (savedLast) {
        const parsedLast = JSON.parse(savedLast);
        if (parsedLast.items && parsedLast.items.length > 0) {
          itemsToRender = parsedLast.items;
        }
      }
    } catch (e) {}
  }

  // 2. Calcul mathématique dynamique 100% exact du sous-total des fournitures
  const itemsSubtotal = (itemsToRender.length > 0)
    ? itemsToRender.reduce((sum, item) => {
        const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
        const q = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity), 10) || 1;
        return sum + (p * q);
      }, 0)
    : (order.total || 0);

  // 3. Détermination exacte des frais de livraison (0 par défaut)
  const isStorePickup = order.deliveryType === 'store' || (order.address && order.address.toLowerCase().includes('retrait'));
  const shippingCost = isStorePickup ? 0 : (order.shippingFee !== undefined ? Number(order.shippingFee) : 0);

  // 4. Calcul exact du Total Général Acquitté (Sous-total + Livraison)
  const realGrandTotal = itemsSubtotal + shippingCost;

  // 5. Détection intelligente du parcours Assistant Rentrée Zen
  let configData = order.configuratorChoice;
  if (!configData && itemsToRender.length > 0) {
    const packItem = itemsToRender.find(i => (i.name && (i.name.toLowerCase().includes("pack") || i.name.toLowerCase().includes("sur-mesure"))));
    if (packItem) {
      configData = {
        level: packItem.name.replace(/^Pack\s+/i, '').replace(/\s*\(.*\)$/, '') || 'Pack Scolaire Conforme',
        gender: 'Élève',
        bag: packItem.name.toLowerCase().includes("sac") || packItem.name.toLowerCase().includes("navigateur"),
        color: 'Bleu Profond (#0F3D91)',
      };
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture Officielle #${order.ref || 'EDUSHOP'} — EduShop Sénégal</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-box {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #0F3D91;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .company-info {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      margin-top: 6px;
    }
    .invoice-badge {
      background: #0F3D91;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 13px;
      margin-bottom: 8px;
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .grid-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 20px;
      font-size: 12px;
    }
    .info-card {
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      line-height: 1.6;
    }
    .card-title {
      color: #0F3D91;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
      display: block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      font-size: 12px;
    }
    th {
      background: #0F3D91;
      color: #ffffff;
      padding: 12px;
      text-align: left;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    .total-box {
      margin-top: 20px;
      text-align: right;
      border-top: 2px solid #e2e8f0;
      padding-top: 16px;
    }
    .grand-total {
      font-size: 18px;
      font-weight: 800;
      color: #0F3D91;
      background: #f1f5f9;
      display: inline-block;
      padding: 10px 24px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
    }
    .validation-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .stamp-sig-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
    }
    .stamp-img {
      height: 110px;
      width: 110px;
      object-fit: contain;
      filter: invert(1) contrast(1.3);
    }
    .sig-img {
      height: 60px;
      width: auto;
      object-fit: contain;
      margin-top: 15px;
    }
    .print-btn-bar {
      margin-bottom: 20px;
      text-align: center;
    }
    .btn-print {
      background: #0F3D91;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(15,61,145,0.3);
    }
  </style>
</head>
<body>

  <div class="print-btn-bar no-print">
    <button onclick="window.print()" class="btn-print">🖨️ Enregistrer / Imprimer cette Facture PDF</button>
  </div>

  <div class="invoice-box">
    
    <!-- Header -->
    <div class="header">
      <div>
        <img src="${logoB64}" style="height: 55px; width: auto; display: block; margin-bottom: 10px;" alt="EduShop Logo" />
        <div class="company-info">
          <strong>Adresse :</strong> Ouakam, Dakar — Sénégal<br/>
          <strong>NINEA :</strong> 013125324 | <strong>RCCM :</strong> SN.DKR.2026.A.21376<br/>
          <strong>Tél :</strong> +221 77 113 39 26<br/>
          <strong>Email :</strong> contact@edushop.sn | <strong>Site :</strong> www.edushop.sn
        </div>
      </div>

      <div style="text-align: right;">
        <div class="invoice-badge">FACTURE OFFICIELLE</div>
        <div style="font-size: 12px; color: #334155; line-height: 1.6;">
          <strong>Réf. Facture :</strong> #FAC-${order.ref || '2026'}<br/>
          <strong>Date d'émission :</strong> ${order.createdAt || new Date().toLocaleDateString('fr-FR')}<br/>
          <strong>Règlement :</strong> <span style="color: #15803d; font-weight: bold;">ACQUITTÉ (${order.paymentMethod || 'WAVE / ORANGE MONEY'})</span>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid-info">
      <div class="info-card">
        <span class="card-title">INFORMATIONS DE LIVRAISON & CLIENT</span>
        <strong>Client :</strong> ${order.customerName || 'Client EduShop'}<br/>
        <strong>Téléphone :</strong> ${order.phone || '+221 77 000 00 00'}<br/>
        <strong>Adresse :</strong> ${order.address || 'Dakar'}, ${order.city || 'Dakar'}<br/>
        <strong>Email :</strong> ${order.email || 'client@edushop.sn'}
      </div>

      <div class="info-card">
        ${configData ? `
          <span class="card-title">PARCOURS ASSISTANT RENTRÉE ZEN</span>
          <strong>Niveau Sélectionné :</strong> ${configData.level || 'Programme Conforme'}<br/>
          <strong>Profil Élève :</strong> ${configData.gender === 'girl' ? 'Fille' : (configData.gender === 'boy' ? 'Garçon' : 'Élève')}<br/>
          <strong>Sac à Dos :</strong> ${configData.bag ? 'Inclus (Sac Ergonomique)' : 'Non requis'}<br/>
          <strong>Couleur Préférée :</strong> ${configData.color || 'Bleu Profond (#0F3D91)'}
        ` : `
          <span class="card-title">RÉSUMÉ COMMANDE BOUTIQUE</span>
          <strong>Canal d'Achat :</strong> Boutique EduShop Direct<br/>
          <strong>Statut Vente :</strong> Confirmée & Acquittée<br/>
          <strong>Garantie :</strong> Produits scolaires 100% conformes aux programmes<br/>
          <strong>Assistance 7j/7 :</strong> WhatsApp +221 77 113 39 26
        `}
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Désignation des Fournitures Scolaires</th>
          <th style="text-align: center;">Quantité</th>
          <th style="text-align: right;">Prix Unitaire</th>
          <th style="text-align: right;">Montant Total</th>
        </tr>
      </thead>
      <tbody>
        ${(itemsToRender && itemsToRender.length > 0) ? itemsToRender.map((item) => {
          const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
          const q = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity), 10) || 1;
          return `
            <tr>
              <td style="font-weight: 700; color: #1e293b;">${item.name}</td>
              <td style="text-align: center; font-weight: 700;">${q}</td>
              <td style="text-align: right;">${formatPrice(p)}</td>
              <td style="text-align: right; font-weight: 800; color: #0F3D91;">${formatPrice(p * q)}</td>
            </tr>
          `;
        }).join('') : `
          <tr>
            <td style="font-weight: 700; color: #1e293b;">Pack Fournitures Scolaires Officielles</td>
            <td style="text-align: center; font-weight: 700;">1</td>
            <td style="text-align: right;">${formatPrice(itemsSubtotal)}</td>
            <td style="text-align: right; font-weight: 800; color: #0F3D91;">${formatPrice(itemsSubtotal)}</td>
          </tr>
        `}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="total-box">
      <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
        Sous-total fournitures : ${formatPrice(itemsSubtotal)}
      </div>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
        ${isStorePickup
          ? 'Mode de livraison : <strong style="color: #0F3D91;">Retrait en magasin (Ouakam, Dakar) — GRATUIT</strong>'
          : (shippingCost === 0 
            ? 'Frais de livraison à domicile : <strong style="color: #15803d;">OFFERTE (Offert dès 30 000 F)</strong>' 
            : `Frais de livraison à domicile : <strong style="color: #0F3D91;">${formatPrice(shippingCost)}</strong>`)
        }
      </div>
      <div class="grand-total">
        TOTAL ACQUITTÉ : ${formatPrice(realGrandTotal)}
      </div>
    </div>

    <!-- Stamp & Electronic Signature -->
    <div class="validation-footer">
      <div style="font-size: 11px; color: #64748b; max-width: 320px; line-height: 1.5;">
        <strong>Certifié conforme & acquitté.</strong><br/>
        Facture officielle délivrée par EduShop Sénégal.<br/>
        Merci de votre confiance et excellente rentrée scolaire !
      </div>

      <div style="text-align: center;">
        <div style="font-size: 10px; font-weight: 800; color: #0F3D91; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
          CACHET OFFICIEL & SIGNATURE ÉLECTRONIQUE
        </div>
        
        <div class="stamp-sig-wrapper">
          <img src="${stampB64}" class="stamp-img" title="Cachet Officiel MATKAM" alt="Cachet Officiel MATKAM" />
          <img src="${sigB64}" class="sig-img" title="Signature Mme Dieng" alt="Signature Mme Dieng" />
        </div>

        <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 6px;">
          Mme Dieng — La Directrice MATKAM
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;

  // 1. Ouverture d'une fenêtre dédiée propre qui se charge instantanément à 100%
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  } else {
    // 2. Téléchargement direct du fichier HTML/PDF si le navigateur bloque les fenêtres
    const fileName = `Facture-EduShop-${order.ref || 'OFFICIELLE'}.html`;
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
