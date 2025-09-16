# 📧 Configuration des Emails de Commande

## Problème résolu ✅

Le système d'emails a été corrigé ! Maintenant, les clients et l'admin recevront des emails après chaque commande.

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env` :

```bash
# Configuration Email
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
ADMIN_EMAIL=admin@votre-site.com
FROM_NAME=Fournitures Scolaires
```

## Configuration Gmail (Recommandé)

### 1. Activer l'authentification à 2 facteurs

- Allez dans votre compte Google
- Sécurité → Authentification à 2 facteurs → Activer

### 2. Générer un mot de passe d'application

- Sécurité → Mots de passe des applications
- Sélectionnez "Autre" et donnez un nom (ex: "Fournitures Scolaires")
- Copiez le mot de passe généré

### 3. Configuration dans .env

```bash
EMAIL_SERVICE=gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=le-mot-de-passe-app-généré
ADMIN_EMAIL=votre-email@gmail.com
FROM_NAME=Fournitures Scolaires
```

## Configuration Outlook/Hotmail

```bash
EMAIL_SERVICE=hotmail
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe
ADMIN_EMAIL=votre-email@outlook.com
FROM_NAME=Fournitures Scolaires
```

## Configuration Yahoo

```bash
EMAIL_SERVICE=yahoo
EMAIL_USER=votre-email@yahoo.com
EMAIL_PASSWORD=votre-mot-de-passe-app
ADMIN_EMAIL=votre-email@yahoo.com
FROM_NAME=Fournitures Scolaires
```

## Test de la configuration

Après avoir configuré les variables, redémarrez votre serveur :

```bash
npm run dev
```

Puis testez une commande. Vous devriez recevoir :

- ✅ **Email de confirmation** au client
- ✅ **Email de notification** à l'admin

## Emails envoyés

### Email Client

- Confirmation de commande
- Détails de la commande
- Prochaines étapes
- Design professionnel

### Email Admin

- Notification de nouvelle commande
- Informations client complètes
- Liste des articles
- Actions requises

## Dépannage

### "Variables email manquantes"

- Vérifiez que toutes les variables sont définies dans `.env`
- Redémarrez le serveur après modification

### "Erreur d'authentification"

- Vérifiez le mot de passe d'application
- Assurez-vous que l'authentification à 2 facteurs est activée

### "Emails non reçus"

- Vérifiez les spams/courriers indésirables
- Testez avec un autre email
- Vérifiez les logs du serveur

## Support

Si vous avez des problèmes, vérifiez les logs du serveur pour voir les messages d'erreur détaillés.
