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
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | `nowTick` が更新されずクールダウン解除後もボタンが無効のまま<br>mounted 中に 30 秒間隔で tick するようにした |
| [ ] | RC-11 | 4070918056 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | `invoice_payments` が `isSupport()` なら任意 doc を書き込める<br>`docId == 'current'` と許可フィールド・更新者 UID を Rules で制約する |
| [x] | RC-12 | 4070918104 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 入金取得失敗を `null` 保存し未確認として表示・フィルタする<br>loadErrors で区別し、エラー表示・再試行しステータス集計から除外した |
| [x] | RC-13 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | ドロワー更新後も一覧の取得失敗が残る<br>`updated` で `invoicePaymentLoadErrors` を消すようにした |
| [x] | RC-14 | 4068413497 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `deploy_support` が `common/**` を見ていない<br>paths に追加した |
| [x] | RC-15 | 4071042948 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 送信後の再取得失敗を督促失敗と表示する<br>Callable 成功を先に確定し再取得は別扱いした |
| [x] | RC-16 | 4068413491 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | コミュニティ公開・承認の成功後に行が古いまま<br>成功後に `Object.assign` で行を更新した |
| [ ] | RC-17 | 4071042943 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | コミュニティ一覧の取得失敗が永久スピナー<br>store に loadError と再試行が必要 |
| [ ] | RC-18 | 4068413527 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | イベント一覧の取得失敗が永久スピナー<br>store に loadError と再試行が必要 |
| [x] | RC-19 | 4068413504 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | ダッシュボードの受付中と予約申請中が同一 store<br>別 `storeKey` を付けた |
| [x] | RC-20 | 4068413493 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | 店舗公開・承認の成功後に行が古いまま<br>成功後に `Object.assign` で行を更新した |
| [ ] | RC-21 | 4071042959 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | config 解決を二つのガードで直列に待つ<br>pending 共有かガード統合が必要 |
| [x] | RC-22 | 4068413513 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | OTP 後に redirect が消えて常に `/`<br>login で `setRedirectPath` して OTP 後まで保持する |
| [ ] | RC-23 | 4071042953 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | M | support が `DEFAULT_TIME_ZONE` を直接 import<br>表示計算を common に移す |
| [ ] | RC-24 | 4071042930 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 🐛 実害 | 📋 仕様追加 | M | 外部リンクが PF ホスト固定<br>enterprise 行はテナントホスト解決が必要 |

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
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | `nowTick` が更新されずクールダウン解除後もボタンが無効のまま<br>mounted 中に 30 秒間隔で tick するようにした |

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
mounted 中に 30 秒間隔で tick するようにした。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: サーバの 10 分拒否は生きている。UI だけ「リロードするまで再送不可」になる。mounted 中に 30 秒間隔で `nowTick` を進め、unmounted で解除した。

---

## 評価セッション（2026-09-22 20:17・review-comments-evaluate）

- **評価日時**: 2026-09-22 20:17 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2357`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2358
- **partial**: true（Codex limits / connect。Copilot のみ評価）
- **REVIEW_REQUEST_SINCE**: `2026-09-22T11:01:37Z`
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（5775300081 レビュー依頼定型文）
- **重複除外**: 4070918002（RC-4 と同一）、5775333733（RC-4 / RC-8 / RC-10 の再掲）、review 5277139361（overview・インラインの要約）
- **手順 4a 自動修正**: RC-12（🟡 1件）。RC-11 は 🔒 セキュリティ + 工数 M のため対象外

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | RC-11 | 4070918056 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | M | `invoice_payments` が `isSupport()` なら任意 doc を書き込める<br>`docId == 'current'` と許可フィールド・更新者 UID を Rules で制約する |
| [x] | RC-12 | 4070918104 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 入金取得失敗を `null` 保存し未確認として表示・フィルタする<br>loadErrors で区別し、エラー表示・再試行しステータス集計から除外した |

---

**識別子**: RC-11（GitHub id: 4070918056）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:308`

**該当コード（レビュー時点の diff）**:

```diff
@@ -300,6 +303,9 @@ service cloud.firestore {
                 match /system/{docId} {
                     allow read, write: if false;
                 }
+                match /invoice_payments/{docId} {
+                    allow read, write: if isSupport();
+                }
```

**レビュワーのコメント（原文）**:

[must] このルールは `isSupport()` であれば `docId` やフィールド内容を問わず任意の `invoice_payments` ドキュメントを書き込めます。クライアントが `current` 以外を作成したり、`updated_by`・`mail_send_count` など督促記録を改ざんでき、サーバ側のスキーマ前提も壊せるため、`docId == 'current'` と許可フィールド・値・更新者 UID などを Rules で制約してください。

**コメント要約**: `invoice_payments` が `isSupport()` なら任意 doc を書き込める。
`docId == 'current'` と許可フィールド・更新者 UID を Rules で制約する。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: support 限定なので一般ユーザーからの書き込みは無い。一方で support アカウントが任意 doc / 督促フィールドを書き換えられるのは指摘どおり。フィールド単位の Rules は firestore-rules テストと既存 write 経路の洗い出しが要るため、🔒 かつ工数 M として自動修正しない。

---

**識別子**: RC-12（GitHub id: 4070918104）

**レビュワー**: Copilot

**指摘箇所**: `support/src/pages/invoices/index.vue:142`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・62 行）
+    )
+    if (!matched) {
+      return false
+    }
+    const filter = paymentStatusFilter.value
+    if (filter == null) {
+      return true
+    }
+    if (!invoicePayments.value.has(event.event_id)) {
+      return false
+    }
+    return invoicePaymentStatus(event.event_id) === filter
+  })
+})
+
+const showingCount = computed(() => {
+  const filtering = searchQuery.value.trim() !== '' || paymentStatusFilter.value != null
+  if (!filtering || filteredEvents.value == null) {
+    return null
+  }
+  return filteredEvents.value.length
+})
+
+watch(
+  events,
+  async (list) => {
+    if (list == null) {
+      return
+    }
+    const unresolved = list.filter((event) => !invoicePayments.value.has(event.event_id))
+    if (unresolved.length === 0) {
+      return
+    }
+    const results = await Promise.all(
+      unresolved.map(async (event) => {
+        try {
+          const payment = await getEventInvoicePayment(event.community_id, event.event_id)
+          return [event.event_id, payment ?? null] as const
+        } catch (error) {
+          console.warn(error)
+          reportClientError(error, {
+            componentInfo: 'invoices.index.loadPayment',
+            documentPath: `communities/${event.community_id}/events/${event.event_id}/invoice_payments/${INVOICE_PAYMENT_DOC_ID}`,
+            severity: 'warn',
+          })
+          return [event.event_id, null] as const
+        }
+      }),
+    )
+    const next = new Map(invoicePayments.value)
+    for (const result of results) {
+      if (result != null) {
+        next.set(result[0], result[1])
+      }
+    }
+    invoicePayments.value = next
```

**レビュワーのコメント（原文）**:

[must] 入金ドキュメントの取得失敗時も `null` を保存して `invoicePayments.has()` を成立させるため、画面上は「未確認」として表示され、`status=unconfirmed` フィルタにも混入します。取得失敗は未作成（未確認）と別状態で保持し、エラー表示・再試行を可能にして、失敗データをステータス集計から除外してください。

**コメント要約**: 入金取得失敗を `null` 保存し未確認として表示・フィルタする。
loadErrors で区別し、エラー表示・再試行しステータス集計から除外した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-3 で catch 後に `null` を入れてスピナーを止めた結果、未作成と失敗が同じ「未確認」になった。一覧の表示・フィルタが壊れるので妥当。`invoicePaymentLoadErrors` を分離し、danger チケットと再試行、status フィルタ除外を入れた。詳細パネル側の `loadError`（RC-2）と同じ方針。

---

## 評価セッション（2026-09-22 20:56・shokujii-code-review）

- **評価日時**: 2026-09-22 20:56 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2357`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2358
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a 自動修正**: なし（🚨 なし）
- **手順 3b 自動修正**: RC-13（🟡 1件）
- **再レビュー**: 1 周。追加の自動修正対象なし
- **既存未着手のまま**: RC-4, RC-8（工数 M）、RC-10（👤 UX）、RC-11（🔒 セキュリティ + 工数 M）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-13 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | ドロワー更新後も一覧の取得失敗が残る<br>`updated` で `invoicePaymentLoadErrors` を消すようにした |

---

**識別子**: RC-13（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/invoices/index.vue:170`

**該当コード（レビュー時点の diff）**:

```diff
+const onDrawerInvoicePaymentUpdated = (payment: EventInvoicePayment, eventId: string): void => {
+  const next = new Map(invoicePayments.value)
+  next.set(eventId, payment)
+  invoicePayments.value = next
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: RC-12 の `invoicePaymentLoadErrors` を入れたあと、詳細パネルの `updated` は入金 Map だけを更新している。一覧が取得失敗のままドロワーでステータス保存・督促送信すると、行は「取得できませんでした」のままで `status` フィルタからも除外され続ける。`onDrawerInvoicePaymentUpdated` で当該 `eventId` の loadError を消す。

**コメント要約**: ドロワー更新後も一覧の取得失敗が残る。
`updated` で `invoicePaymentLoadErrors` を消すようにした。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-12 の分離後、一覧の失敗表示がドロワーの成功結果と食い違う。保存後に未払いフィルタから行が消える実害がある。手順 3b で `updated` 時に error set から eventId を消した。パネルの load 成功だけでは emit しないため、保存せず閉じた場合は一覧の再試行が必要。

---



## 評価セッション（2026-09-22 22:12・review-comments-evaluate）

- **評価日時**: 2026-09-22 22:12 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` manual）
- **ブランチ名**: `feat/2357`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2358
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 6（依頼定型文 5771025508・5775300081、Copilot overview 5274036124・5277139361、Codex レビュー本文 5274099920・5277289589）
- **重複除外**: 5771066344（RC-4）、4068362478（RC-5）、4068362489（RC-6）、4068413481（RC-6 同一）、4068362527（RC-7）、4068362510（RC-8）、4068413488（RC-8 同一）、4068413520（RC-10 同一）、4070918002（RC-4 同一）、4070918056（RC-11）、4070918104（RC-12）、4068413514（RC-12 同一）、5775333733（RC-4 / RC-8 / RC-10 再掲）
- **新規 RC**: RC-14〜RC-24
- **手順 4a 自動修正**: RC-14・RC-15（🟡 2件）、RC-19（🚨 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-14 | 4068413497 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `deploy_support` が `common/**` を見ていない<br>paths に追加した |
| [x] | RC-15 | 4071042948 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 送信後の再取得失敗を督促失敗と表示する<br>Callable 成功を先に確定し再取得は別扱いした |
| [x] | RC-16 | 4068413491 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | コミュニティ公開・承認の成功後に行が古いまま<br>成功後に `Object.assign` で行を更新した |
| [ ] | RC-17 | 4071042943 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | コミュニティ一覧の取得失敗が永久スピナー<br>store に loadError と再試行が必要 |
| [ ] | RC-18 | 4068413527 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | イベント一覧の取得失敗が永久スピナー<br>store に loadError と再試行が必要 |
| [x] | RC-19 | 4068413504 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | ダッシュボードの受付中と予約申請中が同一 store<br>別 `storeKey` を付けた |
| [x] | RC-20 | 4068413493 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | 店舗公開・承認の成功後に行が古いまま<br>成功後に `Object.assign` で行を更新した |
| [ ] | RC-21 | 4071042959 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | config 解決を二つのガードで直列に待つ<br>pending 共有かガード統合が必要 |
| [x] | RC-22 | 4068413513 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | OTP 後に redirect が消えて常に `/`<br>login で `setRedirectPath` して OTP 後まで保持する |
| [ ] | RC-23 | 4071042953 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | M | support が `DEFAULT_TIME_ZONE` を直接 import<br>表示計算を common に移す |
| [ ] | RC-24 | 4071042930 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 🐛 実害 | 📋 仕様追加 | M | 外部リンクが PF ホスト固定<br>enterprise 行はテナントホスト解決が必要 |

---

**識別子**: RC-14（GitHub id: 4068413497）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `.github/workflows/deploy_support.yml:10`

**該当コード（レビュー時点の diff）**:

```diff
+    paths:
+      - 'support/**'
+      - 'base/**'
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  common の変更でも support を再デプロイする**

support は `@shokujii/common` のスキーマや日時・URLユーティリティを直接バンドルしていますが、この push トリガーは `support/**` と `base/**` しか監視していません。後続コミットが `common/**` だけを変更した場合、PR 検証は通っても support の Hosting は古い共通コードを含むバンドルのままになるため、`common/**` も paths に追加してください。

Useful? React with 👍 / 👎.

**コメント要約**: `deploy_support` が `common/**` を見ていない。
paths に追加した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: support は common をバンドルする。`deploy_enterprise.yml` は既に `common/**` を見ている。手順 4a で paths に追加した。

---

**識別子**: RC-15（GitHub id: 4071042948）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/components/SupportInvoicePaymentPanel.vue:199`

**該当コード（レビュー時点の diff）**:

```diff
+    const result = await resendCommunityBillInvoiceMail({
+      communityId,
+      eventId,
+    })
+    const recorded = await getEventInvoicePayment(communityId, eventId)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  送信後の再取得失敗をメール送信失敗にしない**

`resendCommunityBillInvoiceMail` が正常終了した時点でメール送信とサーバ側の送信記録は完了していますが、その直後のこの Firestore 読み取りが一時的に失敗すると共通の `catch` に入り、「督促メールの送信に失敗しました」と表示されます。実際には宛先へ届いているため運営担当者が誤認し、再送を試みる原因になるので、送信成功通知を先に確定し、入金情報の再取得失敗は別の更新失敗として扱ってください。

Useful? React with 👍 / 👎.

**コメント要約**: 送信後の再取得失敗を督促失敗と表示する。
Callable 成功を先に確定し再取得は別扱いした。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘どおり。手順 4a で Callable 成功後に送信完了を出し、再取得失敗は `common.update_failed` にした。

---

**識別子**: RC-16（GitHub id: 4068413491）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/pages/communities/index.vue:133`

**該当コード（レビュー時点の diff）**:

```diff
+    await updateCommunityStatus(community.community_id, status)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  更新成功後にコミュニティの表示状態を同期する**

コミュニティ一覧は `getDocs` で取得したオブジェクトを表示しており、`updateCommunityStatus` はそのオブジェクトを変更しません。したがって公開・承認の更新に成功してもスイッチと行の状態が古いままで、承認待ちフィルターからも行が消えず、再度押すと同じ値を送信します。成功時にもローカル値を更新するか一覧を再取得してください。

Useful? React with 👍 / 👎.

**コメント要約**: コミュニティ公開・承認の成功後に行が古いまま。
成功後に `Object.assign` で行を更新した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `updateCommunityStatus` は `updateDoc` のみで一覧オブジェクトを書き換えない。成功後に `Object.assign(community, status)` でスイッチと行表示を同期した。失敗時の reload はそのまま。

---

**識別子**: RC-17（GitHub id: 4071042943）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/pages/communities/index.vue:249`

**該当コード（レビュー時点の diff）**:

```diff
+      <div v-if="communities == null" class="d-flex justify-center py-8">
+        <v-progress-circular indeterminate />
+      </div>
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  コミュニティ一覧の取得失敗をローディングから分離する**

ネットワーク障害、Rules 拒否、インデックス不足などで `useCommunityListStore` の `getCountFromServer` または `getDocs` が失敗すると、同ストアは例外を捕捉せず `communities` を `null` のまま残すため、このスピナーが永久に表示されます。同じストアを使うダッシュボードの承認待ちコミュニティ欄も同様なので、ストアに `loadError` を持たせ、エラー表示と再試行に切り替えてください。

Useful? React with 👍 / 👎.

**コメント要約**: コミュニティ一覧の取得失敗が永久スピナー。
store に loadError と再試行が必要。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: `communityList` の next は query 失敗を catch していない。userList と同様の loadError が必要で store + 複数画面にまたがる。工数 M のため自動修正しない。

---

**識別子**: RC-18（GitHub id: 4068413527）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/pages/events/index.vue:260`

**該当コード（レビュー時点の diff）**:

```diff
+      <div v-if="events == null" class="d-flex justify-center py-8">
+        <v-progress-circular indeterminate />
+      </div>
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  イベント一覧の取得失敗を永久ローディングにしない**

この画面が利用する `useEventListStore` は `getCountFromServer` と `getDocs` の失敗を捕捉せず、失敗時も `eventStores` が `null` のままです。そのためネットワーク障害、Rules 拒否、インデックス不足が起きるとこのスピナーが永久に表示され、エラー表示も再試行手段もありません。ストアに `loadError` を持たせ、support のイベント一覧・請求書一覧・ダッシュボードから再試行できるようにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: イベント一覧の取得失敗が永久スピナー。
store に loadError と再試行が必要。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: converter 失敗だけ catch しており query 失敗は残る。invoices / dashboard も同じ store。工数 M のため自動修正しない。

---

**識別子**: RC-19（GitHub id: 4068413504）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/pages/index.vue:108`

**該当コード（レビュー時点の diff）**:

```diff
+const acceptingEventStore = useEventListStore(
+  [where('event_status.value', '==', 'accepting_order'), orderBy('event_start_datetime', 'desc')],
+  QUEUE_SIZE,
+  { autoContinue: false },
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ダッシュボードのイベントストアに別々のキーを渡す**

`useEventListStore` の既定 ID は制約の `JSON.stringify` に依存しますが、この変更内の説明どおり制約値が ID に残らないため、同じページサイズと `where`・`orderBy` の並びを持つ受付中ストアは先に作成された予約申請中ストアと衝突します。Pinia が同じインスタンスを返す結果、ダッシュボードの「注文受付中」に予約申請中イベントが表示されるので、両方に異なる `storeKey` を指定してください。

Useful? React with 👍 / 👎.

**コメント要約**: ダッシュボードの受付中と予約申請中が同一 store。
別 `storeKey` を付けた。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `JSON.stringify(QueryConstraint)` は type しか残らず ID が衝突する。本 PR で追加した `storeKey` の用途そのもの。手順 4a で別キーを付けた。

---

**識別子**: RC-20（GitHub id: 4068413493）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/pages/shops/index.vue:117`

**該当コード（レビュー時点の diff）**:

```diff
+    await updateShopStatus(shop.partner_id, shop.shop_id, status)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  更新成功後に店舗の表示状態を同期する**

店舗一覧も `getDocs` 由来の `shop` を表示しているため、`updateShopStatus` の成功後に `is_open` / `is_approved` は画面へ反映されません。成功通知が出てもスイッチが元の状態に戻り、承認待ちの行も残り続けるので、成功時にローカル値を更新するか `shopListStore` を再読み込みしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 店舗公開・承認の成功後に行が古いまま。
成功後に `Object.assign` で行を更新した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-16 と同型。成功後に `Object.assign(shop, status)` でスイッチと行表示を同期した。失敗時の reload はそのまま。

---

**識別子**: RC-21（GitHub id: 4071042959）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/router/index.ts:34`

**該当コード（レビュー時点の diff）**:

```diff
+    const configStore = useConfigStore()
+    const config = await configStore.getResolvedConfig()
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  設定解決を二つのガードで直列に待たない**

Firestore がオフラインなどで config の snapshot を返さない場合、`getResolvedConfig()` は 10 秒後にタイムアウトしますが、通常ルートではこのガードが待ち終えた後に二つ目のガードでも同じメソッドを新規に呼ぶため、認証済みユーザーの遷移が約20秒停止してからサインアウトされます。設定解決の pending Promise を共有するか二つのガードを統合し、一回のナビゲーションでタイムアウトを一度だけ待つようにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: config 解決を二つのガードで直列に待つ。
pending 共有かガード統合が必要。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `getResolvedConfig` は呼び出しごとに新しい 10 秒 timeout を作る。チェックリストは pending 共有を要求する。方針が二択のため自動修正しない。通常時は config 済みですぐ返る。

---

**識別子**: RC-22（GitHub id: 4068413513）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/router/index.ts:65`

**該当コード（レビュー時点の diff）**:

```diff
+      return { path: '/login', query: { redirect: to.fullPath } }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  OTP ログイン後までリダイレクト先を保持する**

未認証で `/invoices?status=unpaid` などを開くとここで `redirect` をログイン URL に付けますが、ログイン画面から `/pass-code` へ進む際にそのクエリは引き継がれず、`setRedirectPath` も呼ばれていません。そのため OTP 成功後の `getRedirectPath()` は空で常に `/` へ戻るので、ガードで遷移先を保存するか pass-code まで明示的に引き継いでください。

Useful? React with 👍 / 👎.

**コメント要約**: OTP 後に redirect が消えて常に `/`。
login で `setRedirectPath` して OTP 後まで保持する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `login.vue` は `getPassCode(email)` だけを push し、`pass-code.vue` は `getRedirectPath()` を読む。メール送信前に相対パスの `redirect` を `setRedirectPath` し、OTP 成功後の既存 `getRedirectPath()` で戻すようにした。

---

**識別子**: RC-23（GitHub id: 4071042953）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/utils/format.ts:3`

**該当コード（レビュー時点の diff）**:

```diff
+import {
+  DEFAULT_TIME_ZONE,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  タイムゾーン依存の表示計算を common に移す**

この support 層ヘルパーは `DEFAULT_TIME_ZONE` を直接取り込み、`DateTime.fromMillis` による同日判定と相対時刻計算をアプリ側で組み立てています。日時表示の方針が common 側で変更されてもこの画面だけ Asia/Tokyo 固定のまま残るため、`formatScheduleRange` / `formatRelativeJa` 相当を `common/src/utils/datetime.ts` に追加して呼び出してください。

AGENTS.md reference: [AGENTS.md:L105-L113](https://github.com/nijuniinc/bokudeli-event-new/blob/a31d600be6d48ef02e8e8bb1161ab22cc50a033f/AGENTS.md#L105-L113)

Useful? React with 👍 / 👎.

**コメント要約**: support が `DEFAULT_TIME_ZONE` を直接 import。
表示計算を common に移す。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: AGENTS.md はアプリ層からの `DEFAULT_TIME_ZONE` 直接 import を禁じる。common への移動はリファクタで工数 M。自動修正しない。

---

**識別子**: RC-24（GitHub id: 4071042930）

**レビュワー**: Codex（chatgpt-codex-connector）

**指摘箇所**: `support/src/utils/urls.ts:15`

**該当コード（レビュー時点の diff）**:

```diff
+const originHost = (): string => normalizeOriginHost(import.meta.env.VITE_ORIGIN_HOST)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  エンタープライズ行にはテナント側ホストを使う**

support はエンタープライズ配下のコミュニティやイベントも横断表示しますが、ここで全行のリンク先を PF 用の `VITE_ORIGIN_HOST` に固定しています。PF 側の `/c` 画面は `enterprise_id == null` でデータを検索するため（`user/src/pages/c/[communityAccount]/index.vue:41-43`）、エンタープライズ行の外部リンクは対象を表示できず、同じ `community_account` の PF データがあれば別コミュニティへ誤誘導します。行の `enterprise_id` から `custom_domain` / サブドメインを解決して URL を生成してください。

Useful? React with 👍 / 👎.

**コメント要約**: 外部リンクが PF ホスト固定。
enterprise 行はテナントホスト解決が必要。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📤 スコープ外

**ラベル**: 🐛 実害

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 指摘は妥当だが、#2357 / フェーズ1 の仕様にテナントホスト解決は無い。support 側に `enterprise_id` も渡していない。別 Issue 化が自然。本評価では Issue 未作成のため未着手。

---
