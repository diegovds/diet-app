'use client'

import { GetUser200 } from '@/http/api'
import { useState } from 'react'
import { HeaderPlanView } from './header-plan-view'
import { PlanView } from './plan-view'

interface DietProps {
  token: string
  userData: GetUser200
}

export function Diet({ token, userData }: DietProps) {
  const [updateData, setUpdateData] = useState(false)

  const openChangeCard = (open: boolean) => {
    setUpdateData(open)
  }

  return (
    <div className="w-full space-y-5">
      <HeaderPlanView
        token={token}
        userData={userData}
        openChangeCard={openChangeCard}
      />
      {userData.plan && !updateData && (
        <>
          <h3 className="text-base">
            Segue abaixo a sua dieta gerada pelo ChatGPT
          </h3>
          <PlanView plan={userData.plan.content} />
        </>
      )}
    </div>
  )
}
