# ブランチ feat/971 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | カート手数料プレビューが Checkout 判定と二重化<br>`previewUserPaymentFee` に統一済み |
| [x] | RC-2 | 4079879628, 4079887328 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | マイページ手数料が残自己負担のプレビュー<br>部分キャンセル後に表示手数料が下がる |
| [x] | RC-3 | 4079879517, 4079887317, 5844074395, 5844370785, 4111556285 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout は実課金額を手数料なしで保存する対応済み<br>記録を更新し、実装を根拠に Resolve 可能 |
| [x] | RC-4 | 4079879607, 4079887347, 5844074395, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 返金上限が手数料込み pay_amount のまま<br>`pay_amount - fee` を上限にした |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 仕様の10%税抜が floor(税込/1.1) のまま<br>実装の整数演算に合わせて更新済み |
| [x] | RC-6 | 4079879564 | 👌 修正不要 | — | 📌 スコープ内 | — | — | — | 領収書テンプレートは同梱・更新済み<br>2 ブロックと条件付き利用料タグを XML で確認 |
| [x] | RC-7 | 4079887335 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 領収書明細 menu_price と自己負担小計の不一致 |
| [x] | RC-9 | 4079879701 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | invoice コメント「同意」→「同値」の誤記 |
| [x] | RC-10 | 4079879666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 手数料説明をオンライン決済時に統一 |
| [x] | RC-11 | 4079879724 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | 利用規約第13条2項の文言を明確化 |
| [x] | RC-12 | 4079887341 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | キャンセルポリシー desc_after の br 表示 |
| [x] | RC-13 | 4101673881, 4103877591, 5844074395, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 無料の主催者負担キャンセルに手数料非返金<br>差額なしの確認文から非返金の一文を外した |
| [x] | RC-14 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 10%税抜コメントが floor(税込/1.1) と同値と誤記<br>110円で 99 になる旨へ修正済み |
| [x] | RC-15 | 4101673867, 4103877559, 5844074395, 4110518985, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 未返金の canceled 行を領収書に残す対応済み<br>返金記録の order_ids と全額一致で除外する |
| [ ] | RC-16 | 4101673874, 4103877510, 5844074395, 5844370785 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行追加で Stripe 100明細上限を超え得る<br>呼び出し前の予約チェック方針が一意でない |
| [ ] | RC-17 | 5831254045, 5844074395, 4110518997, 5844370785, 4110614493 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 注文履歴のキーが event_id のみ<br>別コミュニティで同じ event_id だと読み飛ばす |
| [ ] | RC-18 | 4103877536, 5844074395, 4110522576, 5844370785 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 金額不一致の client_error でも補助の Transaction が commit される<br>検証を副作用の前へ移すか throw するかは未決 |
| [x] | RC-19 | 4103877474, 5844074395, 4110522579, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 欠落した注文を黙って除いて領収書を出せる<br>件数不一致で発行を止めた |
| [ ] | RC-20 | 4103870867, 4103877387, 4103877425, 5844370785, 5853008059 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 作者・件名一致による force push 自動許可は撤廃する案<br>2 コメントを同一方針で修正し、明示 SHA の lease を使う |
| [ ] | RC-21 | 4110522582, 4110614506, 5853008059 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 自動中止の全額返金案内と利用料非返金が不一致<br>現仕様を維持し、食事代のみ返金と案内する案 |
| [x] | RC-22 | 4110522584 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 領収書メニューが繰り返しセクションでない<br>表セルの menus タグで行を繰り返す |
| [ ] | RC-23 | 4114228705, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | Stripe ID 抽出条件の共通化は妥当な任意改善<br>現条件の差異はなく、RC-24 と併せて整理する案 |
| [ ] | RC-24 | 4114228701, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | M | 手数料取得失敗で注文操作まで隠れる問題が残る<br>注文状態と手数料状態を分離し、失敗を 0 円にしない |
| [x] | RC-25 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 手数料行の追加で空明細ガードが効かない<br>ガードを手数料行の追加より前に移した |
| [x] | RC-26 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 領収書マージデータに未参照キーが残る<br>テンプレートにない 6 キーを削除した |
| [ ] | RC-27 | 4114073792 | 🟡 修正提案 | 未着手 | ❓ 要確認 | 📏 規約 | 🔧 微修正 | S | 番号なしコミットが fixup の # 必須と矛盾する<br>A1 を番号なしのまま通すかはワークフロー方針 |
| [ ] | RC-28 | 4114073794, 4114228685, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 課金開始とフロント表示の互換性確保が必要<br>スコープ内に見直し、旧画面を含む段階切替を設計する案 |
| [x] | RC-29 | 4114336068, 4114336569 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | キャンセル状態の複合キー化は対応済み<br>ダイアログと loading の代入・比較を両方確認 |
| [ ] | RC-30 | 4114454601 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭, 👤 UX | 🔧 微修正 | M | EventStripe 欠落をレガシーと同じ 0 円にしている<br>フィールド未設定とドキュメント欠落の区別は表示方針が未決 |

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
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout セッションが Webhook で 400 になる<br>amount_total === 自己負担のレガシー許容を検討 |
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

**ステータス**: ✅ 対応済み

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
| [x] | RC-3 | 4079879517, 4079887317 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 手数料導入前 Checkout の Webhook 400 |
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

**ステータス**: ✅ 対応済み

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
| [x] | RC-15 | 4101673867 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 返金失敗でも canceled を明細から除外する<br>小計は成功返金のみ控除のため不一致になり得る |
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

**ステータス**: ✅ 対応済み

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

**識別子**: RC-20（GitHub id: 4103870867, 4103877387, 4103877425, 5853008059）

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

**識別子**: RC-21（GitHub id: 4110522582, 4110614506, 5853008059）

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

**識別子**: RC-23（GitHub id: 4114228705, 5853357251・エージェントレビュー起点）

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

**識別子**: RC-24（GitHub id: 4114228701, 5853357251・エージェントレビュー起点）

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

**識別子**: RC-28（GitHub id: 4114073794, 4114228685, 5853357251）

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

## 評価セッション（2026-09-27 14:39・review-comments-evaluate）

- **評価日時**: 2026-09-27 14:39 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-27T05:28:51Z
- **partial**: true（wake は partial。Codex は major issues なしの短文のみで substantive 指摘なし。コード指摘は Copilot）
- **新規 RC**: なし
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（id:5852995162 手順12定型文、id:5853046970 Codex の問題なしのみ）
- **重複スキップ**: 概要 id:5853008059 の 1 は RC-21、2 は RC-20。インライン id:4114228685 は RC-28、id:4114228701 は RC-24、id:4114228705 は RC-23。いずれも再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: なし（新規 RC なし。既存の未着手は仕様判断・リリース手順・リファクタ方針のため対象外）

### RC 一覧（サマリ）

新規 RC なし

---

## 評価セッション（2026-09-27 15:35・review-comments-evaluate）

- **評価日時**: 2026-09-27 15:35 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-27T06:22:46Z
- **partial**: false
- **新規 RC**: RC-29
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（id:5853343633 手順12定型文）
- **重複スキップ**: 概要 id:5853357251 の 1 は RC-24、2 は RC-28、3 は RC-23。再採番せず GitHub id を既存 RC に追記
- **手順 4a 自動修正**: RC-29（🚨 1件）。キャンセルダイアログとローディングを `getUserOrderHistoryEventKey` で照合するよう変更した

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-29 | 4114336068, 4114336569 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | キャンセル状態が event_id 単体のまま<br>複合キーに揃えて両カードが開かないようにした |

---

**識別子**: RC-29（GitHub id: 4114336068, 4114336569）

**レビュワー**: chatgpt-codex-connector[bot] / Copilot

**指摘箇所**: `base/src/components/pages/orders.vue:158`

**該当コード（レビュー時点の diff）**:

```diff
@@ -152,21 +153,41 @@ watch(
         {{ $t('user_profile.empty.orders') }}
       </div>
       <v-row v-else>
-        <v-col v-for="event in orderHistoryEvents" :key="`order_${event.event_id}`" sm="12" md="6" lg="4" cols="12">
+        <v-col
+          v-for="event in orderHistoryEvents"
+          :key="`order_${getUserOrderHistoryEventKey(event.community_id, event.event_id)}`"
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  キャンセル状態にもコミュニティ込みのキーを使う**

RC-17 対応で同じ `event_id` を持つ別コミュニティのカードを同時表示できるようになりましたが、共有状態の `cancelDialogEventId` と `cancelLoadingEventId` は引き続き `event_id` だけで照合されています。この条件で片方のキャンセルを開くと両カードのダイアログが開き、クリックされていない側は行の初期化もされていない空ダイアログになり得るほか、送信中は両カードにローディングが表示されます。これらの状態も `getUserOrderHistoryEventKey(community_id, event_id)` 相当の複合キーで保持してください。

Useful? React with 👍 / 👎.

[must] ここでカードの描画キーを複合キーにしても、同じ `orders.vue` の `cancelDialogEventId` / `cancelLoadingEventId` と `UserEventCard` 側のダイアログ判定は `event_id` 単体のままです。同じ `event_id` が別コミュニティに存在すると、片方のカードのキャンセル操作で両方が開く・ローディング表示になるため、キャンセル状態も `community_id + event_id` のキーに揃えてください。

**コメント要約**: キャンセル状態が event_id 単体のまま<br>複合キーに揃えて両カードが開かないようにした

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: カードの描画キーだけ複合キーで、ダイアログとローディングは event_id のままだと、同じ event_id の別コミュニティカードが両方開く。手順 4a で `UserEventCard` の照合と `orders.vue` のローディングを `getUserOrderHistoryEventKey` に揃えた。同じ指摘の id:4114336569 は本 RC にまとめた。

---

---

## 評価セッション（2026-09-27 16:12・review-comments-evaluate）

- **評価日時**: 2026-09-27 16:12 JST
- **評価者**: Codex（指定 10 コメントの対応方針検討）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **評価対象 HEAD**: `6b847ee1a0a4271bfab23008064b83cc522250c4`（ローカルと PR の一致を確認）
- **対象範囲**: ユーザー指定の 10 コメント。RC-20 に 2 件が対応するため、既存 RC は 9 件。追加の RC は採番しない。
- **新規 RC**: なし
- **Outdated 除外件数**: 指定 10 件中 2 件（GraphQL 基準）。新規評価はせず、RC-3 / RC-6 の現在の対応状態だけ確認した。
- **レビュー非該当スキップ件数**: 指定 10 件内は 0 件。PR 全体のトップレベル定型文・他の指摘は本セッションの対象外。
- **手順 4a**: ユーザーの依頼は対応方針の検討であるため、ソース・スキル・仕様の実装変更は行わず、レビュー記録だけ更新。GitHub 返信・Resolve・push は実施していない。
- **評価と進捗**: 既存の評価ラベルは維持。RC-3 / RC-15 は対応済みへ更新。RC-28 は課金導入の責務としてスコープ内へ見直した。下記が今回の判断理由・対応方針の正本で、過去セッションの未決案に優先する。
- **結論**: 4 コメントは解消済み。5 コメントは対応を推奨（うち force push 2 件は同じ修正）。1 コメントは任意リファクタ。
- **検証**: `npm -w common run test -- src/utils/paymentUserFee.test.ts`（16 件成功）、`npm -w functions/default run test -- src/utils/eventReceiptMergeData.test.ts src/utils/paymentUserFeeStripe.test.ts src/utils/refundMemberOrdersStripe.test.ts`（17 件成功）。テスト追加なし。Webhook 保存・領収書呼び出し側・UI 障害時・実 PDF 生成までを通した検証ではない。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-3 | 4079879517, 4079887317, 5844074395, 5844370785, 4111556285 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 旧 Checkout は実課金額を手数料なしで保存する対応済み<br>記録を更新し、実装を根拠に Resolve 可能 |
| [x] | RC-6 | 4079879564 | 👌 修正不要 | — | 📌 スコープ内 | — | — | — | 領収書テンプレートは同梱・更新済み<br>2 ブロックと条件付き利用料タグを XML で確認 |
| [x] | RC-15 | 4101673867, 4103877559, 5844074395, 4110518985, 5844370785 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 未返金の canceled 行を領収書に残す対応済み<br>返金記録の order_ids と全額一致で除外する |
| [ ] | RC-20 | 4103870867, 4103877387, 4103877425, 5844370785, 5853008059 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 作者・件名一致による force push 自動許可は撤廃する案<br>2 コメントを同一方針で修正し、明示 SHA の lease を使う |
| [ ] | RC-21 | 4110522582, 4110614506, 5853008059 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 📋 仕様追加 | M | 自動中止の全額返金案内と利用料非返金が不一致<br>現仕様を維持し、食事代のみ返金と案内する案 |
| [ ] | RC-23 | 4114228705, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | Stripe ID 抽出条件の共通化は妥当な任意改善<br>現条件の差異はなく、RC-24 と併せて整理する案 |
| [ ] | RC-24 | 4114228701, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | M | 手数料取得失敗で注文操作まで隠れる問題が残る<br>注文状態と手数料状態を分離し、失敗を 0 円にしない |
| [ ] | RC-28 | 4114073794, 4114228685, 5853357251 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 課金開始とフロント表示の互換性確保が必要<br>スコープ内に見直し、旧画面を含む段階切替を設計する案 |
| [x] | RC-29 | 4114336068, 4114336569 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | キャンセル状態の複合キー化は対応済み<br>ダイアログと loading の代入・比較を両方確認 |

---

**識別子**: RC-3（GitHub id: 4111556285・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `common/src/utils/paymentUserFee.ts:44`

**該当コード（レビュー時点の diff）**:

GitHub id: 4111556285

```diff
@@ -0,0 +1,96 @@
+/**
+ * Stripe 実課金の自己負担額に対するユーザー決済手数料。
+ * `MIN(220, MAX(110, FLOOR(自己負担 × 0.1, 100) × 1.1))` と同等。自己負担 0 以下は 0。
+ *
+ * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
+ */
+import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'
+
+/** 1,000 円刻みの税込手数料単位（最低額でもある） */
+export const USER_PAYMENT_FEE_UNIT = 110
+/** 1 セッションあたりの手数料上限 */
+export const USER_PAYMENT_FEE_MAX = 220
+
+export function computeUserPaymentFeeFromSelfPay(selfPay: number): number {
+  if (selfPay <= 0) return 0
+  return Math.min(
+    USER_PAYMENT_FEE_MAX,
+    Math.max(USER_PAYMENT_FEE_UNIT, Math.floor(selfPay / 1000) * USER_PAYMENT_FEE_UNIT),
+  )
+}
+
+export function computeCheckoutTotalFromSelfPay(selfPay: number): { selfPay: number; fee: number; total: number } {
+  const fee = computeUserPaymentFeeFromSelfPay(selfPay)
+  return { selfPay, fee, total: selfPay + fee }
+}
+
+/** Webhook が EventStripe に書く pay_amount / pay_user_fee_amount。手数料 0 のレガシーは fee フィールドを省略。 */
+export function computeEventStripePayFields(selfPay: number): {
+  pay_amount: number
+  pay_user_fee_amount?: number
+} {
+  const fee = computeUserPaymentFeeFromSelfPay(selfPay)
+  return {
+    pay_amount: selfPay + fee,
+    ...(fee > 0 ? { pay_user_fee_amount: fee } : {}),
+  }
+}
+
+/** amount_total が無いセッションは検証スキップ。あるときは pay_amount と一致必須。 */
+export function isCheckoutAmountTotalMatchingPayAmount(
+  amountTotal: number | null | undefined,
+  payAmount: number,
+): boolean {
+  return amountTotal == null || amountTotal === payAmount
```

**レビュワーのコメント（原文）**:

[GitHub id: 4111556285](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4111556285)

[must] 手数料導入前に作成された Checkout Session は `amount_total` が自己負担額だけですが、ここでは再計算した手数料込み `payAmount` との一致しか許可していません。そのためデプロイ直後の有効な旧セッションが 400 になり、決済済みでも注文が確定されません。旧セッションを fee 0 として受けるか、ロールアウト中の再決済方針を実装してください。

**コメント要約**: 旧 Checkout は実課金額を手数料なしで保存する対応済み<br>記録を更新し、実装を根拠に Resolve 可能

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 現在の common/src/utils/paymentUserFee.ts:40–51 は旧自己負担額との一致を許容する。functions/default/src/stripeWebhook.ts:379–386 は amount_total が自己負担額だけのとき payAmount を自己負担額、userFeeAmount を undefined とし、同ファイル:461–466 で実課金額を保存して手数料フィールドを省略する。金額一致だけ許容して架空の手数料を保存する状態も d0447e9d3 で解消済み。GitHub 上は Outdated のため旧指摘の再評価はせず、既存 RC の対応状態を現 HEAD に同期する。

対応方針・確認項目: 現実装を維持。旧セッションの決済額 1,000 円 → pay_amount 1,000 円・手数料フィールドなし・注文確定、新セッション 1,110 円 → fee 110 円、不一致額の拒否を Webhook 保存まで確認できる回帰テストを追加するとよい。今回実行した共通関数テストは保存処理そのものまでは検証しない。

---

**識別子**: RC-6（GitHub id: 4079879564・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:121`

**該当コード（レビュー時点の diff）**:

GitHub id: 4079879564

```diff
…（diff 先頭省略・43 行）
+  shopSubtotal: string
+  shop8: string
+  shop8Tax: string
+  shop10: string
+  shop10Tax: string
+  rawPrice: string
+  tax: string
+  fee: string
+  fee8: string
+  fee8Tax: string
+  fee10: string
+  fee10Tax: string
+  nijuniName: string
+  nijuniInvoiceId: string
+  grandTotal: string
+  price: string
+  footer: string
+}
+
+export function computeEventReceiptAmounts(input: {
+  payAmount: number
+  payUserFeeAmount: number | undefined
+  refundedTotal: number
+}): {
+  fee: number
+  shopSubtotal: number
+  grandTotal: number
+} {
+  const fee = input.payUserFeeAmount ?? 0
+  const foodCharged = Math.max(0, input.payAmount - fee)
+  const shopSubtotal = Math.max(0, foodCharged - input.refundedTotal)
+  return { fee, shopSubtotal, grandTotal: shopSubtotal + fee }
+}
+
+export function buildEventReceiptMergeData(input: EventReceiptMergeInput): EventReceiptMergeData {
+  const { fee, shopSubtotal, grandTotal } = computeEventReceiptAmounts(input)
+  const shopTax = computeInclusive8ExTaxAndTax(shopSubtotal)
+  const feeTax = computeInclusive10ExTaxAndTax(fee)
+  const hasFee = fee > 0
+  const issuedAt = convertToDatetime(input.issuedAt)
+  const shopSubtotalYen = convertNumberToYen(shopSubtotal)
+  const shop8TaxYen = convertNumberToYen(shopTax.taxPrice)
+  const grandTotalYen = convertNumberToYen(grandTotal)
+  const zeroYen = convertNumberToYen(0)
+
+  return {
+    reissue: input.reissue,
+    hasFee,
+    number: input.receiptNumber,
+    date: issuedAt,
+    issuedAt,
+    orderDate: convertToDatetime(input.orderCreatedAt),
+    eventDate: convertToDate(input.eventStartDatetime),
+    event: `${input.eventName} / お食事代として`,
+    shop: input.shopName,
+    invoiceId: input.shopInvoiceNumber ?? 'なし',
+    address: input.shopAddress,
+    paymentMethod: input.paymentMethod ?? RECEIPT_PAYMENT_METHOD_FALLBACK,
+    menus: input.menus.map((menu) => ({
+      menu_name: menu.menu_name,
+      count: menu.count,
+      price: convertNumberToYen(menu.menu_price),
+    })),
+    shopSubtotal: shopSubtotalYen,
+    shop8: shopSubtotalYen,
+    shop8Tax: shop8TaxYen,
+    shop10: zeroYen,
+    shop10Tax: zeroYen,
+    rawPrice: convertNumberToYen(shopTax.exTaxPrice),
+    tax: shop8TaxYen,
+    fee: convertNumberToYen(fee),
+    fee8: zeroYen,
+    fee8Tax: zeroYen,
+    fee10: convertNumberToYen(fee),
+    fee10Tax: convertNumberToYen(feeTax.taxPrice),
+    nijuniName: NIJUNI_COMPANY_NAME,
+    nijuniInvoiceId: NIJUNI_INVOICE_REGISTRATION_NUMBER,
+    grandTotal: grandTotalYen,
+    price: grandTotalYen,
```

**レビュワーのコメント（原文）**:

[GitHub id: 4079879564](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4079879564)

[must] この PR の変更ファイルに `functions/default/templates/receipt.docx` が含まれておらず、既存テンプレートは旧1ブロック用のままです。ここで `shop8` / `fee10` / `hasFee` などを生成してもテンプレート側が参照しないため、実際のPDFは2ブロックにならず、`price=grandTotal` と食事だけの `rawPrice` / `tax` が混在します。新しいフィールドを参照するテンプレートも同じ変更に含めてください。

**コメント要約**: 領収書テンプレートは同梱・更新済み<br>2 ブロックと条件付き利用料タグを XML で確認

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: —

**想定工数**: —

**判断理由**: origin/development...HEAD に functions/default/templates/receipt.docx のバイナリ差分がある。word/document.xml を抽出し、shop8 / fee10 / hasFee / grandTotal と 8%・10% の各ブロックを確認した。eventReceipt.ts:116 は同テンプレートを使用している。テンプレート未同梱という前提は現 HEAD には当てはまらない。GitHub 上は Outdated のため状態確認のみ。

対応方針・確認項目: 追加修正不要として Resolve 可能。今回の確認は DOCX の内容とコード参照までで、Adobe による実 PDF 生成・描画の再確認は実施していない。

---

**識別子**: RC-15（GitHub id: 4103877559・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `functions/default/src/utils/eventReceiptMergeData.ts:100`

**該当コード（レビュー時点の diff）**:

GitHub id: 4103877559

```diff
…（diff 先頭省略・20 行）
+  reissue: boolean
+  orderCreatedAt: number
+  issuedAt: number
+  payAmount: number
+  payUserFeeAmount: number | undefined
+  refundedTotal: number
+  orders: EventReceiptMenuSource[]
+  paymentMethod?: string
+}
+
+/** 領収書内訳の元データ。確定済み注文の自己負担単価を集約する */
+export type EventReceiptMenuSource = {
+  menu_name: string
+  menu_price: number
+  status: EventMemberOrderStatusType
+  pay_community_bill_off_amount?: number
+  pay_enterprise_subsidy_amount?: number
+}
+
+export type EventReceiptMergeData = {
+  reissue: boolean
+  hasFee: boolean
+  number: string
+  date: string
+  issuedAt: string
+  orderDate: string
+  eventDate: string
+  event: string
+  shop: string
+  invoiceId: string
+  address: string
+  paymentMethod: string
+  menus: { menu_name: string; count: number; price: string }[]
+  shopSubtotal: string
+  shop8: string
+  shop8Tax: string
+  shop10: string
+  shop10Tax: string
+  rawPrice: string
+  tax: string
+  fee: string
+  fee8: string
+  fee8Tax: string
+  fee10: string
+  fee10Tax: string
+  nijuniName: string
+  nijuniInvoiceId: string
+  grandTotal: string
+  price: string
+  footer: string
+}
+
+export function computeEventReceiptAmounts(input: {
+  payAmount: number
+  payUserFeeAmount: number | undefined
+  refundedTotal: number
+}): {
+  fee: number
+  shopSubtotal: number
+  grandTotal: number
+} {
+  const fee = input.payUserFeeAmount ?? 0
+  const foodCharged = Math.max(0, input.payAmount - fee)
+  const shopSubtotal = Math.max(0, foodCharged - input.refundedTotal)
+  return { fee, shopSubtotal, grandTotal: shopSubtotal + fee }
+}
+
+function computeReceiptMenuSelfPay(order: EventReceiptMenuSource): number {
+  return order.menu_price - getMemberOrderDiscountAmount(order)
+}
+
+/** `ordered` の自己負担単価を menu_name + 単価で集約する。キャンセル行は出さない */
+export function buildEventReceiptMenuLines(
+  orders: EventReceiptMenuSource[],
+): { menu_name: string; count: number; price: string }[] {
+  const groups = new Map<string, { menu_name: string; unitAmount: number; count: number }>()
+  for (const order of orders) {
+    if (order.status !== 'ordered') continue
+    const unitAmount = computeReceiptMenuSelfPay(order)
```

**レビュワーのコメント（原文）**:

[GitHub id: 4103877559](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4103877559)

[must] `canceled` は返金成功を意味しません。`cancelOrders` は先に注文を canceled と保存し、Stripe 返金失敗時は `refund_errors` だけを返すため、ここで未返金の行まで除外すると、成功返金だけを `refundedTotal` から控除する小計と明細合計が不一致になります。成功済み返金の `order_ids` に基づいて除外するか、未解決の返金がある場合は領収書発行を止めてください。

**コメント要約**: 未返金の canceled 行を領収書に残す対応済み<br>返金記録の order_ids と全額一致で除外する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 指摘先の buildEventReceiptMenuLines は ordered のみを扱うが、呼び出し側 functions/default/src/eventReceipt.ts:78–97 が返金記録と当該注文の自己負担合計を突き合わせ、全額返金済み ID だけ除外する。残った canceled は領収書用データで ordered に正規化するため、返金 API の例外で refunds に記録がない注文を明細から消す不具合は解消済み。DB の注文状態自体は変更しない。

対応方針・確認項目: 現実装を維持し Resolve 可能。1,000 円×2 食・利用料 220 円で、一方の返金失敗なら食事明細 2,000 円・総額 2,220 円、成功記録 1,000 円がある場合だけ 1,000 円・総額 1,220 円となることを、eventReceipt の返金判定とマージ処理を通して検証する。既存 8 テストはマージ関数中心で、この呼び出し側の正規化は直接カバーしない。仕様 §4.2.7.5 の「canceled は出さない」も、追記時には返金記録を基準にする説明へ揃える。

---

**識別子**: RC-20（GitHub id: 4103877387, 4103877425・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `.agents/skills/git-create-pull-request/SKILL.md:111` / `.agents/skills/git-reflect-after-commit/SKILL.md:56`

**該当コード（レビュー時点の diff）**:

GitHub id: 4103877387

```diff
@@ -89,16 +89,30 @@ python3 .agents/scripts/self_review_wake.py list \
    | `origin/$ref` が無い | リモート未作成 | 通常 push |
    | `HEAD` = `origin/$ref` | 同期済み | **スキップ** |
    | `HEAD` が `origin/$ref` の子孫のみ（ahead） | 未 push のみ | 通常 push |
-   | diverge / behind 混在（履歴書き換え未確認） | remote 更新の可能性 | **中断・ユーザー確認** |
-   | 会話文脈で fixup/squash/amend/rebase 直後 | 履歴書き換え確認済み | **`--force-with-lease`** |
+   | behind のみ（ローカルに無いリモートコミットだけ） | リモートが進んでいる | **中断・ユーザー確認** |
+   | diverge かつリモート専用がすべてローカルの書き換え | rebase / amend / fixup / squash（会話外でも可） | **`--force-with-lease`** |
+   | diverge かつリモート専用に独自コミットがある | 他の push の可能性 | **中断・ユーザー確認** |
    | ユーザーが force push / force-with-lease を明示指示 | ユーザー承認済み | **`--force-with-lease`** |
 
-   判定例:
+   判定:
 
    ```bash
-   git rev-list --left-right --count "origin/$ref...HEAD" 2>/dev/null || echo "0 0"
+   git rev-list --left-right --count "origin/$ref...HEAD"
+   # 左が origin のみ、右が HEAD のみ。両方 0 より大きいときだけ diverge
+   git cherry -v HEAD "origin/$ref"
+   # 先頭が `-` のコミットは、同等パッチが HEAD にある（書き換え済み）
+   git log --format='%an%x09%s' "origin/$ref..HEAD"
    ```
 
+   **diverge をローカルの履歴書き換えとみなす条件**（会話内で rebase していなくても可。すべて満たす）:
+
+   1. `origin/$ref` にだけある各コミットが、次のいずれか
+      - `git cherry -v HEAD origin/$ref` で `-`（同等パッチが HEAD にある）
+      - または `+` でも、`origin/$ref..HEAD` に **同じ作者かつ同じ件名** のコミットがある（amend で差分が変わった rebase / fixup / squash）
```

GitHub id: 4103877425

```diff
@@ -47,23 +47,25 @@ B は `github-actions-deploy` に委譲し、同スキル内で本番ブロッ
   - **許可**: 上記以外の作業ブランチ（feature / `release/*` / `sync/*` / `hotfix/*` 等）。ブランチ名への部分一致では判定しない（`sync/main-to-development` は許可）
   - 拒否条件に該当する場合は **push せず中断**し、保護 ref への直 push は人間のリリース手順に従う旨をユーザーに伝える
 - **push の方法**（`ref` はリモート上のブランチ名。通常は現在ブランチ名）:
-  - **履歴書き換え時**（git-commit-workflow / git-fixup / git-squash の直後、または会話文脈で rebase 済みと分かる場合）:
+  - **履歴書き換え時**（会話内の fixup / squash / amend / rebase に限らない。判定は [`git-create-pull-request` 手順 9](../git-create-pull-request/SKILL.md) と同一。diverge でも、`origin/$ref` 専用コミットがすべて HEAD 上の書き換えなら可）:
 
     ```bash
     git push --force-with-lease origin HEAD:<ref>
     ```
 
-  - **通常**（新規コミット・分割コミット等）:
+    書き換え判定: `git cherry -v HEAD origin/$ref` が `-`、または `+` でも `origin/$ref..HEAD` に同じ作者かつ同じ件名のコミットがある。会話の外で rebase していてもこの判定を満たせば `--force-with-lease` してよい。
```

**レビュワーのコメント（原文）**:

[GitHub id: 4103877387](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4103877387)

同じ作者・件名の `+` コミットを「ローカルの書き換え」とみなすだけでは、別内容の独立コミットでも force-with-lease を許可してしまい、リモートの変更を消す危険があります。自動許可は `git cherry` が `-`（同等パッチ）と判定した場合に限定し、それ以外はユーザー確認にしてください。

[GitHub id: 4103877425](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4103877425)

同じ作者・件名の `+` コミットを履歴書き換えと判定するため、別内容の独立コミットでも `--force-with-lease` を自動実行できます。これは lease が検知できる範囲の前提を誤り、リモート専用の変更を失わせる可能性があるため、同等パッチ（`git cherry` の `-`）以外は確認に留めてください。

**コメント要約**: 作者・件名一致による force push 自動許可は撤廃する案<br>2 コメントを同一方針で修正し、明示 SHA の lease を使う

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 両 SKILL.md に + でも作者・件名一致なら履歴書き換えと扱う条件が残っている。作者・件名は変更内容の同一性を保証しないため指摘は妥当。force-with-lease はリモート先端が期待 SHA と一致するかを検査し、既に取得した独立コミットの変更内容を保全する機能ではない。これは本 PR が変更した手順なのでスコープ内。既存評価 🟡 は履歴として維持するが、変更消失につながるため修正優先度は高い。

対応方針・確認項目: 2 ファイルから作者・件名による許可を除き、正本 1 箇所を参照する。会話外の履歴については git cherry の - 等でリモート専用変更の取り込みを確認する。+ を許すのは、自分が実施した rewrite の前後 SHA と対象コミット対応を記録し、リモート専用変更を失わないと確認できる場合に限定する。根拠不明の + や未確認 merge commit は自動上書きせず差分確認へ戻す。実行時は確認済み先端を固定した --force-with-lease=refs/heads/<branch>:<expected-sha> を使う。これにより、追跡できる fixup/amend を毎回確認へ戻さず運用できる。

根拠: [git-push](https://git-scm.com/docs/git-push)、[git-cherry](https://git-scm.com/docs/git-cherry)。確認例は「同じ作者・件名で異なる独立差分」「パッチ同等の rebase」「記録のある amend」「確認後の別 push」「merge commit を含む分岐」。

---

**識別子**: RC-21（GitHub id: 4110614506・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `functions/default/src/utils/refundMemberOrdersStripe.ts:82`

**該当コード（レビュー時点の diff）**:

GitHub id: 4110614506

```diff
@@ -65,7 +74,7 @@ export async function refundMemberOrdersStripe(params: {
         throw new Error(`stripes ドキュメントが見つかりません: ${stripeId}`)
       }
 
-      const refundAmount = groupOrders.reduce((sum, o) => sum + o.menu_price - getMemberOrderDiscountAmount(o), 0)
+      const refundAmount = computeStripeRefundAmountForMemberOrders(groupOrders)
```

**レビュワーのコメント（原文）**:

[GitHub id: 4110614506](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4110614506)

[must] この共通返金関数は `finishBulkEventCancelPostProcessing` の最小催行人数未達・主催者中止経路からも呼ばれるため、今回の変更後は食事代だけを返金します。一方、最小催行人数の案内は「事前決済された方には全額返金」と表示するため、手数料が残る実装と利用者向け案内が矛盾します。自動中止時の手数料返金方針を決め、案内または返金条件を合わせてください。

**コメント要約**: 自動中止の全額返金案内と利用料非返金が不一致<br>現仕様を維持し、食事代のみ返金と案内する案

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: functions/default/src/utils/refundMemberOrdersStripe.ts:35–41 は食事自己負担だけを返金し、finishBulkEventCancelPostProcessing.ts:165 経由の主催者中止・最小催行人数未達でも同じ関数を使う。一方、base/src/locales/messages/ja.ts:454,458 は「全額返金」と案内している。仕様書は手数料非返金を基本にしており、この PR で生じる利用者向け案内の不整合を解消する必要がある。既存評価 🟡 は維持するが、案内と実課金の整合は課金開始前に対応する。

対応方針・確認項目: 今回の推奨は非返金仕様を維持し、人数未達時の案内を「事前決済されたお食事代を返金します。システム利用料は返金対象外です」に合わせ、仕様に主催者中止・人数未達も含むことを明記する。メールなど関連案内も同じ方針で確認する。事業判断として利用者都合以外は利用料も返す方針なら、文言変更だけでは足りず、cancel_source 別の返金計算・利用料の返金済み額・領収書・重複返金防止を一緒に設計する。どちらの事業方針もこの検討では実装・確定しない。

---

**識別子**: RC-23（GitHub id: 4114228705・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `base/src/stores/eventStripe.ts:53`

**該当コード（レビュー時点の diff）**:

GitHub id: 4114228705

```diff
@@ -0,0 +1,64 @@
+import {
+  doc,
+  getDoc,
+  type DocumentData,
+  type DocumentReference,
+  type FirestoreDataConverter,
+  type QueryDocumentSnapshot,
+  type SnapshotOptions,
+} from 'firebase/firestore'
+import { db } from '@shokujii/base/firebase.js'
+import { EventStripe } from '@shokujii/common/schemas/EventStripe.js'
+import { sumChargedUserPaymentFee, type ChargedFeeOrderRef } from '@shokujii/common/utils/paymentUserFee.js'
+
+const eventStripeConverter: FirestoreDataConverter<EventStripe> = {
+  toFirestore(stripe: EventStripe): DocumentData {
+    return stripe.toFirestore()
+  },
+  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventStripe {
+    const data = snapshot.data(options)
+    return new EventStripe(snapshot.id, data)
+  },
+}
+
+/** communities/{communityId}/events/{eventId}/stripes/{stripeId} */
+export const getEventStripeRef = (
+  communityId: string,
+  eventId: string,
+  stripeId: string,
+): DocumentReference<EventStripe> => {
+  return doc(db, 'communities', communityId, 'events', eventId, 'stripes', stripeId).withConverter(eventStripeConverter)
+}
+
+export const fetchEventStripe = async (
+  communityId: string,
+  eventId: string,
+  stripeId: string,
+): Promise<EventStripe | null> => {
+  const snapshot = await getDoc(getEventStripeRef(communityId, eventId, stripeId))
+  if (!snapshot.exists()) return null
+  return snapshot.data()
+}
+
+/** 残注文が参照する EventStripe の pay_user_fee_amount 合計。未設定は 0。 */
+export const fetchChargedUserPaymentFee = async (
+  communityId: string,
+  eventId: string,
+  orders: readonly ChargedFeeOrderRef[],
+): Promise<number> => {
+  const stripeIds = new Set<string>()
+  for (const order of orders) {
+    if (order.status === 'canceled') continue
+    if (order.stripe_id == null || order.stripe_id === '') continue
+    stripeIds.add(order.stripe_id)
```

**レビュワーのコメント（原文）**:

[GitHub id: 4114228705](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4114228705)

[imo] ここでキャンセル済み・空 ID を除外して取得した Stripe ID を、`common` の `sumChargedUserPaymentFee` でも同じ条件で再抽出しています。現状は一致していますが、どちらか一方だけ条件を変更すると、読み取る決済と合算する決済がずれて手数料表示が誤ります。対象 ID の収集を共通関数に切り出して両方で使ってください。

**コメント要約**: Stripe ID 抽出条件の共通化は妥当な任意改善<br>現条件の差異はなく、RC-24 と併せて整理する案

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: base/src/stores/eventStripe.ts:49–54 と common/src/utils/paymentUserFee.ts:87–93 は、ともに canceled・空 ID を除いて Set で重複排除している。現時点の不一致や表示誤りは確認できず、マージ必須のバグではない。将来片側だけ変わるリスクの低減として共通化する価値はある。

対応方針・確認項目: common に対象 Stripe ID を返す純粋関数を置き、取得と合算の両方で使う。既存仕様の全 canceled 除外は維持し、同一 ID 重複、空文字・undefined、同一決済内の canceled と ordered 混在を確認する。金額計算を行う common に Firestore 依存を入れない。RC-24 で同じ取得経路を触る際に合わせるのが自然。

---

**識別子**: RC-24（GitHub id: 4114228701・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `base/src/stores/userOrderHistoryList.ts:90`

**該当コード（レビュー時点の diff）**:

GitHub id: 4114228701

```diff
@@ -60,31 +64,34 @@ export const useUserOrderHistoryByUserId = (
     /** reload 後に完了した古い next の結果を反映しない（本人判定 watch 等の連続 reload 対策） */
     let loadGeneration = 0
 
-    const patchOrderState = (eventId: string, patch: Partial<UserEventListOrderEntry>) => {
-      const prev = orderStateByEventId.value[eventId] ?? {
+    const patchOrderState = (eventKey: string, patch: Partial<UserEventListOrderEntry>) => {
+      const prev = orderStateByEventId.value[eventKey] ?? {
         orders: null,
         loading: false,
         error: null,
+        chargedPaymentFee: null,
       }
       orderStateByEventId.value = {
         ...orderStateByEventId.value,
-        [eventId]: { ...prev, ...patch },
+        [eventKey]: { ...prev, ...patch },
       }
     }
 
     const loadOrdersForEvent = async (event: BokudeliEvent, generation: number) => {
-      const id = event.event_id
+      const eventKey = getUserOrderHistoryEventKey(event.community_id, event.event_id)
       if (userId === '') return
       if (generation !== loadGeneration) return
       try {
-        patchOrderState(id, { loading: true, error: null })
+        patchOrderState(eventKey, { loading: true, error: null })
         const list = await fetchMemberOrdersForUser(event.community_id, event.event_id, userId)
         if (generation !== loadGeneration) return
-        patchOrderState(id, { orders: list, loading: false, error: null })
+        const chargedPaymentFee = await fetchChargedUserPaymentFee(event.community_id, event.event_id, list)
+        if (generation !== loadGeneration) return
+        patchOrderState(eventKey, { orders: list, loading: false, error: null, chargedPaymentFee })
```

**レビュワーのコメント（原文）**:

[GitHub id: 4114228701](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4114228701)

[must] `fetchChargedUserPaymentFee` の失敗が注文取得と同じ `try` に入り、stripes の1件の権限エラー・パースエラー・ネットワーク失敗でも、取得済みの注文まで `orders: null` / `error` になってキャンセル・領収書操作が隠れます。手数料取得を注文取得から分離し、手数料だけの未取得状態を扱うか、少なくとも注文一覧を維持するようにしてください。

**コメント要約**: 手数料取得失敗で注文操作まで隠れる問題が残る<br>注文状態と手数料状態を分離し、失敗を 0 円にしない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: base/src/stores/userOrderHistoryList.ts:84–94 で注文取得と手数料取得が同じ try にあり、後者が失敗しても orders:null に戻す。UserEventCard は ordersError/Loading に応じて注文表示・キャンセル・領収書操作を隠すため、1 件の stripes 読み取り失敗が既存操作を不能にする。単に手数料例外を握りつぶして 0 を返すと、未取得と無料を取り違える。

対応方針・確認項目: 注文が取得できた時点で orders を保持し、注文 loading を解除する。手数料には loading/error/取得成功を独立して持たせる。失敗時も注文一覧・キャンセル・領収書操作を維持し、利用料・総額だけを未取得表示にして再試行を提供する。成功した旧決済のフィールド未設定は従来どおり 0 とし、通信・権限・parse エラーとは区別する。ログは reportClientError を使い、非同期完了時の generation チェックを維持する。確認は「注文成功＋料金失敗」「料金再試行成功」「reload 後に旧要求が完了」「料金成功 0 円」。

---

**識別子**: RC-28（GitHub id: 4114228685・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `functions/default/src/stripe.ts:279`

**該当コード（レビュー時点の diff）**:

GitHub id: 4114228685

```diff
@@ -270,6 +272,25 @@ export const createStripeCheckoutSession = onCall<
       throw new HttpsError('internal', '決済明細の生成に失敗しました')
     }
 
+    const userFee = computeUserPaymentFeeFromSelfPay(totalPayment)
+    const feeLineItem = buildUserPaymentFeeCheckoutLineItem(userFee)
+    if (feeLineItem != null) {
+      lineItems.push(feeLineItem)
+    }
```

**レビュワーのコメント（原文）**:

[GitHub id: 4114228685](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4114228685)

[must] ここから Functions はシステム利用料を実際に Checkout に追加しますが、Functions と user/enterprise のデプロイは独立しているため、Functions が先に反映されると旧フロントは手数料を表示しないまま高い Checkout を作成されます。逆順では新フロント表示と旧 Functions の実課金がずれます。互換期間のフラグ、またはデプロイ順序を保証する仕組みを用意してから課金を有効化してください。

**コメント要約**: 課金開始とフロント表示の互換性確保が必要<br>スコープ内に見直し、旧画面を含む段階切替を設計する案

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: functions/default/src/stripe.ts:276–280 は無条件で利用料を追加し、deploy_functions / deploy_user / deploy_enterprise は別 workflow で独立に起動する。カートはローカル計算、Callable の要求には価格版がなく返却も URL 中心で、表示と課金の同期契約がない。RC-3 の旧 Session 受理は決済確定側の互換性であり、この新規 Session 作成時の価格差は解消しない。過去のスコープ外判断は見直す。本 PR が課金を始める以上、課金開始前の整合策もスコープ内であり、Issue 未作成の別件扱いにはしない。既存評価 🟡 は維持するが、課金有効化前に対応が必要。

対応方針・確認項目: 推奨はサーバーの課金フラグを OFF にした互換実装を先行させ、カートがサーバー確定の見積額・価格版を使い、Checkout 作成時にその価格版を検証する段階切替。新しい user/enterprise と Webhook の準備確認後に ON にする。開いたままの旧画面からの要求を黙って増額せず、既存の注文状態を壊さない段階で再読み込み・再確認へ誘導する。すでに作成済みの Session は作成時の実課金額で確定する。単なる needs 追加・フロント先行だけでは古いタブやキャッシュを解決できず、Functions 内でも各関数の切替時刻は揃うとは限らない。確認は新旧フロント×新旧バックエンド、OFF/ON 切替中、片側デプロイ失敗、古い見積り・既存 Session。範囲が広がる場合は再見積りする。

---

**識別子**: RC-29（GitHub id: 4114336569・既存 RC の再確認）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `base/src/components/pages/orders.vue:160`

**該当コード（レビュー時点の diff）**:

GitHub id: 4114336569

```diff
@@ -152,21 +153,41 @@ watch(
         {{ $t('user_profile.empty.orders') }}
       </div>
       <v-row v-else>
-        <v-col v-for="event in orderHistoryEvents" :key="`order_${event.event_id}`" sm="12" md="6" lg="4" cols="12">
+        <v-col
+          v-for="event in orderHistoryEvents"
+          :key="`order_${getUserOrderHistoryEventKey(event.community_id, event.event_id)}`"
```

**レビュワーのコメント（原文）**:

[GitHub id: 4114336569](https://github.com/nijuniinc/bokudeli-event-new/pull/2361#discussion_r4114336569)

[must] ここでカードの描画キーを複合キーにしても、同じ `orders.vue` の `cancelDialogEventId` / `cancelLoadingEventId` と `UserEventCard` 側のダイアログ判定は `event_id` 単体のままです。同じ `event_id` が別コミュニティに存在すると、片方のカードのキャンセル操作で両方が開く・ローディング表示になるため、キャンセル状態も `community_id + event_id` のキーに揃えてください。

**コメント要約**: キャンセル状態の複合キー化は対応済み<br>ダイアログと loading の代入・比較を両方確認

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 24608fe72 により、UserEventCard.vue:47–55 は getUserOrderHistoryEventKey(community_id,event_id) でダイアログ状態を設定・比較し、orders.vue:96–97,188,196 は同じキーで loading を設定・比較する。変数名に EventId が残っていても実際に格納する値は JSON.stringify([communityId,eventId]) であり、event_id 単体比較という指摘は現 HEAD では解消済み。

対応方針・確認項目: 追加修正なしで Resolve 可能。二つのコミュニティに同一 event_id を置き、片方だけダイアログが開く・loading が出ることを画面で確認するとよい。今回の確認はコード追跡であり、ブラウザ操作テストは未実施。

---

## 評価セッション（2026-09-27 16:17・review-comments-evaluate）

- **評価日時**: 2026-09-27 16:17 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/971
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2361
- **REVIEW_REQUEST_SINCE**: 2026-09-27T07:08:24Z
- **partial**: true（wake は partial。Codex は `Didn't find any major issues` の no_issues のみ。Copilot は処理エラーのあとインライン 1 件）
- **新規 RC**: RC-30
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（id:5853652964 手順12定型文、id:5853653654 Copilot 処理エラー、id:5853674915 Codex の問題なしのみ）
- **手順 4a 自動修正**: なし（RC-30 は欠落時を取得エラーにするか未確定にするかが仕様判断で一意でない。ラベルに 💰 金銭 と 👤 UX を含む）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-30 | 4114454601 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭, 👤 UX | 🔧 微修正 | M | EventStripe 欠落をレガシーと同じ 0 円にしている<br>フィールド未設定とドキュメント欠落の区別は表示方針が未決 |

---

**識別子**: RC-30（GitHub id: 4114454601）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/eventStripe.ts:60`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,64 @@
+import {
+  doc,
+  getDoc,
+  type DocumentData,
+  type DocumentReference,
+  type FirestoreDataConverter,
+  type QueryDocumentSnapshot,
+  type SnapshotOptions,
+} from 'firebase/firestore'
+import { db } from '@shokujii/base/firebase.js'
+import { EventStripe } from '@shokujii/common/schemas/EventStripe.js'
+import { sumChargedUserPaymentFee, type ChargedFeeOrderRef } from '@shokujii/common/utils/paymentUserFee.js'
+
+const eventStripeConverter: FirestoreDataConverter<EventStripe> = {
+  toFirestore(stripe: EventStripe): DocumentData {
+    return stripe.toFirestore()
+  },
+  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): EventStripe {
+    const data = snapshot.data(options)
+    return new EventStripe(snapshot.id, data)
+  },
+}
+
+/** communities/{communityId}/events/{eventId}/stripes/{stripeId} */
+export const getEventStripeRef = (
+  communityId: string,
+  eventId: string,
+  stripeId: string,
+): DocumentReference<EventStripe> => {
+  return doc(db, 'communities', communityId, 'events', eventId, 'stripes', stripeId).withConverter(eventStripeConverter)
+}
+
+export const fetchEventStripe = async (
+  communityId: string,
+  eventId: string,
+  stripeId: string,
+): Promise<EventStripe | null> => {
+  const snapshot = await getDoc(getEventStripeRef(communityId, eventId, stripeId))
+  if (!snapshot.exists()) return null
+  return snapshot.data()
+}
+
+/** 残注文が参照する EventStripe の pay_user_fee_amount 合計。未設定は 0。 */
+export const fetchChargedUserPaymentFee = async (
+  communityId: string,
+  eventId: string,
+  orders: readonly ChargedFeeOrderRef[],
+): Promise<number> => {
+  const stripeIds = new Set<string>()
+  for (const order of orders) {
+    if (order.status === 'canceled') continue
+    if (order.stripe_id == null || order.stripe_id === '') continue
+    stripeIds.add(order.stripe_id)
+  }
+
+  const feeByStripeId: Record<string, number | undefined> = {}
+  await Promise.all(
+    [...stripeIds].map(async (stripeId) => {
+      const stripe = await fetchEventStripe(communityId, eventId, stripeId)
+      feeByStripeId[stripeId] = stripe?.pay_user_fee_amount
```

**レビュワーのコメント（原文）**:

[must] `fetchEventStripe` が `null` を返した場合も `feeByStripeId[stripeId]` は `undefined` となり、レガシー決済と同じく 0 円として合算されます。`stripe_id` が付いた注文で `EventStripe` ドキュメントだけ欠落した場合、実際のシステム利用料を注文履歴から黙って消して合計額を誤表示します。レガシーの「fee フィールドなし」とドキュメント欠落を区別し、後者は取得エラーまたは未確定状態にしてください。

**コメント要約**: EventStripe 欠落をレガシーと同じ 0 円にしている<br>フィールド未設定とドキュメント欠落の区別は表示方針が未決

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: `sumChargedUserPaymentFee` はフィールド未設定もドキュメント無しも 0 にする。仕様書は「未設定または 0 の既存 EventStripe は手数料 0」で、ドキュメント欠落までは 0 と書いていない。`stripe_id` は Webhook で EventStripe 作成と同時に付くため、ドキュメント欠落は通常のレガシー決済ではなくデータ不整合である。欠落時に注文一覧をエラーにするか、手数料だけ未確定にするかは RC-24 と同じ表示判断が必要で、修正方針が一意でない。自動修正はしない。

---
