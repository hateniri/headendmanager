'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

interface UPSInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

export default function UPSInspectionForm({ isOpen, onClose, facilityId, facilityName }: UPSInspectionFormProps) {
  const [formData, setFormData] = useState({
    // 1. 点検基本情報
    inspectionDate: new Date().toISOString().split('T')[0],
    workCompany: '',
    workerName: '',
    witnessName: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('UPS点検データ:', formData)
    console.log('アップロードファイル:', uploadedFiles)
    alert('UPS点検報告を登録しました')
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">UPS点検報告書</h2>
            <p className="text-sm text-gray-600 mt-1">施設: {facilityName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 1. 点検基本情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">1. 点検基本情報</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検実施日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作業会社名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.workCompany}
                    onChange={(e) => setFormData({ ...formData, workCompany: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 株式会社〇〇メンテナンス"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    担当者名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.workerName}
                    onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 山田太郎"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    立会者名
                  </label>
                  <input
                    type="text"
                    value={formData.witnessName}
                    onChange={(e) => setFormData({ ...formData, witnessName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 佐藤花子"
                  />
                </div>
              </div>
            </div>
            
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
          </div>

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

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-6 border-t">
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
        </form>
      </div>
    </div>
  )
}