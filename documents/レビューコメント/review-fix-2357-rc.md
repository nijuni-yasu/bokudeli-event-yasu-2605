# ブランチ fix/2357-rc レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | 4101141982 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 入金更新が event_id だけで選択中行に書き戻る<br>community_id も emit し、更新元の複合キーへ直接書く |
| [x] | RC-2 | 4101144176 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | フィルター切替前の注文件数取得が後から上書きする<br>世代番号が変わった結果は捨てる |

---

## 評価セッション（2026-09-25 13:41・review-comments-evaluate）

- **評価日時**: 2026-09-25 13:41 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2357-rc`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2363
- **partial**: false
- **REVIEW_REQUEST_SINCE**: `2026-09-25T04:34:59Z`
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（5826807730 レビュー依頼定型文、5826807858 Codex 状態サマリ）
- **重複除外**: 5826823893（RC-1 と同一）、4101144171（RC-1 と同一）、review 5313440025（overview・インラインの要約）
- **新規 RC**: RC-1〜RC-2
- **手順 4a 自動修正**: RC-1（🚨 1件）、RC-2（🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | 4101141982 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 入金更新が event_id だけで選択中行に書き戻る<br>community_id も emit し、更新元の複合キーへ直接書く |
| [x] | RC-2 | 4101144176 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | フィルター切替前の注文件数取得が後から上書きする<br>世代番号が変わった結果は捨てる |

---

**識別子**: RC-1（GitHub id: 4101141982）

**レビュワー**: Copilot

**指摘箇所**: `support/src/pages/invoices/index.vue:177`

**該当コード（レビュー時点の diff）**:

```diff
@@ -152,27 +155,33 @@ watch(
     if (list == null) {
       return
     }
-    void loadInvoicePayments(list.filter((event) => !invoicePayments.value.has(event.event_id)))
+    void loadInvoicePayments(list.filter((event) => !invoicePayments.value.has(invoicePaymentKey(event))))
   },
   { immediate: true },
 )

 const retryInvoicePaymentLoad = (event: BokudeliEvent): void => {
+  const key = invoicePaymentKey(event)
   const next = new Map(invoicePayments.value)
-  next.delete(event.event_id)
+  next.delete(key)
   invoicePayments.value = next
   const nextErrors = new Set(invoicePaymentLoadErrors.value)
-  nextErrors.delete(event.event_id)
+  nextErrors.delete(key)
   invoicePaymentLoadErrors.value = nextErrors
   void loadInvoicePayments([event])
 }

 const onDrawerInvoicePaymentUpdated = (payment: EventInvoicePayment, eventId: string): void => {
+  const selectedEvent = selected.value
+  if (selectedEvent == null || selectedEvent.event_id !== eventId) {
+    return
```

**レビュワーのコメント（原文）**:

[must] ここでは `event_id` だけを照合しているため、旧イベントのパネルから遅れて `updated` が届いたとき、同じ `event_id` を持つ別コミュニティの選択イベントへ入金状態を書き込めます。子側は非同期処理の完了後にも `updated` を emit するため、`community_id` も payload/引数に含めて両方を検証してから複合キーを作ってください。

**コメント要約**: 入金更新が event_id だけで選択中行に書き戻る。
community_id も emit し、更新元の複合キーへ直接書く。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 複合キー化の抜けで、遅延した updated が別コミュニティの行を上書きしうる。方針は一意。手順 4a で、パネルから community_id を渡し、親は選択中イベントを見ずにその複合キーを更新するようにした。

---

**識別子**: RC-2（GitHub id: 4101144176）

**レビュワー**: Codex

**指摘箇所**: `support/src/pages/events/index.vue:135`

**該当コード（レビュー時点の diff）**:

```diff
@@ -101,37 +104,65 @@ const showingCount = computed(() => {
   return filteredEvents.value.length
 })

+const loadOrderedCounts = async (targets: BokudeliEvent[]): Promise<void> => {
+  if (targets.length === 0) {
+    return
+  }
+  const results = await Promise.all(
+    targets.map(async (event) => {
+      try {
+        return { eventId: event.event_id, count: await countOrderedByEventId(event.event_id), error: false }
+      } catch (error) {
+        console.warn(error)
+        reportClientError(error, {
+          componentInfo: 'events.index.loadOrderedCount',
+          documentPath: `communities/${event.community_id}/events/${event.event_id}`,
+          severity: 'warn',
+        })
+        return { eventId: event.event_id, count: null, error: true }
+      }
+    }),
+  )
+  const next = new Map(orderedCounts.value)
+  const nextErrors = new Set(orderedCountLoadErrors.value)
+  for (const result of results) {
+    if (result.error) {
+      nextErrors.add(result.eventId)
+      next.delete(result.eventId)
+      continue
+    }
+    nextErrors.delete(result.eventId)
+    next.set(result.eventId, result.count ?? 0)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  フィルター切替前の件数取得結果を破棄する**

注文件数の取得中にステータスフィルターを解除または変更すると、行66で状態を初期化して新しい一覧の取得を開始しても、切替前のリクエストはキャンセルされません。たとえば「受付中」から全件表示へ切り替え、新しいリクエストが成功した後に古いリクエストが失敗すると、ここで成功済みの件数を削除して取得失敗へ戻すため、現在の一覧に誤ったエラーが表示されます。フィルターごとの世代番号や store key を保持し、開始時と異なる世代の結果は反映しないようにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: フィルター切替前の注文件数取得が後から上書きする。
世代番号が変わった結果は捨てる。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘どおり、フィルター切替で Map を空にしても飛行中の Promise が後から失敗を書く。世代番号の破棄で方針は一意、工数 S。手順 4a で status 変更時に世代を進め、開始時と違う世代の結果は反映しないようにした。

---
