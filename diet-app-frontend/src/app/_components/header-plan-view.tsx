import { GetUser200 } from '@/http/api'
import { DietForm } from './diet-form'

interface PlanViewProps {
  token: string
  userData: GetUser200
}

export function HeaderPlanView({ userData, token }: PlanViewProps) {
  return (
    <div className="space-y-5">
      <h1>Olá, {userData.name}</h1>
      <div className="flex justify-center">
        <DietForm token={token} userData={userData} update />
      </div>
    </div>
  )
}
