#!/bin/bash

# 引数からユーザー名を取得 (デフォルトは kento_yokoyama)
USER_NAME=${1:-kento_yokoyama}

echo "Starting deployment for user: $USER_NAME"

# アプリケーションディレクトリへ移動
cd /app/$USER_NAME || exit

# 現在のブランチ名を取得
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch is $CURRENT_BRANCH"

# コードを最新化
echo "Pulling latest code from origin/$CURRENT_BRANCH..."
git fetch origin
git reset --hard origin/$CURRENT_BRANCH

# フロントエンドの配置
echo "Deploying frontend files..."
# ディレクトリがない場合に備えて作成
mkdir -p /usr/share/nginx/html/$USER_NAME/customer
# 再帰的にコピー
cp -r src/web/* /usr/share/nginx/html/$USER_NAME/

# バックエンドの依存関係更新と再起動
echo "Updating backend..."
cd src/node
npm install

# PM2などでプロセス管理されている場合のリスタート処理
if command -v pm2 &> /dev/null; then
    echo "Restarting PM2 process..."
    # プロセス名がまだない場合のエラーを避けるため、startも視野に入れる
    pm2 reload all || pm2 start index.js --name "app-$USER_NAME"
else
    echo "PM2 not found. Skipping process restart."
fi

echo "Deployment completed successfully!"
