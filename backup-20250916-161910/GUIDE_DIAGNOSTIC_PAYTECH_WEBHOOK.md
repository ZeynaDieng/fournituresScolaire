# 🔧 Guide de Diagnostic - Webhook PayTech

## 🚨 **Problème identifié :**

Vous avez payé via PayTech mais vous ne recevez pas la notification de statut de paiement. Cela indique un problème avec le webhook PayTech.

## ✅ **Diagnostic effectué :**

### **1. Test du webhook local :**

```bash
curl -X POST "http://localhost:3000/api/paytech/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{
    "ref_command": "CMD_1757985940663_uuub964np",
    "amount": 100,
    "payment_method": "card",
    "client_phone": "+221777780456",
    "custom_field": "eyJpdGVtcyI6W3sibmFtZSI6IlN0eWxvIEJpbGxlIFJvdWdlIiwicXVhbnRpdHkiOjEsInByaWNlIjoxMDB9XSwiY3VzdG9tZXIiOnsibmFtZSI6IlNleW5hYm91IERpZW5nIiwiZW1haWwiOiJ6ZXluYXNoMUBnbWFpbC5jb20iLCJwaG9uZSI6IisyMjE3Nzc3ODA0NTYifX0=",
    "status": "sale_complete"
  }'
```

**Résultat :** ✅ Succès - Webhook fonctionne localement

### **2. Configuration actuelle :**

- **URL IPN :** `${config.public.baseUrl}/api/paytech/webhook-simple`
- **URL de production :** `https://www.e-du.shop/api/paytech/webhook-simple`

## 🔍 **Causes possibles :**

### **1. Configuration PayTech Dashboard :**

- L'URL IPN n'est pas configurée dans le dashboard PayTech
- L'URL IPN est incorrecte
- Le webhook est désactivé

### **2. Problème de réseau :**

- PayTech ne peut pas atteindre votre serveur
- Firewall bloquant les requêtes
- SSL/TLS non configuré

### **3. Problème de déploiement :**

- Le webhook n'est pas déployé en production
- Variables d'environnement manquantes
- Serveur non accessible

## 🚀 **Solutions :**

### **Solution 1 : Vérifier la configuration PayTech Dashboard**

1. **Connectez-vous à votre dashboard PayTech :**

   - Allez sur [https://paytech.sn](https://paytech.sn)
   - Connectez-vous à votre compte

2. **Configurez l'URL IPN :**

   - Allez dans "Paramètres" ou "Configuration"
   - Trouvez "URL de notification IPN" ou "Webhook URL"
   - Entrez : `https://www.e-du.shop/api/paytech/webhook-simple`

3. **Activez le webhook :**
   - Assurez-vous que le webhook est activé
   - Sauvegardez les paramètres

### **Solution 2 : Tester le webhook en production**

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{
    "ref_command": "TEST_CMD_123",
    "amount": 100,
    "payment_method": "card",
    "client_phone": "+221777780456",
    "status": "sale_complete"
  }'
```

### **Solution 3 : Vérifier les logs du serveur**

Vérifiez les logs de votre serveur de production pour voir si PayTech tente d'envoyer des notifications.

### **Solution 4 : Utiliser un service de tunneling (pour les tests)**

Si vous testez en local, utilisez ngrok :

```bash
# Installer ngrok
npm install -g ngrok

# Exposer votre serveur local
ngrok http 3000

# Utiliser l'URL ngrok dans PayTech
# Exemple : https://abc123.ngrok.io/api/paytech/webhook-simple
```

## 🧪 **Tests de validation :**

### **Test 1 : Vérifier l'accessibilité du webhook**

```bash
curl -I "https://www.e-du.shop/api/paytech/webhook-simple"
```

### **Test 2 : Simuler une notification PayTech**

```bash
curl -X POST "https://www.e-du.shop/api/paytech/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{
    "ref_command": "CMD_1757985940663_uuub964np",
    "amount": 100,
    "payment_method": "card",
    "client_phone": "+221777780456",
    "status": "sale_complete"
  }'
```

### **Test 3 : Vérifier la configuration PayTech**

- Connectez-vous au dashboard PayTech
- Vérifiez que l'URL IPN est configurée
- Vérifiez que le webhook est activé

## 📊 **Configuration recommandée :**

### **URL IPN PayTech :**

```
https://www.e-du.shop/api/paytech/webhook-simple
```

### **Événements à écouter :**

- `sale_complete` : Paiement réussi
- `sale_cancel` : Paiement annulé
- `sale_pending` : Paiement en attente

### **Format des données PayTech :**

```json
{
  "ref_command": "CMD_1234567890_abc123",
  "amount": 100,
  "payment_method": "card",
  "client_phone": "+221777780456",
  "custom_field": "base64_encoded_data",
  "status": "sale_complete"
}
```

## 🔧 **Dépannage avancé :**

### **1. Vérifier les logs PayTech :**

- Connectez-vous au dashboard PayTech
- Allez dans "Logs" ou "Historique"
- Vérifiez si les tentatives de webhook sont enregistrées

### **2. Vérifier les logs de votre serveur :**

- Vérifiez les logs de votre hébergeur
- Recherchez les tentatives de connexion de PayTech
- Vérifiez les erreurs de webhook

### **3. Tester avec un service de monitoring :**

- Utilisez un service comme [webhook.site](https://webhook.site)
- Configurez temporairement cette URL dans PayTech
- Vérifiez si PayTech envoie des notifications

## ✅ **Actions immédiates :**

1. **✅ Vérifiez la configuration PayTech Dashboard**
2. **✅ Testez le webhook en production**
3. **✅ Vérifiez les logs du serveur**
4. **✅ Configurez l'URL IPN correcte**

## 🎯 **Résultat attendu :**

Après la configuration correcte, vous devriez recevoir :

- ✅ **Notification de paiement réussi**
- ✅ **Mise à jour du statut dans Airtable**
- ✅ **Envoi automatique des factures par email**
- ✅ **Envoi automatique des factures par WhatsApp**

## 🚨 **Si le problème persiste :**

1. **Contactez le support PayTech** avec les détails de votre configuration
2. **Vérifiez que votre serveur est accessible** depuis l'extérieur
3. **Testez avec un autre service de webhook** pour isoler le problème

**Le webhook fonctionne localement, le problème est probablement dans la configuration PayTech Dashboard !** 🔧
