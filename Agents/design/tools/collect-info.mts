import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Schéma Zod pour une page individuelle
const PageSchema = z.object({
  numero: z.number().min(1).describe("Numéro de la page (1, 2, 3, etc.)"),
  nom: z.string().min(1).describe("Nom/titre de la page (ex: Accueil, À propos, Contact)"),
  description: z.string().min(1).describe("Description de ce que fait cette page et son contenu"),
  sections: z.array(z.string()).optional().describe("Sections principales de cette page (hero, services, témoignages, etc.)")
});

// Schéma Zod principal pour le projet complet
const ProjectSchema = z.object({
  nom: z.string().min(1).describe("Nom du projet/entreprise/site web"),
  description: z.string().min(1).describe("Description complète de l'activité, des objectifs et du public cible"),
  couleur: z.string().min(1).describe("Couleur principale choisie (nom ou code hex)"),
  style: z.enum([
    "modern", "creative", "professional", "elegant", "fun", "natural"
  ]).describe("Style de design choisi parmi les options disponibles"),
  pages: z.array(PageSchema).min(1).max(5).describe("Liste détaillée des pages avec leurs informations")
});

export const collectCompleteProjectInfo = tool(
  async ({ nom, description, couleur, style, pages }) => {
    // Validation des données avec le schéma Zod
    const validatedProject = ProjectSchema.parse({
      nom,
      description,
      couleur,
      style,
      pages
    });

    // Stockage des informations validées
    const projectInfo = {
      ...validatedProject,
      colorScheme: getColorScheme(couleur),
      timestamp: new Date().toISOString(),
      totalPages: pages.length
    };

    // Stocker dans une variable globale pour l'outil de génération
    (global as any).currentProjectInfo = projectInfo;

    return `✅ **Projet complet collecté et validé avec succès !**
    
📝 **Nom du projet** : ${nom}
📋 **Description** : ${description}
🎨 **Couleur principale** : ${couleur}
🎭 **Style de design** : ${style}
📄 **Nombre total de pages** : ${pages.length}

📑 **Détail des pages** :
${pages.map(page => `   ${page.numero}. **${page.nom}** - ${page.description}`).join('\n')}

🎨 **Palette générée** : ${projectInfo.colorScheme.name}
   - Primaire : ${projectInfo.colorScheme.primary}
   - Secondaire : ${projectInfo.colorScheme.secondary}
   - Accent : ${projectInfo.colorScheme.accent}

🚀 **Prêt pour la génération !** Toutes les informations obligatoires sont collectées selon le schéma Zod/Prisma.`;
  },
  {
    name: "collectCompleteProjectInfo",
    description: "Collecte TOUTES les informations obligatoires du projet selon le schéma Zod/Prisma : nom, description, couleur, style, et détails complets des pages",
    schema: ProjectSchema,
  },
);

// Outil pour collecter les informations étape par étape (compatible avec les composants frontend)
export const collectProjectInfo = tool(
  async ({ projectName, projectDescription, numberOfPages, colorChoice, designStyle }) => {
    // Génération automatique des pages selon le nombre et le type d'activité
    const pages = generateDefaultPages(numberOfPages, projectDescription, projectName);
    
    // Utiliser le nouvel outil complet
    return await collectCompleteProjectInfo.invoke({
      nom: projectName,
      description: projectDescription,
      couleur: getColorFromChoice(colorChoice),
      style: mapDesignStyle(designStyle),
      pages: pages
    });
  },
  {
    name: "collectProjectInfo",
    description: "Collecte les informations de base et génère automatiquement la structure des pages",
    schema: z.object({
      projectName: z.string().describe("Le nom du projet/entreprise"),
      projectDescription: z.string().describe("Description détaillée de l'activité et des objectifs"),
      numberOfPages: z.number().min(1).max(5).describe("Nombre de pages à générer (entre 1 et 5)"),
      colorChoice: z.enum(["1", "2", "3"]).describe("Choix de palette de couleurs : 1=Moderne(Bleu&Orange), 2=Élégante(Violet&Rose), 3=Naturelle(Vert&Terre)"),
      designStyle: z.enum([
        "moderne", "minimaliste", "classique", "créatif", "corporate", 
        "vintage", "futuriste", "naturel", "professionnel", "artistique"
      ]).describe("Style de design souhaité")
    }),
  },
);

// Fonctions utilitaires
function generateDefaultPages(numberOfPages: number, description: string, projectName: string) {
  const pages = [];
  
  // Page 1 - Toujours Accueil
  pages.push({
    numero: 1,
    nom: "Accueil",
    description: `Page d'accueil principale de ${projectName} présentant l'activité : ${description}`,
    sections: ["hero", "presentation", "services-apercu"]
  });

  if (numberOfPages >= 2) {
    // Déterminer la page 2 selon l'activité
    if (description.toLowerCase().includes('restaurant')) {
      pages.push({
        numero: 2,
        nom: "Menu",
        description: "Présentation complète du menu et des spécialités du restaurant",
        sections: ["menu-categories", "plats-signature", "prix"]
      });
    } else if (description.toLowerCase().includes('boutique') || description.toLowerCase().includes('vente')) {
      pages.push({
        numero: 2,
        nom: "Produits",
        description: "Catalogue des produits disponibles avec descriptions et prix",
        sections: ["catalogue", "categories", "produits-phares"]
      });
    } else if (description.toLowerCase().includes('portfolio')) {
      pages.push({
        numero: 2,
        nom: "Portfolio",
        description: "Galerie des réalisations et projets créatifs",
        sections: ["galerie", "projets-recents", "competences"]
      });
    } else {
      pages.push({
        numero: 2,
        nom: "Services",
        description: "Détail des services proposés et de l'expertise",
        sections: ["services-detailles", "processus", "avantages"]
      });
    }
  }

  if (numberOfPages >= 3) {
    pages.push({
      numero: 3,
      nom: "À propos",
      description: `Histoire, valeurs et équipe de ${projectName}`,
      sections: ["histoire", "equipe", "valeurs", "mission"]
    });
  }

  if (numberOfPages >= 4) {
    pages.push({
      numero: 4,
      nom: "Réalisations",
      description: "Exemples de projets réalisés et témoignages clients",
      sections: ["projets", "temoignages", "references"]
    });
  }

  if (numberOfPages >= 5) {
    pages.push({
      numero: 5,
      nom: "Contact",
      description: "Informations de contact et formulaire de demande",
      sections: ["coordonnees", "formulaire", "localisation", "horaires"]
    });
  } else {
    // Toujours ajouter Contact en dernière page si pas déjà 5 pages
    pages.push({
      numero: numberOfPages,
      nom: "Contact",
      description: "Informations de contact et formulaire de demande",
      sections: ["coordonnees", "formulaire", "localisation"]
    });
  }

  return pages;
}

function getColorFromChoice(choice: string): string {
  const colorMap = {
    "1": "#007bff", // Bleu moderne
    "2": "#6f42c1", // Violet élégant  
    "3": "#28a745"  // Vert naturel
  };
  return colorMap[choice as keyof typeof colorMap] || "#007bff";
}

function mapDesignStyle(style: string): "modern" | "creative" | "professional" | "elegant" | "fun" | "natural" {
  const styleMap: { [key: string]: "modern" | "creative" | "professional" | "elegant" | "fun" | "natural" } = {
    "moderne": "modern",
    "minimaliste": "modern", 
    "créatif": "creative",
    "artistique": "creative",
    "professionnel": "professional",
    "corporate": "professional",
    "classique": "elegant",
    "vintage": "elegant",
    "futuriste": "fun",
    "naturel": "natural"
  };
  return styleMap[style] || "modern";
}

function getColorScheme(color: string) {
  // Si c'est un code hex, l'utiliser directement
  if (color.startsWith('#')) {
    return {
      name: `Palette personnalisée (${color})`,
      primary: color,
      secondary: adjustColor(color, 30),
      accent: adjustColor(color, -30),
      background: "#F8FAFC",
      text: "#1E293B"
    };
  }

  // Sinon utiliser les palettes prédéfinies
  const colorSchemes: { [key: string]: any } = {
    "bleu": {
      name: "Palette Moderne (Bleu)",
      primary: "#2563EB",
      secondary: "#F59E0B", 
      accent: "#10B981",
      background: "#F8FAFC",
      text: "#1E293B"
    },
    "violet": {
      name: "Palette Élégante (Violet)",
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#FEFEFE",
      text: "#374151"
    },
    "vert": {
      name: "Palette Naturelle (Vert)",
      primary: "#059669",
      secondary: "#D97706",
      accent: "#DC2626",
      background: "#F7F8FA",
      text: "#1F2937"
    }
  };

  const colorName = color.toLowerCase();
  return colorSchemes[colorName] || colorSchemes["bleu"];
}

function adjustColor(hex: string, percent: number): string {
  // Fonction utilitaire pour ajuster la luminosité d'une couleur
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
} 