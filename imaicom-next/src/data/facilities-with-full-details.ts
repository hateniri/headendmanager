import { Facility } from '@/lib/supabase'

// CSV拠点データの詳細構造
export interface FacilityDetail extends Facility {
  facilityId: string
  openedYear: number
  managementOrg: string
  remarks: string
  // 組織情報
  companyCode?: string
  regionCode?: string
  managementDeptCode?: string
  managementDeptName?: string
  stationCode?: string
  stationName?: string
}

// 新リスト.csvの完全なデータ構造
export const facilitiesWithFullDetails: FacilityDetail[] = [
  // 北海道エリア
  { id: 1, facilityId: "HE_北海道_001", name: "北海道 第1施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目20-2", lat: 37.061564, lng: 136.735594, status: "normal", openedYear: 2021, managementOrg: "北海道ネットワークセンター", remarks: "高負荷施設" },
  { id: 2, facilityId: "HE_北海道_002", name: "北海道 第2施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市4丁目7-2", lat: 44.543708, lng: 142.602601, status: "normal", openedYear: 2020, managementOrg: "北海道ネットワークセンター", remarks: "試験設備あり" },
  { id: 3, facilityId: "HE_北海道_003", name: "北海道 第3施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市5丁目6-23", lat: 36.436802, lng: 140.631664, status: "normal", openedYear: 2011, managementOrg: "北海道ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 4, facilityId: "HE_北海道_004", name: "北海道 第4施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目2-10", lat: 43.663496, lng: 133.890312, status: "normal", openedYear: 2008, managementOrg: "北海道ネットワークセンター", remarks: "試験設備あり" },
  { id: 5, facilityId: "HE_北海道_005", name: "北海道 第5施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目8-2", lat: 38.980321, lng: 138.213693, status: "warning", openedYear: 2009, managementOrg: "北海道ネットワークセンター", remarks: "試験設備あり" },
  { id: 6, facilityId: "HE_北海道_006", name: "北海道 第6施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目9-24", lat: 35.054385, lng: 142.824502, status: "normal", openedYear: 2015, managementOrg: "北海道ネットワークセンター", remarks: "高負荷施設" },
  { id: 7, facilityId: "HE_北海道_007", name: "北海道 第7施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目2-14", lat: 41.653102, lng: 142.410453, status: "warning", openedYear: 2019, managementOrg: "北海道ネットワークセンター", remarks: "" },
  { id: 8, facilityId: "HE_北海道_008", name: "北海道 第8施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目6-25", lat: 37.779791, lng: 130.247032, status: "normal", openedYear: 2006, managementOrg: "北海道ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 9, facilityId: "HE_北海道_009", name: "北海道 第9施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目11-26", lat: 38.118217, lng: 131.613201, status: "normal", openedYear: 2022, managementOrg: "北海道ネットワークセンター", remarks: "" },
  { id: 10, facilityId: "HE_北海道_010", name: "北海道 第10施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市4丁目8-23", lat: 34.72558, lng: 138.950755, status: "normal", openedYear: 2019, managementOrg: "北海道ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 11, facilityId: "HE_北海道_011", name: "北海道 第11施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目16-11", lat: 44.053757, lng: 138.028459, status: "normal", openedYear: 2019, managementOrg: "北海道ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 12, facilityId: "HE_北海道_012", name: "北海道 第12施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目14-10", lat: 41.681909, lng: 141.871321, status: "normal", openedYear: 2001, managementOrg: "北海道ネットワークセンター", remarks: "" },
  { id: 13, facilityId: "HE_北海道_013", name: "北海道 第13施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目16-22", lat: 34.523636, lng: 139.408576, status: "critical", openedYear: 2003, managementOrg: "北海道ネットワークセンター", remarks: "試験設備あり" },

  // 東北エリア
  { id: 14, facilityId: "HE_東北_014", name: "東北 第14施設", region: "東北", prefecture: "福島県", city: "福島市", address: "福島県福島市3丁目7-28", lat: 34.130382, lng: 131.936476, status: "warning", openedYear: 2017, managementOrg: "東北ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 15, facilityId: "HE_東北_015", name: "東北 第15施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市1丁目9-11", lat: 33.033046, lng: 141.45369, status: "normal", openedYear: 2019, managementOrg: "東北ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 16, facilityId: "HE_東北_016", name: "東北 第16施設", region: "東北", prefecture: "岩手県", city: "岩手市", address: "岩手県岩手市5丁目9-18", lat: 33.652585, lng: 141.574529, status: "normal", openedYear: 2016, managementOrg: "東北ネットワークセンター", remarks: "高負荷施設" },
  { id: 17, facilityId: "HE_東北_017", name: "東北 第17施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市2丁目12-9", lat: 41.467643, lng: 144.826364, status: "normal", openedYear: 2007, managementOrg: "東北ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 18, facilityId: "HE_東北_018", name: "東北 第18施設", region: "東北", prefecture: "福島県", city: "福島市", address: "福島県福島市4丁目20-12", lat: 40.606403, lng: 142.669925, status: "normal", openedYear: 2012, managementOrg: "東北ネットワークセンター", remarks: "" },
  { id: 19, facilityId: "HE_東北_019", name: "東北 第19施設", region: "東北", prefecture: "岩手県", city: "岩手市", address: "岩手県岩手市2丁目12-6", lat: 34.365534, lng: 132.691084, status: "maintenance", openedYear: 2024, managementOrg: "東北ネットワークセンター", remarks: "試験設備あり" },
  { id: 20, facilityId: "HE_東北_020", name: "東北 第20施設", region: "東北", prefecture: "秋田県", city: "秋田市", address: "秋田県秋田市2丁目3-4", lat: 41.67192, lng: 135.005471, status: "normal", openedYear: 2010, managementOrg: "東北ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 21, facilityId: "HE_東北_021", name: "東北 第21施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市4丁目13-20", lat: 36.29327, lng: 133.103111, status: "warning", openedYear: 2000, managementOrg: "東北ネットワークセンター", remarks: "" },
  { id: 22, facilityId: "HE_東北_022", name: "東北 第22施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市1丁目6-11", lat: 44.148392, lng: 130.575773, status: "normal", openedYear: 2015, managementOrg: "東北ネットワークセンター", remarks: "高負荷施設" },
  { id: 23, facilityId: "HE_東北_023", name: "東北 第23施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市4丁目18-3", lat: 37.816233, lng: 134.160878, status: "normal", openedYear: 2007, managementOrg: "東北ネットワークセンター", remarks: "試験設備あり" },
  { id: 24, facilityId: "HE_東北_024", name: "東北 第24施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市1丁目5-4", lat: 41.346987, lng: 133.687751, status: "normal", openedYear: 2005, managementOrg: "東北ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 25, facilityId: "HE_東北_025", name: "東北 第25施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市4丁目20-30", lat: 43.063042, lng: 133.476801, status: "normal", openedYear: 2019, managementOrg: "東北ネットワークセンター", remarks: "高負荷施設" },
  { id: 26, facilityId: "HE_東北_026", name: "東北 第26施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市3丁目5-28", lat: 40.292235, lng: 141.235027, status: "critical", openedYear: 2015, managementOrg: "東北ネットワークセンター", remarks: "旧型ラックあり" },

  // 関東エリア
  { id: 27, facilityId: "HE_関東_027", name: "関東 第27施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市4丁目9-28", lat: 43.443689, lng: 134.68159, status: "normal", openedYear: 2020, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 28, facilityId: "HE_関東_028", name: "関東 第28施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市5丁目12-5", lat: 41.036395, lng: 135.250339, status: "warning", openedYear: 2007, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 29, facilityId: "HE_関東_029", name: "関東 第29施設", region: "関東", prefecture: "群馬県", city: "群馬市", address: "群馬県群馬市3丁目6-26", lat: 43.06923, lng: 140.138069, status: "normal", openedYear: 2008, managementOrg: "関東ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 30, facilityId: "HE_関東_030", name: "関東 第30施設", region: "関東", prefecture: "神奈川県", city: "神奈川市", address: "神奈川県神奈川市2丁目15-12", lat: 37.783825, lng: 144.221446, status: "normal", openedYear: 2024, managementOrg: "関東ネットワークセンター", remarks: "" },
  { id: 31, facilityId: "HE_関東_031", name: "関東 第31施設", region: "関東", prefecture: "栃木県", city: "栃木市", address: "栃木県栃木市5丁目14-20", lat: 38.604219, lng: 138.664076, status: "normal", openedYear: 2003, managementOrg: "関東ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 32, facilityId: "HE_関東_032", name: "関東 第32施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市5丁目6-28", lat: 37.869731, lng: 130.678894, status: "normal", openedYear: 2003, managementOrg: "関東ネットワークセンター", remarks: "" },
  { id: 33, facilityId: "HE_関東_033", name: "関東 第33施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市5丁目9-28", lat: 35.33692, lng: 130.6981, status: "normal", openedYear: 2018, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 34, facilityId: "HE_関東_034", name: "関東 第34施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市2丁目16-1", lat: 38.994591, lng: 134.929427, status: "normal", openedYear: 2014, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 35, facilityId: "HE_関東_035", name: "関東 第35施設", region: "関東", prefecture: "栃木県", city: "栃木市", address: "栃木県栃木市3丁目18-8", lat: 43.353917, lng: 134.764976, status: "warning", openedYear: 2009, managementOrg: "関東ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 36, facilityId: "HE_関東_036", name: "関東 第36施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市1丁目20-28", lat: 39.677723, lng: 132.557141, status: "normal", openedYear: 2020, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 37, facilityId: "HE_関東_037", name: "関東 第37施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市1丁目11-5", lat: 38.953879, lng: 132.056812, status: "normal", openedYear: 2024, managementOrg: "関東ネットワークセンター", remarks: "試験設備あり" },
  { id: 38, facilityId: "HE_関東_038", name: "関東 第38施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市2丁目12-14", lat: 35.08534, lng: 135.357711, status: "maintenance", openedYear: 2012, managementOrg: "関東ネットワークセンター", remarks: "" },
  { id: 39, facilityId: "HE_関東_039", name: "関東 第39施設", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市4丁目10-3", lat: 33.216352, lng: 142.018522, status: "critical", openedYear: 2015, managementOrg: "関東ネットワークセンター", remarks: "旧型ラックあり" },

  // 中部エリア
  { id: 40, facilityId: "HE_中部_040", name: "中部 第40施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目13-30", lat: 38.399825, lng: 139.001988, status: "normal", openedYear: 2003, managementOrg: "中部ネットワークセンター", remarks: "" },
  { id: 41, facilityId: "HE_中部_041", name: "中部 第41施設", region: "中部", prefecture: "愛知県", city: "愛知市", address: "愛知県愛知市1丁目16-20", lat: 40.815422, lng: 144.688653, status: "normal", openedYear: 2019, managementOrg: "中部ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 42, facilityId: "HE_中部_042", name: "中部 第42施設", region: "中部", prefecture: "山梨県", city: "山梨市", address: "山梨県山梨市3丁目15-16", lat: 40.451303, lng: 142.368027, status: "warning", openedYear: 2000, managementOrg: "中部ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 43, facilityId: "HE_中部_043", name: "中部 第43施設", region: "中部", prefecture: "石川県", city: "石川市", address: "石川県石川市3丁目10-22", lat: 36.257015, lng: 130.621525, status: "normal", openedYear: 2015, managementOrg: "中部ネットワークセンター", remarks: "" },
  { id: 44, facilityId: "HE_中部_044", name: "中部 第44施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目1-9", lat: 42.315071, lng: 144.223787, status: "normal", openedYear: 2024, managementOrg: "中部ネットワークセンター", remarks: "高負荷施設" },
  { id: 45, facilityId: "HE_中部_045", name: "中部 第45施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目12-28", lat: 42.594568, lng: 142.842136, status: "normal", openedYear: 2010, managementOrg: "中部ネットワークセンター", remarks: "試験設備あり" },
  { id: 46, facilityId: "HE_中部_046", name: "中部 第46施設", region: "中部", prefecture: "静岡県", city: "静岡市", address: "静岡県静岡市1丁目14-9", lat: 34.920847, lng: 131.253089, status: "normal", openedYear: 2004, managementOrg: "中部ネットワークセンター", remarks: "高負荷施設" },
  { id: 47, facilityId: "HE_中部_047", name: "中部 第47施設", region: "中部", prefecture: "長野県", city: "長野市", address: "長野県長野市5丁目8-21", lat: 42.03824, lng: 140.094363, status: "normal", openedYear: 2002, managementOrg: "中部ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 48, facilityId: "HE_中部_048", name: "中部 第48施設", region: "中部", prefecture: "新潟県", city: "新潟市", address: "新潟県新潟市2丁目11-19", lat: 41.435115, lng: 130.300596, status: "normal", openedYear: 2006, managementOrg: "中部ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 49, facilityId: "HE_中部_049", name: "中部 第49施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市1丁目18-28", lat: 33.98033, lng: 137.50636, status: "warning", openedYear: 2003, managementOrg: "中部ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 50, facilityId: "HE_中部_050", name: "中部 第50施設", region: "中部", prefecture: "静岡県", city: "静岡市", address: "静岡県静岡市4丁目3-20", lat: 34.952807, lng: 143.241272, status: "normal", openedYear: 2019, managementOrg: "中部ネットワークセンター", remarks: "高負荷施設" },
  { id: 51, facilityId: "HE_中部_051", name: "中部 第51施設", region: "中部", prefecture: "岐阜県", city: "岐阜市", address: "岐阜県岐阜市4丁目13-16", lat: 35.621407, lng: 131.192491, status: "normal", openedYear: 2016, managementOrg: "中部ネットワークセンター", remarks: "試験設備あり" },
  { id: 52, facilityId: "HE_中部_052", name: "中部 第52施設", region: "中部", prefecture: "山梨県", city: "山梨市", address: "山梨県山梨市1丁目15-7", lat: 40.779699, lng: 141.525574, status: "critical", openedYear: 2002, managementOrg: "中部ネットワークセンター", remarks: "旧型ラックあり" },

  // 関西エリア
  { id: 53, facilityId: "HE_関西_053", name: "関西 第53施設", region: "関西", prefecture: "滋賀県", city: "滋賀市", address: "滋賀県滋賀市1丁目2-15", lat: 40.551851, lng: 140.331576, status: "normal", openedYear: 2004, managementOrg: "関西ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 54, facilityId: "HE_関西_054", name: "関西 第54施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市5丁目6-8", lat: 35.391184, lng: 140.668496, status: "normal", openedYear: 2019, managementOrg: "関西ネットワークセンター", remarks: "" },
  { id: 55, facilityId: "HE_関西_055", name: "関西 第55施設", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市2丁目19-16", lat: 36.25869, lng: 138.472242, status: "normal", openedYear: 2017, managementOrg: "関西ネットワークセンター", remarks: "高負荷施設" },
  { id: 56, facilityId: "HE_関西_056", name: "関西 第56施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市3丁目9-7", lat: 34.074319, lng: 138.531337, status: "warning", openedYear: 2020, managementOrg: "関西ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 57, facilityId: "HE_関西_057", name: "関西 第57施設", region: "関西", prefecture: "滋賀県", city: "滋賀市", address: "滋賀県滋賀市2丁目7-11", lat: 38.067371, lng: 138.785661, status: "maintenance", openedYear: 2001, managementOrg: "関西ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 58, facilityId: "HE_関西_058", name: "関西 第58施設", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市1丁目17-1", lat: 41.782621, lng: 131.293215, status: "normal", openedYear: 2010, managementOrg: "関西ネットワークセンター", remarks: "高負荷施設" },
  { id: 59, facilityId: "HE_関西_059", name: "関西 第59施設", region: "関西", prefecture: "京都府", city: "京都市", address: "京都府京都市5丁目1-14", lat: 38.929066, lng: 138.193737, status: "normal", openedYear: 2011, managementOrg: "関西ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 60, facilityId: "HE_関西_060", name: "関西 第60施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市2丁目11-10", lat: 39.23692, lng: 132.044409, status: "normal", openedYear: 2021, managementOrg: "関西ネットワークセンター", remarks: "試験設備あり" },
  { id: 61, facilityId: "HE_関西_061", name: "関西 第61施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市1丁目1-10", lat: 40.025862, lng: 142.459229, status: "normal", openedYear: 2020, managementOrg: "関西ネットワークセンター", remarks: "試験設備あり" },
  { id: 62, facilityId: "HE_関西_062", name: "関西 第62施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市1丁目12-5", lat: 37.804216, lng: 143.858485, status: "normal", openedYear: 2013, managementOrg: "関西ネットワークセンター", remarks: "試験設備あり" },
  { id: 63, facilityId: "HE_関西_063", name: "関西 第63施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市1丁目6-4", lat: 40.929819, lng: 131.231706, status: "warning", openedYear: 2005, managementOrg: "関西ネットワークセンター", remarks: "試験設備あり" },
  { id: 64, facilityId: "HE_関西_064", name: "関西 第64施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市2丁目18-21", lat: 38.724558, lng: 144.816339, status: "normal", openedYear: 2015, managementOrg: "関西ネットワークセンター", remarks: "旧型ラックあり" },

  // 中国エリア
  { id: 65, facilityId: "HE_中国_065", name: "中国 第65施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市2丁目20-4", lat: 44.628007, lng: 133.192367, status: "critical", openedYear: 2011, managementOrg: "中国ネットワークセンター", remarks: "高負荷施設" },
  { id: 66, facilityId: "HE_中国_066", name: "中国 第66施設", region: "中国", prefecture: "岡山県", city: "岡山市", address: "岡山県岡山市1丁目20-9", lat: 44.48575, lng: 138.19811, status: "normal", openedYear: 2020, managementOrg: "中国ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 67, facilityId: "HE_中国_067", name: "中国 第67施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市3丁目16-10", lat: 44.224336, lng: 144.12563, status: "normal", openedYear: 2004, managementOrg: "中国ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 68, facilityId: "HE_中国_068", name: "中国 第68施設", region: "中国", prefecture: "島根県", city: "島根市", address: "島根県島根市3丁目10-9", lat: 42.467431, lng: 139.683787, status: "normal", openedYear: 2024, managementOrg: "中国ネットワークセンター", remarks: "" },
  { id: 69, facilityId: "HE_中国_069", name: "中国 第69施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市4丁目4-2", lat: 34.009658, lng: 136.859865, status: "normal", openedYear: 2001, managementOrg: "中国ネットワークセンター", remarks: "高負荷施設" },
  { id: 70, facilityId: "HE_中国_070", name: "中国 第70施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市1丁目5-24", lat: 35.813764, lng: 144.360716, status: "warning", openedYear: 2009, managementOrg: "中国ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 71, facilityId: "HE_中国_071", name: "中国 第71施設", region: "中国", prefecture: "山口県", city: "山口市", address: "山口県山口市4丁目20-13", lat: 42.01057, lng: 139.319886, status: "normal", openedYear: 2016, managementOrg: "中国ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 72, facilityId: "HE_中国_072", name: "中国 第72施設", region: "中国", prefecture: "山口県", city: "山口市", address: "山口県山口市3丁目2-18", lat: 42.608659, lng: 132.87629, status: "normal", openedYear: 2023, managementOrg: "中国ネットワークセンター", remarks: "" },
  { id: 73, facilityId: "HE_中国_073", name: "中国 第73施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市2丁目18-22", lat: 41.072132, lng: 143.087974, status: "normal", openedYear: 2023, managementOrg: "中国ネットワークセンター", remarks: "" },
  { id: 74, facilityId: "HE_中国_074", name: "中国 第74施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市3丁目18-6", lat: 41.459255, lng: 130.115575, status: "normal", openedYear: 2023, managementOrg: "中国ネットワークセンター", remarks: "" },
  { id: 75, facilityId: "HE_中国_075", name: "中国 第75施設", region: "中国", prefecture: "島根県", city: "島根市", address: "島根県島根市1丁目5-2", lat: 38.180415, lng: 142.719112, status: "normal", openedYear: 2022, managementOrg: "中国ネットワークセンター", remarks: "試験設備あり" },
  { id: 76, facilityId: "HE_中国_076", name: "中国 第76施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市5丁目11-14", lat: 41.624997, lng: 142.69275, status: "maintenance", openedYear: 2006, managementOrg: "中国ネットワークセンター", remarks: "高負荷施設" },

  // 四国エリア
  { id: 77, facilityId: "HE_四国_077", name: "四国 第77施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目10-29", lat: 34.832211, lng: 140.916721, status: "warning", openedYear: 2011, managementOrg: "四国ネットワークセンター", remarks: "高負荷施設" },
  { id: 78, facilityId: "HE_四国_078", name: "四国 第78施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市2丁目2-23", lat: 44.081732, lng: 131.725917, status: "critical", openedYear: 2008, managementOrg: "四国ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 79, facilityId: "HE_四国_079", name: "四国 第79施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目19-15", lat: 44.591121, lng: 140.368056, status: "normal", openedYear: 2023, managementOrg: "四国ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 80, facilityId: "HE_四国_080", name: "四国 第80施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目7-5", lat: 38.783162, lng: 139.203988, status: "normal", openedYear: 2017, managementOrg: "四国ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 81, facilityId: "HE_四国_081", name: "四国 第81施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目9-28", lat: 33.682696, lng: 137.747244, status: "normal", openedYear: 2002, managementOrg: "四国ネットワークセンター", remarks: "高負荷施設" },
  { id: 82, facilityId: "HE_四国_082", name: "四国 第82施設", region: "四国", prefecture: "徳島県", city: "徳島市", address: "徳島県徳島市3丁目3-8", lat: 40.121255, lng: 135.007737, status: "normal", openedYear: 2003, managementOrg: "四国ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 83, facilityId: "HE_四国_083", name: "四国 第83施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目6-2", lat: 41.104496, lng: 143.356913, status: "normal", openedYear: 2000, managementOrg: "四国ネットワークセンター", remarks: "高負荷施設" },
  { id: 84, facilityId: "HE_四国_084", name: "四国 第84施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市2丁目16-26", lat: 38.375659, lng: 139.019252, status: "warning", openedYear: 2017, managementOrg: "四国ネットワークセンター", remarks: "高負荷施設" },
  { id: 85, facilityId: "HE_四国_085", name: "四国 第85施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目19-3", lat: 39.857907, lng: 130.481126, status: "normal", openedYear: 2016, managementOrg: "四国ネットワークセンター", remarks: "高負荷施設" },
  { id: 86, facilityId: "HE_四国_086", name: "四国 第86施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市4丁目20-2", lat: 42.205034, lng: 132.078423, status: "normal", openedYear: 2007, managementOrg: "四国ネットワークセンター", remarks: "試験設備あり" },
  { id: 87, facilityId: "HE_四国_087", name: "四国 第87施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市5丁目11-5", lat: 38.108515, lng: 144.761668, status: "normal", openedYear: 2008, managementOrg: "四国ネットワークセンター", remarks: "試験設備あり" },
  { id: 88, facilityId: "HE_四国_088", name: "四国 第88施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市4丁目9-19", lat: 37.241022, lng: 142.090073, status: "normal", openedYear: 2001, managementOrg: "四国ネットワークセンター", remarks: "旧型ラックあり" },

  // 九州エリア
  { id: 89, facilityId: "HE_九州_089", name: "九州 第89施設", region: "九州", prefecture: "熊本県", city: "熊本市", address: "熊本県熊本市5丁目3-28", lat: 33.649715, lng: 136.067448, status: "normal", openedYear: 2013, managementOrg: "九州ネットワークセンター", remarks: "試験設備あり" },
  { id: 90, facilityId: "HE_九州_090", name: "九州 第90施設", region: "九州", prefecture: "長崎県", city: "長崎市", address: "長崎県長崎市3丁目2-23", lat: 33.121244, lng: 143.107639, status: "normal", openedYear: 2015, managementOrg: "九州ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 91, facilityId: "HE_九州_091", name: "九州 第91施設", region: "九州", prefecture: "宮崎県", city: "宮崎市", address: "宮崎県宮崎市5丁目1-23", lat: 36.117496, lng: 143.216345, status: "critical", openedYear: 2011, managementOrg: "九州ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 92, facilityId: "HE_九州_092", name: "九州 第92施設", region: "九州", prefecture: "鹿児島県", city: "鹿児島市", address: "鹿児島県鹿児島市5丁目18-3", lat: 41.530588, lng: 135.819543, status: "normal", openedYear: 2022, managementOrg: "九州ネットワークセンター", remarks: "" },
  { id: 93, facilityId: "HE_九州_093", name: "九州 第93施設", region: "九州", prefecture: "佐賀県", city: "佐賀市", address: "佐賀県佐賀市2丁目11-15", lat: 38.112778, lng: 141.332609, status: "normal", openedYear: 2002, managementOrg: "九州ネットワークセンター", remarks: "" },
  { id: 94, facilityId: "HE_九州_094", name: "九州 第94施設", region: "九州", prefecture: "沖縄県", city: "沖縄市", address: "沖縄県沖縄市2丁目3-11", lat: 33.310778, lng: 141.300503, status: "normal", openedYear: 2001, managementOrg: "九州ネットワークセンター", remarks: "試験設備あり" },
  { id: 95, facilityId: "HE_九州_095", name: "九州 第95施設", region: "九州", prefecture: "佐賀県", city: "佐賀市", address: "佐賀県佐賀市1丁目18-7", lat: 42.917068, lng: 141.49512, status: "maintenance", openedYear: 2021, managementOrg: "九州ネットワークセンター", remarks: "高負荷施設" },
  { id: 96, facilityId: "HE_九州_096", name: "九州 第96施設", region: "九州", prefecture: "長崎県", city: "長崎市", address: "長崎県長崎市1丁目12-16", lat: 39.772838, lng: 136.109415, status: "normal", openedYear: 2007, managementOrg: "九州ネットワークセンター", remarks: "" },
  { id: 97, facilityId: "HE_九州_097", name: "九州 第97施設", region: "九州", prefecture: "熊本県", city: "熊本市", address: "熊本県熊本市3丁目16-2", lat: 37.764389, lng: 142.388731, status: "normal", openedYear: 2004, managementOrg: "九州ネットワークセンター", remarks: "旧型ラックあり" },
  { id: 98, facilityId: "HE_九州_098", name: "九州 第98施設", region: "九州", prefecture: "福岡県", city: "福岡市", address: "福岡県福岡市3丁目19-30", lat: 33.044176, lng: 137.732274, status: "warning", openedYear: 2012, managementOrg: "九州ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 99, facilityId: "HE_九州_099", name: "九州 第99施設", region: "九州", prefecture: "宮崎県", city: "宮崎市", address: "宮崎県宮崎市4丁目9-9", lat: 37.122647, lng: 132.274785, status: "normal", openedYear: 2008, managementOrg: "九州ネットワークセンター", remarks: "遠隔点検対応済み" },
  { id: 100, facilityId: "HE_九州_100", name: "九州 第100施設", region: "九州", prefecture: "鹿児島県", city: "鹿児島市", address: "鹿児島県鹿児島市1丁目14-17", lat: 37.485648, lng: 130.684565, status: "normal", openedYear: 2009, managementOrg: "九州ネットワークセンター", remarks: "高負荷施設" }
]