// 地域別統計データ
export const regionSummary = {
  hokkaido: {
    name: "北海道",
    facilities: 10,
    equipment: {
      total: 187,
      normal: 165,
      warning: 18,
      critical: 4
    },
    majorCities: ["札幌", "函館", "旭川", "釧路", "帯広"],
    coverage: "道内全域をカバー、冬季の機器保護が重要"
  },
  tohoku: {
    name: "東北",
    facilities: 12,
    equipment: {
      total: 224,
      normal: 198,
      warning: 22,
      critical: 4
    },
    majorCities: ["仙台", "青森", "盛岡", "秋田", "山形", "福島"],
    coverage: "東日本大震災後の耐震強化施設"
  },
  kanto: {
    name: "関東",
    facilities: 20,
    equipment: {
      total: 374,
      normal: 330,
      warning: 37,
      critical: 7
    },
    majorCities: ["東京", "横浜", "さいたま", "千葉", "川崎"],
    coverage: "日本最大の都市圏、高密度配置"
  },
  chubu: {
    name: "中部",
    facilities: 15,
    equipment: {
      total: 280,
      normal: 247,
      warning: 28,
      critical: 5
    },
    majorCities: ["名古屋", "新潟", "金沢", "静岡", "長野"],
    coverage: "日本海側と太平洋側の両方をカバー"
  },
  kansai: {
    name: "関西",
    facilities: 18,
    equipment: {
      total: 336,
      normal: 297,
      warning: 33,
      critical: 6
    },
    majorCities: ["大阪", "京都", "神戸", "奈良", "和歌山"],
    coverage: "関西圏の高密度配置、文化財地域対応"
  },
  chugoku: {
    name: "中国",
    facilities: 10,
    equipment: {
      total: 187,
      normal: 165,
      warning: 18,
      critical: 4
    },
    majorCities: ["広島", "岡山", "山口", "鳥取", "松江"],
    coverage: "山陽・山陰の両地域をカバー"
  },
  shikoku: {
    name: "四国",
    facilities: 8,
    equipment: {
      total: 149,
      normal: 131,
      warning: 15,
      critical: 3
    },
    majorCities: ["高松", "松山", "高知", "徳島"],
    coverage: "四国全域、台風対策強化地域"
  },
  kyushu: {
    name: "九州・沖縄",
    facilities: 7,
    equipment: {
      total: 131,
      normal: 115,
      warning: 13,
      critical: 3
    },
    majorCities: ["福岡", "北九州", "熊本", "鹿児島", "那覇"],
    coverage: "九州全域と沖縄、台風・火山対策"
  }
};

// 地域別の特記事項
export const regionNotes = {
  hokkaido: [
    "冬季の凍結対策として全施設に暖房設備完備",
    "降雪による通信障害対策強化",
    "非常用発電機の寒冷地仕様"
  ],
  tohoku: [
    "震災復興後の最新設備導入",
    "津波対策として高台への移設完了",
    "広域災害時のバックアップ体制強化"
  ],
  kanto: [
    "24時間監視体制の中央管理センター",
    "首都直下地震対策の耐震強化",
    "トラフィック集中への対応強化"
  ],
  chubu: [
    "東海地震対策の免震構造採用",
    "豪雪地域への特別対応",
    "リニア新幹線ルート沿いの設備強化"
  ],
  kansai: [
    "南海トラフ地震対策",
    "文化財保護地域での特別配慮",
    "大阪万博に向けた設備増強"
  ],
  chugoku: [
    "豪雨災害対策の強化",
    "山間部への安定供給体制",
    "瀬戸内海沿岸の塩害対策"
  ],
  shikoku: [
    "台風常襲地域の特別強化",
    "南海トラフ地震対策",
    "四国山地の難アクセス地域対応"
  ],
  kyushu: [
    "火山活動への対応（桜島、阿蘇山）",
    "台風対策の最重要地域",
    "離島への安定供給体制"
  ]
};