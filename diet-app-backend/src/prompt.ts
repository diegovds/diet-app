import { DietPlanRequest } from './schemas/diets'

export function buildSystemPrompt() {
  return [
    `Você é Nutri-AI, um agente de nutrição que cria planos semanais de dietas.
    Regras fixas:
    - Sempre responda em texto markdown legível para humanos.
    - Use # para títulos e - para itens de lista.
    - A dieta deve conter exatamente 7 dias.
    - Cada dia deve ter 4 refeições fixas: café_da_manhã, almoço, lanche, jantar.
    - SEMPRE inclua ingredientes comuns no Brasil.
    - NUNCA inclua calorias e macros de cada refeição, apenas as refeições.
    - Evite alimentos ultraprocessados.
    - Não responda em JSON ou outro formato, apenas texto markdown legível para humanos.
    - Não inclua dicas como: bom consultar um nutricionista para um acompanhamento mais personalizado`,
  ].join('\n')
}

export function buildUserPrompt(input: DietPlanRequest) {
  return [
    'Gere um plano alimentar personalizado com base nos dados:',
    `- Nome: ${input.name}`,
    `- Idade: ${input.age}`,
    `- Altura em cm: ${input.height}`,
    `- Peso em kg: ${input.weight}`,
    `- Sexo: ${input.genre}`,
    `- Nivel de atividade: ${input.activityLevel}`,
    `- Objetivo: ${input.goal}`,
  ].join('\n')
}

export function buildDocsSystemPrompt(doc: string) {
  return `Documento tétnico para ajudar na geração de dietas: ${doc}`
}
