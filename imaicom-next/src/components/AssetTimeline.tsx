'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  User, 
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react'

interface TimelineEvent {
  id: string
  date: string
  time?: string
  type: 'installation' | 'inspection' | 'repair' | 'replacement' | 'maintenance' | 'config-change' | 'retirement'
  title: string
  description: string
  performer?: string
  result?: 'success' | 'warning' | 'failure'
  relatedAssetId?: string
  cost?: number
  notes?: string
  hasPhotos?: boolean
  hasDocuments?: boolean
}

interface AssetTimelineProps {
  assetId: string
  facilityId: string
  showAll?: boolean
}

export default function AssetTimeline({ assetId, facilityId, showAll = false }: AssetTimelineProps) {
  const [timelineFilter, setTimelineFilter] = useState<string>('all')
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  // サンプルタイムラインデータ（実際はAPIから取得）
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'evt-001',
      date: '2025-01-25',
      time: '14:30',
      type: 'inspection',
      title: 'カテゴリ別定期点検実施',
      description: '映像処理機器の包括点検：BER値測定、温度監視、ファン回転数確認',
      performer: '佐藤 花子',
      result: 'success',
      notes: '全項目正常。次回点検予定: 2025-02-25',
      hasPhotos: true,
      hasDocuments: true
    },
    {
      id: 'evt-002',
      date: '2025-01-20',
      time: '10:15',
      type: 'maintenance',
      title: 'ファームウェア更新',
      description: 'セキュリティパッチ適用とバージョンアップ',
      performer: '鈴木 一郎',
      result: 'success',
      notes: 'v2.4.1 → v2.5.0 アップデート完了',
      hasDocuments: true
    },
    {
      id: 'evt-003',
      date: '2025-01-18',
      time: '16:45',
      type: 'repair',
      title: '冷却ファン交換',
      description: 'ファン回転数低下により緊急交換実施',
      performer: '高橋 次郎',
      result: 'success',
      cost: 25000,
      notes: '予備品在庫から交換。旧ファンは廃棄処分',
      hasPhotos: true
    },
    {
      id: 'evt-004',
      date: '2025-01-10',
      time: '09:00',
      type: 'config-change',
      title: '設定変更・バックアップ',
      description: 'QAM出力レベル調整とコンフィグバックアップ',
      performer: '伊藤 明美',
      result: 'success',
      notes: 'バックアップファイル: config_20250110.bak'
    },
    {
      id: 'evt-005',
      date: '2024-12-15',
      time: '11:30',
      type: 'inspection',
      title: '年次総合点検',
      description: '年末総合点検：全機能テスト、清掃、消耗品交換',
      performer: '山本 健太',
      result: 'warning',
      notes: '次年度にファン交換を推奨',
      hasPhotos: true,
      hasDocuments: true
    },
    {
      id: 'evt-006',
      date: '2022-03-15',
      time: '13:00',
      type: 'installation',
      title: '機器設置・初期設定',
      description: 'QAM変調器の設置とコミッショニング',
      performer: '導入チーム',
      result: 'success',
      cost: 3500000,
      notes: '保証期間: 2025-03-15まで'
    }
  ]

  const getEventIcon = (type: string, result?: string) => {
    switch (type) {
      case 'installation':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'inspection':
        return result === 'success' ? 
          <CheckCircle className="h-5 w-5 text-green-600" /> : 
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'repair':
        return <Wrench className="h-5 w-5 text-red-600" />
      case 'maintenance':
        return <Activity className="h-5 w-5 text-purple-600" />
      case 'config-change':
        return <Calendar className="h-5 w-5 text-indigo-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getEventColor = (type: string, result?: string) => {
    if (result === 'warning') return 'border-yellow-300 bg-yellow-50'
    if (result === 'failure') return 'border-red-300 bg-red-50'
    
    switch (type) {
      case 'installation':
        return 'border-blue-300 bg-blue-50'
      case 'inspection':
        return 'border-green-300 bg-green-50'
      case 'repair':
        return 'border-red-300 bg-red-50'
      case 'maintenance':
        return 'border-purple-300 bg-purple-50'
      case 'config-change':
        return 'border-indigo-300 bg-indigo-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const filteredEvents = timelineFilter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.type === timelineFilter)

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  return (
    <div className="space-y-6">
      {/* フィルターコントロール */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTimelineFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            timelineFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setTimelineFilter('inspection')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            timelineFilter === 'inspection'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          点検
        </button>
        <button
          onClick={() => setTimelineFilter('repair')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            timelineFilter === 'repair'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          修理
        </button>
        <button
          onClick={() => setTimelineFilter('maintenance')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            timelineFilter === 'maintenance'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          保守
        </button>
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 縦線 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start">
              {/* アイコン */}
              <div className="flex-shrink-0 w-16 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {getEventIcon(event.type, event.result)}
                </div>
              </div>

              {/* イベントカード */}
              <div className={`flex-1 ml-4 border-2 rounded-lg p-4 ${getEventColor(event.type, event.result)} dark:bg-gray-800 dark:border-gray-600`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h3>
                      {event.time && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.time}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {event.description}
                    </p>
                    
                    {/* 基本情報 */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                      {event.performer && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.performer}
                        </div>
                      )}
                      {event.cost && (
                        <div className="text-green-600 dark:text-green-400 font-medium">
                          ¥{event.cost.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* 添付ファイル・写真インジケーター */}
                    <div className="flex gap-2 mt-2">
                      {event.hasPhotos && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          📷 写真あり
                        </span>
                      )}
                      {event.hasDocuments && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                          📄 書類あり
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 展開ボタン */}
                  {event.notes && (
                    <button
                      onClick={() => toggleEventExpansion(event.id)}
                      className="ml-4 p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <ArrowRight 
                        className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
                          expandedEvents.has(event.id) ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  )}
                </div>

                {/* 展開コンテンツ */}
                {expandedEvents.has(event.id) && event.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">詳細メモ:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 rounded p-3">
                      {event.notes}
                    </p>
                    
                    {/* アクションボタン */}
                    <div className="flex gap-2 mt-3">
                      {event.hasPhotos && (
                        <button 
                          onClick={() => alert(`${event.title}の写真を表示します。`)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          写真を表示
                        </button>
                      )}
                      {event.hasDocuments && (
                        <button 
                          onClick={() => alert(`${event.title}の関連書類をダウンロードします。`)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          書類DL
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`${event.title}の詳細レポートを表示します。`)}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                      >
                        詳細レポート
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 要約統計 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">履歴サマリー</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {timelineEvents.filter(e => e.type === 'inspection').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">点検回数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {timelineEvents.filter(e => e.type === 'repair').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">修理回数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {timelineEvents.filter(e => e.type === 'maintenance').length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">保守回数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              ¥{timelineEvents.filter(e => e.cost).reduce((sum, e) => sum + (e.cost || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">総コスト</div>
          </div>
        </div>
      </div>
    </div>
  )
}