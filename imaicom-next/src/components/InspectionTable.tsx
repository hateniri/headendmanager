'use client'

import { useState } from 'react'
import { Inspection, InspectionLog, inspectionTypeLabels, statusConfig, resultConfig } from '@/data/inspections'
import { Search, Filter, ExternalLink, Calendar, User, MapPin } from 'lucide-react'

interface InspectionTableProps {
  inspections: Inspection[]
  logs: InspectionLog[]
  onSelectInspection: (inspection: Inspection | InspectionLog) => void
}

export default function InspectionTable({ inspections, logs, onSelectInspection }: InspectionTableProps) {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'history'>('scheduled')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  
  // 担当者リストを取得
  const assignees = Array.from(new Set([
    ...inspections.map(i => i.assignee),
    ...logs.map(l => l.assignee)
  ])).sort()
  
  // フィルタリング - 予定
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.inspectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.facilityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter
    const matchesAssignee = assigneeFilter === 'all' || inspection.assignee === assigneeFilter
    
    return matchesSearch && matchesStatus && matchesAssignee
  })
  
  // フィルタリング - 履歴
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.logId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.facilityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAssignee = assigneeFilter === 'all' || log.assignee === assigneeFilter
    
    return matchesSearch && matchesAssignee
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* タブ */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'scheduled'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            点検予定一覧
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            点検履歴
          </button>
        </div>
      </div>
      
      {/* フィルター */}
      <div className="p-4 border-b">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="点検ID、拠点、機材IDで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {activeTab === 'scheduled' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ステータス</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            )}
            
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全担当者</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {activeTab === 'scheduled' 
            ? `${filteredInspections.length}件の点検予定`
            : `${filteredLogs.length}件の点検履歴`
          }
        </div>
      </div>
      
      {/* テーブル */}
      <div className="overflow-x-auto">
        {activeTab === 'scheduled' ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  点検ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  予定日
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  拠点
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  機材ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  担当者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  点検項目
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  備考
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInspections.map((inspection) => {
                const status = statusConfig[inspection.status]
                
                return (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {inspection.inspectionId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(inspection.scheduledDate).toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {inspection.facilityId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {inspection.equipmentId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {inspection.assignee}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inspectionTypeLabels[inspection.inspectionType]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        <span className="mr-1">{status.icon}</span>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {inspection.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => onSelectInspection(inspection)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  点検ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  実施日
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  拠点
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  機材ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  担当者
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  項目
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  結果
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  記録メモ
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const result = resultConfig[log.result]
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {log.logId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(log.executedDate).toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {log.facilityId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {log.equipmentId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {log.assignee}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inspectionTypeLabels[log.inspectionType]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${result.bg} ${result.color}`}>
                        {result.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.memo}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => onSelectInspection(log)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {(activeTab === 'scheduled' ? filteredInspections : filteredLogs).length === 0 && (
        <div className="p-8 text-center text-gray-500">
          該当する{activeTab === 'scheduled' ? '点検予定' : '点検履歴'}が見つかりません
        </div>
      )}
    </div>
  )
}