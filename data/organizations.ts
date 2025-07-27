import { Organization } from '@/types'

export const generateOrganization = (facilityId: string): Organization => {
  const facilityNumber = parseInt(facilityId)
  const regionNames = ['北日本', '東日本', '中日本', '西日本', '九州・沖縄']
  const regionIndex = Math.floor((facilityNumber - 1) / 20)
  const regionName = regionNames[Math.min(regionIndex, regionNames.length - 1)]
  
  const divisionNames = ['第一', '第二', '第三', '第四']
  const divisionIndex = Math.floor((facilityNumber - 1) / 25)
  const divisionName = divisionNames[Math.min(divisionIndex, divisionNames.length - 1)]
  
  return {
    id: `org-${facilityId}`,
    name: `${regionName}統括部`,
    position: '統括部長',
    email: `director-${regionName.toLowerCase()}@example.com`,
    phone: '03-1234-5678',
    children: [
      {
        id: `org-${facilityId}-1`,
        name: `設備管理${divisionName}部`,
        position: '部長',
        email: `manager-${divisionName.toLowerCase()}@example.com`,
        phone: '03-2345-6789',
        children: [
          {
            id: `org-${facilityId}-1-1`,
            name: '保守管理課',
            position: '課長',
            email: 'maintenance-chief@example.com',
            phone: '03-3456-7890',
            children: [
              {
                id: `org-${facilityId}-1-1-1`,
                name: '山田健一',
                position: '主任技術者',
                email: 'yamada.k@example.com',
                phone: '090-1234-5678',
              },
              {
                id: `org-${facilityId}-1-1-2`,
                name: '鈴木美智子',
                position: '技術者',
                email: 'suzuki.m@example.com',
                phone: '090-2345-6789',
              },
              {
                id: `org-${facilityId}-1-1-3`,
                name: '田中浩司',
                position: '技術者',
                email: 'tanaka.k@example.com',
                phone: '090-3456-7890',
              },
            ],
          },
          {
            id: `org-${facilityId}-1-2`,
            name: '運用管理課',
            position: '課長',
            email: 'operation-chief@example.com',
            phone: '03-4567-8901',
            children: [
              {
                id: `org-${facilityId}-1-2-1`,
                name: '佐藤直樹',
                position: '主任オペレーター',
                email: 'sato.n@example.com',
                phone: '090-4567-8901',
              },
              {
                id: `org-${facilityId}-1-2-2`,
                name: '高橋由美',
                position: 'オペレーター',
                email: 'takahashi.y@example.com',
                phone: '090-5678-9012',
              },
            ],
          },
        ],
      },
      {
        id: `org-${facilityId}-2`,
        name: 'セキュリティ管理部',
        position: '部長',
        email: 'security-manager@example.com',
        phone: '03-5678-9012',
        children: [
          {
            id: `org-${facilityId}-2-1`,
            name: '監視センター',
            position: 'センター長',
            email: 'monitoring-center@example.com',
            phone: '03-6789-0123',
            children: [
              {
                id: `org-${facilityId}-2-1-1`,
                name: '伊藤隆',
                position: '監視責任者',
                email: 'ito.t@example.com',
                phone: '090-6789-0123',
              },
            ],
          },
        ],
      },
    ],
  }
}