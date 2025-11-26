import { getAuthState } from '@/actions/get-auth-state'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarDays, CookingPot, User } from 'lucide-react'
import { redirect } from 'next/navigation'
import { AuthForm } from './_components/auth-form'

export default async function Home() {
  const { token } = await getAuthState()

  if (token) return redirect('/plan')

  const cards = [
    {
      id: 'user',
      title: 'Preencha seus Dados',
      description:
        'Informe idade, peso, altura, sexo, nível de atividade e objetivo para gerar uma dieta alinhada ao seu perfil.',
      Icon: User,
    },
    {
      id: 'cooking',
      title: 'Receba sua Dieta Personalizada',
      description:
        'O sistema gera automaticamente um plano alimentar completo, elaborado com o suporte do ChatGPT e adaptado às suas metas.',
      Icon: CookingPot,
    },
    {
      id: 'calendar',
      title: 'Organize sua Rotina',
      description:
        'Visualize sua dieta semanal de forma prática: dias e refeições em um layout fácil de seguir.',
      Icon: CalendarDays,
    },
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center gap-7 md:flex-row">
      <div className="flex w-full flex-2 flex-col items-center gap-7 md:items-start">
        <h1 className="text-4xl">DietaGPT</h1>
        <p className="text-center md:text-left">
          Receba planos alimentares completos gerados pelo ChatGPT com base nos
          seus dados pessoais e objetivos. Simples, rápido e totalmente adaptado
          ao seu perfil.
        </p>
        <div className="grid w-full grid-cols-1 items-center gap-4 md:grid-cols-3">
          {cards.map(({ id, title, description, Icon }) => (
            <Card
              key={id}
              className="w-full place-self-start border-0 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <CardHeader className="flex flex-col items-center gap-2 p-0">
                <div className="bg-muted/60 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      <AuthForm />
    </div>
  )
}
