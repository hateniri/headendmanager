'use client'

import { FileText, AlertTriangle, CheckCircle, TrendingUp, Activity, Edit, Download } from 'lucide-react'
import { AuditLog, getAuditStats } from '@/data/auditLogs'

interface AuditLogDashboardProps {
  logs: AuditLog[]
}

export default function AuditLogDashboard({ logs }: AuditLogDashboardProps) {
  const stats = getAuditStats(logs)
  
  // 過去30日のログのみ
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentLogs = logs.filter(log => new Date(log.timestamp) >= thirtyDaysAgo)
  const recentStats = getAuditStats(recentLogs)
  
  // 日別ログ数を計算
  const dailyLogs = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyLogs.set(dateStr, 0)
  }
  
  recentLogs.forEach(log => {
    const dateStr = log.timestamp.split('T')[0]
    if (dailyLogs.has(dateStr)) {
      dailyLogs.set(dateStr, (dailyLogs.get(dateStr) || 0) + 1)
    }
  })
  
  const maxDailyCount = Math.max(...Array.from(dailyLogs.values()))
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 総ログ数 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-xs text-gray-500">過去30日</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{recentStats.total}件</p>
        <p className="text-sm text-gray-600 mt-1">総ログ数</p>
        
        {/* ミニチャート */}
        <div className="mt-3 flex items-end space-x-0.5 h-8">
          {Array.from(dailyLogs.entries()).slice(-7).map(([date, count]) => (
            <div
              key={date}
              className="flex-1 bg-blue-200 hover:bg-blue-300 transition-colors rounded-t"
              style={{ height: `${(count / maxDailyCount) * 100}%` }}
              title={`${date}: ${count}件`}
            />
          ))}
        </div>
      </div>
      
      {/* 操作成功率 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-xs font-medium text-red-600">
            失敗 {recentStats.failure}件
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{recentStats.successRate.toFixed(1)}%</p>
        <p className="text-sm text-gray-600 mt-1">操作成功率</p>
        
        {/* プログレスバー */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${recentStats.successRate}%` }}
          />
        </div>
      </div>
      
      {/* 認証失敗回数 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          {recentStats.authFailures > 0 && (
            <span className="text-xs font-medium text-red-600 animate-pulse">
              要確認
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{recentStats.authFailures}件</p>
        <p className="text-sm text-gray-600 mt-1">認証失敗回数</p>
        
        {/* IPアドレスリスト（あれば） */}
        {recentStats.authFailures > 0 && (
          <p className="text-xs text-red-600 mt-2">
            IPログイン失敗含む
          </p>
        )}
      </div>
      
      {/* 書き換え操作割合 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Edit className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex space-x-1">
            <Activity className="h-4 w-4 text-gray-400" />
            <Download className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{recentStats.writeRatio.toFixed(1)}%</p>
        <p className="text-sm text-gray-600 mt-1">書き換え操作割合</p>
        
        {/* 操作種別内訳 */}
        <div className="mt-2 flex items-center space-x-2 text-xs">
          <span className="text-gray-500">更新/削除</span>
          <span className="font-medium">{recentStats.writeOperations}件</span>
        </div>
      </div>
      
      {/* 操作タイプ別頻度グラフ */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:col-span-2 lg:col-span-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">操作タイプ別頻度</h3>
        <div className="space-y-2">
          {Object.entries(recentStats.actionCounts).map(([action, count]) => {
            const percentage = recentStats.total > 0 ? (count / recentStats.total) * 100 : 0
            return (
              <div key={action} className="flex items-center">
                <span className="text-sm text-gray-600 w-24">{getActionLabel(action)}</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${getActionColor(action)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getActionLabel(action: string) {
  const labels: Record<string, string> = {
    update: '更新',
    delete: '削除',
    create: '作成',
    view: '閲覧',
    export: 'エクスポート',
    login: 'ログイン',
    logout: 'ログアウト'
  }
  return labels[action] || action
}

function getActionColor(action: string) {
  const colors: Record<string, string> = {
    update: 'bg-blue-500',
    delete: 'bg-red-500',
    create: 'bg-green-500',
    view: 'bg-gray-400',
    export: 'bg-purple-500',
    login: 'bg-indigo-500',
    logout: 'bg-gray-300'
  }
  return colors[action] || 'bg-gray-400'
}