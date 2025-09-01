# ✅ Checklist de Déploiement Production PayTech

## 🔧 Configuration Vercel (À faire sur dashboard.vercel.com)

### Variables d'environnement à configurer :

```env
# PayTech Production
PAYTECH_API_KEY=your_production_api_key
PAYTECH_SECRET_KEY=your_production_secret_key
PAYTECH_SANDBOX=false
PAYTECH_MERCHANT_ID=your_production_merchant_id

# URLs Production
BASE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_SITE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_API_BASE=/api

# Base de données Cloud (exemple avec PlanetScale)
DATABASE_URL=mysql://username:password@host:port/database

# PayTech Public (pour le frontend)
NUXT_PUBLIC_PAYTECH_API_KEY=your_production_api_key
NUXT_PUBLIC_PAYTECH_API_SECRET=your_production_secret_key
NUXT_PUBLIC_PAYTECH_MERCHANT_ID=your_production_merchant_id
```

## 📋 Étapes de Vérification

### ✅ 1. Déploiement Vercel

- [x] Site accessible : https://fournitures-scolaire.vercel.app/
- [x] Page de test PayTech : https://fournitures-scolaire.vercel.app/test-paytech
- [x] HTTPS activé (requis pour PayTech)

### ⚠️ 2. Configuration PayTech Production

- [ ] Obtenir les clés API de production PayTech
- [ ] Configurer l'URL de notification webhook : `https://fournitures-scolaire.vercel.app/api/paytech/webhook`
- [ ] Configurer les URLs de retour :
  - Succès : `https://fournitures-scolaire.vercel.app/payment/success`
  - Échec : `https://fournitures-scolaire.vercel.app/payment/cancel`
- [ ] Mettre à jour les variables d'environnement Vercel

### ⚠️ 3. Base de Données Cloud

- [ ] Configurer une base de données cloud (PlanetScale, Neon, ou Vercel Postgres)
- [ ] Migrer le schéma Prisma
- [ ] Mettre à jour DATABASE_URL

### 🧪 4. Tests de Production

- [ ] Tester l'initiation de paiement
- [ ] Vérifier la réception des webhooks
- [ ] Tester les pages de succès/échec
- [ ] Vérifier les logs Vercel

## 🚀 Commandes de Test Post-Déploiement

### Test API initiation paiement :

```bash
curl -X POST https://fournitures-scolaire.vercel.app/api/paytech/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "ref_command": "test-' $(date +%s) '",
    "customer": {
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "User",
      "phone": "+221123456789"
    },
    "items": [
      {
        "name": "Test Product",
        "quantity": 1,
        "unit_price": 1000
      }
    ]
  }'
```

### Test statut commande :

```bash
curl https://fournitures-scolaire.vercel.app/api/paytech/status/YOUR_TOKEN
```

## 📞 Support PayTech

En cas de problème :

- Documentation : https://paytech.sn/documentation
- Support : support@paytech.sn
- Dashboard marchand : https://paytech.sn/dashboard

## 🔍 Monitoring Production

### Logs à surveiller :

1. Logs Vercel Functions
2. Webhooks PayTech reçus
3. Erreurs de paiement
4. Performance des API

### Métriques importantes :

- Taux de succès des paiements
- Temps de réponse des APIs
- Nombre de webhooks manqués

## 🛡️ Sécurité

### Points de contrôle :

- [x] Validation HMAC des webhooks
- [x] Validation des montants
- [x] Gestion des erreurs sécurisée
- [x] Variables sensibles en environnement
- [x] HTTPS obligatoire

## 📱 Tests Utilisateur Final

### Parcours complet à tester :

1. Ajouter des produits au panier
2. Aller au checkout
3. Sélectionner PayTech comme méthode de paiement
4. Effectuer le paiement (Orange Money, Wave, etc.)
5. Vérifier la redirection vers la page de succès
6. Contrôler la réception du webhook
7. Vérifier l'état de la commande en base

---

**Note** : Actuellement, le site utilise les clés de test PayTech. Pour passer en production, suivez les étapes marquées ⚠️ ci-dessus.
