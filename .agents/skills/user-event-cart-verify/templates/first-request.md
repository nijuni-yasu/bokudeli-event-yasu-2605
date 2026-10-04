# pstack / フェーズ1 最初の実行依頼（テンプレート）

コピーして会話の先頭に貼る。`/poteto-mode` を使う場合は、この依頼の**後**に会話単位で付ける（全チャット既定にしない）。

---

## 依頼

**Issue**: #2398（pstack 導入）に関連するフェーズ1検証  
**ブランチ**: `doc/2398-pstack`（または当該作業ブランチ）  
**検証スキル**: `.agents/skills/user-event-cart-verify/SKILL.md`  
**Feature Map**: `.agents/skills/user-event-cart-verify/feature-map.md`

### 完了条件

1. ローカルまたは予約 sandbox（`documents/AIエージェント/02_pstack/records/sandbox-pool.md` の予約環境）で、新しいブラウザから**人のログイン補助なし**にテストユーザーとして認証する（D-05）。
2. fixture の注文受付中イベント URL を開き、指定メニューを数量 1 でカートに追加する。
3. `/cart` でメニュー名と数量が選択内容と一致することを確認する。決済確定はしない。

### 許可範囲

- 検証スキルに書いた起動・操作・証拠・片付け
- 検証を妨げる既存不具合の**最小修正**（D-15: 別 Issue・別コミット、同一ブランチ・PR 可）
- 依頼に含まない: マージ、本番デプロイ、`tree/` push、On-Demand 有効化

### 証拠

各完了条件ごとに、URL・HEAD SHA・スクリーンショットまたは a11y スナップショット・必要なら Callable/Firestore 読取ログ（秘密・トークンは含めない）。

---

Fixture の具体 ID は `feature-map.md` の「Fixture」節が更新されるまで未確定。
