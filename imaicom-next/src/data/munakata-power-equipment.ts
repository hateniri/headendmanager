// 宗像HE電源設備データ

export interface PowerEquipment {
  id: number
  category: string // 設備区分
  type: string // 項目
  name: string // 設備名（管理番号）
  location: string // 設置場所
  vendor: string // ベンダ名
  model: string // 機器名（型番）
  installDate: string // 設置年月
  lifespan: number // 耐用年数
  renewalDate: string // 更新年月
  owner: string // 設備所有者
  capacity: string // 容量（定格出力）
  remarks: string // 備考
  status: 'ok' | 'warning' | 'critical'
}

export const munakataPowerEquipment: PowerEquipment[] = [
  {
    id: 1,
    category: '受変電設備',
    type: 'トランス',
    name: '電灯',
    location: '屋外地上',
    vendor: '日立製作所',
    model: 'SOU-CR1',
    installDate: '2006年',
    lifespan: 20,
    renewalDate: '2026年',
    owner: 'SO',
    capacity: '100',
    remarks: '',
    status: 'ok'
  },
  {
    id: 2,
    category: '受変電設備',
    type: 'トランス',
    name: '動力',
    location: '屋外地上',
    vendor: '日立製作所',
    model: 'SOU-YDCR1',
    installDate: '2006年',
    lifespan: 20,
    renewalDate: '2026年',
    owner: 'SO',
    capacity: '200',
    remarks: 'スコット20kVA',
    status: 'ok'
  },
  {
    id: 3,
    category: '発電機',
    type: '本体',
    name: '発電機',
    location: '屋外',
    vendor: '三菱電機',
    model: 'PG-300QY-ROSS',
    installDate: '2024年3月',
    lifespan: 15,
    renewalDate: '2039年3月',
    owner: 'SO',
    capacity: '300',
    remarks: '2018年2月製／堺HEより移設更新',
    status: 'ok'
  },
  {
    id: 4,
    category: '発電機',
    type: '蓄電池',
    name: '蓄電池',
    location: '屋外',
    vendor: '日立化成',
    model: 'MSJ-150-2*12個',
    installDate: '2024年3月',
    lifespan: 11,
    renewalDate: '2031年1月',
    owner: 'SO',
    capacity: '',
    remarks: '2017年10月製／堺HEより移設更新',
    status: 'ok'
  },
  {
    id: 5,
    category: 'UPS',
    type: '本体',
    name: 'UPS',
    location: '1F HE室',
    vendor: '三菱電機',
    model: 'MELUPS-2031C（UP2031C-A403SJ）',
    installDate: '2024年3月',
    lifespan: 15,
    renewalDate: '2039年3月',
    owner: 'SO',
    capacity: '40kVA',
    remarks: '',
    status: 'ok'
  },
  {
    id: 6,
    category: 'UPS',
    type: '蓄電池',
    name: '蓄電池',
    location: '1F HE室',
    vendor: 'GSユアサ',
    model: 'MSEX-100-6*58個（174セル）',
    installDate: '2024年3月',
    lifespan: 9,
    renewalDate: '2033年3月',
    owner: 'SO',
    capacity: '',
    remarks: '',
    status: 'ok'
  },
  {
    id: 7,
    category: '整流器',
    type: '本体',
    name: '整流器A系',
    location: '1F HE室',
    vendor: '新電元工業',
    model: '48V800A整流器（600A/800A×3/4-D）',
    installDate: '2024年2月',
    lifespan: 15,
    renewalDate: '2039年2月',
    owner: 'SO',
    capacity: '600',
    remarks: '',
    status: 'ok'
  },
  {
    id: 8,
    category: '整流器',
    type: '蓄電池',
    name: 'A系蓄電池',
    location: '1F HE室',
    vendor: 'GSユアサ',
    model: 'MSEX-800*24個（MSEX-300*24+MSEX-500*24）',
    installDate: '2024年2月',
    lifespan: 9,
    renewalDate: '2033年2月',
    owner: 'SO',
    capacity: '',
    remarks: '',
    status: 'ok'
  },
  {
    id: 9,
    category: '整流器',
    type: '本体',
    name: '整流器B系',
    location: '1F HE室',
    vendor: 'GSユアサ インフラシステムズ',
    model: '-48V 200A×「3」/4（600A） 直流整流器（48V200A×3台/4）',
    installDate: '2022年12月',
    lifespan: 15,
    renewalDate: '2037年12月',
    owner: 'SO',
    capacity: '600',
    remarks: '',
    status: 'ok'
  },
  {
    id: 10,
    category: '整流器',
    type: '蓄電池',
    name: 'B系蓄電池',
    location: '1F HE室',
    vendor: 'GSユアサ',
    model: 'MSEX-800*24個（MSEX-300*24+MSEX-500*24）',
    installDate: '2022年12月',
    lifespan: 9,
    renewalDate: '2031年12月',
    owner: 'SO',
    capacity: '',
    remarks: '',
    status: 'ok'
  }
]

// カテゴリー別にグループ化
export const groupByCategory = (equipment: PowerEquipment[]) => {
  return equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, PowerEquipment[]>)
}

// 更新時期の判定
export const getUpdateStatus = (renewalDate: string): 'normal' | 'warning' | 'critical' => {
  const renewal = new Date(renewalDate)
  const now = new Date()
  const monthsUntilRenewal = (renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
  
  if (monthsUntilRenewal < 6) return 'critical'
  if (monthsUntilRenewal < 12) return 'warning'
  return 'normal'
}