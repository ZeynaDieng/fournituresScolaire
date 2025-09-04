# 📊 Configuration Google Sheets pour EduShop

## Vue d'ensemble

Cette intégration permet à chaque commande WhatsApp de créer automatiquement une nouvelle ligne dans un Google Sheet, vous offrant un suivi en temps réel de toutes vos commandes sans avoir besoin d'une base de données.

## 🚀 Configuration rapide

### 1. Créer un Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau sheet
3. Nommez-le "Commandes EduShop"
4. Copiez l'ID du sheet depuis l'URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
   L'ID est: 1ABC...XYZ
   ```

### 2. Activer l'API Google Sheets

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Sheets :
   - Recherchez "Google Sheets API"
   - Cliquez sur "ACTIVER"

### 3. Créer une clé API

1. Dans Google Cloud Console, allez à "APIs & Services" > "Credentials"
2. Cliquez sur "CREATE CREDENTIALS" > "API key"
3. Copiez la clé générée
4. **Important** : Restreignez la clé pour la sécurité :
   - Cliquez sur votre clé API
   - Sous "API restrictions", sélectionnez "Restrict key"
   - Choisissez "Google Sheets API"
   - Sauvegardez

### 4. Rendre le Sheet public (lecture)

1. Dans votre Google Sheet, cliquez sur "Partager"
2. Changez l'accès à "Toute personne avec le lien peut consulter"
3. Ou ajoutez votre service Google Cloud avec permission d'écriture

### 5. Configuration dans votre application

Ajoutez ces variables dans votre fichier `.env` :

```bash
# Configuration Google Sheets
GOOGLE_SHEET_ID=1ABC...XYZ
GOOGLE_SHEETS_API_KEY=AIza...
```

## 📋 Structure des données

Chaque commande créera une ligne avec les colonnes suivantes :

| Colonne | Description     | Exemple                                   |
| ------- | --------------- | ----------------------------------------- |
| A       | Date/Heure      | 01/09/2025 14:30:25                       |
| B       | Référence       | WA-1693567825123-abc123                   |
| C       | Nom Client      | Jean Dupont                               |
| D       | Email           | jean@example.com                          |
| E       | Téléphone       | +221123456789                             |
| F       | Adresse         | 123 Rue de Dakar                          |
| G       | Ville           | Dakar                                     |
| H       | Mode Livraison  | Livraison standard                        |
| I       | Articles        | Pack CP complet (Qté: 1, Prix: 15000 CFA) |
| J       | Sous-total      | 15000                                     |
| K       | Frais livraison | 2000                                      |
| L       | Réduction       | 0                                         |
| M       | Total           | 17000                                     |
| N       | Statut          | En attente WhatsApp                       |
| O       | Notes           | (vide, pour vos notes)                    |

## 🧪 Test de l'intégration

1. Allez sur `/admin/test-google-sheets` dans votre interface admin
2. Vérifiez que la configuration est correcte (points verts)
3. Cliquez sur "Créer les en-têtes" pour initialiser le sheet
4. Testez avec "Tester la commande"

## 🔄 Flux automatique

Quand un client fait une commande WhatsApp :

1. ✅ Les données sont validées
2. ✅ Une ligne est ajoutée au Google Sheet
3. ✅ La commande est envoyée sur WhatsApp
4. ✅ Vous recevez le message formaté
5. ✅ Vous pouvez suivre la commande dans le Sheet

## 🛠️ Gestion des erreurs

- Si Google Sheets n'est pas configuré, les commandes continuent de fonctionner
- Les erreurs sont loggées en console
- Un fallback en base de données locale est disponible

## 📈 Avantages

- ✅ Aucune base de données requise
- ✅ Interface familière (Google Sheets)
- ✅ Accessible de partout
- ✅ Formules et graphiques disponibles
- ✅ Sauvegarde automatique Google
- ✅ Partage facile avec l'équipe
- ✅ Export vers Excel/CSV

## 🔒 Sécurité

- La clé API est restreinte à Google Sheets uniquement
- Les données sont dans votre Google Drive
- Accès contrôlé par vos paramètres Google
- HTTPS uniquement

## 📊 Suivi des performances

Dans Google Sheets, vous pouvez créer :

- Graphiques de ventes par jour/mois
- Calculs automatiques de CA
- Filtres par ville/produit
- Formules de suivi des tendances

## 🆘 Dépannage

### Erreur "API Key invalide"

- Vérifiez que l'API Google Sheets est activée
- Assurez-vous que la clé n'est pas restreinte à d'autres APIs

### Erreur "Sheet non trouvé"

- Vérifiez l'ID du sheet dans l'URL
- Assurez-vous que le sheet est partagé publiquement

### Erreur "Permission refusée"

- Le sheet doit être accessible en écriture
- Vérifiez les paramètres de partage

## 🔄 Migration de données

Si vous avez déjà des commandes en base :

```sql
-- Export depuis votre base de données
SELECT
  created_at,
  reference,
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  shipping_city,
  shipping_method,
  items_json,
  subtotal,
  shipping_cost,
  discount,
  total,
  status
FROM orders
ORDER BY created_at DESC;
```

Puis importez manuellement dans Google Sheets.

---

**💡 Conseil** : Créez un onglet "Dashboard" dans votre Google Sheet avec des résumés automatiques !
