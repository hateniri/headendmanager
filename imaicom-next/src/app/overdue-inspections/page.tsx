'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Clock, MapPin, AlertTriangle, Calendar, User, FileText, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

// 点検遅延データの型定義
interface OverdueInspection {
  id: string
  facilityId: string
  facilityName: string
  region: string
  inspectionType: 'monthly' | 'quarterly' | 'annual' | 'emergency'
  scheduledDate: string
  daysOverdue: number
  assignee: string
  lastInspectionDate: string
  lastInspectionResult: 'normal' | 'issues-found' | 'critical'
  equipment: string[]
  priority: 'high' | 'medium' | 'low'
  notes?: string
}

// ダミーデータ生成
function generateOverdueInspections(): OverdueInspection[] {
  const facilities = [
    { id: 'HE_005', name: '青森八戸ヘッドエンド', region: '東北' },
    { id: 'HE_018', name: '千葉柏ヘッドエンド', region: '関東' },
    { id: 'HE_029', name: '神奈川横浜ヘッドエンド', region: '関東' },
    { id: 'HE_037', name: '新潟長岡ヘッドエンド', region: '中部' },
    { id: 'HE_054', name: '兵庫神戸ヘッドエンド', region: '関西' },
    { id: 'HE_072', name: '広島福山ヘッドエンド', region: '中国' },
    { id: 'HE_091', name: '長崎佐世保ヘッドエンド', region: '九州' }
  ]
  
  const inspectionTypes = [
    { type: 'monthly', label: '月次点検', baseDays: 30 },
    { type: 'quarterly', label: '四半期点検', baseDays: 90 },
    { type: 'annual', label: '年次点検', baseDays: 365 }
  ]
  
  const engineers = ['田中 太郎', '山田 花子', '佐藤 次郎', '鈴木 一郎', '高橋 美咲']
  const equipmentTypes = [
    'QAM変調器',
    'CMTS',
    '光送信器',
    'UPS（冗長系）',
    'エッジルーター',
    '伝送装置',
    '映像エンコーダ',
    'スイッチャー',
    'CASサーバ',
    'IoTゲートウェイ',
    '監視システム',
    '空調設備',
    '配電盤'
  ]
  
  const inspections: OverdueInspection[] = []
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  facilities.forEach((facility, index) => {
    const inspectionType = inspectionTypes[index % inspectionTypes.length]
    const lastInspectionDays = inspectionType.baseDays + Math.floor(Math.random() * 30)
    const scheduledDate = new Date(now.getTime() - (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000)
    const daysOverdue = Math.floor((now.getTime() - scheduledDate.getTime()) / (24 * 60 * 60 * 1000))
    
    // 機器リストをランダムに選択
    const equipmentCount = 3 + Math.floor(Math.random() * 3)
    const selectedEquipment: string[] = []
    for (let i = 0; i < equipmentCount; i++) {
      const equipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]
      if (!selectedEquipment.includes(equipment)) {
        selectedEquipment.push(equipment)
      }
    }
    
    // 優先度を遅延日数に基づいて設定
    let priority: 'high' | 'medium' | 'low' = 'low'
    if (daysOverdue > 14) priority = 'high'
    else if (daysOverdue > 7) priority = 'medium'
    
    // 前回の点検結果に問題があった場合は優先度を上げる
    const lastResult = Math.random() > 0.7 ? 'issues-found' : Math.random() > 0.95 ? 'critical' : 'normal'
    if (lastResult === 'critical') priority = 'high'
    else if (lastResult === 'issues-found' && priority === 'low') priority = 'medium'
    
    inspections.push({
      id: `OVI_${facility.id}_${Date.now()}`,
      facilityId: facility.id,
      facilityName: facility.name,
      region: facility.region,
      inspectionType: inspectionType.type as OverdueInspection['inspectionType'],
      scheduledDate: scheduledDate.toISOString(),
      daysOverdue,
      assignee: engineers[Math.floor(Math.random() * engineers.length)],
      lastInspectionDate: new Date(now.getTime() - lastInspectionDays * 24 * 60 * 60 * 1000).toISOString(),
      lastInspectionResult: lastResult,
      equipment: selectedEquipment,
      priority,
      notes: Math.random() > 0.5 ? '前回点検時に軽微な不具合を確認。要フォローアップ。' : undefined
    })
  })
  
  // 優先度と遅延日数でソート
  return inspections.sort((a, b) => {
    if (a.priority !== b.priority) {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.daysOverdue - a.daysOverdue
  })
}

export default function OverdueInspectionsPage() {
  const [inspections, setInspections] = useState<OverdueInspection[]>([])
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  
  useEffect(() => {
    setInspections(generateOverdueInspections())
  }, [])
  
  // フィルタリング
  const filteredInspections = inspections.filter(inspection => {
    if (regionFilter !== 'all' && inspection.region !== regionFilter) return false
    if (priorityFilter !== 'all' && inspection.priority !== priorityFilter) return false
    if (typeFilter !== 'all' && inspection.inspectionType !== typeFilter) return false
    return true
  })
  
  const inspectionTypeLabels = {
    monthly: '月次点検',
    quarterly: '四半期点検',
    annual: '年次点検',
    emergency: '緊急点検'
  }
  
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200'
  }
  
  const priorityLabels = {
    high: '高',
    medium: '中',
    low: '低'
  }
  
  const resultIcons = {
    normal: { icon: CheckCircle, color: 'text-green-500' },
    'issues-found': { icon: AlertTriangle, color: 'text-yellow-500' },
    critical: { icon: XCircle, color: 'text-red-500' }
  }
  
  const resultLabels = {
    normal: '正常',
    'issues-found': '要注意',
    critical: '重大な問題'
  }
  
  return (
    <ProtectedRoute requiredPermission="view_all_facilities">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AuthHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">点検遅延拠点</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              今月の点検予定を超過している施設一覧
            </p>
          </div>
          
          {/* サマリーカード */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">遅延拠点数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredInspections.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">高優先度</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredInspections.filter(i => i.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">平均遅延日数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredInspections.length > 0 
                      ? (filteredInspections.reduce((sum, i) => sum + i.daysOverdue, 0) / filteredInspections.length).toFixed(1)
                      : 0
                    }日
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">月次点検</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredInspections.filter(i => i.inspectionType === 'monthly').length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          
          {/* フィルター */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全地域</option>
                <option value="北海道">北海道</option>
                <option value="東北">東北</option>
                <option value="関東">関東</option>
                <option value="中部">中部</option>
                <option value="関西">関西</option>
                <option value="中国">中国</option>
                <option value="四国">四国</option>
                <option value="九州">九州</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全優先度</option>
                <option value="high">高優先度</option>
                <option value="medium">中優先度</option>
                <option value="low">低優先度</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全点検種別</option>
                <option value="monthly">月次点検</option>
                <option value="quarterly">四半期点検</option>
                <option value="annual">年次点検</option>
              </select>
            </div>
          </div>
          
          {/* 遅延リスト */}
          <div className="space-y-4">
            {filteredInspections.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  条件に一致する遅延拠点はありません
                </p>
              </div>
            ) : (
              filteredInspections.map((inspection) => {
                const ResultIcon = resultIcons[inspection.lastInspectionResult].icon
                const resultColor = resultIcons[inspection.lastInspectionResult].color
                
                return (
                  <div
                    key={inspection.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            inspection.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900' 
                              : inspection.priority === 'medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Clock className={`h-6 w-6 ${
                              inspection.priority === 'high' 
                                ? 'text-red-600' 
                                : inspection.priority === 'medium'
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                {inspection.facilityName}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[inspection.priority]}`}>
                                優先度: {priorityLabels[inspection.priority]}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                                {inspectionTypeLabels[inspection.inspectionType]}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">遅延日数</p>
                                <p className="font-medium text-red-600">
                                  {inspection.daysOverdue}日超過
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">予定日</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {new Date(inspection.scheduledDate).toLocaleDateString('ja-JP')}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">担当者</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {inspection.assignee}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">前回点検結果</p>
                                <p className="font-medium flex items-center">
                                  <ResultIcon className={`h-4 w-4 mr-1 ${resultColor}`} />
                                  {resultLabels[inspection.lastInspectionResult]}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 dark:text-gray-400">点検対象機器</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {inspection.equipment.map((eq, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300"
                                  >
                                    {eq}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {inspection.notes && (
                              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                                  {inspection.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Link
                          href={`/schedule?facility=${inspection.facilityId}`}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                        >
                          点検予定確認
                        </Link>
                        <Link
                          href={`/facility/${inspection.facilityId.split('_')[1]}`}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          施設詳細
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