'use client'

import { AlertCircle, Clock, Wrench, ChevronRight, Activity, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AlertStatus() {
  const [animatedCounts, setAnimatedCounts] = useState([0, 0, 0])
  const [isVisible, setIsVisible] = useState(false)

  const alerts = [
    {
      title: '異常拠点',
      count: 4,
      total: 100,
      severity: 'critical',
      icon: AlertCircle,
      link: '/alerts',
      linkText: '異常だけ一覧',
      lastUpdate: '2分前',
      trend: '+1'
    },
    {
      title: '点検期限超過',
      count: 7,
      unit: '拠点',
      severity: 'warning',
      icon: Clock,
      link: '/overdue-inspections',
      linkText: '今月の点検遅延拠点',
      lastUpdate: '15分前',
      trend: '+2'
    },
    {
      title: '修理未対応',
      count: 3,
      unit: '件',
      severity: 'warning',
      icon: Wrench,
      link: '/repair?status=pending',
      linkText: '修理対応状況',
      lastUpdate: '30分前',
      trend: '-1'
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    // 数値アニメーション
    alerts.forEach((alert, index) => {
      let current = 0
      const target = alert.count
      const increment = target / 20
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedCounts(prev => {
          const newCounts = [...prev]
          newCounts[index] = Math.floor(current)
          return newCounts
        })
      }, 75)
    })
  }, [])

  const getAlertSeverityClass = (severity: string, index: number) => {
    const baseClass = "relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg card-3d"
    
    switch (severity) {
      case 'critical':
        return `${baseClass} border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-800`
      case 'warning':
        return `${baseClass} border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-800`
      default:
        return `${baseClass} border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600`
    }
  }

  const getSeverityDot = (severity: string) => {
    return (
      <div className={`status-dot ${severity}`}></div>
    )
  }

  const getSeverityIcon = (severity: string, IconComponent: any) => {
    const iconClass = severity === 'critical' ? 'text-red-600 dark:text-red-400' : 
                     severity === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                     'text-gray-600 dark:text-gray-400'
    
    return <IconComponent className={`h-6 w-6 ${iconClass}`} />
  }

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="h-3 w-3 text-red-500" />
    } else if (trend.startsWith('-')) {
      return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />
    }
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="status-dot critical mr-3"></div>
          現在の異常・対応状況
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Activity className="h-4 w-4" />
          <span className="live-indicator">リアルタイム監視</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <div 
              key={index} 
              className={getAlertSeverityClass(alert.severity, index)}
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fade-in-up 0.8s ease-out forwards'
              }}
            >
              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getSeverityDot(alert.severity)}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{alert.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>更新: {alert.lastUpdate}</span>
                        {getTrendIcon(alert.trend)}
                        <span>{alert.trend}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                    {getSeverityIcon(alert.severity, Icon)}
                  </div>
                </div>

                {/* メトリクス */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {animatedCounts[index]}
                    {alert.total && <span className="text-lg font-normal text-gray-500 dark:text-gray-400"> / {alert.total}</span>}
                    {alert.unit && <span className="text-lg font-normal text-gray-500 dark:text-gray-400">{alert.unit}</span>}
                  </div>
                  
                  {/* プログレスバー（異常拠点の場合） */}
                  {alert.total && (
                    <div className="mt-2">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            alert.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${(animatedCounts[index] / alert.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>異常率</span>
                        <span>{((animatedCounts[index] / alert.total) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションリンク */}
                <Link 
                  href={alert.link}
                  className="group flex items-center justify-between text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-200"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {alert.linkText}
                  </span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                {/* 緊急時のパルスエフェクト */}
                {alert.severity === 'critical' && animatedCounts[index] > 0 && (
                  <div className="absolute -inset-1 bg-red-500 rounded-xl opacity-20 animate-pulse"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 緊急時のアクションバー */}
      {alerts.some(alert => alert.severity === 'critical' && alert.count > 0) && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="status-dot critical"></div>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">緊急対応が必要な異常があります</p>
                <p className="text-xs text-red-600 dark:text-red-400">担当者への通知を送信済み</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              緊急対応室に連絡
            </button>
          </div>
        </div>
      )}
    </div>
  )
}