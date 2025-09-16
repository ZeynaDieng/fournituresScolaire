# 🚀 Guide de Test PayTech + Airtable

## 📋 État Actuel de l'Intégration

✅ **Fonctionnalités Implémentées :**

- Endpoint d'initiation PayTech : `/api/paytech/initiate`
- Endpoint webhook PayTech : `/api/paytech/webhook`
- Endpoint de test PayTech : `/api/paytech/test-initiate`
- Enregistrement automatique des commandes PayTech dans Airtable (statut "Pending")
- Mise à jour automatique du statut vers "Paid" lors de la confirmation webhook
- Interface admin pour visualiser les commandes Airtable : `/admin/orders-airtable-airtable`

## 🌍 Environnements de Test Disponibles

### 1. Test Local avec ngrok (Recommandé)

**Prérequis :**

- ngrok installé (`brew install ngrok` ou télécharger depuis ngrok.com)
- Serveur de développement lancé (`npm run dev`)

**Étapes :**

1. **Démarrer le tunnel ngrok :**

```bash
ngrok http 3003
```

Copier l'URL HTTPS générée (ex: `https://abc123.ngrok-free.app`)

2. **Mettre à jour les variables d'environnement :**

```bash
# Dans .env
NUXT_PUBLIC_BASE_URL=https://votre-url-ngrok.ngrok-free.app
```

3. **Redémarrer le serveur :**

```bash
npm run dev
```

4. **Tester l'intégration complète :**

```bash
# Script de test complet
node scripts/test-paytech-with-ngrok.js

# Ou test manuel des endpoints
curl -X POST https://votre-url-ngrok.ngrok-free.app/api/paytech/test-initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000,
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "221771234567"
    }
  }'
```

### 2. Test avec PayTech Sandbox

**Configuration requise dans `.env` :**

```bash
# PayTech API (Sandbox)
PAYTECH_API_KEY=your-sandbox-api-key
PAYTECH_SECRET_KEY=your-sandbox-secret-key
PAYTECH_SANDBOX=true
```

**Test d'initiation :**

```bash
curl -X POST http://localhost:3003/api/paytech/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "item_name": "Test Product",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "221771234567"
    },
    "target_payment": "orange_money"
  }'
```

## 📊 Vérification des Résultats dans Airtable

### Via l'Interface Admin

1. Aller sur `http://localhost:3003/admin/orders-airtable-airtable`
2. Voir toutes les commandes synchronisées depuis Airtable
3. Vérifier les statuts : "Pending" → "Paid"

### Via l'API Airtable

```bash
curl http://localhost:3003/api/airtable/orders
```

### Directement dans Airtable

1. Se connecter à votre base Airtable
2. Aller dans la table "Orders"
3. Vérifier les nouveaux enregistrements

## 🔄 Flux Complet PayTech + Airtable

### 1. Initiation du Paiement

```
Client soumet formulaire
→ POST /api/paytech/initiate
→ Création commande en BDD (status: pending)
→ Enregistrement dans Airtable (Status: Pending)
→ Appel API PayTech
→ Redirection client vers PayTech
```

### 2. Confirmation de Paiement

```
Client paie sur PayTech
→ PayTech envoie webhook POST /api/paytech/webhook
→ Vérification signature HMAC
→ Mise à jour BDD (status: paid)
→ Mise à jour Airtable (Status: Paid)
→ Email de confirmation (optionnel)
```

## 🛠 Scripts de Test Disponibles

### Test Complet avec ngrok

```bash
node scripts/test-paytech-with-ngrok.js
```

### Test Création Commandes

```bash
node scripts/test-order-airtable.js
```

### Test Synchronisation Airtable

```bash
node scripts/full-sync-airtable.js
```

## 🐛 Résolution des Problèmes Courants

### Erreur "PayTech API Key manquante"

- Vérifier les variables `PAYTECH_API_KEY` et `PAYTECH_SECRET_KEY` dans `.env`
- S'assurer que le serveur est redémarré après modification

### Webhook non reçu

- Vérifier que ngrok est actif et que l'URL est correcte
- Tester le webhook manuellement :

```bash
curl -X POST https://votre-url-ngrok.ngrok-free.app/api/paytech/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type_event": "sale_complete",
    "ref_command": "TEST123",
    "item_price": 1000,
    "hmac_compute": "test_hash"
  }'
```

### Erreur Airtable

- Vérifier `AIRTABLE_API_KEY` et `AIRTABLE_BASE_ID`
- Tester la connexion :

```bash
node scripts/test-airtable-config.js
```

## 🎯 Prochaines Étapes

1. **Test en Production :**

   - Configurer PayTech avec les vraies clés API
   - Mettre à jour `PAYTECH_SANDBOX=false`
   - Déployer sur Vercel/Netlify

2. **Améliorations Possibles :**

   - Envoi d'emails de confirmation
   - Interface admin pour gérer les remboursements
   - Retry automatique en cas d'échec Airtable
   - Logs détaillés pour le monitoring

3. **Sécurité :**
   - Rate limiting sur les endpoints
   - Validation stricte des webhooks
   - Chiffrement des données sensibles

## 📞 Support

En cas de problème, vérifier dans l'ordre :

1. Les logs du serveur (`npm run dev`)
2. Les variables d'environnement
3. La connectivité ngrok
4. Les permissions Airtable

---

**Note :** Cette intégration est prête pour la production. Il suffit de configurer les bonnes clés API et l'URL de base pour l'environnement de production.
