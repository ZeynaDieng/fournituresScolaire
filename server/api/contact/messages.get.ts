/**
 * API endpoint pour récupérer les messages de contact
 * GET /api/contact/messages
 */

import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Configuration Airtable
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const contactTableId =
      process.env.AIRTABLE_CONTACTS_TABLE || "tblContactMessages";

    if (!airtableApiKey || !airtableBaseId) {
      return {
        success: false,
        error: "Configuration Airtable manquante",
        data: [],
      };
    }

    // Récupérer les messages depuis Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${contactTableId}?sort[0][field]=Date&sort[0][direction]=desc&maxRecords=100`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error("Erreur Airtable récupération contacts:", errorData);

      return {
        success: false,
        error: "Erreur lors de la récupération des messages",
        data: [],
      };
    }

    const airtableResult = await airtableResponse.json();

    // Formatter les données
    const messages = airtableResult.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Nom || "",
      email: record.fields.Email || "",
      phone: record.fields.Téléphone || "",
      subject: record.fields.Sujet || "",
      message: record.fields.Message || "",
      date: record.fields.Date || "",
      status: record.fields.Statut || "Nouveau",
      processed: record.fields.Traité || false,
      createdTime: record.createdTime,
    }));

    return {
      success: true,
      data: messages,
      count: messages.length,
    };
  } catch (error) {
    console.error("Erreur récupération messages contact:", error);

    return {
      success: false,
      error: "Erreur interne du serveur",
      data: [],
    };
  }
});
