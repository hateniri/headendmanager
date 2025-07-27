# インフラ設備統合管理システム PoC

全国92ヵ所のインフラ設備拠点を遠隔で統合管理するためのダッシュボード型Webアプリケーションです。

## 機能

- 🗺️ **地図表示**: Mapboxを使用した全国施設の可視化（クラスタ表示対応）
- 📊 **施設詳細**: ラック構成、機器状態、温度などのリアルタイム情報
- 📋 **点検履歴**: 各施設の点検記録と結果の管理
- 🔧 **修理依頼**: オンラインでの修理依頼フォーム
- 👥 **組織管理**: 管理担当者の組織ツリー表示

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. Mapboxアクセストークンの設定
`.env.local`ファイルの`YOUR_MAPBOX_ACCESS_TOKEN_HERE`を実際のMapboxアクセストークンに置き換えてください。

Mapboxアクセストークンは[こちら](https://account.mapbox.com/)から取得できます。

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで`http://localhost:3000`にアクセス

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Mapbox GL JS**
- **Zustand** (状態管理)

## プロジェクト構成

```
headendmanager/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
│   ├── map/         # 地図関連
│   └── panels/      # パネル関連
├── data/            # 仮データ
├── store/           # Zustand ストア
├── types/           # TypeScript型定義
└── utils/           # ユーティリティ関数
```

## 開発メモ

- このPoCではすべてのデータはフロントエンドで生成される仮データです
- 実際の実装では、バックエンドAPIとの連携が必要です
- Mapboxのクラスタリング機能により、大量の施設でもパフォーマンスを維持します