// Asset data for CMDB asset management with enhanced facility-centric features
export interface Asset {
  id: string
  assetId: string // 資産ID (EQ_0054など)
  accountingId?: string // 会計ID
  name: string // 機器名
  model: string // 型番
  manufacturer: string // メーカー名
  category: 'video-processing' | 'communication' | 'network' | 'power' | 'environmental' // 機器カテゴリ
  facilityId: string // 拠点ID
  rackId: string // ラックID
  rackSlot?: number // スロット位置（U番号）
  acquisitionDate: string // 取得年月
  installationDate: string // 設置日（必須に変更）
  estimatedEndOfLife: string // 推定寿命・交換予定日
  purchaseAmount: number // 購入額
  usefulLife: number // 耐用年数（年）
  depreciationMethod: 'straight-line' | 'declining-balance' | 'lump-sum' // 償却方法
  accumulatedDepreciation: number // 累計償却額
  bookValue: number // 帳簿価額
  depreciationEndDate: string // 償却終了年度
  
  // 運用状態管理（強化）
  operationalStatus: 'normal' | 'warning' | 'critical' | 'offline' | 'maintenance' | 'retired' // 稼働状態
  assetLifecycleStatus: 'new' | 'in-service' | 'needs-replacement' | 'scheduled-disposal' | 'disposed' // ライフサイクル状態
  assetType: 'owned' | 'leased' | 'construction-in-progress' // 資産区分
  
  // 電力・環境情報
  powerKw: number // 消費電力（kW）
  monthlyPowerConsumption?: number // 月間消費電力（kWh）
  monthlyCO2Emission?: number // 月間CO₂排出量（kg）
  currentTemperature?: number // 現在温度（°C）
  maxOperatingTemp: number // 最大動作温度
  
  // 点検・保守情報
  lastInspectionDate?: string // 最終点検日
  nextInspectionDate?: string // 次回点検予定日
  inspectionFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' // 点検頻度
  maintenanceContract?: string // 保守契約情報
  warrantyEndDate?: string // 保証期限
  
  // 担当者・履歴
  installer?: string // 設置担当者
  currentResponsible?: string // 現在の責任者
  managerUserId?: string // 管理責任者ID
  lastModifiedBy?: string // 最終更新者
  lastModifiedDate?: string // 最終更新日
  
  // 在庫・予備品情報
  serialNumber?: string // シリアル番号
  firmwareVersion?: string // ファームウェアバージョン
  configBackupDate?: string // 設定バックアップ日
  sparePartAvailable?: boolean // 予備品在庫あり
  replacementAssetId?: string // 交換対象機器ID
  
  notes?: string // 備考
  tags?: string[] // タグ（検索・分類用）
}

// 年度別償却データ
export interface DepreciationSchedule {
  year: number
  amount: number
  accumulatedAmount: number
  bookValue: number
}

// モックデータ生成
function generateAssets(): Asset[] {
  const assets: Asset[] = []
  const facilities = ['HE_001', 'HE_002', 'HE_003', 'HE_004', 'HE_005']
  const assetTypes = ['owned', 'leased', 'owned', 'owned', 'leased'] as const
  
  const equipmentTypes = [
    { name: 'Harmonic QAM変調器', model: 'NSG-9000', life: 7, price: 5800000 },
    { name: 'Cisco QAM変調器', model: 'QAM4000-16', life: 7, price: 2980000 },
    { name: 'ARRIS QAM変調器', model: 'D5-UEQ-48', life: 7, price: 3500000 },
    { name: 'Cisco CMTS', model: 'uBR10012', life: 7, price: 8500000 },
    { name: 'Cisco CMTS', model: 'cBR-8-CCAP', life: 7, price: 9200000 },
    { name: 'Casa Systems CMTS', model: 'C100G-16', life: 7, price: 7800000 },
    { name: 'Sumitomo 光送信器', model: 'OLT-XGS', life: 10, price: 1500000 },
    { name: 'RGB 光送信機', model: 'HT-8100', life: 10, price: 1200000 },
    { name: 'EDFA 光増幅器', model: 'OA-3200', life: 10, price: 980000 },
    { name: 'APC UPS装置', model: 'Smart-UPS SRT', life: 6, price: 850000 },
    { name: 'Cisco エッジルーター', model: 'NCS-540', life: 8, price: 1850000 },
    { name: 'NEC 伝送装置', model: 'iPASOLINK', life: 8, price: 2200000 },
    { name: 'Panasonic 映像エンコーダ', model: 'WJ-GXE500', life: 5, price: 1200000 },
    { name: 'Sony スイッチャー', model: 'XVS-G1', life: 7, price: 2800000 },
    { name: 'Nagra CASサーバ', model: 'CAS-3000', life: 5, price: 3200000 },
    { name: 'Advantech IoTゲートウェイ', model: 'UNO-1372G', life: 5, price: 180000 },
    { name: '空調設備', model: 'PAC-40', life: 15, price: 2400000 },
    { name: 'ラック設備', model: 'SR-42U', life: 15, price: 180000 }
  ]
  
  let assetIndex = 1
  
  // 各拠点に設備を配置
  facilities.forEach((facilityId, facilityIndex) => {
    // 各拠点に10-20台の設備を配置
    const equipmentCount = Math.floor(Math.random() * 10) + 10
    
    for (let i = 0; i < equipmentCount; i++) {
      const equipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]
      const rackNumber = Math.floor(i / 5) + 1
      
      // 取得年をランダムに設定（2015-2024）
      const acquisitionYear = 2015 + Math.floor(Math.random() * 10)
      const acquisitionMonth = Math.floor(Math.random() * 12) + 1
      const acquisitionDate = `${acquisitionYear}-${String(acquisitionMonth).padStart(2, '0')}-01`
      
      // 減価償却計算
      const currentYear = 2024
      const yearsElapsed = currentYear - acquisitionYear
      const depreciationPerYear = equipment.price / equipment.life
      const accumulatedDepreciation = Math.min(depreciationPerYear * yearsElapsed, equipment.price * 0.95) // 残存価額5%
      const bookValue = Math.max(equipment.price - accumulatedDepreciation, equipment.price * 0.05)
      
      // 償却終了年度
      const depreciationEndYear = acquisitionYear + equipment.life
      const depreciationEndDate = `${depreciationEndYear}-03-31`
      
      // ステータス判定
      let assetLifecycleStatus: Asset['assetLifecycleStatus'] = 'in-service'
      if (yearsElapsed >= equipment.life) {
        assetLifecycleStatus = 'needs-replacement'
      } else if (yearsElapsed >= equipment.life - 1) {
        assetLifecycleStatus = 'scheduled-disposal'
      }
      
      const asset: Asset = {
        id: String(assetIndex),
        assetId: `EQ_${String(assetIndex).padStart(4, '0')}`,
        accountingId: `ACC_${acquisitionYear}_${String(assetIndex).padStart(4, '0')}`,
        name: equipment.name,
        model: equipment.model,
        facilityId: facilityId,
        rackId: `RACK-${rackNumber}${String(i % 5 + 1).padStart(2, '0')}`,
        acquisitionDate,
        purchaseAmount: equipment.price,
        usefulLife: equipment.life,
        depreciationMethod: equipment.price < 300000 ? 'lump-sum' : 'straight-line',
        accumulatedDepreciation: Math.floor(accumulatedDepreciation),
        bookValue: Math.floor(bookValue),
        depreciationEndDate,
        assetLifecycleStatus,
        operationalStatus: 'normal',
        assetType: assetTypes[facilityIndex % assetTypes.length],
        installationDate: acquisitionDate,
        installer: `設置チーム${(facilityIndex % 3) + 1}`,
        notes: i % 3 === 0 ? '定期点検対象' : undefined,
        manufacturer: equipment.name.split(' ')[0], // Extract manufacturer from name
        category: 'video-processing', // Default category
        estimatedEndOfLife: `${acquisitionYear + equipment.life}-03-31`,
        powerKw: Math.random() * 2 + 0.5, // Random power consumption 0.5-2.5kW
        maxOperatingTemp: 45, // Default max operating temp
        inspectionFrequency: 'quarterly',
        rackSlot: Math.floor(Math.random() * 42) + 1
      }
      
      assets.push(asset)
      assetIndex++
    }
  })
  
  return assets
}

// 償却スケジュール計算
export function calculateDepreciationSchedule(asset: Asset): DepreciationSchedule[] {
  const schedule: DepreciationSchedule[] = []
  const startYear = new Date(asset.acquisitionDate).getFullYear()
  const endYear = startYear + asset.usefulLife
  
  let accumulatedAmount = 0
  
  for (let year = startYear; year <= endYear; year++) {
    let annualDepreciation = 0
    
    if (asset.depreciationMethod === 'straight-line') {
      // 定額法
      annualDepreciation = asset.purchaseAmount / asset.usefulLife
    } else if (asset.depreciationMethod === 'declining-balance') {
      // 定率法（簡易計算）
      const rate = 2 / asset.usefulLife
      const remainingValue = asset.purchaseAmount - accumulatedAmount
      annualDepreciation = remainingValue * rate
    } else if (asset.depreciationMethod === 'lump-sum') {
      // 一括償却
      if (year === startYear) {
        annualDepreciation = asset.purchaseAmount
      }
    }
    
    // 残存価額5%を下回らないように調整
    const minBookValue = asset.purchaseAmount * 0.05
    if (asset.purchaseAmount - accumulatedAmount - annualDepreciation < minBookValue) {
      annualDepreciation = asset.purchaseAmount - accumulatedAmount - minBookValue
    }
    
    accumulatedAmount += annualDepreciation
    
    schedule.push({
      year,
      amount: Math.floor(annualDepreciation),
      accumulatedAmount: Math.floor(accumulatedAmount),
      bookValue: Math.floor(asset.purchaseAmount - accumulatedAmount)
    })
    
    if (asset.purchaseAmount - accumulatedAmount <= minBookValue) {
      break
    }
  }
  
  return schedule
}

// 集計データ取得
export function getAssetSummary(assets: Asset[]) {
  const totalAssets = assets.length
  const needsReplacement = assets.filter(a => a.assetLifecycleStatus === 'needs-replacement').length
  const scheduledDisposal = assets.filter(a => a.assetLifecycleStatus === 'scheduled-disposal').length
  const totalAcquisitionCost = assets.reduce((sum, a) => sum + a.purchaseAmount, 0)
  const totalBookValue = assets.reduce((sum, a) => sum + a.bookValue, 0)
  
  // 年度別償却終了数
  const depreciationByYear: { [year: string]: number } = {}
  assets.forEach(asset => {
    const year = new Date(asset.depreciationEndDate).getFullYear()
    depreciationByYear[year] = (depreciationByYear[year] || 0) + 1
  })
  
  return {
    totalAssets,
    needsReplacement,
    scheduledDisposal,
    currentYearDepreciation: depreciationByYear[2025] || 0,
    totalAcquisitionCost,
    totalBookValue,
    depreciationByYear
  }
}

export const mockAssets = generateAssets()