import { postPlanInsertion, PostPlanInsertionBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'

export function useInsertPlanMutation(token: string) {
  return useMutation({
    mutationFn: (data: PostPlanInsertionBody) =>
      postPlanInsertion(data, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Erro ao salvar plano:', error.message)
      }
    },
  })
}
