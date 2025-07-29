'use client'

import React, { useState } from 'react'
import { 
  Server, Zap, Shield, Network, HardDrive, Radio, 
  AlertTriangle, Cable, Activity, ChevronDown, ChevronRight,
  Cpu, Video, Wifi, Eye, Maximize2, Minimize2, 
  ArrowRight, Circle, Square, X
} from 'lucide-react'
import { 
  detailedRackLayouts,
  getRackByZone,
  calculateDetailedRackUtilization,
  DetailedRack,
  Pitch,
  Equipment,
  Slot
} from '@/data/rack-layout-detailed'

// ポートタイプのカラーマッピング
const portTypeColors = {
  'GbE': 'bg-green-500',
  '10GbE': 'bg-blue-500',
  'SFP': 'bg-purple-500',
  'SFP+': 'bg-purple-600',
  'QSFP': 'bg-indigo-500',
  'Power': 'bg-red-500',
  'Console': 'bg-gray-500',
  'RF': 'bg-yellow-500',
  'Optical': 'bg-cyan-500'
}

// ポートステータスのカラーマッピング
const portStatusColors = {
  'active': 'ring-2 ring-green-400',
  'inactive': 'opacity-50',
  'empty': 'bg-gray-200',
  'reserved': 'ring-2 ring-yellow-400'
}

export default function RackLayoutDetailedView() {
  const [selectedZone, setSelectedZone] = useState<string>('A')
  const [selectedRack, setSelectedRack] = useState<DetailedRack | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview')

  // ゾーン一覧を取得
  const zones = Array.from(new Set(detailedRackLayouts.map(r => r.zone))).sort()
  const racksInZone = getRackByZone(selectedZone)

  // ラックグリッドの行と列を計算
  const maxRow = Math.max(...racksInZone.map(r => r.row))
  const maxPosition = Math.max(...racksInZone.map(r => r.position))

  // 機器の展開/折りたたみ
  const toggleEquipmentExpand = (equipmentId: string) => {
    const newExpanded = new Set(expandedEquipment)
    if (newExpanded.has(equipmentId)) {
      newExpanded.delete(equipmentId)
    } else {
      newExpanded.add(equipmentId)
    }
    setExpandedEquipment(newExpanded)
  }

  // スロット表示コンポーネント
  const SlotView = ({ slot, equipment }: { slot: Slot, equipment: Equipment }) => {
    const bgColor = portTypeColors[slot.portType] || 'bg-gray-400'
    const statusClass = portStatusColors[slot.status] || ''
    
    return (
      <div className="relative group">
        <div 
          className={`w-8 h-8 rounded ${slot.status === 'empty' ? portStatusColors.empty : bgColor} ${statusClass} 
                      flex items-center justify-center text-xs font-bold text-white cursor-pointer
                      hover:scale-110 transition-transform`}
          title={`${slot.label || `Slot ${slot.slotNumber}`} - ${slot.portType} - ${slot.status}${slot.connectedTo ? ` → ${slot.connectedTo}` : ''}`}
        >
          {slot.slotNumber}
        </div>
        
        {/* ホバー時の詳細情報 */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          <div>{slot.label || `Slot ${slot.slotNumber}`}</div>
          <div className="text-gray-300">{slot.portType}</div>
          {slot.connectedTo && (
            <div className="text-green-300 flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              {slot.connectedTo}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 機器詳細表示コンポーネント
  const EquipmentDetail = ({ equipment, pitch }: { equipment: Equipment, pitch: Pitch }) => {
    const isExpanded = expandedEquipment.has(equipment.id)
    
    return (
      <div className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">U{pitch.pitchNumber}{pitch.height > 1 ? `-${pitch.pitchNumber + pitch.height - 1}` : ''}</span>
              <h4 className="font-medium text-gray-900">{equipment.name}</h4>
              <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">{equipment.type}</span>
              <span className={`px-2 py-0.5 text-xs rounded ${
                equipment.status === 'active' ? 'bg-green-100 text-green-700' :
                equipment.status === 'standby' ? 'bg-yellow-100 text-yellow-700' :
                equipment.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {equipment.status}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {equipment.manufacturer} {equipment.model}
              {equipment.powerConsumption && ` • ${equipment.powerConsumption}W`}
            </div>
          </div>
          
          {equipment.slots && equipment.slots.length > 0 && (
            <button
              onClick={() => toggleEquipmentExpand(equipment.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* スロット表示 */}
        {isExpanded && equipment.slots && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">スロット構成 ({equipment.slots.length}ポート)</div>
            <div className="flex flex-wrap gap-1">
              {equipment.slots.map(slot => (
                <SlotView key={slot.slotNumber} slot={slot} equipment={equipment} />
              ))}
            </div>
            
            {/* ポートタイプ別サマリー */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(
                equipment.slots.reduce((acc, slot) => {
                  const key = `${slot.portType}-${slot.status}`
                  acc[key] = (acc[key] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([key, count]) => {
                const [portType, status] = key.split('-')
                return (
                  <div key={key} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${portTypeColors[portType as keyof typeof portTypeColors] || 'bg-gray-400'} ${portStatusColors[status as keyof typeof portStatusColors] || ''}`} />
                    <span>{portType}: {count} ({status})</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ラックビュー
  const RackView = ({ rack }: { rack: DetailedRack }) => {
    const utilization = calculateDetailedRackUtilization(rack)
    
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-800">
        <div className="bg-gray-800 text-white p-3 rounded-t-md">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{rack.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded text-xs ${
                utilization.utilizationRate > 80 ? 'bg-red-600' :
                utilization.utilizationRate > 60 ? 'bg-yellow-600' :
                'bg-green-600'
              }`}>
                {utilization.utilizationRate}%
              </span>
              <button
                onClick={() => {
                  setSelectedRack(rack)
                  setViewMode('detail')
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-xs mt-1 text-gray-300">
            {utilization.equipmentCount}機器 • {utilization.usedPitches}/{utilization.totalPitches}U使用
          </div>
        </div>
        
        <div className="p-2 max-h-96 overflow-y-auto">
          {/* ピッチグリッド */}
          <div className="space-y-0.5">
            {rack.pitches.map(pitch => {
              if (pitch.height === 0) return null // 占有ピッチはスキップ
              
              if (pitch.equipment) {
                return (
                  <div 
                    key={pitch.pitchNumber}
                    className="relative"
                    style={{ height: `${pitch.height * 24}px` }}
                  >
                    <div className={`absolute inset-0 rounded px-2 py-1 text-xs text-white flex items-center justify-between cursor-pointer
                                    ${pitch.equipment.status === 'active' ? 'bg-green-600 hover:bg-green-700' :
                                      pitch.equipment.status === 'standby' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                      pitch.equipment.status === 'maintenance' ? 'bg-orange-600 hover:bg-orange-700' :
                                      'bg-gray-600 hover:bg-gray-700'}`}
                         onClick={() => setSelectedEquipment(pitch.equipment!)}
                    >
                      <span className="truncate">{pitch.equipment.id}</span>
                      <span>{pitch.height}U</span>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div 
                    key={pitch.pitchNumber}
                    className="h-6 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400"
                  >
                    U{pitch.pitchNumber}
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">ヘッドエンド設備配置管理</h3>
        <div className="flex items-center gap-4">
          {/* ゾーン選択 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">ゾーン:</span>
            <div className="flex gap-1">
              {zones.map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedZone === zone
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Zone {zone}
                </button>
              ))}
            </div>
          </div>

          {/* ビューモード切替 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              概要
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'detail'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              詳細
            </button>
          </div>
        </div>
      </div>

      {/* ゾーン情報 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-2">Zone {selectedZone} - {
          selectedZone === 'A' ? 'ネットワーク・配信系' :
          selectedZone === 'B' ? '光伝送・映像処理系' :
          selectedZone === 'C' ? '電源・空調系' :
          selectedZone === 'D' ? 'バックアップ系' :
          '拡張エリア'
        }</h4>
        <div className="text-sm text-gray-600">
          ラック数: {racksInZone.length} • 
          総機器数: {racksInZone.reduce((sum, rack) => sum + calculateDetailedRackUtilization(rack).equipmentCount, 0)} • 
          平均使用率: {Math.round(racksInZone.reduce((sum, rack) => sum + calculateDetailedRackUtilization(rack).utilizationRate, 0) / racksInZone.length)}%
        </div>
      </div>

      {viewMode === 'overview' ? (
        /* 概要ビュー：ラックグリッド表示 */
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: `repeat(${maxPosition}, minmax(200px, 1fr))` 
          }}>
            {Array.from({ length: maxRow }, (_, row) => 
              Array.from({ length: maxPosition }, (_, pos) => {
                const rack = racksInZone.find(r => r.row === row + 1 && r.position === pos + 1)
                return (
                  <div key={`${row}-${pos}`} className="min-h-[400px]">
                    {rack ? (
                      <RackView rack={rack} />
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                        <span className="text-sm">Empty</span>
                      </div>
                    )}
                  </div>
                )
              })
            ).flat()}
          </div>
        </div>
      ) : (
        /* 詳細ビュー：選択されたラックの詳細表示 */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ラック一覧 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3">ラック一覧</h4>
              <div className="space-y-2">
                {racksInZone.map(rack => {
                  const util = calculateDetailedRackUtilization(rack)
                  return (
                    <button
                      key={rack.id}
                      onClick={() => setSelectedRack(rack)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedRack?.id === rack.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{rack.name}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          util.utilizationRate > 80 ? 'bg-red-100 text-red-700' :
                          util.utilizationRate > 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {util.utilizationRate}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {util.equipmentCount}機器 • {util.usedPitches}U使用
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ラック詳細 */}
          <div className="lg:col-span-2">
            {selectedRack ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{selectedRack.name} 詳細</h4>
                    <button
                      onClick={() => setSelectedEquipment(null)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      選択をクリア
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {selectedRack.pitches.map(pitch => {
                    if (pitch.height === 0 || !pitch.equipment) return null
                    
                    return (
                      <EquipmentDetail 
                        key={pitch.pitchNumber} 
                        equipment={pitch.equipment} 
                        pitch={pitch}
                      />
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                ラックを選択してください
              </div>
            )}
          </div>
        </div>
      )}

      {/* 選択された機器の詳細モーダル */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEquipment(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedEquipment.name}</h3>
              <button onClick={() => setSelectedEquipment(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">機器ID:</span>
                  <span className="ml-2 font-medium">{selectedEquipment.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">タイプ:</span>
                  <span className="ml-2 font-medium">{selectedEquipment.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">メーカー:</span>
                  <span className="ml-2 font-medium">{selectedEquipment.manufacturer}</span>
                </div>
                <div>
                  <span className="text-gray-600">モデル:</span>
                  <span className="ml-2 font-medium">{selectedEquipment.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">ステータス:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    selectedEquipment.status === 'active' ? 'bg-green-100 text-green-700' :
                    selectedEquipment.status === 'standby' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedEquipment.status}
                  </span>
                </div>
                {selectedEquipment.powerConsumption && (
                  <div>
                    <span className="text-gray-600">消費電力:</span>
                    <span className="ml-2 font-medium">{selectedEquipment.powerConsumption}W</span>
                  </div>
                )}
              </div>

              {selectedEquipment.slots && selectedEquipment.slots.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">ポート詳細 ({selectedEquipment.slots.length}ポート)</h4>
                  <div className="grid grid-cols-8 gap-2">
                    {selectedEquipment.slots.map(slot => (
                      <SlotView key={slot.slotNumber} slot={slot} equipment={selectedEquipment} />
                    ))}
                  </div>
                  
                  {/* 接続情報 */}
                  <div className="mt-4">
                    <h5 className="font-medium text-sm mb-2">アクティブ接続</h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {selectedEquipment.slots
                        .filter(slot => slot.status === 'active' && slot.connectedTo)
                        .map(slot => (
                          <div key={slot.slotNumber} className="flex items-center gap-2 text-sm text-gray-600">
                            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                            <span className="font-medium">{slot.label}:</span>
                            <span>{slot.connectedTo}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}