'use client'

import { X, Zap, CircuitBoard, Fuel, Flame, Wind, Battery, Shield, Power } from 'lucide-react'

interface InspectionReportSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
}

const reportTypes = [
  { id: 'ups', name: 'UPS', icon: Zap, color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'distribution-panel', name: '分電盤', icon: CircuitBoard, color: 'bg-green-500 hover:bg-green-600' },
  { id: 'underground-tank', name: '地下タンク', icon: Fuel, color: 'bg-gray-600 hover:bg-gray-700' },
  { id: 'fire-prediction', name: '火災予兆', icon: Flame, color: 'bg-red-500 hover:bg-red-600' },
  { id: 'air-conditioning', name: '空調', icon: Wind, color: 'bg-cyan-500 hover:bg-cyan-600' },
  { id: 'battery', name: '蓄電池', icon: Battery, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'disaster-prevention', name: '防災設備', icon: Shield, color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'emergency-generator', name: '非常用発電機', icon: Power, color: 'bg-orange-500 hover:bg-orange-600' },
]

export default function InspectionReportSelectionModal({ isOpen, onClose, facilityId }: InspectionReportSelectionModalProps) {
  const handleSelection = (reportType: string) => {
    alert(`${reportType}の点検報告フォームを開発中です。`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">点検報告書を選択</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">作成する点検報告書の種類を選択してください</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelection(type.name)}
                  className={`p-6 rounded-lg text-white ${type.color} transition-all transform hover:scale-105 hover:shadow-lg`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm font-medium">{type.name}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}