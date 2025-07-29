# Vercelデプロイ手順

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name: `headendmanager`
4. PrivateまたはPublicを選択
5. 「Create repository」をクリック

## 2. ローカルリポジトリをGitHubに接続

```bash
# GitHubリポジトリを追加（YOUR_USERNAMEを実際のユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/headendmanager.git

# mainブランチにプッシュ
git push -u origin main
```

## 3. Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com)にログイン
2. 「Add New...」→「Project」をクリック
3. 「Import Git Repository」セクションでGitHubアカウントを連携
4. `headendmanager`リポジトリを選択
5. 「Import」をクリック

## 4. プロジェクト設定

### Framework Preset
- 自動的に「Next.js」が選択されるはず

### Environment Variables
以下の環境変数を追加：
- Name: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Value: Mapboxのアクセストークン

### Build & Output Settings（デフォルトのまま）
- Build Command: `npm run build`
- Output Directory: `.next`

## 5. デプロイ

「Deploy」ボタンをクリックしてデプロイを開始

## トラブルシューティング

### デプロイが始まらない場合
1. GitHubリポジトリが正しくプッシュされているか確認
2. Vercelの「Git Integration」でGitHubが連携されているか確認
3. リポジトリへのアクセス権限があるか確認

### ビルドエラーの場合
1. ローカルで`npm run build`が成功するか確認
2. 環境変数が正しく設定されているか確認
3. Vercelのビルドログを確認