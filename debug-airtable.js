// debug-airtable.js
import Airtable from "airtable";

const apiKey =
  process.env.AIRTABLE_API_KEY ||
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const baseId = process.env.AIRTABLE_BASE_ID || "appOtYkVavA4MMMnN";
const productsTable =
  process.env.AIRTABLE_PRODUCTS_TABLE || "tblxGbcySHadDtsyn";
const packsTable = process.env.AIRTABLE_PACKS_TABLE || "tbl4JVykOdi6YFvfd";
const ordersTable = process.env.AIRTABLE_ORDERS_TABLE || "tblIx2zvrcz1VY7xb";
const promotionsTable =
  process.env.AIRTABLE_PROMOTIONS_TABLE || "tblrUYgl2PgYIEMY5";
const testimonialsTable =
  process.env.AIRTABLE_TESTIMONIALS_TABLE || "tblYjfi1FFk1CCH46";
const contactsTable =
  process.env.AIRTABLE_CONTACTS_TABLE || "tblX73JCops5jKevo";

const base = new Airtable({ apiKey }).base(baseId);

async function listRecords(table) {
  return new Promise((resolve, reject) => {
    const results = [];
    base(table)
      .select({ maxRecords: 5 })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => results.push(record.fields));
          fetchNextPage();
        },
        (err) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
  });
}

(async () => {
  console.log("Produits:", await listRecords(productsTable));
  console.log("Packs:", await listRecords(packsTable));
  console.log("Commandes:", await listRecords(ordersTable));
  console.log("Promotions:", await listRecords(promotionsTable));
  console.log("Témoignages:", await listRecords(testimonialsTable));
  console.log("Contacts:", await listRecords(contactsTable));
})();
