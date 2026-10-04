# ロボ・ファイト 3D

ブラウザで遊ぶ格闘ロボットゲーム。パーツを組んで、プログラムでロボを動かし、大会で賞金を稼ぎます。
シングルで作った機体で、**オンラインのルーム対戦**もできます。

## 最短の公開手順(コードの編集は一切不要)

### ① GitHub にアップロード
1. https://github.com にログイン → 右上の **＋ → New repository**
2. Repository name に `robo-fight` と入力 → **Public** のまま → **Create repository**
3. 作成後の画面で **uploading an existing file** をクリック
4. このzipを展開し、**フォルダの中身すべて**(`package.json`・`server.js`・`render.yaml`・`public` フォルダ など)をドラッグして入れる
   - ⚠ `package.json` がリポジトリの一番上の階層に来るようにしてください(フォルダごと入れると動きません)
5. 下の **Commit changes** を押す

### ② Render に登録して公開
1. https://render.com にログイン(GitHubアカウントでOK)
2. 右上の **New + → Blueprint** を選ぶ
3. GitHub と連携し、`robo-fight` リポジトリを選んで **Connect**
4. 内容(Web Service・Free)が表示されるので **Apply** を押す
5. 数分でビルドが終わり、`https://robo-fight-xxxx.onrender.com` が発行される

そのURLを開けば完成です。**シングルもオンラインもそのまま遊べます**(サーバーURLは自動で入ります)。
友達には「オンライン」タブで作ったルームコードと、このURLを伝えてください。

> Blueprint の項目が見つからないときは **New + → Web Service** からでも作れます。
> Build Command は `npm install`、Start Command は `npm start`、Instance Type は `Free` にしてください。


## 遊びの内容(ゲーム機能)
- **ガレージ**:約80種のパーツ+外装、重量システム、「おまかせ構築」、セーブの出力/読み込み
- **プログラム**:「もし〇〇かつ△△なら□□」で最大8行、保存枠3つ、テンプレート
- **試合**:14大会の賞金戦(毎回2つのボーナス条件)、スパーリング(賞金なしの練習)、サバイバル(連勝チャレンジ)
- **試合レポート**:ヒット数・回避数・ルール使用率など。プログラムの見直しに使えます
- **実績**:達成で賞金。3連敗すると救済ボーナス
- **オンライン**:ルーム対戦・観戦・チャット・リプレイ

## 遊び方
- シングル:ガレージ(パーツ・外装)→ プログラム → 試合
- オンライン:「オンライン」タブでルームを作り、表示された5文字のコードを友達に伝える
  - 3人目以降は観戦者として入室します(最大8人)
  - ホストが「試合開始」を押すと、サーバー上で対戦が行われ、全員に同じ試合が配信されます

## ローカルで動かす
```bash
npm install
npm start          # http://localhost:3000 を開く
```
オフライン(シングルのみ)で遊ぶだけなら、`dist/robo-fight.html` を直接開けば動きます。
1ファイル版を作り直すには `npm run build:single` を実行します。

## (参考)コマンドで公開する場合
### 1. GitHub にアップロード
1. GitHub で新しいリポジトリを作る(例: `robo-fight`)
2. このフォルダで次を実行
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのID/robo-fight.git
git push -u origin main
```

### 2. Render にデプロイ(手動設定)
1. https://render.com にログインし、**New + → Web Service** を選ぶ
2. GitHub のリポジトリ `robo-fight` を接続する
3. 次のとおり設定する(`render.yaml` があれば自動入力されます)
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`
4. デプロイが終わると `https://robo-fight-xxxx.onrender.com` が発行される
5. そのURLをブラウザで開けば、シングルもオンラインも遊べます。オンラインのサーバーURLは自動で入ります

### GitHub Pages に画面だけ置く場合(任意)
画面を GitHub Pages、サーバーだけ Render に置くこともできます。
オンラインタブの「サーバーURL」に `wss://robo-fight-xxxx.onrender.com` を入力してください。

## 注意
- Render の無料枠は、15分ほどアクセスがないと停止します。次の接続時に起動まで最大1分ほどかかります。
- 機体データはクライアントから送られます。サーバーは形式の検査だけを行い、パーツの所持は検証しません(身内で遊ぶ前提の作りです)。
- 対戦は60Hzでサーバーが計算します。無料枠のサーバーでは、同時に多くの試合を行うと重くなることがあります。

## 構成
```
public/core.js    対戦シミュレーション(ブラウザとサーバーで共有)
public/game.js    画面・3D描画・音・シングル/オンラインのクライアント
public/index.html
server.js         静的配信 + WebSocket ルーム管理 + 対戦計算
```
