#!/usr/bin/env node

import { HumanMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getAgent, getAgentsMetadata } from './agents-registry.mts';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface AgentConfig {
  id: string;
  name: string;
  description: string;
}

interface UserInput {
  message?: string;  // Support ancien format
  input?: string;    // Support nouveau format
  thread_id?: string;
  conversation_id?: string;
  chat_id?: string;
  context?: any;
  details?: any;
}

interface AgentResponse {
  content: string;
  thread_id: string;
  run_id: string;
}

interface ChatMessage {
  type: 'human' | 'ai' | 'tool';
  content: string;
  timestamp: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

interface ConversationState {
  thread_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// Configuration
const API_VERSION = "1.0.0";
const API_TITLE = "Agent CLI Server";
const API_DESCRIPTION = "Serveur Express.js pour le CLI des agents IA";
const PORT = process.env.PORT || 8080;

// In-memory storage (replace with real database in production)
const conversations: Map<string, ConversationState> = new Map();
const activeGenerations: Map<string, boolean> = new Map();

// Load agents configuration - utilise maintenant le registre d'agents
async function loadAgentsConfig(): Promise<AgentConfig[]> {
  try {
    // Récupération des métadonnées depuis le registre
    const agents = getAgentsMetadata();
    console.log(`✅ ${agents.length} agent(s) chargé(s) depuis le registre:`, agents.map(a => a.id).join(', '));
    return agents;
  } catch (error) {
    console.warn('⚠️ Erreur lors du chargement des agents depuis le registre:', error);
    return [];
  }
}

// Middleware d'authentification
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token && process.env.REQUIRE_AUTH !== 'false') {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  // Store token in request for later use
  (req as any).token = token;
  next();
}

// Middleware de gestion des erreurs
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message,
    path: req.path
  });
}

// Utilitaires pour les conversations
function getOrCreateConversation(threadId: string): ConversationState {
  if (!conversations.has(threadId)) {
    const now = new Date().toISOString();
    conversations.set(threadId, {
      thread_id: threadId,
      messages: [],
      created_at: now,
      updated_at: now
    });
  }
  return conversations.get(threadId)!;
}

function addMessageToConversation(threadId: string, message: ChatMessage) {
  const conversation = getOrCreateConversation(threadId);
  conversation.messages.push(message);
  conversation.updated_at = new Date().toISOString();
}

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.text());

// Routes
app.get('/health', async (req: Request, res: Response) => {
  try {
    const agents = await loadAgentsConfig();
    res.json({
      status: 'ok',
      version: API_VERSION,
      title: API_TITLE,
      description: API_DESCRIPTION,
      timestamp: new Date().toISOString(),
      agents_count: agents.length,
      available_agents: agents.map(a => a.id),
      components: {
        api: 'healthy',
        agents: 'healthy',
        database: 'healthy' // Simulé
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la vérification de santé'
    });
  }
});

app.get('/agents', authenticateToken, async (req: Request, res: Response) => {
  try {
    const agents = await loadAgentsConfig();
    res.json(agents);
  } catch (error) {
    console.error('Erreur lors du chargement des agents:', error);
    res.status(500).json({
      error: 'Erreur lors du chargement des agents',
      message: (error as Error).message
    });
  }
});

app.post('/:agentId/invoke', authenticateToken, async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const userInput: UserInput = req.body;
  
  try {
    // Support pour les deux formats: {message: ""} et {input: ""}
    const messageContent = (userInput as any).input || userInput.message;
    
    if (!messageContent) {
      return res.status(400).json({
        error: 'Message manquant',
        message: 'Le champ "message" ou "input" est requis'
      });
    }
    
    console.log(`🤖 Invocation de l'agent ${agentId} pour le thread ${userInput.thread_id || 'nouveau'}`);
    console.log(`📝 Message reçu: ${messageContent}`);
    
    const threadId = userInput.thread_id || uuidv4();
    const runId = uuidv4();
    
    // Récupérer l'agent depuis le registre
    const agent = getAgent(agentId);

    // Ajouter le message utilisateur à la conversation
    addMessageToConversation(threadId, {
      type: 'human',
      content: messageContent,
      timestamp: new Date().toISOString()
    });

    // Configuration pour l'agent
    const config: RunnableConfig = {
      configurable: { thread_id: threadId },
      runId: runId
    };

    // Invoquer l'agent avec le message
    const input = { messages: [new HumanMessage({ content: messageContent })] };
    const result = await agent.invoke(input, config);

    // Extraire la réponse
    const lastMessage = result.messages[result.messages.length - 1];
    const responseContent = lastMessage?.content || 'Aucune réponse';

    // Ajouter la réponse de l'agent à la conversation
    addMessageToConversation(threadId, {
      type: 'ai',
      content: responseContent.toString(),
      timestamp: new Date().toISOString()
    });

    const agentResponse: AgentResponse = {
      content: responseContent.toString(),
      thread_id: threadId,
      run_id: runId
    };

    res.json(agentResponse);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'invocation:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'invocation de l\'agent',
      message: (error as Error).message
    });
  }
});

app.post('/:agentId/stream', authenticateToken, async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const userInput: UserInput = req.body;
  
  try {
    // Support pour les deux formats: {message: ""} et {input: ""}
    const messageContent = (userInput as any).input || userInput.message;
    
    if (!messageContent) {
      return res.status(400).json({
        error: 'Message manquant',
        message: 'Le champ "message" ou "input" est requis'
      });
    }
    
    console.log(`🌊 Streaming avec l'agent ${agentId} pour le thread ${userInput.thread_id || 'nouveau'}`);
    console.log(`📝 Message reçu: ${messageContent}`);
    
    const threadId = userInput.thread_id || uuidv4();
    const runId = uuidv4();
    
    // Récupérer l'agent depuis le registre
    const agent = getAgent(agentId);

    // Configuration SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    // Marquer la génération comme active
    activeGenerations.set(threadId, true);

    // Fonction pour envoyer des événements SSE
    const sendSSE = (event: string, data?: any) => {
      res.write(`event: ${event}\n`);
      if (data !== undefined) {
        res.write(`data: ${JSON.stringify(data)}\n`);
      }
      res.write('\n');
    };

    // Ajouter le message utilisateur à la conversation
    addMessageToConversation(threadId, {
      type: 'human',
      content: messageContent,
      timestamp: new Date().toISOString()
    });

    // Commencer le streaming
    sendSSE('stream_start');

    try {
      // Configuration pour l'agent
      const config: RunnableConfig = {
        configurable: { thread_id: threadId },
        runId: runId
      };

      const input = { messages: [new HumanMessage({ content: messageContent })] };
      let fullResponse = '';

      try {
        // Utiliser le vrai streaming pour capturer les événements d'outils
        const stream = await agent.stream(input, config);
        
        for await (const chunk of stream) {
          if (!activeGenerations.get(threadId)) {
            break; // Génération arrêtée
          }
          
          console.log('📦 Chunk reçu:', JSON.stringify(chunk, null, 2));
          
          // Traiter les différents nœuds du graphe
          for (const [nodeName, nodeData] of Object.entries(chunk)) {
            if (nodeName === '__start__') continue;
            
            console.log(`🔄 Nœud: ${nodeName}`, nodeData);
            
            // Traiter les messages dans nodeData
            if (nodeData && typeof nodeData === 'object' && 'messages' in nodeData) {
              const messages = (nodeData as any).messages || [];
              
              for (const message of messages) {
                // Détecter les appels d'outils
                if (message.tool_calls && Array.isArray(message.tool_calls)) {
                  for (const toolCall of message.tool_calls) {
                    sendSSE('tool_execution_start', {
                      name: toolCall.name,
                      params: toolCall.args || {},
                      id: toolCall.id
                    });
                  }
                }
                
                // Détecter les résultats d'outils
                if (message.tool_call_id && message.content) {
                  sendSSE('tool_execution_complete', {
                    name: message.name || 'tool',
                    output: message.content,
                    id: message.tool_call_id
                  });
                }
                
                // Messages normaux de l'agent
                if (message.content && !message.tool_call_id && nodeName === 'agent') {
                  const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
                  fullResponse += content;
                  
                  // Envoyer le contenu par petits chunks
                  const chunks = content.match(/.{1,10}/g) || [content];
                  for (const textChunk of chunks) {
                    sendSSE('stream_token', { token: textChunk });
                    await new Promise(resolve => setTimeout(resolve, 20));
                  }
                }
              }
            }
          }
        }
      } catch (streamError) {
        console.error('❌ Erreur pendant le streaming de l\'agent:', streamError);
        sendSSE('tool_execution_error', {
          name: 'agent_stream',
          error: (streamError as Error).message
        });
        fullResponse = `Erreur lors du traitement de votre demande: ${(streamError as Error).message}`;
        sendSSE('stream_token', { token: fullResponse });
      }

      // Ajouter la réponse complète à la conversation
      if (fullResponse) {
        addMessageToConversation(threadId, {
          type: 'ai',
          content: fullResponse,
          timestamp: new Date().toISOString()
        });
      }

      // Terminer le streaming
      sendSSE('stream_end', { thread_id: threadId });
      
    } catch (error) {
      console.error('❌ Erreur pendant le streaming:', error);
      sendSSE('error', (error as Error).message);
    } finally {
      // Nettoyer
      activeGenerations.delete(threadId);
      res.end();
    }

    // Gérer la déconnexion du client
    req.on('close', () => {
      console.log(`🔌 Client déconnecté pour le thread ${threadId}`);
      activeGenerations.set(threadId, false);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du streaming:', error);
    res.status(500).json({
      error: 'Erreur lors du streaming avec l\'agent',
      message: (error as Error).message
    });
  }
});

app.post('/:agentId/stop', authenticateToken, async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const { thread_id } = req.body;
  
  try {
    console.log(`🛑 Arrêt de la génération pour l'agent ${agentId}, thread ${thread_id}`);
    
    if (thread_id && activeGenerations.has(thread_id)) {
      activeGenerations.set(thread_id, false);
      setTimeout(() => activeGenerations.delete(thread_id), 1000); // Nettoyer après 1 seconde
      
      res.json({
        status: 'success',
        message: 'Génération arrêtée avec succès'
      });
    } else {
      res.json({
        status: 'success',
        message: 'Aucune génération active à arrêter'
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'arrêt de la génération',
      message: (error as Error).message
    });
  }
});

// Route pour obtenir l'historique d'une conversation
app.get('/conversations/:threadId', authenticateToken, async (req: Request, res: Response) => {
  const { threadId } = req.params;
  
  try {
    const conversation = conversations.get(threadId);
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation non trouvée',
        message: `Aucune conversation trouvée pour le thread ${threadId}`
      });
    }
    
    res.json(conversation);
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la conversation:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de la conversation',
      message: (error as Error).message
    });
  }
});

// Route pour lister toutes les conversations
app.get('/conversations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const conversationList = Array.from(conversations.values()).map(conv => ({
      thread_id: conv.thread_id,
      message_count: conv.messages.length,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      last_message: conv.messages[conv.messages.length - 1]?.content.slice(0, 100) || 'Aucun message'
    }));
    
    res.json(conversationList);
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des conversations:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des conversations',
      message: (error as Error).message
    });
  }
});

// Route de preview pour les sites générés
app.get('/preview/:projectName', async (req: Request, res: Response) => {
  try {
    const { projectName } = req.params;
    const projectPath = path.join(process.cwd(), 'generated-sites', projectName);
    
    // Vérifier que le projet existe
    const exists = await fs.access(projectPath).then(() => true).catch(() => false);
    if (!exists) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Projet non trouvé</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f5f5f5; }
            .error { background: #fff; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>🚫 Projet non trouvé</h1>
            <p>Le projet "<strong>${projectName}</strong>" n'existe pas.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    // Vérifier que c'est un projet Next.js
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonExists = await fs.access(packageJsonPath).then(() => true).catch(() => false);
    
    if (!packageJsonExists) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Projet invalide</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f5f5f5; }
            .error { background: #fff; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>⚠️ Projet invalide</h1>
            <p>Le projet "<strong>${projectName}</strong>" n'est pas un projet Next.js valide.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    // Lire le package.json pour vérifier Next.js
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    const isNextJS = packageJson.dependencies?.next || packageJson.devDependencies?.next;
    
    if (!isNextJS) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pas un projet Next.js</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f5f5f5; }
            .error { background: #fff; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Pas un projet Next.js</h1>
            <p>Le projet "<strong>${projectName}</strong>" n'utilise pas Next.js.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    // Vérifier si le build existe déjà
    const buildPath = path.join(projectPath, 'out');
    const buildExists = await fs.access(buildPath).then(() => true).catch(() => false);
    
    if (!buildExists) {
      // Page de build en cours
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Construction du site - ${projectName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
              margin: 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center;
            }
            .container { 
              background: rgba(255,255,255,0.1); padding: 3rem; border-radius: 20px; 
              backdrop-filter: blur(10px); max-width: 600px; width: 100%;
            }
            .spinner { 
              width: 50px; height: 50px; margin: 0 auto 2rem; 
              border: 3px solid rgba(255,255,255,0.3); 
              border-top: 3px solid white; border-radius: 50%; 
              animation: spin 1s linear infinite; 
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            h1 { margin-bottom: 1rem; font-size: 2rem; }
            p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.9; }
            .steps { text-align: left; background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 10px; }
            .step { margin-bottom: 0.5rem; }
            .step.active { color: #4ade80; font-weight: 600; }
          </style>
          <script>
            let step = 0;
            const steps = ['Installation des dépendances...', 'Compilation du projet...', 'Génération des pages...', 'Finalisation...'];
            
            function updateStep() {
              document.querySelectorAll('.step').forEach((el, i) => {
                el.className = i <= step ? 'step active' : 'step';
              });
              step = (step + 1) % steps.length;
            }
            
            setInterval(updateStep, 2000);
            
            // Recharger la page après 10 secondes
            setTimeout(() => {
              window.location.reload();
            }, 10000);
          </script>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>🏗️ Construction en cours</h1>
            <p>Votre site <strong>${projectName}</strong> est en cours de compilation...</p>
            
            <div class="steps">
              <div class="step">Installation des dépendances...</div>
              <div class="step">Compilation du projet...</div>
              <div class="step">Génération des pages...</div>
              <div class="step">Finalisation...</div>
            </div>
            
            <p style="font-size: 0.9rem; margin-top: 2rem;">
              ⏱️ Cette page se rafraîchira automatiquement dans quelques instants
            </p>
          </div>
        </body>
        </html>
      `);
      
      // Compiler le projet en arrière-plan
      compileNextJSProject(projectPath, projectName);
      return;
    }
    
    // Servir la page d'accueil du site compilé
    const indexPath = path.join(buildPath, 'index.html');
    const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
    
    if (indexExists) {
      const htmlContent = await fs.readFile(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
    } else {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Erreur de build</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f5f5f5; }
            .error { background: #fff; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>🔨 Erreur de compilation</h1>
            <p>Une erreur s'est produite lors de la compilation du projet "<strong>${projectName}</strong>".</p>
            <p><a href="javascript:window.location.reload()">Réessayer</a></p>
          </div>
        </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Erreur route preview:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erreur serveur</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; text-align: center; background: #f5f5f5; }
          .error { background: #fff; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>💥 Erreur serveur</h1>
          <p>Impossible de charger le preview</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Route pour servir les assets statiques des sites compilés
app.get('/preview/:projectName/*', async (req: Request, res: Response) => {
  try {
    const { projectName } = req.params;
    const assetPath = req.params[0]; // Le reste du chemin après /preview/projectName/
    
    const projectPath = path.join(process.cwd(), 'generated-sites', projectName);
    const buildPath = path.join(projectPath, 'out');
    const filePath = path.join(buildPath, assetPath);
    
    // Sécurité : vérifier que le fichier est dans le dossier autorisé
    if (!filePath.startsWith(buildPath)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    // Vérifier que le fichier existe
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!exists) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    // Déterminer le type de contenu
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.webp': 'image/webp'
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    // Lire et servir le fichier
    const fileContent = await fs.readFile(filePath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache 1 heure
    res.send(fileContent);
    
  } catch (error) {
    console.error('Erreur serving asset:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Map pour éviter les builds simultanés
const currentBuilds = new Map<string, Promise<void>>();

// Fonction pour compiler un projet Next.js en arrière-plan
async function compileNextJSProject(projectPath: string, projectName: string): Promise<void> {
  // Éviter les builds simultanés pour le même projet
  if (currentBuilds.has(projectName)) {
    console.log(`⏳ Build déjà en cours pour ${projectName}, attente...`);
    return currentBuilds.get(projectName)!;
  }

  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  // Créer la promesse de build et l'enregistrer
  const buildPromise = (async () => {
    try {
      console.log(`🔨 Compilation du projet ${projectName}...`);
    
    // ÉTAPE 1: Nettoyage complet pour éviter les conflits
    console.log(`🧹 Nettoyage complet pour ${projectName}...`);
    try {
      await execAsync('rm -rf .next out node_modules/.cache', { cwd: projectPath, timeout: 30000 });
    } catch (cleanError) {
      console.log(`⚠️ Nettoyage partiel pour ${projectName}`);
    }
    
    // ÉTAPE 2: Installation des dépendances avec retry
    console.log(`📦 Installation des dépendances pour ${projectName}...`);
    let installSuccess = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await execAsync('npm install --prefer-offline --no-audit', { 
          cwd: projectPath, 
          timeout: 200000 
        });
        installSuccess = true;
        break;
      } catch (installError) {
        console.log(`⚠️ Tentative ${attempt}/2 installation échouée pour ${projectName}`);
        if (attempt === 2) {
          throw installError;
        }
        // Nettoyer node_modules entre les tentatives
        await execAsync('rm -rf node_modules package-lock.json', { cwd: projectPath }).catch(() => {});
      }
    }
    
    if (!installSuccess) {
      throw new Error('Installation des dépendances échouée après 2 tentatives');
    }
    
    // ÉTAPE 3: Compilation avec retry et nettoyage entre tentatives
    console.log(`⚡ Build du projet ${projectName}...`);
    let buildSuccess = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Nettoyer .next avant chaque tentative
        await execAsync('rm -rf .next', { cwd: projectPath }).catch(() => {});
        
        // Lancer la compilation
        await execAsync('npm run build', { 
          cwd: projectPath, 
          timeout: 300000,
          env: { ...process.env, NODE_ENV: 'production' }
        });
        
        // Vérifier que le dossier out existe et contient index.html
        const outPath = path.join(projectPath, 'out');
        const indexPath = path.join(outPath, 'index.html');
        const outExists = await fs.access(outPath).then(() => true).catch(() => false);
        const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
        
        if (outExists && indexExists) {
          buildSuccess = true;
          break;
        } else {
          throw new Error('Build réussi mais fichiers manquants dans out/');
        }
        
      } catch (buildError) {
        console.log(`⚠️ Tentative ${attempt}/3 build échouée pour ${projectName}`);
        console.log(`Erreur: ${buildError.message.substring(0, 200)}`);
        
        if (attempt === 3) {
          // Dernière tentative : build de fallback simple
          try {
            console.log(`🔄 Tentative de build de fallback pour ${projectName}...`);
            await execAsync('rm -rf .next out', { cwd: projectPath }).catch(() => {});
            await execAsync('npx next build', { cwd: projectPath, timeout: 300000 });
            
            const outPath = path.join(projectPath, 'out');
            const indexPath = path.join(outPath, 'index.html');
            const outExists = await fs.access(outPath).then(() => true).catch(() => false);
            const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
            
            if (outExists && indexExists) {
              buildSuccess = true;
              break;
            }
          } catch (fallbackError) {
            console.log(`❌ Build de fallback aussi échoué pour ${projectName}`);
          }
          
          // Si même le fallback échoue, on génère une page d'erreur statique
          console.log(`🆘 Génération d'une page d'erreur pour ${projectName}...`);
          await generateErrorPage(projectPath, projectName, buildError);
          return; // Sortir sans lancer d'erreur
        }
        
        // Attendre un peu entre les tentatives
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (buildSuccess) {
      console.log(`✅ Projet ${projectName} compilé avec succès !`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur compilation ${projectName}:`, error.message);
    // Générer une page d'erreur au lieu de laisser le serveur planter
    await generateErrorPage(projectPath, projectName, error);
  } finally {
    // Nettoyer la Map des builds en cours
    currentBuilds.delete(projectName);
  }
})();

// Enregistrer la promesse et la retourner
currentBuilds.set(projectName, buildPromise);
return buildPromise;
}

// Fonction pour générer une page d'erreur statique quand la compilation échoue
async function generateErrorPage(projectPath: string, projectName: string, error: any) {
  try {
    const outPath = path.join(projectPath, 'out');
    const indexPath = path.join(outPath, 'index.html');
    
    // Créer le dossier out s'il n'existe pas
    await fs.mkdir(outPath, { recursive: true }).catch(() => {});
    
    // Générer une page d'erreur statique
    const errorPage = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erreur de compilation - ${projectName}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
      margin: 0; padding: 2rem; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    }
    .container { 
      background: rgba(255,255,255,0.1); padding: 3rem; border-radius: 20px; 
      backdrop-filter: blur(10px); max-width: 600px; width: 100%;
    }
    h1 { margin-bottom: 1rem; font-size: 2rem; }
    p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.9; }
    .error-code { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; font-family: monospace; font-size: 0.9rem; }
    .retry-btn { 
      background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); 
      padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; cursor: pointer; 
      transition: all 0.3s ease; margin-top: 1rem;
    }
    .retry-btn:hover { background: rgba(255,255,255,0.3); }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔨 Erreur de compilation</h1>
    <p>Le projet <strong>${projectName}</strong> n'a pas pu être compilé correctement.</p>
    
    <div class="error-code">
      <strong>Erreur:</strong> ${error.message ? error.message.substring(0, 200) + '...' : 'Erreur de compilation inconnue'}
    </div>
    
    <p style="font-size: 0.9rem; margin-top: 2rem; opacity: 0.7;">
      💡 Cette erreur sera corrigée automatiquement dans les prochaines versions.
    </p>
    
    <button class="retry-btn" onclick="window.location.reload()">
      🔄 Réessayer
    </button>
  </div>
</body>
</html>`;
    
    await fs.writeFile(indexPath, errorPage, 'utf-8');
    console.log(`🆘 Page d'erreur générée pour ${projectName}`);
    
  } catch (pageError) {
    console.error(`❌ Impossible de générer la page d'erreur pour ${projectName}:`, pageError.message);
  }
}

// Liste des projets générés
app.get('/projects', async (req: Request, res: Response) => {
  try {
    const generatedSitesPath = path.join(process.cwd(), 'generated-sites');
    const exists = await fs.access(generatedSitesPath).then(() => true).catch(() => false);
    
    if (!exists) {
      return res.json({
        projects: [],
        count: 0,
        message: 'Aucun projet généré pour le moment'
      });
    }
    
    const projects = await fs.readdir(generatedSitesPath);
    const projectsInfo = [];
    
    for (const project of projects) {
      const projectPath = path.join(generatedSitesPath, project);
      const stat = await fs.stat(projectPath);
      
      if (stat.isDirectory()) {
        const packageJsonPath = path.join(projectPath, 'package.json');
        let projectInfo: any = {
          name: project,
          path: projectPath,
          created: stat.birthtime,
          framework: 'Unknown'
        };
        
        try {
          const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
          if (packageJson.dependencies?.next) {
            projectInfo.framework = 'Next.js';
            projectInfo.version = packageJson.dependencies.next;
          }
        } catch (error) {
          // Ignore si pas de package.json
        }
        
        projectsInfo.push(projectInfo);
      }
    }
    
    res.json({
      projects: projectsInfo,
      count: projectsInfo.length,
      message: `${projectsInfo.length} projet(s) généré(s)`
    });
    
  } catch (error) {
    console.error('Erreur liste projets:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de lister les projets'
    });
  }
});

// Route pour télécharger un projet en ZIP
app.get('/download/:projectName.zip', async (req: Request, res: Response) => {
  try {
    const { projectName } = req.params;
    const projectPath = path.join(process.cwd(), 'generated-sites', projectName);
    
    // Vérifier que le projet existe
    const exists = await fs.access(projectPath).then(() => true).catch(() => false);
    if (!exists) {
      return res.status(404).json({
        error: 'Projet non trouvé',
        message: `Le projet "${projectName}" n'existe pas`
      });
    }
    
    // Dynamically import archiver
    const archiver = await import('archiver');
    const archive = archiver.default('zip', {
      zlib: { level: 9 } // Compression maximale
    });
    
    // Configuration des headers pour le téléchargement
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${projectName}.zip"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    
    // Gérer les erreurs de l'archive
    archive.on('error', (err) => {
      console.error('Erreur création ZIP:', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Erreur création ZIP',
          message: err.message
        });
      }
    });
    
    // Pipe l'archive vers la réponse
    archive.pipe(res);
    
    // Ajouter tous les fichiers du projet au ZIP
    const addFilesToArchive = async (currentPath: string, zipPath: string) => {
      const items = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);
        const zipEntryPath = path.join(zipPath, item.name);
        
        // Exclure certains dossiers/fichiers inutiles
        if (item.name === 'node_modules' || 
            item.name === '.next' || 
            item.name === '.git' || 
            item.name === '.vercel' ||
            item.name.startsWith('.')) {
          continue;
        }
        
        if (item.isDirectory()) {
          await addFilesToArchive(fullPath, zipEntryPath);
        } else {
          try {
            const fileContent = await fs.readFile(fullPath);
            archive.append(fileContent, { name: zipEntryPath });
          } catch (fileError) {
            console.warn(`Impossible de lire le fichier ${fullPath}:`, fileError.message);
          }
        }
      }
    };
    
    // Ajouter les fichiers au ZIP
    await addFilesToArchive(projectPath, projectName);
    
    // Finaliser l'archive
    await archive.finalize();
    
    console.log(`📦 ZIP créé pour le projet: ${projectName}`);
    
  } catch (error) {
    console.error('Erreur téléchargement ZIP:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Impossible de créer le fichier ZIP'
      });
    }
  }
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Gérer les routes non trouvées
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.path} n'existe pas`,
    available_endpoints: [
      'GET /health',
      'GET /agents',
      'GET /projects',
      'GET /download/:projectName.zip',
      'POST /:agentId/invoke',
      'POST /:agentId/stream',
      'POST /:agentId/stop',
      'GET /conversations',
      'GET /conversations/:threadId',
      'GET /preview/:projectName',
      'GET /preview/:projectName/*'
    ]
  });
});

// Démarrer le serveur
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log('🚀 Serveur Agent CLI démarré !');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🤖 Agents: http://localhost:${PORT}/agents`);
      console.log('');
      console.log('📚 Endpoints disponibles:');
      console.log('  GET  /health                     - Vérification de santé');
      console.log('  GET  /agents                     - Liste des agents');
      console.log('  GET  /projects                   - Liste des projets générés');
      console.log('  GET  /download/:projectName.zip    - Télécharger un projet en ZIP');
      console.log('  POST /:agentId/invoke            - Invocation directe');
      console.log('  POST /:agentId/stream            - Streaming SSE');
      console.log('  POST /:agentId/stop              - Arrêter la génération');
      console.log('  GET  /conversations              - Liste des conversations');
      console.log('  GET  /conversations/:threadId    - Détails d\'une conversation');
      console.log('  GET  /preview/:projectName       - Preview des sites générés');
      console.log('  GET  /preview/:projectName/*     - Assets des sites (CSS, JS, etc.)');
      console.log('');
      console.log('🔑 Variables d\'environnement:');
      console.log(`  PORT=${PORT}`);
      console.log(`  REQUIRE_AUTH=${process.env.REQUIRE_AUTH || 'true'}`);
      console.log('');
      console.log('💡 Pour tester avec le CLI:');
      console.log('  npm run cli check');
      console.log('  npm run cli chat');
      
      // Charger et afficher les agents disponibles
      loadAgentsConfig().then(agents => {
        console.log('');
        console.log('🤖 Agents disponibles:');
        agents.forEach(agent => {
          console.log(`  - ${agent.id}: ${agent.name}`);
          console.log(`    ${agent.description}`);
        });
      });
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gérer l'arrêt propre du serveur
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur si ce fichier est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app; 