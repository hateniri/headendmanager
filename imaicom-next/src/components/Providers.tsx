'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import ThemeProvider from '@/components/ThemeProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}