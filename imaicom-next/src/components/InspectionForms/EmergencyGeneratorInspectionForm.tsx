'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Download, FileSpreadsheet, FileText } from 'lucide-react'
import CommonInspectionHeader, { CommonInspectionData } from './CommonInspectionHeader'
import { exportToExcel, exportToPDF, formatInspectionDataForExcel } from '@/utils/exportUtils'
import { useInspectionHistoryStore } from '@/store/inspectionHistoryStore'

interface EmergencyGeneratorInspectionFormProps {
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

interface BatteryCell {
  id: string
  cellNumber: number
  voltage: string
  resistance: string
  temperature: string
  voltageJudgment: '○' | '△' | 'NG'
  resistanceJudgment: '○' | '△' | 'NG'
}

interface InspectionResult {
  category: string
  judgment: '良' | '不良'
  measureContent: string
  remarks: string
}

export default function EmergencyGeneratorInspectionForm({
  isOpen,
  onClose,
  facilityId,
  facilityName
}: EmergencyGeneratorInspectionFormProps) {
  const addHistory = useInspectionHistoryStore((state) => state.addHistory)
  
  const [commonData, setCommonData] = useState<CommonInspectionData>({
    inspectionStartDate: new Date().toISOString().split('T')[0],
    inspectionEndDate: new Date().toISOString().split('T')[0],
    inspectionCompany: '',
    inspector: '',
    witness: '',
    hasUrgentIssues: false,
  })

  const [formData, setFormData] = useState({
    // 1. 点検基本情報
    siteName: facilityName,
    inspectionType: 'A',
    inspectionDates: [''],
    inspectionCompany: '',
    inspectors: [{ id: '1', name: '', qualificationNumber: '' }] as Inspector[],
    generatorModel: '',
    generatorCapacity: '',
    generatorCapacityUnit: 'kVA',
    rotationSpeed: '',
    installationLocation: '屋外',
    fuelType: '軽油',
    
    // 2. 点検項目
    // A. 外観・設置状況
    exteriorDamage: '○' as '○' | '△' | '×' | '－',
    surroundingCleanup: '○' as '○' | '△' | '×' | '－',
    signageLighting: '○' as '○' | '△' | '×' | '－',
    exteriorRemarks: '',
    
    // B. 燃料系統
    fuelTankLevel: '',
    fuelTankCapacity: '',
    fuelFilterStatus: '未交換',
    drainagePerformed: '○' as '○' | '×',
    fuelLeakage: '○' as '○' | '×',
    fuelRemarks: '',
    
    // C. 潤滑油系統
    oilLevel: '',
    oilQuality: '',
    oilFilterChanged: '○' as '○' | '×',
    oilPumpInspection: '○' as '○' | '×',
    pressureSwitchOperation: '○' as '○' | '×',
    pressureSwitchSetting: '',
    lubricationRemarks: '',
    
    // D. 冷却系統
    radiatorWaterLevel: '○' as '○' | '×',
    coolantHeaterOperation: '',
    coolantHeaterResistance: '',
    thermostatOperation: '',
    thermostatSetting: '',
    pipingReplacementHistory: '',
    coolingRemarks: '',
    
    // E. 始動系統
    manualStartTest: '成功',
    manualStartTime: '',
    autoStartTest: '成功',
    autoStartTime: '',
    continuousStartTest: '成功',
    continuousStartCount: '3',
    starterMotorInspection: '',
    starterMotorRotation: '',
    stopOperationTime: '',
    flywheelStopTime: '',
    startingRemarks: '',
    
    // F. 電装・制御盤・保護装置
    indicatorLights: '○' as '○' | '△' | '×',
    breakerRelayOperation: '○' as '○' | '×',
    breakerRelaySetting: '',
    insulationResistanceTest: '',
    insulationResistanceValue: '',
    voltage: '',
    frequency: '',
    powerFactor: '',
    electricalRemarks: '',
    
    // G. 蓄電池
    batteryManufactureDate: '',
    batteryModel: '',
    batteryCells: [] as BatteryCell[],
    batteryVoltageMin: '2.05',
    batteryVoltageMax: '2.30',
    batteryResistanceThreshold: '1.0',
    nextBatteryReplacement: '',
    batteryRemarks: '',
    
    // 3. 結果判定・対応措置
    inspectionResults: [] as InspectionResult[],
    
    // その他
    overallComments: '',
    photos: [] as File[]
  })

  // Initialize battery cells and inspection results
  useEffect(() => {
    const defaultCells: BatteryCell[] = Array.from({ length: 12 }, (_, i) => ({
      id: `cell-${i + 1}`,
      cellNumber: i + 1,
      voltage: '',
      resistance: '',
      temperature: '',
      voltageJudgment: '○',
      resistanceJudgment: '○'
    }))

    const defaultResults: InspectionResult[] = [
      { category: '燃料系', judgment: '良', measureContent: '', remarks: '' },
      { category: '冷却系', judgment: '良', measureContent: '', remarks: '' },
      { category: '始動系', judgment: '良', measureContent: '', remarks: '' },
      { category: '制御系', judgment: '良', measureContent: '', remarks: '' }
    ]

    setFormData(prev => ({
      ...prev,
      batteryCells: defaultCells,
      inspectionResults: defaultResults
    }))
  }, [])

  // Auto-calculate next battery replacement date
  useEffect(() => {
    if (formData.batteryManufactureDate) {
      const manufactureDate = new Date(formData.batteryManufactureDate)
      const replacementDate = new Date(manufactureDate)
      replacementDate.setFullYear(replacementDate.getFullYear() + 7) // 7年を推奨交換時期とする
      setFormData(prev => ({
        ...prev,
        nextBatteryReplacement: replacementDate.toISOString().split('T')[0]
      }))
    }
  }, [formData.batteryManufactureDate])

  // Judge battery voltage
  const judgeVoltage = (voltage: string): '○' | '△' | 'NG' => {
    const v = parseFloat(voltage)
    if (!v || isNaN(v)) return '○'
    const min = parseFloat(formData.batteryVoltageMin)
    const max = parseFloat(formData.batteryVoltageMax)
    
    if (v < min || v > max) return 'NG'
    if (v < min * 1.05 || v > max * 0.95) return '△'
    return '○'
  }

  // Judge battery resistance
  const judgeResistance = (resistance: string): '○' | '△' | 'NG' => {
    const r = parseFloat(resistance)
    if (!r || isNaN(r)) return '○'
    const threshold = parseFloat(formData.batteryResistanceThreshold)
    
    if (r > threshold) return 'NG'
    if (r > threshold * 0.8) return '△'
    return '○'
  }

  // Update battery cell with automatic judgment
  const updateBatteryCell = (cellId: string, field: string, value: string) => {
    const newCells = formData.batteryCells.map(cell => {
      if (cell.id === cellId) {
        const updatedCell = { ...cell, [field]: value }
        
        if (field === 'voltage') {
          updatedCell.voltageJudgment = judgeVoltage(value)
        } else if (field === 'resistance') {
          updatedCell.resistanceJudgment = judgeResistance(value)
        }
        
        return updatedCell
      }
      return cell
    })
    
    setFormData(prev => ({ ...prev, batteryCells: newCells }))
  }

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
    const csvData: string[] = ['非常用発電機点検報告書']
    csvData.push(`拠点名,${formData.siteName}`)
    csvData.push(`点検種別,${formData.inspectionType}点検`)
    csvData.push(`点検実施日,${formData.inspectionDates.join('、')}`)
    csvData.push(`点検業者名,${formData.inspectionCompany}`)
    csvData.push('')
    
    csvData.push('点検責任者／資格番号')
    formData.inspectors.forEach(inspector => {
      csvData.push(`${inspector.name},${inspector.qualificationNumber}`)
    })
    csvData.push('')
    
    csvData.push('発電機情報')
    csvData.push(`発電機型式,${formData.generatorModel}`)
    csvData.push(`発電容量,${formData.generatorCapacity} ${formData.generatorCapacityUnit}`)
    csvData.push(`回転数,${formData.rotationSpeed} min⁻¹`)
    csvData.push(`設置場所,${formData.installationLocation}`)
    csvData.push(`使用燃料,${formData.fuelType}`)
    csvData.push('')
    
    csvData.push('A. 外観・設置状況')
    csvData.push(`外形損傷・錆・腐食,${formData.exteriorDamage}`)
    csvData.push(`周囲の整理整頓状況,${formData.surroundingCleanup}`)
    csvData.push(`標識・照明・表示類,${formData.signageLighting}`)
    csvData.push(`備考,${formData.exteriorRemarks}`)
    csvData.push('')
    
    csvData.push('B. 燃料系統')
    csvData.push(`燃料タンク残量,${formData.fuelTankLevel}/${formData.fuelTankCapacity}`)
    csvData.push(`燃料フィルター状態,${formData.fuelFilterStatus}`)
    csvData.push(`ドレン抜き実施,${formData.drainagePerformed}`)
    csvData.push(`漏れ・振れ止め緩み,${formData.fuelLeakage}`)
    csvData.push(`備考,${formData.fuelRemarks}`)
    csvData.push('')
    
    csvData.push('C. 潤滑油系統')
    csvData.push(`油量,${formData.oilLevel}`)
    csvData.push(`油質,${formData.oilQuality}`)
    csvData.push(`オイルフィルター交換,${formData.oilFilterChanged}`)
    csvData.push(`ポンプ・注油装置点検,${formData.oilPumpInspection}`)
    csvData.push(`圧力スイッチ動作,${formData.pressureSwitchOperation}`)
    csvData.push(`設定値,${formData.pressureSwitchSetting}`)
    csvData.push(`備考,${formData.lubricationRemarks}`)
    csvData.push('')
    
    csvData.push('D. 冷却系統')
    csvData.push(`ラジエーター水量,${formData.radiatorWaterLevel}`)
    csvData.push(`冷却水ヒーター動作,${formData.coolantHeaterOperation}`)
    csvData.push(`抵抗値,${formData.coolantHeaterResistance} Ω`)
    csvData.push(`サーモスタット動作,${formData.thermostatOperation}`)
    csvData.push(`設定値,${formData.thermostatSetting}`)
    csvData.push(`配管・ホース交換履歴,${formData.pipingReplacementHistory}`)
    csvData.push(`備考,${formData.coolingRemarks}`)
    csvData.push('')
    
    csvData.push('E. 始動系統')
    csvData.push(`手動始動試験,${formData.manualStartTest},${formData.manualStartTime}秒`)
    csvData.push(`自動始動試験,${formData.autoStartTest},${formData.autoStartTime}秒`)
    csvData.push(`連続起動試験,${formData.continuousStartTest},${formData.continuousStartCount}回`)
    csvData.push(`セルモーター点検,${formData.starterMotorInspection}`)
    csvData.push(`回転数,${formData.starterMotorRotation}`)
    csvData.push(`停止動作時間,${formData.stopOperationTime}秒`)
    csvData.push(`フライホイール停止時間,${formData.flywheelStopTime}秒`)
    csvData.push(`備考,${formData.startingRemarks}`)
    csvData.push('')
    
    csvData.push('F. 電装・制御盤・保護装置')
    csvData.push(`表示灯・計器類,${formData.indicatorLights}`)
    csvData.push(`遮断器・継電器動作,${formData.breakerRelayOperation}`)
    csvData.push(`設定値,${formData.breakerRelaySetting}`)
    csvData.push(`絶縁抵抗試験,${formData.insulationResistanceTest}`)
    csvData.push(`測定値,${formData.insulationResistanceValue} MΩ`)
    csvData.push(`電圧,${formData.voltage} V`)
    csvData.push(`周波数,${formData.frequency} Hz`)
    csvData.push(`力率,${formData.powerFactor}`)
    csvData.push(`備考,${formData.electricalRemarks}`)
    csvData.push('')
    
    csvData.push('G. 蓄電池')
    csvData.push(`製造年月日,${formData.batteryManufactureDate}`)
    csvData.push(`型式,${formData.batteryModel}`)
    csvData.push(`次回推奨交換時期,${formData.nextBatteryReplacement}`)
    csvData.push('')
    csvData.push('セル番号,電圧(V),判定,内部抵抗(mΩ),判定,温度(℃)')
    formData.batteryCells.forEach(cell => {
      csvData.push(`${cell.cellNumber},${cell.voltage},${cell.voltageJudgment},${cell.resistance},${cell.resistanceJudgment},${cell.temperature}`)
    })
    csvData.push(`備考,${formData.batteryRemarks}`)
    csvData.push('')
    
    csvData.push('結果判定・対応措置')
    csvData.push('区分,判定,処置内容,備考')
    formData.inspectionResults.forEach(result => {
      csvData.push(`${result.category},${result.judgment},${result.measureContent},${result.remarks}`)
    })
    csvData.push('')
    
    csvData.push(`総合コメント,${formData.overallComments}`)
    
    const csv = csvData.join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `非常用発電機点検報告書_${formData.siteName}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleSubmit = () => {
    console.log('Submitting emergency generator inspection form:', formData)
    alert('非常用発電機点検報告書を保存しました。')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">非常用発電機点検報告書</h2>
            <p className="text-blue-100 text-sm mt-1">拠点: {facilityName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <form className="space-y-8">
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
                    <option value="A">A点検</option>
                    <option value="B">B点検</option>
                    <option value="C">C点検</option>
                    <option value="D">D点検</option>
                    <option value="E">E点検</option>
                    <option value="F">F点検</option>
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
                    点検担当者／資格番号
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
                          placeholder="資格番号"
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
                      + 担当者を追加
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    発電機型式
                  </label>
                  <input
                    type="text"
                    value={formData.generatorModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, generatorModel: e.target.value }))}
                    placeholder="例：PG360QY、TKGP320LT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    発電容量
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.generatorCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, generatorCapacity: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={formData.generatorCapacityUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, generatorCapacityUnit: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kVA">kVA</option>
                      <option value="kW">kW</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    回転数 (min⁻¹)
                  </label>
                  <input
                    type="text"
                    value={formData.rotationSpeed}
                    onChange={(e) => setFormData(prev => ({ ...prev, rotationSpeed: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    設置場所
                  </label>
                  <select
                    value={formData.installationLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, installationLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="屋外">屋外</option>
                    <option value="屋内（キュービクル式）">屋内（キュービクル式）</option>
                    <option value="屋内（その他）">屋内（その他）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    使用燃料
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="軽油">軽油</option>
                    <option value="A重油">A重油</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. 点検項目 */}
            {/* A. 外観・設置状況 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-A. 外観・設置状況</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    外形損傷・錆・腐食有無
                  </label>
                  <select
                    value={formData.exteriorDamage}
                    onChange={(e) => setFormData(prev => ({ ...prev, exteriorDamage: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="△">△</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周囲の整理整頓状況
                  </label>
                  <select
                    value={formData.surroundingCleanup}
                    onChange={(e) => setFormData(prev => ({ ...prev, surroundingCleanup: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="△">△</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    標識・照明・表示類の適正
                  </label>
                  <select
                    value={formData.signageLighting}
                    onChange={(e) => setFormData(prev => ({ ...prev, signageLighting: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="△">△</option>
                    <option value="×">×</option>
                    <option value="－">－</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.exteriorRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, exteriorRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* B. 燃料系統 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-B. 燃料系統</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    燃料タンク残量 / 容量
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.fuelTankLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelTankLevel: e.target.value }))}
                      placeholder="残量"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">/</span>
                    <input
                      type="text"
                      value={formData.fuelTankCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, fuelTankCapacity: e.target.value }))}
                      placeholder="容量"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    燃料フィルター状態
                  </label>
                  <select
                    value={formData.fuelFilterStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelFilterStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="交換済み">交換済み</option>
                    <option value="未交換">未交換</option>
                    <option value="異常">異常</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ドレン抜き実施
                  </label>
                  <select
                    value={formData.drainagePerformed}
                    onChange={(e) => setFormData(prev => ({ ...prev, drainagePerformed: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    漏れ・振れ止め緩みの有無
                  </label>
                  <select
                    value={formData.fuelLeakage}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelLeakage: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○（なし）</option>
                    <option value="×">×（あり）</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.fuelRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* C. 潤滑油系統 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-C. 潤滑油系統</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    油量
                  </label>
                  <input
                    type="text"
                    value={formData.oilLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, oilLevel: e.target.value }))}
                    placeholder="ゲージ位置"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    油質
                  </label>
                  <input
                    type="text"
                    value={formData.oilQuality}
                    onChange={(e) => setFormData(prev => ({ ...prev, oilQuality: e.target.value }))}
                    placeholder="交換履歴、汚れ確認"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    オイルフィルター交換
                  </label>
                  <select
                    value={formData.oilFilterChanged}
                    onChange={(e) => setFormData(prev => ({ ...prev, oilFilterChanged: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ポンプ・注油装置点検
                  </label>
                  <select
                    value={formData.oilPumpInspection}
                    onChange={(e) => setFormData(prev => ({ ...prev, oilPumpInspection: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    圧力スイッチ動作
                  </label>
                  <select
                    value={formData.pressureSwitchOperation}
                    onChange={(e) => setFormData(prev => ({ ...prev, pressureSwitchOperation: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    圧力スイッチ設定値
                  </label>
                  <input
                    type="text"
                    value={formData.pressureSwitchSetting}
                    onChange={(e) => setFormData(prev => ({ ...prev, pressureSwitchSetting: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.lubricationRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, lubricationRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* D. 冷却系統 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-D. 冷却系統</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ラジエーター水量
                  </label>
                  <select
                    value={formData.radiatorWaterLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, radiatorWaterLevel: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    冷却水ヒーター動作確認
                  </label>
                  <input
                    type="text"
                    value={formData.coolantHeaterOperation}
                    onChange={(e) => setFormData(prev => ({ ...prev, coolantHeaterOperation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    冷却水ヒーター抵抗値 (Ω)
                  </label>
                  <input
                    type="text"
                    value={formData.coolantHeaterResistance}
                    onChange={(e) => setFormData(prev => ({ ...prev, coolantHeaterResistance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    サーモスタット・温調弁作動確認
                  </label>
                  <input
                    type="text"
                    value={formData.thermostatOperation}
                    onChange={(e) => setFormData(prev => ({ ...prev, thermostatOperation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    サーモスタット設定値
                  </label>
                  <input
                    type="text"
                    value={formData.thermostatSetting}
                    onChange={(e) => setFormData(prev => ({ ...prev, thermostatSetting: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    配管・ホース交換履歴
                  </label>
                  <input
                    type="text"
                    value={formData.pipingReplacementHistory}
                    onChange={(e) => setFormData(prev => ({ ...prev, pipingReplacementHistory: e.target.value }))}
                    placeholder="交換年、材質"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.coolingRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, coolingRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* E. 始動系統 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-E. 始動系統</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手動始動試験
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.manualStartTest}
                      onChange={(e) => setFormData(prev => ({ ...prev, manualStartTest: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="成功">成功</option>
                      <option value="失敗">失敗</option>
                    </select>
                    <input
                      type="text"
                      value={formData.manualStartTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, manualStartTime: e.target.value }))}
                      placeholder="秒数"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    自動始動試験
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.autoStartTest}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoStartTest: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="成功">成功</option>
                      <option value="失敗">失敗</option>
                    </select>
                    <input
                      type="text"
                      value={formData.autoStartTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoStartTime: e.target.value }))}
                      placeholder="秒数"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    連続起動試験
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.continuousStartTest}
                      onChange={(e) => setFormData(prev => ({ ...prev, continuousStartTest: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="成功">成功</option>
                      <option value="失敗">失敗</option>
                    </select>
                    <input
                      type="text"
                      value={formData.continuousStartCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, continuousStartCount: e.target.value }))}
                      placeholder="回数"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    セルモーター点検
                  </label>
                  <input
                    type="text"
                    value={formData.starterMotorInspection}
                    onChange={(e) => setFormData(prev => ({ ...prev, starterMotorInspection: e.target.value }))}
                    placeholder="ブラシ点検等"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    セルモーター回転数
                  </label>
                  <input
                    type="text"
                    value={formData.starterMotorRotation}
                    onChange={(e) => setFormData(prev => ({ ...prev, starterMotorRotation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    停止動作時間 (秒)
                  </label>
                  <input
                    type="text"
                    value={formData.stopOperationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, stopOperationTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    フライホイール停止時間 (秒)
                  </label>
                  <input
                    type="text"
                    value={formData.flywheelStopTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, flywheelStopTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.startingRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, startingRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* F. 電装・制御盤・保護装置 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-F. 電装・制御盤・保護装置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    表示灯・計器類の機能
                  </label>
                  <select
                    value={formData.indicatorLights}
                    onChange={(e) => setFormData(prev => ({ ...prev, indicatorLights: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="△">△</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    遮断器・継電器の動作
                  </label>
                  <select
                    value={formData.breakerRelayOperation}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakerRelayOperation: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○</option>
                    <option value="×">×</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    遮断器・継電器設定値 (A・V)
                  </label>
                  <input
                    type="text"
                    value={formData.breakerRelaySetting}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakerRelaySetting: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    絶縁抵抗試験
                  </label>
                  <input
                    type="text"
                    value={formData.insulationResistanceTest}
                    onChange={(e) => setFormData(prev => ({ ...prev, insulationResistanceTest: e.target.value }))}
                    placeholder="合否"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    絶縁抵抗値 (MΩ)
                  </label>
                  <input
                    type="text"
                    value={formData.insulationResistanceValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, insulationResistanceValue: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電圧 (V)
                  </label>
                  <input
                    type="text"
                    value={formData.voltage}
                    onChange={(e) => setFormData(prev => ({ ...prev, voltage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周波数 (Hz)
                  </label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    力率
                  </label>
                  <input
                    type="text"
                    value={formData.powerFactor}
                    onChange={(e) => setFormData(prev => ({ ...prev, powerFactor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={formData.electricalRemarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, electricalRemarks: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* G. 蓄電池 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2-G. 蓄電池</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    製造年月日
                  </label>
                  <input
                    type="date"
                    value={formData.batteryManufactureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, batteryManufactureDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    型式
                  </label>
                  <input
                    type="text"
                    value={formData.batteryModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, batteryModel: e.target.value }))}
                    placeholder="例：FVL-150、REH40-12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    次回推奨交換時期
                  </label>
                  <input
                    type="date"
                    value={formData.nextBatteryReplacement}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電圧管理範囲 (V)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.batteryVoltageMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, batteryVoltageMin: e.target.value }))}
                      placeholder="最小"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span>〜</span>
                    <input
                      type="text"
                      value={formData.batteryVoltageMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, batteryVoltageMax: e.target.value }))}
                      placeholder="最大"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内部抵抗閾値 (mΩ)
                  </label>
                  <input
                    type="text"
                    value={formData.batteryResistanceThreshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, batteryResistanceThreshold: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">セル番号</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">電圧 (V)</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">判定</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">内部抵抗 (mΩ)</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">判定</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-700 text-center">温度 (℃)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.batteryCells.map((cell) => (
                      <tr key={cell.id}>
                        <td className="px-4 py-2 text-sm text-center">{cell.cellNumber}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={cell.voltage}
                            onChange={(e) => updateBatteryCell(cell.id, 'voltage', e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cell.voltageJudgment === '○' ? 'bg-green-100 text-green-800' :
                            cell.voltageJudgment === '△' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {cell.voltageJudgment}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={cell.resistance}
                            onChange={(e) => updateBatteryCell(cell.id, 'resistance', e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cell.resistanceJudgment === '○' ? 'bg-green-100 text-green-800' :
                            cell.resistanceJudgment === '△' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {cell.resistanceJudgment}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={cell.temperature}
                            onChange={(e) => updateBatteryCell(cell.id, 'temperature', e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <textarea
                  value={formData.batteryRemarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, batteryRemarks: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            {/* 3. 結果判定・対応措置 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3. 結果判定・対応措置</h3>
              
              <div className="space-y-4">
                {formData.inspectionResults.map((result, index) => (
                  <div key={index} className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          区分
                        </label>
                        <input
                          type="text"
                          value={result.category}
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
                          処置内容
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
                          placeholder={
                            result.category === '燃料系' ? 'フィルター交換・配管修理等' :
                            result.category === '冷却系' ? '漏れ修理・ホース交換等' :
                            result.category === '始動系' ? 'セルモータ交換・バッテリ強化等' :
                            '継電器調整・遮断器設定変更'
                          }
                          disabled={result.judgment === '良'}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          備考
                        </label>
                        <input
                          type="text"
                          value={result.remarks}
                          onChange={(e) => {
                            const newResults = formData.inspectionResults.map((r, i) =>
                              i === index ? { ...r, remarks: e.target.value } : r
                            )
                            setFormData(prev => ({ ...prev, inspectionResults: newResults }))
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="点検全体の所見、特記事項、予備品交換記録等を記入してください"
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