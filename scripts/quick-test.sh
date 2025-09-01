#!/bin/bash

# Script de test rapide pour site en production
echo "🚀 Test Rapide Site en Production"
echo "=================================="

# Demander l'URL si pas fournie
if [ -z "$1" ]; then
    echo "📝 Entrez l'URL de votre site (ex: https://mon-site.vercel.app):"
    read SITE_URL
else
    SITE_URL=$1
fi

echo ""
echo "🌐 Test du site: $SITE_URL"
echo ""

# Test 1: Page d'accueil
echo "🏠 Test page d'accueil..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    echo "✅ Page d'accueil accessible"
else
    echo "❌ Page d'accueil inaccessible"
fi

# Test 2: API diagnostic
echo "🔍 Test API diagnostic..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/test/payment-debug" | grep -q "200"; then
    echo "✅ API diagnostic accessible"
else
    echo "❌ API diagnostic inaccessible"
fi

# Test 3: Page de test
echo "🧪 Test page de flux..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/test/payment-flow" | grep -q "200"; then
    echo "✅ Page de test accessible"
else
    echo "❌ Page de test inaccessible"
fi

echo ""
echo "🔗 URLs à tester manuellement:"
echo "   🏠 Accueil: $SITE_URL"
echo "   🛒 Checkout: $SITE_URL/checkout"
echo "   📊 Diagnostic: $SITE_URL/test/payment-debug"
echo "   🧪 Test flow: $SITE_URL/test/payment-flow"
echo ""
echo "💡 Pour un test complet:"
echo "   npm run check:prod $SITE_URL"
