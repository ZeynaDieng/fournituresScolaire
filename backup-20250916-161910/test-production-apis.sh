#!/bin/bash

# 🧪 Script de Test APIs PayTech Production
# Usage: ./test-production-apis.sh

BASE_URL="https://fournitures-scolaire.vercel.app"
TIMESTAMP=$(date +%s)

echo "🚀 Test des APIs PayTech sur $BASE_URL"
echo "================================================"

# Test 1: Health check de l'API
echo "📡 1. Test de connectivité..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/paytech/status/test")
if [ "$response" = "404" ] || [ "$response" = "200" ]; then
    echo "✅ API accessible (status: $response)"
else
    echo "❌ Problème de connectivité (status: $response)"
fi

# Test 2: Initiation de paiement
echo ""
echo "💳 2. Test d'initiation de paiement..."
init_response=$(curl -s -X POST "$BASE_URL/api/paytech/initiate" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 1000,
    \"currency\": \"XOF\",
    \"ref_command\": \"test-$TIMESTAMP\",
    \"customer\": {
      \"name\": \"Test User\",
      \"email\": \"test@example.com\",
      \"phone\": \"+221123456789\"
    },
    \"items\": [
      {
        \"name\": \"Test Product\",
        \"quantity\": 1,
        \"unit_price\": 1000
      }
    ]
  }")

if echo "$init_response" | grep -q "token\|redirect_url"; then
    echo "✅ Initiation de paiement réussie"
    echo "📄 Réponse: $init_response"
    
    # Extraire le token pour le test suivant
    token=$(echo "$init_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$token" ]; then
        echo "🎫 Token extrait: $token"
        
        # Test 3: Vérification du statut
        echo ""
        echo "📊 3. Test de vérification du statut..."
        status_response=$(curl -s "$BASE_URL/api/paytech/status/$token")
        if echo "$status_response" | grep -q "status\|state"; then
            echo "✅ Vérification du statut réussie"
            echo "📄 Statut: $status_response"
        else
            echo "❌ Échec de la vérification du statut"
            echo "📄 Réponse: $status_response"
        fi
    fi
else
    echo "❌ Échec de l'initiation de paiement"
    echo "📄 Réponse: $init_response"
fi

# Test 4: Vérification des pages de paiement
echo ""
echo "🌐 4. Test des pages de paiement..."

pages=("/payment/success" "/payment/cancel" "/test-paytech" "/checkout")
for page in "${pages[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    if [ "$response" = "200" ]; then
        echo "✅ Page $page accessible"
    else
        echo "❌ Page $page inaccessible (status: $response)"
    fi
done

echo ""
echo "================================================"
echo "🏁 Tests terminés!"
echo ""
echo "📋 Actions recommandées:"
echo "1. Vérifier les logs Vercel pour plus de détails"
echo "2. Tester manuellement le flux complet sur $BASE_URL/test-paytech"
echo "3. Configurer les vraies clés PayTech si en mode test"
echo "4. Vérifier la configuration de la base de données"
