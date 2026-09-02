// plugins/paytech-notifications.client.ts
export default defineNuxtPlugin(() => {
  // Écouter les événements de paiement depuis les fenêtres PayTech
  if (process.client) {
    const handlePaymentMessage = async (event: MessageEvent) => {
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

    // Solution de fallback : vider le panier si on détecte une redirection de succès
    const handlePageVisibility = () => {
      if (document.visibilityState === "visible") {
        // Vérifier si on revient d'une page de paiement
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess =
          urlParams.get("payment_success") ||
          urlParams.get("success") ||
          window.location.pathname.includes("success");

        if (paymentSuccess) {
          console.log("🔄 Détection retour paiement réussi - vidage panier");
          setTimeout(async () => {
            try {
              const { useCartStore } = await import("../stores/cart");
              const cartStore = useCartStore();
              if (
                cartStore &&
                cartStore.clearCart &&
                cartStore.items.length > 0
              ) {
                cartStore.clearCart();
                console.log("✅ Panier vidé (fallback après succès)");
              }
            } catch (error) {
              console.warn("⚠️ Erreur fallback vidage panier:", error);
            }
          }, 1000);
        }
      }
    };

    // Ajouter les listeners
    window.addEventListener("message", handlePaymentMessage);
    document.addEventListener("visibilitychange", handlePageVisibility);

    // Vérifier immédiatement au chargement de la page
    handlePageVisibility();

    // Nettoyer à la fermeture de page
    window.addEventListener("beforeunload", () => {
      window.removeEventListener("message", handlePaymentMessage);
      document.removeEventListener("visibilitychange", handlePageVisibility);
    });
  }
});
