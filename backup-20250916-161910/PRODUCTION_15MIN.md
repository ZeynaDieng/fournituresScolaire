# ⚡ Guide Rapide : Production en 15 minutes

## 🎯 Objectif

Déployer votre e-commerce avec base de données en ligne

## 📋 Étapes (15 minutes)

### 1. Base de Données PlanetScale (5 min) 🗄️

#### A. Créer le compte

1. Aller sur https://planetscale.com/
2. Cliquer "Get started for free"
3. Se connecter avec GitHub ou Google
4. Créer une nouvelle base : `edushop-prod`

#### B. Obtenir l'URL de connexion

1. Dans le dashboard, cliquer sur votre base
2. Aller dans "Connect"
3. Sélectionner "Prisma" dans le dropdown
4. Copier l'URL qui ressemble à :
   ```
   mysql://username:password@aws.connect.psdb.cloud/edushop-prod?sslaccept=strict
   ```

### 2. Configuration Variables (3 min) ⚙️

#### Mettre à jour .env.production

```bash
# Ouvrir le fichier créé
nano .env.production

# Remplacer/ajouter ces lignes :
DATABASE_URL="mysql://votre_url_planetscale_ici"
NUXT_PAYTECH_API_KEY="votre_api_key_paytech"
NUXT_PAYTECH_SECRET_KEY="votre_secret_key_paytech"
NUXT_PAYTECH_SANDBOX="false"
NUXT_PUBLIC_BASE_URL="https://fournitures-scolaire.vercel.app"
```

### 3. Test Base de Données (2 min) 🧪

```bash
# Tester la connexion
npm run test:prod-db

# Si succès, pousser le schéma
npm run db:push
```

### 4. Déploiement Vercel (5 min) 🚀

#### A. Installation Vercel CLI

```bash
npm install -g vercel
```

#### B. Premier déploiement

```bash
# Se connecter à Vercel
vercel login

# Déployer
vercel

# Suivre les questions :
# - Set up and deploy? Y
# - Which scope? Votre compte
# - Link to existing project? N
# - Project name? fournitures-scolaire
# - Directory? ./
# - Want to override settings? N
```

#### C. Configuration variables sur Vercel

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur votre projet
3. Aller dans Settings → Environment Variables
4. Ajouter :
   - `DATABASE_URL` : votre URL PlanetScale
   - `NUXT_PAYTECH_API_KEY` : votre clé API
   - `NUXT_PAYTECH_SECRET_KEY` : votre clé secrète
   - `NUXT_PAYTECH_SANDBOX` : `false`

#### D. Redéployer avec les variables

```bash
vercel --prod
```

## ✅ Vérification Finale

### 1. Site en ligne

- Votre site sera sur : `https://fournitures-scolaire.vercel.app`
- Tester la page d'accueil

### 2. Base de données

- Aller sur `/test/payment-debug`
- Vérifier que la BDD est connectée

### 3. Paiements

- Tester un checkout complet
- Les webhooks PayTech fonctionneront automatiquement !

## 🆘 En cas de problème

### Erreur Database

```bash
# Vérifier la connexion
npm run test:prod-db

# Si erreur, vérifier DATABASE_URL dans .env.production
```

### Erreur Déploiement

```bash
# Logs Vercel
vercel logs

# Redéployer
vercel --prod
```

### Variables manquantes

1. Vérifier dans Vercel Dashboard > Settings > Environment Variables
2. Redéployer après ajout : `vercel --prod`

## 🎉 Après déploiement

Votre e-commerce sera 100% fonctionnel :

- ✅ Commandes sauvegardées en base
- ✅ Paiements PayTech fonctionnels
- ✅ Webhooks reçus automatiquement
- ✅ Accessible depuis Internet

**Temps total : ~15 minutes** ⚡
