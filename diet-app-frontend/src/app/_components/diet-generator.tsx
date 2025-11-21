'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGeneratePlanMutation } from '@/hooks/use-generate-plan-mutation'
import { DietData } from '@/types/diet-data'
import { Loader, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface DietGeneratorProps {
  data: DietData
  token: string
}

export function DietGenerator({ data, token }: DietGeneratorProps) {
  // verificar se já tem um plano salvo e mostrar ele ou permitir gerar caso não tenha,
  // posteriormente add a fução de atualizar plano

  const {
    mutate: generatePlan,
    output,
    isStreaming,
    isSaving,
    cancel,
  } = useGeneratePlanMutation(token)

  function handleGenerate() {
    if (isStreaming) {
      cancel()
      return
    }

    generatePlan(data)
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 p-5">
        <div className="flex justify-center gap-4">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <Loader className="animate-spin" />
            ) : (
              <Sparkles name="w-6 h-6" />
            )}
            {isStreaming ? 'Parar dieta' : 'Gerar dieta'}
          </Button>
        </div>

        {output && (
          <div className="bg-card border-border max-h-[500px] overflow-y-auto rounded-lg border p-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="my-1 text-xl font-bold text-green-600"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="mb-1 text-2xl font-bold text-zinc-900"
                      {...props}
                    />
                  ),
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
