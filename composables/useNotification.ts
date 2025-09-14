// Composable simple pour les notifications
export const useNotification = () => {
  const success = (message: string) => {
    if (typeof window !== "undefined") {
      console.log("✅ Success:", message);
      alert(`✅ ${message}`);
    }
  };

  const error = (message: string) => {
    if (typeof window !== "undefined") {
      console.error("❌ Error:", message);
      alert(`❌ ${message}`);
    }
  };

  const info = (message: string) => {
    if (typeof window !== "undefined") {
      console.log("ℹ️ Info:", message);
      alert(`ℹ️ ${message}`);
    }
  };

  return {
    success,
    error,
    info,
  };
};
