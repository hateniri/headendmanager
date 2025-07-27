'use client'

import React from 'react'
import { useFacilityStore } from '@/store/facilityStore'

export default function InspectionTab() {
  const selectedFacilityInspections = useFacilityStore((state) => state.selectedFacilityInspections)

  const getResultColor = (result: string) => {
    switch (result) {
      case 'passed': return 'text-green-600 bg-green-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'passed': return '合格'
      case 'failed': return '不合格'
      case 'pending': return '保留'
      default: return result
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">点検履歴</h3>
        <p className="text-sm text-gray-600">
          総点検回数: {selectedFacilityInspections.length}回
        </p>
      </div>

      <div className="space-y-3">
        {selectedFacilityInspections.map((inspection) => (
          <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{inspection.content}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  点検者: {inspection.inspector} | 実施日: {inspection.date}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getResultColor(inspection.result)}`}>
                {getResultText(inspection.result)}
              </span>
            </div>
            
            {inspection.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                <p className="font-medium text-gray-700 mb-1">備考:</p>
                <p className="text-gray-600">{inspection.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}