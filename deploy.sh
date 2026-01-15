#!/bin/bash

# 引数からユーザー名を取得 (デフォルトは kento_yokoyama)
USER_NAME=${1:-kento_yokoyama}

echo "Starting deployment for user: $USER_NAME"

# アプリケーションディレクトリへ移動
cd /app/$USER_NAME || exit

# コードを最新化
echo "Pulling latest code..."
git fetch origin
git reset --hard origin/develop

# フロントエンドの配置
# 修正ポイント: 正しいディレクトリ src/web からコピーする
echo "Deploying frontend files..."
mkdir -p /usr/share/nginx/html/$USER_NAME/customer
cp -r src/web/* /usr/share/nginx/html/$USER_NAME/

# バックエンドの依存関係更新と再起動
echo "Updating backend..."
cd src/node
npm install

# PM2などでプロセス管理されている場合のリスタート処理
# (環境に合わせて調整。ここでは汎用的にpm2があればリロード、なければスキップ)
if command -v pm2 &> /dev/null; then
    echo "Restarting PM2 process..."
    pm2 reload all || pm2 start index.js --name "app-$USER_NAME"
else
    echo "PM2 not found. Skipping process restart."
    # 開発サーバー(npm run dev)などが走っている場合は手動再起動が必要かもしれません
fi

echo "Deployment completed successfully!"
