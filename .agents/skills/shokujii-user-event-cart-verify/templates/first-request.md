# pstack / フェーズ1 最初の実行依頼（テンプレート）

コピーして会話の先頭に貼る。`/poteto-mode` を使う場合は、この依頼の**後**に会話単位で付ける（全チャット既定にしない）。

正本経路は予約 sandbox。ローカル dev は主経路にしない。口頭の補足なしで [SKILL.md](../SKILL.md) と [feature-map.md](../feature-map.md) だけを読む。

---

## 依頼

**Issue**: #2398（pstack 導入）に関連するフェーズ1検証
**ブランチ**: `doc/2398-pstack`（または当該作業ブランチ）
**検証スキル**: `.agents/skills/shokujii-user-event-cart-verify/SKILL.md`
**Feature Map**: `.agents/skills/shokujii-user-event-cart-verify/feature-map.md`
**予約**: [sandbox-pool.md](../../../../documents/AIエージェント/02_pstack/records/sandbox-pool.md) の sandbox2603（`pstack-res-20261004-002`）
**Fixture**: [fixture-pstack-001.md](../../../../documents/AIエージェント/02_pstack/records/fixture-pstack-001.md)

### 完了条件

1. 予約 sandbox で、新しいブラウザから**人のログイン補助なし**に `pstack.participant@verify.shokujii.test` として認証する（D-05）。`verification_run_id` と受け口 OTP を使う。
2. `https://bokudeli-event-yasu-2603.web.app/c/pstack-verify/e/pstack-event-cart-001` を開き、`pstack検証弁当` を数量 1 でカートに追加する。
3. `/cart` でメニュー名 `pstack検証弁当` と個数 `1` が一致することを確認する。決済確定はしない。

### 許可範囲

- 検証スキルに書いた起動・操作・証拠・片付け
- 検証を妨げる既存不具合の**最小修正**（D-15: 別 Issue・別コミット、同一ブランチ・PR 可）
- 依頼に含まない: マージ、本番デプロイ、`tree/` push、On-Demand 有効化、1-6-2 / 1-6-3

### 証拠

各完了条件ごとに、Hosting URL・HEAD SHA・スクリーンショットまたは a11y スナップショット。OTP・トークン・メール本文は含めない。実行ログは `documents/AIエージェント/02_pstack/records/` に残す。
