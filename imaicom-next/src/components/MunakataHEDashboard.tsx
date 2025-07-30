'use client'

import { useState, useEffect } from 'react'
import { munakataHEData } from '@/data/munakata-he-detail'
import { 
  Zap, Thermometer, Droplets, Wind, Server, HardDrive, 
  Wifi, Shield, AlertCircle, TrendingUp, Package,
  Activity, Gauge, Database
} from 'lucide-react'
import RealTimeMetrics from '@/components/RealTimeMetrics'

export default function MunakataHEDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [metrics, setMetrics] = useState(munakataHEData.metrics)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // リアルタイムデータのシミュレーション
      setMetrics(prev => ({
        ...prev,
        temperature: {
          ...prev.temperature,
          current: prev.temperature.current + (Math.random() - 0.5) * 0.2
        },
        humidity: {
          ...prev.humidity,
          current: prev.humidity.current + (Math.random() - 0.5) * 1
        },
        power: {
          ...prev.power,
          currentUsage: prev.power.currentUsage + (Math.random() - 0.5) * 10
        }
      }))
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])
  
  const powerUsagePercent = (metrics.power.currentUsage / munakataHEData.specifications.power.totalCapacity) * 100
  const coolingLoadPercent = (munakataHEData.specifications.cooling.currentLoad / munakataHEData.specifications.cooling.totalCapacity) * 100
  const rackUsagePercent = (munakataHEData.racks.occupied / munakataHEData.racks.total) * 100
  const storageUsagePercent = (munakataHEData.equipment.storage.usedCapacity / munakataHEData.equipment.storage.totalCapacity) * 100
  
  return (
    <div className="space-y-6">
      {/* 環境データ（リアルタイム） */}
      <RealTimeMetrics
        baseTemp={metrics.temperature.current}
        baseHumidity={metrics.humidity.current}
        baseAirflow={3.2}
        basePower={metrics.power.currentUsage / 20}
      />
      
      {/* 詳細情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 設備仕様 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">設備仕様</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">電源設備</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>UPS容量: {munakataHEData.specifications.power.ups.capacity} kVA ({munakataHEData.specifications.power.ups.batteries})</p>
                <p>発電機: {munakataHEData.specifications.power.generator.capacity} kVA (連続{munakataHEData.specifications.power.generator.runtime}時間運転可能)</p>
                <p>冗長性: {munakataHEData.specifications.power.redundancy}</p>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">空調設備</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>方式: {munakataHEData.specifications.cooling.type}</p>
                <p>冷却能力: {munakataHEData.specifications.cooling.totalCapacity} kW</p>
                <p>現在負荷: {coolingLoadPercent.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">ネットワーク</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>キャリア: {munakataHEData.specifications.network.carriers.join(', ')}</p>
                <p>帯域: {munakataHEData.specifications.network.bandwidth.upstream} Gbps (上り/下り)</p>
                <p>構成: {munakataHEData.specifications.network.redundancy}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 機器統計 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">機器統計</h3>
          <div className="space-y-4">
            {/* サーバー */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">サーバー稼働率</span>
                <span className="text-sm text-gray-600">
                  {munakataHEData.equipment.servers.active} / {munakataHEData.equipment.servers.total}台
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(munakataHEData.equipment.servers.active / munakataHEData.equipment.servers.total) * 100}%` }}
                />
              </div>
            </div>
            
            {/* ストレージ */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ストレージ使用率</span>
                <span className="text-sm text-gray-600">
                  {munakataHEData.equipment.storage.usedCapacity} / {munakataHEData.equipment.storage.totalCapacity} TB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${storageUsagePercent}%` }}
                />
              </div>
            </div>
            
            {/* サーバー種別 */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">サーバー構成</h4>
              <div className="space-y-2">
                {munakataHEData.equipment.servers.types.map((type, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{type.manufacturer} {type.model}</span>
                    <span className="text-gray-900 font-medium">{type.count}台</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* アラート */}
      {munakataHEData.alerts.filter(a => a.status === 'active').length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
            アクティブアラート
          </h3>
          <div className="space-y-3">
            {munakataHEData.alerts
              .filter(alert => alert.status === 'active')
              .map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.type} - {alert.timestamp}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}