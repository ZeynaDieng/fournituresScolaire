# 🔧 Configuration Supabase pour Votre Projet

## 📋 Informations Supabase reçues :

- **Project URL** : https://sigjxcnrthaxoceclmdi.supabase.co
- **API Key** : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZ2p4Y25ydGhheG9jZWNsbWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTQzNjksImV4cCI6MjA3MjMzMDM2OX0.qdJA6Yd0rNxvMkITqzq8zOHf_79FNe9sCerg74rstzg

## 🔐 Configuration Prisma/PostgreSQL

Pour utiliser Supabase avec Prisma, vous avez besoin de l'URL de connexion PostgreSQL directe.

### 1. Obtenir l'URL de base de données :

1. Aller dans votre dashboard Supabase : https://app.supabase.com/
2. Sélectionner votre projet
3. Aller dans **Settings** → **Database**
4. Dans la section **Connection string**, copier l'URL **URI**

L'URL ressemble à :

```
postgresql://postgres.sigjxcnrthaxoceclmdi:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

### 2. Mettre à jour .env.production

Remplacer la DATABASE_URL par votre URL Supabase :

```env
# .env.production
DATABASE_URL="postgresql://postgres.sigjxcnrthaxoceclmdi:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

⚠️ **Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez défini lors de la création du projet Supabase.

### 3. Adapter le schéma Prisma pour PostgreSQL

Votre schéma actuel est configuré pour MySQL. Il faut le changer pour PostgreSQL :

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Changé de "mysql" vers "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Variables d'environnement Vercel

Configurer ces variables dans Vercel Dashboard :

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet "fournitures-scolaire"
3. Settings → Environment Variables
4. Ajouter :

```
DATABASE_URL = postgresql://postgres.sigjxcnrthaxoceclmdi:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
NUXT_PAYTECH_API_KEY = 0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
NUXT_PAYTECH_SECRET_KEY = 566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
NUXT_PAYTECH_SANDBOX = false
NUXT_PUBLIC_BASE_URL = https://fournitures-scolaire.vercel.app
```

### 5. Prochaines étapes

1. **Configurer le schéma** : Changer MySQL → PostgreSQL
2. **Obtenir l'URL complète** depuis Supabase
3. **Mettre à jour .env.production**
4. **Tester localement** : `npm run test:prod-db`
5. **Pousser le schéma** : `npx prisma db push`
6. **Configurer Vercel** : Variables d'environnement
7. **Redéployer** : `vercel --prod`

Voulez-vous que je vous aide avec une de ces étapes ?
