# ダークモード実装ガイド

## 概要
このプロジェクトでは、Tailwind CSSの標準的なダークモード機能を使用しています。
ダークモードとライトモードの混在を防ぐため、以下のガイドラインに従ってください。

## バージョン: v2.1.1
- **修正日**: 2025-01-27
- **修正内容**: ダークモードとライトモードの混在問題を解決

## 基本原則

### ✅ 推奨される方法

1. **Tailwind CSSのダークモードクラスを使用**
   ```jsx
   // 正しい例
   <div className="bg-white dark:bg-gray-800">
   <p className="text-gray-900 dark:text-gray-100">
   ```

2. **CSS変数を使用する場合**
   ```css
   /* globals.css */
   :root {
     --background: #f8fafc;
     --foreground: #0f172a;
   }
   
   .dark {
     --background: #0f172a;
     --foreground: #f1f5f9;
   }
   ```

### ❌ 避けるべき方法

1. **手動でダークモードクラスをオーバーライド**
   ```css
   /* 悪い例 - 使わないこと！ */
   .dark .bg-white {
     background-color: #1f2937;
   }
   ```

2. **!important の使用**
   ```css
   /* 悪い例 */
   .dark-bg {
     background-color: #000 !important;
   }
   ```

## コンポーネント作成時のチェックリスト

- [ ] 背景色には必ず `dark:` バリアントを指定
- [ ] テキスト色には必ず `dark:` バリアントを指定
- [ ] ボーダー色には必ず `dark:` バリアントを指定
- [ ] シャドウには必要に応じて `dark:` バリアントを指定

## よく使うカラーパターン

### 背景色
- `bg-white dark:bg-gray-800` - メインコンテナ
- `bg-gray-50 dark:bg-gray-900` - セカンダリコンテナ
- `bg-gray-100 dark:bg-gray-700` - ホバー状態

### テキスト色
- `text-gray-900 dark:text-gray-100` - 主要テキスト
- `text-gray-700 dark:text-gray-300` - 通常テキスト
- `text-gray-500 dark:text-gray-400` - 補助テキスト

### ボーダー色
- `border-gray-200 dark:border-gray-700` - 通常ボーダー
- `border-gray-300 dark:border-gray-600` - 強調ボーダー

## テーマ切り替えの実装

```jsx
// Header.tsx での実装例
import { useTheme } from '@/lib/theme'

const { isDarkMode, toggleDarkMode } = useTheme()

<button onClick={toggleDarkMode}>
  {isDarkMode ? <Sun /> : <Moon />}
</button>
```

## トラブルシューティング

### 問題: ダークモードが適用されない
1. `ThemeProvider` が `Providers.tsx` で正しくラップされているか確認
2. `html` タグに `suppressHydrationWarning` が設定されているか確認
3. ブラウザのローカルストレージをクリアして再試行

### 問題: 色が混在している
1. カスタムCSSでダークモードをオーバーライドしていないか確認
2. `globals.css` の不要なダークモードルールを削除
3. Tailwindの標準クラスを使用しているか確認

## 更新履歴
- v2.1.1: ダークモード修正完了
- v2.1.0: 初期実装