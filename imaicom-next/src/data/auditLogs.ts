export interface AuditLog {
  id: string
  logId: string // AUD_0001形式
  timestamp: string
  userId: string
  userName: string
  ipAddress: string
  action: 'update' | 'delete' | 'create' | 'view' | 'export' | 'login' | 'logout'
  entity: 'inspection' | 'repair' | 'asset' | '3d-viewer' | 'report' | 'system'
  entityId: string
  description: string
  result: 'success' | 'failure'
  changes?: {
    field: string
    oldValue: string
    newValue: string
  }[]
  userAgent?: string
  department?: string
  jobTitle?: string
}

export const actionLabels = {
  update: '更新',
  delete: '削除',
  create: '作成',
  view: '閲覧',
  export: 'エクスポート',
  login: 'ログイン',
  logout: 'ログアウト'
}

export const entityLabels = {
  inspection: '点検',
  repair: '修理',
  asset: '資産',
  '3d-viewer': '3Dビュー',
  report: 'レポート',
  system: 'システム'
}

export const actionConfig = {
  update: {
    icon: '✏️',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    importance: 'medium'
  },
  delete: {
    icon: '🗑️',
    color: 'text-red-700',
    bg: 'bg-red-100',
    importance: 'high'
  },
  create: {
    icon: '➕',
    color: 'text-green-700',
    bg: 'bg-green-100',
    importance: 'medium'
  },
  view: {
    icon: '👁️',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    importance: 'low'
  },
  export: {
    icon: '📥',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    importance: 'high'
  },
  login: {
    icon: '🔑',
    color: 'text-indigo-700',
    bg: 'bg-indigo-100',
    importance: 'medium'
  },
  logout: {
    icon: '🚪',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    importance: 'low'
  }
}

// 50件の監査ログダミーデータ生成
export const mockAuditLogs: AuditLog[] = []

const users = [
  { id: 'USR001', name: '鈴木 一郎', department: 'ネットワーク運用部', jobTitle: '主任' },
  { id: 'USR002', name: '田中 太郎', department: '保守管理部', jobTitle: '係長' },
  { id: 'USR003', name: '佐藤 花子', department: '施設管理部', jobTitle: 'マネージャー' },
  { id: 'USR004', name: '高橋 京子', department: 'ネットワーク運用部', jobTitle: '担当' },
  { id: 'USR005', name: '渡辺 健一', department: '保守管理部', jobTitle: '主任' },
  { id: 'USR006', name: '伊藤 真司', department: 'システム管理部', jobTitle: '課長' }
]

const actions: AuditLog['action'][] = ['update', 'delete', 'create', 'view', 'export', 'login', 'logout']
const entities: AuditLog['entity'][] = ['inspection', 'repair', 'asset', '3d-viewer', 'report', 'system']

const descriptions = {
  update: {
    inspection: '点検予定の変更',
    repair: '修理ステータス変更',
    asset: '資産情報更新',
    system: 'システム設定変更'
  },
  delete: {
    inspection: '点検予定の削除',
    repair: '修理案件の削除',
    asset: '資産情報削除'
  },
  create: {
    inspection: '点検予定の作成',
    repair: '修理案件の作成',
    asset: '資産情報登録'
  },
  view: {
    '3d-viewer': '3Dビュー確認',
    report: 'レポート閲覧',
    asset: '資産詳細閲覧'
  },
  export: {
    report: 'CSV出力',
    asset: '資産台帳エクスポート',
    inspection: '点検履歴出力'
  },
  login: {
    system: 'システムログイン'
  },
  logout: {
    system: 'システムログアウト'
  }
}

const changes = [
  { field: 'status', oldValue: '対応中', newValue: '完了' },
  { field: 'assignee', oldValue: '田中太郎', newValue: '鈴木次郎' },
  { field: 'priority', oldValue: '中', newValue: '高' },
  { field: 'scheduledDate', oldValue: '2024-12-20', newValue: '2024-12-25' },
  { field: 'notes', oldValue: '', newValue: '緊急対応が必要' }
]

// データ生成
const now = new Date()
for (let i = 0; i < 50; i++) {
  const user = users[Math.floor(Math.random() * users.length)]
  const action = actions[Math.floor(Math.random() * actions.length)]
  const entity = entities[Math.floor(Math.random() * entities.length)]
  
  // アクションとエンティティの組み合わせ調整
  let validEntity = entity
  if (action === 'login' || action === 'logout') {
    validEntity = 'system'
  } else if (action === 'view' && !['3d-viewer', 'report', 'asset'].includes(entity)) {
    validEntity = ['3d-viewer', 'report', 'asset'][Math.floor(Math.random() * 3)] as AuditLog['entity']
  }
  
  const timestamp = new Date(now.getTime() - Math.random() * 100 * 24 * 60 * 60 * 1000)
  const result: AuditLog['result'] = Math.random() > 0.1 ? 'success' : 'failure'
  
  let entityId = ''
  if (validEntity === 'inspection') entityId = `INS_${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`
  else if (validEntity === 'repair') entityId = `REP_${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`
  else if (validEntity === 'asset') entityId = `AST_${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`
  else if (validEntity === '3d-viewer') entityId = `viewer_HE_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`
  else if (validEntity === 'report') entityId = `report_${Math.floor(Math.random() * 10) + 1}`
  else if (validEntity === 'system') entityId = action === 'login' || action === 'logout' ? 'login' : 'settings'
  
  const log: AuditLog = {
    id: `audit-${i + 1}`,
    logId: `AUD_${String(i + 1).padStart(4, '0')}`,
    timestamp: timestamp.toISOString(),
    userId: user.id,
    userName: user.name,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    action: action,
    entity: validEntity as AuditLog['entity'],
    entityId: entityId,
    description: (descriptions as any)[action]?.[validEntity] || `${actionLabels[action]} - ${entityLabels[validEntity]}`,
    result: result,
    changes: action === 'update' && result === 'success' && Math.random() > 0.5 
      ? [changes[Math.floor(Math.random() * changes.length)]]
      : undefined,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    department: user.department,
    jobTitle: user.jobTitle
  }
  
  mockAuditLogs.push(log)
}

// ソート（時刻の新しい順）
mockAuditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

// 集計関数
export function getAuditStats(logs: AuditLog[]) {
  const total = logs.length
  const success = logs.filter(l => l.result === 'success').length
  const failure = logs.filter(l => l.result === 'failure').length
  const successRate = total > 0 ? (success / total * 100) : 100
  
  const authFailures = logs.filter(l => l.action === 'login' && l.result === 'failure').length
  const writeOperations = logs.filter(l => ['update', 'delete', 'create'].includes(l.action)).length
  const writeRatio = total > 0 ? (writeOperations / total * 100) : 0
  
  const actionCounts = {} as Record<AuditLog['action'], number>
  actions.forEach(action => {
    actionCounts[action] = logs.filter(l => l.action === action).length
  })
  
  return {
    total,
    success,
    failure,
    successRate,
    authFailures,
    writeOperations,
    writeRatio,
    actionCounts
  }
}

// 重要操作の抽出
export function getImportantLogs(logs: AuditLog[]) {
  return logs.filter(log => {
    // 削除操作
    if (log.action === 'delete') return true
    // ログイン失敗
    if (log.action === 'login' && log.result === 'failure') return true
    // エクスポート操作
    if (log.action === 'export') return true
    // ステータス変更（修理・点検）
    if (log.action === 'update' && log.changes?.some(c => c.field === 'status')) return true
    
    return false
  })
}