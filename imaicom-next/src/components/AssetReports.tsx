'use client'

import { FileSpreadsheet, FileText, Download, FileBarChart, Calendar, ExternalLink } from 'lucide-react'
import { Asset } from '@/data/assets'
import { useAuth } from '@/contexts/AuthContext'

// CSV生成関数
function generateAssetListCSV(assets: Asset[]): string {
  const headers = ['資産ID', '資産名', '型番', '拠点ID', '取得日', '購入額', '帳簿価額', '償却方法', 'ステータス']
  const rows = assets.map(asset => [
    asset.assetId,
    asset.name,
    asset.model,
    asset.facilityId,
    asset.acquisitionDate,
    asset.purchaseAmount.toLocaleString(),
    asset.bookValue.toLocaleString(),
    asset.depreciationMethod === 'straight-line' ? '定額法' : asset.depreciationMethod === 'declining-balance' ? '定率法' : '一括償却',
    asset.assetLifecycleStatus === 'in-service' ? '稼働中' : asset.assetLifecycleStatus === 'needs-replacement' ? '要更新' : '廃棄予定'
  ])
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

function generateDepreciationLedgerCSV(assets: Asset[]): string {
  const currentYear = new Date().getFullYear()
  const depreciatedAssets = assets.filter(asset => {
    const acquisitionYear = new Date(asset.acquisitionDate).getFullYear()
    return acquisitionYear + asset.usefulLife <= currentYear
  })
  
  const headers = ['資産ID', '資産名', '取得年', '償却完了年', '取得価額', '累計償却額', '残存価額']
  const rows = depreciatedAssets.map(asset => [
    asset.assetId,
    asset.name,
    new Date(asset.acquisitionDate).getFullYear(),
    new Date(asset.depreciationEndDate).getFullYear(),
    asset.purchaseAmount.toLocaleString(),
    asset.accumulatedDepreciation.toLocaleString(),
    asset.bookValue.toLocaleString()
  ])
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

function generateReplacementListCSV(assets: Asset[]): string {
  const replacementAssets = assets.filter(asset => asset.assetLifecycleStatus === 'needs-replacement' || asset.assetLifecycleStatus === 'scheduled-disposal')
  
  const headers = ['資産ID', '資産名', '型番', '拠点ID', '取得日', '経過年数', '更新推奨理由']
  const rows = replacementAssets.map(asset => {
    const currentYear = new Date().getFullYear()
    const acquisitionYear = new Date(asset.acquisitionDate).getFullYear()
    const age = currentYear - acquisitionYear
    return [
      asset.assetId,
      asset.name,
      asset.model,
      asset.facilityId,
      asset.acquisitionDate,
      age,
      asset.assetLifecycleStatus === 'needs-replacement' ? '耐用年数超過' : '廃棄予定'
    ]
  })
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

function generateMediumTermPlanReport(assets: Asset[]): string {
  const currentYear = new Date().getFullYear()
  const planYears = [currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5]
  
  let report = `中期設備更新計画書\n作成日: ${new Date().toLocaleDateString('ja-JP')}\n\n`
  
  planYears.forEach(year => {
    const yearAssets = assets.filter(asset => {
      const acquisitionYear = new Date(asset.acquisitionDate).getFullYear()
      return acquisitionYear + asset.usefulLife === year
    })
    
    if (yearAssets.length > 0) {
      report += `${year}年度更新予定（${yearAssets.length}件）\n`
      yearAssets.forEach(asset => {
        report += `  - ${asset.name} (${asset.assetId}): ${asset.purchaseAmount.toLocaleString()}円\n`
      })
      const totalCost = yearAssets.reduce((sum, asset) => sum + asset.purchaseAmount, 0)
      report += `  年度合計: ${totalCost.toLocaleString()}円\n\n`
    }
  })
  
  return report
}

interface AssetReportsProps {
  assets: Asset[]
}

export default function AssetReports({ assets }: AssetReportsProps) {
  const { hasPermission } = useAuth()
  const reports = [
    {
      title: '資産一覧',
      description: '全資産の詳細情報を含む一覧表',
      format: 'CSV / PDF',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => {
        const csvContent = generateAssetListCSV(assets)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `資産一覧_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
      }
    },
    {
      title: '償却台帳',
      description: '今期終了資産の償却明細',
      format: 'CSV / PDF',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => {
        const csvContent = generateDepreciationLedgerCSV(assets)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `償却台帳_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
      }
    },
    {
      title: '更新対象リスト',
      description: '耐用年数超過・更新推奨資産',
      format: 'CSV',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => {
        const csvContent = generateReplacementListCSV(assets)
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `更新対象リスト_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
      }
    },
    {
      title: '中期設備更新レポート',
      description: '5年分の設備入替計画書',
      format: 'PDF',
      icon: FileBarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => {
        const reportContent = generateMediumTermPlanReport(assets)
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `中期設備更新計画_${new Date().toISOString().split('T')[0]}.txt`
        link.click()
      }
    }
  ]
  
  const integrations = [
    {
      title: '固定資産管理ソフト連携',
      description: 'CSV形式でのデータ同期',
      status: '利用可能',
      icon: FileSpreadsheet
    },
    {
      title: 'ERP/会計システム連携',
      description: 'API経由での自動連携',
      status: '構想段階',
      icon: ExternalLink
    }
  ]
  
  // 集計情報
  const currentYear = new Date().getFullYear()
  const currentYearAssets = assets.filter(a => 
    new Date(a.depreciationEndDate).getFullYear() === currentYear
  )
  const needsReplacementAssets = assets.filter(a => 
    a.assetLifecycleStatus === 'needs-replacement' || a.assetLifecycleStatus === 'scheduled-disposal'
  )
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">帳票・出力</h2>
      
      {/* レポート出力 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reports.map((report, index) => {
          const Icon = report.icon
          return (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={`${report.bgColor} rounded-lg p-3 inline-flex mb-3`}>
                <Icon className={`h-6 w-6 ${report.color}`} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
              <p className="text-xs text-gray-500 mb-3">形式: {report.format}</p>
              {hasPermission('export_data') ? (
                <button
                  onClick={report.action}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Download className="h-4 w-4 mr-1" />
                  ダウンロード
                </button>
              ) : (
                <p className="text-xs text-gray-400">エクスポート権限が必要です</p>
              )}
            </div>
          )
        })}
      </div>
      
      {/* 外部連携 */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">外部システム連携</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => {
            const Icon = integration.icon
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-lg p-2 mr-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{integration.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      integration.status === '利用可能' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* クイック統計 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">出力対象サマリー</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">総資産数</p>
            <p className="font-medium text-lg">{assets.length}件</p>
          </div>
          <div>
            <p className="text-gray-600">今期償却終了</p>
            <p className="font-medium text-lg">{currentYearAssets.length}件</p>
          </div>
          <div>
            <p className="text-gray-600">更新対象</p>
            <p className="font-medium text-lg text-orange-600">{needsReplacementAssets.length}件</p>
          </div>
        </div>
      </div>
    </div>
  )
}