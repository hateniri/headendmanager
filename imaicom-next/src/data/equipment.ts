// 宗像SHE 設備管理データベース

export interface BatteryEquipment {
  id: string
  type: 'UPS' | 'RECT'
  location: string
  model: string
  manufacturer: string
  system: string
  quantity: number
  manufactureDate: string
  voltageRange: string
  internalResistance: string
  status: '○' | '×' | '△'
  inspectionDate: string
}

export interface GeneratorEquipment {
  id: string
  type: string
  location: string
  model: string
  manufacturer: string
  manufactureDate: string
  batteryModel: string
  batteryQuantity: number
  voltage: string
  internalResistance: string
  status: '○' | '×' | '△'
  inspectionDate: string
  remarks: string
}

export interface FireDetectionEquipment {
  id: string
  type: string
  location: string
  model: string
  manufacturer: string
  installDate: string
  partsReplacementDate: string
  replacedParts: string
  inspectionResult: string
}

// 蓄電池関連（UPS・RECT）
export const batteryEquipments: BatteryEquipment[] = [
  {
    id: 'UPS01',
    type: 'UPS',
    location: '1階 HE室',
    model: 'UP2301C-A403SJ',
    manufacturer: '三菱電機',
    system: '40kVA',
    quantity: 58,
    manufactureDate: '2024年2月',
    voltageRange: '6.49〜6.89',
    internalResistance: '1.72〜1.91',
    status: '○',
    inspectionDate: '2024/6/20'
  },
  {
    id: 'RECT01',
    type: 'RECT',
    location: '1階 UPS室',
    model: 'SD-48V800A',
    manufacturer: '新電元',
    system: 'A系-前',
    quantity: 24,
    manufactureDate: '2024年1月',
    voltageRange: '2.23〜2.25',
    internalResistance: '0.18〜0.23',
    status: '○',
    inspectionDate: '2024/6/20'
  },
  {
    id: 'RECT02',
    type: 'RECT',
    location: '1階 UPS室',
    model: 'SD-48V800A',
    manufacturer: '新電元',
    system: 'A系-後',
    quantity: 24,
    manufactureDate: '2024年1月',
    voltageRange: '2.23〜2.24',
    internalResistance: '0.24〜0.27',
    status: '○',
    inspectionDate: '2024/6/20'
  },
  {
    id: 'RECT03',
    type: 'RECT',
    location: '1階 HE室',
    model: '-48V800A',
    manufacturer: 'GSユアサ',
    system: 'B系-前',
    quantity: 24,
    manufactureDate: '2022年11月',
    voltageRange: '2.22〜2.24',
    internalResistance: '0.20〜0.32',
    status: '○',
    inspectionDate: '2024/6/20'
  },
  {
    id: 'RECT04',
    type: 'RECT',
    location: '1階 HE室',
    model: '-48V800A',
    manufacturer: 'GSユアサ',
    system: 'B系-後',
    quantity: 24,
    manufactureDate: '2022年11月',
    voltageRange: '2.23〜2.25',
    internalResistance: '0.27〜0.35',
    status: '○',
    inspectionDate: '2024/6/20'
  }
]

// 発電機および制御盤（屋外）
export const generatorEquipments: GeneratorEquipment[] = [
  {
    id: 'GEN01',
    type: '非常用発電機',
    location: '屋外',
    model: 'PG300QY-ROSS',
    manufacturer: '三菱電機',
    manufactureDate: '2017年10月',
    batteryModel: 'MSJ-150',
    batteryQuantity: 12,
    voltage: '2.10〜2.36',
    internalResistance: '0.71〜0.77',
    status: '○',
    inspectionDate: '2024/6/20',
    remarks: '旧堺HEからの移設品。騒音、振動、絶縁測定も実施済み'
  }
]

// 火災予兆検知システム
export const fireDetectionEquipments: FireDetectionEquipment[] = [
  {
    id: 'FIRE01',
    type: '警報盤',
    location: 'HE室',
    model: 'FPEJ001-2/3L',
    manufacturer: '能美防災',
    installDate: '2019年2月',
    partsReplacementDate: '2024年9月',
    replacedParts: 'バッテリー、AC/DC、吸引ファン、フィルタ等',
    inspectionResult: '良好'
  },
  {
    id: 'FIRE02',
    type: 'センサ',
    location: 'HE室',
    model: 'FDNJ001A-R',
    manufacturer: '能美防災',
    installDate: '2019年2月',
    partsReplacementDate: '2024年9月',
    replacedParts: 'フィルタ、ファン',
    inspectionResult: '良好'
  },
  {
    id: 'FIRE03',
    type: 'センサ',
    location: 'UPS室',
    model: 'FDNJ001A-R',
    manufacturer: '能美防災',
    installDate: '2019年2月',
    partsReplacementDate: '2024年9月',
    replacedParts: 'フィルタ、ファン',
    inspectionResult: '良好'
  },
  {
    id: 'FIRE04',
    type: 'ポータブルセンサ',
    location: 'HE室',
    model: 'PDNJ001A-H',
    manufacturer: '能美防災',
    installDate: '2019年2月',
    partsReplacementDate: '2024年9月',
    replacedParts: 'バッテリー',
    inspectionResult: '良好'
  }
]