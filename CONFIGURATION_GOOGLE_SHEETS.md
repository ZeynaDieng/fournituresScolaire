# 🚀 Configuration rapide pour Google Sheets

## 1. Variables d'environnement requises

Créez un fichier `.env` à la racine de votre projet avec ces variables :

```bash
# Configuration Google Sheets (OBLIGATOIRE)
GOOGLE_SHEET_ID=1ABC...XYZ  # À récupérer dans l'URL de votre Google Sheet
GOOGLE_SHEETS_API_KEY=AIza...  # Clé API de Google Cloud Console

# Configuration WhatsApp Business
WHATSAPP_BUSINESS_NUMBER=221123456789  # Votre numéro WhatsApp Business
```

## 2. Étapes de configuration

### A. Créer un Google Sheet

1. Allez sur https://sheets.google.com
2. Créez un nouveau sheet nommé "Commandes EduShop"
3. Copiez l'ID depuis l'URL (entre `/d/` et `/edit`)

### B. Configurer l'API Google

1. Allez sur https://console.cloud.google.com/
2. Créez un projet ou sélectionnez-en un
3. Activez "Google Sheets API"
4. Créez une clé API (Credentials > Create Credentials > API Key)
5. Restreignez la clé à "Google Sheets API"

### C. Rendre le Sheet accessible

1. Ouvrez votre Google Sheet
2. Cliquez sur "Partager"
3. Changez à "Toute personne avec le lien peut consulter"

## 3. Test de l'intégration

1. Redémarrez votre serveur Nuxt après avoir ajouté le `.env`
2. Allez sur `/admin/test-google-sheets`
3. Vérifiez que les indicateurs sont verts
4. Cliquez "Créer les en-têtes" pour initialiser
5. Testez avec "Tester la commande"

## 4. Structure automatique du Google Sheet

Chaque commande WhatsApp créera une ligne avec :

- Date/Heure
- Référence unique
- Informations client (nom, email, téléphone)
- Adresse de livraison
- Détails des articles
- Montants (sous-total, livraison, total)
- Statut de la commande

## 5. Utilisation

Dès que la configuration est faite :

- Chaque commande WhatsApp = nouvelle ligne dans Google Sheets
- Accessible depuis `/admin/rapports`
- Suivi en temps réel
- Aucune base de données requise !

## ⚠️ Important

- Le `.env` ne doit JAMAIS être commité sur Git
- Utilisez `.env.example` comme modèle
- Gardez vos clés API secrètes
- Testez d'abord en local

---

**💡 Astuce** : Créez des onglets supplémentaires dans votre Google Sheet pour des statistiques automatiques !
