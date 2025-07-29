'use client'

import { User, MapPin, CheckCircle, Wrench, Pause } from 'lucide-react'
import { Repair, getRepairsByAssignee, getRepairsByFacility } from '@/data/repairs'

interface RepairProgressBoardsProps {
  repairs: Repair[]
}

export default function RepairProgressBoards({ repairs }: RepairProgressBoardsProps) {
  const assigneeStats = getRepairsByAssignee(repairs)
  const facilityStats = getRepairsByFacility(repairs)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 担当者別進捗 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-gray-600" />
          担当者別進捗
        </h2>
        
        <div className="space-y-3">
          {assigneeStats.slice(0, 8).map((stat) => {
            const completionRate = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0
            
            return (
              <div key={stat.assignee} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{stat.assignee}</p>
                    <p className="text-sm text-gray-600">計{stat.total}件</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{completionRate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">完了率</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-gray-600">完了 {stat.completed}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Wrench className="h-3 w-3 text-blue-600 mr-1" />
                    <span className="text-gray-600">対応中 {stat.inProgress}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Pause className="h-3 w-3 text-gray-600 mr-1" />
                    <span className="text-gray-600">保留 {stat.onHold}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                    />
                    <div 
                      className="bg-blue-500"
                      style={{ width: `${(stat.inProgress / stat.total) * 100}%` }}
                    />
                    <div 
                      className="bg-gray-400"
                      style={{ width: `${(stat.onHold / stat.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* 拠点別進捗 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-gray-600" />
          拠点別進捗
        </h2>
        
        <div className="space-y-3">
          {facilityStats.slice(0, 8).map((stat) => {
            const completionRate = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0
            const hasIssues = stat.inProgress > 2 || stat.onHold > 0
            
            return (
              <div key={stat.facilityId} className={`border rounded-lg p-3 hover:bg-gray-50 ${hasIssues ? 'border-orange-300' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{stat.facilityId}</p>
                    <p className="text-sm text-gray-600">計{stat.total}件</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{completionRate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">完了率</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-gray-600">完了 {stat.completed}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Wrench className="h-3 w-3 text-blue-600 mr-1" />
                    <span className="text-gray-600">対応中 {stat.inProgress}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Pause className="h-3 w-3 text-gray-600 mr-1" />
                    <span className="text-gray-600">保留 {stat.onHold}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full flex overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                    />
                    <div 
                      className="bg-blue-500"
                      style={{ width: `${(stat.inProgress / stat.total) * 100}%` }}
                    />
                    <div 
                      className="bg-gray-400"
                      style={{ width: `${(stat.onHold / stat.total) * 100}%` }}
                    />
                  </div>
                </div>
                
                {hasIssues && (
                  <p className="text-xs text-orange-600 mt-1">要注意</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}