# Guide de Déploiement - EduShop Sénégal

## 🚀 Déploiement sur Vercel (Recommandé)

### 1. Préparation

```bash
# Vérifier que tout fonctionne localement
npm run build
npm run preview

# Tester les fonctionnalités critiques
npm run test:whatsapp-functionality
```

### 2. Configuration Vercel

1. **Connecter le repository GitHub à Vercel**

   - Aller sur [vercel.com](https://vercel.com)
   - Importer le projet depuis GitHub
   - Sélectionner le framework "Nuxt.js"

2. **Configurer les variables d'environnement**

```bash
# Variables obligatoires
AIRTABLE_API_KEY=patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a
AIRTABLE_BASE_ID=appOtYkVavA4MMMnN
AIRTABLE_PRODUCTS_TABLE=tblxGbcySHadDtsyn
AIRTABLE_PACKS_TABLE=tbl4JVykOdi6YFvfd
AIRTABLE_ORDERS_TABLE=tblIx2zvrcz1VY7xb
AIRTABLE_PROMOTIONS_TABLE=tblrUYgl2PgYIEMY5
AIRTABLE_TESTIMONIALS_TABLE=tblYjfi1FFk1CCH46

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=221777780456

# URL de production (à adapter)
NUXT_PUBLIC_SITE_URL=https://votre-site.vercel.app
BASE_URL=https://votre-site.vercel.app

# PayTech (si utilisé)
PAYTECH_API_KEY=votre_clé_paytech
PAYTECH_SECRET_KEY=votre_secret_paytech
PAYTECH_SANDBOX=false
```

3. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du build (environ 2-3 minutes)

### 3. Vérification Post-Déploiement

1. **Tester les pages principales**

   - `/` (accueil)
   - `/products` (produits)
   - `/packs` (packs)
   - `/promotions` (promotions)
   - `/checkout` (commande)

2. **Tester les API**

   - `/api/airtable/products`
   - `/api/airtable/promotions`
   - `/api/airtable/testimonials`

3. **Tester WhatsApp**
   - Aller sur `/checkout`
   - Remplir le formulaire
   - Tester l'envoi WhatsApp

---

## 🌐 Déploiement sur Netlify

### 1. Configuration Netlify

```bash
# Créer netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Variables d'environnement Netlify

```bash
# Dans Netlify Dashboard > Site Settings > Environment Variables
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
WHATSAPP_BUSINESS_NUMBER=221777780456
NUXT_PUBLIC_SITE_URL=https://votre-site.netlify.app
```

---

## 🐳 Déploiement Docker

### 1. Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", ".output/server/index.mjs"]
```

### 2. Docker Compose

```yaml
version: "3.8"
services:
  edushop:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AIRTABLE_API_KEY=${AIRTABLE_API_KEY}
      - AIRTABLE_BASE_ID=${AIRTABLE_BASE_ID}
      - WHATSAPP_BUSINESS_NUMBER=${WHATSAPP_BUSINESS_NUMBER}
      - NUXT_PUBLIC_SITE_URL=http://localhost:3000
    restart: unless-stopped
```

---

## 🔧 Problèmes Courants et Solutions

### Erreur : "Module not found"

```bash
# Vérifier les dépendances
npm install
npm run build
```

### Erreur : "API routes not working"

```bash
# Vérifier la configuration Nuxt
# S'assurer que server/api/ existe
# Vérifier les variables d'environnement
```

### Erreur : "WhatsApp not working"

```bash
# Vérifier WHATSAPP_BUSINESS_NUMBER
# Tester avec: npm run test:whatsapp-functionality
```

### Build trop lent

```bash
# Optimiser les imports
# Vérifier les dépendances inutiles
# Utiliser npm ci au lieu de npm install
```

---

## 📊 Monitoring et Performance

### 1. Variables d'analytics (optionnel)

```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=xxxxxxxxxx
```

### 2. Monitoring des erreurs

```bash
# Utiliser Sentry ou LogRocket
SENTRY_DSN=https://...
```

### 3. Performance

- Utiliser Vercel Analytics
- Configurer les headers de cache
- Optimiser les images

---

## 🚨 Checklist de Déploiement

- [ ] Build réussi localement (`npm run build`)
- [ ] Tests passent (`npm run test:whatsapp-functionality`)
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré
- [ ] SSL activé
- [ ] API Airtable accessible
- [ ] WhatsApp fonctionne
- [ ] Formulaires de contact opérationnels
- [ ] Images optimisées
- [ ] SEO configuré
- [ ] Analytics configuré (optionnel)

---

## 🆘 Support

En cas de problème :

1. **Vérifier les logs**
   - Vercel : Functions > View Function Logs
   - Netlify : Functions > View Logs
2. **Tester localement**

   ```bash
   npm run build
   npm run preview
   ```

3. **Vérifier la configuration**

   ```bash
   node scripts/deployment-diagnostic.js
   ```

4. **Debug les API**
   - Tester `/api/status`
   - Vérifier les variables d'environnement
   - Consulter la documentation Airtable

---

## 🎯 Optimisations Post-Déploiement

1. **SEO**

   - Configurer Google Search Console
   - Ajouter un sitemap
   - Optimiser les meta tags

2. **Performance**

   - Activer la compression gzip
   - Optimiser les images
   - Configurer le cache

3. **Monitoring**
   - Configurer les alertes d'erreur
   - Surveiller les performances
   - Analyser les métriques utilisateur

---

**🎉 Félicitations ! Votre site EduShop Sénégal est maintenant en ligne !**
