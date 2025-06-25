<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

/* --- état local --------------------------------------------------------- */
const messages = ref<{ role: 'user' | 'assistant'; text: string }[]>([])
const input = ref('')

let es: EventSource | null = null   // instance SSE courante

/* --- envoi du prompt ---------------------------------------------------- */
async function send() {
  const text = input.value.trim()
  if (!text) return

  // côté UI : on push le message user
  messages.value.push({ role: 'user', text })

  // on poste au backend
  const r = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  })
  const { chatId } = await r.json()

  // on démarre le flux de tokens
  startStream(chatId)

  input.value = ''
}

/* --- écoute SSE token par token ---------------------------------------- */
function startStream(id: string) {
  es?.close()                    // ferme le flux précédent si besoin
  es = new EventSource(`/chat/stream?chatId=${id}`)

  // on prépare le contenant du message assistant
  const idx = messages.value.push({ role: 'assistant', text: '' }) - 1

  es.onmessage = (e) => {
    if (e.data === '[DONE]') {
      es?.close()
      return
    }
    messages.value[idx].text += e.data
  }
}

onBeforeUnmount(() => es?.close())
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <!-- fil de discussion -->
    <div v-for="(m, i) in messages" :key="i"
         :class="m.role === 'user' ? 'text-right' : 'text-left'">
      <p class="inline-block my-1 px-3 py-2 rounded-lg whitespace-pre-wrap"
         :class="m.role === 'user'
                 ? 'bg-blue-600 text-white'
                 : 'bg-gray-200'">
        {{ m.text }}
      </p>
    </div>

    <!-- zone de saisie -->
    <div class="flex mt-6">
      <input v-model="input"
             @keydown.enter="send"
             placeholder="Pose ta question…"
             class="flex-1 border rounded-l px-3 py-2 focus:outline-none">
      <button @click="send"
              class="bg-blue-600 text-white px-4 py-2 rounded-r">
        Envoyer
      </button>
    </div>
  </div>
</template>
