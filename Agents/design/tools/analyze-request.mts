import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const analyzeRequest = tool(
  async ({ userMessage }) => {
    // Analyse intelligente du message utilisateur
    const analysis = {
      projectName: null,
      description: null,
      pages: null,
      colors: null,
      style: null,
      missingInfo: []
    };

    const message = userMessage.toLowerCase();

    // Extraction du nom du projet
    const projectRegex = /(nom|appel|projet|entreprise|site)\s*(est|s'appelle|pour|de)?\s*([a-zA-Z0-9\s\-_]+)/i;
    const projectMatch = userMessage.match(projectRegex);
    if (projectMatch) {
      analysis.projectName = projectMatch[3]?.trim();
    }

    // Recherche de mots-clés pour les noms
    const nameKeywords = ['astrosheesh', 'shosho'];
    for (const keyword of nameKeywords) {
      if (message.includes(keyword)) {
        analysis.projectName = keyword;
        break;
      }
    }

    // Extraction de la description/type d'activité
    const activityKeywords = {
      'chaussure': 'site de vente de chaussures en ligne',
      'montre': 'boutique en ligne de montres haut de gamme',
      'shop': 'boutique en ligne moderne',
      'restaurant': 'restaurant avec service de qualité',
      'boutique': 'boutique en ligne moderne',
      'portfolio': 'portfolio professionnel créatif',
      'blog': 'blog personnel ou professionnel',
      'immobilier': 'agence immobilière professionnelle',
      'vente': 'site de vente en ligne'
    };

    for (const [keyword, desc] of Object.entries(activityKeywords)) {
      if (message.includes(keyword)) {
        analysis.description = desc;
        break;
      }
    }

    // Si "vente de montre" ou "shop montre", description plus spécifique
    if (message.includes('montre') && (message.includes('vente') || message.includes('shop'))) {
      analysis.description = 'boutique en ligne de montres haut de gamme avec catalogue produits et paiement sécurisé';
    }

    // Extraction du nombre de pages
    const pageRegex = /(\d+)\s*(page|pages)/i;
    const pageMatch = userMessage.match(pageRegex);
    if (pageMatch) {
      analysis.pages = parseInt(pageMatch[1]);
    }

    // Analyse des couleurs avec logique intelligente
    const colorMappings = {
      'rouge': '3', // Naturelle a du rouge  
      'vert': '3',  // Naturelle a du vert
      'bleu': '1',  // Moderne a du bleu
      'orange': '1', // Moderne a de l'orange
      'violet': '2', // Élégante a du violet
      'rose': '2'    // Élégante a du rose
    };

    // Recherche de combinaisons de couleurs
    if (message.includes('rouge') && message.includes('vert')) {
      analysis.colors = '3'; // Palette Naturelle
    } else if (message.includes('bleu') && message.includes('orange')) {
      analysis.colors = '1'; // Palette Moderne
    } else if (message.includes('violet') && message.includes('rose')) {
      analysis.colors = '2'; // Palette Élégante
    } else {
      // Recherche de couleurs individuelles
      for (const [color, choice] of Object.entries(colorMappings)) {
        if (message.includes(color)) {
          analysis.colors = choice;
          break;
        }
      }
    }

    // Extraction du style
    const styleKeywords = ['moderne', 'modern', 'minimaliste', 'minimal', 'classique', 'classic', 'créatif', 'creative', 'corporate', 'professionnel'];
    for (const style of styleKeywords) {
      if (message.includes(style)) {
        analysis.style = style.includes('modern') ? 'moderne' : 
                        style.includes('minimal') ? 'minimaliste' :
                        style.includes('classic') ? 'classique' :
                        style.includes('creative') || style.includes('créatif') ? 'créatif' :
                        style.includes('corporate') || style.includes('professionnel') ? 'corporate' :
                        style;
        break;
      }
    }

    // Déterminer les informations manquantes
    if (!analysis.projectName) analysis.missingInfo.push('nom du projet');
    if (!analysis.description) analysis.missingInfo.push('description du besoin');
    if (!analysis.pages) analysis.missingInfo.push('nombre de pages');
    if (!analysis.colors) analysis.missingInfo.push('choix de couleurs');
    if (!analysis.style) analysis.missingInfo.push('style de design');

    // Si pas de nombre de pages spécifié, choisir intelligemment selon l'activité
    if (!analysis.pages && analysis.description) {
      if (analysis.description.includes('vente') || analysis.description.includes('boutique')) {
        analysis.pages = 4; // Accueil, Produits, Panier, Contact
      } else if (analysis.description.includes('restaurant')) {
        analysis.pages = 3; // Accueil, Menu, Contact
      } else if (analysis.description.includes('portfolio')) {
        analysis.pages = 3; // Accueil, Portfolio, Contact
      } else {
        analysis.pages = 3; // Par défaut
      }
      // Retirer de la liste des infos manquantes
      analysis.missingInfo = analysis.missingInfo.filter(info => info !== 'nombre de pages');
    }

    // Si des infos manquent, force l'utilisation des composants
    if (analysis.missingInfo.length > 0) {
      // Détermine le composant spécifique à utiliser selon ce qui manque
      let componentsToUse = [];
      
      // Ajouter tous les composants manquants
      if (analysis.missingInfo.includes('nom du projet')) {
        componentsToUse.push('project-name');
      }
      if (analysis.missingInfo.includes('choix de couleurs')) {
        componentsToUse.push('color-picker');
      }
      if (analysis.missingInfo.includes('style de design')) {
        componentsToUse.push('design-style');
      }
      if (analysis.missingInfo.includes('nombre de pages')) {
        componentsToUse.push('page-count');
      }
      
      // Si plusieurs infos manquent, utiliser project-details
      if (componentsToUse.length > 2) {
        componentsToUse = ['project-details'];
      }
      
      const componentJSON = {
        "type": "need_info",
        "message": "Pour créer votre site web, j'ai besoin de quelques informations :",
        "components": componentsToUse,
        "submitText": "✅ Continuer"
      };
      
      return `COMPOSANTS_REQUIS_JSON:
${JSON.stringify(componentJSON, null, 2)}

INSTRUCTION CRITIQUE: Tu DOIS retourner EXACTEMENT ce JSON pour déclencher les composants frontend ! Ne pas écrire de texte libre !`;
    }
    
    // Si toutes les infos sont là, peut procéder
    return `✅ **Analyse complète** - Toutes les informations sont disponibles !

📊 **Informations extraites** :
• Nom : ${analysis.projectName}
• Description : ${analysis.description}
• Pages : ${analysis.pages}
• Couleurs : Palette ${analysis.colors === '1' ? 'Moderne (Bleu & Orange)' : analysis.colors === '2' ? 'Élégante (Violet & Rose)' : 'Naturelle (Vert & Terre)'}
• Style : ${analysis.style}

🚀 **INSTRUCTION** : Utilise maintenant l'outil smartCollectAndGenerate avec ces informations !`;
  },
  {
    name: "analyzeRequest",
    description: "Analyse intelligemment le message de l'utilisateur pour extraire les informations de projet déjà fournies",
    schema: z.object({
      userMessage: z.string().describe("Le message complet de l'utilisateur à analyser")
    }),
  },
); 