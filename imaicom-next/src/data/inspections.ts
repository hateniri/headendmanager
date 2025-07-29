// Inspection data types and mock data
export interface Inspection {
  id: string
  inspectionId: string
  scheduledDate: string
  facilityId: string
  equipmentId: string
  assignee: string
  inspectionType: 'fan-cleaning' | 'temperature' | 'cable-check' | 'voltage' | 'general'
  status: 'scheduled' | 'urgent' | 're-inspection' | 'postponed' | 'completed'
  notes?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface InspectionLog {
  id: string
  logId: string
  executedDate: string
  facilityId: string
  equipmentId: string
  assignee: string
  inspectionType: 'fan-cleaning' | 'temperature' | 'cable-check' | 'voltage' | 'general'
  result: 'normal' | 'caution' | 'abnormal' | 're-inspection-needed'
  memo: string
  attachments?: string[]
  temperature?: number
  voltage?: number
}

// 点検項目のラベル
export const inspectionTypeLabels = {
  'fan-cleaning': 'ファン清掃',
  'temperature': '温度測定',
  'cable-check': 'ケーブル接続',
  'voltage': '電圧測定',
  'general': '総合点検'
}

// ステータスのラベルと色設定
export const statusConfig = {
  scheduled: { label: '予定', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' },
  urgent: { label: '緊急', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' },
  're-inspection': { label: '再点検要', color: 'text-orange-600', bg: 'bg-orange-50', icon: '🟠' },
  postponed: { label: '延期', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🟡' },
  completed: { label: '完了', color: 'text-gray-600', bg: 'bg-gray-50', icon: '✅' }
}

// 結果のラベルと色設定
export const resultConfig = {
  normal: { label: '正常', color: 'text-green-600', bg: 'bg-green-50' },
  caution: { label: '注意', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  abnormal: { label: '異常', color: 'text-red-600', bg: 'bg-red-50' },
  're-inspection-needed': { label: '再点検推奨', color: 'text-orange-600', bg: 'bg-orange-50' }
}

// 担当者リスト
const assignees = ['鈴木 一郎', '佐藤 花子', '田中 太郎', '山田 次郎', '高橋 美香']

// 点検予定データ生成（50件）
function generateInspections(): Inspection[] {
  const inspections: Inspection[] = []
  const types: Inspection['inspectionType'][] = ['fan-cleaning', 'temperature', 'cable-check', 'voltage', 'general']
  const statuses: Inspection['status'][] = ['scheduled', 'urgent', 're-inspection', 'postponed']
  
  for (let i = 1; i <= 50; i++) {
    const facilityId = `HE_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`
    const equipmentId = `EQ_${String(100 + Math.floor(Math.random() * 20)).padStart(4, '0')}`
    const daysFromNow = Math.floor(Math.random() * 60) - 10 // -10日から+50日
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + daysFromNow)
    
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = status === 'urgent' ? 'urgent' : 
                    status === 're-inspection' ? 'high' :
                    status === 'postponed' ? 'medium' : 'low'
    
    inspections.push({
      id: String(i),
      inspectionId: `INS_${String(i).padStart(4, '0')}`,
      scheduledDate: scheduledDate.toISOString().split('T')[0],
      facilityId,
      equipmentId,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      inspectionType: types[Math.floor(Math.random() * types.length)],
      status,
      priority,
      notes: i % 3 === 0 ? '新設機材' : i % 4 === 0 ? '再点検対応' : undefined
    })
  }
  
  return inspections.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
}

// 点検履歴データ生成（50件）
function generateInspectionLogs(): InspectionLog[] {
  const logs: InspectionLog[] = []
  const types: InspectionLog['inspectionType'][] = ['fan-cleaning', 'temperature', 'cable-check', 'voltage', 'general']
  const results: InspectionLog['result'][] = ['normal', 'caution', 'abnormal', 're-inspection-needed']
  
  const memos = [
    '冷却ファン清掃済',
    '温度異常→対応要',
    '電源電圧不安定→UPS交換済',
    '正常動作確認',
    'ケーブル接続良好',
    '軽微な汚れあり→清掃実施',
    '異音あり→要経過観察',
    '温度センサー交換推奨',
    '配線整理実施',
    'ファン交換完了'
  ]
  
  for (let i = 1; i <= 50; i++) {
    const facilityId = `HE_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`
    const equipmentId = `EQ_${String(100 + Math.floor(Math.random() * 20)).padStart(4, '0')}`
    const daysAgo = Math.floor(Math.random() * 365) // 過去1年間
    const executedDate = new Date()
    executedDate.setDate(executedDate.getDate() - daysAgo)
    
    const type = types[Math.floor(Math.random() * types.length)]
    const result = results[Math.floor(Math.random() * results.length)]
    
    const log: InspectionLog = {
      id: String(i),
      logId: `LOG_${String(i).padStart(4, '0')}`,
      executedDate: executedDate.toISOString().split('T')[0],
      facilityId,
      equipmentId,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      inspectionType: type,
      result,
      memo: memos[Math.floor(Math.random() * memos.length)]
    }
    
    // 温度測定の場合は温度データを追加
    if (type === 'temperature') {
      log.temperature = 20 + Math.random() * 15 // 20-35度
    }
    
    // 電圧測定の場合は電圧データを追加
    if (type === 'voltage') {
      log.voltage = 95 + Math.random() * 10 // 95-105V
    }
    
    logs.push(log)
  }
  
  return logs.sort((a, b) => b.executedDate.localeCompare(a.executedDate))
}

// 点検統計情報を取得
export function getInspectionSummary(inspections: Inspection[], logs: InspectionLog[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // 今月の予定
  const thisMonthInspections = inspections.filter(ins => {
    const date = new Date(ins.scheduledDate)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
  
  // 過去30日の完了
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentLogs = logs.filter(log => new Date(log.executedDate) >= thirtyDaysAgo)
  
  // ステータス別カウント
  const urgentCount = inspections.filter(ins => ins.status === 'urgent').length
  const reInspectionCount = inspections.filter(ins => ins.status === 're-inspection').length
  
  // 点検実施率（簡易計算）
  const totalScheduled = thisMonthInspections.length
  const completedCount = recentLogs.length
  const completionRate = totalScheduled > 0 ? Math.round((completedCount / (totalScheduled + completedCount)) * 100) : 0
  
  // 担当者別進捗
  const assigneeProgress = assignees.map(assignee => {
    const assigned = thisMonthInspections.filter(ins => ins.assignee === assignee).length
    const completed = recentLogs.filter(log => log.assignee === assignee).length
    return {
      name: assignee,
      assigned,
      completed,
      rate: assigned > 0 ? Math.round((completed / (assigned + completed)) * 100) : 0
    }
  })
  
  return {
    thisMonthCount: thisMonthInspections.length,
    urgentCount,
    reInspectionCount,
    completedCount: recentLogs.length,
    completionRate,
    assigneeProgress
  }
}

// 拠点別点検率を計算
export function getFacilityInspectionRates(inspections: Inspection[], logs: InspectionLog[]) {
  const facilities = Array.from({ length: 20 }, (_, i) => `HE_${String(i + 1).padStart(3, '0')}`)
  
  return facilities.map(facilityId => {
    const scheduled = inspections.filter(ins => ins.facilityId === facilityId).length
    const completed = logs.filter(log => log.facilityId === facilityId && log.result !== 'abnormal').length
    const reInspection = inspections.filter(ins => ins.facilityId === facilityId && ins.status === 're-inspection').length
    
    const total = scheduled + completed
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      facilityId,
      rate,
      scheduled,
      incomplete: scheduled,
      reInspection
    }
  }).sort((a, b) => b.rate - a.rate)
}

export const mockInspections = generateInspections()
export const mockInspectionLogs = generateInspectionLogs()