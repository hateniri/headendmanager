'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react'

interface UndergroundTankInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
}

interface PressureTestData {
  id: string
  time: string // 分
  pressure: string // kPa
}

export default function UndergroundTankInspectionForm({ isOpen, onClose, facilityId }: UndergroundTankInspectionFormProps) {
  const [formData, setFormData] = useState({
    // 1. 基本情報
    facilityName: '',
    location: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionType: '年次点検',
    inspector: '',
    permitNumber: '',
    installationDate: '',
    
    // 2. 地下タンク仕様
    hazardClass: '第四類',
    productName: '軽油',
    capacity: '',
    structureType: 'SF二重殻タンク',
    inspectionNumber: '',
    
    // 3. 点検項目チェックリスト
    // a. 地上設備点検
    groundEquipment: {
      upperSlab: '○',
      upperSlabComment: '',
      manholeInterior: '○',
      manholeComment: '',
      signage: '○',
      signageComment: '',
    },
    
    // b. 通気管・配管・注入口
    pipingEquipment: {
      ventPipe: '○',
      ventPipeComment: '',
      fillingPort: '○',
      fillingPortComment: '',
      groundingResistance: '',
      groundingComment: '',
    },
    
    // c. タンク本体・漏洩検知装置
    tankBody: {
      leakDetection: '○',
      leakDetectionComment: '',
      liquidGauge: '○',
      liquidGaugeComment: '',
      detectionLayerTest: '○',
      detectionLayerComment: '',
    },
    
    // d. ポンプ設備・バルブ・電気設備
    pumpEquipment: {
      pump: '○',
      pumpComment: '',
      earthing: '',
      earthingComment: '',
      valve: '○',
      valveComment: '',
      wiring: '○',
      wiringComment: '',
    },
    
    // 4. 試験記録
    pressureTestData: [] as PressureTestData[],
    
    // 6. コメント・是正事項
    abnormalities: '',
    correctiveActions: '',
    cautionaryItems: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const inspectionTypeOptions = ['年次点検', '定期点検', '緊急点検']
  const productNameOptions = ['軽油', 'A重油', 'ガソリン', 'その他']
  const structureTypeOptions = ['SF二重殻タンク', 'FRP', 'SS二重殻タンク', 'その他']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('地下タンク点検データ:', formData)
    console.log('アップロードファイル:', uploadedFiles)
    alert('地下タンク点検報告を登録しました')
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

  const addPressureTestData = () => {
    const newData: PressureTestData = {
      id: Date.now().toString(),
      time: '',
      pressure: '',
    }
    setFormData({
      ...formData,
      pressureTestData: [...formData.pressureTestData, newData],
    })
  }

  const updatePressureTestData = (id: string, field: keyof PressureTestData, value: string) => {
    setFormData({
      ...formData,
      pressureTestData: formData.pressureTestData.map(d =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    })
  }

  const removePressureTestData = (id: string) => {
    setFormData({
      ...formData,
      pressureTestData: formData.pressureTestData.filter(d => d.id !== id),
    })
  }

  // 接地抵抗の自動判定
  const getGroundingStatus = (resistance: string) => {
    const value = parseFloat(resistance)
    if (!value || isNaN(value)) return ''
    return value <= 1 ? '○（適正）' : '×（要改善）'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">地下タンク点検報告書</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 1. 基本情報セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">1. 基本情報セクション</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  拠点名（HE/SHE） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.facilityName}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 茨木HE"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  所在地
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  点検区分 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {inspectionTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  点検実施者 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="会社名・担当者名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  許可番号
                </label>
                <input
                  type="text"
                  value={formData.permitNumber}
                  onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  設置年月日
                </label>
                <input
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 2. 地下タンク仕様セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">2. 地下タンク仕様セクション</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  危険物の類別
                </label>
                <input
                  type="text"
                  value={formData.hazardClass}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品名（品目） <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {productNameOptions.map((product) => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  容量（L） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  構造種別 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.structureType}
                  onChange={(e) => setFormData({ ...formData, structureType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {structureTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  検査番号／型式
                </label>
                <input
                  type="text"
                  value={formData.inspectionNumber}
                  onChange={(e) => setFormData({ ...formData, inspectionNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. 点検項目チェックリスト */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">3. 点検項目チェックリスト</h3>
            
            {/* a. 地上設備点検 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">a. 地上設備点検</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検内容</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">上部スラブ</td>
                      <td className="px-4 py-3 text-sm text-gray-600">ひび割れ・沈下・劣化</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="upperSlab"
                                value={value}
                                checked={formData.groundEquipment.upperSlab === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  groundEquipment: { ...formData.groundEquipment, upperSlab: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.groundEquipment.upperSlabComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            groundEquipment: { ...formData.groundEquipment, upperSlabComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">マンホール内部</td>
                      <td className="px-4 py-3 text-sm text-gray-600">滞水／腐食／損傷</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="manholeInterior"
                                value={value}
                                checked={formData.groundEquipment.manholeInterior === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  groundEquipment: { ...formData.groundEquipment, manholeInterior: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.groundEquipment.manholeComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            groundEquipment: { ...formData.groundEquipment, manholeComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">標識・掲示板</td>
                      <td className="px-4 py-3 text-sm text-gray-600">表示の明瞭さ、破損有無</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="signage"
                                value={value}
                                checked={formData.groundEquipment.signage === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  groundEquipment: { ...formData.groundEquipment, signage: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.groundEquipment.signageComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            groundEquipment: { ...formData.groundEquipment, signageComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* b. 通気管・配管・注入口 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">b. 通気管・配管・注入口</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検内容</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">通気管</td>
                      <td className="px-4 py-3 text-sm text-gray-600">固定・腐食・引火防止網確認</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="ventPipe"
                                value={value}
                                checked={formData.pipingEquipment.ventPipe === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pipingEquipment: { ...formData.pipingEquipment, ventPipe: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pipingEquipment.ventPipeComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pipingEquipment: { ...formData.pipingEquipment, ventPipeComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">注入口・計量口</td>
                      <td className="px-4 py-3 text-sm text-gray-600">蓋の閉鎖・破損・接地</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="fillingPort"
                                value={value}
                                checked={formData.pipingEquipment.fillingPort === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pipingEquipment: { ...formData.pipingEquipment, fillingPort: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pipingEquipment.fillingPortComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pipingEquipment: { ...formData.pipingEquipment, fillingPortComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">接地抵抗</td>
                      <td className="px-4 py-3 text-sm text-gray-600">数値入力（Ω）</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="number"
                            value={formData.pipingEquipment.groundingResistance}
                            onChange={(e) => setFormData({
                              ...formData,
                              pipingEquipment: { ...formData.pipingEquipment, groundingResistance: e.target.value }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            step="0.01"
                            placeholder="0.48"
                          />
                          <span className="text-sm">Ω</span>
                          {formData.pipingEquipment.groundingResistance && (
                            <span className={`text-xs font-medium ${
                              parseFloat(formData.pipingEquipment.groundingResistance) <= 1 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {getGroundingStatus(formData.pipingEquipment.groundingResistance)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pipingEquipment.groundingComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pipingEquipment: { ...formData.pipingEquipment, groundingComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* c. タンク本体・漏洩検知装置 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">c. タンク本体・漏洩検知装置</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検内容</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">漏洩検知装置</td>
                      <td className="px-4 py-3 text-sm text-gray-600">作動・警報確認・損傷</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="leakDetection"
                                value={value}
                                checked={formData.tankBody.leakDetection === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  tankBody: { ...formData.tankBody, leakDetection: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.tankBody.leakDetectionComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            tankBody: { ...formData.tankBody, leakDetectionComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">液量計・表示器</td>
                      <td className="px-4 py-3 text-sm text-gray-600">指示値、作動確認</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="liquidGauge"
                                value={value}
                                checked={formData.tankBody.liquidGauge === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  tankBody: { ...formData.tankBody, liquidGauge: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.tankBody.liquidGaugeComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            tankBody: { ...formData.tankBody, liquidGaugeComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">検知層圧力試験</td>
                      <td className="px-4 py-3 text-sm text-gray-600">気相／液相</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="detectionLayerTest"
                                value={value}
                                checked={formData.tankBody.detectionLayerTest === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  tankBody: { ...formData.tankBody, detectionLayerTest: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.tankBody.detectionLayerComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            tankBody: { ...formData.tankBody, detectionLayerComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* d. ポンプ設備・バルブ・電気設備 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">d. ポンプ設備・バルブ・電気設備</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">項目</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">ポンプ</td>
                      <td className="px-4 py-3 text-sm text-gray-600">漏油・振動・腐食</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="pump"
                                value={value}
                                checked={formData.pumpEquipment.pump === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pumpEquipment: { ...formData.pumpEquipment, pump: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pumpEquipment.pumpComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pumpEquipment: { ...formData.pumpEquipment, pumpComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">アース</td>
                      <td className="px-4 py-3 text-sm text-gray-600">接地抵抗（Ω）</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="number"
                            value={formData.pumpEquipment.earthing}
                            onChange={(e) => setFormData({
                              ...formData,
                              pumpEquipment: { ...formData.pumpEquipment, earthing: e.target.value }
                            })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            step="0.1"
                            placeholder="2.4"
                          />
                          <span className="text-sm">Ω</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pumpEquipment.earthingComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pumpEquipment: { ...formData.pumpEquipment, earthingComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">バルブ</td>
                      <td className="px-4 py-3 text-sm text-gray-600">操作可否、漏れ有無</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="valve"
                                value={value}
                                checked={formData.pumpEquipment.valve === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pumpEquipment: { ...formData.pumpEquipment, valve: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pumpEquipment.valveComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pumpEquipment: { ...formData.pumpEquipment, valveComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">配線・機器</td>
                      <td className="px-4 py-3 text-sm text-gray-600">損傷・異常の有無</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          {['○', '×', '－'].map((value) => (
                            <label key={value} className="inline-flex items-center">
                              <input
                                type="radio"
                                name="wiring"
                                value={value}
                                checked={formData.pumpEquipment.wiring === value}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pumpEquipment: { ...formData.pumpEquipment, wiring: e.target.value }
                                })}
                                className="mr-1"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.pumpEquipment.wiringComment}
                          onChange={(e) => setFormData({
                            ...formData,
                            pumpEquipment: { ...formData.pumpEquipment, wiringComment: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. 試験記録セクション */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">4. 試験記録セクション</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  気密／減圧／吸引加圧試験の時間・圧力データを記録してください
                </p>
                <button
                  type="button"
                  onClick={addPressureTestData}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  データ追加
                </button>
              </div>
              
              {formData.pressureTestData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間（分）</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">圧力（kPa）</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.pressureTestData.map((data) => (
                        <tr key={data.id}>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={data.time}
                              onChange={(e) => updatePressureTestData(data.id, 'time', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              placeholder="0"
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={data.pressure}
                              onChange={(e) => updatePressureTestData(data.id, 'pressure', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              step="0.1"
                              placeholder="-19.8"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removePressureTestData(data.id)}
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
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">試験データがありません。「データ追加」をクリックして追加してください。</p>
                </div>
              )}
            </div>
          </div>

          {/* 5. 写真・添付ファイルアップロード */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">5. 写真・添付ファイルアップロード</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ファイルを選択（上部・マンホール・配管・ラベル写真、接地抵抗計測定画面等）
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
                      accept="image/*,.pdf,.csv,.xlsx,.xls"
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

          {/* 6. コメント・是正事項 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">6. コメント・是正事項</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  異常・所見
                </label>
                <textarea
                  value={formData.abnormalities}
                  onChange={(e) => setFormData({ ...formData, abnormalities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  是正処置
                </label>
                <textarea
                  value={formData.correctiveActions}
                  onChange={(e) => setFormData({ ...formData, correctiveActions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="実施日・内容・次回対応計画など"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  注意喚起事項
                </label>
                <textarea
                  value={formData.cautionaryItems}
                  onChange={(e) => setFormData({ ...formData, cautionaryItems: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
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