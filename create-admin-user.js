// Script pour ajouter un utilisateur admin dans Airtable
import Airtable from "airtable";

const apiKey =
  process.env.AIRTABLE_API_KEY ||
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const baseId = process.env.AIRTABLE_BASE_ID || "appOtYkVavA4MMMnN";
const usersTable = process.env.AIRTABLE_USERS_TABLE || "tblJFcp2ORo8vM5gN";

const base = new Airtable({ apiKey }).base(baseId);

const newUser = {
  Email: "admin@fournitures.com",
  Password: "admin123", // Mot de passe en clair (à changer en prod !)
  Role: "admin",
  Name: "Super Admin",
};

base(usersTable).create([{ fields: newUser }], (err, records) => {
  if (err) {
    console.error("Erreur création utilisateur:", err);
    return;
  }
  records.forEach((record) => {
    console.log("Utilisateur admin créé avec succès:", record.getId());
  });
});
