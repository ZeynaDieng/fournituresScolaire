# 🚀 Configuration des Variables d'Environnement Vercel

## Variables à configurer dans Vercel Dashboard

### 1. PayTech (Paiement)
```
PAYTECH_API_KEY=your_paytech_api_key_here
PAYTECH_SECRET_KEY=your_paytech_secret_key_here
PAYTECH_SANDBOX=true
```

### 2. Airtable (Base de données)
```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

### 3. Application
```
NUXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
NUXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
NUXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number_here
DATABASE_URL=your_database_connection_string_here
```

## 📋 Étapes de Configuration

1. **Aller sur Vercel Dashboard**
   - Connectez-vous à https://vercel.com
   - Sélectionnez votre projet

2. **Accéder aux Variables d'Environnement**
   - Onglet "Settings"
   - Section "Environment Variables"

3. **Ajouter chaque variable**
   - Nom: PAYTECH_API_KEY
   - Valeur: [votre clé API PayTech]
   - Environnement: Production, Preview, Development

4. **Redéployer après configuration**
   - Onglet "Deployments"
   - Bouton "Redeploy" sur le dernier déploiement

## 🔧 Variables Critiques Manquantes

- PAYTECH_API_KEY
- PAYTECH_SECRET_KEY
- PAYTECH_SANDBOX
- AIRTABLE_API_KEY
- AIRTABLE_BASE_ID
- NUXT_PUBLIC_BASE_URL
- NUXT_PUBLIC_WHATSAPP_NUMBER
- DATABASE_URL

## 🌐 URLs de Test Après Configuration

- Site principal: https://your-app.vercel.app
- Test PayTech: https://your-app.vercel.app/checkout
- Test API: https://your-app.vercel.app/api/paytech/initiate (POST)
- Images: https://your-app.vercel.app/images/payment/default.png
