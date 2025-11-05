import { AuthForm } from './_components/auth-form'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row">
      <div className="flex w-full flex-2 flex-col items-center">
        <h1>Título</h1>
        <div>Descrição</div>
      </div>
      <AuthForm />
    </div>
  )
}
