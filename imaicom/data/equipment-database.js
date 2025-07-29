// ケーブルテレビヘッドエンド施設の機材データベース
export const equipmentDatabase = {
  // 1. 受信・ヘッドエンド系機器
  reception: [
    {
      id: "RH-001",
      category: "受信系",
      name: "BS/CS-IF信号処理装置",
      manufacturer: "パナソニック",
      model: "TZ-BDT920PW",
      description: "BS/110度CS放送受信・復調",
      purchaseDate: "2021-04-15",
      assetPeriod: 7, // 年
      usefulLife: 7,
      maintenanceCycle: 6, // 月
      location: { rack: "A-01", unit: "1-3U" }
    },
    {
      id: "RH-002",
      category: "受信系",
      name: "地上デジタル放送受信装置",
      manufacturer: "東芝",
      model: "DT-3000HD",
      description: "地上デジタル放送受信・復調",
      purchaseDate: "2020-10-20",
      assetPeriod: 7,
      usefulLife: 7,
      maintenanceCycle: 6,
      location: { rack: "A-01", unit: "4-6U" }
    },
    {
      id: "RH-003",
      category: "受信系",
      name: "パラボラアンテナシステム",
      manufacturer: "日本アンテナ",
      model: "CSA-750D",
      description: "CS/BS受信用1.2mオフセットアンテナ",
      purchaseDate: "2019-03-10",
      assetPeriod: 10,
      usefulLife: 10,
      maintenanceCycle: 12,
      location: { area: "屋上", position: "北東角" }
    }
  ],

  // 2. 変調・多重化機器
  modulation: [
    {
      id: "MD-001",
      category: "変調系",
      name: "64QAM変調器",
      manufacturer: "住友電工",
      model: "SME-QAM64-8CH",
      description: "デジタル信号の64QAM変調",
      purchaseDate: "2022-06-15",
      assetPeriod: 8,
      usefulLife: 8,
      maintenanceCycle: 12,
      location: { rack: "B-01", unit: "1-4U" }
    },
    {
      id: "MD-002",
      category: "変調系",
      name: "256QAM変調器",
      manufacturer: "NEC",
      model: "N8000-Q256",
      description: "高速データ伝送用256QAM変調",
      purchaseDate: "2023-01-20",
      assetPeriod: 8,
      usefulLife: 8,
      maintenanceCycle: 12,
      location: { rack: "B-01", unit: "5-8U" }
    },
    {
      id: "MD-003",
      category: "多重化",
      name: "デジタル多重化装置",
      manufacturer: "富士通",
      model: "FJ-MUX-5000",
      description: "複数チャンネルの多重化処理",
      purchaseDate: "2021-11-30",
      assetPeriod: 7,
      usefulLife: 7,
      maintenanceCycle: 6,
      location: { rack: "B-02", unit: "1-6U" }
    }
  ],

  // 3. エンコード・トランスコード機器
  encoding: [
    {
      id: "EC-001",
      category: "エンコード",
      name: "H.265/HEVC エンコーダー",
      manufacturer: "ソニー",
      model: "PWS-4500",
      description: "4K/8K対応HEVCエンコード",
      purchaseDate: "2023-03-15",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 6,
      location: { rack: "C-01", unit: "1-4U" }
    },
    {
      id: "EC-002",
      category: "エンコード",
      name: "H.264 HDエンコーダー",
      manufacturer: "Harmonic",
      model: "Electra X2",
      description: "HD放送用H.264エンコード",
      purchaseDate: "2020-07-20",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 6,
      location: { rack: "C-01", unit: "5-8U" }
    }
  ],

  // 4. 伝送・分配系機器
  transmission: [
    {
      id: "TR-001",
      category: "光伝送",
      name: "光送信機",
      manufacturer: "古河電工",
      model: "FOT-3000TX",
      description: "1550nm DFB レーザー送信機",
      purchaseDate: "2022-09-10",
      assetPeriod: 10,
      usefulLife: 10,
      maintenanceCycle: 12,
      location: { rack: "D-01", unit: "1-2U" }
    },
    {
      id: "TR-002",
      category: "光伝送",
      name: "光増幅器(EDFA)",
      manufacturer: "住友電工",
      model: "SEI-EDFA-23",
      description: "エルビウム添加光ファイバ増幅器",
      purchaseDate: "2022-09-10",
      assetPeriod: 10,
      usefulLife: 10,
      maintenanceCycle: 12,
      location: { rack: "D-01", unit: "3-4U" }
    },
    {
      id: "TR-003",
      category: "分配",
      name: "RF分配増幅器",
      manufacturer: "マスプロ電工",
      model: "7BCW30-B",
      description: "770MHz帯双方向ブースター",
      purchaseDate: "2021-05-15",
      assetPeriod: 7,
      usefulLife: 7,
      maintenanceCycle: 12,
      location: { rack: "D-02", unit: "1-2U" }
    }
  ],

  // 5. 電源・UPS系機器
  power: [
    {
      id: "PW-001",
      category: "UPS",
      name: "無停電電源装置",
      manufacturer: "オムロン",
      model: "BN300T",
      description: "30KVA/27KW オンラインUPS",
      purchaseDate: "2020-04-01",
      assetPeriod: 6,
      usefulLife: 6,
      maintenanceCycle: 3,
      batteryReplacement: 36, // 月
      location: { area: "電源室", position: "A-1" }
    },
    {
      id: "PW-002",
      category: "発電機",
      name: "非常用発電機",
      manufacturer: "ヤンマー",
      model: "AG60SH",
      description: "60KVA ディーゼル発電機",
      purchaseDate: "2018-10-15",
      assetPeriod: 15,
      usefulLife: 15,
      maintenanceCycle: 6,
      location: { area: "屋外", position: "発電機室" }
    }
  ],

  // 6. 空調・環境系機器
  cooling: [
    {
      id: "AC-001",
      category: "空調",
      name: "精密空調機",
      manufacturer: "ダイキン",
      model: "FVCP2240HP",
      description: "40馬力 床置形精密空調",
      purchaseDate: "2019-06-20",
      assetPeriod: 10,
      usefulLife: 10,
      maintenanceCycle: 3,
      location: { area: "機械室", position: "AC-1" }
    },
    {
      id: "AC-002",
      category: "空調",
      name: "ラック空調システム",
      manufacturer: "APC",
      model: "InRow RC",
      description: "ラック列間冷却システム",
      purchaseDate: "2021-08-10",
      assetPeriod: 8,
      usefulLife: 8,
      maintenanceCycle: 6,
      location: { area: "サーバー室", position: "列A-B間" }
    }
  ],

  // 7. 監視・測定機器
  monitoring: [
    {
      id: "MN-001",
      category: "監視",
      name: "統合監視システム",
      manufacturer: "NTT-AT",
      model: "NetCracker 9",
      description: "ネットワーク統合監視",
      purchaseDate: "2022-04-01",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 12,
      location: { rack: "NOC-01", unit: "1-4U" }
    },
    {
      id: "MN-002",
      category: "測定器",
      name: "スペクトラムアナライザー",
      manufacturer: "アンリツ",
      model: "MS2090A",
      description: "9kHz-54GHz 信号解析",
      purchaseDate: "2023-02-15",
      assetPeriod: 7,
      usefulLife: 7,
      maintenanceCycle: 12,
      calibrationCycle: 12, // 校正周期（月）
      location: { area: "測定器室", shelf: "S-1" }
    },
    {
      id: "MN-003",
      category: "環境監視",
      name: "環境監視センサー",
      manufacturer: "オムロン",
      model: "2JCIE-BL01",
      description: "温湿度・気圧・照度センサー",
      purchaseDate: "2022-10-01",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 12,
      location: { area: "各所", count: 20 }
    }
  ],

  // 8. セキュリティ系機器
  security: [
    {
      id: "SC-001",
      category: "物理セキュリティ",
      name: "入退室管理システム",
      manufacturer: "セコム",
      model: "SESAMO-IDs",
      description: "ICカード認証入退室管理",
      purchaseDate: "2021-01-15",
      assetPeriod: 7,
      usefulLife: 7,
      maintenanceCycle: 6,
      location: { area: "各入口", count: 8 }
    },
    {
      id: "SC-002",
      category: "監視カメラ",
      name: "AIネットワークカメラ",
      manufacturer: "パナソニック",
      model: "WV-X6531N",
      description: "4K AI動体検知カメラ",
      purchaseDate: "2022-07-01",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 12,
      location: { area: "施設内", count: 16 }
    }
  ],

  // 9. ネットワーク機器
  network: [
    {
      id: "NW-001",
      category: "ルーター",
      name: "コアルーター",
      manufacturer: "Cisco",
      model: "ASR 9000",
      description: "100Gbps対応コアルーター",
      purchaseDate: "2021-12-01",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 12,
      location: { rack: "NET-01", unit: "20-26U" }
    },
    {
      id: "NW-002",
      category: "スイッチ",
      name: "L3スイッチ",
      manufacturer: "Juniper",
      model: "EX4600",
      description: "10/40GbE L3スイッチ",
      purchaseDate: "2022-03-15",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 12,
      location: { rack: "NET-02", unit: "1-2U" }
    }
  ],

  // 10. 監視ロボット（デジタルツイン）
  robots: [
    {
      id: "RB-001",
      category: "監視ロボット",
      name: "自律巡回ロボット",
      manufacturer: "ALSOK",
      model: "Reborg-Z",
      description: "AI搭載自律巡回監視ロボット",
      purchaseDate: "2023-06-01",
      assetPeriod: 5,
      usefulLife: 5,
      maintenanceCycle: 3,
      features: ["熱画像カメラ", "ガス検知", "音響異常検知"],
      location: { area: "充電ステーション", id: "CS-1" }
    },
    {
      id: "RB-002",
      category: "ドローン",
      name: "屋内点検ドローン",
      manufacturer: "Liberaware",
      model: "IBIS",
      description: "狭小空間点検用小型ドローン",
      purchaseDate: "2023-08-01",
      assetPeriod: 3,
      usefulLife: 3,
      maintenanceCycle: 1,
      features: ["4K カメラ", "LED照明", "障害物回避"],
      location: { area: "ドローンポート", id: "DP-1" }
    }
  ]
};

// メンテナンス履歴
export const maintenanceHistory = [
  {
    id: "MH-001",
    equipmentId: "PW-001",
    date: "2024-01-15",
    type: "定期点検",
    inspector: "山田太郎",
    company: "オムロンフィールドエンジニアリング",
    result: "正常",
    notes: "バッテリー残量85%、次回交換推奨"
  },
  {
    id: "MH-002",
    equipmentId: "AC-001",
    date: "2024-02-20",
    type: "定期清掃",
    inspector: "佐藤次郎",
    company: "ダイキンサービス",
    result: "正常",
    notes: "フィルター交換実施"
  }
];

// アラート設定
export const alertSettings = {
  usefulLifeWarning: 6, // 耐用年数の6ヶ月前に警告
  maintenanceReminder: 1, // メンテナンス1ヶ月前に通知
  batteryWarning: 12, // バッテリー交換12ヶ月前に警告
  temperatureThreshold: {
    high: 28, // °C
    critical: 32
  },
  humidityThreshold: {
    high: 70, // %
    low: 30
  }
};