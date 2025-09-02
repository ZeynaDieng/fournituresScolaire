# 🔧 CORRECTION URGENTE - Configuration PayTech Production

## ❌ Problème actuel

Le site affiche "❌ Configuration PayTech manquante en production !" car les variables d'environnement PayTech ne sont pas correctement configurées sur Vercel.

## ✅ Solution (15 minutes)

### 1. 🔑 Variables à ajouter sur Vercel

Allez sur https://vercel.com/dashboard → Votre projet → **Settings** → **Environment Variables**

Ajoutez ces 10 variables **UNE PAR UNE** :

```bash
# Base de données
DATABASE_URL = postgresql://postgres.sigjxcnrthaxoceclmdi:Fekam5460@aws-1-eu-north-1.pooler.supabase.com:6543/postgres

# PayTech côté serveur (privées)
NUXT_PAYTECH_API_KEY = 0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
NUXT_PAYTECH_SECRET_KEY = 566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
NUXT_PAYTECH_SANDBOX = false

# PayTech côté client (publiques - CRITIQUES!)
NUXT_PUBLIC_PAYTECH_API_KEY = 0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
NUXT_PUBLIC_PAYTECH_SANDBOX = false

# Configuration site
NUXT_PUBLIC_BASE_URL = https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_SITE_URL = https://fournitures-scolaire.vercel.app
NUXT_PUBLIC_API_BASE = /api

# ⚠️ À MODIFIER - Votre vrai Merchant ID PayTech
NUXT_PUBLIC_PAYTECH_MERCHANT_ID = VotreMerchantId
```

### 2. 🚨 IMPORTANT - Merchant ID

**Remplacez `VotreMerchantId` par votre VRAI Merchant ID PayTech** !
Vous le trouvez dans votre dashboard PayTech.

### 3. 🔄 Redéploiement

Après avoir ajouté toutes les variables :

- Cliquez sur **"Redeploy"** dans Vercel
- OU poussez un nouveau commit sur GitHub

### 4. ✅ Vérification

Après redéploiement :

```bash
npm run test:paytech
```

Ou visitez https://fournitures-scolaire.vercel.app

- Plus d'erreur "Configuration PayTech manquante" ✅
- Le paiement devrait fonctionner ✅

## 🔍 Pourquoi ce problème ?

Le middleware `paytech-config.ts` cherche les variables **PUBLIQUES** :

- `NUXT_PUBLIC_PAYTECH_API_KEY` (accessible côté client)
- Pas seulement `NUXT_PAYTECH_API_KEY` (privée, côté serveur)

## 📞 Si problème persistant

1. Vérifiez que TOUTES les variables sont bien ajoutées sur Vercel
2. Vérifiez le Merchant ID (pas "VotreMerchantId")
3. Redéployez après chaque modification
4. Contactez-moi avec les logs d'erreur

---

**Temps estimé : 10-15 minutes maximum**
