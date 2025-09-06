# ✅ CHECKLIST RÉSOLUTION ERREURS PRODUCTION

## 🎯 Objectif
Résoudre les erreurs 500 et 404 en production

## 📋 Actions à Réaliser

### ✅ 1. Configuration Vercel (CRITIQUE)
- [ ] Aller sur https://vercel.com/dashboard
- [ ] Sélectionner le projet fournitures-scolaire
- [ ] Settings → Environment Variables
- [ ] Ajouter PAYTECH_API_KEY
- [ ] Ajouter PAYTECH_SECRET_KEY  
- [ ] Ajouter PAYTECH_SANDBOX=true
- [ ] Ajouter AIRTABLE_API_KEY
- [ ] Ajouter AIRTABLE_BASE_ID
- [ ] Ajouter BASE_URL (avec vraie URL Vercel)
- [ ] Ajouter NUXT_PUBLIC_BASE_URL (même URL)
- [ ] Ajouter NUXT_PUBLIC_SITE_URL (même URL)

### ✅ 2. Redéploiement
- [ ] Aller à Deployments
- [ ] Redeploy le dernier déploiement
- [ ] Attendre la fin (2-3 min)

### ✅ 3. Tests de Validation
- [ ] Site principal: https://votre-app.vercel.app
- [ ] Image: https://votre-app.vercel.app/images/payment/default.png
- [ ] API: https://votre-app.vercel.app/api/admin/products
- [ ] Checkout (test PayTech)

### ✅ 4. Validation Complète
- [ ] Exécuter: node scripts/test-production-complete.js
- [ ] Tous les tests passent ✅
- [ ] Site e-commerce opérationnel

## 🚨 Erreurs Actuelles
- ❌ Erreur 500: /api/paytech/initiate
- ❌ Toutes les variables d'environnement manquantes
- ❌ Configuration PayTech/Airtable absente

## ✅ Résultat Attendu
- ✅ Site entièrement fonctionnel
- ✅ Paiement PayTech opérationnel
- ✅ Toutes les APIs marchent
- ✅ Images correctement affichées

---
📅 Date: 9/6/2025, 3:08:27 AM
⏰ Temps estimé: 10 minutes maximum
