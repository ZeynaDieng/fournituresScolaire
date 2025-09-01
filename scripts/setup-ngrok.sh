#!/bin/bash

# Script d'installation et configuration NGrok pour PayTech
# Usage: ./setup-ngrok.sh

echo "🚀 Configuration NGrok pour PayTech EduShop"
echo "=========================================="

# Vérifier si NGrok est installé
if command -v ngrok &> /dev/null; then
    echo "✅ NGrok est déjà installé"
else
    echo "📦 Installation de NGrok..."
    npm install -g ngrok
    if [ $? -eq 0 ]; then
        echo "✅ NGrok installé avec succès"
    else
        echo "❌ Erreur lors de l'installation de NGrok"
        echo "💡 Essayez : sudo npm install -g ngrok"
        exit 1
    fi
fi

# Demander le port (par défaut 3000)
read -p "Port de votre serveur Nuxt (défaut: 3000): " PORT
PORT=${PORT:-3000}

echo ""
echo "🔧 Lancement de NGrok sur le port $PORT..."
echo "📝 Gardez ce terminal ouvert pour maintenir le tunnel"
echo ""
echo "Une fois NGrok lancé :"
echo "1. Copiez l'URL HTTPS (ex: https://abc123.ngrok.io)"
echo "2. Mettez à jour votre .env :"
echo "   NUXT_PUBLIC_BASE_URL=https://abc123.ngrok.io"
echo "3. Redémarrez votre serveur Nuxt"
echo "4. Testez avec /test/payment-flow"
echo ""
echo "🌐 Interface web NGrok : http://127.0.0.1:4040"
echo ""

# Lancer NGrok
ngrok http $PORT
