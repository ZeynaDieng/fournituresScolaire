import { getAirtableStats } from "~/utils/airtable-admin";
export default defineEventHandler(async (event) => {
  return await getAirtableStats();
});
