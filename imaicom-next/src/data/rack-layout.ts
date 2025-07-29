// 宗像HE ラック配置データ

export interface RackSlot {
  pitch: number
  equipment?: {
    id: string
    name: string
    type: string
    height: number // U数（ピッチ数）
    status: 'active' | 'standby' | 'maintenance' | 'empty'
  }
}

export interface Rack {
  id: string
  name: string
  location: string
  totalPitches: number
  slots: RackSlot[]
}

// ラック配置データ
export const rackLayouts: Rack[] = [
  // HE室 Aエリア
  {
    id: 'RACK-A1',
    name: 'ラックA1',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-A1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 2,
        equipment: {
          id: 'SW-A1-01',
          name: 'ネットワークスイッチ',
          type: 'SWITCH',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ3-5: UPS
      {
        pitch: 3,
        equipment: {
          id: 'UPS01',
          name: 'UPS 40kVA',
          type: 'UPS',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 4 }, // UPS01の一部
      { pitch: 5 }, // UPS01の一部
      // ピッチ6-10: サーバー
      {
        pitch: 6,
        equipment: {
          id: 'SRV-A1-01',
          name: '配信サーバー#1',
          type: 'SERVER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 7 }, // SRV-A1-01の一部
      {
        pitch: 8,
        equipment: {
          id: 'SRV-A1-02',
          name: '配信サーバー#2',
          type: 'SERVER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 9 }, // SRV-A1-02の一部
      {
        pitch: 10,
        equipment: {
          id: 'SRV-A1-03',
          name: '管理サーバー',
          type: 'SERVER',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ11-15: ケーブルモデム終端装置
      {
        pitch: 11,
        equipment: {
          id: 'CMTS-A1-01',
          name: 'CMTS #1',
          type: 'CMTS',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 12 }, // CMTS-A1-01の一部
      { pitch: 13 }, // CMTS-A1-01の一部
      {
        pitch: 14,
        equipment: {
          id: 'CMTS-A1-02',
          name: 'CMTS #2',
          type: 'CMTS',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 15 }, // CMTS-A1-02の一部
      { pitch: 16 }, // CMTS-A1-02の一部
      // ピッチ17-20: 光増幅器
      {
        pitch: 17,
        equipment: {
          id: 'AMP-A1-01',
          name: '光増幅器 #1',
          type: 'AMPLIFIER',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 18,
        equipment: {
          id: 'AMP-A1-02',
          name: '光増幅器 #2',
          type: 'AMPLIFIER',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 19,
        equipment: {
          id: 'AMP-A1-03',
          name: '光増幅器 #3',
          type: 'AMPLIFIER',
          height: 1,
          status: 'standby'
        }
      },
      {
        pitch: 20,
        equipment: {
          id: 'AMP-A1-04',
          name: '光増幅器 #4',
          type: 'AMPLIFIER',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ21-25: 映像処理装置
      {
        pitch: 21,
        equipment: {
          id: 'ENC-A1-01',
          name: 'エンコーダー #1',
          type: 'ENCODER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 22 }, // ENC-A1-01の一部
      {
        pitch: 23,
        equipment: {
          id: 'ENC-A1-02',
          name: 'エンコーダー #2',
          type: 'ENCODER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 24 }, // ENC-A1-02の一部
      {
        pitch: 25,
        equipment: {
          id: 'MUX-A1-01',
          name: 'マルチプレクサー',
          type: 'MULTIPLEXER',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ26-30: 監視装置
      {
        pitch: 26,
        equipment: {
          id: 'MON-A1-01',
          name: '監視装置メイン',
          type: 'MONITOR',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 27 }, // MON-A1-01の一部
      {
        pitch: 28,
        equipment: {
          id: 'MON-A1-02',
          name: '監視装置サブ',
          type: 'MONITOR',
          height: 2,
          status: 'standby'
        }
      },
      { pitch: 29 }, // MON-A1-02の一部
      { pitch: 30 }, // 空き
      // ピッチ31-35: バックアップ機器
      {
        pitch: 31,
        equipment: {
          id: 'BAK-A1-01',
          name: 'バックアップストレージ',
          type: 'STORAGE',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 32 }, // BAK-A1-01の一部
      { pitch: 33 }, // BAK-A1-01の一部
      { pitch: 34 }, // BAK-A1-01の一部
      { pitch: 35 }, // 空き
      // ピッチ36-40: 予備機器・空きスペース
      { pitch: 36 }, // 空き
      { pitch: 37 }, // 空き
      {
        pitch: 38,
        equipment: {
          id: 'SPARE-A1-01',
          name: '予備電源ユニット',
          type: 'PSU',
          height: 1,
          status: 'standby'
        }
      },
      { pitch: 39 }, // 空き
      { pitch: 40 }, // 空き
      // ピッチ41-42: ケーブル管理
      {
        pitch: 41,
        equipment: {
          id: 'CBL-A1-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-A1-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'RACK-A2',
    name: 'ラックA2',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-A2-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-10: RECT装置
      {
        pitch: 2,
        equipment: {
          id: 'RECT01',
          name: 'RECT A系-前',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 3 }, // RECT01の一部
      { pitch: 4 }, // RECT01の一部
      { pitch: 5 }, // RECT01の一部
      {
        pitch: 6,
        equipment: {
          id: 'RECT02',
          name: 'RECT A系-後',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 7 }, // RECT02の一部
      { pitch: 8 }, // RECT02の一部
      { pitch: 9 }, // RECT02の一部
      { pitch: 10 }, // 空き
      // ピッチ11-20: 通信機器
      {
        pitch: 11,
        equipment: {
          id: 'RTR-A2-01',
          name: 'コアルーター #1',
          type: 'ROUTER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 12 }, // RTR-A2-01の一部
      {
        pitch: 13,
        equipment: {
          id: 'RTR-A2-02',
          name: 'コアルーター #2',
          type: 'ROUTER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 14 }, // RTR-A2-02の一部
      {
        pitch: 15,
        equipment: {
          id: 'FW-A2-01',
          name: 'ファイアウォール #1',
          type: 'FIREWALL',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 16,
        equipment: {
          id: 'FW-A2-02',
          name: 'ファイアウォール #2',
          type: 'FIREWALL',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 17,
        equipment: {
          id: 'SW-A2-01',
          name: 'コアスイッチ #1',
          type: 'SWITCH',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 18 }, // SW-A2-01の一部
      {
        pitch: 19,
        equipment: {
          id: 'SW-A2-02',
          name: 'コアスイッチ #2',
          type: 'SWITCH',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 20 }, // SW-A2-02の一部
      // ピッチ21-30: 予備スペース
      { pitch: 21 }, // 空き
      { pitch: 22 }, // 空き
      { pitch: 23 }, // 空き
      { pitch: 24 }, // 空き
      { pitch: 25 }, // 空き
      { pitch: 26 }, // 空き
      { pitch: 27 }, // 空き
      { pitch: 28 }, // 空き
      { pitch: 29 }, // 空き
      { pitch: 30 }, // 空き
      // ピッチ31-40: 将来拡張用
      { pitch: 31 }, // 空き
      { pitch: 32 }, // 空き
      { pitch: 33 }, // 空き
      { pitch: 34 }, // 空き
      { pitch: 35 }, // 空き
      { pitch: 36 }, // 空き
      { pitch: 37 }, // 空き
      { pitch: 38 }, // 空き
      { pitch: 39 }, // 空き
      { pitch: 40 }, // 空き
      // ピッチ41-42: ケーブル管理
      {
        pitch: 41,
        equipment: {
          id: 'CBL-A2-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-A2-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  // HE室 Bエリア
  {
    id: 'RACK-B1',
    name: 'ラックB1',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-B1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-10: RECT B系
      {
        pitch: 2,
        equipment: {
          id: 'RECT03',
          name: 'RECT B系-前',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 3 }, // RECT03の一部
      { pitch: 4 }, // RECT03の一部
      { pitch: 5 }, // RECT03の一部
      {
        pitch: 6,
        equipment: {
          id: 'RECT04',
          name: 'RECT B系-後',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 7 }, // RECT04の一部
      { pitch: 8 }, // RECT04の一部
      { pitch: 9 }, // RECT04の一部
      { pitch: 10 }, // 空き
      // ピッチ11-20: 火災予兆検知システム
      {
        pitch: 11,
        equipment: {
          id: 'FIRE01',
          name: '火災予兆検知警報盤',
          type: 'FIRE_DETECTION',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 12 }, // FIRE01の一部
      { pitch: 13 }, // FIRE01の一部
      {
        pitch: 14,
        equipment: {
          id: 'FIRE02',
          name: '火災予兆センサー HE室',
          type: 'FIRE_SENSOR',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 15,
        equipment: {
          id: 'FIRE03',
          name: '火災予兆センサー UPS室',
          type: 'FIRE_SENSOR',
          height: 1,
          status: 'active'
        }
      },
      { pitch: 16 }, // 空き
      { pitch: 17 }, // 空き
      { pitch: 18 }, // 空き
      { pitch: 19 }, // 空き
      { pitch: 20 }, // 空き
      // ピッチ21-42: 予備・拡張スペース
      { pitch: 21 }, // 空き
      { pitch: 22 }, // 空き
      { pitch: 23 }, // 空き
      { pitch: 24 }, // 空き
      { pitch: 25 }, // 空き
      { pitch: 26 }, // 空き
      { pitch: 27 }, // 空き
      { pitch: 28 }, // 空き
      { pitch: 29 }, // 空き
      { pitch: 30 }, // 空き
      { pitch: 31 }, // 空き
      { pitch: 32 }, // 空き
      { pitch: 33 }, // 空き
      { pitch: 34 }, // 空き
      { pitch: 35 }, // 空き
      { pitch: 36 }, // 空き
      { pitch: 37 }, // 空き
      { pitch: 38 }, // 空き
      { pitch: 39 }, // 空き
      { pitch: 40 }, // 空き
      {
        pitch: 41,
        equipment: {
          id: 'CBL-B1-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-B1-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'RACK-B2',
    name: 'ラックB2',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-B2-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-8: 映像処理装置
      {
        pitch: 2,
        equipment: {
          id: 'DEC-B2-01',
          name: 'デコーダー #1',
          type: 'DECODER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 3 },
      {
        pitch: 4,
        equipment: {
          id: 'DEC-B2-02',
          name: 'デコーダー #2',
          type: 'DECODER',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 5 },
      {
        pitch: 6,
        equipment: {
          id: 'MOD-B2-01',
          name: '変調器 #1',
          type: 'MODULATOR',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 7,
        equipment: {
          id: 'MOD-B2-02',
          name: '変調器 #2',
          type: 'MODULATOR',
          height: 1,
          status: 'active'
        }
      },
      { pitch: 8 },
      // ピッチ9-16: スイッチング機器
      {
        pitch: 9,
        equipment: {
          id: 'SW-B2-01',
          name: '映像スイッチャー #1',
          type: 'VIDEO_SWITCH',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 10 },
      {
        pitch: 11,
        equipment: {
          id: 'SW-B2-02',
          name: '映像スイッチャー #2',
          type: 'VIDEO_SWITCH',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 12 },
      { pitch: 13 },
      { pitch: 14 },
      { pitch: 15 },
      { pitch: 16 },
      // ピッチ17-42: 将来拡張用
      { pitch: 17 }, { pitch: 18 }, { pitch: 19 }, { pitch: 20 },
      { pitch: 21 }, { pitch: 22 }, { pitch: 23 }, { pitch: 24 },
      { pitch: 25 }, { pitch: 26 }, { pitch: 27 }, { pitch: 28 },
      { pitch: 29 }, { pitch: 30 }, { pitch: 31 }, { pitch: 32 },
      { pitch: 33 }, { pitch: 34 }, { pitch: 35 }, { pitch: 36 },
      { pitch: 37 }, { pitch: 38 }, { pitch: 39 }, { pitch: 40 },
      {
        pitch: 41,
        equipment: {
          id: 'CBL-B2-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-B2-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  // HE室 Cエリア
  {
    id: 'RACK-C1',
    name: 'ラックC1',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-C1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-20: 光伝送装置
      {
        pitch: 2,
        equipment: {
          id: 'OPT-C1-01',
          name: '光伝送装置 #1',
          type: 'OPTICAL',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 3 }, { pitch: 4 },
      {
        pitch: 5,
        equipment: {
          id: 'OPT-C1-02',
          name: '光伝送装置 #2',
          type: 'OPTICAL',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 6 }, { pitch: 7 },
      {
        pitch: 8,
        equipment: {
          id: 'WDM-C1-01',
          name: 'WDM装置 #1',
          type: 'WDM',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 9 },
      {
        pitch: 10,
        equipment: {
          id: 'WDM-C1-02',
          name: 'WDM装置 #2',
          type: 'WDM',
          height: 2,
          status: 'active'
        }
      },
      { pitch: 11 },
      { pitch: 12 }, { pitch: 13 }, { pitch: 14 }, { pitch: 15 },
      { pitch: 16 }, { pitch: 17 }, { pitch: 18 }, { pitch: 19 }, { pitch: 20 },
      // ピッチ21-40: 光配線盤
      {
        pitch: 21,
        equipment: {
          id: 'ODF-C1-01',
          name: '光配線盤 #1',
          type: 'ODF',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 22 }, { pitch: 23 }, { pitch: 24 },
      {
        pitch: 25,
        equipment: {
          id: 'ODF-C1-02',
          name: '光配線盤 #2',
          type: 'ODF',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 26 }, { pitch: 27 }, { pitch: 28 },
      { pitch: 29 }, { pitch: 30 }, { pitch: 31 }, { pitch: 32 },
      { pitch: 33 }, { pitch: 34 }, { pitch: 35 }, { pitch: 36 },
      { pitch: 37 }, { pitch: 38 }, { pitch: 39 }, { pitch: 40 },
      {
        pitch: 41,
        equipment: {
          id: 'CBL-C1-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-C1-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'RACK-C2',
    name: 'ラックC2',
    location: '1階 HE室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-C2-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // 予備ラック（将来拡張用）
      { pitch: 2 }, { pitch: 3 }, { pitch: 4 }, { pitch: 5 },
      { pitch: 6 }, { pitch: 7 }, { pitch: 8 }, { pitch: 9 },
      { pitch: 10 }, { pitch: 11 }, { pitch: 12 }, { pitch: 13 },
      { pitch: 14 }, { pitch: 15 }, { pitch: 16 }, { pitch: 17 },
      { pitch: 18 }, { pitch: 19 }, { pitch: 20 }, { pitch: 21 },
      { pitch: 22 }, { pitch: 23 }, { pitch: 24 }, { pitch: 25 },
      { pitch: 26 }, { pitch: 27 }, { pitch: 28 }, { pitch: 29 },
      { pitch: 30 }, { pitch: 31 }, { pitch: 32 }, { pitch: 33 },
      { pitch: 34 }, { pitch: 35 }, { pitch: 36 }, { pitch: 37 },
      { pitch: 38 }, { pitch: 39 }, { pitch: 40 },
      {
        pitch: 41,
        equipment: {
          id: 'CBL-C2-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-C2-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  // UPS室エリア
  {
    id: 'RACK-U1',
    name: 'ラックU1',
    location: '1階 UPS室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-U1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-10: RECT B系
      {
        pitch: 2,
        equipment: {
          id: 'RECT03',
          name: 'RECT B系-前',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 3 }, { pitch: 4 }, { pitch: 5 },
      {
        pitch: 6,
        equipment: {
          id: 'RECT04',
          name: 'RECT B系-後',
          type: 'RECT',
          height: 4,
          status: 'active'
        }
      },
      { pitch: 7 }, { pitch: 8 }, { pitch: 9 },
      { pitch: 10 },
      // ピッチ11-20: 火災予兆検知システム
      {
        pitch: 11,
        equipment: {
          id: 'FIRE01',
          name: '火災予兆検知警報盤',
          type: 'FIRE_DETECTION',
          height: 3,
          status: 'active'
        }
      },
      { pitch: 12 }, { pitch: 13 },
      {
        pitch: 14,
        equipment: {
          id: 'FIRE02',
          name: '火災予兆センサー HE室',
          type: 'FIRE_SENSOR',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 15,
        equipment: {
          id: 'FIRE03',
          name: '火災予兆センサー UPS室',
          type: 'FIRE_SENSOR',
          height: 1,
          status: 'active'
        }
      },
      { pitch: 16 }, { pitch: 17 }, { pitch: 18 }, { pitch: 19 }, { pitch: 20 },
      // ピッチ21-42: 予備・拡張スペース
      { pitch: 21 }, { pitch: 22 }, { pitch: 23 }, { pitch: 24 },
      { pitch: 25 }, { pitch: 26 }, { pitch: 27 }, { pitch: 28 },
      { pitch: 29 }, { pitch: 30 }, { pitch: 31 }, { pitch: 32 },
      { pitch: 33 }, { pitch: 34 }, { pitch: 35 }, { pitch: 36 },
      { pitch: 37 }, { pitch: 38 }, { pitch: 39 }, { pitch: 40 },
      {
        pitch: 41,
        equipment: {
          id: 'CBL-U1-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-U1-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'RACK-U2',
    name: 'ラックU2',
    location: '1階 UPS室',
    totalPitches: 42,
    slots: [
      {
        pitch: 1,
        equipment: {
          id: 'PDU-U2-01',
          name: '電源分配ユニット',
          type: 'PDU',
          height: 1,
          status: 'active'
        }
      },
      // ピッチ2-15: 大型UPS
      {
        pitch: 2,
        equipment: {
          id: 'UPS-U2-01',
          name: 'UPS 100kVA #1',
          type: 'UPS',
          height: 6,
          status: 'active'
        }
      },
      { pitch: 3 }, { pitch: 4 }, { pitch: 5 }, { pitch: 6 }, { pitch: 7 },
      {
        pitch: 8,
        equipment: {
          id: 'UPS-U2-02',
          name: 'UPS 100kVA #2',
          type: 'UPS',
          height: 6,
          status: 'active'
        }
      },
      { pitch: 9 }, { pitch: 10 }, { pitch: 11 }, { pitch: 12 }, { pitch: 13 },
      { pitch: 14 }, { pitch: 15 },
      // ピッチ16-42: 予備
      { pitch: 16 }, { pitch: 17 }, { pitch: 18 }, { pitch: 19 },
      { pitch: 20 }, { pitch: 21 }, { pitch: 22 }, { pitch: 23 },
      { pitch: 24 }, { pitch: 25 }, { pitch: 26 }, { pitch: 27 },
      { pitch: 28 }, { pitch: 29 }, { pitch: 30 }, { pitch: 31 },
      { pitch: 32 }, { pitch: 33 }, { pitch: 34 }, { pitch: 35 },
      { pitch: 36 }, { pitch: 37 }, { pitch: 38 }, { pitch: 39 },
      { pitch: 40 },
      {
        pitch: 41,
        equipment: {
          id: 'CBL-U2-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      },
      {
        pitch: 42,
        equipment: {
          id: 'CBL-U2-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          height: 1,
          status: 'active'
        }
      }
    ]
  }
]

// 機器タイプごとの色定義
export const equipmentTypeColors = {
  PDU: 'bg-gray-600',
  UPS: 'bg-purple-600',
  RECT: 'bg-blue-600',
  SERVER: 'bg-green-600',
  CMTS: 'bg-indigo-600',
  AMPLIFIER: 'bg-yellow-600',
  ENCODER: 'bg-pink-600',
  MULTIPLEXER: 'bg-pink-500',
  MONITOR: 'bg-cyan-600',
  STORAGE: 'bg-orange-600',
  PSU: 'bg-gray-500',
  CABLE_MGMT: 'bg-gray-400',
  ROUTER: 'bg-red-600',
  FIREWALL: 'bg-red-700',
  SWITCH: 'bg-teal-600',
  FIRE_DETECTION: 'bg-red-500',
  FIRE_SENSOR: 'bg-red-400',
  DECODER: 'bg-pink-700',
  MODULATOR: 'bg-indigo-500',
  VIDEO_SWITCH: 'bg-purple-500',
  OPTICAL: 'bg-blue-700',
  WDM: 'bg-blue-500',
  ODF: 'bg-blue-400'
}

// ラック使用率を計算
export function calculateRackUtilization(rack: Rack): {
  used: number
  available: number
  percentage: number
} {
  const used = rack.slots.filter(slot => slot.equipment).length
  const available = rack.totalPitches - used
  const percentage = Math.round((used / rack.totalPitches) * 100)
  
  return { used, available, percentage }
}

// 機器タイプ別の統計を取得
export function getEquipmentStatsByType(racks: Rack[]): Record<string, number> {
  const stats: Record<string, number> = {}
  
  racks.forEach(rack => {
    rack.slots.forEach(slot => {
      if (slot.equipment && slot.pitch === slot.equipment.height) {
        const type = slot.equipment.type
        stats[type] = (stats[type] || 0) + 1
      }
    })
  })
  
  return stats
}