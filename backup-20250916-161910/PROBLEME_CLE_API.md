# 🚨 PROBLÈME DE CLÉ API IDENTIFIÉ

## Le problème

La clé API `d623f1e945ebe7725ac52c0fb14b78f34bdf103b` n'est pas valide pour Google Sheets API.

Cette clé semble provenir d'un autre service (peut-être GitHub, PayTech, etc.).

## ✅ Solution : Obtenir la vraie clé API Google Sheets

### 1. Allez sur Google Cloud Console

👉 https://console.cloud.google.com/apis/credentials

### 2. Sélectionnez votre projet

- Assurez-vous d'être dans le bon projet (project ID: 101527018819)

### 3. Créez une nouvelle clé API Google Sheets

1. Cliquez sur **"+ CREATE CREDENTIALS"**
2. Sélectionnez **"API key"**
3. Une clé sera générée (elle commence par `AIza...`)
4. **IMPORTANT** : Cliquez sur la clé pour la restreindre
5. Dans "API restrictions" :
   - Sélectionnez **"Restrict key"**
   - Choisissez **"Google Sheets API"** uniquement
6. Sauvegardez

### 4. Activez l'API Google Sheets (si pas déjà fait)

👉 https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=101527018819

Cliquez sur **"ENABLE"** / **"ACTIVER"**

### 5. Mettez à jour votre fichier .env

Remplacez la ligne :

```bash
GOOGLE_SHEETS_API_KEY=d623f1e945ebe7725ac52c0fb14b78f34bdf103b
```

Par :

```bash
GOOGLE_SHEETS_API_KEY=AIza[VOTRE_NOUVELLE_CLE_ICI]
```

### 6. Testez la nouvelle clé

```bash
curl "https://sheets.googleapis.com/v4/spreadsheets/1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0?key=AIza[VOTRE_NOUVELLE_CLE]"
```

## 🔍 Identifiez les types de clés

- **Google Sheets API** : `AIzaSy...` (40 caractères environ)
- **GitHub** : `ghp_...` ou `github_pat_...`
- **PayTech** : Format hexadécimal long
- **Autres** : Formats variés

## ⚠️ Important

- La clé actuelle `d623f1e945ebe7725ac52c0fb14b78f34bdf103b` n'est PAS une clé Google
- Vous devez créer une vraie clé API Google Sheets
- N'oubliez pas de l'activer ET de la restreindre pour la sécurité

---

🎯 **Action suivante** : Créez une nouvelle clé API Google Sheets qui commence par `AIza...`
