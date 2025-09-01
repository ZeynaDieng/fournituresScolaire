# Intégration PayTech - EduShop

## Vue d'ensemble

Cette documentation décrit l'intégration complète de PayTech dans l'application EduShop. L'intégration suit strictement la documentation officielle PayTech et inclut :

- **Backend sécurisé** : APIs d'initiation, webhooks IPN, remboursements
- **Frontend moderne** : Composants Vue 3 avec TypeScript
- **Gestion complète** : Statuts de paiement, erreurs, et notifications
- **Sécurité** : Vérification HMAC-SHA256, validation des données

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PayTech API   │
│   (Vue 3 + TS)  │    │   (Nuxt 3)      │    │   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │  1. Initiate Payment  │                       │
         ├──────────────────────▶│  2. Request Payment   │
         │                       ├──────────────────────▶│
         │  3. Redirect URL      │  4. Payment URL       │
         │◀──────────────────────┤◀──────────────────────┤
         │                       │                       │
         │  5. User Payment      │                       │
         ├───────────────────────┼──────────────────────▶│
         │                       │                       │
         │                       │  6. IPN Webhook       │
         │                       │◀──────────────────────┤
         │  7. Redirect Success  │                       │
         │◀──────────────────────┼───────────────────────┤
```

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` basé sur `.env.example` :

```bash
# Configuration PayTech
PAYTECH_API_KEY=your_api_key_here
PAYTECH_SECRET_KEY=your_secret_key_here
BASE_URL=http://localhost:3000

# Base de données
DATABASE_URL=your_database_url_here
```

### 2. Base de données

Assurez-vous que votre schéma Prisma inclut les tables nécessaires :

```prisma
model Order {
  id        String   @id @default(cuid())
  ref       String   @unique
  status    String   // "pending", "paid", "canceled", "refunded"
  total     Float
  items     String   // JSON stringifié
  userId    String?
  createdAt DateTime @default(now())
  payments  Payment[]
}

model Payment {
  id         String  @id @default(cuid())
  orderId    String
  provider   String  // "paytech"
  status     String  // "pending", "completed", "failed", "refunded"
  amount     Float
  paytechId  String? // Token PayTech
  order      Order   @relation(fields: [orderId], references: [id])
  createdAt  DateTime @default(now())
}
```

## APIs Backend

### 1. Initiation de paiement

**Endpoint** : `POST /api/paytech/initiate`

```typescript
// Exemple de requête
{
  "amount": 15000,
  "customer": {
    "name": "Mamadou Diallo",
    "email": "mamadou@example.com",
    "phone": "771234567"
  },
  "target_payment": "Mobile Money", // Optionnel
  "item_name": "Pack CP - Fournitures scolaires",
  "items": [
    {
      "name": "Pack CP",
      "quantity": 1,
      "price": 15000
    }
  ]
}
```

**Réponse** :

```typescript
{
  "success": true,
  "token": "paytech_token_123",
  "redirect_url": "https://paytech.sn/payment/...",
  "ref_command": "CMD_1693123456789_abc123",
  "amount": 15000,
  "payment_method": "Mobile Money"
}
```

### 2. Webhook IPN

**Endpoint** : `POST /api/paytech/webhook`

- Vérification automatique de la signature HMAC-SHA256
- Gestion des événements : `sale_complete`, `sale_canceled`, `refund_complete`
- Mise à jour automatique des commandes et paiements

### 3. Vérification de statut

**Endpoint** : `GET /api/paytech/status/[token]`

### 4. Remboursement

**Endpoint** : `POST /api/paytech/refund`

```typescript
{
  "token": "paytech_token_123",
  "amount": 15000,
  "reason": "Demande client"
}
```

## Composants Frontend

### 1. PaymentMethodSelector

Composant pour sélectionner la méthode de paiement :

```vue
<PaymentMethodSelector
  v-model="selectedMethod"
  :methods="['Mobile Money', 'Carte Bancaire', 'Wave']"
/>
```

### 2. CheckoutForm

Formulaire de commande complet avec intégration PayTech :

```vue
<CheckoutForm
  :cart-items="cartItems"
  :total-amount="totalAmount"
  @payment-success="handlePaymentSuccess"
  @payment-error="handlePaymentError"
/>
```

### 3. Composable usePaytech

```typescript
const { initiatePayment, checkStatus, isLoading, error } = usePaytech();

// Initier un paiement
const result = await initiatePayment({
  amount: 15000,
  customer: customerData,
  items: cartItems,
});
```

## Pages

### 1. Page de succès (`/payment/success`)

- Affichage des détails de la commande
- Bouton de téléchargement de facture
- Actions de navigation

### 2. Page d'annulation (`/payment/cancel`)

- Message d'annulation
- Redirection vers le panier
- Options de relance

### 3. Page de test (`/test-paytech`)

**⚠️ Disponible en développement seulement**

Page complète pour tester l'intégration PayTech :

- Formulaire de simulation de paiement
- Test des webhooks
- Vérification des statuts
- Test des remboursements

## Sécurité

### 1. Vérification IPN

- **HMAC-SHA256** : Vérification obligatoire des webhooks
- **Validation des données** : Contrôle de cohérence
- **Protection CSRF** : Headers sécurisés

### 2. Validation des données

- Validation côté client et serveur
- Sanitisation des entrées utilisateur
- Vérification des montants et références

### 3. Gestion des erreurs

- Logs détaillés pour le debugging
- Messages d'erreur utilisateur appropriés
- Fallbacks en cas de panne

## Flux de paiement

### 1. Initiation

```typescript
// 1. Client remplit le formulaire
const orderData = {
  amount: 15000,
  customer: { name, email, phone },
  items: cartItems,
};

// 2. Appel API d'initiation
const response = await $fetch("/api/paytech/initiate", {
  method: "POST",
  body: orderData,
});

// 3. Redirection vers PayTech
window.location.href = response.redirect_url;
```

### 2. Paiement PayTech

- L'utilisateur est redirigé vers PayTech
- Sélection et validation de la méthode de paiement
- Confirmation du paiement

### 3. Webhook de confirmation

```typescript
// PayTech envoie un IPN à /api/paytech/webhook
{
  "type_event": "sale_complete",
  "ref_command": "CMD_123",
  "item_price": 15000,
  "payment_method": "Orange Money",
  "hmac_compute": "sha256_signature"
}
```

### 4. Redirection finale

- Succès : `/payment/success?ref=CMD_123`
- Annulation : `/payment/cancel?ref=CMD_123`

## Tests

### 1. Tests unitaires (recommandés)

```typescript
// test/paytech.test.ts
describe("PayTech Integration", () => {
  test("should initiate payment correctly", async () => {
    // Test d'initiation
  });

  test("should verify IPN signature", () => {
    // Test de vérification webhook
  });
});
```

### 2. Tests d'intégration

Utilisez la page `/test-paytech` pour :

- Tester l'initiation de paiement
- Simuler des webhooks
- Vérifier les statuts
- Tester les remboursements

### 3. Tests en production

- Mode sandbox PayTech pour les tests
- Vérification des URLs de webhook
- Test avec de vraies méthodes de paiement

## Déploiement

### 1. Variables d'environnement de production

```bash
NODE_ENV=production
PAYTECH_API_KEY=prod_api_key
PAYTECH_SECRET_KEY=prod_secret_key
BASE_URL=https://votre-domaine.com
DATABASE_URL=postgresql://...
```

### 2. Configuration PayTech

- Configurez les URLs de webhook dans votre tableau de bord PayTech
- IPN URL : `https://votre-domaine.com/api/paytech/webhook`
- Success URL : `https://votre-domaine.com/payment/success`
- Cancel URL : `https://votre-domaine.com/payment/cancel`

### 3. SSL/HTTPS

⚠️ **Obligatoire en production** : PayTech exige HTTPS pour tous les webhooks.

## Monitoring et logs

### 1. Logs applicatifs

Les APIs PayTech loggent automatiquement :

- Tentatives de paiement
- Webhooks reçus
- Erreurs de traitement

### 2. Métriques recommandées

- Taux de conversion des paiements
- Méthodes de paiement populaires
- Temps de traitement des webhooks
- Erreurs et échecs

## Support

### Documentation PayTech

- **Documentation officielle** : https://docs.intech.sn/doc_paytech.php
- **Tableau de bord** : https://paytech.sn/
- **Support** : contact@intech.sn

### Codes d'erreur courants

| Code | Description            | Solution                          |
| ---- | ---------------------- | --------------------------------- |
| 400  | Données invalides      | Vérifier les paramètres envoyés   |
| 401  | Clés API invalides     | Vérifier PAYTECH_API_KEY/SECRET   |
| 403  | Signature IPN invalide | Vérifier la génération HMAC       |
| 500  | Erreur serveur PayTech | Réessayer ou contacter le support |

## Changelog

### Version 1.0.0 (Septembre 2025)

- ✅ Intégration complète PayTech
- ✅ APIs backend sécurisées
- ✅ Composants frontend modernes
- ✅ Gestion des webhooks IPN
- ✅ Support des remboursements
- ✅ Page de test intégrée
- ✅ Documentation complète

---

**Développé avec ❤️ pour EduShop Sénégal**
