# 🔧 Guide de Configuration Complète - Hackathon5IW

## 🚨 **PROBLÈME IDENTIFIÉ**

Votre projet ne fonctionne pas car **les clés API ne sont pas configurées**. Voici la solution complète :

## ✅ **SOLUTION ÉTAPE PAR ÉTAPE**

### 1. Créer le fichier `.env`

Dans le dossier racine de votre projet, créez un fichier `.env` avec ce contenu :

```env
# Variables d'environnement pour Hackathon5IW
# IMPORTANT: Remplacez les valeurs par vos vraies clés API

# =================================
# OpenAI (OBLIGATOIRE pour LangChain)
# =================================
OPENAI_API_KEY=votre_cle_openai_ici

# =================================
# V0.dev (OBLIGATOIRE pour génération de code) 
# =================================
V0_API_KEY=votre_cle_v0_dev_ici

# =================================
# Vercel (OPTIONNEL - déploiement automatique)
# =================================
VERCEL_TOKEN=votre_token_vercel_ici

# =================================
# Configuration serveur
# =================================
PORT=8080
NODE_ENV=development
DEBUG=true
REQUIRE_AUTH=false
```

### 2. Obtenir les clés API

#### 🤖 **OpenAI API (OBLIGATOIRE)**
1. Aller sur https://platform.openai.com/api-keys
2. Créer une nouvelle clé API 
3. Remplacer `votre_cle_openai_ici` par votre vraie clé

#### 🎨 **V0.dev API (OBLIGATOIRE)**
1. Aller sur https://v0.dev
2. Créer un compte (Plan Premium requis - ~$20/mois)
3. Générer une clé API
4. Remplacer `votre_cle_v0_dev_ici` par votre vraie clé

#### 🚀 **Vercel Token (OPTIONNEL)**
1. Aller sur https://vercel.com/account/tokens
2. Créer un nouveau token
3. Remplacer `votre_token_vercel_ici` par votre vrai token

### 3. Redémarrer le système

```bash
# Arrêter tous les processus
pkill -f "tsx serveur/server.mts"
pkill -f "vite"

# Attendre 3 secondes
sleep 3

# Relancer le serveur
npm run server &

# Relancer le frontend  
cd frontend && npm run dev &
```

## 🎯 **VALIDATION DE LA CONFIGURATION**

### Test 1: Vérifier le serveur
```bash
curl http://localhost:8080/health
```
**Résultat attendu :** `{"status":"ok",...}`

### Test 2: Vérifier les agents
```bash
curl http://localhost:8080/agents
```
**Résultat attendu :** `[{"id":"myges",...}]`

### Test 3: Tester la génération
```bash
curl -X POST http://localhost:8080/myges/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": "Créer un site pour une boulangerie moderne"}'
```

## ❌ **ERREURS COURANTES ET SOLUTIONS**

### Erreur: `Cannot read properties of undefined (reading 'map')`
**Cause :** `OPENAI_API_KEY` manquante ou invalide
**Solution :** Vérifier votre clé OpenAI dans le fichier `.env`

### Erreur: `V0.dev API error: 404 Not Found`
**Cause :** `V0_API_KEY` manquante ou invalide
**Solution :** Vérifier votre clé V0.dev et votre plan Premium

### Erreur: `deployToVercel is not a function`
**Cause :** Import incorrect (corrigé dans le code)
**Solution :** Redémarrer le serveur après les corrections

### Erreur: `Function Runtimes must have a valid version`
**Cause :** Configuration Vercel obsolète (corrigé dans le code)
**Solution :** La configuration est maintenant optimisée

## 🎉 **APRÈS CONFIGURATION**

Une fois configuré, votre système pourra :
- ✅ Générer des sites avec V0.dev
- ✅ Déployer automatiquement sur Vercel
- ✅ Interface Vue.js sur http://localhost:3000
- ✅ API serveur sur http://localhost:8080

## 💡 **RECOMMANDATIONS**

1. **Commencez par OpenAI et V0.dev** (essentiels)
2. **Vercel peut attendre** (déploiement manuel possible)
3. **Testez étape par étape** pour identifier les problèmes
4. **Gardez vos clés API sécurisées** (ne les partagez jamais)

## 🆘 **SUPPORT**

Si vous rencontrez encore des problèmes après cette configuration :
1. Vérifiez que toutes les clés sont valides
2. Testez chaque API individuellement
3. Vérifiez les logs du serveur pour plus de détails 