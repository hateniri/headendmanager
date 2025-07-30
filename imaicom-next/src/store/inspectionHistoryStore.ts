import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { InspectionHistory, InspectionHistoryFilter } from '@/types/inspection'

interface InspectionHistoryStore {
  histories: InspectionHistory[]
  addHistory: (history: Omit<InspectionHistory, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateHistory: (id: string, updates: Partial<InspectionHistory>) => void
  deleteHistory: (id: string) => void
  getHistory: (id: string) => InspectionHistory | undefined
  getHistoriesByFacility: (facilityId: string) => InspectionHistory[]
  getHistoriesByType: (inspectionType: string) => InspectionHistory[]
  getFilteredHistories: (filter: InspectionHistoryFilter) => InspectionHistory[]
  getLatestHistory: (facilityId: string, inspectionType: string) => InspectionHistory | undefined
}

export const useInspectionHistoryStore = create<InspectionHistoryStore>()(
  persist(
    (set, get) => ({
      histories: [],

      addHistory: (history) => {
        const now = new Date().toISOString()
        const newHistory: InspectionHistory = {
          ...history,
          id: `inspection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now
        }
        set((state) => ({
          histories: [...state.histories, newHistory]
        }))
      },

      updateHistory: (id, updates) => {
        set((state) => ({
          histories: state.histories.map((history) =>
            history.id === id
              ? { ...history, ...updates, updatedAt: new Date().toISOString() }
              : history
          )
        }))
      },

      deleteHistory: (id) => {
        set((state) => ({
          histories: state.histories.filter((history) => history.id !== id)
        }))
      },

      getHistory: (id) => {
        return get().histories.find((history) => history.id === id)
      },

      getHistoriesByFacility: (facilityId) => {
        return get().histories.filter((history) => history.facilityId === facilityId)
      },

      getHistoriesByType: (inspectionType) => {
        return get().histories.filter((history) => history.inspectionType === inspectionType)
      },

      getFilteredHistories: (filter) => {
        let filtered = get().histories

        if (filter.facilityId) {
          filtered = filtered.filter((h) => h.facilityId === filter.facilityId)
        }
        if (filter.inspectionType) {
          filtered = filtered.filter((h) => h.inspectionType === filter.inspectionType)
        }
        if (filter.status) {
          filtered = filtered.filter((h) => h.status === filter.status)
        }
        if (filter.overallJudgment) {
          filtered = filtered.filter((h) => h.overallJudgment === filter.overallJudgment)
        }
        if (filter.startDate) {
          filtered = filtered.filter((h) => h.inspectionStartDate >= filter.startDate!)
        }
        if (filter.endDate) {
          filtered = filtered.filter((h) => h.inspectionEndDate <= filter.endDate!)
        }

        return filtered.sort((a, b) => b.inspectionStartDate.localeCompare(a.inspectionStartDate))
      },

      getLatestHistory: (facilityId, inspectionType) => {
        const histories = get().histories
          .filter((h) => h.facilityId === facilityId && h.inspectionType === inspectionType)
          .sort((a, b) => b.inspectionStartDate.localeCompare(a.inspectionStartDate))
        
        return histories[0] || undefined
      }
    }),
    {
      name: 'inspection-history-storage'
    }
  )
)