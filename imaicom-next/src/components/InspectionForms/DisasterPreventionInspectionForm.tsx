'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Download, FileSpreadsheet, FileText } from 'lucide-react'
import CommonInspectionHeader, { CommonInspectionData } from './CommonInspectionHeader'
import { exportToExcel, exportToPDF, formatInspectionDataForExcel } from '@/utils/exportUtils'
import { useInspectionHistoryStore } from '@/store/inspectionHistoryStore'

interface DisasterPreventionInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

interface Inspector {
  id: string
  name: string
  qualificationNumber: string
}

interface HalogenSystem {
  id: string
  containerAppearance: '○' | '×' | '－'
  extinguishingAgentAmount: string
  containerPressure: string
  pressureJudgment: '○' | '×' | '－'
  safetyValve: '○' | '×' | '－'
  electromagneticValve: '○' | '×' | '－'
  piping: '○' | '×' | '－'
  supportBracket: '○' | '×' | '－'
  nozzleCount: string
  nozzleDegradation: '○' | '×' | '－'
  openCloseValve: '○' | '×' | '－'
  startGasContainer: '○' | '×' | '－'
  operationPipe: '○' | '×' | '－'
  releaseTestDone: '○' | '×' | '－'
  releaseTime: string
  emergencyPowerVoltage: string
  controlPanelAlarm: '○' | '×' | '不明'
  remarks: string
}

interface FireExtinguisher {
  id: string
  type: string
  count: string
  pressureTest: '○' | '×' | '－'
  sealPresent: '○' | '×' | '－'
  displayConfirmation: '○' | '×' | '－'
  manufactureDate: string
  expirationStatus: string
  managementId: string
  status: string
  disposalRepairRecord: string
}

interface FireAlarmSystem {
  receiverDisplay: '○' | '×' | '－'
  grounding: '○' | '×' | '－'
  indicator: '○' | '×' | '－'
  backupPower: '○' | '×' | '－'
  heatDetectorCount: string
  heatDetectorTestTime: string
  smokeDetectorCount: string
  smokeDetectorTestTime: string
  circuitContinuity: '○' | '×' | '－'
  securityTransfer: '○' | '×' | '－'
  remarks: string
}

interface GuidanceLight {
  id: string
  location: string
  ledStatus: '○' | '×'
  batteryVoltage: string
  signFading: '○' | '×'
  signDamage: '○' | '×'
  remarks: string
}

interface InspectionResult {
  equipment: string
  judgment: '良' | '不良'
  defectContent: string
  measureContent: string
}

interface DisasterEquipment {
  id: string
  confirmed: boolean
  equipmentType: string
  itemType: string
  equipmentName: string
  location: string
  vendorName: string
  deviceName: string
  installationDate: string
  serviceLife: string
  renewalDate: string
  owner: string
  capacity: string
  memo: string
  // 点検項目
  generalCondition: '○' | '×' | '－'
  functionalTest: '○' | '×' | '－'
  appearance: '○' | '×' | '－'
  operationTest: '○' | '×' | '－'
}

export default function DisasterPreventionInspectionForm({
  isOpen,
  onClose,
  facilityId,
  facilityName
}: DisasterPreventionInspectionFormProps) {
  const addHistory = useInspectionHistoryStore((state) => state.addHistory)
  
  const [commonData, setCommonData] = useState<CommonInspectionData>({
    inspectionStartDate: new Date().toISOString().split('T')[0],
    inspectionEndDate: new Date().toISOString().split('T')[0],
    inspectionCompany: '',
    inspector: '',
    witness: '',
    hasUrgentIssues: false,
  })

  // 事前定義された防災設備データ
  const predefinedEquipments: DisasterEquipment[] = [
    {
      id: '1', confirmed: true, equipmentType: '火災予兆設備', itemType: '警報盤', equipmentName: '警報盤', location: 'HE',
      vendorName: '能美防災', deviceName: 'FPEJ001-2/3L', installationDate: '2019年2月', serviceLife: '15',
      renewalDate: '2034年2月', owner: 'SO', capacity: '', memo: '', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '2', confirmed: true, equipmentType: '火災予兆設備', itemType: 'センサ', equipmentName: 'センサ①', location: 'HE',
      vendorName: '能美防災', deviceName: 'FDNJ001A-R', installationDate: '2019年2月', serviceLife: '10',
      renewalDate: '2029年2月', owner: 'SO', capacity: '', memo: '', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '3', confirmed: true, equipmentType: '火災予兆設備', itemType: 'センサ', equipmentName: 'センサ②', location: 'UPS室',
      vendorName: '能美防災', deviceName: 'FDNJ001A-R', installationDate: '2019年2月', serviceLife: '10',
      renewalDate: '2029年2月', owner: 'SO', capacity: '', memo: '', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '4', confirmed: true, equipmentType: '火災予兆設備', itemType: 'ポータブルセンサ', equipmentName: 'ポータブルセンサ', location: 'HE',
      vendorName: '能美防災', deviceName: 'PDNJ001A-H', installationDate: '2019年2月', serviceLife: '10',
      renewalDate: '2029年2月', owner: 'SO', capacity: '', memo: '', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '5', confirmed: true, equipmentType: 'ガス消火設備', itemType: 'ハロン(HFC23)', equipmentName: '', location: '1F',
      vendorName: 'コーアツ', deviceName: 'NF1300（パッケージ式）FAP2', installationDate: '2006年', serviceLife: '30',
      renewalDate: '2036年', owner: 'SO', capacity: '6', memo: '点検報告なし', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '6', confirmed: true, equipmentType: 'ガス消火設備', itemType: 'ハロン(HFC23)', equipmentName: '', location: '1F_UPS室',
      vendorName: 'コーアツ', deviceName: 'NF1300（パッケージ式）FAP2', installationDate: '2006年', serviceLife: '30',
      renewalDate: '2036年', owner: 'SO', capacity: '1', memo: '点検報告なし', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '7', confirmed: true, equipmentType: '消火器', itemType: '粉末', equipmentName: '', location: '1F',
      vendorName: 'ヤマトプロテック', deviceName: '27-59-1（YA-10NX）', installationDate: '2017年', serviceLife: '10',
      renewalDate: '2027年', owner: 'SO', capacity: '3', memo: '点検報告なし', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    },
    {
      id: '8', confirmed: true, equipmentType: '消火器', itemType: '純水', equipmentName: '', location: '1F',
      vendorName: 'モリタ宮田', deviceName: '27-2（WS3）', installationDate: '2021年', serviceLife: '10',
      renewalDate: '2031年', owner: 'SO', capacity: '1', memo: '点検報告なし', generalCondition: '○', functionalTest: '○', appearance: '○', operationTest: '○'
    }
  ]

  const [formData, setFormData] = useState({
    siteName: facilityName,
    inspectionType: '機器点検',
    inspectionDates: [''],
    inspectors: [{ id: '1', name: '', qualificationNumber: '' }] as Inspector[],
    equipmentType: 'ハロゲン1301',
    location: '',
    equipments: predefinedEquipments,
    halogenSystems: [] as HalogenSystem[],
    fireExtinguishers: [] as FireExtinguisher[],
    fireAlarmSystem: {
      receiverDisplay: '○',
      grounding: '○',
      indicator: '○',
      backupPower: '○',
      heatDetectorCount: '',
      heatDetectorTestTime: '',
      smokeDetectorCount: '',
      smokeDetectorTestTime: '',
      circuitContinuity: '○',
      securityTransfer: '○',
      remarks: ''
    } as FireAlarmSystem,
    guidanceLights: [] as GuidanceLight[],
    inspectionResults: [] as InspectionResult[],
    overallComments: '',
    photos: [] as File[]
  })

  // Initialize with default values
  useEffect(() => {
    const defaultHalogen: HalogenSystem = {
      id: '1',
      containerAppearance: '○',
      extinguishingAgentAmount: '',
      containerPressure: '',
      pressureJudgment: '○',
      safetyValve: '○',
      electromagneticValve: '○',
      piping: '○',
      supportBracket: '○',
      nozzleCount: '',
      nozzleDegradation: '○',
      openCloseValve: '○',
      startGasContainer: '○',
      operationPipe: '○',
      releaseTestDone: '○',
      releaseTime: '',
      emergencyPowerVoltage: '',
      controlPanelAlarm: '○',
      remarks: ''
    }

    const defaultExtinguisher: FireExtinguisher = {
      id: '1',
      type: '小型粉末',
      count: '',
      pressureTest: '○',
      sealPresent: '○',
      displayConfirmation: '○',
      manufactureDate: '',
      expirationStatus: '',
      managementId: '',
      status: '',
      disposalRepairRecord: ''
    }

    const defaultGuidanceLight: GuidanceLight = {
      id: '1',
      location: '',
      ledStatus: '○',
      batteryVoltage: '',
      signFading: '○',
      signDamage: '○',
      remarks: ''
    }

    const defaultResults: InspectionResult[] = [
      { equipment: '消火器具', judgment: '良', defectContent: '', measureContent: '' },
      { equipment: 'ハロゲン系', judgment: '良', defectContent: '', measureContent: '' },
      { equipment: '火災報知設備', judgment: '良', defectContent: '', measureContent: '' },
      { equipment: '誘導標識', judgment: '良', defectContent: '', measureContent: '' }
    ]

    setFormData(prev => ({
      ...prev,
      halogenSystems: [defaultHalogen],
      fireExtinguishers: [defaultExtinguisher],
      guidanceLights: [defaultGuidanceLight],
      inspectionResults: defaultResults
    }))
  }, [])

  // Automatically check expiration status for fire extinguishers
  useEffect(() => {
    const updatedExtinguishers = formData.fireExtinguishers.map(ext => {
      if (ext.manufactureDate) {
        const manufactureYear = new Date(ext.manufactureDate).getFullYear()
        const currentYear = new Date().getFullYear()
        const age = currentYear - manufactureYear
        
        if (age >= 10) {
          return { ...ext, expirationStatus: '要交換（製造から10年以上経過）' }
        } else if (age >= 8) {
          return { ...ext, expirationStatus: '注意（製造から8年経過）' }
        } else {
          return { ...ext, expirationStatus: '正常' }
        }
      }
      return ext
    })

    if (JSON.stringify(updatedExtinguishers) !== JSON.stringify(formData.fireExtinguishers)) {
      setFormData(prev => ({ ...prev, fireExtinguishers: updatedExtinguishers }))
    }
  }, [formData.fireExtinguishers])

  const addInspectionDate = () => {
    setFormData(prev => ({
      ...prev,
      inspectionDates: [...prev.inspectionDates, '']
    }))
  }

  const removeInspectionDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inspectionDates: prev.inspectionDates.filter((_, i) => i !== index)
    }))
  }

  const addInspector = () => {
    const newInspector: Inspector = {
      id: Date.now().toString(),
      name: '',
      qualificationNumber: ''
    }
    setFormData(prev => ({
      ...prev,
      inspectors: [...prev.inspectors, newInspector]
    }))
  }

  const removeInspector = (id: string) => {
    setFormData(prev => ({
      ...prev,
      inspectors: prev.inspectors.filter(inspector => inspector.id !== id)
    }))
  }

  const addHalogenSystem = () => {
    const newSystem: HalogenSystem = {
      id: Date.now().toString(),
      containerAppearance: '○',
      extinguishingAgentAmount: '',
      containerPressure: '',
      pressureJudgment: '○',
      safetyValve: '○',
      electromagneticValve: '○',
      piping: '○',
      supportBracket: '○',
      nozzleCount: '',
      nozzleDegradation: '○',
      openCloseValve: '○',
      startGasContainer: '○',
      operationPipe: '○',
      releaseTestDone: '○',
      releaseTime: '',
      emergencyPowerVoltage: '',
      controlPanelAlarm: '○',
      remarks: ''
    }
    setFormData(prev => ({
      ...prev,
      halogenSystems: [...prev.halogenSystems, newSystem]
    }))
  }

  const removeHalogenSystem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      halogenSystems: prev.halogenSystems.filter(system => system.id !== id)
    }))
  }

  const addFireExtinguisher = () => {
    const newExtinguisher: FireExtinguisher = {
      id: Date.now().toString(),
      type: '小型粉末',
      count: '',
      pressureTest: '○',
      sealPresent: '○',
      displayConfirmation: '○',
      manufactureDate: '',
      expirationStatus: '',
      managementId: '',
      status: '',
      disposalRepairRecord: ''
    }
    setFormData(prev => ({
      ...prev,
      fireExtinguishers: [...prev.fireExtinguishers, newExtinguisher]
    }))
  }

  const removeFireExtinguisher = (id: string) => {
    setFormData(prev => ({
      ...prev,
      fireExtinguishers: prev.fireExtinguishers.filter(ext => ext.id !== id)
    }))
  }

  const addGuidanceLight = () => {
    const newLight: GuidanceLight = {
      id: Date.now().toString(),
      location: '',
      ledStatus: '○',
      batteryVoltage: '',
      signFading: '○',
      signDamage: '○',
      remarks: ''
    }
    setFormData(prev => ({
      ...prev,
      guidanceLights: [...prev.guidanceLights, newLight]
    }))
  }

  const removeGuidanceLight = (id: string) => {
    setFormData(prev => ({
      ...prev,
      guidanceLights: prev.guidanceLights.filter(light => light.id !== id)
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)]
      }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const exportToCSV = () => {
    const csvData: string[] = ['防災設備点検報告書']
    csvData.push(`拠点名,${formData.siteName}`)
    csvData.push(`点検種別,${formData.inspectionType}`)
    csvData.push(`点検実施日,${formData.inspectionDates.join('、')}`)
    csvData.push(`点検業者名,${formData.inspectionCompany}`)
    csvData.push('')
    
    csvData.push('点検責任者／資格番号')
    formData.inspectors.forEach(inspector => {
      csvData.push(`${inspector.name},${inspector.qualificationNumber}`)
    })
    csvData.push('')
    
    if (formData.halogenSystems.length > 0) {
      csvData.push('ハロゲン化物消火設備／不活性ガス消火設備')
      csvData.push('No,容器外形,消火剤量(kg),容器圧力(MPa),圧力判定,安全弁,電磁弁,配管,支持金具,噴射ヘッド数,劣化,開閉バルブ,起動ガス容器,操作管,放出試験,放出時間(秒),非常電源電圧(V),制御盤・警報,備考')
      formData.halogenSystems.forEach((system, index) => {
        csvData.push(`${index + 1},${system.containerAppearance},${system.extinguishingAgentAmount},${system.containerPressure},${system.pressureJudgment},${system.safetyValve},${system.electromagneticValve},${system.piping},${system.supportBracket},${system.nozzleCount},${system.nozzleDegradation},${system.openCloseValve},${system.startGasContainer},${system.operationPipe},${system.releaseTestDone},${system.releaseTime},${system.emergencyPowerVoltage},${system.controlPanelAlarm},${system.remarks}`)
      })
      csvData.push('')
    }
    
    if (formData.fireExtinguishers.length > 0) {
      csvData.push('消火器具')
      csvData.push('No,種類,本数,耐圧試験,封印,表示確認,製造年月日,使用期限状態,管理ID,ステータス,廃棄・要修理記録')
      formData.fireExtinguishers.forEach((ext, index) => {
        csvData.push(`${index + 1},${ext.type},${ext.count},${ext.pressureTest},${ext.sealPresent},${ext.displayConfirmation},${ext.manufactureDate},${ext.expirationStatus},${ext.managementId},${ext.status},${ext.disposalRepairRecord}`)
      })
      csvData.push('')
    }
    
    csvData.push('自動火災報知設備')
    csvData.push(`受信機表示灯,${formData.fireAlarmSystem.receiverDisplay}`)
    csvData.push(`接地,${formData.fireAlarmSystem.grounding}`)
    csvData.push(`表示器,${formData.fireAlarmSystem.indicator}`)
    csvData.push(`予備電源,${formData.fireAlarmSystem.backupPower}`)
    csvData.push(`熱感知器台数,${formData.fireAlarmSystem.heatDetectorCount}`)
    csvData.push(`熱感知器動作時間(秒),${formData.fireAlarmSystem.heatDetectorTestTime}`)
    csvData.push(`煙感知器台数,${formData.fireAlarmSystem.smokeDetectorCount}`)
    csvData.push(`煙感知器動作時間(秒),${formData.fireAlarmSystem.smokeDetectorTestTime}`)
    csvData.push(`回路導通確認,${formData.fireAlarmSystem.circuitContinuity}`)
    csvData.push(`警備会社移報確認,${formData.fireAlarmSystem.securityTransfer}`)
    csvData.push(`備考,${formData.fireAlarmSystem.remarks}`)
    csvData.push('')
    
    if (formData.guidanceLights.length > 0) {
      csvData.push('誘導灯・誘導標識')
      csvData.push('No,設置場所,LED点灯確認,バッテリー電圧(V),標識退色,標識欠損,備考')
      formData.guidanceLights.forEach((light, index) => {
        csvData.push(`${index + 1},${light.location},${light.ledStatus},${light.batteryVoltage},${light.signFading},${light.signDamage},${light.remarks}`)
      })
      csvData.push('')
    }
    
    csvData.push('点検結果判定')
    csvData.push('設備区分,判定,不良内容,措置内容')
    formData.inspectionResults.forEach(result => {
      csvData.push(`${result.equipment},${result.judgment},${result.defectContent},${result.measureContent}`)
    })
    csvData.push('')
    
    csvData.push(`総合コメント,${formData.overallComments}`)
    
    const csv = csvData.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `防災設備点検報告書_${formData.siteName}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const calculateOverallJudgment = (): '良好' | '要注意' | '要修理' | '危険' => {
    // 異常事項がある場合
    if (formData.halogenSystems.some(sys => sys.remarks.includes('危険') || sys.remarks.includes('緊急'))) {
      return '危険'
    }
    
    // 機能異常や不良がある場合
    const hasFailures = formData.halogenSystems.some(sys => 
      sys.containerAppearance === '×' || sys.pressureJudgment === '×' ||
      sys.safetyValve === '×' || sys.electromagneticValve === '×' ||
      sys.piping === '×' || sys.supportBracket === '×'
    ) || formData.fireExtinguishers.some(ext => 
      ext.pressureTest === '×' || ext.sealPresent === '×' ||
      ext.displayConfirmation === '×'
    )
    
    if (hasFailures) {
      return '要修理'
    }
    
    return '良好'
  }

  const handleExportExcel = () => {
    const excelData = [
      formatInspectionDataForExcel({ ...commonData, ...formData }, '防災設備'),
      ...formData.halogenSystems.map(sys => ({
        種別: 'ハロゲン化物消火設備',
        容器外形: sys.containerAppearance,
        消火剤量: sys.extinguishingAgentAmount,
        容器圧力: sys.containerPressure,
        圧力判定: sys.pressureJudgment,
        安全弁: sys.safetyValve,
        電磁弁: sys.electromagneticValve,
        備考: sys.remarks,
      })),
      ...formData.fireExtinguishers.map(ext => ({
        種別: '消火器',
        タイプ: ext.type,
        数量: ext.count,
        圧力試験: ext.pressureTest,
        封印有無: ext.sealPresent,
        表示確認: ext.displayConfirmation,
      }))
    ]
    exportToExcel(excelData, `防災設備点検報告書_${facilityName}_${commonData.inspectionStartDate}.xlsx`, '防災設備点検')
  }

  const handleExportPDF = () => {
    const columns = [
      { header: '項目', dataKey: 'item' },
      { header: '内容', dataKey: 'value' }
    ]
    
    const data = [
      { item: '施設名', value: facilityName },
      { item: '点検期間', value: `${commonData.inspectionStartDate} ～ ${commonData.inspectionEndDate}` },
      { item: '作業会社', value: commonData.inspectionCompany },
      { item: '担当者', value: commonData.inspector },
      { item: '立会者', value: commonData.witness || '-' },
      { item: '総合判定', value: calculateOverallJudgment() },
      { item: 'ハロゲン系統数', value: formData.halogenSystems.length.toString() },
      { item: '消火器数', value: formData.fireExtinguishers.length.toString() },
    ]
    
    exportToPDF(
      '防災設備点検報告書',
      data,
      columns,
      `防災設備点検報告書_${facilityName}_${commonData.inspectionStartDate}.pdf`,
      [
        { label: '施設名', value: facilityName },
        { label: '点検日', value: commonData.inspectionStartDate }
      ]
    )
  }

  const handleSubmit = () => {
    const overallJudgment = calculateOverallJudgment()
    
    // 点検履歴に保存
    addHistory({
      facilityId,
      facilityName,
      inspectionType: 'disaster-prevention',
      inspectionStartDate: commonData.inspectionStartDate,
      inspectionEndDate: commonData.inspectionEndDate,
      company: commonData.inspectionCompany,
      inspector: commonData.inspector,
      witness: commonData.witness,
      hasUrgentIssues: commonData.hasUrgentIssues || overallJudgment === '危険' || overallJudgment === '要修理',
      overallJudgment,
      status: 'completed',
      data: {
        ...commonData,
        ...formData,
        predefinedEquipments
      }
    })
    
    alert('防災設備点検報告書を登録しました')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">防災設備点検報告書</h2>
                <p className="text-sm text-gray-600 mt-1">施設: {facilityName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel出力
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  PDF出力
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <form className="space-y-8">
            {/* 共通ヘッダー */}
            <div className="mb-8">
              <CommonInspectionHeader
                data={commonData}
                onChange={setCommonData}
                facilityName={facilityName}
              />
            </div>

            {/* 1. 点検基本情報 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 点検基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    拠点名（HE/SHE）
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検種別
                  </label>
                  <select
                    value={formData.inspectionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspectionType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="機器点検">機器点検</option>
                    <option value="総合点検">総合点検</option>
                    <option value="設置後初回点検">設置後初回点検</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検実施日
                  </label>
                  <div className="space-y-2">
                    {formData.inspectionDates.map((date, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const newDates = [...formData.inspectionDates]
                            newDates[index] = e.target.value
                            setFormData(prev => ({ ...prev, inspectionDates: newDates }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.inspectionDates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInspectionDate(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInspectionDate}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + 点検日を追加
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検業者名
                  </label>
                  <input
                    type="text"
                    value={formData.inspectionCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspectionCompany: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検責任者／資格番号
                  </label>
                  <div className="space-y-2">
                    {formData.inspectors.map((inspector) => (
                      <div key={inspector.id} className="flex gap-2">
                        <input
                          type="text"
                          value={inspector.name}
                          onChange={(e) => {
                            const newInspectors = formData.inspectors.map(i =>
                              i.id === inspector.id ? { ...i, name: e.target.value } : i
                            )
                            setFormData(prev => ({ ...prev, inspectors: newInspectors }))
                          }}
                          placeholder="氏名"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={inspector.qualificationNumber}
                          onChange={(e) => {
                            const newInspectors = formData.inspectors.map(i =>
                              i.id === inspector.id ? { ...i, qualificationNumber: e.target.value } : i
                            )
                            setFormData(prev => ({ ...prev, inspectors: newInspectors }))
                          }}
                          placeholder="消防設備士番号"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.inspectors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInspector(inspector.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInspector}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + 点検責任者を追加
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    設備種別
                  </label>
                  <select
                    value={formData.equipmentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, equipmentType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ハロゲン1301">ハロゲン1301</option>
                    <option value="窒素IG-55">窒素IG-55</option>
                    <option value="消火器">消火器</option>
                    <option value="火災報知器">火災報知器</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所在地
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 2. 設備別点検モジュール - A. ハロゲン化物消火設備／不活性ガス消火設備 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  2-A. ハロゲン化物消火設備／不活性ガス消火設備
                </h3>
                <button
                  type="button"
                  onClick={addHalogenSystem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  システムを追加
                </button>
              </div>

              {formData.halogenSystems.map((system, index) => (
                <div key={system.id} className="bg-white p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">システム {index + 1}</h4>
                    {formData.halogenSystems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHalogenSystem(system.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        容器外形／腐食
                      </label>
                      <select
                        value={system.containerAppearance}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, containerAppearance: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        消火剤量 (kg)
                      </label>
                      <input
                        type="text"
                        value={system.extinguishingAgentAmount}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, extinguishingAgentAmount: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        容器圧力 (MPa)
                      </label>
                      <input
                        type="text"
                        value={system.containerPressure}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, containerPressure: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        圧力判定
                      </label>
                      <select
                        value={system.pressureJudgment}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, pressureJudgment: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        安全弁
                      </label>
                      <select
                        value={system.safetyValve}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, safetyValve: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        電磁弁
                      </label>
                      <select
                        value={system.electromagneticValve}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, electromagneticValve: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        配管
                      </label>
                      <select
                        value={system.piping}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, piping: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        支持金具
                      </label>
                      <select
                        value={system.supportBracket}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, supportBracket: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        噴射ヘッド数
                      </label>
                      <input
                        type="text"
                        value={system.nozzleCount}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, nozzleCount: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        噴射ヘッド劣化
                      </label>
                      <select
                        value={system.nozzleDegradation}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, nozzleDegradation: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        開閉バルブ
                      </label>
                      <select
                        value={system.openCloseValve}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, openCloseValve: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        起動ガス容器
                      </label>
                      <select
                        value={system.startGasContainer}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, startGasContainer: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        操作管
                      </label>
                      <select
                        value={system.operationPipe}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, operationPipe: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        放出試験有無
                      </label>
                      <select
                        value={system.releaseTestDone}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, releaseTestDone: e.target.value as '○' | '×' | '－' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        放出時間 (秒)
                      </label>
                      <input
                        type="text"
                        value={system.releaseTime}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, releaseTime: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        非常電源電圧 (V)
                      </label>
                      <input
                        type="text"
                        value={system.emergencyPowerVoltage}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, emergencyPowerVoltage: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        制御盤・警報機能
                      </label>
                      <select
                        value={system.controlPanelAlarm}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, controlPanelAlarm: e.target.value as '○' | '×' | '不明' } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="不明">不明</option>
                      </select>
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        備考
                      </label>
                      <textarea
                        value={system.remarks}
                        onChange={(e) => {
                          const newSystems = formData.halogenSystems.map(s =>
                            s.id === system.id ? { ...s, remarks: e.target.value } : s
                          )
                          setFormData(prev => ({ ...prev, halogenSystems: newSystems }))
                        }}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 2-B. 消火器具 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">2-B. 消火器具</h3>
                <button
                  type="button"
                  onClick={addFireExtinguisher}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  消火器を追加
                </button>
              </div>

              {formData.fireExtinguishers.map((extinguisher, index) => (
                <div key={extinguisher.id} className="bg-white p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">消火器 {index + 1}</h4>
                    {formData.fireExtinguishers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFireExtinguisher(extinguisher.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        種類
                      </label>
                      <select
                        value={extinguisher.type}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, type: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="小型粉末">小型粉末</option>
                        <option value="大型粉末">大型粉末</option>
                        <option value="水">水</option>
                        <option value="二酸化炭素">二酸化炭素</option>
                        <option value="強化液">強化液</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        本数
                      </label>
                      <input
                        type="text"
                        value={extinguisher.count}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, count: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        耐圧試験
                      </label>
                      <select
                        value={extinguisher.pressureTest}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, pressureTest: e.target.value as '○' | '×' | '－' } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        封印有無
                      </label>
                      <select
                        value={extinguisher.sealPresent}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, sealPresent: e.target.value as '○' | '×' | '－' } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        表示確認
                      </label>
                      <select
                        value={extinguisher.displayConfirmation}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, displayConfirmation: e.target.value as '○' | '×' | '－' } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                        <option value="－">－</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        製造年月日
                      </label>
                      <input
                        type="date"
                        value={extinguisher.manufactureDate}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, manufactureDate: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        使用期限状態
                      </label>
                      <input
                        type="text"
                        value={extinguisher.expirationStatus}
                        readOnly
                        className={`w-full px-2 py-1 text-sm border rounded-md ${
                          extinguisher.expirationStatus.includes('要交換') 
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : extinguisher.expirationStatus.includes('注意')
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        管理台帳ID
                      </label>
                      <input
                        type="text"
                        value={extinguisher.managementId}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, managementId: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        ステータス
                      </label>
                      <input
                        type="text"
                        value={extinguisher.status}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, status: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        廃棄・要修理記録
                      </label>
                      <input
                        type="text"
                        value={extinguisher.disposalRepairRecord}
                        onChange={(e) => {
                          const newExtinguishers = formData.fireExtinguishers.map(ext =>
                            ext.id === extinguisher.id ? { ...ext, disposalRepairRecord: e.target.value } : ext
                          )
                          setFormData(prev => ({ ...prev, fireExtinguishers: newExtinguishers }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 2-C. 自動火災報知設備 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-C. 自動火災報知設備</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    受信機 表示灯
                  </label>
                  <select
                    value={formData.fireAlarmSystem.receiverDisplay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, receiverDisplay: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    接地
                  </label>
                  <select
                    value={formData.fireAlarmSystem.grounding}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, grounding: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    表示器
                  </label>
                  <select
                    value={formData.fireAlarmSystem.indicator}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, indicator: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    予備電源
                  </label>
                  <select
                    value={formData.fireAlarmSystem.backupPower}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, backupPower: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    熱感知器台数
                  </label>
                  <input
                    type="text"
                    value={formData.fireAlarmSystem.heatDetectorCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, heatDetectorCount: e.target.value }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    熱感知器動作時間 (秒)
                  </label>
                  <input
                    type="text"
                    value={formData.fireAlarmSystem.heatDetectorTestTime}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, heatDetectorTestTime: e.target.value }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    煙感知器台数
                  </label>
                  <input
                    type="text"
                    value={formData.fireAlarmSystem.smokeDetectorCount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, smokeDetectorCount: e.target.value }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    煙感知器動作時間 (秒)
                  </label>
                  <input
                    type="text"
                    value={formData.fireAlarmSystem.smokeDetectorTestTime}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, smokeDetectorTestTime: e.target.value }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    回路導通確認
                  </label>
                  <select
                    value={formData.fireAlarmSystem.circuitContinuity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, circuitContinuity: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    警備会社移報確認
                  </label>
                  <select
                    value={formData.fireAlarmSystem.securityTransfer}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, securityTransfer: e.target.value as '○' | '×' | '－' }
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.fireAlarmSystem.remarks}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fireAlarmSystem: { ...prev.fireAlarmSystem, remarks: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 2-D. 誘導灯・誘導標識 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">2-D. 誘導灯・誘導標識</h3>
                <button
                  type="button"
                  onClick={addGuidanceLight}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  誘導灯を追加
                </button>
              </div>

              {formData.guidanceLights.map((light, index) => (
                <div key={light.id} className="bg-white p-4 rounded-md border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">誘導灯 {index + 1}</h4>
                    {formData.guidanceLights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuidanceLight(light.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        設置場所
                      </label>
                      <input
                        type="text"
                        value={light.location}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, location: e.target.value } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        LED点灯確認
                      </label>
                      <select
                        value={light.ledStatus}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, ledStatus: e.target.value as '○' | '×' } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        バッテリー電圧 (V)
                      </label>
                      <input
                        type="text"
                        value={light.batteryVoltage}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, batteryVoltage: e.target.value } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        標識の退色
                      </label>
                      <select
                        value={light.signFading}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, signFading: e.target.value as '○' | '×' } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        標識の欠損
                      </label>
                      <select
                        value={light.signDamage}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, signDamage: e.target.value as '○' | '×' } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="○">○</option>
                        <option value="×">×</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        備考（例：1階拡張スペース出口にて点灯不良）
                      </label>
                      <input
                        type="text"
                        value={light.remarks}
                        onChange={(e) => {
                          const newLights = formData.guidanceLights.map(l =>
                            l.id === light.id ? { ...l, remarks: e.target.value } : l
                          )
                          setFormData(prev => ({ ...prev, guidanceLights: newLights }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 3. 点検結果判定 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3. 点検結果判定</h3>
              
              <div className="space-y-4">
                {formData.inspectionResults.map((result, index) => (
                  <div key={index} className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          設備区分
                        </label>
                        <input
                          type="text"
                          value={result.equipment}
                          readOnly
                          className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          判定
                        </label>
                        <select
                          value={result.judgment}
                          onChange={(e) => {
                            const newResults = formData.inspectionResults.map((r, i) =>
                              i === index ? { ...r, judgment: e.target.value as '良' | '不良' } : r
                            )
                            setFormData(prev => ({ ...prev, inspectionResults: newResults }))
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="良">良</option>
                          <option value="不良">不良</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          不良内容（該当時）
                        </label>
                        <input
                          type="text"
                          value={result.defectContent}
                          onChange={(e) => {
                            const newResults = formData.inspectionResults.map((r, i) =>
                              i === index ? { ...r, defectContent: e.target.value } : r
                            )
                            setFormData(prev => ({ ...prev, inspectionResults: newResults }))
                          }}
                          disabled={result.judgment === '良'}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          措置内容（該当時）
                        </label>
                        <input
                          type="text"
                          value={result.measureContent}
                          onChange={(e) => {
                            const newResults = formData.inspectionResults.map((r, i) =>
                              i === index ? { ...r, measureContent: e.target.value } : r
                            )
                            setFormData(prev => ({ ...prev, inspectionResults: newResults }))
                          }}
                          disabled={result.judgment === '良'}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 総合コメント */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">総合コメント</h3>
              <textarea
                value={formData.overallComments}
                onChange={(e) => setFormData(prev => ({ ...prev, overallComments: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="点検全体の所見、特記事項等を記入してください"
              />
            </section>

            {/* 写真アップロード */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">写真添付</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                    写真を選択
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-600">
                    {formData.photos.length > 0 ? `${formData.photos.length}枚の写真が選択されています` : '写真が選択されていません'}
                  </span>
                </div>
                
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-600">{photo.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </form>
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-between">
          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSVエクスポート
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}