'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDeletePlanMutation } from '@/hooks/use-delete-plan-mutation'
import { useUpdateUserMutation } from '@/hooks/use-update-user-mutation'
import { GetUser200 } from '@/http/api'
import { DietData, DietDataSchema } from '@/types/diet-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface DietFormProps {
  token: string
  userData: GetUser200
  update?: boolean
}

export function DietForm({ userData, token, update }: DietFormProps) {
  const router = useRouter()
  const form = useForm<DietData>({
    resolver: zodResolver(DietDataSchema),
    defaultValues: {
      name: userData.name,
      weight: userData.weight || undefined,
      height: userData.height || undefined,
      age: userData.age || undefined,
      activityLevel: userData.activityLevel || undefined,
      genre: userData.genre || undefined,
      goal: userData.goal || undefined,
    },
  })

  const { mutate, isPending, isError, error, isSuccess } =
    useUpdateUserMutation(token)

  const { mutate: deletePLan } = useDeletePlanMutation(token)

  const onSubmit = (userInfo: DietData) => {
    mutate(userInfo, {
      onSuccess: () => {
        if (update && userData.plan) {
          deletePLan()
        }
        router.refresh()
      },
    })
  }

  return (
    <Card className="w-full max-w-3xl border-0 p-0">
      <div className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader className="p-0">
              <CardTitle>Dados pessoais</CardTitle>
              <CardDescription>
                {update
                  ? 'Atualize suas informações'
                  : 'Insira seus dados adicionais para concluir o cadastro'}
              </CardDescription>
            </CardHeader>

            {update && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="age"
                render={() => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...form.register('age', {
                          setValueAs: (v) => (v === '' ? undefined : Number(v)),
                        })}
                        placeholder="Ex: 28"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={() => (
                  <FormItem>
                    <FormLabel>Peso em kg</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...form.register('weight', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseFloat(v),
                        })}
                        placeholder="Ex: 28"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={() => (
                  <FormItem>
                    <FormLabel>Altura em cm</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        {...form.register('height', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseFloat(v),
                        })}
                        placeholder="Ex: 28"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de atividade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o nivel de atividade" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário</SelectItem>
                        <SelectItem value="2x_semana">2x por semana</SelectItem>
                        <SelectItem value="4x_semana">4x por semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o seu objetivo" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="perda_de_peso">
                          Perda de peso
                        </SelectItem>
                        <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                        <SelectItem value="manter_massa_muscular">
                          Manter massa muscular
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="mt-4 w-full cursor-pointer transition-all duration-300 hover:opacity-90"
              disabled={isPending}
            >
              {update
                ? isPending
                  ? 'Atualizando...'
                  : 'Atualizar informações'
                : isPending
                  ? 'Salvando...'
                  : 'Salvar alterações'}
            </Button>
          </form>
        </Form>
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : 'Erro ao atualizar os dados. Tente novamente.'}
          </p>
        )}
      </div>
    </Card>
  )
}
