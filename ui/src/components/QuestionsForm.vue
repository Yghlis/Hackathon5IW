<template>
  <div class="questions-form">
    <div class="form-header">
      <h3 class="form-title">{{ formData.title || 'Informations complémentaires' }}</h3>
      <p v-if="formData.description" class="form-description">{{ formData.description }}</p>
    </div>

    <div class="questions-container">
      <div v-for="group in formData.groups" :key="group.id" class="question-group">
        <div v-if="group.title" class="group-header">
          <h4 class="group-title">{{ group.title }}</h4>
          <p v-if="group.description" class="group-description">{{ group.description }}</p>
        </div>

        <div class="questions-list">
          <component
            v-for="question in group.questions"
            :key="question.id"
            :is="getQuestionComponent(question.type)"
            :question="question"
            v-model="answers[question.id]"
          />
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" @click="submitAnswers" class="submit-button" :disabled="!isValid">
        {{ formData.submitText || 'Continuer' }}
      </button>
      <button type="button" @click="$emit('cancel')" class="cancel-button">
        Annuler
      </button>
    </div>

    <div v-if="debugMode" class="debug-answers">
      <h4>Debug - Réponses actuelles :</h4>
      <pre>{{ JSON.stringify(answers, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { StructuredResponse, QuestionAnswers, Question } from '../types/questions'

// Importation des composants de questions
import TextQuestion from './questions/TextQuestion.vue'
import SelectQuestion from './questions/SelectQuestion.vue'
import ColorQuestion from './questions/ColorQuestion.vue'
import RadioQuestion from './questions/RadioQuestion.vue'

interface Props {
  formData: StructuredResponse
  debugMode?: boolean
}

interface Emits {
  (e: 'submit', answers: QuestionAnswers): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const answers = ref<QuestionAnswers>({})

// Mapping des types de questions vers leurs composants
const getQuestionComponent = (type: string) => {
  const components = {
    'text': TextQuestion,
    'select': SelectQuestion,
    'color': ColorQuestion,
    'radio': RadioQuestion,
    'checkbox': SelectQuestion, // Réutilise SelectQuestion avec multiple=true
    'range': TextQuestion, // TODO: créer RangeQuestion
    'file': TextQuestion // TODO: créer FileQuestion
  }
  return components[type as keyof typeof components] || TextQuestion
}

// Validation du formulaire
const isValid = computed(() => {
  const allQuestions = props.formData.groups.flatMap(group => group.questions)
  const requiredQuestions = allQuestions.filter(q => q.required)
  
  return requiredQuestions.every(question => {
    const answer = answers.value[question.id]
    if (Array.isArray(answer)) {
      return answer.length > 0
    }
    return answer !== undefined && answer !== null && answer !== ''
  })
})

const submitAnswers = () => {
  if (isValid.value) {
    emit('submit', answers.value)
  }
}

// Initialiser les réponses avec les valeurs par défaut
onMounted(() => {
  props.formData.groups.forEach(group => {
    group.questions.forEach(question => {
      if (question.type === 'select' && (question as any).multiple) {
        answers.value[question.id] = []
      } else if (question.type === 'checkbox') {
        answers.value[question.id] = []
      } else if (question.type === 'color') {
        answers.value[question.id] = '#007bff'
      } else {
        answers.value[question.id] = ''
      }
    })
  })
})
</script>

<style scoped>
.questions-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-title {
  color: #333;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.form-description {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.questions-container {
  margin-bottom: 2rem;
}

.question-group {
  margin-bottom: 2rem;
}

.group-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e5e9;
}

.group-title {
  color: #333;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.group-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 2px solid #e1e5e9;
}

.submit-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.cancel-button {
  background: transparent;
  color: #6c757d;
  border: 2px solid #e1e5e9;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.debug-answers {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.debug-answers h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.debug-answers pre {
  background: #1e1e1e;
  color: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 0;
  overflow-x: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .questions-form {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style> 