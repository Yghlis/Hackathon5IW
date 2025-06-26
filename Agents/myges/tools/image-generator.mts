import { tool } from "@langchain/core/tools";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateWebsiteMockup = tool(
  async ({ description, pageType, style, colors }) => {
    try {
      console.log(`🎨 Génération d'une maquette pour: ${description}`);
      
      // Construction du prompt optimisé pour les maquettes web
      const prompt = `Create a modern, professional website mockup for a ${pageType} page. 
      Business description: ${description}
      Design style: ${style}
      Color scheme: ${colors}
      
      Requirements:
      - Clean, modern UI design
      - Professional layout with proper spacing
      - Include navigation bar, content sections, and footer
      - Mobile-responsive design elements
      - High-quality, detailed mockup
      - Realistic website interface
      - No text placeholder, use meaningful content related to the business
      
      Style: Figma/Adobe XD style mockup, clean interface design`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        style: "natural"
      });

      const imageUrl = response.data[0]?.url;
      
      if (!imageUrl) {
        return "❌ Erreur lors de la génération de l'image.";
      }

      return {
        success: true,
        imageUrl: imageUrl,
        description: `Maquette générée pour: ${description}`,
        pageType: pageType,
        style: style,
        message: `✅ Maquette ${pageType} générée avec succès ! 🎨`
      };
      
    } catch (error) {
      console.error('❌ Erreur génération image:', error);
      return {
        success: false,
        error: `Impossible de générer la maquette: ${error.message}`,
        message: "❌ Erreur lors de la génération de la maquette. Veuillez réessayer."
      };
    }
  },
  {
    name: "generateWebsiteMockup",
    description: "Génère une maquette visuelle d'une page web basée sur la description du projet",
    schema: z.object({
      description: z.string().describe("Description détaillée du projet/business pour lequel créer le site"),
      pageType: z.string().describe("Type de page (homepage, about, services, contact, etc.)"),
      style: z.string().describe("Style de design souhaité (moderne, élégant, minimaliste, créatif, etc.)"),
      colors: z.string().describe("Palette de couleurs souhaitée (ex: bleu et blanc, tons chauds, etc.)")
    }),
  }
); 