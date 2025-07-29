'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import AssetDashboard from '@/components/AssetDashboard'
import AssetTable from '@/components/AssetTable'
import AssetDetailPanel from '@/components/AssetDetailPanel'
import AssetReports from '@/components/AssetReports'
import { mockAssets } from '@/data/assets'
import { Asset } from '@/data/assets'

export default function CMDBPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  
  return (
    <ProtectedRoute requiredPermission="manage_assets">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">資産管理システム</h1>
          <p className="text-gray-600 mt-1">設備資産の取得・減価償却・帳簿価額を一元管理</p>
        </div>
        
        <div className="space-y-6">
          {/* ダッシュボード */}
          <AssetDashboard assets={mockAssets} />
          
          {/* 資産一覧テーブル */}
          <AssetTable 
            assets={mockAssets} 
            onSelectAsset={setSelectedAsset}
          />
          
          {/* 帳票・出力セクション */}
          <AssetReports assets={mockAssets} />
        </div>
        
        {/* 資産詳細パネル */}
        <AssetDetailPanel 
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      </main>
      </div>
    </ProtectedRoute>
  )
}