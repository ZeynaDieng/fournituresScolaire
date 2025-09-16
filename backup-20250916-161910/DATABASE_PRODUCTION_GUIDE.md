# 🗄️ Guide Configuration Base de Données Production

## Options de bases de données gratuites :

### Option 1 : PlanetScale (Recommandée) ⭐

- **Avantages** : MySQL compatible, 5GB gratuit, très rapide
- **Setup** : https://planetscale.com/
- **Connection** : Via URL de connexion directe

### Option 2 : Supabase (PostgreSQL)

- **Avantages** : PostgreSQL, 500MB gratuit, interface admin
- **Setup** : https://supabase.com/
- **Bonus** : Interface d'administration incluse

### Option 3 : Railway MySQL

- **Avantages** : MySQL, simple à configurer
- **Setup** : https://railway.app/
- **Limite** : 1GB gratuit

### Option 4 : Neon (PostgreSQL)

- **Avantages** : PostgreSQL serverless, 3GB gratuit
- **Setup** : https://neon.tech/

## 🚀 Setup Rapide avec PlanetScale (5 minutes)

### Étape 1 : Créer le compte

1. Aller sur https://planetscale.com/
2. S'inscrire avec GitHub/Google
3. Créer une nouvelle base de données : `edushop-prod`
4. Sélectionner région : `Europe` ou `US East`

### Étape 2 : Obtenir l'URL de connexion

1. Dans le dashboard PlanetScale
2. Aller dans "Connect"
3. Sélectionner "Prisma"
4. Copier l'URL de connexion

### Étape 3 : Configuration locale

```bash
# Créer le fichier .env.production
cp .env .env.production

# Mettre à jour les variables dans .env.production
```

### Variables d'environnement nécessaires :

```env
# Base de données PlanetScale
DATABASE_URL="mysql://username:password@host/database_name?sslaccept=strict"

# PayTech (vos clés existantes)
NUXT_PAYTECH_API_KEY="votre_api_key"
NUXT_PAYTECH_SECRET_KEY="votre_secret_key"
NUXT_PAYTECH_SANDBOX="false"

# URL de production (sera remplacée par l'URL Vercel)
NUXT_PUBLIC_BASE_URL="https://votre-app.vercel.app"
```

## 🔄 Migration des données

Une fois la base configurée, migrer vos données existantes :

```bash
# 1. Mettre à jour DATABASE_URL dans .env
# 2. Pousser le schéma
npx prisma db push

# 3. Vérifier la connexion
npm run test:db
```

## 📊 Alternative : Garder SQLite temporairement

Si vous voulez déployer rapidement sans changer de BDD :

### Option A : Vercel + SQLite (temporaire)

- Fonctionne pour les tests
- Données perdues à chaque déploiement
- Pas recommandé pour la production

### Option B : Railway avec SQLite persistant

- Garde vos données SQLite
- Plus simple à configurer
- Moins de performance

## 🎯 Recommandation

**Pour votre e-commerce, je recommande PlanetScale :**

- Configuration en 5 minutes
- Compatible avec votre code actuel (MySQL)
- Gratuit jusqu'à 5GB
- Performance excellente
- Backup automatique

Voulez-vous que je vous guide étape par étape pour PlanetScale ou préférez-vous une autre option ?
