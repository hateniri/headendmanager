'use client'

import dynamic from 'next/dynamic'
import FacilityDetailPanel from '@/components/panels/FacilityDetailPanel'

// Mapboxは動的インポート（SSR無効化）
const FacilityMap = dynamic(
  () => import('@/components/map/FacilityMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">地図を読み込んでいます...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return (
    <main className="h-screen relative">
      <div className="absolute inset-0">
        <FacilityMap />
      </div>
      
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">インフラ設備統合管理システム</h1>
          <p className="text-sm text-gray-600">全国92施設の監視・管理ダッシュボード</p>
        </div>
      </div>

      {/* 詳細パネル */}
      <FacilityDetailPanel />
    </main>
  )
}