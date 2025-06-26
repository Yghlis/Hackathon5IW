import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';

export const generateWebsiteCode = tool(
  async ({ projectName, pages, businessDescription, style, colors, content }) => {
    try {
      console.log(`💻 Génération du code pour: ${projectName}`);
      
      // Créer le dossier du projet
      const projectPath = path.join(process.cwd(), 'generated-sites', projectName.toLowerCase().replace(/\s+/g, '-'));
      await fs.mkdir(projectPath, { recursive: true });
      
      // Générer le CSS global
      const globalCSS = `
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variables CSS */
:root {
  --primary-color: ${colors.primary || '#667eea'};
  --secondary-color: ${colors.secondary || '#764ba2'};
  --accent-color: ${colors.accent || '#f093fb'};
  --text-dark: #2c3e50;
  --text-light: #6c757d;
  --bg-light: #f8f9fa;
  --white: #ffffff;
}

/* Typography */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
  background-color: var(--bg-light);
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  margin-bottom: 1rem;
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.header {
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  padding: 4rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--accent-color);
  color: var(--white);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Sections */
.section {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

/* Cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  background: var(--white);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* Footer */
.footer {
  background: var(--text-dark);
  color: var(--white);
  padding: 2rem 0;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
}`;

      // Générer la page d'accueil
      const indexHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <meta name="description" content="${businessDescription}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="navbar">
                <a href="#" class="logo">${projectName}</a>
                <ul class="nav-menu">
                    ${pages.map(page => `<li><a href="${page.toLowerCase().replace(/\s+/g, '-')}.html" class="nav-link">${page}</a></li>`).join('\n                    ')}
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>${content.heroTitle || `Bienvenue chez ${projectName}`}</h1>
                <p>${content.heroSubtitle || businessDescription}</p>
                <a href="#contact" class="btn">Nous contacter</a>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="section-title">Nos Services</h2>
                <div class="cards-grid">
                    ${content.services?.map(service => `
                    <div class="card">
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                    </div>`).join('') || `
                    <div class="card">
                        <h3>Service 1</h3>
                        <p>Description de votre premier service.</p>
                    </div>
                    <div class="card">
                        <h3>Service 2</h3>
                        <p>Description de votre deuxième service.</p>
                    </div>
                    <div class="card">
                        <h3>Service 3</h3>
                        <p>Description de votre troisième service.</p>
                    </div>`}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${projectName}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`;

      // Sauvegarder les fichiers
      await fs.writeFile(path.join(projectPath, 'index.html'), indexHTML);
      await fs.writeFile(path.join(projectPath, 'styles.css'), globalCSS);
      
      // Créer package.json pour Vercel
      const packageJson = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: "1.0.0",
        description: businessDescription,
        main: "index.html",
        scripts: {
          "start": "npx serve ."
        }
      };
      
      await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

      return {
        success: true,
        projectPath: projectPath,
        projectName: projectName,
        message: `✅ Code généré avec succès ! 💻\n\nFichiers créés :\n- index.html\n- styles.css\n- package.json\n\nProjet prêt pour le déploiement ! 🚀`,
        filesGenerated: ['index.html', 'styles.css', 'package.json']
      };
      
    } catch (error) {
      console.error('❌ Erreur génération code:', error);
      return {
        success: false,
        error: `Impossible de générer le code: ${error.message}`,
        message: "❌ Erreur lors de la génération du code. Veuillez réessayer."
      };
    }
  },
  {
    name: "generateWebsiteCode",
    description: "Génère le code HTML/CSS complet d'un site web basé sur les spécifications",
    schema: z.object({
      projectName: z.string().describe("Nom du projet/site web"),
      pages: z.array(z.string()).describe("Liste des pages à créer (ex: ['Accueil', 'À propos', 'Services', 'Contact'])"),
      businessDescription: z.string().describe("Description de l'activité/business"),
      style: z.string().describe("Style de design (moderne, classique, minimaliste, etc.)"),
      colors: z.object({
        primary: z.string().optional().describe("Couleur primaire (hex)"),
        secondary: z.string().optional().describe("Couleur secondaire (hex)"),
        accent: z.string().optional().describe("Couleur d'accent (hex)")
      }).describe("Palette de couleurs"),
      content: z.object({
        heroTitle: z.string().optional().describe("Titre principal de la hero section"),
        heroSubtitle: z.string().optional().describe("Sous-titre de la hero section"),
        services: z.array(z.object({
          title: z.string(),
          description: z.string()
        })).optional().describe("Liste des services avec titre et description")
      }).describe("Contenu personnalisé du site")
    }),
  }
); 