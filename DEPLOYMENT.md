# ゼロから始めるデプロイ手順 (Complete Guide)

エラーが出ている・手順がわからなくなった場合の、最初からやり直すための完全手順書です。

## ⚠️ 重要: エラーの原因について (Apache default page)
もしブラウザで `http://localhost` を開いて "Apache2 Default Page" が出ている場合、それは以下の理由です。

1.  **URLの間違い**: デプロイしたAWS環境を見たいのに、自分のPC (`localhost`) を見ています。
2.  **ポートの指定忘れ**: ローカル環境を見たい場合でも、このアプリはポート **5465** で動きます (例: `http://localhost:5465`)。

**AWS(Staging)にデプロイしたアプリを見るための正しいURLは以下です。**
`http://dev.marathon.rplearn.net/あなたのユーザー名/customer/list.html`

---

## 手順1: ローカルでの準備 (PC上での作業)

1.  **ソースコードの確認**
    *   自分のPCの `src` フォルダ (`c:\env\dev-marathon\src`) を確認します。
2.  **圧縮 (Zip化)**
    *   `src` フォルダを右クリックして「送る」→「圧縮(zip形式)フォルダー」を選択します。
    *   ファイル名は何でも良いですが、ここでは `src.zip` とします。

## 手順2: サーバーへのアップロード (PC -> AWS)

1.  **Stagingサーバーへログイン**
    *   Teratermなどのツールを使い、AWSサーバーへSSH接続します。
2.  **ファイルアップロード**
    *   作成した `src.zip` をサーバーの `/app/あなたのユーザー名/` ディレクトリへドラッグ＆ドロップ(またはSCP転送)してアップロードします。

## 手順3: サーバー上での展開と設定 (AWS上での作業)

ここからはTeraterm(黒い画面)でのコマンド操作です。一行ずつコピーして実行してください。
※ `kento_yokoyama` の部分は **自分のユーザー名** に置き換えてください。

```bash
# 1. アプリケーションのフォルダへ移動
cd /app/kento_yokoyama

# 2. (念のため) 古いソースコードを削除
rm -rf src

# 3. アップロードしたzipを解凍
unzip src.zip

# 4. フロントエンドファイルをWebサーバー(Nginx)へ配置
# ★ここが最重要です。これをやらないと画面が更新されません。
# "-r" はフォルダごとコピーするオプションです。
# "cp -r (コピー元) (コピー先)"
cp -r src/web/* /usr/share/nginx/html/kento_yokoyama/

# 5. バックエンドのセットアップ
cd src/node
npm install

# 6. バックエンドサーバーの起動
# エラーが出ず "Server running on port 5465" と出れば成功です。
npm run dev
```

## 手順4: データベースのセットアップ (必要な場合)

データが登録できない、一覧が出ない場合はDBの設定が必要です。

```bash
# (npm run dev を実行中の場合は Ctrl+C で一度止めてください)

# PostgreSQLへログイン
psql -U user_kento_yokoyama -d db_kento_yokoyama
# パスワード: 5Rw5YDaWc5jc (手順書指定のもの)

# SQLの実行 (database_setup.sqlの内容を実行)
# (ここにはSQLファイルがないため、SQL文を直接貼り付けるか、別途ファイルをアップロードして実行します)
# 例: \i database_setup.sql
```

## 手順5: 動作確認

ブラウザで以下のURLを開いてください。**`localhost` ではありません！**

1.  **一覧画面**: `http://dev.marathon.rplearn.net/kento_yokoyama/customer/list.html`
2.  **登録画面**: `http://dev.marathon.rplearn.net/kento_yokoyama/customer/add.html`

上手く表示されない場合は、Teratermの画面にエラーログが出ていないか確認してください。
