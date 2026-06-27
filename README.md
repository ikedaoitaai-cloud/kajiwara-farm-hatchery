# 🐣 孵化率予測システム

カジワラファーム様向け孵化率予測Webアプリケーション

## 概要

お客様からの「来月1万羽のヒヨコをください」という注文に対し、何個の卵を仕込めばよいかを予測するシステムです。

**現状**: お母様の手計算（精度70-75%）  
**目標**: システム化により精度85-90%へ改善

## 主な機能

✅ **複数農場の入卵データ管理**  
✅ **2つの予測式を比較表示**（区分線形・非対称正規分布）  
✅ **実績入力による精度分析**  
✅ **機械学習対応のデータ構造**  
✅ **直感的で使いやすいUI**（Apple風デザイン）

## 使い方

### 基本的な操作フロー

1. **入卵日を選択** - カレンダーから選択
2. **農場データを入力** - 農場名、親鳥日齢、入卵数、貯卵日数
3. **予測を確認** - 両方式の予測を比較
4. **実績を入力**（後日） - 精度分析

詳細は [USER_MANUAL.md](./USER_MANUAL.md) を参照してください。

## デモサイト

https://[username].github.io/hatchery-calculator/

## セットアップ

### ローカルで動作確認

1. このリポジトリをクローン
```bash
git clone https://github.com/[username]/hatchery-calculator.git
cd hatchery-calculator
```

2. `index.html`をブラウザで開く
```bash
# Macの場合
open index.html

# Windowsの場合
start index.html

# Linuxの場合
xdg-open index.html
```

### GitHub Pagesへのデプロイ

1. GitHubリポジトリを作成
2. コードをpush
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
3. Settings → Pages → Source: main → Save
4. 数分後にデプロイ完了

## 技術スタック

- **React 18** (CDN版)
- **Tailwind CSS** (CDN版)
- **Lucide React** (アイコン)
- **LocalStorage** (データ保存)

## プロジェクト構成
```
hatchery-calculator/
├── index.html              # メインアプリケーション
├── README.md               # このファイル
├── PROJECT_OVERVIEW.md     # 開発者向け詳細ドキュメント
└── USER_MANUAL.md          # ユーザー向け操作マニュアル
```

## 開発ロードマップ

- [x] **Phase 1**: フロントエンドMVP（現在）
- [ ] **Phase 2**: バックエンド開発（Week 5-9）
- [ ] **Phase 3**: データ収集（1年間）
- [ ] **Phase 4**: ML モデル導入（1年後）

詳細は [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) を参照してください。

## 既知の制限事項

- LocalStorage依存（ブラウザキャッシュクリアでデータ消失）
- オフライン非対応
- 複数デバイス間でのデータ同期不可

これらはPhase 2のバックエンド開発で解決予定です。

## サポート

- 問題報告: [GitHub Issues](https://github.com/[username]/hatchery-calculator/issues)
- 機能要望: 上記Issuesへ投稿
- Email: [your.email@example.com]

## ライセンス

Proprietary - カジワラファーム様専用

## 更新履歴

### v2.3 (2026-03-08)
- 両方式比較機能追加
- トグル切り替えUI実装
- 精度分析機能強化

### v2.0 (2026-03-05)
- 初期リリース

---

**開発者**: [So Ikeda]  
**最終更新**: 2026-03-08