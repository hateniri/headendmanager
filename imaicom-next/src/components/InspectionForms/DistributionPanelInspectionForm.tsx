'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react'

interface DistributionPanelInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
}

interface CircuitMeasurement {
  id: string
  circuitName: string
  phase: 'R' | 'S' | 'T'
  afSetting: string
  measurementDate: string
  status: 'ON' | 'OFF'
  currentValue: string
  measurer: string
}

export default function DistributionPanelInspectionForm({ isOpen, onClose, facilityId }: DistributionPanelInspectionFormProps) {
  const [formData, setFormData] = useState({
    // A. 基本情報
    facilityName: '',
    panelName: '',
    panelTypes: [] as string[],
    inspectionDate: new Date().toISOString().split('T')[0],
    measurers: '',
    upperSystem: '',
    
    // B. 作業手順チェック
    preworkChecks: {
      existingCircuitCheck: false,
      cablePinchCheck: false,
      exposedPartCheck: false,
    },
    measurementChecks: {
      rangeConfirmation: false,
      noExcessiveForce: false,
    },
    postworkChecks: {
      noForgottenTools: false,
      doorClosureRecheck: false,
      statusReconfirmation: false,
    },
    
    // C. 主幹／分岐測定記録
    circuitMeasurements: [] as CircuitMeasurement[],
    
    // D. コメント・異常報告
    abnormalities: '',
    recommendedParts: [] as string[],
    replacementTiming: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const panelTypeOptions = ['UPS', 'AC', 'DC', '空調', '通信', 'その他']
  const recommendedPartOptions = ['ブレーカー', 'ヒューズ', '端子', 'ケーブル', 'その他']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('分電盤点検データ:', formData)
    console.log('アップロードファイル:', uploadedFiles)
    alert('分電盤点検報告を登録しました')
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

  const addCircuitMeasurement = () => {
    const newMeasurement: CircuitMeasurement = {
      id: Date.now().toString(),
      circuitName: '',
      phase: 'R',
      afSetting: '',
      measurementDate: formData.inspectionDate,
      status: 'ON',
      currentValue: '',
      measurer: '',
    }
    setFormData({
      ...formData,
      circuitMeasurements: [...formData.circuitMeasurements, newMeasurement],
    })
  }

  const updateCircuitMeasurement = (id: string, field: keyof CircuitMeasurement, value: string) => {
    setFormData({
      ...formData,
      circuitMeasurements: formData.circuitMeasurements.map(m =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    })
  }

  const removeCircuitMeasurement = (id: string) => {
    setFormData({
      ...formData,
      circuitMeasurements: formData.circuitMeasurements.filter(m => m.id !== id),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">分電盤点検報告書</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* A. 基本情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">A. 基本情報</h3>
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
                  placeholder="例: 宗像HE"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分電盤名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.panelName}
                  onChange={(e) => setFormData({ ...formData, panelName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: AC分電盤A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  盤種別タグ（複数選択可）
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {panelTypeOptions.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        value={type}
                        checked={formData.panelTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, panelTypes: [...formData.panelTypes, type] })
                          } else {
                            setFormData({ ...formData, panelTypes: formData.panelTypes.filter(t => t !== type) })
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  点検日 <span className="text-red-500">*</span>
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
                  測定者 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.measurers}
                  onChange={(e) => setFormData({ ...formData, measurers: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 栗山、中島"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上位系統／主幹名
                </label>
                <input
                  type="text"
                  value={formData.upperSystem}
                  onChange={(e) => setFormData({ ...formData, upperSystem: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* B. 作業手順チェックリスト */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">B. 作業手順チェックリスト</h3>
            
            <div className="space-y-4">
              {/* 作業前 */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">作業前</h4>
                <div className="space-y-2 pl-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preworkChecks.existingCircuitCheck}
                      onChange={(e) => setFormData({
                        ...formData,
                        preworkChecks: { ...formData.preworkChecks, existingCircuitCheck: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">既設回路の状態確認</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preworkChecks.cablePinchCheck}
                      onChange={(e) => setFormData({
                        ...formData,
                        preworkChecks: { ...formData.preworkChecks, cablePinchCheck: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">ケーブル挟み込み注意</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preworkChecks.exposedPartCheck}
                      onChange={(e) => setFormData({
                        ...formData,
                        preworkChecks: { ...formData.preworkChecks, exposedPartCheck: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">露出部有無確認</span>
                  </label>
                </div>
              </div>

              {/* 測定時 */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">測定時</h4>
                <div className="space-y-2 pl-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.measurementChecks.rangeConfirmation}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurementChecks: { ...formData.measurementChecks, rangeConfirmation: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">レンジ確認</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.measurementChecks.noExcessiveForce}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurementChecks: { ...formData.measurementChecks, noExcessiveForce: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">無理な力をかけない</span>
                  </label>
                </div>
              </div>

              {/* 作業後 */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">作業後</h4>
                <div className="space-y-2 pl-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.postworkChecks.noForgottenTools}
                      onChange={(e) => setFormData({
                        ...formData,
                        postworkChecks: { ...formData.postworkChecks, noForgottenTools: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">測定器の忘れ物なし</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.postworkChecks.doorClosureRecheck}
                      onChange={(e) => setFormData({
                        ...formData,
                        postworkChecks: { ...formData.postworkChecks, doorClosureRecheck: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">扉閉め時再確認</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.postworkChecks.statusReconfirmation}
                      onChange={(e) => setFormData({
                        ...formData,
                        postworkChecks: { ...formData.postworkChecks, statusReconfirmation: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm">状態再確認</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* C. 主幹／分岐回路の測定記録 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">C. 主幹／分岐回路の測定記録</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  回路ごとに履歴管理が可能です。過去の測定値も含めて記録してください。
                </p>
                <button
                  type="button"
                  onClick={addCircuitMeasurement}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  測定記録追加
                </button>
              </div>
              
              {formData.circuitMeasurements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">回路名</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">相</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AF設定</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">測定日</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OFF/ON</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電流値（A）</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">測定者</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.circuitMeasurements.map((measurement) => (
                        <tr key={measurement.id}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={measurement.circuitName}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'circuitName', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              placeholder="空調1"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={measurement.phase}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'phase', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="R">R</option>
                              <option value="S">S</option>
                              <option value="T">T</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={measurement.afSetting}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'afSetting', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              placeholder="30A"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={measurement.measurementDate}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'measurementDate', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={measurement.status}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'status', e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="ON">ON</option>
                              <option value="OFF">OFF</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={measurement.currentValue}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'currentValue', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              step="0.1"
                              placeholder="12.4"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={measurement.measurer}
                              onChange={(e) => updateCircuitMeasurement(measurement.id, 'measurer', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              placeholder="中島"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeCircuitMeasurement(measurement.id)}
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
                  <p className="text-gray-500">測定記録がありません。「測定記録追加」をクリックして追加してください。</p>
                </div>
              )}
            </div>
          </div>

          {/* D. コメント・異常・交換推奨 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">D. コメント・異常・交換推奨</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  異常・注意事項
                </label>
                <textarea
                  value={formData.abnormalities}
                  onChange={(e) => setFormData({ ...formData, abnormalities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="例: 端子部に緩み、B相が高い"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  交換推奨部品
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {recommendedPartOptions.map((part) => (
                    <label key={part} className="flex items-center">
                      <input
                        type="checkbox"
                        value={part}
                        checked={formData.recommendedParts.includes(part)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, recommendedParts: [...formData.recommendedParts, part] })
                          } else {
                            setFormData({ ...formData, recommendedParts: formData.recommendedParts.filter(p => p !== part) })
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
                  交換希望時期
                </label>
                <input
                  type="text"
                  value={formData.replacementTiming}
                  onChange={(e) => setFormData({ ...formData, replacementTiming: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 2025年3月、次回定期点検時"
                />
              </div>
            </div>
          </div>

          {/* E. 添付ファイル・画像アップロード */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">E. 添付ファイル・画像アップロード</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ファイルを選択（サーモグラフィ画像、回路ラベル写真、帳票PDF、CSVデータ等）
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