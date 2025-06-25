<template>
  <div class="question-wrapper">
    <div class="question-label">
      {{ question.label }}
      <span v-if="question.required" class="required">*</span>
    </div>
    
    <div class="radio-group">
      <label 
        v-for="option in question.options" 
        :key="option.value"
        class="radio-option"
        :class="{ active: localValue === option.value }"
      >
        <input
          type="radio"
          :name="question.id"
          :value="option.value"
          v-model="localValue"
          @change="updateValue"
        />
        <div class="option-content">
          <div class="option-header">
            <span v-if="option.icon" class="option-icon">{{ option.icon }}</span>
            <span class="option-label">{{ option.label }}</span>
          </div>
          <p v-if="option.description" class="option-description">
            {{ option.description }}
          </p>
        </div>
      </label>
    </div>
    
    <p v-if="question.helpText" class="help-text">{{ question.helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RadioQuestion } from '../../types/questions'

interface Props {
  question: RadioQuestion
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
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
  margin-left: 2px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.radio-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
}

.radio-option.active {
  border-color: #007bff;
  background: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.radio-option input[type="radio"] {
  margin-top: 2px;
  cursor: pointer;
}

.option-content {
  flex: 1;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.option-icon {
  font-size: 1.2rem;
}

.option-label {
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.option-description {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.4;
}

.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
}
</style> 