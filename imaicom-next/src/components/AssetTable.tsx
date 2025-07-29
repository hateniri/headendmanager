'use client'

import { useState } from 'react'
import { Asset } from '@/data/assets'
import { ChevronDown, ChevronUp, Search, Filter, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface AssetTableProps {
  assets: Asset[]
  onSelectAsset: (asset: Asset) => void
}

export default function AssetTable({ assets, onSelectAsset }: AssetTableProps) {
  const [sortField, setSortField] = useState<keyof Asset>('assetId')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all')
  
  // フィルタリング
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || asset.assetLifecycleStatus === statusFilter
    const matchesType = assetTypeFilter === 'all' || asset.assetType === assetTypeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })
  
  // ソート
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })
  
  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }
  
  const statusConfig = {
    'new': { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: '新規' },
    'in-service': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: '稼働中' },
    'needs-replacement': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: '要更新' },
    'scheduled-disposal': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '更新予定' },
    'disposed': { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50', label: '廃棄済' }
  }
  
  const assetTypeLabels = {
    owned: '自社資産',
    leased: 'リース',
    'construction-in-progress': '工事仮勘定'
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* フィルターセクション */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="資産ID、機器名、型番で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全ステータス</option>
              <option value="normal">正常</option>
              <option value="needs-replacement">要更新</option>
              <option value="scheduled-disposal">更新予定</option>
            </select>
            
            <select
              value={assetTypeFilter}
              onChange={(e) => setAssetTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全資産区分</option>
              <option value="owned">自社資産</option>
              <option value="leased">リース</option>
              <option value="construction-in-progress">工事仮勘定</option>
            </select>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          {filteredAssets.length}件の資産を表示中
        </div>
      </div>
      
      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assetId')}
                  className="flex items-center text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                >
                  資産ID
                  {sortField === 'assetId' && (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                機器名・型番
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                拠点/ラック
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('purchaseAmount')}
                  className="flex items-center text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                >
                  取得額
                  {sortField === 'purchaseAmount' && (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                耐用年数
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('bookValue')}
                  className="flex items-center text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                >
                  帳簿価額
                  {sortField === 'bookValue' && (
                    sortOrder === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                償却終了
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                資産区分
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAssets.map((asset) => {
              const status = statusConfig[asset.assetLifecycleStatus]
              const StatusIcon = status.icon
              const depreciationRate = ((asset.purchaseAmount - asset.bookValue) / asset.purchaseAmount * 100).toFixed(1)
              
              return (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {asset.assetId}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{asset.name}</p>
                      <p className="text-gray-500">{asset.model}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {asset.facilityId} / {asset.rackId}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">¥{asset.purchaseAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{asset.acquisitionDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {asset.usefulLife}年
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">¥{asset.bookValue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">償却率 {depreciationRate}%</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(asset.depreciationEndDate).getFullYear()}年3月
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {assetTypeLabels[asset.assetType]}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {sortedAssets.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          該当する資産が見つかりません
        </div>
      )}
    </div>
  )
}