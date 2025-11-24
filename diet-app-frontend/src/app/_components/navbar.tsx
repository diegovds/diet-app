'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const { clearToken, token } = useAuthStore()

  const handleClick = async () => {
    await clearAuthCookie()
    clearToken()
    router.refresh()
  }

  return (
    <nav className="w-full bg-white shadow">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 md:p-0 md:px-5 md:py-4">
        <span className="text-lg font-bold">Diet App</span>
        {token && <Button onClick={handleClick}>Sair</Button>}
      </div>
    </nav>
  )
}
