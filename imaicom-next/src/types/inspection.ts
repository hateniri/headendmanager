export interface InspectionHistory {
  id: string
  facilityId: string
  facilityName: string
  inspectionType: 'ups' | 'distribution-panel' | 'underground-tank' | 'fire-prediction' | 'hvac' | 'battery' | 'disaster-prevention' | 'emergency-generator'
  inspectionStartDate: string
  inspectionEndDate: string
  inspector: string
  company: string
  witness?: string
  hasUrgentIssues: boolean
  status: 'completed' | 'in-progress' | 'pending'
  overallJudgment: '良好' | '要注意' | '要修理' | '危険'
  data: any // 各フォームの詳細データ
  createdAt: string
  updatedAt: string
}

export interface InspectionHistoryFilter {
  facilityId?: string
  inspectionType?: string
  startDate?: string
  endDate?: string
  status?: string
  overallJudgment?: string
}