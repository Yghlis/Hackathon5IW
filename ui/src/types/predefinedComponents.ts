// Système de composants prédéfinis pour les questions design

export interface ComponentCall {
  type: 'need_info'
  message?: string
  components: string[] // IDs des composants à afficher
  submitText?: string
}

export interface ComponentAnswers {
  [componentId: string]: any
}

// Types pour chaque composant prédéfini
export interface ComponentAnswer {
  componentId: string
  value: any
  label: string
} 