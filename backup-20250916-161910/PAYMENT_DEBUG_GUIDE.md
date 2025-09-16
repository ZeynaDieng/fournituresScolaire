# 🔍 Diagnostic : Pourquoi les paiements ne s'enregistrent pas ?

## 🎯 **Problèmes identifiés et solutions**

### 1. **Configuration PayTech**

- ✅ **Clés API configurées** : Présentes dans `.env`
- ✅ **Mode sandbox** : Activé pour les tests
- ⚠️ **URL webhook** : Doit être accessible depuis PayTech

### 2. **Base de données**

- ✅ **Configuration** : MySQL configuré dans `.env`
- ⚠️ **Connexion** : Vérifier que MySQL/MAMP est démarré
- ⚠️ **Schéma** : Vérifier que les tables existent

### 3. **Flux de paiement**

```
1. Utilisateur remplit le formulaire checkout
2. Frontend → POST /api/paytech/initiate
3. Serveur crée une commande (status: 'pending')
4. PayTech génère URL de paiement
5. Utilisateur effectue le paiement sur PayTech
6. PayTech → POST /api/paytech/webhook (IPN)
7. Webhook met à jour commande (status: 'paid') + crée Payment
```

## 🚨 **Points de défaillance courants**

### A. **Webhook non reçu**

- URL webhook inaccessible (localhost non accessible depuis PayTech)
- Erreur de vérification HMAC
- Serveur Nuxt non démarré

### B. **Erreurs de base de données**

- MySQL non démarré
- Tables manquantes
- Problème de permissions

### C. **Configuration PayTech**

- Clés API invalides
- Mauvaise configuration sandbox/production
- URL de base incorrecte

## 🛠️ **Comment diagnostiquer**

### 1. **Vérifier la configuration**

```bash
# Aller à la page de diagnostic
http://localhost:3000/test/payment-debug
```

### 2. **Tester une commande**

```bash
# Créer une commande de test
http://localhost:3000/test/create-order
```

### 3. **Vérifier les logs**

- Logs du serveur Nuxt
- Logs de la base de données
- Webhooks reçus dans `/api/paytech/webhook`

## ✅ **Solutions étape par étape**

### 1. **S'assurer que MySQL est démarré**

```bash
# Si vous utilisez MAMP
# Démarrer MAMP et vérifier que MySQL tourne sur le port 8889
```

### 2. **Vérifier les tables Prisma**

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Vérifier la base de données
npx prisma studio
```

### 3. **Tester le webhook localement**

```bash
# Utiliser ngrok pour exposer localhost
# npm install -g ngrok
# ngrok http 3000

# Puis mettre à jour l'URL webhook dans PayTech
# Exemple: https://abc123.ngrok.io/api/paytech/webhook
```

### 4. **Vérifier les clés PayTech**

- Se connecter au dashboard PayTech
- Vérifier que les clés dans `.env` sont correctes
- Tester en mode sandbox d'abord

## 📊 **Commandes utiles pour déboguer**

```bash
# Voir les commandes en base
npx prisma studio

# Logs du serveur en temps réel
npm run dev

# Test de la base de données
node scripts/test-payment-flow.js

# Test du webhook
node scripts/debug-webhook.js
```

## 🔧 **Corrections communes**

### 1. **Base de données non accessible**

```typescript
// Vérifier DATABASE_URL dans .env
DATABASE_URL =
  "mysql://root:root@localhost:8889/fourniturescolaire?socket=/Applications/MAMP/tmp/mysql/mysql.sock";
```

### 2. **Webhook HMAC échoue**

```typescript
// Vérifier les clés dans le webhook
const expectedHmac = crypto
  .createHmac("sha256", apiSecret)
  .update(`${amount}|${ref_command}|${apiKey}`)
  .digest("hex");
```

### 3. **URL webhook incorrecte**

```typescript
// Dans initiate.post.ts
ipn_url: `${config.public.baseUrl}/api/paytech/webhook`;
// Doit être accessible depuis PayTech
```

## 🎯 **Prochaines étapes**

1. **Diagnostiquer** avec `/test/payment-debug`
2. **Créer une commande test** avec `/test/create-order`
3. **Vérifier les webhooks** avec ngrok si nécessaire
4. **Tester un paiement réel** en mode sandbox

## 📞 **Support**

Si le problème persiste :

1. Vérifier les logs détaillés
2. Tester avec ngrok pour les webhooks
3. Contacter le support PayTech si nécessaire
4. Vérifier la documentation PayTech mise à jour
