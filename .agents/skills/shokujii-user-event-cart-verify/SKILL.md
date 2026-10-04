---
name: shokujii-user-event-cart-verify
description: Shokujii user アプリで、注文受付中イベントのメニューをカートに追加し /cart で内容を確認する検証手順。pstack フェーズ1・標準フローの画面証拠用。イベント→カート、D-14、検証スキル、画面確認、Playwright で触るときは必ずこのスキルを使う。
---

# user イベント → カート検証

正本はこのファイル。正本経路は **予約 sandbox**（現状は sandbox2603）。`feature-map.md` は機能の地図、実行ログは `documents/AIエージェント/02_pstack/records/` に置く。2606〜2608 へはデータ構築の別 PR まで push / seed / `FUNCTIONS_ENV` 変更をしない。

D-05 / D-14 によりローカル UI と予約 sandbox の両方で C1〜C3 を証明する。現時点の成功記録は sandbox のみであり、ローカルの接続先・実機証拠が揃うまでフェーズ1全体は未完了（末尾の「ローカル」参照）。

## いつ使うか

- pstack 導入フェーズ1の「起動→操作→証拠→片付け」
- user のイベントメニュー追加・カート表示に触れた PR の画面確認
- 新規会話から手順だけで再実行するとき（チェックリスト `1-4-3`）

## 起動（1-2-1）

dev サーバーは起動しない。ブラウザは Hosting URL を開く。

1. [sandbox-pool.md](../../../documents/AIエージェント/02_pstack/records/sandbox-pool.md) で予約を確認する。正本 JSON の現在の作業ブランチに対応する予約 ID・世代・環境を取得する。#2398 の過去の予約 ID をコピーしない。現状の候補は **sandbox2603**。予約のない環境へ push / dispatch しない。2606〜2608 へはデータ構築の別 PR まで触れない。
2. `git rev-parse HEAD` で対象 SHA を記録する。未コミット差分がある場合は証拠に明記する。
3. 作業ブランチを、現行予約のロックを保持する `sandbox_reservation.py run -- ...` 経由で sandbox リモートへ push する。手順は [github-actions-deploy](../github-actions-deploy/SKILL.md)。
4. 最低限 `deploy_user.yml` / `deploy_functions.yml` / `deploy_firestore.yml` を発火する。`deploy_enterprise.yml` は sandbox で hosting target 未設定のためスキップしてよい。
5. 6 本一括発火すると、同じブランチの Deploy functions が重なり **cancelled** になり得る。functions が in_progress なら完了を待つ。cancelled の場合は原因を確認し、D-11 の一時障害に限って同じ SHA・予約で最大2回再試行する。予約ロック経由で発火する。
6. 成功判定: 必要な user / functions / firestore の全 run が `completed` / `success`、各 `headSha` が対象 PR HEAD と一致することを `gh run view <run-id> --repo <repo> --json headSha,status,conclusion,url` で確認する。その後に新しいブラウザで C1〜C3 を実行する。途中の画面確認は参考証拠であり、旧 Functions が応答しても最新版の成功に数えない。

## 接続先と外部作用（1-2-2）

他の予約環境では、台帳の環境 ID に合わせて Hosting URL と `GCLOUD_PROJECT` を置換する。

| 項目 | sandbox2603 |
| --- | --- |
| Hosting user | `https://bokudeli-event-yasu-2603.web.app` |
| GCP / `GCLOUD_PROJECT` | `bokudeli-event-yasu-2603` |
| Functions リージョン | `asia-northeast1` |
| 受け口 | `VERIFICATION_TEST_OUTBOX_MODE=record_skip_send`（GitHub Variables の `FUNCTIONS_ENV` + functions デプロイ） |
| 本番 | 接続禁止（D-06 / 0-1-3） |
| 検証メール | `@verify.shokujii.test` のみ受け口へ記録。実 SendGrid は送らない |
| 対象外の外部 SDK | Google / Facebook / X ログインは使わない |

採用方式: [2026-10-04-検証用ログイン採用.md](../../../documents/AIエージェント/02_pstack/records/2026-10-04-検証用ログイン採用.md)。

## ブラウザ操作（1-2-3）

| 項目 | 値 |
| --- | --- |
| クライアント | Cursor |
| MCP | ワークスペース `.mcp.json` の `playwright`（`@playwright/mcp`）。バージョン未記録 |
| 実測 | 2026-10-04 の 1-4-1 で Hosting URL の読取・クリック・入力・スクショまで成功 |

操作手順:

1. `browser_navigate` で対象 URL を開く。
2. `browser_snapshot` で a11y スナップショットを取る。
3. スナップショットの `target` ref で `browser_click` / `browser_type` する。
4. 固定秒数の sleep だけを成功判定にしない。URL 遷移と日本語文言で判定する。

判定に使う文言の例: `メールアドレスでログイン`、`パスコードを入力`、`注文して参加する`、`カートに追加`、`pstack検証弁当`。

## fixture と認証（1-2-4）

正本: [fixture-pstack-001.md](../../../documents/AIエージェント/02_pstack/records/fixture-pstack-001.md)。具体値は [feature-map.md](./feature-map.md)。

### データの準備・復元

D-12 に従い、新しい作業・別ブランチへの割当で `seed=true` のときだけ、旧 run の終了確認後に初期化する。同じ作業の再検証・修正・再デプロイ・人の確認待ちでは seed しない。seed は当該ユーザー・イベントの `status=in_cart` だけを削除する。

```text
python3 .agents/scripts/sandbox_reservation.py run \
  --env "$ENV_ID" --reservation-id "$RES_ID" --generation "$GENERATION" -- \
  env GCLOUD_PROJECT="$GCLOUD_PROJECT" node scripts/pstack/seed-pstack-fixture.mjs
```

実ユーザー情報・秘密は記録しない。メールは fixture の架空アドレスのみ使う。

### ログイン（人の補助なし）

既存セッションの再利用だけでは未達（D-05）。新しいブラウザコンテキストで毎回 OTP フローを完走する。MCP が同じコンテキストを使い回す場合は、cookie と IndexedDB を消してから `/login` を開く。

1. 実行ごとに `verification_run_id` を新規生成する（例: `pstack-YYYYMMDDTHHMMSSZ`。秘密ではない）。
2. `{hosting}/login?verification_run_id={RUN_ID}` を開く。アプリは query または `sessionStorage` キー `pstack_verification_run_id` を `requestEmailLogin` に渡す。
3. メール欄に `pstack.participant@verify.shokujii.test` を入れ、「メールアドレスでログイン」を押す。`/pass-code` へ遷移する。
4. 既存の Application Default Credentials（ADC）の Firestore 読取権限で OTP を取得する。公開 Callable は廃止。事前に `npm -w common run build` と `npm -w functions/default run build` を実行する。ADC 未設定・権限不足なら停止し、不足を報告する。追加権限を自動付与しない。トークン・コードを実行記録に残さず取得成否だけ書く。

```text
GCLOUD_PROJECT=bokudeli-event-yasu-2603 node scripts/pstack/fetch-test-pass-code.mjs \
  --email pstack.participant@verify.shokujii.test --run-id {RUN_ID}
```

5. `/pass-code` の 6 桁入力に OTP を入れる。ホーム等へ遷移したら C1 達成。
6. UI を使わず OTP だけ発行したい場合の代替: `scripts/pstack/request-test-login.mjs`（画面証拠の主経路ではない）。

## 診断（1-2-5）

起動成功: Hosting URL が開き、ログイン画面またはイベントページが表示される。

| 症状 | 切り分け | 停止 |
| --- | --- | --- |
| 予約なし / 他作業の占有 | sandbox-pool の予約行 | push / dispatch しない |
| user デプロイ失敗 | Actions の `deploy_user.yml` | ビルド/Hosting ログを証拠に停止 |
| functions cancelled | 同ブランチの重複 dispatch | `deploy_functions.yml` を単体再発火 |
| OTP が取れない / not-found | ADC 不足、Functions 受け口 off、functions 未デプロイ、`run_id` 不一致、許可ドメイン外 | 受け口設定または seed を直す。製品不具合なら D-15 |
| `/login` が `/register/complete` 等へ飛ぶ | Playwright MCP が前実行の Firebase Auth（IndexedDB）を残している | cookie と IndexedDB を消してから `/login?verification_run_id=...` を開き直す。新しいタブだけでは足りない |
| ログインできない | 上記 + `/pass-code` の email 欠落（history.state） | ログインからやり直す |
| メニューが選べない / 未ログイン要求 | セッション未確立、イベントが `accepting_order` でない | seed またはログインをやり直す |
| `addToCart` 失敗 | Functions / Rules / Callable エラー | コンソール・Network を証拠に停止（トークンは含めない） |

## 操作（1-2-6）

初期状態: 新規割当は seed 済み。同じ作業の再検証では既存データを保持する。新しいブラウザ、未ログイン。ログイン後、追加前の `/cart` で対象メニューの数量 N を記録する（行がなければ N=0）。操作対象はスナップショット上の日本語文言。

1. 起動〜ログイン（1-2-1〜1-2-4）を完了する。C1: ログイン後にイベント URL を開いてもログイン要求に戻されない。
2. `{hosting}/c/pstack-verify/e/pstack-event-cart-001` を開く。見出し `pstackカート検証イベント`、状態 `参加受付中`、メニュー `pstack検証弁当` / `¥800` を確認する。
3. メニューの「注文して参加する」を押す。ダイアログで個数 `1`、名称 `pstack検証弁当`、金額 `¥800` を確認する。
4. 「カートに追加」を押す。`/cart` へ遷移し、エラーアラートが出ないこと（C2）。
5. カート表でメニュー `pstack検証弁当`、個数 `N+1`、単価 `¥800`・行合計 `¥800 × (N+1)` を確認する（C3）。決済（「お支払いに進む」）はしない。

## 証拠（1-2-7）

チャット本文だけでは完了にしない。実行ログは `documents/AIエージェント/02_pstack/records/`（例: `2026-10-04-実行-1-4-1.md`）。

| 完了条件 | 必須の証拠 |
| --- | --- |
| C1 | Hosting URL、`/login` → `/pass-code` → ログイン後画面のスナップショットまたはスクショ。人のメール閲覧なし |
| C2 | イベント URL、追加後 `/cart` のスナップショット。エラーなし |
| C3 | カート行の名称と追加前後の数量差 +1 が一致するスナップショットまたはスクショ |

共通して記録する:

- 接続先 Hosting URL と `GCLOUD_PROJECT`
- `git rev-parse HEAD`（未コミット差分があればその旨）
- 必要な全デプロイの run URL・headSha・status・conclusion（必須）。PR HEAD と一致する証拠
- 実行時刻（UTC または JST）
- Playwright の a11y スナップショット **または** スクリーンショット（`records/evidence/` は Git 任意）

OTP・カスタムトークン・メール本文は記録しない。

## 片付け・詰まり・補助（1-2-8）

### 片付け

- 自分が開いた Playwright のブラウザコンテキストを閉じる。
- 自分が起動したプロセスだけ止める（正本では dev サーバーは起動しない）。
- 認証状態ファイルは Git に含めない。
- sandbox の予約は PR マージ・クローズまたは明示返却まで保持する（D-04）。検証完了だけでは返却しない。

### 詰まり記録

| 分類 | 記録 |
| --- | --- |
| 起動 | 予約、dispatch した workflow、run URL、エラー全文 |
| 操作 | 止まった URL・画面・要素ラベル |
| テストユーザー | OTP 取得失敗、受け口 off、`run_id` 不一致 等 |
| 次に必要な入力 | 人が決める仕様・権限・費用だけ書く |

失敗時も上記とスナップショットを残す。

### 補助

スキルディレクトリに新規スクリプトは置かない。反復はリポジトリの次を使う。

| スクリプト | 用途 |
| --- | --- |
| `scripts/pstack/seed-pstack-fixture.mjs` | fixture 投入と `in_cart` 削除 |
| `scripts/pstack/fetch-test-pass-code.mjs` | 受け口から OTP 取得 |
| `scripts/pstack/request-test-login.mjs` | UI を使わない OTP 発行（代替） |

## ローカル（D-05 / D-14 必須・実機証明は未完了）

sandbox とは別に、新しいブラウザで C1〜C3 を実行し、ローカル URL・接続先 project・対象 HEAD・証拠を記録する。未整備の経路を成功扱いにしない。

- 前提: Node はルート package.json の engines に従い npm を使う。`npm install`、`npm -w common run build` を行う。予約 sandbox を指す user のローカル env（Git 非管理）を用意して `npm -w user run dev -- -m <sandboxのenv接尾辞>` で起動する。URL は起動ログを正とする（ポート固定禁止）。
- env の Auth / Firestore / Functions は同じ予約 sandbox を指すことを確認する。組織本流 development / 本番への接続は禁止。Emulator を使うなら Auth / Firestore / Functions をすべて揃える（Firestore だけを隔離とみなさない）。
- 受け口・fixture・OTP 取得は、接続先 Functions / Firestore を自分で揃えるまで停止する。未整備のまま C1〜C3 を主張しない。

## 参照

- [feature-map.md](./feature-map.md)
- [最初の実行依頼](./templates/first-request.md)
- [フェーズ0調査](../../../documents/AIエージェント/02_pstack/records/2026-10-04-フェーズ0調査.md)
- [検証用ログインの検討](../../../documents/AIエージェント/02_pstack/03_検証用ログインの検討.md)
- [sandbox-pool.md](../../../documents/AIエージェント/02_pstack/records/sandbox-pool.md)
- Playwright MCP 試行: [playwright-mcp PhaseA/B](../../../documents/テスト方針・テスト項目書/playwright-mcp/)
