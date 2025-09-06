// Composable simple pour les notifications
export const useNotification = () => {
  const success = (message: string) => {
    if (typeof window !== "undefined") {
      // Solution temporaire avec alert, vous pouvez remplacer par une librairie de toast plus tard
      console.log("✅ Success:", message);

      // Créer une notification visuelle simple
      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          max-width: 300px;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ ${message}
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;

      document.body.appendChild(notification);

      // Supprimer après 3 secondes
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideIn 0.3s ease-out reverse";
          setTimeout(() => {
            notification.remove();
          }, 300);
        }
      }, 3000);
    }
  };

  const error = (message: string) => {
    if (typeof window !== "undefined") {
      console.error("❌ Error:", message);

      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          max-width: 300px;
          animation: slideIn 0.3s ease-out;
        ">
          ❌ ${message}
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideIn 0.3s ease-out reverse";
          setTimeout(() => {
            notification.remove();
          }, 300);
        }
      }, 3000);
    }
  };

  const info = (message: string) => {
    if (typeof window !== "undefined") {
      console.log("ℹ️ Info:", message);

      const notification = document.createElement("div");
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3b82f6;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          max-width: 300px;
          animation: slideIn 0.3s ease-out;
        ">
          ℹ️ ${message}
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideIn 0.3s ease-out reverse";
          setTimeout(() => {
            notification.remove();
          }, 300);
        }
      }, 3000);
    }
  };

  return {
    success,
    error,
    info,
  };
};
