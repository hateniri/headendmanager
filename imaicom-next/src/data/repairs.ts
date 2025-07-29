export interface Repair {
  id: string
  repairId: string // REP_0001形式
  reportDate: string
  repairDate: string | null
  facilityId: string
  equipmentId: string
  assignee: string
  issueType: 'hardware-failure' | 'performance-degradation' | 'connection-issue' | 'power-issue' | 'other'
  priority: 'high' | 'medium' | 'low'
  status: 'completed' | 'in-progress' | 'on-hold'
  description: string
  rootCause?: string
  repairDetails?: string
  partsUsed?: string[]
  cost?: number
  downtime?: number // 分単位
}

export const issueTypeLabels = {
  'hardware-failure': 'ハードウェア故障',
  'performance-degradation': '性能劣化',
  'connection-issue': '接続不良',
  'power-issue': '電源異常',
  'other': 'その他'
}

export const priorityConfig = {
  high: {
    label: '高',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: '🔴'
  },
  medium: {
    label: '中',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: '🟡'
  },
  low: {
    label: '低',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: '🟢'
  }
}

export const repairStatusConfig = {
  completed: {
    label: '完了',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: '✅'
  },
  'in-progress': {
    label: '対応中',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: '🔧'
  },
  'on-hold': {
    label: '保留',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    icon: '⏸️'
  }
}

// 50件の修理案件ダミーデータ生成
export const mockRepairs: Repair[] = []

const facilityIds = Array.from({ length: 20 }, (_, i) => `HE_${String(i + 1).padStart(3, '0')}`)
const equipmentIds = Array.from({ length: 20 }, (_, i) => `EQ_${String(i + 100).padStart(4, '0')}`)
const assignees = ['田中太郎', '鈴木次郎', '佐藤花子', '高橋美咲', '渡辺健一', '伊藤真司', '山田優子', '中村大輔']
const issueTypes: Repair['issueType'][] = ['hardware-failure', 'performance-degradation', 'connection-issue', 'power-issue', 'other']
const priorities: Repair['priority'][] = ['high', 'medium', 'low']
const statuses: Repair['status'][] = ['completed', 'in-progress', 'on-hold']

const descriptions = [
  'QAMモジュールのLED異常点滅を検知',
  '出力レベルが規定値を下回る',
  'ケーブル接続部の緩みによる信号断',
  '電源ユニットファンの異音発生',
  'CPU使用率が常時90%以上で推移',
  'メモリリークによるシステム不安定',
  'ネットワークインターフェースのパケットロス',
  '温度センサーの異常値検出',
  'ハードディスクのS.M.A.R.T.エラー',
  'バックアップ電源の充電不良'
]

const rootCauses = [
  '経年劣化によるコンデンサの容量低下',
  'ファームウェアのバグによる処理異常',
  '振動による接触不良',
  'ホコリの蓄積による冷却効率低下',
  '電源電圧の不安定',
  'メモリモジュールの物理的故障',
  'ケーブルの断線',
  'サージによる回路損傷',
  '設定ミスによる過負荷',
  '製造上の初期不良'
]

const repairDetailsList = [
  'QAMモジュール交換及び動作確認実施',
  'ファームウェアアップデート適用',
  'ケーブル再接続及び締め付けトルク確認',
  'ファン清掃及びグリスアップ実施',
  '設定値の最適化調整',
  'メモリモジュール交換',
  'ネットワークケーブル交換',
  '電源ユニット交換',
  'ハードディスク交換及びデータ復旧',
  'バックアップバッテリー交換'
]

const partsList = [
  'QAMモジュール(型番:QAM-MOD-4K)',
  'DDR4メモリ 16GB',
  'Cat6Aケーブル 5m',
  '冷却ファン 80mm',
  '電源ユニット 750W',
  'SSD 512GB',
  'CPU冷却グリス',
  'RJ45コネクタ',
  'サージプロテクタ',
  'バックアップバッテリー 12V'
]

// データ生成
for (let i = 0; i < 50; i++) {
  const reportDate = new Date(2024, 11, Math.floor(Math.random() * 25) + 1)
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const isCompleted = status === 'completed'
  const repairDate = isCompleted 
    ? new Date(reportDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    : null

  const repair: Repair = {
    id: `repair-${i + 1}`,
    repairId: `REP_${String(i + 1).padStart(4, '0')}`,
    reportDate: reportDate.toISOString().split('T')[0],
    repairDate: repairDate ? repairDate.toISOString().split('T')[0] : null,
    facilityId: facilityIds[Math.floor(Math.random() * facilityIds.length)],
    equipmentId: equipmentIds[Math.floor(Math.random() * equipmentIds.length)],
    assignee: assignees[Math.floor(Math.random() * assignees.length)],
    issueType: issueTypes[Math.floor(Math.random() * issueTypes.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: status,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    rootCause: isCompleted || status === 'in-progress' ? rootCauses[Math.floor(Math.random() * rootCauses.length)] : undefined,
    repairDetails: isCompleted ? repairDetailsList[Math.floor(Math.random() * repairDetailsList.length)] : undefined,
    partsUsed: isCompleted && Math.random() > 0.3 ? [partsList[Math.floor(Math.random() * partsList.length)]] : undefined,
    cost: isCompleted ? Math.floor(Math.random() * 100000) + 10000 : undefined,
    downtime: isCompleted ? Math.floor(Math.random() * 480) + 30 : undefined
  }

  mockRepairs.push(repair)
}

// ソート（報告日の新しい順）
mockRepairs.sort((a, b) => b.reportDate.localeCompare(a.reportDate))

// 集計関数
export function getRepairStats(repairs: Repair[]) {
  const total = repairs.length
  const completed = repairs.filter(r => r.status === 'completed').length
  const inProgress = repairs.filter(r => r.status === 'in-progress').length
  const onHold = repairs.filter(r => r.status === 'on-hold').length
  
  const highPriority = repairs.filter(r => r.priority === 'high').length
  const mediumPriority = repairs.filter(r => r.priority === 'medium').length
  const lowPriority = repairs.filter(r => r.priority === 'low').length
  
  // 平均修理時間（完了案件のみ）
  const completedRepairs = repairs.filter(r => r.status === 'completed' && r.downtime)
  const avgDowntime = completedRepairs.length > 0
    ? completedRepairs.reduce((sum, r) => sum + (r.downtime || 0), 0) / completedRepairs.length
    : 0
  
  // 総修理コスト
  const totalCost = repairs.reduce((sum, r) => sum + (r.cost || 0), 0)
  
  return {
    total,
    byStatus: { completed, inProgress, onHold },
    byPriority: { high: highPriority, medium: mediumPriority, low: lowPriority },
    avgDowntime,
    totalCost
  }
}

// 担当者別集計
export function getRepairsByAssignee(repairs: Repair[]) {
  const assigneeMap = new Map<string, { total: number, completed: number, inProgress: number, onHold: number }>()
  
  repairs.forEach(repair => {
    if (!assigneeMap.has(repair.assignee)) {
      assigneeMap.set(repair.assignee, { total: 0, completed: 0, inProgress: 0, onHold: 0 })
    }
    
    const stats = assigneeMap.get(repair.assignee)!
    stats.total++
    
    switch (repair.status) {
      case 'completed':
        stats.completed++
        break
      case 'in-progress':
        stats.inProgress++
        break
      case 'on-hold':
        stats.onHold++
        break
    }
  })
  
  return Array.from(assigneeMap.entries())
    .map(([assignee, stats]) => ({ assignee, ...stats }))
    .sort((a, b) => b.total - a.total)
}

// 拠点別集計
export function getRepairsByFacility(repairs: Repair[]) {
  const facilityMap = new Map<string, { total: number, completed: number, inProgress: number, onHold: number }>()
  
  repairs.forEach(repair => {
    if (!facilityMap.has(repair.facilityId)) {
      facilityMap.set(repair.facilityId, { total: 0, completed: 0, inProgress: 0, onHold: 0 })
    }
    
    const stats = facilityMap.get(repair.facilityId)!
    stats.total++
    
    switch (repair.status) {
      case 'completed':
        stats.completed++
        break
      case 'in-progress':
        stats.inProgress++
        break
      case 'on-hold':
        stats.onHold++
        break
    }
  })
  
  return Array.from(facilityMap.entries())
    .map(([facilityId, stats]) => ({ facilityId, ...stats }))
    .sort((a, b) => b.total - a.total)
}