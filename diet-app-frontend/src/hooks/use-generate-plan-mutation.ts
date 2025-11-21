import { PostGenPlanBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useInsertPlanMutation } from './use-insert-plan-mutation'

export function useGeneratePlanMutation(token: string) {
  const controllerRef = useRef<AbortController | null>(null)
  const [output, setOutput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isError, setIsError] = useState(false)

  const { mutateAsync: savePlan } = useInsertPlanMutation(token)

  const mutation = useMutation({
    mutationFn: async (data: PostGenPlanBody) => {
      const controller = new AbortController()
      controllerRef.current = controller

      setOutput('')
      setIsStreaming(true)

      try {
        const response = await fetch('http://localhost:3333/genPlan', {
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

      setIsSaving(true)
      try {
        await savePlan({ content: generatedText })
      } catch {
        setIsError(true)
      } finally {
        setIsSaving(false)
      }
    },
  })

  return {
    ...mutation,
    output,
    isStreaming,
    isSaving,
    isError,
    cancel: () => controllerRef.current?.abort(),
  }
}
