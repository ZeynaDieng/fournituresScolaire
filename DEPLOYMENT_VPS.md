# 🚀 Guide de Déploiement & Maintenance VPS - EduShop Sénégal

Ce document récapitule la configuration et les instructions pour gérer et mettre à jour l'application **EduShop** sur votre VPS.

---

## ⚙️ Informations d'Infrastructure VPS

- **Adresse IP VPS** : `164.68.120.224`
- **Domaines configurés** : `https://edushop.sn` et `https://www.edushop.sn`
- **Dossier de l'application** : `/var/www/edushop`
- **Port interne Docker** : `3050`
- **Serveur Web & Reverse Proxy** : Nginx + Certbot (SSL Let's Encrypt)
- **Base de données** : Airtable Cloud (connectée via `.env`)

---

## 🔄 Comment déployer une nouvelle version en 1 commande

À l'avenir, chaque fois que des modifications sont poussées sur GitHub, connectez-vous en SSH à votre VPS et exécutez simplement :

```bash
cd /var/www/edushop && ./deploy.sh
```

Ou si vous n'avez pas rendu le script exécutable :

```bash
cd /var/www/edushop && bash deploy.sh
```

Le script va automatiquement :
1. Télécharger le dernier code depuis GitHub (`git pull origin main`)
2. Reconstruire l'image Docker (`docker build -t edushop .`)
3. Remplacer l'ancien conteneur sans interruption perçue (`docker rm -f edushop`)
4. Relancer EduShop sur le port `3050` avec redémarrage automatique en cas de reboot du VPS (`--restart always`)

---

## 🛠️ Commandes Utiles de Maintenance

### 1. Voir les logs de l'application en direct :
```bash
docker logs -f edushop
```

### 2. Vérifier l'état du conteneur :
```bash
docker ps -a | grep edushop
```

### 3. Redémarrer manuellement l'application :
```bash
docker restart edushop
```

### 4. Vérifier la configuration Nginx :
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Renouvellement du certificat SSL :
Certbot renouvelle automatiquement le certificat SSL en arrière-plan. Vous pouvez tester le renouvellement avec :
```bash
sudo certbot renew --dry-run
```
