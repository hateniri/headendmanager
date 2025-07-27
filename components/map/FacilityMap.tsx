'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useFacilityStore } from '@/store/facilityStore'
import { useUIStore } from '@/store/uiStore'
import { Facility } from '@/types'

// Mapboxアクセストークンを設定（本番環境では環境変数を使用）
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN'

export default function FacilityMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  
  const facilities = useFacilityStore((state) => state.facilities)
  const selectFacility = useFacilityStore((state) => state.selectFacility)
  const openPanel = useUIStore((state) => state.openPanel)

  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [136.9066, 36.2048], // 日本の中心座標
      zoom: 5,
    })

    map.current.on('load', () => {
      setIsMapLoaded(true)
      
      // Add navigation controls
      map.current!.addControl(new mapboxgl.NavigationControl(), 'top-right')
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // GeoJSON形式でデータを準備
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: facilities.map((facility) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: facility.coordinates,
        },
        properties: {
          id: facility.id,
          name: facility.name,
          address: facility.address,
        },
      })),
    }

    // ソースが既に存在する場合は削除
    if (map.current.getSource('facilities')) {
      map.current.removeLayer('clusters')
      map.current.removeLayer('cluster-count')
      map.current.removeLayer('unclustered-point')
      map.current.removeSource('facilities')
    }

    // クラスタリング設定を含むソースを追加
    map.current.addSource('facilities', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })

    // クラスタ表示用のレイヤー
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'facilities',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          10,
          '#f1f075',
          30,
          '#f28cb1',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          10,
          30,
          30,
          40,
        ],
      },
    })

    // クラスタ内の数値表示
    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'facilities',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    })

    // 個別の施設ポイント
    map.current.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'facilities',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    })

    // クリックイベント（個別の施設）
    map.current.on('click', 'unclustered-point', (e) => {
      if (!e.features || e.features.length === 0) return
      
      const feature = e.features[0]
      const facilityId = feature.properties?.id
      const facility = facilities.find(f => f.id === facilityId)
      
      if (facility) {
        selectFacility(facility)
        openPanel()
        
        // ポップアップ表示
        new mapboxgl.Popup()
          .setLngLat(feature.geometry.type === 'Point' ? feature.geometry.coordinates as [number, number] : [0, 0])
          .setHTML(`<h3 class="font-bold">${facility.name}</h3><p class="text-sm">${facility.address}</p>`)
          .addTo(map.current!)
      }
    })

    // クリックイベント（クラスタ）
    map.current.on('click', 'clusters', (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      
      if (!features.length) return
      
      const clusterId = features[0].properties?.cluster_id
      const source = map.current!.getSource('facilities') as mapboxgl.GeoJSONSource
      
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return
        
        map.current!.easeTo({
          center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
          zoom: zoom,
        })
      })
    })

    // カーソル変更
    map.current.on('mouseenter', 'clusters', () => {
      map.current!.getCanvas().style.cursor = 'pointer'
    })
    
    map.current.on('mouseleave', 'clusters', () => {
      map.current!.getCanvas().style.cursor = ''
    })
    
    map.current.on('mouseenter', 'unclustered-point', () => {
      map.current!.getCanvas().style.cursor = 'pointer'
    })
    
    map.current.on('mouseleave', 'unclustered-point', () => {
      map.current!.getCanvas().style.cursor = ''
    })

  }, [facilities, isMapLoaded, selectFacility, openPanel])

  return (
    <div ref={mapContainer} className="w-full h-full" />
  )
}