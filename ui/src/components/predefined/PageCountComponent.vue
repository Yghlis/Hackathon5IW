<template>
  <div class="predefined-component page-count-component" :class="{ 'component-disabled': disabled }">
    <div class="component-header">
      <h4 class="component-title">📄 Nombre de pages</h4>
      <p class="component-description">
        <span v-if="!disabled">Combien de pages souhaitez-vous pour votre site web ?</span>
        <span v-else class="answered-text">✅ Réponse enregistrée</span>
      </p>
    </div>

    <div class="page-count-options">
      <div 
        v-for="option in pageOptions" 
        :key="option.value"
        class="page-option"
        :class="{ 'selected': localValue === option.value, 'disabled': disabled }"
        @click="!disabled && selectAndConfirm(option.value, option.label)"
      >
        <div class="option-icon">{{ option.icon }}</div>
        <div class="option-content">
          <h5 class="option-title">{{ option.label }}</h5>
          <p class="option-description">{{ option.description }}</p>
          <div class="option-pages">
            <span v-for="(page, index) in option.pages" :key="page">
              {{ page }}<span v-if="index < option.pages.length - 1">, </span>
            </span>
          </div>
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

const localValue = ref(props.modelValue || '')

const pageOptions = [
  {
    value: '1',
    label: '1 page',
    description: 'Site one-page simple et efficace',
    icon: '📄',
    pages: ['Accueil complet']
  },
  {
    value: '2',
    label: '2 pages',
    description: 'Accueil + page contact/services',
    icon: '📋',
    pages: ['Accueil', 'Contact']
  },
  {
    value: '3',
    label: '3 pages',
    description: 'Structure classique essentielle',
    icon: '📚',
    pages: ['Accueil', 'À propos', 'Contact']
  },
  {
    value: '4',
    label: '4 pages',
    description: 'Site développé avec services',
    icon: '📖',
    pages: ['Accueil', 'À propos', 'Services', 'Contact']
  },
  {
    value: '5',
    label: '5 pages',
    description: 'Site complet pour entreprise',
    icon: '📗',
    pages: ['Accueil', 'À propos', 'Services', 'Réalisations', 'Contact']
  }
]

const selectAndConfirm = (value: string, label: string) => {
  if (props.disabled) return
  
  localValue.value = value
  emit('update:modelValue', value)
  
  // Émettre immédiatement la confirmation
  emit('confirm', `${label} - ${pageOptions.find(opt => opt.value === value)?.description}`)
}

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
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
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
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.component-description {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
}

.page-count-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.page-option {
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
}

.page-option.selected {
  border-color: #28a745;
  background: #f8fff8;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.option-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  display: block;
}

.option-title {
  color: #333;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.option-description {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0 0 0.8rem 0;
  line-height: 1.3;
}

.option-pages {
  font-size: 0.75rem;
  color: #007bff;
  background: #e7f3ff;
  padding: 0.6rem;
  border-radius: 6px;
  line-height: 1.2;
  text-align: left;
  min-height: 40px;
  display: flex;
  align-items: center;
}

/* Animation d'effet click */
.page-option:active {
  transform: translateY(-2px) scale(0.98);
}

/* Effet pulse au survol */
.page-option:hover .option-icon {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .page-count-options {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  .page-option {
    padding: 1rem 0.5rem;
  }
  
  .option-icon {
    font-size: 2rem;
  }
  
  .option-title {
    font-size: 1rem;
  }
  
  .option-description {
    font-size: 0.8rem;
  }
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

.page-option.disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

.page-option.disabled:hover {
  border-color: #e1e5e9;
  background: white;
  transform: none;
  box-shadow: none;
}
</style> 