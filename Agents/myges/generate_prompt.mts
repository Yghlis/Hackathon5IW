import fs from 'fs';
import path from 'path';

export function replacePromptVariables(promptTemplate: string): string {
  const now = new Date();
  
  const variables = {
    date: now.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    heure: now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    timestamp: now.toISOString(),
    jour: now.toLocaleDateString('fr-FR', { weekday: 'long' }),
    mois: now.toLocaleDateString('fr-FR', { month: 'long' }),
    annee: now.getFullYear().toString(),
    datetime: now.toLocaleString('fr-FR'),
    iso_date: now.toISOString().split('T')[0],
    iso_time: now.toISOString().split('T')[1].split('.')[0]
  };

  let processedPrompt = promptTemplate;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    processedPrompt = processedPrompt.replace(regex, value);
  });

  return processedPrompt;
}

export function loadAndProcessPrompt(promptPath: string): string {
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
  return replacePromptVariables(promptTemplate);
}

export function loadAgentPrompt(agentName: string): string {
  const promptPath = path.join(process.cwd(), 'Agents', agentName, 'prompt.md');
  return loadAndProcessPrompt(promptPath);
} 