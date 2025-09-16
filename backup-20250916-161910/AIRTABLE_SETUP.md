# 🚀 Guide de Configuration Airtable pour EduShop

## 1. Création de votre base Airtable

### Étape 1: Créer un compte Airtable

1. Allez sur [airtable.com](https://airtable.com) et créez un compte gratuit
2. Créez une nouvelle base appelée "EduShop"

### Étape 2: Créer les tables

#### Table "Products" (Produits)

Créez une table avec ces colonnes :

- `Name` (Single line text) - Nom du produit
- `Price` (Currency) - Prix en FCFA
- `Original Price` (Currency) - Prix original (optionnel)
- `Category` (Single select) - Catégorie (Cahiers, Stylos, etc.)
- `Image` (URL) - Lien vers l'image
- `Description` (Long text) - Description du produit
- `In Stock` (Checkbox) - En stock ?
- `Is Promotion` (Checkbox) - En promotion ?
- `Promotion End Date` (Date) - Fin de promotion (optionnel)

#### Table "Packs" (Packs scolaires)

Créez une table avec ces colonnes :

- `Name` (Single line text) - Nom du pack
- `Level` (Single select) - Niveau (CP, CE1, CE2, etc.)
- `Price` (Currency) - Prix en FCFA
- `Original Price` (Currency) - Prix original (optionnel)
- `Image` (URL) - Lien vers l'image
- `Description` (Long text) - Description du pack
- `Contents` (Multiple select) - Contenu du pack
- `Is Popular` (Checkbox) - Pack populaire ?
- `In Stock` (Checkbox) - En stock ?
- `Is Promotion` (Checkbox) - En promotion ?
- `Promotion End Date` (Date) - Fin de promotion (optionnel)

#### Table "Orders" (Commandes)

Créez une table avec ces colonnes :

- `Reference` (Single line text) - Référence de commande
- `Customer Name` (Single line text) - Nom du client
- `Customer Email` (Email) - Email du client (optionnel)
- `Customer Phone` (Phone number) - Téléphone du client
- `Items` (Long text) - Articles commandés (JSON)
- `Total` (Currency) - Total de la commande
- `Status` (Single select) - Statut (pending, confirmed, delivered, cancelled)
- `Payment Status` (Single select) - Paiement (pending, paid, failed)
- `Created At` (Date) - Date de création

## 2. Configuration des variables d'environnement

### Étape 1: Obtenir votre clé API

1. Allez sur [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Cliquez sur "Create token"
3. Donnez un nom à votre token (ex: "EduShop API")
4. Sélectionnez votre base "EduShop"
5. Accordez les permissions : `data.records:read` et `data.records:write`
6. Créez le token et copiez-le

### Étape 2: Obtenir l'ID de votre base

1. Allez sur votre base Airtable
2. Dans l'URL, copiez l'ID qui commence par "app" (ex: app1234567890)

### Étape 3: Configurer les variables

Dans votre fichier `.env`, ajoutez :

```env
# Configuration Airtable
AIRTABLE_API_KEY=patABC123XYZ789... # Votre clé API
AIRTABLE_BASE_ID=app1234567890      # ID de votre base
AIRTABLE_PRODUCTS_TABLE=Products
AIRTABLE_PACKS_TABLE=Packs
AIRTABLE_ORDERS_TABLE=Orders
```

## 3. Modification de votre page d'accueil

Remplacez l'utilisation du store `products` par le store `airtable` :

```vue
<script setup>
import { useAirtableStore } from "~/stores/airtable";

const airtableStore = useAirtableStore();

onMounted(async () => {
  await airtableStore.initialize();
});

// Utiliser airtableStore.products et airtableStore.packs
</script>
```

## 4. Exemples de données

### Produits d'exemple

```
Nom: Cahier 200 pages
Prix: 500
Catégorie: Cahiers
Image: https://example.com/cahier.jpg
En stock: ✓
```

### Packs d'exemple

```
Nom: Pack CP Complet
Niveau: CP
Prix: 15000
Contenu: Cahier, Stylos, Crayons, Gomme, Règle
Populaire: ✓
En stock: ✓
```

## 5. Test de l'intégration

1. Redémarrez votre serveur : `npm run dev`
2. Visitez : `http://localhost:3000/api/airtable/products`
3. Vous devriez voir vos produits en JSON
4. Visitez : `http://localhost:3000/api/airtable/packs`
5. Vous devriez voir vos packs en JSON

## 6. Avantages d'Airtable

✅ **Interface intuitive** - Gestion facile des produits
✅ **Temps réel** - Modifications instantanées
✅ **Collaboratif** - Plusieurs personnes peuvent gérer
✅ **Gratuit** - Jusqu'à 1 200 enregistrements
✅ **Sauvegardes** - Données sécurisées
✅ **API robuste** - Intégration simple

Airtable remplace votre base de données pour la gestion des contenus !
