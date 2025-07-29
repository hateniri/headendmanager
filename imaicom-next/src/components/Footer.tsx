'use client'

import { Building2, Clock, Users, Shield } from 'lucide-react'
import VersionBadge from './VersionBadge'
import { APP_VERSION } from '@/config/version'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 会社情報 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">IMAICOM システム</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              ヘッドエンド設備統合管理システム - 全国100拠点の施設・機材を一元管理
            </p>
            <div className="flex items-center gap-4">
              <VersionBadge size="sm" position="footer" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                © {currentYear} IMAI Communications Co., Ltd.
              </span>
            </div>
          </div>

          {/* システム情報 */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">システム情報</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                リアルタイム監視
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                多拠点管理対応
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                セキュアアクセス
              </li>
            </ul>
          </div>

          {/* 技術情報 */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">技術スタック</h4>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li>Next.js 15 + React 18</li>
              <li>TypeScript + Tailwind CSS</li>
              <li>Real-time WebSocket</li>
              <li>ESG環境監視</li>
            </ul>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              最終更新: {new Date().toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>

        {/* システムステータス */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>システム正常稼働中</span>
              </div>
              <div>稼働率: 99.9%</div>
              <div>応答時間: 150ms</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              サポート: support@imai.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}