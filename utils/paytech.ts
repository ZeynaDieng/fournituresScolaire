// utils/paytech.ts

/**
 * Utilitaires pour PayTech
 */

export interface PayTechCustomer {
  name: string;
  email: string;
  phone: string;
  id?: string;
}

export interface PayTechItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PayTechPaymentData {
  amount: number;
  customer: PayTechCustomer;
  items?: PayTechItem[];
  currency?: string;
  target_payment?: string;
  item_name?: string;
  ref_command?: string;
  promoCode?: string;
  promoDiscount?: number;
  shipping?: any;
}

/**
 * Formate un numéro de téléphone pour PayTech
 */
export function formatPhoneForPayTech(phone: string): string {
  // Enlever tous les espaces et caractères spéciaux
  let cleaned = phone.replace(/[^+\d]/g, "");

  // Si ça commence par +221, garder tel quel
  if (cleaned.startsWith("+221")) {
    return cleaned;
  }

  // Si ça commence par 221, ajouter le +
  if (cleaned.startsWith("221")) {
    return "+" + cleaned;
  }

  // Si ça commence par 7 (numéro local), ajouter +221
  if (cleaned.startsWith("7") && cleaned.length >= 9) {
    return "+221" + cleaned;
  }

  // Sinon, ajouter +221 par défaut
  return "+221" + cleaned;
}

/**
 * Valide un numéro de téléphone sénégalais
 */
export function validateSenegalPhone(phone: string): boolean {
  const formatted = formatPhoneForPayTech(phone);

  // Vérifier le format +221 suivi de 9 chiffres commençant par 7
  const regex = /^\+221[7]\d{8}$/;
  return regex.test(formatted);
}

/**
 * Génère une référence de commande unique
 */
export function generateOrderRef(prefix: string = "CMD"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Formate un montant pour PayTech (entier en CFA)
 */
export function formatAmountForPayTech(amount: number): number {
  // PayTech attend des montants en entier (pas de décimales)
  return Math.round(amount);
}

/**
 * Formate un montant pour l'affichage
 */
export function formatAmountForDisplay(
  amount: number,
  currency: string = "XOF"
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Valide les données d'un paiement PayTech
 */
export function validatePayTechData(data: PayTechPaymentData): string[] {
  const errors: string[] = [];

  // Vérifier le montant
  if (!data.amount || data.amount <= 0) {
    errors.push("Le montant doit être supérieur à 0");
  }

  if (data.amount < 100) {
    errors.push("Le montant minimum est de 100 XOF");
  }

  if (data.amount > 10000000) {
    errors.push("Le montant maximum est de 10,000,000 XOF");
  }

  // Vérifier le client
  if (!data.customer) {
    errors.push("Les informations client sont requises");
  } else {
    if (!data.customer.name || data.customer.name.trim().length < 2) {
      errors.push("Le nom du client est requis (minimum 2 caractères)");
    }

    if (!data.customer.email || !isValidEmail(data.customer.email)) {
      errors.push("Un email valide est requis");
    }

    if (!data.customer.phone || !validateSenegalPhone(data.customer.phone)) {
      errors.push("Un numéro de téléphone sénégalais valide est requis");
    }
  }

  // Vérifier les articles si fournis
  if (data.items) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      errors.push("Au moins un article est requis");
    } else {
      data.items.forEach((item, index) => {
        if (!item.name || item.name.trim().length === 0) {
          errors.push(`L'article ${index + 1} doit avoir un nom`);
        }

        if (!item.quantity || item.quantity <= 0) {
          errors.push(`L'article ${index + 1} doit avoir une quantité valide`);
        }

        if (!item.price || item.price <= 0) {
          errors.push(`L'article ${index + 1} doit avoir un prix valide`);
        }
      });
    }
  }

  return errors;
}

/**
 * Valide un email
 */
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Calcule le total d'une commande
 */
export function calculateOrderTotal(items: PayTechItem[]): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

/**
 * Nettoie et prépare les données pour PayTech
 */
export function preparePayTechData(data: PayTechPaymentData): any {
  const cleanedData: any = {
    ...data,
    amount: formatAmountForPayTech(data.amount),
    customer: {
      ...data.customer,
      phone: formatPhoneForPayTech(data.customer.phone),
      name: data.customer.name.trim(),
      email: data.customer.email.trim().toLowerCase(),
    },
    currency: data.currency || "XOF",
    ref_command: data.ref_command || generateOrderRef(),
  };

  // Nettoyer les champs optionnels vides
  Object.keys(cleanedData).forEach((key) => {
    if (
      cleanedData[key] === undefined ||
      cleanedData[key] === null ||
      cleanedData[key] === ""
    ) {
      delete cleanedData[key];
    }
  });

  return cleanedData;
}

/**
 * Méthodes de paiement supportées par PayTech
 */
export const PAYTECH_PAYMENT_METHODS = [
  {
    id: "mobile_money",
    name: "Mobile Money",
    description: "Orange Money, Free Money, Tigo Cash",
    icon: "📱",
  },
  {
    id: "orange_money",
    name: "Orange Money",
    description: "Paiement via Orange Money",
    icon: "🟠",
  },
  {
    id: "free_money",
    name: "Free Money",
    description: "Paiement via Free Money",
    icon: "🔵",
  },
  {
    id: "wave",
    name: "Wave",
    description: "Paiement via Wave",
    icon: "🌊",
  },
  {
    id: "carte_bancaire",
    name: "Carte Bancaire",
    description: "Visa, Mastercard",
    icon: "💳",
  },
] as const;

/**
 * Statuts de paiement PayTech
 */
export const PAYTECH_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELED: "canceled",
  REFUNDED: "refunded",
} as const;

/**
 * Types d'événements PayTech
 */
export const PAYTECH_EVENTS = {
  SALE_COMPLETE: "sale_complete",
  SALE_CANCELED: "sale_canceled",
  REFUND_COMPLETE: "refund_complete",
} as const;
