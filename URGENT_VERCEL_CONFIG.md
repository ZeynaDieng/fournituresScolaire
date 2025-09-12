# 🚀 Configuration Variables d'Environnement Vercel - FOURNITURES SCOLAIRES

## 📋 Variables à Configurer IMMÉDIATEMENT

### 🔐 1. PAYTECH (Paiement)

```
PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
PAYTECH_SECRET_KEY=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
PAYTECH_SANDBOX=true
NUXT_PUBLIC_PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
NUXT_PUBLIC_PAYTECH_API_SECRET=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
NUXT_PUBLIC_PAYTECH_MERCHANT_ID=VotreMerchantId
```

### 📊 2. AIRTABLE (Base de données)

```
AIRTABLE_API_KEY=patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a
AIRTABLE_BASE_ID=appOtYkVavA4MMMnN
AIRTABLE_PRODUCTS_TABLE=tblxGbcySHadDtsyn
AIRTABLE_PACKS_TABLE=tbl4JVykOdi6YFvfd
AIRTABLE_ORDERS_TABLE=tblIx2zvrcz1VY7xb
AIRTABLE_PROMOTIONS_TABLE=tblrUYgl2PgYIEMY5
AIRTABLE_TESTIMONIALS_TABLE=tblYjfi1FFk1CCH46
```

### 🌐 3. APPLICATION (URLs et Configuration)

```
BASE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_BASE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_SITE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_API_BASE=/api
NUXT_PUBLIC_WHATSAPP_NUMBER=221782911844
WHATSAPP_BUSINESS_NUMBER=221782911844
```

### 📧 4. EMAIL (Notifications)

```
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=zmruomypjxrjxfto
ADMIN_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires
```

### 🗄️ 5. BASE DE DONNÉES

```
DATABASE_URL=mysql://root:root@127.0.0.1:8889/fourniturescolaire
```

## 🚀 ÉTAPES DE CONFIGURATION VERCEL

### 1. Accéder à Vercel Dashboard

- URL: https://vercel.com/dashboard
- Projet: **fournitures-scolaire** (ou votre nom de projet)

### 2. Configurer les Variables

1. Cliquez sur votre projet
2. Aller à **Settings** → **Environment Variables**
3. Pour chaque variable ci-dessus :
   - Cliquez **"Add New"**
   - Name: `PAYTECH_API_KEY`
   - Value: `0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b`
   - Environment: **Cocher Production, Preview, Development**
   - Cliquez **Save**

### 3. Variables CRITIQUES (à faire en premier)

```
1. PAYTECH_API_KEY
2. PAYTECH_SECRET_KEY
3. AIRTABLE_API_KEY
4. AIRTABLE_BASE_ID
5. NUXT_PUBLIC_BASE_URL (avec votre URL Vercel)
```

### 4. Redéployer

1. Aller à **Deployments**
2. Cliquer sur le dernier déploiement
3. Cliquer **"Redeploy"**
4. ✅ Attendre la fin du déploiement

## ⚡ CORRECTION URGENTE URL DE PRODUCTION

**Important**: Remplacez `https://fournitures-scolaire.vercel.app` par votre vraie URL Vercel !

Trouvez votre URL ici : https://vercel.com/dashboard → votre projet → View

## 🧪 TESTS APRÈS CONFIGURATION

Une fois les variables configurées et redéployées :

1. **Test de base**: https://votre-app.vercel.app
2. **Test images**: https://votre-app.vercel.app/images/payment/default.png
3. **Test API**: https://votre-app.vercel.app/api/admin/products
4. **Test PayTech** (depuis checkout): Devrait fonctionner sans erreur 500

## 🚨 ERREURS ACTUELLES RÉSOLUES

- ❌ **Erreur 500 PayTech** → ✅ Variables PayTech configurées
- ❌ **Configuration manquante** → ✅ Toutes les variables ajoutées
- ❌ **URLs localhost** → ✅ URLs de production

## 📞 SUPPORT

Si vous avez des problèmes :

1. Vérifiez que TOUTES les variables sont bien saisies
2. Vérifiez l'URL de production (pas localhost)
3. Redéployez après chaque modification
4. Testez étape par étape

---

**⏰ Temps estimé**: 10-15 minutes pour configurer toutes les variables
**🎯 Résultat**: Site 100% opérationnel avec paiement PayTech fonctionnel
