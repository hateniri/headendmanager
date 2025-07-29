import React from 'react'
import { Battery, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { batteryEquipments, generatorEquipments, fireDetectionEquipments } from '@/data/equipment'

export default function EquipmentTables() {
  return (
    <div className="space-y-8">
      {/* 蓄電池関連（UPS・RECT） */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Battery className="h-5 w-5 mr-2 text-blue-600" />
          蓄電池関連（UPS・RECT）
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備種別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置場所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メーカー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">系統</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">個数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">製造年月</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電圧範囲 [V]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内部抵抗[mΩ]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検日</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batteryEquipments.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      equipment.type === 'UPS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {equipment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.manufacturer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.system}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.manufactureDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.voltageRange}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.internalResistance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {equipment.status === '○' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.inspectionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 発電機および制御盤（屋外） */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-600" />
          発電機および制御盤（屋外）
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備種別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置場所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メーカー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">製造年月</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蓄電池型式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蓄電池個数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電圧 [V]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内部抵抗[mΩ]</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">判定</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generatorEquipments.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {equipment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.manufacturer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.manufactureDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.batteryModel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.batteryQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.voltage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.internalResistance}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {equipment.status === '○' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.inspectionDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs">
                      {equipment.remarks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 火災予兆検知システム */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          火災予兆検知システム（FDNJ001A-R, PDNJ001A-H）
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置場所</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メーカー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設置年</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消耗部品交換日</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主な交換部品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点検結果</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fireDetectionEquipments.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      equipment.type === '警報盤' ? 'bg-red-100 text-red-800' :
                      equipment.type === 'センサ' ? 'bg-orange-100 text-orange-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {equipment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.manufacturer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.installDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.partsReplacementDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs">
                      {equipment.replacedParts}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {equipment.inspectionResult}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>補足：</strong>火災予兆センサは「サンプリング管（VP20A）」を用いて天井またはラック吊りに設置。
            すべての試験（吸引試験、異常検知、アラーム動作、通信など）は合格。
          </p>
        </div>
      </div>
    </div>
  )
}