'use client'

import { useState } from 'react'
import { X, Upload, Trash2, AlertCircle } from 'lucide-react'

interface FireDetectionInspectionFormProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
  facilityName: string
}

export default function FireDetectionInspectionForm({ isOpen, onClose, facilityId, facilityName }: FireDetectionInspectionFormProps) {
  const [formData, setFormData] = useState({
    // 1. 基本情報
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionCompany: '',
    inspector: '',
    witnessName: '',
    inspectionType: '年次',
    equipmentInfo: '',
    
    // 2. 警報盤 点検項目
    alarmPanel: {
      // 一般確認
      appearance: '○',
      appearanceComment: '',
      powerVoltage: '',
      powerVoltageComment: '',
      
      // 試験機能
      fireAlarmTest: '○',
      fireAlarmTestComment: '',
      abnormalAlarmTest: '○',
      abnormalAlarmTestComment: '',
      backupPowerTest: '○',
      backupPowerTestComment: '',
      
      // 音響機能
      alarmSoundLight: '○',
      alarmSoundLightComment: '',
      
      // 移報機能
      signalTransfer: '○',
      signalTransferComment: '',
      
      // その他機能
      switchCautionLight: '○',
      switchCautionLightComment: '',
      phoneFunction: '○',
      phoneFunctionComment: '',
      
      // 付帯設備
      auxiliaryEquipment: '○',
      auxiliaryEquipmentComment: '',
    },
    
    // 3. センサ点検（サンプリング式）
    samplingSensor: {
      // 一般
      appearance: '○',
      appearanceComment: '',
      piping: '○',
      pipingComment: '',
      voltage: '',
      voltageComment: '',
      
      // 設定確認
      alarmSetting: '',
      alarmAccumulationTime: '',
      
      // 警報機能
      fireTest: '○',
      fireTestComment: '',
      
      // 自己診断
      abnormalTest: '○',
      abnormalTestComment: '',
      airflowAbnormalTest: '○',
      airflowAbnormalTestComment: '',
      
      // 吸引機能
      transportTime: '',
      pressure: '',
      
      // 特殊環境
      specialEnvironment: '',
    },
    
    // 4. ポータブルセンサ点検
    portableSensor: {
      appearance: '○',
      powerOnLED: '○',
      batteryLevel: '○',
      testGasResponse: '○',
      batteryModel: '',
      batteryHistory: '',
      acAdapterModel: '',
    },
    
    // 5. 消耗品／更新情報
    consumables: {
      sensorFanFilter: {
        lastReplacement: '',
        nextReplacement: '',
        comment: '',
      },
      alarmPanelBattery: {
        lastReplacement: '',
        nextReplacement: '',
        comment: '',
      },
      portableSensorBattery: {
        lastReplacement: '',
        nextReplacement: '',
        comment: '',
      },
    },
    
    // 6. 点検所見・異常
    abnormalities: '',
    comments: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('火災予兆検知システム点検データ:', formData)
    console.log('アップロードファイル:', uploadedFiles)
    alert('火災予兆検知システム点検報告を登録しました')
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">火災予兆検知システム点検報告書</h2>
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
                    点検会社 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.inspectionCompany}
                    onChange={(e) => setFormData({ ...formData, inspectionCompany: e.target.value })}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="年次">年次</option>
                  <option value="月次">月次</option>
                  <option value="臨時">臨時</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  使用機器情報
                </label>
                <input
                  type="text"
                  value={formData.equipmentInfo}
                  onChange={(e) => setFormData({ ...formData, equipmentInfo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="型式、製造番号など"
                />
              </div>
            </div>
          </div>

          {/* 2. 警報盤 点検項目（監視盤） */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">2. 警報盤 点検項目（監視盤）</h3>
            
            {/* 一般確認 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">一般確認</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      外観・構造
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      {['○', '×', '－'].map((value) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="alarmPanelAppearance"
                            value={value}
                            checked={formData.alarmPanel.appearance === value}
                            onChange={(e) => setFormData({
                              ...formData,
                              alarmPanel: { ...formData.alarmPanel, appearance: e.target.value }
                            })}
                            className="mr-1"
                          />
                          <span className="text-sm">{value}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.alarmPanel.appearanceComment}
                      onChange={(e) => setFormData({
                        ...formData,
                        alarmPanel: { ...formData.alarmPanel, appearanceComment: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="コメント"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電源電圧（AC100V）
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="number"
                        value={formData.alarmPanel.powerVoltage}
                        onChange={(e) => setFormData({
                          ...formData,
                          alarmPanel: { ...formData.alarmPanel, powerVoltage: e.target.value }
                        })}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        step="0.1"
                        placeholder="100.7"
                      />
                      <span className="text-sm">V</span>
                    </div>
                    <input
                      type="text"
                      value={formData.alarmPanel.powerVoltageComment}
                      onChange={(e) => setFormData({
                        ...formData,
                        alarmPanel: { ...formData.alarmPanel, powerVoltageComment: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="コメント"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 試験機能 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">試験機能</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'fireAlarmTest', label: '火災警報試験' },
                  { key: 'abnormalAlarmTest', label: '異常警報試験' },
                  { key: 'backupPowerTest', label: '予備電源試験' },
                ].map((test) => (
                  <div key={test.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {test.label}
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      {['○', '×', '－'].map((value) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name={test.key}
                            value={value}
                            checked={formData.alarmPanel[test.key as keyof typeof formData.alarmPanel] === value}
                            onChange={(e) => setFormData({
                              ...formData,
                              alarmPanel: { ...formData.alarmPanel, [test.key]: e.target.value }
                            })}
                            className="mr-1"
                          />
                          <span className="text-sm">{value}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.alarmPanel[`${test.key}Comment` as keyof typeof formData.alarmPanel] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        alarmPanel: { ...formData.alarmPanel, [`${test.key}Comment`]: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="コメント"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* その他の機能 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">その他の機能</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'alarmSoundLight', label: '音響機能（アラーム灯・異常灯）' },
                  { key: 'signalTransfer', label: '移報機能' },
                  { key: 'switchCautionLight', label: 'スイッチ注意灯機能' },
                  { key: 'phoneFunction', label: '電話機能' },
                  { key: 'auxiliaryEquipment', label: '付帯設備' },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {item.label}
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      {['○', '×', '－'].map((value) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name={item.key}
                            value={value}
                            checked={formData.alarmPanel[item.key as keyof typeof formData.alarmPanel] === value}
                            onChange={(e) => setFormData({
                              ...formData,
                              alarmPanel: { ...formData.alarmPanel, [item.key]: e.target.value }
                            })}
                            className="mr-1"
                          />
                          <span className="text-sm">{value}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.alarmPanel[`${item.key}Comment` as keyof typeof formData.alarmPanel] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        alarmPanel: { ...formData.alarmPanel, [`${item.key}Comment`]: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="コメント"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. センサ点検（サンプリング式） */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">3. センサ点検（サンプリング式）</h3>
            
            {/* 一般 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">一般</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    外観
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    {['○', '×', '－'].map((value) => (
                      <label key={value} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sensorAppearance"
                          value={value}
                          checked={formData.samplingSensor.appearance === value}
                          onChange={(e) => setFormData({
                            ...formData,
                            samplingSensor: { ...formData.samplingSensor, appearance: e.target.value }
                          })}
                          className="mr-1"
                        />
                        <span className="text-sm">{value}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.samplingSensor.appearanceComment}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, appearanceComment: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="コメント"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    配管
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    {['○', '×', '－'].map((value) => (
                      <label key={value} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="sensorPiping"
                          value={value}
                          checked={formData.samplingSensor.piping === value}
                          onChange={(e) => setFormData({
                            ...formData,
                            samplingSensor: { ...formData.samplingSensor, piping: e.target.value }
                          })}
                          className="mr-1"
                        />
                        <span className="text-sm">{value}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.samplingSensor.pipingComment}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, pipingComment: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="コメント"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電圧（DC24V）
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="number"
                      value={formData.samplingSensor.voltage}
                      onChange={(e) => setFormData({
                        ...formData,
                        samplingSensor: { ...formData.samplingSensor, voltage: e.target.value }
                      })}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                      step="0.1"
                      placeholder="24.1"
                    />
                    <span className="text-sm">V</span>
                  </div>
                  <input
                    type="text"
                    value={formData.samplingSensor.voltageComment}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, voltageComment: e.target.value }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="コメント"
                  />
                </div>
              </div>
            </div>

            {/* 設定確認 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">設定確認</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    アラーム設定値（%/m）
                  </label>
                  <input
                    type="text"
                    value={formData.samplingSensor.alarmSetting}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, alarmSetting: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 0.05"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    警報蓄積時間（秒）
                  </label>
                  <input
                    type="number"
                    value={formData.samplingSensor.alarmAccumulationTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, alarmAccumulationTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 20"
                  />
                </div>
              </div>
            </div>

            {/* 機能試験 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">機能試験</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'fireTest', label: '火災試験' },
                  { key: 'abnormalTest', label: '異常試験' },
                  { key: 'airflowAbnormalTest', label: '気流異常試験' },
                ].map((test) => (
                  <div key={test.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {test.label}
                    </label>
                    <div className="flex items-center space-x-4 mb-2">
                      {['○', '×', '－'].map((value) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`sensor${test.key}`}
                            value={value}
                            checked={formData.samplingSensor[test.key as keyof typeof formData.samplingSensor] === value}
                            onChange={(e) => setFormData({
                              ...formData,
                              samplingSensor: { ...formData.samplingSensor, [test.key]: e.target.value }
                            })}
                            className="mr-1"
                          />
                          <span className="text-sm">{value}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.samplingSensor[`${test.key}Comment` as keyof typeof formData.samplingSensor] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        samplingSensor: { ...formData.samplingSensor, [`${test.key}Comment`]: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="コメント"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 吸引機能 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">吸引機能</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    管内輸送時間（秒）
                  </label>
                  <input
                    type="number"
                    value={formData.samplingSensor.transportTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, transportTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    圧力測定（kPa）
                  </label>
                  <input
                    type="number"
                    value={formData.samplingSensor.pressure}
                    onChange={(e) => setFormData({
                      ...formData,
                      samplingSensor: { ...formData.samplingSensor, pressure: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    placeholder="例: -0.36"
                  />
                </div>
              </div>
            </div>

            {/* 特殊環境 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                特殊環境（負圧）Ps≧Pr の確認（任意）
              </label>
              <input
                type="text"
                value={formData.samplingSensor.specialEnvironment}
                onChange={(e) => setFormData({
                  ...formData,
                  samplingSensor: { ...formData.samplingSensor, specialEnvironment: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="清浄室などの場合に入力"
              />
            </div>
          </div>

          {/* 4. ポータブルセンサ点検 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">4. ポータブルセンサ点検（PDNJ001A-H）</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'appearance', label: '外観確認' },
                { key: 'powerOnLED', label: '電源投入／動作表示灯' },
                { key: 'batteryLevel', label: 'バッテリー残量確認' },
                { key: 'testGasResponse', label: '試験ガス応答' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.label}
                  </label>
                  <div className="flex items-center space-x-4">
                    {['○', '×'].map((value) => (
                      <label key={value} className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`portable${item.key}`}
                          value={value}
                          checked={formData.portableSensor[item.key as keyof typeof formData.portableSensor] === value}
                          onChange={(e) => setFormData({
                            ...formData,
                            portableSensor: { ...formData.portableSensor, [item.key]: e.target.value }
                          })}
                          className="mr-1"
                        />
                        <span className="text-sm">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  バッテリー型式
                </label>
                <input
                  type="text"
                  value={formData.portableSensor.batteryModel}
                  onChange={(e) => setFormData({
                    ...formData,
                    portableSensor: { ...formData.portableSensor, batteryModel: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: BY051000602"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  バッテリー交換履歴
                </label>
                <input
                  type="text"
                  value={formData.portableSensor.batteryHistory}
                  onChange={(e) => setFormData({
                    ...formData,
                    portableSensor: { ...formData.portableSensor, batteryHistory: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 2022年2月納入"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ACアダプタ型式
                </label>
                <input
                  type="text"
                  value={formData.portableSensor.acAdapterModel}
                  onChange={(e) => setFormData({
                    ...formData,
                    portableSensor: { ...formData.portableSensor, acAdapterModel: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: XSG1203000"
                />
              </div>
            </div>
          </div>

          {/* 5. 消耗品／更新情報 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">5. 消耗品／更新情報</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">機器</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部品名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推奨交換年</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実施履歴</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">センサ</td>
                    <td className="px-4 py-3 text-sm text-gray-600">ファン、フィルタ</td>
                    <td className="px-4 py-3 text-sm text-gray-600">5年</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.sensorFanFilter.lastReplacement}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            sensorFanFilter: { ...formData.consumables.sensorFanFilter, lastReplacement: e.target.value }
                          }
                        })}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="例: 2024年10月"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.sensorFanFilter.comment}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            sensorFanFilter: { ...formData.consumables.sensorFanFilter, comment: e.target.value }
                          }
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">警報盤</td>
                    <td className="px-4 py-3 text-sm text-gray-600">バッテリー、電源装置</td>
                    <td className="px-4 py-3 text-sm text-gray-600">5年</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.alarmPanelBattery.lastReplacement}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            alarmPanelBattery: { ...formData.consumables.alarmPanelBattery, lastReplacement: e.target.value }
                          }
                        })}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.alarmPanelBattery.comment}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            alarmPanelBattery: { ...formData.consumables.alarmPanelBattery, comment: e.target.value }
                          }
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">ポータブルセンサ</td>
                    <td className="px-4 py-3 text-sm text-gray-600">バッテリー</td>
                    <td className="px-4 py-3 text-sm text-gray-600">5年</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.portableSensorBattery.lastReplacement}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            portableSensorBattery: { ...formData.consumables.portableSensorBattery, lastReplacement: e.target.value }
                          }
                        })}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.consumables.portableSensorBattery.comment}
                        onChange={(e) => setFormData({
                          ...formData,
                          consumables: {
                            ...formData.consumables,
                            portableSensorBattery: { ...formData.consumables.portableSensorBattery, comment: e.target.value }
                          }
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. 点検所見・異常・添付資料 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">6. 点検所見・異常・添付資料</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  異常箇所の記録
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
                  所見・コメント
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  写真添付（測定機器、部品交換前後、警報盤状態など）
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