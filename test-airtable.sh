#!/bin/bash

echo "🧪 Test de diagnostic Airtable"
echo "================================"

echo "1️⃣ Test de connexion au serveur local..."
curl -s -w "Status: %{http_code}\n" http://localhost:3000/ | head -5

echo ""
echo "2️⃣ Test de l'endpoint Airtable packs..."
curl -s -w "Status: %{http_code}\n" http://localhost:3000/api/airtable/packs

echo ""
echo "3️⃣ Variables d'environnement Airtable:"
echo "AIRTABLE_BASE_ID: $AIRTABLE_BASE_ID"
echo "AIRTABLE_PACKS_TABLE: $AIRTABLE_PACKS_TABLE"

echo ""
echo "4️⃣ Test direct avec l'API Airtable..."
curl -s \
  -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/$AIRTABLE_PACKS_TABLE?maxRecords=2" | head -10

echo ""
echo "✅ Test terminé"
