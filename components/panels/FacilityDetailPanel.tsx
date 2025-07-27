'use client'

import React from 'react'
import { useUIStore } from '@/store/uiStore'
import { useFacilityStore } from '@/store/facilityStore'
import TabNavigation from './TabNavigation'
import EquipmentTab from './tabs/EquipmentTab'
import InspectionTab from './tabs/InspectionTab'
import RepairRequestTab from './tabs/RepairRequestTab'
import OrganizationTab from './tabs/OrganizationTab'

export default function FacilityDetailPanel() {
  const { isPanelOpen, closePanel, activeTab } = useUIStore()
  const { selectedFacility, clearSelection } = useFacilityStore()

  const handleClose = () => {
    closePanel()
    clearSelection()
  }

  if (!isPanelOpen || !selectedFacility) return null

  return (
    <div className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 bg-white shadow-xl transform transition-transform duration-300 ${
      isPanelOpen ? 'translate-x-0' : 'translate-x-full'
    } z-50`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{selectedFacility.name}</h2>
              <p className="text-sm opacity-90 mt-1">{selectedFacility.address}</p>
              <div className="mt-2 text-sm">
                <span className="mr-4">管理者: {selectedFacility.managerName}</span>
                <span>階数: {selectedFacility.floors}階</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-blue-700 p-2 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'equipment' && <EquipmentTab />}
          {activeTab === 'inspection' && <InspectionTab />}
          {activeTab === 'repair' && <RepairRequestTab />}
          {activeTab === 'organization' && <OrganizationTab />}
        </div>
      </div>
    </div>
  )
}