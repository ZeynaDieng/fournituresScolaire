# 🔑 Guide pour Régénérer le Token Airtable

## 🚨 **Problème Identifié :**

- **Erreur 401 Unauthorized** de Airtable
- **Token expiré** : `patvDhKsKBJRGRXnx.3d8b4b9d8e2f4c1e9a7b3f5d8c2e6a9b4f7c1d5e8a2b6c9f3d7e1a4b8c5f2e9a6d3b7c`

## 📋 **Étapes pour Générer un Nouveau Token :**

### 1. 🌐 **Aller sur Airtable**

- Connectez-vous à : https://airtable.com
- Allez dans votre compte

### 2. 🔧 **Créer un Token Personnel**

- Allez sur : https://airtable.com/create/tokens
- Cliquez sur **"Create new token"**

### 3. ⚙️ **Configurer le Token**

**Nom du token :** `EduShop Production Token`

**Permissions requises :**

- ✅ `data.records:read` - Lire les enregistrements
- ✅ `data.records:write` - Écrire les enregistrements
- ✅ `schema.bases:read` - Lire la structure

**Bases autorisées :**

- ✅ Sélectionnez votre base `EduShop` ou `Fournitures Scolaires`

### 4. 📋 **Copier le Token**

- Copiez le nouveau token généré
- Il ressemble à : `patXXXXXXXXXXXXX.xxxxxxxxxxxxxxxxxx`

### 5. 🔄 **Remplacer dans .env**

```bash
# Remplacez cette ligne dans votre fichier .env :
AIRTABLE_API_KEY=VOTRE_NOUVEAU_TOKEN_ICI
```

### 6. 🚀 **Redémarrer le Serveur**

```bash
npm run dev
```

## 🧪 **Tester la Connexion**

Après avoir mis le nouveau token :

```bash
node scripts/test-airtable-connection.js
```

Vous devriez voir :

- ✅ Status: 200 OK
- ✅ Connexion réussie !
- 📦 Packs trouvés: X

## ⚠️ **Important :**

- **Gardez ce token secret**
- **Ne le commitez jamais dans Git**
- **Utilisez le même token pour Vercel**

## 🎯 **Résultat Attendu :**

Une fois le nouveau token en place :

- ✅ Pages de packs fonctionnent
- ✅ Données Airtable chargées
- ✅ Plus d'erreur 401
