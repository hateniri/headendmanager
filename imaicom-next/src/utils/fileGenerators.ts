// ファイル生成ユーティリティ

// 点検報告書PDFを生成（ダミー）
export function generateInspectionReport(facilityData: any, facilityName: string) {
  const reportData = {
    facilityName,
    facilityId: facilityData.basicInfo.facilityId,
    inspectionDate: new Date().toLocaleDateString('ja-JP'),
    inspector: facilityData.inspectionHistory[0]?.inspector || '佐藤 花子',
    
    // 点検項目と結果
    inspectionItems: [
      { category: '外観点検', item: '機器外観', result: '良', note: '異常なし' },
      { category: '動作確認', item: 'QAM変調器動作', result: '良', note: '正常動作確認' },
      { category: '動作確認', item: 'CMTS動作', result: '良', note: '正常動作確認' },
      { category: '環境測定', item: '室温測定', result: '良', note: `${facilityData.environmentData.temperature.toFixed(1)}°C` },
      { category: '環境測定', item: '湿度測定', result: '良', note: `${facilityData.environmentData.humidity.toFixed(1)}%` },
      { category: '安全確認', item: '配線状態', result: '良', note: '異常なし' },
      { category: '安全確認', item: 'UPS動作', result: '良', note: '正常動作確認' }
    ],
    
    // 機器状況サマリー
    equipmentSummary: {
      total: facilityData.equipment.length,
      normal: facilityData.equipment.filter((eq: any) => eq.status === 'normal').length,
      warning: facilityData.equipment.filter((eq: any) => eq.status === 'warning').length,
      critical: facilityData.equipment.filter((eq: any) => eq.status === 'critical').length
    },
    
    // 推奨事項
    recommendations: [
      '次回点検時期: 2025年3月実施予定',
      '空調設備の定期清掃を推奨',
      'UPS装置のバッテリー交換時期の確認が必要'
    ]
  }
  
  return reportData
}

// 機器一覧CSVを生成
export function generateEquipmentCSV(equipment: any[]) {
  const headers = [
    '機材ID',
    'カテゴリ',
    'メーカー',
    '型番',
    'ラックID', 
    'スロット',
    '拠点ID',
    '設置年月',
    '状態',
    '温度(℃)',
    '消費電力(kW)',
    '月間消費電力(kWh)',
    '月間CO₂排出量(kg)',
    'シリアル番号',
    '備考'
  ]
  
  const csvContent = [
    headers.join(','),
    ...equipment.map(eq => [
      eq.assetId || eq.id,
      eq.category || eq.type,
      eq.manufacturer,
      eq.model,
      eq.rackId || eq.rack,
      eq.slotNumber || '',
      eq.facilityId,
      eq.installDate,
      eq.status === 'normal' ? '正常' : 
      eq.status === 'warning' ? '要注意' :
      eq.status === 'critical' ? '要対応' : 'メンテナンス中',
      eq.temperature || '',
      eq.powerConsumption || '',
      eq.monthlyPowerConsumption || '',
      eq.monthlyCO2Emission || '',
      eq.serialNumber || '',
      (eq.remarks || '').replace(/,/g, '，') // CSVのカンマエスケープ
    ].map(field => `"${field}"`).join(','))
  ].join('\n')
  
  return csvContent
}

// 点検写真のダミーデータを生成
export function generateInspectionPhotos(facilityId: string) {
  const photos = [
    {
      id: 'photo_001',
      filename: `${facilityId}_外観_20250127.jpg`,
      category: '外観点検',
      description: '施設外観全景',
      timestamp: '2025-01-27 09:30:00',
      inspector: '佐藤 花子',
      size: '2.4MB'
    },
    {
      id: 'photo_002', 
      filename: `${facilityId}_ラック_20250127.jpg`,
      category: '機器点検',
      description: 'メインラック全体',
      timestamp: '2025-01-27 10:15:00',
      inspector: '佐藤 花子',
      size: '3.1MB'
    },
    {
      id: 'photo_003',
      filename: `${facilityId}_QAM_20250127.jpg`, 
      category: '機器点検',
      description: 'QAM変調器動作状況',
      timestamp: '2025-01-27 10:45:00',
      inspector: '佐藤 花子',
      size: '1.8MB'
    },
    {
      id: 'photo_004',
      filename: `${facilityId}_UPS_20250127.jpg`,
      category: '電源設備',
      description: 'UPS装置表示パネル',
      timestamp: '2025-01-27 11:20:00',
      inspector: '佐藤 花子',
      size: '2.2MB'
    },
    {
      id: 'photo_005',
      filename: `${facilityId}_空調_20250127.jpg`,
      category: '環境設備',
      description: '空調設備フィルター状況',
      timestamp: '2025-01-27 11:45:00',
      inspector: '佐藤 花子',
      size: '2.9MB'
    }
  ]
  
  return photos
}

// ファイルダウンロードを実行
export function downloadFile(content: string, filename: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// PDFダウンロード（ダミー実装）
export function downloadPDF(reportData: any, filename: string) {
  // 実際のプロダクションではjsPDFやPDFKitを使用
  const pdfContent = `
点検報告書

施設名: ${reportData.facilityName}
施設ID: ${reportData.facilityId}
点検日: ${reportData.inspectionDate}
点検者: ${reportData.inspector}

【点検結果】
${reportData.inspectionItems.map((item: any) => 
  `${item.category} - ${item.item}: ${item.result} (${item.note})`
).join('\n')}

【機器状況サマリー】
総機器数: ${reportData.equipmentSummary.total}
正常: ${reportData.equipmentSummary.normal}
要注意: ${reportData.equipmentSummary.warning}  
要対応: ${reportData.equipmentSummary.critical}

【推奨事項】
${reportData.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

作成日時: ${new Date().toLocaleString('ja-JP')}
`
  
  downloadFile(pdfContent, filename, 'application/pdf')
}

// 写真ZIPダウンロード（ダミー実装）
export function downloadPhotoZip(photos: any[], facilityId: string) {
  // 実際のプロダクションではJSZipを使用
  const zipContent = `
点検写真一覧 - ${facilityId}

${photos.map(photo => 
  `${photo.filename}
  カテゴリ: ${photo.category}
  説明: ${photo.description}
  撮影日時: ${photo.timestamp}
  撮影者: ${photo.inspector}
  ファイルサイズ: ${photo.size}
`).join('\n---\n')}

注意: このファイルはダミーデータです。
実際の環境では各写真ファイルがZIP形式で提供されます。
`
  
  downloadFile(zipContent, `${facilityId}_inspection_photos.zip`, 'application/zip')
}