#!/bin/bash
# ==============================================================================
# Script de Déploiement Automatique pour EduShop (VPS Ubuntu + Docker)
# ==============================================================================

set -e

echo "🚀 [1/4] Récupération du dernier code depuis GitHub..."
git pull origin main

echo "📦 [2/4] Construction de la nouvelle image Docker..."
docker build -t edushop .

echo "🛑 [3/4] Arrêt du conteneur précédent..."
docker rm -f edushop || true

echo "⚡ [4/4] Lancement du nouveau conteneur EduShop (Port 3050)..."
docker run -d --name edushop -p 3050:3000 --restart always edushop

echo ""
echo "=============================================================================="
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "🌐 Votre application est à jour sur https://www.edushop.sn"
echo "=============================================================================="
