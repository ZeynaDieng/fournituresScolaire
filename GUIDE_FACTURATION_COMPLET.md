# 📧 Guide Complet - Facturation et Emails après Paiement

## ✅ **Oui, vous pouvez avoir la facture après paiement !**

Avec la configuration actuelle, après chaque paiement PayTech réussi, vous recevrez automatiquement :

### 🧾 **Facture détaillée incluant :**

- ✅ **En-tête professionnel** avec numéro de facture
- ✅ **Informations client** complètes
- ✅ **Détail des articles** avec quantités et prix
- ✅ **Calculs automatiques** (sous-total, livraison, remises, total)
- ✅ **Statut de paiement** (✅ PAYÉ)
- ✅ **Informations de livraison**
- ✅ **Design professionnel** avec couleurs et mise en page

### 📧 **Emails envoyés automatiquement :**

- ✅ **Email client** : Facture de confirmation
- ✅ **Email admin** : Notification de nouvelle commande

## 🔧 **Configuration actuelle**

### **Système de facturation :**

- ✅ Service de facturation créé (`utils/invoice-service.ts`)
- ✅ Webhook PayTech mis à jour pour envoyer les factures
- ✅ Template HTML professionnel pour les factures
- ✅ Calculs automatiques (sous-total, total, remises)

### **Problème identifié :**

❌ **Configuration email non fonctionnelle** - Les emails ne sont pas envoyés

## 🚨 **Solution du problème d'emails**

### **1. Vérifier la configuration Gmail**

Votre configuration actuelle :

```bash
NOTIFICATION_EMAIL_USER=zeynash1@gmail.com
NOTIFICATION_EMAIL_PASSWORD=zmruomypjxrjxfto
ADMIN_EMAIL=zeynash1@gmail.com
FROM_NAME=Fournitures Scolaires
```

### **2. Problèmes possibles :**

#### **A. Mot de passe d'application Gmail**

- Le mot de passe `zmruomypjxrjxfto` peut être expiré
- Gmail peut avoir désactivé l'accès aux applications moins sécurisées

#### **B. Authentification à 2 facteurs**

- Assurez-vous que l'authentification à 2 facteurs est activée
- Générez un nouveau mot de passe d'application

### **3. Solution recommandée :**

#### **Étape 1 : Générer un nouveau mot de passe d'application**

1. Allez dans votre compte Google
2. Sécurité → Authentification à 2 facteurs
3. Mots de passe des applications
4. Sélectionnez "Autre" et donnez un nom (ex: "Fournitures Scolaires")
5. Copiez le nouveau mot de passe

#### **Étape 2 : Mettre à jour le .env**

```bash
NOTIFICATION_EMAIL_PASSWORD=votre-nouveau-mot-de-passe-app
```

#### **Étape 3 : Redémarrer le serveur**

```bash
npm run dev
```

## 🧪 **Test de la facturation**

### **Test local :**

```bash
curl -X POST "http://localhost:3000/api/test-invoice" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Client",
    "customerEmail": "zeynash1@gmail.com",
    "amount": 50000
  }'
```

### **Test sur le site déployé :**

```bash
curl -X POST "https://www.e-du.shop/api/test-invoice" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Client",
    "customerEmail": "zeynash1@gmail.com",
    "amount": 50000
  }'
```

## 📋 **Flux complet après paiement**

### **1. Paiement PayTech réussi**

- PayTech envoie une notification IPN à votre webhook
- URL IPN : `https://www.e-du.shop/api/paytech/webhook-simple`

### **2. Traitement automatique**

- ✅ Réception de la notification IPN
- ✅ Décodage des données de commande
- ✅ Génération de la facture HTML
- ✅ Envoi de l'email client avec facture
- ✅ Envoi de l'email admin avec notification

### **3. Emails reçus**

- **Client** : Facture détaillée avec tous les détails
- **Admin** : Notification de nouvelle commande

## 🎯 **Exemple de facture générée**

La facture inclut :

```
FACTURE #FACT-1757980609207
Date : 15/01/2025
Statut : ✅ PAYÉ

Facturé à :
Test Client
zeynash1@gmail.com
+221777780456

Articles commandés :
- Pack Scolaire Primaire x1 : 45,000 FCFA
- Cahier 200 pages x2 : 1,200 FCFA
- Stylo Bille Bleu x5 : 500 FCFA

Sous-total : 46,700 FCFA
Livraison : 3,000 FCFA
TOTAL : 49,700 FCFA

Méthode de paiement : PayTech
Date de paiement : 15/01/2025 14:30:25
```

## 🚀 **Prochaines étapes**

1. **Corriger la configuration email** (nouveau mot de passe Gmail)
2. **Tester la facturation** localement
3. **Déployer les changements**
4. **Configurer l'URL IPN** dans PayTech Dashboard
5. **Tester un paiement réel**

## 📞 **Support**

Si vous avez encore des problèmes :

- Vérifiez les logs du serveur
- Testez avec un autre email
- Contactez le support Gmail si nécessaire

**Votre système de facturation est prêt ! Il ne reste plus qu'à corriger la configuration email.** 🎉
