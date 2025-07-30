'use client'

import { Calendar, User, Building2, AlertTriangle, Users } from 'lucide-react'

export interface CommonInspectionData {
  inspectionStartDate: string
  inspectionEndDate: string
  inspectionCompany: string
  inspector: string
  witness?: string // 立会者（オプション）
  hasUrgentIssues: boolean // 緊急性の高い異常の有無
}

interface CommonInspectionHeaderProps {
  data: CommonInspectionData
  onChange: (data: CommonInspectionData) => void
  facilityName: string
}

export default function CommonInspectionHeader({ 
  data, 
  onChange,
  facilityName 
}: CommonInspectionHeaderProps) {
  const handleChange = (field: keyof CommonInspectionData, value: any) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <div className="bg-blue-50 p-6 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          施設情報
        </h3>
        <p className="text-gray-700 font-medium">{facilityName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 点検期間 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            点検期間 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">開始日</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={data.inspectionStartDate}
                  onChange={(e) => handleChange('inspectionStartDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">終了日</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={data.inspectionEndDate}
                  onChange={(e) => handleChange('inspectionEndDate', e.target.value)}
                  min={data.inspectionStartDate}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* 作業会社名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            作業会社名 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.inspectionCompany}
              onChange={(e) => handleChange('inspectionCompany', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例：株式会社〇〇電気"
              required
            />
          </div>
        </div>

        {/* 担当者名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            担当者名 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.inspector}
              onChange={(e) => handleChange('inspector', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例：山田太郎"
              required
            />
          </div>
        </div>

        {/* 立会者名（オプション） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            立会者名 <span className="text-gray-400 text-xs">（任意）</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={data.witness || ''}
              onChange={(e) => handleChange('witness', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例：施設管理者 佐藤"
            />
          </div>
        </div>

        {/* 緊急性の高い異常の有無 */}
        <div className="md:col-span-2">
          <div className={`p-4 rounded-lg border-2 transition-all ${
            data.hasUrgentIssues 
              ? 'bg-red-50 border-red-300' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.hasUrgentIssues}
                onChange={(e) => handleChange('hasUrgentIssues', e.target.checked)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div className="flex items-center">
                <AlertTriangle className={`h-5 w-5 mr-2 ${
                  data.hasUrgentIssues ? 'text-red-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  data.hasUrgentIssues ? 'text-red-700' : 'text-gray-700'
                }`}>
                  緊急性の高い異常あり
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  （管理者への即時報告が必要な場合にチェック）
                </span>
              </div>
            </label>
            {data.hasUrgentIssues && (
              <div className="mt-3 p-3 bg-red-100 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>注意：</strong>このチェックを入れると、報告書提出時に管理者へ緊急通知が送信されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}