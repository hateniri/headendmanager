'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Activity, Clock } from 'lucide-react'

export default function OperationCharts() {
  const [animatedValues, setAnimatedValues] = useState({
    incidents: [12, 15, 8, 10, 7, 5],
    inspection: [95, 92, 97, 94, 98, 96],
    mttr: [2.5, 3.1, 2.2, 2.8, 2.3, 2.1]
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        incidents: prev.incidents.map(v => Math.max(0, v + (Math.random() - 0.5) * 2)),
        inspection: prev.inspection.map(v => Math.min(100, Math.max(85, v + (Math.random() - 0.5) * 3))),
        mttr: prev.mttr.map(v => Math.max(1, v + (Math.random() - 0.5) * 0.3))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">運用状況チャート</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 障害発生件数 */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-medium text-gray-900">月別障害発生件数</h3>
          </div>
          <div className="space-y-2">
            {months.map((month, index) => (
              <div key={month} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-600 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${(animatedValues.incidents[index] / 20) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{Math.round(animatedValues.incidents[index])}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 点検実施率 */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-gray-900">月別点検実施率</h3>
          </div>
          <div className="space-y-2">
            {months.map((month, index) => (
              <div key={month} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${animatedValues.inspection[index]}%` }}
                  >
                    <span className="text-xs text-white font-medium">{Math.round(animatedValues.inspection[index])}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MTTR推移 */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-900">平均復旧時間 (時間)</h3>
          </div>
          <div className="space-y-2">
            {months.map((month, index) => (
              <div key={month} className="flex items-center">
                <span className="text-sm text-gray-600 w-12">{month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${(animatedValues.mttr[index] / 5) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{animatedValues.mttr[index].toFixed(1)}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}