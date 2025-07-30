'use client'

import { useState, useEffect } from 'react'
import { Calendar, FileText, AlertCircle, CheckCircle, XCircle, Clock, Filter, Download } from 'lucide-react'
import { useInspectionHistoryStore } from '@/store/inspectionHistoryStore'
import { InspectionHistory, InspectionHistoryFilter } from '@/types/inspection'

interface InspectionHistoryProps {
  facilityId: string
  facilityName: string
}

const inspectionTypeLabels = {
  'ups': 'UPS',
  'distribution-panel': '分電盤',
  'underground-tank': '地下タンク',
  'fire-prediction': '火災予兆',
  'hvac': '空調・冷凍機器',
  'battery': '蓄電池',
  'disaster-prevention': '防災設備',
  'emergency-generator': '非常用発電機'
}

const statusLabels = {
  'completed': '完了',
  'in-progress': '実施中',
  'pending': '予定'
}

const judgmentColors = {
  '良好': 'bg-green-100 text-green-800',
  '要注意': 'bg-yellow-100 text-yellow-800',
  '要修理': 'bg-orange-100 text-orange-800',
  '危険': 'bg-red-100 text-red-800'
}

const judgmentIcons = {
  '良好': CheckCircle,
  '要注意': AlertCircle,
  '要修理': AlertCircle,
  '危険': XCircle
}

export default function InspectionHistory({ facilityId, facilityName }: InspectionHistoryProps) {
  const { getFilteredHistories } = useInspectionHistoryStore()
  const [histories, setHistories] = useState<InspectionHistory[]>([])
  const [filter, setFilter] = useState<InspectionHistoryFilter>({ facilityId })
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    const filtered = getFilteredHistories(filter)
    setHistories(filtered)
  }, [filter, getFilteredHistories])

  const exportToCSV = () => {
    const csvData: string[] = ['点検履歴一覧']
    csvData.push(`施設名,${facilityName}`)
    csvData.push('')
    csvData.push('点検日,点検種別,点検業者,点検者,判定,ステータス')
    
    histories.forEach(history => {
      csvData.push([
        history.inspectionDate,
        inspectionTypeLabels[history.inspectionType],
        history.company,
        history.inspector,
        history.overallJudgment,
        statusLabels[history.status]
      ].join(','))
    })
    
    const csv = csvData.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `点検履歴_${facilityName}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">点検履歴</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              フィルター
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              CSV出力
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  点検種別
                </label>
                <select
                  value={filter.inspectionType || ''}
                  onChange={(e) => setFilter({ ...filter, inspectionType: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  {Object.entries(inspectionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  判定
                </label>
                <select
                  value={filter.overallJudgment || ''}
                  onChange={(e) => setFilter({ ...filter, overallJudgment: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  <option value="良好">良好</option>
                  <option value="要注意">要注意</option>
                  <option value="要修理">要修理</option>
                  <option value="危険">危険</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {histories.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  点検日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  点検種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  点検業者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  点検者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  判定
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {histories.map((history) => {
                const JudgmentIcon = judgmentIcons[history.overallJudgment]
                return (
                  <tr key={history.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(history.inspectionDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspectionTypeLabels[history.inspectionType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.inspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${judgmentColors[history.overallJudgment]}`}>
                        <JudgmentIcon className="h-3 w-3" />
                        {history.overallJudgment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        history.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        history.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {history.status === 'in-progress' && <Clock className="h-3 w-3" />}
                        {statusLabels[history.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          // TODO: 詳細表示モーダルを開く
                          console.log('View details:', history)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">点検履歴がありません</h3>
            <p className="mt-1 text-sm text-gray-500">点検を実施すると、ここに履歴が表示されます。</p>
          </div>
        )}
      </div>
    </div>
  )
}