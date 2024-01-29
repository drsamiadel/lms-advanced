import { ToastProvider } from '@/components/providers/toaster-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import { Toaster } from '@/components/ui/sonner'
import NextTopLoader from "nextjs-toploader";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS',
  description: 'LMS Web App',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <ToastProvider />
        <ConfettiProvider />
        <Toaster />
        {children}
        </body>
    </html>
  )
}
