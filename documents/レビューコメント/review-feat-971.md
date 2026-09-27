# ブランチ feat/971 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み |
| [x] | RC-2 | 4079879628, 4079887328 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
| [ ] | RC-3 | 4079879517, 4079887317, 5844074395, 5844370785, 4111556285 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討 |
| [x] | RC-4 | 4079879607, 4079887347, 5844074395, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にした |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み |
| [x] | RC-6 | 4079879564 | 👌 修正不要 | — | 📌 スコープ内 | — | — | — | receipt.docx 未同梱指摘<br>PR に binary 同梱済みで誤検知 |
| [x] | RC-7 | 4079887335 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 領収書明細 menu_price と自己負担小計の不一致 |
| [x] | RC-9 | 4079879701 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | invoice コメント「同意」→「同値」の誤記 |
| [x] | RC-10 | 4079879666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 手数料説明をオンライン決済時に統一 |
| [x] | RC-11 | 4079879724 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 利用規約第13条2項の文言を明確化 |
| [x] | RC-12 | 4079887341 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | キャンセルポリシー desc_after の br 表示 |
| [x] | RC-13 | 4101673881, 4103877591, 5844074395, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 無料の主催者負担キャンセルに手数料非返金<br>差額なしの確認文から非返金の一文を外した |
| [x] | RC-14 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 10%税抜コメントが floor(税込/1.1) と同値と誤記<br>110円で 99 になる旨へ修正済み |
| [ ] | RC-15 | 4101673867, 4103877559, 5844074395, 4110518985, 5844370785 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 返金失敗でも canceled を明細から除外する<br>小計は成功返金のみ控除のため不一致になり得る |
| [ ] | RC-16 | 4101673874, 4103877510, 5844074395, 5844370785 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行追加で Stripe 100明細上限を超え得る<br>呼び出し前の予約チェック方針が一意でない |
| [ ] | RC-17 | 5831254045, 5844074395, 4110518997, 5844370785, 4110614493 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 注文履歴のキーが event_id のみ<br>別コミュニティで同じ event_id だと読み飛ばす |
| [ ] | RC-18 | 4103877536, 5844074395, 4110522576, 5844370785 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 金額不一致の client_error でも補助の Transaction が commit される<br>検証を副作用の前へ移すか throw するかは未決 |
| [x] | RC-19 | 4103877474, 5844074395, 4110522579, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 欠落した注文を黙って除いて領収書を出せる<br>件数不一致で発行を止めた |
| [ ] | RC-20 | 4103870867, 4103877387, 4103877425, 5844370785 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 作者と件名が同じだけで force-with-lease を許可する<br>同等パッチ以外は確認に戻す案。依頼した判定と両立しない |
| [ ] | RC-21 | 4110522582, 4110614506 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 自動中止の案内が全額返金のまま<br>返金計算は手数料を残す |
| [x] | RC-22 | 4110522584 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 領収書メニューが繰り返しセクションでない<br>表セルの menus タグで行を繰り返す |
| [ ] | RC-23 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 対象 stripe_id の抽出が common と二重実装<br>抽出関数を common から export して共用する |
| [ ] | RC-24 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | M | 手数料の取得失敗で注文一覧ごとエラーになる<br>手数料だけ非表示にするかエラーにするか未決 |
| [x] | RC-25 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行の追加で空明細ガードが効かない<br>ガードを手数料行の追加より前に移した |
| [x] | RC-26 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 領収書マージデータに未参照キーが残る<br>テンプレートにない 6 キーを削除した |
| [ ] | RC-27 | 4114073792 | 🟡 修正提案 | 未着手 | ❓ 要確認 | 📏 規約 | 🔧 微修正 | S | 番号なしコミットが fixup の # 必須と矛盾する<br>A1 を番号なしのまま通すかはワークフロー方針 |
| [ ] | RC-28 | 4114073794 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 💰 金銭 | 📋 仕様追加 | M | Functions とフロントのデプロイ順が独立<br>切替窓の機能フラグはリリース手順の判断 |

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
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
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

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 注文履歴は残自己負担の `previewUserPaymentFee` をやめ、残注文が属する `EventStripe.pay_user_fee_amount` の合計を表示する。未設定は 0 で手数料行を出さない。部分キャンセル後も再計算しない。仕様 §4.2.3 に正本を追記した。

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

**コメント要約**: 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にした

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 事前チェックと Transaction 内の再チェックの両方を `maxRefundableFoodAmount`（`pay_amount - (pay_user_fee_amount ?? 0)`）にした。手数料未設定の既存決済は上限が `pay_amount` のまま。

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
| [x] | RC-2 | 4079879628, 4079887328 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | 確定手数料は pay_user_fee_amount 合算表示 |
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

**識別子**: RC-13（GitHub id: 4101673881, 4103877591）

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

**コメント要約**: 無料の主催者負担キャンセルに手数料非返金<br>差額なしの確認文から非返金の一文を外した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `description_community_bill` から「決済手数料は返金されません。」を外した。差額ありの `description_community_bill_discount` はそのまま。

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

**識別子**: RC-15（GitHub id: 4101673867, 4103877559）

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

**識別子**: RC-16（GitHub id: 4101673874, 4103877510）

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

## 評価セッション（2026-09-25 20:05・review-comments-evaluate）

- **評価日時**: 2026-09-25 20:05 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-25T10:54:44Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（id:5831225448 手順12定型文）
- **重複スキップ**: 概要 id:5831254045 の 2 は RC-3、3 は RC-4。id:4103877591 は RC-13。id:4103877559 は RC-15。id:4103877510 は RC-16。いずれも再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: なし（RC-18 は throw と検証移動の二案で仕様判断。RC-17 は M。RC-19 は 💰。RC-20 はユーザー依頼の判定を戻す仕様判断）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-17 | 5831254045 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 注文履歴のキーが event_id のみ<br>別コミュニティで同じ event_id だと読み飛ばす |
| [ ] | RC-18 | 4103877536 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 金額不一致の client_error でも補助の Transaction が commit される<br>検証を副作用の前へ移すか throw するかは未決 |
| [ ] | RC-19 | 4103877474 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 欠落した注文を黙って除いて領収書を出せる<br>件数不一致で発行を止める |
| [ ] | RC-20 | 4103870867, 4103877387, 4103877425 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 作者と件名が同じだけで force-with-lease を許可する<br>同等パッチ以外は確認に戻す案。依頼した判定と両立しない |

---

**識別子**: RC-17（GitHub id: 5831254045）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/userOrderHistoryList.ts:57`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし。概要コメント）
```

**レビュワーのコメント（原文）**:

> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

レビューしました。注文履歴の `pay_user_fee_amount` 合算表示は確認でき、前回のその指摘は解消されています。

現時点の [must] は 3 点です。

1. `base/src/stores/userOrderHistoryList.ts:57`（あわせて `base/src/components/pages/orders.vue:155`）
`collectionGroup('member_orders')` で複数コミュニティのイベントを横断しているのに、`orderStateByEventId` / `loadedEventIds` / `v-for` の key が `event_id` 単体です。同じ `event_id` を持つ別コミュニティのイベントがあると、後続イベントが読み飛ばされるか状態が上書きされます。`community_id + event_id` の複合キーにしてください。

2. `functions/default/src/stripeWebhook.ts:406`
旧 Checkout Session（`amount_total = selfPayAmount`）をまだ fee=0 のレガシーとして受けていないため、ロールアウト窓で 400 になります。

3. `functions/default/src/utils/refundMemberOrdersStripe.ts:105`（および `:140`）
返金上限チェックがまだ `pay_amount` 基準です。非返金の `pay_user_fee_amount` を控除した `pay_amount - (pay_user_fee_amount ?? 0)` を上限にしてください。

**コメント要約**: 注文履歴のキーが event_id のみ<br>別コミュニティで同じ event_id だと読み飛ばす

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: `collectionGroup` なのに `event_id` だけで重複排除している指摘は構造として正しい。Firestore の自動 ID がコミュニティをまたいで衝突する実害はほぼ無いため 🚨 にはしない。store と一覧 key の変更は M。概要の 2 は RC-3、3 は RC-4 と同じなので再採番しない。

---

**識別子**: RC-18（GitHub id: 4103877536）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stripeWebhook.ts:406`

**該当コード（レビュー時点の diff）**:

```diff
     const orderedAt = Timestamp.now().toMillis()
-    const payAmount = orders.reduce((sum, o) => sum + computeOrderSelfPayUnitAmount(o), 0)
+    const selfPayAmount = orders.reduce((sum, o) => sum + computeOrderSelfPayUnitAmount(o), 0)
+    const { pay_amount: payAmount, pay_user_fee_amount: userFeeAmount } = computeEventStripePayFields(selfPayAmount)
+    if (!isCheckoutAmountTotalMatchingPayAmount(session.amount_total, payAmount)) {
```

**レビュワーのコメント（原文）**:

[must] `enterprise_subsidy` では、この検証より前の `processEnterpriseSubsidyOrdersForWebhook` が同じ Transaction 内で月次利用量を更新します。ここで `{ kind: 'client_error' }` を返すだけでは Transaction は commit されるため、金額不一致時に利用量だけが加算され、Webhook の再送で二重加算されます。金額検証を副作用より前に移すか、不一致時は例外を throw して Transaction 全体を rollback してください。

**コメント要約**: 金額不一致の client_error でも補助の Transaction が commit される<br>検証を副作用の前へ移すか throw するかは未決

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `handleOrderConfirmation` は `runTransaction` の戻り値で `client_error` を返しており、その前の `processEnterpriseSubsidyOrdersForWebhook` の書き込みは commit される。金額不一致で補助だけ残る経路は今回の検証追加で起きうる。検証の前倒しと throw では再送時の挙動が違うため自動修正しない。

---

**識別子**: RC-19（GitHub id: 4103877474）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventReceipt.ts:60`

**該当コード（レビュー時点の diff）**:

```diff
+      const sessionOrders = await getOrdersByIds(event.community_id, eventId, uid, stripeRow.order_ids, transaction)
```

**レビュワーのコメント（原文）**:

[bug] ここで取得した注文は存在しないドキュメントを `getOrdersByIds` 内で黙って除外します。領収書の小計は `EventStripe.pay_amount` と返金累計から計算されるため、1件でも欠落すると明細だけが不足した不正確な領収書を発行できます。`sessionOrders.length` と `stripeRow.order_ids.length` を検証し、不一致なら発行を中止してください。

**コメント要約**: 欠落した注文を黙って除いて領収書を出せる<br>件数不一致で発行を止めた

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `sessionOrders.length` と `stripeRow.order_ids.length` が違うときは `failed-precondition` で発行を止める。領収書番号の採番より前なので、欠落時に番号は付かない。

---

**識別子**: RC-20（GitHub id: 4103870867, 4103877387, 4103877425）

**レビュワー**: chatgpt-codex-connector[bot] / Copilot

**指摘箇所**: `.agents/skills/git-create-pull-request/SKILL.md:111`

**該当コード（レビュー時点の diff）**:

```diff
+      - または `+` でも、`origin/$ref..HEAD` に **同じ作者かつ同じ件名** のコミットがある（amend で差分が変わった rebase / fixup / squash）
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  作者と件名だけで書き換え済みと判定しない**

リモート専用コミットとローカルコミットが偶然同じ作者・件名を持つ場合（定型的なコミット名を再利用した場合など）、パッチが異なって `git cherry` が `+` でも履歴書き換え済みと誤判定され、そのまま `--force-with-lease` で共同作業者のコミットを削除します。`--force-with-lease` は取得後の更新しか防がず、判定時点で観測済みのリモート先端の上書きは許可するため、同等 patch-id で確認できないコミットはユーザー確認へ戻してください。

Useful? React with 👍 / 👎.

同じ作者・件名の `+` コミットを「ローカルの書き換え」とみなすだけでは、別内容の独立コミットでも force-with-lease を許可してしまい、リモートの変更を消す危険があります。自動許可は `git cherry` が `-`（同等パッチ）と判定した場合に限定し、それ以外はユーザー確認にしてください。

同じ作者・件名の `+` コミットを履歴書き換えと判定するため、別内容の独立コミットでも `--force-with-lease` を自動実行できます。これは lease が検知できる範囲の前提を誤り、リモート専用の変更を失わせる可能性があるため、同等パッチ（`git cherry` の `-`）以外は確認に留めてください。

**コメント要約**: 作者と件名が同じだけで force-with-lease を許可する<br>同等パッチ以外は確認に戻す案。依頼した判定と両立しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同名の別コミットを書き換えと誤るリスクは正しい。一方、amend でパッチが変わると `git cherry` は `+` になり、作者と件名の一致がないと依頼どおりの force-with-lease ができない。同等パッチだけに戻すか残すかは仕様判断のため自動修正しない。同じ指摘の id:4103877387 と id:4103877425 は本 RC にまとめた。

---

## 評価セッション（2026-09-26 16:01・review-comments-evaluate）

- **評価日時**: 2026-09-26 16:01 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-26T06:53:03Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（id:5844057624 手順12定型文）
- **重複スキップ**: 概要 id:5844074395 の 1 は RC-17、2 は RC-18、3 は RC-3、4 は RC-4、5 は RC-16、6 は RC-15 と RC-19、7 は RC-13。インライン id:4110518985 は RC-15、id:4110518997 は RC-17、id:4110522576 は RC-18、id:4110522579 は RC-19。いずれも再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: なし（新規は RC-21 が案内と返金の二案で仕様判断、RC-22 は既存テンプレートと同じ記法で repeating-section 追加が二重展開になり得る。既存の未着手 🚨 は前回と同じく仕様判断のため対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-21 | 4110522582 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 自動中止の案内が全額返金のまま<br>返金計算は手数料を残す |
| [x] | RC-22 | 4110522584 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 領収書メニューが繰り返しセクションでない<br>表セルの menus タグで行を繰り返す |

---

**識別子**: RC-21（GitHub id: 4110522582）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/refundMemberOrdersStripe.ts:77`

**該当コード（レビュー時点の diff）**:

```diff
@@ -65,7 +74,7 @@ export async function refundMemberOrdersStripe(params: {
         throw new Error(`stripes ドキュメントが見つかりません: ${stripeId}`)
       }

-      const refundAmount = groupOrders.reduce((sum, o) => sum + o.menu_price - getMemberOrderDiscountAmount(o), 0)
+      const refundAmount = computeStripeRefundAmountForMemberOrders(groupOrders)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  自動中止の全額返金表示を実際の返金額に合わせる**

`refundMemberOrdersStripe` は `finishBulkEventCancelPostProcessing` からも呼ばれるため、最小催行人数未達や主催者によるイベント中止でも、この計算では食事の自己負担だけを返して決済手数料を残します。一方、`base/src/locales/messages/ja.ts` の最小催行人数案内は事前決済額を「全額返金」と明記しているため、対象ユーザーは全額返金されると案内されたまま手数料を請求されます。自動中止時も手数料を非返金とする仕様なら案内を修正し、全額返金を維持するならキャンセル元に応じて手数料も返してください。

Useful? React with 👍 / 👎.

**コメント要約**: 自動中止の案内が全額返金のまま<br>返金計算は手数料を残す

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: ユーザーキャンセルは手数料を返さない仕様だが、最小催行人数未達の案内は全額返金と書いている。案内を直すか、自動中止のときだけ手数料も返すかは仕様判断なので自動修正しない。

---

**識別子**: RC-22（GitHub id: 4110522584）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:147`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略）
+  return [...groups.values()].map((group) => ({
+    menu_name: group.menu_name,
+    count: group.count,
+    price: convertNumberToYen(group.unitAmount),
+  }))
+}
+
+export function buildEventReceiptMergeData(input: EventReceiptMergeInput): EventReceiptMergeData {
+  ...
+    menus: buildEventReceiptMenuLines(input.orders),
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  領収書のメニュー配列を繰り返しセクションで描画する**

`menus` には複数の自己負担単価グループが入りますが、更新された `receipt.docx` は `{{menus.menu_name}} ...` を通常の単一段落に置いており、動的テーブル行や `repeating-section collection(menus)` がありません。異なるメニューを同じセッションで購入すると段落が要素ごとに複製されず、明細が1行または配列を平坦化した表示になる一方、小計は全注文分のままになります。メニュー段落を `menus` の繰り返しセクションまたは動的テーブル行にしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 領収書メニューが繰り返しセクションでない<br>表セルの menus タグで行を繰り返す

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `{% table-start %}` は生成 PDF にタグのまま出た。品名、数量、単価の表セルを `{{menus.menu_name}}` `{{menus.count}}` `{{menus.price}}` に戻した。金額帯の手数料行も、展開されない discard-row-if をやめ、conditional-section と `{{fee}}` にした。

---

## 評価セッション（2026-09-26 16:47・review-comments-evaluate）

- **評価日時**: 2026-09-26 16:47 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-26T07:39:42Z
- **partial**: true（Codex は major issues なしの短文のみ。コード指摘は Copilot）
- **新規 RC**: なし
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（id:5844327923 手順12定型文、id:5844345826 Codex の問題なしのみ）
- **重複スキップ**: 概要 id:5844370785 の 1 は RC-17、2 は RC-18、3 は RC-3、4 は RC-4、5 は RC-19、6 は RC-15、7 は RC-16、8 は RC-20、9 は RC-13。インライン id:4110614493 は RC-17、id:4110614506 は RC-21。いずれも再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: なし（新規 RC なし。既存の未着手は前回と同じく仕様判断または金銭表示のため対象外）

### RC 一覧（サマリ）

新規 RC なし

---

## 評価セッション（2026-09-26 22:53・review-comments-evaluate）

- **評価日時**: 2026-09-26 22:53 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-26T13:44:34Z
- **partial**: true（Codex は major issues なしの短文のみで substantive 指摘なし。コード指摘は Copilot インライン 1 件）
- **新規 RC**: なし
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（id:5846759446 手順12定型文、id:5846781710 Codex の問題なしのみ）
- **重複スキップ**: インライン id:4111556285 は RC-3（旧 Checkout の amount_total が自己負担だけのとき 400 になる）。再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: なし（新規 RC なし。RC-3 は旧セッションを手数料 0 で受けるか再決済にするかの仕様判断が残るため対象外）

### RC 一覧（サマリ）

新規 RC なし

---

## 評価セッション（2026-09-27 13:24・shokujii-code-review）

- **評価日時**: 2026-09-27 13:24 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **重複スキップ**: `description_community_bill` の「決済手数料は返金されません」は RC-13、返金上限は RC-4、Webhook の検証順は RC-18、欠落注文は RC-19 と同じため再採番しない
- **手順 3b 自動修正**: RC-25・RC-26（`eventReceiptMergeData.test.ts` / `paymentUserFeeStripe.test.ts` と functions の `tsc --noEmit` は通過）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-23 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 対象 stripe_id の抽出が common と二重実装<br>抽出関数を common から export して共用する |
| [ ] | RC-24 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | M | 手数料の取得失敗で注文一覧ごとエラーになる<br>手数料だけ非表示にするかエラーにするか未決 |
| [x] | RC-25 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行の追加で空明細ガードが効かない<br>ガードを手数料行の追加より前に移した |
| [x] | RC-26 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 領収書マージデータに未参照キーが残る<br>テンプレートにない 6 キーを削除した |

---

**識別子**: RC-23（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/eventStripe.ts:49`

**該当コード（レビュー時点の diff）**:

```diff
+  const stripeIds = new Set<string>()
+  for (const order of orders) {
+    if (order.status === 'canceled') continue
+    if (order.stripe_id == null || order.stripe_id === '') continue
+    stripeIds.add(order.stripe_id)
+  }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: `fetchChargedUserPaymentFee` の対象 stripe_id 抽出（キャンセル除外・空 ID 除外）が `common/src/utils/paymentUserFee.ts` の `sumChargedUserPaymentFee` 内と同じ処理の二重実装になっている。片方だけ条件を変えると取得対象と合算対象がずれる → `collectChargedStripeIds(orders)` を common から export し、両方で使う

**コメント要約**: 対象 stripe_id の抽出が common と二重実装<br>抽出関数を common から export して共用する

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: 現時点で条件は一致しており実害はない。変更種別がリファクタのため自動修正の対象外。

---

**識別子**: RC-24（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/userOrderHistoryList.ts:85`

**該当コード（レビュー時点の diff）**:

```diff
         const list = await fetchMemberOrdersForUser(event.community_id, event.event_id, userId)
         if (generation !== loadGeneration) return
-        patchOrderState(id, { orders: list, loading: false, error: null })
+        const chargedPaymentFee = await fetchChargedUserPaymentFee(event.community_id, event.event_id, list)
+        if (generation !== loadGeneration) return
+        patchOrderState(id, { orders: list, loading: false, error: null, chargedPaymentFee })
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/M]: 手数料の取得（stripes の getDoc と EventStripe の Zod 変換）が注文取得と同じ try に入っているため、stripes 1 件の読み取り失敗やレガシー文書の parse 失敗で、そのイベントの注文一覧・キャンセルボタン・領収書ボタンまでエラー表示になる。これまで見えていた注文が手数料表示の追加で見えなくなる退行 → 手数料取得を別 try にして失敗時は `chargedPaymentFee: null`（手数料行を出さない）とし、`reportClientError` で記録する。または手数料が不明な状態を画面で明示する

**コメント要約**: 手数料の取得失敗で注文一覧ごとエラーになる<br>手数料だけ非表示にするかエラーにするか未決

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 手数料だけ黙って隠すと合計金額が実課金と食い違って見えるため、非表示にするか「手数料を取得できません」を出すかは表示仕様の判断が要る。修正方針が一意でないため自動修正の対象外。

---

**識別子**: RC-25（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/stripe.ts:265`

**該当コード（レビュー時点の diff）**:

```diff
+    const userFee = computeUserPaymentFeeFromSelfPay(totalPayment)
+    const feeLineItem = buildUserPaymentFeeCheckoutLineItem(userFee)
+    if (feeLineItem != null) {
+      lineItems.push(feeLineItem)
+    }
+
     if (lineItems.length === 0 && totalPayment > 0) {
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 手数料行を push した後に `lineItems.length === 0 && totalPayment > 0` を判定している。`totalPayment > 0` なら手数料は必ず 110 円以上なので、メニュー明細が空でもガードが発火せず、手数料だけの Checkout が作られる（Webhook 側では amount_total 不一致で client_error になり、支払いだけ残る）→ ガードを手数料行の追加より前に移す

**コメント要約**: 手数料行の追加で空明細ガードが効かない<br>ガードを手数料行の追加より前に移した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 手順 3b で自動修正。メニュー明細だけで空判定し、その後に手数料行を追加する順にした。

---

**識別子**: RC-26（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:44`

**該当コード（レビュー時点の diff）**:

```diff
+    date: issuedAt,
+    hasShopInvoice: shopInvoiceNumber !== '',
+    invoiceId: shopInvoiceNumber,
+    rawPrice: shopExTaxYen,
+    tax: shop8TaxYen,
+    price: grandTotalYen,
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `receipt.docx` のタグ（`issuedAt` `shop8Tax` `shopExTax` `grandTotal` `shopInvoiceLine` 等）に置き換えた後も、旧テンプレート用の `date` `rawPrice` `tax` `price` と、テンプレートが参照しない `hasShopInvoice` `invoiceId` がマージデータ・型・テストに残っている。どのキーが PDF に効くのか読み手が判別できない → 未参照の 6 キーを型・戻り値・テストから削除する

**コメント要約**: 領収書マージデータに未参照キーが残る<br>テンプレートにない 6 キーを削除した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 手順 3b で自動修正。`word/document.xml` からタグを抽出し、未参照キーを削除した。

---

## 評価セッション（2026-09-27 13:29・review-comments-evaluate）

- **評価日時**: 2026-09-27 13:29 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-27T04:18:34Z
- **partial**: false
- **新規 RC**: RC-27、RC-28
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（id:5852567656 手順12定型文、id:5852568368 Copilot の処理エラー通知のみ、id:5328807976 Codex レビュー本文は接続案内のみ）
- **重複スキップ**: Copilot 概要 id:5328802494 の各 discussion は既存 RC。4111556285 と 4079879517 は RC-3、4110614493 と 4110518997 は RC-17、4110518985 と 4103877559 は RC-15、4103877536 は RC-18、4103877510 は RC-16、4103877474 は RC-19、4103877425 と 4103877387 は RC-20、4079879607 は RC-4、4079879564 は RC-6、4110614506 は RC-21、4103877591 は RC-13。再採番しない
- **手順 4a 自動修正**: なし（RC-27 は番号なしを A1 合格にするかの方針判断、RC-28 はリリース時の切替手順で本 PR のコード修正ではない）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-27 | 4114073792 | 🟡 修正提案 | 未着手 | ❓ 要確認 | 📏 規約 | 🔧 微修正 | S | 番号なしコミットが fixup の # 必須と矛盾する<br>A1 を番号なしのまま通すかはワークフロー方針 |
| [ ] | RC-28 | 4114073794 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 💰 金銭 | 📋 仕様追加 | M | Functions とフロントのデプロイ順が独立<br>切替窓の機能フラグはリリース手順の判断 |

---

**識別子**: RC-27（GitHub id: 4114073792）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `.agents/skills/git-commit-message/references/issue-resolution.md:96`

**該当コード（レビュー時点の diff）**:

```diff
@@ -67,25 +67,33 @@ gh search issues "キーワード" --repo nijuniinc/bokudeli-event-new --state o
 
 ### 5. 該当イシューなし
 
-中断し、次をユーザーに提案する（勝手に作成しない）:
+コミットは止めない。タイトルに `#` を付けず、メッセージ生成へ進む。
 
-> 該当イシューが見つかりません。`/git-create-issue` で新規イシューを作成しますか？
-
-- 同意後 [git-create-issue](../../git-create-issue/SKILL.md) を実行
-- タイトル・本文は diff から下書き。**タイトルに `#番号` は含めない**
-- 作成 URL の番号を採用
+- Issue は作らない。ユーザーが `/git-create-issue` を明示したときだけ別途作成する
+- 採用は **なし**
 
 ### 6. 出力（メッセージ生成前に必須）
 
+一致したとき:
+
+```
+### イシュー
+- 採用: #NNNN（理由: 内容一致 / 検索で発見）
+- 却下: #2101（ブランチ候補だが Issue 内容と diff が不一致）
+```
+
+該当が無いとき:
+
 ```
 ### イシュー
-- 採用: #NNNN（理由: 内容一致 / 検索で発見 / 新規作成）
+- 採用: なし（理由: 内容一致する open Issue が無い）
 - 却下: #2101（ブランチ候補だが Issue 内容と diff が不一致）
 ```
 
 ### 7. 制約
 
-- **`#番号` は原則必須**。解決完了までコミットメッセージを出力しない
+- 内容一致する Issue があるときだけタイトルに `#番号` を付ける
+- 該当が無いときは `#` なしでコミットメッセージを出す。作成提案で止めない
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  番号なしコミットを fixup 判定でも受け入れる**

一致する Issue がない変更を番号なしでコミットした後に `/git-fixup` で追修正する場合、この変更は番号なし生成を許可する一方、`.agents/skills/git-commit-workflow/references/classification.md:88` と本ファイルの `coherence-lite` / `coherence-full` は引き続き `#` の欠落を NG とするため、必ず A2 squash または別コミットへ逸れてメッセージ維持の fixup を実行できません。番号なしを正規の解決結果として、既存タイトルと差分の整合性だけで A1 を判定できるよう各フローを揃えてください。

AGENTS.md reference: [AGENTS.md:L213-L213](https://github.com/nijuniinc/bokudeli-event-new/blob/ff17413aadd2410b9be01122f6081bb734ecc36c/AGENTS.md#L213-L213)

Useful? React with 👍 / 👎.

**コメント要約**: 番号なしコミットが fixup の # 必須と矛盾する<br>A1 を番号なしのまま通すかはワークフロー方針

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: ❓ 要確認

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘どおり、番号なしを正規の結果にしたあとも A1-fast はタイトルに `#` が無いと NG のままである。番号なしのまま fixup できるようにするか、メッセージを書き直す A2 に残すかは、この PR で入れたコミット手順の方針判断なので自動修正しない。

---

**識別子**: RC-28（GitHub id: 4114073794）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/stripe.ts:268`

**該当コード（レビュー時点の diff）**:

```diff
@@ -260,6 +262,12 @@ export const createStripeCheckoutSession = onCall<
         quantity: item.quantity,
       }))
 
+    const userFee = computeUserPaymentFeeFromSelfPay(totalPayment)
+    const feeLineItem = buildUserPaymentFeeCheckoutLineItem(userFee)
+    if (feeLineItem != null) {
+      lineItems.push(feeLineItem)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  手数料課金とフロント表示のデプロイ順序を保証する**

この行から Functions は即座に手数料を課金しますが、確認した `.github/workflows/deploy_functions.yml:3-15`、`deploy_user.yml:3-10`、`deploy_enterprise.yml:3-11` は同じ push から独立して起動し、`needs` や `workflow_run` による順序保証がありません。Functions が先に完了した場合は旧フロントのカート金額より Stripe Checkout が110〜220円高くなり、逆順または片方のデプロイ失敗では新フロントが表示した手数料を旧 Functions が課金しない状態が継続するため、互換期間を設ける機能フラグか順序付きデプロイで表示と実課金を同時に切り替えてください。

Useful? React with 👍 / 👎.

**コメント要約**: Functions とフロントのデプロイ順が独立<br>切替窓の機能フラグはリリース手順の判断

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📤 スコープ外

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 本番反映時に Functions と user / enterprise の公開順で、表示額と課金額が一時的にずれる窓はある。旧 Checkout を Webhook が 400 にする件は RC-3 で別記録済み。機能フラグやワークフローの順序保証はリリース手順の話で、この PR の手数料計算には足さない。

---


