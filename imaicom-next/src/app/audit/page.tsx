'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import AuditLogDashboard from '@/components/AuditLogDashboard'
import AuditLogTable from '@/components/AuditLogTable'
import AuditLogDetailModal from '@/components/AuditLogDetailModal'
import { mockAuditLogs } from '@/data/auditLogs'
import { AuditLog } from '@/data/auditLogs'

export default function AuditPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  
  return (
    <ProtectedRoute requiredPermission="view_audit_logs">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">監査ログ</h1>
          <p className="text-gray-600 mt-1">
            システム操作の記録・説明責任・ISMS対応
          </p>
        </div>
        
        {/* ダッシュボード */}
        <AuditLogDashboard logs={mockAuditLogs} />
        
        {/* ログテーブル */}
        <AuditLogTable 
          logs={mockAuditLogs}
          onSelectLog={setSelectedLog}
        />
        
        {/* 詳細モーダル */}
        <AuditLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      </main>
      </div>
    </ProtectedRoute>
  )
}