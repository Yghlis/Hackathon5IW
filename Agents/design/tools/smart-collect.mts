import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";

// Import du schéma depuis collect-info
const PageSchema = z.object({
  numero: z.number().min(1).describe("Numéro de la page (1, 2, 3, etc.)"),
  nom: z.string().min(1).describe("Nom/titre de la page (ex: Accueil, À propos, Contact)"),
  description: z.string().min(1).describe("Description de ce que fait cette page et son contenu"),
  sections: z.array(z.string()).optional().describe("Sections principales de cette page (hero, services, témoignages, etc.)")
});

const ProjectSchema = z.object({
  nom: z.string().min(1).describe("Nom du projet/entreprise/site web"),
  description: z.string().min(1).describe("Description complète de l'activité, des objectifs et du public cible"),
  couleur: z.string().min(1).describe("Couleur principale choisie (nom ou code hex)"),
  style: z.enum([
    "modern", "creative", "professional", "elegant", "fun", "natural"
  ]).describe("Style de design choisi parmi les options disponibles"),
  pages: z.array(PageSchema).min(1).max(5).describe("Liste détaillée des pages avec leurs informations")
});

export const smartCollectAndGenerate = tool(
  async ({ projectInfo }) => {
    try {
      // Validation complète avec le schéma Zod
      const validatedProject = ProjectSchema.parse(projectInfo);
      
      // Génération des informations de couleur
      const colorScheme = getColorScheme(validatedProject.couleur);
      
      // Stockage des informations complètes
      const completeProjectInfo = {
        ...validatedProject,
        colorScheme,
        timestamp: new Date().toISOString(),
        totalPages: validatedProject.pages.length
      };

      // Stocker pour l'outil de génération
      (global as any).currentProjectInfo = completeProjectInfo;

      return `🎉 **Projet collecté et validé avec succès !**

📋 **Informations du projet** :
• **Nom** : ${validatedProject.nom}
• **Description** : ${validatedProject.description}
• **Couleur** : ${validatedProject.couleur}
• **Style** : ${validatedProject.style}
• **Nombre de pages** : ${validatedProject.pages.length}

📑 **Structure des pages** :
${validatedProject.pages.map(page => 
  `   ${page.numero}. **${page.nom}**\n      ${page.description}${page.sections ? `\n      Sections: ${page.sections.join(', ')}` : ''}`
).join('\n\n')}

🎨 **Palette de couleurs générée** :
• Primaire : ${colorScheme.primary}
• Secondaire : ${colorScheme.secondary}
• Accent : ${colorScheme.accent}

✅ **Validation Zod** : Tous les champs obligatoires sont présents et valides !

🚀 **Prêt pour la génération** : Utilisez maintenant l'outil generateDesign pour créer la maquette !`;

    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingFields = error.errors.map(err => `${err.path.join('.')} : ${err.message}`).join('\n');
        
        return `❌ **Erreur de validation Zod** - Champs manquants ou invalides :

${missingFields}

🔧 **Champs obligatoires requis** :
• nom (string) : Nom du projet
• description (string) : Description complète
• couleur (string) : Couleur principale
• style (enum) : Style parmi [modern, creative, professional, elegant, fun, natural]
• pages (array) : Liste des pages avec :
  - numero (number) : Numéro de la page
  - nom (string) : Nom de la page
  - description (string) : Description de la page
  - sections (array, optionnel) : Sections de la page

💡 **Action requise** : Collectez toutes les informations manquantes avant de continuer.`;
      }
      
      return `❌ Erreur lors de la collecte : ${error}`;
    }
  },
  {
    name: "smartCollectAndGenerate",
    description: "Collecte et valide les informations complètes du projet selon le schéma Zod/Prisma obligatoire",
    schema: z.object({
      projectInfo: ProjectSchema.describe("Toutes les informations du projet structurées selon le schéma Zod")
    }),
  },
);

// Outil pour convertir les réponses des composants frontend en structure Zod
export const convertComponentAnswers = tool(
  async ({ nom, description, couleur, style, nombrePages }) => {
    // Génération automatique des pages selon les informations fournies
    const pages = generatePagesFromInfo(nombrePages, description, nom);
    
    // Conversion du style frontend vers enum Zod
    const styleMapping: { [key: string]: "modern" | "creative" | "professional" | "elegant" | "fun" | "natural" } = {
      "Moderne & Minimaliste": "modern",
      "Créatif & Artistique": "creative", 
      "Professionnel & Corporate": "professional",
      "Élégant & Luxe": "elegant",
      "Ludique & Dynamique": "fun",
      "Naturel & Organic": "natural"
    };

    const projectInfo = {
      nom,
      description,
      couleur,
      style: styleMapping[style] || "modern",
      pages
    };

    // Appeler l'outil de collecte principal
    return await smartCollectAndGenerate.invoke({ projectInfo });
  },
  {
    name: "convertComponentAnswers",
    description: "Convertit les réponses des composants frontend en structure Zod valide",
    schema: z.object({
      nom: z.string().describe("Nom du projet depuis le composant"),
      description: z.string().describe("Description du projet depuis le composant"),
      couleur: z.string().describe("Couleur choisie depuis le composant"),
      style: z.string().describe("Style choisi depuis le composant"),
      nombrePages: z.number().describe("Nombre de pages choisi depuis le composant")
    }),
  },
);

// Fonctions utilitaires
function generatePagesFromInfo(numberOfPages: number, description: string, projectName: string) {
  const pages = [];
  
  // Page 1 - Toujours Accueil
  pages.push({
    numero: 1,
    nom: "Accueil",
    description: `Page d'accueil principale présentant ${projectName} et son activité : ${description}`,
    sections: ["hero", "presentation", "services-apercu", "call-to-action"]
  });

  if (numberOfPages >= 2) {
    // Déterminer la page 2 selon l'activité
    if (description.toLowerCase().includes('restaurant') || description.toLowerCase().includes('café')) {
      pages.push({
        numero: 2,
        nom: "Menu",
        description: "Présentation complète du menu, spécialités et tarifs",
        sections: ["categories-menu", "plats-signature", "boissons", "desserts", "prix"]
      });
    } else if (description.toLowerCase().includes('boutique') || description.toLowerCase().includes('vente') || description.toLowerCase().includes('e-commerce')) {
      pages.push({
        numero: 2,
        nom: "Produits",
        description: "Catalogue complet des produits avec descriptions et prix",
        sections: ["catalogue", "categories", "produits-phares", "filtres", "panier"]
      });
    } else if (description.toLowerCase().includes('portfolio') || description.toLowerCase().includes('créatif') || description.toLowerCase().includes('artiste')) {
      pages.push({
        numero: 2,
        nom: "Portfolio",
        description: "Galerie des créations, projets et réalisations",
        sections: ["galerie", "projets-recents", "competences", "processus-creatif"]
      });
    } else if (description.toLowerCase().includes('immobilier') || description.toLowerCase().includes('agence')) {
      pages.push({
        numero: 2,
        nom: "Biens",
        description: "Catalogue des biens immobiliers disponibles",
        sections: ["recherche", "biens-featured", "types-biens", "secteurs"]
      });
    } else {
      pages.push({
        numero: 2,
        nom: "Services",
        description: "Détail des services proposés et expertise",
        sections: ["services-detailles", "processus", "avantages", "tarifs"]
      });
    }
  }

  if (numberOfPages >= 3) {
    pages.push({
      numero: 3,
      nom: "À propos",
      description: `Présentation de l'équipe, histoire et valeurs de ${projectName}`,
      sections: ["histoire", "equipe", "valeurs", "mission", "vision"]
    });
  }

  if (numberOfPages >= 4) {
    if (description.toLowerCase().includes('restaurant')) {
      pages.push({
        numero: 4,
        nom: "Réservation",
        description: "Système de réservation en ligne et informations pratiques",
        sections: ["formulaire-reservation", "horaires", "localisation", "contact"]
      });
    } else {
      pages.push({
        numero: 4,
        nom: "Réalisations",
        description: "Exemples de projets réalisés et témoignages clients",
        sections: ["projets-realises", "temoignages", "references", "etudes-cas"]
      });
    }
  }

  if (numberOfPages >= 5) {
    pages.push({
      numero: 5,
      nom: "Contact",
      description: "Informations de contact et formulaire de demande",
      sections: ["coordonnees", "formulaire-contact", "localisation", "horaires", "reseaux-sociaux"]
    });
  } else if (numberOfPages < 5) {
    // Toujours ajouter Contact en dernière page
    pages.push({
      numero: numberOfPages,
      nom: "Contact", 
      description: "Informations de contact et formulaire de demande",
      sections: ["coordonnees", "formulaire-contact", "localisation"]
    });
  }

  return pages;
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

  // Mapping des couleurs des composants frontend
  const colorSchemes: { [key: string]: any } = {
    "bleu": {
      name: "Palette Moderne (Bleu)",
      primary: "#2563EB",
      secondary: "#F59E0B", 
      accent: "#10B981",
      background: "#F8FAFC",
      text: "#1E293B"
    },
    "vert": {
      name: "Palette Naturelle (Vert)",
      primary: "#059669",
      secondary: "#D97706",
      accent: "#DC2626",
      background: "#F7F8FA",
      text: "#1F2937"
    },
    "rouge": {
      name: "Palette Dynamique (Rouge)",
      primary: "#DC2626",
      secondary: "#F59E0B",
      accent: "#059669",
      background: "#FEF2F2",
      text: "#1F2937"
    },
    "orange": {
      name: "Palette Énergique (Orange)",
      primary: "#EA580C",
      secondary: "#2563EB",
      accent: "#059669",
      background: "#FFF7ED",
      text: "#1F2937"
    },
    "violet": {
      name: "Palette Élégante (Violet)",
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#FEFEFE",
      text: "#374151"
    },
    "jaune": {
      name: "Palette Lumineuse (Jaune)",
      primary: "#F59E0B",
      secondary: "#2563EB",
      accent: "#DC2626",
      background: "#FFFBEB",
      text: "#1F2937"
    },
    "turquoise": {
      name: "Palette Fraîche (Turquoise)",
      primary: "#06B6D4",
      secondary: "#F59E0B",
      accent: "#DC2626",
      background: "#F0FDFA",
      text: "#1F2937"
    },
    "rose": {
      name: "Palette Douce (Rose)",
      primary: "#EC4899",
      secondary: "#7C3AED",
      accent: "#059669",
      background: "#FDF2F8",
      text: "#1F2937"
    },
    "gris": {
      name: "Palette Neutre (Gris)",
      primary: "#6B7280",
      secondary: "#F59E0B",
      accent: "#059669",
      background: "#F9FAFB",
      text: "#1F2937"
    },
    "noir": {
      name: "Palette Élégante (Noir)",
      primary: "#1F2937",
      secondary: "#F59E0B",
      accent: "#DC2626",
      background: "#FFFFFF",
      text: "#1F2937"
    }
  };

  const colorName = color.toLowerCase();
  return colorSchemes[colorName] || colorSchemes["bleu"];
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function generateWebsiteDesign(projectInfo: any) {
  const { name, description, pages, colorScheme, style } = projectInfo;
  
  // Si on a plusieurs pages, générer plusieurs fichiers
  if (pages > 1) {
    return generateMultiPageWebsite(projectInfo);
  }
  
  // Page unique (code existant)
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Site ${style}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: ${colorScheme.text}; 
            background: ${colorScheme.background}; 
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        header { 
            background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); 
            color: white; 
            padding: 1rem 0; 
            position: fixed; 
            width: 100%; 
            top: 0; 
            z-index: 1000; 
        }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: bold; }
        
        .hero { 
            background: linear-gradient(135deg, ${colorScheme.primary}dd, ${colorScheme.secondary}dd); 
            color: white; 
            padding: 8rem 0 4rem; 
            margin-top: 80px; 
            text-align: center; 
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .cta-button { 
            background: ${colorScheme.accent}; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 30px; 
            font-weight: bold; 
        }
        
        .section { padding: 4rem 0; }
        .section-title { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: ${colorScheme.primary}; }
        
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .service-card { 
            background: white; 
            padding: 2rem; 
            border-radius: 10px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            border-left: 4px solid ${colorScheme.accent}; 
        }
        
        .contact { background: ${colorScheme.primary}; color: white; padding: 4rem 0; text-align: center; }
        footer { background: ${colorScheme.text}; color: white; text-align: center; padding: 2rem 0; }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
        </nav>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Bienvenue chez ${name}</h1>
            <p>${description}</p>
            <a href="#contact" class="cta-button">Contactez-nous</a>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 class="section-title">Nos Services</h2>
            <div class="services">
                <div class="service-card">
                    <h3>Service Premium</h3>
                    <p>Description du service avec qualité exceptionnelle.</p>
                </div>
                <div class="service-card">
                    <h3>Solutions Rapides</h3>
                    <p>Des solutions efficaces pour tous vos besoins.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <div class="container">
            <h2>Contactez-nous</h2>
            <p>📧 contact@${name.toLowerCase()}.fr</p>
            <p>📱 +33 1 23 45 67 89</p>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>`;
}

function generateMultiPageWebsite(projectInfo: any) {
  const { name, description, pages, colorScheme, style } = projectInfo;
  
  // Générer le CSS commun
  const commonCSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: ${colorScheme.text}; 
            background: ${colorScheme.background}; 
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        header { 
            background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); 
            color: white; 
            padding: 1rem 0; 
            position: fixed; 
            width: 100%; 
            top: 0; 
            z-index: 1000; 
        }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: bold; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { color: white; text-decoration: none; transition: opacity 0.3s; }
        .nav-links a:hover { opacity: 0.8; }
        
        .main-content { margin-top: 100px; padding: 2rem 0; min-height: 60vh; }
        .section-title { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: ${colorScheme.primary}; }
        
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .service-card { 
            background: white; 
            padding: 2rem; 
            border-radius: 10px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            border-left: 4px solid ${colorScheme.accent}; 
        }
        
        .contact-form { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 1rem; }
        .form-group input, .form-group textarea { 
            width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; 
        }
        .submit-btn { 
            background: ${colorScheme.primary}; color: white; padding: 12px 30px; 
            border: none; border-radius: 5px; cursor: pointer; 
        }
        
        footer { background: ${colorScheme.text}; color: white; text-align: center; padding: 2rem 0; }
  `;

  // Définir les liens de navigation selon le nombre de pages
  const navLinks = generateNavLinks(pages);
  
  // Page d'accueil (toujours présente)
  const indexPage = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Accueil</title>
    <style>${commonCSS}</style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section style="background: linear-gradient(135deg, ${colorScheme.primary}dd, ${colorScheme.secondary}dd); color: white; padding: 4rem 0; text-align: center; margin: -2rem 0 4rem;">
            <div class="container">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">Bienvenue chez ${name}</h1>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">${description}</p>
                <a href="contact.html" style="background: ${colorScheme.accent}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold;">Contactez-nous</a>
            </div>
        </section>
        
        <section class="container">
            <h2 class="section-title">Présentation</h2>
            <p style="text-align: center; font-size: 1.1rem; max-width: 800px; margin: 0 auto;">
                Découvrez ${name}, ${description.toLowerCase()}. Nous nous engageons à vous offrir un service de qualité 
                avec une approche ${style} qui nous distingue de la concurrence.
            </p>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>`;

  // Créer un ZIP contenant toutes les pages
  let zipContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Site Multi-Pages</title>
</head>
<body>
    <h1>Site ${name} - ${pages} pages générées</h1>
    <p>Voici les fichiers générés pour votre site multi-pages :</p>
    <ul>
        <li><strong>index.html</strong> - Page d'accueil</li>`;

  // Ajouter les autres pages selon le nombre demandé
  if (pages >= 2) {
    zipContent += `<li><strong>services.html</strong> - Page des services</li>`;
  }
  if (pages >= 3) {
    zipContent += `<li><strong>about.html</strong> - Page à propos</li>`;
  }
  if (pages >= 4) {
    zipContent += `<li><strong>contact.html</strong> - Page de contact</li>`;
  }
  if (pages >= 5) {
    zipContent += `<li><strong>portfolio.html</strong> - Page portfolio</li>`;
  }

  zipContent += `</ul>
    <hr>
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>📄 Page d'accueil (index.html)</h2>
        <div style="border: 1px solid #ddd; background: white; margin: 10px 0;">
            ${indexPage}
        </div>
    </div>`;

  // Ajouter les autres pages si nécessaire
  if (pages >= 2) {
    zipContent += generateServicesPage(projectInfo, navLinks, commonCSS);
  }
  if (pages >= 3) {
    zipContent += generateAboutPage(projectInfo, navLinks, commonCSS);
  }
  if (pages >= 4) {
    zipContent += generateContactPage(projectInfo, navLinks, commonCSS);
  }
  if (pages >= 5) {
    zipContent += generatePortfolioPage(projectInfo, navLinks, commonCSS);
  }

  zipContent += `
    <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); color: white; border-radius: 10px; text-align: center;">
        <h3>🎨 Votre site ${pages} pages est prêt !</h3>
        <p>Copiez chaque section HTML dans des fichiers séparés pour avoir votre site multi-pages complet.</p>
    </div>
  </body>
  </html>`;

  return zipContent;
}

function generateNavLinks(pages: number): string {
  let links = '<li><a href="index.html">Accueil</a></li>';
  
  if (pages >= 2) links += '<li><a href="services.html">Services</a></li>';
  if (pages >= 3) links += '<li><a href="about.html">À propos</a></li>';
  if (pages >= 4) links += '<li><a href="contact.html">Contact</a></li>';
  if (pages >= 5) links += '<li><a href="portfolio.html">Portfolio</a></li>';
  
  return links;
}

function generateServicesPage(projectInfo: any, navLinks: string, commonCSS: string): string {
  const { name, description, colorScheme, style } = projectInfo;
  
  return `
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>🛠️ Page Services (services.html)</h2>
        <div style="border: 1px solid #ddd; background: white; margin: 10px 0;">
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Services</title>
    <style>${commonCSS}</style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <div class="container">
            <h1 class="section-title">Nos Services</h1>
            <div class="services">
                <div class="service-card">
                    <h3>Service Premium</h3>
                    <p>Description détaillée du service premium avec qualité exceptionnelle et support personnalisé.</p>
                    <ul>
                        <li>✓ Support 24/7</li>
                        <li>✓ Garantie qualité</li>
                        <li>✓ Service personnalisé</li>
                    </ul>
                </div>
                <div class="service-card">
                    <h3>Solutions Rapides</h3>
                    <p>Des solutions efficaces et rapides pour tous vos besoins urgents et quotidiens.</p>
                    <ul>
                        <li>✓ Intervention rapide</li>
                        <li>✓ Solutions sur mesure</li>
                        <li>✓ Tarifs compétitifs</li>
                    </ul>
                </div>
                <div class="service-card">
                    <h3>Conseil Expert</h3>
                    <p>Bénéficiez de notre expertise avec des conseils personnalisés pour vos projets.</p>
                    <ul>
                        <li>✓ Consultation gratuite</li>
                        <li>✓ Expertise reconnue</li>
                        <li>✓ Accompagnement complet</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>
        </div>
    </div>`;
}

function generateAboutPage(projectInfo: any, navLinks: string, commonCSS: string): string {
  const { name, description, colorScheme, style } = projectInfo;
  
  return `
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>ℹ️ Page À propos (about.html)</h2>
        <div style="border: 1px solid #ddd; background: white; margin: 10px 0;">
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - À propos</title>
    <style>${commonCSS}</style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <div class="container">
            <h1 class="section-title">À propos de ${name}</h1>
            
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                    ${description} avec une approche ${style} qui nous permet de nous démarquer dans notre domaine.
                </p>
                
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin: 2rem 0;">
                    <h3 style="color: ${colorScheme.primary}; margin-bottom: 1rem;">Notre Mission</h3>
                    <p>Offrir un service de qualité exceptionnelle en alliant expertise technique et approche humaine pour satisfaire nos clients les plus exigeants.</p>
                </div>
                
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin: 2rem 0;">
                    <h3 style="color: ${colorScheme.primary}; margin-bottom: 1rem;">Nos Valeurs</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 0.5rem 0;">🎯 Excellence et professionnalisme</li>
                        <li style="margin: 0.5rem 0;">🤝 Écoute et proximité client</li>
                        <li style="margin: 0.5rem 0;">🚀 Innovation et modernité</li>
                        <li style="margin: 0.5rem 0;">✨ Satisfaction garantie</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>
        </div>
    </div>`;
}

function generateContactPage(projectInfo: any, navLinks: string, commonCSS: string): string {
  const { name, description, colorScheme, style } = projectInfo;
  
  return `
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>📞 Page Contact (contact.html)</h2>
        <div style="border: 1px solid #ddd; background: white; margin: 10px 0;">
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Contact</title>
    <style>${commonCSS}</style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <div class="container">
            <h1 class="section-title">Contactez-nous</h1>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin: 2rem 0;">
                <div>
                    <h3 style="color: ${colorScheme.primary}; margin-bottom: 1rem;">Formulaire de contact</h3>
                    <form class="contact-form">
                        <div class="form-group">
                            <label>Nom complet *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Téléphone</label>
                            <input type="tel">
                        </div>
                        <div class="form-group">
                            <label>Sujet</label>
                            <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                <option>Demande d'information</option>
                                <option>Devis gratuit</option>
                                <option>Support technique</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Message *</label>
                            <textarea rows="5" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Envoyer le message</button>
                    </form>
                </div>
                
                <div>
                    <h3 style="color: ${colorScheme.primary}; margin-bottom: 1rem;">Informations de contact</h3>
                    <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <p style="margin: 1rem 0;"><strong>📧 Email :</strong> contact@${name.toLowerCase().replace(/\s+/g, '')}.fr</p>
                        <p style="margin: 1rem 0;"><strong>📱 Téléphone :</strong> +33 1 23 45 67 89</p>
                        <p style="margin: 1rem 0;"><strong>📍 Adresse :</strong> 123 Rue de la Créativité<br>75001 Paris, France</p>
                        <p style="margin: 1rem 0;"><strong>🕒 Horaires :</strong><br>
                            Lundi - Vendredi : 9h - 18h<br>
                            Samedi : 9h - 12h</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); color: white; padding: 2rem; border-radius: 10px; margin-top: 2rem; text-align: center;">
                        <h4>Réponse garantie sous 24h</h4>
                        <p>Notre équipe s'engage à vous répondre rapidement pour toute demande.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>
        </div>
    </div>`;
}

function generatePortfolioPage(projectInfo: any, navLinks: string, commonCSS: string): string {
  const { name, description, colorScheme, style } = projectInfo;
  
  return `
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>🎨 Page Portfolio (portfolio.html)</h2>
        <div style="border: 1px solid #ddd; background: white; margin: 10px 0;">
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio</title>
    <style>
        ${commonCSS}
        .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .portfolio-item { 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            transition: transform 0.3s; 
        }
        .portfolio-item:hover { transform: translateY(-5px); }
        .portfolio-image { 
            height: 200px; 
            background: linear-gradient(135deg, ${colorScheme.primary}33, ${colorScheme.secondary}33); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 3rem; 
        }
        .portfolio-content { padding: 1.5rem; }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                ${navLinks}
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <div class="container">
            <h1 class="section-title">Notre Portfolio</h1>
            <p style="text-align: center; margin-bottom: 3rem; font-size: 1.1rem;">
                Découvrez quelques-unes de nos réalisations qui illustrent notre savoir-faire ${style}.
            </p>
            
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <div class="portfolio-image">🎯</div>
                    <div class="portfolio-content">
                        <h3>Projet Premium</h3>
                        <p>Réalisation d'un projet d'envergure avec une approche ${style} sur mesure.</p>
                        <small style="color: ${colorScheme.secondary};">2024</small>
                    </div>
                </div>
                
                <div class="portfolio-item">
                    <div class="portfolio-image">🚀</div>
                    <div class="portfolio-content">
                        <h3>Solution Innovante</h3>
                        <p>Développement d'une solution créative répondant aux besoins spécifiques du client.</p>
                        <small style="color: ${colorScheme.secondary};">2024</small>
                    </div>
                </div>
                
                <div class="portfolio-item">
                    <div class="portfolio-image">💡</div>
                    <div class="portfolio-content">
                        <h3>Concept Créatif</h3>
                        <p>Conception et réalisation d'un concept original avec une approche ${style}.</p>
                        <small style="color: ${colorScheme.secondary};">2023</small>
                    </div>
                </div>
                
                <div class="portfolio-item">
                    <div class="portfolio-image">⭐</div>
                    <div class="portfolio-content">
                        <h3>Excellence Reconnue</h3>
                        <p>Projet récompensé pour sa qualité exceptionnelle et son innovation.</p>
                        <small style="color: ${colorScheme.secondary};">2023</small>
                    </div>
                </div>
                
                <div class="portfolio-item">
                    <div class="portfolio-image">🎨</div>
                    <div class="portfolio-content">
                        <h3>Design Moderne</h3>
                        <p>Création d'une identité visuelle ${style} pour une entreprise dynamique.</p>
                        <small style="color: ${colorScheme.secondary};">2023</small>
                    </div>
                </div>
                
                <div class="portfolio-item">
                    <div class="portfolio-image">🏆</div>
                    <div class="portfolio-content">
                        <h3>Succès Client</h3>
                        <p>Collaboration réussie ayant dépassé les attentes du client final.</p>
                        <small style="color: ${colorScheme.secondary};">2023</small>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin: 3rem 0;">
                <a href="contact.html" style="background: ${colorScheme.primary}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    Discutons de votre projet
                </a>
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Design ${style} généré automatiquement.</p>
        </div>
    </footer>
</body>
</html>
        </div>
    </div>`;
} 