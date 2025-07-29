import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    }
  )
)