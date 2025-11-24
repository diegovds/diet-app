import { getAuthState } from '@/actions/get-auth-state'
import { getUser, GetUser200 } from '@/http/api'
import { redirect } from 'next/navigation'
import { DietForm } from '../_components/diet-form'
import { DietGenerator } from '../_components/diet-generator'
import { HeaderPlanView } from '../_components/header-plan-view'
import { PlanView } from '../_components/plan-view'

export default async function PlanPage() {
  const { token } = await getAuthState()

  if (!token) return redirect('/')

  let userData: GetUser200 | null = null

  try {
    userData = await getUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    redirect('/')
  }

  const hasAllData =
    userData &&
    userData.weight != null &&
    userData.height != null &&
    userData.age != null &&
    userData.activityLevel != null &&
    userData.genre != null &&
    userData.goal != null

  const normalizedUser =
    userData && hasAllData
      ? {
          name: userData.name ?? '',
          weight: userData.weight!,
          height: userData.height!,
          age: userData.age!,
          activityLevel: userData.activityLevel!,
          genre: userData.genre!,
          goal: userData.goal!,
        }
      : null

  return (
    <div className="w-full">
      {userData && !hasAllData && !userData.plan && (
        <div className="flex justify-center">
          <DietForm token={token} userData={userData} />
        </div>
      )}

      {normalizedUser && userData && !userData.plan && (
        <DietGenerator data={normalizedUser} token={token} />
      )}

      {userData && userData.plan && (
        <div className="w-full space-y-5">
          <HeaderPlanView username={userData.name} />
          <PlanView plan={userData.plan.content} />
        </div>
      )}
    </div>
  )
}
