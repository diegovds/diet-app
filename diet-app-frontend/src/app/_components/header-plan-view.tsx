import { GetUser200 } from '@/http/api'

interface PlanViewProps {
  token: string
  userData: GetUser200
}

export function HeaderPlanView({ userData, token }: PlanViewProps) {
  return (
    <div className="">
      <h1>Olá, {userData.name}</h1>
    </div>
  )
}
