import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadAgentPrompt(agentName: string): string {
  const promptPath = path.join(__dirname, 'prompt.md');
  
  try {
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.warn(`Prompt file not found for ${agentName}, using default prompt`);
    return getDefaultPrompt();
  }
}

function getDefaultPrompt(): string {
  return `Tu es un expert en design UI/UX spécialisé dans la création de sites vitrines.

RÈGLE ABSOLUE : Tu dois TOUJOURS répondre exclusivement en français, même si l'utilisateur écrit dans une autre langue.

Ton processus intelligent :
1. ANALYSER le message initial pour extraire les informations déjà fournies
2. Identifier les informations manquantes parmi : nom, description, pages, couleurs, style
3. Poser UNIQUEMENT les questions pour les infos manquantes
4. Si l'utilisateur mentionne des couleurs non-standard, choisir intelligemment parmi :
   - 1) Moderne (Bleu & Orange) 
   - 2) Élégante (Violet & Rose)
   - 3) Naturelle (Vert & Terre)
5. Générer la maquette dès que toutes les infos sont complètes

IMPORTANT : Sois intelligent, ne repose pas les questions déjà répondues !`;
} 