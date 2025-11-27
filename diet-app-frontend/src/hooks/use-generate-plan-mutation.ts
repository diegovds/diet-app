import { env } from '@/env'
import { PostGenPlanBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useInsertPlanMutation } from './use-insert-plan-mutation'

export function useGeneratePlanMutation(token: string) {
  const controllerRef = useRef<AbortController | null>(null)
  const [output, setOutput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [errorSavingDatabase, setErrorSavingDatabase] = useState(false)
  const [savingDatabase, setSavingDatabase] = useState(false)

  const { mutateAsync: savePlan } = useInsertPlanMutation(token)

  const mutation = useMutation({
    mutationFn: async (data: PostGenPlanBody) => {
      const baseUrl = env.NEXT_PUBLIC_BACKEND_URL
      const controller = new AbortController()
      controllerRef.current = controller

      setOutput('')
      setIsStreaming(true)

      try {
        const response = await fetch(`${baseUrl}/genPlan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        let full = ''

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          const chunk = decoder.decode(value)
          full += chunk
          setOutput((prev) => prev + chunk)
        }

        return full
      } catch (err: any) {
        if (err.name === 'AbortError') return null
        throw err
      } finally {
        setIsStreaming(false)
        controllerRef.current = null
      }
    },

    onSuccess: async (generatedText) => {
      if (!generatedText) return

      try {
        await savePlan({ content: generatedText })
        setSavingDatabase(true)
      } catch {
        setErrorSavingDatabase(true)
      }
    },
  })

  return {
    ...mutation,
    output,
    isStreaming,
    savingDatabase,
    errorSavingDatabase,
    cancel: () => controllerRef.current?.abort(),
  }
}
