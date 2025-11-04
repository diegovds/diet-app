import fs from 'fs'
import OpenAI from 'openai'
import { env } from './env'
import {
  buildDocsSystemPrompt,
  buildSystemPrompt,
  buildUserPrompt,
} from './prompt'
import { DietPlanRequest } from './schemas/diets'

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  timeout: 2 * 60 * 1000, // 2 minutos
  logLevel: 'debug',
})

export async function* generateDietPlan(input: DietPlanRequest) {
  const guidelines = fs.readFileSync('knowledge/guidelines.md', 'utf-8')

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'system', content: buildDocsSystemPrompt(guidelines) },
      { role: 'user', content: buildUserPrompt(input) },
    ],
    temperature: 0.6,
    stream: true,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) yield delta
  }
}

/*
 - stream:false > O modelo pensa, gera toda a resposta inteira, e só depois te devolve.
 - stream:true > O modelo pensa, gera a resposta parcialmente, e te devolve a cada vez que tem uma nova parte.
*/
