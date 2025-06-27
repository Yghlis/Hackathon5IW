import 'dotenv/config';

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./generate_prompt.mts";
import { generateWebsiteMockup } from './tools/code-generator.mts';
import { deployToVercelTool } from './tools/vercel-deploy.mts'; // RÉACTIVÉ - déploiement après génération
import { saveProjectInfo, getProjectInfo, clearProjectInfo } from './tools/project-memory.mts';

const mygesPrompt = loadAgentPrompt('myges');

const agentModel = new ChatOpenAI({ 
  temperature: 0.7,
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  maxTokens: 2000,
});

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERREUR: La variable OPENAI_API_KEY doit être définie dans le fichier .env');
  console.error('💡 Ajoutez OPENAI_API_KEY=votre-clé-openai dans le fichier .env');
  process.exit(1);
}

const agentCheckpointer = new MemorySaver();
const tools = [generateWebsiteMockup, deployToVercelTool, saveProjectInfo, getProjectInfo, clearProjectInfo];
export const mygesAgent = createReactAgent({
  prompt: mygesPrompt,
  llm: agentModel,
  tools: tools,
  checkpointSaver: agentCheckpointer,
});
