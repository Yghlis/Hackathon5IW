<template>
  <div class="question-wrapper">
    <label class="question-label">
      {{ question.label }}
      <span v-if="question.required" class="required">*</span>
    </label>
    
    <div class="color-selection">
      <!-- Couleurs prédéfinies -->
      <div v-if="question.defaultColors" class="preset-colors">
        <button
          v-for="color in question.defaultColors"
          :key="color"
          type="button"
          class="color-preset"
          :class="{ active: localValue === color }"
          :style="{ backgroundColor: color }"
          @click="selectColor(color)"
          :title="color"
        ></button>
      </div>
      
      <!-- Sélecteur de couleur personnalisé -->
      <div v-if="question.allowCustom !== false" class="custom-color">
        <input
          type="color"
          v-model="localValue"
          class="color-picker"
          @input="updateValue"
        />
        <span class="color-value">{{ localValue }}</span>
      </div>
    </div>
    
    <p v-if="question.helpText" class="help-text">{{ question.helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ColorQuestion } from '../../types/questions'

interface Props {
  question: ColorQuestion
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || '#007bff')

const selectColor = (color: string) => {
  localValue.value = color
  updateValue()
}

const updateValue = () => {
  emit('update:modelValue', localValue.value)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || '#007bff'
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

.color-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-preset {
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preset:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-preset.active {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 60px;
  height: 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-picker:focus {
  outline: none;
  border-color: #007bff;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #333;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #e1e5e9;
}

.help-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
}
</style> 