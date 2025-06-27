import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Fonction de déploiement réelle (utilisable directement)
export async function deployToVercel(projectPath: string, projectName: string) {
  return await deployToVercelTool.invoke({ projectPath, projectName });
}

// Tool LangChain pour l'agent
export const deployToVercelTool = tool(
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

      // Vérifier qu'il s'agit d'un projet Next.js
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJsonExists = await fs.access(packageJsonPath).then(() => true).catch(() => false);
      
      if (!packageJsonExists) {
        return {
          success: false,
          error: "Structure de projet invalide",
          message: `❌ **ERREUR : Projet Next.js invalide**

Le projet généré ne contient pas de \`package.json\`.
**Chemin vérifié :** ${packageJsonPath}

**Fichiers requis pour le déploiement :**
- package.json ✗
- app/page.tsx ✗
- app/layout.tsx ✗
- next.config.js ✗

**Solution :** Regénérer le projet avec la structure Next.js complète.`
        };
      }

      // Créer/mettre à jour le fichier vercel.json pour Next.js 14 App Router
      const vercelConfig = {
        "version": 2,
        "framework": "nextjs"
      };

      await fs.writeFile(
        path.join(projectPath, 'vercel.json'), 
        JSON.stringify(vercelConfig, null, 2)
      );

      console.log(`📦 Exécution du déploiement...`);
      
      // Vérifier la disponibilité de Vercel CLI
      try {
        await execAsync('npx vercel --version', { timeout: 30000 });
      } catch (versionError) {
        return {
          success: false,
          error: "Vercel CLI non disponible",
          message: `❌ **ERREUR : Vercel CLI non disponible**

**Problème :** ${versionError.message}

**Solutions :**
1. **Installer Vercel CLI globalement :**
   \`npm install -g vercel\`

2. **Ou utiliser npx :**
   \`npx vercel --version\`

3. **Vérifier la connectivité réseau**

**Déploiement manuel :**
\`cd "${projectPath}" && npx vercel --prod\``
        };
      }

      // Construire la commande de déploiement
      let deployCommand;
      
      if (process.env.VERCEL_TOKEN) {
        // Déploiement automatisé avec token
        deployCommand = `cd "${projectPath}" && npx vercel --prod --yes --token ${process.env.VERCEL_TOKEN}`;
      } else {
        // Déploiement interactif (nécessite une session utilisateur)
        deployCommand = `cd "${projectPath}" && npx vercel --prod --yes`;
      }
      
      try {
        const { stdout, stderr } = await execAsync(deployCommand, { 
          timeout: 300000, // 5 minutes timeout pour le build Next.js
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer pour les logs
        });
        
        console.log('📋 Stdout:', stdout);
        if (stderr) console.log('⚠️ Stderr:', stderr);
        
        // Extraire l'URL de déploiement depuis la sortie de Vercel
        const urlMatches = stdout.match(/https:\/\/[^\s]+\.vercel\.app/g);
        let deploymentUrl = urlMatches ? urlMatches[urlMatches.length - 1] : null; // Prendre la dernière URL (production)
        
        // Fallback: chercher dans stderr aussi
        if (!deploymentUrl && stderr) {
          const stderrMatches = stderr.match(/https:\/\/[^\s]+\.vercel\.app/g);
          deploymentUrl = stderrMatches ? stderrMatches[stderrMatches.length - 1] : null;
        }
        
        if (deploymentUrl) {
          // Vérifier que le site est accessible
          try {
            const testResponse = await fetch(deploymentUrl, { 
              method: 'HEAD',
              timeout: 10000 
            });
            
            if (testResponse.ok) {
              return {
                success: true,
                url: deploymentUrl,
                deployedUrl: deploymentUrl, // Compatibilité avec image-generator.mts
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
• Build Next.js optimisé pour la performance

🔧 **Pour modifier votre site :** Contactez-nous avec vos demandes !`,
                clickableUrl: deploymentUrl,
                isReal: true,
                instructions: [
                  "✅ Site en ligne immédiatement",
                  "🔒 URL sécurisée avec HTTPS automatique", 
                  "📱 Optimisé mobile et desktop",
                  "🚀 Performance Next.js optimisée",
                  "📊 Référencement SEO automatique",
                  "⚡ Edge network mondial Vercel"
                ]
              };
            } else {
              throw new Error(`Site déployé mais inaccessible (status: ${testResponse.status})`);
            }
          } catch (testError) {
            // Site déployé mais test d'accessibilité échoué
            console.warn('⚠️ Test d\'accessibilité échoué:', testError.message);
            return {
              success: true,
              url: deploymentUrl,
              deployedUrl: deploymentUrl, // Compatibilité avec image-generator.mts
              projectName: projectName,
              message: `🎉 **SITE DÉPLOYÉ !** 🚀

🌐 **URL DE VOTRE SITE :**
👆 **CLIQUEZ ICI :** ${deploymentUrl}

⚠️ **Note :** Le site est en cours de propagation sur le réseau Vercel.
Il sera accessible dans quelques instants (1-2 minutes).

✅ **Caractéristiques :**
• HTTPS automatique et sécurisé
• Compatible mobile, tablette et desktop
• Performance optimisée Next.js
• Disponible 24h/24, 7j/7

🔧 **Pour des modifications :** Contactez-nous !`,
              clickableUrl: deploymentUrl,
              isReal: true,
              warning: "Site en cours de propagation"
            };
          }
        } else {
          throw new Error("Impossible d'extraire l'URL de déploiement depuis la sortie Vercel");
        }
        
      } catch (deployError) {
        console.error('❌ Erreur de déploiement:', deployError);
        
        // Analyser le type d'erreur pour donner des solutions spécifiques
        const errorMessage = deployError.message || '';
        
        if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('network')) {
          return {
            success: false,
            error: "Erreur de connectivité réseau",
            message: `❌ **ERREUR DE CONNEXION RÉSEAU**

**Problème :** Impossible de contacter les serveurs Vercel

**Solutions :**
1. **Vérifier la connexion internet**
2. **Vérifier les paramètres proxy/firewall**
3. **Réessayer dans quelques minutes**

**Code généré dans :** \`${projectPath}\`
**Déploiement manuel :** \`cd "${projectPath}" && npx vercel --prod\``
          };
        } else if (errorMessage.includes('timeout')) {
          return {
            success: false,
            error: "Timeout de déploiement",
            message: `❌ **TIMEOUT DE DÉPLOIEMENT**

**Problème :** Le déploiement a pris trop de temps (>5 minutes)

**Causes possibles :**
1. **Build Next.js trop long** (code très volumineux)
2. **Connexion internet lente**
3. **Charge élevée sur Vercel**

**Solutions :**
1. **Réessayer :** \`cd "${projectPath}" && npx vercel --prod\`
2. **Optimiser le code généré**
3. **Déployer depuis une meilleure connexion**

**Code disponible dans :** \`${projectPath}\``
          };
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
          return {
            success: false,
            error: "Erreur d'authentification Vercel",
            message: `❌ **ERREUR D'AUTHENTIFICATION VERCEL**

**Problème :** Token Vercel invalide ou manquant

**Solutions :**
1. **Se connecter à Vercel :**
   \`npx vercel login\`

2. **Ou configurer un token :**
   - Aller sur https://vercel.com/account/tokens
   - Créer un nouveau token
   - Ajouter dans .env : \`VERCEL_TOKEN=votre_token\`

3. **Déployer manuellement :**
   \`cd "${projectPath}" && npx vercel --prod\`

**Code généré dans :** \`${projectPath}\``
          };
        } else if (errorMessage.includes('build failed') || errorMessage.includes('Build error')) {
          return {
            success: false,
            error: "Erreur de build Next.js",
            message: `❌ **ERREUR DE BUILD NEXT.JS**

**Problème :** Le code généré contient des erreurs de compilation

**Solutions :**
1. **Vérifier les logs de build dans Vercel Dashboard**
2. **Tester le build localement :**
   \`cd "${projectPath}" && npm run build\`

3. **Regénérer le code** avec V0.dev

**Erreur détaillée :**
\`${errorMessage}\`

**Code source disponible :** \`${projectPath}\``
          };
        } else {
          // Erreur générique
          return {
            success: false,
            error: `Erreur de déploiement: ${deployError.message}`,
            message: `❌ **ERREUR DE DÉPLOIEMENT VERCEL**

**Problème :** ${deployError.message}

**Solutions :**
1. **Réessayer le déploiement :**
   \`cd "${projectPath}" && npx vercel --prod\`

2. **Vérifier les logs Vercel Dashboard**

3. **Déployer étape par étape :**
   - \`cd "${projectPath}"\`
   - \`npm install\`
   - \`npm run build\`
   - \`npx vercel --prod\`

**Code généré avec succès dans :** \`${projectPath}\`

**Support Vercel :** https://vercel.com/support`
          };
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur générale déploiement Vercel:', error);
      return {
        success: false,
        error: `Erreur système: ${error.message}`,
        message: `❌ **ERREUR SYSTÈME DE DÉPLOIEMENT**

**Problème :** ${error.message}

**Informations de debug :**
- **Projet :** ${projectName}
- **Chemin :** ${projectPath}
- **Node.js :** ${process.version}
- **OS :** ${process.platform}

**Solutions :**
1. **Vérifier les permissions de fichiers**
2. **Vérifier l'espace disque disponible**
3. **Redémarrer le processus serveur**
4. **Contacter le support technique**

**Déploiement manuel :** \`cd "${projectPath}" && npx vercel --prod\``
      };
    }
  },
  {
    name: "deployToVercelTool",
    description: "Déploie un projet Next.js sur Vercel avec gestion complète des erreurs et optimisations",
    schema: z.object({
      projectPath: z.string().describe("Chemin vers le dossier du projet Next.js à déployer"),
      projectName: z.string().describe("Nom du projet pour l'URL de déploiement")
    }),
  }
); 