/**
 * Design Tokens - EduShop Fournitures Scolaires
 * Système de design professionnel et cohérent
 */

export const designTokens = {
  // Couleurs principales
  colors: {
    // Palette de marque éducative
    brand: {
      primary: "#0ea5e9", // Bleu confiance
      secondary: "#64748b", // Gris professionnel
      accent: "#eab308", // Jaune éducation
      success: "#22c55e", // Vert succès
      warning: "#f59e0b", // Orange attention
      danger: "#ef4444", // Rouge erreur
    },

    // Couleurs texte
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#64748b",
      inverse: "#ffffff",
    },

    // Arrière-plans
    background: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      muted: "#f1f5f9",
      dark: "#0f172a",
    },

    // Bordures
    border: {
      light: "#e2e8f0",
      medium: "#cbd5e1",
      dark: "#94a3b8",
    },
  },

  // Typographie
  typography: {
    fonts: {
      primary: "Source Sans Pro, system-ui, sans-serif",
      heading: "Nunito Sans, system-ui, sans-serif",
      display: "Nunito, system-ui, sans-serif",
      mono: "JetBrains Mono, Consolas, monospace",
    },

    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Espacement
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
    "5xl": "6rem", // 96px
  },

  // Rayons de bordure
  borderRadius: {
    none: "0",
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    full: "9999px",
  },

  // Ombres
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },

  // Points de rupture
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Composants spécifiques
  components: {
    button: {
      padding: {
        sm: "0.5rem 1rem",
        md: "0.75rem 1.5rem",
        lg: "1rem 2rem",
      },
      fontSize: {
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
      },
    },

    card: {
      padding: "1.5rem",
      borderRadius: "0.75rem",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },

    input: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      borderWidth: "1px",
      fontSize: "1rem",
    },
  },

  // États visuels
  states: {
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    loading: {
      opacity: 0.7,
      cursor: "wait",
    },
    error: {
      borderColor: "#ef4444",
      color: "#dc2626",
    },
    success: {
      borderColor: "#22c55e",
      color: "#16a34a",
    },
  },
};

// Utilitaires pour l'usage dans les composants
export const getColor = (path) => {
  return path.split(".").reduce((obj, key) => obj?.[key], designTokens.colors);
};

export const getSpacing = (size) => {
  return designTokens.spacing[size] || size;
};

export const getTypography = (property, value) => {
  return designTokens.typography[property]?.[value] || value;
};

export default designTokens;
