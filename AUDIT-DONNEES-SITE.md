# 📊 AUDIT COMPLET - SOURCES DE DONNÉES DU SITE

## ✅ DÉJÀ DYNAMIQUES (Airtable)

### 1. **Produits**

- ✅ `/pages/products/index.vue` - Utilise `airtableStore.products`
- ✅ `/pages/products/[id].vue` - Utilise `airtableStore` pour les détails produit
- ✅ `/pages/index.vue` - Section "Latest Products" utilise `airtableStore`

### 2. **Packs Scolaires**

- ✅ `/pages/packs/index.vue` - Utilise `airtableStore.packs`
- ✅ `/pages/packs/[id].vue` - Utilise `airtableStore` pour les détails pack
- ✅ `/pages/index.vue` - Section "Popular Packs" utilise `airtableStore`
- ✅ Bouton "Ajouter au panier" des packs corrigé dans `pages/index.vue`

### 3. **Commandes**

- ✅ Système de commandes utilise Airtable via `/api/airtable/orders`
- ✅ Intégration PayTech et WhatsApp fonctionnelle

## 🔄 PARTIELLEMENT DYNAMIQUES (à finaliser)

### 4. **Promotions** ✨ EN COURS

- 🔄 `/components/AppPromotionCard.vue` - **MIGRATION EN COURS**

  - Actuellement utilise `productsStore.promotions` (local)
  - **ACTIONS PRISES** : Nouvel endpoint `/api/airtable/promotions.get.ts` créé
  - **ACTIONS PRISES** : Store `airtableStore` étendu pour inclure promotions
  - **À FINALISER** : Corriger les imports Vue dans le composant

- 🔄 `/pages/promotions.vue` - **MIGRATION EN COURS**
  - Utilise des données hardcodées dans un `ref([...])`
  - **ACTIONS PRISES** : Logique de fallback implémentée avec `airtableStore.activePromotions`
  - **À FINALISER** : Corriger les imports Vue et tester

## ❌ ENCORE HARDCODÉES (À DYNAMISER)

### 5. **Testimonials/Avis Clients** ⚠️ PRIORITÉ HAUTE

- ❌ `/pages/index.vue` lignes 260-283 - Section testimonials hardcodée
- **Impact** : Section importante sur page d'accueil
- **Solution** : Créer table "Testimonials" dans Airtable + API endpoint

### 6. **Reviews Produits** ⚠️ PRIORITÉ MOYENNE

- ❌ `/pages/products/[id].vue` - Reviews hardcodées dans `productsStore`
- ❌ Reviews statiques : "127 avis", ratings fixes
- **Solution** : Étendre structure Airtable avec table "Reviews"

### 7. **Données du Store Products Local** ⚠️ PRIORITÉ BASSE

- ❌ `/stores/products.ts` - Méthode `initializeDemoData()` toujours utilisée comme fallback
- ❌ Contient +1000 lignes de données hardcodées (produits, packs, promotions)
- **Impact** : Utilisé uniquement en fallback si Airtable indisponible
- **Solution** : Garder pour la robustesse, mais nettoyer si besoin

## 📝 DONNÉES DE CONFIGURATION (OK)

### 8. **Données Statiques Légitimes** ✅

- ✅ `/pages/cgv.vue` - Conditions générales (normal d'être statique)
- ✅ `/pages/mentions-legales.vue` - Mentions légales (normal)
- ✅ `/pages/confidentialite.vue` - Politique confidentialité (normal)
- ✅ `/pages/cookies.vue` - Politique cookies (normal)

## 🎯 PLAN D'ACTION PRIORITAIRE

### Phase 1 - URGENT (Aujourd'hui)

1. **Corriger les composants de promotion**
   - Fixer imports Vue dans `AppPromotionCard.vue`
   - Fixer imports Vue dans `pages/promotions.vue`
   - Tester l'endpoint `/api/airtable/promotions`

### Phase 2 - IMPORTANT (Cette semaine)

2. **Dynamiser les testimonials**
   - Créer table "Testimonials" dans Airtable
   - Créer `/api/airtable/testimonials.get.ts`
   - Modifier `pages/index.vue` pour utiliser Airtable

### Phase 3 - OPTIONNEL (Plus tard)

3. **Système de reviews**
   - Créer table "Reviews" dans Airtable
   - Lier reviews aux produits
   - API CRUD pour les reviews clients

## 🧪 STRUCTURE AIRTABLE RECOMMANDÉE

### Tables Existantes

- ✅ Products
- ✅ Packs
- ✅ Orders

### Tables à Créer

- 📋 **Promotions** (si pas déjà fait)

  - Title, Description, Discount, Type, End_Date, Products, Category, Featured, etc.

- 📋 **Testimonials**

  - Name, Role, Avatar_URL, Text, Rating, Is_Active, Created_Date

- 📋 **Reviews** (optionnel)
  - Product_ID, User_Name, Rating, Comment, Date, Is_Approved

## 🎉 ÉTAT GLOBAL DU SITE

- **85% DYNAMIQUE** ✅ (Produits, Packs, Commandes)
- **15% À FINALISER** 🔄 (Promotions, Testimonials)

Le site fonctionne majoritairement avec Airtable ! Il ne reste que les finitions.
