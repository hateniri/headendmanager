#!/bin/bash

# 開発サーバーを常に起動しておくスクリプト

echo "🔄 開発サーバーの自動管理を開始します..."

while true; do
    # サーバーが起動しているかチェック
    if ! lsof -i :3000 | grep -q LISTEN; then
        echo "🚀 サーバーが停止しています。再起動します..."
        cd /Users/jinx/headendmanager/imaicom-next
        npm run dev &
        sleep 5
    fi
    
    # 30秒ごとにチェック
    sleep 30
done