// 機材カテゴリ別の点検・メンテナンス重点項目

export interface InspectionItem {
  id: string
  name: string
  description: string
  category: string
  checkMethod: string
  normalRange?: string
  warningThreshold?: string
  criticalThreshold?: string
  unit?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
}

export interface EquipmentCategory {
  id: string
  name: string
  description: string
  inspectionItems: InspectionItem[]
  commonIssues: string[]
  maintenanceCycle: string
  riskFactors: string[]
}

// IRD/MUX/エンコーダ（映像処理機器）
export const videoProcessingCategory: EquipmentCategory = {
  id: 'video-processing',
  name: 'IRD/MUX/エンコーダ（映像処理機器）',
  description: '衛星・地上波・IP復調および映像エンコード処理装置',
  inspectionItems: [
    {
      id: 'video-input-level',
      name: '映像入力レベル',
      description: '衛星・地上波・IP復調信号の受信品質（BER）',
      category: '信号品質',
      checkMethod: 'BER測定器による数値確認',
      normalRange: '< 1e-6',
      warningThreshold: '1e-6 ~ 1e-5',
      criticalThreshold: '> 1e-5',
      frequency: 'daily'
    },
    {
      id: 'decode-log',
      name: 'デコードログ',
      description: 'エラー数/フリーズ履歴/HDCP解除エラー',
      category: 'ログ監視',
      checkMethod: 'システムログ確認',
      frequency: 'daily'
    },
    {
      id: 'thermal-trend',
      name: '熱暴走傾向',
      description: '長時間稼働での発熱履歴、内部温度センサチェック',
      category: '温度監視',
      checkMethod: '内部温度センサー確認',
      normalRange: '< 60°C',
      warningThreshold: '60-70°C',
      criticalThreshold: '> 70°C',
      unit: '°C',
      frequency: 'daily'
    },
    {
      id: 'fan-rpm',
      name: 'ファン回転数',
      description: '回転低下 → 冷却不足 → 故障前兆',
      category: '冷却システム',
      checkMethod: 'RPMセンサー確認',
      normalRange: '> 2000 RPM',
      warningThreshold: '1500-2000 RPM',
      criticalThreshold: '< 1500 RPM',
      unit: 'RPM',
      frequency: 'weekly'
    },
    {
      id: 'firmware-version',
      name: 'FWバージョン',
      description: '最新化/脆弱性対応済みか？',
      category: 'セキュリティ',
      checkMethod: 'バージョン確認・セキュリティ更新状況',
      frequency: 'monthly'
    },
    {
      id: 'video-output',
      name: '映像出力確認',
      description: 'MPEG-2/H.264/H.265の出力信号確認（必要に応じループテスト）',
      category: '出力品質',
      checkMethod: '出力信号の目視・機器確認',
      frequency: 'weekly'
    }
  ],
  commonIssues: ['映像ノイズ', 'デコードエラー', '温度上昇', 'ファン故障'],
  maintenanceCycle: '3ヶ月',
  riskFactors: ['長時間稼働', '高温環境', 'ファームウェア脆弱性']
}

// CMTS/Edge QAM/OLT（通信系装置）
export const communicationCategory: EquipmentCategory = {
  id: 'communication',
  name: 'CMTS/Edge QAM/OLT（通信系装置）',
  description: 'ケーブルモデム制御・QAM変調・光アクセス装置',
  inspectionItems: [
    {
      id: 'port-error-rate',
      name: 'ポートエラーレート',
      description: '上下りのCRC/FECエラー、ブロックエラー',
      category: '通信品質',
      checkMethod: 'ポート統計情報確認',
      normalRange: '< 0.01%',
      warningThreshold: '0.01-0.1%',
      criticalThreshold: '> 0.1%',
      unit: '%',
      frequency: 'daily'
    },
    {
      id: 'cm-registration',
      name: 'CM登録数',
      description: 'モデム接続数の推移（過負荷傾向）',
      category: '負荷監視',
      checkMethod: 'モデム登録状況確認',
      frequency: 'daily'
    },
    {
      id: 'fan-power-status',
      name: 'ファン/電源状態',
      description: '多モジュール構成の一部ユニットが死んでいないか',
      category: 'ハードウェア',
      checkMethod: 'ユニット毎のステータス確認',
      frequency: 'weekly'
    },
    {
      id: 'temperature-alarm',
      name: '温度アラーム',
      description: '通信設備は熱に弱く、寿命に直結',
      category: '温度監視',
      checkMethod: '温度センサー・アラーム確認',
      normalRange: '< 50°C',
      warningThreshold: '50-60°C',
      criticalThreshold: '> 60°C',
      unit: '°C',
      frequency: 'daily'
    },
    {
      id: 'docsis-log',
      name: 'DOCSISログ',
      description: 'ステータス変動、チャネル追加/除外履歴の確認',
      category: 'プロトコル監視',
      checkMethod: 'DOCSISログ解析',
      frequency: 'weekly'
    },
    {
      id: 'mac-domain-usage',
      name: 'MACドメイン使用率',
      description: 'ロードバランスの偏り＝速度不安定の原因に',
      category: '負荷分散',
      checkMethod: 'ドメイン別使用率確認',
      normalRange: '< 70%',
      warningThreshold: '70-85%',
      criticalThreshold: '> 85%',
      unit: '%',
      frequency: 'daily'
    }
  ],
  commonIssues: ['通信エラー増加', 'モデム切断', '過負荷', '温度上昇'],
  maintenanceCycle: '1ヶ月',
  riskFactors: ['高トラフィック', '温度上昇', 'ファームウェア不具合']
}

// ルーター/L3スイッチ/DHCPサーバ
export const networkCategory: EquipmentCategory = {
  id: 'network',
  name: 'ルーター/L3スイッチ/DHCPサーバ',
  description: 'ネットワーク制御・ルーティング・DHCP機能装置',
  inspectionItems: [
    {
      id: 'packet-drop-rate',
      name: 'パケットドロップ率',
      description: 'スループット不足・QoS設定ミス検知に直結',
      category: 'ネットワーク性能',
      checkMethod: 'インターフェース統計確認',
      normalRange: '< 0.1%',
      warningThreshold: '0.1-1%',
      criticalThreshold: '> 1%',
      unit: '%',
      frequency: 'daily'
    },
    {
      id: 'cpu-ram-usage',
      name: 'CPU/RAM使用率',
      description: '高負荷→再起動・フリーズの兆候',
      category: 'システムリソース',
      checkMethod: 'リソース使用率確認',
      normalRange: '< 70%',
      warningThreshold: '70-85%',
      criticalThreshold: '> 85%',
      unit: '%',
      frequency: 'daily'
    },
    {
      id: 'fan-chassis-status',
      name: 'ファン状態',
      description: '大型シャーシ型では冗長ファン死で片系に負荷集中',
      category: '冷却システム',
      checkMethod: 'ファンユニット状態確認',
      frequency: 'weekly'
    },
    {
      id: 'communication-log',
      name: '通信ログ異常',
      description: '大量NAT/ARP/DoS兆候の自動検出連携も可能',
      category: 'セキュリティ',
      checkMethod: 'ログ解析・異常パターン検出',
      frequency: 'daily'
    },
    {
      id: 'config-change-history',
      name: 'コンフィグの変更履歴',
      description: 'CLI操作時に変わった部分のバックアップ保持推奨',
      category: '構成管理',
      checkMethod: '設定変更履歴確認',
      frequency: 'weekly'
    }
  ],
  commonIssues: ['パケットロス', 'CPU高負荷', 'ルーティング異常', 'DHCP枯渇'],
  maintenanceCycle: '2ヶ月',
  riskFactors: ['高トラフィック', 'DoS攻撃', '設定ミス']
}

// UPS/PDU/発電設備（電源系）
export const powerCategory: EquipmentCategory = {
  id: 'power',
  name: 'UPS/PDU/発電設備（電源系）',
  description: '無停電電源・配電・自家発電装置',
  inspectionItems: [
    {
      id: 'output-voltage-current',
      name: '出力電圧/電流',
      description: '実測 vs 設定値の差分、バッテリ劣化検出',
      category: '電力品質',
      checkMethod: '電圧・電流測定',
      normalRange: '200-240V',
      warningThreshold: '190-200V, 240-250V',
      criticalThreshold: '< 190V, > 250V',
      unit: 'V',
      frequency: 'daily'
    },
    {
      id: 'battery-test',
      name: 'バッテリテスト',
      description: '放電テストの結果履歴。内蔵セルのセル単位不良確認',
      category: 'バッテリ性能',
      checkMethod: '放電テスト実施',
      frequency: 'monthly'
    },
    {
      id: 'pdu-power-status',
      name: 'PDU通電状態',
      description: '各ポートごとの電流・過負荷検出ログ',
      category: '配電監視',
      checkMethod: 'ポート別電流値確認',
      frequency: 'weekly'
    },
    {
      id: 'generator-startup-test',
      name: '発電機起動試験',
      description: '年1〜2回の無負荷/実負荷テスト記録',
      category: '自家発電',
      checkMethod: '起動テスト実施・記録',
      frequency: 'annually'
    },
    {
      id: 'fuel-gas-level',
      name: '給油/ガス残量',
      description: '自家発72h想定なら月次チェック必須',
      category: '燃料管理',
      checkMethod: '燃料残量確認',
      normalRange: '> 75%',
      warningThreshold: '50-75%',
      criticalThreshold: '< 50%',
      unit: '%',
      frequency: 'monthly'
    },
    {
      id: 'ups-log-anomaly',
      name: 'UPSログ異常',
      description: '自動バイパス動作などの異常履歴有無',
      category: 'ログ監視',
      checkMethod: 'UPSイベントログ確認',
      frequency: 'weekly'
    }
  ],
  commonIssues: ['バッテリ劣化', '電圧変動', '発電機不始動', '燃料不足'],
  maintenanceCycle: '1ヶ月',
  riskFactors: ['バッテリ老化', '停電頻発', '燃料管理不備']
}

// 空調/環境センサ/温湿度制御系
export const environmentalCategory: EquipmentCategory = {
  id: 'environmental',
  name: '空調/環境センサ/温湿度制御系',
  description: '空調制御・環境監視・温湿度管理装置',
  inspectionItems: [
    {
      id: 'intake-exhaust-temp-diff',
      name: '吸排気温度差',
      description: '設定通りに冷却が機能しているか（ΔT＝効率指標）',
      category: '冷却効率',
      checkMethod: '吸気・排気温度測定',
      normalRange: '10-15°C',
      warningThreshold: '15-20°C',
      criticalThreshold: '> 20°C',
      unit: '°C',
      frequency: 'daily'
    },
    {
      id: 'temperature-zone-variation',
      name: '温度ゾーンバラつき',
      description: '機器密度による冷えムラ→ヒートマップで監視',
      category: '温度分布',
      checkMethod: '各ゾーン温度測定・マッピング',
      frequency: 'weekly'
    },
    {
      id: 'humidity-condensation',
      name: '湿度/結露センサ',
      description: '夏期・梅雨時期のドリップ・錆防止指標',
      category: '湿度管理',
      checkMethod: '湿度センサー・結露検知確認',
      normalRange: '40-60%',
      warningThreshold: '30-40%, 60-70%',
      criticalThreshold: '< 30%, > 70%',
      unit: '%RH',
      frequency: 'daily'
    },
    {
      id: 'filter-clogging',
      name: 'フィルタ目詰まり',
      description: 'エアフロー低下の主要因。清掃周期は3ヶ月が目安',
      category: 'メンテナンス',
      checkMethod: 'フィルタ状態確認・差圧測定',
      frequency: 'monthly'
    },
    {
      id: 'fan-airflow',
      name: 'ファン回転数',
      description: 'エアフロー不足による局所熱溜まりの兆候',
      category: 'エアフロー',
      checkMethod: 'ファン回転数・風量測定',
      normalRange: '> 80% rated',
      warningThreshold: '60-80% rated',
      criticalThreshold: '< 60% rated',
      unit: '%',
      frequency: 'weekly'
    }
  ],
  commonIssues: ['冷却不足', '湿度異常', 'フィルタ目詰まり', 'ファン故障'],
  maintenanceCycle: '3ヶ月',
  riskFactors: ['季節変動', 'フィルタ管理不備', 'ファン老朽化']
}

// 全カテゴリをまとめたマップ
export const equipmentCategories: Record<string, EquipmentCategory> = {
  'video-processing': videoProcessingCategory,
  'communication': communicationCategory,
  'network': networkCategory,
  'power': powerCategory,
  'environmental': environmentalCategory
}

// 機器タイプとカテゴリのマッピング
export const equipmentTypeToCategory: Record<string, string> = {
  'QAM変調器': 'video-processing',
  'IRD': 'video-processing',
  'MUX': 'video-processing',
  'エンコーダー': 'video-processing',
  '映像エンコーダ': 'video-processing',
  'CMTS': 'communication',
  'Edge QAM': 'communication',
  'OLT': 'communication',
  '光送信器': 'communication',
  'エッジルーター': 'network',
  'ルーター': 'network',
  'L3スイッチ': 'network',
  'DHCPサーバ': 'network',
  'UPS装置': 'power',
  'UPS（冗長系）': 'power',
  'PDU': 'power',
  '発電機': 'power',
  '空調設備': 'environmental',
  '環境センサ': 'environmental',
  '温湿度計': 'environmental'
}

// AI分析・将来活用向けの重要ログ項目
export const criticalLogItems = [
  {
    category: '全装置共通',
    item: '再起動履歴',
    description: '頻発 → 安定性劣化/ファーム異常の兆候',
    analysisType: 'frequency-trend'
  },
  {
    category: '通信機器',
    item: '温度上昇トレンド',
    description: '夏前にじわじわ上昇 → 異常予測指標に使える',
    analysisType: 'seasonal-trend'
  },
  {
    category: '映像装置',
    item: 'デコードエラー履歴',
    description: 'パケットドロップ/暗号解除エラーなど',
    analysisType: 'error-pattern'
  },
  {
    category: '電源系',
    item: '充電容量劣化率',
    description: 'UPSバッテリの健康指数をスコア化可能',
    analysisType: 'degradation-curve'
  }
]