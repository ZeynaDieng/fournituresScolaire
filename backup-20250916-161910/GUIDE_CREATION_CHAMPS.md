# 🎯 GUIDE STEP-BY-STEP - CRÉATION DES CHAMPS AIRTABLE

## ⚡ ÉTAPE 1 : TABLE PROMOTIONS

1. Allez sur **https://airtable.com/appOtYkVavA4MMMnN**
2. Cliquez sur la table **"Promotions"**
3. Cliquez sur **"+"** pour ajouter ces champs :

### Champs à créer UN PAR UN :

| Nom du champ       | Type             | Options                                |
| ------------------ | ---------------- | -------------------------------------- |
| **Title**          | Single line text | -                                      |
| **Description**    | Long text        | -                                      |
| **Discount**       | Number           | Format: Integer                        |
| **Type**           | Single select    | Options: `percentage`, `fixed`, `bogo` |
| **End Date**       | Date             | Format: DD/MM/YYYY                     |
| **Category**       | Single line text | -                                      |
| **Trending**       | Checkbox         | -                                      |
| **Featured**       | Checkbox         | -                                      |
| **Icon**           | Single line text | -                                      |
| **Rating**         | Number           | Format: Integer                        |
| **Features**       | Long text        | -                                      |
| **Original Price** | Currency         | Symbol: CFA                            |
| **Current Price**  | Currency         | Symbol: CFA                            |
| **Is Active**      | Checkbox         | -                                      |

## ⚡ ÉTAPE 2 : TABLE TESTIMONIALS

1. Cliquez sur la table **"Testimonials"**
2. **SUPPRIMEZ** les champs existants inutiles
3. Créez ces nouveaux champs :

| Nom du champ   | Type             | Options         |
| -------------- | ---------------- | --------------- |
| **Name**       | Single line text | -               |
| **Role**       | Single line text | -               |
| **Avatar_URL** | URL              | -               |
| **Text**       | Long text        | -               |
| **Rating**     | Number           | Format: Integer |
| **Location**   | Single line text | -               |
| **Is_Active**  | Checkbox         | -               |
| **Order**      | Number           | Format: Integer |

## ⚡ ÉTAPE 3 : REMPLIR AUTOMATIQUEMENT

Une fois les champs créés, exécutez :

```bash
node scripts/fill-airtable-data.js
```

## ⚡ ÉTAPE 4 : VÉRIFIER

```bash
node scripts/final-audit.js
```

Le résultat attendu : **Plus de FALLBACK MODE** ! 🎉
