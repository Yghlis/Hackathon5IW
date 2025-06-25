<template>
  <div class="question-wrapper">
    <label :for="question.id" class="question-label">
      {{ question.label }}
      <span v-if="question.required" class="required">*</span>
    </label>
    
    <select
      v-if="!question.multiple"
      :id="question.id"
      v-model="localValue"
      :required="question.required"
      class="question-select"
      @change="updateValue"
    >
      <option value="">Sélectionnez une option...</option>
      <option 
        v-for="option in question.options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div v-else class="checkbox-group">
      <label 
        v-for="option in question.options" 
        :key="option.value"
        class="checkbox-option"
      >
        <input
          type="checkbox"
          :value="option.value"
          :checked="Array.isArray(localValue) && localValue.includes(option.value)"
          @change="updateMultipleValue"
        />
        <span class="checkbox-label">{{ option.label }}</span>
        <p v-if="option.description" class="option-description">{{ option.description }}</p>
      </label>
    </div>
    
    <p v-if="question.helpText" class="help-text">{{ question.helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SelectQuestion } from '../../types/questions'

interface Props {
  question: SelectQuestion
  modelValue?: string | string[]
}

interface Emits {
  (e: 'update:modelValue', value: string | string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref<string | string[]>(
  props.question.multiple 
    ? (Array.isArray(props.modelValue) ? props.modelValue : [])
    : (props.modelValue as string || '')
)

const updateValue = () => {
  emit('update:modelValue', localValue.value)
}

const updateMultipleValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const currentValues = Array.isArray(localValue.value) ? [...localValue.value] : []
  
  if (target.checked) {
    currentValues.push(target.value)
  } else {
    const index = currentValues.indexOf(target.value)
    if (index > -1) {
      currentValues.splice(index, 1)
    }
  }
  
  localValue.value = currentValues
  updateValue()
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = props.question.multiple 
    ? (Array.isArray(newValue) ? newValue : [])
    : (newValue as string || '')
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

.question-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.question-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.checkbox-option input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.option-description {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
}

.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
}
</style> 