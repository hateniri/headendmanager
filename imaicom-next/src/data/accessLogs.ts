export interface AccessLog {
  id: string
  timestamp: string
  personName: string
  personId: string
  company: string
  purpose: 'maintenance' | 'inspection' | 'construction' | 'delivery' | 'meeting' | 'other'
  action: 'entry' | 'exit'
  facilityId: string
  temperature?: number // 体温
  notes?: string
}

export interface WorkLog {
  id: string
  timestamp: string
  workType: 'repair' | 'inspection' | 'cleaning' | 'installation' | 'removal' | 'other'
  workers: string[]
  company: string
  facilityId: string
  equipmentId?: string
  duration: number // 分
  description: string
  result: 'completed' | 'partial' | 'postponed'
  notes?: string
  photos?: string[]
}

export const purposeLabels = {
  maintenance: '保守作業',
  inspection: '点検作業',
  construction: '工事',
  delivery: '納品',
  meeting: '打ち合わせ',
  other: 'その他'
}

export const workTypeLabels = {
  repair: '修理',
  inspection: '点検',
  cleaning: '清掃',
  installation: '設置',
  removal: '撤去',
  other: 'その他'
}

// 入退室ログのダミーデータ生成
export function generateAccessLogs(facilityId: string, count: number = 30): AccessLog[] {
  const logs: AccessLog[] = []
  const companies = ['東京電気工事', 'サンライズメンテナンス', '中央設備管理', 'テクノサービス', '運送会社A']
  const names = [
    { name: '山田太郎', id: 'EMP001' },
    { name: '鈴木次郎', id: 'EMP002' },
    { name: '佐藤花子', id: 'EMP003' },
    { name: '高橋一郎', id: 'EMP004' },
    { name: '田中美咲', id: 'EMP005' },
    { name: '渡辺健太', id: 'EMP006' },
    { name: '伊藤真司', id: 'EMP007' },
    { name: '中村大輔', id: 'EMP008' }
  ]
  const purposes: AccessLog['purpose'][] = ['maintenance', 'inspection', 'construction', 'delivery', 'meeting', 'other']
  
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const person = names[Math.floor(Math.random() * names.length)]
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const isEntry = Math.random() > 0.5
    
    // エントリーの場合は体温も記録
    const temperature = isEntry ? 36 + Math.random() * 1.5 : undefined
    
    logs.push({
      id: `access-${facilityId}-${i + 1}`,
      timestamp: timestamp.toISOString(),
      personName: person.name,
      personId: person.id,
      company: companies[Math.floor(Math.random() * companies.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      action: isEntry ? 'entry' : 'exit',
      facilityId: facilityId,
      temperature: temperature,
      notes: Math.random() > 0.8 ? '定期メンテナンス' : undefined
    })
  }
  
  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

// 作業履歴のダミーデータ生成
export function generateWorkLogs(facilityId: string, count: number = 20): WorkLog[] {
  const logs: WorkLog[] = []
  const companies = ['東京電気工事', 'サンライズメンテナンス', '中央設備管理', 'テクノサービス']
  const workerGroups = [
    ['山田太郎', '鈴木次郎'],
    ['佐藤花子'],
    ['高橋一郎', '田中美咲', '渡辺健太'],
    ['伊藤真司', '中村大輔']
  ]
  const workTypes: WorkLog['workType'][] = ['repair', 'inspection', 'cleaning', 'installation', 'removal', 'other']
  const descriptions = [
    'QAMモジュール交換作業',
    '光ファイバー接続確認',
    'UPSバッテリー交換',
    '冷却ファン清掃',
    'ケーブル配線整理',
    '電源系統点検',
    'ラック内機器配置変更',
    'ネットワーク機器設定変更',
    '温度センサー校正',
    '緊急対応作業'
  ]
  
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    const duration = 30 + Math.floor(Math.random() * 240) // 30分〜4時間
    
    logs.push({
      id: `work-${facilityId}-${i + 1}`,
      timestamp: timestamp.toISOString(),
      workType: workTypes[Math.floor(Math.random() * workTypes.length)],
      workers: workerGroups[Math.floor(Math.random() * workerGroups.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      facilityId: facilityId,
      equipmentId: Math.random() > 0.3 ? `EQ_${String(Math.floor(Math.random() * 100) + 100).padStart(4, '0')}` : undefined,
      duration: duration,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      result: Math.random() > 0.9 ? 'postponed' : Math.random() > 0.1 ? 'completed' : 'partial',
      notes: Math.random() > 0.7 ? '問題なく完了' : undefined,
      photos: Math.random() > 0.5 ? ['photo1.jpg', 'photo2.jpg'] : undefined
    })
  }
  
  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}