'use client'

import React, { useState } from 'react'
import { useFacilityStore } from '@/store/facilityStore'

export default function EquipmentTab() {
  const selectedFacilityRacks = useFacilityStore((state) => state.selectedFacilityRacks)
  const [expandedRacks, setExpandedRacks] = useState<Set<string>>(new Set())

  const toggleRack = (rackId: string) => {
    const newExpanded = new Set(expandedRacks)
    if (newExpanded.has(rackId)) {
      newExpanded.delete(rackId)
    } else {
      newExpanded.add(rackId)
    }
    setExpandedRacks(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 25) return 'text-blue-600'
    if (temp < 30) return 'text-green-600'
    if (temp < 35) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">ラック・機器一覧</h3>
        <p className="text-sm text-gray-600">
          総ラック数: {selectedFacilityRacks.length} | 
          総機器数: {selectedFacilityRacks.reduce((sum, rack) => sum + rack.equipment.length, 0)}
        </p>
      </div>

      <div className="space-y-2">
        {selectedFacilityRacks.map((rack) => (
          <div key={rack.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleRack(rack.id)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {expandedRacks.has(rack.id) ? '▼' : '▶'}
                </span>
                <span className="font-medium">ラック {rack.rackNumber}</span>
                <span className="text-sm text-gray-500">
                  ({rack.equipment.length}台)
                </span>
              </div>
              <div className="flex gap-2">
                {rack.equipment.some(e => e.status === 'error') && (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                    エラーあり
                  </span>
                )}
                {rack.equipment.some(e => e.status === 'warning') && !rack.equipment.some(e => e.status === 'error') && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    警告あり
                  </span>
                )}
              </div>
            </button>

            {expandedRacks.has(rack.id) && (
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">機器名</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">状態</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">温度</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">型番</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">設置日</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">耐用年数</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rack.equipment.map((equipment) => (
                        <tr key={equipment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{equipment.name}</div>
                              <div className="text-xs text-gray-500">{equipment.manufacturer}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(equipment.status)}`}>
                              {equipment.status === 'normal' ? '正常' : 
                               equipment.status === 'warning' ? '警告' : 'エラー'}
                            </span>
                          </td>
                          <td className={`px-4 py-3 font-medium ${getTemperatureColor(equipment.temperature)}`}>
                            {equipment.temperature}°C
                          </td>
                          <td className="px-4 py-3 text-gray-600">{equipment.model}</td>
                          <td className="px-4 py-3 text-gray-600">{equipment.installDate}</td>
                          <td className="px-4 py-3 text-gray-600">{equipment.lifespan}年</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}