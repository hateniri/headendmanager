// ファイルダウンロードデータを生成
export function generateFileDownloads(facilityId: string) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  
  return [
    {
      id: 1,
      name: `${facilityId}_設備台帳_${currentYear}年${currentMonth}月.xlsx`,
      type: 'excel',
      size: '2.4MB',
      updatedAt: `${currentYear}年${currentMonth}月10日`,
      category: '設備管理'
    },
    {
      id: 2,
      name: `${facilityId}_月次点検報告書_${currentYear}年${currentMonth-1}月.pdf`,
      type: 'pdf',
      size: '1.8MB',
      updatedAt: `${currentYear}年${currentMonth}月1日`,
      category: '点検報告'
    },
    {
      id: 3,
      name: `${facilityId}_電源系統図_最新版.pdf`,
      type: 'pdf',
      size: '3.2MB',
      updatedAt: `${currentYear-1}年12月20日`,
      category: '技術資料'
    },
    {
      id: 4,
      name: `${facilityId}_入退室記録_${currentYear}年${currentMonth}月.csv`,
      type: 'csv',
      size: '512KB',
      updatedAt: `${currentYear}年${currentMonth}月${new Date().getDate()}日`,
      category: 'セキュリティ'
    },
    {
      id: 5,
      name: `${facilityId}_環境データ_${currentYear}年${currentMonth-1}月.xlsx`,
      type: 'excel',
      size: '1.1MB',
      updatedAt: `${currentYear}年${currentMonth}月5日`,
      category: '環境監視'
    },
    {
      id: 6,
      name: `${facilityId}_障害対応手順書_v2.3.pdf`,
      type: 'pdf',
      size: '892KB',
      updatedAt: `${currentYear-1}年10月15日`,
      category: '運用手順'
    }
  ]
}