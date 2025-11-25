import { deleteDeletePlan } from '@/http/api'
import { useMutation } from '@tanstack/react-query'

export function useDeletePlanMutation(token: string) {
  return useMutation({
    mutationFn: () =>
      deleteDeletePlan({
        headers: { Authorization: `Bearer ${token}` },
      }),

    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Erro ao deletar plano:', error.message)
      }
    },
  })
}
