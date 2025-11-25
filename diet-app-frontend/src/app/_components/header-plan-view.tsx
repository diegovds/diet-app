'use client'

import { Button } from '@/components/ui/button'
import { GetUser200 } from '@/http/api'
import { useState } from 'react'
import { DietForm } from './diet-form'

interface PlanViewProps {
  token: string
  userData: GetUser200
}

export function HeaderPlanView({ userData, token }: PlanViewProps) {
  const [updateData, setUpdateData] = useState(false)

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <h1>Olá, {userData.name}</h1>
        <Button onClick={() => setUpdateData(!updateData)}>
          {updateData ? 'Fechar' : 'Atualizar dados'}
        </Button>
      </div>
      {updateData && (
        <div className="mt-4 flex justify-center">
          <DietForm token={token} userData={userData} update />
        </div>
      )}
    </div>
  )
}
