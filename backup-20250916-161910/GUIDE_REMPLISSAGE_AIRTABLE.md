# 📋 GUIDE POUR REMPLIR LES TABLES AIRTABLE

## 🎯 Tables à Configurer

### 📣 TABLE PROMOTIONS (tblrUYgl2PgYIEMY5)

**Étapes pour créer les champs :**

1. Ouvrir Airtable : https://airtable.com/appOtYkVavA4MMMnN/tblrUYgl2PgYIEMY5
2. Créer les champs suivants :

| Nom du Champ     | Type             | Options                                |
| ---------------- | ---------------- | -------------------------------------- |
| `Title`          | Single line text | -                                      |
| `Description`    | Long text        | -                                      |
| `Discount`       | Number           | Format: Integer                        |
| `Type`           | Single select    | Options: `percentage`, `fixed`, `bogo` |
| `End Date`       | Date             | Format: YYYY-MM-DD                     |
| `Category`       | Single line text | -                                      |
| `Trending`       | Checkbox         | -                                      |
| `Featured`       | Checkbox         | -                                      |
| `Icon`           | Single line text | -                                      |
| `Rating`         | Number           | Format: Integer (1-5)                  |
| `Features`       | Long text        | Format JSON array                      |
| `Original Price` | Currency         | FCFA                                   |
| `Current Price`  | Currency         | FCFA                                   |
| `Is Active`      | Checkbox         | Défaut: ✓                              |

**Données d'exemple à saisir :**

**Promotion 1:**

- Title: `Pack Rentrée CP - Offre Spéciale`
- Description: `Profitez de -25% sur tous les packs CP pour bien commencer l'année scolaire`
- Discount: `25`
- Type: `percentage`
- End Date: `2025-10-15`
- Category: `Packs Scolaires`
- Trending: ✓
- Featured: ✓
- Icon: `🎒`
- Rating: `5`
- Features: `["Livraison gratuite", "Qualité premium", "Pack complet", "Garantie satisfaction"]`
- Original Price: `20000`
- Current Price: `15000`
- Is Active: ✓

**Promotion 2:**

- Title: `Fournitures Collège - Super Promo`
- Description: `Réduction exceptionnelle de 30% sur tous les articles pour collégiens`
- Discount: `30`
- Type: `percentage`
- End Date: `2025-09-30`
- Category: `Fournitures`
- Trending: ✗
- Featured: ✓
- Icon: `📚`
- Rating: `4`
- Features: `["Calculatrice scientifique incluse", "Kit géométrie complet"]`
- Original Price: `35000`
- Current Price: `24500`
- Is Active: ✓

**Promotion 3:**

- Title: `Kit Art & Créativité - Liquidation`
- Description: `Dernière chance ! 40% de réduction sur notre kit complet d'art`
- Discount: `40`
- Type: `percentage`
- End Date: `2025-09-25`
- Category: `Art & Créativité`
- Trending: ✓
- Featured: ✗
- Icon: `🎨`
- Rating: `5`
- Features: `["Crayons de couleur premium", "Feutres lavables", "Peinture acrylique"]`
- Original Price: `12000`
- Current Price: `7200`
- Is Active: ✓

---

### 💬 TABLE TESTIMONIALS (tblYjfi1FFk1CCH46)

**Étapes pour créer les champs :**

1. Ouvrir Airtable : https://airtable.com/appOtYkVavA4MMMnN/tblYjfi1FFk1CCH46
2. Créer les champs suivants :

| Nom du Champ | Type             | Options               |
| ------------ | ---------------- | --------------------- |
| `Name`       | Single line text | -                     |
| `Role`       | Single line text | -                     |
| `Avatar_URL` | URL              | -                     |
| `Text`       | Long text        | -                     |
| `Rating`     | Number           | Format: Integer (1-5) |
| `Location`   | Single line text | -                     |
| `Is_Active`  | Checkbox         | Défaut: ✓             |
| `Order`      | Number           | Format: Integer       |

**Données d'exemple à saisir :**

**Témoignage 1:**

- Name: `Awa Diop`
- Role: `Maman de 2 enfants`
- Avatar_URL: `https://i.pravatar.cc/150?img=1`
- Text: `Service exceptionnel ! J'ai commandé les packs CP et CE1 pour mes enfants. Tout était parfait, livraison rapide et fournitures de qualité. Je recommande vivement !`
- Rating: `5`
- Location: `Dakar`
- Is_Active: ✓
- Order: `1`

**Témoignage 2:**

- Name: `Moussa Sall`
- Role: `Enseignant primaire`
- Avatar_URL: `https://i.pravatar.cc/150?img=2`
- Text: `En tant qu'enseignant, je recommande ce site à tous les parents. Les packs sont bien pensés et correspondent exactement aux besoins des élèves. Bravo !`
- Rating: `5`
- Location: `Thiès`
- Is_Active: ✓
- Order: `2`

**Témoignage 3:**

- Name: `Fatima Ndiaye`
- Role: `Directrice d'école`
- Avatar_URL: `https://i.pravatar.cc/150?img=3`
- Text: `Site très professionnel avec un excellent service client. Les commandes groupées pour notre école se sont très bien passées. Merci pour votre sérieux !`
- Rating: `5`
- Location: `Saint-Louis`
- Is_Active: ✓
- Order: `3`

**Témoignage 4:**

- Name: `Omar Ba`
- Role: `Papa d'un collégien`
- Avatar_URL: `https://i.pravatar.cc/150?img=4`
- Text: `Très satisfait de mon achat. Le pack collège était complet et de bonne qualité. Prix très compétitifs par rapport aux magasins traditionnels.`
- Rating: `4`
- Location: `Kaolack`
- Is_Active: ✓
- Order: `4`

**Témoignage 5:**

- Name: `Aissatou Diouf`
- Role: `Maman de 3 enfants`
- Avatar_URL: `https://i.pravatar.cc/150?img=5`
- Text: `Gain de temps énorme ! Plus besoin de courir les magasins. Tout arrive à domicile et c'est moins cher. Site au top pour les mamans débordées comme moi !`
- Rating: `5`
- Location: `Rufisque`
- Is_Active: ✓
- Order: `5`

---

## 🔗 LIENS DIRECTS AIRTABLE

### 📋 Accès aux Tables

- **Promotions:** https://airtable.com/appOtYkVavA4MMMnN/tblrUYgl2PgYIEMY5
- **Testimonials:** https://airtable.com/appOtYkVavA4MMMnN/tblYjfi1FFk1CCH46
- **Products:** https://airtable.com/appOtYkVavA4MMMnN/tblxGbcySHadDtsyn
- **Packs:** https://airtable.com/appOtYkVavA4MMMnN/tbl4JVykOdi6YFvfd

### 🧪 Test des Endpoints après Remplissage

```bash
# Tester les promotions
curl http://localhost:3000/api/airtable/promotions | jq '.'

# Tester les témoignages
curl http://localhost:3000/api/airtable/testimonials | jq '.'

# Audit complet
node scripts/final-audit.js
```

### 🎯 Pages à Vérifier

- Page d'accueil: http://localhost:3000/ (promotions + témoignages)
- Page promotions: http://localhost:3000/promotions
- Composant dynamique visible sur les deux pages

---

## ⚡ APRÈS REMPLISSAGE

Une fois les données saisies dans Airtable :

1. **Redémarrer le serveur** : `npm run dev`
2. **Lancer l'audit** : `node scripts/final-audit.js`
3. **Vérifier les pages** :
   - http://localhost:3000/
   - http://localhost:3000/promotions

Le site affichera alors **100% de données dynamiques** depuis Airtable ! 🎉
