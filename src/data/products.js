// ユーザーの興味カテゴリー
export const categories = [
  'アイドル',
  'ミュージカル',
  'ダンス',
  'ライブ',
  'グラビア',
  'バラエティ'
]

export const products = [
  {
    id: 1,
    title: "上原さくら - 2032年全国ツアー名古屋公演",
    description: "2032年全国ツアーの時の名古屋での衣装を着た上原さくらさんの25歳の時のジャンプしている姿",
    price: 1000000,
    status: "active",
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
    listedAt: new Date(),
    duration: "12秒",
    resolution: "8K相当",
    fileSize: "2.8GB",
    artist: "上原さくら",
    venue: "名古屋ドーム",
    date: "2032年7月15日",
    categories: ['アイドル', 'ライブ'],
    viewCount: 15234
  },
  {
    id: 2,
    title: "橋本環奈 - Birthday Live 2031",
    description: "23歳の誕生日記念ライブでのキラキラ衣装での決めポーズ。ファンへの感謝の気持ちが込められた特別な瞬間",
    price: 1500000,
    status: "sold",
    soldAt: new Date("2024-01-15"),
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    resaleOffers: [
      { from: "0xabcd1234", amount: 2000000 },
      { from: "0xefgh5678", amount: 1800000 },
      { from: "0xijkl9012", amount: 2500000 }
    ],
    duration: "15秒",
    resolution: "8K相当",
    fileSize: "3.2GB",
    artist: "橋本環奈",
    venue: "東京ドーム",
    date: "2031年2月3日",
    categories: ['アイドル', 'ライブ'],
    viewCount: 28901
  },
  {
    id: 3,
    title: "白石麻衣 - Graduation Concert Final",
    description: "卒業コンサートのアンコールで見せた涙の笑顔。10年間の感謝を込めた最後のパフォーマンス",
    price: 2000000,
    status: "sold",
    soldAt: new Date("2024-01-10"),
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    resaleOffers: [
      { from: "0xaaaa1111", amount: 3000000 }
    ],
    duration: "20秒",
    resolution: "8K相当",
    fileSize: "4.1GB",
    artist: "白石麻衣",
    venue: "日本武道館",
    date: "2030年12月25日",
    categories: ['アイドル', 'ライブ'],
    viewCount: 45678
  },
  {
    id: 4,
    title: "齋藤飛鳥 - Solo Dance Performance",
    description: "初のソロダンスパフォーマンス。黒い衣装で魅せる圧巻のターン",
    price: 800000,
    status: "active",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    listedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: "18秒",
    resolution: "8K相当",
    fileSize: "3.5GB",
    artist: "齋藤飛鳥",
    venue: "Zepp Tokyo",
    date: "2032年9月10日",
    categories: ['アイドル', 'ダンス'],
    viewCount: 9876
  },
  {
    id: 5,
    title: "与田祐希 - 写真集発売記念イベント",
    description: "写真集『光と影』発売記念イベントでの白いドレス姿。窓から差し込む光と共に",
    price: 600000,
    status: "sold",
    soldAt: new Date("2024-01-05"),
    owner: "0xdeadbeef00000000deadbeef00000000deadbeef",
    resaleOffers: [],
    duration: "10秒",
    resolution: "8K相当",
    fileSize: "2.1GB",
    artist: "与田祐希",
    venue: "表参道ヒルズ",
    date: "2032年5月20日",
    categories: ['アイドル', 'グラビア'],
    viewCount: 12345
  },
  {
    id: 6,
    title: "生田絵梨花 - Musical Finale",
    description: "ミュージカル『オペラ座の怪人』千秋楽カーテンコール。感動の拍手に包まれて",
    price: 1200000,
    status: "active",
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
    listedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: "25秒",
    resolution: "8K相当",
    fileSize: "5.0GB",
    artist: "生田絵梨花",
    venue: "帝国劇場",
    date: "2032年11月30日",
    categories: ['ミュージカル', 'アイドル'],
    viewCount: 7890
  }
]