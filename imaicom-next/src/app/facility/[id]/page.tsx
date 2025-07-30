'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import AuthHeader from '@/components/AuthHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  MapPin, User, Mail, Phone, Building2, Calendar, AlertCircle, 
  CheckCircle, Wrench, Thermometer, Droplets, Wind, Zap,
  Server, Camera, FileText, Download, ChevronRight, Clock,
  Activity, Package, AlertTriangle, Image, Leaf
} from 'lucide-react'
import { 
  regionalManagers,
  generateEquipmentForFacility,
  generateRacksForFacility,
  generateInspectionHistory,
  generateIncidents,
  generateRepairs,
  getFacilityType,
  generateOrganizationChart,
  calculateFacilityPowerMetrics
} from '@/data/facility-details'
import { generateFileDownloads } from '@/data/file-downloads'
import OrganizationChart from '@/components/OrganizationChart'
import { FacilityDetail } from '@/data/facilities-with-full-details'
import RealTimeMetrics from '@/components/RealTimeMetrics'
import CameraView from '@/components/CameraView'
import WorkLogs from '@/components/WorkLogs'
import { 
  generateInspectionReport, 
  generateEquipmentCSV, 
  generateInspectionPhotos,
  downloadFile,
  downloadPDF,
  downloadPhotoZip
} from '@/utils/fileGenerators'
import EquipmentTables from '@/components/EquipmentTables'
import RackLayoutView from '@/components/RackLayoutView'
import RackLayoutDetailedView from '@/components/RackLayoutDetailedView'
import HeadendRackView from '@/components/HeadendRackView'
import HeadendRackViewSidebar from '@/components/HeadendRackViewSidebar'
import EquipmentRegistrationModal from '@/components/EquipmentRegistrationModal'

// 施設タイプごとの基本情報テンプレート
const facilityBasicInfoTemplates = {
  large: {
    area: '約450㎡',
    floors: '2階建て',
    accessRestriction: '24時間入退室管理',
    remarks: '試験設備あり、耐震補強済み（2020年）'
  },
  medium: {
    area: '約250㎡',
    floors: '1階建て',
    accessRestriction: '営業時間内入退室管理',
    remarks: '標準設備、耐震基準適合'
  },
  small: {
    area: '約120㎡',
    floors: '1階建て',
    accessRestriction: '事前申請制',
    remarks: '基本設備のみ'
  }
}

export default function FacilityDetailPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const [facility, setFacility] = useState<any>(null)
  const [facilityData, setFacilityData] = useState<any>(null)
  const [organizationData, setOrganizationData] = useState<any>(null)
  const [fileDownloads, setFileDownloads] = useState<any[]>([])
  const [powerMetrics, setPowerMetrics] = useState<any>(null)
  const [inspectionPhotos, setInspectionPhotos] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'organization' | 'rack' | 'power' | 'cooling' | 'disaster' | 'fuel' | 'other' | 'inspection' | 'incident' | 'monitoring' | 'work'>('overview')
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false)

  useEffect(() => {
    // Import facilities dynamically to avoid circular dependencies
    import('@/data/facilities-with-correct-coordinates').then(({ facilitiesWithCorrectCoordinates }) => {
      const foundFacility = facilitiesWithCorrectCoordinates.find(f => f.id === facilityId)
      if (foundFacility) {
        setFacility(foundFacility)
        
        // 宗像HEの場合は専用データを使用
        if (foundFacility.id === 95) {
          import('@/data/munakata-he-detail').then(({ munakataHEData }) => {
            // 基本情報
            setFacilityData({
              basicInfo: {
                facilityId: munakataHEData.basic.facilityId,
                openedYear: `${munakataHEData.basic.openedYear}年`,
                department: foundFacility.managementOrg,
                area: `約${munakataHEData.basic.buildingInfo.totalArea}㎡`,
                floors: `${munakataHEData.basic.buildingInfo.floors}階建て`,
                accessRestriction: '24時間入退室管理',
                remarks: `ラック数: ${munakataHEData.racks.total}台, 空調: ${munakataHEData.specifications.cooling.type}`
              },
              manager: regionalManagers['九州'].manager,
              technicians: regionalManagers['九州'].technicians,
              equipment: generateEquipmentForFacility(facilityId, foundFacility.name),
              racks: generateRacksForFacility(facilityId),
              inspectionHistory: generateInspectionHistory(facilityId),
              incidents: munakataHEData.maintenanceHistory.map((m, i) => ({
                id: `INC-${i + 1}`,
                date: m.date,
                time: '09:00',
                equipment: m.type,
                issue: m.description,
                cause: m.type,
                responder: '技術チーム',
                action: m.description,
                recoveryDate: m.date,
                result: m.impact
              })),
              repairs: [],
              environmentData: {
                temperature: munakataHEData.metrics.temperature.current,
                humidity: munakataHEData.metrics.humidity.current,
                airflow: 3.2,
                power: munakataHEData.metrics.power.currentUsage / 1000 * 100, // パーセント変換
                lastUpdate: new Date().toLocaleString('ja-JP')
              }
            })
            
            // 電力メトリクスを専用データから設定
            setPowerMetrics({
              monthly: {
                powerConsumption: munakataHEData.metrics.power.currentUsage * 24 * 30,
                electricityCost: munakataHEData.metrics.power.cost,
                co2Emission: munakataHEData.metrics.power.currentUsage * 24 * 30 * 0.518
              },
              annual: {
                powerConsumption: munakataHEData.metrics.power.currentUsage * 24 * 365,
                electricityCost: munakataHEData.metrics.power.cost * 12,
                co2Emission: munakataHEData.metrics.power.currentUsage * 24 * 365 * 0.518
              },
              equipment: []
            })
          })
        } else {
          // 他の施設は既存のロジックを使用
          const facilityType = getFacilityType(facilityId)
          const basicInfo = facilityBasicInfoTemplates[facilityType]
          const regionManager = regionalManagers[foundFacility.region as keyof typeof regionalManagers] || regionalManagers['関東']
          const equipment = generateEquipmentForFacility(facilityId, foundFacility.name)
          
          const actualBasicInfo = {
            ...basicInfo,
            area: foundFacility.remarks.includes('高負荷施設') ? '約450㎡' : basicInfo.area,
            remarks: foundFacility.remarks || basicInfo.remarks
          }
          
          setFacilityData({
            basicInfo: {
              facilityId: foundFacility.facilityId,
              openedYear: `${foundFacility.openedYear}年`,
              department: foundFacility.managementOrg,
              ...actualBasicInfo
            },
            manager: regionManager.manager,
            technicians: regionManager.technicians,
            equipment,
            racks: generateRacksForFacility(facilityId),
            inspectionHistory: generateInspectionHistory(facilityId),
            incidents: generateIncidents(facilityId, equipment),
            repairs: generateRepairs(facilityId, equipment),
            environmentData: {
              temperature: 22 + Math.random() * 4,
              humidity: 40 + Math.random() * 20,
              airflow: 2 + Math.random() * 2,
              power: 20 + Math.random() * 30,
              lastUpdate: new Date().toLocaleString('ja-JP')
            }
          })
          
          const powerData = calculateFacilityPowerMetrics(equipment)
          setPowerMetrics(powerData)
        }
        
        // 共通データの生成
        const orgChart = generateOrganizationChart(foundFacility.region, foundFacility.facilityId)
        setOrganizationData(orgChart)
        
        const downloads = generateFileDownloads(foundFacility.facilityId)
        setFileDownloads(downloads)
        
        const photos = generateInspectionPhotos(foundFacility.facilityId)
        setInspectionPhotos(photos)
      }
    })
  }, [facilityId])

  if (!facility || !facilityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  const statusColors = {
    normal: { bg: 'bg-green-100', text: 'text-green-700', label: '正常' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '要注意' },
    critical: { bg: 'bg-red-100', text: 'text-red-700', label: '要対応' },
    maintenance: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'メンテナンス中' }
  }

  return (
    <ProtectedRoute requiredPermission="view_all_facilities" facilityId={`HE_${String(facilityId).padStart(3, '0')}`}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AuthHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <a href="/" className="hover:text-gray-900">ダッシュボード</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{facility.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[facility.status as keyof typeof statusColors].bg
                } ${statusColors[facility.status as keyof typeof statusColors].text}`}>
                  {statusColors[facility.status as keyof typeof statusColors].label}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {facility.address}
                  </div>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    拠点ID: {facilityData.basicInfo.facilityId}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    開設: {facilityData.basicInfo.openedYear}
                  </div>
                </div>
                {facility.stationCode && (
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      会社コード: {facility.companyCode} | 局: {facility.stationCode} {facility.stationName} | 管理部署: {facility.managementDeptCode} {facility.managementDeptName}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEquipmentModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Package className="h-4 w-4 mr-2" />
                新規機器登録
              </button>
              <button 
                onClick={() => alert('点検報告登録機能を開発中です。')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                点検報告登録
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <div className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab('organization')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'organization'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                組織図
              </button>
              <button
                onClick={() => setActiveTab('rack')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'rack'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ラック
              </button>
              <button
                onClick={() => setActiveTab('power')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'power'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                電源設備
              </button>
              <button
                onClick={() => setActiveTab('cooling')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'cooling'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                空調設備
              </button>
              <button
                onClick={() => setActiveTab('disaster')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'disaster'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                防災設備
              </button>
              <button
                onClick={() => setActiveTab('fuel')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'fuel'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                燃料タンク
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'other'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                その他
              </button>
              <button
                onClick={() => setActiveTab('inspection')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'inspection'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                点検履歴
              </button>
              <button
                onClick={() => setActiveTab('incident')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'incident'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                障害・修理
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'monitoring'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                監視
              </button>
              <button
                onClick={() => setActiveTab('work')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'work'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                作業履歴
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <>
                {/* 宗像HE専用ダッシュボード */}
                {facility.id === 95 && (
                  <div className="mb-6">
                    {(() => {
                      const MunakataHEDashboard = require('@/components/MunakataHEDashboard').default
                      return <MunakataHEDashboard />
                    })()}
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="lg:col-span-1">
                  <h3 className="font-semibold text-gray-900 mb-4">基本情報</h3>
                  <div className="space-y-3 text-sm">
                    {facility.companyCode && (
                      <div>
                        <p className="text-gray-600">会社コード</p>
                        <p className="font-medium">{facility.companyCode}</p>
                      </div>
                    )}
                    {facility.stationCode && facility.stationName && (
                      <div>
                        <p className="text-gray-600">局情報</p>
                        <p className="font-medium">{facility.stationCode} - {facility.stationName}</p>
                      </div>
                    )}
                    {facility.managementDeptCode && facility.managementDeptName && (
                      <div>
                        <p className="text-gray-600">管理部署</p>
                        <p className="font-medium">{facility.managementDeptCode} - {facility.managementDeptName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">ネットワークセンター</p>
                      <p className="font-medium">{facilityData.basicInfo.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">施設面積</p>
                      <p className="font-medium">{facilityData.basicInfo.area}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">階数</p>
                      <p className="font-medium">{facilityData.basicInfo.floors}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">入退室管理</p>
                      <p className="font-medium">{facilityData.basicInfo.accessRestriction}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">備考</p>
                      <p className="font-medium">{facilityData.basicInfo.remarks}</p>
                    </div>
                  </div>
                  
                  {/* 備考に基づく特別なインジケーター */}
                  {facilityData.basicInfo.remarks && (
                    <div className="mt-4 space-y-2">
                      {facilityData.basicInfo.remarks.includes('高負荷施設') && (
                        <div className="flex items-center bg-orange-50 px-3 py-2 rounded-lg">
                          <Zap className="h-4 w-4 text-orange-600 mr-2" />
                          <span className="text-sm text-orange-700">高負荷施設</span>
                        </div>
                      )}
                      {facilityData.basicInfo.remarks.includes('試験設備あり') && (
                        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                          <Server className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-700">試験設備あり</span>
                        </div>
                      )}
                      {facilityData.basicInfo.remarks.includes('遠隔点検対応済み') && (
                        <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-700">遠隔点検対応済み</span>
                        </div>
                      )}
                      {facilityData.basicInfo.remarks.includes('旧型ラックあり') && (
                        <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700">旧型ラックあり</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Manager Info */}
                <div className="lg:col-span-1">
                  <h3 className="font-semibold text-gray-900 mb-4">管理責任者</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{facilityData.manager.name}</p>
                        <p className="text-sm text-gray-600">{facilityData.manager.title}</p>
                      </div>
                      {facilityData.manager.emergency && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          緊急対応可
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {facilityData.manager.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {facilityData.manager.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {facilityData.manager.mobile}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mt-4 mb-2">担当技術者</h4>
                  <div className="space-y-2">
                    {facilityData.technicians.map((tech: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{tech.name}</span>
                          <span className="text-gray-600 ml-2">({tech.speciality})</span>
                        </div>
                        <span className="text-gray-500">{tech.mobile}</span>
                      </div>
                    ))}
                  </div>
                  
                </div>

                {/* Environment & 3DGS */}
                <div className="lg:col-span-1">
                  <h3 className="font-semibold text-gray-900 mb-4">環境データ (リアルタイム)</h3>
                  <RealTimeMetrics
                    baseTemp={facilityData.environmentData.temperature}
                    baseHumidity={facilityData.environmentData.humidity}
                    baseAirflow={facilityData.environmentData.airflow}
                    basePower={facilityData.environmentData.power}
                  />
                  <p className="text-xs text-gray-500 mb-4">
                    最終更新: {facilityData.environmentData.lastUpdate}
                  </p>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">3Dウォークスルー</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      最終スキャン: 2025-01-15
                    </p>
                    <button 
                      onClick={() => alert('3Dウォークスルー機能を開発中です。現在は2025-01-15のスキャンデータを準備中です。')}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      3Dビューで確認
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}

            {activeTab === 'rack' && (
              <div>
                {/* 宗像HEの場合は専用の設備データを表示 */}
                {facility.name === '宗像HE' ? (
                  <div className="space-y-8">
                    <HeadendRackViewSidebar />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">設備一覧データ</h3>
                      <EquipmentTables />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Rack View */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">ラックビュー</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {facilityData.racks.map((rack: any) => (
                          <div key={rack.id} className={`border rounded-lg p-4 ${
                            rack.status === 'critical' ? 'border-red-300 bg-red-50' :
                            rack.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                            'border-gray-300'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{rack.id}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                rack.status === 'critical' ? 'bg-red-100 text-red-700' :
                                rack.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {rack.power}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>場所: {rack.zone}</p>
                              <p>機器数: {rack.equipmentCount}台</p>
                              <p>温度: {rack.temperature}°C</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment Table */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">機器一覧</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="live-indicator">リアルタイム監視</div>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl">
                  <table className="data-table min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            機材ID/種別
                            <div className="status-dot normal"></div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          型番/メーカー
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          設置場所/スロット
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          状態/温度
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          電力/月間消費量
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          導入日/次回点検
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {facilityData.equipment.map((eq: any, index: number) => (
                        <tr 
                          key={eq.id} 
                          className="group transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:shadow-md border-b border-gray-200 dark:border-gray-700"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'fade-in-up 0.4s ease-out forwards'
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`status-dot ${
                                eq.status === 'normal' ? 'normal' : 
                                eq.status === 'warning' ? 'warning' : 
                                eq.status === 'critical' ? 'critical' : ''
                              }`}></div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{eq.assetId || eq.id}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {eq.type}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{eq.model}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{eq.manufacturer}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{eq.rackId || eq.rack}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {eq.slotNumber ? `スロット${eq.slotNumber}` : `${eq.floor} ${eq.zone}`}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full border ${
                                statusColors[eq.status as keyof typeof statusColors].bg
                              } ${statusColors[eq.status as keyof typeof statusColors].text}`}>
                                {statusColors[eq.status as keyof typeof statusColors].label}
                              </span>
                              {eq.temperature && (
                                <div className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                                  eq.temperature > 35 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                  eq.temperature > 30 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  <Thermometer className="h-3 w-3" />
                                  {eq.temperature}°C
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {eq.powerConsumption && (
                                <div className="text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-yellow-500" />
                                  <span className="font-medium">{eq.powerConsumption}kW</span>
                                </div>
                              )}
                              {eq.monthlyPowerConsumption && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  月間: {eq.monthlyPowerConsumption}kWh
                                </p>
                              )}
                              {eq.monthlyCO2Emission && (
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <Leaf className="h-3 w-3" />
                                  CO₂: {eq.monthlyCO2Emission}kg
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-900 dark:text-gray-100">{eq.installDate}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {eq.nextInspection}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button 
                                onClick={() => alert(`${eq.name || eq.type}の詳細情報を表示します。`)}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors tooltip"
                                data-tooltip="詳細表示"
                              >
                                <Activity className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => alert(`${eq.name || eq.type}のリモート制御画面を開きます。`)}
                                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors tooltip"
                                data-tooltip="リモート制御"
                              >
                                <Wrench className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => alert(`${eq.name || eq.type}の点検履歴を表示します。`)}
                                className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors tooltip"
                                data-tooltip="点検履歴"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'inspection' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">点検履歴</h3>
                  <button 
                    onClick={() => alert('点検記録追加機能を開発中です。現在はシステム生成データを表示しています。')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    点検記録追加
                  </button>
                </div>
                
                <div className="space-y-4">
                  {facilityData.inspectionHistory.map((inspection: any) => (
                    <div key={inspection.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      {/* 点検ヘッダー */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-sm font-medium text-gray-900">{inspection.id}</span>
                              <span className="text-sm text-gray-600">{inspection.date}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                inspection.result === '良' ? 'bg-green-100 text-green-700' :
                                inspection.result === '注意' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {inspection.result}
                              </span>
                              {inspection.category && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                  {inspection.category}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-6">
                              <p className="text-sm font-medium text-gray-900">{inspection.target}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                {inspection.inspector}
                              </div>
                              {inspection.hasPhoto && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Camera className="h-4 w-4 mr-1" />
                                  写真あり
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => alert(`点検詳細: ${inspection.id}\n\n詳細な点検結果とデータの確認機能を開発中です。`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            詳細
                          </button>
                        </div>
                      </div>

                      {/* 点検項目詳細 */}
                      {inspection.items && inspection.items.length > 0 && (
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">点検項目結果</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {inspection.items.map((item: any, index: number) => (
                              <div key={index} className={`p-3 rounded-lg border ${
                                item.status === 'normal' ? 'bg-green-50 border-green-200' :
                                item.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                item.status === 'critical' ? 'bg-red-50 border-red-200' :
                                'bg-gray-50 border-gray-200'
                              }`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    item.status === 'normal' ? 'bg-green-100 text-green-700' :
                                    item.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                    item.status === 'critical' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {item.status === 'normal' ? '正常' :
                                     item.status === 'warning' ? '要注意' :
                                     item.status === 'critical' ? '要対応' : '点検済み'}
                                  </span>
                                </div>
                                
                                {/* 測定値 */}
                                {item.measuredValue && (
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">測定値:</span>
                                      <span className={`font-medium ${
                                        item.status === 'critical' ? 'text-red-600' :
                                        item.status === 'warning' ? 'text-yellow-600' :
                                        'text-green-600'
                                      }`}>
                                        {item.measuredValue}{item.unit || ''}
                                      </span>
                                    </div>
                                    {item.normalRange && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        正常範囲: {item.normalRange}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* コメント */}
                                {item.comment && (
                                  <p className="text-xs text-gray-600 mt-2">{item.comment}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 総合コメント */}
                      {inspection.comment && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <span className="font-medium">総合所見: </span>
                            {inspection.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'incident' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Incidents */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">障害履歴</h3>
                  <div className="space-y-3">
                    {facilityData.incidents.length > 0 ? (
                      facilityData.incidents.map((incident: any) => (
                        <div key={incident.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">{incident.id}</span>
                            <span className="text-xs text-gray-600">{incident.date} {incident.time}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{incident.equipment}</p>
                          <p className="text-sm text-gray-700">{incident.issue}</p>
                          <div className="mt-2 space-y-1 text-xs text-gray-600">
                            <p>原因: {incident.cause}</p>
                            <p>対応者: {incident.responder} - {incident.action}</p>
                            <p>復旧: {incident.recoveryDate} ({incident.result})</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">障害履歴はありません</p>
                    )}
                  </div>
                </div>

                {/* Active Repairs */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">修理依頼</h3>
                  <div className="space-y-3">
                    {facilityData.repairs.length > 0 ? (
                      facilityData.repairs.map((repair: any) => (
                        <div key={repair.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-900">{repair.id}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  repair.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {repair.priority === 'high' ? '緊急' : '通常'}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{repair.equipment}</p>
                              <div className="mt-2 text-sm text-gray-600">
                                <p>担当: {repair.assignee}</p>
                                <p>期限: {repair.deadline}</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              {repair.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">現在、修理依頼はありません</p>
                    )}
                  </div>
                  <button className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    新規修理依頼
                  </button>
                </div>
              </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">リアルタイム環境データ</h3>
                  <RealTimeMetrics
                    baseTemp={facilityData.environmentData.temperature}
                    baseHumidity={facilityData.environmentData.humidity}
                    baseAirflow={facilityData.environmentData.airflow}
                    basePower={facilityData.environmentData.power}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    センサーデータは1秒ごとに更新されます
                  </p>
                </div>
                
                <div>
                  <CameraView facilityName={facility.name} cameraCount={4} />
                </div>
              </div>
            )}


            {/* Organization Tab */}
            {activeTab === 'organization' && (
              <div>
                <OrganizationChart facilityId={facility.facilityId} />
              </div>
            )}


            {/* Work Logs Tab */}
            {activeTab === 'work' && (
              <div>
                <WorkLogs facilityId={facility.facilityId} />
              </div>
            )}

            {/* 電源設備タブ */}
            {activeTab === 'power' && (
              <div className="space-y-6">
                {facility.id === 95 ? (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">電源設備一覧</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備区分</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備名</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置場所</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ベンダ名</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">機器名（型番）</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置年月</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">耐用年数</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新年月</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">容量</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(() => {
                            const equipment = require('@/data/munakata-power-equipment').munakataPowerEquipment
                            return equipment.map((item: any) => {
                              const updateStatus = (() => {
                                const renewal = new Date(item.renewalDate)
                                const now = new Date()
                                const monthsUntilRenewal = (renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
                                if (monthsUntilRenewal < 6) return 'critical'
                                if (monthsUntilRenewal < 12) return 'warning'
                                return 'normal'
                              })()
                              
                              return (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.category}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.type}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.location}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.vendor}</td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    <div className="max-w-xs truncate" title={item.model}>{item.model}</div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.installDate}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.lifespan}年</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      updateStatus === 'critical' ? 'bg-red-100 text-red-800' :
                                      updateStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {item.renewalDate}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.capacity || '-'}</td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    <div className="max-w-xs truncate" title={item.remarks}>{item.remarks || '-'}</div>
                                  </td>
                                </tr>
                              )
                            })
                          })()}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 bg-gray-50 text-xs text-gray-600">
                      <p>※ 更新年月が1年以内：<span className="inline-block w-3 h-3 bg-yellow-100 rounded-full mr-1"></span>黄色、6ヶ月以内：<span className="inline-block w-3 h-3 bg-red-100 rounded-full mr-1"></span>赤色で表示</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">電源設備情報</h3>
                    <p className="text-gray-600">標準的な電源設備を配置しています。</p>
                  </div>
                )}
              </div>
            )}

            {/* 空調設備タブ */}
            {activeTab === 'cooling' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">空調設備情報</h3>
                  {facility.id === 95 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">冷却システム</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">方式</span>
                            <span className="font-medium">空冷（間接外気冷房併用）</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">総冷却能力</span>
                            <span className="font-medium">1500 kW</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">現在負荷</span>
                            <span className="font-medium">980 kW (65.3%)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">環境制御</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">設定温度</span>
                            <span className="font-medium">24°C</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">設定湿度</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">冗長性</span>
                            <span className="font-medium">N+1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">標準的な空調設備を配置しています。</p>
                  )}
                </div>
              </div>
            )}

            {/* 防災設備タブ */}
            {activeTab === 'disaster' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">防災設備情報</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">火災検知・消火設備</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">煙感知器</span>
                          <span className="font-medium text-green-600">正常</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">温度感知器</span>
                          <span className="font-medium text-green-600">正常</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">消火設備</span>
                          <span className="font-medium">ガス消火システム</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">その他防災設備</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">避雷設備</span>
                          <span className="font-medium">設置済み</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">耐震対策</span>
                          <span className="font-medium">免震構造</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">非常放送設備</span>
                          <span className="font-medium text-green-600">正常</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 燃料タンクタブ */}
            {activeTab === 'fuel' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">燃料タンク情報</h3>
                  {facility.id === 95 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">タンク仕様</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">容量</span>
                            <span className="font-medium">5,000 リットル</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">現在残量</span>
                            <span className="font-medium">4,200 リットル (84%)</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">燃料種別</span>
                            <span className="font-medium">A重油</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">運転可能時間</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">満タン時</span>
                            <span className="font-medium">72時間</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">現在残量での運転時間</span>
                            <span className="font-medium">約60時間</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">次回給油予定</span>
                            <span className="font-medium">2025年2月15日</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">非常用発電機用の燃料タンクを設置しています。</p>
                  )}
                </div>
              </div>
            )}

            {/* その他タブ */}
            {activeTab === 'other' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">その他の設備</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">セキュリティ設備</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">監視カメラ</span>
                          <span className="font-medium">48台設置</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">入退室管理</span>
                          <span className="font-medium">生体認証＋ICカード</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">侵入検知</span>
                          <span className="font-medium text-green-600">稼働中</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">付帯設備</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">駐車場</span>
                          <span className="font-medium">10台分</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">会議室</span>
                          <span className="font-medium">1室（10名収容）</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">倉庫</span>
                          <span className="font-medium">2室</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* File Downloads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">ファイル・帳票</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 点検報告書 */}
            <button 
              onClick={() => {
                if (facilityData) {
                  const reportData = generateInspectionReport(facilityData, facility.name)
                  downloadPDF(reportData, `${facility.facilityId}_点検報告書_${new Date().toISOString().split('T')[0]}.pdf`)
                }
              }}
              className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">点検報告書</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF形式</p>
                </div>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* 機器一覧CSV */}
            <button 
              onClick={() => {
                if (facilityData && facilityData.equipment) {
                  const csvContent = generateEquipmentCSV(facilityData.equipment)
                  downloadFile(csvContent, `${facility.facilityId}_機器一覧_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
                }
              }}
              className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">機器一覧CSV</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{facilityData?.equipment?.length || 0}件のデータ</p>
                </div>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* 点検写真 */}
            <button 
              onClick={() => {
                downloadPhotoZip(inspectionPhotos, facility.facilityId)
              }}
              className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">点検写真</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{inspectionPhotos.length}枚 (ZIP形式)</p>
                </div>
              </div>
              <Download className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {/* 写真一覧プレビュー */}
          {inspectionPhotos.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Image className="h-4 w-4 mr-2" />
                点検写真一覧
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inspectionPhotos.map((photo, index) => (
                  <div key={photo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{photo.filename}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{photo.category}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{photo.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{photo.size}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{photo.timestamp}</span>
                        </div>
                      </div>
                      <Image className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Equipment Registration Modal */}
      <EquipmentRegistrationModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        facilityId={facility?.facilityId || ''}
      />
      </div>
    </ProtectedRoute>
  )
}