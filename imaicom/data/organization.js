// IMAICOM 組織構造と施設管理者データ

export const organizationStructure = {
  company: "株式会社IMAICOM",
  headquarters: "東京都千代田区丸の内1-9-1",
  
  // 経営層
  executives: {
    ceo: {
      name: "今井 一郎",
      title: "代表取締役社長",
      email: "imai.ichiro@imaicom.jp",
      phone: "03-1234-5001"
    },
    cto: {
      name: "技術 太郎",
      title: "取締役CTO",
      email: "gijutsu.taro@imaicom.jp",
      phone: "03-1234-5002"
    },
    coo: {
      name: "運営 花子",
      title: "取締役COO",
      email: "unei.hanako@imaicom.jp",
      phone: "03-1234-5003"
    }
  },
  
  // 本社部門
  departments: {
    technical: {
      name: "技術統括部",
      manager: {
        name: "エンジニア 次郎",
        title: "技術統括部長",
        email: "engineer.jiro@imaicom.jp",
        phone: "03-1234-5010"
      },
      sections: [
        {
          name: "ネットワーク技術課",
          head: "ネット 三郎"
        },
        {
          name: "放送技術課",
          head: "放送 四郎"
        },
        {
          name: "保守技術課",
          head: "保守 五郎"
        }
      ]
    },
    operations: {
      name: "運用管理部",
      manager: {
        name: "運用 管理子",
        title: "運用管理部長",
        email: "kanri.ko@imaicom.jp",
        phone: "03-1234-5020"
      },
      sections: [
        {
          name: "24時間監視センター",
          head: "監視 一夫"
        },
        {
          name: "カスタマーサポート課",
          head: "サポート 二美"
        }
      ]
    }
  }
};

// 地域別施設管理者
export const facilityManagers = {
  // 北海道エリア
  1: {
    facilityId: 1,
    facilityName: "札幌中央ヘッドエンド",
    manager: {
      name: "北海 道男",
      title: "施設長",
      email: "hokkai.michio@imaicom.jp",
      phone: "011-234-5001",
      mobile: "090-1234-5001"
    },
    deputy: {
      name: "札幌 太一",
      title: "副施設長",
      email: "sapporo.taichi@imaicom.jp"
    },
    technicians: [
      { name: "技術 一郎", speciality: "光伝送" },
      { name: "技術 二郎", speciality: "放送系" },
      { name: "技術 三郎", speciality: "電源設備" }
    ],
    outsourcePartners: [
      {
        company: "北海道通信サービス",
        contact: "外注 太郎",
        phone: "011-345-6789",
        contract: "光ファイバー保守"
      }
    ]
  },
  
  2: {
    facilityId: 2,
    facilityName: "函館ヘッドエンド",
    manager: {
      name: "函館 次郎",
      title: "施設長",
      email: "hakodate.jiro@imaicom.jp",
      phone: "0138-234-5002",
      mobile: "090-1234-5002"
    },
    technicians: [
      { name: "保守 一郎", speciality: "総合保守" },
      { name: "保守 二郎", speciality: "放送系" }
    ]
  },
  
  // 東北エリア
  11: {
    facilityId: 11,
    facilityName: "仙台中央ヘッドエンド",
    manager: {
      name: "東北 統括",
      title: "東北エリア統括施設長",
      email: "tohoku.tokatsu@imaicom.jp",
      phone: "022-234-5011",
      mobile: "090-1234-5011"
    },
    deputy: {
      name: "仙台 守",
      title: "副施設長",
      email: "sendai.mamoru@imaicom.jp"
    },
    technicians: [
      { name: "復興 一郎", speciality: "光伝送" },
      { name: "復興 二郎", speciality: "放送系" },
      { name: "復興 三郎", speciality: "電源設備" },
      { name: "復興 四郎", speciality: "空調設備" }
    ]
  },
  
  // 関東エリア
  23: {
    facilityId: 23,
    facilityName: "東京中央ヘッドエンド",
    manager: {
      name: "関東 総司",
      title: "関東エリア統括施設長",
      email: "kanto.soji@imaicom.jp",
      phone: "03-234-5023",
      mobile: "090-1234-5023"
    },
    deputy: {
      name: "東京 一郎",
      title: "副施設長",
      email: "tokyo.ichiro@imaicom.jp"
    },
    technicians: [
      { name: "首都 一郎", speciality: "光伝送" },
      { name: "首都 二郎", speciality: "IP系" },
      { name: "首都 三郎", speciality: "放送系" },
      { name: "首都 四郎", speciality: "電源設備" },
      { name: "首都 五郎", speciality: "空調設備" },
      { name: "首都 六郎", speciality: "セキュリティ" }
    ],
    outsourcePartners: [
      {
        company: "東京テクニカルサービス",
        contact: "技術 太郎",
        phone: "03-456-7890",
        contract: "24時間緊急対応"
      }
    ]
  },
  
  // 中部エリア
  43: {
    facilityId: 43,
    facilityName: "名古屋中央ヘッドエンド",
    manager: {
      name: "中部 統一",
      title: "中部エリア統括施設長",
      email: "chubu.toichi@imaicom.jp",
      phone: "052-234-5043",
      mobile: "090-1234-5043"
    },
    technicians: [
      { name: "名古屋 一郎", speciality: "光伝送" },
      { name: "名古屋 二郎", speciality: "放送系" },
      { name: "名古屋 三郎", speciality: "電源設備" }
    ]
  },
  
  // 関西エリア
  58: {
    facilityId: 58,
    facilityName: "大阪中央ヘッドエンド",
    manager: {
      name: "関西 統括",
      title: "関西エリア統括施設長",
      email: "kansai.tokatsu@imaicom.jp",
      phone: "06-234-5058",
      mobile: "090-1234-5058"
    },
    deputy: {
      name: "大阪 守",
      title: "副施設長",
      email: "osaka.mamoru@imaicom.jp"
    },
    technicians: [
      { name: "浪速 一郎", speciality: "光伝送" },
      { name: "浪速 二郎", speciality: "放送系" },
      { name: "浪速 三郎", speciality: "電源設備" },
      { name: "浪速 四郎", speciality: "空調設備" }
    ]
  },
  
  // 中国エリア
  76: {
    facilityId: 76,
    facilityName: "広島中央ヘッドエンド",
    manager: {
      name: "中国 統一",
      title: "中国エリア統括施設長",
      email: "chugoku.toichi@imaicom.jp",
      phone: "082-234-5076",
      mobile: "090-1234-5076"
    },
    technicians: [
      { name: "広島 一郎", speciality: "総合保守" },
      { name: "広島 二郎", speciality: "放送系" }
    ]
  },
  
  // 四国エリア
  86: {
    facilityId: 86,
    facilityName: "高松ヘッドエンド",
    manager: {
      name: "四国 統括",
      title: "四国エリア統括施設長",
      email: "shikoku.tokatsu@imaicom.jp",
      phone: "087-234-5086",
      mobile: "090-1234-5086"
    },
    technicians: [
      { name: "讃岐 一郎", speciality: "総合保守" },
      { name: "讃岐 二郎", speciality: "放送系" }
    ]
  },
  
  // 九州・沖縄エリア
  94: {
    facilityId: 94,
    facilityName: "福岡中央ヘッドエンド",
    manager: {
      name: "九州 統括",
      title: "九州エリア統括施設長",
      email: "kyushu.tokatsu@imaicom.jp",
      phone: "092-234-5094",
      mobile: "090-1234-5094"
    },
    deputy: {
      name: "博多 守",
      title: "副施設長",
      email: "hakata.mamoru@imaicom.jp"
    },
    technicians: [
      { name: "九州 一郎", speciality: "光伝送" },
      { name: "九州 二郎", speciality: "放送系" },
      { name: "九州 三郎", speciality: "電源設備" }
    ]
  }
};

// 保守契約業者リスト
export const maintenanceContractors = [
  {
    id: "MC-001",
    company: "全国通信保守サービス株式会社",
    contractType: "年間保守契約",
    coverage: "全国",
    services: ["光ファイバー保守", "伝送装置保守", "24時間対応"],
    contact: {
      name: "契約 太郎",
      phone: "03-9876-5432",
      email: "keiyaku@zenkoku-tsushin.jp"
    }
  },
  {
    id: "MC-002",
    company: "株式会社テクニカルサポート",
    contractType: "スポット契約",
    coverage: "関東・中部",
    services: ["放送機器保守", "エンコーダー保守"],
    contact: {
      name: "技術 次郎",
      phone: "03-8765-4321",
      email: "support@technical.jp"
    }
  },
  {
    id: "MC-003",
    company: "空調設備メンテナンス株式会社",
    contractType: "年間保守契約",
    coverage: "全国",
    services: ["空調設備保守", "フィルター交換", "緊急対応"],
    contact: {
      name: "空調 三郎",
      phone: "03-7654-3210",
      email: "kucho@maintenance.jp"
    }
  }
];

// エスカレーションフロー
export const escalationFlow = {
  level1: {
    title: "現場対応",
    responder: "施設技術者",
    timeLimit: "30分",
    actions: ["初期診断", "リセット対応", "予備機切替"]
  },
  level2: {
    title: "施設長対応",
    responder: "施設長/副施設長",
    timeLimit: "1時間",
    actions: ["保守業者連絡", "本社技術部連絡", "影響範囲確認"]
  },
  level3: {
    title: "エリア統括対応",
    responder: "エリア統括施設長",
    timeLimit: "2時間",
    actions: ["広域影響確認", "代替ルート検討", "本社報告"]
  },
  level4: {
    title: "本社対応",
    responder: "技術統括部長/CTO",
    timeLimit: "即時",
    actions: ["全社対応指示", "対外発表判断", "経営層報告"]
  }
};