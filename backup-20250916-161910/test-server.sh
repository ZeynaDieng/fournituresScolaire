#!/bin/bash

echo "🔄 Test de démarrage du serveur Nuxt..."

# Aller dans le répertoire du projet
cd /Users/mac/fournituresScolaire

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "nuxt" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Démarrer le serveur en arrière-plan
echo "🚀 Démarrage du serveur de développement..."
npm run dev > /tmp/nuxt-dev.log 2>&1 &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo "⏳ Attente du démarrage du serveur..."
sleep 10

# Vérifier que le serveur répond
echo "🔍 Test de la réponse du serveur..."
if curl -s -f -m 10 http://localhost:3000/ > /dev/null; then
    echo "✅ Serveur accessible sur http://localhost:3000"
    
    # Tester quelques endpoints critiques
    echo "🔍 Test des endpoints critiques..."
    
    # Page d'accueil
    if curl -s -f -m 5 http://localhost:3000/ > /dev/null; then
        echo "✅ Page d'accueil accessible"
    else
        echo "❌ Page d'accueil inaccessible"
    fi
    
    # Page de test PayTech
    if curl -s -f -m 5 http://localhost:3000/test-paytech > /dev/null; then
        echo "✅ Page test PayTech accessible"
    else
        echo "❌ Page test PayTech inaccessible"
    fi
    
    # API Mock PayTech
    if curl -s -f -m 5 -X POST http://localhost:3000/api/paytech-mock/initiate > /dev/null; then
        echo "✅ API Mock PayTech accessible"
    else
        echo "⚠️  API Mock PayTech nécessite des données (normal)"
    fi
    
else
    echo "❌ Serveur non accessible"
    echo "📋 Logs du serveur:"
    tail -20 /tmp/nuxt-dev.log
fi

# Arrêter le serveur de test
echo "🛑 Arrêt du serveur de test..."
kill $SERVER_PID 2>/dev/null || true
sleep 2

echo "✅ Test terminé"
