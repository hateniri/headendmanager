'use client'

import { useState, useEffect } from 'react'

export interface FacilityMetrics {
  // 基本統計
  totalAssets: number
  assetsNormal: number
  assetsWarning: number
  assetsCritical: number
  assetsOffline: number
  
  // 寿命・償却情報
  assetsNearEndOfLife: number // 1年以内に交換予定
  assetsDepreciated: number // 償却済み
  averageAssetAge: number // 平均設置年数
  totalBookValue: number // 総帳簿価額
  
  // 電力・環境
  totalPowerConsumption: number // 総消費電力（kW）
  monthlyPowerCost: number // 月間電気料金
  monthlyC02Emission: number // 月間CO₂排出量（kg）
  averageTemperature: number // 平均温度
  temperatureAlerts: number // 温度異常機器数
  
  // 点検・保守
  overDueInspections: number // 点検期限超過
  pendingRepairs: number // 修理待ち
  maintenanceThisMonth: number // 今月の保守件数
  lastInspectionDate?: string // 最終点検日
  
  // カテゴリ別統計
  categoryBreakdown: {
    category: string
    count: number
    normalCount: number
    issueCount: number
    powerConsumption: number
  }[]
  
  // ラック使用率
  rackUtilization: {
    rackId: string
    rackName: string
    usedSlots: number
    totalSlots: number
    utilizationRate: number
    powerUsage: number
    powerCapacity: number
    avgTemperature: number
    status: 'normal' | 'warning' | 'critical'
  }[]
  
  // トレンド情報（過去30日）
  trends: {
    powerConsumptionTrend: number // 消費電力増減率（%）
    temperatureTrend: number // 温度変化傾向
    failureRate: number // 故障率（%）
    inspectionCompliance: number // 点検実施率（%）
  }
}

export function useFacilityMetrics(facilityId: string) {
  const [metrics, setMetrics] = useState<FacilityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // リアルタイム更新用の状態
  const [realTimeData, setRealTimeData] = useState<{
    temperature: number
    powerConsumption: number
    onlineDevices: number
  } | null>(null)

  useEffect(() => {
    fetchMetrics()
    
    // 5分ごとに自動更新
    const interval = setInterval(fetchMetrics, 300000)
    
    // リアルタイムデータは30秒ごと
    const realTimeInterval = setInterval(fetchRealTimeData, 30000)
    
    return () => {
      clearInterval(interval)
      clearInterval(realTimeInterval)
    }
  }, [facilityId])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 実際の実装ではAPIを呼び出し
      // const response = await fetch(`/api/facilities/${facilityId}/metrics`)
      // const data = await response.json()
      
      // ダミーデータ生成
      const mockMetrics = generateMockMetrics(facilityId)
      
      setMetrics(mockMetrics)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メトリクス取得エラー')
    } finally {
      setLoading(false)
    }
  }

  const fetchRealTimeData = async () => {
    try {
      // リアルタイムデータの取得（温度、電力、オンライン機器数）
      const mockRealTime = {
        temperature: 23.5 + (Math.random() - 0.5) * 2,
        powerConsumption: 8.5 + (Math.random() - 0.5) * 1,
        onlineDevices: Math.floor(Math.random() * 2) === 0 ? 15 : 16
      }
      
      setRealTimeData(mockRealTime)
    } catch (err) {
      console.error('リアルタイムデータ取得エラー:', err)
    }
  }

  const refreshMetrics = () => {
    fetchMetrics()
  }

  const calculateEfficiencyScore = () => {
    if (!metrics) return 0
    
    // 効率スコア計算（0-100）
    const factors = [
      // 正常稼働率
      (metrics.assetsNormal / metrics.totalAssets) * 30,
      // 点検実施率
      metrics.trends.inspectionCompliance * 0.25,
      // 電力効率（基準値との比較）
      Math.max(0, (100 - metrics.trends.powerConsumptionTrend) * 0.2),
      // 故障率の低さ
      Math.max(0, (100 - metrics.trends.failureRate * 10) * 0.25)
    ]
    
    return Math.round(factors.reduce((sum, factor) => sum + factor, 0))
  }

  const getHealthStatus = (): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (!metrics) return 'fair'
    
    const score = calculateEfficiencyScore()
    if (score >= 90) return 'excellent'
    if (score >= 75) return 'good'  
    if (score >= 60) return 'fair'
    return 'poor'
  }

  const getCriticalIssues = () => {
    if (!metrics) return []
    
    const issues = []
    
    if (metrics.assetsCritical > 0) {
      issues.push(`${metrics.assetsCritical}台の機器に異常あり`)
    }
    
    if (metrics.overDueInspections > 0) {
      issues.push(`${metrics.overDueInspections}台の点検期限超過`)
    }
    
    if (metrics.assetsNearEndOfLife > 0) {
      issues.push(`${metrics.assetsNearEndOfLife}台が交換時期`)
    }
    
    if (metrics.temperatureAlerts > 0) {
      issues.push(`${metrics.temperatureAlerts}台で温度異常`)
    }
    
    return issues
  }

  return {
    metrics,
    realTimeData,
    loading,
    error,
    lastUpdated,
    refreshMetrics,
    calculateEfficiencyScore,
    getHealthStatus,
    getCriticalIssues
  }
}

// ダミーデータ生成関数
function generateMockMetrics(facilityId: string): FacilityMetrics {
  const baseCount = Math.floor(Math.random() * 10) + 15 // 15-25台
  
  return {
    totalAssets: baseCount,
    assetsNormal: Math.floor(baseCount * 0.8),
    assetsWarning: Math.floor(baseCount * 0.15),
    assetsCritical: Math.floor(baseCount * 0.05),
    assetsOffline: 0,
    
    assetsNearEndOfLife: Math.floor(baseCount * 0.1),
    assetsDepreciated: Math.floor(baseCount * 0.3),
    averageAssetAge: 3.2,
    totalBookValue: Math.floor(Math.random() * 50000000) + 20000000,
    
    totalPowerConsumption: 8.5 + Math.random() * 5,
    monthlyPowerCost: Math.floor(Math.random() * 200000) + 150000,
    monthlyC02Emission: 646.8 + Math.random() * 100,
    averageTemperature: 23.5 + Math.random() * 3,
    temperatureAlerts: Math.floor(Math.random() * 3),
    
    overDueInspections: Math.floor(Math.random() * 5),
    pendingRepairs: Math.floor(Math.random() * 3),
    maintenanceThisMonth: Math.floor(Math.random() * 8) + 2,
    lastInspectionDate: '2025-01-25',
    
    categoryBreakdown: [
      {
        category: '映像処理機器',
        count: Math.floor(baseCount * 0.4),
        normalCount: Math.floor(baseCount * 0.35),
        issueCount: Math.floor(baseCount * 0.05),
        powerConsumption: 2.1
      },
      {
        category: '通信系装置',
        count: Math.floor(baseCount * 0.3),
        normalCount: Math.floor(baseCount * 0.25),
        issueCount: Math.floor(baseCount * 0.05),
        powerConsumption: 3.2
      },
      {
        category: 'ネットワーク機器',
        count: Math.floor(baseCount * 0.2),
        normalCount: Math.floor(baseCount * 0.18),
        issueCount: Math.floor(baseCount * 0.02),
        powerConsumption: 1.8
      },
      {
        category: '電源系統',
        count: Math.floor(baseCount * 0.1),
        normalCount: Math.floor(baseCount * 0.08),
        issueCount: Math.floor(baseCount * 0.02),
        powerConsumption: 1.4
      }
    ],
    
    rackUtilization: [
      {
        rackId: 'RACK-A01',
        rackName: 'ラック A-01',
        usedSlots: 18,
        totalSlots: 42,
        utilizationRate: 42.9,
        powerUsage: 8.5,
        powerCapacity: 15.0,
        avgTemperature: 24.2,
        status: 'warning'
      },
      {
        rackId: 'RACK-A02',
        rackName: 'ラック A-02',
        usedSlots: 12,
        totalSlots: 42,
        utilizationRate: 28.6,
        powerUsage: 6.2,
        powerCapacity: 15.0,
        avgTemperature: 23.8,
        status: 'normal'
      }
    ],
    
    trends: {
      powerConsumptionTrend: -3.2, // 3.2%減少
      temperatureTrend: 0.8, // 0.8度上昇
      failureRate: 2.1, // 2.1%
      inspectionCompliance: 94.5 // 94.5%
    }
  }
}