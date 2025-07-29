'use client'

import { X, MapPin, User, Server, Thermometer, Droplets, Wind, Calendar, Camera, Headphones, AlertTriangle, CheckCircle, XCircle, ExternalLink, Package, Wrench } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Equipment } from '@/lib/supabase'

export default function SidePanel() {
  const { selectedFacility, isSidePanelOpen, setSidePanelOpen, facilityEquipment } = useAppStore()
  
  if (!isSidePanelOpen || !selectedFacility) return null

  return (
    <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{selectedFacility.name}</h2>
            <p className="mt-1 opacity-90">施設ID: HE-{String(selectedFacility.id).padStart(3, '0')}</p>
          </div>
          <button 
            onClick={() => setSidePanelOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Info */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{selectedFacility.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>施設長: 山田 太郎</span>
            </div>
          </div>
        </div>

        {/* Environmental Status */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">環境状態</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-bold">23.5°C</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">温度</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-bold">45%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">湿度</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Wind className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold">2.5m/s</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">エアフロー</p>
            </div>
          </div>
        </div>

        {/* Rack Equipment */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">ラック機材一覧</h3>
          <div className="space-y-3">
            {mockEquipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        </div>

        {/* 3DGS View */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">3Dウォークスルービュー</h3>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">最終スキャン日</p>
                <p className="font-medium">2024年1月15日</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">データ形式</p>
                <p className="font-medium">Gaussian Splat</p>
              </div>
            </div>
            <button 
              onClick={() => alert('3Dウォークスルー機能は開発中です。実装完了後に利用可能になります。')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              ウォークスルーで確認
            </button>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">点検履歴</h3>
          <div className="space-y-3">
            <MaintenanceItem 
              date="2024-01-20"
              type="定期点検"
              inspector="佐藤 次郎"
              status="completed"
              note="全機器正常動作確認"
            />
            <MaintenanceItem 
              date="2024-01-10"
              type="緊急対応"
              inspector="鈴木 三郎"
              status="warning"
              note="UPSバッテリー交換実施"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert('修理依頼フォームを開発中です。緊急の場合は管理者まで連絡してください。')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Wrench className="h-4 w-4 mr-2" />
            修理依頼
          </button>
          <button 
            onClick={() => {
              if (selectedFacility) {
                window.open(`/facility/${selectedFacility.id}`, '_blank')
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            詳細画面へ
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock equipment data
const mockEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    facility_id: 1,
    rack_id: 'A-01',
    category: '光伝送',
    name: '光送信機',
    manufacturer: '古河電工',
    model: 'FOT-3000TX',
    purchase_date: '2022-09-10',
    useful_life: 10,
    status: 'normal'
  },
  {
    id: 'EQ-002',
    facility_id: 1,
    rack_id: 'A-01',
    category: 'エンコード',
    name: 'H.265エンコーダー',
    manufacturer: 'ソニー',
    model: 'PWS-4500',
    purchase_date: '2023-03-15',
    useful_life: 5,
    status: 'warning'
  },
  {
    id: 'EQ-003',
    facility_id: 1,
    rack_id: 'A-02',
    category: '電源',
    name: 'UPS装置',
    manufacturer: 'オムロン',
    model: 'BN300T',
    purchase_date: '2020-04-01',
    useful_life: 6,
    status: 'critical'
  }
]

function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const statusConfig = {
    normal: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: '正常' },
    warning: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle, label: '要注意' },
    critical: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: '要対応' }
  }
  
  const config = statusConfig[equipment.status]
  const Icon = config.icon
  
  return (
    <div className={`p-4 rounded-lg border ${config.bg} border-gray-200`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{equipment.name}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {equipment.manufacturer} {equipment.model}
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Server className="h-3 w-3 mr-1" />
            <span>ラック{equipment.rack_id}</span>
            <span className="mx-2">•</span>
            <span>導入: {equipment.purchase_date}</span>
          </div>
        </div>
        <div className={`flex items-center ${config.color}`}>
          <Icon className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
      </div>
      <div className="mt-3 flex space-x-2">
        <button className="text-xs text-blue-600 hover:text-blue-800">点検実施</button>
        <span className="text-gray-300">|</span>
        <button className="text-xs text-blue-600 hover:text-blue-800">詳細確認</button>
      </div>
    </div>
  )
}

function MaintenanceItem({ date, type, inspector, status, note }: {
  date: string
  type: string
  inspector: string
  status: 'completed' | 'warning'
  note: string
}) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`mt-0.5 ${status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
        {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">{type}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">担当: {inspector}</p>
        <p className="text-sm text-gray-500 mt-1">{note}</p>
      </div>
    </div>
  )
}