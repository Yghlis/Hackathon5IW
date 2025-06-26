<template>
  <div class="chat-container">
    <!-- Header -->
    <header class="chat-header">
      <h1 class="agent-title">WebCraft AI</h1>
      <div class="header-actions">
        <button class="btn-secondary" @click="startNewConversation">
          🔄 Nouvelle conversation
        </button>
        <button class="btn-secondary" @click="toggleDebug">
          🐛 Debug
        </button>
      </div>
    </header>

    <!-- Messages Area -->
    <div class="messages-container" ref="messagesContainer">
      <div class="welcome-section" v-if="messages.length === 0">
        <h2 class="welcome-title">
          Bonjour, comment puis-je vous<br>
          aider ?
        </h2>
        <p class="welcome-subtitle">Décrivez votre projet de site web et je vous guiderai dans sa création complète</p>
        
        <!-- Suggestion buttons -->
        <div class="suggestions">
          <button 
            class="suggestion-btn" 
            @click="sendSuggestion('Je veux créer un site vitrine pour mon restaurant')"
          >
            Site vitrine restaurant
          </button>
          <button 
            class="suggestion-btn" 
            @click="sendSuggestion(`J'ai besoin d'un portfolio professionnel pour mes services`)"
          >
            Portfolio professionnel
          </button>
          <button 
            class="suggestion-btn" 
            @click="sendSuggestion('Je veux créer un site pour ma petite entreprise')"
          >
            Site d'entreprise
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="messages" v-if="messages.length > 0">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          :class="['message', message.type]"
        >
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <!-- Typing indicator -->
        <div v-if="isTyping" class="message ai typing">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="currentMessage"
          @keydown="handleKeydown"
          @input="autoResize"
          ref="messageInput"
          placeholder="Tapez votre message..."
          :disabled="isLoading"
          rows="1"
        ></textarea>
        <button 
          class="send-btn" 
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isLoading"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

// Reactive data
const messages = ref<Message[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const threadId = ref<string | null>(null)
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()

// API Configuration
const API_BASE_URL = 'http://localhost:8080'
const AGENT_ID = 'myges'
const BEARER_TOKEN = 'demo-token'

// Methods
const startNewConversation = () => {
  messages.value = []
  threadId.value = null
  currentMessage.value = ''
}

const toggleDebug = () => {
  console.log('Messages:', messages.value)
  console.log('Thread ID:', threadId.value)
}

const sendSuggestion = (suggestion: string) => {
  currentMessage.value = suggestion
  sendMessage()
}

const formatMessage = (content: string) => {
  // Convert line breaks to <br> and preserve emojis
  return content.replace(/\n/g, '<br>')
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const autoResize = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const addMessage = (type: 'user' | 'ai', content: string) => {
  const message: Message = {
    id: Date.now().toString(),
    type,
    content,
    timestamp: new Date()
  }
  messages.value.push(message)
  scrollToBottom()
  return message
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const userMessage = currentMessage.value.trim()
  currentMessage.value = ''
  
  // Reset textarea height
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
  }

  // Add user message
  addMessage('user', userMessage)
  
  isLoading.value = true
  isTyping.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/${AGENT_ID}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify({
        message: userMessage,
        thread_id: threadId.value
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    let aiMessage = addMessage('ai', '')
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        buffer += chunk

        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.token) {
                aiMessage.content += data.token
                scrollToBottom()
              }
              
              if (data.thread_id && !threadId.value) {
                threadId.value = data.thread_id
              }
            } catch (e) {
              // Ignore JSON parse errors for SSE events
            }
          } else if (line.startsWith('event: stream_end')) {
            isTyping.value = false
            break
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    addMessage('ai', '❌ Désolé, une erreur est survenue. Veuillez réessayer.')
  } finally {
    isLoading.value = false
    isTyping.value = false
  }
}

onMounted(() => {
  if (messageInput.value) {
    messageInput.value.focus()
  }
})
</script>

<style scoped>
/* Reset et layout principal */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #f5f7fa;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.agent-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Zone de messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  padding: 2rem;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

/* TITRE SUR DEUX LIGNES */
.welcome-title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 400;
  margin-bottom: 2rem;
  line-height: 1.2;
  
  /* Dégradé violet-bleu-rose comme le mode MAX */
  background: linear-gradient(
    90deg,
    #667eea 0%,
    #764ba2 40%,
    #f093fb 70%,
    #f5576c 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.welcome-subtitle {
  font-size: clamp(1rem, 2.2vw, 1.2rem);
  color: #6c757d;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  font-weight: 400;
}

/* Boutons de suggestions */
.suggestions {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
}

.suggestion-btn {
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  min-width: 220px;
  flex: 1;
  max-width: 280px;
}

.suggestion-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

/* Messages */
.messages {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 1.2rem 1.5rem;
  border-radius: 20px;
  position: relative;
  backdrop-filter: blur(10px);
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.message.ai .message-content {
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
  font-size: 1rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

/* Indicateur de frappe */
.typing-indicator {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.typing-indicator span {
  width: 0.6rem;
  height: 0.6rem;
  background: #adb5bd;
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-0.6rem);
    opacity: 1;
  }
}

/* Zone de saisie */
.input-container {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(248, 249, 250, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-sizing: border-box;
}

.input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

textarea {
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  max-height: 120px;
  min-height: 24px;
  padding: 0;
  box-sizing: border-box;
}

textarea::placeholder {
  color: #adb5bd;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #a8b5f5 0%, #b8a8f5 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(168, 181, 245, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(168, 181, 245, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-header {
    padding: 1rem;
  }
  
  .messages-container {
    padding: 0;
  }
  
  .welcome-section {
    padding: 1.5rem 1rem;
  }
  
  .messages {
    padding: 1rem;
  }
  
  .input-container {
    padding: 1rem;
  }
  
  .suggestions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .suggestion-btn {
    width: 100%;
    max-width: 320px;
    min-width: auto;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .welcome-title {
    font-size: 2.2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-secondary {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .agent-title {
    font-size: 1.4rem;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
}
</style> 