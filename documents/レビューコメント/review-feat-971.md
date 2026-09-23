# ブランチ feat/971 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み |
| [ ] | RC-2 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
| [ ] | RC-3 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討 |
| [ ] | RC-4 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にする |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み |

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


