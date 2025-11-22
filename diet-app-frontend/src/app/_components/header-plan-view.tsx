'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

interface PlanViewProps {
  username: string
}

export function HeaderPlanView({ username }: PlanViewProps) {
  const router = useRouter()
  const { clearToken } = useAuthStore()

  const handleClick = async () => {
    await clearAuthCookie()
    clearToken()
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between">
      <h1>Olá, {username}</h1>
      <Button onClick={handleClick}>Sair</Button>
    </div>
  )
}
