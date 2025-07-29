'use client'

import { X, Calendar, User, MapPin, Wrench, FileText, AlertTriangle, Clock, DollarSign, Package, CheckCircle } from 'lucide-react'
import { Repair, issueTypeLabels, priorityConfig, repairStatusConfig } from '@/data/repairs'
import { useAuth } from '@/contexts/AuthContext'

interface RepairDetailPanelProps {
  repair: Repair | null
  onClose: () => void
}

export default function RepairDetailPanel({ repair, onClose }: RepairDetailPanelProps) {
  const { hasPermission } = useAuth()
  if (!repair) return null
  
  const status = repairStatusConfig[repair.status]
  const priority = priorityConfig[repair.priority]
  
  // ダミーの修理履歴データ
  const repairHistory = [
    { date: '2024-12-20 09:00', action: '障害報告受付', user: '運用センター' },
    { date: '2024-12-20 10:30', action: '担当者アサイン', user: 'システム' },
    { date: '2024-12-20 14:00', action: '現地調査開始', user: repair.assignee },
    { date: '2024-12-21 09:30', action: '原因特定', user: repair.assignee },
    { date: '2024-12-21 15:00', action: '修理作業完了', user: repair.assignee },
  ]
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              修理案件詳細
            </h2>
            <p className="text-sm text-gray-600">
              {repair.repairId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* ステータスと優先度 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priority.bg} ${priority.color}`}>
                  <span className="mr-1">{priority.icon}</span>
                  {priority.label}優先度
                </span>
              </div>
              <span className="text-sm text-gray-500">
                報告日: {new Date(repair.reportDate).toLocaleDateString('ja-JP')}
              </span>
            </div>
            
            {/* 基本情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">拠点</p>
                  <p className="font-medium flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {repair.facilityId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">機材ID</p>
                  <p className="font-medium">{repair.equipmentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">担当者</p>
                  <p className="font-medium flex items-center mt-1">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {repair.assignee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">障害種別</p>
                  <p className="font-medium flex items-center mt-1">
                    <Wrench className="h-4 w-4 mr-1 text-gray-400" />
                    {issueTypeLabels[repair.issueType]}
                  </p>
                </div>
                {repair.repairDate && (
                  <div>
                    <p className="text-sm text-gray-600">修理完了日</p>
                    <p className="font-medium flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(repair.repairDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                )}
                {repair.downtime && (
                  <div>
                    <p className="text-sm text-gray-600">ダウンタイム</p>
                    <p className="font-medium flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {Math.floor(repair.downtime / 60)}時間{repair.downtime % 60}分
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 障害内容 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">障害内容</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-800">{repair.description}</p>
                </div>
              </div>
            </div>
            
            {/* 原因と対応内容 */}
            {(repair.rootCause || repair.repairDetails) && (
              <div className="space-y-4">
                {repair.rootCause && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">原因</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{repair.rootCause}</p>
                    </div>
                  </div>
                )}
                {repair.repairDetails && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">修理内容</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <p className="text-sm text-green-800">{repair.repairDetails}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 使用部品とコスト */}
            {(repair.partsUsed || repair.cost) && (
              <div className="grid grid-cols-2 gap-4">
                {repair.partsUsed && repair.partsUsed.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-gray-600" />
                      使用部品
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="text-sm text-gray-700 space-y-1">
                        {repair.partsUsed.map((part, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            {part}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {repair.cost && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                      修理コスト
                    </h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-purple-700">
                        ¥{repair.cost.toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">部品・作業費込み</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 作業履歴タイムライン */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                作業履歴
              </h3>
              <div className="space-y-3">
                {repairHistory.map((history, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        index === 0 ? 'bg-red-500' :
                        index === repairHistory.length - 1 ? 'bg-green-500' :
                        'bg-blue-500'
                      }`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {history.action}
                        </p>
                        <p className="text-xs text-gray-500">{history.date}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">担当: {history.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* アクション */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {repair.status === 'on-hold' && hasPermission('edit_repair') && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  作業再開
                </button>
              )}
              {repair.status === 'in-progress' && hasPermission('edit_repair') && (
                <>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    保留にする
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    修理完了登録
                  </button>
                </>
              )}
              {repair.status === 'completed' && hasPermission('export_data') && (
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  報告書作成
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}