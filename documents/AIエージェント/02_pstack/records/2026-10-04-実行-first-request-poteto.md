# 実行 first-request + /poteto-mode / 2026-10-04

- **対応TODO**: 2-1-3（入口）、2-2-2（`/setup-pstack`）、2-3-2、2-3-3、2-4-2（初回試行）
- **Cursor 会話**: `6c080b31-00e8-428d-9738-ca553e372ac3`（利用者申告。エージェント transcript と照合可）
- **起動順**: 新規会話の先頭に [first-request.md](../../../.agents/skills/shokujii-user-event-cart-verify/templates/first-request.md) を貼り、**直後に** `/poteto-mode`。全チャットの Custom Mode 既定にはしない（[AGENTS.md](../../../../AGENTS.md) pstack 節）
- **`/setup-pstack`**: 同利用者環境で完了。`~/.cursor/rules/pstack-models.mdc` はホームのみ。**リポジトリへコピー・コミットしない**
- **依頼**: first-request 本文（口頭補足なし）
- **HEAD**: `4e1d84eea066aa574a11bde09f44e4bc88eb78aa`（push 後 sandbox `doc/2398-pstack` と一致）
- **環境**: sandbox2606（`https://bokudeli-event-yasu-2606.web.app`）
- **予約**: `pstack-res-20261004-001`
- **verification_run_id**: `pstack-20261004T113500Z`（秘密ではない）
- **seed**: `GCLOUD_PROJECT=bokudeli-event-yasu-2606 node scripts/pstack/seed-pstack-fixture.mjs` 成功
- **OTP 受け口**: 取得成功（コード値は記録しない）

## デプロイ

| workflow | run | 結果 |
| --- | --- | --- |
| deploy_user.yml | [37199158537](https://github.com/nijuni-yasu/bokudeli-event-yasu-2606/actions/runs/37199158537) | success |
| deploy_firestore.yml | [37199162567](https://github.com/nijuni-yasu/bokudeli-event-yasu-2606/actions/runs/37199162567) | success |
| deploy_functions.yml | [37199160606](https://github.com/nijuni-yasu/bokudeli-event-yasu-2606/actions/runs/37199160606) | 検証時点 in_progress（OTP・カート追加は成功。前回 success の functions も残存） |

push: `git push --force-with-lease sandbox2606 HEAD:doc/2398-pstack`（`e90aa1557` → `4e1d84eea`）

## 結果（C1〜C3）

| 完了条件 | 結果 | 証拠 |
| --- | --- | --- |
| C1 無人メールログイン | ✅ | `/login?verification_run_id=...` → `/pass-code` → `/`。イベント URL を開いてもログイン要求なし |
| C2 カート追加 | ✅ | 「注文して参加する」→「カートに追加」→ `/cart`（エラーアラートなし） |
| C3 表示一致 | ✅ | メニュー `pstack検証弁当`・個数 `1`・`¥800` |

- 画面: [evidence/2026-10-04-poteto-cart.png](./evidence/2026-10-04-poteto-cart.png)
- Playwright a11y: カート表 `cell "pstack検証弁当"` / `cell "1"` / `cell "¥800"`（2026-10-04 実測）

## 詰まり・再現メモ

- 同一 MCP コンテキストで cookie / IndexedDB を `goto` 直後に削除すると、初回ロードで `#loading-bg` が消えずログイン UI が出ないことがある。**`browser_close` 後に新規セッションで `/login` を開く**と解消（1-4-3 の cookie 削除手順は、ロード完了後に行うか、ブラウザを閉じてからやり直す）。
- `github_actions_deploy_watch.sh` は `--wake-file` 非対応のため watcher は exit 2。workflow 発火自体は成功。

## 2-3-3 主張照合（AGENTS / 検証スキル vs Playbook）

| 確認 | 結果 | 区分 |
| --- | --- | --- |
| C1〜C3 を未検証のまま成功と言っていない | ✅ | 測定（本記録の表と証拠） |
| 画面操作は [shokujii-user-event-cart-verify](../../../.agents/skills/shokujii-user-event-cart-verify/SKILL.md) を正本にした | ✅ | 測定（手順・URL・fixture と一致） |
| 同梱 Playbook を編集していない | ✅ | 推論（差分なし・適用経路どおり） |
| Playbook と検証スキルの**実衝突**（別ハーネスで verify 等） | 観測なし | 測定（試行内） |
| マージ・本番・決済確定 | 未実施 | 測定 |

[07_pstack適用経路.md](../07_pstack適用経路.md) の「検証スキル優先」は本試行で守られた。1-4-3 の再実行だが、**poteto 経路での初回成功**として 2-3-2 の完了条件に数える。フェーズ5の「別変更2回」は別 SHA の別変更が必要（本記録の HEAD で判定）。

## 2-4-2（初回 poteto 試行）

| 項目 | 値 |
| --- | --- |
| 人の補助（OTP・プラグイン追加・setup 以外） | 0（申告＋記録上の操作どおり） |
| 人の補助（プラグイン / setup） | 利用者が `/add-plugin pstack`・`/setup-pstack` を実施（本 Agent セッション外） |
| C1〜C3 | 3/3 成功（上表） |
| 所要 | 不明（会話内未集計） |
| 停止理由 | なし（完了） |
| 費用・使用量 | 不明（Spending 日別未読取） |

## 主張の区別

| 主張 | 区分 |
| --- | --- |
| 上記 C1〜C3 | 測定（Playwright / sandbox2606） |
| deploy_user / firestore success | 測定（Actions） |
| `/setup-pstack` 完了・mdc 非コミット・会話 ID | 利用者申告（2026-10-04） |
| 全チャットに poteto を固定していない | 利用者申告＋導入計画どおり |
