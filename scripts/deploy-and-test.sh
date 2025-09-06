#!/bin/bash

echo "🚀 DÉPLOIEMENT ET TEST CORS - Script final"
echo "=================================================="

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL de production
PROD_URL="https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app"

echo -e "${YELLOW}1. Déploiement sur Vercel...${NC}"
vercel --prod

echo -e "${YELLOW}2. Attente de 30 secondes pour la propagation...${NC}"
sleep 30

echo -e "${YELLOW}3. Tests des endpoints avec CORS...${NC}"

# Test 1: Endpoint de test simple
echo -e "${YELLOW}Test 1: /api/test${NC}"
response1=$(curl -s -w "HTTPSTATUS:%{http_code}" "$PROD_URL/api/test")
http_code1=$(echo $response1 | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body1=$(echo $response1 | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')

if [ $http_code1 -eq 200 ]; then
    echo -e "${GREEN}✅ /api/test: SUCCESS (200)${NC}"
    echo "Response: $body1"
else
    echo -e "${RED}❌ /api/test: FAILED ($http_code1)${NC}"
    echo "Response: $body1"
fi

# Test 2: Endpoint produits
echo -e "${YELLOW}Test 2: /api/products${NC}"
response2=$(curl -s -w "HTTPSTATUS:%{http_code}" "$PROD_URL/api/products")
http_code2=$(echo $response2 | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body2=$(echo $response2 | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')

if [ $http_code2 -eq 200 ]; then
    echo -e "${GREEN}✅ /api/products: SUCCESS (200)${NC}"
    echo "Response: ${body2:0:200}..."
else
    echo -e "${RED}❌ /api/products: FAILED ($http_code2)${NC}"
    echo "Response: $body2"
fi

# Test 3: Headers CORS avec OPTIONS
echo -e "${YELLOW}Test 3: Headers CORS (OPTIONS)${NC}"
cors_headers=$(curl -s -I -X OPTIONS "$PROD_URL/api/test")
if echo "$cors_headers" | grep -i "access-control-allow-origin" > /dev/null; then
    echo -e "${GREEN}✅ Headers CORS: présents${NC}"
    echo "$cors_headers" | grep -i "access-control"
else
    echo -e "${RED}❌ Headers CORS: absents${NC}"
    echo "Headers reçus:"
    echo "$cors_headers"
fi

# Test 4: Airtable endpoint direct
echo -e "${YELLOW}Test 4: /api/airtable/products${NC}"
response4=$(curl -s -w "HTTPSTATUS:%{http_code}" "$PROD_URL/api/airtable/products")
http_code4=$(echo $response4 | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ $http_code4 -eq 200 ]; then
    echo -e "${GREEN}✅ /api/airtable/products: SUCCESS (200)${NC}"
else
    echo -e "${RED}❌ /api/airtable/products: FAILED ($http_code4)${NC}"
fi

echo -e "${YELLOW}5. Test du site principal${NC}"
site_response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$PROD_URL")
site_code=$(echo $site_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ $site_code -eq 200 ]; then
    echo -e "${GREEN}✅ Site principal: SUCCESS (200)${NC}"
else
    echo -e "${RED}❌ Site principal: FAILED ($site_code)${NC}"
fi

echo "=================================================="
echo -e "${YELLOW}RÉSUMÉ:${NC}"
echo "- Test endpoint: $http_code1"
echo "- Produits: $http_code2"  
echo "- Airtable: $http_code4"
echo "- Site: $site_code"

if [ $http_code1 -eq 200 ] && [ $http_code2 -eq 200 ] && [ $site_code -eq 200 ]; then
    echo -e "${GREEN}🎉 TOUT FONCTIONNE ! Site prêt en production${NC}"
else
    echo -e "${RED}⚠️  Problèmes détectés - Vérifier les logs Vercel${NC}"
    echo "Commande pour voir les logs: vercel logs"
fi
