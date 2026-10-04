# Feature Map: user イベントメニュー → カート反映

対象は D-14 の 1 機能のみ。全画面マップではない。

## 目的

参加者が注文受付中のイベントでメニューを選び、カートに数量を反映できることを、エージェントが再実行可能な手順で証明する。

## 入口

| 入口 | URL パターン | 前提 |
| --- | --- | --- |
| イベントページ | `/c/{communityAccount}/e/{eventId}` | イベントが注文受付可能（`accepting_order`）、ユーザーがログイン済み |
| カート | `/cart` | 直前に当該イベントから `addToCart` 成功 |

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

## 操作（要約）

1. ログイン（方式は `03_検証用ログインの検討.md` / チェックリスト `1-6` 採用後に SKILL へ反映）
2. イベント URL を開く
3. 対象メニューの「カートに入れる」相当操作 → ダイアログで数量選択 → 追加
4. `/cart` で行を確認

詳細手順は `SKILL.md` の「操作」節（フェーズ1 `1-2-6` で拡充）。

## 期待結果

- C2: カート追加後 `/cart` に遷移、エラーなし
- C3: カート行の名称・数量が fixture と一致

## 関連コード（変更時の参照）

| 層 | パス |
| --- | --- |
| イベントページ | `user/src/pages/c/[communityAccount]/e/[eventId]/index.vue` |
| カートダイアログ | `base/src/components/EventCartDialog.vue` |
| カートページ | `base/src/components/pages/cart.vue` |
| Callable | `functions/default` の `addToCart`（export は `index.ts`） |
| API クライアント | `base/src/apis/order.ts` |

## 対象外

決済確定、本番プロジェクト、他ユーザーの実データ変更、partner / enterprise 画面。

## 検証スキル

`.agents/skills/user-event-cart-verify/SKILL.md`
