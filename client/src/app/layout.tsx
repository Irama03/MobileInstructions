import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
//import Animation from '@/components/Animation'
import dynamic from 'next/dynamic'
//import {createContext} from "react";
//import App from "@/app/app";

//const VoiceRecognition = dynamic(() => import('@/components/VoiceRecognition/VoiceRecognition'), { ssr: false })
const App = dynamic(() => import('@/app/app'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Інструкції для користувачів смарфонів',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  )
}
