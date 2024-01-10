# ステージ1: ビルド環境を構築
# Node.js v20 の公式イメージをベースとして使用
FROM node:20-alpine as build-stage

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install --production

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ステージ2: 実行環境
FROM node:20-alpine as production-stage

# 作業ディレクトリを設定
WORKDIR /app

# 環境変数を設定（本番モード）
ENV NODE_ENV=production

# ビルドステージからビルド済みファイルをコピー
COPY --from=build-stage /app ./

# アプリケーションが使用するポートを指定
EXPOSE 3000

# Next アプリケーションを起動
CMD ["npm", "start"]