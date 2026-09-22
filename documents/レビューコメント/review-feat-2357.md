# ブランチ feat/2357 レビュー記録

請求書払いの入金ステータスと督促再送信。仕様は計画「請求書払い入金管理と督促再送信」および [documents/09_運営向け機能/03_managerパッケージの再実装.md](../09_運営向け機能/03_managerパッケージの再実装.md) フェーズ3。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `resendCommunityBillInvoiceMail` に timeout が無い<br>PDF 未作成時は `eventBillInvoice` と同じ 120 秒に揃えた |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | 入金ドキュメント取得失敗を未確認として編集できてしまう<br>`loadError` で保存を止め、再試行 UI を出した |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 📏 規約 | 🔧 微修正 | S | 入金列の取得失敗でキー未設定のままスピナーが残る<br>catch で `null` を記録し `reportClientError` する |
| [ ] | RC-4 | 5771066344 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 入金ステータス更新と督促記録の競合・送信後記録失敗で重複送信しうる<br>status 更新から mail フィールドを外し、送信前に送信権を確保する |
| [x] | RC-5 | 4068362478 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 一覧クエリに `is_deleted` が無くインデックスと不一致と指摘<br>`useEventListStore` が常に `is_deleted == false` を付与するため一致する |
| [x] | RC-6 | 4068362489 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 催促テンプレ ID がプレースホルダのまま<br>ダッシュボード作成後の差し替えは人間作業。コードコメントと PR 本文に記載済み |
| [x] | RC-7 | 4068362527 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 督促経路で PDF を再生成していると指摘<br>`createEventBillInvoice` は既存 ID があれば再利用し、未作成時のみ初回生成する |
| [ ] | RC-8 | 4068362510 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 同時実行でクールダウンをすり抜け複数通送信できる<br>送信前 Transaction で送信権を確保する必要がある |
| [x] | RC-9 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | 詳細パネルのイベント切替で古い入金取得が残る<br>開始時の community/event ID を固定し、切替後の結果は捨てる |
| [ ] | RC-10 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | `nowTick` が更新されずクールダウン解除後もボタンが無効のまま<br>mounted 中に tick するか、クライアント側ではクールダウンで disable しない |

---

## 評価セッション（2026-09-21 22:37・shokujii-code-review）

- **評価日時**: 2026-09-21 22:37 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2357`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3b 自動修正**: RC-1（🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `resendCommunityBillInvoiceMail` に timeout が無い<br>PDF 未作成時は `eventBillInvoice` と同じ 120 秒に揃えた |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/resendCommunityBillInvoiceMail.ts:23`

**該当コード（レビュー時点の diff）**:

```diff
+export const resendCommunityBillInvoiceMail = onCall<
+  ResendCommunityBillInvoiceMailRequest,
+  Promise<ResendCommunityBillInvoiceMailResponse>
+>(
+  {
+    secrets: ['SENDGRID_API_KEY', 'PDF_SERVICES_CLIENT_ID', 'PDF_SERVICES_CLIENT_SECRET'],
+  },
+  async (request) => {
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `resendCommunityBillInvoiceMail` の `onCall` に `timeoutSeconds` が無い。PDF 未作成時は `createEventBillInvoice` が走るため、デフォルト 60 秒では足りないことがある。既存の `eventBillInvoice` に合わせ `timeoutSeconds: 120` を付ける。

**コメント要約**: `resendCommunityBillInvoiceMail` に timeout が無い。
PDF 未作成時は `eventBillInvoice` と同じ 120 秒に揃えた。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 督促は通常既存 PDF を再利用するが、secrets に PDF 認証を付けているのは未作成時の生成を想定している。timeout を揃えないと Callable だけ先に切れる。

---

## 評価セッション（2026-09-21 23:16・shokujii-code-review）

- **評価日時**: 2026-09-21 23:16 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2357`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a 自動修正**: RC-2（🚨 1件）
- **手順 3b 自動修正**: RC-3（🟡 1件）
- **再レビュー**: 1 周。追加の自動修正対象なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | 入金ドキュメント取得失敗を未確認として編集できてしまう<br>`loadError` で保存を止め、再試行 UI を出した |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 📏 規約 | 🔧 微修正 | S | 入金列の取得失敗でキー未設定のままスピナーが残る<br>catch で `null` を記録し `reportClientError` する |

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/components/SupportInvoicePaymentPanel.vue:63`

**該当コード（レビュー時点の diff）**:

```diff
+const loadPayment = async (): Promise<void> => {
+  loaded.value = false
+  try {
+    payment.value = await getEventInvoicePayment(props.event.community_id, props.event.event_id)
+    memoDraft.value = payment.value?.memo ?? ''
+  } catch (error) {
+    console.warn(error)
+    payment.value = undefined
+    memoDraft.value = ''
+  } finally {
+    loaded.value = true
+  }
+}
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: 入金ドキュメントの取得に失敗すると `payment` を `undefined` のまま `loaded=true` にし、表示上「未確認」としてメモ保存・ステータス変更ができる。既存の `paid` ドキュメントを未確認で上書きしうる。取得失敗時は編集を止め、再試行できるようにする。

**コメント要約**: 入金ドキュメント取得失敗を未確認として編集できてしまう。
`loadError` で保存を止め、再試行 UI を出した。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様の「ドキュメント未作成は未確認」は取得成功時の欠番だけを指す。catch で未確認扱いすると、通帳確認済みの入金状態をクライアントから消せる。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/invoices/index.vue:123`

**該当コード（レビュー時点の diff）**:

```diff
+        } catch (error) {
+          console.warn(error)
+          return null
+        }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `/invoices` の入金ドキュメント取得が失敗すると `invoicePayments` にキーを入れないため、行がスピナーのまま固まる。`reportClientError` を呼び、失敗時も `null` を記録してスピナーを終了する。

**コメント要約**: 入金列の取得失敗でキー未設定のままスピナーが残る。
catch で `null` を記録し `reportClientError` する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: チェックリストは握りつぶす catch で `reportClientError` を要求する。キー未設定は `events` 再評価まで再試行されず、フィルタ中は行自体が消える。一覧の `null` は未作成と同表示になるが、詳細パネルの `loadError`（RC-2）で上書きは防ぐ。

---

## 評価セッション（2026-09-22 13:16・review-comments-evaluate）

- **評価日時**: 2026-09-22 13:16 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2357`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2358
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼定型文 5771025508、Copilot overview 5274036124 はインライン 4 件の目次）
- **partial**: true（Codex 未レビューまたは limits/connect のみ）
- **新規 RC**: RC-4〜RC-8
- **手順 4a 自動修正**: なし（🟡 は工数 M のため対象外。🚨 なし）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | RC-4 | 5771066344 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 入金ステータス更新と督促記録の競合・送信後記録失敗で重複送信しうる<br>status 更新から mail フィールドを外し、送信前に送信権を確保する |
| [x] | RC-5 | 4068362478 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 一覧クエリに `is_deleted` が無くインデックスと不一致と指摘<br>`useEventListStore` が常に `is_deleted == false` を付与するため一致する |
| [x] | RC-6 | 4068362489 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 催促テンプレ ID がプレースホルダのまま<br>ダッシュボード作成後の差し替えは人間作業。コードコメントと PR 本文に記載済み |
| [x] | RC-7 | 4068362527 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 督促経路で PDF を再生成していると指摘<br>`createEventBillInvoice` は既存 ID があれば再利用し、未作成時のみ初回生成する |
| [ ] | RC-8 | 4068362510 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 同時実行でクールダウンをすり抜け複数通送信できる<br>送信前 Transaction で送信権を確保する必要がある |

---

**識別子**: RC-4（GitHub id: 5771066344）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

```
> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

レビューしました。要修正は2点です。1) `base/src/stores/eventInvoicePayment.ts` の `updateEventInvoicePaymentStatus` が read→set の非トランザクション更新で、督促再送の `last_mail_sent_at` / `mail_send_count` を競合上書きしえます。2) `functions/default/src/resendCommunityBillInvoiceMail.ts` はメール送信成功後に `recordInvoicePaymentMailSent` を更新しているため、記録失敗時に再実行で督促メールを重複送信しえます。
```

**コメント要約**: 入金ステータス更新と督促記録の競合・送信後記録失敗で重複送信しうる。
status 更新から mail フィールドを外し、送信前に送信権を確保する。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 1) `toFirestore` は `undefined` を落とすので未送信ドキュメントとの競合では mail フィールドは消えないが、古い `last_mail_sent_at` / `mail_send_count` を持った read のあとに `recordInvoicePaymentMailSent` が走ると merge で巻き戻せる。2) 送信成功後の記録失敗で再実行すると重複する。どちらも support 限定かつ頻度は低いが、督促メールの重複は実害になりうる。送信前予約と status 更新のフィールド分離は方針が一意でないため自動修正しない。

---

**識別子**: RC-5（GitHub id: 4068362478）

**レビュワー**: Copilot

**指摘箇所**: `firestore.indexes.json:1478`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1420,6 +1420,80 @@
         }
       ]
     },
+    {
+      "collectionGroup": "member_orders",
+      "queryScope": "COLLECTION_GROUP",
+      "fields": [
+        {
+          "fieldPath": "status",
+          "order": "ASCENDING"
+        },
+        {
+          "fieldPath": "updated_at",
+          "order": "DESCENDING"
+        }
+      ]
+    },
+    {
+      "collectionGroup": "member_orders",
+      "queryScope": "COLLECTION_GROUP",
+      "fields": [
+        {
+          "fieldPath": "status",
+          "order": "ASCENDING"
+        },
+        {
+          "fieldPath": "ordered_at",
+          "order": "ASCENDING"
+        }
+      ]
+    },
+    {
+      "collectionGroup": "events",
+      "queryScope": "COLLECTION_GROUP",
+      "fields": [
+        {
+          "fieldPath": "is_deleted",
+          "order": "ASCENDING"
+        },
+        {
+          "fieldPath": "event_start_datetime",
+          "order": "DESCENDING"
+        }
+      ]
+    },
+    {
+      "collectionGroup": "events",
+      "queryScope": "COLLECTION_GROUP",
+      "fields": [
+        {
+          "fieldPath": "event_payment",
+          "order": "ASCENDING"
+        },
+        {
+          "fieldPath": "is_deleted",
+          "order": "ASCENDING"
+        },
+        {
+          "fieldPath": "event_start_datetime",
```

**レビュワーのコメント（原文）**:

[must] この一覧クエリは `event_payment == community_bill` と `event_start_datetime` の並び替えだけを指定していますが、追加された複合インデックスは途中に `is_deleted` を含みます。`is_deleted` の equality 条件が無いままではこのインデックスを利用できず、一覧取得が FAILED_PRECONDITION（インデックス不足）になる可能性があります。クエリに `where('is_deleted', '==', false)` を追加するか、クエリに一致する `event_payment + event_start_datetime` の collection-group index を追加してください。

**コメント要約**: 一覧クエリに `is_deleted` が無くインデックスと不一致と指摘。
`useEventListStore` が常に `is_deleted == false` を付与するため一致する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `support/src/pages/invoices/index.vue` の filters は `event_payment` と `orderBy` だけだが、`useEventListStore` は `where('is_deleted', '==', false)` を先に付ける。実クエリはインデックス定義と一致する。

---

**識別子**: RC-6（GitHub id: 4068362489）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventBillInvoice.ts:361`

**該当コード（レビュー時点の diff）**:

```diff
@@ -352,7 +352,47 @@ export const eventBillInvoice = onRequest(
   },
 )

-const EVENT_INVOICE_TEMPLATE_ID = 'd-48e3179255834b8bb895cd995b1aac28'
+export const EVENT_INVOICE_TEMPLATE_ID = 'd-48e3179255834b8bb895cd995b1aac28'
+
+/**
+ * SendGrid ダッシュボードで督促テンプレート作成後、実 ID に差し替える。
+ * 件名・本文案は documents/06_メール通知/メール既存仕様.md の手動督促を参照。
+ */
+export const EVENT_INVOICE_REMINDER_TEMPLATE_ID = 'd-00000000000000000000000000000000'
```

**レビュワーのコメント（原文）**:

[must] `EVENT_INVOICE_REMINDER_TEMPLATE_ID` が `d-000...` のプレースホルダのままなので、現状の本番 Callable は SendGrid から無効なテンプレートとして拒否され、督促を一件も送れません。テンプレート作成後の実 ID に差し替えてからデプロイするか、未設定時は明示的に送信不可として扱う必要があります。

**コメント要約**: 催促テンプレ ID がプレースホルダのまま。
ダッシュボード作成後の差し替えは人間作業。コードコメントと PR 本文に記載済み。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: プレースホルダは意図どおり。SendGrid ダッシュボードでのテンプレ作成はエージェントができない人間作業で、差し替えまで督促は送れないことは PR 本文にも書いている。未設定ガードは仕様判断であり、この評価ではコード欠陥としない。

---

**識別子**: RC-7（GitHub id: 4068362527）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventBillInvoice.ts:375`

**該当コード（レビュー時点の diff）**:

```diff
@@ -352,7 +352,47 @@ export const eventBillInvoice = onRequest(
   },
 )

-const EVENT_INVOICE_TEMPLATE_ID = 'd-48e3179255834b8bb895cd995b1aac28'
+export const EVENT_INVOICE_TEMPLATE_ID = 'd-48e3179255834b8bb895cd995b1aac28'
+
+/**
+ * SendGrid ダッシュボードで督促テンプレート作成後、実 ID に差し替える。
+ * 件名・本文案は documents/06_メール通知/メール既存仕様.md の手動督促を参照。
+ */
+export const EVENT_INVOICE_REMINDER_TEMPLATE_ID = 'd-00000000000000000000000000000000'
+
+export type CommunityBillInvoiceMailKind = 'initial' | 'reminder'
+
+export const sendCommunityBillInvoiceMail = async (
+  community: ShokujiiCommunity,
+  event: ShokujiiEvent,
+  kind: CommunityBillInvoiceMailKind,
+): Promise<{ to: string; cc?: string; invoiceId: string }> => {
+  const to = event.bill_email?.trim()
+  if (!to) {
+    throw new HttpsError('failed-precondition', 'bill_email is empty')
+  }
+
+  const invoiceId = await createEventBillInvoice(community, event)
```

**レビュワーのコメント（原文）**:

[must] 仕様では督促再送信で PDF を再発行しない想定ですが、この共通化で `reminder` でも `createEventBillInvoice()` が実行されます。既存の請求書 ID が無いイベントでは督促操作が PDF 生成・Storage 保存・注文読み取りまで行い、督促送信の対象外処理を実行してしまうため、督促経路は既存 invoice の URL を解決して送信するだけに分離してください。

**コメント要約**: 督促経路で PDF を再生成していると指摘。
`createEventBillInvoice` は既存 ID があれば再利用し、未作成時のみ初回生成する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `createEventBillInvoice` は `getInvoiceId` で既存ファイルがあれば再利用する。仕様の「再発行しない」は既存 PDF の作り直し禁止であり、初回未作成時の生成は timeout 120s と PDF secrets を付けた意図。未作成時に送れなくする分離は仕様判断。

---

**識別子**: RC-8（GitHub id: 4068362510）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/resendCommunityBillInvoiceMail.ts:64`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,73 @@
+import { onCall, HttpsError } from 'firebase-functions/https'
+import { DateTime } from 'luxon'
+import {
+  resendCommunityBillInvoiceMailRequestSchema,
+  type ResendCommunityBillInvoiceMailRequest,
+  type ResendCommunityBillInvoiceMailResponse,
+} from '@shokujii/common/apis/communityBillInvoice.js'
+import { getInvoiceReminderBlockReason } from '@shokujii/common/utils/invoicePayment.js'
+import { getConfigGlobal } from './stores/config.js'
+import { getCommunity } from './stores/community.js'
+import { getEventInCommunity } from './stores/event.js'
+import { getEventInvoicePayment, recordInvoicePaymentMailSent } from './stores/eventInvoicePayment.js'
+import { sendCommunityBillInvoiceMail } from './eventBillInvoice.js'
+import { createModuleLogger } from './utils/logger.js'
+
+const logger = createModuleLogger('resendCommunityBillInvoiceMail')
+
+export const resendCommunityBillInvoiceMail = onCall<
+  ResendCommunityBillInvoiceMailRequest,
+  Promise<ResendCommunityBillInvoiceMailResponse>
+>(
+  {
+    secrets: ['SENDGRID_API_KEY', 'PDF_SERVICES_CLIENT_ID', 'PDF_SERVICES_CLIENT_SECRET'],
+    timeoutSeconds: 120,
+  },
+  async (request) => {
+    const uid = request.auth?.uid
+    if (uid == null) {
+      throw new HttpsError('unauthenticated', 'Login required to use this feature.')
+    }
+
+    const { communityId, eventId } = resendCommunityBillInvoiceMailRequestSchema.parse(request.data)
+    const config = await getConfigGlobal()
+    if (config?.isSupport(uid) !== true) {
+      throw new HttpsError('permission-denied', 'Forbidden')
+    }
+
+    const [event, community, payment] = await Promise.all([
+      getEventInCommunity(communityId, eventId),
+      getCommunity(communityId),
+      getEventInvoicePayment(communityId, eventId),
+    ])
+    if (event == null) {
+      throw new HttpsError('not-found', 'Event not found')
+    }
+    if (community == null) {
+      throw new HttpsError('not-found', 'Community not found')
+    }
+
+    const now = DateTime.now().toMillis()
+    const blockReason = getInvoiceReminderBlockReason({
+      eventPayment: event.event_payment,
+      status: payment?.status,
+      billEmail: event.bill_email,
+      eventStartDatetime: event.event_start_datetime,
+      lastMailSentAt: payment?.last_mail_sent_at,
+      now,
+    })
+    if (blockReason != null) {
+      throw new HttpsError('failed-precondition', blockReason)
+    }
+
+    const sent = await sendCommunityBillInvoiceMail(community, event, 'reminder')
+    const recorded = await recordInvoicePaymentMailSent(communityId, eventId, uid)
```

**レビュワーのコメント（原文）**:

[must] クールダウン判定の読み取りと `recordInvoicePaymentMailSent` の更新がメール送信の前後に分かれているため、同じイベントに Callable が同時実行されると両方が同じ `last_mail_sent_at` を読み、10分以内でも複数通を送信できます。送信前に Firestore Transaction で単一の送信権を原子的に確保するなど、並行リクエストを直列化してから外部送信する必要があります。

**コメント要約**: 同時実行でクールダウンをすり抜け複数通送信できる。
送信前 Transaction で送信権を確保する必要がある。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 指摘は妥当。support 限定・確認ダイアログ・UI クールダウンで実害頻度は低いが、二重実行で督促が複数通になる。送信前に送信権を取る設計は SendGrid と Transaction の順序判断が要るため自動修正しない。RC-4 の 2 点目と関連する。

---

## 評価セッション（2026-09-22 13:58・shokujii-code-review）

- **評価日時**: 2026-09-22 13:58 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2357`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2358
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a 自動修正**: RC-9（🚨 1件）
- **手順 3b 自動修正**: なし（RC-10 は 👤 UX のため対象外）
- **再レビュー**: 1 周。追加の自動修正対象なし
- **既存未着手のまま**: RC-4, RC-8（工数 M のため自動修正対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-9 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | 詳細パネルのイベント切替で古い入金取得が残る<br>開始時の community/event ID を固定し、切替後の結果は捨てる |
| [ ] | RC-10 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | `nowTick` が更新されずクールダウン解除後もボタンが無効のまま<br>mounted 中に tick するか、クライアント側ではクールダウンで disable しない |

---

**識別子**: RC-9（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/components/SupportInvoicePaymentPanel.vue:60`

**該当コード（レビュー時点の diff）**:

```diff
+const loadPayment = async (): Promise<void> => {
+  loaded.value = false
+  loadError.value = false
+  try {
+    payment.value = await getEventInvoicePayment(props.event.community_id, props.event.event_id)
+    memoDraft.value = payment.value?.memo ?? ''
+  } catch (error) {
+    console.warn(error)
+    reportClientError(error, { componentInfo: 'SupportInvoicePaymentPanel.loadPayment', severity: 'warn' })
+    payment.value = undefined
+    memoDraft.value = ''
+    loadError.value = true
+  } finally {
+    loaded.value = true
+  }
+}
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: 詳細ドロワーでイベントを切り替えると、先行した `loadPayment` / `persist` が完了した時点の `props.event` に書き戻す。遅い応答が新しい行の入金状態を上書きし、メモ保存では表示中の（古い）`displayStatus` を別イベントへ書き込みうる。開始時の `communityId` / `eventId` を固定し、切替後の結果は捨てる。一覧更新は `selected.event_id` ではなく emit した `eventId` を使う。

**コメント要約**: 詳細パネルのイベント切替で古い入金取得が残る。
開始時の community/event ID を固定し、切替後の結果は捨てる。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 通帳確認済みの `paid` を、別イベントの未確認/未払い表示のままメモ保存すると上書きできる。support 限定でも入金正本を壊す。手順 3a で ID 固定・stale discard・一覧は emit の eventId で更新するよう修正した。

---

**識別子**: RC-10（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/components/SupportInvoicePaymentPanel.vue:248`

**該当コード（レビュー時点の diff）**:

```diff
+        <v-btn color="warning" variant="tonal" :disabled="reminderBlock != null || sending" @click.stop="openReminder">
+          {{ $t('invoices.reminder') }}
+        </v-btn>
+        <div v-if="reminderOnCooldown" class="support-cell-sub mt-2">
+          {{ $t('invoices.reminder_cooldown') }}
+        </div>
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `nowTick` は setup と `openReminder` / `sendReminder` でしか更新されない。クールダウン中は `reminderBlock != null` でボタンが disable され、`openReminder` に入れない。10分経過しても `nowTick` が古いままなので、ページを開き直すまで再送ボタンが有効にならない。mounted 中に tick するか、クライアント側の disable をクールダウン以外の block に限る。

**コメント要約**: `nowTick` が更新されずクールダウン解除後もボタンが無効のまま。
mounted 中に tick するか、クライアント側ではクールダウンで disable しない。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: サーバの 10 分拒否は生きている。UI だけ「リロードするまで再送不可」になる。仕様のクールダウン表示としては欠陥だが、リロードで回避できる。👤 UX のため自動修正しない。

---


