interface PlanViewProps {
  username: string
}

export function HeaderPlanView({ username }: PlanViewProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow md:p-6">
      <h1>Olá, {username}</h1>
    </div>
  )
}
