# 🚀 Déploiement PayTech - Guide Complet

## ✅ **Problème résolu**

L'endpoint `/api/paytech/webhook-new` n'était pas déployé. Solution : utiliser `/api/paytech/webhook-simple` qui accepte les notifications en mode test.

## 📋 **Étapes de déploiement**

### 1. **Déployer les changements**

```bash
# Commiter les changements
git add .
git commit -m "Fix PayTech webhook configuration"
git push origin main

# Ou si vous utilisez Vercel
vercel --prod
```

### 2. **Configurer l'URL IPN dans PayTech Dashboard**

1. Connectez-vous à [https://paytech.sn](https://paytech.sn)
2. Allez dans **Paramètres** → **API** → **Notifications IPN**
3. Configurez l'URL IPN :

```
URL IPN: https://www.e-du.shop/api/paytech/webhook-simple
```

### 3. **Test de l'endpoint après déploiement**

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{
    "type_event": "sale_complete",
    "ref_command": "TEST-123",
    "item_price": 50000,
    "final_item_price": 50000,
    "custom_field": "eyJjdXN0b21lciI6eyJuYW1lIjoiVGVzdCBDbGllbnQiLCJlbWFpbCI6InpleW5hc2gxQGdtYWlsLmNvbSIsInBob25lIjoiKzIyMTc3Nzc4MDQ1NiJ9fQ==",
    "payment_method": "PayTech"
  }'
```

**Résultat attendu :**

```json
{
  "success": true,
  "message": "Webhook traité avec succès",
  "event": "sale_complete",
  "order": "TEST-123"
}
```

## 🔧 **Configuration actuelle**

### **URLs PayTech configurées :**

- **IPN URL :** `https://www.e-du.shop/api/paytech/webhook-simple`
- **Success URL :** `https://www.e-du.shop/payment/success?ref={ref}`
- **Cancel URL :** `https://www.e-du.shop/payment/cancel?ref={ref}`

### **Variables d'environnement :**

```bash
PAYTECH_API_KEY=0528cf38789d400cc03f9ba591fc5c05a6f2bcee9c288f3eea170c6361e3cf9b
PAYTECH_SECRET_KEY=566126b0d75afe81e81bf9b78231c79843a6c4034d14cdb21835b38c91e479ee
PAYTECH_SANDBOX=true
```

### **Configuration Email :**

```bash
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=zmruomypjxrjxfto
ADMIN_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires
```

## 🧪 **Test complet du flux**

### 1. **Test de l'endpoint webhook**

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{"type_event": "sale_complete", "ref_command": "TEST-123"}'
```

### 2. **Test de paiement sur le site**

1. Allez sur [https://www.e-du.shop/](https://www.e-du.shop/)
2. Ajoutez des articles au panier
3. Procédez au paiement PayTech
4. Utilisez les données de test PayTech

### 3. **Vérification des emails**

- Vérifiez que l'email de confirmation est envoyé au client
- Vérifiez que l'email de notification est envoyé à l'admin

## 📊 **Logs à surveiller**

### **Logs du webhook :**

```
🔔 PayTech Webhook Simple reçu
📋 Données webhook: {...}
📋 Événement PayTech: sale_complete pour commande TEST-123
💰 Paiement réussi pour TEST-123
📧 Envoi des emails de notification...
📧 Email client: ✅ Envoyé
📧 Email admin: ✅ Envoyé
```

### **Logs d'erreur :**

```
❌ Erreur PayTech Webhook Simple: ...
❌ Email client: ❌ Échec
❌ Email admin: ❌ Échec
```

## 🚨 **Dépannage**

### **Problème : Endpoint non trouvé**

**Solution :** Vérifiez que le déploiement est terminé

### **Problème : Emails non envoyés**

**Solution :** Vérifiez la configuration email dans `.env`

### **Problème : IPN non reçu**

**Solution :** Vérifiez l'URL IPN dans le dashboard PayTech

## ✅ **Checklist de déploiement**

- [ ] Déployer les changements
- [ ] Configurer l'URL IPN dans PayTech Dashboard
- [ ] Tester l'endpoint webhook
- [ ] Tester un paiement réel
- [ ] Vérifier l'envoi des emails
- [ ] Surveiller les logs

## 📞 **Support**

- **PayTech :** contact@paytech.sn
- **Documentation :** [https://docs.intech.sn/doc_paytech.php](https://docs.intech.sn/doc_paytech.php)
- **Site :** [https://www.e-du.shop/](https://www.e-du.shop/)

Votre configuration PayTech est prête ! Déployez les changements et configurez l'URL IPN dans le dashboard PayTech.
