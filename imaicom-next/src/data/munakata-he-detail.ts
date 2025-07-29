// 宗像HEの詳細データ（フラグシップモデル）

export interface MunakataHEDetail {
  // 基本情報
  basic: {
    id: number
    facilityId: string
    name: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    openedYear: number
    buildingInfo: {
      floors: number
      totalArea: number // 平方メートル
      rackArea: number // 平方メートル
    }
  }
  
  // 設備スペック
  specifications: {
    power: {
      totalCapacity: number // kVA
      currentUsage: number // kVA
      redundancy: string // N+1, 2N等
      ups: {
        capacity: number // kVA
        backupTime: number // 分
        batteries: string
      }
      generator: {
        capacity: number // kVA
        fuelCapacity: number // リットル
        runtime: number // 時間
      }
    }
    cooling: {
      totalCapacity: number // kW
      currentLoad: number // kW
      type: string // 空冷、水冷等
      redundancy: string
      setTemperature: number // 摂氏
      humidity: number // %
    }
    network: {
      carriers: string[]
      bandwidth: {
        upstream: number // Gbps
        downstream: number // Gbps
      }
      redundancy: string
    }
  }
  
  // ラック情報
  racks: {
    total: number
    occupied: number
    available: number
    layout: {
      rows: number
      racksPerRow: number
    }
    powerPerRack: number // kW
  }
  
  // リアルタイムメトリクス
  metrics: {
    temperature: {
      current: number
      average24h: number
      min24h: number
      max24h: number
    }
    humidity: {
      current: number
      average24h: number
    }
    power: {
      currentUsage: number // kW
      pue: number
      cost: number // 円/月
    }
  }
  
  // 機器情報
  equipment: {
    servers: {
      total: number
      active: number
      types: Array<{
        model: string
        manufacturer: string
        count: number
        purpose: string
      }>
    }
    network: {
      routers: number
      switches: number
      firewalls: number
    }
    storage: {
      totalCapacity: number // TB
      usedCapacity: number // TB
      systems: Array<{
        type: string
        capacity: number
        usage: number
      }>
    }
  }
  
  // セキュリティ
  security: {
    accessControl: string[]
    surveillance: {
      cameras: number
      coverage: string // %
      recording: number // 日数
    }
    certifications: string[]
  }
  
  // メンテナンス履歴
  maintenanceHistory: Array<{
    date: string
    type: string
    description: string
    duration: number // 時間
    impact: string
  }>
  
  // アラート・インシデント
  alerts: Array<{
    id: string
    timestamp: string
    severity: 'critical' | 'warning' | 'info'
    type: string
    message: string
    status: 'active' | 'resolved'
  }>
}

// 宗像HEの実データ
export const munakataHEData: MunakataHEDetail = {
  basic: {
    id: 95,
    facilityId: "HE_九州_095",
    name: "宗像HE",
    address: "福岡県宗像市東郷1-1-1",
    coordinates: {
      lat: 33.8056,
      lng: 130.5389
    },
    openedYear: 2021,
    buildingInfo: {
      floors: 2,
      totalArea: 1200,
      rackArea: 800
    }
  },
  
  specifications: {
    power: {
      totalCapacity: 2000,
      currentUsage: 1250,
      redundancy: "N+1",
      ups: {
        capacity: 500,
        backupTime: 10,
        batteries: "リチウムイオン"
      },
      generator: {
        capacity: 2000,
        fuelCapacity: 5000,
        runtime: 72
      }
    },
    cooling: {
      totalCapacity: 1500,
      currentLoad: 980,
      type: "空冷（間接外気冷房併用）",
      redundancy: "N+1",
      setTemperature: 24,
      humidity: 45
    },
    network: {
      carriers: ["NTT", "KDDI", "SoftBank", "IIJ"],
      bandwidth: {
        upstream: 100,
        downstream: 100
      },
      redundancy: "完全冗長構成"
    }
  },
  
  racks: {
    total: 120,
    occupied: 85,
    available: 35,
    layout: {
      rows: 8,
      racksPerRow: 15
    },
    powerPerRack: 6
  },
  
  metrics: {
    temperature: {
      current: 23.5,
      average24h: 23.8,
      min24h: 23.2,
      max24h: 24.3
    },
    humidity: {
      current: 43,
      average24h: 45
    },
    power: {
      currentUsage: 1250,
      pue: 1.35,
      cost: 3750000
    }
  },
  
  equipment: {
    servers: {
      total: 450,
      active: 425,
      types: [
        {
          model: "ProLiant DL380 Gen10",
          manufacturer: "HPE",
          count: 180,
          purpose: "仮想化基盤"
        },
        {
          model: "PowerEdge R750",
          manufacturer: "Dell",
          count: 150,
          purpose: "ストリーミング配信"
        },
        {
          model: "ThinkSystem SR650",
          manufacturer: "Lenovo",
          count: 120,
          purpose: "データベース"
        }
      ]
    },
    network: {
      routers: 8,
      switches: 48,
      firewalls: 6
    },
    storage: {
      totalCapacity: 2000,
      usedCapacity: 1450,
      systems: [
        {
          type: "NAS",
          capacity: 800,
          usage: 620
        },
        {
          type: "SAN",
          capacity: 1200,
          usage: 830
        }
      ]
    }
  },
  
  security: {
    accessControl: ["生体認証", "ICカード", "監視員常駐"],
    surveillance: {
      cameras: 48,
      coverage: "100",
      recording: 90
    },
    certifications: ["ISO27001", "FISC", "LGWAN-ASP"]
  },
  
  maintenanceHistory: [
    {
      date: "2024-12-15",
      type: "定期点検",
      description: "UPSバッテリー点検・交換",
      duration: 4,
      impact: "影響なし（冗長構成）"
    },
    {
      date: "2024-11-20",
      type: "設備更新",
      description: "空調設備フィルター交換",
      duration: 2,
      impact: "影響なし"
    },
    {
      date: "2024-10-10",
      type: "緊急対応",
      description: "冷却ファン1台故障対応",
      duration: 1,
      impact: "影響なし（N+1構成）"
    }
  ],
  
  alerts: [
    {
      id: "ALT-2025-001",
      timestamp: "2025-01-29T10:30:00",
      severity: "warning",
      type: "温度異常",
      message: "ラックA-12の温度が閾値を超過（26.5℃）",
      status: "active"
    },
    {
      id: "ALT-2025-002",
      timestamp: "2025-01-29T09:15:00",
      severity: "info",
      type: "メンテナンス",
      message: "定期メンテナンスが1週間後に予定されています",
      status: "active"
    }
  ]
}