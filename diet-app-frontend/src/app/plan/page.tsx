import { getAuthState } from '@/actions/get-auth-state'
import { getGetPlan, GetGetPlan200, getUser, GetUser200 } from '@/http/api'
import { redirect } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { DietForm } from '../_components/diet-form'
import { DietGenerator } from '../_components/diet-generator'

export default async function PlanPage() {
  const { token } = await getAuthState()

  if (!token) return redirect('/')

  let userData: GetUser200 | null = null
  let plan: GetGetPlan200 | null = null

  try {
    userData = await getUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {}

  try {
    plan = await getGetPlan({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {}

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
      {userData && !hasAllData && !plan && (
        <DietForm token={token} userData={userData} />
      )}

      {/* Exibe o gerador se todos os dados estão completos */}
      {normalizedUser && !plan && (
        <DietGenerator data={normalizedUser} token={token} />
      )}

      {plan && (
        <div className="rounded-lg bg-gray-100 p-4 shadow-md">
          <ReactMarkdown
            components={{
              h2: (props) => (
                <h2
                  className="my-1 text-xl font-bold text-green-600"
                  {...props}
                />
              ),
              h1: (props) => (
                <h1
                  className="mb-1 text-2xl font-bold text-zinc-900"
                  {...props}
                />
              ),
            }}
          >
            {plan.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
