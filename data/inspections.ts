import { Inspection } from '@/types'

const inspectorNames = [
  '山田太郎', '佐藤花子', '鈴木一郎', '田中美咲', '高橋健太',
  '伊藤さくら', '渡辺浩', '中村優子', '小林大輔', '加藤真理',
  '吉田翔', '山口愛', '松本剛', '井上由美', '木村拓也',
]

const inspectionContents = [
  '定期点検 - 全機器動作確認',
  '月次点検 - 温度・湿度チェック',
  '年次点検 - 詳細診断実施',
  '緊急点検 - アラート対応',
  '保守点検 - 部品交換実施',
  'ファームウェア更新確認',
  'ケーブル配線チェック',
  '電源系統点検',
  '冷却システム確認',
  'セキュリティ監査',
]

export const generateInspections = (facilityId: string): Inspection[] => {
  const inspections: Inspection[] = []
  const count = Math.floor(Math.random() * 10) + 15 // 15-25 inspections
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    const results: ('passed' | 'failed' | 'pending')[] = ['passed', 'passed', 'passed', 'failed', 'pending']
    const result = results[Math.floor(Math.random() * results.length)]
    
    inspections.push({
      id: `${facilityId}-insp-${i + 1}`,
      facilityId,
      date: date.toISOString().split('T')[0],
      inspector: inspectorNames[Math.floor(Math.random() * inspectorNames.length)],
      content: inspectionContents[Math.floor(Math.random() * inspectionContents.length)],
      result,
      notes: result === 'failed' ? '要対応：' + ['温度異常検知', '機器エラー発生', '部品交換必要'][Math.floor(Math.random() * 3)] : undefined,
    })
  }
  
  // Sort by date (newest first)
  return inspections.sort((a, b) => b.date.localeCompare(a.date))
}