import { Facility } from '@/lib/supabase'

// CSVから読み込んだ施設データ
export const facilitiesFromCSV: Facility[] = [
  // 関東エリア
  { id: 1, name: "さいたま第1ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "さいたま市", address: "埼玉県さいたま市5丁目4-26", lat: 35.8617, lng: 139.6455, status: "normal" },
  { id: 2, name: "宇都宮第1ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市5丁目14-20", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 3, name: "川越ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "川越市", address: "埼玉県川越市3丁目4-22", lat: 35.9251, lng: 139.4858, status: "normal" },
  { id: 4, name: "つくば第1ヘッドエンド", region: "関東", prefecture: "茨城県", city: "つくば市", address: "茨城県つくば市5丁目7-9", lat: 36.0834, lng: 140.0764, status: "normal" },
  { id: 5, name: "高崎第1ヘッドエンド", region: "関東", prefecture: "群馬県", city: "高崎市", address: "群馬県高崎市5丁目6-11", lat: 36.3228, lng: 139.0031, status: "warning" },
  { id: 6, name: "水戸第1ヘッドエンド", region: "関東", prefecture: "茨城県", city: "水戸市", address: "茨城県水戸市3丁目6-27", lat: 36.3659, lng: 140.4713, status: "normal" },
  { id: 7, name: "新宿ヘッドエンド", region: "関東", prefecture: "東京都", city: "新宿区", address: "東京都新宿区5丁目13-29", lat: 35.6896, lng: 139.6917, status: "normal" },
  { id: 8, name: "水戸第2ヘッドエンド", region: "関東", prefecture: "茨城県", city: "水戸市", address: "茨城県水戸市2丁目6-27", lat: 36.3659, lng: 140.4713, status: "normal" },
  { id: 9, name: "前橋第1ヘッドエンド", region: "関東", prefecture: "群馬県", city: "前橋市", address: "群馬県前橋市1丁目13-29", lat: 36.3906, lng: 139.0604, status: "normal" },
  { id: 10, name: "宇都宮第2ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市3丁目18-26", lat: 36.5658, lng: 139.8836, status: "critical" },
  { id: 11, name: "宇都宮第3ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市3丁目4-19", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 12, name: "横浜第1ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "横浜市", address: "神奈川県横浜市4丁目1-3", lat: 35.4437, lng: 139.6380, status: "normal" },
  { id: 13, name: "横浜第2ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "横浜市", address: "神奈川県横浜市1丁目11-29", lat: 35.4437, lng: 139.6380, status: "normal" },
  { id: 14, name: "宇都宮第4ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市4丁目16-27", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 15, name: "船橋ヘッドエンド", region: "関東", prefecture: "千葉県", city: "船橋市", address: "千葉県船橋市2丁目9-30", lat: 35.6947, lng: 139.9825, status: "normal" },
  { id: 16, name: "松戸第1ヘッドエンド", region: "関東", prefecture: "千葉県", city: "松戸市", address: "千葉県松戸市4丁目2-17", lat: 35.7808, lng: 139.9011, status: "warning" },
  { id: 17, name: "宇都宮第5ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市2丁目2-29", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 18, name: "前橋第2ヘッドエンド", region: "関東", prefecture: "群馬県", city: "前橋市", address: "群馬県前橋市3丁目3-13", lat: 36.3906, lng: 139.0604, status: "normal" },
  { id: 19, name: "前橋第3ヘッドエンド", region: "関東", prefecture: "群馬県", city: "前橋市", address: "群馬県前橋市2丁目1-14", lat: 36.3906, lng: 139.0604, status: "normal" },
  { id: 20, name: "宇都宮第6ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市1丁目6-6", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 21, name: "市川ヘッドエンド", region: "関東", prefecture: "千葉県", city: "市川市", address: "千葉県市川市2丁目1-8", lat: 35.7219, lng: 139.9312, status: "normal" },
  { id: 22, name: "さいたま第2ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "さいたま市", address: "埼玉県さいたま市4丁目20-19", lat: 35.8617, lng: 139.6455, status: "normal" },
  { id: 23, name: "川崎ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "川崎市", address: "神奈川県川崎市5丁目4-22", lat: 35.5309, lng: 139.7027, status: "critical" },
  { id: 24, name: "高崎第2ヘッドエンド", region: "関東", prefecture: "群馬県", city: "高崎市", address: "群馬県高崎市1丁目18-13", lat: 36.3228, lng: 139.0031, status: "normal" },
  { id: 25, name: "横浜第3ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "横浜市", address: "神奈川県横浜市1丁目1-10", lat: 35.4437, lng: 139.6380, status: "normal" },
  { id: 26, name: "横浜第4ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "横浜市", address: "神奈川県横浜市3丁目10-13", lat: 35.4437, lng: 139.6380, status: "normal" },
  { id: 27, name: "練馬第1ヘッドエンド", region: "関東", prefecture: "東京都", city: "練馬区", address: "東京都練馬区3丁目7-25", lat: 35.7357, lng: 139.6515, status: "normal" },
  { id: 28, name: "千葉第1ヘッドエンド", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市5丁目11-2", lat: 35.6074, lng: 140.1065, status: "normal" },
  { id: 29, name: "高崎第3ヘッドエンド", region: "関東", prefecture: "群馬県", city: "高崎市", address: "群馬県高崎市1丁目6-25", lat: 36.3228, lng: 139.0031, status: "normal" },
  { id: 30, name: "水戸第3ヘッドエンド", region: "関東", prefecture: "茨城県", city: "水戸市", address: "茨城県水戸市2丁目10-1", lat: 36.3659, lng: 140.4713, status: "warning" },
  { id: 31, name: "江東ヘッドエンド", region: "関東", prefecture: "東京都", city: "江東区", address: "東京都江東区4丁目20-30", lat: 35.6731, lng: 139.8171, status: "normal" },
  { id: 32, name: "港ヘッドエンド", region: "関東", prefecture: "東京都", city: "港区", address: "東京都港区2丁目6-16", lat: 35.6580, lng: 139.7516, status: "normal" },
  { id: 33, name: "千葉第2ヘッドエンド", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市2丁目18-28", lat: 35.6074, lng: 140.1065, status: "normal" },
  { id: 34, name: "練馬第2ヘッドエンド", region: "関東", prefecture: "東京都", city: "練馬区", address: "東京都練馬区4丁目8-4", lat: 35.7357, lng: 139.6515, status: "normal" },
  { id: 35, name: "さいたま第3ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "さいたま市", address: "埼玉県さいたま市5丁目10-29", lat: 35.8617, lng: 139.6455, status: "normal" },
  { id: 36, name: "松戸第2ヘッドエンド", region: "関東", prefecture: "千葉県", city: "松戸市", address: "千葉県松戸市1丁目6-21", lat: 35.7808, lng: 139.9011, status: "normal" },
  { id: 37, name: "千葉第3ヘッドエンド", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市4丁目17-16", lat: 35.6074, lng: 140.1065, status: "maintenance" },
  { id: 38, name: "宇都宮第7ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市5丁目10-9", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 39, name: "宇都宮第8ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市3丁目12-1", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 40, name: "所沢ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "所沢市", address: "埼玉県所沢市5丁目13-16", lat: 35.7990, lng: 139.4689, status: "normal" },
  { id: 41, name: "つくば第2ヘッドエンド", region: "関東", prefecture: "茨城県", city: "つくば市", address: "茨城県つくば市5丁目6-7", lat: 36.0834, lng: 140.0764, status: "normal" },
  { id: 42, name: "宇都宮第9ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市5丁目7-13", lat: 36.5658, lng: 139.8836, status: "normal" },
  { id: 43, name: "宇都宮第10ヘッドエンド", region: "関東", prefecture: "栃木県", city: "宇都宮市", address: "栃木県宇都宮市4丁目7-23", lat: 36.5658, lng: 139.8836, status: "critical" },
  { id: 44, name: "千葉第4ヘッドエンド", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市4丁目2-6", lat: 35.6074, lng: 140.1065, status: "normal" },
  { id: 45, name: "江戸川ヘッドエンド", region: "関東", prefecture: "東京都", city: "江戸川区", address: "東京都江戸川区2丁目14-4", lat: 35.7066, lng: 139.8679, status: "normal" },
  { id: 46, name: "水戸第4ヘッドエンド", region: "関東", prefecture: "茨城県", city: "水戸市", address: "茨城県水戸市1丁目16-24", lat: 36.3659, lng: 140.4713, status: "normal" },
  { id: 47, name: "さいたま第4ヘッドエンド", region: "関東", prefecture: "埼玉県", city: "さいたま市", address: "埼玉県さいたま市4丁目4-8", lat: 35.8617, lng: 139.6455, status: "normal" },
  { id: 48, name: "川崎第2ヘッドエンド", region: "関東", prefecture: "神奈川県", city: "川崎市", address: "神奈川県川崎市4丁目8-6", lat: 35.5309, lng: 139.7027, status: "normal" },
  { id: 49, name: "高崎第4ヘッドエンド", region: "関東", prefecture: "群馬県", city: "高崎市", address: "群馬県高崎市3丁目15-25", lat: 36.3228, lng: 139.0031, status: "normal" },
  { id: 50, name: "高崎第5ヘッドエンド", region: "関東", prefecture: "群馬県", city: "高崎市", address: "群馬県高崎市4丁目14-15", lat: 36.3228, lng: 139.0031, status: "normal" },
  
  // 関西エリア
  { id: 51, name: "京都第1ヘッドエンド", region: "関西", prefecture: "京都府", city: "京都市", address: "京都府京都市1丁目9-23", lat: 35.0116, lng: 135.7681, status: "normal" },
  { id: 52, name: "京都第2ヘッドエンド", region: "関西", prefecture: "京都府", city: "京都市", address: "京都府京都市3丁目14-29", lat: 35.0116, lng: 135.7681, status: "normal" },
  { id: 53, name: "宇治第1ヘッドエンド", region: "関西", prefecture: "京都府", city: "宇治市", address: "京都府宇治市4丁目3-21", lat: 34.8843, lng: 135.7999, status: "warning" },
  { id: 54, name: "奈良第1ヘッドエンド", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市5丁目8-22", lat: 34.6851, lng: 135.8050, status: "normal" },
  { id: 55, name: "奈良第2ヘッドエンド", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市1丁目14-14", lat: 34.6851, lng: 135.8050, status: "normal" },
  { id: 56, name: "宇治第2ヘッドエンド", region: "関西", prefecture: "京都府", city: "宇治市", address: "京都府宇治市4丁目8-28", lat: 34.8843, lng: 135.7999, status: "normal" },
  { id: 57, name: "宇治第3ヘッドエンド", region: "関西", prefecture: "京都府", city: "宇治市", address: "京都府宇治市2丁目7-2", lat: 34.8843, lng: 135.7999, status: "normal" },
  { id: 58, name: "和歌山第1ヘッドエンド", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市1丁目19-1", lat: 34.2306, lng: 135.1708, status: "normal" },
  { id: 59, name: "和歌山第2ヘッドエンド", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市4丁目3-13", lat: 34.2306, lng: 135.1708, status: "critical" },
  { id: 60, name: "奈良第3ヘッドエンド", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市4丁目1-28", lat: 34.6851, lng: 135.8050, status: "normal" },
  { id: 61, name: "西宮ヘッドエンド", region: "関西", prefecture: "兵庫県", city: "西宮市", address: "兵庫県西宮市1丁目13-23", lat: 34.7377, lng: 135.3416, status: "normal" },
  { id: 62, name: "奈良第4ヘッドエンド", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市4丁目3-13", lat: 34.6851, lng: 135.8050, status: "normal" },
  { id: 63, name: "神戸ヘッドエンド", region: "関西", prefecture: "兵庫県", city: "神戸市", address: "兵庫県神戸市2丁目9-28", lat: 34.6901, lng: 135.1955, status: "normal" },
  { id: 64, name: "奈良第5ヘッドエンド", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市5丁目20-15", lat: 34.6851, lng: 135.8050, status: "normal" },
  { id: 65, name: "大阪第1ヘッドエンド", region: "関西", prefecture: "大阪府", city: "大阪市", address: "大阪府大阪市3丁目19-11", lat: 34.6937, lng: 135.5023, status: "normal" },
  { id: 66, name: "東大阪ヘッドエンド", region: "関西", prefecture: "大阪府", city: "東大阪市", address: "大阪府東大阪市5丁目13-16", lat: 34.6795, lng: 135.6007, status: "warning" },
  { id: 67, name: "大津第1ヘッドエンド", region: "関西", prefecture: "滋賀県", city: "大津市", address: "滋賀県大津市4丁目1-25", lat: 35.0045, lng: 135.8688, status: "normal" },
  { id: 68, name: "大阪第2ヘッドエンド", region: "関西", prefecture: "大阪府", city: "大阪市", address: "大阪府大阪市1丁目6-1", lat: 34.6937, lng: 135.5023, status: "normal" },
  { id: 69, name: "大津第2ヘッドエンド", region: "関西", prefecture: "滋賀県", city: "大津市", address: "滋賀県大津市1丁目8-17", lat: 35.0045, lng: 135.8688, status: "normal" },
  { id: 70, name: "和歌山第3ヘッドエンド", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市5丁目20-8", lat: 34.2306, lng: 135.1708, status: "maintenance" }
]

// Helper function to get random status for demo
function getRandomStatus(): 'normal' | 'warning' | 'critical' | 'maintenance' {
  const rand = Math.random()
  if (rand < 0.7) return 'normal'
  if (rand < 0.85) return 'warning'
  if (rand < 0.95) return 'critical'
  return 'maintenance'
}

// Apply random status to some facilities for demo
facilitiesFromCSV.forEach((facility, index) => {
  if (index % 7 === 0) facility.status = 'warning'
  if (index % 13 === 0) facility.status = 'critical'
  if (index % 19 === 0) facility.status = 'maintenance'
})