'use client'

import { X, User, Monitor, Calendar, Activity, FileText, AlertTriangle, ArrowRight } from 'lucide-react'
import { AuditLog, actionLabels, entityLabels, actionConfig } from '@/data/auditLogs'

interface AuditLogDetailModalProps {
  log: AuditLog | null
  onClose: () => void
}

export default function AuditLogDetailModal({ log, onClose }: AuditLogDetailModalProps) {
  if (!log) return null
  
  const config = actionConfig[log.action]
  const isImportant = 
    log.action === 'delete' || 
    (log.action === 'login' && log.result === 'failure') ||
    log.action === 'export' ||
    (log.action === 'update' && log.changes?.some(c => c.field === 'status'))
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              操作履歴詳細
            </h2>
            <p className="text-sm text-gray-600">
              {log.logId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* 重要操作の警告 */}
            {isImportant && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">重要操作</h3>
                    <p className="text-sm text-red-700 mt-1">
                      この操作は監査対象の重要な操作として記録されています。
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 基本情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">日時</p>
                  <p className="font-medium flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(log.timestamp).toLocaleString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">操作種別</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                      <span className="mr-1">{config.icon}</span>
                      {actionLabels[log.action]}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">対象</p>
                  <p className="font-medium mt-1">
                    {entityLabels[log.entity]} ({log.entityId})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">結果</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.result === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {log.result === 'success' ? '成功' : '失敗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 操作者情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-600" />
                操作者情報
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ユーザー名</p>
                    <p className="font-medium">{log.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ユーザーID</p>
                    <p className="font-medium">{log.userId}</p>
                  </div>
                  {log.department && (
                    <div>
                      <p className="text-sm text-gray-600">所属部門</p>
                      <p className="font-medium">{log.department}</p>
                    </div>
                  )}
                  {log.jobTitle && (
                    <div>
                      <p className="text-sm text-gray-600">役職</p>
                      <p className="font-medium">{log.jobTitle}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 対象情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-gray-600" />
                対象情報
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">操作内容</p>
                <p className="font-medium mt-1">{log.description}</p>
                
                {/* 変更内容（更新の場合） */}
                {log.changes && log.changes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">変更内容</p>
                    <div className="space-y-2">
                      {log.changes.map((change, index) => (
                        <div key={index} className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-1">{change.field}</p>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-red-600 line-through">{change.oldValue || '(空)'}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="text-green-600 font-medium">{change.newValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 発生環境 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-gray-600" />
                発生環境
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">IPアドレス</p>
                    <p className="font-medium">{log.ipAddress}</p>
                  </div>
                  {log.userAgent && (
                    <div>
                      <p className="text-sm text-gray-600">ユーザーエージェント</p>
                      <p className="font-medium text-xs">{log.userAgent}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 備考 */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                ※ このログは自動的に記録されたものです。不正な操作や異常なパターンが検出された場合は、システム管理者に通知されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}