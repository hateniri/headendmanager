'use client'

import { Asset, calculateDepreciationSchedule } from '@/data/assets'
import { X, Package, Calendar, Building, DollarSign, FileText, AlertTriangle, Download } from 'lucide-react'

interface AssetDetailPanelProps {
  asset: Asset | null
  onClose: () => void
}

export default function AssetDetailPanel({ asset, onClose }: AssetDetailPanelProps) {
  if (!asset) return null
  
  const depreciationSchedule = calculateDepreciationSchedule(asset)
  const currentYear = new Date().getFullYear()
  const yearsInService = currentYear - new Date(asset.acquisitionDate).getFullYear()
  const depreciationProgress = Math.min((yearsInService / asset.usefulLife) * 100, 100)
  
  const depreciationMethodLabels = {
    'straight-line': '定額法',
    'declining-balance': '定率法',
    'lump-sum': '一括償却'
  }
  
  const assetTypeLabels = {
    owned: '自社資産',
    leased: 'リース',
    'construction-in-progress': '工事仮勘定'
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">資産詳細情報</h2>
            <p className="text-sm text-gray-600">{asset.assetId} - {asset.name}</p>
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
            {/* 基本情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-gray-600" />
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">資産ID</p>
                  <p className="font-medium">{asset.assetId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">会計ID</p>
                  <p className="font-medium">{asset.accountingId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">機器名</p>
                  <p className="font-medium">{asset.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">型番</p>
                  <p className="font-medium">{asset.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">資産区分</p>
                  <p className="font-medium">{assetTypeLabels[asset.assetType]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">備考</p>
                  <p className="font-medium">{asset.notes || '-'}</p>
                </div>
              </div>
            </div>
            
            {/* 設置情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                設置情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">拠点ID</p>
                  <p className="font-medium">{asset.facilityId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ラックID</p>
                  <p className="font-medium">{asset.rackId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">設置日</p>
                  <p className="font-medium">{asset.installationDate || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">設置担当者</p>
                  <p className="font-medium">{asset.installer || '-'}</p>
                </div>
              </div>
            </div>
            
            {/* 会計情報 */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                会計情報
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600">取得年月</p>
                  <p className="font-medium">{asset.acquisitionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">購入額</p>
                  <p className="font-medium">¥{asset.purchaseAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">耐用年数</p>
                  <p className="font-medium">{asset.usefulLife}年</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">償却方法</p>
                  <p className="font-medium">{depreciationMethodLabels[asset.depreciationMethod]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">累計償却額</p>
                  <p className="font-medium">¥{asset.accumulatedDepreciation.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">帳簿価額</p>
                  <p className="font-medium text-blue-600">¥{asset.bookValue.toLocaleString()}</p>
                </div>
              </div>
              
              {/* 償却進捗 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">償却進捗</span>
                  <span className="font-medium">{depreciationProgress.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${depreciationProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>取得: {new Date(asset.acquisitionDate).getFullYear()}年</span>
                  <span>償却終了: {new Date(asset.depreciationEndDate).getFullYear()}年</span>
                </div>
              </div>
            </div>
            
            {/* 償却スケジュール */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                償却スケジュール
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">年度</th>
                      <th className="text-right py-2">償却額</th>
                      <th className="text-right py-2">累計償却額</th>
                      <th className="text-right py-2">帳簿価額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depreciationSchedule.map((schedule, index) => (
                      <tr key={schedule.year} className={schedule.year === currentYear ? 'bg-blue-50' : ''}>
                        <td className="py-2">{schedule.year}年</td>
                        <td className="text-right py-2">¥{schedule.amount.toLocaleString()}</td>
                        <td className="text-right py-2">¥{schedule.accumulatedAmount.toLocaleString()}</td>
                        <td className="text-right py-2">¥{schedule.bookValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* アクション */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                {asset.assetLifecycleStatus === 'needs-replacement' && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-medium">耐用年数超過 - 更新推奨</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`${asset.name}を更新候補として登録しました。承認プロセスが開始されます。`)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  更新候補に登録
                </button>
                <button 
                  onClick={() => {
                    const csvContent = `資産ID,資産名,型番,取得日,購入額,帳簿価額,償却状況\n"${asset.assetId}","${asset.name}","${asset.model}","${asset.acquisitionDate}","${asset.purchaseAmount.toLocaleString()}","${asset.bookValue.toLocaleString()}","${asset.assetLifecycleStatus}"`
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = `${asset.assetId}_詳細情報.csv`
                    link.click()
                  }}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  詳細CSV出力
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}