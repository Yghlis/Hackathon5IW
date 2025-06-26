# 🚀 Configuration Déploiement Vercel

## 📋 Prérequis

Pour déployer de vrais sites sur Vercel, vous devez configurer un token d'accès.

## 🔧 Configuration en 4 étapes

### 1. Créer un compte Vercel (gratuit)
- Aller sur [vercel.com](https://vercel.com)
- S'inscrire avec GitHub, GitLab ou Bitbucket

### 2. Obtenir un token d'accès
- Une fois connecté, aller dans **Settings** → **Tokens**
- Cliquer sur **Create Token**
- Donner un nom (ex: "MyGES Agent")
- **Copier le token** (vous ne pourrez plus le voir après)

### 3. Configurer le token
- Ouvrir le fichier `.env` dans le projet
- Ajouter la ligne :
```
VERCEL_TOKEN=votre_token_ici
```

### 4. Redémarrer le serveur
```bash
npm run dev
```

## ✅ Test

Une fois configuré, l'agent pourra déployer de vrais sites sur Vercel !

## 🎯 Sans token

Si aucun token n'est configuré, l'agent :
- Génère quand même le code du site
- Explique comment configurer Vercel
- Donne les instructions pour déployer manuellement

## 🔒 Sécurité

- Ne jamais partager votre token Vercel
- Le token est utilisé uniquement pour les déploiements
- Vous pouvez révoquer le token à tout moment depuis Vercel 