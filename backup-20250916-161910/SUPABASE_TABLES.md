# 🗄️ GUIDE BASE DE DONNÉES SUPABASE

## ✅ Tables créées avec succès !

Vos tables ont été créées dans Supabase PostgreSQL :

- **User** - Utilisateurs
- **Pack** - Packs scolaires
- **Product** - Produits individuels
- **Order** - Commandes
- **Payment** - Paiements
- **Promotion** - Promotions

## 🛠️ Commandes utiles

### Vérifier les tables

```bash
npm run check:tables
```

### Ajouter des données de test

```bash
npm run seed:supabase
```

### Pousser le schéma (après modifications)

```bash
npx prisma db push
```

### Réinitialiser la base (ATTENTION - efface tout!)

```bash
npm run db:reset
```

## 🌐 Accès Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **"Table Editor"** dans le menu de gauche
4. Vous devriez voir toutes vos tables avec les données

## 📊 Données de test ajoutées

- **2 packs scolaires** (CP et CE2)
- **2 produits** (stylo plume et cahier)
- **1 promotion** active
- **1 utilisateur** de test
- **1 commande** de test

## 📚 Vraies données disponibles

Pour ajouter un catalogue complet adapté au Sénégal :

```bash
npm run seed:real
```

**Catalogue inclus :**

- **4 packs scolaires** (CP, CE1, CE2, 6ème)
- **6 produits** (cahiers, stylos, géométrie, calculatrice...)
- **2 promotions** (rentrée + famille)
- **Prix en FCFA** adaptés au marché sénégalais

Voir le guide complet : `DONNEES_UTILITAIRES.md`

## 🔍 Vérifier les données

Dans Supabase Dashboard → Table Editor :

- Cliquez sur chaque table pour voir les données
- Modifiez directement si nécessaire
- Ajoutez de nouvelles données manuellement

## 🚀 Prochaines étapes

1. ✅ Tables créées
2. ✅ Données de test ajoutées
3. 🔄 Configurer variables Vercel (PayTech)
4. 🔄 Redéployer le site
5. 🔄 Tester le flux complet (commande + paiement)

## 🆘 En cas d'erreur

```bash
# Vérifier la connexion
npm run test:supabase

# Recréer les tables
npx prisma db push --force-reset

# Réajouter les données
npm run seed:supabase
```
