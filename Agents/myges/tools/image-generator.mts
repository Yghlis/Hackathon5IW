import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';
import { deployToVercelTool, deployToVercel } from './vercel-deploy.mts';
import { OpenAI } from "openai";

// 🤖 Fonction de réparation automatique par IA
async function repairTruncatedCode(truncatedCode: string, businessName: string, style: string, colors: string): Promise<string> {
  console.log(`🔧 Réparation automatique du code tronqué par IA...`);
  
  try {
    const repairPrompt = `Tu es un expert React/Next.js TypeScript. Le code suivant a des erreurs et doit être corrigé.

BUSINESS: ${businessName}
STYLE: ${style}  
COULEURS: ${colors}

PROBLÈMES CRITIQUES À CORRIGER:
1. 🚨 ERREURS TYPESCRIPT: Assurer que le fichier est un module TypeScript valide
2. ✅ 'use client' au début du fichier
3. ✅ Au moins un import React/useState pour que TypeScript reconnaisse le module
4. ✅ Export default correct avec nom de fonction
5. ✅ Fermer toutes les balises JSX non fermées
6. ✅ Interfaces TypeScript pour les props/state si nécessaire

CODE À CORRIGER:
\`\`\`tsx
${truncatedCode}
\`\`\`

RÉPARE ce code pour éliminer TOUTES les erreurs TypeScript. Retourne UNIQUEMENT le code React/TypeScript complet et fonctionnel, sans explication.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'sk-proj-dummy'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert React qui répare les codes tronqués. Retourne uniquement le code React complet et fonctionnel.'
          },
          {
            role: 'user', 
            content: repairPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      console.log(`⚠️ Réparation IA échouée, utilisation du système de correction automatique...`);
      return autoFixTruncatedCode(truncatedCode, businessName);
    }

    const data = await response.json();
    const repairedCode = data.choices[0]?.message?.content || '';
    
    if (repairedCode.length > truncatedCode.length + 1000) {
      console.log(`✅ Code réparé par IA: ${repairedCode.length} caractères (+${repairedCode.length - truncatedCode.length})`);
      return repairedCode;
    } else {
      console.log(`⚠️ Réparation IA insuffisante, utilisation du système de correction automatique...`);
      return autoFixTruncatedCode(truncatedCode, businessName);
    }
    
  } catch (error) {
    console.log(`❌ Erreur réparation IA: ${error}, utilisation du système de correction automatique...`);
    return autoFixTruncatedCode(truncatedCode, businessName);
  }
}

// 🔧 Système de correction automatique (fallback)
function autoFixTruncatedCode(code: string, businessName: string): string {
  console.log(`🔧 Correction automatique du code...`);
  
  let fixedCode = code;
  
  // Compter et fermer les balises ouvertes
  const divCount = (code.match(/<div/g) || []).length;
  const divCloseCount = (code.match(/<\/div>/g) || []).length;
  const sectionCount = (code.match(/<section/g) || []).length;
  const sectionCloseCount = (code.match(/<\/section>/g) || []).length;
  
  // Fermer les divs manquantes
  const missingDivs = divCount - divCloseCount;
  for (let i = 0; i < missingDivs; i++) {
    fixedCode += '\n        </div>';
  }
  
  // Fermer les sections manquantes
  const missingSections = sectionCount - sectionCloseCount;
  for (let i = 0; i < missingSections; i++) {
    fixedCode += '\n      </section>';
  }
  
  // Ajouter Footer si manquant
  if (!fixedCode.includes('footer') && !fixedCode.includes('Footer')) {
    fixedCode += `
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">${businessName}</h3>
              <p className="text-gray-400">Votre partenaire de confiance pour tous vos besoins.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">📞 01 23 45 67 89</p>
              <p className="text-gray-400">✉️ contact@${businessName.toLowerCase().replace(/\s+/g, '')}.fr</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horaires</h4>
              <p className="text-gray-400">Lun-Ven: 9h-18h</p>
              <p className="text-gray-400">Sam: 9h-12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 ${businessName}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>`;
  }
  
  // S'assurer que le composant se ferme correctement
  if (!fixedCode.includes('</div>\n}') && !fixedCode.includes('</div>\n}\n')) {
    fixedCode += '\n    </div>\n  );\n}';
  }
  
  // S'assurer de l'export default
  if (!fixedCode.includes('export default')) {
    const componentName = extractComponentName(fixedCode) || 'HomePage';
    fixedCode += `\n\nexport default ${componentName};`;
  }
  
  return fixedCode;
}

function extractComponentName(code: string): string | null {
  const match = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
  return match ? (match[1] || match[2]) : null;
}

export const generateWebsiteMockup = tool(
  async ({ description, pageType, style, colors }) => {
    console.log(`🎨 Génération avec V0.dev API pour: ${description}`);
    
    try {
      // Extraction intelligente des infos
      const businessName = extractBusinessName(description);
      const targetAudience = extractTargetAudience(description);
      const businessType = extractBusinessType(description);
      
      console.log(`📊 Infos extraites:`, { businessName, targetAudience, businessType, style, colors });
      
      // Vérifier la clé API
      const apiKey = process.env.V0_API_KEY;
      if (!apiKey || apiKey === 'votre_cle_v0_dev_ici') {
        return {
          success: false,
          error: "CONFIGURATION MANQUANTE",
          message: `🚨 **ERREUR DE CONFIGURATION** 🚨

❌ **Clé API V0.dev manquante !**

**🔧 SOLUTION :**
1. Créer un compte sur https://v0.dev
2. Générer une clé API (Plan Premium requis)
3. Ajouter dans votre fichier .env :
   \`V0_API_KEY=votre_cle_ici\`

**💡 Alternative :** Génération avec template local (qualité moindre)`
        };
      }

      // 🎯 NOUVELLE APPROCHE : GÉNÉRATION HTML/CSS AVEC OPENAI (PLUS FIABLE)
      console.log(`🚀 Génération HTML/CSS avec OpenAI (plus fiable que React)...`);
      
      // Extraire les pages demandées par l'utilisateur
      const requestedPages = extractRequestedPages(pageType);
      console.log(`📄 Pages demandées: ${requestedPages.join(', ')}`);
      
      // 🎨 PROMPT OPTIMISÉ POUR HTML/CSS PUR
      const htmlPrompt = `Créer un site web complet en HTML/CSS pour "${businessName}" (${businessType}).

**Spécifications:**
- Nom: ${businessName}
- Type: ${businessType}
- Public cible: ${targetAudience}
- Style: ${style}
- Couleurs: ${colors}
- Pages: ${requestedPages.join(', ')}

**Exigences techniques:**
1. Un seul fichier HTML complet avec CSS intégré
2. Design moderne et responsive (mobile-first)
3. Sections : Header avec navigation, Hero, Services/À propos, Contact, Footer
4. Couleurs et style respectant les spécifications : ${colors}, ${style}
5. CSS moderne avec Flexbox/Grid
6. Formulaire de contact fonctionnel
7. Code propre et bien structuré
8. Compatible tous navigateurs

**IMPORTANT:** Retourne UNIQUEMENT le code HTML complet avec le CSS dans des balises <style>. Pas d'explications, pas de commentaires, juste le code HTML/CSS prêt à utiliser.`;

      console.log(`📝 Prompt envoyé à OpenAI (${htmlPrompt.length} caractères)`);

      // 🤖 APPEL À OPENAI (PLUS FIABLE QUE V0.dev)
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Tu es un expert développeur web spécialisé dans la création de sites HTML/CSS modernes et responsives. Tu génères du code HTML/CSS pur, propre et professionnel sans explications."
          },
          {
            role: "user",
            content: htmlPrompt
          }
        ],
        max_tokens: 16000,
        temperature: 0.1
      });

      let generatedHTML = completion.choices[0]?.message?.content || '';
      
      if (!generatedHTML) {
        throw new Error('Aucun code HTML généré par OpenAI');
      }

      console.log(`✅ Code HTML/CSS généré par OpenAI: ${generatedHTML.length} caractères`);

      // Nettoyer le code HTML (supprimer les balises markdown si présentes)
      generatedHTML = generatedHTML
        .replace(/^```html\n?/gm, '')
        .replace(/^```\n?/gm, '')
        .replace(/\n?```$/gm, '')
        .trim();

      // Validation du HTML généré
      const hasHtmlStructure = generatedHTML.includes('<!DOCTYPE html>') && 
                               generatedHTML.includes('<html') && 
                               generatedHTML.includes('</html>');
      
      if (!hasHtmlStructure) {
        // Envelopper dans une structure HTML complète si nécessaire
        generatedHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName}</title>
    <style>
        /* CSS généré sera intégré ici */
    </style>
</head>
<body>
${generatedHTML}
</body>
</html>`;
      }

      console.log(`📏 Code HTML final: ${generatedHTML.length} caractères`);

      // Créer le projet HTML statique
      const projectName = sanitizeProjectName(businessName);
      const projectPath = path.join(process.cwd(), 'generated-sites', projectName);
      
      await createHTMLProject(projectPath, generatedHTML, businessName);
      console.log(`📁 Projet HTML créé: ${projectPath}`);

      // Déploiement automatique
      console.log(`🚀 Déploiement direct sur Vercel pour: ${projectName}`);
      const deployResult = await deployToVercelTool.invoke({
        projectPath,
        projectName
      });

      if (deployResult.success) {
        return {
          success: true,
          message: `🎉 **SITE DÉPLOYÉ AVEC SUCCÈS !** 🚀

**📁 Projet :** ${businessName}
**🎯 Style :** ${style}
**🎨 Couleurs :** ${colors}
**🤖 Générateur :** OpenAI GPT-4o (HTML/CSS pur)
**⚡ Framework :** HTML5 + CSS3 (ultra-rapide !)

**🌐 VOTRE SITE EST EN LIGNE :**
👆 **CLIQUEZ ICI :** ${deployResult.deployedUrl}

✅ **Site accessible dans le monde entier !**
📱 **Compatible mobile, tablette et desktop**
🔒 **HTTPS automatique et sécurisé**
⚡ **Chargement ultra-rapide (HTML pur) !**

**📦 TÉLÉCHARGER LE PROJET :**
🗂️ **ZIP complet :** http://localhost:8080/download/${projectName}.zip

**💻 TESTER EN LOCAL :**
1. Téléchargez le ZIP ci-dessus
2. Dézippez le dossier
3. Ouvrez le fichier index.html dans votre navigateur
   (Pas besoin de npm install, c'est du HTML pur !)

**🔧 Pour des modifications :** Contactez-nous avec vos demandes !`,
          projectName,
          projectPath,
          deployedUrl: deployResult.deployedUrl,
          platform: "OpenAI GPT-4o + HTML5/CSS3 + Vercel",
          filesGenerated: [
            "index.html",
            "package.json",
            "vercel.json"
          ],
          isDeployed: true
        };
      } else {
        return deployResult;
      }

    } catch (error) {
      console.error(`❌ Erreur OpenAI API: ${error}`);
      return {
        success: false,
        error: "GENERATION_FAILED",
        message: `❌ **Échec de génération :** ${error.message}

**🔧 Solutions suggérées :**
1. Vérifier votre clé API OpenAI
2. Vérifier votre connexion internet
3. Vérifier votre quota OpenAI
4. Réessayer dans quelques minutes`
      };
    }
  },
  {
    name: "generateWebsiteMockup",
    description: "Génère un site web complet en HTML/CSS avec OpenAI GPT-4o (plus fiable que React), puis le déploie sur Vercel",
    schema: z.object({
      description: z.string().describe("Description détaillée du business/site à créer"),
      pageType: z.string().describe("Types de pages nécessaires (accueil, contact, etc.)"),
      style: z.string().describe("Style visuel souhaité (moderne, classique, etc.)"),
      colors: z.string().describe("Couleurs principales à utiliser"),
    }),
  }
);

/**
 * 🚀 **NOUVELLE FONCTION : GÉNÉRATION V0.dev AVEC RETRY INTELLIGENT**
 */
async function generateCodeWithV0(description: string, businessName: string, targetAudience: string, businessType: string, style: string, colors: string, pageType: string, attempt: number): Promise<string | null> {
  // Adapter le prompt selon la tentative pour éviter la troncature
  let enhancedPrompt = '';
  
  if (attempt === 1) {
    // Première tentative : prompt normal
    enhancedPrompt = `Create a professional website component for "${businessName}", a ${businessType} business.

Target audience: ${targetAudience}
Style: ${style}
Primary colors: ${colors}
Page type: ${pageType}

Create a complete React component with:
- Professional Next.js App Router structure 
- Tailwind CSS styling with modern design
- Responsive mobile-first layout
- Business hero section with clear value proposition
- Services/products showcase
- About section highlighting expertise
- Contact form with professional styling
- Footer with business information
- Modern typography and proper spacing
- Professional color scheme based on: ${colors}
- Style aesthetic: ${style}

Return ONLY the complete React component code with 'use client' directive.
Use proper semantic HTML, accessibility features, and lucide-react icons.
IMPORTANT: Generate the COMPLETE file - do not truncate or cut off any sections.`;

  } else if (attempt === 2) {
    // Deuxième tentative : prompt plus concis pour éviter la troncature
    enhancedPrompt = `Create a complete React page for "${businessName}" (${businessType}).

Style: ${style}, Colors: ${colors}

Generate a COMPLETE component with:
- Hero section
- Services/About section
- Contact section with form
- Footer
- Responsive Tailwind CSS
- 'use client' directive

CRITICAL: Return the ENTIRE component without truncation. Ensure all JSX tags are properly closed.`;

  } else {
    // Troisième tentative : prompt minimal mais complet
    enhancedPrompt = `Complete React component for ${businessName} ${businessType} website.
Style: ${style}, Colors: ${colors}
Include: hero, services, contact, footer sections.
Use 'use client', Tailwind CSS, proper JSX closing tags.
Return COMPLETE code without truncation.`;
  }

  console.log(`📝 Prompt tentative ${attempt} envoyé à V0.dev (${enhancedPrompt.length} caractères)`);
  
  try {
    const response = await fetch('https://api.v0.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.V0_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'v0-1.5-md',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        stream: false,
        max_tokens: 32000, // Demander le maximum de tokens
        temperature: attempt === 1 ? 0.7 : 0.3 // Réduire la créativité pour les retry
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Erreur V0.dev API (tentative ${attempt}): ${response.status} ${errorData}`);
      
      if (response.status === 404) {
        throw new Error(`API V0.dev : Endpoint non trouvé. Vérifiez votre clé API et votre plan (Premium/Team requis)`);
      } else if (response.status === 401) {
        throw new Error(`API V0.dev : Clé API invalide ou manquante`);
      } else if (response.status === 429) {
        // Attendre un peu avant de retry en cas de rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        return null;
      } else {
        throw new Error(`V0.dev API error: ${response.status} ${response.statusText} - ${errorData}`);
      }
    }

    const data = await response.json();
    let generatedReactCode = data.choices?.[0]?.message?.content;

    if (!generatedReactCode) {
      console.error(`❌ Aucun code dans la réponse V0.dev (tentative ${attempt}):`, data);
      return null;
    }

    console.log(`✅ Code React généré par V0.dev (tentative ${attempt}): ${generatedReactCode.length} caractères`);
    return generatedReactCode;

  } catch (error) {
    console.error(`❌ Erreur lors de la tentative ${attempt}:`, error.message);
    if (attempt === 3) {
      throw error; // Propager l'erreur à la dernière tentative
    }
    return null;
  }
}

/**
 * 🔍 **NOUVELLE FONCTION : VALIDATION AVANCÉE DE LA COMPLÉTUDE DU CODE**
 */
function validateReactCodeCompleteness(code: string, businessName: string): { isComplete: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 0;

  // 1. Vérifications structurelles de base (20 points)
  const hasUseClient = code.includes("'use client'");
  const hasImports = code.includes('import ');
  const hasExportDefault = code.includes('export default');
  const hasFunctionComponent = /function\s+\w+|\w+\s*=\s*\(\s*\)\s*=>/g.test(code);
  const hasReturn = code.includes('return (') || code.includes('return(');

  if (hasUseClient) score += 4; else issues.push("Directive 'use client' manquante");
  if (hasImports) score += 4; else issues.push("Imports manquants");
  if (hasExportDefault) score += 4; else issues.push("Export default manquant");
  if (hasFunctionComponent) score += 4; else issues.push("Fonction component manquante");
  if (hasReturn) score += 4; else issues.push("Return statement manquant");

  // 2. Vérifications JSX et balances (30 points)
  const openDivs = (code.match(/<div[^>]*>/g) || []).length;
  const closeDivs = (code.match(/<\/div>/g) || []).length;
  const openSections = (code.match(/<section[^>]*>/g) || []).length;
  const closeSections = (code.match(/<\/section>/g) || []).length;
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;

  const divBalance = Math.abs(openDivs - closeDivs);
  const sectionBalance = Math.abs(openSections - closeSections);
  const braceBalance = Math.abs(openBraces - closeBraces);

  if (divBalance <= 1) score += 10; else issues.push(`${divBalance} divs non fermées`);
  if (sectionBalance === 0) score += 10; else issues.push(`${sectionBalance} sections non fermées`);
  if (braceBalance <= 1) score += 10; else issues.push(`${braceBalance} accolades non fermées`);

  // 3. Vérifications de contenu obligatoire (30 points)
  const hasHeroSection = /hero|banner|jumbotron/i.test(code) || code.includes('text-4xl') || code.includes('text-5xl');
  const hasServicesSection = /service|offer|produit|about/i.test(code);
  const hasContactSection = /contact|phone|email|mail|form/i.test(code);
  const hasFooter = /footer|copyright|©|droits réservés/i.test(code);

  if (hasHeroSection) score += 8; else issues.push("Section hero manquante");
  if (hasServicesSection) score += 7; else issues.push("Section services/about manquante");
  if (hasContactSection) score += 8; else issues.push("Section contact manquante");
  if (hasFooter) score += 7; else issues.push("Footer manquant");

  // 4. Vérifications de qualité (20 points)
  const minLength = 8000; // Code minimum attendu
  const hasBusinessName = code.includes(businessName) || code.toLowerCase().includes(businessName.toLowerCase());
  const hasTailwindClasses = /className="[^"]*(?:bg-|text-|p-|m-|flex|grid)/g.test(code);
  const hasResponsiveClasses = /(?:sm:|md:|lg:|xl:)/g.test(code);
  const endsCorrectly = code.trim().endsWith('}') || code.trim().endsWith('};');

  if (code.length >= minLength) score += 6; else issues.push(`Code trop court (${code.length}/${minLength})`);
  if (hasBusinessName) score += 4; else issues.push("Nom du business manquant");
  if (hasTailwindClasses) score += 5; else issues.push("Classes Tailwind insuffisantes");
  if (hasResponsiveClasses) score += 3; else issues.push("Classes responsive manquantes");
  if (endsCorrectly) score += 2; else issues.push("Fin de fichier incorrecte");

  const isComplete = score >= 85; // Score minimum pour considérer le code complet
  
  console.log(`📊 Score de complétude: ${score}/100 (${isComplete ? 'COMPLET' : 'INCOMPLET'})`);
  if (issues.length > 0) {
    console.log(`⚠️ Problèmes détectés: ${issues.join(', ')}`);
  }

  return { isComplete, issues, score };
}

function extractBusinessName(description: string): string {
  const patterns = [
    /(?:pour|de|du|la|le|mon|ma|notre)\s+(.+?)(?:\s+qui|,|$)/i,
    /(?:business|entreprise|société|restaurant|boutique|magasin|site)\s+(.+?)(?:\s|,|$)/i,
    /(?:nommé|appelé|s'appelle)\s+(.+?)(?:\s|,|$)/i,
    /"([^"]+)"/,  // Texte entre guillemets
    /«([^»]+)»/   // Texte entre guillemets français
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 2 && name.length < 50) {
        return name;
      }
    }
  }
  
  // Fallback: premiers mots significatifs
  const words = description.split(' ').filter(w => w.length > 2 && !['pour', 'avec', 'dans', 'site', 'web'].includes(w.toLowerCase()));
  return words.slice(0, 3).join(' ') || 'Business';
}

function extractTargetAudience(description: string): string {
  const audiencePatterns = [
    /(?:ciblant|pour|destiné à)\s+(.+?)(?:\s+avec|\s*,|$)/i,
    /(?:public cible|audience)\s*:\s*(.+?)(?:\s*,|$)/i
  ];
  
  for (const pattern of audiencePatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return 'général public';
}

function extractBusinessType(description: string): string {
  const types = [
    'restaurant', 'boulangerie', 'boutique', 'magasin', 'salon', 'coiffeur',
    'médecin', 'dentiste', 'avocat', 'architecte', 'designer', 'photographe',
    'garage', 'plombier', 'électricien', 'menuisier', 'startup', 'tech',
    'conseil', 'formation', 'école', 'université', 'hôtel', 'gîte'
  ];
  
  const lowerDesc = description.toLowerCase();
  for (const type of types) {
    if (lowerDesc.includes(type)) {
      return type;
    }
  }
  
  return 'business professionnel';
}

// 📄 NOUVELLE FONCTION : Extraire les pages demandées par l'utilisateur
function extractRequestedPages(pageType: string): string[] {
  if (!pageType) return ['accueil', 'contact'];
  
  // Normaliser et extraire les pages
  const pages = pageType.toLowerCase()
    .split(/[,;]+/)  // Séparer par virgules ou point-virgules
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // S'assurer qu'on a au moins accueil
  if (!pages.includes('accueil') && !pages.includes('home')) {
    pages.unshift('accueil');
  }
  
  // Standardiser les noms de pages
  const standardPages = pages.map(page => {
    switch(page) {
      case 'home': case 'index': return 'accueil';
      case 'about': case 'a propos': case 'à propos': return 'à propos';
      case 'menu': case 'produits': case 'services': return 'services';
      case 'contact': case 'contactez-nous': return 'contact';
      default: return page;
    }
  });
  
  return [...new Set(standardPages)]; // Supprimer les doublons
}

async function createNextJSProject(projectPath: string, reactCode: string, businessName: string): Promise<void> {
  // Créer la structure de dossiers Next.js
  await fs.mkdir(path.join(projectPath, 'app'), { recursive: true });
  await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });
  
  // UTILISER LE CODE V0.dev DÉJÀ NETTOYÉ
  const cleanedReactCode = reactCode;
  
  // Page principale (app/page.tsx) avec le code de V0.dev
  await fs.writeFile(path.join(projectPath, 'app', 'page.tsx'), cleanedReactCode);
  
  // Fonction pour échapper les caractères spéciaux dans les chaînes JavaScript
  const escapeForJS = (str: string) => {
    return str
      .replace(/\\/g, '\\\\')  // Échapper d'abord les backslashes
      .replace(/'/g, "\\'")    // Puis les apostrophes
      .replace(/"/g, '\\"')    // Puis les guillemets
      .replace(/\n/g, '\\n')   // Nouvelles lignes
      .replace(/\r/g, '\\r')   // Retours chariot
      .replace(/\t/g, '\\t');  // Tabulations
  };
  
  // Layout (app/layout.tsx)
  const layoutContent = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${escapeForJS(businessName)}',
  description: 'Site web professionnel pour ${escapeForJS(businessName)} - Style ${style}',
  keywords: '${escapeForJS(businessName)} ${style} ${colors}',
  authors: [{ name: '${escapeForJS(businessName)}' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`;
  await fs.writeFile(path.join(projectPath, 'app', 'layout.tsx'), layoutContent);
  
  // CSS global avec Tailwind (app/globals.css)
  const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}`;
  await fs.writeFile(path.join(projectPath, 'app', 'globals.css'), globalCSS);
  
  // Package.json pour Next.js
  const packageJson = {
    "name": sanitizeProjectName(businessName),
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    "dependencies": {
      "react": "^18",
      "react-dom": "^18",
      "next": "14.0.4",
      "lucide-react": "^0.294.0"
    },
    "devDependencies": {
      "typescript": "^5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "autoprefixer": "^10.0.1",
      "postcss": "^8",
      "tailwindcss": "^3.3.0",
      "eslint": "^8",
      "eslint-config-next": "14.0.4"
    }
  };
  await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  
  // Next.js config pour export statique
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig`;
  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);
  
  // Configuration Tailwind
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
export default config`;
  await fs.writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindConfig);
  
  // PostCSS config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  
  // TypeScript config
  const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), tsConfig);
  
  // Vercel config optimisée pour Next.js 14 App Router (SANS propriétés obsolètes)
  const vercelConfig = {
    "version": 2,
    "framework": "nextjs"
  };
  await fs.writeFile(path.join(projectPath, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 🔧 DÉTECTION ET CORRECTION AUTOMATIQUE DES FICHIERS REACT TRONQUÉS
 * Cette fonction résout le problème récurrent des réponses v0 incomplètes
 */
function detectAndFixTruncatedReactCode(code: string, businessName: string): string {
  console.log('🔍 Vérification de la complétude du fichier React...');
  
  // 1. Vérifications de base
  const hasExportDefault = code.includes('export default function') || code.includes('export default');
  const hasFunctionDeclaration = /function\s+\w+\s*\(/.test(code);
  const hasReturn = code.includes('return (') || code.includes('return(');
  const hasClosingBrace = code.includes('}');
  
  // 2. Compter les balises JSX et les accolades
  const openDivs = (code.match(/<div[^>]*>/g) || []).length;
  const closeDivs = (code.match(/<\/div>/g) || []).length;
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  const openSections = (code.match(/<section[^>]*>/g) || []).length;
  const closeSections = (code.match(/<\/section>/g) || []).length;
  
  // 3. Détecter la troncature
  const isTruncated = (
    !hasExportDefault ||
    !hasReturn ||
    openDivs > closeDivs + 2 ||
    openBraces > closeBraces + 1 ||
    openSections > closeSections ||
    code.trimEnd().slice(-1) !== '}' ||
    !code.includes('</div>') ||
    code.length < 500 // Trop court pour être complet
  );
  
  if (!isTruncated) {
    console.log('✅ Fichier React complet détecté');
    return code;
  }
  
  console.log('🚨 FICHIER TRONQUÉ DÉTECTÉ - Correction automatique en cours...');
  console.log(`📊 Diagnostic: divs=${openDivs}/${closeDivs}, braces=${openBraces}/${closeBraces}, sections=${openSections}/${closeSections}`);
  
  // 4. CORRECTION AUTOMATIQUE
  let fixedCode = code;
  
  // S'assurer que le code commence correctement
  if (!fixedCode.includes('export default function')) {
    const functionMatch = fixedCode.match(/function\s+(\w+)/);
    const functionName = functionMatch ? functionMatch[1] : `${businessName.replace(/[^a-zA-Z0-9]/g, '')}Website`;
    
    if (!fixedCode.includes('export default')) {
      fixedCode += `\n\nexport default ${functionName};`;
    }
  }
  
  // 5. Compléter les sections manquantes si le fichier semble très incomplet
  if (!fixedCode.includes('contact') && !fixedCode.includes('Contact')) {
    console.log('➕ Ajout de la section Contact manquante...');
    
    // Trouver le point d'insertion (avant les dernières balises de fermeture)
    const lastSectionIndex = fixedCode.lastIndexOf('</section>');
    const insertionPoint = lastSectionIndex > -1 ? lastSectionIndex + 10 : fixedCode.lastIndexOf('</div>');
    
    const contactSection = `

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Contactez-nous pour plus d'informations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Téléphone</h4>
                    <p className="text-gray-600">01 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">contact@${businessName.toLowerCase().replace(/[^a-z]/g, '')}.fr</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Nous contacter</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Nom</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    placeholder="Votre message"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>`;
    
    if (insertionPoint > -1) {
      fixedCode = fixedCode.slice(0, insertionPoint) + contactSection + fixedCode.slice(insertionPoint);
    } else {
      // Si on ne trouve pas de bon point d'insertion, ajouter avant la fin
      const beforeClosing = fixedCode.lastIndexOf('</div>');
      if (beforeClosing > -1) {
        fixedCode = fixedCode.slice(0, beforeClosing) + contactSection + '\n    ' + fixedCode.slice(beforeClosing);
      }
    }
  }
  
  // 6. Ajouter un footer si manquant
  if (!fixedCode.includes('footer') && !fixedCode.includes('Footer')) {
    console.log('➕ Ajout du footer manquant...');
    
    const footer = `

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">${businessName}</h3>
            <p className="text-gray-400 mb-6">Votre partenaire de confiance</p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <span>Service professionnel</span>
              <span>•</span>
              <span>Qualité garantie</span>
              <span>•</span>
              <span>Satisfaction client</span>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">© 2024 ${businessName}. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>`;
    
    // Trouver où insérer le footer (avant les fermetures finales)
    const mainClosingDiv = fixedCode.lastIndexOf('</div>');
    if (mainClosingDiv > -1) {
      fixedCode = fixedCode.slice(0, mainClosingDiv) + footer + '\n    ' + fixedCode.slice(mainClosingDiv);
    }
  }
  
  // 7. S'assurer que les imports nécessaires sont présents
  if (!fixedCode.includes('Phone') && fixedCode.includes('Phone className')) {
    if (!fixedCode.includes('import')) {
      fixedCode = "'use client'\n\nimport { Phone, Mail } from 'lucide-react'\n\n" + fixedCode;
    } else {
      // Ajouter aux imports existants
      fixedCode = fixedCode.replace(
        /import.*?from ['"]lucide-react['"];?\n/,
        "import { useState, Phone, Mail, MapPin } from 'lucide-react'\n"
      );
    }
  }
  
  // 8. Fermer toutes les balises ouvertes
  const finalOpenDivs = (fixedCode.match(/<div[^>]*>/g) || []).length;
  const finalCloseDivs = (fixedCode.match(/<\/div>/g) || []).length;
  
  if (finalOpenDivs > finalCloseDivs) {
    const missingClosingDivs = finalOpenDivs - finalCloseDivs;
    console.log(`🔧 Ajout de ${missingClosingDivs} balises </div> manquantes`);
    fixedCode += '\n' + '    </div>\n'.repeat(missingClosingDivs);
  }
  
  // 9. Fermer les accolades manquantes
  const finalOpenBraces = (fixedCode.match(/{/g) || []).length;
  const finalCloseBraces = (fixedCode.match(/}/g) || []).length;
  
  if (finalOpenBraces > finalCloseBraces) {
    const missingBraces = finalOpenBraces - finalCloseBraces;
    console.log(`🔧 Ajout de ${missingBraces} accolades } manquantes`);
    fixedCode += '\n' + '}\n'.repeat(missingBraces);
  }
  
  // 10. S'assurer que la fonction se termine correctement
  if (!fixedCode.trimEnd().endsWith('}')) {
    fixedCode += '\n}';
  }
  
  console.log(`✅ Fichier automatiquement corrigé! Taille: ${code.length} → ${fixedCode.length} caractères`);
  
  return fixedCode;
}

/**
 * Nettoie la réponse de V0.dev en supprimant le texte explicatif et les balises markdown
 * 🔧 SOLUTION AUX ERREURS TYPESCRIPT
 */
function cleanV0Response(response: string): string {
  // Supprimer le texte explicatif de V0.dev
  const lines = response.split('\n');
  const cleanedLines = [];
  let inCodeBlock = false;
  let codeBlockCount = 0;
  
  for (const line of lines) {
    if (line.includes('```')) {
      codeBlockCount++;
      inCodeBlock = !inCodeBlock;
      continue; // TOUJOURS ignorer les lignes avec ```
    }
    
    if (inCodeBlock || (codeBlockCount === 0 && (line.includes('use client') || line.includes('import ') || line.includes('export ')))) {
      cleanedLines.push(line);
    }
  }
  
  // 🔧 CORRECTION PRÉVENTIVE : S'assurer qu'aucune balise markdown ne reste
  let cleanedCode = cleanedLines.join('\n');
  
  // Supprimer toutes les balises markdown restantes
  cleanedCode = cleanedCode.replace(/^```[\w]*\n?/gm, ''); // Début de code block
  cleanedCode = cleanedCode.replace(/\n?```$/gm, ''); // Fin de code block
  cleanedCode = cleanedCode.replace(/```[\w]*\n?/g, ''); // Toutes les balises ``` restantes
  
  // 🚨 CORRECTION CRITIQUE : Erreurs TypeScript "is not a module"
  
  // S'assurer qu'on a 'use client' au début
  if (!cleanedCode.startsWith("'use client'")) {
    cleanedCode = "'use client'\n\n" + cleanedCode;
  }
  
  // S'assurer qu'on a au moins un import (pour que TypeScript reconnaisse le module)
  if (!cleanedCode.includes('import ')) {
    const importLine = "import React from 'react'\nimport { useState } from 'react'\n";
    cleanedCode = cleanedCode.replace("'use client'", "'use client'\n\n" + importLine);
  }
  
  // S'assurer qu'on a un export default correct
  if (!cleanedCode.includes('export default')) {
    // Extraire le nom de la fonction ou créer un nom générique
    const functionMatch = cleanedCode.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
    const functionName = functionMatch ? (functionMatch[1] || functionMatch[2]) : 'HomePage';
    
    if (!cleanedCode.includes(`export default ${functionName}`)) {
      cleanedCode += `\n\nexport default ${functionName}`;
    }
  }
  
  // Nettoyer les fins de ligne multiples
  cleanedCode = cleanedCode.replace(/\n{3,}/g, '\n\n');
  
  return cleanedCode.trim();
}

// 📊 Fonction de validation de complétude
function validateCodeCompleteness(code: string, businessName: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;

  // 1. Vérifications structurelles (25 points)
  if (code.includes("'use client'")) score += 5; else issues.push("'use client' manquant");
  if (code.includes('import ')) score += 5; else issues.push("Imports manquants");
  if (code.includes('export default')) score += 5; else issues.push("Export default manquant");
  if (/function\s+\w+|\w+\s*=\s*\(\s*\)\s*=>/g.test(code)) score += 5; else issues.push("Composant React manquant");
  if (code.includes('return (')) score += 5; else issues.push("Return statement manquant");

  // 2. Balance JSX (25 points)
  const openDivs = (code.match(/<div[^>]*>/g) || []).length;
  const closeDivs = (code.match(/<\/div>/g) || []).length;
  const openSections = (code.match(/<section[^>]*>/g) || []).length;
  const closeSections = (code.match(/<\/section>/g) || []).length;
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;

  const divBalance = Math.abs(openDivs - closeDivs);
  const sectionBalance = Math.abs(openSections - closeSections);
  const braceBalance = Math.abs(openBraces - closeBraces);

  if (divBalance <= 1) score += 10; else issues.push(`${divBalance} divs non fermées`);
  if (sectionBalance === 0) score += 8; else issues.push(`${sectionBalance} sections non fermées`);
  if (braceBalance <= 2) score += 7; else issues.push(`${braceBalance} accolades non fermées`);

  // 3. Contenu (25 points)
  if (/hero|banner|jumbotron|text-[45]xl/i.test(code)) score += 8; else issues.push("Section hero manquante");
  if (/service|offer|about|produit/i.test(code)) score += 6; else issues.push("Section services manquante");
  if (/contact|phone|email|form/i.test(code)) score += 6; else issues.push("Section contact manquante");
  if (/footer|copyright|©/i.test(code)) score += 5; else issues.push("Footer manquant");

  // 4. Qualité (25 points)
  if (code.length >= 8000) score += 8; else issues.push(`Code trop court (${code.length}/8000)`);
  if (code.toLowerCase().includes(businessName.toLowerCase())) score += 5; else issues.push("Nom du business manquant");
  if (/className="[^"]*(?:bg-|text-|p-|flex)/g.test(code)) score += 6; else issues.push("Classes Tailwind insuffisantes");
  if (/(?:sm:|md:|lg:)/g.test(code)) score += 3; else issues.push("Responsive manquant");
  if (code.trim().endsWith('}') || code.trim().endsWith('};')) score += 3; else issues.push("Fin de fichier incorrecte");

  return { score, issues };
}

// 🏗️ Création de la structure Next.js
async function createNextJsProject(projectPath: string, reactCode: string, businessName: string): Promise<void> {
  // Créer les dossiers
  await fs.mkdir(path.join(projectPath, 'app'), { recursive: true });
  await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });
  
  // Page principale
  await fs.writeFile(path.join(projectPath, 'app', 'page.tsx'), reactCode);
  
  // Layout
  const layoutContent = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${businessName}',
  description: 'Site web professionnel pour ${businessName}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`;
  await fs.writeFile(path.join(projectPath, 'app', 'layout.tsx'), layoutContent);
  
  // CSS global
  const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}`;
  await fs.writeFile(path.join(projectPath, 'app', 'globals.css'), globalCSS);
  
  // Package.json
  const packageJson = {
    "name": sanitizeProjectName(businessName),
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "react": "^18",
      "react-dom": "^18", 
      "next": "14.0.4",
      "lucide-react": "^0.294.0"
    },
    "devDependencies": {
      "typescript": "^5",
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "autoprefixer": "^10.0.1",
      "postcss": "^8",
      "tailwindcss": "^3.3.0"
    }
  };
  await fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  
  // Next.js config
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig`;
  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);
  
  // Tailwind config
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config`;
  await fs.writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindConfig);
  
  // PostCSS config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);
  
  // TypeScript config
  const tsConfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), tsConfig);
  
  // Vercel config optimisée pour Next.js 14 App Router
  const vercelConfig = {
    "version": 2,
    "framework": "nextjs"
  };
  await fs.writeFile(path.join(projectPath, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
}

// 🧹 Fonctions utilitaires
function sanitizeProjectName(name: string): string {
  return name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e') 
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 🏗️ **NOUVELLE FONCTION : CRÉER UN PROJET HTML STATIQUE**
 */
async function createHTMLProject(projectPath: string, htmlContent: string, businessName: string): Promise<void> {
  // Créer le dossier du projet
  await fs.mkdir(projectPath, { recursive: true });
  
  // Fichier HTML principal (index.html)
  await fs.writeFile(path.join(projectPath, 'index.html'), htmlContent);
  
  // Package.json minimal pour Vercel
  const packageJson = {
    "name": sanitizeProjectName(businessName),
    "version": "1.0.0",
    "description": `Site web pour ${businessName}`,
    "main": "index.html",
    "scripts": {
      "start": "serve -s .",
      "build": "echo 'Nothing to build for static HTML'"
    },
    "keywords": [businessName, "website", "html", "css"],
    "author": businessName,
    "license": "MIT",
    "devDependencies": {
      "serve": "^14.0.0"
    }
  };
  
  await fs.writeFile(
    path.join(projectPath, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  // Configuration Vercel optimisée pour HTML statique
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "index.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  };
  
  await fs.writeFile(
    path.join(projectPath, 'vercel.json'), 
    JSON.stringify(vercelConfig, null, 2)
  );
  
  console.log(`✅ Projet HTML statique créé avec succès`);
}

// Toutes les fonctions sont maintenant complètes 