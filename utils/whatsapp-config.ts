// /utils/whatsapp-config.ts
export const WHATSAPP_CONFIG = {
  // Numéro WhatsApp de l'entreprise (format international sans le +)
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "221771133926",

  // Messages prédéfinis
  orderTemplate: {
    title: "*Nouvelle Commande - EduShop Sénégal* 📚",

    sections: {
      customer: "*CLIENT:*",
      delivery: "*LIVRAISON:*",
      items: "*ARTICLES:*",
      summary: "*RÉSUMÉ:*",
    },

    footer: "---\n✅ Commande prête pour validation et paiement Wave",
  },

  // Emojis
  emojis: {
    user: "👤",
    email: "📧",
    phone: "📱",
    address: "📍",
    city: "🏙️",
    delivery: "🚚",
    money: "💰",
    discount: "🎟️",
    total: "💳",
    product: "📦",
  },
};

// Fonction pour formater un message de commande WhatsApp
export const formatWhatsAppOrderMessage = (orderData: {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    method: string;
    cost: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  amounts: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
}) => {
  const { emojis, orderTemplate } = WHATSAPP_CONFIG;

  // Fonction helper pour formater les montants
  const formatAmount = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount) + " CFA"
    );
  };

  // En-tête
  let message = `${orderTemplate.title}\n\n`;

  // Informations client
  message += `${orderTemplate.sections.customer}\n`;
  message += `${emojis.user} Nom: ${orderData.customer.name}\n`;
  message += `${emojis.email} Email: ${orderData.customer.email}\n`;
  message += `${emojis.phone} Téléphone: ${orderData.customer.phone}\n\n`;

  // Informations de livraison
  message += `${orderTemplate.sections.delivery}\n`;
  message += `${emojis.address} Adresse: ${orderData.shipping.address}\n`;
  message += `${emojis.city} Ville: ${orderData.shipping.city}\n`;
  message += `${emojis.delivery} Méthode: ${orderData.shipping.method}\n\n`;

  // Articles
  message += `${orderTemplate.sections.items}\n`;
  orderData.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   • Quantité: ${item.quantity}\n`;
    message += `   • Prix unitaire: ${formatAmount(item.price)}\n`;
    message += `   • Sous-total: ${formatAmount(item.price * item.quantity)}\n`;
  });

  // Résumé financier
  message += `\n${orderTemplate.sections.summary}\n`;
  message += `${emojis.money} Sous-total: ${formatAmount(
    orderData.amounts.subtotal
  )}\n`;
  message += `${emojis.delivery} Livraison: ${formatAmount(
    orderData.amounts.shipping
  )}\n`;

  if (orderData.amounts.discount > 0) {
    message += `${emojis.discount} Réduction: -${formatAmount(
      orderData.amounts.discount
    )}\n`;
  }

  message += `${emojis.total} *TOTAL: ${formatAmount(
    orderData.amounts.total
  )}*\n\n`;

  // Pied de page
  message += orderTemplate.footer;

  return message;
};

// Fonction pour créer le lien WhatsApp
export const createWhatsAppLink = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.businessNumber}?text=${encodedMessage}`;
};
