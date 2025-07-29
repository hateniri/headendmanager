'use client'

import React, { useState } from 'react'
import { Power, Thermometer, Wind, Lock, Unlock, AlertTriangle, CheckCircle, Loader2, Wifi, Shield, Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface RemoteControlProps {
  facilityId: string
}

export default function RemoteControl({ facilityId }: RemoteControlProps) {
  const { hasPermission, canEditFacility } = useAuth()
  const [controls, setControls] = useState({
    mainPower: true,
    backupPower: true,
    cooling: true,
    accessControl: true,
    networkSwitch: true,
    firewall: true
  })
  
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggle = async (control: keyof typeof controls) => {
    setLoading(control)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }))
    setLoading(null)
  }

  const controlItems = [
    {
      id: 'mainPower',
      label: '主電源',
      icon: Power,
      color: 'green',
      critical: true
    },
    {
      id: 'backupPower',
      label: 'バックアップ電源',
      icon: Power,
      color: 'yellow'
    },
    {
      id: 'cooling',
      label: '冷却システム',
      icon: Thermometer,
      color: 'blue'
    },
    {
      id: 'accessControl',
      label: '入退室管理',
      icon: Lock,
      color: 'purple'
    },
    {
      id: 'networkSwitch',
      label: 'ネットワークスイッチ',
      icon: Wifi,
      color: 'cyan'
    },
    {
      id: 'firewall',
      label: 'ファイアウォール',
      icon: Shield,
      color: 'red'
    }
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">リモート操作</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Activity className="h-4 w-4 mr-1 text-green-500" />
          接続中
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {controlItems.map((item) => {
          const Icon = item.icon
          const isOn = controls[item.id as keyof typeof controls]
          const isLoading = loading === item.id
          
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 ${
                isOn ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 mr-3 ${
                    isOn ? `text-${item.color}-600` : 'text-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">
                      {isOn ? '稼働中' : '停止中'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggle(item.id as keyof typeof controls)}
                  disabled={isLoading || !canEditFacility(facilityId)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isOn ? 'bg-green-500' : 'bg-gray-300'
                  } ${isLoading || !canEditFacility(facilityId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  >
                    {isLoading && (
                      <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                    )}
                  </div>
                </button>
              </div>
              
              {item.critical && (
                <div className="mt-2 flex items-center text-xs text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  重要システム - 操作には注意が必要です
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!canEditFacility(facilityId) && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          <p>リモート操作には施設編集権限が必要です。</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">セキュリティ通知</p>
            <p className="text-yellow-700 mt-1">
              リモート操作は全て記録されます。重要システムの操作前は必ず現地スタッフに連絡してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}