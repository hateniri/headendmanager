'use client'

import React from 'react'
import { useUIStore } from '@/store/uiStore'

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useUIStore()

  const tabs = [
    { id: 'equipment', label: '機器一覧', icon: '🖥️' },
    { id: 'inspection', label: '点検履歴', icon: '📋' },
    { id: 'repair', label: '修理依頼', icon: '🔧' },
    { id: 'organization', label: '管理体制', icon: '👥' },
  ] as const

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 px-4 text-center text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}