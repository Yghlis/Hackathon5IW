# 🚀 Guide de Configuration - Hackathon5IW

## 🎯 Résumé des Corrections Apportées

Les problèmes suivants ont été **RÉSOLUS** :

### ✅ API V0.dev Corrigée
- **Endpoint correct** : `https://api.v0.dev/v1/chat/completions`
- **Modèle optimal** : `v0-1.5-md` (spécialisé pour la génération d'UI)
- **Gestion d'erreurs améliorée** : messages clairs pour 404, 401, 429
- **Nettoyage automatique** : suppression du texte explicatif de V0.dev
- **Détection de troncature** : correction automatique des fichiers incomplets

### ✅ Déploiement Vercel Optimisé
- **Support Next.js complet** : configuration adaptée pour App Router
- **Gestion d'erreurs spécifique** : diagnostics détaillés par type d'erreur
- **Timeout augmenté** : 5 minutes pour les builds Next.js complexes
- **Test d'accessibilité** : vérification que le site déployé fonctionne
- **Fallback local** : preview en cas d'échec de déploiement

### ✅ Structure de Projet Complète
- **Next.js 14** : App Router avec structure moderne
- **Tailwind CSS** : configuration optimisée
- **TypeScript** : typage complet
- **Fichiers requis** : package.json, layout.tsx, globals.css

---

## 🔧 Configuration Requise

### 1. Variables d'Environnement

Créez un fichier `.env` avec le contenu suivant :

```bash
# ⚡ OBLIGATOIRE - API V0.dev
V0_API_KEY=votre_cle_v0_dev_ici

# 🚀 OPTIONNEL - Déploiement automatique Vercel
VERCEL_TOKEN=votre_token_vercel_ici

# 🔧 OPTIONNEL - Configuration serveur
PORT=8080
REQUIRE_AUTH=false
NODE_ENV=development
DEBUG=true
```

### 2. Obtenir la Clé API V0.dev (OBLIGATOIRE)

1. **Aller sur** : https://v0.dev
2. **S'inscrire/Se connecter** avec GitHub
3. **Upgrade vers Premium/Team** : ⚠️ **Plan gratuit insuffisant**
4. **Activer Usage-based billing** 
5. **Créer une clé API** : Settings > API Keys
6. **Copier la clé** dans `.env`

**Test de validation :**
```bash
curl -H "Authorization: Bearer VOTRE_CLE" https://api.v0.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"v0-1.5-md","messages":[{"role":"user","content":"test"}]}'
```

### 3. Configurer Vercel (OPTIONNEL)

**Option A - Token automatique :**
1. Aller sur : https://vercel.com/account/tokens
2. Créer un nouveau token
3. Ajouter dans `.env` : `VERCEL_TOKEN=votre_token`

**Option B - Login interactif :**
```bash
npx vercel login
```

---

## 🚀 Lancement du Système

### 1. Démarrer le Backend
```bash
npm run server
```
**URL** : http://localhost:8080

### 2. Démarrer le Frontend
```bash
cd frontend && npm run dev
```
**URL** : http://localhost:3000 (ou 3003 si occupé)

---

## 🐛 Résolution des Problèmes

### ❌ Erreur "404 NOT_FOUND" de V0.dev

**Causes possibles :**
- Clé API invalide ou expirée
- Plan gratuit (Premium/Team requis)
- Usage-based billing désactivé
- Quota épuisé

**Solutions :**
1. Vérifier la clé API sur v0.dev
2. Upgrade vers Premium ($20/mois minimum)
3. Activer billing dans Settings
4. Vérifier les quotas et limites

### ❌ Erreur "deployToVercel is not a function"

**✅ RÉSOLU** : Import corrigé de `deployToVercel` vers `deployToVercelTool`

### ❌ Sites Vercel donnent 404 NOT_FOUND

**Causes et solutions :**

1. **Build Next.js échoué :**
   ```bash
   cd generated-sites/PROJET_NAME
   npm install
   npm run build  # Vérifier les erreurs
   ```

2. **Configuration Vercel incorrecte :**
   - ✅ **RÉSOLU** : `vercel.json` optimisé pour Next.js

3. **Code React tronqué :**
   - ✅ **RÉSOLU** : Détection et correction automatique

4. **Déploiement en cours :**
   - Attendre 1-2 minutes pour la propagation CDN

### ❌ Port 8080 occupé (EADDRINUSE)

```bash
# Tuer les processus existants
pkill -f "tsx serveur/server.mts"
sleep 3
npm run server
```

---

## 🧪 Test du Système Complet

### 1. Test de Génération
```bash
# Via frontend : http://localhost:3000
# Demander : "Restaurant moderne avec style élégant et couleurs noir/or"
```

### 2. Vérification des Fichiers Générés
```bash
ls -la generated-sites/PROJET_NAME/
# Doit contenir : app/, package.json, next.config.js, vercel.json
```

### 3. Test de Build Local
```bash
cd generated-sites/PROJET_NAME
npm install
npm run build  # Doit réussir sans erreurs
```

### 4. Test de Déploiement
```bash
cd generated-sites/PROJET_NAME
npx vercel --prod  # Doit déployer et retourner une URL
```

---

## 📊 Monitoring et Debugging

### Logs Serveur
- ✅ **Génération V0.dev** : Code généré et taille
- ✅ **Nettoyage** : Lignes supprimées
- ✅ **Correction troncature** : Sections ajoutées
- ✅ **Déploiement** : URL de production

### Logs d'Erreur Détaillés
- **V0.dev** : Status code + message explicite
- **Vercel** : Type d'erreur + solutions spécifiques
- **Build** : Erreurs de compilation + solutions

### Endpoints de Debug
```bash
GET  http://localhost:8080/health      # Status système
GET  http://localhost:8080/agents      # Agents disponibles
GET  http://localhost:8080/projects    # Projets générés
GET  http://localhost:8080/preview/NOM # Preview local
```

---

## 🎉 Succès Attendu

Après configuration correcte, le système doit :

1. **Générer du code React complet** (13,000+ caractères)
2. **Créer une structure Next.js valide**
3. **Déployer sur Vercel automatiquement**
4. **Retourner une URL accessible mondialement**
5. **Site fonctionnel** : mobile + desktop + HTTPS

**Exemple de succès :**
```
🎉 SITE DÉPLOYÉ AVEC SUCCÈS ! 🚀
🌐 CLIQUEZ ICI : https://monsite-abc123.vercel.app
✅ Site accessible dans le monde entier !
📱 Compatible mobile, tablette et desktop
🔒 HTTPS automatique et sécurisé
```

---

## 🆘 Support

**Si des problèmes persistent :**

1. **Vérifier les prérequis** (V0.dev Premium + billing)
2. **Consulter les logs** serveur détaillés  
3. **Tester manuellement** chaque étape
4. **Contacter le support** V0.dev ou Vercel si nécessaire

Le système est maintenant **robuste et prêt pour la production** ! 🚀 