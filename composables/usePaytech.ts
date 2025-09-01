// composables/usePaytech.ts
import type { Ref } from "vue";
import { useNotifications } from "./useNotifications";

interface PaymentData {
  amount: number;
  customer: {
    id?: string | number;
    name: string;
    email: string;
    phone: string;
  };
  items?: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping?: {
    address: string;
    method: string;
    cost: number;
  };
  target_payment?: string;
  currency?: string;
  ref_command?: string;
  promoCode?: string;
  promoDiscount?: number;
}

interface PaymentResponse {
  success: boolean;
  token?: string;
  redirect_url?: string;
  ref_command?: string;
  amount?: number;
  payment_method?: string;
  data?: any;
}

interface PaymentStatus {
  status: string;
  payment_method?: string;
  amount?: number;
  ref_command?: string;
  success: boolean;
  data?: any;
}

export const usePaytech = () => {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Mode mock pour le développement local (contourne le problème HTTPS)
  const useMockMode = ref(
    process.dev || !config.public.baseUrl?.includes("https")
  );

  // Méthodes de paiement disponibles selon la doc Paytech
  const availablePaymentMethods = [
    "Orange Money",
    "Orange Money CI",
    "Orange Money ML",
    "Mtn Money CI",
    "Moov Money CI",
    "Moov Money ML",
    "Wave",
    "Wave CI",
    "Wizall",
    "Carte Bancaire",
    "Emoney",
    "Tigo Cash",
    "Free Money",
    "Moov Money BJ",
    "Mtn Money BJ",
  ];

  // Initier un paiement
  const initiatePayment = async (
    paymentData: PaymentData
  ): Promise<PaymentResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Validation des données côté client
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error("Le montant doit être supérieur à 0");
      }

      if (
        !paymentData.customer.name ||
        !paymentData.customer.email ||
        !paymentData.customer.phone
      ) {
        throw new Error("Les informations du client sont requises");
      }

      // Formatage du numéro de téléphone
      let phone = paymentData.customer.phone;
      if (!phone.startsWith("+")) {
        // Ajouter l'indicatif sénégalais par défaut
        phone = phone.startsWith("221") ? `+${phone}` : `+221${phone}`;
      }

      const payload = {
        ...paymentData,
        customer: {
          ...paymentData.customer,
          phone,
        },
      };

      console.log("Initiation du paiement Paytech:", payload);

      // Choisir l'endpoint selon le mode
      const endpoint = useMockMode.value
        ? "/api/paytech-mock/initiate"
        : "/api/paytech/initiate";
      console.log(
        `Mode ${useMockMode.value ? "MOCK" : "REAL"} - Endpoint: ${endpoint}`
      );

      const response = await $fetch<PaymentResponse>(endpoint, {
        method: "POST",
        body: payload,
      });

      if (!response.success) {
        throw new Error("Erreur lors de l'initiation du paiement");
      }

      return response;
    } catch (err: any) {
      error.value = err.message || "Erreur lors du paiement";
      console.error("Erreur paiement Paytech:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Rediriger vers la page de paiement
  const redirectToPayment = (paymentUrl: string) => {
    if (process.client) {
      window.location.href = paymentUrl;
    }
  };

  // Ouvrir le paiement dans une popup (Web SDK simulation)
  const openPaymentPopup = (paymentUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!process.client) {
        resolve(false);
        return;
      }

      const popup = window.open(
        paymentUrl,
        "paytech_payment",
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      if (!popup) {
        console.error("Popup bloquée par le navigateur");
        resolve(false);
        return;
      }

      // Surveiller la fermeture de la popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Ici vous pourriez vérifier le statut du paiement
          resolve(true);
        }
      }, 1000);

      // Timeout après 10 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (!popup.closed) {
          popup.close();
        }
        resolve(false);
      }, 600000);
    });
  };

  // Vérifier le statut d'un paiement
  const checkPaymentStatus = async (token: string): Promise<PaymentStatus> => {
    try {
      const response = await $fetch<PaymentStatus>(
        `/api/paytech/status/${token}`
      );
      return response;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la vérification du statut";
      throw err;
    }
  };

  // Effectuer un remboursement (admin uniquement)
  const refundPayment = async (refCommand: string): Promise<any> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch("/api/paytech/refund", {
        method: "POST",
        body: { ref_command: refCommand },
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Erreur lors du remboursement";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Construire l'URL avec pré-remplissage pour méthode unique
  const buildAutofillUrl = (
    baseUrl: string,
    customer: PaymentData["customer"],
    paymentMethod: string
  ): string => {
    if (!paymentMethod || paymentMethod.includes(",")) {
      return baseUrl; // Pas d'autofill pour méthodes multiples
    }

    const phone = customer.phone.startsWith("+")
      ? customer.phone
      : `+221${customer.phone}`;
    const nationalNumber = phone.replace("+221", "");

    const params = new URLSearchParams({
      pn: phone,
      nn: nationalNumber,
      fn: customer.name,
      tp: paymentMethod,
      nac: paymentMethod === "Carte Bancaire" ? "0" : "1",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  // Helpers pour les méthodes de paiement
  const getPaymentMethodsByCountry = (country: string = "SN") => {
    const methodsByCountry: Record<string, string[]> = {
      SN: ["Orange Money", "Wave", "Free Money", "Carte Bancaire"],
      CI: [
        "Orange Money CI",
        "Wave CI",
        "Mtn Money CI",
        "Moov Money CI",
        "Carte Bancaire",
      ],
      ML: ["Orange Money ML", "Moov Money ML", "Carte Bancaire"],
      BJ: ["Moov Money BJ", "Mtn Money BJ", "Carte Bancaire"],
    };

    return methodsByCountry[country] || methodsByCountry["SN"];
  };

  const formatAmount = (amount: number, currency: string = "XOF"): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    // States
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    initiatePayment,
    redirectToPayment,
    openPaymentPopup,
    checkPaymentStatus,
    refundPayment,
    buildAutofillUrl,

    // Helpers
    availablePaymentMethods,
    getPaymentMethodsByCountry,
    formatAmount,

    // Clear error
    clearError: () => {
      error.value = null;
    },
  };
};
