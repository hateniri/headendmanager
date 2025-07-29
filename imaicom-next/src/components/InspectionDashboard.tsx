'use client'

import { Calendar, AlertTriangle, CheckCircle, TrendingDown, Users, BarChart3 } from 'lucide-react'
import { Inspection, InspectionLog, getInspectionSummary } from '@/data/inspections'

interface InspectionDashboardProps {
  inspections: Inspection[]
  logs: InspectionLog[]
}

export default function InspectionDashboard({ inspections, logs }: InspectionDashboardProps) {
  const summary = getInspectionSummary(inspections, logs)
  
  const stats = [
    {
      title: '今月の点検予定',
      value: summary.thisMonthCount,
      unit: '件',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '緊急点検',
      value: summary.urgentCount,
      unit: '件',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: '再点検指示',
      value: summary.reInspectionCount,
      unit: '件',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: '点検完了（過去30日）',
      value: summary.completedCount,
      unit: '件',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '点検実施率',
      value: summary.completionRate,
      unit: '%',
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-1 text-sm text-gray-600">{stat.unit}</span>
                  </div>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* グラフセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 担当者別進捗 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-900">担当者別進捗</h3>
          </div>
          <div className="space-y-3">
            {summary.assigneeProgress.map((assignee) => (
              <div key={assignee.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{assignee.name}</span>
                  <span className="text-gray-900 font-medium">
                    {assignee.completed}/{assignee.assigned + assignee.completed}件 ({assignee.rate}%)
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assignee.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* エリア別点検分布 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="font-medium text-gray-900">エリア別点検分布</h3>
          </div>
          <div className="space-y-2">
            {['北海道', '東北', '関東', '中部', '関西'].map((area, index) => {
              const count = Math.floor(Math.random() * 20) + 5
              const maxCount = 25
              return (
                <div key={area}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{area}</span>
                    <span className="font-medium">{count}件</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}