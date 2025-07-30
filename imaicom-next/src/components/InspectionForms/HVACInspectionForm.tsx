'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2, Wind } from 'lucide-react'

interface HVACInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

interface Equipment {
  id: string
  systemName: string
  location: string
  model: string
  serialNumber: string
  // 点検項目
  abnormalVibration: '○' | '△' | '×' | '◎'
  appearance: '○' | '△' | '×' | '◎'
  wearCorrosion: '○' | '△' | '×' | '◎'
  heatExchanger: '○' | '△' | '×' | '◎'
  oilLeak: '○' | '△' | '×' | '◎'
  refrigerantLeak: '○' | '△' | '×' | '◎'
  // 室内機/室外機詳細
  airFilterCleaning: '◎' | '○' | '×'
  drainPanCleaning: '◎' | '○' | '×'
  fanBeltCheck: '◎' | '○' | '×'
  screwFixation: '◎' | '○' | '×'
  operationSound: '○' | '△' | '×'
  oilLeakDetail: '○' | '△' | '×'
  humidifierCheck: string
}

interface InsulationMeasurement {
  id: string
  target: string
  value: string
  judgment: '○' | '×'
}

export default function HVACInspectionForm({ isOpen, onClose, facilityId, facilityName }: HVACInspectionFormProps) {
  const [formData, setFormData] = useState({
    // 1. 基本情報
    inspectionStartDate: new Date().toISOString().split('T')[0],
    inspectionEndDate: new Date().toISOString().split('T')[0],
    serviceStation: '',
    inspector: '',
    inspectionNumber: '',
    contractType: '年次',
    
    // 2. 点検結果・全体所見
    overallJudgment: '良好',
    inspectionContent: '',
    refrigerantLeakJudgment: '漏洩なし',
    proposals: '',
    
    // 3. 点検機器一覧
    equipments: [] as Equipment[],
    
    // 5. 絶縁抵抗測定結果
    insulationMeasurements: [] as InsulationMeasurement[],
    
    // 6. 運転データ
    operationData: {
      voltageRS: '',
      voltageST: '',
      voltageTR: '',
      compressorCurrent: '',
      dischargeTemp: '',
      suctionTemp: '',
      highPressure: '',
      lowPressure: '',
      blowTemp: '',
      returnTemp: '',
      tempDifference: '',
    },
    
    // 7. コメント・写真
    comments: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const contractTypeOptions = ['年次', '中間', '冷房前', '暖房前', '臨時']
  const judgmentOptions = ['○', '△', '×', '◎'] as const
  const cleaningOptions = ['◎', '○', '×'] as const

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('空調・冷凍機器点検データ:', formData)
    console.log('アップロードファイル:', uploadedFiles)
    alert('空調・冷凍機器点検報告を登録しました')
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

  const addEquipment = () => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      systemName: '',
      location: '',
      model: '',
      serialNumber: '',
      abnormalVibration: '○',
      appearance: '○',
      wearCorrosion: '○',
      heatExchanger: '○',
      oilLeak: '○',
      refrigerantLeak: '○',
      airFilterCleaning: '○',
      drainPanCleaning: '○',
      fanBeltCheck: '○',
      screwFixation: '○',
      operationSound: '○',
      oilLeakDetail: '○',
      humidifierCheck: '',
    }
    setFormData({
      ...formData,
      equipments: [...formData.equipments, newEquipment],
    })
  }

  const updateEquipment = (id: string, field: keyof Equipment, value: string) => {
    setFormData({
      ...formData,
      equipments: formData.equipments.map(eq =>
        eq.id === id ? { ...eq, [field]: value } : eq
      ),
    })
  }

  const removeEquipment = (id: string) => {
    setFormData({
      ...formData,
      equipments: formData.equipments.filter(eq => eq.id !== id),
    })
  }

  const addInsulationMeasurement = () => {
    const newMeasurement: InsulationMeasurement = {
      id: Date.now().toString(),
      target: '',
      value: '',
      judgment: '○',
    }
    setFormData({
      ...formData,
      insulationMeasurements: [...formData.insulationMeasurements, newMeasurement],
    })
  }

  const updateInsulationMeasurement = (id: string, field: keyof InsulationMeasurement, value: string) => {
    setFormData({
      ...formData,
      insulationMeasurements: formData.insulationMeasurements.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    })
  }

  const removeInsulationMeasurement = (id: string) => {
    setFormData({
      ...formData,
      insulationMeasurements: formData.insulationMeasurements.filter(m => m.id !== id),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">空調・冷凍機器保守点検報告書</h2>
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
          {/* 1. 基本情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">1. 基本情報</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    点検期間 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formData.inspectionStartDate}
                      onChange={(e) => setFormData({ ...formData, inspectionStartDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-gray-600">〜</span>
                    <input
                      type="date"
                      value={formData.inspectionEndDate}
                      onChange={(e) => setFormData({ ...formData, inspectionEndDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    担当サービスステーション名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.serviceStation}
                    onChange={(e) => setFormData({ ...formData, serviceStation: e.target.value })}
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
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 山田太郎"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  点検番号
                </label>
                <input
                  type="text"
                  value={formData.inspectionNumber}
                  onChange={(e) => setFormData({ ...formData, inspectionNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="自動採番または入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約種別／点検種別 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {contractTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. 点検結果・全体所見 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">2. 点検結果・全体所見</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  総合判定 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.overallJudgment}
                  onChange={(e) => setFormData({ ...formData, overallJudgment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="良好">良好</option>
                  <option value="要処置">要処置</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  冷媒漏洩判定 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.refrigerantLeakJudgment}
                  onChange={(e) => setFormData({ ...formData, refrigerantLeakJudgment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="漏洩なし">漏洩なし</option>
                  <option value="可能性あり">可能性あり</option>
                  <option value="漏洩あり">漏洩あり</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  点検実施内容
                </label>
                <textarea
                  value={formData.inspectionContent}
                  onChange={(e) => setFormData({ ...formData, inspectionContent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="実施した点検内容を記載"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  提案事項
                </label>
                <textarea
                  value={formData.proposals}
                  onChange={(e) => setFormData({ ...formData, proposals: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="交換推奨部品、改善提案など"
                />
              </div>
            </div>
          </div>

          {/* 3. 点検機器一覧 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex justify-between items-center">
              <span>3. 点検機器一覧</span>
              <button
                type="button"
                onClick={addEquipment}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                機器追加
              </button>
            </h3>
            
            {formData.equipments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Wind className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">点検機器が登録されていません</p>
                <p className="text-gray-500 text-sm mt-1">「機器追加」ボタンをクリックして機器を追加してください</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.equipments.map((equipment, index) => (
                  <div key={equipment.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">機器 {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeEquipment(equipment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* 基本情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          系統名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={equipment.systemName}
                          onChange={(e) => updateEquipment(equipment.id, 'systemName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例: GPAC-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          設置場所
                        </label>
                        <input
                          type="text"
                          value={equipment.location}
                          onChange={(e) => updateEquipment(equipment.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例: 2F機械室"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          機種
                        </label>
                        <input
                          type="text"
                          value={equipment.model}
                          onChange={(e) => updateEquipment(equipment.id, 'model', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          機番
                        </label>
                        <input
                          type="text"
                          value={equipment.serialNumber}
                          onChange={(e) => updateEquipment(equipment.id, 'serialNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* 点検項目 */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-3">点検項目</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { key: 'abnormalVibration', label: '異常振動、運転音' },
                          { key: 'appearance', label: '外観の損傷' },
                          { key: 'wearCorrosion', label: '摩耗・腐食・サビ' },
                          { key: 'heatExchanger', label: '熱交換器の状態' },
                          { key: 'oilLeak', label: '油のにじみ' },
                          { key: 'refrigerantLeak', label: '冷媒漏洩の有無' },
                        ].map((item) => (
                          <div key={item.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {item.label}
                            </label>
                            <select
                              value={equipment[item.key as keyof Equipment]}
                              onChange={(e) => updateEquipment(equipment.id, item.key as keyof Equipment, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {judgmentOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option} {option === '○' ? '(良好)' : option === '△' ? '(運転可)' : option === '×' ? '(不可)' : '(処置後良好)'}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 室内機/室外機詳細 */}
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">室内機／室外機詳細点検</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { key: 'airFilterCleaning', label: 'エアフィルター清掃' },
                          { key: 'drainPanCleaning', label: 'ドレンパン清掃' },
                          { key: 'fanBeltCheck', label: 'ファンベルト点検' },
                          { key: 'screwFixation', label: '外板ビス固定チェック' },
                          { key: 'operationSound', label: '運転音・異常振動' },
                          { key: 'oilLeakDetail', label: '油漏れ、腐食等' },
                        ].map((item) => (
                          <div key={item.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {item.label}
                            </label>
                            <select
                              value={equipment[item.key as keyof Equipment]}
                              onChange={(e) => updateEquipment(equipment.id, item.key as keyof Equipment, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {cleaningOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option} {option === '◎' ? '(優良)' : option === '○' ? '(良好)' : '(要改善)'}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            加湿器点検（備考）
                          </label>
                          <input
                            type="text"
                            value={equipment.humidifierCheck}
                            onChange={(e) => updateEquipment(equipment.id, 'humidifierCheck', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="フィルター、可溶栓、水槽の状態"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. 絶縁抵抗測定結果 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex justify-between items-center">
              <span>5. 絶縁抵抗測定結果（任意）</span>
              <button
                type="button"
                onClick={addInsulationMeasurement}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                測定追加
              </button>
            </h3>
            
            {formData.insulationMeasurements.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">測定対象</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">測定値（MΩ）</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.insulationMeasurements.map((measurement) => (
                      <tr key={measurement.id}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={measurement.target}
                            onChange={(e) => updateInsulationMeasurement(measurement.id, 'target', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="例: 圧縮機"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={measurement.value}
                            onChange={(e) => updateInsulationMeasurement(measurement.id, 'value', e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={measurement.judgment}
                            onChange={(e) => updateInsulationMeasurement(measurement.id, 'judgment', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="○">○</option>
                            <option value="×">×</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeInsulationMeasurement(measurement.id)}
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

          {/* 6. 運転データ */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">6. 運転データ（任意）</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主電源電圧 R-S（V）
                </label>
                <input
                  type="number"
                  value={formData.operationData.voltageRS}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, voltageRS: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主電源電圧 S-T（V）
                </label>
                <input
                  type="number"
                  value={formData.operationData.voltageST}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, voltageST: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主電源電圧 T-R（V）
                </label>
                <input
                  type="number"
                  value={formData.operationData.voltageTR}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, voltageTR: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  圧縮機電流（A）
                </label>
                <input
                  type="number"
                  value={formData.operationData.compressorCurrent}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, compressorCurrent: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  吐出管温度（℃）
                </label>
                <input
                  type="number"
                  value={formData.operationData.dischargeTemp}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, dischargeTemp: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  吸入管温度（℃）
                </label>
                <input
                  type="number"
                  value={formData.operationData.suctionTemp}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, suctionTemp: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  高圧圧力（MPa）
                </label>
                <input
                  type="number"
                  value={formData.operationData.highPressure}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, highPressure: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  低圧圧力（MPa）
                </label>
                <input
                  type="number"
                  value={formData.operationData.lowPressure}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, lowPressure: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  吹出温度（℃）
                </label>
                <input
                  type="number"
                  value={formData.operationData.blowTemp}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, blowTemp: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  吸込温度（℃）
                </label>
                <input
                  type="number"
                  value={formData.operationData.returnTemp}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, returnTemp: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  温度差（℃）
                </label>
                <input
                  type="number"
                  value={formData.operationData.tempDifference}
                  onChange={(e) => setFormData({
                    ...formData,
                    operationData: { ...formData.operationData, tempDifference: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* 7. コメント・写真アップロード */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">7. コメント・写真アップロード</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  担当者所見
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="点検時の所見、注意事項、特記事項など"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  写真添付（異常箇所など）
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