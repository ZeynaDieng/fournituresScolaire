# 🗄️ Guide Configuration Base de Données Cloud

## ⚠️ Important

**Vercel ne fournit PAS de base de données**. Vous devez utiliser un service externe pour héberger votre base de données MySQL/PostgreSQL.

## 🌟 Option Recommandée : PlanetScale (MySQL)

### Pourquoi PlanetScale ?

- ✅ **Gratuit** jusqu'à 1GB de stockage
- ✅ **Compatible Prisma** (notre ORM)
- ✅ **Interface web** intuitive
- ✅ **Performances** excellentes
- ✅ **Sécurisé** (SSL par défaut)

### Étapes de Configuration

#### 1. Créer un compte PlanetScale

1. Allez sur https://planetscale.com/
2. Créez un compte gratuit
3. Vérifiez votre email

#### 2. Créer une base de données

1. Cliquez sur "Create database"
2. Nom : `fourniturescolaire`
3. Région : Europe (Frankfurt ou London)
4. Plan : **Hobby (gratuit)**

#### 3. Créer une branche de production

1. Dans votre database → Branches
2. Créer une branche `main` (production)
3. Cette branche sera utilisée pour la production

#### 4. Obtenir l'URL de connexion

1. Branches → `main` → Connect
2. Sélectionner "Prisma"
3. Copier l'URL qui ressemble à :
   ```
   mysql://username:password@aws.connect.psdb.cloud/fourniturescolaire?sslaccept=strict
   ```

#### 5. Configurer dans Vercel

1. Dashboard Vercel → Votre projet
2. Settings → Environment Variables
3. Ajouter :
   ```
   DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/fourniturescolaire?sslaccept=strict
   ```
4. Environment : Production + Preview
5. Sauvegarder

#### 6. Migrer le schéma

```bash
# Mettre à jour votre .env local avec la nouvelle URL
echo "DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/fourniturescolaire?sslaccept=strict" >> .env

# Pousser le schéma vers PlanetScale
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

#### 7. Redéployer Vercel

1. Dashboard Vercel → Deployments
2. Cliquer sur "Redeploy"
3. Ou push un nouveau commit

## 🔥 Alternative : Neon (PostgreSQL)

Si vous préférez PostgreSQL :

#### 1. Créer un compte Neon

1. https://neon.tech/
2. Créer un compte gratuit

#### 2. Créer une base de données

1. "Create Project"
2. Nom : `fourniturescolaire`
3. Région : Europe

#### 3. Obtenir l'URL

1. Dashboard → votre projet
2. Copier l'URL de connexion
3. Format : `postgresql://username:password@host/database?sslmode=require`

#### 4. Modifier le schéma Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changer de "mysql" à "postgresql"
  url      = env("DATABASE_URL")
}

// Adapter les types de données si nécessaire
```

## 💡 Alternative : Railway

#### Configuration Railway

1. https://railway.app/
2. Créer un compte
3. "New Project" → "Provision MySQL" ou "Provision PostgreSQL"
4. Récupérer l'URL de connexion
5. Ajouter dans Vercel

## 🔍 Vérification

### Test de connexion local

```bash
# Test de connexion
npx prisma db push

# Si ça marche, votre URL est correcte
npx prisma studio
```

### Test après déploiement Vercel

```bash
# Tester l'API orders (qui utilise la DB)
curl https://fournitures-scolaire.vercel.app/api/airtable/orders/create \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## ⚠️ Points Importants

### Sécurité

- ✅ Les URLs de base de données contiennent des mots de passe
- ✅ Ne JAMAIS les commiter dans git
- ✅ Utilisez uniquement les variables d'environnement

### Performance

- ✅ PlanetScale/Neon sont optimisés pour les applications serverless
- ✅ Connexions automatiquement gérées
- ✅ Pas besoin de pool de connexions

### Limites Gratuites

- **PlanetScale** : 1GB stockage, 1 milliard lectures/mois
- **Neon** : 512MB stockage, 1 million requêtes/mois
- **Railway** : 5$ gratuits/mois (puis payant)

## 🚀 Recommandation Finale

**Pour votre projet e-commerce, utilisez PlanetScale** :

1. Plus de stockage gratuit (1GB vs 512MB)
2. Compatible avec votre schéma MySQL existant
3. Très bon support de Prisma
4. Interface utilisateur excellente

Une fois configuré, votre intégration PayTech + base de données sera entièrement fonctionnelle en production ! 🎯
