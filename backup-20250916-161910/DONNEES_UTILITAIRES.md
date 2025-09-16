# 📊 GUIDE GESTION DES DONNÉES UTILITAIRES

## 🎯 Où mettre vos vraies données ?

### 1. 🗄️ **Base de données Supabase (Principal)**

Les données sont stockées dans Supabase PostgreSQL :

- **Tables** : User, Pack, Product, Order, Payment, Promotion
- **Accès** : https://supabase.com/dashboard → Table Editor
- **Modification** : Interface graphique ou scripts

### 2. 📁 **Dossier `/data/` (Fichiers de référence)**

Fichiers JavaScript avec vos catalogues :

- `data/products-senegal.js` - Catalogue produits Sénégal
- Utilisation : Import dans les scripts ou pages

### 3. 🖼️ **Dossier `/public/images/` (Images)**

Stockage des images produits :

- `public/images/products/` - Photos des produits
- `public/images/packs/` - Photos des packs
- Format recommandé : JPG/PNG, max 500KB

## 🛠️ Commandes de gestion

### Ajouter les vraies données (RECOMMANDÉ)

```bash
npm run seed:real
```

☝️ **Ajoute un catalogue complet adapté au Sénégal**

### Ajouter des données de test

```bash
npm run seed:supabase
```

### Vérifier les données

```bash
npm run check:tables
```

### Voir toutes les données

Allez sur Supabase Dashboard → Table Editor

## 📝 Modifier les données

### Option 1: Interface Supabase (FACILE)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez "Table Editor"
4. Modifiez directement dans les tables

### Option 2: Modifier les scripts

1. Éditez `scripts/seed-real-data.js`
2. Relancez `npm run seed:real`

### Option 3: Interface admin (À DÉVELOPPER)

- Page `/admin` pour gérer le catalogue
- Ajout/modification produits
- Gestion stock et prix

## 📦 Catalogue actuel (après seed:real)

### Packs scolaires

- **Pack CP Complet** - 22 500 FCFA
- **Pack CE1 Standard** - 26 500 FCFA
- **Pack CE2 Complet** - 31 500 FCFA
- **Pack 6ème** - 45 500 FCFA

### Produits individuels

- **Cahiers** - 450-750 FCFA
- **Stylos BIC** - 125 FCFA
- **Kit géométrie** - 2 250 FCFA
- **Crayons 24 couleurs** - 3 200 FCFA
- **Calculatrice Casio** - 8 500 FCFA

### Promotions

- **Rentrée 2025** - 15% sur packs
- **Famille nombreuse** - 20% à partir du 3ème pack

## 💰 Prix adaptés au Sénégal

Les prix sont en **Francs CFA (FCFA)** et adaptés au marché local :

- Cahier simple : 450-750 FCFA
- Stylo basique : 125 FCFA
- Pack complet CP : 22 500 FCFA
- Pack complet 6ème : 45 500 FCFA

## 🔄 Mise à jour régulière

### Prix saisonniers

- **Rentrée** (Sept-Oct) : Prix promotionnels
- **Année scolaire** : Prix standards
- **Vacances** : Promotions écoulement stock

### Nouveaux produits

1. Ajoutez dans `data/products-senegal.js`
2. Modifiez `scripts/seed-real-data.js`
3. Relancez `npm run seed:real`
4. Ajoutez les images dans `/public/images/products/`

## 🚀 Prochaines étapes

1. ✅ **Données ajoutées** - Catalogue complet Sénégal
2. 🔄 **Variables Vercel** - Configuration PayTech
3. 🔄 **Images produits** - Ajout photos réelles
4. 🔄 **Interface admin** - Gestion catalogue
5. 🔄 **Test complet** - Commande + paiement

---

**Votre catalogue est maintenant prêt avec de vraies données ! 🎉**
