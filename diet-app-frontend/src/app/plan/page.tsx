import { getAuthState } from '@/actions/get-auth-state'
import { redirect } from 'next/navigation'
import { DietForm } from '../_components/diet-form'

export default async function PlanPage() {
  const { token } = await getAuthState()

  if (!token) return redirect('/')

  return (
    <div className="flex w-full items-center justify-center">
      <DietForm token={token} />
    </div>
  )
}
