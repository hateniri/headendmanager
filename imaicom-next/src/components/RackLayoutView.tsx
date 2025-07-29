'use client'

import React, { useState } from 'react'
import { 
  Server, Zap, Shield, Network, HardDrive, Radio, 
  AlertTriangle, Cable, Activity, ChevronDown, ChevronUp,
  Cpu, Video, Wifi, Eye
} from 'lucide-react'
import { 
  rackLayouts, 
  equipmentTypeColors, 
  calculateRackUtilization,
  getEquipmentStatsByType,
  Rack,
  RackSlot
} from '@/data/rack-layout'

// アイコンマッピング
const equipmentIcons: Record<string, React.ComponentType<any>> = {
  PDU: Zap,
  UPS: Shield,
  RECT: Shield,
  SERVER: Server,
  CMTS: Network,
  AMPLIFIER: Radio,
  ENCODER: Activity,
  MULTIPLEXER: Activity,
  MONITOR: Eye,
  STORAGE: HardDrive,
  PSU: Zap,
  CABLE_MGMT: Cable,
  ROUTER: Network,
  FIREWALL: Shield,
  SWITCH: Network,
  FIRE_DETECTION: AlertTriangle,
  FIRE_SENSOR: AlertTriangle,
  DECODER: Video,
  MODULATOR: Radio,
  VIDEO_SWITCH: Video,
  OPTICAL: Wifi,
  WDM: Wifi,
  ODF: Cable
}

export default function RackLayoutView() {
  const [selectedLocation, setSelectedLocation] = useState<string>('1階 HE室')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showEmptySlots, setShowEmptySlots] = useState(false)

  // 場所別にラックをグループ化
  const racksByLocation = rackLayouts.reduce((acc, rack) => {
    if (!acc[rack.location]) {
      acc[rack.location] = []
    }
    acc[rack.location].push(rack)
    return acc
  }, {} as Record<string, Rack[]>)

  const currentRacks = racksByLocation[selectedLocation] || []
  
  // 全体の統計情報
  const totalStats = {
    totalRacks: rackLayouts.length,
    totalEquipment: rackLayouts.reduce((sum, rack) => 
      sum + rack.slots.filter(s => s.equipment).length, 0
    ),
    totalCapacity: rackLayouts.reduce((sum, rack) => sum + rack.totalPitches, 0),
    usedCapacity: rackLayouts.reduce((sum, rack) => 
      sum + rack.slots.filter(s => s.equipment).length, 0
    )
  }
  totalStats.utilizationRate = Math.round((totalStats.usedCapacity / totalStats.totalCapacity) * 100)

  // スロットの機器情報を取得（複数ピッチにまたがる機器を考慮）
  const getSlotInfo = (rack: Rack, pitch: number): RackSlot['equipment'] | undefined => {
    const slot = rack.slots.find(s => s.pitch === pitch)
    if (slot?.equipment) return slot.equipment

    // 複数ピッチにまたがる機器の一部かチェック
    for (let i = pitch - 1; i >= 1; i--) {
      const prevSlot = rack.slots.find(s => s.pitch === i)
      if (prevSlot?.equipment && (i + prevSlot.equipment.height - 1) >= pitch) {
        return undefined // 機器の一部（表示しない）
      }
    }

    return undefined // 空きスロット
  }

  // 機器が占有しているかチェック
  const isOccupied = (rack: Rack, pitch: number): boolean => {
    const slot = rack.slots.find(s => s.pitch === pitch)
    if (slot?.equipment) return true

    // 複数ピッチにまたがる機器の一部かチェック
    for (let i = pitch - 1; i >= 1; i--) {
      const prevSlot = rack.slots.find(s => s.pitch === i)
      if (prevSlot?.equipment && (i + prevSlot.equipment.height - 1) >= pitch) {
        return true
      }
    }

    return false
  }

  // ラックカードコンポーネント
  const RackCard = ({ rack }: { rack: Rack }) => {
    const utilization = calculateRackUtilization(rack)
    const equipmentList = rack.slots
      .filter(slot => slot.equipment)
      .map(slot => slot.equipment!)

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{rack.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              utilization.percentage > 80 ? 'bg-red-100 text-red-700' :
              utilization.percentage > 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {utilization.percentage}% 使用中
            </span>
          </div>
          <div className="text-xs text-gray-500">
            使用: {utilization.used}U / 空き: {utilization.available}U
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                utilization.percentage > 80 ? 'bg-red-500' :
                utilization.percentage > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${utilization.percentage}%` }}
            />
          </div>
        </div>
        
        {/* ミニラックビュー */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-1">
            {Array.from({ length: rack.totalPitches }, (_, i) => i + 1).map(pitch => {
              const equipment = getSlotInfo(rack, pitch)
              
              if (equipment) {
                const Icon = equipmentIcons[equipment.type] || Server
                const colorClass = equipmentTypeColors[equipment.type as keyof typeof equipmentTypeColors] || 'bg-gray-500'
                
                return (
                  <div
                    key={pitch}
                    className={`${colorClass} text-white rounded px-2 py-1 text-xs flex items-center gap-1`}
                    style={{ 
                      height: `${equipment.height * 20}px`,
                      marginBottom: equipment.height > 1 ? `${(equipment.height - 1) * 4}px` : '0'
                    }}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="truncate">{equipment.id}</span>
                  </div>
                )
              } else if (!isOccupied(rack, pitch) && showEmptySlots) {
                return (
                  <div
                    key={pitch}
                    className="h-5 bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center text-gray-400"
                  >
                    {pitch}
                  </div>
                )
              }
              
              return null
            }).filter(Boolean)}
          </div>
        </div>

        {/* 主要機器リスト */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-3">
          <h5 className="text-xs font-medium text-gray-700 mb-2">主要機器</h5>
          <div className="space-y-1">
            {equipmentList.slice(0, 5).map((eq, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  {React.createElement(equipmentIcons[eq.type] || Server, { className: "h-3 w-3 text-gray-400" })}
                  <span className="text-gray-600">{eq.name}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  eq.status === 'active' ? 'bg-green-100 text-green-700' :
                  eq.status === 'standby' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {eq.status === 'active' ? '稼働' : eq.status === 'standby' ? '待機' : 'メンテ'}
                </span>
              </div>
            ))}
            {equipmentList.length > 5 && (
              <div className="text-xs text-gray-400 text-center pt-1">
                他 {equipmentList.length - 5} 台
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
        <h3 className="text-lg font-semibold text-gray-900">ラック配置管理</h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(racksByLocation).map(location => (
              <option key={location} value={location}>
                {location} ({racksByLocation[location].length}ラック)
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              グリッド表示
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              リスト表示
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showEmptySlots}
              onChange={(e) => setShowEmptySlots(e.target.checked)}
              className="rounded"
            />
            <span>空きスロット表示</span>
          </label>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">総ラック数</span>
            <Server className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalRacks}</div>
          <div className="text-xs text-gray-500 mt-1">
            HE室: {racksByLocation['1階 HE室']?.length || 0} / 
            UPS室: {racksByLocation['1階 UPS室']?.length || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">総機器数</span>
            <Cpu className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalEquipment}</div>
          <div className="text-xs text-gray-500 mt-1">
            稼働中: {rackLayouts.reduce((sum, rack) => 
              sum + rack.slots.filter(s => s.equipment?.status === 'active').length, 0
            )}台
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">全体使用率</span>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalStats.utilizationRate}%</div>
          <div className="text-xs text-gray-500 mt-1">
            {totalStats.usedCapacity}U / {totalStats.totalCapacity}U
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">空き容量</span>
            <HardDrive className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {totalStats.totalCapacity - totalStats.usedCapacity}U
          </div>
          <div className="text-xs text-gray-500 mt-1">
            拡張可能スペース
          </div>
        </div>
      </div>

      {/* ラック一覧 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentRacks.map(rack => (
            <RackCard key={rack.id} rack={rack} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ラック名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  場所
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  主要機器
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRacks.map(rack => {
                const utilization = calculateRackUtilization(rack)
                const equipmentTypes = rack.slots
                  .filter(s => s.equipment)
                  .reduce((types, slot) => {
                    const type = slot.equipment!.type
                    if (!types.includes(type)) types.push(type)
                    return types
                  }, [] as string[])
                
                return (
                  <tr key={rack.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rack.name}</div>
                      <div className="text-xs text-gray-500">{rack.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rack.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            {utilization.percentage}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {utilization.used}/{rack.totalPitches}U
                          </div>
                        </div>
                        <div className="ml-4 w-24">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                utilization.percentage > 80 ? 'bg-red-500' :
                                utilization.percentage > 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${utilization.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {equipmentTypes.slice(0, 4).map(type => (
                          <span 
                            key={type}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              equipmentTypeColors[type as keyof typeof equipmentTypeColors] || 'bg-gray-500'
                            } text-white`}
                          >
                            {type}
                          </span>
                        ))}
                        {equipmentTypes.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{equipmentTypes.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        正常稼働
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 機器タイプ別統計 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">機器タイプ別配置状況</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(getEquipmentStatsByType(currentRacks)).map(([type, count]) => {
            const Icon = equipmentIcons[type] || Server
            const colorClass = equipmentTypeColors[type as keyof typeof equipmentTypeColors] || 'bg-gray-500'
            
            return (
              <div key={type} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className={`p-2 ${colorClass} rounded`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-900">{type}</div>
                  <div className="text-sm font-bold text-gray-700">{count}台</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}