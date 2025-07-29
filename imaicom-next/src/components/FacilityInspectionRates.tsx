'use client'

import { Trophy, AlertTriangle } from 'lucide-react'
import { Inspection, InspectionLog, getFacilityInspectionRates } from '@/data/inspections'

interface FacilityInspectionRatesProps {
  inspections: Inspection[]
  logs: InspectionLog[]
}

export default function FacilityInspectionRates({ inspections, logs }: FacilityInspectionRatesProps) {
  const facilityRates = getFacilityInspectionRates(inspections, logs).slice(0, 10) // 上位10施設
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
        拠点別点検率ランキング
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-sm font-medium text-gray-700">順位</th>
              <th className="text-left py-2 text-sm font-medium text-gray-700">拠点ID</th>
              <th className="text-right py-2 text-sm font-medium text-gray-700">点検実施率</th>
              <th className="text-right py-2 text-sm font-medium text-gray-700">今月予定</th>
              <th className="text-right py-2 text-sm font-medium text-gray-700">未完了</th>
              <th className="text-right py-2 text-sm font-medium text-gray-700">再点検要</th>
            </tr>
          </thead>
          <tbody>
            {facilityRates.map((facility, index) => {
              const isTop3 = index < 3
              const isLow = facility.rate < 70
              
              return (
                <tr key={facility.facilityId} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-sm">
                    {isTop3 && (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                    {!isTop3 && <span className="ml-2 text-gray-500">{index + 1}</span>}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {facility.facilityId}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end">
                      <span className={`text-sm font-bold ${
                        facility.rate >= 90 ? 'text-green-600' :
                        facility.rate >= 70 ? 'text-gray-900' :
                        'text-red-600'
                      }`}>
                        {facility.rate}%
                      </span>
                      {isLow && <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />}
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          facility.rate >= 90 ? 'bg-green-500' :
                          facility.rate >= 70 ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${facility.rate}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 text-sm text-right text-gray-600">
                    {facility.scheduled}件
                  </td>
                  <td className="py-3 text-sm text-right">
                    <span className={facility.incomplete > 0 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                      {facility.incomplete}件
                    </span>
                  </td>
                  <td className="py-3 text-sm text-right">
                    <span className={facility.reInspection > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {facility.reInspection}件
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>※ 点検実施率が70%未満の拠点は要改善対象です</p>
      </div>
    </div>
  )
}