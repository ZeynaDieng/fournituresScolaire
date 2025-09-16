# 🔧 Configuration PayTech IPN - Guide Complet

## Problème résolu ✅

Votre site [https://www.e-du.shop/](https://www.e-du.shop/) est déployé et l'endpoint webhook fonctionne !

## 📋 **Étapes de configuration PayTech**

### 1. **Configurer l'URL IPN dans PayTech Dashboard**

1. Connectez-vous à votre [dashboard PayTech](https://paytech.sn)
2. Allez dans **Paramètres** → **API** → **Notifications IPN**
3. Configurez l'URL IPN :

```
URL IPN: https://www.e-du.shop/api/paytech/webhook-new
```

### 2. **Variables d'environnement (déjà configurées)**

Votre `.env` contient déjà :

```bash
PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
PAYTECH_SECRET_KEY=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
PAYTECH_SANDBOX=true
```

### 3. **Test de l'endpoint IPN**

L'endpoint fonctionne correctement :

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-new" \
  -H "Content-Type: application/json" \
  -d '{"type_event": "sale_complete", "ref_command": "TEST-123"}'
```

**Résultat :** `{"success":true,"message":"Webhook traité avec succès"}`

## 🔍 **Diagnostic des problèmes IPN**

### Problème 1: URL IPN non configurée

**Solution :** Configurer l'URL dans le dashboard PayTech

### Problème 2: Vérification de signature

**Solution :** Le webhook accepte les notifications en mode sandbox

### Problème 3: Emails non envoyés

**Solution :** Configurer les variables email dans `.env`

## 📧 **Configuration Email (pour les notifications)**

Ajoutez dans votre `.env` :

```bash
# Configuration Email
EMAIL_SERVICE=gmail
EMAIL_USER=zeynash1@gmail.com
EMAIL_PASSWORD=zmruomypjxrjxfto
ADMIN_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires
```

## 🧪 **Test complet du flux PayTech**

### 1. **Test de paiement**

- Allez sur [https://www.e-du.shop/](https://www.e-du.shop/)
- Ajoutez des articles au panier
- Procédez au paiement PayTech
- Utilisez les données de test PayTech

### 2. **Vérification des logs**

- Surveillez les logs de votre serveur
- Vérifiez que l'IPN est reçu
- Confirmez l'envoi des emails

### 3. **Test manuel de l'IPN**

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-new" \
  -H "Content-Type: application/json" \
  -d '{
    "type_event": "sale_complete",
    "ref_command": "TEST-123",
    "item_price": 50000,
    "final_item_price": 50000,
    "custom_field": "eyJjdXN0b21lciI6eyJuYW1lIjoiVGVzdCBDbGllbnQiLCJlbWFpbCI6InpleW5hc2gxQGdtYWlsLmNvbSIsInBob25lIjoiKzIyMTc3Nzc4MDQ1NiJ9fQ==",
    "hmac_compute": "test"
  }'
```

## 🚀 **Prochaines étapes**

1. **Configurer l'URL IPN** dans le dashboard PayTech
2. **Tester un paiement réel** sur votre site
3. **Vérifier la réception** des notifications IPN
4. **Confirmer l'envoi** des emails de confirmation

## 📞 **Support PayTech**

Si vous avez encore des problèmes :

- **Email :** contact@paytech.sn
- **Documentation :** [https://docs.intech.sn/doc_paytech.php](https://docs.intech.sn/doc_paytech.php)
- **Dashboard :** [https://paytech.sn](https://paytech.sn)

## ✅ **Statut actuel**

- ✅ Site déployé : [https://www.e-du.shop/](https://www.e-du.shop/)
- ✅ Endpoint webhook fonctionnel
- ✅ Configuration PayTech en place
- ⏳ URL IPN à configurer dans le dashboard
- ⏳ Test de paiement à effectuer

Votre configuration PayTech est prête ! Il ne reste plus qu'à configurer l'URL IPN dans le dashboard PayTech.
