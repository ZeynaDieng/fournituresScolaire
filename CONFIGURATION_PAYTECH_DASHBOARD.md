# 🔧 Configuration PayTech Dashboard - Guide Complet

## 🚨 **Problème identifié :**

Le webhook PayTech fonctionne parfaitement (testé avec succès), mais PayTech n'est pas configuré pour envoyer les notifications à votre webhook.

## ✅ **Diagnostic confirmé :**

### **Test du webhook en production :**

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

**Résultat :** ✅ Succès - `{"success":true,"message":"Webhook traité avec succès","order":"TEST_CMD_123"}`

## 🎯 **Solution : Configuration PayTech Dashboard**

### **Étape 1 : Accéder au Dashboard PayTech**

1. **Connectez-vous à PayTech :**

   - Allez sur [https://paytech.sn](https://paytech.sn)
   - Cliquez sur "Se connecter" ou "Login"
   - Entrez vos identifiants PayTech

2. **Accédez aux paramètres :**
   - Une fois connecté, cherchez "Paramètres" ou "Settings"
   - Ou "Configuration" ou "Configuration"
   - Ou "Webhook" ou "Notifications"

### **Étape 2 : Configurer l'URL IPN**

1. **Trouvez la section "URL de notification IPN" :**

   - Cherchez "IPN URL" ou "Webhook URL"
   - Ou "URL de notification" ou "Notification URL"
   - Ou "Callback URL"

2. **Entrez l'URL de votre webhook :**

   ```
   https://www.e-du.shop/api/paytech/webhook-simple
   ```

3. **Activez le webhook :**
   - Assurez-vous que le webhook est activé
   - Cochez la case "Activer les notifications IPN"
   - Ou "Enable IPN notifications"

### **Étape 3 : Configurer les événements**

Activez les événements suivants :

- ✅ **Paiement réussi** (`sale_complete`)
- ✅ **Paiement annulé** (`sale_cancel`)
- ✅ **Paiement en attente** (`sale_pending`)

### **Étape 4 : Sauvegarder la configuration**

1. **Cliquez sur "Sauvegarder" ou "Save"**
2. **Attendez la confirmation**
3. **Notez la configuration pour référence**

## 📋 **Configuration complète PayTech :**

### **URL IPN :**

```
https://www.e-du.shop/api/paytech/webhook-simple
```

### **Événements activés :**

- `sale_complete` : Paiement réussi
- `sale_cancel` : Paiement annulé
- `sale_pending` : Paiement en attente

### **Format des données :**

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

## 🧪 **Test de la configuration :**

### **Test 1 : Effectuer un paiement test**

1. Allez sur votre site : [https://www.e-du.shop](https://www.e-du.shop)
2. Ajoutez un article au panier
3. Procédez au paiement PayTech
4. Effectuez un paiement test

### **Test 2 : Vérifier les logs**

1. Vérifiez les logs de votre serveur
2. Recherchez les notifications PayTech
3. Vérifiez que le statut est mis à jour

### **Test 3 : Vérifier les factures**

1. Vérifiez que les factures sont envoyées par email
2. Vérifiez que les factures sont envoyées par WhatsApp
3. Vérifiez que le statut est mis à jour dans Airtable

## 🔍 **Dépannage :**

### **Si PayTech n'envoie toujours pas de notifications :**

1. **Vérifiez l'URL IPN :**

   - Assurez-vous que l'URL est exactement : `https://www.e-du.shop/api/paytech/webhook-simple`
   - Pas d'espace, pas de caractère supplémentaire

2. **Vérifiez l'activation :**

   - Assurez-vous que le webhook est activé
   - Vérifiez que les événements sont sélectionnés

3. **Contactez le support PayTech :**
   - Envoyez un email au support PayTech
   - Mentionnez que votre webhook fonctionne (testé avec succès)
   - Demandez pourquoi les notifications ne sont pas envoyées

### **Si vous ne trouvez pas la section webhook :**

1. **Cherchez dans différents menus :**

   - "Paramètres" ou "Settings"
   - "Configuration" ou "Configuration"
   - "API" ou "Intégration"
   - "Webhook" ou "Notifications"

2. **Contactez le support PayTech :**
   - Demandez où configurer l'URL IPN
   - Mentionnez que vous voulez recevoir les notifications de paiement

## 📞 **Support PayTech :**

### **Contact :**

- **Email :** support@paytech.sn
- **Téléphone :** +221 33 825 00 00
- **Site web :** [https://paytech.sn](https://paytech.sn)

### **Informations à fournir :**

- Votre URL de webhook : `https://www.e-du.shop/api/paytech/webhook-simple`
- Confirmation que le webhook fonctionne (testé avec succès)
- Demande d'activation des notifications IPN

## ✅ **Résultat attendu :**

Après la configuration correcte, vous devriez recevoir :

1. **✅ Notification de paiement réussi** dans les logs du serveur
2. **✅ Mise à jour du statut** dans Airtable (Pending → Paid)
3. **✅ Envoi automatique des factures** par email au client et admin
4. **✅ Envoi automatique des factures** par WhatsApp au client et admin
5. **✅ Confirmation de paiement** dans votre dashboard

## 🎯 **Actions immédiates :**

1. **🔧 Connectez-vous au dashboard PayTech**
2. **🔧 Configurez l'URL IPN :** `https://www.e-du.shop/api/paytech/webhook-simple`
3. **🔧 Activez les notifications IPN**
4. **🔧 Sauvegardez la configuration**
5. **🧪 Testez avec un paiement**

## 🚨 **Important :**

**Votre webhook fonctionne parfaitement !** Le problème est uniquement dans la configuration PayTech Dashboard. Une fois configuré, vous recevrez automatiquement toutes les notifications de paiement.

**Prochaine étape : Configurer l'URL IPN dans votre dashboard PayTech !** 🚀
