// Types pour les questions structurées de l'agent IA

export interface BaseQuestion {
  id: string
  label: string
  required?: boolean
  helpText?: string
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
  placeholder?: string
  maxLength?: number
}

export interface SelectQuestion extends BaseQuestion {
  type: 'select'
  options: Array<{
    value: string
    label: string
    description?: string
  }>
  multiple?: boolean
}

export interface ColorQuestion extends BaseQuestion {
  type: 'color'
  defaultColors?: string[]
  allowCustom?: boolean
}

export interface RangeQuestion extends BaseQuestion {
  type: 'range'
  min: number
  max: number
  step?: number
  unit?: string
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio'
  options: Array<{
    value: string
    label: string
    description?: string
    icon?: string
  }>
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox'
  options: Array<{
    value: string
    label: string
    description?: string
  }>
}

export interface FileQuestion extends BaseQuestion {
  type: 'file'
  accept?: string
  multiple?: boolean
  maxSize?: number
}

export type Question = 
  | TextQuestion 
  | SelectQuestion 
  | ColorQuestion 
  | RangeQuestion 
  | RadioQuestion 
  | CheckboxQuestion
  | FileQuestion

export interface QuestionGroup {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export interface StructuredResponse {
  type: 'questions'
  message?: string
  groups: QuestionGroup[]
  submitText?: string
}

export interface QuestionAnswers {
  [questionId: string]: any
}

export interface AnswersSubmission {
  answers: QuestionAnswers
  groupId?: string
} 