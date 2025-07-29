import { create } from 'zustand'
import { Facility, Equipment } from './supabase'

interface AppState {
  // Selected facility
  selectedFacility: Facility | null
  setSelectedFacility: (facility: Facility | null) => void
  
  // Side panel state
  isSidePanelOpen: boolean
  setSidePanelOpen: (open: boolean) => void
  
  // Map region filter
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  
  // Equipment list for selected facility
  facilityEquipment: Equipment[]
  setFacilityEquipment: (equipment: Equipment[]) => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedFacility: null,
  setSelectedFacility: (facility) => set({ selectedFacility: facility }),
  
  isSidePanelOpen: false,
  setSidePanelOpen: (open) => set({ isSidePanelOpen: open }),
  
  selectedRegion: 'kanto',
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  
  facilityEquipment: [],
  setFacilityEquipment: (equipment) => set({ facilityEquipment: equipment }),
  
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))