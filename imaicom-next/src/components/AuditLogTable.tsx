'use client'

import { useState } from 'react'
import { AuditLog, actionLabels, entityLabels, actionConfig, getImportantLogs } from '@/data/auditLogs'
import { Search, Filter, ExternalLink, Calendar, User, Monitor, AlertTriangle } from 'lucide-react'

interface AuditLogTableProps {
  logs: AuditLog[]
  onSelectLog: (log: AuditLog) => void
}

export default function AuditLogTable({ logs, onSelectLog }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showImportantOnly, setShowImportantOnly] = useState(false)
  
  // ユーザーリストを取得
  const users = Array.from(new Set(logs.map(l => l.userName))).sort()
  
  // フィルタリング
  let filteredLogs = logs
  
  if (showImportantOnly) {
    filteredLogs = getImportantLogs(filteredLogs)
  }
  
  filteredLogs = filteredLogs.filter(log => {
    const matchesSearch = 
      log.logId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter
    const matchesResult = resultFilter === 'all' || log.result === resultFilter
    const matchesUser = userFilter === 'all' || log.userName === userFilter
    
    let matchesDate = true
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(log.timestamp) >= new Date(dateRange.start)
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = matchesDate && new Date(log.timestamp) <= endDate
    }
    
    return matchesSearch && matchesAction && matchesEntity && matchesResult && matchesUser && matchesDate
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-900 mb-4">操作ログテーブル</h2>
        
        {/* 重要操作フィルタ */}
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showImportantOnly}
              onChange={(e) => setShowImportantOnly(e.target.checked)}
              className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">重要操作のみ表示</span>
              <span className="ml-2 text-sm text-red-600">
                （削除、ログイン失敗、エクスポート、ステータス変更）
              </span>
            </div>
          </label>
        </div>
        
        {/* フィルター */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ログID、ユーザー名、操作内容、対象IDで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="self-center text-gray-500">〜</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全操作種別</option>
              {Object.entries(actionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全エンティティ</option>
              {Object.entries(entityLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全結果</option>
              <option value="success">成功</option>
              <option value="failure">失敗</option>
            </select>
            
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全ユーザー</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredLogs.length}件のログ
          </div>
        </div>
      </div>
      
      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ログID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ユーザー名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                操作内容
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                対象ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                結果
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                IPアドレス
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const config = actionConfig[log.action]
              const isImportant = getImportantLogs([log]).length > 0
              
              return (
                <tr key={log.id} className={`hover:bg-gray-50 ${isImportant ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {log.logId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(log.timestamp).toLocaleString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {log.userName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color} mr-2`}>
                        <span className="mr-1">{config.icon}</span>
                        {actionLabels[log.action]}
                      </span>
                      <span className="text-gray-600">{log.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {log.entityId}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.result === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.result === 'success' ? '成功' : '失敗'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Monitor className="h-3 w-3 mr-1" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onSelectLog(log)}
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
      </div>
      
      {filteredLogs.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          該当するログが見つかりません
        </div>
      )}
    </div>
  )
}