# 🎨 Interface Web pour MyGES Agent

Une interface web moderne et élégante pour interagir avec l'agent MyGES via Server-Sent Events (SSE) en temps réel.

## ✨ Fonctionnalités

- 💬 **Chat en temps réel** avec streaming SSE
- 🌤️ **Agent météo intelligent** avec beaucoup d'émojis
- 🎯 **Suggestions rapides** pour démarrer la conversation
- 📱 **Design responsive** qui s'adapte à tous les écrans
- ⚡ **Interface moderne** inspirée des meilleures pratiques UX
- 🔄 **Conversations persistantes** avec thread ID
- 🐛 **Mode debug** pour le développement

## 🚀 Démarrage rapide

### Prérequis
- Node.js v20+ (recommandé v22+)
- Le serveur backend doit être en cours d'exécution sur le port 8080

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

L'interface sera accessible sur `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement (backend)
Assurez-vous que le fichier `.env` à la racine contient :
```env
OPENAI_API_KEY=votre-clé-openai
PORT=8080
REQUIRE_AUTH=false
BEARER=demo-token
```

### Configuration API
L'interface est configurée pour communiquer avec :
- **Backend** : `http://localhost:8080`
- **Agent ID** : `myges`
- **Auth Token** : `demo-token`

## 🎨 Interface utilisateur

### Page d'accueil
- Titre "MyGES Agent" avec boutons de contrôle
- Message d'accueil "Bonjour, comment puis-je vous aider ?"
- Suggestions de démarrage rapide :
  - Créer un site vitrine
  - Boutique en ligne
  - Portfolio professionnel

### Chat
- Messages utilisateur (bleu, alignés à droite)
- Réponses agent (blanc, alignées à gauche)
- Indicateur de frappe animé
- Horodatage des messages
- Auto-scroll vers les nouveaux messages

### Zone de saisie
- Textarea auto-redimensionnable
- Bouton d'envoi avec icône
- Support Entrée pour envoyer (Maj+Entrée pour nouvelle ligne)
- États désactivés pendant le chargement

## 🛠️ Technologies utilisées

- **Vue 3** avec Composition API
- **TypeScript** pour la sécurité des types
- **Vite** pour le build et le dev server
- **CSS moderne** avec variables CSS et animations
- **Server-Sent Events (SSE)** pour le streaming temps réel
- **Fetch API** pour les requêtes HTTP

## 📁 Structure des fichiers

```
frontend/
├── src/
│   ├── components/
│   │   └── ChatInterface.vue    # Interface principale de chat
│   ├── App.vue                  # App principale
│   └── main.ts                  # Point d'entrée
├── public/                      # Assets statiques
├── package.json                 # Dépendances et scripts
└── vite.config.ts              # Configuration Vite
```

## 🎯 Fonctionnalités détaillées

### Streaming en temps réel
- Connexion SSE avec le backend
- Affichage des tokens en temps réel
- Gestion des événements `stream_start`, `stream_token`, `stream_end`
- Reconnexion automatique en cas d'erreur

### Gestion des conversations
- Thread ID persistant pour maintenir le contexte
- Bouton "Nouvelle conversation" pour reset
- Stockage local des messages (en mémoire)

### UX/UI
- Design inspiré des meilleures interfaces de chat modernes
- Animations fluides et transitions
- États de chargement et feedback visuel
- Responsive design pour mobile et desktop

## 🚀 Commandes utiles

```bash
# Démarrer uniquement le frontend
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Tests (si configurés)
npm run test
```

## 🐛 Debug

Utilisez le bouton "Debug" dans l'interface pour voir :
- Liste des messages en console
- Thread ID actuel
- État de connexion SSE

## 📝 Notes de développement

- L'interface utilise Server-Sent Events (SSE) pour le streaming
- Les messages sont formatés pour préserver les emojis et les retours à la ligne
- Le design est entièrement responsive
- Toutes les animations sont optimisées pour les performances
