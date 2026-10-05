# Feature Map: user イベントメニュー → カート反映

対象は D-14 の 1 機能のみ。全画面マップではない。正本経路は予約 sandbox。詳細手順は [SKILL.md](./SKILL.md)。

## 目的

参加者が注文受付中のイベントでメニューを選び、カートに数量を反映できることを、エージェントが再実行可能な手順で証明する。

## 入口

| 入口 | URL パターン | 前提 |
| --- | --- | --- |
| ログイン | `/login?verification_run_id={RUN_ID}` | 新しいブラウザ。受け口有効 |
| イベントページ | `/c/{communityAccount}/e/{eventId}` | イベントが `accepting_order`、ユーザーがログイン済み |
| カート | `/cart` | 直前に当該イベントから `addToCart` 成功 |

sandbox2603 のイベント URL: `https://bokudeli-event-yasu-2603.web.app/c/pstack-verify/e/pstack-event-cart-001`

## Fixture（`pstack-001`）

正本: [fixture-pstack-001.md](../../../documents/AIエージェント/02_pstack/records/fixture-pstack-001.md)

| キー | 値 |
| --- | --- |
| `communityAccount` | `pstack-verify` |
| `eventId` | `pstack-event-cart-001` |
| `menuDisplayName` | `pstack検証弁当` |
| `menuPrice` | 800 |
| `quantity` | 1 |
| `userEmail` | `pstack.participant@verify.shokujii.test`（ログ記録に UID `pstack-user-participant-001` 可） |

初期状態: seed 実行後、当該ユーザーの当該イベントに `in_cart` 行が無いこと。

## 完了条件（C1〜C3）

フェーズ0調査と一致。fixture 値で固定する。

| # | 操作 | 期待結果 |
| --- | --- | --- |
| C1 | 新しいブラウザで受け口付きメールログイン | ログイン後、イベント URL を開いてもログイン要求に戻されない |
| C2 | イベントで `pstack検証弁当` を数量 1 でカートに追加 | `/cart` に遷移する。エラーアラートが出ない |
| C3 | カート画面で当該イベントの行を確認 | メニュー `pstack検証弁当`、個数 `1`（オプションなし） |

## 操作（要約）

1. [SKILL.md](./SKILL.md) のログイン（query の `verification_run_id` + 受け口 OTP）
2. イベント URL を開く
3. 「注文して参加する」→ ダイアログで個数 1 → 「カートに追加」
4. `/cart` の表でメニュー名・個数を確認。決済確定はしない

## UI ラベル（正本）

| 画面 | ラベル |
| --- | --- |
| ログイン | `メールアドレスでログイン` |
| パスコード | `パスコードを入力` |
| イベント | `注文して参加する` |
| カートダイアログ | `カートに追加` |
| カート表 | 列 `メニュー` / `個数` / `メニュー金額` |

## Map と検証の対応（1-3-2）

| Map の行 | SKILL の章 | 証拠 |
| --- | --- | --- |
| ログイン入口 | 起動 / fixture と認証 / 操作 1 | C1: `/login` → `/pass-code` → ログイン後画面のスナップショット |
| イベント入口 | 操作 2〜3 | C2: イベント画面と `/cart` 遷移のスナップショット |
| カート入口 | 操作 4〜5 | C3: カート表の名称・個数。スクショまたは a11y で足りる |
| 対象外（決済・本番・他アプリ） | 操作「決済しない」/ 接続先「本番禁止」 | 実行しない。未実施を成功に数えない |

期待値は fixture と製品仕様由来。偶然観測した不具合を期待仕様にしない。

## 関連コード（変更時の参照）

| 層 | パス |
| --- | --- |
| イベントページ | `user/src/pages/c/[communityAccount]/e/[eventId]/index.vue` |
| カートダイアログ | `base/src/components/EventCartDialog.vue` |
| カートページ | `base/src/components/pages/cart.vue` |
| ログイン | `user/src/pages/login.vue`（`verification_run_id`） |
| Callable | `functions/default` の `addToCart` / `requestEmailLogin` |
| API クライアント | `base/src/apis/order.ts` |

## 対象外

決済確定、本番プロジェクト、他ユーザーの実データ変更、partner / enterprise 画面。IndexedDB のセッション再利用（1-6-2）と Auth Emulator 単体（1-6-3）は主経路外。

## 既知の制約

- sandbox の `deploy_enterprise.yml` は hosting target 未設定で失敗し得る。本検証では不要。
- 6 本同時 dispatch で `deploy_functions.yml` が cancelled になり得る。functions は単体再発火する。

## Map 照合の保守（1-4-4）

対象 PR でイベント / カート / メールログイン / 受け口を触ったとき、または月 1 回、実物とこの Map・SKILL を照合する。定期自動実行はしない。

判定は次のいずれか 1 つ。記録は [02_導入チェックリスト.md](../../../documents/AIエージェント/02_pstack/02_導入チェックリスト.md) の変更履歴、または `documents/AIエージェント/02_pstack/records/` に 1 行残す。

| 判定 | 意味 |
| --- | --- |
| 一致 | 画面と手順が同じ |
| 手順書だけ古い | 製品は正しい。SKILL / Map を直す |
| 製品不具合 | 手順を仕様に合わせて緩めない。D-15 で Issue 追跡 |

## 検証スキル

[SKILL.md](./SKILL.md)
