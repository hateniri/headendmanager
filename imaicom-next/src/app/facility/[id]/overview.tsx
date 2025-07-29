'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  Package, 
  Calendar, 
  Wrench, 
  DollarSign, 
  BarChart3, 
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Zap,
  Activity,
  Shield,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import RackView from '@/components/RackView'
import AssetTimeline from '@/components/AssetTimeline'
import { useFacilityMetrics } from '@/hooks/useFacilityMetrics'

type TabType = 'assets' | 'inspections' | 'repairs' | 'lifecycle' | 'environment' | 'personnel'

export default function FacilityOverview() {
  const params = useParams()
  const facilityId = params.id as string
  const [activeTab, setActiveTab] = useState<TabType>('assets')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [facility, setFacility] = useState<any>(null)

  const { 
    metrics, 
    realTimeData, 
    loading, 
    error, 
    lastUpdated, 
    refreshMetrics,
    calculateEfficiencyScore,
    getHealthStatus,
    getCriticalIssues
  } = useFacilityMetrics(facilityId)

  useEffect(() => {
    // 施設基本情報を取得
    import('@/data/facilities-with-correct-coordinates').then(({ facilitiesWithCorrectCoordinates }) => {
      const foundFacility = facilitiesWithCorrectCoordinates.find(f => f.id === parseInt(facilityId))
      setFacility(foundFacility)
    })
  }, [facilityId])

  if (loading || !facility || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">施設データを読み込み中...</div>
        </div>
      </div>
    )
  }

  const healthStatus = getHealthStatus()
  const efficiencyScore = calculateEfficiencyScore()
  const criticalIssues = getCriticalIssues()

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'fair': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'poor': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getHealthLabel = (status: string) => {
    switch (status) {
      case 'excellent': return '優秀'
      case 'good': return '良好'
      case 'fair': return '普通'
      case 'poor': return '要改善'
      default: return '不明'
    }
  }

  const tabs = [
    { id: 'assets', label: '機材一覧', icon: Package },
    { id: 'inspections', label: '点検履歴', icon: Calendar },
    { id: 'repairs', label: '修理履歴', icon: Wrench },
    { id: 'lifecycle', label: '資産・寿命', icon: DollarSign },
    { id: 'environment', label: '環境データ', icon: BarChart3 },
    { id: 'personnel', label: '担当者・履歴', icon: Users }
  ]

  return (
    <ProtectedRoute requiredPermission="view_all_facilities" facilityId={`HE_${facilityId.padStart(3, '0')}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AuthHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダーサマリー */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* 施設基本情報 */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {facility.name}
                    </h1>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthStatus)}`}>
                      総合状態: {getHealthLabel(healthStatus)}
                    </div>
                    <div className="live-indicator">リアルタイム監視</div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">拠点ID:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{facility.facilityId}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">開設年:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{facility.openedYear}年</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">管理組織:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{facility.managementOrg}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">最終更新:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {lastUpdated?.toLocaleTimeString('ja-JP') || '更新中...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 効率スコア */}
                <div className="lg:w-48">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {efficiencyScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">運用効率スコア</div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          efficiencyScore >= 90 ? 'bg-green-500' :
                          efficiencyScore >= 75 ? 'bg-blue-500' :
                          efficiencyScore >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${efficiencyScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重要指標 */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metrics.totalAssets}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">総機器数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {metrics.assetsCritical}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">異常機器</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {metrics.assetsNearEndOfLife}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">交換予定</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.totalPowerConsumption.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">消費電力(kW)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.averageTemperature.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">平均温度(°C)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.averageAssetAge.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">平均稼働年数</div>
                </div>
              </div>

              {/* 重要アラート */}
              {criticalIssues.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">要対応事項</h3>
                      <ul className="space-y-1">
                        {criticalIssues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-700 dark:text-red-400">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {activeTab === 'assets' && (
                  <div className="space-y-6">
                    {/* 検索・フィルターコントロール */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="機器名・型番で検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">すべて</option>
                          <option value="normal">正常のみ</option>
                          <option value="warning">要注意のみ</option>
                          <option value="critical">異常のみ</option>
                          <option value="near-eol">交換予定のみ</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={refreshMetrics}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          CSV出力
                        </button>
                      </div>
                    </div>

                    {/* ラックビュー */}
                    <RackView facilityId={facilityId} />

                    {/* カテゴリ別統計 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">カテゴリ別機器数</h3>
                        <div className="space-y-3">
                          {metrics.categoryBreakdown.map((category, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{category.category}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {category.count}台
                                </span>
                                {category.issueCount > 0 && (
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                                    {category.issueCount}件異常
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">ラック使用率</h3>
                        <div className="space-y-3">
                          {metrics.rackUtilization.map((rack, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">{rack.rackName}</span>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                  {rack.utilizationRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    rack.status === 'critical' ? 'bg-red-500' :
                                    rack.status === 'warning' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${rack.utilizationRate}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'inspections' && (
                  <div>
                    <AssetTimeline assetId="all" facilityId={facilityId} showAll={true} />
                  </div>
                )}

                {activeTab === 'repairs' && (
                  <div className="space-y-6">
                    {/* 修理統計サマリー */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                          <div>
                            <div className="text-2xl font-bold text-red-600">{metrics.pendingRepairs}</div>
                            <div className="text-sm text-red-700 dark:text-red-300">修理待ち</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{metrics.maintenanceThisMonth}</div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">今月の修理</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="text-2xl font-bold text-green-600">94.2%</div>
                            <div className="text-sm text-green-700 dark:text-green-300">修理成功率</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-8 w-8 text-yellow-600" />
                          <div>
                            <div className="text-2xl font-bold text-yellow-600">2.3日</div>
                            <div className="text-sm text-yellow-700 dark:text-yellow-300">平均修理時間</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 進行中の修理作業 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">進行中の修理作業</h3>
                      {metrics.pendingRepairs > 0 ? (
                        <div className="space-y-4">
                          {[
                            {
                              id: 'REP-001',
                              assetName: 'CMTS uBR10012',
                              issue: '温度異常により自動停止',
                              technician: '高橋 次郎',
                              startDate: '2025-01-25',
                              priority: 'critical',
                              estimatedCompletion: '2025-01-27',
                              progress: 75
                            },
                            {
                              id: 'REP-002', 
                              assetName: 'UPS装置 Smart-UPS',
                              issue: 'バッテリー劣化警告',
                              technician: '佐藤 花子',
                              startDate: '2025-01-24',
                              priority: 'warning',
                              estimatedCompletion: '2025-01-26',
                              progress: 30
                            }
                          ].slice(0, metrics.pendingRepairs).map((repair) => (
                            <div key={repair.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{repair.assetName}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{repair.issue}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  repair.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  repair.priority === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {repair.priority === 'critical' ? '緊急' :
                                   repair.priority === 'warning' ? '要注意' : '通常'}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">担当技術者:</span>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{repair.technician}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">開始日:</span>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{repair.startDate}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">完了予定:</span>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{repair.estimatedCompletion}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">進捗:</span>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{repair.progress}%</div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    repair.progress >= 80 ? 'bg-green-500' :
                                    repair.progress >= 50 ? 'bg-blue-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${repair.progress}%` }}
                                ></div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                                  進捗更新
                                </button>
                                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                                  詳細表示
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>現在進行中の修理作業はありません</p>
                        </div>
                      )}
                    </div>

                    {/* 修理履歴テーブル */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">修理履歴</h3>
                          <div className="flex items-center gap-2">
                            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                              <option value="all">すべて</option>
                              <option value="thisMonth">今月</option>
                              <option value="thisYear">今年</option>
                            </select>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                              <Download className="h-4 w-4 inline mr-1" />
                              エクスポート
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">修理ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">機器名</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">問題内容</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">開始日</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">完了日</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">担当者</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">費用</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状態</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {[
                              {
                                id: 'REP-045',
                                assetName: 'QAM変調器 NSG-9000',
                                issue: 'ファン回転数低下',
                                startDate: '2025-01-18',
                                endDate: '2025-01-18',
                                technician: '高橋 次郎',
                                cost: 25000,
                                status: 'completed'
                              },
                              {
                                id: 'REP-044',
                                assetName: 'CMTS uBR10012',
                                issue: '電源モジュール交換',
                                startDate: '2025-01-10',
                                endDate: '2025-01-12',
                                technician: '佐藤 花子',
                                cost: 180000,
                                status: 'completed'
                              },
                              {
                                id: 'REP-043',
                                assetName: '光送信器 OLT-XGS',
                                issue: 'レーザー出力異常',
                                startDate: '2024-12-28',
                                endDate: '2025-01-05',
                                technician: '鈴木 一郎',
                                cost: 320000,
                                status: 'completed'
                              },
                              {
                                id: 'REP-042',
                                assetName: 'UPS装置 Smart-UPS',
                                issue: 'バッテリー膨張',
                                startDate: '2024-12-20',
                                endDate: '2024-12-22',
                                technician: '伊藤 明美',
                                cost: 85000,
                                status: 'completed'
                              }
                            ].map((repair) => (
                              <tr key={repair.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {repair.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {repair.assetName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                  {repair.issue}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {repair.startDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {repair.endDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {repair.technician}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  ¥{repair.cost.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    repair.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    repair.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {repair.status === 'completed' ? '完了' :
                                     repair.status === 'in-progress' ? '進行中' : '失敗'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'lifecycle' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">資産価値</h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          ¥{(metrics.totalBookValue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">総帳簿価額</div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">償却状況</h3>
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                          {metrics.assetsDepreciated}
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">償却済み機器数</div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">更新予定</h3>
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {metrics.assetsNearEndOfLife}
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">1年以内交換予定</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'environment' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">電力消費</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">現在の消費電力:</span>
                            <span className="font-bold text-green-900 dark:text-green-100">
                              {realTimeData?.powerConsumption.toFixed(1) || metrics.totalPowerConsumption.toFixed(1)}kW
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">月間電気料金:</span>
                            <span className="font-bold text-green-900 dark:text-green-100">
                              ¥{metrics.monthlyPowerCost.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700 dark:text-green-300">CO₂排出量:</span>
                            <span className="font-bold text-green-900 dark:text-green-100">
                              {metrics.monthlyC02Emission.toFixed(1)}kg/月
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">温度監視</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">現在の平均温度:</span>
                            <span className="font-bold text-blue-900 dark:text-blue-100">
                              {realTimeData?.temperature.toFixed(1) || metrics.averageTemperature.toFixed(1)}°C
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">温度異常機器:</span>
                            <span className={`font-bold ${
                              metrics.temperatureAlerts > 0 ? 'text-red-600' : 'text-blue-900 dark:text-blue-100'
                            }`}>
                              {metrics.temperatureAlerts}台
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">温度トレンド:</span>
                            <span className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1">
                              {metrics.trends.temperatureTrend > 0 ? (
                                <TrendingUp className="h-4 w-4 text-red-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-green-500" />
                              )}
                              {Math.abs(metrics.trends.temperatureTrend).toFixed(1)}°C
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'personnel' && (
                  <div className="space-y-6">
                    {/* 責任者情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="h-8 w-8 text-blue-600" />
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">施設責任者</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-blue-600">山田 太郎</div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">技術管理課 課長</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">yamada@imai.com</div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">TEL: 03-1234-5678</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Wrench className="h-8 w-8 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">保守責任者</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-green-600">佐藤 花子</div>
                          <div className="text-sm text-green-700 dark:text-green-300">保守技術部 主任</div>
                          <div className="text-sm text-green-600 dark:text-green-400">sato@imai.com</div>
                          <div className="text-sm text-green-600 dark:text-green-400">TEL: 03-2345-6789</div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="h-8 w-8 text-purple-600" />
                          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">セキュリティ管理者</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-purple-600">鈴木 一郎</div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">情報システム部</div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">suzuki@imai.com</div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">TEL: 03-3456-7890</div>
                        </div>
                      </div>
                    </div>

                    {/* 作業スケジュール */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">今週の作業スケジュール</h3>
                      <div className="space-y-3">
                        {[
                          { date: '2025-01-27', technician: '高橋 次郎', task: 'CMTS定期点検', time: '09:00-12:00', status: 'scheduled' },
                          { date: '2025-01-28', technician: '佐藤 花子', task: 'UPS バッテリー交換', time: '14:00-17:00', status: 'scheduled' },
                          { date: '2025-01-29', technician: '伊藤 明美', task: '光送信器 設定変更', time: '10:00-11:00', status: 'scheduled' },
                          { date: '2025-01-30', technician: '山本 健太', task: '月次総合点検', time: '13:00-16:00', status: 'scheduled' }
                        ].map((schedule, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {new Date(schedule.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300">{schedule.time}</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{schedule.technician}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{schedule.task}</div>
                            </div>
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                              予定
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 操作履歴 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">最近の操作履歴</h3>
                          <div className="flex items-center gap-2">
                            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                              <option value="all">すべての操作</option>
                              <option value="config">設定変更</option>
                              <option value="maintenance">保守作業</option>
                              <option value="access">アクセス記録</option>
                            </select>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                              詳細ログ
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                          {
                            timestamp: '2025-01-27 14:32',
                            user: '佐藤 花子',
                            action: 'QAM変調器出力レベル調整',
                            target: 'EQ_0054 (NSG-9000)',
                            result: 'success',
                            details: '出力レベル: -10dBm → -8dBm'
                          },
                          {
                            timestamp: '2025-01-27 13:15',
                            user: '高橋 次郎',
                            action: 'CMTS設定バックアップ実行',
                            target: 'EQ_0021 (uBR10012)',
                            result: 'success',
                            details: 'config_20250127_1315.bak'
                          },
                          {
                            timestamp: '2025-01-27 10:45',
                            user: 'システム',
                            action: '温度異常アラート生成',
                            target: 'EQ_0089 (Smart-UPS)',
                            result: 'warning',
                            details: '温度: 31.2°C (閾値: 30°C)'
                          },
                          {
                            timestamp: '2025-01-27 09:20',
                            user: '伊藤 明美',
                            action: '光送信器ファームウェア更新',
                            target: 'EQ_0033 (OLT-XGS)',
                            result: 'success',
                            details: 'v1.4.7 → v1.4.8'
                          },
                          {
                            timestamp: '2025-01-26 16:30',
                            user: '山本 健太',
                            action: '施設アクセス（退場）',
                            target: '施設入退室システム',
                            result: 'success',
                            details: 'ICカード認証'
                          }
                        ].map((log, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.action}</div>
                                  <div className={`px-2 py-1 text-xs rounded-full ${
                                    log.result === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    log.result === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {log.result === 'success' ? '成功' :
                                     log.result === 'warning' ? '警告' : 'エラー'}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <div><span className="font-medium">操作者:</span> {log.user}</div>
                                  <div><span className="font-medium">対象:</span> {log.target}</div>
                                  <div><span className="font-medium">詳細:</span> {log.details}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                {log.timestamp}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}