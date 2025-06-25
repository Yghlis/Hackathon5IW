import type { ComponentCall } from '../types/predefinedComponents'

// Exemple simple - juste couleur et type de site
export const simpleComponentCall: ComponentCall = {
  type: 'need_info',
  message: 'Pour créer votre site, j\'ai besoin de connaître :',
  components: ['color-picker', 'site-type'],
  submitText: '🚀 Continuer'
}

// Exemple complet - tous les composants
export const fullComponentCall: ComponentCall = {
  type: 'need_info',
  message: 'Pour créer un design personnalisé parfait, j\'ai besoin de ces informations :',
  components: ['color-picker', 'site-type', 'page-count', 'design-style', 'budget-range'],
  submitText: '✨ Générer mon design sur mesure'
}

// Exemple pour site e-commerce
export const ecommerceComponentCall: ComponentCall = {
  type: 'need_info',
  message: 'Pour votre boutique en ligne, quelques détails sont nécessaires :',
  components: ['color-picker', 'page-count', 'budget-range'],
  submitText: '🛒 Créer ma boutique'
}

// Exemple pour portfolio
export const portfolioComponentCall: ComponentCall = {
  type: 'need_info',
  message: 'Pour votre portfolio créatif :',
  components: ['color-picker', 'design-style'],
  submitText: '🎨 Créer mon portfolio'
} 