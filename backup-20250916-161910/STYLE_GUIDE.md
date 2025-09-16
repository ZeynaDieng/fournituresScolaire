# 📐 GUIDE DE STYLE - EDUSHOP

## 🎨 Palette de couleurs

### Couleurs principales

```css
/* Bleu confiance (actions principales) */
--brand-500: #0ea5e9
--brand-600: #0284c7
--brand-700: #0369a1

/* Jaune éducation (accents, promotions) */
--education-400: #facc15
--education-500: #eab308
--education-600: #ca8a04

/* Gris académique (texte, UI) */
--academic-600: #475569
--academic-700: #334155
--academic-800: #1e293b
```

### Usage des couleurs

- **Bleu** : Boutons principaux, liens, éléments interactifs
- **Jaune** : Promotions, badges, accents
- **Gris** : Texte, bordures, éléments secondaires
- **Blanc/Gris clair** : Arrière-plans, cartes

## 📝 Typographie

### Polices

```css
/* Texte principal */
font-family: "Source Sans Pro", system-ui, sans-serif;

/* Titres */
font-family: "Nunito Sans", system-ui, sans-serif;

/* Logo et éléments de marque */
font-family: "Nunito", system-ui, sans-serif;
```

### Hiérarchie

- **H1** : 3xl (48px) - Titres de page
- **H2** : 2xl (32px) - Sections principales
- **H3** : xl (24px) - Sous-sections
- **Body** : base (16px) - Texte courant
- **Small** : sm (14px) - Métadonnées

## 🔧 Composants

### Boutons

```html
<!-- Bouton principal -->
<button class="btn btn-primary">Action principale</button>

<!-- Bouton secondaire -->
<button class="btn btn-secondary">Action secondaire</button>

<!-- Bouton accent (promotions) -->
<button class="btn btn-accent">Promotion spéciale</button>
```

### Cartes

```html
<div class="card">
  <div class="card-header">
    <h3>Titre de la carte</h3>
  </div>
  <div class="card-body">
    <p>Contenu de la carte</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Formulaires

```html
<div class="form-group">
  <label class="form-label">Nom du champ</label>
  <input type="text" class="form-input" placeholder="Saisir..." />
  <p class="form-help">Aide contextuelle</p>
</div>
```

## 🎯 Bonnes pratiques

### 1. **Espacement cohérent**

```css
/* Utilisez les classes d'espacement Tailwind */
.space-y-4    /* 16px entre éléments verticaux */
/* 16px entre éléments verticaux */
/* 16px entre éléments verticaux */
/* 16px entre éléments verticaux */
.space-x-3    /* 12px entre éléments horizontaux */
.p-6          /* 24px de padding */
.m-4; /* 16px de margin */
```

### 2. **Hiérarchie visuelle**

- Utilisez les poids de police (`font-medium`, `font-semibold`, `font-bold`)
- Respectez la hiérarchie des couleurs (primaire > secondaire > tertiaire)
- Variez les tailles avec intention

### 3. **États interactifs**

```css
/* Tous les éléments cliquables doivent avoir : */
.hover:bg-brand-700    /* État survol */
.focus:ring-2          /* État focus (accessibilité) */
.disabled:opacity-50   /* État désactivé */
```

### 4. **Responsive design**

```css
/* Mobile first, puis adaptations */
.text-sm md:text-base lg:text-lg
.p-4 md:p-6 lg:p-8
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## 🔍 Exemples concrets

### Header navigation

```html
<nav class="nav-link">
  <PackageIcon :size="18" />
  <span>Packs scolaires</span>
</nav>
```

### Prix produit

```html
<div class="price-container">
  <span class="price price-large">22 500</span>
  <span class="price-currency">FCFA</span>
  <span class="price-old">27 000 FCFA</span>
</div>
```

### Badge promo

```html
<span class="badge badge-accent"> -15% </span>
```

### Indicateur stock

````

## 🎨 Cohérence visuelle

### ✅ À faire

- Utiliser les classes CSS définies
- Respecter la palette de couleurs
- Maintenir l'espacement cohérent
- Tester la responsive sur mobile

### ❌ À éviter

- Couleurs en dur dans le HTML
- Tailles de police arbitraires
- Espacement incohérent
- Éléments non-accessibles

## 🛠️ Maintenance

### Modification des couleurs

Modifier dans `tailwind.config.js` :

```js
colors: {
  brand: {
    500: '#nouvelle-couleur'
  }
}
````

### Ajout de composants

Ajouter dans `assets/css/main.css` :

```css
@layer components {
  .nouveau-composant {
    @apply classes-tailwind;
  }
}
```

---

**Ce guide garantit un design cohérent et professionnel sur tout le site.**
