#!/bin/bash

# HeadEnd Manager ローカル開発環境起動スクリプト

echo "🚀 HeadEnd Manager ローカル開発環境を起動します..."

# imaicom-nextディレクトリに移動
cd imaicom-next

# 依存関係をインストール（必要な場合）
if [ ! -d "node_modules" ]; then
    echo "📦 依存関係をインストールしています..."
    npm install
fi

# .env.localファイルが存在しない場合は作成
if [ ! -f ".env.local" ]; then
    echo "⚙️  .env.localファイルを作成しています..."
    cp .env.example .env.local
    echo "⚠️  .env.localファイルが作成されました。必要に応じて環境変数を設定してください。"
fi

# ポート3000が使用中かチェック
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  ポート3000は使用中です。ポート3001で起動します..."
    export PORT=3001
else
    export PORT=3000
fi

echo "🌐 開発サーバーを起動しています..."
echo "📍 URL: http://localhost:$PORT"
echo ""
echo "終了するには Ctrl+C を押してください"
echo ""

# 開発サーバーを起動
npm run dev