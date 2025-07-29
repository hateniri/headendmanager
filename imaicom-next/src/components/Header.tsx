'use client'

import { useState } from 'react'
import { Building2, MapPin, Wrench, ClipboardList, BarChart3, User, Moon, Sun, Menu, X, Info } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useAuth } from '@/contexts/AuthContext'
import { APP_VERSION } from '@/config/version'

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { user, hasPermission } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showVersionInfo, setShowVersionInfo] = useState(false)
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">IMAICOM</h1>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  {APP_VERSION.displayVersion}
                </span>
                <button
                  onClick={() => setShowVersionInfo(!showVersionInfo)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="バージョン情報"
                >
                  <Info className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">ヘッドエンド設備統合管理システム</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {user && (
              <a href="/" className="flex items-center text-gray-500 hover:text-gray-900">
                <MapPin className="h-4 w-4 mr-1" />
                施設マップ
              </a>
            )}
            {user && hasPermission('manage_assets') && (
              <a href="/cmdb" className="flex items-center text-gray-500 hover:text-gray-900">
                <Wrench className="h-4 w-4 mr-1" />
                資産管理
              </a>
            )}
            {user && hasPermission('create_inspection') && (
              <a href="/schedule" className="flex items-center text-gray-500 hover:text-gray-900">
                <ClipboardList className="h-4 w-4 mr-1" />
                点検予定
              </a>
            )}
            {user && hasPermission('create_repair') && (
              <a href="/repair" className="flex items-center text-gray-500 hover:text-gray-900">
                <Wrench className="h-4 w-4 mr-1" />
                修理管理
              </a>
            )}
            {user && (
              <a href="/analytics" className="flex items-center text-gray-500 hover:text-gray-900">
                <BarChart3 className="h-4 w-4 mr-1" />
                分析
              </a>
            )}
            {user && hasPermission('view_audit_logs') && (
              <a href="/audit" className="flex items-center text-gray-500 hover:text-gray-900">
                <User className="h-4 w-4 mr-1" />
                監査ログ
              </a>
            )}
          </nav>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button 
              onClick={() => alert('通知機能は開発中です。現在、新しい異常やアラートはありません。')}
              className="hidden md:block p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="通知"
            >
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {/* 通知バッジ（新しい通知がある場合） */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full opacity-0"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* バージョン情報モーダル */}
      {showVersionInfo && (
        <div className="absolute top-16 left-4 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">バージョン情報</h3>
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
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {APP_VERSION.fullVersion}
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">最新の変更点</h4>
                <div className="space-y-2">
                  {APP_VERSION.releaseNotes[0]?.changes.slice(0, 4).map((change, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  リリース日: {APP_VERSION.releaseNotes[0]?.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* モバイルメニュー */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <nav className="px-4 py-3 space-y-2">
            <a href="/" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <MapPin className="h-4 w-4 mr-3" />
              施設マップ
            </a>
            {hasPermission('manage_assets') && (
              <a href="/cmdb" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Wrench className="h-4 w-4 mr-3" />
                資産管理
              </a>
            )}
            {hasPermission('create_inspection') && (
              <a href="/schedule" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <ClipboardList className="h-4 w-4 mr-3" />
                点検予定
              </a>
            )}
            {hasPermission('create_repair') && (
              <a href="/repair" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Wrench className="h-4 w-4 mr-3" />
                修理管理
              </a>
            )}
            <a href="/analytics" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BarChart3 className="h-4 w-4 mr-3" />
              分析
            </a>
            {hasPermission('view_audit_logs') && (
              <a href="/audit" className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-4 w-4 mr-3" />
                監査ログ
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}