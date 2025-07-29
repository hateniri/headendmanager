'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Leaf, 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Award,
  AlertCircle,
  BarChart3
} from 'lucide-react'

interface ESGMetrics {
  monthlyPowerConsumption: number
  monthlyCO2Emission: number
  pue: number
  coolingEfficiency: number
  renewableEnergyRatio: number
  co2ReductionTarget: number
  co2ReductionProgress: number
  temperatureOptimization: number
}

// ダミーデータ - 実際のデータソースに置き換え可能
const currentMetrics: ESGMetrics = {
  monthlyPowerConsumption: 1247.8, // kWh
  monthlyCO2Emission: 646.8, // kg (0.518 kg-CO₂/kWh)
  pue: 1.62,
  coolingEfficiency: 85.3,
  renewableEnergyRatio: 23.5,
  co2ReductionTarget: 20, // %
  co2ReductionProgress: 12.8, // %
  temperatureOptimization: 78.9
}

const lastMonthMetrics: ESGMetrics = {
  monthlyPowerConsumption: 1298.4,
  monthlyCO2Emission: 672.6,
  pue: 1.68,
  coolingEfficiency: 82.1,
  renewableEnergyRatio: 21.2,
  co2ReductionTarget: 20,
  co2ReductionProgress: 10.5,
  temperatureOptimization: 75.4
}

export default function ESGDashboard() {
  const [animatedMetrics, setAnimatedMetrics] = useState<ESGMetrics>(currentMetrics)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // メトリクスアニメーション
    const timer = setTimeout(() => {
      setAnimatedMetrics(currentMetrics)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const calculateTrend = (current: number, previous: number) => {
    const trend = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(trend).toFixed(1),
      isPositive: trend >= 0,
      isImprovement: current < previous // 消費電力やCO₂では減少が改善
    }
  }

  const getEfficiencyColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400'
    if (value >= threshold * 0.8) return 'text-yellow-400'
    return 'text-red-400'
  }

  const powerTrend = calculateTrend(currentMetrics.monthlyPowerConsumption, lastMonthMetrics.monthlyPowerConsumption)
  const co2Trend = calculateTrend(currentMetrics.monthlyCO2Emission, lastMonthMetrics.monthlyCO2Emission)
  const pueTrend = calculateTrend(currentMetrics.pue, lastMonthMetrics.pue)

  return (
    <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* ESGメインメトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 月間消費電力 */}
        <div className="power-metric metrics-card card-3d tooltip" data-tooltip="前月比較とトレンド表示">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="status-dot normal"></div>
              <span className="text-sm font-medium opacity-90">月間消費電力</span>
            </div>
            <Zap className="h-5 w-5 opacity-75" />
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl font-bold">
              {animatedMetrics.monthlyPowerConsumption.toLocaleString()} kWh
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {powerTrend.isImprovement ? (
                <TrendingDown className="h-4 w-4 text-green-200" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-200" />
              )}
              <span className={powerTrend.isImprovement ? 'text-green-200' : 'text-red-200'}>
                {powerTrend.percentage}% vs前月
              </span>
            </div>

            {/* 効率指標 */}
            <div className="pt-3 border-t border-white border-opacity-20">
              <div className="flex justify-between text-xs mb-1">
                <span>電力効率</span>
                <span className={getEfficiencyColor(100 - currentMetrics.monthlyPowerConsumption / 15, 80)}>
                  {(100 - currentMetrics.monthlyPowerConsumption / 15).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CO₂排出量 */}
        <div className="eco-metric metrics-card card-3d tooltip" data-tooltip="CO₂排出量と削減目標進捗">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="status-dot normal"></div>
              <span className="text-sm font-medium opacity-90">CO₂排出量</span>
            </div>
            <Leaf className="h-5 w-5 opacity-75" />
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl font-bold">
              {animatedMetrics.monthlyCO2Emission.toFixed(1)} kg
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {co2Trend.isImprovement ? (
                <TrendingDown className="h-4 w-4 text-green-200" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-200" />
              )}
              <span className={co2Trend.isImprovement ? 'text-green-200' : 'text-red-200'}>
                {co2Trend.percentage}% vs前月
              </span>
            </div>

            {/* 削減目標進捗 */}
            <div className="pt-3 border-t border-white border-opacity-20">
              <div className="flex justify-between text-xs mb-1">
                <span>削減目標進捗</span>
                <span>{currentMetrics.co2ReductionProgress}% / {currentMetrics.co2ReductionTarget}%</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-1000"
                  style={{ width: `${(currentMetrics.co2ReductionProgress / currentMetrics.co2ReductionTarget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* PUE（電力使用効率） */}
        <div className="temperature-metric metrics-card card-3d tooltip" data-tooltip="Power Usage Effectiveness - 理想値は1.0に近い">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`status-dot ${currentMetrics.pue <= 1.5 ? 'normal' : currentMetrics.pue <= 1.8 ? 'warning' : 'critical'}`}></div>
              <span className="text-sm font-medium opacity-90">PUE</span>
            </div>
            <BarChart3 className="h-5 w-5 opacity-75" />
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl font-bold">
              {animatedMetrics.pue.toFixed(2)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {pueTrend.isImprovement ? (
                <TrendingDown className="h-4 w-4 text-green-200" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-200" />
              )}
              <span className={pueTrend.isImprovement ? 'text-green-200' : 'text-red-200'}>
                {pueTrend.percentage}% vs前月
              </span>
            </div>

            {/* PUE評価 */}
            <div className="pt-3 border-t border-white border-opacity-20">
              <div className="text-xs">
                {currentMetrics.pue <= 1.5 ? (
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>優秀</span>
                  </div>
                ) : currentMetrics.pue <= 1.8 ? (
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>標準</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>要改善</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 冷却効率 */}
        <div className="metrics-card bg-gradient-to-br from-cyan-500 to-blue-600 card-3d tooltip" data-tooltip="空調システムの効率とエアフロー最適化">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`status-dot ${currentMetrics.coolingEfficiency >= 85 ? 'normal' : currentMetrics.coolingEfficiency >= 75 ? 'warning' : 'critical'}`}></div>
              <span className="text-sm font-medium opacity-90">冷却効率</span>
            </div>
            <Thermometer className="h-5 w-5 opacity-75" />
          </div>
          
          <div className="space-y-3">
            <div className="text-2xl font-bold">
              {animatedMetrics.coolingEfficiency.toFixed(1)}%
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-200" />
              <span className="text-green-200">
                +{(currentMetrics.coolingEfficiency - lastMonthMetrics.coolingEfficiency).toFixed(1)}% vs前月
              </span>
            </div>

            {/* 温度最適化 */}
            <div className="pt-3 border-t border-white border-opacity-20">
              <div className="flex justify-between text-xs mb-1">
                <span>温度最適化</span>
                <span>{currentMetrics.temperatureOptimization.toFixed(1)}%</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-1000"
                  style={{ width: `${currentMetrics.temperatureOptimization}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 年間目標と進捗 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO₂削減目標 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">2025年 CO₂削減目標</h3>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">vs 2024年基準</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">目標削減率</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMetrics.co2ReductionTarget}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">現在の進捗</span>
              <span className="text-xl font-semibold text-green-600">{currentMetrics.co2ReductionProgress}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗率</span>
                <span>{((currentMetrics.co2ReductionProgress / currentMetrics.co2ReductionTarget) * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-full h-3 transition-all duration-1000"
                  style={{ width: `${(currentMetrics.co2ReductionProgress / currentMetrics.co2ReductionTarget) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              残り <span className="font-medium">{(currentMetrics.co2ReductionTarget - currentMetrics.co2ReductionProgress).toFixed(1)}%</span> の削減が必要
            </div>
          </div>
        </div>

        {/* 再生可能エネルギー比率 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">再生可能エネルギー導入</h3>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">太陽光・風力</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">現在の比率</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMetrics.renewableEnergyRatio}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">2030年目標</span>
              <span className="text-xl font-semibold text-blue-600">50%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>目標達成率</span>
                <span>{(currentMetrics.renewableEnergyRatio / 50 * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full h-3 transition-all duration-1000"
                  style={{ width: `${currentMetrics.renewableEnergyRatio}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              前月比 <span className="font-medium text-green-600">+{(currentMetrics.renewableEnergyRatio - lastMonthMetrics.renewableEnergyRatio).toFixed(1)}%</span> 向上
            </div>
          </div>
        </div>
      </div>

      {/* ESGアクションアイテム */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">ESG改善アクション</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">高効率機器への更新</h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              償却済みUPS・空調機器の省エネ機器への更新で月間15%の消費電力削減が期待できます。
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">AI最適化導入</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              温度・負荷予測AIによる空調制御で追加5-10%の効率化が可能です。
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">再エネ導入拡大</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              太陽光発電システムの追加導入により2030年目標50%達成を加速します。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}