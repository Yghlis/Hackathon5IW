<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">🤖 Agent Chat Interface</h1>
      <div class="agent-selector">
        <label for="agent-select">Agent actuel :</label>
        <select id="agent-select" v-model="selectedAgent" @change="resetConversation">
          <option value="">Sélectionner un agent...</option>
          <option v-for="agent in availableAgents" :key="agent.id" :value="agent.id">
            {{ agent.name }} - {{ agent.description }}
          </option>
        </select>
      </div>
    </header>

    <main class="chat-container">
      <div v-if="!selectedAgent" class="welcome-screen">
        <h2>Bienvenue dans l'interface des agents IA</h2>
        <p>Sélectionnez un agent ci-dessus pour commencer une conversation.</p>
        <div class="agents-list">
          <div v-for="agent in availableAgents" :key="agent.id" class="agent-card" @click="selectAgent(agent.id)">
            <h3>{{ agent.name }}</h3>
            <p>{{ agent.description }}</p>
          </div>
        </div>
      </div>

      <div v-else class="chat-area">
        <div class="messages-container" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="message-content">
              <strong v-if="message.type === 'user'">Vous :</strong>
              <strong v-else-if="message.type === 'ai'">{{ getCurrentAgentName() }} :</strong>
              <strong v-else-if="message.type === 'questions'">{{ getCurrentAgentName() }} :</strong>
              <!-- Pas de label pour need_info, juste le composant -->
              
              <div v-if="message.type !== 'questions' && message.type !== 'need_info'" class="message-text" v-html="formatMessage(message.content)"></div>
              
              <!-- Affichage des questions structurées -->
              <div v-if="message.type === 'questions'" class="questions-message">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <QuestionsForm
                  v-if="message.questionsData"
                  :formData="message.questionsData"
                  :debugMode="debugMode"
                  @submit="handleQuestionsSubmit"
                  @cancel="handleQuestionsCancel"
                />
              </div>

              <!-- Affichage des composants prédéfinis -->
              <div v-else-if="message.type === 'need_info'" class="components-message">
                <!-- Pas de texte, juste le composant -->
                <PredefinedComponentsForm
                  v-if="message.componentCall"
                  :componentCall="message.componentCall"
                  :showDebug="debugMode"
                  @submit="handleComponentsSubmit"
                />
              </div>
              
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
          <div v-if="isLoading" class="message ai loading">
            <div class="message-content">
              <strong>{{ getCurrentAgentName() }} :</strong>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <div class="input-container">
            <textarea 
              v-model="userInput" 
              @keydown.enter.prevent="sendMessage"
              @keydown.shift.enter="newLine"
              placeholder="Tapez votre message... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
              rows="1"
              ref="textareaRef"
            ></textarea>
            <button @click="sendMessage" :disabled="!userInput.trim() || isLoading" class="send-button">
              <span v-if="!isLoading">📤</span>
              <span v-else class="spinner"></span>
            </button>
          </div>
          <div class="controls">
            <button @click="resetConversation" class="control-button">🔄 Nouvelle conversation</button>
            <button @click="toggleDebug" class="control-button" :class="{ active: debugMode }">
              🐛 Debug {{ debugMode ? 'ON' : 'OFF' }}
            </button>
            <button @click="showTestQuestions" class="control-button test-button">
              🧪 Test Questions
            </button>
            <button @click="showTestComponents" class="control-button test-button">
              🎨 Test Composants
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="debugMode && debugInfo" class="debug-panel">
      <h3>Debug Info</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import QuestionsForm from './components/QuestionsForm.vue'
import PredefinedComponentsForm from './components/predefined/PredefinedComponentsForm.vue'
import type { StructuredResponse, QuestionAnswers } from './types/questions'
import type { ComponentCall, ComponentAnswers } from './types/predefinedComponents'
import { exampleQuestionsResponse } from './examples/questionsExample'

// Types
interface Agent {
  id: string
  name: string
  description: string
}

interface Message {
  type: 'user' | 'ai' | 'questions' | 'need_info'
  content: string
  timestamp: Date
  questionsData?: StructuredResponse
  componentCall?: ComponentCall
}

// État réactif
const selectedAgent = ref<string>('')
const availableAgents = ref<Agent[]>([])
const messages = ref<Message[]>([])
const userInput = ref<string>('')
const isLoading = ref<boolean>(false)
const debugMode = ref<boolean>(false)
const debugInfo = ref<string>('')
const conversationId = ref<string>('')
const messagesContainer = ref<HTMLElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const showQuestionsForm = ref<boolean>(false)
const currentQuestionsData = ref<StructuredResponse | null>(null)

// Configuration API
const API_BASE_URL = 'http://localhost:8080'

// Fonctions utilitaires
function generateConversationId(): string {
  return `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function formatTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function formatMessage(content: string): string {
  // Conversion basique markdown vers HTML
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

function getCurrentAgentName(): string {
  const agent = availableAgents.value.find(a => a.id === selectedAgent.value)
  return agent?.name || 'Agent'
}

function selectAgent(agentId: string): void {
  selectedAgent.value = agentId
  resetConversation()
}

function resetConversation(): void {
  messages.value = []
  conversationId.value = generateConversationId()
  if (debugMode.value) {
    debugInfo.value = `Nouvelle conversation créée: ${conversationId.value}`
  }
}

function toggleDebug(): void {
  debugMode.value = !debugMode.value
  if (!debugMode.value) {
    debugInfo.value = ''
  }
}

function showTestQuestions(): void {
  // Ajouter un message avec des questions de test
  messages.value.push({
    type: 'questions',
    content: 'Voici un exemple de questions structurées pour tester l\'interface :',
    timestamp: new Date(),
    questionsData: exampleQuestionsResponse
  })
  scrollToBottom()
}

function showTestComponents(): void {
  // Ajouter un message avec le composant unifié
  const testComponentCall: ComponentCall = {
    type: 'need_info',
    message: 'Pour vous aider à créer le site parfait, j\'ai besoin de quelques informations :',
    components: ['project-details'],
    submitText: '🚀 Créer mon site web'
  }
  
  messages.value.push({
    type: 'need_info',
    content: testComponentCall.message || 'Informations nécessaires',
    timestamp: new Date(),
    componentCall: testComponentCall
  })
  scrollToBottom()
}

function newLine(): void {
  userInput.value += '\n'
}

// Gestion des questions structurées
function handleQuestionsSubmit(answers: QuestionAnswers): void {
  // Ajouter un message avec les réponses de l'utilisateur
  const answersText = Object.entries(answers)
    .map(([key, value]) => `**${key}:** ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n')

  messages.value.push({
    type: 'user',
    content: `Réponses aux questions :\n${answersText}`,
    timestamp: new Date()
  })

  // Envoyer les réponses à l'agent
  sendAnswersToAgent(answers)
}

// Gestion des composants prédéfinis
function handleComponentsSubmit(answers: ComponentAnswers): void {
  // Créer un message avec les réponses formatées
  const answersText = Object.entries(answers)
    .map(([componentId, value]) => {
      // Mapper les IDs vers des labels lisibles
      const labels: { [key: string]: string } = {
        'color-picker': 'Couleur principale',
        'site-type': 'Type de site',
        'page-count': 'Nombre de pages',
        'design-style': 'Style de design',
        'budget-range': 'Budget estimé',
        'project-details': 'Détails du projet'
      }
      const label = labels[componentId] || componentId
      return `**${label}:** ${value}`
    })
    .join('\n')

  messages.value.push({
    type: 'user',
    content: `Informations fournies :\n${answersText}`,
    timestamp: new Date()
  })

  // Envoyer les réponses à l'agent
  sendComponentAnswersToAgent(answers)
}

function handleQuestionsCancel(): void {
  // Réinitialiser le chat ou annuler l'action
  console.log('Questions annulées')
}

async function sendAnswersToAgent(answers: QuestionAnswers): Promise<void> {
  if (!selectedAgent.value || isLoading.value) return

  isLoading.value = true
  
  if (debugMode.value) {
    debugInfo.value = `Envoi des réponses vers agent ${selectedAgent.value}: ${JSON.stringify(answers)}`
  }

  scrollToBottom()

  try {
    // Formater les réponses pour l'agent
    const answersMessage = `Voici mes réponses aux questions :\n${Object.entries(answers)
      .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n')}\n\nVeuillez maintenant générer le design avec ces informations.`

    // Appel à l'API streaming
    const response = await fetch(`${API_BASE_URL}/${selectedAgent.value}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: answersMessage,
        thread_id: conversationId.value,
        conversation_id: conversationId.value,
        chat_id: conversationId.value,
        context: { answers } // Inclure les réponses dans le contexte
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    // Traitement du stream (même logique que sendMessage)
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Impossible de lire le stream')
    }

    const aiMessageIndex = messages.value.push({
      type: 'ai',
      content: '',
      timestamp: new Date()
    }) - 1

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue

        let eventType: string | null = null
        let dataContent: any = null

        for (const subline of line.split('\n')) {
          if (subline.startsWith('event: ')) {
            eventType = subline.substring(7).trim()
          } else if (subline.startsWith('data: ')) {
            try {
              dataContent = JSON.parse(subline.substring(6))
            } catch {
              dataContent = subline.substring(6)
            }
          }
        }

        if (eventType === 'stream_token' && dataContent?.token) {
          messages.value[aiMessageIndex].content += dataContent.token
          scrollToBottom()
        } else if (eventType === 'stream_end') {
          break
        }
      }
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi des réponses:', error)
    messages.value.push({
      type: 'ai',
      content: `❌ Erreur: ${error}`,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Fonction pour envoyer les réponses des composants prédéfinis à l'agent
async function sendComponentAnswersToAgent(answers: ComponentAnswers): Promise<void> {
  if (!selectedAgent.value || isLoading.value) return

  isLoading.value = true
  
  if (debugMode.value) {
    debugInfo.value = `Envoi des réponses des composants vers agent ${selectedAgent.value}: ${JSON.stringify(answers)}`
  }

  scrollToBottom()

  try {
    // Formater les réponses pour l'agent avec des labels explicites
    const labels: { [key: string]: string } = {
      'color-picker': 'Couleur principale',
      'site-type': 'Type de site',
      'page-count': 'Nombre de pages',
      'design-style': 'Style de design',
      'budget-range': 'Budget estimé',
      'project-details': 'Détails du projet'
    }

    const answersMessage = `Voici mes préférences pour le design :\n${Object.entries(answers)
      .map(([componentId, value]) => {
        const label = labels[componentId] || componentId
        return `- ${label}: ${value}`
      })
      .join('\n')}\n\nVeuillez maintenant générer le design détaillé avec ces informations.`

    // Appel à l'API streaming
    const response = await fetch(`${API_BASE_URL}/${selectedAgent.value}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: answersMessage,
        thread_id: conversationId.value,
        conversation_id: conversationId.value,
        chat_id: conversationId.value,
        context: { componentAnswers: answers } // Inclure les réponses dans le contexte
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    // Traitement du stream (même logique que sendMessage)
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Impossible de lire le stream')
    }

    const aiMessageIndex = messages.value.push({
      type: 'ai',
      content: '',
      timestamp: new Date()
    }) - 1

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue

        let eventType: string | null = null
        let dataContent: any = null

        for (const subline of line.split('\n')) {
          if (subline.startsWith('event: ')) {
            eventType = subline.substring(7).trim()
          } else if (subline.startsWith('data: ')) {
            try {
              dataContent = JSON.parse(subline.substring(6))
            } catch {
              dataContent = subline.substring(6)
            }
          }
        }

        if (eventType === 'stream_token' && dataContent?.token) {
          messages.value[aiMessageIndex].content += dataContent.token
          scrollToBottom()
        } else if (eventType === 'stream_end') {
          break
        }
      }
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi des réponses des composants:', error)
    messages.value.push({
      type: 'ai',
      content: `❌ Erreur: ${error}`,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Fonction pour parser les réponses de l'agent et détecter les questions
function tryParseQuestionsResponse(content: string): StructuredResponse | null {
  try {
    // Rechercher une structure JSON dans la réponse
    const jsonMatch = content.match(/\{[\s\S]*"type":\s*"questions"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as StructuredResponse
    }
  } catch (error) {
    console.log('Pas de questions structurées détectées')
  }
  return null
}

// Fonction pour détecter automatiquement si l'agent demande des informations
function detectInfoRequest(content: string): ComponentCall | null {
  const text = content.toLowerCase()
  
  // Mots-clés qui indiquent une demande d'informations
  const infoKeywords = [
    'informations', 'information', 'détails', 'précisions', 'spécifications',
    'nom du projet', 'nom de votre projet', 'quel nom', 'comment appeler',
    'description', 'décrire', 'que fait', 'activité', 'secteur',
    'couleur', 'couleurs', 'palette', 'thème coloré',
    'style', 'design', 'apparence', 'look',
    'pages', 'nombre de pages', 'combien de pages',
    'budget', 'prix', 'coût'
  ]
  
  // Phrases qui indiquent clairement une demande
  const requestPhrases = [
    'j\'ai besoin', 'je besoin', 'besoin de', 'nécessaire',
    'pouvez-vous me dire', 'pouvez vous me dire', 'dites-moi',
    'quel est', 'quelle est', 'quels sont', 'quelles sont',
    'plus d\'informations', 'plus d\'info', 'davantage',
    'quelques informations supplémentaires', 'informations supplémentaires',
    'pour générer', 'pour créer', 'pour mieux répondre',
    'si vous avez des spécifications'
  ]
  
  // Vérifier si le texte contient des mots-clés de demande d'infos
  const hasInfoKeywords = infoKeywords.some(keyword => text.includes(keyword))
  const hasRequestPhrases = requestPhrases.some(phrase => text.includes(phrase))
  
  if (hasInfoKeywords || hasRequestPhrases) {
    // Déterminer le composant approprié selon le contexte - LOGIQUE PROGRESSIVE
    let components = ['project-name'] // Commencer TOUJOURS par le nom
    let message = 'Quel nom voulez-vous donner à votre site web ?'
    let submitText = '📝 Continuer'
    
    // Analyse spécifique : si l'agent mentionne plusieurs choses, commencer par la première étape
    if (text.includes('nom') && text.includes('description') && text.includes('couleur')) {
      // L'agent demande tout → on commence par le nom seulement
      components = ['project-name']
    } else if (text.includes('nom') && !text.includes('description') && !text.includes('couleur')) {
      components = ['project-name']
   
    } else if (text.includes('description') && !text.includes('nom')) {
      components = ['project-description']
      message = 'Décrivez-moi votre projet :'
      submitText = '💬 Continuer'
    } else if (text.includes('couleur') && !text.includes('nom') && !text.includes('description')) {
      components = ['color-picker']
      message = 'Quelle est votre couleur principale ?'
      submitText = '🎨 Continuer'
    } else if (text.includes('style') && !text.includes('nom') && !text.includes('description')) {
      components = ['design-style']
      message = 'Quel style de design préférez-vous ?'
      submitText = '✨ Continuer'
    } else if (text.includes('pages') && !text.includes('nom') && !text.includes('description')) {
      components = ['page-count']
      message = 'Combien de pages pour votre site ?'
      submitText = '📄 Continuer'
    }
    
    console.log('🎯 Détection automatique de demande d\'infos:', { hasInfoKeywords, hasRequestPhrases, components })
    
    return {
      type: 'need_info',
      message: message,
      components: components,
      submitText: submitText
    }
  }
  
  return null
}

// Fonction pour parser les appels de composants prédéfinis
function tryParseComponentCall(content: string): ComponentCall | null {
  try {
    // Rechercher une structure JSON avec type "need_info"
    const jsonMatch = content.match(/\{[\s\S]*"type":\s*"need_info"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ComponentCall
    }
  } catch (error) {
    console.log('Pas de composants prédéfinis détectés')
  }
  return null
}

// Fonctions d'auto-resize pour textarea
function autoResize(): void {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
  })
}

function scrollToBottom(): void {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Chargement des agents disponibles
async function loadAgents(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`)
    if (response.ok) {
      availableAgents.value = await response.json()
      console.log('Agents chargés:', availableAgents.value)
    } else {
      console.error('Erreur lors du chargement des agents:', response.status)
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}

// Envoi de message
async function sendMessage(): Promise<void> {
  const message = userInput.value.trim()
  if (!message || !selectedAgent.value || isLoading.value) return

  // Ajouter le message utilisateur
  messages.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })

  userInput.value = ''
  isLoading.value = true
  
  if (debugMode.value) {
    debugInfo.value = `Envoi vers agent ${selectedAgent.value}: ${message}`
  }

  scrollToBottom()

  try {
    // Appel à l'API streaming
    const response = await fetch(`${API_BASE_URL}/${selectedAgent.value}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        thread_id: conversationId.value,
        conversation_id: conversationId.value,
        chat_id: conversationId.value
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    // Traitement du stream
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Impossible de lire le stream')
    }

    // Ajouter un message AI vide pour le streaming
    const aiMessageIndex = messages.value.push({
      type: 'ai',
      content: '',
      timestamp: new Date()
    }) - 1

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue

        let eventType: string | null = null
        let dataContent: any = null

        for (const subline of line.split('\n')) {
          if (subline.startsWith('event: ')) {
            eventType = subline.substring(7).trim()
          } else if (subline.startsWith('data: ')) {
            try {
              dataContent = JSON.parse(subline.substring(6))
            } catch {
              dataContent = subline.substring(6)
            }
          }
        }

        if (eventType === 'stream_token' && dataContent?.token) {
          messages.value[aiMessageIndex].content += dataContent.token
          scrollToBottom()
        } else if (eventType === 'stream_end') {
          break
        }
      }
    }

    // Après la fin du stream, vérifier s'il y a des composants à afficher
    const finalContent = messages.value[aiMessageIndex].content
    let componentCall = tryParseComponentCall(finalContent)
    
    // Si pas de JSON détecté, analyser le texte pour détecter une demande d'infos
    if (!componentCall) {
      componentCall = detectInfoRequest(finalContent)
    }
    
    if (componentCall) {
      // REMPLACER le message AI par le composant au lieu d'ajouter
      messages.value[aiMessageIndex] = {
        type: 'need_info',
        content: '', // Pas de contenu texte, juste le composant
        timestamp: new Date(),
        componentCall: componentCall
      }
      scrollToBottom()
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    messages.value.push({
      type: 'ai',
      content: `❌ Erreur: ${error}`,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Watchers
watch(userInput, autoResize)

// Lifecycle
onMounted(() => {
  loadAgents()
  conversationId.value = generateConversationId()
})
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-title {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.agent-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.agent-selector label {
  font-weight: 500;
  color: #333;
}

.agent-selector select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  min-width: 300px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 2rem;
}

.welcome-screen h2 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.agents-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  max-width: 800px;
}

.agent-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agent-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.agent-card h3 {
  margin: 0 0 0.5rem 0;
  color: white;
}

.agent-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  margin: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-content {
  background: #f0f0f0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.message.user .message-content {
  background: #007bff;
  color: white;
}

.message.ai .message-content {
  background: #28a745;
  color: white;
}

.message.questions .message-content {
  background: #17a2b8;
  color: white;
}

.message-text {
  margin: 0.25rem 0;
  line-height: 1.4;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.6;
  display: block;
  margin-top: 0.25rem;
}

.loading .message-content {
  background: #d4edda;
  color: #155724;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0.25rem 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.input-area {
  border-top: 1px solid #eee;
  padding: 1rem;
  background: white;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.input-container textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.4;
  min-height: 42px;
  max-height: 120px;
  overflow-y: auto;
}

.input-container textarea:focus {
  outline: none;
  border-color: #007bff;
}

.send-button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.2rem;
}

.send-button:hover:not(:disabled) {
  background: #0056b3;
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.controls {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.control-button {
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.control-button:hover {
  background: #f0f0f0;
}

.control-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.test-button {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.test-button:hover {
  background: #218838;
  border-color: #1e7e34;
}

.debug-panel {
  background: #1e1e1e;
  color: #f0f0f0;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
}

.debug-panel h3 {
  margin: 0 0 0.5rem 0;
  color: #4CAF50;
}

.debug-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.questions-message {
  width: 100%;
}

.questions-message .message-text {
  margin-bottom: 1rem;
}

.components-message {
  width: 100%;
}

.components-message .message-text {
  margin-bottom: 1rem;
}

.message.need_info .message-content {
  background: #6f42c1;
  color: white;
  max-width: none;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
  }

  .agent-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .agent-selector select {
    min-width: auto;
  }

  .chat-area {
    margin: 0.5rem;
  }

  .message {
    max-width: 95%;
  }

  .agents-list {
    grid-template-columns: 1fr;
  }
}
</style>
