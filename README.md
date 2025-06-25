# 🤖 Agent Chat Interface

## Vue d'ensemble

Ce projet transforme votre interface CLI d'agents IA en une **interface web moderne avec Vue.js**. Il permet d'interagir facilement avec différents agents IA via une interface de chat intuitive et moderne.

## 🏗️ Architecture

```
Hackathon5IW/
├── 🎨 ui/                    # Interface Vue.js (Frontend)
├── 🔧 serveur/               # API Express.js (Backend)
├── 🤖 Agents/                # Agents IA avec LangGraph
│   └── design/               # Agent de conception web
├── 📱 CLI/                   # Interface ligne de commande (legacy)
└── 🚀 start.sh              # Script de démarrage automatique
```

## ✨ Fonctionnalités

### Interface Web
- 🎯 **Sélection d'agents** : Interface intuitive pour choisir l'agent
- 💬 **Chat en temps réel** : Streaming des réponses avec animation de frappe
- 🎨 **Design moderne** : Interface responsive avec dégradés et glassmorphisme
- 🐛 **Mode debug** : Inspection des appels API en temps réel
- 📱 **Mobile-friendly** : Optimisé pour tous les écrans
- 🔄 **Gestion des conversations** : Contexte maintenu par conversation

### Backend
- 🔌 **API REST** : Endpoints pour la gestion des agents
- 📡 **Streaming SSE** : Réponses en temps réel
- 💾 **Persistence** : Gestion des conversations avec thread_id
- 🛡️ **CORS configuré** : Prêt pour le développement et la production

### Agents disponibles
- 🎨 **Design Agent** : Création de maquettes web avec HTML/CSS automatique

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** (v18+)
- **npm** ou **yarn**
- **LM Studio** ou **OpenAI API** (pour les modèles IA)

### Méthode 1 : Script automatique (Recommandé)
```bash
./start.sh
```

### Méthode 2 : Démarrage manuel
```bash
# 1. Installer les dépendances
npm install
cd ui && npm install && cd ..

# 2. Démarrer le backend (Terminal 1)
cd serveur
npm run start

# 3. Démarrer le frontend (Terminal 2)
cd ui
npm run dev
```

### Accès à l'application
- 🌐 **Interface Web** : http://localhost:5173
- 🔧 **API Backend** : http://localhost:8080
- 🏥 **Health Check** : http://localhost:8080/health

## 📋 Guide d'utilisation

### 1. Sélection d'un agent
- Utilisez le sélecteur en haut de la page
- Ou cliquez sur une carte d'agent sur l'écran d'accueil

### 2. Conversation
- Tapez votre message dans la zone de texte
- **Entrée** : Envoyer le message
- **Maj + Entrée** : Nouvelle ligne
- Les réponses s'affichent en temps réel avec animation

### 3. Fonctionnalités avancées
- **🔄 Nouvelle conversation** : Réinitialise le contexte
- **🐛 Mode Debug** : Affiche les détails techniques des appels
- **⏳ Indicateur de frappe** : Animation pendant la génération

## 🛠️ Configuration

### Backend (`serveur/server.mts`)
```typescript
const PORT = process.env.PORT || 8080;
const API_BASE_URL = "http://localhost:8080";
```

### Frontend (`ui/src/App.vue`)
```typescript
const API_BASE_URL = 'http://localhost:8080'
```

### Proxy Vite (`ui/vite.config.js`)
Les appels API sont automatiquement redirigés vers le backend :
- `/agents` → `http://localhost:8080/agents`
- `/health` → `http://localhost:8080/health`
- `/{agentId}/stream` → `http://localhost:8080/{agentId}/stream`

## 🤖 Gestion des agents

### Ajouter un nouvel agent

1. **Créer l'agent** dans `Agents/`
```typescript
// Agents/mon-agent/mon-agent.mts
export const monAgent = createReactAgent({
  prompt: monPrompt,
  llm: agentModel,
  tools: [mesOutils],
  checkpointSaver: agentCheckpointer,
});
```

2. **Enregistrer dans le registre** (`serveur/agents-registry.mts`)
```typescript
import { monAgent } from '../Agents/mon-agent/mon-agent.mts';

export const AGENTS_REGISTRY: Record<string, AgentInfo> = {
  // ... autres agents
  monAgent: {
    id: 'mon-agent',
    name: 'Mon Agent',
    description: 'Description de mon agent',
    agent: monAgent
  }
};
```

3. L'agent apparaîtra automatiquement dans l'interface !

## 🔧 Scripts disponibles

### Projet principal
```bash
npm run start        # Démarrer le backend
npm run dev          # Mode développement
npm run build        # Build de production
```

### Interface Vue.js (`ui/`)
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production  
npm run preview      # Aperçu du build
```

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier si le port 8080 est libre
lsof -i :8080

# Vérifier les dépendances
npm install
```

### L'interface ne se connecte pas
- Vérifier que le backend est démarré sur le port 8080
- Ouvrir les outils de développement (F12) pour voir les erreurs
- Activer le mode Debug dans l'interface

### Les agents ne se chargent pas
- Vérifier que LM Studio est démarré (si vous l'utilisez)
- Vérifier la configuration des modèles dans les agents
- Consulter les logs du serveur

## 📱 Migration CLI → Web

Votre ancienne interface CLI dans `CLI/cli.mts` reste fonctionnelle, mais la nouvelle interface web offre :

| Fonctionnalité | CLI | Interface Web |
|----------------|-----|---------------|
| Sélection d'agent | Menu textuel | Interface graphique |
| Streaming | Terminal | Animation temps réel |
| Debug | Logs texte | Panel dédié |
| Multi-plateforme | Terminal seulement | Navigateur |
| Partage | ❌ | URL partageable |

## 🎨 Personnalisation

### Thème de l'interface
Le design utilise un dégradé moderne et du glassmorphisme. Pour personnaliser :

```css
/* ui/src/App.vue */
#app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Couleurs des messages
```css
.message.user .message-content {
  background: #007bff; /* Bleu pour l'utilisateur */
}

.message-content {
  background: #f0f0f0; /* Gris pour l'agent */
}
```

## 🚀 Déploiement

### Développement
Le projet est configuré pour le développement local avec hot-reload.

### Production
```bash
# Build du frontend
cd ui && npm run build

# Le frontend buildé sera dans ui/dist/
# Servir les fichiers statiques avec votre serveur web préféré
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'Ajout de ma feature'`)
4. Push vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Bon développement ! 🚀** 