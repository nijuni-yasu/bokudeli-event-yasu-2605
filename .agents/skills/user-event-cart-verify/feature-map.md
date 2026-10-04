# Feature Map: user イベントメニュー → カート反映

対象は D-14 の 1 機能のみ。全画面マップではない。

## 目的

参加者が注文受付中のイベントでメニューを選び、カートに数量を反映できることを、エージェントが再実行可能な手順で証明する。

## 入口

| 入口 | URL パターン | 前提 |
| --- | --- | --- |
| イベントページ | `/c/{communityAccount}/e/{eventId}` | イベントが注文受付可能（`accepting_order`）、ユーザーがログイン済み |
| カート | `/cart` | 直前に当該イベントから `addToCart` 成功 |

## Fixture（未投入 — 更新待ち）

データ投入後に次の列を具体値で埋める。

| キー | 用途 | 現状 |
| --- | --- | --- |
| `communityAccount` | URL | TBD |
| `eventId` | URL | TBD |
| `menuDisplayName` | 操作・期待表示 | TBD |
| `quantity` | 操作（初期 1） | `1` |
| `testUser` | 認証（メール等は記録しない） | TBD（UID のみ検証ログに可） |

初期状態: 当該ユーザーのカートに同一イベントの未確定行が無いこと。

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
