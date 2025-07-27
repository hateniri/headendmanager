import { create } from 'zustand'

interface UIStore {
  isPanelOpen: boolean
  activeTab: 'equipment' | 'inspection' | 'repair' | 'organization'
  
  openPanel: () => void
  closePanel: () => void
  setActiveTab: (tab: 'equipment' | 'inspection' | 'repair' | 'organization') => void
}

export const useUIStore = create<UIStore>((set) => ({
  isPanelOpen: false,
  activeTab: 'equipment',
  
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))