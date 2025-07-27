import { create } from 'zustand'
import { Facility, Rack, Inspection, Organization } from '@/types'
import { facilities } from '@/data/facilities'
import { generateRacks } from '@/data/equipment'
import { generateInspections } from '@/data/inspections'
import { generateOrganization } from '@/data/organizations'

interface FacilityStore {
  facilities: Facility[]
  selectedFacility: Facility | null
  selectedFacilityRacks: Rack[]
  selectedFacilityInspections: Inspection[]
  selectedFacilityOrganization: Organization | null
  
  selectFacility: (facility: Facility) => void
  clearSelection: () => void
  getRacksForFacility: (facilityId: string) => Rack[]
  getInspectionsForFacility: (facilityId: string) => Inspection[]
  getOrganizationForFacility: (facilityId: string) => Organization
}

export const useFacilityStore = create<FacilityStore>((set, get) => ({
  facilities: facilities,
  selectedFacility: null,
  selectedFacilityRacks: [],
  selectedFacilityInspections: [],
  selectedFacilityOrganization: null,
  
  selectFacility: (facility) => {
    const racks = get().getRacksForFacility(facility.id)
    const inspections = get().getInspectionsForFacility(facility.id)
    const organization = get().getOrganizationForFacility(facility.id)
    
    set({
      selectedFacility: facility,
      selectedFacilityRacks: racks,
      selectedFacilityInspections: inspections,
      selectedFacilityOrganization: organization,
    })
  },
  
  clearSelection: () => set({
    selectedFacility: null,
    selectedFacilityRacks: [],
    selectedFacilityInspections: [],
    selectedFacilityOrganization: null,
  }),
  
  getRacksForFacility: (facilityId) => {
    const facility = facilities.find(f => f.id === facilityId)
    if (!facility) return []
    return generateRacks(facilityId, facility.floors)
  },
  
  getInspectionsForFacility: (facilityId) => {
    return generateInspections(facilityId)
  },
  
  getOrganizationForFacility: (facilityId) => {
    return generateOrganization(facilityId)
  },
}))