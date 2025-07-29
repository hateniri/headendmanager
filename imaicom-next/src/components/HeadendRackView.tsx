'use client'

import React, { useState } from 'react'
import { 
  Server, Zap, Shield, Network, HardDrive, Radio, 
  AlertTriangle, Cable, Activity, Info, Calendar,
  Wrench, FileText, AlertCircle, CheckCircle,
  X, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react'
import { 
  detailedRackLayouts,
  calculateDetailedRackUtilization,
  DetailedRack,
  Equipment
} from '@/data/rack-layout-detailed'

// カテゴリー別の色定義
const categoryColors: Record<string, string> = {
  '電源設備': 'bg-red-600',
  'ケーブルモデム終端装置': 'bg-blue-600',
  'ネットワーク機器': 'bg-green-600',
  'サーバー': 'bg-purple-600',
  'ストレージ': 'bg-orange-600',
  '光伝送装置': 'bg-cyan-600',
  '映像処理装置': 'bg-pink-600',
  '監視装置': 'bg-indigo-600',
  'その他': 'bg-gray-600'
}

// ステータスアイコン
const statusIcons = {
  active: <CheckCircle className="h-4 w-4 text-green-500" />,
  standby: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  maintenance: <Wrench className="h-4 w-4 text-orange-500" />,
  fault: <AlertTriangle className="h-4 w-4 text-red-500" />
}

export default function HeadendRackView() {
  const [selectedRackIndex, setSelectedRackIndex] = useState(0)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [hoveredPitch, setHoveredPitch] = useState<number | null>(null)
  
  const currentRack = detailedRackLayouts[selectedRackIndex]
  
  // ピッチ番号を下から上に（42→1）
  const reversedPitchNumbers = Array.from({ length: 42 }, (_, i) => 42 - i)
  
  // ピッチ情報を取得（複数ピッチにまたがる機器を考慮）
  const getPitchInfo = (pitchNumber: number): { equipment: Equipment | null, isOccupied: boolean, isPrimary: boolean } => {
    const pitch = currentRack.pitches.find(p => p.pitchNumber === pitchNumber)
    
    if (pitch?.equipment) {
      return { equipment: pitch.equipment, isOccupied: true, isPrimary: true }
    }
    
    // 複数ピッチにまたがる機器の一部かチェック
    for (const p of currentRack.pitches) {
      if (p.equipment && p.pitchNumber < pitchNumber && p.pitchNumber + p.height > pitchNumber) {
        return { equipment: p.equipment, isOccupied: true, isPrimary: false }
      }
    }
    
    return { equipment: null, isOccupied: false, isPrimary: false }
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
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <span className="text-sm text-gray-600">機器ID:</span>
                  <p className="font-medium">{equipment.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">カテゴリー:</span>
                  <p className="font-medium">{equipment.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">メーカー:</span>
                  <p className="font-medium">{equipment.manufacturer}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">モデル:</span>
                  <p className="font-medium">{equipment.model}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ステータス:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {statusIcons[equipment.status]}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      equipment.status === 'active' ? 'bg-green-100 text-green-700' :
                      equipment.status === 'standby' ? 'bg-yellow-100 text-yellow-700' :
                      equipment.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {equipment.status === 'active' ? '稼働中' :
                       equipment.status === 'standby' ? 'スタンバイ' :
                       equipment.status === 'maintenance' ? 'メンテナンス中' : '故障'}
                    </span>
                  </div>
                </div>
                {equipment.powerConsumption && (
                  <div>
                    <span className="text-sm text-gray-600">消費電力:</span>
                    <p className="font-medium">{equipment.powerConsumption}W</p>
                  </div>
                )}
              </div>
            </div>

            {/* 設置・保守情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                設置・保守情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <span className="text-sm text-gray-600">設置年月日:</span>
                  <p className="font-medium">{equipment.installDate}</p>
                </div>
                {equipment.warrantyExpire && (
                  <div>
                    <span className="text-sm text-gray-600">保証期限:</span>
                    <p className="font-medium">{equipment.warrantyExpire}</p>
                  </div>
                )}
                {equipment.maintenanceContract && (
                  <div>
                    <span className="text-sm text-gray-600">保守契約:</span>
                    <p className="font-medium">{equipment.maintenanceContract}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ポート情報 */}
            {equipment.slots && equipment.slots.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  ポート構成 ({equipment.slots.length}ポート)
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    {equipment.slots.slice(0, 32).map(slot => (
                      <div 
                        key={slot.slotNumber}
                        className={`h-10 rounded flex items-center justify-center text-xs font-bold text-white cursor-pointer
                                    ${slot.status === 'empty' ? 'bg-gray-300' : 
                                      slot.portType === 'Power' ? 'bg-red-500' :
                                      slot.portType === '10GbE' ? 'bg-blue-500' :
                                      slot.portType === 'GbE' ? 'bg-green-500' :
                                      slot.portType === 'Console' ? 'bg-gray-600' :
                                      slot.portType === 'RF' ? 'bg-yellow-500' :
                                      slot.portType === 'Optical' ? 'bg-cyan-500' :
                                      'bg-purple-500'}
                                    ${slot.status === 'active' ? 'ring-2 ring-green-400' : ''}
                                    ${slot.status === 'inactive' ? 'opacity-50' : ''}`}
                        title={`${slot.label} - ${slot.portType}${slot.connectedTo ? ` → ${slot.connectedTo}` : ''}`}
                      >
                        {slot.slotNumber}
                      </div>
                    ))}
                  </div>
                  {equipment.slots.length > 32 && (
                    <div className="text-sm text-gray-600 text-center">
                      他 {equipment.slots.length - 32} ポート
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 備考 */}
            {equipment.remarks && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  備考
                </h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{equipment.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">ヘッドエンド設備配置</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            全{detailedRackLayouts.length}ラック
          </div>
        </div>
      </div>

      {/* ラック選択ナビゲーション */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedRackIndex(Math.max(0, selectedRackIndex - 1))}
            disabled={selectedRackIndex === 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold">{currentRack.name}</h4>
            <span className="text-sm text-gray-600">
              {currentRack.location} - Zone {currentRack.zone}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              calculateDetailedRackUtilization(currentRack).utilizationRate > 80 ? 'bg-red-100 text-red-700' :
              calculateDetailedRackUtilization(currentRack).utilizationRate > 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              使用率: {calculateDetailedRackUtilization(currentRack).utilizationRate}%
            </span>
          </div>
          
          <button
            onClick={() => setSelectedRackIndex(Math.min(detailedRackLayouts.length - 1, selectedRackIndex + 1))}
            disabled={selectedRackIndex === detailedRackLayouts.length - 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ラック表示 */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-800 overflow-hidden">
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">Rack {currentRack.name}</h4>
            <div className="text-sm">
              {calculateDetailedRackUtilization(currentRack).equipmentCount} 機器設置
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-12 gap-2">
            {/* ピッチ番号（左側） */}
            <div className="col-span-1">
              {reversedPitchNumbers.map(num => (
                <div key={`left-${num}`} className="h-12 flex items-center justify-end pr-2 text-sm font-mono text-gray-600">
                  {num}
                </div>
              ))}
            </div>

            {/* ラック本体 */}
            <div className="col-span-10 border-2 border-gray-700 bg-gray-50">
              {reversedPitchNumbers.map(pitchNum => {
                const { equipment, isOccupied, isPrimary } = getPitchInfo(pitchNum)
                
                if (!isOccupied) {
                  // 空きピッチ
                  return (
                    <div 
                      key={pitchNum}
                      className="h-12 border-b border-gray-300 flex items-center justify-center text-gray-400 text-sm"
                    >
                      ブランク
                    </div>
                  )
                } else if (isPrimary && equipment) {
                  // 機器の最初のピッチ
                  const pitch = currentRack.pitches.find(p => p.pitchNumber === pitchNum)!
                  const bgColor = categoryColors[equipment.category] || categoryColors['その他']
                  
                  return (
                    <div
                      key={pitchNum}
                      className={`${bgColor} text-white border-b-2 border-gray-700 cursor-pointer hover:opacity-90 transition-opacity`}
                      style={{ height: `${pitch.height * 48}px` }}
                      onClick={() => setSelectedEquipment(equipment)}
                    >
                      <div className="h-full p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {statusIcons[equipment.status]}
                            <div>
                              <div className="font-semibold">{equipment.name}</div>
                              <div className="text-xs opacity-90">
                                {equipment.assetNumber} • {equipment.category}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{equipment.manufacturer}</div>
                          <div className="text-xs opacity-75">{equipment.model}</div>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  // 機器が占有している他のピッチ（表示しない）
                  return <div key={pitchNum} className="hidden" />
                }
              })}
            </div>

            {/* ピッチ番号（右側） */}
            <div className="col-span-1">
              {reversedPitchNumbers.map(num => (
                <div key={`right-${num}`} className="h-12 flex items-center justify-start pl-2 text-sm font-mono text-gray-600">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 凡例 */}
        <div className="bg-gray-100 border-t border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">カテゴリー:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryColors).slice(0, 6).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-1">
                    <div className={`w-4 h-4 ${color} rounded`} />
                    <span className="text-xs text-gray-600">{category}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">ステータス:</span>
              <div className="flex gap-3">
                {Object.entries(statusIcons).map(([status, icon]) => (
                  <div key={status} className="flex items-center gap-1">
                    {icon}
                    <span className="text-xs text-gray-600">
                      {status === 'active' ? '稼働中' :
                       status === 'standby' ? 'スタンバイ' :
                       status === 'maintenance' ? 'メンテナンス' : '故障'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 選択された機器の詳細モーダル */}
      {selectedEquipment && <EquipmentDetailModal equipment={selectedEquipment} />}
    </div>
  )
}