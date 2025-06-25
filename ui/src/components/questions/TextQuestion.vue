<template>
  <div class="question-wrapper">
    <label :for="question.id" class="question-label">
      {{ question.label }}
      <span v-if="question.required" class="required">*</span>
    </label>
    
    <input
      :id="question.id"
      v-model="localValue"
      type="text"
      :placeholder="question.placeholder"
      :maxlength="question.maxLength"
      :required="question.required"
      class="question-input"
      @input="updateValue"
    />
    
    <p v-if="question.helpText" class="help-text">{{ question.helpText }}</p>
    
    <div v-if="question.maxLength && localValue" class="character-count">
      {{ localValue.length }} / {{ question.maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TextQuestion } from '../../types/questions'

interface Props {
  question: TextQuestion
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
.question-wrapper {
  margin-bottom: 1.5rem;
}

.question-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
  margin-left: 2px;
}

.question-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
}

.question-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
}

.character-count {
  font-size: 0.8rem;
  color: #6c757d;
  text-align: right;
  margin-top: 0.25rem;
}
</style> 