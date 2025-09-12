import { getAirtableAlerts } from "~/utils/airtable-admin";
export default defineEventHandler(async (event) => {
  return await getAirtableAlerts();
});
