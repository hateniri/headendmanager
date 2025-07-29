'use client'

import React, { useState } from 'react'
import { 
  Server, Zap, Shield, Network, HardDrive, Radio, 
  AlertTriangle, Cable, Activity, Info, Calendar,
  Wrench, FileText, AlertCircle, CheckCircle, Circle,
  X, Package, ChevronRight
} from 'lucide-react'
import { 
  detailedRackLayouts,
  calculateDetailedRackUtilization,
  DetailedRack,
  Equipment
} from '@/data/rack-layout-detailed'

// モノトーンのカテゴリー色（グレースケール）
const categoryColors: Record<string, string> = {
  '電源設備': 'bg-gray-700',
  'ケーブルモデム終端装置': 'bg-gray-600',
  'ネットワーク機器': 'bg-gray-800',
  'サーバー': 'bg-gray-700',
  'ストレージ': 'bg-gray-600',
  '光伝送装置': 'bg-gray-500',
  '映像処理装置': 'bg-gray-600',
  '監視装置': 'bg-gray-700',
  'ケーブル管理': 'bg-gray-400',
  'セキュリティ機器': 'bg-gray-800',
  '光配線設備': 'bg-gray-500',
  'その他': 'bg-gray-600'
}

// ステータスアイコン（モノトーン）
const statusIcons = {
  active: <Circle className="h-3 w-3 text-gray-700 fill-current" />,
  standby: <Circle className="h-3 w-3 text-gray-500" />,
  maintenance: <Wrench className="h-3 w-3 text-gray-600" />,
  fault: <AlertTriangle className="h-3 w-3 text-gray-800" />
}

// ゾーンの説明
const zoneDescriptions: Record<string, string> = {
  'A': 'ネットワーク・配信系',
  'B': '光伝送・映像処理系',
  'C': '電源・UPS系',
  'D': '監視・管理系',
  'E': '予備・拡張エリア',
  'F': '未使用',
  'G': '未使用',
  'H': '未使用'
}

export default function HeadendRackViewSidebar() {
  const [selectedRack, setSelectedRack] = useState<DetailedRack>(detailedRackLayouts[0])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  
  // ゾーン別にラックをグループ化
  const racksByZone = detailedRackLayouts.reduce((acc, rack) => {
    if (!acc[rack.zone]) {
      acc[rack.zone] = []
    }
    acc[rack.zone].push(rack)
    return acc
  }, {} as Record<string, DetailedRack[]>)
  
  // ピッチ番号を下から上に（42→1）
  const reversedPitchNumbers = Array.from({ length: 42 }, (_, i) => 42 - i)
  
  // ピッチ情報を取得
  const getPitchInfo = (rack: DetailedRack, pitchNumber: number): { equipment: Equipment | null, isOccupied: boolean, isPrimary: boolean } => {
    const pitch = rack.pitches.find(p => p.pitchNumber === pitchNumber)
    
    if (pitch?.equipment) {
      return { equipment: pitch.equipment, isOccupied: true, isPrimary: true }
    }
    
    for (const p of rack.pitches) {
      if (p.equipment && p.pitchNumber < pitchNumber && p.pitchNumber + p.height > pitchNumber) {
        return { equipment: p.equipment, isOccupied: true, isPrimary: false }
      }
    }
    
    return { equipment: null, isOccupied: false, isPrimary: false }
  }

  // ラックのサマリー情報を取得
  const getRackSummary = (rack: DetailedRack) => {
    const utilization = calculateDetailedRackUtilization(rack)
    const equipmentTypes = new Map<string, number>()
    
    rack.pitches.forEach(pitch => {
      if (pitch.equipment && pitch.height > 0) {
        const type = pitch.equipment.type
        equipmentTypes.set(type, (equipmentTypes.get(type) || 0) + 1)
      }
    })
    
    const topTypes = Array.from(equipmentTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => `${type}(${count})`)
    
    return {
      utilization,
      topTypes,
      isEmpty: utilization.equipmentCount === 0
    }
  }

  // 機器詳細モーダル
  const EquipmentDetailModal = ({ equipment }: { equipment: Equipment }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
           onClick={() => setSelectedEquipment(null)}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4" 
             onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{equipment.name}</h2>
              <p className="text-gray-600 mt-1">固定資産番号: {equipment.assetNumber}</p>
            </div>
            <button onClick={() => setSelectedEquipment(null)} 
                    className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">基本情報</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">機器ID</dt>
                    <dd className="text-sm font-medium">{equipment.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">カテゴリー</dt>
                    <dd className="text-sm font-medium">{equipment.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">メーカー / モデル</dt>
                    <dd className="text-sm font-medium">{equipment.manufacturer} / {equipment.model}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">ステータス</dt>
                    <dd className="text-sm font-medium flex items-center gap-2">
                      {statusIcons[equipment.status]}
                      <span>{equipment.status}</span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">設置・保守情報</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">設置年月日</dt>
                    <dd className="text-sm font-medium">{equipment.installDate}</dd>
                  </div>
                  {equipment.warrantyExpire && (
                    <div>
                      <dt className="text-xs text-gray-500">保証期限</dt>
                      <dd className="text-sm font-medium">{equipment.warrantyExpire}</dd>
                    </div>
                  )}
                  {equipment.maintenanceContract && (
                    <div>
                      <dt className="text-xs text-gray-500">保守契約</dt>
                      <dd className="text-sm font-medium">{equipment.maintenanceContract}</dd>
                    </div>
                  )}
                  {equipment.powerConsumption && (
                    <div>
                      <dt className="text-xs text-gray-500">消費電力</dt>
                      <dd className="text-sm font-medium">{equipment.powerConsumption}W</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-300px)] gap-6">
      {/* 左側：ラック一覧 */}
      <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">ラック一覧</h3>
        </div>
        
        <div className="overflow-y-auto h-full">
          {Object.entries(racksByZone).sort().map(([zone, racks]) => (
            <div key={zone} className="border-b border-gray-200 last:border-b-0">
              <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                Zone {zone} - {zoneDescriptions[zone] || '未定義'}
              </div>
              
              {racks.map(rack => {
                const summary = getRackSummary(rack)
                const isSelected = selectedRack?.id === rack.id
                
                return (
                  <button
                    key={rack.id}
                    onClick={() => setSelectedRack(rack)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-gray-100 border-l-4 border-gray-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{rack.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        summary.utilization.utilizationRate > 80 ? 'bg-gray-800 text-white' :
                        summary.utilization.utilizationRate > 60 ? 'bg-gray-600 text-white' :
                        summary.utilization.utilizationRate > 0 ? 'bg-gray-400 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {summary.utilization.utilizationRate}%
                      </span>
                    </div>
                    
                    {summary.isEmpty ? (
                      <p className="text-xs text-gray-500">空きラック</p>
                    ) : (
                      <div className="text-xs text-gray-600">
                        <p>{summary.utilization.equipmentCount}機器 • {summary.utilization.usedPitches}U使用</p>
                        <p className="truncate mt-1">{summary.topTypes.join(', ')}</p>
                      </div>
                    )}
                    
                    {isSelected && (
                      <ChevronRight className="h-4 w-4 text-gray-400 float-right -mt-8" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 右側：選択されたラックの詳細 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {selectedRack ? (
          <>
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Rack {selectedRack.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRack.location} • Zone {selectedRack.zone} - {zoneDescriptions[selectedRack.zone]}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {calculateDetailedRackUtilization(selectedRack).equipmentCount}
                  </div>
                  <div className="text-sm text-gray-600">機器設置</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              <div className="flex gap-4">
                {/* ピッチ番号（左） */}
                <div className="flex-shrink-0">
                  {reversedPitchNumbers.map(num => (
                    <div key={`left-${num}`} className="h-10 flex items-center justify-end pr-2 text-xs font-mono text-gray-500">
                      {num}
                    </div>
                  ))}
                </div>

                {/* ラック本体 */}
                <div className="flex-1 border-2 border-gray-300 bg-gray-50">
                  {reversedPitchNumbers.map(pitchNum => {
                    const { equipment, isOccupied, isPrimary } = getPitchInfo(selectedRack, pitchNum)
                    
                    if (!isOccupied) {
                      return (
                        <div key={pitchNum} className="h-10 border-b border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400 font-medium">ブランク</span>
                        </div>
                      )
                    } else if (isPrimary && equipment) {
                      const pitch = selectedRack.pitches.find(p => p.pitchNumber === pitchNum)!
                      const bgColor = categoryColors[equipment.category] || categoryColors['その他']
                      
                      return (
                        <div
                          key={pitchNum}
                          className={`${bgColor} text-white border-b border-gray-400 cursor-pointer hover:opacity-90 transition-opacity`}
                          style={{ height: `${pitch.height * 40}px` }}
                          onClick={() => setSelectedEquipment(equipment)}
                        >
                          <div className="h-full p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {statusIcons[equipment.status]}
                              <div>
                                <div className="text-sm font-medium">{equipment.name}</div>
                                <div className="text-xs opacity-80">{equipment.assetNumber}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs">{equipment.manufacturer}</div>
                              <div className="text-xs opacity-80">{equipment.model}</div>
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      return <div key={pitchNum} className="hidden" />
                    }
                  })}
                </div>

                {/* ピッチ番号（右） */}
                <div className="flex-shrink-0">
                  {reversedPitchNumbers.map(num => (
                    <div key={`right-${num}`} className="h-10 flex items-center justify-start pl-2 text-xs font-mono text-gray-500">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p>ラックを選択してください</p>
            </div>
          </div>
        )}
      </div>

      {/* 機器詳細モーダル */}
      {selectedEquipment && <EquipmentDetailModal equipment={selectedEquipment} />}
    </div>
  )
}