'use client'

import { useState, useEffect } from 'react'
import { LogIn, LogOut, User, Building, Thermometer, Calendar, Search } from 'lucide-react'
import { AccessLog, purposeLabels, generateAccessLogs } from '@/data/accessLogs'

interface AccessLogsProps {
  facilityId: string
}

export default function AccessLogs({ facilityId }: AccessLogsProps) {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [purposeFilter, setPurposeFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  
  useEffect(() => {
    // クライアントサイドでログを生成
    setLogs(generateAccessLogs(facilityId, 50))
  }, [facilityId])
  
  // フィルタリング
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.personId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPurpose = purposeFilter === 'all' || log.purpose === purposeFilter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    
    return matchesSearch && matchesPurpose && matchesAction
  })
  
  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="氏名、社員番号、会社名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全目的</option>
            {Object.entries(purposeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">入退室</option>
            <option value="entry">入室のみ</option>
            <option value="exit">退室のみ</option>
          </select>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {filteredLogs.length}件の記録
        </div>
      </div>
      
      {/* ログ一覧 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  日時
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  区分
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  氏名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  社員番号
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  会社名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  目的
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  体温
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  備考
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
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
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.action === 'entry' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.action === 'entry' ? (
                        <>
                          <LogIn className="h-3 w-3 mr-1" />
                          入室
                        </>
                      ) : (
                        <>
                          <LogOut className="h-3 w-3 mr-1" />
                          退室
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-gray-400" />
                      {log.personName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {log.personId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1 text-gray-400" />
                      {log.company}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {purposeLabels[log.purpose]}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.temperature && (
                      <div className="flex items-center">
                        <Thermometer className="h-3 w-3 mr-1 text-gray-400" />
                        <span className={log.temperature > 37.5 ? 'text-red-600 font-medium' : ''}>
                          {log.temperature.toFixed(1)}°C
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {log.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            該当する入退室記録が見つかりません
          </div>
        )}
      </div>
    </div>
  )
}