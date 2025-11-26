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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl">
          Olá, <strong>{userData.name}</strong>
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setUpdateData(!updateData)}
            disabled={isPending || isPendingPlan}
          >
            {updateData ? 'Fechar' : 'Atualizar dados'}
          </Button>
          <Button
            onClick={handleDeletePlan}
            disabled={isPending || isPendingPlan}
            variant="destructive"
          >
            Apagar dieta
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
