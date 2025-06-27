#!/bin/bash

# 🚀 SCRIPT DE DÉMARRAGE AVEC VARIABLES D'ENVIRONNEMENT
# Charge automatiquement le fichier .env et démarre le serveur

echo "🚀 DÉMARRAGE DU SERVEUR AVEC TOUTES LES CORRECTIONS"
echo "=================================================="

# Arrêter les processus existants
echo "🛑 Arrêt des processus existants..."
pkill -f "tsx serveur/server.mts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "❌ ERREUR: Fichier .env manquant"
    echo "📝 Créez un fichier .env avec vos clés API"
    exit 1
fi

echo "✅ Fichier .env détecté"

# Charger les variables d'environnement
echo "🔑 Chargement des variables d'environnement..."
export $(cat .env | grep -v '^#' | xargs)

# Vérifier les variables critiques
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY manquante dans .env"
    exit 1
fi

if [ -z "$V0_API_KEY" ]; then
    echo "❌ V0_API_KEY manquante dans .env"
    exit 1
fi

echo "✅ Variables d'environnement chargées"
echo "   - OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "   - V0_API_KEY: ${V0_API_KEY:0:10}..."
if [ ! -z "$VERCEL_TOKEN" ]; then
    echo "   - VERCEL_TOKEN: ${VERCEL_TOKEN:0:10}..."
fi

# Démarrer le serveur
echo ""
echo "🚀 Démarrage du serveur sur le port ${PORT:-8080}..."
echo "🌐 URL: http://localhost:${PORT:-8080}"
echo ""

npm run server 