# 🔧 Guide de Correction - URL PayTech IPN

## 🚨 **Problème identifié :**

L'URL IPN PayTech pointe vers l'ancienne URL Vercel :

- **URL actuelle (incorrecte) :** `https://fournitures-scolaire.vercel.app/api/paytech/webhook-simple`
- **URL correcte :** `https://www.e-du.shop/api/paytech/webhook-simple`

## 🔍 **Cause du problème :**

La variable d'environnement `NUXT_PUBLIC_BASE_URL` n'est pas configurée correctement, donc le système utilise l'ancienne URL par défaut.

## ✅ **Solutions :**

### **Solution 1 : Configuration Vercel (Recommandée)**

1. **Connectez-vous à Vercel :**

   - Allez sur [https://vercel.com](https://vercel.com)
   - Connectez-vous à votre compte

2. **Accédez à votre projet :**

   - Trouvez votre projet "fournitures-scolaire"
   - Cliquez sur "Settings"

3. **Configurez les variables d'environnement :**

   - Allez dans "Environment Variables"
   - Ajoutez/modifiez :
     ```
     NUXT_PUBLIC_BASE_URL = https://www.e-du.shop
     ```

4. **Redéployez :**
   - Allez dans "Deployments"
   - Cliquez sur "Redeploy" sur le dernier déploiement

### **Solution 2 : Configuration locale (.env)**

1. **Créez un fichier `.env` :**

   ```bash
   # Configuration du site
   NUXT_PUBLIC_BASE_URL=https://www.e-du.shop
   BASE_URL=https://www.e-du.shop

   # Autres variables existantes...
   AIRTABLE_API_KEY=your_airtable_api_key_here
   AIRTABLE_BASE_ID=your_airtable_base_id_here
   PAYTECH_API_KEY=your_paytech_api_key_here
   PAYTECH_SECRET_KEY=your_paytech_secret_key_here
   ```

2. **Redémarrez le serveur :**
   ```bash
   npm run dev
   ```

### **Solution 3 : Configuration PayTech Dashboard**

1. **Connectez-vous au dashboard PayTech :**

   - Allez sur [https://paytech.sn](https://paytech.sn)
   - Connectez-vous à votre compte

2. **Modifiez l'URL IPN :**

   - Allez dans "Paramètres" ou "Configuration"
   - Trouvez "URL de notification IPN"
   - Changez de : `https://fournitures-scolaire.vercel.app/api/paytech/webhook-simple`
   - Vers : `https://www.e-du.shop/api/paytech/webhook-simple`

3. **Sauvegardez la configuration**

## 🧪 **Tests de validation :**

### **Test 1 : Vérifier l'URL du webhook**

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

### **Test 2 : Vérifier la configuration PayTech**

- Connectez-vous au dashboard PayTech
- Vérifiez que l'URL IPN est : `https://www.e-du.shop/api/paytech/webhook-simple`

### **Test 3 : Effectuer un paiement test**

- Allez sur [https://www.e-du.shop](https://www.e-du.shop)
- Effectuez un paiement test
- Vérifiez que la notification arrive

## 📊 **Configuration actuelle vs correcte :**

### **Avant (incorrect) :**

```
NUXT_PUBLIC_BASE_URL = https://fournitures-scolaire.vercel.app
URL IPN PayTech = https://fournitures-scolaire.vercel.app/api/paytech/webhook-simple
```

### **Après (correct) :**

```
NUXT_PUBLIC_BASE_URL = https://www.e-du.shop
URL IPN PayTech = https://www.e-du.shop/api/paytech/webhook-simple
```

## 🚀 **Actions immédiates :**

### **1. Configuration Vercel (Priorité 1) :**

- [ ] Connectez-vous à Vercel
- [ ] Allez dans Settings > Environment Variables
- [ ] Ajoutez `NUXT_PUBLIC_BASE_URL = https://www.e-du.shop`
- [ ] Redéployez le projet

### **2. Configuration PayTech (Priorité 2) :**

- [ ] Connectez-vous au dashboard PayTech
- [ ] Modifiez l'URL IPN vers `https://www.e-du.shop/api/paytech/webhook-simple`
- [ ] Sauvegardez la configuration

### **3. Test (Priorité 3) :**

- [ ] Testez le webhook avec la nouvelle URL
- [ ] Effectuez un paiement test
- [ ] Vérifiez que les notifications arrivent

## ✅ **Résultat attendu :**

Après la correction :

1. **✅ URL IPN correcte** : `https://www.e-du.shop/api/paytech/webhook-simple`
2. **✅ Notifications PayTech** reçues automatiquement
3. **✅ Statut des commandes** mis à jour dans Airtable
4. **✅ Factures envoyées** par email et WhatsApp
5. **✅ Système entièrement fonctionnel**

## 🎯 **Ordre de priorité :**

1. **🔧 Configuration Vercel** (variable d'environnement)
2. **🔧 Configuration PayTech** (URL IPN)
3. **🧪 Test du système** (paiement test)

## 🚨 **Important :**

**Le webhook fonctionne parfaitement !** Le seul problème est l'URL incorrecte. Une fois corrigée, vous recevrez automatiquement toutes les notifications PayTech.

**Prochaine étape : Configurer `NUXT_PUBLIC_BASE_URL = https://www.e-du.shop` dans Vercel !** 🚀

