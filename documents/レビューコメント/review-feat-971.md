# ブランチ feat/971 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み |
| [ ] | RC-2 | 4079879628, 4079887328 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
| [ ] | RC-3 | 4079879517, 4079887317 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討 |
| [ ] | RC-4 | 4079879607, 4079887347 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にする |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み |
| [x] | RC-6 | 4079879564 | 👌 修正不要 | — | 📌 スコープ内 | — | — | — | receipt.docx 未同梱指摘<br>PR に binary 同梱済みで誤検知 |
| [x] | RC-7 | 4079887335 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 領収書明細 menu_price と自己負担小計の不一致 |
| [x] | RC-9 | 4079879701 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | invoice コメント「同意」→「同値」の誤記 |
| [x] | RC-10 | 4079879666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 手数料説明をオンライン決済時に統一 |
| [x] | RC-11 | 4079879724 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 利用規約第13条2項の文言を明確化 |
| [x] | RC-12 | 4079887341 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | キャンセルポリシー desc_after の br 表示 |
| [ ] | RC-13 | 4101673881 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 無料の主催者負担キャンセルに手数料非返金<br>差額なしでは決済手数料が発生しない |
| [x] | RC-14 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 10%税抜コメントが floor(税込/1.1) と同値と誤記<br>110円で 99 になる旨へ修正済み |
| [ ] | RC-15 | 4101673867 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 返金失敗でも canceled を明細から除外する<br>小計は成功返金のみ控除のため不一致になり得る |
| [ ] | RC-16 | 4101673874 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行追加で Stripe 100明細上限を超え得る<br>呼び出し前の予約チェック方針が一意でない |

---

## 評価セッション（2026-09-22 18:26・shokujii-code-review）

- **評価日時**: 2026-09-22 18:26 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/971
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/pages/cart.vue:437`

**該当コード（レビュー時点の diff）**:

```diff
+const userPaymentFeeForItem = (item: EnrichedCartItem): number => {
+  if (!needsStripeCheckoutForItem(item)) return 0
+  return computeUserPaymentFeeFromSelfPay(item.totalPrice)
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: カートの手数料プレビューが `needsStripeCheckoutForItem` + `computeUserPaymentFeeFromSelfPay` になっており、マイページの `previewUserPaymentFee` と判定が二重化している → `previewUserPaymentFee` に揃える

**コメント要約**: カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: common のプレビュー式が手数料適用条件の正本。カートだけ Checkout 要否を挟むと、将来の条件変更で表示がずれる。手順 3b で `previewUserPaymentFee` に置換した。

---

## 評価セッション（2026-09-22 20:32・shokujii-code-review）

- **評価日時**: 2026-09-22 20:32 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/971
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a / 3b**: 🚨 0 件。🟡 はいずれも自動修正対象外（RC-2: 👤 UX・📋・M / RC-3: 💰・📋・仕様判断 / RC-4: 💰）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-2 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
| [ ] | RC-3 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討 |
| [ ] | RC-4 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にする |

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/UserEventCard.vue:77`

**該当コード（レビュー時点の diff）**:

```diff
+const paymentFee = computed(() =>
+  previewUserPaymentFee(props.event.event_payment, totalPrice.value, props.event.community_bill_settings),
+)
+
+const grandTotal = computed(() => totalPrice.value + paymentFee.value)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📋仕様追加/M]: マイページの決済手数料が残自己負担の `previewUserPaymentFee` になっており、部分キャンセル後に表示手数料が下がる → 確定後の正本は `EventStripe.pay_user_fee_amount`（仕様 §4.2.6.3 / §4.2.3）

**コメント要約**: マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 仕様 §4.2.6.3 は手数料をセッションに 1 回載せどのキャンセルでも返さない。カードは残注文の自己負担からプレビューするため、2000+220 のあと 1000 円分をキャンセルすると 1000+110 と見え、領収書の 1220 とずれる。実装計画の「Stripe 未取得ならプレビュー可」は許容だが、確定後表示としては不足。EventStripe 取得が必要で方針が一意でないため自動修正しない。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/stripeWebhook.ts:406`

**該当コード（レビュー時点の diff）**:

```diff
-    const payAmount = orders.reduce((sum, o) => sum + computeOrderSelfPayUnitAmount(o), 0)
+    const selfPayAmount = orders.reduce((sum, o) => sum + computeOrderSelfPayUnitAmount(o), 0)
+    const { pay_amount: payAmount, pay_user_fee_amount: userFeeAmount } = computeEventStripePayFields(selfPayAmount)
+    if (!isCheckoutAmountTotalMatchingPayAmount(session.amount_total, payAmount)) {
+      logger.error('Checkout amount_total does not match recomputed pay_amount', {
+        paymentIntent,
+        amountTotal: session.amount_total,
+        selfPayAmount,
+        userFeeAmount,
+        payAmount,
+      })
+      return {
+        kind: 'client_error',
+        message: `amount_total mismatch: session=${session.amount_total} pay_amount=${payAmount}`,
+      }
+    }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📋仕様追加/M]: Webhook が常に手数料込み `pay_amount` と `amount_total` を比較するため、手数料なしの進行中 Checkout は 400 で確定できない → `amount_total === selfPay` のレガシーは fee 0 で受け付けるか、デプロイ手順を明記する

**コメント要約**: 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: Checkout と Webhook は同一 codebase で同時デプロイされるが、有効期限 31 分の旧セッション（手数料 line item なし）が新 Webhook に当たると `amount_total === selfPay` 対 `pay_amount === selfPay+fee` で fail-closed 400 が続き、決済済みなのに注文が `processing` のまま残る。定常状態のバグではなくロールアウト窓の仕様判断なので自動修正しない。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/utils/refundMemberOrdersStripe.ts:105`

**該当コード（レビュー時点の diff）**:

```diff
+/**
+ * Stripe 返金額は食事の自己負担（menu_price − 割引）のみ。
+ * 決済手数料（EventStripe.pay_user_fee_amount）は返金しない。
+ * pay_amount が手数料込みでも、返金額に手数料を足さない。
+ */
+export function computeStripeRefundAmountForMemberOrders(orders: EventMemberOrder[]): number {
+  return orders.reduce((sum, o) => sum + o.menu_price - getMemberOrderDiscountAmount(o), 0)
+}
```

（上限チェック本体は未変更のまま `pay_amount` と比較している）

```diff
       const existingRefundTotalPre = stripeDocPre.refunds.reduce((sum, r) => sum + r.amount, 0)
       if (existingRefundTotalPre + refundAmount > stripeDocPre.pay_amount) {
         throw new Error(
           `返金累計額が決済額を超えます: existing=${existingRefundTotalPre} + new=${refundAmount} > pay_amount=${stripeDocPre.pay_amount}`,
         )
       }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 返金累計の上限が手数料込みの `pay_amount` のままなので、計算ずれ時に手数料分まで返金できる → 上限を `pay_amount - (pay_user_fee_amount ?? 0)` にする

**コメント要約**: 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にする

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 返金額の式は Checkout 自己負担と同じため通常は手数料に食い込まない。ただし `pay_amount` の意味が手数料込みに変わったあと、安全側の上限だけが緩くなっている。仕様 §4.2.6.1 の「手数料は返金しない」に合わせるなら上限は `food_charged`。💰 のため自動修正しない。

---

## 評価セッション（2026-09-22 22:31・shokujii-code-review）

- **評価日時**: 2026-09-22 22:31 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/971
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a / 3b**: 🚨 0 件。RC-5 を 3b で自動修正。既存 RC-2・RC-3・RC-4 は対象外のまま未着手

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み |

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/01_マネタイズと決済/02_ユーザー決済手数料.md:242`

**該当コード（レビュー時点の diff）**:

```diff
+#### 4.2.7.4 金額
+
+税込円。内税の分解は既存ユーティリティに合わせる。
+
+- 8%（食事）: `computeInclusive8ExTaxAndTax`（税抜 = `Math.floor(税込 / 1.08)`）
+- 10%（手数料）: 税抜 = `Math.floor(税込 / 1.1)`、税額 = 税込 − 税抜（請求書手数料と同じ）
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: 仕様 §4.2.7.4 の 10% 税抜が `Math.floor(税込 / 1.1)` のままだが、実装は浮動小数誤差回避のため `Math.floor((税込 * 10) / 11)` → 仕様を実装に合わせる

**コメント要約**: 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `110 / 1.1` は IEEE 浮動小数で 99.999… になり `floor` すると 99。実装は整数演算に直済みで、仕様だけ旧式のままだと領収書内税の正本がずれる。手順 3b で §4.2.7.4 を `computeInclusive10ExTaxAndTax` に揃えた。

---

## 評価セッション（2026-09-23 16:11・PR #2361 AI レビュー auto）

- **評価日時**: 2026-09-23 16:11 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: #2361
- **REVIEW_REQUEST_SINCE**: 2026-09-23T06:56:49Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（依頼コメント id 5790458709 は手順 12 定型文）
- **手順 4a 自動修正**: RC-9〜RC-12（🚨 0件 / 🟡 4件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-2 | 4079879628, 4079887328 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | 確定手数料は pay_user_fee_amount 合算表示 |
| [ ] | RC-3 | 4079879517, 4079887317 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 手数料導入前 Checkout の Webhook 400 |
| [ ] | RC-4 | 4079879607, 4079887347 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限から手数料を除外 |
| [x] | RC-6 | 4079879564 | 👌 修正不要 | — | 📌 スコープ内 | — | — | — | receipt.docx は PR 同梱済み |
| [x] | RC-7 | 4079887335 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 領収書明細と自己負担小計の整合 |
| [x] | RC-9 | 4079879701 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 同意→同値 |
| [x] | RC-10 | 4079879666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オンライン決済時の表現 |
| [x] | RC-11 | 4079879724 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 規約第13条2項 |
| [x] | RC-12 | 4079887341 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | desc_after v-html |

---

**識別子**: RC-3（GitHub id: 4079879517, 4079887317）

**レビュワー**: Copilot / chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/stripeWebhook.ts:406`

**該当コード（レビュー時点の diff）**: (diff_hunk 省略・PR Files changed 参照)

**レビュワーのコメント（原文）**: 手数料導入前に作成された Checkout Session（amount_total=自己負担のみ）が Webhook で 400 となり決済済みなのに注文確定されない。レガシー許容または再決済誘導が必要。

**コメント要約**: 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討

**評価**: 🚨 必須修正（セルフレビュー時 🟡 から Copilot/Codex P1 で昇格）

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: デプロイ直後31分のロールアウト窓は実害あり。metadata/version 分岐または fee=0 レガシー確定の設計が必要。💰・仕様判断のため auto 修正対象外。

---

**識別子**: RC-7（GitHub id: 4079887335）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:105`

**レビュワーのコメント（原文）**: `menu_price` は割引前商品価格だが食事小計は自己負担額ベース。補助・部分キャンセルで明細行と小計が一致しない。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 2ブロック領収書で明細配列を表示する以上、課金食事額との対応付けまたは非表示方針の仕様確定が先。auto 修正対象外。ユーザー依頼で対応。内訳は残 `ordered` の自己負担単価に変更し、§4.2.7.5 を更新した。

---

**識別子**: RC-6（GitHub id: 4079879564）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/templates/receipt.docx`

**レビュワーのコメント（原文）**: receipt.docx が PR に含まれておらず2ブロックにならない。

**評価**: 👌 修正不要

**判断理由**: `git diff origin/development...HEAD` に `receipt.docx` の binary 更新が含まれる。Copilot の Files changed 認識の誤り。

---

## 評価セッション（2026-09-25 15:01・shokujii-code-review）

- **評価日時**: 2026-09-25 15:01 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/971
- **PR**: #2361
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a / 3b**: 🚨 新規 0 件。🟡 RC-14 を手順 3b で修正。RC-13 は 👤 UX のため自動修正しない。既存 RC-2 / RC-3 / RC-4 は未着手のまま再掲しない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-13 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 無料の主催者負担キャンセルに手数料非返金<br>差額なしでは決済手数料が発生しない |
| [x] | RC-14 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 10%税抜コメントが floor(税込/1.1) と同値と誤記<br>110円で 99 になる旨へ修正済み |

---

**識別子**: RC-13（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/locales/messages/ja.ts:558`

**該当コード（レビュー時点の diff）**:

```diff
       description_community_bill: `注文したメニューを選択してキャンセルを実行してください。<br />
-                      キャンセルは、イベントの注文期限まで実行可能です。`,
+                      キャンセルは、イベントの注文期限まで実行可能です。<br />
+                      決済手数料は返金されません。`,
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `description_community_bill` は差額なし（`type !== 'discount'`、実質 `free`）のキャンセル確認にだけ出るが、「決済手数料は返金されません」と書いている。この支払いでは Checkout せず手数料は 0 → この文をこのキーから外す

**コメント要約**: 無料の主催者負担キャンセルに手数料非返金<br>差額なしでは決済手数料が発生しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 §1.4.2 では請求書のみ・自己負担 0 は手数料なし。差額あり用の `description_community_bill_discount` に非返金を書くのは正しい。無料参加の確認文まで同じだと、払っていない手数料が返らないように読める。👤 UX のため手順 3b の対象外。

---

**識別子**: RC-14（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/utils/invoice.ts:98`

**該当コード（レビュー時点の diff）**:

```diff
+/**
+ * 10% 税込合計から税抜・税額を求める（領収書の決済手数料）。
+ * `Math.floor(税込 / 1.1)` と同値。整数演算にして 110 / 1.1 の浮動小数誤差を避ける。
+ */
+export function computeInclusive10ExTaxAndTax(taxInclusive: number): { exTaxPrice: number; taxPrice: number } {
+  const exTaxPrice = Math.floor((taxInclusive * 10) / 11)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `computeInclusive10ExTaxAndTax` のコメントが `Math.floor(税込 / 1.1)` と同値としているが、110 円は floor すると 99 になり同値ではない → 整数式を正とし、`/ 1.1` は使わないと書く

**コメント要約**: 10%税抜コメントが floor(税込/1.1) と同値と誤記<br>110円で 99 になる旨へ修正済み

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 §4.2.7.4 と RC-5 で整数演算に揃えたあとも、関数コメントが旧式と同値だと読める。手順 3b でコメントを「110 円で 99 になるため使わない」に直した。

---

## 評価セッション（2026-09-25 15:13・review-comments-evaluate）

- **評価日時**: 2026-09-25 15:13 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-25T06:03:54Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（id:5827653737 Codex サマリ/接続案内、id:5827657221 手順12定型文）
- **重複スキップ**: Copilot 概要 id:5827746058（RC-2 / RC-3 / RC-4 と同指摘）、Codex id:4101673881（RC-13 と同指摘。冒頭表の GitHub id に追記）
- **手順 4a 自動修正**: なし（🚨 新規 0件。RC-15 は 💰・📋・M・仕様判断、RC-16 は上限チェックの方針が複数）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-15 | 4101673867 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 返金失敗でも canceled を明細から除外する<br>小計は成功返金のみ控除のため不一致になり得る |
| [ ] | RC-16 | 4101673874 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行追加で Stripe 100明細上限を超え得る<br>呼び出し前の予約チェック方針が一意でない |

---

**識別子**: RC-15（GitHub id: 4101673867）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:97`

**該当コード（レビュー時点の diff）**:

```diff
+/** `ordered` の自己負担単価を menu_name + 単価で集約する。キャンセル行は出さない */
+export function buildEventReceiptMenuLines(
+  orders: EventReceiptMenuSource[],
+): { menu_name: string; count: number; price: string }[] {
+  const groups = new Map<string, { menu_name: string; unitAmount: number; count: number }>()
+  for (const order of orders) {
+    if (order.status !== 'ordered') continue
```

**レビュワーのコメント（原文）**:

**P2**  返金成功を確認してから領収書明細から除外する

Stripe 返金が失敗する場合、`cancelOrders.ts` は返金処理より先に注文を `canceled` として保存し、失敗時は `EventStripe.refunds` が増えないまま `refund_errors` を返します。この行はその未返金注文も明細から除外しますが、`shopSubtotal` は成功済みの `refunds` だけを控除するため、同じセッションに残注文があって領収書を再発行すると明細合計より小計が大きくなります。既存の明細整合修正後もこの失敗経路が残るため、注文ステータスではなく当該セッションの成功済み返金の `order_ids` に基づいて除外するか、返金未解決中は発行を止めてください。

Useful? React with 👍 / 👎.

**コメント要約**: 返金失敗でも canceled を明細から除外する<br>小計は成功返金のみ控除のため不一致になり得る

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: `cancelOrders.ts` は先に `canceled` を書き、返金失敗時は `refund_errors` を返す。RC-7 の「残 ordered」方針だと失敗経路で明細と `shopSubtotal` がずれる指摘は妥当。除外基準を成功返金の `order_ids` にするか発行停止にするかは仕様判断。💰・📋・M のため手順 4a 対象外。

---

**識別子**: RC-16（GitHub id: 4101673874）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/stripe.ts:268`

**該当コード（レビュー時点の diff）**:

```diff
+    const userFee = computeUserPaymentFeeFromSelfPay(totalPayment)
+    const feeLineItem = buildUserPaymentFeeCheckoutLineItem(userFee)
+    if (feeLineItem != null) {
+      lineItems.push(feeLineItem)
```

**レビュワーのコメント（原文）**:

**P2**  手数料追加後も Checkout の100明細上限を守る

100個の異なるメニュー／自己負担単価グループを含むカートでは、ここで手数料明細を追加すると `line_items` が101件になります。Stripe の `payment` モードは最大100明細であり、イベントの選択メニュー数にもこのコードのグループ数にも99件以下の制約がないため、従来は作成できた100明細の Checkout が手数料導入後は API エラーになります。手数料分を予約した上限チェックを追加するなど、Stripe 呼び出し前に合計を100件以内へ制限してください。

Useful? React with 👍 / 👎.

**コメント要約**: 手数料行追加で Stripe 100明細上限を超え得る<br>呼び出し前の予約チェック方針が一意でない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: Stripe Checkout payment の line_items 上限 100 は公式どおり。手数料 1 行追加で 101 になり得る指摘は正しい。ただし 100 種類の自己負担単価グループは実運用ではほぼ起きない。チェック追加・先にエラーにする等、方針が複数あるため自動修正しない。

---


