<template>
  <div class="predefined-component project-description-component">
   

    <div class="description-input">
      <textarea
        v-model="localValue"
        @input="updateValue"
        placeholder="Ex: Je souhaite créer un site vitrine pour mon restaurant italien à Lyon. J'aimerais mettre en avant nos spécialités et permettre aux clients de réserver en ligne..."
        class="description-textarea"
        rows="5"
      ></textarea>
      
      <div class="input-help">
        <p><strong>💡 Quelques idées pour vous guider :</strong></p>
        <ul>
          <li>🏢 <strong>Activité :</strong> Quel est votre secteur/métier ?</li>
          <li>🎯 <strong>Objectif :</strong> Que voulez-vous accomplir avec ce site ?</li>
          <li>👥 <strong>Public :</strong> Qui sont vos visiteurs cibles ?</li>
          <li>✨ <strong>Spécificités :</strong> Avez-vous des besoins particuliers ?</li>
        </ul>
      </div>

      <div class="character-count">
        {{ localValue.length }}/1000 caractères
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || '')

const updateValue = () => {
  emit('update:modelValue', localValue.value)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || ''
})
</script>

<style scoped>
.predefined-component {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.predefined-component:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
}

.component-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.component-title {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.component-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.description-input {
  width: 100%;
}

.description-textarea {
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;
}

.description-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.description-textarea::placeholder {
  color: #adb5bd;
  font-style: italic;
}

.input-help {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.input-help p {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.input-help ul {
  margin: 0;
  padding-left: 1.2rem;
}

.input-help li {
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.4;
}

.character-count {
  text-align: right;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .description-textarea {
    min-height: 100px;
  }
  
  .input-help {
    padding: 0.75rem;
  }
}
</style> 