import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";

export const generateDesign = tool(
  async ({ sections, additionalFeatures }) => {
    // Récupérer les informations du projet
    const projectInfo = (global as any).currentProjectInfo;
    
    if (!projectInfo) {
      return "❌ Erreur : Aucune information de projet collectée. Veuillez d'abord utiliser l'outil collectProjectInfo.";
    }

    try {
      // Générer le HTML/CSS pour la maquette
      const designHTML = generateWebsiteDesign(projectInfo, sections, additionalFeatures);
      
      // Créer le nom du fichier
      const fileName = `maquette-${projectInfo.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`;
      
      // Chemin vers le dossier Downloads
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const filePath = path.join(downloadsPath, fileName);
      
      // Sauvegarder le fichier
      fs.writeFileSync(filePath, designHTML);
      
      return `🎉 **Maquette générée avec succès !**

📁 **Fichier sauvegardé** : ${fileName}
📍 **Emplacement** : ${filePath}

✨ **Fonctionnalités incluses** :
${sections.map(section => `   • ${section}`).join('\n')}

🔧 **Fonctionnalités additionnelles** :
${additionalFeatures.map(feature => `   • ${feature}`).join('\n')}

💡 **Pour visualiser** : Ouvrez le fichier HTML dans votre navigateur web

🎨 **Palette utilisée** : ${projectInfo.colorScheme.name}
🎭 **Style** : ${projectInfo.style}`;

    } catch (error) {
      return `❌ Erreur lors de la génération : ${error}`;
    }
  },
  {
    name: "generateDesign",
    description: "Génère une maquette HTML complète du site vitrine et la sauvegarde dans Downloads",
    schema: z.object({
      sections: z.array(z.string()).describe("Les sections à inclure dans le site (header, hero, services, contact, etc.)"),
      additionalFeatures: z.array(z.string()).describe("Les fonctionnalités additionnelles (formulaire contact, galerie, témoignages, etc.)")
    }),
  },
);

function generateWebsiteDesign(projectInfo: any, sections: string[], features: string[]) {
  const { name, description, pages, colorScheme, style } = projectInfo;
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Maquette Design</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: ${colorScheme.text};
            background-color: ${colorScheme.background};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        header {
            background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary});
            color: white;
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, ${colorScheme.primary}dd, ${colorScheme.secondary}dd),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect fill="%23f0f0f0" width="1000" height="1000"/><circle fill="%23e0e0e0" cx="200" cy="200" r="100"/><circle fill="%23d0d0d0" cx="800" cy="300" r="150"/><circle fill="%23e0e0e0" cx="400" cy="700" r="120"/></svg>');
            color: white;
            padding: 8rem 0 4rem;
            margin-top: 80px;
            text-align: center;
            background-size: cover;
            background-position: center;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            background: ${colorScheme.accent};
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        /* Sections */
        section {
            padding: 4rem 0;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: ${colorScheme.primary};
        }
        
        /* Services Grid */
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            border-left: 4px solid ${colorScheme.accent};
        }
        
        .service-card:hover {
            transform: translateY(-5px);
        }
        
        .service-icon {
            width: 60px;
            height: 60px;
            background: ${colorScheme.primary};
            border-radius: 50%;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }
        
        /* About Section */
        .about {
            background: linear-gradient(45deg, ${colorScheme.background}, white);
        }
        
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }
        
        .about-image {
            width: 100%;
            height: 400px;
            background: linear-gradient(45deg, ${colorScheme.primary}33, ${colorScheme.secondary}33);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colorScheme.primary};
            font-size: 1.2rem;
        }
        
        /* Gallery */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .gallery-item {
            height: 200px;
            background: linear-gradient(45deg, ${colorScheme.primary}22, ${colorScheme.secondary}22);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colorScheme.primary};
            transition: transform 0.3s;
        }
        
        .gallery-item:hover {
            transform: scale(1.05);
        }
        
        /* Contact */
        .contact {
            background: ${colorScheme.primary};
            color: white;
        }
        
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .submit-btn {
            background: ${colorScheme.accent};
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s;
        }
        
        .submit-btn:hover {
            background: ${colorScheme.secondary};
        }
        
        /* Footer */
        footer {
            background: ${colorScheme.text};
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
            .about-content { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#apropos">À propos</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="accueil">
        <div class="container">
            <h1>Bienvenue chez ${name}</h1>
            <p>${description}</p>
            <a href="#contact" class="cta-button">Contactez-nous</a>
        </div>
    </section>

    ${sections.includes('services') ? `
    <!-- Services Section -->
    <section id="services">
        <div class="container">
            <h2 class="section-title">Nos Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">⭐</div>
                    <h3>Service Premium</h3>
                    <p>Description du service premium avec une qualité exceptionnelle.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">🚀</div>
                    <h3>Solutions Rapides</h3>
                    <p>Des solutions efficaces et rapides pour tous vos besoins.</p>
                </div>
                <div class="service-card">
                    <div class="service-icon">💡</div>
                    <h3>Innovation</h3>
                    <p>Approche innovante et créative pour chaque projet.</p>
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    ${sections.includes('about') || sections.includes('apropos') ? `
    <!-- About Section -->
    <section class="about" id="apropos">
        <div class="container">
            <h2 class="section-title">À Propos de Nous</h2>
            <div class="about-content">
                <div>
                    <h3>À Propos de ${name}</h3>
                    <p>${description}</p>
                    <p>Notre approche ${style} nous permet de nous démarquer et de satisfaire nos clients les plus exigeants.</p>
                    <ul>
                        <li>✓ Expertise reconnue</li>
                        <li>✓ Service personnalisé</li>
                        <li>✓ Satisfaction garantie</li>
                    </ul>
                </div>
                <div class="about-image">
                    Image représentative
                </div>
            </div>
        </div>
    </section>
    ` : ''}

    ${features.includes('galerie') || features.includes('portfolio') ? `
    <!-- Gallery Section -->
    <section id="galerie">
        <div class="container">
            <h2 class="section-title">Notre Galerie</h2>
            <div class="gallery-grid">
                <div class="gallery-item">Projet 1</div>
                <div class="gallery-item">Projet 2</div>
                <div class="gallery-item">Projet 3</div>
                <div class="gallery-item">Projet 4</div>
                <div class="gallery-item">Projet 5</div>
                <div class="gallery-item">Projet 6</div>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <div class="container">
            <h2 class="section-title">Contactez-nous</h2>
            ${features.includes('formulaire') || features.includes('contact') ? `
            <form class="contact-form">
                <div class="form-group">
                    <input type="text" placeholder="Votre nom" required>
                </div>
                <div class="form-group">
                    <input type="email" placeholder="Votre email" required>
                </div>
                <div class="form-group">
                    <textarea rows="5" placeholder="Votre message" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Envoyer le message</button>
            </form>
            ` : `
            <div style="text-align: center;">
                <p>📧 contact@${name.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>📱 +33 1 23 45 67 89</p>
                <p>📍 123 Rue de la Créativité, 75001 Paris</p>
            </div>
            `}
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2024 ${name}. Tous droits réservés. | Design ${style} généré automatiquement</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;
} 