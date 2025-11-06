import { getAuthState } from '@/actions/get-auth-state'
import { getUser, GetUser200 } from '@/http/api'
import { redirect } from 'next/navigation'
import { DietForm } from '../_components/diet-form'
import { DietGenerator } from '../_components/diet-generator'

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
  } catch (err) {
    console.error('Erro ao buscar usuário:', err)
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
    <div className="flex w-full items-center justify-center">
      {/* Exibe o formulário se userData existe e há campos faltando */}
      {userData && !hasAllData && <DietForm token={token} />}

      {/* Exibe o gerador se todos os dados estão completos */}
      {normalizedUser && <DietGenerator data={normalizedUser} />}
    </div>
  )
}
