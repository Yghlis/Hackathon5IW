import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Stockage en mémoire des projets (simple pour le développement)
const projectMemory: Map<string, any> = new Map();

export const saveProjectInfo = tool(
  async ({ threadId, projectInfo }) => {
    try {
      // Utiliser un threadId par défaut si non fourni
      const finalThreadId = threadId || 'current_conversation';
      console.log(`💾 Sauvegarde des infos projet pour ${finalThreadId}`);
      
      // Récupérer les informations existantes
      const existingInfo = projectMemory.get(finalThreadId) || {};
      
      // Combiner les infos existantes avec les nouvelles (les nouvelles écrasent les anciennes)
      const combinedInfo = {
        ...existingInfo,
        ...projectInfo,
        lastUpdated: new Date().toISOString()
      };
      
      // Combiner intelligemment les pages (fusionner les tableaux sans doublons)
      if (existingInfo.pages && projectInfo.pages) {
        const allPages = [...(existingInfo.pages || []), ...(projectInfo.pages || [])];
        combinedInfo.pages = [...new Set(allPages)]; // Supprime les doublons
      } else if (projectInfo.pages) {
        combinedInfo.pages = projectInfo.pages;
      } else if (existingInfo.pages) {
        combinedInfo.pages = existingInfo.pages;
      }

      // Sauvegarder les informations combinées
      projectMemory.set(finalThreadId, combinedInfo);

      return {
        success: true,
        message: "✅ Informations du projet sauvegardées !",
        saved: combinedInfo,
        threadId: finalThreadId
      };
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde projet:', error);
      return {
        success: false,
        error: `Impossible de sauvegarder: ${error.message}`,
        message: "❌ Erreur lors de la sauvegarde des informations."
      };
    }
  },
  {
    name: "saveProjectInfo",
    description: "Sauvegarde les informations d'un projet en cours pour les réutiliser plus tard",
    schema: z.object({
      threadId: z.string().optional().describe("ID unique de la conversation (utilise 'current_conversation' si non fourni)"),
      projectInfo: z.object({
        businessName: z.string().optional().describe("Nom du business/personne"),
        targetAudience: z.string().optional().describe("Public cible"),
        style: z.string().optional().describe("Style souhaité"),
        pages: z.array(z.string()).optional().describe("Pages nécessaires"),
        colors: z.string().optional().describe("Couleurs préférées"),
        description: z.string().optional().describe("Description détaillée du projet"),
        mockupsGenerated: z.boolean().optional().describe("Si les maquettes ont été générées")
      })
    }),
  }
);

export const getProjectInfo = tool(
  async ({ threadId }) => {
    try {
      // Utiliser un threadId par défaut si non fourni
      const finalThreadId = threadId || 'current_conversation';
      console.log(`📋 Récupération des infos projet pour ${finalThreadId}`);
      
      // Récupérer les informations du projet
      const projectInfo = projectMemory.get(finalThreadId);
      
      if (!projectInfo) {
        return {
          success: false,
          message: "Aucune information de projet trouvée pour cette conversation.",
          projectInfo: null,
          threadId: finalThreadId
        };
      }

      return {
        success: true,
        message: "✅ Informations du projet récupérées !",
        projectInfo: projectInfo,
        threadId: finalThreadId
      };
      
    } catch (error) {
      console.error('❌ Erreur récupération projet:', error);
      return {
        success: false,
        error: `Impossible de récupérer: ${error.message}`,
        message: "❌ Erreur lors de la récupération des informations."
      };
    }
  },
  {
    name: "getProjectInfo",
    description: "Récupère les informations d'un projet sauvegardées précédemment",
    schema: z.object({
      threadId: z.string().optional().describe("ID unique de la conversation (utilise 'current_conversation' si non fourni)")
    }),
  }
);

export const clearProjectInfo = tool(
  async ({ threadId }) => {
    try {
      // Utiliser un threadId par défaut si non fourni
      const finalThreadId = threadId || 'current_conversation';
      console.log(`🗑️ Nettoyage des infos projet pour ${finalThreadId}`);
      
      // Supprimer les informations du projet
      const wasDeleted = projectMemory.delete(finalThreadId);
      
      return {
        success: true,
        message: wasDeleted ? "✅ Informations du projet supprimées !" : "ℹ️ Aucune information à supprimer.",
        threadId: finalThreadId
      };
      
    } catch (error) {
      console.error('❌ Erreur nettoyage projet:', error);
      return {
        success: false,
        error: `Impossible de nettoyer: ${error.message}`,
        message: "❌ Erreur lors du nettoyage des informations."
      };
    }
  },
  {
    name: "clearProjectInfo", 
    description: "Supprime toutes les informations d'un projet sauvegardées (pour repartir à zéro)",
    schema: z.object({
      threadId: z.string().optional().describe("ID unique de la conversation (utilise 'current_conversation' si non fourni)")
    }),
  }
); 