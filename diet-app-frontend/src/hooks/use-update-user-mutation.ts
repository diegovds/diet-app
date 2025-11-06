import type { PatchUserBody } from '@/http/api'
import { patchUser } from '@/http/api'
import { useMutation } from '@tanstack/react-query'

export function useUpdateUserMutation(token: string) {
  return useMutation({
    mutationFn: (data: PatchUserBody) =>
      patchUser(data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Erro ao atualizar usuário:', error.message)
      }
    },
  })
}
