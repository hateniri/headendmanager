'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import RepairDashboard from '@/components/RepairDashboard'
import RepairTable from '@/components/RepairTable'
import RepairProgressBoards from '@/components/RepairProgressBoards'
import RepairDetailPanel from '@/components/RepairDetailPanel'
import { mockRepairs } from '@/data/repairs'
import { Repair } from '@/data/repairs'

export default function RepairPage() {
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null)
  
  return (
    <ProtectedRoute requiredPermission="create_repair">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">修理管理</h1>
          <p className="text-gray-600 mt-1">修理・故障対応の進捗管理</p>
        </div>
        
        <div className="space-y-6">
          {/* ダッシュボード */}
          <RepairDashboard repairs={mockRepairs} />
          
          {/* 修理案件一覧 */}
          <RepairTable 
            repairs={mockRepairs}
            onSelectRepair={setSelectedRepair}
          />
          
          {/* 担当者別・拠点別進捗 */}
          <RepairProgressBoards repairs={mockRepairs} />
        </div>
        
        {/* 詳細パネル */}
        <RepairDetailPanel
          repair={selectedRepair}
          onClose={() => setSelectedRepair(null)}
        />
      </main>
      </div>
    </ProtectedRoute>
  )
}