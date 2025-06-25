<template>
  <div class="predefined-component site-type-component">
    <div class="component-header">
      <h4 class="component-title">🏢 Type de site web</h4>
      <p class="component-description">
        Quel type de site web correspond le mieux à votre projet ?
      </p>
    </div>

    <div class="site-types-grid">
      <label 
        v-for="siteType in siteTypes" 
        :key="siteType.value"
        class="site-type-option"
        :class="{ active: localValue === siteType.value }"
      >
        <input
          type="radio"
          :value="siteType.value"
          v-model="localValue"
          @change="updateValue"
        />
        <div class="option-content">
          <div class="option-icon">{{ siteType.icon }}</div>
          <h5 class="option-title">{{ siteType.label }}</h5>
          <p class="option-description">{{ siteType.description }}</p>
          <div class="option-examples">
            <strong>Exemples :</strong> {{ siteType.examples.join(', ') }}
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
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue || '')

const siteTypes = [
  {
    value: 'corporate',
    label: 'Site Vitrine d\'Entreprise',
    description: 'Présentation professionnelle de votre activité, services et équipe',
    icon: '🏢',
    examples: ['Cabinet médical', 'Agence conseil', 'Restaurant']
  },
  {
    value: 'ecommerce',
    label: 'Boutique en Ligne',
    description: 'Vente de produits ou services en ligne avec panier et paiement',
    icon: '🛒',
    examples: ['Mode', 'Électronique', 'Artisanat']
  },
  {
    value: 'portfolio',
    label: 'Portfolio Créatif',
    description: 'Showcase de vos créations, projets et réalisations',
    icon: '🎨',
    examples: ['Photographe', 'Designer', 'Architecte']
  },
  {
    value: 'blog',
    label: 'Blog / Magazine',
    description: 'Publication d\'articles, actualités et contenu éditorial',
    icon: '📝',
    examples: ['Blog voyage', 'Magazine tech', 'Actualités']
  },
  {
    value: 'landing',
    label: 'Page de Vente',
    description: 'Page unique optimisée pour convertir les visiteurs',
    icon: '🎯',
    examples: ['Lancement produit', 'Formation', 'Événement']
  },
  {
    value: 'personal',
    label: 'Site Personnel',
    description: 'Présentation personnelle, CV en ligne ou blog personnel',
    icon: '👤',
    examples: ['CV en ligne', 'Blog perso', 'Profil pro']
  }
]

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

.site-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.site-type-option {
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: block;
}

.site-type-option:hover {
  border-color: #007bff;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.site-type-option.active {
  border-color: #007bff;
  background: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.site-type-option input[type="radio"] {
  display: none;
}

.option-content {
  text-align: center;
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
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
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.option-examples {
  font-size: 0.8rem;
  color: #007bff;
  background: #e7f3ff;
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .site-types-grid {
    grid-template-columns: 1fr;
  }
}
</style> 