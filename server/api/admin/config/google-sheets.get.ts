// /server/api/admin/config/google-sheets.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  return {
    sheetId: config.googleSheets?.sheetId || process.env.GOOGLE_SHEET_ID || "",
    apiKey: config.googleSheets?.apiKey ? "Configuré" : "",
    configured: !!(config.googleSheets?.sheetId && config.googleSheets?.apiKey),
  };
});
