import { Rack, Equipment } from '@/types'

const generateEquipment = (facilityId: string, rackNumber: string, floor: number): Equipment[] => {
  const equipmentTypes = [
    { name: 'ネットワークスイッチ', manufacturer: 'Cisco', models: ['Catalyst 9300', 'Catalyst 3850', 'Nexus 9000'] },
    { name: 'ルーター', manufacturer: 'Juniper', models: ['MX240', 'MX480', 'SRX5400'] },
    { name: 'ファイアウォール', manufacturer: 'Fortinet', models: ['FortiGate 600E', 'FortiGate 1000D', 'FortiGate 3000D'] },
    { name: 'サーバー', manufacturer: 'Dell', models: ['PowerEdge R740', 'PowerEdge R840', 'PowerEdge R940'] },
    { name: 'ストレージ', manufacturer: 'NetApp', models: ['FAS8200', 'AFF A400', 'AFF A700'] },
    { name: 'UPS', manufacturer: 'APC', models: ['Smart-UPS RT 10000', 'Symmetra PX 40kW', 'Galaxy VS'] },
    { name: '空調機器', manufacturer: 'Daikin', models: ['FVXS50F', 'RXS50L', 'FTXS50K'] },
    { name: '監視装置', manufacturer: 'NEC', models: ['WebSAM', 'SystemManager G', 'ESMPRO'] },
  ]

  const statuses: ('normal' | 'warning' | 'error')[] = ['normal', 'normal', 'normal', 'normal', 'warning', 'error']
  
  return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => {
    const type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]
    const model = type.models[Math.floor(Math.random() * type.models.length)]
    const installYear = 2024 - Math.floor(Math.random() * 10)
    const temperature = 20 + Math.random() * 15
    
    return {
      id: `${facilityId}-${rackNumber}-${i + 1}`,
      name: `${type.name} ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      temperature: Math.round(temperature * 10) / 10,
      installDate: `${installYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      lifespan: type.name === 'UPS' ? 5 : type.name === '空調機器' ? 10 : 7,
      model: model,
      manufacturer: type.manufacturer,
    }
  })
}

export const generateRacks = (facilityId: string, floors: number): Rack[] => {
  const racks: Rack[] = []
  
  for (let floor = 1; floor <= floors; floor++) {
    const rackCount = Math.floor(Math.random() * 8) + 12 // 12-20 racks per floor
    
    for (let i = 1; i <= rackCount; i++) {
      const rackNumber = `${floor}F-${String(i).padStart(2, '0')}`
      racks.push({
        id: `${facilityId}-${rackNumber}`,
        facilityId,
        rackNumber,
        floor,
        equipment: generateEquipment(facilityId, rackNumber, floor),
      })
    }
  }
  
  return racks
}