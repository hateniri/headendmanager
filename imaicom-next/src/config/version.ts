// アプリケーションバージョン管理
export const APP_VERSION = {
  major: 2,
  minor: 2,
  patch: 4,
  build: '20250128-4',
  name: 'IMAICOM-X Facility Management',
  
  // バージョン文字列を生成
  get version(): string {
    return `v${this.major}.${this.minor}.${this.patch}`
  },
  
  // フルバージョン文字列（ビルド番号含む）
  get fullVersion(): string {
    return `${this.version}-${this.build}`
  },
  
  // 表示用バージョン文字列
  get displayVersion(): string {
    return `${this.version}`
  },

  // リリースノート
  releaseNotes: [
    {
      version: 'v2.2.4',
      date: '2025-01-28',
      changes: [
        '3Dパース効果を無効化',
        '地球儀投影を標準メルカトル図法に変更',
        '3D地形と霧効果を削除',
        'デバッグ用赤マーカーを削除'
      ]
    },
    {
      version: 'v2.2.3',
      date: '2025-01-28',
      changes: [
        'Mapboxマーカーを根本的に再実装',
        'デフォルトマーカーを追加してデバッグ',
        'カスタムマーカーをインラインスタイルで実装',
        'マーカー追従問題の解決'
      ]
    },
    {
      version: 'v2.2.2',
      date: '2025-01-28',
      changes: [
        'Mapboxマーカーのピン追従問題を修正',
        'マーカーの高さとオフセットを調整',
        'pitchAlignmentとrotationAlignmentをmapに変更',
        'パルスアニメーションの位置を修正'
      ]
    },
    {
      version: 'v2.2.1',
      date: '2025-01-28',
      changes: [
        'Tailwind CSS v4の設定問題を修正',
        'PostCSS設定をv4に対応',
        'ログインページのダークモード対応',
        '全ページのCSS破損問題を解決'
      ]
    },
    {
      version: 'v2.2.0',
      date: '2025-01-27',
      changes: [
        'マップをダークスタイルに変更（よりクール）',
        '3D地形表示と地球儀投影を追加',
        'カスタムマーカーデザイン（グロー効果付き）',
        'ピン追従問題を修正（オフセット調整）',
        'レジェンドをフローティング表示に改善',
        '地域選択に絵文字アイコン追加'
      ]
    },
    {
      version: 'v2.1.1',
      date: '2025-01-27',
      changes: [
        'ダークモードとライトモードの混在問題を修正',
        'CSS変数によるテーマカラー最適化',
        '不要なダークモードオーバーライドを削除',
        'スムーズなテーマ切り替えトランジション追加'
      ]
    },
    {
      version: 'v2.1.0',
      date: '2025-01-27',
      changes: [
        '施設詳細ページの完全再構成',
        '機材管理中心のUI設計',
        '修理履歴管理機能追加',
        '担当者・操作履歴タブ実装',
        'アセットデータ構造拡張（50+フィールド）',
        'リアルタイム監視ダッシュボード',
        '3Dラックビュー強化'
      ]
    },
    {
      version: 'v2.0.0',
      date: '2025-01-26',
      changes: [
        'CSS/アニメーション大幅改善',
        'ESGダッシュボード追加',
        '環境メトリクス監視',
        'ダークモード対応強化',
        'レスポンシブデザイン改善'
      ]
    }
  ]
}

// 環境別設定
export const ENV_CONFIG = {
  development: {
    showVersionInfo: true,
    enableDebugMode: true,
    apiEndpoint: 'http://localhost:3000/api'
  },
  production: {
    showVersionInfo: true,
    enableDebugMode: false,
    apiEndpoint: '/api'
  }
}

export default APP_VERSION