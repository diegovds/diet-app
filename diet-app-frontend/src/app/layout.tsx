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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunitoSans.variable} antialiased`}>
        <div className="flex min-h-dvh flex-col">
          <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-5 py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
