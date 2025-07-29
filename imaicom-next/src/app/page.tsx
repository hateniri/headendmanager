'use client'

import Map from '@/components/Map'
import FacilityList from '@/components/FacilityList'
import { mockFacilities } from '@/data/facilities'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            ヘッドエンド管理システム
          </h1>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* 左側：地図 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">施設マップ</h2>
            </div>
            <div className="h-[calc(100%-65px)]">
              <Map facilities={mockFacilities} />
            </div>
          </div>
          
          {/* 右側：リスト */}
          <div className="h-full overflow-hidden">
            <FacilityList facilities={mockFacilities} />
          </div>
        </div>
      </main>
    </div>
  )
}