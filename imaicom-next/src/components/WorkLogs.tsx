'use client'

import { useState, useEffect } from 'react'
import { Wrench, Clock, Users, Calendar, Search, Camera, CheckCircle, XCircle, PauseCircle } from 'lucide-react'
import { WorkLog, workTypeLabels, generateWorkLogs } from '@/data/accessLogs'

interface WorkLogsProps {
  facilityId: string
}

export default function WorkLogs({ facilityId }: WorkLogsProps) {
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null)
  
  useEffect(() => {
    // クライアントサイドでログを生成
    setLogs(generateWorkLogs(facilityId, 30))
  }, [facilityId])
  
  // フィルタリング
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.workers.some(w => w.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.equipmentId && log.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesWorkType = workTypeFilter === 'all' || log.workType === workTypeFilter
    const matchesResult = resultFilter === 'all' || log.result === resultFilter
    
    return matchesSearch && matchesWorkType && matchesResult
  })
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
  }
  
  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="作業内容、作業者、会社名、機材IDで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全作業種別</option>
            {Object.entries(workTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全結果</option>
            <option value="completed">完了</option>
            <option value="partial">一部完了</option>
            <option value="postponed">延期</option>
          </select>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {filteredLogs.length}件の作業履歴
        </div>
      </div>
      
      {/* 作業履歴一覧 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  日時
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  作業種別
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  作業内容
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  作業者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  会社名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  作業時間
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  結果
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  写真
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      <Wrench className="h-3 w-3 mr-1" />
                      {workTypeLabels[log.workType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <p className="font-medium">{log.description}</p>
                    {log.equipmentId && (
                      <p className="text-xs text-gray-500">機材: {log.equipmentId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="truncate max-w-xs">{log.workers.join(', ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {log.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      {formatDuration(log.duration)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.result === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : log.result === 'partial'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {log.result === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {log.result === 'partial' && <PauseCircle className="h-3 w-3 mr-1" />}
                      {log.result === 'postponed' && <XCircle className="h-3 w-3 mr-1" />}
                      {log.result === 'completed' ? '完了' : log.result === 'partial' ? '一部完了' : '延期'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.photos && log.photos.length > 0 && (
                      <Camera className="h-4 w-4 text-gray-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            該当する作業履歴が見つかりません
          </div>
        )}
      </div>
      
      {/* 作業詳細モーダル */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-gray-900">作業詳細</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">作業日時</p>
                  <p className="font-medium">
                    {new Date(selectedLog.timestamp).toLocaleString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">作業時間</p>
                  <p className="font-medium">{formatDuration(selectedLog.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">作業種別</p>
                  <p className="font-medium">{workTypeLabels[selectedLog.workType]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">結果</p>
                  <p className="font-medium">
                    {selectedLog.result === 'completed' ? '完了' : 
                     selectedLog.result === 'partial' ? '一部完了' : '延期'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">作業内容</p>
                <p className="font-medium mt-1">{selectedLog.description}</p>
              </div>
              
              {selectedLog.equipmentId && (
                <div>
                  <p className="text-sm text-gray-600">対象機材</p>
                  <p className="font-medium mt-1">{selectedLog.equipmentId}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-600">作業者</p>
                <p className="font-medium mt-1">{selectedLog.workers.join(', ')}</p>
                <p className="text-sm text-gray-500">{selectedLog.company}</p>
              </div>
              
              {selectedLog.notes && (
                <div>
                  <p className="text-sm text-gray-600">備考</p>
                  <p className="font-medium mt-1">{selectedLog.notes}</p>
                </div>
              )}
              
              {selectedLog.photos && selectedLog.photos.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">作業写真</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedLog.photos.map((photo, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">{photo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}