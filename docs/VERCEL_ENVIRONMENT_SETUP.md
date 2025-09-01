# 🚀 Configuration Vercel pour PayTech

## 🔧 Étapes de Configuration sur Vercel

### 1. Accéder aux Variables d'Environnement

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `fournitures-scolaire`
3. Cliquez sur "Settings"
4. Cliquez sur "Environment Variables"

### 2. Variables Obligatoires à Ajouter

```env
# PayTech Configuration
PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
PAYTECH_SECRET_KEY=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
PAYTECH_SANDBOX=true
PAYTECH_MERCHANT_ID=VotreMerchantId

# URLs Configuration
BASE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_SITE_URL=https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_API_BASE=/api

# Variables Publiques PayTech
NUXT_PUBLIC_PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
NUXT_PUBLIC_PAYTECH_API_SECRET=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
NUXT_PUBLIC_PAYTECH_MERCHANT_ID=VotreMerchantId

# Base de données (temporaire - utilisez un service cloud pour la production)
DATABASE_URL=mysql://root:root@localhost:8889/fourniturescolaire
```

### 3. Configuration des Environnements

Pour chaque variable, définir l'environnement :

- ✅ **Production** (obligatoire)
- ✅ **Preview** (recommandé)
- ⚠️ **Development** (optionnel)

### 4. Redéploiement

Après avoir ajouté les variables :

1. Cliquez sur "Redeploy" dans l'onglet "Deployments"
2. Ou push un nouveau commit sur GitHub

## 🧪 Tests Après Configuration

### Test Manuel via Interface Web

1. Allez sur https://fournitures-scolaire.vercel.app/test-paytech
2. Cliquez sur "Test PayTech Payment"
3. Vérifiez que la requête n'affiche plus "Format de requete invalid"

### Test via API

```bash
curl -X POST https://fournitures-scolaire.vercel.app/api/paytech/initiate \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "ref_command": "test-'$(date +%s)'",
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
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

## 🔍 Dépannage

### Erreur "Format de requete invalid"

- ✅ Vérifier que `PAYTECH_API_KEY` est défini
- ✅ Vérifier que `PAYTECH_SECRET_KEY` est défini
- ✅ Vérifier que `BASE_URL` pointe vers HTTPS
- ✅ Redéployer après ajout des variables

### Variables Manquantes

- Les variables doivent être définies **exactement** comme indiqué
- Attention aux espaces et caractères spéciaux
- Redéploiement obligatoire après modification

### Base de Données

Pour la production, utilisez un service cloud :

- **PlanetScale** (MySQL)
- **Neon** (PostgreSQL)
- **Vercel Postgres**
- **Railway**

## 📞 Support

En cas de problème persistant :

1. Vérifiez les logs dans Vercel Dashboard > Functions
2. Testez en local pour comparer
3. Contactez le support PayTech si les clés ne fonctionnent pas

## ✅ Checklist de Validation

- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Redéploiement effectué
- [ ] Test API réussi (status 200)
- [ ] Page de test fonctionnelle
- [ ] Webhooks PayTech configurés avec l'URL HTTPS
