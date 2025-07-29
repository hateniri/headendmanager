'use client'

import { useEffect } from 'react'
import { useTheme } from '@/lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return <>{children}</>
}