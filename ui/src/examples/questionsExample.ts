import type { StructuredResponse } from '../types/questions'

// Exemple de réponse structurée que l'agent pourrait retourner
export const exampleQuestionsResponse: StructuredResponse = {
  type: 'questions',
  message: 'Pour créer le design parfait de votre site, j\'ai besoin de quelques informations supplémentaires :',
  submitText: 'Générer le design',
  groups: [
    {
      id: 'basic-info',
      title: 'Informations de base',
      description: 'Parlez-moi de votre projet',
      questions: [
        {
          id: 'site-type',
          type: 'radio',
          label: 'Quel type de site souhaitez-vous ?',
          required: true,
          options: [
            {
              value: 'corporate',
              label: 'Site vitrine d\'entreprise',
              description: 'Présentation professionnelle de votre entreprise',
              icon: '🏢'
            },
            {
              value: 'ecommerce',
              label: 'Site e-commerce',
              description: 'Boutique en ligne pour vendre vos produits',
              icon: '🛒'
            },
            {
              value: 'portfolio',
              label: 'Portfolio créatif',
              description: 'Showcase de vos créations et projets',
              icon: '🎨'
            },
            {
              value: 'blog',
              label: 'Blog / Magazine',
              description: 'Site de contenu et d\'articles',
              icon: '📝'
            }
          ]
        },
        {
          id: 'company-name',
          type: 'text',
          label: 'Nom de votre entreprise/projet',
          placeholder: 'Ex: Mon Entreprise',
          required: true,
          maxLength: 50
        },
        {
          id: 'target-audience',
          type: 'select',
          label: 'Qui est votre public cible ?',
          multiple: true,
          options: [
            { value: 'b2b', label: 'Entreprises (B2B)' },
            { value: 'b2c', label: 'Particuliers (B2C)' },
            { value: 'young-adults', label: 'Jeunes adultes (18-35 ans)' },
            { value: 'professionals', label: 'Professionnels' },
            { value: 'seniors', label: 'Seniors (50+ ans)' }
          ]
        }
      ]
    },
    {
      id: 'design-preferences',
      title: 'Préférences de design',
      description: 'Aidez-moi à comprendre votre style',
      questions: [
        {
          id: 'primary-color',
          type: 'color',
          label: 'Couleur principale de votre marque',
          defaultColors: [
            '#007bff', '#28a745', '#dc3545', '#ffc107',
            '#6f42c1', '#fd7e14', '#20c997', '#6c757d'
          ],
          allowCustom: true,
          helpText: 'Choisissez parmi les couleurs suggérées ou sélectionnez une couleur personnalisée'
        },
        {
          id: 'design-style',
          type: 'radio',
          label: 'Style de design préféré',
          required: true,
          options: [
            {
              value: 'modern',
              label: 'Moderne et minimaliste',
              description: 'Design épuré avec beaucoup d\'espace blanc',
              icon: '✨'
            },
            {
              value: 'creative',
              label: 'Créatif et artistique',
              description: 'Design original avec des éléments visuels forts',
              icon: '🎨'
            },
            {
              value: 'professional',
              label: 'Professionnel et sobre',
              description: 'Design classique et sérieux',
              icon: '💼'
            },
            {
              value: 'fun',
              label: 'Ludique et coloré',
              description: 'Design enjoué avec des couleurs vives',
              icon: '🌈'
            }
          ]
        },
        {
          id: 'features',
          type: 'select',
          label: 'Fonctionnalités souhaitées',
          multiple: true,
          options: [
            { value: 'contact-form', label: 'Formulaire de contact' },
            { value: 'gallery', label: 'Galerie d\'images' },
            { value: 'testimonials', label: 'Témoignages clients' },
            { value: 'blog', label: 'Section blog' },
            { value: 'social-media', label: 'Liens réseaux sociaux' },
            { value: 'newsletter', label: 'Newsletter' },
            { value: 'search', label: 'Fonction de recherche' }
          ],
          helpText: 'Sélectionnez toutes les fonctionnalités que vous souhaitez inclure'
        }
      ]
    }
  ]
}

// Fonction utilitaire pour simuler une réponse de l'agent avec questions
export function createMockQuestionsResponse(message: string): string {
  return `${message}

Pour créer le design parfait, j'ai besoin de quelques informations supplémentaires. Voici un formulaire structuré :

${JSON.stringify(exampleQuestionsResponse, null, 2)}`
} 