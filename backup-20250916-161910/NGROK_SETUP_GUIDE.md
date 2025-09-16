# 🚀 Guide de Configuration NGrok pour PayTech

## Problème identifié

Les webhooks PayTech ne peuvent pas atteindre `http://localhost:3000` car cette URL n'est pas accessible publiquement depuis Internet.

## Solution : Exposer localhost avec NGrok

### 1. Installation de NGrok

```bash
# Via npm (recommandé)
npm install -g ngrok

# Ou télécharger depuis https://ngrok.com/download
```

### 2. Lancer votre serveur de développement

```bash
npm run dev
# Votre app sera disponible sur http://localhost:3000
```

### 3. Exposer localhost avec NGrok

Dans un nouveau terminal :

```bash
ngrok http 3000
```

Vous obtiendrez une sortie comme :

```
Session Status                online
Account                       your-email@example.com
Version                       3.1.0
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
Forwarding                    http://abc123.ngrok.io -> http://localhost:3000
```

### 4. Mise à jour de votre configuration

Copiez l'URL HTTPS (ex: `https://abc123.ngrok.io`) et mettez à jour votre `.env` :

```env
# Avant
NUXT_PUBLIC_BASE_URL=http://localhost:3000

# Après
NUXT_PUBLIC_BASE_URL=https://abc123.ngrok.io
```

### 5. Redémarrer votre serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### 6. Tester les webhooks

Maintenant PayTech peut accéder à vos webhooks :

- URL webhook : `https://abc123.ngrok.io/api/paytech/webhook`
- URL success : `https://abc123.ngrok.io/payment/success`
- URL cancel : `https://abc123.ngrok.io/payment/cancel`

## Configuration PayTech Dashboard

Si vous avez accès au dashboard PayTech, assurez-vous que l'URL de webhook est configurée :

1. Connectez-vous à votre dashboard PayTech
2. Allez dans "Paramètres" ou "Configuration"
3. Mettez à jour l'URL IPN/Webhook : `https://abc123.ngrok.io/api/paytech/webhook`

## Tests recommandés

### 1. Test avec simulation

```bash
# Accédez à la page de test
https://abc123.ngrok.io/test/payment-flow
```

### 2. Test avec vrai paiement

```bash
# Testez le checkout complet
https://abc123.ngrok.io/checkout
```

### 3. Vérification des logs

Surveillez les logs dans votre terminal pour voir les webhooks entrants :

```
PayTech Webhook received: { type_event: 'sale_complete', ... }
```

## Notes importantes

⚠️ **NGrok URLs changent à chaque redémarrage** (version gratuite)

- Pour une URL fixe, utilisez NGrok Pro ou déployez en production

⚠️ **Sécurité**

- Ne jamais exposer des données sensibles via NGrok
- Utilisez toujours HTTPS en production

⚠️ **Debugging**

- Interface web NGrok : http://127.0.0.1:4040
- Vous pouvez voir toutes les requêtes HTTP en temps réel

## Alternative : Déploiement rapide

Si NGrok pose problème, déployez rapidement sur Vercel :

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer
vercel

# 3. Utiliser l'URL de production dans PayTech
```

## Vérification

Une fois configuré, testez que les webhooks fonctionnent :

1. Allez sur `/test/payment-debug`
2. Créez une commande de test
3. Simulez un paiement
4. Vérifiez que les données sont bien sauvegardées

Si tout fonctionne, vous devriez voir :

- ✅ Commande créée avec status "pending"
- ✅ Après webhook : status "paid" + entrée Payment créée
