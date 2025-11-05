import { postAuth } from '@/http/api'
import type { AuthFormData } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'

export function useAuthMutation() {
  return useMutation({
    mutationFn: (data: AuthFormData) => postAuth(data),
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Erro de autenticação:', error.message)
      }
    },
  })
}
