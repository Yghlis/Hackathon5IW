import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const deployToVercel = tool(
  async ({ projectPath, projectName }) => {
    try {
      console.log(`🚀 Déploiement réel sur Vercel: ${projectName}`);
      
      // Vérifier que le dossier existe
      const exists = await fs.access(projectPath).then(() => true).catch(() => false);
      if (!exists) {
        return {
          success: false,
          error: "WORKFLOW INCOMPLET - Code non généré",
          message: `🚨 **ERREUR CRITIQUE DE WORKFLOW** 🚨

❌ **PROBLÈME :** Le code du site n'existe pas car l'étape \`generateWebsiteCode()\` a été ignorée !

🔧 **SOLUTION IMMÉDIATE :**
L'agent DOIT suivre l'ordre exact :
1. ✅ \`getProjectInfo()\` - OK
2. ❌ \`generateWebsiteCode()\` - **MANQUÉ !**
3. ❌ \`deployToVercel()\` - Impossible sans étape 2

📁 **Dossier recherché :** ${projectPath}
⚠️  **DÉPLOIEMENT IMPOSSIBLE SANS GÉNÉRATION DE CODE !**

💡 **L'agent doit d'abord générer le code avant de tenter un déploiement.**`
        };
      }

      // Créer un fichier vercel.json pour la configuration
      const vercelConfig = {
        "version": 2,
        "name": projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        "builds": [
          {
            "src": "index.html",
            "use": "@vercel/static"
          }
        ],
        "routes": [
          {
            "src": "/(.*)",
            "dest": "/$1"
          }
        ]
      };

      await fs.writeFile(
        path.join(projectPath, 'vercel.json'), 
        JSON.stringify(vercelConfig, null, 2)
      );

      // Créer un package.json minimal si il n'existe pas
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJsonExists = await fs.access(packageJsonPath).then(() => true).catch(() => false);
      
      if (!packageJsonExists) {
        const packageJson = {
          "name": projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          "version": "1.0.0",
          "scripts": {
            "build": "echo 'No build process needed for static site'"
          }
        };
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      // Déployer avec Vercel CLI
      const deployCommand = `cd "${projectPath}" && npx vercel --prod --yes --token ${process.env.VERCEL_TOKEN || ''}`;
      
      console.log(`📦 Exécution du déploiement...`);
      
      try {
        const { stdout, stderr } = await execAsync(deployCommand, { 
          timeout: 120000 // 2 minutes timeout
        });
        
        console.log('📋 Stdout:', stdout);
        if (stderr) console.log('⚠️ Stderr:', stderr);
        
        // Extraire l'URL de déploiement depuis la sortie de Vercel
        const urlMatch = stdout.match(/https:\/\/[^\s]+\.vercel\.app/);
        const deploymentUrl = urlMatch ? urlMatch[0] : null;
        
        if (deploymentUrl) {
          return {
            success: true,
            url: deploymentUrl,
            projectName: projectName,
            message: `🎉 **SITE DÉPLOYÉ AVEC SUCCÈS !** 🚀

🌐 **VOTRE SITE EST EN LIGNE À CETTE ADRESSE :**
👆 **CLIQUEZ ICI :** ${deploymentUrl}

✅ **Votre site est maintenant accessible dans le monde entier !**

📋 **INFORMATIONS IMPORTANTES :**
• Copiez cette URL et partagez-la avec vos clients
• Le site fonctionne sur mobile, tablette et ordinateur  
• Disponible 24h/24, 7j/7
• Sécurisé avec HTTPS automatique

🔧 **Pour modifier votre site :** Contactez-nous avec vos demandes !`,
            clickableUrl: deploymentUrl,
            isReal: true,
            instructions: [
              "✅ Site en ligne immédiatement",
              "🔒 URL sécurisée avec HTTPS automatique", 
              "📱 Optimisé mobile et desktop",
              "🚀 Performance optimisée",
              "📊 Référencement SEO de base inclus"
            ]
          };
        } else {
          throw new Error("Impossible d'extraire l'URL de déploiement");
        }
        
      } catch (deployError) {
        console.error('❌ Erreur de déploiement:', deployError);
        
        // Si pas de token Vercel, expliquer comment en obtenir un
        if (!process.env.VERCEL_TOKEN) {
          return {
            success: false,
            error: "Token Vercel manquant",
            message: `⚠️ **CONFIGURATION NÉCESSAIRE POUR LE DÉPLOIEMENT RÉEL**

🔑 **Pour déployer vraiment sur Vercel :**

1. **Créer un compte Vercel gratuit :**
   - Aller sur https://vercel.com
   - S'inscrire avec GitHub/GitLab/Bitbucket

2. **Obtenir un token d'accès :**
   - Aller dans Settings > Tokens
   - Créer un nouveau token
   - Le copier

3. **Configurer le token :**
   - Ajouter dans votre fichier .env :
   \`VERCEL_TOKEN=votre_token_ici\`

4. **Relancer le déploiement !**

💻 **En attendant, le code est généré dans :**
\`${projectPath}\`

🔧 **Vous pouvez le déployer manuellement avec :**
\`cd "${projectPath}" && npx vercel --prod\``
          };
        }
        
        return {
          success: false,
          error: `Erreur de déploiement: ${deployError.message}`,
          message: `❌ Erreur lors du déploiement. Le code est dans: ${projectPath}`
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur déploiement Vercel:', error);
      return {
        success: false,
        error: `Impossible de déployer sur Vercel: ${error.message}`,
        message: "❌ Erreur lors du déploiement. Veuillez réessayer ou contacter le support."
      };
    }
  },
  {
    name: "deployToVercel",
    description: "Déploie VRAIMENT un site web sur Vercel et retourne l'URL publique réelle",
    schema: z.object({
      projectPath: z.string().describe("Chemin vers le dossier du projet à déployer"),
      projectName: z.string().describe("Nom du projet pour l'URL de déploiement")
    }),
  }
); 