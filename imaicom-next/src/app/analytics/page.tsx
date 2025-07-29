'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AlertTriangle, Users, MapPin, Package, DollarSign, TrendingUp, TrendingDown, AlertCircle, Activity, Wrench, Clock, CheckCircle, User } from 'lucide-react'
import { mockRepairs } from '@/data/repairs'
import { mockInspections, mockInspectionLogs } from '@/data/inspections'
import { mockAssets } from '@/data/assets'

// 拠点リスク分析データを生成
function generateFacilityRiskData() {
  const facilities = Array.from({ length: 20 }, (_, i) => `HE_${String(i + 1).padStart(3, '0')}`)
  
  return facilities.map(facilityId => {
    const repairs = mockRepairs.filter(r => r.facilityId === facilityId)
    const inspections = mockInspections.filter(i => i.facilityId === facilityId)
    const scheduledInspections = inspections.filter(i => i.status === 'scheduled').length
    const overdueInspections = inspections.filter(i => i.status === 'urgent' || i.status === 'postponed').length
    const emergencyRepairs = repairs.filter(r => r.priority === 'high').length
    const recurringIssues = repairs.filter(r => r.issueType === 'performance-degradation').length
    
    const riskScore = 
      repairs.length * 2 + 
      overdueInspections * 3 + 
      emergencyRepairs * 5 + 
      recurringIssues * 2
    
    return {
      facilityId,
      repairCount: repairs.length,
      inspectionRate: scheduledInspections > 0 ? 
        ((inspections.length - overdueInspections) / inspections.length * 100) : 100,
      overdueInspections,
      emergencyCount: emergencyRepairs,
      recurringCount: recurringIssues,
      riskScore
    }
  }).sort((a, b) => b.riskScore - a.riskScore)
}

// 機器故障傾向データを生成
function generateEquipmentFailureData() {
  const equipmentTypes = [
    { type: 'QAMモジュール', model: 'QAM-4000', count: 20 },
    { type: '光送信機', model: 'FOT-3000TX', count: 15 },
    { type: 'エンコーダー', model: 'ENC-HD2000', count: 12 },
    { type: 'UPS装置', model: 'UPS-1500', count: 25 },
    { type: 'ルーター', model: 'RTR-GX100', count: 10 }
  ]
  
  return equipmentTypes.map(equipment => {
    const relatedRepairs = mockRepairs.filter(r => 
      r.description.includes(equipment.type) || 
      r.equipmentId.includes(equipment.model.split('-')[1])
    )
    const relatedInspections = mockInspectionLogs.filter(l => 
      l.result === 'caution' || l.result === 're-inspection-needed'
    )
    
    const depreciatedAssets = mockAssets.filter(a => 
      a.name.includes(equipment.type) && a.bookValue < a.purchaseAmount * 0.2
    )
    
    return {
      type: equipment.type,
      model: equipment.model,
      totalCount: equipment.count,
      failureCount: relatedRepairs.length,
      failureRate: (relatedRepairs.length / equipment.count * 100),
      abnormalInspectionRate: (relatedInspections.length / equipment.count * 100),
      depreciatedCount: depreciatedAssets.length,
      recommendScore: relatedRepairs.length * 3 + depreciatedAssets.length * 2
    }
  }).sort((a, b) => b.recommendScore - a.recommendScore)
}

// 担当者負荷分析データを生成
function generateStaffWorkloadData() {
  const staffNames = ['田中太郎', '鈴木次郎', '佐藤花子', '高橋美咲', '渡辺健一', '伊藤真司', '山田優子', '中村大輔']
  
  return staffNames.map(name => {
    const repairs = mockRepairs.filter(r => r.assignee === name)
    const inspections = mockInspections.filter(i => i.assignee === name)
    const completedRepairs = repairs.filter(r => r.status === 'completed')
    const avgRepairTime = completedRepairs.length > 0 ?
      completedRepairs.reduce((sum, r) => sum + (r.downtime || 0), 0) / completedRepairs.length : 0
    
    return {
      name,
      repairCount: repairs.length,
      inspectionCount: inspections.length,
      inProgressCount: repairs.filter(r => r.status === 'in-progress').length,
      completionRate: repairs.length > 0 ? (completedRepairs.length / repairs.length * 100) : 100,
      avgLeadTime: avgRepairTime,
      workloadScore: repairs.length + inspections.length * 0.5
    }
  }).sort((a, b) => b.workloadScore - a.workloadScore)
}

// 投資優先度分析データを生成
function generateInvestmentPriorityData() {
  const depreciatedAssets = mockAssets.filter(a => a.bookValue < a.purchaseAmount * 0.1)
  
  return depreciatedAssets.map(asset => {
    const relatedRepairs = mockRepairs.filter(r => 
      r.equipmentId === asset.assetId || 
      r.description.includes(asset.name.split(' ')[0])
    )
    const repairCost = relatedRepairs.reduce((sum, r) => sum + (r.cost || 0), 0)
    const failureCount = relatedRepairs.length
    const abnormalInspections = mockInspectionLogs.filter(l => 
      l.equipmentId === asset.assetId && 
      (l.result === 'caution' || l.result === 're-inspection-needed')
    ).length
    
    const priorityScore = 
      failureCount * 5 + 
      abnormalInspections * 3 + 
      (repairCost / 10000) + 
      (asset.purchaseAmount > 1000000 ? 10 : 0)
    
    return {
      asset,
      failureCount,
      abnormalInspections,
      totalRepairCost: repairCost,
      replacementCost: asset.purchaseAmount,
      priorityScore
    }
  }).sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 10)
}

export default function AnalyticsPage() {
  const [facilityRisks, setFacilityRisks] = useState<ReturnType<typeof generateFacilityRiskData>>([])
  const [equipmentFailures, setEquipmentFailures] = useState<ReturnType<typeof generateEquipmentFailureData>>([])
  const [staffWorkloads, setStaffWorkloads] = useState<ReturnType<typeof generateStaffWorkloadData>>([])
  const [investmentPriorities, setInvestmentPriorities] = useState<ReturnType<typeof generateInvestmentPriorityData>>([])
  
  useEffect(() => {
    // クライアントサイドでのみデータを生成
    setFacilityRisks(generateFacilityRiskData())
    setEquipmentFailures(generateEquipmentFailureData())
    setStaffWorkloads(generateStaffWorkloadData())
    setInvestmentPriorities(generateInvestmentPriorityData())
  }, [])
  
  // 緊急アクションアイテム
  const urgentActions = [
    {
      type: 'repair-overdue',
      title: '修理放置7日超',
      count: mockRepairs.filter(r => 
        r.status === 'in-progress' && 
        new Date().getTime() - new Date(r.reportDate).getTime() > 7 * 24 * 60 * 60 * 1000
      ).length,
      action: '管理者レビュー',
      severity: 'high'
    },
    {
      type: 'inspection-abnormal',
      title: '点検3回連続異常',
      count: 5, // ダミー値
      action: '自動更新候補化',
      severity: 'medium'
    },
    {
      type: 'staff-overload',
      title: '担当者偏在',
      count: staffWorkloads.filter(s => s.workloadScore > 15).length,
      action: '担当変更検討',
      severity: 'medium'
    }
  ]
  
  return (
    <ProtectedRoute requiredPermission="view_all_facilities">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">意思決定分析ダッシュボード</h1>
          <p className="text-gray-600 mt-1">リスク分析と投資優先度の可視化</p>
        </div>
        
        {/* Section 1: どこが危ないか？ */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              どこが危ないか？ - 拠点リスク分析
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* リスクヒートマップ */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">ワースト5拠点</h3>
                <div className="space-y-2">
                  {facilityRisks.slice(0, 5).map((facility, index) => (
                    <div key={facility.facilityId} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                            index === 0 ? 'bg-red-100 text-red-700' :
                            index === 1 ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{facility.facilityId}</span>
                        </div>
                        <span className="text-sm text-red-600 font-medium">
                          リスクスコア: {facility.riskScore}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-gray-500">障害件数</p>
                          <p className="font-medium">{facility.repairCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">点検遅延</p>
                          <p className="font-medium text-orange-600">{facility.overdueInspections}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">緊急案件</p>
                          <p className="font-medium text-red-600">{facility.emergencyCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 事業インパクト × 発生確率 リスクマトリクス */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">リスクマトリクス（事業インパクト × 発生確率）</h3>
                <div className="relative h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                  {/* 背景グリッド */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                    {/* 低リスク（左下） */}
                    <div className="bg-green-100"></div>
                    <div className="bg-green-100"></div>
                    <div className="bg-green-100"></div>
                    <div className="bg-green-50"></div>
                    <div className="bg-green-100"></div>
                    <div className="bg-yellow-100"></div>
                    <div className="bg-yellow-100"></div>
                    <div className="bg-yellow-50"></div>
                    <div className="bg-green-100"></div>
                    <div className="bg-yellow-100"></div>
                    <div className="bg-orange-100"></div>
                    <div className="bg-orange-50"></div>
                    {/* 高リスク（右上） */}
                    <div className="bg-green-50"></div>
                    <div className="bg-yellow-50"></div>
                    <div className="bg-orange-50"></div>
                    <div className="bg-red-100"></div>
                  </div>
                  
                  {/* リスクレベルラベル */}
                  <div className="absolute top-2 left-2 text-xs font-medium text-green-700">低リスク</div>
                  <div className="absolute top-2 right-2 text-xs font-medium text-red-700">高リスク</div>
                  <div className="absolute bottom-2 left-2 text-xs font-medium text-green-700">継続監視</div>
                  <div className="absolute bottom-2 right-2 text-xs font-medium text-orange-700">要対策</div>
                  
                  {/* プロット */}
                  <div className="absolute inset-2">
                    {facilityRisks.slice(0, 12).map(facility => {
                      // 事業インパクト計算（緊急修理件数 + 点検遅延 × 2）
                      const businessImpact = Math.min((facility.emergencyCount * 2 + facility.overdueInspections) * 10, 95)
                      // 発生確率計算（修理件数 / 全体平均）
                      const probability = Math.min(facility.repairCount * 15, 95)
                      
                      // リスクレベルによる色分け
                      const getRiskColor = () => {
                        if (businessImpact > 60 && probability > 60) return 'bg-red-600 hover:bg-red-700'
                        if (businessImpact > 40 && probability > 40) return 'bg-orange-500 hover:bg-orange-600'
                        if (businessImpact > 20 || probability > 20) return 'bg-yellow-500 hover:bg-yellow-600'
                        return 'bg-green-500 hover:bg-green-600'
                      }
                      
                      return (
                        <div
                          key={facility.facilityId}
                          className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-colors ${getRiskColor()}`}
                          style={{
                            left: `${probability}%`,
                            bottom: `${businessImpact}%`,
                            transform: 'translate(-50%, 50%)'
                          }}
                          title={`${facility.facilityId}
事業インパクト: ${businessImpact.toFixed(0)}%（緊急${facility.emergencyCount}件、遅延${facility.overdueInspections}件）
発生確率: ${probability.toFixed(0)}%（修理${facility.repairCount}件）
対策: ${businessImpact > 60 && probability > 60 ? '即座に対策必要' : 
              businessImpact > 40 && probability > 40 ? '対策計画策定' : 
              businessImpact > 20 || probability > 20 ? '継続監視' : '現状維持'}`}
                        >
                          {facility.facilityId.slice(-2)}
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* 軸ラベル */}
                  <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-600 pb-1">
                    <span className="bg-white px-2">発生確率（修理頻度）→</span>
                  </div>
                  <div className="absolute top-0 bottom-0 left-0 text-xs text-gray-600 flex items-center pl-1">
                    <span className="transform -rotate-90 bg-white px-2">事業インパクト（緊急度）→</span>
                  </div>
                  
                  {/* 凡例 */}
                  <div className="absolute top-8 right-2 bg-white border rounded p-2 text-xs space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                      <span>即座対策</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span>対策計画</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>継続監視</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>現状維持</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 2: 何が壊れやすいか？ */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-orange-600" />
              何が壊れやすいか？ - 機器故障傾向
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 型番別故障率 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">型番別故障率</h3>
                <div className="space-y-3">
                  {equipmentFailures.map(equipment => (
                    <div key={equipment.model} className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{equipment.type}</span>
                          <span className="text-xs text-gray-500">{equipment.model}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${equipment.failureRate}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-sm font-medium">{equipment.failureRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">{equipment.failureCount}/{equipment.totalCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 更新推奨リスト */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">更新推奨候補（スコア順）</h3>
                <div className="space-y-2">
                  {equipmentFailures.slice(0, 5).map((equipment, index) => (
                    <div key={equipment.model} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{equipment.type}</p>
                          <p className="text-sm text-gray-600">{equipment.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">
                            スコア: {equipment.recommendScore}
                          </p>
                          <p className="text-xs text-gray-500">
                            償却済: {equipment.depreciatedCount}台
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 3: 誰に負荷が偏ってるか？ */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              誰に負荷が偏ってるか？ - 担当者分析
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 担当者別負荷レーダー */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">担当者別作業件数</h3>
                <div className="space-y-2">
                  {staffWorkloads.slice(0, 6).map(staff => (
                    <div key={staff.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{staff.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">修理</p>
                          <p className="font-medium">{staff.repairCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">点検</p>
                          <p className="font-medium">{staff.inspectionCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">対応中</p>
                          <p className="font-medium text-orange-600">{staff.inProgressCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 平均リードタイム */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">担当別平均リードタイム</h3>
                <div className="space-y-3">
                  {staffWorkloads.slice(0, 6).map(staff => (
                    <div key={staff.name} className="flex items-center justify-between">
                      <span className="text-sm">{staff.name}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(staff.avgLeadTime / 480 * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.floor(staff.avgLeadTime / 60)}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 4: どこにお金をかけるべきか？ */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              どこにお金をかけるべきか？ - 投資優先度
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">更新優先順位（コスト × インパクト）</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-700">順位</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">資産名</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-700">故障回数</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-700">累計修理費</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-700">更新費用</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-700">優先度スコア</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-700">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentPriorities.map((item, index) => (
                      <tr key={item.asset.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index === 0 ? 'bg-red-100 text-red-700' :
                            index === 1 ? 'bg-orange-100 text-orange-700' :
                            index === 2 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="font-medium">{item.asset.name}</p>
                          <p className="text-xs text-gray-500">{item.asset.assetId}</p>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-red-600 font-medium">{item.failureCount}回</span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-orange-600">¥{item.totalRepairCost.toLocaleString()}</span>
                        </td>
                        <td className="py-3 text-right font-medium">
                          ¥{item.replacementCost.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-bold text-purple-600">{item.priorityScore.toFixed(0)}</span>
                        </td>
                        <td className="py-3 text-center">
                          <button 
                            onClick={() => alert(`${item.asset.name}の更新申請を作成しました。承認プロセスが開始されます。`)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            更新申請
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 5: 今すぐ動くべきこと */}
        <section>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              今すぐ動くべきこと - アクションアイテム
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgentActions.map(action => (
                <div key={action.type} className={`border rounded-lg p-4 ${
                  action.severity === 'high' ? 'border-red-300 bg-red-50' :
                  'border-yellow-300 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${
                      action.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {action.count}
                    </span>
                    <AlertTriangle className={`h-6 w-6 ${
                      action.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.action}</p>
                  <button 
                    onClick={() => alert(`${action.title}の対応を開始しました。担当者に通知を送信します。`)}
                    className={`mt-3 w-full px-3 py-1.5 rounded text-sm font-medium ${
                      action.severity === 'high' 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    対応開始
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      </div>
    </ProtectedRoute>
  )
}