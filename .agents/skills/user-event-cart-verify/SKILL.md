---
name: user-event-cart-verify
description: Shokujii user アプリで、注文受付中イベントのメニューをカートに追加し /cart で内容を確認する検証手順。pstack フェーズ1・標準フローの画面証拠用。イベント→カート、D-14、検証スキル、画面確認、Playwright で触るときは必ずこのスキルを使う。
---

# user イベント → カート検証

正本はこのファイル。`feature-map.md` は機能の地図、実行ログは `documents/AIエージェント/02_pstack/records/` に置く。

## いつ使うか

- pstack 導入フェーズ1の「起動→操作→証拠→片付け」
- user のイベントメニュー追加・カート表示に触れた PR の画面確認

## 起動（下書き — `1-2-1` で実測後に更新）

1. リポジトリルートで依存を導入済みであること。
2. `npm -w user run dev -- -m development` を実行する。
3. 起動ログに表示されたローカル URL を正とする（ポート固定値は仮定しない）。
4. 接続先 Firebase は `user/.env.development` のプロジェクト。Emulator を使う場合は Auth / Firestore / Functions をすべて揃える（Firestore だけの起動を隔離とみなさない）。

## 診断（下書き）

| 症状 | 切り分け | 停止 |
| --- | --- | --- |
| サーバーが起動しない | Node 版、依存、`common` ビルド、env 欠落 | 修正または env 整備を別作業に |
| ログインできない | `1-6` の採用方式・受け口・Emulator 接続 | 認証経路が未整備なら製品/Issue へ（D-15） |
| メニューが選べない | イベント状態が `accepting_order` か、売切・上限 | fixture またはイベント状態を直す |
| `addToCart` 失敗 | Functions 接続、Rules、Callable エラー | コンソール・Network のエラーを証拠に停止 |

## ログイン（sandbox / 受け口有効時）

前提: `VERIFICATION_TEST_OUTBOX_MODE=record_skip_send` が Functions にデプロイ済み。fixture は [fixture-pstack-001.md](../../../documents/AIエージェント/02_pstack/records/fixture-pstack-001.md)。

1. `verification_run_id` をその実行ごとに新規生成する（例: ISO 日時 + 乱数。秘密ではない）。
2. `/login` で fixture の `userEmail` を入力し、ログインコードを送信（`requestEmailLogin` に `verification_run_id` を渡す実装はアプリ側が対応後に UI から送る。未対応時はエージェントが Callable を直接呼んでもよい）。
3. `fetchVerificationTestPassCode` で `{ email, verification_run_id }` を渡し OTP を取得（`base/src/apis/verificationTest.ts` または同等の Callable）。
4. `/pass-code` で OTP を入力し `signInWithCustomToken` まで完了する。
5. 新しいブラウザコンテキストで手順 2〜4 を再実行できること（人の既存セッションの再利用だけでは未達）。

## 操作

`feature-map.md` の Fixture を投入済みであること（`scripts/pstack/seed-pstack-fixture.mjs`）。

1. ログイン完了後、`/c/{communityAccount}/e/{eventId}` を開く。
2. fixture メニュー（表示名 `pstack検証弁当`）を選択し、数量 1 でカートに追加。
3. `/cart` で名称・数量が一致することを確認。

操作対象は DOM または画面上の日本語文言で特定する（固定 sleep だけを成功判定にしない）。

## 証拠

各完了条件（C1〜C3、フェーズ0調査）に対応させる。

- 接続先 URL（ローカルまたは sandbox）
- git `HEAD` SHA（未コミット差分がある場合はその旨）
- スクリーンショット **または** Playwright MCP のアクセシビリティスナップショット（必須）
- 必要なら Callable エラーなしの記録（トークン・メール本文は含めない）

チャット本文だけでは完了にしない。

## 片付け

- 自分が起動した dev サーバー・ブラウザコンテキストを止める。
- 認証状態ファイルは Git に含めない。

## 詰まり記録

| 分類 | 記録 |
| --- | --- |
| 起動 | コマンド、エラー全文 |
| 操作 | 止まった画面・要素 |
| テストユーザー | 方式未整備 / コード取得失敗 等 |

## 補助

反復操作が多い場合のみ、同ディレクトリにスクリプトを置く。現時点では不要（理由: 手順 1 回分のみ）。

## 参照

- [feature-map.md](./feature-map.md)
- [フェーズ0調査](../../../documents/AIエージェント/02_pstack/records/2026-10-04-フェーズ0調査.md)
- [検証用ログインの検討](../../../documents/AIエージェント/02_pstack/03_検証用ログインの検討.md)
- Playwright MCP 試行: [playwright-mcp PhaseA/B](../../../documents/テスト方針・テスト項目書/playwright-mcp/)
