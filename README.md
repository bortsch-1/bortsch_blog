# bortsch_blog

自分だけが投稿でき、他の人も見られるブログサイト

## 機能

- 📝 ブログ記事の投稿
- 🖼️ 画像アップロード機能
- 🔐 認証機能（自分だけがログイン可能）
- 📱 レスポンシブデザイン

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **バックエンド**: Firebase (Firestore, Authentication, Storage)
- **ホスティング**: Vercel

## セットアップ

### 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. 新規プロジェクト作成
3. Authentication を有効化（Email/Password）
4. Firestore Database を作成
5. Storage を有効化

### 2. 環境変数設定

`.env.local` ファイルを作成し、Firebase のプロジェクト設定をコピー：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 依存関係インストール

```bash
npm install
```

### 4. 開発サーバー起動

```bash
npm run dev
```

`http://localhost:3000` にアクセス

## Firebase 設定

### Firestore セキュリティルール

`firestore.rules` に以下を設定：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == 'YOUR_USER_ID';
    }
  }
}
```

`YOUR_USER_ID` は Firebase Console で確認できます

### Storage セキュリティルール

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blogs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == 'YOUR_USER_ID';
    }
  }
}
```

## デプロイ（Vercel）

1. [Vercel](https://vercel.com) にサインアップ
2. GitHub リポジトリを接続
3. 環境変数を設定
4. デプロイ

## 使い方

### ユーザー用

1. ホームページで記事一覧を表示
2. 記事をクリックして詳細を表示

### 管理者用

1. `/admin` にアクセス
2. メールアドレスとパスワードでログイン
3. 記事を投稿

## ライセンス

MIT
