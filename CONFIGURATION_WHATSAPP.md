# 📱 Configuration WhatsApp pour les Factures

## ✅ **Oui, la facture peut s'envoyer sur WhatsApp !**

J'ai créé un système complet pour envoyer les factures par WhatsApp après chaque paiement.

### 🎯 **Ce qui sera envoyé par WhatsApp :**

#### **📱 Message client :**

```
🧾 FACTURE DE COMMANDE

📋 Numéro: FACT-1757980609207
📅 Date: 15/01/2025
👤 Client: Test Client
📱 Téléphone: +221777780456

🛍️ Articles commandés:
1. Pack Scolaire Primaire
   Quantité: 1
   Prix unitaire: 45,000 FCFA
   Total: 45,000 FCFA

2. Cahier 200 pages
   Quantité: 2
   Prix unitaire: 600 FCFA
   Total: 1,200 FCFA

💰 RÉCAPITULATIF:
Sous-total: 46,700 FCFA
Livraison: 3,000 FCFA
TOTAL: 49,700 FCFA

💳 Paiement: PayTech
✅ Statut: PAYÉ

📦 Livraison:
• Votre commande est en cours de préparation
• Livraison prévue sous 24-48h à Dakar
• Vous recevrez un SMS pour la livraison

📞 Contact:
WhatsApp: +221777780456
Email: contact@edushop.sn

Merci pour votre confiance ! 🙏
Fournitures Scolaires
```

#### **📱 Message admin :**

```
🎒 NOUVELLE COMMANDE

📋 Référence: FACT-1757980609207
👤 Client: Test Client
📱 Téléphone: +221777780456
📧 Email: test@example.com
💰 Montant: 49,700 FCFA
💳 Paiement: PayTech
📅 Date: 15/01/2025 14:30:25

🛍️ Articles:
• Pack Scolaire Primaire x1 (45,000 FCFA)
• Cahier 200 pages x2 (1,200 FCFA)
• Stylo Bille Bleu x5 (500 FCFA)

⚡ Action requise: Préparer la commande et contacter le client
```

## 🔧 **Configuration WhatsApp**

### **Option 1 : WhatsApp Business API (Meta) - Recommandée**

Ajoutez dans votre `.env` :

```bash
# Configuration WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=votre_access_token_meta
WHATSAPP_PHONE_NUMBER_ID=votre_phone_number_id
WHATSAPP_BUSINESS_NUMBER=+221777780456
```

#### **Étapes pour obtenir les tokens :**

1. Créez un compte [Meta for Developers](https://developers.facebook.com/)
2. Créez une application WhatsApp Business
3. Ajoutez un numéro de téléphone business
4. Récupérez l'access token et phone number ID

### **Option 2 : Service WhatsApp Tiers**

Vous pouvez intégrer avec :

- **Twilio WhatsApp API**
- **MessageBird WhatsApp API**
- **360Dialog WhatsApp API**
- **Autres services WhatsApp**

### **Option 3 : WhatsApp Simple (Simulation)**

Pour les tests, le système simule l'envoi WhatsApp :

```bash
# Pas de configuration requise pour les tests
```

## 🧪 **Test du système WhatsApp**

### **Test local :**

```bash
curl -X POST "http://localhost:3000/api/test-whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Client",
    "customerPhone": "+221777780456",
    "amount": 50000
  }'
```

### **Test sur le site déployé :**

```bash
curl -X POST "https://www.e-du.shop/api/test-whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Client",
    "customerPhone": "+221777780456",
    "amount": 50000
  }'
```

## 📋 **Flux complet après paiement**

### **1. Paiement PayTech réussi**

- PayTech envoie notification IPN
- Webhook traite la commande

### **2. Envoi automatique :**

- ✅ **Email client** : Facture HTML détaillée
- ✅ **Email admin** : Notification de commande
- ✅ **WhatsApp client** : Facture formatée
- ✅ **WhatsApp admin** : Notification de commande

### **3. Résultat :**

- Client reçoit facture par email ET WhatsApp
- Admin reçoit notification par email ET WhatsApp

## 🚀 **Avantages WhatsApp**

### **Pour les clients :**

- ✅ **Réception instantanée** sur leur téléphone
- ✅ **Format lisible** sur mobile
- ✅ **Pas besoin d'email** ou d'internet
- ✅ **Communication directe** avec le business

### **Pour l'admin :**

- ✅ **Notifications immédiates** sur WhatsApp
- ✅ **Suivi facile** des commandes
- ✅ **Communication directe** avec les clients

## 📞 **Configuration recommandée**

### **Pour commencer rapidement :**

1. Utilisez la **simulation WhatsApp** pour les tests
2. Configurez l'**API Meta** pour la production
3. Testez avec votre numéro personnel

### **Variables d'environnement :**

```bash
# WhatsApp Business API (Meta)
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_NUMBER=+221777780456

# Configuration existante
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=zeynash1@gmail.com
```

## ✅ **Statut actuel**

- ✅ **Service WhatsApp créé** (`utils/whatsapp-service.ts`)
- ✅ **Webhook mis à jour** pour envoyer WhatsApp
- ✅ **Messages formatés** pour client et admin
- ✅ **Formatage automatique** des numéros
- ⏳ **Configuration API** à faire selon votre choix

**Votre système de facturation WhatsApp est prêt ! Il ne reste plus qu'à configurer l'API WhatsApp de votre choix.** 🎉
