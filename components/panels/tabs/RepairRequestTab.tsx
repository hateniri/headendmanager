'use client'

import React, { useState } from 'react'
import { useFacilityStore } from '@/store/facilityStore'
import { RepairRequest } from '@/types'

export default function RepairRequestTab() {
  const selectedFacility = useFacilityStore((state) => state.selectedFacility)
  const [formData, setFormData] = useState<Omit<RepairRequest, 'id' | 'facilityId' | 'requestDate' | 'status'>>({
    requesterName: '',
    content: '',
    priority: 'medium',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 実際のアプリケーションではここでAPIに送信
    console.log('修理依頼を送信:', {
      ...formData,
      facilityId: selectedFacility?.id,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'open',
    })
    
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        requesterName: '',
        content: '',
        priority: 'medium',
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">修理依頼フォーム</h3>
        <p className="text-sm text-gray-600">
          施設: {selectedFacility?.name}
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-medium">修理依頼を送信しました</p>
          <p className="text-sm mt-1">担当者から連絡があるまでお待ちください。</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700 mb-1">
              依頼者名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="requesterName"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田太郎"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              優先度 <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">緊急</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              修理内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="修理が必要な内容を詳しく記載してください。&#10;例：サーバールームの空調機器から異音が発生しています。"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              修理依頼を送信
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h4 className="font-medium text-gray-900 mb-3">優先度の目安</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-16">低:</span>
            <span className="text-gray-600">通常業務に影響なし（1週間以内対応）</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-16">中:</span>
            <span className="text-gray-600">一部業務に影響あり（3日以内対応）</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-gray-700 w-16">高:</span>
            <span className="text-gray-600">業務に大きな影響あり（翌日対応）</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-red-600 w-16">緊急:</span>
            <span className="text-gray-600">サービス停止の恐れ（即日対応）</span>
          </div>
        </div>
      </div>
    </div>
  )
}