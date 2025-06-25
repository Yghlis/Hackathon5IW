<template>
  <div class="predefined-components-form">
    <div class="components-container">
      <!-- Composant Couleur -->
      <ColorPickerComponent 
        v-if="shouldShowComponent('color-picker')"
        v-model="componentAnswers['color-picker']"
        :disabled="isComponentAnswered('color-picker')"
        @confirm="handleColorPickerConfirm"
      />

      <!-- Composant Type de Site -->
      <SiteTypeComponent 
        v-if="shouldShowComponent('site-type')"
        v-model="componentAnswers['site-type']"
      />

      <!-- Composant Nombre de Pages -->
      <PageCountComponent 
        v-if="shouldShowComponent('page-count')"
        v-model="componentAnswers['page-count']"
        :disabled="isComponentAnswered('page-count')"
        @confirm="handlePageCountConfirm"
      />

      <!-- Composant Style de Design -->
      <DesignStyleComponent 
        v-if="shouldShowComponent('design-style')"
        v-model="componentAnswers['design-style']"
        :disabled="isComponentAnswered('design-style')"
        @confirm="handleDesignStyleConfirm"
      />

      <!-- Composant Budget -->
      <BudgetRangeComponent 
        v-if="shouldShowComponent('budget-range')"
        v-model="componentAnswers['budget-range']"
      />

      <!-- Composant Nom du Projet Seul -->
      <ProjectNameComponent 
        v-if="shouldShowComponent('project-name')"
      />

      <!-- Composant Description du Projet Seul -->
      <ProjectDescriptionIndividualComponent 
        v-if="shouldShowComponent('project-description')"
      />

      <!-- Composant Détails Projet Complet -->
      <ProjectDetailsComponent 
        v-if="shouldShowComponent('project-details')"
        v-model="componentAnswers['project-details']"
      />
    </div>

    <!-- Actions supprimées - Seuls les composants sont affichés -->
    <div v-if="showDebug" class="debug-section">
      <h4>🔍 Debug - Réponses :</h4>
      <pre>{{ JSON.stringify(componentAnswers, null, 2) }}</pre>
      <h4>🔍 Debug - Composants répondus :</h4>
      <pre>{{ JSON.stringify(answeredComponents, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ComponentCall, ComponentAnswers } from '../../types/predefinedComponents'
import ColorPickerComponent from './ColorPickerComponent.vue'
import SiteTypeComponent from './SiteTypeComponent.vue'
import PageCountComponent from './PageCountComponent.vue'
import DesignStyleComponent from './DesignStyleComponent.vue'
import BudgetRangeComponent from './BudgetRangeComponent.vue'
import ProjectDescriptionComponent from './ProjectDescriptionComponent.vue'
import ProjectDescriptionIndividualComponent from './ProjectDescriptionIndividualComponent.vue'
import ProjectDetailsComponent from './ProjectDetailsComponent.vue'
import ProjectNameComponent from './ProjectNameComponent.vue'

interface Props {
  componentCall: ComponentCall
  showDebug?: boolean
}

interface Emits {
  (e: 'submit', answers: ComponentAnswers): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const componentAnswers = ref<ComponentAnswers>({})
const answeredComponents = ref<Set<string>>(new Set())

// Vérifie si un composant doit être affiché
const shouldShowComponent = (componentId: string): boolean => {
  return props.componentCall.components.includes(componentId)
}

// Vérifie si un composant a déjà été répondu
const isComponentAnswered = (componentId: string): boolean => {
  return answeredComponents.value.has(componentId)
}

// Marque un composant comme répondu
const markComponentAsAnswered = (componentId: string) => {
  answeredComponents.value.add(componentId)
}

// Gestion de la confirmation directe pour le nombre de pages
const handlePageCountConfirm = (answer: string) => {
  // Définir la valeur et soumettre immédiatement
  componentAnswers.value['page-count'] = answer
  
  // Marquer comme répondu
  markComponentAsAnswered('page-count')
  
  // Soumettre automatiquement avec cette réponse
  emit('submit', { ...componentAnswers.value })
}

// Gestion de la confirmation directe pour la couleur
const handleColorPickerConfirm = (answer: string) => {
  // Marquer comme répondu
  markComponentAsAnswered('color-picker')
  
  // Soumettre automatiquement avec cette réponse
  emit('submit', { ...componentAnswers.value })
}

// Gestion de la confirmation directe pour le style de design
const handleDesignStyleConfirm = (answer: string) => {
  // Marquer comme répondu
  markComponentAsAnswered('design-style')
  
  // Soumettre automatiquement avec cette réponse
  emit('submit', { ...componentAnswers.value })
}

// Réinitialise les réponses quand les composants changent
watch(() => props.componentCall.components, () => {
  componentAnswers.value = {}
  answeredComponents.value.clear()
}, { immediate: true })
</script>

<style scoped>
.predefined-components-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.components-container {
  margin: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
  min-width: 300px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-btn.is-loading {
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.debug-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: left;
}

.debug-section h4 {
  color: #495057;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.debug-section pre {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 0.85rem;
  overflow-x: auto;
  color: #333;
}

@media (max-width: 768px) {
  .predefined-components-form {
    padding: 1rem;
  }
  
  .form-header {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-description {
    font-size: 1rem;
  }
  
  .submit-btn {
    min-width: 250px;
    font-size: 1rem;
  }
}
</style> 