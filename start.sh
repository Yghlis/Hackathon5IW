#!/bin/bash

# Script de démarrage pour le projet Agent Chat Interface
# Ce script lance le serveur backend et l'interface Vue.js en parallèle

echo "🚀 Démarrage du projet Agent Chat Interface..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour vérifier si un port est utilisé
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port utilisé
    else
        return 1  # Port libre
    fi
}

# Vérifier les dépendances
echo -e "${BLUE}📋 Vérification des dépendances...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js et npm sont installés${NC}"

# Vérifier si les ports sont libres
echo -e "${BLUE}🔍 Vérification des ports...${NC}"

if check_port 8080; then
    echo -e "${YELLOW}⚠️  Le port 8080 (backend) est déjà utilisé${NC}"
    echo -e "${YELLOW}   Veuillez arrêter le processus utilisant ce port ou modifier la configuration${NC}"
fi

if check_port 5173; then
    echo -e "${YELLOW}⚠️  Le port 5173 (frontend) est déjà utilisé${NC}"
    echo -e "${YELLOW}   Veuillez arrêter le processus utilisant ce port ou modifier la configuration${NC}"
fi

# Installation des dépendances si nécessaire
echo -e "${BLUE}📦 Installation des dépendances...${NC}"

# Dépendances principales
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installation des dépendances principales...${NC}"
    npm install
fi

# Dépendances UI
if [ ! -d "ui/node_modules" ]; then
    echo -e "${YELLOW}📥 Installation des dépendances UI...${NC}"
    cd ui && npm install && cd ..
fi

echo -e "${GREEN}✅ Dépendances installées${NC}"

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    echo -e "\n${YELLOW}🧹 Nettoyage des processus...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Intercepter Ctrl+C pour nettoyer proprement
trap cleanup INT

# Démarrer le serveur backend
echo -e "${BLUE}🔧 Démarrage du serveur backend (port 8080)...${NC}"
npx tsx serveur/server.mts &
BACKEND_PID=$!

# Attendre que le backend soit prêt
echo -e "${YELLOW}⏳ Attente du démarrage du backend...${NC}"
sleep 3

# Vérifier si le backend est opérationnel
for i in {1..10}; do
    if curl -s http://localhost:8080/health > /dev/null; then
        echo -e "${GREEN}✅ Backend opérationnel${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}❌ Le backend n'a pas pu démarrer${NC}"
        cleanup
        exit 1
    fi
    sleep 1
done

# Démarrer l'interface Vue.js
echo -e "${BLUE}🎨 Démarrage de l'interface Vue.js (port 5173)...${NC}"
cd ui
npm run dev &
FRONTEND_PID=$!
cd ..

# Attendre que le frontend soit prêt
echo -e "${YELLOW}⏳ Attente du démarrage du frontend...${NC}"
sleep 3

# Afficher les informations de connexion
echo -e "\n${GREEN}🎉 Projet démarré avec succès !${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📱 Interface Web:     ${GREEN}http://localhost:5173 (ou le port affiché par Vite)${NC}"
echo -e "${BLUE}🔧 API Backend:       ${GREEN}http://localhost:8080${NC}"
echo -e "${BLUE}🏥 Health Check:      ${GREEN}http://localhost:8080/health${NC}"
echo -e "${BLUE}📋 Agents disponibles: ${GREEN}http://localhost:8080/agents${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${YELLOW}💡 Conseils d'utilisation:${NC}"
echo -e "   • Ouvrez ${GREEN}http://localhost:5173${NC} (ou le port affiché ci-dessus) dans votre navigateur"
echo -e "   • Sélectionnez un agent dans la liste déroulante"
echo -e "   • Commencez à taper votre message !"
echo -e "   • Utilisez le mode Debug pour voir les détails techniques"
echo -e "\n${YELLOW}🛑 Pour arrêter le projet: appuyez sur Ctrl+C${NC}"

# Afficher les logs en temps réel
echo -e "\n${BLUE}📊 Logs en cours...${NC}"
echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"

# Attendre que l'utilisateur interrompe
wait 