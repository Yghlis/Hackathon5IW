<template>
  <div class="predefined-component project-details-component">
    <div class="component-header">
      <h4 class="component-title">🚀 Détails de votre projet</h4>
      <p class="component-description">
        Remplissez ces informations pour créer votre site web sur mesure
      </p>
    </div>

    <div class="project-form">
      <!-- 1. Nom du projet -->
      <div class="form-section">
        <label class="section-label">
          <span class="label-icon">📝</span>
          <span class="label-text">Nom du projet</span>
          <span class="required">*</span>
        </label>
        <input
          type="text"
          v-model="projectData.name"
          @input="updateValue"
          placeholder="Ex: Restaurant La Bella Vita, Mon Portfolio, Boutique Mode..."
          class="form-input"
          maxlength="100"
        />
      </div>

      <!-- 2. Description du projet -->
      <div class="form-section">
        <label class="section-label">
          <span class="label-icon">💬</span>
          <span class="label-text">Description du projet</span>
          <span class="required">*</span>
        </label>
        <textarea
          v-model="projectData.description"
          @input="updateValue"
          placeholder="Décrivez votre projet : activité, objectifs, public cible, spécificités..."
          class="form-textarea"
          rows="4"
          maxlength="500"
        ></textarea>
        <div class="character-count">{{ projectData.description.length }}/500</div>
      </div>

      <!-- 3. Nombre de pages -->
      <div class="form-section">
        <label class="section-label">
          <span class="label-icon">📄</span>
          <span class="label-text">Nombre de pages</span>
          <span class="required">*</span>
        </label>
        <div class="pages-grid">
          <label 
            v-for="option in pageOptions" 
            :key="option.value"
            class="page-option"
            :class="{ active: projectData.pages === option.value }"
          >
            <input
              type="radio"
              :value="option.value"
              v-model="projectData.pages"
              @change="updateValue"
            />
            <div class="option-content">
              <div class="option-icon">{{ option.icon }}</div>
              <div class="option-text">
                <div class="option-title">{{ option.label }}</div>
                <div class="option-desc">{{ option.description }}</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- 4. Couleur du thème -->
      <div class="form-section">
        <label class="section-label">
          <span class="label-icon">🎨</span>
          <span class="label-text">Couleur principale</span>
          <span class="required">*</span>
        </label>
        <div class="color-selection">
          <div class="colors-grid">
            <button
              v-for="color in brandColors"
              :key="color.value"
              type="button"
              class="color-preset"
              :class="{ active: projectData.color === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="selectColor(color.value)"
              :title="color.name"
            >
              <span class="color-name">{{ color.name }}</span>
            </button>
          </div>
          <div class="custom-color">
            <input
              type="color"
              v-model="projectData.color"
              @input="updateValue"
              class="color-input"
            />
            <span class="color-value">{{ projectData.color }}</span>
          </div>
        </div>
      </div>

      <!-- 5. Style du projet -->
      <div class="form-section">
        <label class="section-label">
          <span class="label-icon">✨</span>
          <span class="label-text">Style de design</span>
          <span class="required">*</span>
        </label>
        <div class="styles-grid">
          <label 
            v-for="style in designStyles" 
            :key="style.value"
            class="style-option"
            :class="{ active: projectData.style === style.value }"
          >
            <input
              type="radio"
              :value="style.value"
              v-model="projectData.style"
              @change="updateValue"
            />
            <div class="style-preview" :style="{ background: style.gradient }">
              <div class="style-icon">{{ style.icon }}</div>
            </div>
            <div class="style-info">
              <div class="style-title">{{ style.label }}</div>
              <div class="style-desc">{{ style.description }}</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Props {
  modelValue?: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const projectData = reactive({
  name: '',
  description: '',
  pages: '',
  color: '#007bff',
  style: ''
})

const pageOptions = [
  {
    value: '1-page',
    label: 'Page unique',
    description: 'Site one-page avec sections défilantes',
    icon: '📄'
  },
  {
    value: '3-5-pages',
    label: '3-5 pages',
    description: 'Site classique avec pages essentielles',
    icon: '📚'
  },
  {
    value: '6-10-pages',
    label: '6-10 pages',
    description: 'Site développé avec sections détaillées',
    icon: '📖'
  },
  {
    value: '10+-pages',
    label: '10+ pages',
    description: 'Site complet avec nombreuses sections',
    icon: '📗'
  }
]

const brandColors = [
  { name: 'Bleu', value: '#007bff' },
  { name: 'Vert', value: '#28a745' },
  { name: 'Rouge', value: '#dc3545' },
  { name: 'Orange', value: '#fd7e14' },
  { name: 'Violet', value: '#6f42c1' },
  { name: 'Jaune', value: '#ffc107' },
  { name: 'Turquoise', value: '#20c997' },
  { name: 'Rose', value: '#e83e8c' }
]

const designStyles = [
  {
    value: 'modern',
    label: 'Moderne',
    description: 'Épuré et minimaliste',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  {
    value: 'creative',
    label: 'Créatif',
    description: 'Original et artistique',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    value: 'professional',
    label: 'Professionnel',
    description: 'Sérieux et corporate',
    icon: '💼',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
  },
  {
    value: 'elegant',
    label: 'Élégant',
    description: 'Raffiné et luxe',
    icon: '💎',
    gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)'
  }
]

const selectColor = (color: string) => {
  projectData.color = color
  updateValue()
}

const updateValue = () => {
  emit('update:modelValue', { ...projectData })
}

// Initialiser avec les valeurs props si disponibles
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    Object.assign(projectData, newValue)
  }
}, { immediate: true })
</script>

<style scoped>
.predefined-component {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.predefined-component:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
}

.component-header {
  margin-bottom: 2rem;
  text-align: center;
}

.component-title {
  color: #333;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.component-description {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  width: 100%;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.2rem;
}

.required {
  color: #dc3545;
  font-weight: bold;
}

.form-input, .form-textarea {
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.character-count {
  text-align: right;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.page-option {
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: block;
}

.page-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.page-option.active {
  border-color: #007bff;
  background: #f8f9ff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.page-option input[type="radio"] {
  display: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  font-size: 1.5rem;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-desc {
  font-size: 0.85rem;
  color: #6c757d;
}

.color-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.color-preset {
  height: 50px;
  border: 3px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.25rem;
}

.color-preset:hover {
  transform: scale(1.05);
}

.color-preset.active {
  border-color: #333;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

.color-name {
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-weight: 500;
  color: #333;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.style-option {
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: block;
}

.style-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.style-option.active {
  border-color: #007bff;
  background: #f8f9ff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.style-option input[type="radio"] {
  display: none;
}

.style-preview {
  width: 100%;
  height: 60px;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.style-icon {
  font-size: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.style-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.style-desc {
  font-size: 0.85rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .predefined-component {
    padding: 1.5rem;
  }
  
  .pages-grid, .styles-grid {
    grid-template-columns: 1fr;
  }
  
  .colors-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 