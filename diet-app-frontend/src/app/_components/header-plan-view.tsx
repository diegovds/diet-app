'use client'

import { Button } from '@/components/ui/button'
import { useDeletePlanMutation } from '@/hooks/use-delete-plan-mutation'
import { GetUser200 } from '@/http/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DietForm } from './diet-form'

interface PlanViewProps {
  token: string
  userData: GetUser200
  openChangeCard: (open: boolean) => void
}

export function HeaderPlanView({
  userData,
  token,
  openChangeCard,
}: PlanViewProps) {
  const [updateData, setUpdateData] = useState(false)
  const [isPendingPlan, setIsPendingPlan] = useState(false)
  const { mutate, isPending } = useDeletePlanMutation(token)
  const router = useRouter()

  const handleDeletePlan = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  useEffect(() => {
    openChangeCard(updateData)
  }, [updateData, openChangeCard])

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl">
          Olá, <strong>{userData.name}</strong>
        </h1>
        <div className="flex gap-4">
          <Button
            className="flex-1 md:flex-none"
            onClick={() => setUpdateData(!updateData)}
            disabled={isPending || isPendingPlan}
          >
            {updateData ? 'Mostrar dieta' : 'Atualizar dados'}
          </Button>
          <Button
            className="flex-1 md:flex-none"
            onClick={handleDeletePlan}
            disabled={isPending || isPendingPlan || updateData}
            variant="destructive"
          >
            {isPending ? 'Apagando...' : 'Apagar dieta'}
          </Button>
        </div>
      </div>
      {updateData && (
        <div className="mt-4 flex justify-center">
          <DietForm
            token={token}
            userData={userData}
            update
            onPendingPlanChange={(value) => setIsPendingPlan(value)}
          />
        </div>
      )}
    </div>
  )
}
