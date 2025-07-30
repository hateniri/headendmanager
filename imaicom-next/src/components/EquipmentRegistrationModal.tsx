'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface EquipmentRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  facilityId: string
}

export default function EquipmentRegistrationModal({ isOpen, onClose, facilityId }: EquipmentRegistrationModalProps) {
  const [formData, setFormData] = useState({
    location: 'HE室',
    rackNumber: '',
    pitchNumber: '',
    slotNumber: '0',
    assetNumber: '',
    category: '共通設備',
    productName: '',
    model: '',
    vendor: '',
    status: '運用機',
    installDate: '',
    disposalFlag: '',
    inventoryTarget: 'はい',
    amount: '',
    subsidyTarget: '',
    assetMemo: '',
    registrant: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 登録処理のシミュレーション
    const registrationData = {
      ...formData,
      registrationDate: new Date().toLocaleString('ja-JP'),
      updateDate: new Date().toLocaleString('ja-JP'),
      updater: formData.registrant
    }
    
    console.log('登録データ:', registrationData)
    alert(`機器を登録しました:\n${formData.productName} (${formData.model})`)
    
    // フォームをリセット
    setFormData({
      location: 'HE室',
      rackNumber: '',
      pitchNumber: '',
      slotNumber: '0',
      assetNumber: '',
      category: '共通設備',
      productName: '',
      model: '',
      vendor: '',
      status: '運用機',
      installDate: '',
      disposalFlag: '',
      inventoryTarget: 'はい',
      amount: '',
      subsidyTarget: '',
      assetMemo: '',
      registrant: '',
    })
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">新規機器登録</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 設置場所 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                設置場所 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* ラック番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ラック番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.rackNumber}
                onChange={(e) => setFormData({ ...formData, rackNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: A-1"
                required
              />
            </div>
            
            {/* ピッチ番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ピッチ番号
              </label>
              <input
                type="number"
                value={formData.pitchNumber}
                onChange={(e) => setFormData({ ...formData, pitchNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 4"
              />
            </div>
            
            {/* スロット番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                スロット番号
              </label>
              <input
                type="number"
                value={formData.slotNumber}
                onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            
            {/* 固定資産番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                固定資産番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.assetNumber}
                onChange={(e) => setFormData({ ...formData, assetNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 10006517"
                required
              />
            </div>
            
            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="共通設備">共通設備</option>
                <option value="電源設備">電源設備</option>
                <option value="空調設備">空調設備</option>
                <option value="ネットワーク機器">ネットワーク機器</option>
                <option value="サーバー">サーバー</option>
                <option value="ストレージ">ストレージ</option>
                <option value="その他">その他</option>
              </select>
            </div>
            
            {/* 製品名 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                製品名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 光パネル実装ラック（CTF）"
                required
              />
            </div>
            
            {/* 型番 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                型番
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* ベンダー名 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ベンダー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 株式会社ブロードネットマックス"
                required
              />
            </div>
            
            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="運用機">運用機</option>
                <option value="待機">待機</option>
                <option value="故障">故障</option>
                <option value="メンテナンス中">メンテナンス中</option>
                <option value="廃棄予定">廃棄予定</option>
              </select>
            </div>
            
            {/* 設置年月日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                設置年月日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.installDate}
                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* 除却フラグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                除却フラグ
              </label>
              <select
                value={formData.disposalFlag}
                onChange={(e) => setFormData({ ...formData, disposalFlag: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-</option>
                <option value="はい">はい</option>
                <option value="いいえ">いいえ</option>
              </select>
            </div>
            
            {/* 棚卸対象 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                棚卸対象
              </label>
              <select
                value={formData.inventoryTarget}
                onChange={(e) => setFormData({ ...formData, inventoryTarget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="はい">はい</option>
                <option value="いいえ">いいえ</option>
              </select>
            </div>
            
            {/* 金額 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                金額
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 2200000"
              />
            </div>
            
            {/* 補助金対象 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                補助金対象
              </label>
              <select
                value={formData.subsidyTarget}
                onChange={(e) => setFormData({ ...formData, subsidyTarget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-</option>
                <option value="はい">はい</option>
                <option value="いいえ">いいえ</option>
              </select>
            </div>
            
            {/* 資産メモ */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                資産メモ
              </label>
              <textarea
                value={formData.assetMemo}
                onChange={(e) => setFormData({ ...formData, assetMemo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="例: 宗像光集線架工事"
              />
            </div>
            
            {/* 登録者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                登録者 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.registrant}
                onChange={(e) => setFormData({ ...formData, registrant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 岡田 義浩"
                required
              />
            </div>
          </div>
          
          {/* ボタン */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}