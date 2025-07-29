'use client'

import { X, Calendar, User, MapPin, Wrench, FileText, Image, Clock, AlertTriangle, Thermometer, Zap } from 'lucide-react'
import { Inspection, InspectionLog, inspectionTypeLabels, statusConfig, resultConfig } from '@/data/inspections'
import { useAuth } from '@/contexts/AuthContext'

interface InspectionDetailPanelProps {
  item: Inspection | InspectionLog | null
  onClose: () => void
}

export default function InspectionDetailPanel({ item, onClose }: InspectionDetailPanelProps) {
  const { hasPermission } = useAuth()
  if (!item) return null
  
  const isInspection = 'status' in item
  
  // ダミーの点検履歴データ
  const inspectionHistory = [
    { date: '2024-12-15', result: 'normal', memo: '正常動作確認' },
    { date: '2024-09-20', result: 'caution', memo: '軽微な汚れあり→清掃実施' },
    { date: '2024-06-10', result: 'normal', memo: '定期点検完了' },
    { date: '2024-03-05', result: 're-inspection-needed', memo: '温度異常→再点検実施' },
  ]
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isInspection ? '点検予定詳細' : '点検履歴詳細'}
            </h2>
            <p className="text-sm text-gray-600">
              {isInspection ? (item as Inspection).inspectionId : (item as InspectionLog).logId}
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
            {/* 基本情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {isInspection ? '予定日' : '実施日'}
                  </p>
                  <p className="font-medium flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(isInspection ? (item as Inspection).scheduledDate : (item as InspectionLog).executedDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">担当者</p>
                  <p className="font-medium flex items-center mt-1">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {item.assignee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">拠点</p>
                  <p className="font-medium flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {item.facilityId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">機材ID</p>
                  <p className="font-medium">{item.equipmentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">点検項目</p>
                  <p className="font-medium flex items-center mt-1">
                    <Wrench className="h-4 w-4 mr-1 text-gray-400" />
                    {inspectionTypeLabels[item.inspectionType]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {isInspection ? 'ステータス' : '結果'}
                  </p>
                  <div className="mt-1">
                    {isInspection ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[(item as Inspection).status].bg} ${statusConfig[(item as Inspection).status].color}`}>
                        <span className="mr-1">{statusConfig[(item as Inspection).status].icon}</span>
                        {statusConfig[(item as Inspection).status].label}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${resultConfig[(item as InspectionLog).result].bg} ${resultConfig[(item as InspectionLog).result].color}`}>
                        {resultConfig[(item as InspectionLog).result].label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 機材情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">機材情報</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">機材名</p>
                    <p className="font-medium">Cisco QAM4000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">型番</p>
                    <p className="font-medium">QAM4000-16</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">設置拠点</p>
                    <p className="font-medium">{item.facilityId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ラック番号</p>
                    <p className="font-medium">RACK-A12</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 測定データ（履歴の場合） */}
            {!isInspection && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">測定データ</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(item as InspectionLog).temperature && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">温度</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {(item as InspectionLog).temperature?.toFixed(1)}°C
                          </p>
                        </div>
                        <Thermometer className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                  )}
                  {(item as InspectionLog).voltage && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">電圧</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {(item as InspectionLog).voltage?.toFixed(1)}V
                          </p>
                        </div>
                        <Zap className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">記録メモ</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                    {(item as InspectionLog).memo}
                  </p>
                </div>
              </div>
            )}
            
            {/* 備考（予定の場合） */}
            {isInspection && (item as Inspection).notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-4">備考</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{(item as Inspection).notes}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 点検履歴タイムライン */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                点検履歴（過去1年）
              </h3>
              <div className="space-y-3">
                {inspectionHistory.map((history, index) => {
                  const result = resultConfig[history.result as keyof typeof resultConfig]
                  return (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          history.result === 'normal' ? 'bg-green-500' :
                          history.result === 'caution' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(history.date).toLocaleDateString('ja-JP')}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.bg} ${result.color}`}>
                            {result.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{history.memo}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* 添付ファイル */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Image className="h-5 w-5 mr-2 text-gray-600" />
                添付ファイル
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-2 text-center hover:bg-gray-50 cursor-pointer">
                  <div className="h-20 bg-gray-200 rounded mb-1 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 truncate">点検写真1.jpg</p>
                </div>
                <div className="border rounded-lg p-2 text-center hover:bg-gray-50 cursor-pointer">
                  <div className="h-20 bg-gray-200 rounded mb-1 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 truncate">報告書.pdf</p>
                </div>
              </div>
            </div>
            
            {/* アクション */}
            {isInspection && hasPermission('edit_inspection') && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  点検延期
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  点検実施登録
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}