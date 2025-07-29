'use client'

import { Wrench, Clock, DollarSign, AlertTriangle, CheckCircle, Pause } from 'lucide-react'
import { Repair, getRepairStats, priorityConfig, repairStatusConfig } from '@/data/repairs'

interface RepairDashboardProps {
  repairs: Repair[]
}

export default function RepairDashboard({ repairs }: RepairDashboardProps) {
  const stats = getRepairStats(repairs)
  
  // 今月の修理案件
  const currentMonth = new Date()
  const thisMonthRepairs = repairs.filter(repair => {
    const repairDate = new Date(repair.reportDate)
    return repairDate.getMonth() === currentMonth.getMonth() && 
           repairDate.getFullYear() === currentMonth.getFullYear()
  })
  
  const thisMonthStats = getRepairStats(thisMonthRepairs)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 総修理案件数 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">総修理案件</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">今月: {thisMonthStats.total}件</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wrench className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
      
      {/* ステータス別内訳 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">ステータス別</p>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">完了</span>
            </div>
            <span className="text-sm font-medium">{stats.byStatus.completed}件</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wrench className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">対応中</span>
            </div>
            <span className="text-sm font-medium">{stats.byStatus.inProgress}件</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Pause className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">保留</span>
            </div>
            <span className="text-sm font-medium">{stats.byStatus.onHold}件</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500"
              style={{ width: `${(stats.byStatus.completed / stats.total) * 100}%` }}
            />
            <div 
              className="bg-blue-500"
              style={{ width: `${(stats.byStatus.inProgress / stats.total) * 100}%` }}
            />
            <div 
              className="bg-gray-500"
              style={{ width: `${(stats.byStatus.onHold / stats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* 平均ダウンタイム */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">平均ダウンタイム</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {Math.floor(stats.avgDowntime / 60)}時間{Math.floor(stats.avgDowntime % 60)}分
            </p>
            <p className="text-sm text-gray-500 mt-1">完了案件の平均</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
      
      {/* 総修理コスト */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">総修理コスト</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ¥{stats.totalCost.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">今月: ¥{thisMonthStats.totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
      
      {/* 優先度別内訳 */}
      <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2 xl:col-span-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-gray-600" />
          優先度別修理案件
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${priorityConfig.high.bg} mb-2`}>
              <span className="text-2xl font-bold">{stats.byPriority.high}</span>
            </div>
            <p className={`text-sm font-medium ${priorityConfig.high.color}`}>高優先度</p>
            <p className="text-xs text-gray-500 mt-1">緊急対応</p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${priorityConfig.medium.bg} mb-2`}>
              <span className="text-2xl font-bold">{stats.byPriority.medium}</span>
            </div>
            <p className={`text-sm font-medium ${priorityConfig.medium.color}`}>中優先度</p>
            <p className="text-xs text-gray-500 mt-1">通常対応</p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${priorityConfig.low.bg} mb-2`}>
              <span className="text-2xl font-bold">{stats.byPriority.low}</span>
            </div>
            <p className={`text-sm font-medium ${priorityConfig.low.color}`}>低優先度</p>
            <p className="text-xs text-gray-500 mt-1">計画対応</p>
          </div>
        </div>
      </div>
    </div>
  )
}