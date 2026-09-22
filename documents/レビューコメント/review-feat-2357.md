# ブランチ feat/2357 レビュー記録

請求書払いの入金ステータスと督促再送信。仕様は計画「請求書払い入金管理と督促再送信」および [documents/09_運営向け機能/03_managerパッケージの再実装.md](../09_運営向け機能/03_managerパッケージの再実装.md) フェーズ3。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `resendCommunityBillInvoiceMail` に timeout が無い<br>PDF 未作成時は `eventBillInvoice` と同じ 120 秒に揃えた |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 💾 データ | 🔧 微修正 | S | 入金ドキュメント取得失敗を未確認として編集できてしまう<br>`loadError` で保存を止め、再試行 UI を出した |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 📏 規約 | 🔧 微修正 | S | 入金列の取得失敗でキー未設定のままスピナーが残る<br>catch で `null` を記録し `reportClientError` する |

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

