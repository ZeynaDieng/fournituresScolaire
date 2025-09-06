#!/usr/bin/env node

/**
 * Script pour vérifier et afficher la structure nécessaire
 * pour la table Contacts dans Airtable
 */

console.log("🔧 STRUCTURE REQUISE POUR LA TABLE CONTACTS AIRTABLE");
console.log("=".repeat(60));

const requiredFields = [
  {
    name: "Name",
    type: "Single line text",
    required: true,
    description: "Nom complet du contact",
  },
  {
    name: "Email",
    type: "Email",
    required: true,
    description: "Adresse email du contact",
  },
  {
    name: "Phone",
    type: "Phone number",
    required: false,
    description: "Numéro de téléphone (optionnel)",
  },
  {
    name: "Subject",
    type: "Single line text",
    required: true,
    description: "Sujet du message",
  },
  {
    name: "Message",
    type: "Long text",
    required: true,
    description: "Contenu du message",
  },
  {
    name: "Created At",
    type: "Created time",
    required: true,
    description: "Date et heure de création (automatique)",
  },
  {
    name: "Status",
    type: "Single select",
    required: true,
    description: "Statut du message",
    options: ["Nouveau", "En cours", "Traité", "Fermé"],
    default: "Nouveau",
  },
  {
    name: "Priority",
    type: "Single select",
    required: false,
    description: "Priorité du message",
    options: ["Basse", "Normale", "Haute", "Urgente"],
    default: "Normale",
  },
];

const optionalFields = [
  {
    name: "Response",
    type: "Long text",
    description: "Réponse de l'administrateur",
  },
  {
    name: "Responded At",
    type: "Date",
    description: "Date de la réponse",
  },
  {
    name: "Assigned To",
    type: "Single line text",
    description: "Personne responsable du traitement",
  },
];

console.log("\n📋 CHAMPS OBLIGATOIRES:");
requiredFields.forEach((field, index) => {
  console.log(`\n${index + 1}. ${field.name}`);
  console.log(`   Type: ${field.type}`);
  console.log(`   Requis: ${field.required ? "Oui" : "Non"}`);
  console.log(`   Description: ${field.description}`);

  if (field.options) {
    console.log(`   Options: ${field.options.join(", ")}`);
  }
  if (field.default) {
    console.log(`   Défaut: ${field.default}`);
  }
});

console.log("\n📝 CHAMPS OPTIONNELS (RECOMMANDÉS):");
optionalFields.forEach((field, index) => {
  console.log(`\n${requiredFields.length + index + 1}. ${field.name}`);
  console.log(`   Type: ${field.type}`);
  console.log(`   Description: ${field.description}`);
});

console.log("\n🚀 ÉTAPES POUR CRÉER LA TABLE:");
console.log("1. Allez dans votre base Airtable");
console.log('2. Créez une nouvelle table nommée "Contacts"');
console.log("3. Ajoutez chaque champ avec le type correspondant");
console.log('4. Configurez les options pour les champs "Single select"');
console.log("5. Récupérez l'ID de la table et ajoutez-le dans .env");

console.log("\n⚙️  CONFIGURATION .ENV:");
console.log("Ajoutez cette ligne dans votre fichier .env:");
console.log("AIRTABLE_CONTACTS_TABLE=tbl[VotreIdDeTable]");

console.log("\n✅ APRÈS CRÉATION:");
console.log("- Testez avec: npm run test:contact");
console.log("- Consultez les messages sur: /admin/contact");
console.log("- API endpoint: /api/contact/send");

console.log("\n" + "=".repeat(60));
