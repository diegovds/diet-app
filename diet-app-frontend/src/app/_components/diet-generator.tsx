'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGeneratePlanMutation } from '@/hooks/use-generate-plan-mutation'
import { DietData } from '@/types/diet-data'
import { Loader, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface DietGeneratorProps {
  data: DietData
  token: string
}

export function DietGenerator({ data, token }: DietGeneratorProps) {
  const {
    mutate: generatePlan,
    output,
    isStreaming,
    isError,
    savingDatabase,
    errorSavingDatabase,
    cancel,
  } = useGeneratePlanMutation(token)
  const router = useRouter()

  function handleGenerate() {
    if (isStreaming) {
      cancel()
      return
    }

    generatePlan(data)
  }

  useEffect(() => {
    if (savingDatabase) {
      router.refresh()
    }
  }, [router, savingDatabase])

  return (
    <Card className="w-full border-0 p-5">
      <div className="flex items-center justify-between gap-4">
        <h1>Olá, {data.name}. Clique no botão para gerar a sua dieta.</h1>
        <Button
          className="cursor-pointer gap-2"
          size="lg"
          onClick={handleGenerate}
        >
          {isStreaming ? (
            <Loader className="animate-spin" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
          {isStreaming ? 'Parar dieta' : 'Gerar dieta'}
        </Button>
      </div>

      {output && (
        <div className="bg-card border-border max-h-[500px] overflow-y-auto rounded-lg border p-6">
          <div className="max-w-none">
            <ReactMarkdown
              components={{
                h2: (props) => (
                  <h2
                    className="my-1 text-xl font-bold text-green-600"
                    {...props}
                  />
                ),
                h1: (props) => (
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
  )
}
