<template>
  <div class="predefined-component design-style-component" :class="{ 'component-disabled': disabled }">
    <div class="component-header">
      <h4 class="component-title">🎨 Style de design</h4>
      <p class="component-description">
        <span v-if="!disabled">Quel style visuel correspond le mieux à votre vision ?</span>
        <span v-else class="answered-text">✅ Style sélectionné</span>
      </p>
    </div>

    <div class="design-styles-grid">
      <label 
        v-for="style in designStyles" 
        :key="style.value"
        class="design-style-option"
        :class="{ active: localValue === style.value, disabled: disabled }"
      >
        <input
          type="radio"
          :value="style.value"
          v-model="localValue"
          @change="!disabled && updateValue()"
          :disabled="disabled"
        />
        <div class="option-content">
          <div class="style-preview" :style="{ background: style.gradient }">
            <div class="style-icon">{{ style.icon }}</div>
          </div>
          <h5 class="option-title">{{ style.label }}</h5>
          <p class="option-description">{{ style.description }}</p>
          <div class="style-characteristics">
            <span v-for="char in style.characteristics" :key="char" class="characteristic-tag">
              {{ char }}
            </span>
          </div>
        </div>
      </label>
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

const designStyles = [
  {
    value: 'modern',
    label: 'Moderne & Minimaliste',
    description: 'Design épuré avec beaucoup d\'espace blanc et une typographie claire',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    characteristics: ['Épuré', 'Espace blanc', 'Typographie moderne', 'Lignes nettes']
  },
  {
    value: 'creative',
    label: 'Créatif & Artistique',
    description: 'Design original avec des éléments visuels forts et des compositions audacieuses',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    characteristics: ['Original', 'Coloré', 'Animations', 'Éléments visuels']
  },
  {
    value: 'professional',
    label: 'Professionnel & Corporate',
    description: 'Design sérieux et classique, idéal pour les entreprises et services',
    icon: '💼',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    characteristics: ['Sérieux', 'Classique', 'Corporate', 'Fiable']
  },
  {
    value: 'elegant',
    label: 'Élégant & Luxe',
    description: 'Design raffiné avec des détails sophistiqués et une esthétique premium',
    icon: '💎',
    gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
    characteristics: ['Raffiné', 'Premium', 'Sophistiqué', 'Détails']
  },
  {
    value: 'fun',
    label: 'Ludique & Dynamique',
    description: 'Design enjoué avec des couleurs vives et des éléments interactifs',
    icon: '🌈',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    characteristics: ['Coloré', 'Dynamique', 'Interactif', 'Joyeux']
  },
  {
    value: 'natural',
    label: 'Naturel & Organic',
    description: 'Design inspiré de la nature avec des tons chauds et des formes organiques',
    icon: '🌿',
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    characteristics: ['Naturel', 'Tons chauds', 'Organic', 'Doux']
  }
]

const updateValue = () => {
  if (props.disabled) return
  
  emit('update:modelValue', localValue.value)
  
  // Émettre immédiatement la confirmation avec le style sélectionné
  const selectedStyle = designStyles.find(style => style.value === localValue.value)
  if (selectedStyle) {
    emit('confirm', `Style de design : ${selectedStyle.label} - ${selectedStyle.description}`)
  }
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

.design-styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.design-style-option {
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: block;
}

.design-style-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.design-style-option.active {
  border-color: #007bff;
  background: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.design-style-option input[type="radio"] {
  display: none;
}

.option-content {
  text-align: center;
}

.style-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.style-icon {
  font-size: 2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.option-title {
  color: #333;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.option-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.style-characteristics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.characteristic-tag {
  background: #e7f3ff;
  color: #007bff;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .design-styles-grid {
    grid-template-columns: 1fr;
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

.design-style-option.disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

.design-style-option.disabled:hover {
  border-color: #e1e5e9;
  background: white;
  transform: none;
  box-shadow: none;
}
</style> 