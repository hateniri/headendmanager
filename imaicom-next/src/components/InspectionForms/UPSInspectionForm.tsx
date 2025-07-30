'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { useInspectionHistoryStore } from '@/store/inspectionHistoryStore'
import CommonInspectionHeader, { CommonInspectionData } from './CommonInspectionHeader'
import { exportToExcel, exportToPDF, formatInspectionDataForExcel } from '@/utils/exportUtils'

interface UPSInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

export default function UPSInspectionForm({ isOpen, onClose, facilityId, facilityName }: UPSInspectionFormProps) {
  const { addHistory } = useInspectionHistoryStore()
  
  // 共通ヘッダーデータ
  const [commonData, setCommonData] = useState<CommonInspectionData>({
    inspectionStartDate: new Date().toISOString().split('T')[0],
    inspectionEndDate: new Date().toISOString().split('T')[0],
    inspectionCompany: '',
    inspector: '',
    witness: '',
    hasUrgentIssues: false,
  })
  
  const [formData, setFormData] = useState({
    // 1. 機器基本情報
    manufacturer: '',
    model: '',
    manufactureDate: '',
    serialNumber: '',
    inspectionType: '定期',
    
    // 2. 設備構成情報
    upsCapacity: '',
    batteryConfig: '',
    batteryModel: '',
    batteryManufactureDate: '',
    
    // 3. 外観・環境チェック
    appearanceNormal: false,
    noAbnormalSound: false,
    temperature: '',
    humidity: '',
    hasAirConditioning: true,
    ventilationStatus: '良好',
    
    // 4. 目視点検チェックリスト
    visualChecks: {
      doorOperation: '○',
      wiringTightness: '○',
      fanOperation: '○',
      fuseRelay: '○',
      capacitorExpansion: '○',
      panelDisplay: '○',
      connectorConnection: '○',
    },
    
    // 5. 電気的測定項目
    insulationResistance: '',
    outputVoltageUV: '',
    outputVoltageVW: '',
    outputVoltageWU: '',
    outputFrequency: '',
    batteryVoltages: [] as { cellNumber: number; voltage: string }[],
    batteryResistances: [] as { cellNumber: number; resistance: string }[],
    
    // 6. 機能試験チェック
    noLoadStartStop: '○',
    inverterToBypass: '○',
    bypassToInverter: '○',
    alarmTests: [] as string[],
    waveformMeasurement: '無',
    
    // 7. 部品交換／推奨
    replacedParts: [] as string[],
    recommendedParts: '',
    
    // 8. 所見・異常・コメント
    abnormalities: '',
    comments: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // 総合判定を決定する関数
  const determineOverallJudgment = (): '良好' | '要注意' | '要修理' | '危険' => {
    // 危険判定の条件
    if (
      formData.abnormalities.includes('火災') ||
      formData.abnormalities.includes('発火') ||
      formData.abnormalities.includes('煙') ||
      formData.abnormalities.includes('異常加熱') ||
      formData.visualChecks.capacitorExpansion === '×' // コンデンサ膨張・漏れ
    ) {
      return '危険'
    }

    // 要修理判定の条件
    const hasVisualAbnormality = Object.values(formData.visualChecks).includes('×')
    const hasFunctionAbnormality = 
      formData.noLoadStartStop === '×' ||
      formData.inverterToBypass === '×' ||
      formData.bypassToInverter === '×'
    const hasReplacedParts = formData.replacedParts.length > 0
    
    if (hasVisualAbnormality || hasFunctionAbnormality || hasReplacedParts) {
      return '要修理'
    }

    // 要注意判定の条件
    const hasAbnormalities = formData.abnormalities.trim() !== ''
    const hasHighTemperature = parseFloat(formData.temperature) > 35
    const hasLowInsulation = parseFloat(formData.insulationResistance) < 10
    const hasBadVentilation = formData.ventilationStatus === '悪い'
    const hasRecommendedParts = formData.recommendedParts.trim() !== ''
    
    if (hasAbnormalities || hasHighTemperature || hasLowInsulation || hasBadVentilation || hasRecommendedParts) {
      return '要注意'
    }

    // その他は良好
    return '良好'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 総合判定を決定
    const overallJudgment = determineOverallJudgment()
    
    // 緊急異常がある場合は自動的にフラグを立てる
    if (overallJudgment === '危険' || overallJudgment === '要修理') {
      setCommonData(prev => ({ ...prev, hasUrgentIssues: true }))
    }
    
    // 点検履歴に保存
    addHistory({
      facilityId: facilityId,
      facilityName: facilityName,
      inspectionType: 'ups',
      inspectionStartDate: commonData.inspectionStartDate,
      inspectionEndDate: commonData.inspectionEndDate,
      inspector: commonData.inspector,
      company: commonData.inspectionCompany,
      witness: commonData.witness,
      hasUrgentIssues: commonData.hasUrgentIssues || overallJudgment === '危険' || overallJudgment === '要修理',
      status: 'completed',
      overallJudgment: overallJudgment,
      data: {
        ...commonData,
        ...formData,
        uploadedFiles: uploadedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      }
    })
    
    console.log('UPS点検データ:', { ...commonData, ...formData })
    console.log('アップロードファイル:', uploadedFiles)
    console.log('総合判定:', overallJudgment)
    
    // 緊急通知が必要な場合
    if (commonData.hasUrgentIssues) {
      alert(`⚠️ 緊急通知\n\nUPS点検で緊急性の高い異常が発見されました。\n総合判定: ${overallJudgment}\n\n管理者への通知を行います。`)
    } else {
      alert(`UPS点検報告を登録しました。\n総合判定: ${overallJudgment}`)
    }
    
    onClose()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  // Excel出力
  const handleExportToExcel = () => {
    const excelData = [
      formatInspectionDataForExcel({ ...commonData, ...formData }, 'UPS'),
    ]
    
    // バッテリー測定データがある場合は別シートに出力
    if (formData.batteryVoltages.length > 0) {
      const batteryData = formData.batteryVoltages.map((v, i) => ({
        セル番号: v.cellNumber,
        電圧: v.voltage,
        内部抵抗: formData.batteryResistances[i]?.resistance || '',
      }))
      
      // 実際にはXLSXライブラリを使って複数シートを作成
      exportToExcel(excelData, `UPS点検報告書_${facilityName}_${commonData.inspectionStartDate}.xlsx`, 'UPS点検')
    } else {
      exportToExcel(excelData, `UPS点検報告書_${facilityName}_${commonData.inspectionStartDate}.xlsx`, 'UPS点検')
    }
  }

  // PDF出力
  const handleExportToPDF = () => {
    const columns = [
      { header: '項目', dataKey: 'item' },
      { header: '値', dataKey: 'value' },
    ]
    
    const data = [
      { item: 'UPS容量', value: `${formData.upsCapacity} kVA` },
      { item: 'バッテリー構成', value: formData.batteryConfig },
      { item: '温度', value: `${formData.temperature}°C` },
      { item: '湿度', value: `${formData.humidity}%` },
      { item: '総合判定', value: determineOverallJudgment() },
    ]
    
    const additionalInfo = [
      { label: '施設名', value: facilityName },
      { label: '点検期間', value: `${commonData.inspectionStartDate} ～ ${commonData.inspectionEndDate}` },
      { label: '作業会社', value: commonData.inspectionCompany },
      { label: '担当者', value: commonData.inspector },
    ]
    
    exportToPDF(
      'UPS点検報告書',
      data,
      columns,
      `UPS点検報告書_${facilityName}_${commonData.inspectionStartDate}.pdf`,
      additionalInfo
    )
  }

  const addBatteryMeasurement = () => {
    const newCellNumber = formData.batteryVoltages.length + 1
    setFormData({
      ...formData,
      batteryVoltages: [...formData.batteryVoltages, { cellNumber: newCellNumber, voltage: '' }],
      batteryResistances: [...formData.batteryResistances, { cellNumber: newCellNumber, resistance: '' }],
    })
  }

  const removeBatteryMeasurement = (index: number) => {
    setFormData({
      ...formData,
      batteryVoltages: formData.batteryVoltages.filter((_, i) => i !== index),
      batteryResistances: formData.batteryResistances.filter((_, i) => i !== index),
    })
  }

  const visualCheckItems = [
    { key: 'doorOperation', label: '扉の開閉状態' },
    { key: 'wiringTightness', label: '配線締め付け' },
    { key: 'fanOperation', label: '冷却ファン動作' },
    { key: 'fuseRelay', label: 'ヒューズ・リレー' },
    { key: 'capacitorExpansion', label: 'コンデンサ膨張／漏れ' },
    { key: 'panelDisplay', label: 'パネル表示／LED状態' },
    { key: 'connectorConnection', label: 'コネクタ接続状態' },
  ]

  const alarmTestOptions = [
    'ファン異常',
    '温度異常',
    'バッテリ異常',
    '過負荷',
    '入力電圧異常',
    '出力電圧異常',
  ]

  const replacementPartOptions = [
    'ファン',
    'リレー',
    'ヒューズ',
    'タッチパネル',
    'コンデンサ',
    'バッテリ',
    'その他',
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">UPS点検報告書</h2>
            <p className="text-blue-100 text-sm mt-1">拠点: {facilityName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </button>
            <button
              type="button"
              onClick={handleExportToPDF}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form id="ups-inspection-form" onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 共通ヘッダー */}
            <CommonInspectionHeader
              data={commonData}
              onChange={setCommonData}
              facilityName={facilityName}
            />
            
            {/* 1. 機器基本情報 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. 機器基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  メーカー名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 三菱電機"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  型式 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  製造番号（シリアル）
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
                  点検種別 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="定期">定期</option>
                  <option value="臨時">臨時</option>
                  <option value="故障後">故障後</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. 設備構成情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">2. 設備構成情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPS容量（kVA） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.upsCapacity}
                  onChange={(e) => setFormData({ ...formData, upsCapacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  蓄電池構成（セル数・並列数）
                </label>
                <input
                  type="text"
                  value={formData.batteryConfig}
                  onChange={(e) => setFormData({ ...formData, batteryConfig: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 30S×2P"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  蓄電池型番
                </label>
                <input
                  type="text"
                  value={formData.batteryModel}
                  onChange={(e) => setFormData({ ...formData, batteryModel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  蓄電池製造年月
                </label>
                <input
                  type="month"
                  value={formData.batteryManufactureDate}
                  onChange={(e) => setFormData({ ...formData, batteryManufactureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. 外観・環境チェック */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">3. 外観・環境チェック</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.appearanceNormal}
                    onChange={(e) => setFormData({ ...formData, appearanceNormal: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">機器外観に異常なし（破損・汚損）</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.noAbnormalSound}
                    onChange={(e) => setFormData({ ...formData, noAbnormalSound: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">異音・異臭なし</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周囲温度（℃）
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周囲湿度（%）
                  </label>
                  <input
                    type="number"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    空調の有無
                  </label>
                  <select
                    value={formData.hasAirConditioning ? 'あり' : 'なし'}
                    onChange={(e) => setFormData({ ...formData, hasAirConditioning: e.target.value === 'あり' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="あり">あり</option>
                    <option value="なし">なし</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    周囲換気状態
                  </label>
                  <select
                    value={formData.ventilationStatus}
                    onChange={(e) => setFormData({ ...formData, ventilationStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="良好">良好</option>
                    <option value="普通">普通</option>
                    <option value="悪い">悪い</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. 目視点検チェックリスト */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">4. 目視点検チェックリスト</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      点検項目
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ○（正常）
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ×（異常）
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      －（未実施）
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visualCheckItems.map((item) => (
                    <tr key={item.key}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.label}</td>
                      {['○', '×', '－'].map((value) => (
                        <td key={value} className="px-4 py-3 text-center">
                          <input
                            type="radio"
                            name={`visual_${item.key}`}
                            value={value}
                            checked={formData.visualChecks[item.key as keyof typeof formData.visualChecks] === value}
                            onChange={(e) => setFormData({
                              ...formData,
                              visualChecks: {
                                ...formData.visualChecks,
                                [item.key]: e.target.value
                              }
                            })}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. 電気的測定項目 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">5. 電気的測定項目</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    絶縁抵抗（MΩ）
                  </label>
                  <input
                    type="number"
                    value={formData.insulationResistance}
                    onChange={(e) => setFormData({ ...formData, insulationResistance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    placeholder="例: 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出力電圧 U-V（V）
                  </label>
                  <input
                    type="number"
                    value={formData.outputVoltageUV}
                    onChange={(e) => setFormData({ ...formData, outputVoltageUV: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    placeholder="例: 201.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出力電圧 V-W（V）
                  </label>
                  <input
                    type="number"
                    value={formData.outputVoltageVW}
                    onChange={(e) => setFormData({ ...formData, outputVoltageVW: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出力電圧 W-U（V）
                  </label>
                  <input
                    type="number"
                    value={formData.outputVoltageWU}
                    onChange={(e) => setFormData({ ...formData, outputVoltageWU: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出力周波数（Hz）
                  </label>
                  <input
                    type="number"
                    value={formData.outputFrequency}
                    onChange={(e) => setFormData({ ...formData, outputFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    placeholder="例: 60.0"
                  />
                </div>
              </div>

              {/* バッテリ測定値 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    バッテリ電圧・内部抵抗（セル毎）
                  </label>
                  <button
                    type="button"
                    onClick={addBatteryMeasurement}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    セル追加
                  </button>
                </div>
                
                {formData.batteryVoltages.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">セル番号</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">電圧（V）</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">内部抵抗（mΩ）</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.batteryVoltages.map((cell, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{cell.cellNumber}</td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={cell.voltage}
                                onChange={(e) => {
                                  const newVoltages = [...formData.batteryVoltages]
                                  newVoltages[index].voltage = e.target.value
                                  setFormData({ ...formData, batteryVoltages: newVoltages })
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={formData.batteryResistances[index]?.resistance || ''}
                                onChange={(e) => {
                                  const newResistances = [...formData.batteryResistances]
                                  newResistances[index].resistance = e.target.value
                                  setFormData({ ...formData, batteryResistances: newResistances })
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded"
                                step="0.1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => removeBatteryMeasurement(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 6. 機能試験チェック */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">6. 機能試験チェック</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    無負荷起動／停止確認
                  </label>
                  <select
                    value={formData.noLoadStartStop}
                    onChange={(e) => setFormData({ ...formData, noLoadStartStop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○（正常）</option>
                    <option value="×">×（異常）</option>
                    <option value="－">－（未実施）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    インバータ→バイパス手動切替
                  </label>
                  <select
                    value={formData.inverterToBypass}
                    onChange={(e) => setFormData({ ...formData, inverterToBypass: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○（正常）</option>
                    <option value="×">×（異常）</option>
                    <option value="－">－（未実施）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    バイパス→インバータ手動切替
                  </label>
                  <select
                    value={formData.bypassToInverter}
                    onChange={(e) => setFormData({ ...formData, bypassToInverter: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="○">○（正常）</option>
                    <option value="×">×（異常）</option>
                    <option value="－">－（未実施）</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  警報試験
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {alarmTestOptions.map((alarm) => (
                    <label key={alarm} className="flex items-center">
                      <input
                        type="checkbox"
                        value={alarm}
                        checked={formData.alarmTests.includes(alarm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, alarmTests: [...formData.alarmTests, alarm] })
                          } else {
                            setFormData({ ...formData, alarmTests: formData.alarmTests.filter(a => a !== alarm) })
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{alarm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  波形測定
                </label>
                <select
                  value={formData.waveformMeasurement}
                  onChange={(e) => setFormData({ ...formData, waveformMeasurement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="有">有</option>
                  <option value="無">無</option>
                </select>
              </div>
            </div>
          </div>

          {/* 7. 部品交換／推奨 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">7. 部品交換／推奨</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  今回交換部品
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {replacementPartOptions.map((part) => (
                    <label key={part} className="flex items-center">
                      <input
                        type="checkbox"
                        value={part}
                        checked={formData.replacedParts.includes(part)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, replacedParts: [...formData.replacedParts, part] })
                          } else {
                            setFormData({ ...formData, replacedParts: formData.replacedParts.filter(p => p !== part) })
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{part}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  次回交換推奨部品と期限
                </label>
                <textarea
                  value={formData.recommendedParts}
                  onChange={(e) => setFormData({ ...formData, recommendedParts: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="例: ファン（2026年3月）、バッテリ（2027年3月）"
                />
              </div>
            </div>
          </div>

          {/* 8. 所見・異常・コメント */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">8. 所見・異常・コメント</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  異常箇所
                </label>
                <textarea
                  value={formData.abnormalities}
                  onChange={(e) => setFormData({ ...formData, abnormalities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="異常がある場合は詳細を記入"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  補足コメント
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="修理予定・観察項目など"
                />
              </div>
            </div>
          </div>

          {/* 9. 写真添付・ファイルアップロード */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">9. 写真添付・ファイルアップロード</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ファイルを選択（写真、波形画像、CSV、Excel）
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
                      accept="image/*,.csv,.xlsx,.xls"
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

          </form>
        </div>
        
        {/* フッター */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel出力
            </button>
            <button
              type="button"
              onClick={handleExportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              PDF出力
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              form="ups-inspection-form"
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