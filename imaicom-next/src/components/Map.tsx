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

  return (
    <div className="relative w-full h-full bg-blue-50 overflow-hidden">
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
        <svg viewBox="0 0 354.04 410.55" className="absolute inset-0 w-full h-full">
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
        </svg>
      </div>

      {/* 施設情報ポップアップ */}
      {selectedFacility && (
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