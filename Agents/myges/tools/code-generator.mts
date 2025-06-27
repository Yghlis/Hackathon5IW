import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from "openai";

// 🎨 Templates inspirés de TemplateMo avec différents styles
const TEMPLATEMO_TEMPLATES = {
  restaurant: {
    name: "Template Restaurant",
    description: "Template moderne pour restaurants, cafés, boulangeries",
    colors: {
      primary: "#ff6b35",
      secondary: "#004e89", 
      accent: "#ffd23f"
    },
    style: "moderne avec images de haute qualité"
  },
  business: {
    name: "Template Business",
    description: "Template professionnel pour entreprises et services",
    colors: {
      primary: "#2c3e50",
      secondary: "#3498db",
      accent: "#e74c3c"
    },
    style: "corporatif et élégant"
  },
  creative: {
    name: "Template Créatif",
    description: "Template coloré pour agences créatives et portfolios",
    colors: {
      primary: "#9b59b6",
      secondary: "#e67e22",
      accent: "#1abc9c"
    },
    style: "moderne et coloré"
  },
  medical: {
    name: "Template Médical",
    description: "Template pour professionnels de santé",
    colors: {
      primary: "#27ae60",
      secondary: "#34495e",
      accent: "#3498db"
    },
    style: "propre et professionnel"
  },
  fashion: {
    name: "Template Mode",
    description: "Template élégant pour mode et lifestyle",
    colors: {
      primary: "#c0392b",
      secondary: "#2c3e50",
      accent: "#f39c12"
    },
    style: "élégant et tendance"
  }
};

// 🎯 Fonction pour choisir le template approprié selon le business
function selectTemplateForBusiness(businessDescription: string, businessType: string): any {
  const description = (businessDescription + " " + businessType).toLowerCase();
  
  if (description.includes('restaurant') || description.includes('café') || description.includes('boulangerie') || 
      description.includes('fast') || description.includes('food') || description.includes('pizzeria')) {
    return TEMPLATEMO_TEMPLATES.restaurant;
  } else if (description.includes('médical') || description.includes('santé') || description.includes('docteur') || 
             description.includes('clinique') || description.includes('pharmacie')) {
    return TEMPLATEMO_TEMPLATES.medical;
  } else if (description.includes('mode') || description.includes('fashion') || description.includes('vêtement') || 
             description.includes('boutique') || description.includes('beauté')) {
    return TEMPLATEMO_TEMPLATES.fashion;
  } else if (description.includes('agence') || description.includes('créatif') || description.includes('design') || 
             description.includes('marketing') || description.includes('publicité')) {
    return TEMPLATEMO_TEMPLATES.creative;
  } else {
    return TEMPLATEMO_TEMPLATES.business;
  }
}

// 🎨 Génération du CSS inspiré TemplateMo
function generateTemplateMoCSS(template: any, customColors: any): string {
  const colors = {
    primary: customColors.primary || template.colors.primary,
    secondary: customColors.secondary || template.colors.secondary,
    accent: customColors.accent || template.colors.accent
  };

  return `
/* ======================================
   🎨 CSS INSPIRÉ TEMPLATEMO.COM
   ====================================== */

/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variables CSS personnalisées */
:root {
  --primary-color: ${colors.primary};
  --secondary-color: ${colors.secondary};
  --accent-color: ${colors.accent};
  --text-dark: #2c3e50;
  --text-light: #6c757d;
  --bg-light: #f8f9fa;
  --white: #ffffff;
  --shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Typography inspirée TemplateMo */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.7;
  color: var(--text-dark);
  background-color: var(--bg-light);
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

h1 { font-size: 3.5rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 2rem; }
h4 { font-size: 1.5rem; }

p {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

/* Layout Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🧭 HEADER - Style TemplateMo */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -8px;
  left: 50%;
  background: var(--primary-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* 🎯 HERO SECTION - Style TemplateMo Premium */
.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--white);
  padding: 8rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: fadeInUp 1s ease-out;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.3s both;
}

/* 🔘 BOUTONS - Style TemplateMo */
.btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: var(--accent-color);
  color: var(--white);
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  animation: fadeInUp 1s ease-out 0.6s both;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.3);
  background: var(--primary-color);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}

.btn-outline:hover {
  background: var(--accent-color);
  color: var(--white);
}

/* 📦 SECTIONS */
.section {
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: var(--primary-color);
  margin: 1rem auto;
  border-radius: 2px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 🃏 CARDS - Style TemplateMo Premium */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.card-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--white);
}

.card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* 📧 FORMULAIRE - Style TemplateMo */
.contact-form {
  background: var(--white);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: var(--shadow);
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
}

/* 🦶 FOOTER - Style TemplateMo */
.footer {
  background: var(--text-dark);
  color: var(--white);
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.footer-section p,
.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--accent-color);
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
  color: #95a5a6;
}

/* 📱 RESPONSIVE - Mobile First */
@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .hero p { font-size: 1.1rem; }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    padding: 1rem;
    box-shadow: var(--shadow);
    display: none;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contact-form {
    padding: 2rem;
    margin: 0 1rem;
  }
}

/* ✨ ANIMATIONS */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.8s ease-out;
}

/* 🎨 UTILITAIRES COULEUR */
.text-primary { color: var(--primary-color); }
.text-secondary { color: var(--secondary-color); }
.text-accent { color: var(--accent-color); }
.bg-primary { background-color: var(--primary-color); }
.bg-secondary { background-color: var(--secondary-color); }
.bg-accent { background-color: var(--accent-color); }
`;
}

// 🏗️ Génération du HTML complet avec template TemplateMo
function generateTemplateMoHTML(projectName: string, businessDescription: string, template: any, customColors: any, userInputs: any): string {
  const businessType = userInputs.businessType || "entreprise";
  const services = userInputs.services || [
    { title: "Service Premium", description: "Description de votre service principal avec tous les avantages." },
    { title: "Support Expert", description: "Accompagnement personnalisé par nos experts du domaine." },
    { title: "Qualité Garantie", description: "Nous garantissons la qualité de tous nos services." }
  ];

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - ${businessType.charAt(0).toUpperCase() + businessType.slice(1)} professionnel</title>
    <meta name="description" content="${businessDescription}">
    <meta name="keywords" content="${businessType}, professionnel, qualité, service">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏢</text></svg>">
    <style>
        ${generateTemplateMoCSS(template, customColors)}
    </style>
</head>
<body>
    <!-- 🧭 HEADER NAVIGATION -->
    <header class="header">
        <div class="container">
            <nav class="navbar">
                <a href="#" class="logo">${projectName}</a>
                <ul class="nav-menu">
                    <li><a href="#accueil" class="nav-link">Accueil</a></li>
                    <li><a href="#services" class="nav-link">Services</a></li>
                    <li><a href="#apropos" class="nav-link">À Propos</a></li>
                    <li><a href="#contact" class="nav-link">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- 🎯 HERO SECTION -->
    <section id="accueil" class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Bienvenue chez ${projectName}</h1>
                <p>${businessDescription}</p>
                <a href="#contact" class="btn">Découvrir nos services</a>
                <a href="#apropos" class="btn btn-outline">En savoir plus</a>
            </div>
        </div>
    </section>

    <!-- 🎪 SERVICES SECTION -->
    <section id="services" class="section">
        <div class="container">
            <h2 class="section-title">Nos Services</h2>
            <p class="section-subtitle">Découvrez notre gamme complète de services professionnels adaptés à vos besoins</p>
            
            <div class="cards-grid">
                ${services.map((service, index) => `
                <div class="card animate-fade-in">
                    <div class="card-icon">
                        ${index === 0 ? '🎯' : index === 1 ? '⭐' : '🏆'}
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- 📖 À PROPOS SECTION -->
    <section id="apropos" class="section" style="background: var(--bg-light);">
        <div class="container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                <div>
                    <h2 class="section-title" style="text-align: left;">À Propos de ${projectName}</h2>
                    <p>Forte d'une expérience reconnue dans le domaine ${businessType}, notre équipe s'engage à vous offrir des services de qualité supérieure.</p>
                    <p>Nous combinons expertise technique et approche personnalisée pour répondre parfaitement à vos attentes et dépasser vos objectifs.</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-color);">500+</div>
                            <p style="margin: 0; color: var(--text-light);">Clients satisfaits</p>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-color);">10+</div>
                            <p style="margin: 0; color: var(--text-light);">Années d'expérience</p>
                        </div>
                    </div>
                </div>
                
                <div style="background: var(--white); padding: 3rem; border-radius: 20px; box-shadow: var(--shadow);">
                    <h3 style="color: var(--primary-color); margin-bottom: 1.5rem;">Pourquoi nous choisir ?</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: var(--accent-color); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                            Expertise reconnue et certifiée
                        </li>
                        <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: var(--accent-color); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                            Service personnalisé et sur-mesure
                        </li>
                        <li style="margin-bottom: 1rem; display: flex; align-items: center;">
                            <span style="color: var(--accent-color); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                            Support client disponible 7j/7
                        </li>
                        <li style="margin-bottom: 0; display: flex; align-items: center;">
                            <span style="color: var(--accent-color); margin-right: 1rem; font-size: 1.2rem;">✓</span>
                            Garantie satisfaction 100%
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- 📧 CONTACT SECTION -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">Contactez-nous</h2>
            <p class="section-subtitle">Prêt à démarrer votre projet ? Contactez-nous dès aujourd'hui pour un devis gratuit</p>
            
            <form class="contact-form" action="#" method="POST">
                <div class="form-group">
                    <label for="name" class="form-label">Nom complet *</label>
                    <input type="text" id="name" name="name" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" id="email" name="email" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label for="phone" class="form-label">Téléphone</label>
                    <input type="tel" id="phone" name="phone" class="form-input">
                </div>
                
                <div class="form-group">
                    <label for="message" class="form-label">Message *</label>
                    <textarea id="message" name="message" class="form-textarea" rows="5" required placeholder="Décrivez votre projet ou vos besoins..."></textarea>
                </div>
                
                <button type="submit" class="btn" style="width: 100%;">Envoyer le message</button>
            </form>
        </div>
    </section>

    <!-- 🦶 FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>${projectName}</h4>
                    <p>${businessDescription}</p>
                    <p>Votre partenaire de confiance pour tous vos besoins en ${businessType}.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>📞 01 23 45 67 89</p>
                    <p>✉️ contact@${projectName.toLowerCase().replace(/\s+/g, '')}.fr</p>
                    <p>📍 123 Rue de l'Innovation, 75000 Paris</p>
                </div>
                
                <div class="footer-section">
                    <h4>Horaires</h4>
                    <p>Lundi - Vendredi: 9h00 - 18h00</p>
                    <p>Samedi: 9h00 - 12h00</p>
                    <p>Dimanche: Fermé</p>
                </div>
                
                <div class="footer-section">
                    <h4>Suivez-nous</h4>
                    <p><a href="#">Facebook</a></p>
                    <p><a href="#">LinkedIn</a></p>
                    <p><a href="#">Twitter</a></p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 ${projectName}. Tous droits réservés. | <a href="#">Mentions légales</a> | <a href="#">Politique de confidentialité</a></p>
            </div>
        </div>
    </footer>

    <!-- 📱 JavaScript pour navigation mobile -->
    <script>
        // Navigation fluide
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Effet parallax sur le header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Animation des cartes au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    </script>
</body>
</html>`;
}

// 🚀 Fonction principale de génération avec OpenAI + TemplateMo
export const generateWebsiteMockup = tool(
  async ({ description, pageType, style, colors }) => {
    console.log(`🎨 Génération HTML/CSS avec OpenAI + Templates TemplateMo pour: ${description}`);
    
    try {
      // Vérifier la clé API OpenAI
      if (!process.env.OPENAI_API_KEY) {
        return {
          success: false,
          error: "OPENAI_API_KEY_MISSING",
          message: `🚨 **ERREUR DE CONFIGURATION** 🚨

❌ **Clé API OpenAI manquante !**

**🔧 SOLUTION :**
1. Créer un compte sur https://platform.openai.com
2. Générer une clé API
3. Ajouter dans votre fichier .env :
   \`OPENAI_API_KEY=votre_cle_openai_ici\`

**💡 Redémarrez ensuite le serveur avec ./start-server.sh**`
        };
      }

      // Extraction des informations business
      const businessName = extractBusinessName(description);
      const businessType = extractBusinessType(description);
      const targetAudience = extractTargetAudience(description);
      
      console.log(`📊 Infos extraites:`, { businessName, businessType, targetAudience, style, colors });
      
      // Sélection du template TemplateMo approprié
      const selectedTemplate = selectTemplateForBusiness(description, businessType);
      console.log(`🎨 Template sélectionné: ${selectedTemplate.name} (${selectedTemplate.style})`);
      
      // Parsing des couleurs personnalisées
      const customColors = parseColors(colors);
      
      // Extraction des services via OpenAI
      const extractedServices = await extractServicesWithAI(description, businessType);
      
      // Génération du HTML complet avec template TemplateMo
      const userInputs = {
        businessType,
        targetAudience,
        services: extractedServices
      };
      
      const generatedHTML = generateTemplateMoHTML(
        businessName, 
        description, 
        selectedTemplate, 
        customColors, 
        userInputs
      );
      
      console.log(`✅ HTML généré avec template TemplateMo: ${generatedHTML.length} caractères`);
      
      // Création du projet
      const projectName = sanitizeProjectName(businessName);
      const projectPath = path.join(process.cwd(), 'generated-sites', projectName);
      
      await createHTMLProject(projectPath, generatedHTML, businessName);
      console.log(`📁 Projet créé: ${projectPath}`);
      
      return {
        success: true,
        message: `🎉 **SITE GÉNÉRÉ AVEC SUCCÈS !** 🚀

**📁 Projet :** ${businessName}
**🎯 Style :** ${selectedTemplate.name} (${style})
**🎨 Couleurs :** Personnalisées selon vos préférences
**🤖 Générateur :** OpenAI + Templates TemplateMo
**⚡ Technologie :** HTML5 + CSS3 pur (ultra-rapide !)

**✨ FONCTIONNALITÉS INCLUSES :**
📱 Design responsive (mobile, tablette, desktop)
🎨 Animations fluides et modernes
📧 Formulaire de contact intégré
🧭 Navigation sticky et fluide
⚡ Optimisé pour la vitesse
🎯 SEO-friendly

**📂 VOTRE PROJET EST PRÊT !**
📁 Dossier: \`generated-sites/${projectName}/\`
📄 Fichier principal: \`index.html\`

**🌐 POUR VOIR VOTRE SITE :**
1. **📂 Ouvrez le dossier :** \`generated-sites/${projectName}/\`
2. **🖱️ Double-cliquez :** sur \`index.html\`
3. **✨ Votre site s'ouvre** dans votre navigateur !

**🚀 POUR LE METTRE EN LIGNE (Gratuit) :**
1. **📝 Créez un compte Vercel** : https://vercel.com (gratuit)
2. **💾 Ouvrez un terminal** dans le dossier du projet
3. **🚀 Tapez :** \`npx vercel\` et suivez les instructions
4. **🌐 URL automatique** fournie par Vercel !

**🎯 Votre site est 100% prêt et fonctionnel !**`,
        projectName,
        projectPath,
        platform: "OpenAI + TemplateMo + HTML5/CSS3",
        template: selectedTemplate.name,
        filesGenerated: [
          "index.html",
          "package.json", 
          "vercel.json"
        ],
        isGenerated: true,
        deployInstructions: true
      };
      
    } catch (error) {
      console.error(`❌ Erreur génération: ${error}`);
      return {
        success: false,
        error: "GENERATION_FAILED",
        message: `❌ **Échec de génération :** ${error.message}

**🔧 Solutions suggérées :**
1. Vérifier votre clé API OpenAI dans le fichier .env
2. Vérifier votre connexion internet
3. Vérifier votre quota OpenAI
4. Réessayer dans quelques minutes

**💡 Si le problème persiste, contactez le support.**`
      };
    }
  },
  {
    name: "generateWebsiteMockup",
    description: "Génère un site web complet en HTML/CSS pur avec des templates inspirés de TemplateMo, personnalisé selon les besoins utilisateur, puis prêt pour déploiement Vercel",
    schema: z.object({
      description: z.string().describe("Description détaillée du business/site à créer"),
      pageType: z.string().describe("Types de pages nécessaires (accueil, contact, etc.)"),
      style: z.string().describe("Style visuel souhaité (moderne, classique, etc.)"),
      colors: z.string().describe("Couleurs principales à utiliser"),
    }),
  }
);

// 🧠 Extraction des services via OpenAI
async function extractServicesWithAI(description: string, businessType: string): Promise<any[]> {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu extrais 3 services principaux d'une description business. Réponds uniquement avec un JSON array."
        },
        {
          role: "user",
          content: `Extrait 3 services de: "${description}" (${businessType}). Format: [{"title":"Service","description":"Description courte"}]`
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    const result = completion.choices[0]?.message?.content;
    if (result) {
      return JSON.parse(result);
    }
  } catch (error) {
    console.log(`⚠️ Extraction services IA échouée, utilisation des services par défaut`);
  }
  
  // Services par défaut
  return [
    { title: "Service Principal", description: "Notre service phare adapté à vos besoins spécifiques." },
    { title: "Conseil Expert", description: "Accompagnement personnalisé par nos experts du domaine." },
    { title: "Support Premium", description: "Support client disponible pour répondre à toutes vos questions." }
  ];
}

// 🛠️ Fonctions utilitaires
function extractBusinessName(description: string): string {
  // Cherche des patterns comme "boulangerie X", "restaurant Y", etc.
  const patterns = [
    /(?:boulangerie|restaurant|pizzeria|café|bar|entreprise|société|magasin|boutique|salon|cabinet|clinique|pharmacie|garage|bureau|agence|studio)\s+([A-Za-z\s]+)/i,
    /([A-Za-z\s]+)\s+(?:boulangerie|restaurant|pizzeria|café|bar|entreprise|société|magasin|boutique|salon|cabinet|clinique|pharmacie|garage|bureau|agence|studio)/i,
    /"([^"]+)"/g,
    /appelé[e]?\s+([A-Za-z\s]+)/i,
    /nommé[e]?\s+([A-Za-z\s]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      let cleanName = match[1].trim();
      
      // 🧹 NETTOYAGE DES MOTS PARASITES
      cleanName = cleanName
        .replace(/\s+(est un|est une|qui|que|pour|avec|dans|de|du|des|la|le|les|un|une)\s+.*$/i, '')
        .replace(/\s+(est un|est une|qui|que|pour|avec|dans|de|du|des|la|le|les|un|une)$/i, '')
        .trim();
      
      if (cleanName.length > 2) {
        return cleanName;
      }
    }
  }
  
  // Fallback avec les premiers mots significatifs (aussi nettoyés)
  const words = description.split(' ').filter(word => 
    word.length > 2 && 
    !['pour', 'avec', 'dans', 'site', 'web', 'créer', 'faire', 'développer', 'est', 'une', 'qui', 'que'].includes(word.toLowerCase())
  );
  
  let fallbackName = words.slice(0, 2).join(' ') || 'Mon Entreprise';
  
  // Nettoyer aussi le fallback
  fallbackName = fallbackName
    .replace(/\s+(est un|est une|qui|que|pour|avec|dans|de|du|des|la|le|les|un|une)\s+.*$/i, '')
    .replace(/\s+(est un|est une|qui|que|pour|avec|dans|de|du|des|la|le|les|un|une)$/i, '')
    .trim();
  
  return fallbackName || 'Mon Entreprise';
}

function extractBusinessType(description: string): string {
  const types = [
    'boulangerie', 'restaurant', 'pizzeria', 'café', 'bar', 'fast.?food',
    'entreprise', 'société', 'magasin', 'boutique', 'salon', 'cabinet',
    'clinique', 'pharmacie', 'garage', 'bureau', 'agence', 'studio'
  ];
  
  for (const type of types) {
    const regex = new RegExp(type, 'i');
    if (regex.test(description)) {
      return type.replace('.?', '-');
    }
  }
  
  return 'entreprise';
}

function extractTargetAudience(description: string): string {
  const audiences = [
    'famille', 'professionnel', 'entreprise', 'particulier', 'jeune', 'senior',
    'étudiant', 'touriste', 'local', 'luxe', 'populaire'
  ];
  
  for (const audience of audiences) {
    const regex = new RegExp(audience, 'i');
    if (regex.test(description)) {
      return audience;
    }
  }
  
  return 'grand public';
}

function parseColors(colorString: string): any {
  const defaultColors = { primary: '#3498db', secondary: '#2c3e50', accent: '#e74c3c' };
  
  if (!colorString) return defaultColors;
  
  // Extraction de couleurs HEX
  const hexMatches = colorString.match(/#[0-9A-Fa-f]{6}/g);
  if (hexMatches && hexMatches.length >= 1) {
    return {
      primary: hexMatches[0] || defaultColors.primary,
      secondary: hexMatches[1] || defaultColors.secondary,
      accent: hexMatches[2] || defaultColors.accent
    };
  }
  
  // Mapping couleurs nommées
  const colorMap: { [key: string]: any } = {
    'rouge': { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' },
    'bleu': { primary: '#3498db', secondary: '#2980b9', accent: '#f39c12' },
    'vert': { primary: '#27ae60', secondary: '#16a085', accent: '#f39c12' },
    'violet': { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' },
    'orange': { primary: '#e67e22', secondary: '#d35400', accent: '#3498db' }
  };
  
  for (const [color, palette] of Object.entries(colorMap)) {
    if (colorString.toLowerCase().includes(color)) {
      return palette;
    }
  }
  
  return defaultColors;
}

function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function createHTMLProject(projectPath: string, htmlContent: string, businessName: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  // Écrire le fichier HTML principal
  await fs.writeFile(path.join(projectPath, 'index.html'), htmlContent);
  
  // Créer package.json pour Vercel
  const packageJson = {
    name: sanitizeProjectName(businessName),
    version: "1.0.0",
    description: `Site web pour ${businessName}`,
    main: "index.html"
  };
  
  await fs.writeFile(
    path.join(projectPath, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  // Créer vercel.json optimisé pour HTML statique
  const vercelConfig = {
    version: 2,
    buildCommand: null,
    framework: null,
    outputDirectory: "."
  };
  
  await fs.writeFile(
    path.join(projectPath, 'vercel.json'), 
    JSON.stringify(vercelConfig, null, 2)
  );
} 