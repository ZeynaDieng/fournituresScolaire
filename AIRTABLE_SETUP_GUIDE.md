# Guide de configuration Airtable pour Fournitures Scolaires

## 🎯 Objectif

Créer la structure nécessaire dans Airtable pour synchroniser toutes vos données de fournitures scolaires.

## 📋 Étape 1: Accéder à Airtable

1. Allez sur [airtable.com](https://airtable.com)
2. Connectez-vous à votre compte
3. Ouvrez votre base: `appOtYkVavA4MMMnN`

## 📦 Étape 2: Configurer la table PACKS (ID: tbl4JVykOdi6YFvfd)

### Champs nécessaires pour la table Packs:

- **Name** (Text) - Nom du pack
- **Level** (Single select) - Niveau scolaire (CP, CE1-CE2, Collège, Lycée)
- **Price** (Number) - Prix en CFA
- **Original Price** (Number) - Prix original (pour promotions)
- **Image URL** (URL) - Lien de l'image
- **Description** (Long text) - Description du pack
- **Contents** (Long text) - Contenu du pack (séparé par virgules)
- **Is Popular** (Checkbox) - Pack populaire
- **In Stock** (Checkbox) - En stock
- **Is Promotion** (Checkbox) - En promotion
- **Promotion End Date** (Date) - Date de fin de promotion
- **Local ID** (Text) - ID du store local

## 🛍️ Étape 3: Configurer la table PRODUCTS (ID: tblxGbcySHadDtsyn)

### Champs nécessaires pour la table Products:

- **Name** (Text) - Nom du produit
- **Price** (Number) - Prix en CFA
- **Original Price** (Number) - Prix original
- **Image URL** (URL) - Lien de l'image principale
- **Category** (Single select) - Catégorie (Cahiers, Stylos, Crayons, etc.)
- **Description** (Long text) - Description du produit
- **In Stock** (Checkbox) - En stock
- **Is Promotion** (Checkbox) - En promotion
- **Promotion End Date** (Date) - Date de fin de promotion
- **Images** (Long text) - URLs d'images supplémentaires
- **Features** (Long text) - Caractéristiques (format JSON)
- **Specs** (Long text) - Spécifications (format JSON)
- **Reviews** (Long text) - Avis clients (format JSON)
- **Bulk Options** (Long text) - Options de commande en gros (format JSON)
- **Local ID** (Text) - ID du store local

## 📝 Étape 4: Configurer la table ORDERS (ID: tblIx2zvrcz1VY7xb)

### Champs nécessaires pour la table Orders:

- **Order ID** (Text) - Identifiant de commande
- **Customer Name** (Text) - Nom du client
- **Customer Email** (Email) - Email du client
- **Customer Phone** (Phone) - Téléphone du client
- **Total Amount** (Number) - Montant total
- **Status** (Single select) - Statut (Pending, Paid, Shipped, Delivered)
- **Created Date** (Date) - Date de création
- **Items** (Long text) - Articles commandés (format JSON)
- **Shipping Address** (Long text) - Adresse de livraison

## 🚀 Étape 5: Tester la configuration

Une fois les champs créés, exécutez:

```bash
npm run test:airtable-config
```

## ✅ Étape 6: Synchronisation complète

Une fois la structure validée, lancez:

```bash
npm run sync:tables
```

## 💡 Notes importantes

1. **Types de champs**: Respectez bien les types (Text, Number, Checkbox, etc.)
2. **Noms exacts**: Les noms des champs doivent être exactement comme indiqué
3. **Single select**: Pour Level et Category, ajoutez les options possibles
4. **Ordre**: L'ordre des champs n'est pas important

## 🔧 Options pour Single Select

### Level (pour Packs):

- CP
- CE1-CE2
- Collège
- Lycée

### Category (pour Products):

- Cahiers
- Stylos
- Crayons
- Feutres et Surligneurs
- Sacs
- Calculatrices
- Ardoises

### Status (pour Orders):

- Pending
- Paid
- Shipped
- Delivered
- Cancelled

## 🆘 En cas de problème

Si vous rencontrez des erreurs:

1. Vérifiez que tous les champs sont créés
2. Vérifiez l'orthographe exacte des noms
3. Vérifiez les types de champs
4. Exécutez `npm run test:airtable-config` pour diagnostiquer
