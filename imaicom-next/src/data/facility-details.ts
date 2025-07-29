// 組織階層データを生成する関数
export function generateOrganizationChart(region: string, facilityId: string) {
  const regionalData = regionalManagers[region as keyof typeof regionalManagers]
  if (!regionalData) return null

  return {
    id: 'ceo',
    name: '今井 太郎',
    title: 'IMAICOM CEO',
    department: '経営本部',
    email: 'imai.taro@imaicom.jp',
    phone: '03-1111-0000',
    reports: [
      {
        id: 'cto',
        name: '技術 次郎',
        title: 'CTO',
        department: '技術統括本部',
        email: 'gijutsu.jiro@imaicom.jp',
        phone: '03-1111-1111',
        reports: [
          {
            id: 'network-director',
            name: '中央 三郎',
            title: 'ネットワーク統括部長',
            department: 'ネットワーク運用部',
            email: 'chuo.saburo@imaicom.jp',
            phone: '03-1111-2222',
            reports: [
              {
                id: regionalData.manager.email,
                name: regionalData.manager.name,
                title: regionalData.manager.title,
                department: `${region}エリア`,
                email: regionalData.manager.email,
                phone: regionalData.manager.phone,
                reports: [
                  {
                    id: `${facilityId}-facility-manager`,
                    name: `${region} 施設長`,
                    title: `${facilityId} 施設管理責任者`,
                    department: `${facilityId}`,
                    phone: regionalData.manager.mobile,
                    reports: regionalData.technicians.map((tech, index) => ({
                      id: `${facilityId}-tech-${index}`,
                      name: tech.name,
                      title: `技術担当（${tech.speciality}）`,
                      department: `${facilityId}`,
                      phone: tech.mobile
                    }))
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

// 地域ごとの管理者・技術者データ
export const regionalManagers = {
  北海道: {
    manager: {
      name: '北野 太郎',
      title: '北海道ネットワークセンター センター長',
      email: 'kitano.taro@imaicom.jp',
      phone: '011-1234-5678',
      mobile: '090-1111-1111',
      emergency: true,
      otherFacilities: ['HE_北海道_002', 'HE_北海道_003', 'HE_北海道_004']
    },
    technicians: [
      { name: '札幌 花子', speciality: '光伝送系', mobile: '090-1111-2222' },
      { name: '函館 一郎', speciality: '放送系', mobile: '090-1111-3333' },
      { name: '旭川 次郎', speciality: '電源設備', mobile: '090-1111-4444' }
    ]
  },
  東北: {
    manager: {
      name: '東山 花子',
      title: '東北ネットワークセンター センター長',
      email: 'higashiyama.hanako@imaicom.jp',
      phone: '022-1234-5678',
      mobile: '090-2222-1111',
      emergency: true,
      otherFacilities: ['HE_東北_015', 'HE_東北_016', 'HE_東北_017']
    },
    technicians: [
      { name: '仙台 明美', speciality: '光伝送系', mobile: '090-2222-2222' },
      { name: '青森 健太', speciality: '放送系', mobile: '090-2222-3333' },
      { name: '秋田 修', speciality: '電源設備', mobile: '090-2222-4444' }
    ]
  },
  関東: {
    manager: {
      name: '山田 太郎',
      title: '関東ネットワークセンター センター長',
      email: 'yamada.taro@imaicom.jp',
      phone: '03-1234-5678',
      mobile: '090-3333-1111',
      emergency: true,
      otherFacilities: ['HE_関東_028', 'HE_関東_029', 'HE_関東_030']
    },
    technicians: [
      { name: '佐藤 花子', speciality: '光伝送系', mobile: '090-3333-2222' },
      { name: '鈴木 一郎', speciality: '放送系', mobile: '090-3333-3333' },
      { name: '高橋 次郎', speciality: '電源設備', mobile: '090-3333-4444' }
    ]
  },
  中部: {
    manager: {
      name: '中村 健一',
      title: '中部ネットワークセンター センター長',
      email: 'nakamura.kenichi@imaicom.jp',
      phone: '052-1234-5678',
      mobile: '090-4444-1111',
      emergency: true,
      otherFacilities: ['HE_中部_041', 'HE_中部_042', 'HE_中部_043']
    },
    technicians: [
      { name: '名古屋 美香', speciality: '光伝送系', mobile: '090-4444-2222' },
      { name: '静岡 大輔', speciality: '放送系', mobile: '090-4444-3333' },
      { name: '新潟 真一', speciality: '電源設備', mobile: '090-4444-4444' }
    ]
  },
  関西: {
    manager: {
      name: '田中 京子',
      title: '関西ネットワークセンター センター長',
      email: 'tanaka.kyoko@imaicom.jp',
      phone: '06-1234-5678',
      mobile: '090-5555-1111',
      emergency: true,
      otherFacilities: ['HE_関西_054', 'HE_関西_055', 'HE_関西_056']
    },
    technicians: [
      { name: '伊藤 明美', speciality: '光伝送系', mobile: '090-5555-2222' },
      { name: '山本 健太', speciality: '放送系', mobile: '090-5555-3333' },
      { name: '中村 修', speciality: '電源設備', mobile: '090-5555-4444' }
    ]
  },
  中国: {
    manager: {
      name: '西田 正夫',
      title: '中国ネットワークセンター センター長',
      email: 'nishida.masao@imaicom.jp',
      phone: '082-1234-5678',
      mobile: '090-6666-1111',
      emergency: true,
      otherFacilities: ['HE_中国_066', 'HE_中国_067', 'HE_中国_068']
    },
    technicians: [
      { name: '広島 由美', speciality: '光伝送系', mobile: '090-6666-2222' },
      { name: '岡山 剛', speciality: '放送系', mobile: '090-6666-3333' },
      { name: '山口 誠', speciality: '電源設備', mobile: '090-6666-4444' }
    ]
  },
  四国: {
    manager: {
      name: '四宮 陽子',
      title: '四国ネットワークセンター センター長',
      email: 'shinomiya.yoko@imaicom.jp',
      phone: '087-1234-5678',
      mobile: '090-7777-1111',
      emergency: true,
      otherFacilities: ['HE_四国_078', 'HE_四国_079', 'HE_四国_080']
    },
    technicians: [
      { name: '高松 恵子', speciality: '光伝送系', mobile: '090-7777-2222' },
      { name: '松山 武', speciality: '放送系', mobile: '090-7777-3333' },
      { name: '徳島 光', speciality: '電源設備', mobile: '090-7777-4444' }
    ]
  },
  九州: {
    manager: {
      name: '九条 勝',
      title: '九州ネットワークセンター センター長',
      email: 'kujo.masaru@imaicom.jp',
      phone: '092-1234-5678',
      mobile: '090-8888-1111',
      emergency: true,
      otherFacilities: ['HE_九州_090', 'HE_九州_091', 'HE_九州_092']
    },
    technicians: [
      { name: '福岡 愛', speciality: '光伝送系', mobile: '090-8888-2222' },
      { name: '熊本 勇', speciality: '放送系', mobile: '090-8888-3333' },
      { name: '鹿児島 進', speciality: '電源設備', mobile: '090-8888-4444' }
    ]
  }
}

// 施設タイプごとの機器構成（リアルCATV機器）
export const equipmentTemplates = {
  large: [
    {
      type: 'QAM変調器',
      models: ['NSG-9000', 'QAM4000-16', 'D5-UEQ-48'],
      manufacturers: ['Harmonic', 'Cisco', 'ARRIS'],
      usefulLife: 7,
      powerConsumption: [0.85, 1.20, 0.95]
    },
    {
      type: 'CMTS',
      models: ['uBR10012', 'cBR-8-CCAP', 'C100G-16'],
      manufacturers: ['Cisco', 'Cisco', 'Casa Systems'],
      usefulLife: 7,
      powerConsumption: [1.20, 1.35, 1.10]
    },
    {
      type: '光送信器',
      models: ['OLT-XGS', 'HT-8100', 'OA-3200'],
      manufacturers: ['Sumitomo', 'RGB', 'EDFA'],
      usefulLife: 10,
      powerConsumption: [0.45, 0.52, 0.38]
    },
    {
      type: 'UPS（冗長系）',
      models: ['Smart-UPS SRT', 'SRT-10K', 'BN300T'],
      manufacturers: ['APC', 'APC', 'オムロン'],
      usefulLife: 6,
      powerConsumption: [1.40, 1.55, 1.25]
    },
    {
      type: 'エッジルーター',
      models: ['NCS-540', 'ASR9000', 'MX960'],
      manufacturers: ['Cisco', 'Cisco', 'Juniper'],
      usefulLife: 8,
      powerConsumption: [0.75, 1.02, 0.88]
    },
    {
      type: '伝送装置',
      models: ['iPASOLINK', 'NCS-2000', 'PTN-3900'],
      manufacturers: ['NEC', 'Cisco', 'Huawei'],
      usefulLife: 8,
      powerConsumption: [0.61, 0.72, 0.68]
    },
    {
      type: '映像エンコーダ',
      models: ['WJ-GXE500', 'PWS-4500', 'VEG-7000'],
      manufacturers: ['Panasonic', 'Sony', 'NEC'],
      usefulLife: 5,
      powerConsumption: [0.48, 0.52, 0.46]
    },
    {
      type: 'スイッチャー',
      models: ['XVS-G1', 'AWS-7500', 'VS-3000'],
      manufacturers: ['Sony', 'Sony', 'Panasonic'],
      usefulLife: 7,
      powerConsumption: [0.72, 0.85, 0.68]
    },
    {
      type: 'CASサーバ',
      models: ['CAS-3000', 'Nconnect', 'SecureMedia'],
      manufacturers: ['Nagra', 'Nagra', 'Verimatrix'],
      usefulLife: 5,
      powerConsumption: [0.65, 0.78, 0.62]
    },
    {
      type: 'IoTゲートウェイ',
      models: ['UNO-1372G', 'UNO-2484G', 'ARK-3500'],
      manufacturers: ['Advantech', 'Advantech', 'Advantech'],
      usefulLife: 5,
      powerConsumption: [0.35, 0.42, 0.38]
    }
  ],
  medium: [
    {
      type: 'QAM変調器',
      models: ['NSG-6000', 'QAM2000-8', 'D5-UEQ-24'],
      manufacturers: ['Harmonic', 'Cisco', 'ARRIS'],
      usefulLife: 7,
      powerConsumption: [0.72, 0.95, 0.78]
    },
    {
      type: 'CMTS',
      models: ['uBR7246VXR', 'cBR-8', 'C40G'],
      manufacturers: ['Cisco', 'Cisco', 'Casa Systems'],
      usefulLife: 7,
      powerConsumption: [0.95, 1.10, 0.88]
    },
    {
      type: '光送信器',
      models: ['OLT-2000', 'HT-6100', 'OA-2000'],
      manufacturers: ['Sumitomo', 'RGB', 'EDFA'],
      usefulLife: 10,
      powerConsumption: [0.38, 0.42, 0.35]
    },
    {
      type: 'UPS装置',
      models: ['Smart-UPS 3000', 'SRT-5K', 'BN200T'],
      manufacturers: ['APC', 'APC', 'オムロン'],
      usefulLife: 6,
      powerConsumption: [1.15, 1.25, 1.05]
    },
    {
      type: 'エッジルーター',
      models: ['ISR4000', 'ASR1000', 'SRX300'],
      manufacturers: ['Cisco', 'Cisco', 'Juniper'],
      usefulLife: 8,
      powerConsumption: [0.58, 0.72, 0.65]
    },
    {
      type: '映像エンコーダ',
      models: ['WJ-GXE300', 'PWS-3000', 'VEG-5000'],
      manufacturers: ['Panasonic', 'Sony', 'NEC'],
      usefulLife: 5,
      powerConsumption: [0.38, 0.42, 0.36]
    }
  ],
  small: [
    {
      type: 'QAM変調器',
      models: ['NSG-3000', 'QAM1000-4'],
      manufacturers: ['Harmonic', 'Cisco'],
      usefulLife: 7,
      powerConsumption: [0.52, 0.68]
    },
    {
      type: 'CMTS',
      models: ['uBR925', 'cBR-2'],
      manufacturers: ['Cisco', 'Cisco'],
      usefulLife: 7,
      powerConsumption: [0.65, 0.72]
    },
    {
      type: '光送信器',
      models: ['OLT-1000', 'HT-4100'],
      manufacturers: ['Sumitomo', 'RGB'],
      usefulLife: 10,
      powerConsumption: [0.28, 0.32]
    },
    {
      type: 'UPS装置',
      models: ['Smart-UPS 1500', 'BN100T'],
      manufacturers: ['APC', 'オムロン'],
      usefulLife: 6,
      powerConsumption: [0.85, 0.75]
    },
    {
      type: '映像エンコーダ',
      models: ['WJ-GXE100', 'PWS-2000'],
      manufacturers: ['Panasonic', 'Sony'],
      usefulLife: 5,
      powerConsumption: [0.28, 0.32]
    }
  ]
}

// 施設IDからタイプを判定
export function getFacilityType(facilityId: number): 'large' | 'medium' | 'small' {
  // 主要都市は大規模施設
  if ([1, 7, 23, 48, 51, 58, 65, 68].includes(facilityId)) return 'large'
  // 県庁所在地は中規模
  if (facilityId % 3 === 0) return 'medium'
  // その他は小規模
  return 'small'
}

// 機器データを生成（リアルCATV機器の詳細情報含む）
export function generateEquipmentForFacility(facilityId: number, facilityName: string) {
  const type = getFacilityType(facilityId)
  const templates = equipmentTemplates[type]
  const equipment: any[] = []
  
  let eqId = 1
  let rackCounter = 11  // RACK-011から開始
  
  templates.forEach((template, templateIndex) => {
    const count = type === 'large' ? Math.min(Math.floor(Math.random() * 3) + 2, 4) : 
                  type === 'medium' ? Math.min(Math.floor(Math.random() * 2) + 1, 3) : 1
    
    for (let i = 0; i < count; i++) {
      const modelIndex = Math.floor(Math.random() * template.models.length)
      const manufacturerIndex = Math.floor(Math.random() * template.manufacturers.length)
      const installYear = 2016 + Math.floor(Math.random() * 8)  // 2016-2023
      const installMonth = Math.floor(Math.random() * 12) + 1
      const installDay = Math.floor(Math.random() * 28) + 1
      
      // ステータスを決定（古い機器ほど問題が起きやすい）
      const age = 2025 - installYear
      let status: 'normal' | 'warning' | 'critical' | 'maintenance' = 'normal'
      if (age > 5 && Math.random() < 0.4) status = 'warning'
      if (age > 7 && Math.random() < 0.25) status = 'critical'
      if (Math.random() < 0.05) status = 'maintenance'
      
      // 温度とアラート状態の関連
      let temperature = 28 + Math.random() * 12
      if (status === 'critical') temperature = Math.max(temperature, 40)
      if (status === 'warning') temperature = Math.max(temperature, 35)
      
      // 消費電力（基準値 ± 10%）
      const basePower = template.powerConsumption[modelIndex]
      const powerConsumption = basePower * (0.9 + Math.random() * 0.2)
      
      // シリアル番号生成
      const manufacturerPrefix = {
        'Harmonic': 'HRM',
        'Cisco': 'CIS', 
        'ARRIS': 'ARR',
        'Casa Systems': 'CAS',
        'Sumitomo': 'SUM',
        'RGB': 'RGB',
        'EDFA': 'EDF',
        'APC': 'APC',
        'オムロン': 'OMR',
        'NEC': 'NEC',
        'Huawei': 'HUA',
        'Juniper': 'JUN',
        'Panasonic': 'PAN',
        'Sony': 'SNY',
        'Nagra': 'NAG',
        'Verimatrix': 'VER',
        'Advantech': 'ADV'
      }
      const prefix = manufacturerPrefix[template.manufacturers[manufacturerIndex] as keyof typeof manufacturerPrefix] || 'UNK'
      const serialNumber = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`
      
      // ラックとスロット情報
      const rackId = `RACK-${rackCounter.toString().padStart(3, '0')}`
      const slotNumber = Math.floor(Math.random() * 40) + 1
      
      // 備考生成
      const remarks = generateEquipmentRemarks(template.type, template.models[modelIndex], status, age)
      
      equipment.push({
        id: `EQ_${eqId.toString().padStart(5, '0')}`,
        assetId: `EQ_${eqId.toString().padStart(5, '0')}`,
        type: template.type,
        category: template.type,
        model: template.models[modelIndex],
        manufacturer: template.manufacturers[manufacturerIndex],
        installDate: `${installYear}-${installMonth.toString().padStart(2, '0')}-${installDay.toString().padStart(2, '0')}`,
        usefulLife: template.usefulLife,
        depreciationStatus: age >= template.usefulLife ? '償却済み' : '償却中',
        rackId: rackId,
        rack: rackId,
        slotNumber: slotNumber,
        facilityId: `HE_${facilityId.toString().padStart(3, '0')}`,
        floor: '1F',
        zone: templateIndex < 3 ? '南区画' : templateIndex < 6 ? '北区画' : '電源室',
        status,
        temperature: Math.round(temperature * 10) / 10,
        powerConsumption: Math.round(powerConsumption * 100) / 100,
        serialNumber: serialNumber,
        nextInspection: '2025-02-' + (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0'),
        lastInspection: '2025-01-' + (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0'),
        inspector: ['佐藤 花子', '鈴木 一郎', '高橋 次郎', '田中 太郎', '山田 花子'][Math.floor(Math.random() * 5)],
        inspectionResult: status === 'critical' ? '要交換' : status === 'warning' ? '注意' : '良',
        remarks: remarks,
        // 消費電力関連データ
        monthlyPowerConsumption: calculateMonthlyPowerConsumption(powerConsumption, status),
        monthlyCO2Emission: calculateMonthlyCO2Emission(powerConsumption, status)
      })
      eqId++
      
      // 一定確率でラック番号を進める
      if (Math.random() < 0.3) rackCounter++
    }
  })
  
  return equipment
}

// 機器の備考を生成
function generateEquipmentRemarks(type: string, model: string, status: string, age: number): string {
  const remarks: { [key: string]: string[] } = {
    'QAM変調器': [
      'IP伝送対応',
      'DOCSIS 3.1対応',
      '4K放送対応',
      'マルチキャスト配信',
      'QAM256対応'
    ],
    'CMTS': [
      '再起動回数増加傾向あり',
      'DOCSIS 3.1対応',
      'IPv6デュアルスタック',
      'ロードバランシング設定済み',
      'モデム認証強化済み'
    ],
    '光送信器': [
      '10Gbps PON対応',
      'WDM対応',
      'Long Reach対応',
      'ONU認証設定済み',
      'スプリッタ比1:32'
    ],
    'UPS（冗長系）': [
      '出力電圧安定中',
      'バッテリー交換予定',
      '無停電電源装置',
      '自動負荷テスト実施中',
      '異常時自動通知設定済み'
    ],
    'エッジルーター': [
      'STB管理VLAN兼用',
      'BGP設定済み',
      'QoS設定済み',
      'MPLS対応',
      '冗長化設定済み'
    ],
    '伝送装置': [
      '発熱過大／アラーム検知中',
      'ループバック設定済み',
      'SNMP監視対象',
      '回線冗長化済み',
      'マイクロ波伝送'
    ],
    '映像エンコーダ': [
      '4K H.265エンコーダ',
      'HDR対応',
      'MPEG-2/H.264/H.265対応',
      'リアルタイム配信',
      '多チャンネル同時処理'
    ],
    'スイッチャー': [
      '映像切替バックアップ系',
      '自動切替設定済み',
      '緊急割込み対応',
      'タイムシフト録画',
      '4K映像対応'
    ],
    'CASサーバ': [
      '認証応答遅延傾向',
      'スマートカード認証',
      'EMM/ECM配信',
      '視聴制御システム',
      'ペアレンタルコントロール'
    ],
    'IoTゲートウェイ': [
      'J:COM HOME／見守りIoT集約用',
      'センサーデータ収集',
      'MQTT対応',
      'LoRaWAN対応',
      'クラウド連携済み'
    ]
  }
  
  let remark = remarks[type]?.[Math.floor(Math.random() * remarks[type].length)] || '標準設定'
  
  if (status === 'critical') {
    remark += '／要緊急対応'
  } else if (status === 'warning') {
    remark += '／要監視'
  } else if (age > 6) {
    remark += '／更新検討対象'
  }
  
  return remark
}

// 月間消費電力量を計算 (kWh)
function calculateMonthlyPowerConsumption(hourlyPowerKW: number, status: string): number {
  // 基本計算: 時間消費電力 × 24時間 × 30日
  let baseConsumption = hourlyPowerKW * 24 * 30
  
  // ステータスによる補正
  switch (status) {
    case 'critical':
      // 異常状態では効率が悪化し、消費電力が増加
      baseConsumption *= 1.15
      break
    case 'warning':
      // 要注意状態では若干の効率低下
      baseConsumption *= 1.08
      break
    case 'maintenance':
      // メンテナンス中は停止時間があるため消費電力減少
      baseConsumption *= 0.3
      break
    default:
      // 正常時はそのまま
      break
  }
  
  return Math.round(baseConsumption * 100) / 100
}

// 月間CO₂排出量を計算 (kg)
function calculateMonthlyCO2Emission(hourlyPowerKW: number, status: string): number {
  // CO₂排出係数 (kg-CO₂/kWh)
  // 日本の電力会社平均: 約0.518 kg-CO₂/kWh (2022年度)
  const co2Factor = 0.518
  
  const monthlyPowerConsumption = calculateMonthlyPowerConsumption(hourlyPowerKW, status)
  const co2Emission = monthlyPowerConsumption * co2Factor
  
  return Math.round(co2Emission * 100) / 100
}

// 拠点全体の消費電力・CO₂排出量を計算
export function calculateFacilityPowerMetrics(equipment: any[]) {
  const totalMonthlyPower = equipment.reduce((sum, eq) => sum + (eq.monthlyPowerConsumption || 0), 0)
  const totalMonthlyCO2 = equipment.reduce((sum, eq) => sum + (eq.monthlyCO2Emission || 0), 0)
  
  // 年間計算
  const annualPowerConsumption = totalMonthlyPower * 12
  const annualCO2Emission = totalMonthlyCO2 * 12
  
  // 電気料金計算 (1kWh = 約30円として概算)
  const monthlyElectricityCost = totalMonthlyPower * 30
  const annualElectricityCost = monthlyElectricityCost * 12
  
  return {
    monthly: {
      powerConsumption: Math.round(totalMonthlyPower * 100) / 100,
      co2Emission: Math.round(totalMonthlyCO2 * 100) / 100,
      electricityCost: Math.round(monthlyElectricityCost)
    },
    annual: {
      powerConsumption: Math.round(annualPowerConsumption * 100) / 100,
      co2Emission: Math.round(annualCO2Emission * 100) / 100,
      electricityCost: Math.round(annualElectricityCost)
    },
    equipment: equipment.map(eq => ({
      id: eq.id,
      type: eq.type,
      monthlyPower: eq.monthlyPowerConsumption,
      monthlyCO2: eq.monthlyCO2Emission,
      status: eq.status
    }))
  }
}

// ラックデータを生成
export function generateRacksForFacility(facilityId: number) {
  const type = getFacilityType(facilityId)
  const rackCount = type === 'large' ? 8 : type === 'medium' ? 5 : 3
  const racks: any[] = []
  
  for (let i = 0; i < rackCount; i++) {
    const zone = i < rackCount / 2 ? '1F南区画' : i < rackCount * 0.75 ? '1F北区画' : '1F電源室'
    const temperature = 22 + Math.random() * 4
    let status: 'normal' | 'warning' | 'critical' = 'normal'
    
    if (temperature > 25) status = 'warning'
    if (temperature > 26) status = 'critical'
    if (Math.random() < 0.1) status = 'warning'
    if (Math.random() < 0.05) status = 'critical'
    
    racks.push({
      id: `${String.fromCharCode(65 + Math.floor(i / 2))}-${(i % 2 + 1).toString().padStart(2, '0')}`,
      zone,
      equipmentCount: Math.floor(Math.random() * 8) + 4,
      temperature: Math.round(temperature * 10) / 10,
      power: 'ON',
      status
    })
  }
  
  return racks
}

// 点検履歴を生成（カテゴリ別詳細項目対応）
export function generateInspectionHistory(facilityId: number) {
  const history: any[] = []
  const inspectors = ['佐藤 花子', '鈴木 一郎', '高橋 次郎', '伊藤 明美', '山本 健太']
  
  // Import inspection categories dynamically to avoid circular dependencies
  const { equipmentCategories, equipmentTypeToCategory } = require('./inspection-categories')
  const categoryKeys = Object.keys(equipmentCategories)
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(2025, 0, 27 - i * 2)
    const categoryKey = categoryKeys[i % categoryKeys.length]
    const category = equipmentCategories[categoryKey]
    
    // ランダムに機器を選択
    const equipmentTypes = Object.keys(equipmentTypeToCategory).filter(
      type => equipmentTypeToCategory[type] === categoryKey
    )
    const selectedEquipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]
    
    // カテゴリから3-5個の点検項目をランダム選択
    const selectedItems = []
    const itemCount = Math.min(3 + Math.floor(Math.random() * 3), category.inspectionItems.length)
    const shuffledItems = [...category.inspectionItems].sort(() => Math.random() - 0.5)
    
    for (let j = 0; j < itemCount; j++) {
      const inspectionItem = shuffledItems[j]
      const itemResult = generateInspectionItemResult(inspectionItem)
      selectedItems.push(itemResult)
    }
    
    // 全体の結果を決定
    const hasCritical = selectedItems.some(item => item.status === 'critical')
    const hasWarning = selectedItems.some(item => item.status === 'warning')
    const overallResult = hasCritical ? '要対応' : hasWarning ? '注意' : '良'
    
    // 全体コメント生成
    const overallComment = generateOverallComment(category.name, selectedItems, overallResult)
    
    history.push({
      id: `INS-${facilityId.toString().padStart(3, '0')}-${(i + 1).toString().padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 8) + 9}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
      inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
      category: category.name,
      target: selectedEquipment,
      result: overallResult,
      comment: overallComment,
      items: selectedItems,
      hasPhoto: Math.random() < 0.7,
      duration: Math.floor(Math.random() * 60) + 30, // 30-90分
      followUpRequired: overallResult !== '良'
    })
  }
  
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 点検項目の結果を生成
function generateInspectionItemResult(inspectionItem: any) {
  // 結果の確率分布: 正常70%, 要注意20%, 要対応10%
  const rand = Math.random()
  let status: 'normal' | 'warning' | 'critical' = 'normal'
  let measuredValue: string | null = null
  let comment: string | null = null
  
  if (rand < 0.1) {
    status = 'critical'
  } else if (rand < 0.3) {
    status = 'warning'
  }
  
  // 測定値がある項目の場合、実際の値を生成
  if (inspectionItem.normalRange) {
    const result = generateMeasuredValue(inspectionItem, status)
    measuredValue = result.value
    comment = result.comment
  } else {
    // 測定値がない項目の場合、状態に応じたコメント
    comment = generateQualitativeComment(inspectionItem.name, status)
  }
  
  return {
    name: inspectionItem.name,
    status,
    measuredValue,
    unit: inspectionItem.unit,
    normalRange: inspectionItem.normalRange,
    comment
  }
}

// 測定値を生成
function generateMeasuredValue(inspectionItem: any, status: 'normal' | 'warning' | 'critical') {
  const { normalRange, warningThreshold, criticalThreshold, unit } = inspectionItem
  
  // 各項目に応じた値生成ロジック
  switch (inspectionItem.id) {
    case 'video-input-level':
      if (status === 'critical') return { value: '5e-4', comment: 'BER値が規定を大幅に超過。信号品質要対策。' }
      if (status === 'warning') return { value: '5e-6', comment: 'BER値がやや高い。継続監視必要。' }
      return { value: '1e-7', comment: '良好な信号品質を確認。' }
      
    case 'thermal-trend':
    case 'temperature-alarm':
      if (status === 'critical') return { value: '75', comment: '危険温度に達している。即座の冷却対策必要。' }
      if (status === 'warning') return { value: '65', comment: '温度がやや高い。冷却状況要確認。' }
      return { value: '45', comment: '適正温度範囲内で動作中。' }
      
    case 'fan-rpm':
      if (status === 'critical') return { value: '1200', comment: 'ファン回転数低下。交換検討必要。' }
      if (status === 'warning') return { value: '1800', comment: 'ファン回転数やや低下。清掃推奨。' }
      return { value: '2400', comment: 'ファン正常動作確認。' }
      
    case 'port-error-rate':
    case 'packet-drop-rate':
      if (status === 'critical') return { value: '1.2', comment: 'エラー率が許容値を超過。回線要点検。' }
      if (status === 'warning') return { value: '0.05', comment: 'エラー率がやや高い。継続監視。' }
      return { value: '0.001', comment: 'エラー率正常範囲内。' }
      
    case 'cpu-ram-usage':
    case 'mac-domain-usage':
      if (status === 'critical') return { value: '92', comment: '使用率が危険レベル。負荷分散要検討。' }
      if (status === 'warning') return { value: '78', comment: '使用率が高め。監視継続。' }
      return { value: '45', comment: '使用率正常範囲内。' }
      
    case 'output-voltage-current':
      if (status === 'critical') return { value: '185', comment: '電圧低下。電源系統要点検。' }
      if (status === 'warning') return { value: '195', comment: '電圧やや低い。継続監視。' }
      return { value: '220', comment: '電圧正常値。' }
      
    case 'fuel-gas-level':
      if (status === 'critical') return { value: '35', comment: '燃料残量危険レベル。至急補給必要。' }
      if (status === 'warning') return { value: '65', comment: '燃料残量減少。補給計画立案。' }
      return { value: '85', comment: '燃料残量十分。' }
      
    case 'intake-exhaust-temp-diff':
      if (status === 'critical') return { value: '22', comment: '温度差過大。冷却効率大幅低下。' }
      if (status === 'warning') return { value: '17', comment: '温度差やや大きい。フィルタ確認推奨。' }
      return { value: '12', comment: '適正な温度差。冷却効率良好。' }
      
    case 'humidity-condensation':
      if (status === 'critical') return { value: '75', comment: '湿度過多。結露リスクあり。' }
      if (status === 'warning') return { value: '65', comment: '湿度やや高い。除湿検討。' }
      return { value: '50', comment: '湿度適正範囲内。' }
      
    case 'fan-airflow':
      if (status === 'critical') return { value: '55', comment: 'エアフロー不足。ファン交換必要。' }
      if (status === 'warning') return { value: '70', comment: 'エアフロー低下気味。清掃推奨。' }
      return { value: '90', comment: 'エアフロー良好。' }
      
    default:
      // デフォルトの数値生成
      const baseValue = 50
      if (status === 'critical') return { value: (baseValue * 1.5).toString(), comment: '測定値が規定を超過。' }
      if (status === 'warning') return { value: (baseValue * 1.2).toString(), comment: '測定値がやや高い。' }
      return { value: baseValue.toString(), comment: '測定値正常範囲内。' }
  }
}

// 定性的コメント生成（測定値がない項目用）
function generateQualitativeComment(itemName: string, status: 'normal' | 'warning' | 'critical') {
  const comments = {
    normal: ['正常動作確認', '問題なし', '適正状態', '良好'],
    warning: ['軽微な異常あり', '要継続監視', '改善推奨', '注意が必要'],
    critical: ['重大な問題発見', '即座の対応必要', '緊急対策要', '要修理']
  }
  
  const statusComments = comments[status]
  return statusComments[Math.floor(Math.random() * statusComments.length)]
}

// 全体コメント生成
function generateOverallComment(categoryName: string, items: any[], result: string) {
  const criticalItems = items.filter(item => item.status === 'critical')
  const warningItems = items.filter(item => item.status === 'warning')
  
  if (result === '要対応') {
    return `${categoryName}において重大な問題を確認。${criticalItems.map(item => item.name).join('、')}で異常値検出。即座の対応が必要です。`
  } else if (result === '注意') {
    return `${categoryName}の点検完了。${warningItems.map(item => item.name).join('、')}で要注意事項あり。継続監視を推奨します。`
  } else {
    return `${categoryName}の全項目で正常動作を確認。予防保全計画に従い、次回点検まで正常運用可能です。`
  }
}

// 重大問題のコメント生成
function generateCriticalComment(category: string, item: string): string {
  const comments: { [key: string]: { [key: string]: string[] } } = {
    '映像処理機器': {
      '映像入力レベル確認': ['BER値が1e-4を超過。信号品質劣化により要対策。', '入力信号レベル異常。アンテナ系統の点検が必要。'],
      '内部温度測定': ['内部温度75°C超過。冷却システム異常の可能性。', 'サーマルアラート発生。ファン交換が必要。'],
      'ファン回転数チェック': ['ファン停止確認。即座の交換が必要。', '回転数1000RPM以下。冷却能力不足。']
    },
    '通信系装置': {
      'ポートエラーレート測定': ['CRCエラー率0.5%超過。回線品質要確認。', 'FECエラー多発。光ファイバ接続点検必要。'],
      '温度アラーム確認': ['温度65°C超過。通信断リスク高。', 'サーマルシャットダウン寸前。緊急冷却必要。']
    },
    'ネットワーク機器': {
      'CPU/RAM使用率確認': ['CPU使用率95%継続。処理能力限界。', 'メモリ使用率98%。メモリ不足によるパフォーマンス劣化。'],
      'パケットドロップ率測定': ['パケットドロップ率5%超過。ネットワーク性能劣化。']
    },
    '電源系統': {
      'バッテリテスト実施': ['バッテリ容量50%以下。交換時期超過。', '放電テストで異常セル検出。バッテリ交換必要。'],
      '出力電圧/電流測定': ['出力電圧180V低下。負荷制限が必要。']
    },
    '空調・環境': {
      'フィルタ目詰まり確認': ['フィルタ完全目詰まり。エアフロー50%低下。', '差圧異常値。即座のフィルタ交換必要。'],
      '吸排気温度差測定': ['温度差25°C超過。冷却効率大幅低下。']
    }
  }
  
  const categoryComments = comments[category]?.[item]
  return categoryComments?.[Math.floor(Math.random() * categoryComments.length)] || `${item}で重大な異常を検出。即座の対応が必要。`
}

// 注意レベルのコメント生成
function generateWarningComment(category: string, item: string): string {
  const comments: { [key: string]: { [key: string]: string[] } } = {
    '映像処理機器': {
      '映像入力レベル確認': ['BER値が基準値をわずかに超過。継続監視が必要。', '信号レベルに軽微な変動あり。'],
      '内部温度測定': ['内部温度65°C。基準値超過。冷却状況要確認。', '温度上昇傾向。夏期対策の検討が必要。'],
      'ファン回転数チェック': ['ファン回転数1800RPM。基準値を下回る。', '軽微な異音確認。予防保全で交換検討。']
    },
    '通信系装置': {
      'ポートエラーレート測定': ['エラー率0.05%。基準値内だが要監視。', '軽微なCRCエラー発生。回線状況要確認。'],
      '温度アラーム確認': ['温度55°C。警告レベル到達。', '温度上昇傾向。冷却効率要確認。']
    },
    'ネットワーク機器': {
      'CPU/RAM使用率確認': ['CPU使用率75%。負荷増加傾向。', 'メモリ使用率80%。リソース状況要監視。'],
      'パケットドロップ率測定': ['パケットドロップ率0.5%。軽微だが要監視。']
    },
    '電源系統': {
      'バッテリテスト実施': ['バッテリ容量75%。交換時期接近。', '一部セルの性能低下確認。継続監視必要。'],
      '出力電圧/電流測定': ['出力電圧195V。基準値内だが低め。']
    },
    '空調・環境': {
      'フィルタ目詰まり確認': ['フィルタ汚れ蓄積。次回定期清掃で交換推奨。', '差圧上昇傾向。清掃時期の前倒し検討。'],
      '吸排気温度差測定': ['温度差18°C。効率低下の兆候。']
    }
  }
  
  const categoryComments = comments[category]?.[item]
  return categoryComments?.[Math.floor(Math.random() * categoryComments.length)] || `${item}で軽微な異常を確認。継続監視が必要。`
}

// カテゴリ別測定値生成
function generateMeasurements(category: string, item: string, result: string): any {
  const measurements: any = {}
  
  switch (category) {
    case '映像処理機器':
      if (item.includes('温度')) {
        const baseTemp = result === '要対応' ? 75 : result === '注意' ? 65 : 45
        measurements.temperature = (baseTemp + Math.random() * 5).toFixed(1)
        measurements.unit = '°C'
      }
      if (item.includes('ファン')) {
        const baseRpm = result === '要対応' ? 800 : result === '注意' ? 1800 : 2200
        measurements.fanSpeed = Math.floor(baseRpm + Math.random() * 200)
        measurements.unit = 'RPM'
      }
      break
      
    case '通信系装置':
      if (item.includes('エラーレート')) {
        const baseError = result === '要対応' ? 0.5 : result === '注意' ? 0.05 : 0.001
        measurements.errorRate = (baseError + Math.random() * 0.01).toFixed(3)
        measurements.unit = '%'
      }
      if (item.includes('温度')) {
        const baseTemp = result === '要対応' ? 65 : result === '注意' ? 55 : 40
        measurements.temperature = (baseTemp + Math.random() * 3).toFixed(1)
        measurements.unit = '°C'
      }
      break
      
    case 'ネットワーク機器':
      if (item.includes('CPU')) {
        const baseCpu = result === '要対応' ? 95 : result === '注意' ? 75 : 45
        measurements.cpuUsage = Math.floor(baseCpu + Math.random() * 5)
        measurements.unit = '%'
      }
      if (item.includes('パケット')) {
        const baseDrop = result === '要対応' ? 5 : result === '注意' ? 0.5 : 0.01
        measurements.dropRate = (baseDrop + Math.random() * 0.1).toFixed(2)
        measurements.unit = '%'
      }
      break
      
    case '電源系統':
      if (item.includes('電圧')) {
        const baseVoltage = result === '要対応' ? 180 : result === '注意' ? 195 : 220
        measurements.voltage = (baseVoltage + Math.random() * 10).toFixed(1)
        measurements.unit = 'V'
      }
      if (item.includes('バッテリ')) {
        const baseCapacity = result === '要対応' ? 50 : result === '注意' ? 75 : 95
        measurements.batteryCapacity = Math.floor(baseCapacity + Math.random() * 5)
        measurements.unit = '%'
      }
      break
      
    case '空調・環境':
      if (item.includes('温度差')) {
        const baseTempDiff = result === '要対応' ? 25 : result === '注意' ? 18 : 12
        measurements.temperatureDiff = (baseTempDiff + Math.random() * 2).toFixed(1)
        measurements.unit = '°C'
      }
      if (item.includes('湿度')) {
        const baseHumidity = result === '要対応' ? 75 : result === '注意' ? 65 : 50
        measurements.humidity = Math.floor(baseHumidity + Math.random() * 5)
        measurements.unit = '%RH'
      }
      break
  }
  
  return measurements
}

// 障害履歴を生成
export function generateIncidents(facilityId: number, equipment: any[]) {
  const incidents: any[] = []
  const issues = ['通信断', 'エンコードエラー', '電源異常', '温度上昇', 'ファン停止']
  const causes = ['経年劣化', 'ファームウェア不具合', '外部要因', '設定ミス', '部品故障']
  const actions = ['部品交換', 'ファームウェア更新', '設定変更', '再起動', '清掃実施']
  
  // 障害が多い施設と少ない施設を作る
  const incidentCount = facilityId % 7 === 0 ? 3 : facilityId % 11 === 0 ? 2 : 1
  
  for (let i = 0; i < incidentCount && i < equipment.length; i++) {
    const eq = equipment[Math.floor(Math.random() * equipment.length)]
    const date = new Date(2025, 0, Math.floor(Math.random() * 25) + 1)
    
    incidents.push({
      id: `INC-${facilityId.toString().padStart(3, '0')}-${(i + 1).toString().padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      equipment: `${eq.type} ${eq.model}`,
      issue: issues[Math.floor(Math.random() * issues.length)],
      cause: causes[Math.floor(Math.random() * causes.length)],
      responder: ['鈴木 一郎', '高橋 次郎'][Math.floor(Math.random() * 2)],
      action: actions[Math.floor(Math.random() * actions.length)],
      recoveryDate: date.toISOString().split('T')[0],
      result: '完了'
    })
  }
  
  return incidents
}

// 修理依頼を生成
export function generateRepairs(facilityId: number, equipment: any[]) {
  const repairs: any[] = []
  
  // criticalステータスの機器に対して修理依頼を作成
  const criticalEquipment = equipment.filter(eq => eq.status === 'critical')
  
  criticalEquipment.forEach((eq, index) => {
    if (index < 2) { // 最大2件まで
      repairs.push({
        id: `REP-${facilityId.toString().padStart(3, '0')}-${(index + 1).toString().padStart(3, '0')}`,
        issueDate: '2025-01-25',
        status: index === 0 ? '対応中' : '承認待ち',
        equipment: `${eq.type} ${eq.model}`,
        priority: eq.type === 'UPS装置' ? 'high' : 'medium',
        assignee: ['高橋 次郎', '山本 健太'][index % 2],
        deadline: `2025-02-${(index + 1).toString().padStart(2, '0')}`
      })
    }
  })
  
  return repairs
}