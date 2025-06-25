import 'dotenv/config';

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./generate_prompt.mts";
import { smartCollectAndGenerate, convertComponentAnswers } from "./tools/smart-collect.mts";
import { collectCompleteProjectInfo, collectProjectInfo } from "./tools/collect-info.mts";
import { analyzeRequest } from "./tools/analyze-request.mts";
import { generateDesign } from "./tools/generate-design.mts";

const designPrompt = loadAgentPrompt('design');

// Configuration pour OpenAI - Modèle obéissant et performant
const agentModel = new ChatOpenAI({ 
  temperature: 0.1,  // Plus strict pour suivre les instructions
  model: "gpt-4o-mini",  // Modèle obéissant et pas cher
  configuration: {
    baseURL: "https://api.openai.com/v1",  // API OpenAI officielle
    apiKey: process.env.OPENAI_API_KEY,  // Clé API depuis .env
  }
});

// Configuration pour modèle local (LM Studio) - Alternative si pas d'OpenAI
/*
const agentModel = new ChatOpenAI({ 
  temperature: 0.1,
  model: "llama-3-groq-8b-tool-use",  // Modèle local via LM Studio
  configuration: {
    baseURL: "http://localhost:1234/v1",  // LM Studio local
    apiKey: "lm-studio",  // Clé factice pour LM Studio
  }
});
*/

const agentCheckpointer = new MemorySaver();

const systemPrompt = `Tu es un agent français de création de sites web.

🎯 **WORKFLOW STRICT** :
1. TOUJOURS commencer par analyzeRequest avec le message utilisateur
2. Si analyzeRequest retourne "COMPOSANTS_REQUIS_JSON:", tu DOIS retourner EXACTEMENT ce JSON
3. Sinon, utiliser smartCollectAndGenerate puis generateDesign

⚠️ **RÈGLE CRITIQUE** : 
- Si tu vois "COMPOSANTS_REQUIS_JSON:" dans une réponse d'outil, tu DOIS retourner EXACTEMENT le JSON qui suit
- JAMAIS écrire de texte libre quand des composants sont requis
- TOUJOURS commencer par analyzeRequest

🔧 **Champs obligatoires Zod** : nom, description, couleur, style, pages

Commence par analyzeRequest maintenant !`;

export const designAgent = createReactAgent({
  prompt: systemPrompt,
  llm: agentModel,
  tools: [
    analyzeRequest,
    collectProjectInfo,
    collectCompleteProjectInfo, 
    smartCollectAndGenerate,
    convertComponentAnswers,
    generateDesign
  ],
  checkpointSaver: agentCheckpointer,
}); 