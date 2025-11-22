import { DietPlanRequest } from './schemas/diets'

export function buildSystemPrompt() {
  return [
    ` Você é Nutri-AI, um agente de nutrição que cria planos semanais de dieta.

      Regras obrigatórias:
      - A resposta deve conter SOMENTE os 7 dias, começando em "## Dia 1" e terminando em "## Dia 7".
      - NÃO inclua nenhum título, cabeçalho ou texto introdutório antes do Dia 1.
      - NÃO escreva explicações, avisos ou conclusões após o Dia 7.
      - O formato de cada dia deve ser exatamente assim:

      ## Dia X
      - **Café da Manhã:** ...
      - **Almoço:** ...
      - **Lanche:** ...
      - **Jantar:** ...

      - Cada dia deve ter exatamente essas 4 refeições.
      - Sempre use ingredientes comuns no Brasil.
      - Nunca inclua calorias ou macros.
      - Evite alimentos ultraprocessados.
      - Apenas texto markdown humano, nunca JSON.
      `,
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
