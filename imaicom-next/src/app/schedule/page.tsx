'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import InspectionDashboard from '@/components/InspectionDashboard'
import InspectionCalendar from '@/components/InspectionCalendar'
import InspectionTable from '@/components/InspectionTable'
import FacilityInspectionRates from '@/components/FacilityInspectionRates'
import InspectionDetailPanel from '@/components/InspectionDetailPanel'
import { mockInspections, mockInspectionLogs } from '@/data/inspections'
import { Inspection, InspectionLog } from '@/data/inspections'

export default function SchedulePage() {
  const [selectedItem, setSelectedItem] = useState<Inspection | InspectionLog | null>(null)
  
  return (
    <ProtectedRoute requiredPermission="create_inspection">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">点検管理</h1>
          <p className="text-gray-600 mt-1">全設備の点検予定と履歴を一元管理</p>
        </div>
        
        <div className="space-y-6">
          {/* ダッシュボード */}
          <InspectionDashboard 
            inspections={mockInspections} 
            logs={mockInspectionLogs} 
          />
          
          {/* カレンダービュー */}
          <InspectionCalendar
            inspections={mockInspections}
            onSelectInspection={setSelectedItem}
          />
          
          {/* 点検一覧・履歴 */}
          <InspectionTable
            inspections={mockInspections}
            logs={mockInspectionLogs}
            onSelectInspection={setSelectedItem}
          />
          
          {/* 拠点別点検率 */}
          <FacilityInspectionRates
            inspections={mockInspections}
            logs={mockInspectionLogs}
          />
        </div>
        
        {/* 詳細パネル */}
        <InspectionDetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </main>
      </div>
    </ProtectedRoute>
  )
}