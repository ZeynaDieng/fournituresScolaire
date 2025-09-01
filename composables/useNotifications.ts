// composables/useNotifications.ts
import { formatAmountForDisplay } from "~/utils/paytech";

interface NotificationOptions {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

export const useNotifications = () => {
  // Récupérer le service de notifications depuis le contexte
  const notifications = inject("notifications", null) as any;

  if (!notifications) {
    console.warn(
      "Service de notifications non trouvé. Assurez-vous que NotificationContainer est présent."
    );

    // Fallback vers des console.log
    return {
      success: (title: string, message?: string) =>
        console.log(`✅ ${title}`, message),
      error: (title: string, message?: string) =>
        console.error(`❌ ${title}`, message),
      warning: (title: string, message?: string) =>
        console.warn(`⚠️ ${title}`, message),
      info: (title: string, message?: string) =>
        console.info(`ℹ️ ${title}`, message),
      notify: (options: NotificationOptions) => console.log("📢", options),
      clear: () => console.log("🧹 Notifications cleared"),
    };
  }

  const success = (
    title: string,
    message?: string,
    options?: Partial<NotificationOptions>
  ) => {
    return notifications.add({
      type: "success",
      title,
      message,
      ...options,
    });
  };

  const error = (
    title: string,
    message?: string,
    options?: Partial<NotificationOptions>
  ) => {
    return notifications.add({
      type: "error",
      title,
      message,
      autoClose: false, // Les erreurs ne se ferment pas automatiquement par défaut
      ...options,
    });
  };

  const warning = (
    title: string,
    message?: string,
    options?: Partial<NotificationOptions>
  ) => {
    return notifications.add({
      type: "warning",
      title,
      message,
      ...options,
    });
  };

  const info = (
    title: string,
    message?: string,
    options?: Partial<NotificationOptions>
  ) => {
    return notifications.add({
      type: "info",
      title,
      message,
      ...options,
    });
  };

  const notify = (options: NotificationOptions) => {
    return notifications.add({
      type: "info",
      ...options,
    });
  };

  const clear = () => {
    notifications.clear();
  };

  // Méthodes spécifiques au paiement
  const paymentSuccess = (
    orderRef: string,
    amount: number,
    method?: string
  ) => {
    return success(
      "Paiement réussi !",
      `Votre commande ${orderRef} de ${formatAmountForDisplay(
        amount
      )} a été confirmée${method ? ` via ${method}` : ""}.`,
      { duration: 8000 }
    );
  };

  const paymentError = (reason?: string) => {
    return error(
      "Erreur de paiement",
      reason ||
        "Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.",
      { autoClose: false }
    );
  };

  const paymentCanceled = (orderRef?: string) => {
    return warning(
      "Paiement annulé",
      orderRef
        ? `Le paiement de la commande ${orderRef} a été annulé.`
        : "Votre paiement a été annulé. Vos articles sont toujours dans votre panier.",
      { duration: 6000 }
    );
  };

  const paymentPending = (orderRef: string) => {
    return info(
      "Paiement en cours",
      `Votre paiement pour la commande ${orderRef} est en cours de traitement.`,
      { duration: 10000 }
    );
  };

  const paymentRefunded = (orderRef: string, amount: number) => {
    return info(
      "Remboursement effectué",
      `Le remboursement de ${formatAmountForDisplay(
        amount
      )} pour la commande ${orderRef} a été traité.`,
      { duration: 8000 }
    );
  };

  return {
    // Méthodes générales
    success,
    error,
    warning,
    info,
    notify,
    clear,

    // Méthodes spécifiques au paiement
    paymentSuccess,
    paymentError,
    paymentCanceled,
    paymentPending,
    paymentRefunded,
  };
};
