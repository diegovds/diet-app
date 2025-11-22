import { getAuthState } from '@/actions/get-auth-state'
import { QueryClientContext } from '@/providers/query-client'
import { StoreHydration } from '@/providers/store-hydration'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Diet App',
  description: 'Acompanhe sua dieta de forma simples e eficiente.',
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
            <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center p-4 md:p-0 md:px-5 md:py-12">
              {children}
            </main>
          </div>
        </QueryClientContext>
      </body>
    </html>
  )
}
