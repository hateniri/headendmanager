'use client'

import { useState } from 'react'
import { Repair, issueTypeLabels, priorityConfig, repairStatusConfig } from '@/data/repairs'
import { Search, Filter, ExternalLink, Calendar, User, MapPin, AlertTriangle } from 'lucide-react'

interface RepairTableProps {
  repairs: Repair[]
  onSelectRepair: (repair: Repair) => void
}

export default function RepairTable({ repairs, onSelectRepair }: RepairTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  
  // 担当者リストを取得
  const assignees = Array.from(new Set(repairs.map(r => r.assignee))).sort()
  
  // フィルタリング
  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = 
      repair.repairId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.facilityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || repair.priority === priorityFilter
    const matchesIssueType = issueTypeFilter === 'all' || repair.issueType === issueTypeFilter
    const matchesAssignee = assigneeFilter === 'all' || repair.assignee === assigneeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesIssueType && matchesAssignee
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-900 mb-4">修理案件一覧</h2>
        
        {/* フィルター */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="修理ID、拠点、機材ID、内容で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全ステータス</option>
              {Object.entries(repairStatusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全優先度</option>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}優先度</option>
              ))}
            </select>
            
            <select
              value={issueTypeFilter}
              onChange={(e) => setIssueTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全障害種別</option>
              {Object.entries(issueTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
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
          
          <div className="text-sm text-gray-600">
            {filteredRepairs.length}件の修理案件
          </div>
        </div>
      </div>
      
      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                修理ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                報告日
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
                障害種別
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                優先度
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                内容
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRepairs.map((repair) => {
              const status = repairStatusConfig[repair.status]
              const priority = priorityConfig[repair.priority]
              
              return (
                <tr key={repair.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {repair.repairId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(repair.reportDate).toLocaleDateString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {repair.facilityId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {repair.equipmentId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {repair.assignee}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {issueTypeLabels[repair.issueType]}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                      <span className="mr-1">{priority.icon}</span>
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {repair.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onSelectRepair(repair)}
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
      
      {filteredRepairs.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          該当する修理案件が見つかりません
        </div>
      )}
    </div>
  )
}