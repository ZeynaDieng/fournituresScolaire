# 🚀 Guide de Déploiement - Fournitures Scolaires

## 📋 Prérequis

### 1. Vercel CLI

```bash
npm install -g vercel
```

### 2. Variables d'environnement

Configurez ces variables dans le dashboard Vercel :

#### Variables REQUISES :

- `AIRTABLE_API_KEY` - Votre clé API Airtable
- `AIRTABLE_BASE_ID` - L'ID de votre base Airtable

#### Variables OPTIONNELLES :

- `PAYTECH_API_KEY` - Clé API PayTech (pour les paiements)
- `PAYTECH_SECRET_KEY` - Clé secrète PayTech
- `GOOGLE_SHEET_ID` - ID de votre Google Sheet
- `GOOGLE_SHEETS_API_KEY` - Clé API Google Sheets
- `WHATSAPP_BUSINESS_NUMBER` - Numéro WhatsApp Business

## 🎯 Déploiement

### Méthode 1 : Via Vercel CLI

```bash
# 1. Connexion à Vercel
vercel login

# 2. Déploiement
vercel --prod
```

### Méthode 2 : Via GitHub (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans le dashboard
3. Le déploiement se fait automatiquement à chaque push

## 🔧 Dépannage

### Problème : Build échoue

**Solutions :**

- Vérifiez que toutes les variables d'environnement sont configurées
- Assurez-vous que `NODE_ENV=production` est défini
- Vérifiez les logs de build dans le dashboard Vercel

### Problème : Erreur 500 sur l'API

**Solutions :**

- Vérifiez les variables `AIRTABLE_API_KEY` et `AIRTABLE_BASE_ID`
- Testez la connexion Airtable localement
- Vérifiez les logs de fonction dans Vercel

### Problème : Assets non trouvés

**Solutions :**

- Vérifiez que `nuxt.config.ts` a `preset: "vercel"`
- Assurez-vous que les fichiers statiques sont dans le dossier `public/`

### Problème : Timeout de build

**Solutions :**

- Réduisez la taille des assets
- Optimisez les images
- Vérifiez les dépendances lourdes

## 📊 Monitoring

### Logs Vercel

- Dashboard Vercel → Functions → Logs
- Surveillez les erreurs 500 et les timeouts

### Performance

- Utilisez Vercel Analytics
- Surveillez les Core Web Vitals

## 🛠️ Commandes utiles

```bash
# Test local de production
npm run build
npm run preview

# Vérification des variables d'environnement
npm run deploy:vercel

# Logs en temps réel
vercel logs --follow
```

## 📞 Support

En cas de problème :

1. Vérifiez ce guide
2. Consultez les logs Vercel
3. Testez localement avec `npm run build`
4. Vérifiez la configuration des variables d'environnement
