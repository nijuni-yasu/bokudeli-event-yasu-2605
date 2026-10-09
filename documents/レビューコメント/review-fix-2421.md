# ブランチ fix/2421 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6082029241 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の会話コメントは必須修正も修正提案も無いと述べている<br>同じレビューのインライン [must] 2件とは結論が食い違う<br>このコメント自体はコード変更を求めていない<br>実体は RC-3 と RC-4 で評価する |
| [x] | RC-2 | 5470821921 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は変更推奨と findings 2件の目次<br>リンク先は `#discussion_r4230721425` と `#discussion_r4230721529`<br>overview 自体にリンク先以外の修正要求はない<br>実体は RC-3 と RC-4 で評価する |
| [x] | RC-3 | 4230721425 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 世代が変わったあとの古い取得結果を弾くテストが無い<br>`event.test.ts` の再試行は同じ参加者IDの失敗だけを見ている<br>参加者の入れ替えと unsubscribe 後に古い名前が残っても検知できない<br>両経路で、完了した旧取得が `previewMembers` を上書きしないことを検証する |
| [ ] | RC-4 | 4230721529 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 参加者が1人変わるたびに、取得済みの人を含む全員を読み直している<br>`event.ts` の `syncPreviewUsers` が参加者ID列の全体を再取得する<br>画面を開いたまま参加が増えると、読み取りが人数に比例して重なる<br>取得済み Map の再利用は表示欠落の修正ではなく、この PR では未着手 |
| [x] | RC-5 | 4230718151 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 31人超の取得をチャンク順に待ってからまとめて表示している<br>`user.ts` の `fetchUsersByIds` が `getDocs` を直列に await している<br>数百人だと往復回数ぶん名前の表示が遅れる、という指摘<br>メニュー購読と競合させないため、チャンクは直列のままにする |

---

## 評価セッション（2026-10-09 22:45・review-comments-evaluate）

- **評価日時**: 2026-10-09 22:45 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2421`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2424
- **since**: 2026-10-09T13:34:06Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（6081979323 レビュー依頼の定型文、6081980296 Codex の完了ステータスと接続案内、5470818259 Codex review 本文が automated suggestions と接続案内のみ）
- **重複除外**: なし
- **手順 4a 自動修正**: RC-3（🚨 0件 / 🟡 1件）。RC-4 は工数 M・種別 📐 のため自動修正しない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6082029241 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の会話コメントは必須修正も修正提案も無いと述べている<br>同じレビューのインライン [must] 2件とは結論が食い違う<br>このコメント自体はコード変更を求めていない<br>実体は RC-3 と RC-4 で評価する |
| [x] | RC-2 | 5470821921 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は変更推奨と findings 2件の目次<br>リンク先は `#discussion_r4230721425` と `#discussion_r4230721529`<br>overview 自体にリンク先以外の修正要求はない<br>実体は RC-3 と RC-4 で評価する |
| [x] | RC-3 | 4230721425 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 世代が変わったあとの古い取得結果を弾くテストが無い<br>`event.test.ts` の再試行は同じ参加者IDの失敗だけを見ている<br>参加者の入れ替えと unsubscribe 後に古い名前が残っても検知できない<br>両経路で、完了した旧取得が `previewMembers` を上書きしないことを検証する |
| [ ] | RC-4 | 4230721529 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 参加者が1人変わるたびに、取得済みの人を含む全員を読み直している<br>`event.ts` の `syncPreviewUsers` が参加者ID列の全体を再取得する<br>画面を開いたまま参加が増えると、読み取りが人数に比例して重なる<br>取得済み Map の再利用は表示欠落の修正ではなく、この PR では未着手 |
| [x] | RC-5 | 4230718151 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 31人超の取得をチャンク順に待ってからまとめて表示している<br>`user.ts` の `fetchUsersByIds` が `getDocs` を直列に await している<br>数百人だと往復回数ぶん名前の表示が遅れる、という指摘<br>メニュー購読と競合させないため、チャンクは直列のままにする |

---

**識別子**: RC-1（GitHub id: 6082029241）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

差分をチェックリストに沿って確認しました。必須修正・修正提案とも指摘はありません。参加者の一括取得、人数制限のない表示、および取得結果の世代管理を確認しています。

**コメント要約**: Copilot の会話コメントは必須修正も修正提案も無いと述べている。同じレビューのインライン [must] 2件とは結論が食い違う。このコメント自体はコード変更を求めていない。実体は RC-3 と RC-4 で評価する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 引用を除いた本文は「指摘はない」という総括で、修正手順を求めていない。同じ時刻帯のインラインが別の修正を求めているため、このコメントを実装対象にはしない。

---

**識別子**: RC-2（GitHub id: 5470821921）

**レビュワー**: Copilot

**指摘箇所**: PR レビュー本文

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

参加者変更時の全件再読込と、古い非同期結果を防ぐ競合テストの不足を解消する必要があります。

<details open>
<summary><strong>2 open findings</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [参加者変更・解除後に古い取得結果を適用しない競合テストを追加](#discussion_r4230721425) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [取得済み参加者を再利用し追加・退出IDのみ読み込む](#discussion_r4230721529) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

イベント詳細で参加者全員を表示し、プロフィールを30件単位で一括取得する変更です。

**Changes:**
- 12人の表示上限と注記を削除
- `users` の個別購読を一括取得へ変更
- 分割取得・再試行のテストを追加

| File | Description |
| ---- | ----------- |
| `base/​src/​stores/​event.ts` | 全参加者の取得・再試行を実装 |
| `base/​src/​stores/​user.ts` | ID指定の一括取得を追加 |
| `base/​src/​components/​EventDetailsCard.vue` | 表示上限と注記を削除 |
| `base/​src/​locales/​messages/​ja.ts` | 未使用文言を削除 |
| `base/​src/​stores/​event.test.ts` | 全員表示と再試行を検証 |
| `base/​src/​stores/​userByIds.test.ts` | 分割取得や欠測を検証 |
</details>

🧠 **Review effort:** Balanced

---

💡 Configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

**コメント要約**: Copilot overview は変更推奨と findings 2件の目次。リンク先は `#discussion_r4230721425` と `#discussion_r4230721529`。overview 自体にリンク先以外の修正要求はない。実体は RC-3 と RC-4 で評価する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 本文の「解消する必要があります」は、リンク先2件の再掲である。両 id はインライン取得結果にあり、追加の不具合は書かれていない。

---

**識別子**: RC-3（GitHub id: 4230721425）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/event.test.ts:279`

**該当コード（レビュー時点の diff）**:

```diff
@@ -381,42 +273,50 @@ describe('useEventStore lazy members', () => {
     expect(getDocsMock).toHaveBeenCalled()
   })
 
-  it('preview の user 購読が一時失敗したら張り直す', async () => {
+  it('preview の user 取得が一時失敗したら取り直す', async () => {
     vi.useFakeTimers()
-    const userListenCounts = new Map<string, number>()
-    onSnapshotMock.mockImplementation(
-      (ref: { path?: string }, onNext: (snapshot: unknown) => void, onError?: (err: unknown) => void) => {
-        const path = ref?.path ?? ''
-        if (path.startsWith('users/')) {
-          const count = (userListenCounts.get(path) ?? 0) + 1
-          userListenCounts.set(path, count)
-          if (count === 1) {
-            onError?.(new FirebaseError('unavailable', 'down'))
-          }
-          return vi.fn()
+    fetchUsersByIdsMock
+      .mockRejectedValueOnce(new FirebaseError('unavailable', 'down'))
```

**レビュワーのコメント（原文）**:

[must] このテストは同じ参加者IDでの再試行しか検証しておらず、今回追加した世代ガードの主要な競合経路が未保護です。最初の取得を保留したまま参加者を A→B に更新して旧取得を後から完了するケースと、`unsubscribe()` 後に取得を完了するケースを追加し、古い結果が `previewMembers` を上書きしないことを確認してください。

**コメント要約**: 世代が変わったあとの古い取得結果を弾くテストが無い。`event.test.ts` の再試行は同じ参加者IDの失敗だけを見ている。参加者の入れ替えと unsubscribe 後に古い名前が残っても検知できない。両経路で、完了した旧取得が `previewMembers` を上書きしないことを検証する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 世代番号で古い結果を捨てる処理は `event.ts` の `syncPreviewUsers` と `stopPreviewUserFetch` にある。不足していたのはテストで、本番の表示欠落ではない。参加者を A から B に変えてから旧取得を完了するケースと、`unsubscribe()` 後に取得を完了するケースを `event.test.ts` に追加した。ラベルはデータ欠損や画面上の誤表示そのものではないため —。

---

**識別子**: RC-4（GitHub id: 4230721529）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/event.ts:391`

**該当コード（レビュー時点の diff）**:

```diff
@@ -372,76 +348,83 @@ export const useEventStore = (target: string | BokudeliEvent, options: EventStor
       return memberIds.flatMap((memberId) => memberWithOrders(memberId, getMemberUserStore(memberId).user))
     }
 
-    /** プレビュー専用。useUserStore は共有なので外すと他画面の購読も切れる */
-    const previewUserListeners = new Map<string, FirestoreListenRetry>()
+    /**
+     * イベント詳細の参加者プロフィール。
+     * users は id の一括取得にし、人数分の onSnapshot は張らない。
+     */
     const previewUsers = ref(new Map<string, User | null>())
-
-    const replacePreviewUsers = (mutate: (draft: Map<string, User | null>) => void): void => {
-      const next = new Map(previewUsers.value)
-      mutate(next)
-      previewUsers.value = next
+    let previewUsersGeneration = 0
+    let previewUsersSettledKey: string | null = null
+    let previewUsersInFlightKey: string | null = null
+    let previewUsersPendingKey: string | null = null
+    let previewUsersRetryTimer: ReturnType<typeof setTimeout> | null = null
+    let previewUsersFailureCount = 0
+    let reportedPreviewUsersError = false
+
+    const clearPreviewUsersRetry = (): void => {
+      if (previewUsersRetryTimer != null) {
+        clearTimeout(previewUsersRetryTimer)
+        previewUsersRetryTimer = null
+      }
     }
 
-    const stopPreviewUserListener = (memberId: string): void => {
-      previewUserListeners.get(memberId)?.stop()
-      previewUserListeners.delete(memberId)
-      replacePreviewUsers((draft) => {
-        draft.delete(memberId)
-      })
+    const stopPreviewUserFetch = (): void => {
+      previewUsersGeneration += 1
+      previewUsersSettledKey = null
+      previewUsersInFlightKey = null
+      previewUsersPendingKey = null
+      previewUsersFailureCount = 0
+      reportedPreviewUsersError = false
+      clearPreviewUsersRetry()
+      previewUsers.value = new Map()
     }
 
-    const syncPreviewUserListeners = (memberIds: readonly string[]): void => {
-      const keep = new Set(memberIds)
-      for (const memberId of [...previewUserListeners.keys()]) {
-        if (!keep.has(memberId)) {
-          stopPreviewUserListener(memberId)
-        }
-      }
-      for (const memberId of memberIds) {
-        if (previewUserListeners.has(memberId)) {
-          continue
-        }
-        const holder: { current: FirestoreListenRetry | null } = { current: null }
-        let reportedPreviewUserError = false
-        const listen = createFirestoreListenRetry(
-          ({ onError }) =>
-            onSnapshot(
-              getUserRef(memberId),
-              (snapshot) => {
-                holder.current?.markHealthy()
-                reportedPreviewUserError = false
-                try {
-                  replacePreviewUsers((draft) => {
-                    draft.set(memberId, snapshot.data() ?? new User(memberId, {}))
-                  })
-                } catch (err) {
-                  console.error(err)
-                  reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
-                }
-              },
-              onError,
-            ),
-          {
-            onError: (err) => {
-              console.error('preview user snapshot error', err)
-              if (reportedPreviewUserError) {
-                return
-              }
-              reportedPreviewUserError = true
-              reportClientError(err, { documentPath: `users/${memberId}`, severity: 'warn' })
-            },
-          },
-        )
-        holder.current = listen
-        previewUserListeners.set(memberId, listen)
-        listen.ensure()
-      }
-    }
-
-    const stopPreviewUserListeners = (): void => {
-      for (const memberId of [...previewUserListeners.keys()]) {
-        stopPreviewUserListener(memberId)
+    const syncPreviewUsers = (memberIds: readonly string[]): void => {
+      const key = previewMemberKey(memberIds)
+      if (key === previewUsersSettledKey || key === previewUsersInFlightKey || key === previewUsersPendingKey) {
+        return
       }
+      clearPreviewUsersRetry()
+      previewUsersPendingKey = null
+      const generation = ++previewUsersGeneration
+      previewUsersInFlightKey = key
+      void fetchUsersByIds(memberIds)
```

**レビュワーのコメント（原文）**:

[must] 参加者配列が1件変わるだけでも、既に取得済みの参加者を含む全IDを再読込します。詳細画面を開いている利用者ごとに N 件の課金 read が発生し、参加者が順次増えるイベントでは読み取り量が二次的に増えるため、取得済みの Map を再利用して追加IDのみ取得・退出IDのみ削除してください。

**コメント要約**: 参加者が1人変わるたびに、取得済みの人を含む全員を読み直している。`event.ts` の `syncPreviewUsers` が参加者ID列の全体を再取得する。画面を開いたまま参加が増えると、読み取りが人数に比例して重なる。取得済み Map の再利用は表示欠落の修正ではなく、この PR では未着手。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 初期表示で全員を読むのは #2421 の要件で、人数分の onSnapshot を避けるために一括 `getDocs` にしている。参加者が増減したときの再取得は、既に表示している人の名前も取り直す。差分だけ読むと読み取りは減るが、世代・再試行・退出の整合を取り直す必要があり、表示が欠ける不具合ではない。工数 M かつ種別 📐 のため自動修正しない。ラベルはフィールド消失や Rules ではなく読み取り量のため —。

---

**識別子**: RC-5（GitHub id: 4230718151）

**レビュワー**: Codex

**指摘箇所**: `base/src/stores/user.ts:74`

**該当コード（レビュー時点の diff）**:

```diff
@@ -50,6 +56,35 @@ export const getUserById = async (userId: string): Promise<User | undefined> =>
   return snapshot.exists() ? snapshot.data() : undefined
 }
 
+/** Firestore の `in` クエリ上限。これより多い id は分割して読む。 */
+export const USERS_BY_IDS_IN_LIMIT = 30
+
+/**
+ * users を id 指定でまとめて読む。
+ * イベント詳細で参加者全員を出すとき、人数分の onSnapshot を張らないために使う。
+ * 文書が無い id は null。
+ */
+export const fetchUsersByIds = async (userIds: readonly string[]): Promise<Map<string, User | null>> => {
+  const ids = [...new Set(userIds.filter((userId) => userId !== ''))]
+  const users = new Map<string, User | null>(ids.map((userId) => [userId, null]))
+  for (let offset = 0; offset < ids.length; offset += USERS_BY_IDS_IN_LIMIT) {
+    const chunk = ids.slice(offset, offset + USERS_BY_IDS_IN_LIMIT)
+    const snapshot = await getDocs(
+      query(collection(db, 'users'), where(documentId(), 'in', chunk)).withConverter(userConverter),
+    )
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  分割したユーザー取得を並列実行する**

参加者が31人以上のイベントでは、各チャンクの `getDocs` が前のチャンクの完了後にしか開始されず、さらに全チャンクが終わるまで `previewUsers` に結果が反映されません。`event_max_people` にはハード上限がないため、数百人規模ではネットワーク往復回数に比例して全参加者のプロフィール表示が遅延します。チャンクごとのクエリを `Promise.all`、または並列度を制限した実行で取得してから結果を統合してください。

AGENTS.md reference: [AGENTS.md:L43-L45](https://github.com/nijuniinc/bokudeli-event-new/blob/bee091d38a080dbb150ea958829214c6ad4a66fb/AGENTS.md#L43-L45)

Useful? React with 👍 / 👎.

**コメント要約**: 31人超の取得をチャンク順に待ってからまとめて表示している。`user.ts` の `fetchUsersByIds` が `getDocs` を直列に await している。数百人だと往復回数ぶん名前の表示が遅れる、という指摘。メニュー購読と競合させないため、チャンクは直列のままにする。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: チャンクを `Promise.all` にすると、#2391 でメニューとバナーの購読が枯渇したのと同じように、同時の Firestore 読み取りが増える。直列は参加者全員を出したうえで購読を張らないための選択である。結果の反映が全チャンク後になる点は、指摘の並列化でも `Promise.all` の完了を待つ限り同じである。

---
