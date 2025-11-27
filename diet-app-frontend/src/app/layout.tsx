import { getAuthState } from '@/actions/get-auth-state'
import { env } from '@/env'
import { QueryClientContext } from '@/providers/query-client'
import { StoreHydration } from '@/providers/store-hydration'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { Navbar } from './_components/navbar'
import './globals.css'

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'DietaGPT',
    template: '%s | DietaGPT',
  },
  description:
    'Receba planos alimentares completos gerados pelo ChatGPT com base nos seus dados pessoais e objetivos. Simples, rápido e totalmente adaptado ao seu perfil.',
  openGraph: {
    images: [
      {
        url: `${env.NEXT_PUBLIC_FRONTEND_URL}/assets/ui/logo.png`,
        width: 1200,
        height: 630,
        alt: 'B7Store',
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = await getAuthState()

  return (
    <html lang="pt-BR">
      <body className={`${nunitoSans.variable} antialiased`}>
        <QueryClientContext>
          <StoreHydration token={token} />
          <div className="flex min-h-dvh flex-col">
            <Navbar token={token} />
            <main className="mx-auto flex w-full max-w-7xl flex-1 p-4">
              {children}
            </main>
          </div>
        </QueryClientContext>
      </body>
    </html>
  )
}
