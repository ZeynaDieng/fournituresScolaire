// plugins/paytech-notifications.client.ts
export default defineNuxtPlugin(() => {
  // Écouter les événements de paiement depuis les fenêtres PayTech
  if (process.client) {
    const handlePaymentMessage = (event: MessageEvent) => {
      // Vérifier que le message vient de PayTech
      if (!event.origin.includes("paytech.sn")) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "payment_complete") {
          // Paiement réussi
          console.log("Paiement réussi reçu:", data);

          // Rediriger vers la page de succès
          if (data.ref_command) {
            navigateTo(
              `/payment/success?ref=${data.ref_command}&method=${
                data.payment_method || ""
              }`
            );
          }
        } else if (data.type === "payment_canceled") {
          // Paiement annulé
          console.log("Paiement annulé reçu:", data);

          // Rediriger vers la page d'annulation
          if (data.ref_command) {
            navigateTo(`/payment/cancel?ref=${data.ref_command}`);
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement du message PayTech:", error);
      }
    };

    // Ajouter le listener
    window.addEventListener("message", handlePaymentMessage);

    // Nettoyer à la destruction
    onBeforeUnmount(() => {
      window.removeEventListener("message", handlePaymentMessage);
    });
  }
});
