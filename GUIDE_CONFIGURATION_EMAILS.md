# 📧 Guide de Configuration des Emails

## 🚨 **PROBLÈME IDENTIFIÉ :**

Les emails ne sont pas configurés ! Votre fichier `.env` ne contient pas les variables nécessaires pour l'envoi d'emails.

## 📍 **Où sont les emails dans votre application :**

### **1. Service d'email principal :**
- **Fichier :** `utils/email-service.ts`
- **Fonctions :**
  - `sendCustomerConfirmationEmail()` - Email de confirmation client
  - `sendAdminNotificationEmail()` - Email de notification admin
  - `sendOrderEmails()` - Envoi des deux emails

### **2. Service de notifications :**
- **Fichier :** `utils/notification-service.ts`
- **Fonctions :**
  - `sendClientEmail()` - Email client
  - `sendAdminEmail()` - Email admin
  - `sendAdminWhatsApp()` - WhatsApp admin

### **3. Intégration PayTech :**
- **Fichiers :** `server/api/paytech/webhook-*.post.ts`
- **Fonction :** Envoi automatique d'emails après paiement PayTech

## 🔧 **CONFIGURATION REQUISE :**

### **Variables d'environnement à ajouter dans `.env` :**

```bash
# Configuration Email (REQUIS)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NOTIFICATION_EMAIL_USER=your-email@gmail.com
NOTIFICATION_EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@your-domain.com
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Fournitures Scolaires
```

## 📋 **ÉTAPES DE CONFIGURATION :**

### **1. Créer un fichier `.env` :**

Créez un fichier `.env` à la racine de votre projet avec le contenu suivant :

```bash
# Configuration Airtable (REQUIS)
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_ORDERS_TABLE=your_orders_table_id_here

# Configuration PayTech (Optionnel)
PAYTECH_API_KEY=your_paytech_api_key_here
PAYTECH_SECRET_KEY=your_paytech_secret_key_here
PAYTECH_SANDBOX=true

# Configuration Email (REQUIS pour les notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NOTIFICATION_EMAIL_USER=your-email@gmail.com
NOTIFICATION_EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@your-domain.com
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Fournitures Scolaires

# Configuration du site
NUXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
BASE_URL=https://your-domain.vercel.app

# Configuration de production
NODE_ENV=production
```

### **2. Configuration Gmail (Recommandé) :**

#### **Étape 1 : Activer l'authentification à 2 facteurs**
- Allez dans votre compte Google
- Sécurité → Authentification à 2 facteurs → Activer

#### **Étape 2 : Générer un mot de passe d'application**
- Sécurité → Mots de passe des applications
- Sélectionnez "Autre" et donnez un nom (ex: "Fournitures Scolaires")
- Copiez le mot de passe généré

#### **Étape 3 : Mettre à jour `.env`**
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=le-mot-de-passe-app-généré
ADMIN_EMAIL=votre-email@gmail.com
FROM_NAME=Fournitures Scolaires
```

### **3. Configuration Outlook/Hotmail :**

```bash
EMAIL_SERVICE=hotmail
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe
ADMIN_EMAIL=votre-email@outlook.com
FROM_NAME=Fournitures Scolaires
```

### **4. Configuration Yahoo :**

```bash
EMAIL_SERVICE=yahoo
EMAIL_USER=votre-email@yahoo.com
EMAIL_PASSWORD=votre-mot-de-passe-app
ADMIN_EMAIL=votre-email@yahoo.com
FROM_NAME=Fournitures Scolaires
```

## 🧪 **TEST DE LA CONFIGURATION :**

### **1. Redémarrer le serveur :**
```bash
npm run dev
```

### **2. Tester une commande :**
- Ajoutez des articles au panier
- Effectuez une commande
- Vérifiez que vous recevez :
  - ✅ **Email de confirmation** au client
  - ✅ **Email de notification** à l'admin

### **3. Vérifier les logs :**
```bash
# Rechercher ces messages dans les logs :
✅ "Email de confirmation envoyé au client:"
✅ "Email de notification envoyé à l'admin:"
```

## 📧 **TYPES D'EMAILS ENVOYÉS :**

### **Email Client :**
- ✅ Confirmation de commande
- ✅ Détails de la commande
- ✅ Prochaines étapes
- ✅ Design professionnel avec logo

### **Email Admin :**
- ✅ Notification de nouvelle commande
- ✅ Informations client complètes
- ✅ Liste des articles commandés
- ✅ Actions requises

## 🔍 **DÉPANNAGE :**

### **"Configuration email manquante"**
- Vérifiez que toutes les variables sont définies dans `.env`
- Redémarrez le serveur après modification

### **"Erreur d'authentification"**
- Vérifiez le mot de passe d'application
- Assurez-vous que l'authentification à 2 facteurs est activée

### **"Emails non reçus"**
- Vérifiez les spams/courriers indésirables
- Testez avec un autre email
- Vérifiez les logs du serveur

### **"Transporteur email non disponible"**
- Vérifiez que `EMAIL_USER` et `EMAIL_PASSWORD` sont définis
- Vérifiez que le service email est correct (gmail, hotmail, yahoo)

## 🎯 **INTÉGRATION AVEC PAYTECH :**

Les emails sont automatiquement envoyés après un paiement PayTech réussi :

1. **Paiement PayTech** → Webhook reçu
2. **Mise à jour Airtable** → Statut "Paid"
3. **Envoi d'emails** → Client + Admin
4. **Notification WhatsApp** → Admin (si configuré)

## 🚀 **APRÈS CONFIGURATION :**

Une fois configuré, votre système enverra automatiquement :

- ✅ **Email de confirmation** à chaque client après commande
- ✅ **Email de notification** à l'admin pour chaque nouvelle commande
- ✅ **Emails après paiement PayTech** réussi
- ✅ **Emails après commande WhatsApp** envoyée

**Votre système de notifications sera alors complet !** 🎉

---

*Guide créé le 16 Septembre 2024 - Configuration emails*
