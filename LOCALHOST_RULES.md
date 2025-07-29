# ローカルサーバー起動のルール

## 問題点の分析
1. **Reactプロジェクトでよくある失敗**
   - `npm install`が完了していない状態で`npm run dev`を実行
   - Viteがインストールされていない
   - ビルドツールの設定ミス

2. **タイムアウトの問題**
   - `npm install`は時間がかかるので短いタイムアウトで失敗
   - サーバー起動コマンドは永続的に実行されるため、タイムアウトで止まる

## 正しい手順

### 1. Reactプロジェクトの場合
```bash
# 依存関係の確認
ls -la node_modules/ 2>/dev/null || echo "node_modules not found"

# パッケージのインストール（長めのタイムアウト）
npm install --verbose  # タイムアウト: 300000ms

# 開発サーバーの起動（バックグラウンド）
npm run dev &
# または
npx vite --host &
```

### 2. 静的ファイルの場合
```bash
# Python HTTPサーバー（推奨）
python3 -m http.server 5173 &

# または Node.jsのserve
npx serve -s . -l 5173 &
```

### 3. 確認方法
```bash
# ポートが使用されているか確認
lsof -i :5173 || netstat -an | grep 5173

# プロセスの確認
ps aux | grep -E 'vite|python.*5173|serve'

# curlでアクセステスト
curl -I http://localhost:5173
```

## 重要なルール

1. **インストールは別で実行**
   - `npm install`は単独で実行し、完了を待つ
   - タイムアウトは最低300秒に設定

2. **サーバー起動は&でバックグラウンド実行**
   - 永続的なプロセスは必ず`&`を付ける
   - またはタイムアウトを5-10秒に設定して、起動確認だけする

3. **事前チェック**
   - package.jsonの確認
   - node_modulesの存在確認
   - 必要なコマンドの存在確認（which vite等）

4. **エラー時の対処**
   - ポートが使用中: `lsof -ti:5173 | xargs kill -9`
   - モジュール不足: `rm -rf node_modules package-lock.json && npm install`

## 簡単な起動スクリプト

```bash
#!/bin/bash
# start-server.sh

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Kill existing process on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start server based on project type
if [ -f "vite.config.js" ]; then
    echo "Starting Vite dev server..."
    npm run dev &
elif [ -f "package.json" ]; then
    echo "Starting with npx serve..."
    npx serve -s . -l 5173 &
else
    echo "Starting Python HTTP server..."
    python3 -m http.server 5173 &
fi

echo "Server starting on http://localhost:5173"
sleep 2
curl -I http://localhost:5173 || echo "Server may still be starting..."
```

## チェックリスト

- [ ] package.jsonは存在するか？
- [ ] node_modulesディレクトリは存在するか？
- [ ] npm installは成功したか？
- [ ] ポート5173は空いているか？
- [ ] サーバー起動コマンドに&を付けたか？
- [ ] 起動後にcurlで確認したか？

この手順に従えば、ローカルサーバーの起動で失敗することは大幅に減るはずです。