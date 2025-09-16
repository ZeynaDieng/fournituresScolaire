# 🚀 GUIDE URGENT - CONFIGURATION AIRTABLE

## ⚡ ÉTAPE 1 : CRÉER LES CHAMPS MANUELLEMENT

### 📣 TABLE PROMOTIONS (tblrUYgl2PgYIEMY5)

Allez dans Airtable > Base `appOtYkVavA4MMMnN` > Table `Promotions` et créez ces champs :

1. **Title** - Single line text
2. **Description** - Long text
3. **Discount** - Number (Integer)
4. **Type** - Single select (Options: percentage, fixed, bogo)
5. **End Date** - Date
6. **Category** - Single line text
7. **Trending** - Checkbox
8. **Featured** - Checkbox
9. **Icon** - Single line text
10. **Rating** - Number (Integer)
11. **Features** - Long text
12. **Original Price** - Currency (CFA)
13. **Current Price** - Currency (CFA)
14. **Is Active** - Checkbox

### 💬 TABLE TESTIMONIALS (tblYjfi1FFk1CCH46)

Allez dans Airtable > Base `appOtYkVavA4MMMnN` > Table `Testimonials` et créez ces champs :

1. **Name** - Single line text
2. **Role** - Single line text
3. **Avatar_URL** - URL
4. **Text** - Long text
5. **Rating** - Number (Integer)
6. **Location** - Single line text
7. **Is_Active** - Checkbox
8. **Order** - Number (Integer)

## ⚡ ÉTAPE 2 : REMPLIR LES DONNÉES

Une fois les champs créés, exécutez :

```bash
node scripts/fill-airtable-data.js
```

## ⚡ ÉTAPE 3 : VÉRIFICATION

Après remplissage, vérifiez :

```bash
# Test des endpoints
curl http://localhost:3000/api/airtable/promotions
curl http://localhost:3000/api/airtable/testimonials

# Audit final
node scripts/final-audit.js
```

## 🎯 DONNÉES D'EXEMPLE À SAISIR MANUELLEMENT

Si le script automatique ne fonctionne pas, saisissez manuellement ces données :

### PROMOTIONS :

**Promotion 1:**

- Title: "Pack Rentrée CP - Offre Spéciale"
- Description: "Profitez de -25% sur tous les packs CP pour bien commencer l'année scolaire."
- Discount: 25
- Type: percentage
- End Date: 2025-10-15
- Category: "Packs Scolaires"
- Trending: ✓
- Featured: ✓
- Icon: "🎒"
- Rating: 5
- Original Price: 20000 CFA
- Current Price: 15000 CFA
- Is Active: ✓

**Promotion 2:**

- Title: "Fournitures Collège - Super Promo"
- Description: "Réduction exceptionnelle de 30% sur tous les articles pour collégiens."
- Discount: 30
- Type: percentage
- End Date: 2025-09-30
- Category: "Fournitures"
- Featured: ✓
- Icon: "📚"
- Rating: 4
- Original Price: 35000 CFA
- Current Price: 24500 CFA
- Is Active: ✓

### TÉMOIGNAGES :

**Témoignage 1:**

- Name: "Awa Diop"
- Role: "Maman de 2 enfants"
- Avatar_URL: "https://i.pravatar.cc/150?img=1"
- Text: "Service exceptionnel ! J'ai commandé les packs CP et CE1 pour mes enfants. Tout était parfait !"
- Rating: 5
- Location: "Dakar"
- Is_Active: ✓
- Order: 1

**Témoignage 2:**

- Name: "Moussa Sall"
- Role: "Enseignant primaire"
- Avatar_URL: "https://i.pravatar.cc/150?img=2"
- Text: "En tant qu'enseignant, je recommande ce site à tous les parents. Les packs sont bien pensés !"
- Rating: 5
- Location: "Thiès"
- Is_Active: ✓
- Order: 2

## ✅ RÉSULTAT ATTENDU

Après cette configuration :

- ✅ Page d'accueil affiche les promotions
- ✅ Section témoignages fonctionne
- ✅ Page `/promotions` populated
- ✅ Tous les endpoints retournent des données réelles
- ✅ Plus de données hardcodées
