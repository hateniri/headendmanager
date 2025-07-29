'use client'

import { useEffect, useState } from 'react'
import { Package, AlertTriangle, Calendar, DollarSign, TrendingDown, PieChart, BarChart3, Activity } from 'lucide-react'
import { Asset, getAssetSummary } from '@/data/assets'

interface AssetDashboardProps {
  assets: Asset[]
}

export default function AssetDashboard({ assets }: AssetDashboardProps) {
  const [summary, setSummary] = useState(getAssetSummary(assets))
  
  useEffect(() => {
    setSummary(getAssetSummary(assets))
  }, [assets])
  
  const stats = [
    {
      title: '登録資産数',
      value: summary.totalAssets.toLocaleString(),
      unit: '台',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '更新推奨件数',
      value: summary.needsReplacement.toLocaleString(),
      unit: '件',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: '償却終了予定',
      value: summary.currentYearDepreciation.toLocaleString(),
      unit: '件',
      subtitle: '2025年度',
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: '総取得金額',
      value: `¥${(summary.totalAcquisitionCost / 1000000).toFixed(1)}`,
      unit: '百万',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '総帳簿価額',
      value: `¥${(summary.totalBookValue / 1000000).toFixed(1)}`,
      unit: '百万',
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]
  
  // 状態別の資産数
  const statusCounts = {
    normal: assets.filter(a => a.assetLifecycleStatus === 'in-service').length,
    needsReplacement: assets.filter(a => a.assetLifecycleStatus === 'needs-replacement').length,
    scheduledDisposal: assets.filter(a => a.assetLifecycleStatus === 'scheduled-disposal').length,
  }
  
  // 年度別償却終了数（次の5年間）
  const currentYear = new Date().getFullYear()
  const depreciationData = []
  for (let i = 0; i < 5; i++) {
    const year = currentYear + i
    depreciationData.push({
      year,
      count: summary.depreciationByYear[year] || 0
    })
  }
  
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
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 状態別比率 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-900">状態別資産比率</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">正常</span>
              </div>
              <span className="text-sm font-medium">{statusCounts.normal}台 ({Math.round(statusCounts.normal / summary.totalAssets * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">更新予定</span>
              </div>
              <span className="text-sm font-medium">{statusCounts.scheduledDisposal}台 ({Math.round(statusCounts.scheduledDisposal / summary.totalAssets * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">要更新</span>
              </div>
              <span className="text-sm font-medium">{statusCounts.needsReplacement}台 ({Math.round(statusCounts.needsReplacement / summary.totalAssets * 100)}%)</span>
            </div>
          </div>
          {/* 簡易円グラフ */}
          <div className="mt-4 h-40 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="16" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="16"
                  strokeDasharray={`${statusCounts.normal / summary.totalAssets * 352} 352`}
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="16"
                  strokeDasharray={`${statusCounts.scheduledDisposal / summary.totalAssets * 352} 352`}
                  strokeDashoffset={`-${statusCounts.normal / summary.totalAssets * 352}`}
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="16"
                  strokeDasharray={`${statusCounts.needsReplacement / summary.totalAssets * 352} 352`}
                  strokeDashoffset={`-${(statusCounts.normal + statusCounts.scheduledDisposal) / summary.totalAssets * 352}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{summary.totalAssets}</p>
                  <p className="text-xs text-gray-500">総資産</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 年度別償却終了台数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="font-medium text-gray-900">年度別償却終了予定</h3>
          </div>
          <div className="space-y-2">
            {depreciationData.map((data) => (
              <div key={data.year}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{data.year}年度</span>
                  <span className="font-medium">{data.count}台</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((data.count / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 設備価値推移 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="font-medium text-gray-900">設備価値推移</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">取得価額</span>
                <span className="font-medium">¥{(summary.totalAcquisitionCost / 1000000).toFixed(1)}百万</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">現在簿価</span>
                <span className="font-medium">¥{(summary.totalBookValue / 1000000).toFixed(1)}百万</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(summary.totalBookValue / summary.totalAcquisitionCost) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">減価償却率</span>
                <span className="text-lg font-bold text-gray-900">
                  {(((summary.totalAcquisitionCost - summary.totalBookValue) / summary.totalAcquisitionCost) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}