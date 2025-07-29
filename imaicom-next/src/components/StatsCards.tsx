'use client'

import { Building, CheckCircle, AlertTriangle, AlertCircle, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
  {
    title: '施設状態',
    value: 'メンテナンス中',
    icon: AlertTriangle,
    type: 'warning',
    trend: '',
    description: '宗像SHE'
  },
]

export default function StatsCards() {

  const getCardClass = (type: string) => {
    switch (type) {
      case 'total':
        return 'metrics-card bg-gradient-to-br from-blue-500 to-blue-600'
      case 'normal':
        return 'metrics-card eco-metric'
      case 'warning':
        return 'metrics-card bg-gradient-to-br from-yellow-500 to-orange-500'
      case 'critical':
        return 'metrics-card bg-gradient-to-br from-red-500 to-red-600'
      default:
        return 'metrics-card'
    }
  }

  const getStatusDot = (type: string) => {
    const dotClass = `status-dot ${type === 'normal' ? 'normal' : type === 'warning' ? 'warning' : type === 'critical' ? 'critical' : ''}`
    return <div className={dotClass}></div>
  }

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-200'
    if (trend.startsWith('-')) return 'text-red-200'
    return 'text-gray-200'
  }

  return (
    <div className="flex justify-center mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div 
            key={index} 
            className={`${getCardClass(stat.type)} card-3d tooltip`}
            data-tooltip={stat.description}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in-up 0.6s ease-out forwards',
              width: '300px'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusDot(stat.type)}
                <span className="text-sm font-medium opacity-90">{stat.title}</span>
              </div>
              <div className="flex items-center gap-1 text-xs opacity-75">
                <Activity className="h-3 w-3" />
                <span className="live-indicator" style={{ padding: '2px 6px', fontSize: '10px' }}>
                  LIVE
                </span>
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold mb-1">
                  {stat.value}
                </div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}