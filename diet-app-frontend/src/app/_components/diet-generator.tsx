'use client'

import { Button } from '@/components/ui/button'
import { useGeneratePlanMutation } from '@/hooks/use-generate-plan-mutation'
import { DietData } from '@/types/diet-data'
import { Loader, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [wasCancelled, setWasCancelled] = useState(false)
  const router = useRouter()

  function handleGenerate() {
    setWasCancelled(true)
    if (isStreaming) {
      cancel()
      return
    }

    setWasCancelled(false)
    generatePlan(data)
  }

  useEffect(() => {
    if (savingDatabase) {
      router.refresh()
    }
  }, [router, savingDatabase])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl">
          Olá, <strong>{data.name}</strong>
        </h1>
        <Button className="cursor-pointer gap-2" onClick={handleGenerate}>
          {isStreaming ? (
            <Loader className="animate-spin" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
          {isStreaming ? 'Parar dieta' : 'Gerar dieta'}
        </Button>
      </div>

      <h3 className="flex items-center gap-0.5 text-base">
        {wasCancelled
          ? 'A sua dieta não foi salva, pois a geração foi interrompida'
          : isStreaming
            ? 'Gerando sua dieta...'
            : isError
              ? 'Ocorreu um erro ao gerar a dieta'
              : savingDatabase
                ? 'Salvando dieta no banco de dados...'
                : errorSavingDatabase
                  ? 'Erro ao salvar a dieta no banco de dados'
                  : output
                    ? 'Dieta gerada com sucesso!'
                    : 'Clique no botão acima para gerar a sua dieta'}
      </h3>

      {output && <PlanView plan={output} />}
    </div>
  )
}
