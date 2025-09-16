#!/bin/bash

# 🧪 Test Rapide - Bouton Checkout
echo "🧪 Test de la fonctionnalité checkout"

# 1. Démarrer le serveur en arrière-plan
echo "📡 Démarrage du serveur de développement..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 8

# 2. Vérifier que le serveur est accessible
echo "🔍 Vérification de l'accessibilité..."
if curl -s http://localhost:3001/ > /dev/null; then
    echo "✅ Serveur accessible sur http://localhost:3001/"
else
    echo "❌ Serveur non accessible"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# 3. Test de la page checkout
echo "🛒 Test de la page checkout..."
if curl -s http://localhost:3001/checkout > /dev/null; then
    echo "✅ Page checkout accessible"
else
    echo "❌ Page checkout inaccessible"
fi

# 4. Instructions pour test manuel
echo ""
echo "🔧 Test manuel requis:"
echo "1. Ouvrir http://localhost:3001/ dans votre navigateur"
echo "2. Ajouter des articles au panier"
echo "3. Aller à /checkout"
echo "4. Remplir le formulaire étape par étape"
echo "5. Vérifier que le bouton 'Payer' s'active après sélection d'une méthode de paiement"
echo "6. Vérifier les logs dans la console du navigateur"
echo ""
echo "📋 Points à vérifier:"
echo "- Le bouton 'Payer' est-il grisé au début ?"
echo "- Le bouton s'active-t-il après sélection d'une méthode ?"
echo "- Y a-t-il des logs dans la console ?"
echo "- Le clic sur 'Payer' déclenche-t-il une action ?"

# Garder le serveur ouvert pour les tests
echo ""
echo "🚀 Serveur démarré (PID: $SERVER_PID)"
echo "Appuyez sur Ctrl+C pour arrêter le serveur et fermer ce script"
echo ""

# Fonction de nettoyage
cleanup() {
    echo "🛑 Arrêt du serveur..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup INT

# Garder le script ouvert
wait $SERVER_PID
