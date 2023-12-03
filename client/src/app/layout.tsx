import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Animation from '@/components/Animation'
import dynamic from 'next/dynamic'

const VoiceRecognition = dynamic(() => import('@/components/VoiceRecognition/VoiceRecognition'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Інструкціі для користувачів смарфонів',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <VoiceRecognition />
        <Animation />
      </body>
    </html>
  )
}
