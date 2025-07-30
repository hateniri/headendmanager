'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2, Battery, AlertCircle, Download, FileSpreadsheet, FileText } from 'lucide-react'
import CommonInspectionHeader, { CommonInspectionData } from './CommonInspectionHeader'
import { exportToExcel, exportToPDF, formatInspectionDataForExcel } from '@/utils/exportUtils'
import { useInspectionHistoryStore } from '@/store/inspectionHistoryStore'

interface BatteryInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

interface CellMeasurement {
  cellNo: number
  voltage1: string // 手前
  voltageJudge1: '○' | '△' | 'NG'
  voltage2: string // 奥
  voltageJudge2: '○' | '△' | 'NG'
  resistance1: string // 手前
  resistanceJudge1: '○' | '△' | 'NG'
  resistance2: string // 奥
  resistanceJudge2: '○' | '△' | 'NG'
  remarks: string
}

export default function BatteryInspectionForm({ isOpen, onClose, facilityId, facilityName }: BatteryInspectionFormProps) {
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
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionCompany: '',
    measurer: '',
    measuringDevice: '',
    ambientTemp: '',
    targetName: '',
    totalVoltage: '',
    batteryMaker: '',
    batteryModel: '',
    manufactureDate: '',
    serialNumber: '',
    nextReplacementDate: '',
    
    // 2. セル構成情報
    cellCount: '',
    systemCount: '1系統',
    configuration: '',
    voltageRangeMin: '2.10',
    voltageRangeMax: '2.55',
    resistanceThreshold: '0.65',
    
    // 3. 各セル測定データ
    cellMeasurements: [] as CellMeasurement[],
    
    // 4. 点検コメント・判断
    observations: '',
    watchCellCount: 0,
    voltageVariation: 'なし',
    resistanceVariation: 'なし',
    recommendedReplacement: '',
    
    // その他
    comments: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [batteryAge, setBatteryAge] = useState('')

  // 製造年月から経過年数を計算
  useEffect(() => {
    if (formData.manufactureDate) {
      const manufacture = new Date(formData.manufactureDate)
      const now = new Date()
      const years = now.getFullYear() - manufacture.getFullYear()
      const months = now.getMonth() - manufacture.getMonth()
      const totalMonths = years * 12 + months
      setBatteryAge(`${Math.floor(totalMonths / 12)}年${totalMonths % 12}ヶ月`)
    }
  }, [formData.manufactureDate])

  // セル数が変更されたら測定データを初期化
  useEffect(() => {
    const count = parseInt(formData.cellCount) || 0
    if (count > 0 && count !== formData.cellMeasurements.length) {
      const measurements: CellMeasurement[] = []
      for (let i = 1; i <= count; i++) {
        measurements.push({
          cellNo: i,
          voltage1: '',
          voltageJudge1: '○',
          voltage2: '',
          voltageJudge2: '○',
          resistance1: '',
          resistanceJudge1: '○',
          resistance2: '',
          resistanceJudge2: '○',
          remarks: '',
        })
      }
      setFormData({ ...formData, cellMeasurements: measurements })
    }
  }, [formData.cellCount])

  // 電圧判定
  const judgeVoltage = (voltage: string): '○' | '△' | 'NG' => {
    const v = parseFloat(voltage)
    if (!v || isNaN(v)) return '○'
    const min = parseFloat(formData.voltageRangeMin)
    const max = parseFloat(formData.voltageRangeMax)
    if (v < min || v > max) return 'NG'
    if (v < min * 1.05 || v > max * 0.95) return '△'
    return '○'
  }

  // 抵抗判定
  const judgeResistance = (resistance: string): '○' | '△' | 'NG' => {
    const r = parseFloat(resistance)
    if (!r || isNaN(r)) return '○'
    const threshold = parseFloat(formData.resistanceThreshold)
    if (r >= threshold) return 'NG'
    if (r >= threshold * 0.8) return '△'
    return '○'
  }

  // セル測定値更新
  const updateCellMeasurement = (index: number, field: keyof CellMeasurement, value: string) => {
    const newMeasurements = [...formData.cellMeasurements]
    newMeasurements[index] = { ...newMeasurements[index], [field]: value }
    
    // 自動判定
    if (field === 'voltage1') {
      newMeasurements[index].voltageJudge1 = judgeVoltage(value)
    } else if (field === 'voltage2') {
      newMeasurements[index].voltageJudge2 = judgeVoltage(value)
    } else if (field === 'resistance1') {
      newMeasurements[index].resistanceJudge1 = judgeResistance(value)
    } else if (field === 'resistance2') {
      newMeasurements[index].resistanceJudge2 = judgeResistance(value)
    }
    
    setFormData({ ...formData, cellMeasurements: newMeasurements })
    
    // 要観察セル数を自動計算
    const watchCount = newMeasurements.filter(m => 
      m.voltageJudge1 === 'NG' || m.voltageJudge2 === 'NG' ||
      m.resistanceJudge1 === 'NG' || m.resistanceJudge2 === 'NG' ||
      m.voltageJudge1 === '△' || m.voltageJudge2 === '△' ||
      m.resistanceJudge1 === '△' || m.resistanceJudge2 === '△'
    ).length
    setFormData(prev => ({ ...prev, watchCellCount: watchCount }))
  }

  const calculateOverallJudgment = (): '良好' | '要注意' | '要修理' | '危険' => {
    // 異常事項がある場合
    if (formData.abnormalities) {
      if (formData.abnormalities.includes('危険') || formData.abnormalities.includes('緊急')) {
        return '危険'
      }
      if (formData.recommendedParts.length > 0) {
        return '要修理'
      }
      return '要注意'
    }
    
    // セル測定結果の確認
    const hasNgCells = cellMeasurements.some(cell => 
      cell.voltageJudge1 === 'NG' || cell.voltageJudge2 === 'NG' ||
      cell.resistanceJudge1 === 'NG' || cell.resistanceJudge2 === 'NG'
    )
    
    if (hasNgCells) {
      return '要修理'
    }
    
    const hasTriangleCells = cellMeasurements.some(cell => 
      cell.voltageJudge1 === '△' || cell.voltageJudge2 === '△' ||
      cell.resistanceJudge1 === '△' || cell.resistanceJudge2 === '△'
    )
    
    if (hasTriangleCells) {
      return '要注意'
    }
    
    return '良好'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const overallJudgment = calculateOverallJudgment()
    
    // 点検履歴に保存
    addHistory({
      facilityId,
      facilityName,
      inspectionType: 'battery',
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
        cellMeasurements,
        uploadedFiles: uploadedFiles.map(f => f.name)
      }
    })
    
    alert('蓄電池設備点検報告を登録しました')
    onClose()
  }

  const handleExportExcel = () => {
    const excelData = [
      formatInspectionDataForExcel({ ...commonData, ...formData }, '蓄電池'),
      ...cellMeasurements.map(cell => ({
        セル番号: cell.cellNo,
        電圧_手前: cell.voltage1,
        電圧判定_手前: cell.voltageJudge1,
        電圧_奥: cell.voltage2,
        電圧判定_奥: cell.voltageJudge2,
        内部抵抗_手前: cell.resistance1,
        内部抵抗判定_手前: cell.resistanceJudge1,
        内部抵抗_奥: cell.resistance2,
        内部抵抗判定_奥: cell.resistanceJudge2,
        備考: cell.remarks,
      }))
    ]
    exportToExcel(excelData, `蓄電池点検報告書_${facilityName}_${commonData.inspectionStartDate}.xlsx`, '蓄電池点検')
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
      { item: '蓄電池メーカー', value: formData.batteryMaker },
      { item: 'モデル', value: formData.batteryModel },
      { item: '総合判定', value: calculateOverallJudgment() },
      { item: '異常事項', value: formData.abnormalities || 'なし' },
    ]
    
    exportToPDF(
      '蓄電池点検報告書',
      data,
      columns,
      `蓄電池点検報告書_${facilityName}_${commonData.inspectionStartDate}.pdf`,
      [
        { label: '施設名', value: facilityName },
        { label: '点検日', value: commonData.inspectionStartDate }
      ]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  // CSV出力機能
  const exportToCSV = () => {
    const headers = ['セルNo', '電圧①(手前)', '判定①', '電圧②(奥)', '判定②', '抵抗①(手前)', '判定①', '抵抗②(奥)', '判定②', '備考']
    const rows = formData.cellMeasurements.map(m => [
      m.cellNo,
      m.voltage1,
      m.voltageJudge1,
      m.voltage2,
      m.voltageJudge2,
      m.resistance1,
      m.resistanceJudge1,
      m.resistance2,
      m.resistanceJudge2,
      m.remarks
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `蓄電池点検_${facilityName}_${formData.inspectionDate}.csv`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">蓄電池設備点検報告書</h2>
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

        <form onSubmit={handleSubmit} className="p-6">
          {/* 共通ヘッダー */}
          <div className="mb-8">
            <CommonInspectionHeader
              data={commonData}
              onChange={setCommonData}
              facilityName={facilityName}
            />
          </div>

          {/* 1. 点検基本情報セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">1. 点検基本情報</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周囲温度（℃）
                  </label>
                  <input
                    type="number"
                    value={formData.ambientTemp}
                    onChange={(e) => setFormData({ ...formData, ambientTemp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    placeholder="例: 22.5"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  使用測定器
                </label>
                <input
                  type="text"
                  value={formData.measuringDevice}
                  onChange={(e) => setFormData({ ...formData, measuringDevice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="型式＋S/N"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  測定対象名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.targetName}
                  onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: A系整流器、UPS#B"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  総電圧（V）
                </label>
                <input
                  type="number"
                  value={formData.totalVoltage}
                  onChange={(e) => setFormData({ ...formData, totalVoltage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  蓄電池メーカー
                </label>
                <input
                  type="text"
                  value={formData.batteryMaker}
                  onChange={(e) => setFormData({ ...formData, batteryMaker: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: GSユアサ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  型式
                </label>
                <input
                  type="text"
                  value={formData.batteryModel}
                  onChange={(e) => setFormData({ ...formData, batteryModel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: SNSX-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  製造年月
                </label>
                <input
                  type="month"
                  value={formData.manufactureDate}
                  onChange={(e) => setFormData({ ...formData, manufactureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {batteryAge && (
                  <p className="text-xs text-gray-600 mt-1">経過年数: {batteryAge}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  製造番号
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  次回交換推奨時期
                </label>
                <input
                  type="month"
                  value={formData.nextReplacementDate}
                  onChange={(e) => setFormData({ ...formData, nextReplacementDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 2. セル構成情報セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">2. セル構成情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  セル数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.cellCount}
                  onChange={(e) => setFormData({ ...formData, cellCount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 24、60、64"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  系統数
                </label>
                <select
                  value={formData.systemCount}
                  onChange={(e) => setFormData({ ...formData, systemCount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1系統">1系統</option>
                  <option value="2系統（手前/奥）">2系統（手前/奥）</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  直列・並列構成
                </label>
                <input
                  type="text"
                  value={formData.configuration}
                  onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 24S×1P、30S×2P"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  セル電圧基準範囲（V）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.voltageRangeMin}
                    onChange={(e) => setFormData({ ...formData, voltageRangeMin: e.target.value })}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                  <span>〜</span>
                  <input
                    type="number"
                    value={formData.voltageRangeMax}
                    onChange={(e) => setFormData({ ...formData, voltageRangeMax: e.target.value })}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内部抵抗基準値（mΩ）
                </label>
                <input
                  type="number"
                  value={formData.resistanceThreshold}
                  onChange={(e) => setFormData({ ...formData, resistanceThreshold: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  placeholder="例: 0.65"
                />
                <p className="text-xs text-gray-600 mt-1">未満が正常値</p>
              </div>
            </div>
          </div>

          {/* 3. 各セル測定入力フォーム */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex justify-between items-center">
              <span>3. 各セル測定データ</span>
              {formData.cellMeasurements.length > 0 && (
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV出力
                </button>
              )}
            </h3>
            
            {formData.cellMeasurements.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Battery className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">セル数を入力すると測定表が表示されます</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No.
                      </th>
                      {formData.systemCount === '2系統（手前/奥）' ? (
                        <>
                          <th colSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
                            電圧（V）
                          </th>
                          <th colSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
                            内部抵抗（mΩ）
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            電圧（V）
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            判定
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            内部抵抗（mΩ）
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            判定
                          </th>
                        </>
                      )}
                      <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        備考
                      </th>
                    </tr>
                    {formData.systemCount === '2系統（手前/奥）' && (
                      <tr>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 border-l">手前</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500">奥</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 border-l">手前</th>
                        <th className="px-3 py-3 text-center text-xs font-medium text-gray-500">奥</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.cellMeasurements.map((cell, index) => (
                      <tr key={cell.cellNo} className={index % 12 === 11 ? 'border-b-2 border-gray-400' : ''}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cell.cellNo}
                        </td>
                        {formData.systemCount === '2系統（手前/奥）' ? (
                          <>
                            <td className="px-3 py-2 whitespace-nowrap border-l">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={cell.voltage1}
                                  onChange={(e) => updateCellMeasurement(index, 'voltage1', e.target.value)}
                                  className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                                  step="0.01"
                                />
                                <span className={`text-xs font-medium ${
                                  cell.voltageJudge1 === '○' ? 'text-green-600' :
                                  cell.voltageJudge1 === '△' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {cell.voltageJudge1}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={cell.voltage2}
                                  onChange={(e) => updateCellMeasurement(index, 'voltage2', e.target.value)}
                                  className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                                  step="0.01"
                                />
                                <span className={`text-xs font-medium ${
                                  cell.voltageJudge2 === '○' ? 'text-green-600' :
                                  cell.voltageJudge2 === '△' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {cell.voltageJudge2}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap border-l">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={cell.resistance1}
                                  onChange={(e) => updateCellMeasurement(index, 'resistance1', e.target.value)}
                                  className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                                  step="0.01"
                                />
                                <span className={`text-xs font-medium ${
                                  cell.resistanceJudge1 === '○' ? 'text-green-600' :
                                  cell.resistanceJudge1 === '△' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {cell.resistanceJudge1}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={cell.resistance2}
                                  onChange={(e) => updateCellMeasurement(index, 'resistance2', e.target.value)}
                                  className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                                  step="0.01"
                                />
                                <span className={`text-xs font-medium ${
                                  cell.resistanceJudge2 === '○' ? 'text-green-600' :
                                  cell.resistanceJudge2 === '△' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {cell.resistanceJudge2}
                                </span>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={cell.voltage1}
                                onChange={(e) => updateCellMeasurement(index, 'voltage1', e.target.value)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                step="0.01"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                cell.voltageJudge1 === '○' ? 'bg-green-100 text-green-800' :
                                cell.voltageJudge1 === '△' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {cell.voltageJudge1}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={cell.resistance1}
                                onChange={(e) => updateCellMeasurement(index, 'resistance1', e.target.value)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                step="0.01"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                cell.resistanceJudge1 === '○' ? 'bg-green-100 text-green-800' :
                                cell.resistanceJudge1 === '△' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {cell.resistanceJudge1}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            value={cell.remarks}
                            onChange={(e) => updateCellMeasurement(index, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder={
                              cell.voltageJudge1 === 'NG' || cell.voltageJudge2 === 'NG' ? '電圧基準外' :
                              cell.resistanceJudge1 === 'NG' || cell.resistanceJudge2 === 'NG' ? '抵抗値異常' :
                              ''
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {formData.watchCellCount > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        要観察セル数: <span className="font-bold">{formData.watchCellCount}セル</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. 点検コメント・判断セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">4. 点検コメント・判断</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電圧のばらつき
                </label>
                <select
                  value={formData.voltageVariation}
                  onChange={(e) => setFormData({ ...formData, voltageVariation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="なし">なし</option>
                  <option value="あり">あり</option>
                  <option value="顕著">顕著</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  抵抗のばらつき
                </label>
                <select
                  value={formData.resistanceVariation}
                  onChange={(e) => setFormData({ ...formData, resistanceVariation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="なし">なし</option>
                  <option value="あり">あり</option>
                  <option value="顕著">顕著</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  次回交換時期（参考）
                </label>
                <input
                  type="text"
                  value={formData.recommendedReplacement}
                  onChange={(e) => setFormData({ ...formData, recommendedReplacement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="期待寿命・使用条件をもとに記入"
                />
              </div>

              {batteryAge && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    製造年月からの経年
                  </label>
                  <input
                    type="text"
                    value={batteryAge}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  所見・異常報告
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="点検時の所見、異常箇所の詳細など"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  その他コメント
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 5. 添付・出力機能 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">5. 添付資料</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  写真添付（状況写真・警報表示など）
                </label>
                <div className="flex items-center">
                  <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="text-sm">ファイルを選択</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アップロードファイル一覧
                  </label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ボタン */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 -mx-6 -mb-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
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
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  登録
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}