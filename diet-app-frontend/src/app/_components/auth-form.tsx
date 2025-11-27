'use client'

import { setAuthCookie } from '@/actions/set-auth-cookie'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthMutation } from '@/hooks/use-auth-mutation'
import { useAuthStore } from '@/store/auth'
import { AuthFormData, signInSchema, signUpSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export function AuthForm() {
  const { setToken } = useAuthStore()
  const [isSignin, setIsSignin] = useState(true)
  const router = useRouter()
  const form = useForm<AuthFormData>({
    resolver: zodResolver(isSignin ? signInSchema : signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignin ? {} : { name: '', confirmPassword: '' }),
    },
  })

  const { mutate, isSuccess, isPending, isError, error, data } =
    useAuthMutation()

  const onSubmit = (data: AuthFormData) => {
    mutate(data, {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  useEffect(() => {
    form.reset()
  }, [isSignin, form])

  useEffect(() => {
    if (data?.token) {
      const handleAuth = async () => {
        await setAuthCookie(data.token)
        setToken(data.token)
      }

      handleAuth()
    }
  }, [data, setToken])

  return (
    <Card className="w-full flex-1 gap-6 border-0 p-5">
      <CardHeader className="p-0">
        <CardTitle>
          {isSignin ? 'Faça login na sua conta' : 'Crie sua conta'}
        </CardTitle>
        <CardDescription>
          {isSignin
            ? 'Insira seu e-mail abaixo para acessar sua conta'
            : 'Insira seus dados para criar sua conta'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {!isSignin && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isSignin && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Confirme a senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirme sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isSuccess}
            >
              {isPending || isSuccess
                ? 'Enviando...'
                : isSignin
                  ? 'Entrar'
                  : 'Cadastrar'}
            </Button>
          </form>
        </Form>

        {isError && (
          <p className="mt-2 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : 'Erro ao autenticar. Tente novamente.'}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-center p-0">
        <Button variant="link" onClick={() => setIsSignin(!isSignin)}>
          {isSignin ? 'Criar conta' : 'Já possui uma conta?'}
        </Button>
      </CardFooter>
    </Card>
  )
}
