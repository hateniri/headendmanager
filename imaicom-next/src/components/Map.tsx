'use client'

import { useState, useEffect } from 'react'
import { Facility } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface MapProps {
  facilities: Facility[]
}

export default function Map({ facilities }: MapProps) {
  const router = useRouter()
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [isAddingMode, setIsAddingMode] = useState(false)
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null)

  useEffect(() => {
    // SVGファイルを読み込む
    fetch('/japan-map.svg')
      .then(res => res.text())
      .then(setSvgContent)
  }, [])

  // 緯度経度を地図上の座標に変換（日本地図のSVGに合わせて調整）
  const latLngToXY = (lat: number, lng: number) => {
    // SVGのviewBox: 0 0 354.04 410.55
    // 日本の大まかな範囲: 北緯24-46度、東経123-146度
    const minLng = 123
    const maxLng = 146
    const minLat = 24
    const maxLat = 46
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 354.04
    const y = ((maxLat - lat) / (maxLat - minLat)) * 410.55
    
    return { x, y }
  }

  // SVG座標を緯度経度に変換
  const xyToLatLng = (x: number, y: number) => {
    const minLng = 123
    const maxLng = 146
    const minLat = 24
    const maxLat = 46
    
    const lng = (x / 354.04) * (maxLng - minLng) + minLng
    const lat = maxLat - (y / 410.55) * (maxLat - minLat)
    
    return { lat, lng }
  }

  // 地図クリックハンドラー
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isAddingMode) return

    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const viewBox = svg.viewBox.baseVal
    
    // クリック位置をSVG座標に変換
    const x = (event.clientX - rect.left) / rect.width * viewBox.width
    const y = (event.clientY - rect.top) / rect.height * viewBox.height
    
    // 緯度経度に変換
    const { lat, lng } = xyToLatLng(x, y)
    
    setClickedPosition({ x, y, lat, lng })
  }

  return (
    <div className="relative w-full h-full bg-blue-50 overflow-hidden">
      {/* 追加モード切替ボタン */}
      <button
        onClick={() => {
          setIsAddingMode(!isAddingMode)
          setClickedPosition(null)
        }}
        className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-lg font-medium transition-colors ${
          isAddingMode 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isAddingMode ? '追加モードを終了' : '施設を追加'}
      </button>

      <div className="w-full h-full relative">
        {/* 日本地図SVG */}
        <div 
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            '& svg': {
              width: '100%',
              height: '100%',
              position: 'absolute'
            } as any
          }}
        />
        
        {/* 施設マーカーをオーバーレイ */}
        <svg 
          viewBox="0 0 354.04 410.55" 
          className={`absolute inset-0 w-full h-full ${isAddingMode ? 'cursor-crosshair' : ''}`}
          onClick={handleMapClick}
        >
          {facilities.map((facility) => {
            const { x, y } = latLngToXY(facility.lat, facility.lng)
            const isHovered = hoveredFacility?.id === facility.id
            const isSelected = selectedFacility?.id === facility.id
            
            return (
              <g key={facility.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered || isSelected ? 6 : 4}
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredFacility(facility)}
                  onMouseLeave={() => setHoveredFacility(null)}
                  onClick={() => setSelectedFacility(facility)}
                />
                {isHovered && (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 pointer-events-none"
                    style={{ filter: 'drop-shadow(0 0 3px white)' }}
                  >
                    {facility.name}
                  </text>
                )}
              </g>
            )
          })}
          
          {/* クリック位置のプレビューマーカー */}
          {clickedPosition && (
            <g>
              <circle
                cx={clickedPosition.x}
                cy={clickedPosition.y}
                r={6}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />
              <text
                x={clickedPosition.x}
                y={clickedPosition.y - 10}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-600 pointer-events-none"
                style={{ filter: 'drop-shadow(0 0 3px white)' }}
              >
                新規施設
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 施設追加フォーム */}
      {clickedPosition && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-bold text-lg mb-3">新規施設の追加</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                施設名
              </label>
              <input
                type="text"
                placeholder="例: 東京データセンター"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                住所
              </label>
              <input
                type="text"
                placeholder="例: 東京都千代田区..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  緯度
                </label>
                <input
                  type="text"
                  value={clickedPosition.lat.toFixed(6)}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  経度
                </label>
                <input
                  type="text"
                  value={clickedPosition.lng.toFixed(6)}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  // TODO: 施設を保存する処理
                  alert(`新規施設を追加します\n緯度: ${clickedPosition.lat.toFixed(6)}\n経度: ${clickedPosition.lng.toFixed(6)}`)
                  setClickedPosition(null)
                  setIsAddingMode(false)
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => setClickedPosition(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 施設情報ポップアップ */}
      {selectedFacility && !clickedPosition && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedFacility.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{selectedFacility.address}</p>
          <p className="text-sm text-gray-600 mb-3">
            ステータス: <span className="text-green-600 font-medium">正常稼働中</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/facility/${selectedFacility.id}`)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              詳細を見る
            </button>
            <button
              onClick={() => setSelectedFacility(null)}
              className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}