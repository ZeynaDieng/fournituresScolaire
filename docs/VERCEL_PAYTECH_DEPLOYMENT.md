# 🚀 Guide de Déploiement Vercel avec PayTech

## 📋 **Configuration Vercel pour PayTech**

### 1. **Variables d'environnement Vercel**

Dans votre dashboard Vercel, ajoutez ces variables d'environnement :

```bash
# PayTech Configuration
PAYTECH_API_KEY=votre_cle_api_paytech_production
PAYTECH_SECRET_KEY=votre_cle_secrete_paytech_production
PAYTECH_SANDBOX=false

# URLs de base (automatiquement définies par Vercel)
BASE_URL=https://votre-app.vercel.app
NUXT_PUBLIC_SITE_URL=https://votre-app.vercel.app

# Base de données (utiliser un service cloud)
DATABASE_URL=votre_url_de_base_de_donnees_cloud

# Optionnel : Variables publiques PayTech (pour le frontend)
NUXT_PUBLIC_PAYTECH_API_KEY=votre_cle_api_paytech_production
NUXT_PUBLIC_PAYTECH_MERCHANT_ID=votre_merchant_id_paytech
```

### 2. **Base de données pour Vercel**

Vercel ne supporte pas MySQL natif. Options recommandées :

#### Option A: PlanetScale (MySQL compatible, gratuit)

```bash
DATABASE_URL="mysql://username:password@host.connect.psdb.cloud/database?sslaccept=strict"
```

#### Option B: Neon (PostgreSQL, gratuit)

```bash
DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
```

#### Option C: Vercel Postgres (intégré)

```bash
# Automatiquement configuré par Vercel
POSTGRES_URL="..."
```

### 3. **Modification du Schema Prisma pour Vercel**

Si vous utilisez PostgreSQL (Neon/Vercel Postgres) :

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql" // Changer de mysql à postgresql
  url      = env("DATABASE_URL")
}
```

### 4. **Configuration de Build Vercel**

Créez `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nuxt",
  "functions": {
    "server/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 5. **Scripts de déploiement**

Ajoutez dans `package.json` :

```json
{
  "scripts": {
    "vercel-build": "npm run build",
    "postinstall": "prisma generate",
    "db:deploy": "prisma db push",
    "db:migrate": "prisma migrate deploy"
  }
}
```

### 6. **URLs PayTech en Production**

Avec Vercel, vos URLs PayTech seront automatiquement en HTTPS :

```javascript
// Automatiquement en HTTPS sur Vercel
const webhookUrl = "https://votre-app.vercel.app/api/paytech/webhook";
const successUrl = "https://votre-app.vercel.app/payment/success";
const cancelUrl = "https://votre-app.vercel.app/payment/cancel";
```

## 🎯 **Étapes de Déploiement**

### 1. **Préparer le projet**

```bash
# Commiter tous les changements
git add .
git commit -m "Prêt pour déploiement Vercel"
git push origin main
```

### 2. **Connecter à Vercel**

1. Aller sur [vercel.com](https://vercel.com)
2. Importer votre repository GitHub
3. Configurer les variables d'environnement
4. Déployer

### 3. **Après déploiement**

```bash
# Appliquer les migrations de base de données
npx prisma db push --preview-feature
```

## ⚠️ **Points Important PayTech + Vercel**

### ✅ **Avantages**

- **HTTPS automatique** - PayTech fonctionne immédiatement
- **URLs stables** - Pas de problème de callback
- **Performance** - Edge functions rapides
- **Scaling** - Gestion automatique du trafic

### 🚨 **Attention**

- **Cold starts** - Première requête peut être lente
- **Timeouts** - Fonctions limitées à 30s max
- **Base de données** - Utiliser un service cloud externe

## 🔧 **Configuration PayTech Spécifique Vercel**

Dans votre dashboard PayTech, configurez :

```
URL de notification (IPN): https://votre-app.vercel.app/api/paytech/webhook
URL de retour succès: https://votre-app.vercel.app/payment/success
URL de retour échec: https://votre-app.vercel.app/payment/cancel
URL de notification remboursement: https://votre-app.vercel.app/api/paytech/refund-webhook
```

## 🧪 **Test en Production**

Une fois déployé sur Vercel :

1. **Test de l'API initiate** :

```bash
curl -X POST https://votre-app.vercel.app/api/paytech/initiate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "customer": {...}}'
```

2. **Vérifier les webhooks** dans les logs Vercel

3. **Test de bout en bout** avec un vrai paiement PayTech

## 📱 **URLs d'exemple en production**

```
Site: https://fournitures-scolaire.vercel.app
API PayTech: https://fournitures-scolaire.vercel.app/api/paytech/initiate
Webhook: https://fournitures-scolaire.vercel.app/api/paytech/webhook
Succès: https://fournitures-scolaire.vercel.app/payment/success
Annulation: https://fournitures-scolaire.vercel.app/payment/cancel
```

## 🎉 **Résultat Final**

Avec cette configuration, PayTech fonctionnera parfaitement sur Vercel car :

- ✅ HTTPS automatique
- ✅ URLs stables et fiables
- ✅ Performance optimale
- ✅ Gestion automatique du scaling
- ✅ Variables d'environnement sécurisées

**PayTech + Vercel = Match parfait ! 🚀**
