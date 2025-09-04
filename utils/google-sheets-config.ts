// /utils/google-sheets-config.ts
/**
 * Guide de configuration Google Sheets API
 *
 * 1. Aller sur https://console.cloud.google.com/
 * 2. Créer un nouveau projet ou sélectionner un projet existant
 * 3. Activer l'API Google Sheets dans "APIs & Services > Library"
 * 4. Créer des identifiants API Key dans "APIs & Services > Credentials"
 * 5. Créer un nouveau Google Sheets et récupérer l'ID dans l'URL
 * 6. Partager le Google Sheet en lecture/écriture avec l'email public
 * 7. Mettre à jour le fichier .env avec:
 *    - GOOGLE_SHEET_ID=votre_sheet_id
 *    - GOOGLE_SHEETS_API_KEY=votre_api_key
 */

// Configuration avec vérifications
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: process.env.GOOGLE_SHEET_ID,
  API_KEY: process.env.GOOGLE_SHEETS_API_KEY,
  SHEET_NAME: "Commandes",
};

// Vérifier si la configuration est complète
export function isGoogleSheetsConfigured(): boolean {
  return !!(GOOGLE_SHEETS_CONFIG.SHEET_ID && GOOGLE_SHEETS_CONFIG.API_KEY);
}

// Obtenir les erreurs de configuration
export function getConfigErrors(): string[] {
  const errors: string[] = [];

  if (!GOOGLE_SHEETS_CONFIG.SHEET_ID) {
    errors.push("GOOGLE_SHEET_ID manquant dans le fichier .env");
  }

  if (!GOOGLE_SHEETS_CONFIG.API_KEY) {
    errors.push("GOOGLE_SHEETS_API_KEY manquant dans le fichier .env");
  }

  return errors;
}

// Message d'aide pour la configuration
export function getConfigHelpMessage(): string {
  return `
📋 CONFIGURATION GOOGLE SHEETS

Pour activer la synchronisation Google Sheets:

1. Créer un projet Google Cloud Console
2. Activer l'API Google Sheets
3. Créer une API Key
4. Créer un Google Sheet et récupérer l'ID
5. Mettre à jour votre fichier .env:

GOOGLE_SHEET_ID=1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0
GOOGLE_SHEETS_API_KEY=votre_api_key_ici

6. Redémarrer votre application

Le système fonctionne parfaitement en local même sans Google Sheets configuré.
Toutes les commandes sont sauvegardées dans:
- Fichiers JSON locaux (data/orders/)  
- Fichier Excel maître (data/COMMANDES_MAITRE.xlsx)
`;
}

// URL pour ouvrir Google Sheets
export function getGoogleSheetsUrl(): string {
  if (!GOOGLE_SHEETS_CONFIG.SHEET_ID) {
    return "https://sheets.google.com";
  }
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/edit`;
}
