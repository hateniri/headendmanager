// 宗像HE 詳細ラック配置データ（ピッチ内スロット管理）

export interface Slot {
  slotNumber: number  // スロット番号（1-24など）
  portType: 'GbE' | '10GbE' | 'SFP' | 'SFP+' | 'QSFP' | 'Power' | 'Console' | 'RF' | 'Optical'
  status: 'active' | 'inactive' | 'empty' | 'reserved'
  connectedTo?: string  // 接続先
  label?: string  // ポートラベル
}

export interface Equipment {
  id: string
  name: string
  type: string
  category: string  // カテゴリー
  assetNumber: string  // 固定資産番号
  manufacturer: string
  model: string
  installDate: string  // 設置年月日
  warrantyExpire?: string  // 保証期限
  maintenanceContract?: string  // 保守契約
  slots?: Slot[]  // 機器内のスロット情報
  powerConsumption?: number  // 消費電力(W)
  status: 'active' | 'standby' | 'maintenance' | 'fault'
  remarks?: string  // 備考
}

export interface Pitch {
  pitchNumber: number  // 1-42
  equipment?: Equipment
  height: number  // この機器が占有するピッチ数
}

export interface DetailedRack {
  id: string
  name: string
  location: string
  zone: string  // A, B, C, D, E, F...
  row: number  // 列番号
  position: number  // 列内の位置
  totalPitches: 42
  pitches: Pitch[]
}

// HE室の詳細ラック配置
export const detailedRackLayouts: DetailedRack[] = [
  // === Zone A: ネットワーク・配信系 ===
  {
    id: 'RACK-A-1-1',
    name: 'A-1-1',
    location: '1階 HE室',
    zone: 'A',
    row: 1,
    position: 1,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-A-1-1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-001',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-01-15',
          warrantyExpire: '2027-01-14',
          maintenanceContract: '保守契約A',
          status: 'active',
          slots: Array.from({ length: 24 }, (_, i) => ({
            slotNumber: i + 1,
            portType: 'Power' as const,
            status: i < 20 ? 'active' as const : 'empty' as const,
            label: `Outlet ${i + 1}`
          }))
        }
      },
      {
        pitchNumber: 2,
        height: 2,
        equipment: {
          id: 'CMTS-A-1-1-01',
          name: 'CMTS #1',
          type: 'CMTS',
          category: 'ケーブルモデム終端装置',
          assetNumber: 'MNK-CMTS-2023-001',
          manufacturer: 'Cisco',
          model: 'cBR-8',
          installDate: '2023-03-20',
          warrantyExpire: '2026-03-19',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 3000,
          status: 'active',
          slots: [
            // SUP スロット
            { slotNumber: 1, portType: 'Console', status: 'active', label: 'CONSOLE' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'MGT1', connectedTo: 'SW-A-1-2:Port1' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'MGT2', connectedTo: 'SW-A-1-2:Port2' },
            // Line Cards (8 slots, 8 ports each)
            ...Array.from({ length: 64 }, (_, i) => ({
              slotNumber: i + 4,
              portType: 'RF' as const,
              status: i < 48 ? 'active' as const : 'inactive' as const,
              label: `DS${Math.floor(i / 8)}/US${i % 8}`,
              connectedTo: i < 48 ? `Node-${Math.floor(i / 8) + 1}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 3, height: 0 },  // CMTS占有
      {
        pitchNumber: 4,
        height: 2,
        equipment: {
          id: 'CMTS-A-1-1-02',
          name: 'CMTS #2',
          type: 'CMTS',
          category: 'ケーブルモデム終端装置',
          assetNumber: 'MNK-CMTS-2023-002',
          manufacturer: 'Cisco',
          model: 'cBR-8',
          installDate: '2023-03-20',
          warrantyExpire: '2026-03-19',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 3000,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'Console', status: 'active', label: 'CONSOLE' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'MGT1', connectedTo: 'SW-A-1-2:Port3' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'MGT2', connectedTo: 'SW-A-1-2:Port4' },
            ...Array.from({ length: 64 }, (_, i) => ({
              slotNumber: i + 4,
              portType: 'RF' as const,
              status: i < 48 ? 'active' as const : 'inactive' as const,
              label: `DS${Math.floor(i / 8)}/US${i % 8}`,
              connectedTo: i < 48 ? `Node-${Math.floor(i / 8) + 65}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 5, height: 0 },  // CMTS占有
      {
        pitchNumber: 6,
        height: 1,
        equipment: {
          id: 'SW-A-1-1-01',
          name: 'アグリゲーションスイッチ',
          type: 'SWITCH',
          category: 'ネットワーク機器',
          assetNumber: 'MNK-SW-2023-001',
          manufacturer: 'Cisco',
          model: 'Nexus 9336C-FX2',
          installDate: '2023-04-10',
          warrantyExpire: '2026-04-09',
          maintenanceContract: '保守契約B',
          powerConsumption: 800,
          status: 'active',
          slots: [
            // 36 x 100G QSFP ports
            ...Array.from({ length: 36 }, (_, i) => ({
              slotNumber: i + 1,
              portType: 'QSFP' as const,
              status: i < 24 ? 'active' as const : 'inactive' as const,
              label: `Ethernet1/${i + 1}`,
              connectedTo: i < 12 ? `CMTS-${Math.floor(i / 2) + 1}` : 
                          i < 24 ? `Server-${i - 11}` : undefined
            }))
          ]
        }
      },
      // ピッチ7-20: サーバー群
      ...Array.from({ length: 7 }, (_, i) => ({
        pitchNumber: 7 + (i * 2),
        height: 2,
        equipment: {
          id: `SRV-A-1-1-${String(i + 1).padStart(2, '0')}`,
          name: `配信サーバー #${i + 1}`,
          type: 'SERVER',
          category: 'サーバー',
          assetNumber: `MNK-SRV-2023-${String(i + 1).padStart(3, '0')}`,
          manufacturer: 'Dell',
          model: 'PowerEdge R750',
          installDate: '2023-05-15',
          warrantyExpire: '2026-05-14',
          maintenanceContract: '保守契約A-GOLD',
          powerConsumption: 750,
          status: 'active' as const,
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'iDRAC', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'NIC1', connectedTo: `SW-A-1-1-01:Port${13 + i}` },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'NIC2', connectedTo: `SW-A-1-2-01:Port${13 + i}` },
            { slotNumber: 4, portType: '10GbE', status: 'inactive', label: 'NIC3' },
            { slotNumber: 5, portType: '10GbE', status: 'inactive', label: 'NIC4' }
          ]
        }
      })),
      // 占有ピッチ
      ...Array.from({ length: 6 }, (_, i) => ({
        pitchNumber: 8 + (i * 2),
        height: 0
      })),
      // ピッチ21-30: ストレージ
      {
        pitchNumber: 21,
        height: 4,
        equipment: {
          id: 'STG-A-1-1-01',
          name: 'ストレージアレイ #1',
          type: 'STORAGE',
          category: 'ストレージ',
          assetNumber: 'MNK-STG-2023-001',
          manufacturer: 'NetApp',
          model: 'FAS8300',
          installDate: '2023-06-01',
          warrantyExpire: '2026-05-31',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 2000,
          status: 'active',
          slots: [
            // Controller A
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'e0M-A', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'e0a-A', connectedTo: 'SW-A-1-1-01:Port25' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'e0b-A', connectedTo: 'SW-A-1-1-01:Port26' },
            // Controller B
            { slotNumber: 4, portType: 'GbE', status: 'active', label: 'e0M-B', connectedTo: 'MGT-SW' },
            { slotNumber: 5, portType: '10GbE', status: 'active', label: 'e0a-B', connectedTo: 'SW-A-1-1-01:Port27' },
            { slotNumber: 6, portType: '10GbE', status: 'active', label: 'e0b-B', connectedTo: 'SW-A-1-1-01:Port28' }
          ]
        }
      },
      { pitchNumber: 22, height: 0 },
      { pitchNumber: 23, height: 0 },
      { pitchNumber: 24, height: 0 },
      // ピッチ25-40: 空き
      ...Array.from({ length: 16 }, (_, i) => ({
        pitchNumber: 25 + i,
        height: 1,
        equipment: undefined
      })),
      // ピッチ41-42: ケーブル管理
      {
        pitchNumber: 41,
        height: 1,
        equipment: {
          id: 'CBL-A-1-1-01',
          name: 'ケーブル管理パネル（横配線）',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-001',
          manufacturer: 'Panduit',
          model: 'WMPFSE',
          installDate: '2024-01-10',
          status: 'active'
        }
      },
      {
        pitchNumber: 42,
        height: 1,
        equipment: {
          id: 'CBL-A-1-1-02',
          name: 'ケーブル管理パネル（縦配線）',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-002',
          manufacturer: 'Panduit',
          model: 'WMPVHCF',
          installDate: '2024-01-10',
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'RACK-A-1-2',
    name: 'A-1-2',
    location: '1階 HE室',
    zone: 'A',
    row: 1,
    position: 2,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-A-1-2-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-002',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-01-15',
          warrantyExpire: '2027-01-14',
          maintenanceContract: '保守契約A',
          status: 'active',
          slots: Array.from({ length: 24 }, (_, i) => ({
            slotNumber: i + 1,
            portType: 'Power' as const,
            status: i < 18 ? 'active' as const : 'empty' as const,
            label: `Outlet ${i + 1}`
          }))
        }
      },
      // ピッチ2-10: ルーター・ファイアウォール
      {
        pitchNumber: 2,
        height: 2,
        equipment: {
          id: 'RTR-A-1-2-01',
          name: 'コアルーター #1',
          type: 'ROUTER',
          category: 'ネットワーク機器',
          assetNumber: 'MNK-RTR-2023-001',
          manufacturer: 'Cisco',
          model: 'ASR 9006',
          installDate: '2023-02-15',
          warrantyExpire: '2026-02-14',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 2500,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'Console', status: 'active', label: 'CON' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'GE0/0/0', connectedTo: 'IX-Tokyo' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'GE0/0/1', connectedTo: 'IX-Osaka' },
            { slotNumber: 4, portType: '10GbE', status: 'active', label: 'GE0/1/0', connectedTo: 'RTR-A-1-2-02:GE0/1/0' },
            { slotNumber: 5, portType: '10GbE', status: 'active', label: 'GE0/1/1', connectedTo: 'FW-A-1-2-01:Port1' }
          ]
        }
      },
      { pitchNumber: 3, height: 0 },
      {
        pitchNumber: 4,
        height: 2,
        equipment: {
          id: 'RTR-A-1-2-02',
          name: 'コアルーター #2',
          type: 'ROUTER',
          category: 'ネットワーク機器',
          assetNumber: 'MNK-RTR-2023-002',
          manufacturer: 'Cisco',
          model: 'ASR 9006',
          installDate: '2023-02-15',
          warrantyExpire: '2026-02-14',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 2500,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'Console', status: 'active', label: 'CON' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'GE0/0/0', connectedTo: 'Transit-ISP1' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'GE0/0/1', connectedTo: 'Transit-ISP2' },
            { slotNumber: 4, portType: '10GbE', status: 'active', label: 'GE0/1/0', connectedTo: 'RTR-A-1-2-01:GE0/1/0' },
            { slotNumber: 5, portType: '10GbE', status: 'active', label: 'GE0/1/1', connectedTo: 'FW-A-1-2-02:Port1' }
          ]
        }
      },
      { pitchNumber: 5, height: 0 },
      {
        pitchNumber: 6,
        height: 1,
        equipment: {
          id: 'FW-A-1-2-01',
          name: 'ファイアウォール #1',
          type: 'FIREWALL',
          category: 'セキュリティ機器',
          assetNumber: 'MNK-FW-2023-001',
          manufacturer: 'Palo Alto',
          model: 'PA-5280',
          installDate: '2023-03-01',
          warrantyExpire: '2026-02-28',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 1200,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'Port1', connectedTo: 'RTR-A-1-2-01:GE0/1/1' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'Port2', connectedTo: 'SW-A-1-2-01:Port1' },
            { slotNumber: 4, portType: '10GbE', status: 'active', label: 'Port3', connectedTo: 'FW-A-1-2-02:Port3' },
            { slotNumber: 5, portType: '10GbE', status: 'inactive', label: 'Port4' }
          ]
        }
      },
      {
        pitchNumber: 7,
        height: 1,
        equipment: {
          id: 'FW-A-1-2-02',
          name: 'ファイアウォール #2',
          type: 'FIREWALL',
          category: 'セキュリティ機器',
          assetNumber: 'MNK-FW-2023-002',
          manufacturer: 'Palo Alto',
          model: 'PA-5280',
          installDate: '2023-03-01',
          warrantyExpire: '2026-02-28',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 1200,
          status: 'standby',
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: '10GbE', status: 'active', label: 'Port1', connectedTo: 'RTR-A-1-2-02:GE0/1/1' },
            { slotNumber: 3, portType: '10GbE', status: 'active', label: 'Port2', connectedTo: 'SW-A-1-2-01:Port2' },
            { slotNumber: 4, portType: '10GbE', status: 'active', label: 'Port3', connectedTo: 'FW-A-1-2-01:Port3' },
            { slotNumber: 5, portType: '10GbE', status: 'inactive', label: 'Port4' }
          ]
        }
      },
      // ピッチ8-15: コアスイッチ
      {
        pitchNumber: 8,
        height: 2,
        equipment: {
          id: 'SW-A-1-2-01',
          name: 'コアスイッチ #1',
          type: 'SWITCH',
          category: 'ネットワーク機器',
          assetNumber: 'MNK-SW-2023-002',
          manufacturer: 'Juniper',
          model: 'QFX10008',
          installDate: '2023-04-01',
          warrantyExpire: '2026-03-31',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 3500,
          status: 'active',
          slots: [
            // Line cards with 48 ports each
            ...Array.from({ length: 96 }, (_, i) => ({
              slotNumber: i + 1,
              portType: i < 48 ? '10GbE' as const : '40GbE' as const,
              status: i < 72 ? 'active' as const : 'inactive' as const,
              label: `et-${Math.floor(i / 48)}/${Math.floor((i % 48) / 4)}/[${i % 4}]`,
              connectedTo: i < 24 ? `Zone-A-Device-${i + 1}` : 
                          i < 48 ? `Zone-B-Device-${i - 23}` :
                          i < 72 ? `Uplink-${i - 47}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 9, height: 0 },
      {
        pitchNumber: 10,
        height: 2,
        equipment: {
          id: 'SW-A-1-2-02',
          name: 'コアスイッチ #2',
          type: 'SWITCH',
          category: 'ネットワーク機器',
          assetNumber: 'MNK-SW-2023-003',
          manufacturer: 'Juniper',
          model: 'QFX10008',
          installDate: '2023-04-01',
          warrantyExpire: '2026-03-31',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 3500,
          status: 'active',
          slots: [
            ...Array.from({ length: 96 }, (_, i) => ({
              slotNumber: i + 1,
              portType: i < 48 ? '10GbE' as const : '40GbE' as const,
              status: i < 72 ? 'active' as const : 'inactive' as const,
              label: `et-${Math.floor(i / 48)}/${Math.floor((i % 48) / 4)}/[${i % 4}]`,
              connectedTo: i < 24 ? `Zone-C-Device-${i + 1}` : 
                          i < 48 ? `Zone-D-Device-${i - 23}` :
                          i < 72 ? `Uplink-${i - 47}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 11, height: 0 },
      // ピッチ12-40: 空き（将来拡張用）
      ...Array.from({ length: 29 }, (_, i) => ({
        pitchNumber: 12 + i,
        height: 1,
        equipment: undefined
      })),
      // ピッチ41-42: ケーブル管理
      {
        pitchNumber: 41,
        height: 1,
        equipment: {
          id: 'CBL-A-1-2-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-003',
          manufacturer: 'Panduit',
          model: 'WMPFSE',
          installDate: '2024-01-10',
          status: 'active'
        }
      },
      {
        pitchNumber: 42,
        height: 1,
        equipment: {
          id: 'CBL-A-1-2-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-004',
          manufacturer: 'Panduit',
          model: 'WMPFSE',
          installDate: '2024-01-10',
          status: 'active'
        }
      }
    ]
  },
  // === Zone B: 光伝送・映像処理系 ===
  {
    id: 'RACK-B-1-1',
    name: 'B-1-1',
    location: '1階 HE室',
    zone: 'B',
    row: 1,
    position: 1,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-B-1-1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-003',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-01-15',
          warrantyExpire: '2027-01-14',
          maintenanceContract: '保守契約A',
          status: 'active'
        }
      },
      // ピッチ2-10: 光伝送装置
      {
        pitchNumber: 2,
        height: 3,
        equipment: {
          id: 'OPT-B-1-1-01',
          name: '光伝送装置 #1',
          type: 'OPTICAL',
          category: '光伝送装置',
          assetNumber: 'MNK-OPT-2023-001',
          manufacturer: 'Fujitsu',
          model: 'FLASHWAVE 9500',
          installDate: '2023-07-01',
          warrantyExpire: '2026-06-30',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 1500,
          status: 'active',
          slots: [
            // 制御ポート
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT1', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: 'Console', status: 'active', label: 'CON' },
            // 光ポート (100G x 16)
            ...Array.from({ length: 16 }, (_, i) => ({
              slotNumber: i + 3,
              portType: 'Optical' as const,
              status: i < 12 ? 'active' as const : 'inactive' as const,
              label: `100G-${i + 1}`,
              connectedTo: i < 12 ? `Remote-Site-${i + 1}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 3, height: 0 },
      { pitchNumber: 4, height: 0 },
      {
        pitchNumber: 5,
        height: 3,
        equipment: {
          id: 'OPT-B-1-1-02',
          name: '光伝送装置 #2',
          type: 'OPTICAL',
          category: '光伝送装置',
          assetNumber: 'MNK-OPT-2023-002',
          manufacturer: 'Fujitsu',
          model: 'FLASHWAVE 9500',
          installDate: '2023-07-01',
          warrantyExpire: '2026-06-30',
          maintenanceContract: '保守契約B-GOLD',
          powerConsumption: 1500,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT1', connectedTo: 'MGT-SW' },
            { slotNumber: 2, portType: 'Console', status: 'active', label: 'CON' },
            ...Array.from({ length: 16 }, (_, i) => ({
              slotNumber: i + 3,
              portType: 'Optical' as const,
              status: i < 12 ? 'active' as const : 'inactive' as const,
              label: `100G-${i + 1}`,
              connectedTo: i < 12 ? `Remote-Site-${i + 13}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 6, height: 0 },
      { pitchNumber: 7, height: 0 },
      // ピッチ8-12: WDM装置
      {
        pitchNumber: 8,
        height: 2,
        equipment: {
          id: 'WDM-B-1-1-01',
          name: 'WDM装置 #1',
          type: 'WDM',
          category: '光伝送装置',
          assetNumber: 'MNK-WDM-2023-001',
          manufacturer: 'Ciena',
          model: '6500',
          installDate: '2023-08-01',
          warrantyExpire: '2026-07-31',
          maintenanceContract: '保守契約B',
          powerConsumption: 800,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT', connectedTo: 'MGT-SW' },
            // 40波長分のチャンネル
            ...Array.from({ length: 40 }, (_, i) => ({
              slotNumber: i + 2,
              portType: 'Optical' as const,
              status: i < 32 ? 'active' as const : 'reserved' as const,
              label: `CH${i + 1}`,
              connectedTo: i < 32 ? `Lambda-${i + 1}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 9, height: 0 },
      {
        pitchNumber: 10,
        height: 2,
        equipment: {
          id: 'WDM-B-1-1-02',
          name: 'WDM装置 #2',
          type: 'WDM',
          category: '光伝送装置',
          assetNumber: 'MNK-WDM-2023-002',
          manufacturer: 'Ciena',
          model: '6500',
          installDate: '2023-08-01',
          warrantyExpire: '2026-07-31',
          maintenanceContract: '保守契約B',
          powerConsumption: 800,
          status: 'active',
          slots: [
            { slotNumber: 1, portType: 'GbE', status: 'active', label: 'MGT', connectedTo: 'MGT-SW' },
            ...Array.from({ length: 40 }, (_, i) => ({
              slotNumber: i + 2,
              portType: 'Optical' as const,
              status: i < 32 ? 'active' as const : 'reserved' as const,
              label: `CH${i + 41}`,
              connectedTo: i < 32 ? `Lambda-${i + 41}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 11, height: 0 },
      // ピッチ12-24: 光配線盤
      {
        pitchNumber: 12,
        height: 6,
        equipment: {
          id: 'ODF-B-1-1-01',
          name: '光配線盤 #1 (576芯)',
          type: 'ODF',
          category: '光配線設備',
          assetNumber: 'MNK-ODF-2023-001',
          manufacturer: 'フジクラ',
          model: 'FTB-576',
          installDate: '2023-09-01',
          warrantyExpire: '2025-08-31',
          status: 'active',
          slots: [
            // 24トレイ x 24芯 = 576芯
            ...Array.from({ length: 576 }, (_, i) => ({
              slotNumber: i + 1,
              portType: 'Optical' as const,
              status: i < 480 ? 'active' as const : 'empty' as const,
              label: `Tray${Math.floor(i / 24) + 1}-${(i % 24) + 1}`,
              connectedTo: i < 480 ? `Field-${Math.floor(i / 12) + 1}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 13, height: 0 },
      { pitchNumber: 14, height: 0 },
      { pitchNumber: 15, height: 0 },
      { pitchNumber: 16, height: 0 },
      { pitchNumber: 17, height: 0 },
      {
        pitchNumber: 18,
        height: 6,
        equipment: {
          id: 'ODF-B-1-1-02',
          name: '光配線盤 #2 (576芯)',
          type: 'ODF',
          category: '光配線設備',
          assetNumber: 'MNK-ODF-2023-002',
          manufacturer: 'フジクラ',
          model: 'FTB-576',
          installDate: '2023-09-01',
          warrantyExpire: '2025-08-31',
          status: 'active',
          slots: [
            ...Array.from({ length: 576 }, (_, i) => ({
              slotNumber: i + 1,
              portType: 'Optical' as const,
              status: i < 480 ? 'active' as const : 'empty' as const,
              label: `Tray${Math.floor(i / 24) + 1}-${(i % 24) + 1}`,
              connectedTo: i < 480 ? `Field-${Math.floor(i / 12) + 481}` : undefined
            }))
          ]
        }
      },
      { pitchNumber: 19, height: 0 },
      { pitchNumber: 20, height: 0 },
      { pitchNumber: 21, height: 0 },
      { pitchNumber: 22, height: 0 },
      { pitchNumber: 23, height: 0 },
      // ピッチ24-40: 空き
      ...Array.from({ length: 17 }, (_, i) => ({
        pitchNumber: 24 + i,
        height: 1,
        equipment: undefined
      })),
      // ピッチ41-42: ケーブル管理
      {
        pitchNumber: 41,
        height: 1,
        equipment: {
          id: 'CBL-B-1-1-01',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-005',
          manufacturer: 'Panduit',
          model: 'WMPFSE',
          installDate: '2024-01-10',
          status: 'active'
        }
      },
      {
        pitchNumber: 42,
        height: 1,
        equipment: {
          id: 'CBL-B-1-1-02',
          name: 'ケーブル管理パネル',
          type: 'CABLE_MGMT',
          category: 'ケーブル管理',
          assetNumber: 'MNK-CBL-2024-006',
          manufacturer: 'Panduit',
          model: 'WMPFSE',
          installDate: '2024-01-10',
          status: 'active'
        }
      }
    ]
  },
  // === Zone C: 電源・UPS系 ===
  {
    id: 'RACK-C-1-1',
    name: 'C-1-1',
    location: '1階 UPS室',
    zone: 'C',
    row: 1,
    position: 1,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-C-1-1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-004',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-01-10',
          warrantyExpire: '2027-01-09',
          maintenanceContract: '保守契約A',
          status: 'active'
        }
      },
      // ピッチ2-7: 大型UPS #1
      {
        pitchNumber: 2,
        height: 6,
        equipment: {
          id: 'UPS-C-1-1-01',
          name: 'UPS 100kVA #1',
          type: 'UPS',
          category: '電源設備',
          assetNumber: 'MNK-UPS-2023-001',
          manufacturer: '三菱電機',
          model: 'PUSTAR-H100',
          installDate: '2023-01-20',
          warrantyExpire: '2026-01-19',
          maintenanceContract: '保守契約A-GOLD',
          powerConsumption: 5000,
          status: 'active'
        }
      },
      { pitchNumber: 3, height: 0 },
      { pitchNumber: 4, height: 0 },
      { pitchNumber: 5, height: 0 },
      { pitchNumber: 6, height: 0 },
      { pitchNumber: 7, height: 0 },
      // ピッチ8-13: 大型UPS #2
      {
        pitchNumber: 8,
        height: 6,
        equipment: {
          id: 'UPS-C-1-1-02',
          name: 'UPS 100kVA #2',
          type: 'UPS',
          category: '電源設備',
          assetNumber: 'MNK-UPS-2023-002',
          manufacturer: '三菱電機',
          model: 'PUSTAR-H100',
          installDate: '2023-01-20',
          warrantyExpire: '2026-01-19',
          maintenanceContract: '保守契約A-GOLD',
          powerConsumption: 5000,
          status: 'active'
        }
      },
      { pitchNumber: 9, height: 0 },
      { pitchNumber: 10, height: 0 },
      { pitchNumber: 11, height: 0 },
      { pitchNumber: 12, height: 0 },
      { pitchNumber: 13, height: 0 },
      // ピッチ14-42: 空き
      ...Array.from({ length: 29 }, (_, i) => ({
        pitchNumber: 14 + i,
        height: 1,
        equipment: undefined
      }))
    ]
  },
  // === Zone D: 監視・管理系 ===
  {
    id: 'RACK-D-1-1',
    name: 'D-1-1',
    location: '1階 HE室',
    zone: 'D',
    row: 1,
    position: 1,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-D-1-1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-005',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-01-12',
          warrantyExpire: '2027-01-11',
          maintenanceContract: '保守契約A',
          status: 'active'
        }
      },
      // ピッチ2-4: 監視サーバー
      {
        pitchNumber: 2,
        height: 2,
        equipment: {
          id: 'MON-D-1-1-01',
          name: '統合監視サーバー',
          type: 'MONITOR',
          category: '監視装置',
          assetNumber: 'MNK-MON-2023-001',
          manufacturer: 'HP',
          model: 'ProLiant DL380',
          installDate: '2023-06-15',
          warrantyExpire: '2026-06-14',
          maintenanceContract: '保守契約B',
          powerConsumption: 800,
          status: 'active'
        }
      },
      { pitchNumber: 3, height: 0 },
      // ピッチ4-5: 環境監視装置
      {
        pitchNumber: 4,
        height: 1,
        equipment: {
          id: 'ENV-D-1-1-01',
          name: '環境監視装置',
          type: 'SENSOR',
          category: '監視装置',
          assetNumber: 'MNK-ENV-2023-001',
          manufacturer: 'オムロン',
          model: 'K8DT-AS3CD',
          installDate: '2023-07-01',
          warrantyExpire: '2026-06-30',
          status: 'active'
        }
      },
      // ピッチ5-42: 空き
      ...Array.from({ length: 37 }, (_, i) => ({
        pitchNumber: 5 + i,
        height: 1,
        equipment: undefined
      }))
    ]
  },
  // === Zone E: 予備・拡張エリア ===
  {
    id: 'RACK-E-1-1',
    name: 'E-1-1',
    location: '1階 HE室',
    zone: 'E',
    row: 1,
    position: 1,
    totalPitches: 42,
    pitches: [
      {
        pitchNumber: 1,
        height: 1,
        equipment: {
          id: 'PDU-E-1-1-01',
          name: '電源分配ユニット',
          type: 'PDU',
          category: '電源設備',
          assetNumber: 'MNK-PDU-2024-006',
          manufacturer: 'Schneider',
          model: 'AP8886',
          installDate: '2024-02-01',
          warrantyExpire: '2027-01-31',
          status: 'active'
        }
      },
      // ピッチ2-42: 空き（予備エリア）
      ...Array.from({ length: 41 }, (_, i) => ({
        pitchNumber: 2 + i,
        height: 1,
        equipment: undefined
      }))
    ]
  }
]

// ヘルパー関数
export function getRackByZone(zone: string): DetailedRack[] {
  return detailedRackLayouts.filter(rack => rack.zone === zone)
}

export function getEquipmentByType(type: string): Array<{rack: DetailedRack, pitch: Pitch, equipment: Equipment}> {
  const results: Array<{rack: DetailedRack, pitch: Pitch, equipment: Equipment}> = []
  
  detailedRackLayouts.forEach(rack => {
    rack.pitches.forEach(pitch => {
      if (pitch.equipment && pitch.equipment.type === type) {
        results.push({ rack, pitch, equipment: pitch.equipment })
      }
    })
  })
  
  return results
}

export function getConnectionMap(): Map<string, string[]> {
  const connections = new Map<string, string[]>()
  
  detailedRackLayouts.forEach(rack => {
    rack.pitches.forEach(pitch => {
      if (pitch.equipment && pitch.equipment.slots) {
        pitch.equipment.slots.forEach(slot => {
          if (slot.connectedTo) {
            const key = `${pitch.equipment!.id}:${slot.label}`
            if (!connections.has(key)) {
              connections.set(key, [])
            }
            connections.get(key)!.push(slot.connectedTo)
          }
        })
      }
    })
  })
  
  return connections
}

// ラック使用率計算（ピッチベース）
export function calculateDetailedRackUtilization(rack: DetailedRack): {
  totalPitches: number
  usedPitches: number
  availablePitches: number
  utilizationRate: number
  equipmentCount: number
} {
  let usedPitches = 0
  let equipmentCount = 0
  
  rack.pitches.forEach(pitch => {
    if (pitch.equipment) {
      if (pitch.height > 0) {  // 実際の機器（占有ピッチは除く）
        equipmentCount++
        usedPitches += pitch.height
      }
    }
  })
  
  const availablePitches = rack.totalPitches - usedPitches
  const utilizationRate = Math.round((usedPitches / rack.totalPitches) * 100)
  
  return {
    totalPitches: rack.totalPitches,
    usedPitches,
    availablePitches,
    utilizationRate,
    equipmentCount
  }
}