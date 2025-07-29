'use client'

import { useState } from 'react'
import { User, Phone, Mail, Building, MapPin, ChevronDown, ChevronRight } from 'lucide-react'

interface ContactInfo {
  name: string
  title: string
  department?: string
  phone: string
  mobile?: string
  email: string
  location?: string
}

interface OrganizationNode {
  id: string
  role: string
  person: ContactInfo
  children?: OrganizationNode[]
}

// ダミーの組織データ
const organizationData: OrganizationNode = {
  id: 'ceo',
  role: '施設管理責任者',
  person: {
    name: '山田 太郎',
    title: '施設長',
    phone: '03-1234-5678',
    mobile: '090-1234-5678',
    email: 'yamada@headend.jp',
    location: '管理棟 3F'
  },
  children: [
    {
      id: 'tech-manager',
      role: '技術管理責任者',
      person: {
        name: '鈴木 次郎',
        title: '技術部長',
        department: '技術部',
        phone: '03-1234-5679',
        mobile: '090-2345-6789',
        email: 'suzuki@headend.jp',
        location: '技術棟 2F'
      },
      children: [
        {
          id: 'network-lead',
          role: 'ネットワーク主任',
          person: {
            name: '佐藤 三郎',
            title: '主任技師',
            department: 'ネットワーク課',
            phone: '03-1234-5680',
            email: 'sato@headend.jp',
            location: '技術棟 1F'
          }
        },
        {
          id: 'maintenance-lead',
          role: '保守点検主任',
          person: {
            name: '高橋 四郎',
            title: '主任技師',
            department: '保守課',
            phone: '03-1234-5681',
            email: 'takahashi@headend.jp',
            location: '技術棟 1F'
          }
        }
      ]
    },
    {
      id: 'operations-manager',
      role: '運用管理責任者',
      person: {
        name: '田中 花子',
        title: '運用部長',
        department: '運用部',
        phone: '03-1234-5682',
        mobile: '090-3456-7890',
        email: 'tanaka@headend.jp',
        location: '管理棟 2F'
      },
      children: [
        {
          id: 'monitoring-lead',
          role: '監視業務主任',
          person: {
            name: '渡辺 五郎',
            title: '主任',
            department: '監視課',
            phone: '03-1234-5683',
            email: 'watanabe@headend.jp',
            location: '監視室'
          }
        },
        {
          id: 'security-lead',
          role: 'セキュリティ主任',
          person: {
            name: '伊藤 六郎',
            title: '主任',
            department: 'セキュリティ課',
            phone: '03-1234-5684',
            email: 'ito@headend.jp',
            location: '管理棟 1F'
          }
        }
      ]
    }
  ]
}

// 緊急連絡先
const emergencyContacts = [
  {
    title: '緊急時連絡先（24時間）',
    phone: '0120-123-456',
    description: '障害・緊急対応窓口'
  },
  {
    title: '施設警備室',
    phone: '03-1234-5699',
    description: '入退室・セキュリティ関連'
  },
  {
    title: '設備管理会社',
    phone: '03-9876-5432',
    description: '空調・電源設備トラブル'
  }
]

interface OrganizationChartProps {
  facilityId: string
}

export default function OrganizationChart({ facilityId }: OrganizationChartProps) {
  const [selectedPerson, setSelectedPerson] = useState<ContactInfo | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo', 'tech-manager', 'operations-manager']))
  
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }
  
  const renderNode = (node: OrganizationNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    
    return (
      <div key={node.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className="mb-4">
          <div 
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedPerson(node.person)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleNode(node.id)
                    }}
                    className="mr-2 mt-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
                <div className={hasChildren ? '' : 'ml-6'}>
                  <h3 className="font-medium text-gray-900">{node.role}</h3>
                  <p className="text-sm text-gray-600 mt-1">{node.person.name}</p>
                  <p className="text-xs text-gray-500">{node.person.title}</p>
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* 子ノード */}
          {hasChildren && isExpanded && (
            <div className="mt-4 border-l-2 border-gray-200 pl-4">
              {node.children!.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 組織図 */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">管理体制組織図</h3>
          {renderNode(organizationData)}
        </div>
        
        {/* 緊急連絡先 */}
        <div className="mt-6 bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-800 mb-4">緊急連絡先</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-medium text-gray-900">{contact.title}</h4>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-xl font-bold text-red-600 hover:text-red-700 flex items-center mt-1"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {contact.phone}
                </a>
                <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 選択された人の詳細 */}
      <div>
        {selectedPerson ? (
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">連絡先詳細</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">氏名</p>
                <p className="font-medium text-lg">{selectedPerson.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">役職</p>
                <p className="font-medium">{selectedPerson.title}</p>
                {selectedPerson.department && (
                  <p className="text-sm text-gray-500">{selectedPerson.department}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">電話番号</p>
                <a 
                  href={`tel:${selectedPerson.phone}`}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {selectedPerson.phone}
                </a>
                {selectedPerson.mobile && (
                  <a 
                    href={`tel:${selectedPerson.mobile}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedPerson.mobile} (携帯)
                  </a>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">メールアドレス</p>
                <a 
                  href={`mailto:${selectedPerson.email}`}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {selectedPerson.email}
                </a>
              </div>
              
              {selectedPerson.location && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">所在地</p>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedPerson.location}
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={`tel:${selectedPerson.phone}`}
                    className="bg-green-600 text-white rounded-lg px-4 py-2 text-center hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    電話
                  </a>
                  <a 
                    href={`mailto:${selectedPerson.email}`}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 text-center hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    メール
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              組織図の担当者をクリックすると<br />
              詳細な連絡先が表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  )
}