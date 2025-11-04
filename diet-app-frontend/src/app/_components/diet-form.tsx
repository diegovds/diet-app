'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { DietData, DietDataSchema } from '@/types/diet-data'
import { zodResolver } from '@hookform/resolvers/zod'
import { Utensils } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface DietFormProps {
  onSubmit: (data: DietData) => void
}

export function DietForm({ onSubmit }: DietFormProps) {
  const form = useForm<DietData>({
    resolver: zodResolver(DietDataSchema),
    defaultValues: {
      name: '',
      weight: undefined,
      height: undefined,
      age: undefined,
      activity_level: undefined,
      genre: undefined,
      goal: undefined,
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <Card className="w-full max-w-2xl border-0 p-0">
        <div className="p-5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Utensils className="size-14 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-green-500">
              Calcule sua dieta
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  Dados pessoais
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite seu nome" />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                            setValueAs: (v) =>
                              v === '' ? undefined : Number(v),
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="activity_level"
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
                          <SelectItem value="2x_semana">
                            2x por semana
                          </SelectItem>
                          <SelectItem value="4x_semana">
                            4x por semana
                          </SelectItem>
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
                          <SelectItem value="hipertrofia">
                            Hipertrofia
                          </SelectItem>
                          <SelectItem value="manter_massa_muscular">
                            Manter massa muscular
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="mt-4 w-full cursor-pointer transition-all duration-300 hover:opacity-90">
                Gerar minha dieta
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  )
}
