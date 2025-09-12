import { getAirtableOrders } from "~/utils/airtable-admin";
export default defineEventHandler(async (event) => {
  const limit = Number(getQuery(event).limit) || 10;
  return await getAirtableOrders({ limit });
});
