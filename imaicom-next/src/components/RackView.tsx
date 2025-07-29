'use client'

import { useState, useEffect } from 'react'
import { 
  Server, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Eye,
  Settings,
  MoreVertical
} from 'lucide-react'

interface RackEquipment {
  id: string
  name: string
  model: string
  category: string
  slotStart: number // 開始Uポジション
  slotHeight: number // 高さ（U数）
  status: 'normal' | 'warning' | 'critical' | 'offline'
  temperature?: number
  powerKw?: number
  manufacturer: string
  serialNumber?: string
  firmwareVersion?: string
  ipAddress?: string
  lastSeen?: string
}

interface RackInfo {
  id: string
  name: string
  location: string
  maxU: number // 最大U数（通常42U）
  totalPower: number // 総消費電力
  powerCapacity: number // 電力容量
  avgTemperature: number
  equipment: RackEquipment[]
}

interface RackViewProps {
  facilityId: string
  rackId?: string
  showAll?: boolean
}

export default function RackView({ facilityId, rackId, showAll = false }: RackViewProps) {
  const [selectedRack, setSelectedRack] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [view3D, setView3D] = useState(false)

  // サンプルラックデータ
  const rackData: RackInfo[] = [
    {
      id: 'RACK-A01',
      name: 'ラック A-01',
      location: '1F メインフロア',
      maxU: 42,
      totalPower: 8.5,
      powerCapacity: 15.0,
      avgTemperature: 24.2,
      equipment: [
        {
          id: 'EQ-001',
          name: 'QAM変調器',
          model: 'NSG-9000',
          category: 'video-processing',
          slotStart: 40,
          slotHeight: 2,
          status: 'normal',
          temperature: 23.5,
          powerKw: 0.8,
          manufacturer: 'Harmonic',
          serialNumber: 'NSG9000-12345',
          firmwareVersion: 'v2.5.0',
          ipAddress: '192.168.1.10',
          lastSeen: '2分前'
        },
        {
          id: 'EQ-002',
          name: 'CMTS',
          model: 'uBR10012',
          category: 'communication',
          slotStart: 35,
          slotHeight: 4,
          status: 'warning',
          temperature: 28.1,
          powerKw: 2.1,
          manufacturer: 'Cisco',
          serialNumber: 'CSC-UBR-98765',
          firmwareVersion: 'v15.3.2',
          ipAddress: '192.168.1.20',
          lastSeen: '30秒前'
        },
        {
          id: 'EQ-003',
          name: '光送信器',
          model: 'OLT-XGS',
          category: 'communication',
          slotStart: 32,
          slotHeight: 2,
          status: 'normal',
          temperature: 22.8,
          powerKw: 0.6,
          manufacturer: 'Sumitomo',
          serialNumber: 'SUM-OLT-11111',
          firmwareVersion: 'v1.4.8',
          ipAddress: '192.168.1.30',
          lastSeen: '1分前'
        },
        {
          id: 'EQ-004',
          name: 'エッジルーター',
          model: 'NCS-540',
          category: 'network',
          slotStart: 28,
          slotHeight: 3,
          status: 'normal',
          temperature: 25.3,
          powerKw: 1.2,
          manufacturer: 'Cisco',
          serialNumber: 'CSC-NCS-54321',
          firmwareVersion: 'v7.2.1',
          ipAddress: '192.168.1.40',
          lastSeen: '15秒前'
        },
        {
          id: 'EQ-005',
          name: 'UPS装置',
          model: 'Smart-UPS SRT',
          category: 'power',
          slotStart: 1,
          slotHeight: 6,
          status: 'critical',
          temperature: 31.2,
          powerKw: 3.8,
          manufacturer: 'APC',
          serialNumber: 'APC-SRT-99999',
          firmwareVersion: 'v1.1.3',
          lastSeen: '5分前'
        }
      ]
    },
    {
      id: 'RACK-A02',
      name: 'ラック A-02',
      location: '1F メインフロア',
      maxU: 42,
      totalPower: 6.2,
      powerCapacity: 15.0,
      avgTemperature: 23.8,
      equipment: [
        {
          id: 'EQ-006',
          name: 'QAM変調器',
          model: 'QAM4000-16',
          category: 'video-processing',
          slotStart: 38,
          slotHeight: 2,
          status: 'normal',
          temperature: 23.1,
          powerKw: 0.7,
          manufacturer: 'Cisco',
          lastSeen: '1分前'
        }
      ]
    }
  ]

  const currentRack = selectedRack 
    ? rackData.find(r => r.id === selectedRack) 
    : rackData[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'offline': return <Activity className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video-processing': return '📺'
      case 'communication': return '📡'
      case 'network': return '🌐'
      case 'power': return '⚡'
      case 'environmental': return '🌡️'
      default: return '📦'
    }
  }

  // Uポジションのスロットを生成
  const generateRackSlots = (rack: RackInfo) => {
    const slots = []
    for (let u = rack.maxU; u >= 1; u--) {
      const equipment = rack.equipment.find(eq => 
        u >= eq.slotStart && u < eq.slotStart + eq.slotHeight
      )
      
      slots.push(
        <div key={u} className="flex items-center border-b border-gray-200 dark:border-gray-700 min-h-[24px]">
          {/* Uポジション番号 */}
          <div className="w-8 text-xs text-gray-500 dark:text-gray-400 text-center">
            {u}
          </div>
          
          {/* 機器スロット */}
          <div className="flex-1 px-1">
            {equipment ? (
              <div 
                className={`
                  relative h-5 rounded-sm cursor-pointer border-2 transition-all duration-200
                  ${selectedEquipment === equipment.id ? 'ring-2 ring-blue-400 border-blue-500' : 'border-gray-300 dark:border-gray-600'}
                  ${getStatusColor(equipment.status)} bg-opacity-80 hover:bg-opacity-100
                `}
                onClick={() => setSelectedEquipment(equipment.id)}
                title={`${equipment.name} (${equipment.model})`}
              >
                {/* 機器の最初のUスロットにのみ情報を表示 */}
                {u === equipment.slotStart + equipment.slotHeight - 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2 text-white text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <span>{getCategoryIcon(equipment.category)}</span>
                      <span className="truncate max-w-20">{equipment.name}</span>
                    </span>
                    {equipment.temperature && (
                      <span className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        {equipment.temperature}°C
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-sm border border-dashed border-gray-300 dark:border-gray-600">
                {/* 空スロット */}
              </div>
            )}
          </div>
          
          {/* 温度インジケーター */}
          <div className="w-6 text-center">
            {equipment?.temperature && (
              <div className={`w-2 h-2 rounded-full mx-auto ${
                equipment.temperature > 30 ? 'bg-red-400' :
                equipment.temperature > 25 ? 'bg-yellow-400' :
                'bg-green-400'
              }`} />
            )}
          </div>
        </div>
      )
    }
    return slots
  }

  const selectedEquipmentInfo = selectedEquipment 
    ? currentRack?.equipment.find(eq => eq.id === selectedEquipment)
    : null

  return (
    <div className="space-y-6">
      {/* ラック選択とコントロール */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedRack || currentRack?.id || ''}
            onChange={(e) => setSelectedRack(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {rackData.map(rack => (
              <option key={rack.id} value={rack.id}>
                {rack.name} - {rack.location}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <div className="live-indicator">リアルタイム監視</div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              最終更新: {new Date().toLocaleTimeString('ja-JP')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView3D(!view3D)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view3D 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {view3D ? '2D表示' : '3D表示'}
          </button>
        </div>
      </div>

      {currentRack && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ラック可視化 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {currentRack.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentRack.location} • {currentRack.maxU}U
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {currentRack.totalPower.toFixed(1)}kW
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">消費電力</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {currentRack.avgTemperature.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">平均温度</div>
                  </div>
                </div>
              </div>

              {/* ラック図 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="font-mono text-xs">
                  {generateRackSlots(currentRack)}
                </div>
              </div>

              {/* 電力使用率バー */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">電力使用率</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {((currentRack.totalPower / currentRack.powerCapacity) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      (currentRack.totalPower / currentRack.powerCapacity) > 0.8 ? 'bg-red-500' :
                      (currentRack.totalPower / currentRack.powerCapacity) > 0.6 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(currentRack.totalPower / currentRack.powerCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 機器詳細パネル */}
          <div className="lg:col-span-1">
            {selectedEquipmentInfo ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedEquipmentInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEquipmentInfo.model}
                    </p>
                  </div>
                  {getStatusIcon(selectedEquipmentInfo.status)}
                </div>

                <div className="space-y-4">
                  {/* 基本情報 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">メーカー</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedEquipmentInfo.manufacturer}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Uポジション</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedEquipmentInfo.slotStart}-{selectedEquipmentInfo.slotStart + selectedEquipmentInfo.slotHeight - 1}
                      </div>
                    </div>
                    {selectedEquipmentInfo.temperature && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">温度</span>
                        <div className={`font-medium ${
                          selectedEquipmentInfo.temperature > 30 ? 'text-red-600' :
                          selectedEquipmentInfo.temperature > 25 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {selectedEquipmentInfo.temperature}°C
                        </div>
                      </div>
                    )}
                    {selectedEquipmentInfo.powerKw && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">消費電力</span>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedEquipmentInfo.powerKw}kW
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 詳細情報 */}
                  <div className="space-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                    {selectedEquipmentInfo.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">シリアル番号:</span>
                        <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                          {selectedEquipmentInfo.serialNumber}
                        </span>
                      </div>
                    )}
                    {selectedEquipmentInfo.firmwareVersion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">FW:</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {selectedEquipmentInfo.firmwareVersion}
                        </span>
                      </div>
                    )}
                    {selectedEquipmentInfo.ipAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">IP:</span>
                        <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                          {selectedEquipmentInfo.ipAddress}
                        </span>
                      </div>
                    )}
                    {selectedEquipmentInfo.lastSeen && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">最終確認:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {selectedEquipmentInfo.lastSeen}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => alert(`${selectedEquipmentInfo.name}の詳細情報を表示します。`)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      詳細
                    </button>
                    <button 
                      onClick={() => alert(`${selectedEquipmentInfo.name}の設定画面を開きます。`)}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      設定
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>機器を選択してください</p>
                  <p className="text-sm mt-1">ラック図の機器をクリックすると詳細情報が表示されます</p>
                </div>
              </div>
            )}

            {/* ラック統計 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">ラック統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">総機器数:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentRack.equipment.length}台
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">使用スロット:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentRack.equipment.reduce((sum, eq) => sum + eq.slotHeight, 0)}U / {currentRack.maxU}U
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">異常機器:</span>
                  <span className="font-medium text-red-600">
                    {currentRack.equipment.filter(eq => eq.status === 'critical').length}台
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">要注意機器:</span>
                  <span className="font-medium text-yellow-600">
                    {currentRack.equipment.filter(eq => eq.status === 'warning').length}台
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}