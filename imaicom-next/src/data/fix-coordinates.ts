// 地域ごとの正しい緯度経度範囲
export const regionCoordinateRanges = {
  北海道: {
    latRange: [41.5, 45.5],
    lngRange: [139.5, 145.5],
    // 主要都市の座標
    cities: {
      札幌: { lat: 43.0642, lng: 141.3469 },
      函館: { lat: 41.7688, lng: 140.7290 },
      旭川: { lat: 43.7708, lng: 142.3650 },
      釧路: { lat: 42.9849, lng: 144.3820 },
      帯広: { lat: 42.9237, lng: 143.1965 }
    }
  },
  東北: {
    latRange: [36.5, 41.0],
    lngRange: [139.5, 141.5],
    cities: {
      仙台: { lat: 38.2682, lng: 140.8694 },
      青森: { lat: 40.8246, lng: 140.7406 },
      盛岡: { lat: 39.7036, lng: 141.1527 },
      秋田: { lat: 39.7186, lng: 140.1024 },
      山形: { lat: 38.2404, lng: 140.3634 },
      福島: { lat: 37.7500, lng: 140.4678 }
    }
  },
  関東: {
    latRange: [35.0, 37.0],
    lngRange: [138.5, 140.5],
    cities: {
      東京: { lat: 35.6762, lng: 139.6503 },
      横浜: { lat: 35.4437, lng: 139.6380 },
      千葉: { lat: 35.6074, lng: 140.1065 },
      さいたま: { lat: 35.8617, lng: 139.6455 },
      宇都宮: { lat: 36.5658, lng: 139.8836 },
      前橋: { lat: 36.3906, lng: 139.0604 },
      水戸: { lat: 36.3412, lng: 140.4468 }
    }
  },
  中部: {
    latRange: [34.5, 37.5],
    lngRange: [136.0, 139.0],
    cities: {
      名古屋: { lat: 35.1814, lng: 136.9064 },
      金沢: { lat: 36.5946, lng: 136.6255 },
      新潟: { lat: 37.9161, lng: 139.0364 },
      長野: { lat: 36.6513, lng: 138.1810 },
      静岡: { lat: 34.9756, lng: 138.3828 },
      富山: { lat: 36.6958, lng: 137.2113 },
      岐阜: { lat: 35.3912, lng: 136.7223 },
      山梨: { lat: 35.6635, lng: 138.5683 }
    }
  },
  関西: {
    latRange: [33.5, 36.0],
    lngRange: [134.0, 136.5],
    cities: {
      大阪: { lat: 34.6937, lng: 135.5023 },
      京都: { lat: 35.0116, lng: 135.7681 },
      神戸: { lat: 34.6901, lng: 135.1955 },
      奈良: { lat: 34.6851, lng: 135.8050 },
      和歌山: { lat: 34.2306, lng: 135.1708 },
      大津: { lat: 35.0045, lng: 135.8688 }
    }
  },
  中国: {
    latRange: [34.0, 36.0],
    lngRange: [131.0, 134.5],
    cities: {
      広島: { lat: 34.3963, lng: 132.4596 },
      岡山: { lat: 34.6617, lng: 133.9350 },
      山口: { lat: 34.1785, lng: 131.4737 },
      鳥取: { lat: 35.5036, lng: 134.2383 },
      島根: { lat: 35.4723, lng: 133.0505 }
    }
  },
  四国: {
    latRange: [32.5, 34.5],
    lngRange: [132.5, 134.5],
    cities: {
      高松: { lat: 34.3401, lng: 134.0434 },
      松山: { lat: 33.8416, lng: 132.7657 },
      高知: { lat: 33.5589, lng: 133.5314 },
      徳島: { lat: 34.0658, lng: 134.5593 }
    }
  },
  九州: {
    latRange: [31.0, 34.0],
    lngRange: [129.5, 132.0],
    cities: {
      福岡: { lat: 33.5904, lng: 130.4017 },
      北九州: { lat: 33.8835, lng: 130.8752 },
      長崎: { lat: 32.7448, lng: 129.8737 },
      熊本: { lat: 32.8032, lng: 130.7079 },
      鹿児島: { lat: 31.5966, lng: 130.5571 },
      宮崎: { lat: 31.9078, lng: 131.4202 },
      大分: { lat: 33.2382, lng: 131.6126 },
      佐賀: { lat: 33.2491, lng: 130.2988 },
      那覇: { lat: 26.2124, lng: 127.6792 }
    }
  }
}

// 都道府県から適切な座標を生成
export function generateCoordinatesForPrefecture(prefecture: string, cityName: string, index: number): { lat: number, lng: number } {
  // 都道府県から地域を判定
  const prefectureToRegion: { [key: string]: string } = {
    '北海道': '北海道',
    '青森県': '東北', '岩手県': '東北', '宮城県': '東北', '秋田県': '東北', '山形県': '東北', '福島県': '東北',
    '茨城県': '関東', '栃木県': '関東', '群馬県': '関東', '埼玉県': '関東', '千葉県': '関東', '東京都': '関東', '神奈川県': '関東',
    '新潟県': '中部', '富山県': '中部', '石川県': '中部', '福井県': '中部', '山梨県': '中部', '長野県': '中部', '岐阜県': '中部', '静岡県': '中部', '愛知県': '中部',
    '三重県': '関西', '滋賀県': '関西', '京都府': '関西', '大阪府': '関西', '兵庫県': '関西', '奈良県': '関西', '和歌山県': '関西',
    '鳥取県': '中国', '島根県': '中国', '岡山県': '中国', '広島県': '中国', '山口県': '中国',
    '徳島県': '四国', '香川県': '四国', '愛媛県': '四国', '高知県': '四国',
    '福岡県': '九州', '佐賀県': '九州', '長崎県': '九州', '熊本県': '九州', '大分県': '九州', '宮崎県': '九州', '鹿児島県': '九州', '沖縄県': '九州'
  }

  const region = prefectureToRegion[prefecture]
  if (!region) return { lat: 35.6762, lng: 139.6503 } // デフォルト：東京

  const regionData = regionCoordinateRanges[region as keyof typeof regionCoordinateRanges]
  
  // 都市名から主要都市の座標を探す
  for (const [city, coords] of Object.entries(regionData.cities)) {
    if (cityName.includes(city) || city.includes(cityName.replace('市', ''))) {
      // 主要都市の座標から少しずらして配置
      const offset = index * 0.01
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.1 + offset,
        lng: coords.lng + (Math.random() - 0.5) * 0.1 + offset
      }
    }
  }

  // 主要都市でない場合は、県庁所在地の座標を使用
  const prefectureCapitals: { [key: string]: { lat: number, lng: number } } = {
    '埼玉県': { lat: 35.8617, lng: 139.6455 },
    '栃木県': { lat: 36.5658, lng: 139.8836 },
    '群馬県': { lat: 36.3906, lng: 139.0604 },
    '茨城県': { lat: 36.3412, lng: 140.4468 },
    '千葉県': { lat: 35.6074, lng: 140.1065 },
    '東京都': { lat: 35.6762, lng: 139.6503 },
    '神奈川県': { lat: 35.4437, lng: 139.6380 },
    '福島県': { lat: 37.7500, lng: 140.4678 },
    '山形県': { lat: 38.2404, lng: 140.3634 },
    '岩手県': { lat: 39.7036, lng: 141.1527 },
    '秋田県': { lat: 39.7186, lng: 140.1024 },
    '青森県': { lat: 40.8246, lng: 140.7406 },
    '富山県': { lat: 36.6958, lng: 137.2113 },
    '愛知県': { lat: 35.1814, lng: 136.9064 },
    '山梨県': { lat: 35.6635, lng: 138.5683 },
    '石川県': { lat: 36.5946, lng: 136.6255 },
    '静岡県': { lat: 34.9756, lng: 138.3828 },
    '新潟県': { lat: 37.9161, lng: 139.0364 },
    '長野県': { lat: 36.6513, lng: 138.1810 },
    '岐阜県': { lat: 35.3912, lng: 136.7223 },
    '滋賀県': { lat: 35.0045, lng: 135.8688 },
    '兵庫県': { lat: 34.6901, lng: 135.1955 },
    '和歌山県': { lat: 34.2306, lng: 135.1708 },
    '京都府': { lat: 35.0116, lng: 135.7681 },
    '奈良県': { lat: 34.6851, lng: 135.8050 },
    '広島県': { lat: 34.3963, lng: 132.4596 },
    '岡山県': { lat: 34.6617, lng: 133.9350 },
    '鳥取県': { lat: 35.5036, lng: 134.2383 },
    '島根県': { lat: 35.4723, lng: 133.0505 },
    '山口県': { lat: 34.1785, lng: 131.4737 },
    '香川県': { lat: 34.3401, lng: 134.0434 },
    '愛媛県': { lat: 33.8416, lng: 132.7657 },
    '徳島県': { lat: 34.0658, lng: 134.5593 },
    '高知県': { lat: 33.5589, lng: 133.5314 },
    '熊本県': { lat: 32.8032, lng: 130.7079 },
    '長崎県': { lat: 32.7448, lng: 129.8737 },
    '宮崎県': { lat: 31.9078, lng: 131.4202 },
    '鹿児島県': { lat: 31.5966, lng: 130.5571 },
    '佐賀県': { lat: 33.2491, lng: 130.2988 },
    '福岡県': { lat: 33.5904, lng: 130.4017 },
    '沖縄県': { lat: 26.2124, lng: 127.6792 }
  }

  if (prefectureCapitals[prefecture]) {
    const coords = prefectureCapitals[prefecture]
    // 県庁所在地から少しずらして配置
    const offset = index * 0.02
    return {
      lat: coords.lat + (Math.random() - 0.5) * 0.2 + offset,
      lng: coords.lng + (Math.random() - 0.5) * 0.2 + offset
    }
  }

  // それでも見つからない場合は地域の中心付近にランダム配置
  const [minLat, maxLat] = regionData.latRange
  const [minLng, maxLng] = regionData.lngRange
  
  return {
    lat: minLat + (maxLat - minLat) * Math.random(),
    lng: minLng + (maxLng - minLng) * Math.random()
  }
}