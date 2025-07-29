import { Facility } from '@/lib/supabase'

// 新リスト.csvから読み込んだ施設データ
export const facilitiesFromNewCSV: Facility[] = [
  // 北海道エリア
  { id: 1, name: "北海道 第1施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目20-2", lat: 37.061564, lng: 136.735594, status: "normal" },
  { id: 2, name: "北海道 第2施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市4丁目7-2", lat: 44.543708, lng: 142.602601, status: "normal" },
  { id: 3, name: "北海道 第3施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市5丁目6-23", lat: 36.436802, lng: 140.631664, status: "normal" },
  { id: 4, name: "北海道 第4施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目2-10", lat: 43.663496, lng: 133.890312, status: "normal" },
  { id: 5, name: "北海道 第5施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目8-2", lat: 38.980321, lng: 138.213693, status: "warning" },
  { id: 6, name: "北海道 第6施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目9-24", lat: 35.054385, lng: 142.824502, status: "normal" },
  { id: 7, name: "北海道 第7施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目2-14", lat: 41.653102, lng: 142.410453, status: "normal" },
  { id: 8, name: "北海道 第8施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市3丁目6-25", lat: 37.779791, lng: 130.247032, status: "normal" },
  { id: 9, name: "北海道 第9施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目11-26", lat: 38.118217, lng: 131.613201, status: "normal" },
  { id: 10, name: "北海道 第10施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市4丁目8-23", lat: 34.72558, lng: 138.950755, status: "normal" },
  { id: 11, name: "北海道 第11施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目16-11", lat: 44.053757, lng: 138.028459, status: "normal" },
  { id: 12, name: "北海道 第12施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市1丁目14-10", lat: 41.681909, lng: 141.871321, status: "normal" },
  { id: 13, name: "北海道 第13施設", region: "北海道", prefecture: "北海道", city: "北海市", address: "北海道北海市2丁目16-22", lat: 34.523636, lng: 139.408576, status: "critical" },

  // 東北エリア
  { id: 14, name: "東北 第14施設", region: "東北", prefecture: "福島県", city: "福島市", address: "福島県福島市3丁目7-28", lat: 34.130382, lng: 131.936476, status: "normal" },
  { id: 15, name: "東北 第15施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市1丁目9-11", lat: 33.033046, lng: 141.45369, status: "normal" },
  { id: 16, name: "東北 第16施設", region: "東北", prefecture: "岩手県", city: "岩手市", address: "岩手県岩手市5丁目9-18", lat: 33.652585, lng: 141.574529, status: "normal" },
  { id: 17, name: "東北 第17施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市2丁目12-9", lat: 41.467643, lng: 144.826364, status: "normal" },
  { id: 18, name: "東北 第18施設", region: "東北", prefecture: "福島県", city: "福島市", address: "福島県福島市4丁目20-12", lat: 40.606403, lng: 142.669925, status: "normal" },
  { id: 19, name: "東北 第19施設", region: "東北", prefecture: "岩手県", city: "岩手市", address: "岩手県岩手市2丁目12-6", lat: 34.365534, lng: 132.691084, status: "normal" },
  { id: 20, name: "東北 第20施設", region: "東北", prefecture: "秋田県", city: "秋田市", address: "秋田県秋田市2丁目3-4", lat: 41.67192, lng: 135.005471, status: "warning" },
  { id: 21, name: "東北 第21施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市4丁目13-20", lat: 36.29327, lng: 133.103111, status: "normal" },
  { id: 22, name: "東北 第22施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市1丁目6-11", lat: 44.148392, lng: 130.575773, status: "normal" },
  { id: 23, name: "東北 第23施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市4丁目18-3", lat: 37.816233, lng: 134.160878, status: "normal" },
  { id: 24, name: "東北 第24施設", region: "東北", prefecture: "青森県", city: "青森市", address: "青森県青森市1丁目5-4", lat: 41.346987, lng: 133.687751, status: "normal" },
  { id: 25, name: "東北 第25施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市4丁目20-30", lat: 43.063042, lng: 133.476801, status: "normal" },
  { id: 26, name: "東北 第26施設", region: "東北", prefecture: "山形県", city: "山形市", address: "山形県山形市3丁目5-28", lat: 40.292235, lng: 141.235027, status: "critical" },

  // 関東エリア
  { id: 27, name: "関東 第27施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市4丁目9-28", lat: 43.443689, lng: 134.68159, status: "normal" },
  { id: 28, name: "関東 第28施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市5丁目12-5", lat: 41.036395, lng: 135.250339, status: "normal" },
  { id: 29, name: "関東 第29施設", region: "関東", prefecture: "群馬県", city: "群馬市", address: "群馬県群馬市3丁目6-26", lat: 43.06923, lng: 140.138069, status: "normal" },
  { id: 30, name: "関東 第30施設", region: "関東", prefecture: "神奈川県", city: "神奈川市", address: "神奈川県神奈川市2丁目15-12", lat: 37.783825, lng: 144.221446, status: "normal" },
  { id: 31, name: "関東 第31施設", region: "関東", prefecture: "栃木県", city: "栃木市", address: "栃木県栃木市5丁目14-20", lat: 38.604219, lng: 138.664076, status: "normal" },
  { id: 32, name: "関東 第32施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市5丁目6-28", lat: 37.869731, lng: 130.678894, status: "normal" },
  { id: 33, name: "関東 第33施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市5丁目9-28", lat: 35.33692, lng: 130.6981, status: "warning" },
  { id: 34, name: "関東 第34施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市2丁目16-1", lat: 38.994591, lng: 134.929427, status: "normal" },
  { id: 35, name: "関東 第35施設", region: "関東", prefecture: "栃木県", city: "栃木市", address: "栃木県栃木市3丁目18-8", lat: 43.353917, lng: 134.764976, status: "normal" },
  { id: 36, name: "関東 第36施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市1丁目20-28", lat: 39.677723, lng: 132.557141, status: "normal" },
  { id: 37, name: "関東 第37施設", region: "関東", prefecture: "東京都", city: "東京市", address: "東京都東京市1丁目11-5", lat: 38.953879, lng: 132.056812, status: "normal" },
  { id: 38, name: "関東 第38施設", region: "関東", prefecture: "埼玉県", city: "埼玉市", address: "埼玉県埼玉市2丁目12-14", lat: 35.08534, lng: 135.357711, status: "maintenance" },
  { id: 39, name: "関東 第39施設", region: "関東", prefecture: "千葉県", city: "千葉市", address: "千葉県千葉市4丁目10-3", lat: 33.216352, lng: 142.018522, status: "critical" },

  // 中部エリア
  { id: 40, name: "中部 第40施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目13-30", lat: 38.399825, lng: 139.001988, status: "normal" },
  { id: 41, name: "中部 第41施設", region: "中部", prefecture: "愛知県", city: "愛知市", address: "愛知県愛知市1丁目16-20", lat: 40.815422, lng: 144.688653, status: "normal" },
  { id: 42, name: "中部 第42施設", region: "中部", prefecture: "山梨県", city: "山梨市", address: "山梨県山梨市3丁目15-16", lat: 40.451303, lng: 142.368027, status: "normal" },
  { id: 43, name: "中部 第43施設", region: "中部", prefecture: "石川県", city: "石川市", address: "石川県石川市3丁目10-22", lat: 36.257015, lng: 130.621525, status: "normal" },
  { id: 44, name: "中部 第44施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目1-9", lat: 42.315071, lng: 144.223787, status: "normal" },
  { id: 45, name: "中部 第45施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市5丁目12-28", lat: 42.594568, lng: 142.842136, status: "normal" },
  { id: 46, name: "中部 第46施設", region: "中部", prefecture: "静岡県", city: "静岡市", address: "静岡県静岡市1丁目14-9", lat: 34.920847, lng: 131.253089, status: "warning" },
  { id: 47, name: "中部 第47施設", region: "中部", prefecture: "長野県", city: "長野市", address: "長野県長野市5丁目8-21", lat: 42.03824, lng: 140.094363, status: "normal" },
  { id: 48, name: "中部 第48施設", region: "中部", prefecture: "新潟県", city: "新潟市", address: "新潟県新潟市2丁目11-19", lat: 41.435115, lng: 130.300596, status: "normal" },
  { id: 49, name: "中部 第49施設", region: "中部", prefecture: "富山県", city: "富山市", address: "富山県富山市1丁目18-28", lat: 33.98033, lng: 137.50636, status: "normal" },
  { id: 50, name: "中部 第50施設", region: "中部", prefecture: "静岡県", city: "静岡市", address: "静岡県静岡市4丁目3-20", lat: 34.952807, lng: 143.241272, status: "normal" },
  { id: 51, name: "中部 第51施設", region: "中部", prefecture: "岐阜県", city: "岐阜市", address: "岐阜県岐阜市4丁目13-16", lat: 35.621407, lng: 131.192491, status: "normal" },
  { id: 52, name: "中部 第52施設", region: "中部", prefecture: "山梨県", city: "山梨市", address: "山梨県山梨市1丁目15-7", lat: 40.779699, lng: 141.525574, status: "critical" },

  // 関西エリア
  { id: 53, name: "関西 第53施設", region: "関西", prefecture: "滋賀県", city: "滋賀市", address: "滋賀県滋賀市1丁目2-15", lat: 40.551851, lng: 140.331576, status: "normal" },
  { id: 54, name: "関西 第54施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市5丁目6-8", lat: 35.391184, lng: 140.668496, status: "normal" },
  { id: 55, name: "関西 第55施設", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市2丁目19-16", lat: 36.25869, lng: 138.472242, status: "normal" },
  { id: 56, name: "関西 第56施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市3丁目9-7", lat: 34.074319, lng: 138.531337, status: "normal" },
  { id: 57, name: "関西 第57施設", region: "関西", prefecture: "滋賀県", city: "滋賀市", address: "滋賀県滋賀市2丁目7-11", lat: 38.067371, lng: 138.785661, status: "normal" },
  { id: 58, name: "関西 第58施設", region: "関西", prefecture: "和歌山県", city: "和歌山市", address: "和歌山県和歌山市1丁目17-1", lat: 41.782621, lng: 131.293215, status: "normal" },
  { id: 59, name: "関西 第59施設", region: "関西", prefecture: "京都府", city: "京都市", address: "京都府京都市5丁目1-14", lat: 38.929066, lng: 138.193737, status: "warning" },
  { id: 60, name: "関西 第60施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市2丁目11-10", lat: 39.23692, lng: 132.044409, status: "normal" },
  { id: 61, name: "関西 第61施設", region: "関西", prefecture: "兵庫県", city: "兵庫市", address: "兵庫県兵庫市1丁目1-10", lat: 40.025862, lng: 142.459229, status: "normal" },
  { id: 62, name: "関西 第62施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市1丁目12-5", lat: 37.804216, lng: 143.858485, status: "normal" },
  { id: 63, name: "関西 第63施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市1丁目6-4", lat: 40.929819, lng: 131.231706, status: "normal" },
  { id: 64, name: "関西 第64施設", region: "関西", prefecture: "奈良県", city: "奈良市", address: "奈良県奈良市2丁目18-21", lat: 38.724558, lng: 144.816339, status: "normal" },

  // 中国エリア
  { id: 65, name: "中国 第65施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市2丁目20-4", lat: 44.628007, lng: 133.192367, status: "critical" },
  { id: 66, name: "中国 第66施設", region: "中国", prefecture: "岡山県", city: "岡山市", address: "岡山県岡山市1丁目20-9", lat: 44.48575, lng: 138.19811, status: "normal" },
  { id: 67, name: "中国 第67施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市3丁目16-10", lat: 44.224336, lng: 144.12563, status: "normal" },
  { id: 68, name: "中国 第68施設", region: "中国", prefecture: "島根県", city: "島根市", address: "島根県島根市3丁目10-9", lat: 42.467431, lng: 139.683787, status: "normal" },
  { id: 69, name: "中国 第69施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市4丁目4-2", lat: 34.009658, lng: 136.859865, status: "normal" },
  { id: 70, name: "中国 第70施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市1丁目5-24", lat: 35.813764, lng: 144.360716, status: "normal" },
  { id: 71, name: "中国 第71施設", region: "中国", prefecture: "山口県", city: "山口市", address: "山口県山口市4丁目20-13", lat: 42.01057, lng: 139.319886, status: "normal" },
  { id: 72, name: "中国 第72施設", region: "中国", prefecture: "山口県", city: "山口市", address: "山口県山口市3丁目2-18", lat: 42.608659, lng: 132.87629, status: "warning" },
  { id: 73, name: "中国 第73施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市2丁目18-22", lat: 41.072132, lng: 143.087974, status: "normal" },
  { id: 74, name: "中国 第74施設", region: "中国", prefecture: "広島県", city: "広島市", address: "広島県広島市3丁目18-6", lat: 41.459255, lng: 130.115575, status: "normal" },
  { id: 75, name: "中国 第75施設", region: "中国", prefecture: "島根県", city: "島根市", address: "島根県島根市1丁目5-2", lat: 38.180415, lng: 142.719112, status: "normal" },
  { id: 76, name: "中国 第76施設", region: "中国", prefecture: "鳥取県", city: "鳥取市", address: "鳥取県鳥取市5丁目11-14", lat: 41.624997, lng: 142.69275, status: "normal" },

  // 四国エリア
  { id: 77, name: "四国 第77施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目10-29", lat: 34.832211, lng: 140.916721, status: "normal" },
  { id: 78, name: "四国 第78施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市2丁目2-23", lat: 44.081732, lng: 131.725917, status: "maintenance" },
  { id: 79, name: "四国 第79施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目19-15", lat: 44.591121, lng: 140.368056, status: "normal" },
  { id: 80, name: "四国 第80施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目7-5", lat: 38.783162, lng: 139.203988, status: "normal" },
  { id: 81, name: "四国 第81施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目9-28", lat: 33.682696, lng: 137.747244, status: "normal" },
  { id: 82, name: "四国 第82施設", region: "四国", prefecture: "徳島県", city: "徳島市", address: "徳島県徳島市3丁目3-8", lat: 40.121255, lng: 135.007737, status: "normal" },
  { id: 83, name: "四国 第83施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市3丁目6-2", lat: 41.104496, lng: 143.356913, status: "normal" },
  { id: 84, name: "四国 第84施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市2丁目16-26", lat: 38.375659, lng: 139.019252, status: "normal" },
  { id: 85, name: "四国 第85施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市5丁目19-3", lat: 39.857907, lng: 130.481126, status: "warning" },
  { id: 86, name: "四国 第86施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市4丁目20-2", lat: 42.205034, lng: 132.078423, status: "normal" },
  { id: 87, name: "四国 第87施設", region: "四国", prefecture: "愛媛県", city: "愛媛市", address: "愛媛県愛媛市5丁目11-5", lat: 38.108515, lng: 144.761668, status: "normal" },
  { id: 88, name: "四国 第88施設", region: "四国", prefecture: "香川県", city: "香川市", address: "香川県香川市4丁目9-19", lat: 37.241022, lng: 142.090073, status: "normal" },

  // 九州エリア
  { id: 89, name: "九州 第89施設", region: "九州", prefecture: "熊本県", city: "熊本市", address: "熊本県熊本市5丁目3-28", lat: 33.649715, lng: 136.067448, status: "normal" },
  { id: 90, name: "九州 第90施設", region: "九州", prefecture: "長崎県", city: "長崎市", address: "長崎県長崎市3丁目2-23", lat: 33.121244, lng: 143.107639, status: "normal" },
  { id: 91, name: "九州 第91施設", region: "九州", prefecture: "宮崎県", city: "宮崎市", address: "宮崎県宮崎市5丁目1-23", lat: 36.117496, lng: 143.216345, status: "critical" },
  { id: 92, name: "九州 第92施設", region: "九州", prefecture: "鹿児島県", city: "鹿児島市", address: "鹿児島県鹿児島市5丁目18-3", lat: 41.530588, lng: 135.819543, status: "normal" },
  { id: 93, name: "九州 第93施設", region: "九州", prefecture: "佐賀県", city: "佐賀市", address: "佐賀県佐賀市2丁目11-15", lat: 38.112778, lng: 141.332609, status: "normal" },
  { id: 94, name: "九州 第94施設", region: "九州", prefecture: "沖縄県", city: "沖縄市", address: "沖縄県沖縄市2丁目3-11", lat: 33.310778, lng: 141.300503, status: "normal" },
  { id: 95, name: "九州 第95施設", region: "九州", prefecture: "佐賀県", city: "佐賀市", address: "佐賀県佐賀市1丁目18-7", lat: 42.917068, lng: 141.49512, status: "normal" },
  { id: 96, name: "九州 第96施設", region: "九州", prefecture: "長崎県", city: "長崎市", address: "長崎県長崎市1丁目12-16", lat: 39.772838, lng: 136.109415, status: "normal" },
  { id: 97, name: "九州 第97施設", region: "九州", prefecture: "熊本県", city: "熊本市", address: "熊本県熊本市3丁目16-2", lat: 37.764389, lng: 142.388731, status: "normal" },
  { id: 98, name: "九州 第98施設", region: "九州", prefecture: "福岡県", city: "福岡市", address: "福岡県福岡市3丁目19-30", lat: 33.044176, lng: 137.732274, status: "warning" },
  { id: 99, name: "九州 第99施設", region: "九州", prefecture: "宮崎県", city: "宮崎市", address: "宮崎県宮崎市4丁目9-9", lat: 37.122647, lng: 132.274785, status: "normal" },
  { id: 100, name: "九州 第100施設", region: "九州", prefecture: "鹿児島県", city: "鹿児島市", address: "鹿児島県鹿児島市1丁目14-17", lat: 37.485648, lng: 130.684565, status: "normal" }
]

// Apply status distribution for demo
facilitiesFromNewCSV.forEach((facility, index) => {
  // 備考に基づいてステータスを設定
  const csvData = [
    { id: 1, remarks: '高負荷施設' },
    { id: 2, remarks: '試験設備あり' },
    { id: 3, remarks: '旧型ラックあり' },
    // ... 省略 ...
  ]
  
  // 7施設ごとに warning
  if ((index + 1) % 7 === 0 && facility.status === 'normal') {
    facility.status = 'warning'
  }
  
  // 13施設ごとに critical
  if ((index + 1) % 13 === 0 && facility.status === 'normal') {
    facility.status = 'critical'
  }
  
  // 19施設ごとに maintenance
  if ((index + 1) % 19 === 0 && facility.status === 'normal') {
    facility.status = 'maintenance'
  }
})