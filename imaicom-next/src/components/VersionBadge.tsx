'use client'

import { useState } from 'react'
import { Info, X, History, GitBranch } from 'lucide-react'
import { APP_VERSION } from '@/config/version'

interface VersionBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showInfo?: boolean
  position?: 'header' | 'footer' | 'floating'
}

export default function VersionBadge({ 
  size = 'sm', 
  showInfo = true, 
  position = 'header' 
}: VersionBadgeProps) {
  const [showVersionInfo, setShowVersionInfo] = useState(false)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className={`font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full ${sizeClasses[size]}`}>
          {APP_VERSION.displayVersion}
        </span>
        {showInfo && (
          <button
            onClick={() => setShowVersionInfo(!showVersionInfo)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="バージョン情報"
          >
            <Info className={`text-gray-400 dark:text-gray-500 ${iconSizes[size]}`} />
          </button>
        )}
      </div>

      {/* バージョン情報モーダル */}
      {showVersionInfo && (
        <div className={`absolute z-50 ${
          position === 'header' ? 'top-8 left-0' : 
          position === 'footer' ? 'bottom-8 left-0' : 
          'top-0 left-0'
        }`}>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-blue-500" />
                バージョン情報
              </h3>
              <button
                onClick={() => setShowVersionInfo(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {APP_VERSION.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span>{APP_VERSION.fullVersion}</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                    最新
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <History className="h-3 w-3" />
                  最新の変更点
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {APP_VERSION.releaseNotes[0]?.changes.map((change, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">•</span>
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  リリース日: {APP_VERSION.releaseNotes[0]?.date}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ビルド: {APP_VERSION.build}
                </div>
              </div>

              {/* 全リリースノート表示ボタン */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <button 
                  onClick={() => alert('全リリースノートを表示する機能は開発中です。')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  全リリースノートを表示 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// バージョン更新チェック用のユーティリティ関数
export function checkForUpdates() {
  // 実際の実装では、サーバーから最新バージョンを取得して比較
  console.log('Checking for updates...', APP_VERSION.version)
  return Promise.resolve({ hasUpdate: false, latestVersion: APP_VERSION.version })
}

// バージョン履歴表示用のコンポーネント
export function VersionHistory() {
  return (
    <div className="space-y-4">
      {APP_VERSION.releaseNotes.map((release, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{release.version}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{release.date}</span>
          </div>
          <ul className="space-y-1">
            {release.changes.map((change, changeIndex) => (
              <li key={changeIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}