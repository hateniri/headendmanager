import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

// 日本語フォントの設定
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// Excel出力用のヘルパー関数
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  // 列幅の自動調整
  const maxWidth = 50
  const wscols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }))
  ws['!cols'] = wscols
  
  XLSX.writeFile(wb, filename)
}

// PDF出力用のヘルパー関数
export const exportToPDF = async (
  title: string,
  data: any[],
  columns: { header: string; dataKey: string }[],
  filename: string,
  additionalInfo?: { label: string; value: string }[]
) => {
  const doc = new jsPDF('p', 'mm', 'a4')
  
  // 日本語フォントの設定（実際の実装では適切な日本語フォントを追加する必要があります）
  doc.setFont('helvetica', 'normal')
  
  // タイトル
  doc.setFontSize(20)
  doc.text(title, 105, 20, { align: 'center' })
  
  let yPosition = 40
  
  // 追加情報
  if (additionalInfo) {
    doc.setFontSize(10)
    additionalInfo.forEach(info => {
      doc.text(`${info.label}: ${info.value}`, 20, yPosition)
      yPosition += 7
    })
    yPosition += 10
  }
  
  // テーブル
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey] || '')),
    startY: yPosition,
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue-600
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Gray-50
    },
  })
  
  // 保存
  doc.save(filename)
}

// 複雑なレイアウトのPDF出力（HTMLからPDF）
export const exportComplexToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId)
  if (!element) return
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })
  
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  const imgWidth = 210 // A4 width in mm
  const pageHeight = 297 // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }
  
  pdf.save(filename)
}

// 点検フォームデータをExcel用に整形
export const formatInspectionDataForExcel = (formData: any, formType: string) => {
  const commonData = {
    点検種別: formType,
    開始日: formData.inspectionStartDate || formData.inspectionDate,
    終了日: formData.inspectionEndDate || formData.inspectionDate,
    作業会社: formData.inspectionCompany || formData.company,
    担当者: formData.inspector,
    立会者: formData.witness || '',
    緊急異常: formData.hasUrgentIssues ? '有' : '無',
  }
  
  // フォームタイプに応じた詳細データの整形
  switch (formType) {
    case 'UPS':
      return {
        ...commonData,
        UPS容量: formData.upsCapacity,
        バッテリー構成: formData.batteryConfiguration,
        切替時間: formData.switchingTime,
        総合判定: formData.result,
      }
    
    case '蓄電池':
      return {
        ...commonData,
        セル数: formData.cellCount,
        電圧範囲: `${formData.voltageRangeMin}V～${formData.voltageRangeMax}V`,
        抵抗閾値: `${formData.resistanceThreshold}mΩ`,
        製造年月: formData.manufactureDate,
      }
    
    // 他のフォームタイプも同様に追加
    default:
      return commonData
  }
}

// バッテリーセルデータのExcel出力用整形
export const formatBatteryCellsForExcel = (cells: any[]) => {
  return cells.map(cell => ({
    セル番号: cell.cellNumber,
    電圧: cell.voltage,
    電圧判定: cell.voltageJudgment,
    内部抵抗: cell.resistance,
    抵抗判定: cell.resistanceJudgment,
    温度: cell.temperature,
  }))
}