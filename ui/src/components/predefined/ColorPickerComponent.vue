<template>
  <div class="predefined-component color-picker-component" :class="{ 'component-disabled': disabled }">
    <div class="component-header">
      <h4 class="component-title">🎨 Couleur principale de votre marque</h4>
      <p class="component-description">
        <span v-if="!disabled">Choisissez la couleur qui représente le mieux votre marque ou votre projet</span>
        <span v-else class="answered-text">✅ Couleur sélectionnée</span>
      </p>
    </div>

    <div class="color-selection">
      <!-- Couleurs populaires pour les marques -->
      <div class="preset-colors">
        <h5>Couleurs populaires :</h5>
        <div class="colors-grid">
          <button
            v-for="color in brandColors"
            :key="color.value"
            type="button"
            class="color-preset"
            :class="{ active: localValue === color.value, disabled: disabled }"
            :style="{ backgroundColor: color.value }"
            @click="!disabled && selectColor(color.value)"
            :title="color.name"
            :disabled="disabled"
          >
            <span class="color-name">{{ color.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Sélecteur personnalisé -->
      <div class="custom-color">
        <h5>Couleur personnalisée :</h5>
        <div class="custom-picker">
          <input
            type="color"
            v-model="localValue"
            class="color-input"
            :class="{ disabled: disabled }"
            @input="!disabled && updateValue()"
            :disabled="disabled"
          />
          <span class="color-value">{{ localValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'confirm', answer: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || '#007bff')

const brandColors = [
  { name: 'Bleu', value: '#007bff' },
  { name: 'Vert', value: '#28a745' },
  { name: 'Rouge', value: '#dc3545' },
  { name: 'Orange', value: '#fd7e14' },
  { name: 'Violet', value: '#6f42c1' },
  { name: 'Jaune', value: '#ffc107' },
  { name: 'Turquoise', value: '#20c997' },
  { name: 'Rose', value: '#e83e8c' },
  { name: 'Gris', value: '#6c757d' },
  { name: 'Noir', value: '#212529' }
]

const selectColor = (color: string) => {
  if (props.disabled) return
  
  const colorInfo = brandColors.find(c => c.value === color)
  localValue.value = color
  emit('update:modelValue', color)
  
  // Émettre immédiatement la confirmation avec le nom de la couleur
  emit('confirm', `Couleur principale : ${colorInfo?.name || color}`)
}

const updateValue = () => {
  if (props.disabled) return
  
  emit('update:modelValue', localValue.value)
  
  // Pour les couleurs personnalisées, émettre aussi la confirmation
  emit('confirm', `Couleur principale personnalisée : ${localValue.value}`)
}

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || '#007bff'
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

.color-selection h5 {
  color: #333;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.preset-colors {
  margin-bottom: 2rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.color-preset {
  height: 60px;
  border: 3px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.5rem;
}

.color-preset:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.color-preset.active {
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
}

.color-name {
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.custom-color {
  border-top: 1px solid #e1e5e9;
  padding-top: 1.5rem;
}

.custom-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.color-input {
  width: 80px;
  height: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-input:focus {
  outline: none;
  border-color: #007bff;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #333;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
  font-weight: 500;
}

.component-disabled {
  opacity: 0.6;
  pointer-events: none;
  filter: grayscale(50%);
}

.component-disabled .component-header {
  opacity: 0.8;
}

.answered-text {
  color: #28a745 !important;
  font-weight: 500;
}

.color-preset.disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

.color-preset.disabled:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-input.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style> 