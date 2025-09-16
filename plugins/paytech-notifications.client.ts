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

          // Vider le panier après paiement réussi
          try {
            const { useCartStore } = await import("../stores/cart");
            const cartStore = useCartStore();
            if (cartStore && cartStore.clearCart) {
              cartStore.clearCart();
              console.log("✅ Panier vidé après paiement PayTech");
            }
          } catch (error) {
            console.warn("⚠️ Erreur lors du vidage du panier:", error);
          }

          // Afficher une notification de succès au lieu de rediriger
          if (data.ref_command) {
            // Afficher une notification toast ou modal
            alert(
              `Paiement réussi !\n\nNuméro de commande: ${data.ref_command}\n\nVous pouvez maintenant rechercher votre commande pour télécharger la facture.`
            );

            // Optionnel: rediriger vers la page de recherche de commande
            // navigateTo(`/orders/search?ref=${data.ref_command}`);
          }
        } else if (data.type === "payment_canceled") {
          // Paiement annulé
          console.log("Paiement annulé reçu:", data);

          // Afficher une notification d'annulation
          if (data.ref_command) {
            alert(
              `Paiement annulé pour la commande ${data.ref_command}.\n\nVous pouvez réessayer le paiement.`
            );
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
