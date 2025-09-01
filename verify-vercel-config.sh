#!/bin/bash

# 🔍 Script de Vérification Post-Configuration Vercel
# Usage: ./verify-vercel-config.sh

BASE_URL="https://fournitures-scolaire.vercel.app"
TIMESTAMP=$(date +%s)

echo "🔍 Vérification de la Configuration Vercel"
echo "=========================================="
echo "Site: $BASE_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Fonction pour afficher le statut
check_status() {
    if [ "$1" = "200" ]; then
        echo "✅ OK"
    else
        echo "❌ Erreur (HTTP $1)"
    fi
}

# Test 1: Vérification de l'accessibilité
echo "📡 1. Test d'accessibilité du site..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
check_status "$response"

# Test 2: Test de la page de test PayTech
echo ""
echo "🧪 2. Test de la page de test PayTech..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/test-paytech")
check_status "$response"

# Test 3: Test minimal de l'API PayTech
echo ""
echo "💳 3. Test minimal de l'API PayTech..."
init_response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/paytech/initiate" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 1000,
    \"currency\": \"XOF\",
    \"ref_command\": \"verify-$TIMESTAMP\",
    \"customer\": {
      \"name\": \"Verification User\",
      \"email\": \"verify@example.com\",
      \"phone\": \"+221123456789\"
    },
    \"items\": [
      {
        \"name\": \"Verification Test\",
        \"quantity\": 1,
        \"unit_price\": 1000
      }
    ]
  }")

# Extraire le code de statut HTTP (dernières 3 caractères)
http_code="${init_response: -3}"
response_body="${init_response%???}"

echo "HTTP Status: $http_code"

if [ "$http_code" = "200" ]; then
    echo "✅ API PayTech accessible"
    if echo "$response_body" | grep -q "token\|redirect_url"; then
        echo "✅ Réponse PayTech valide"
        echo "🎯 Configuration Vercel correcte!"
    else
        echo "⚠️  Réponse inattendue:"
        echo "$response_body" | head -n 5
    fi
else
    echo "❌ Erreur API PayTech"
    echo "📄 Réponse:"
    echo "$response_body" | head -n 10
fi

# Test 4: Vérification des pages essentielles
echo ""
echo "🌐 4. Vérification des pages essentielles..."
pages=("/checkout" "/payment/success" "/payment/cancel")
for page in "${pages[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    printf "   %-20s " "$page"
    check_status "$response"
done

echo ""
echo "=========================================="

if [ "$http_code" = "200" ] && echo "$response_body" | grep -q "token\|redirect_url"; then
    echo "🎉 Configuration Vercel : SUCCÈS"
    echo ""
    echo "✅ Actions suivantes recommandées:"
    echo "   1. Tester le flux complet sur $BASE_URL/test-paytech"
    echo "   2. Configurer les URLs de webhook PayTech"
    echo "   3. Tester avec de vrais moyens de paiement"
    echo "   4. Configurer une base de données cloud"
else
    echo "⚠️  Configuration Vercel : INCOMPLÈTE"
    echo ""
    echo "🔧 Actions correctives:"
    echo "   1. Vérifier les variables d'environnement sur Vercel"
    echo "   2. Redéployer l'application"
    echo "   3. Vérifier les clés PayTech"
    echo "   4. Consulter les logs Vercel Functions"
fi

echo ""
echo "📚 Documentation: docs/VERCEL_ENVIRONMENT_SETUP.md"
