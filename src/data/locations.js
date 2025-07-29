// 4DGS撮影場所の座標データ
export const contentLocations = {
  1: {
    coordinates: [136.964694, 35.170915],
    venue: "名古屋ドーム",
    city: "名古屋",
    capacity: 40500
  },
  2: {
    coordinates: [139.817413, 35.693841],
    venue: "東京ドーム", 
    city: "東京",
    capacity: 55000
  },
  3: {
    coordinates: [139.710070, 35.674000],
    venue: "日本武道館",
    city: "東京",
    capacity: 14471
  },
  4: {
    coordinates: [139.703992, 35.645736],
    venue: "Zepp Tokyo",
    city: "東京",
    capacity: 2709
  },
  5: {
    coordinates: [139.702687, 35.670168],
    venue: "表参道ヒルズ",
    city: "東京",
    capacity: null
  },
  6: {
    coordinates: [139.748135, 35.683211],
    venue: "帝国劇場",
    city: "東京",
    capacity: 1897
  }
}

// マップスタイル設定
export const mapStyles = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  cyber: 'mapbox://styles/mapbox/dark-v11' // カスタムスタイルに変更可能
}

// マップ初期設定
export const mapConfig = {
  japan: {
    center: [136.906605, 35.180188],
    zoom: 5.5,
    pitch: 45,
    bearing: -20
  },
  tokyo: {
    center: [139.7690, 35.6804],
    zoom: 11,
    pitch: 60,
    bearing: -30
  }
}