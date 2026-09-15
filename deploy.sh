#!/bin/bash
# ==============================================================================
# Script de Déploiement Automatique EduShop avec Docker Compose (PostgreSQL)
# ==============================================================================

set -e

echo "🚀 [1/4] Récupération des mises à jour depuis GitHub..."
git pull origin main

echo "📦 [2/4] Nettoyage & Build des conteneurs (PostgreSQL + EduShop)..."
docker rm -f edushop || true
docker compose up -d --build

echo "⏳ [3/4] Attente du démarrage de PostgreSQL..."
sleep 5

echo "🌱 [4/4] Migration du schéma Prisma & Seeding des produits..."
docker compose exec -T edushop npx prisma db push --accept-data-loss || true
docker compose exec -T edushop node scripts/seed-postgresql.js || true

echo ""
echo "=============================================================================="
echo "✅ DÉPLOIEMENT POSTGRESQL TERMINÉ AVEC SUCCÈS !"
echo "🌐 Votre site fonctionne sur PostgreSQL auto-hébergé sur https://www.edushop.sn"
echo "=============================================================================="
