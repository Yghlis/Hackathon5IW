<template>
  <div class="predefined-component budget-range-component">
    <div class="component-header">
      <h4 class="component-title">💰 Budget estimé</h4>
      <p class="component-description">
        Quel est votre budget approximatif pour ce projet ?
      </p>
    </div>

    <div class="budget-ranges">
      <label 
        v-for="budget in budgetRanges" 
        :key="budget.value"
        class="budget-option"
        :class="{ active: localValue === budget.value }"
      >
        <input
          type="radio"
          :value="budget.value"
          v-model="localValue"
          @change="updateValue"
        />
        <div class="option-content">
          <div class="budget-icon">{{ budget.icon }}</div>
          <h5 class="budget-range">{{ budget.range }}</h5>
          <p class="budget-description">{{ budget.description }}</p>
          <div class="budget-includes">
            <strong>Inclus :</strong>
            <ul>
              <li v-for="feature in budget.includes" :key="feature">{{ feature }}</li>
            </ul>
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

const budgetRanges = [
  {
    value: 'budget-low',
    range: '500€ - 1 500€',
    description: 'Solution économique pour un premier site web',
    icon: '🌱',
    includes: ['Template personnalisé', 'Design responsive', 'Pages essentielles', 'Formulaire contact']
  },
  {
    value: 'budget-medium',
    range: '1 500€ - 3 500€',
    description: 'Solution équilibrée avec fonctionnalités avancées',
    icon: '🚀',
    includes: ['Design sur mesure', 'CMS intégré', 'SEO optimisé', 'Animations', 'Formation']
  },
  {
    value: 'budget-high',
    range: '3 500€ - 7 500€',
    description: 'Solution premium avec développements spécifiques',
    icon: '⭐',
    includes: ['Design unique', 'Fonctionnalités custom', 'E-commerce', 'Intégrations API', 'Support étendu']
  },
  {
    value: 'budget-enterprise',
    range: '7 500€+',
    description: 'Solution entreprise avec architecture complexe',
    icon: '💎',
    includes: ['Architecture sur mesure', 'Développements avancés', 'Intégrations multiples', 'Support dédié', 'Maintenance']
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

.budget-ranges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.budget-option {
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: block;
  position: relative;
}

.budget-option:hover {
  border-color: #28a745;
  background: #f8fff9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
}

.budget-option.active {
  border-color: #28a745;
  background: #f8fff9;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.budget-option input[type="radio"] {
  display: none;
}

.option-content {
  text-align: center;
}

.budget-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.budget-range {
  color: #28a745;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.budget-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.budget-includes {
  font-size: 0.8rem;
  color: #333;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
}

.budget-includes ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1rem;
}

.budget-includes li {
  margin-bottom: 0.25rem;
  color: #495057;
}

@media (max-width: 768px) {
  .budget-ranges {
    grid-template-columns: 1fr;
  }
}
</style> 