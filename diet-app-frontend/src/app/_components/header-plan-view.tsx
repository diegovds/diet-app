'use client'

import { Button } from '@/components/ui/button'
import { useDeletePlanMutation } from '@/hooks/use-delete-plan-mutation'
import { GetUser200 } from '@/http/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DietForm } from './diet-form'

interface PlanViewProps {
  token: string
  userData: GetUser200
}

export function HeaderPlanView({ userData, token }: PlanViewProps) {
  const [updateData, setUpdateData] = useState(false)
  const { mutate, isPending } = useDeletePlanMutation(token)
  const router = useRouter()

  const handleDeletePlan = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <h1>Olá, {userData.name}</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setUpdateData(!updateData)}
            disabled={isPending}
          >
            {updateData ? 'Fechar' : 'Atualizar dados'}
          </Button>
          <Button
            onClick={handleDeletePlan}
            disabled={isPending}
            variant="destructive"
          >
            Apagar dieta
          </Button>
        </div>
      </div>
      {updateData && (
        <div className="mt-4 flex justify-center">
          <DietForm token={token} userData={userData} update />
        </div>
      )}
    </div>
  )
}
