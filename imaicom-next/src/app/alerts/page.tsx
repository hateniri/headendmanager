'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AlertCircle, MapPin, Clock, Thermometer, Zap, Wrench, Calendar, ChevronRight, AlertTriangle, Activity } from 'lucide-react'
import Link from 'next/link'

// 異常データの型定義
interface Alert {
  id: string
  facilityId: string
  facilityName: string
  region: string
  type: 'temperature' | 'power' | 'equipment' | 'network' | 'security'
  severity: 'critical' | 'warning'
  description: string
  detectedAt: string
  lastUpdated: string
  status: 'active' | 'acknowledged' | 'resolving'
  assignee?: string
  metrics?: {
    current: number
    threshold: number
    unit: string
  }
}

// ダミーデータ生成
function generateAlerts(): Alert[] {
  const facilities = [
    { id: 'HE_001', name: '北海道札幌ヘッドエンド', region: '北海道' },
    { id: 'HE_012', name: '宮城仙台ヘッドエンド', region: '東北' },
    { id: 'HE_023', name: '東京中央ヘッドエンド', region: '関東' },
    { id: 'HE_045', name: '愛知名古屋ヘッドエンド', region: '中部' },
    { id: 'HE_067', name: '大阪中央ヘッドエンド', region: '関西' },
    { id: 'HE_089', name: '福岡博多ヘッドエンド', region: '九州' }
  ]
  
  const alertTypes = [
    { type: 'temperature', description: '温度異常', icon: '🌡️' },
    { type: 'power', description: '電源異常', icon: '⚡' },
    { type: 'equipment', description: '機器障害', icon: '🔧' },
    { type: 'network', description: 'ネットワーク異常', icon: '🌐' },
    { type: 'security', description: 'セキュリティアラート', icon: '🔒' }
  ]
  
  const alerts: Alert[] = []
  const now = new Date()
  
  // 各施設から1-2個の異常を生成
  facilities.forEach(facility => {
    const alertCount = Math.random() > 0.5 ? 2 : 1
    
    for (let i = 0; i < alertCount; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const severity = Math.random() > 0.7 ? 'critical' : 'warning'
      const hoursAgo = Math.floor(Math.random() * 72) // 過去72時間以内
      const detectedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
      const lastUpdated = new Date(detectedAt.getTime() + Math.random() * 60 * 60 * 1000)
      
      let description = ''
      let metrics = undefined
      
      switch (alertType.type) {
        case 'temperature':
          const temp = 28 + Math.random() * 10
          description = `サーバールーム温度が${temp.toFixed(1)}°Cに上昇`
          metrics = { current: temp, threshold: 28, unit: '°C' }
          break
        case 'power':
          const voltage = 90 + Math.random() * 20
          description = `UPS電圧異常 (${voltage.toFixed(0)}V)`
          metrics = { current: voltage, threshold: 100, unit: 'V' }
          break
        case 'equipment':
          const equipment = ['QAM変調器', 'CMTS', '光送信器', 'UPS装置', 'エッジルーター', '伝送装置', '映像エンコーダ', 'CASサーバ'][Math.floor(Math.random() * 8)]
          description = `${equipment}の応答なし`
          break
        case 'network':
          const loss = Math.random() * 10
          description = `パケットロス率 ${loss.toFixed(1)}%`
          metrics = { current: loss, threshold: 5, unit: '%' }
          break
        case 'security':
          description = '不正アクセスの試行を検知'
          break
      }
      
      alerts.push({
        id: `ALT_${facility.id}_${Date.now()}_${i}`,
        facilityId: facility.id,
        facilityName: facility.name,
        region: facility.region,
        type: alertType.type as Alert['type'],
        severity: severity as Alert['severity'],
        description,
        detectedAt: detectedAt.toISOString(),
        lastUpdated: lastUpdated.toISOString(),
        status: Math.random() > 0.7 ? 'acknowledged' : Math.random() > 0.3 ? 'active' : 'resolving',
        assignee: Math.random() > 0.5 ? ['田中 太郎', '山田 花子', '佐藤 次郎'][Math.floor(Math.random() * 3)] : undefined,
        metrics
      })
    }
  })
  
  // 時間でソート（新しい順）
  return alerts.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  useEffect(() => {
    setAlerts(generateAlerts())
    
    // 30秒ごとに更新（実際の環境ではWebSocketやSSEを使用）
    const interval = setInterval(() => {
      setAlerts(generateAlerts())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  // フィルタリング
  const filteredAlerts = alerts.filter(alert => {
    if (typeFilter !== 'all' && alert.type !== typeFilter) return false
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false
    return true
  })
  
  const typeIcons = {
    temperature: Thermometer,
    power: Zap,
    equipment: Wrench,
    network: Activity,
    security: AlertTriangle
  }
  
  const typeLabels = {
    temperature: '温度異常',
    power: '電源異常',
    equipment: '機器障害',
    network: 'ネットワーク',
    security: 'セキュリティ'
  }
  
  const statusColors = {
    active: 'bg-red-100 text-red-700 border-red-200',
    acknowledged: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    resolving: 'bg-blue-100 text-blue-700 border-blue-200'
  }
  
  const statusLabels = {
    active: '未対応',
    acknowledged: '確認済',
    resolving: '対応中'
  }
  
  return (
    <ProtectedRoute requiredPermission="view_all_facilities">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AuthHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">異常一覧</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              全施設で検出された異常・アラートをリアルタイムで確認
            </p>
          </div>
          
          {/* サマリーカード */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">総異常数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredAlerts.length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">重大</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredAlerts.filter(a => a.severity === 'critical').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">警告</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredAlerts.filter(a => a.severity === 'warning').length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⚠</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">未対応</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredAlerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* フィルター */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全種類</option>
                <option value="temperature">温度異常</option>
                <option value="power">電源異常</option>
                <option value="equipment">機器障害</option>
                <option value="network">ネットワーク</option>
                <option value="security">セキュリティ</option>
              </select>
              
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全重要度</option>
                <option value="critical">重大のみ</option>
                <option value="warning">警告のみ</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ステータス</option>
                <option value="active">未対応</option>
                <option value="acknowledged">確認済</option>
                <option value="resolving">対応中</option>
              </select>
              
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  最終更新: {new Date().toLocaleTimeString('ja-JP')}
                </p>
              </div>
            </div>
          </div>
          
          {/* 異常リスト */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  条件に一致する異常はありません
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const Icon = typeIcons[alert.type]
                const timeSinceDetected = new Date().getTime() - new Date(alert.detectedAt).getTime()
                const hoursAgo = Math.floor(timeSinceDetected / (1000 * 60 * 60))
                const minutesAgo = Math.floor((timeSinceDetected % (1000 * 60 * 60)) / (1000 * 60))
                
                return (
                  <div
                    key={alert.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 ${
                      alert.severity === 'critical' ? 'border-red-500' : 'border-yellow-500'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {alert.description}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[alert.status]}`}>
                                {statusLabels[alert.status]}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <Link 
                                href={`/facility/${alert.facilityId.split('_')[1]}`}
                                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <MapPin className="h-4 w-4 mr-1" />
                                {alert.facilityName}
                              </Link>
                              
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {hoursAgo > 0 ? `${hoursAgo}時間` : ''}{minutesAgo}分前
                              </span>
                              
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">
                                {typeLabels[alert.type]}
                              </span>
                              
                              {alert.assignee && (
                                <span className="flex items-center">
                                  担当: {alert.assignee}
                                </span>
                              )}
                            </div>
                            
                            {alert.metrics && (
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">現在値:</span>
                                  <span className={`font-medium ${
                                    alert.metrics.current > alert.metrics.threshold 
                                      ? 'text-red-600' 
                                      : 'text-gray-900 dark:text-gray-100'
                                  }`}>
                                    {alert.metrics.current.toFixed(1)} {alert.metrics.unit}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">閾値:</span>
                                  <span className="text-gray-900 dark:text-gray-100">
                                    {alert.metrics.threshold} {alert.metrics.unit}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/facility/${alert.facilityId.split('_')[1]}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          詳細確認
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}