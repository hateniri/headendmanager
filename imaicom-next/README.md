# HeadEnd Manager

データセンター施設管理システム

## 概要

全国のデータセンター施設を一元管理するための統合管理システムです。リアルタイムモニタリング、リモート操作、施設情報管理など包括的な機能を提供します。

## 主な機能

- 🗺️ **施設マップ**: 全国の施設を地図上で可視化
- 📊 **リアルタイムモニタリング**: 温度、湿度、電力などの環境データをリアルタイム表示
- 📹 **監視カメラビュー**: 各施設の監視カメラ映像をシミュレート表示
- 🎮 **リモート操作**: 主電源、冷却システムなどの遠隔制御
- 📋 **施設一覧**: 地域別、ステータス別での施設管理
- 🔧 **CMDB**: 構成管理データベース
- 📅 **スケジュール管理**: メンテナンススケジュールの管理
- 📈 **分析機能**: 施設パフォーマンスの分析

## セットアップ

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
# Mapboxアクセストークン
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## Vercelへのデプロイ

### 1. Vercelアカウントの準備

[Vercel](https://vercel.com)にサインアップまたはログイン

### 2. プロジェクトのインポート

1. Vercelダッシュボードで「New Project」をクリック
2. GitHubリポジトリをインポート
3. プロジェクト名を設定（例: headendmanager）

### 3. 環境変数の設定

Vercelのプロジェクト設定で以下の環境変数を追加：

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapboxのアクセストークン

### 4. デプロイ

「Deploy」ボタンをクリックして自動デプロイ

## 技術スタック

- **フレームワーク**: Next.js 15.4.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **地図**: Mapbox GL JS
- **状態管理**: Zustand
- **アイコン**: Lucide React

## プロジェクト構成

```
src/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── data/            # モックデータ
├── lib/             # ユーティリティ関数
└── types/           # TypeScript型定義
```
