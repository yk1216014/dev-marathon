#!/bin/bash

# 引数からユーザー名を取得 (デフォルトは kento_yokoyama)
USER_NAME=${1:-kento_yokoyama}

echo "Starting deployment for user: $USER_NAME"

# アプリケーションディレクトリへ移動
cd /app/$USER_NAME || exit

# src.zip があるか確認
if [ ! -f "src.zip" ]; then
    echo "Error: src.zip not found!"
    exit 1
fi

# 解凍処理 (既存のsrcを上書き)
echo "Unzipping src.zip..."
# -o: 上書き許可, -q: 静かに実行
unzip -o -q src.zip

# フロントエンドの配置
echo "Deploying frontend files..."
mkdir -p /usr/share/nginx/html/$USER_NAME/customer
cp -r src/web/* /usr/share/nginx/html/$USER_NAME/

# バックエンドの依存関係更新と再起動
echo "Updating backend..."
cd src/node
npm install

# PM2などでプロセス管理されている場合のリスタート処理
if command -v pm2 &> /dev/null; then
    echo "Restarting PM2 process..."
    pm2 reload all || pm2 start index.js --name "app-$USER_NAME"
else
    echo "PM2 not found. Skipping process restart."
fi

# クリーンアップ (解凍後のzipは消さないルールなら残す。今回は残す)
echo "Deployment completed successfully!"
