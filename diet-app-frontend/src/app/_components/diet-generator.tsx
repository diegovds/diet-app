'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGeneratePlanMutation } from '@/hooks/use-generate-plan-mutation'
import { DietData } from '@/types/diet-data'
import { Loader, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PlanView } from './plan-view'

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
    <Card className="w-full border-0 bg-transparent p-0 shadow-none">
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

      {output && <PlanView plan={output} />}
    </Card>
  )
}
