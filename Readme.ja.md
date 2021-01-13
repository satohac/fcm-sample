# fcm-sample
Firebase Cloud Messaging を JavaScript(Web) で使うためのサンプルコードです。

### 事前に必要なもの
- Node.js
- firebase-tools
- Firebase Project( Functionsを使うので請求アカウントの設定が必要です )

### 動かすまで
1. このリポジトリをcloneするかzipをダウンロードします。
```
git clone https://github.com/satohac/fcm-sample.git
```

2. firebase-toolsを使ってデプロイします。(事前にfirebase-toolsでログインとプロジェクトの選択を済ましておく必要があります)
```
firebase deploy
```

3. ホスティングサイトにアクセスします。通常以下の形式でアクセスできます。
```
https://<project-id>
```

4. [Save FCM Token] ボタンをクリックします。

5. Firebase Consoleからメッセージを送信します。  
   対象をアプリにするか、allトピックに送信すると受信できます

6. 受信したメッセージがページに表示されます

### 機能
- FCMトークンの取得
- トピックの購読・解除
- 受信したメッセージの表示
