// utils/airtable-users.ts
import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_API_KEY || "";
const baseId = process.env.AIRTABLE_BASE_ID || "";
const usersTable = process.env.AIRTABLE_USERS_TABLE || "";

const base = new Airtable({ apiKey }).base(baseId);

export async function findAirtableUser(email: string): Promise<any | null> {
  return new Promise((resolve, reject) => {
    if (!apiKey || !baseId || !usersTable) return resolve(null);
    base(usersTable)
      .select({ filterByFormula: `{Email} = '${email}'`, maxRecords: 1 })
      .firstPage((err, records) => {
        if (err) return reject(err);
        if (records && records.length > 0) {
          resolve(records[0].fields);
        } else {
          resolve(null);
        }
      });
  });
}
