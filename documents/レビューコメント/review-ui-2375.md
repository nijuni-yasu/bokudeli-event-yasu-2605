# ブランチ ui/2375 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 上限表示の置き換えで未使用になった i18n キーを削除 |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 保存中も候補・選択中タグのボタンを押せた<br>仕様の保存中ロックに合わせ、`:disabled` に `loading` を含めた |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | ユーザー読込前の空配列を保存すると既存タグを消す<br>読込完了までコピーと保存を止め、完了後に保存済みタグを編集用配列へコピーする |
| [x] | RC-4 | 5926272187 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 初期候補が13件でテストと件数がずれる、という指摘<br>STARTER_TAGS は12件で、ページサイズと仕様と一致する |
| [x] | RC-5 | 5375879789 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の Pull request overview<br>具体指摘はインライン RC-6 と同一のため、overview 自体は追加対応しない |
| [x] | RC-6 | 4152623414 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 保存直後の再表示が古い購読値で上書きし得る<br>成功した配列を購読が一致するまで初期値にする |
| [x] | RC-7 | 4153146199 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 検索中にカテゴリ閲覧すると見出しが「検索結果」のまま<br>`isBrowsingGenres` を見出し判定で検索より優先 |
| [x] | RC-8 | 4153146204 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 購読が先に反映済みでも保存後に待機配列を残し得る<br>保存時点で `user_tags` と一致なら待機値を設定しない |
| [x] | RC-9 | 4153146195 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 手編集した `tags.ts` が再生成で消える<br>`build-tags-constants.mjs` に3タグを追加して再生成 |

## 評価セッション（2026-10-01 13:33・shokujii-code-review）

- **評価日時**: 2026-10-01 13:33 JST
- **評価者**: Codex（shokujii-code-review）
- **ブランチ名**: ui/2375
- **PR**: 未作成
- **Issue**: #2375
- **対象**: 本タスクの未コミット差分（新規ファイルを含む）
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **自動修正**: RC-1（🟡 1件）。修正後の差分を再レビューし、追加指摘なし。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 上限表示の置き換えで未使用になった i18n キーを削除 |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Codex（shokujii-code-review）

**指摘箇所**: `base/src/locales/messages/ja.ts:802`（修正前）

**該当コード（レビュー時点の diff）**:

```diff
     limit_reached: 'タグは最大10個までです',
+    limit_help: '10個選択しました。入れ替えるときは、選択中のタグを外せます。',
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 上限案内を `limit_help` に置き換えたため、`user_tags.limit_reached` に参照が残っていません。未使用の i18n キーを削除してください。

**コメント要約**: 上限表示の置き換えで未使用になった i18n キーを削除。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: リポジトリ全体の参照検索で未使用を確認。コードレビュー基準の「未参照になった ja.ts の i18n キーを削除する」に従う。表示・保存仕様への影響がない一意の削除として修正した。

## 評価セッション（2026-10-01 15:37・shokujii-code-review）

- **評価日時**: 2026-10-01 15:37 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: ui/2375
- **PR**: 未作成
- **Issue**: #2375
- **対象**: 本タスクの未コミット差分（新規ファイルを含む）
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **自動修正**: RC-2（🟡 1件）、RC-3（🚨 1件）。修正後の差分を再レビューし、追加指摘なし。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 保存中も候補・選択中タグのボタンを押せた<br>仕様の保存中ロックに合わせ、`:disabled` に `loading` を含めた |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | ユーザー読込前の空配列を保存すると既存タグを消す<br>読込完了までコピーと保存を止め、完了後に保存済みタグを編集用配列へコピーする |

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/TagInput.vue:166`

**該当コード（レビュー時点の diff）**:

```diff
               :aria-disabled="loading || (!isSelected(tag) && isAtLimit)"
-              :disabled="!isSelected(tag) && isAtLimit"
+              :disabled="loading || (!isSelected(tag) && isAtLimit)"
               @click="toggleTag(tag)"
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 保存中は追加・解除を止める仕様なのに、候補ボタンと選択中タグの解除ボタンは `aria-disabled` だけで、`:disabled` に `loading` がありません。入力欄と「追加」ボタンと同じく、保存中は押せないようにしてください。

**コメント要約**: 保存中も候補・選択中タグのボタンを押せた。
仕様の保存中ロックに合わせ、`:disabled` に `loading` を含めた。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: クリック処理は `loading` で無操作に戻していたが、ボタン自体は有効なままだった。ジャンル別・検索結果・選択中タグの各ボタンで `:disabled` に `loading` を足し、保存中は追加も解除もできないようにした。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/TagSettingsDialog.vue:21`

**該当コード（レビュー時点の diff）**:

```diff
 watch(
-  model,
-  (isOpen) => {
-    if (isOpen) {
-      tags.value = [...(currentUserStore.user?.user_tags ?? [])]
-      errorMessage.value = ''
-    }
-  },
+  [model, () => currentUserStore.user],
+  ([isOpen], previous) => {
+    const openedNow = isOpen && previous?.[0] !== true
+    const user = currentUserStore.user
+    if (isOpen && (openedNow || user == null)) {
+      tagsReady.value = false
+      tags.value = []
+      if (openedNow) {
+        errorMessage.value = ''
+      }
+    }
+    if (isOpen && !tagsReady.value && user != null) {
+      tags.value = [...(user.user_tags ?? [])]
+      tagsReady.value = true
+    }
+  },
   { immediate: true },
 )
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: ダイアログを開いた瞬間に `currentUserStore.user` がまだ null だと、保存済みタグを空配列としてコピーします。その状態で保存すると `updateUserTags` が既存タグを空で上書きします。ユーザードキュメントが届いてからコピーし、届くまでは保存できないようにしてください。

**コメント要約**: ユーザー読込前の空配列を保存すると既存タグを消す。
読込完了までコピーと保存を止め、完了後に保存済みタグを編集用配列へコピーする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `useUserStore` は初回スナップショットまで `user` が null です。旧実装はストアの配列を直接表示し、1件ずつの追加だったため空の上書きは起きません。一括保存に変えたことで、読込前の `[]` を保存すると既存タグが消えます。開いたあと `user != null` になってから一度だけコピーし、それまでは入力欄を出さず保存ボタンを無効にしました。編集開始後のスナップショットでは下書きを上書きしません。

---

## 評価セッション（2026-10-01 15:56・review-comments-evaluate）

- **評価日時**: 2026-10-01 15:56 JST
- **ブランチ名**: ui/2375
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2383
- **REVIEW_REQUEST_SINCE**: 2026-10-01T06:49:43Z
- **partial**: true（sentinel。Codex 未レビューまたは limits/connect のみの可能性。実コメントは問題なしサマリまで到達）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（レビュー依頼定型文 5926246102、Codex 接続案内 5926247003、Codex 問題なしのみ 5926280631）
- **手順 4a 自動修正**: RC-6（🚨 1件）。RC-4・RC-5 は 👌 のため対象外。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | RC-4 | 5926272187 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 初期候補が13件でテストと件数がずれる、という指摘<br>STARTER_TAGS は12件で、ページサイズと仕様と一致する |
| [x] | RC-5 | 5375879789 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の Pull request overview<br>具体指摘はインライン RC-6 と同一のため、overview 自体は追加対応しない |
| [x] | RC-6 | 4152623414 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 保存直後の再表示が古い購読値で上書きし得る<br>成功した配列を購読が一致するまで初期値にする |

---

**識別子**: RC-4（GitHub id: 5926272187）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

```
🚨 **必須修正** [🔧微修正/S] `base/src/utils/profileTagOptions.ts:18` の `STARTER_TAGS` は13件ありますが、`PROFILE_TAG_PAGE_SIZE.desktop` は12件で、追加されたテストも `candidates` が12件になることを期待しています（現状 `getProfileTagCandidates('')` は13件を返すため `profileTagOptions.test.ts` が失敗します）。初期候補を12件にするなら候補を1件削除し、13件を意図するならページサイズ・テスト・表示仕様を同じ件数に揃えてください。
```

**コメント要約**: 初期候補が13件でテストと件数がずれる、という指摘。
STARTER_TAGS は12件で、ページサイズと仕様と一致する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `STARTER_TAGS` はコーヒーからスタートアップまで12件です。`PROFILE_TAG_PAGE_SIZE.desktop` は12、仕様書の初期候補も同じ12件で、テストは `toHaveLength(PROFILE_TAG_PAGE_SIZE.desktop)` を期待しています。空検索は `STARTER_TAGS` をそのまま返すため13件にはなりません。件数の数え違いです。

---

**識別子**: RC-5（GitHub id: 5375879789）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル（Pull request overview）

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

```
<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

保存直後の再表示で古い購読値を下書きに取り込み、直前の更新を戻す可能性があります。

**Review effort:** Balanced  
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [購読反映前の再初期化で更新済みタグが古い配列に戻る](#discussion_r4152623414) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

プロフィールタグ設定を、候補選択後に一括保存するUIへ刷新するPRです。

**Changes:**
- 検索・自由入力・カテゴリ候補を統合
- 編集用配列を導入し、保存時に一括更新
- 候補生成テストと仕様書を更新

| File | Description |
| ---- | ----------- |
| `base/​src/​components/​TagInput.vue` | タグ検索・選択UIを刷新 |
| `base/​src/​components/​TagSettingsDialog.vue` | 下書きと一括保存を実装 |
| `base/​src/​utils/​profileTagOptions.ts` | 初期候補と検索処理を追加 |
| `base/​src/​utils/​profileTagOptions.test.ts` | 候補生成をテスト |
| `base/​src/​locales/​messages/​ja.ts` | 新UI文言を追加 |
| `documents/​03_参加者獲得/​04_プロフィールタグ機能.md` | 画面・保存仕様を更新 |
| `documents/​レビューコメント/​review-ui-2375.md` | セルフレビュー結果を記録 |
</details>

---

💡 Configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>
```

**コメント要約**: Copilot の Pull request overview。
具体指摘はインライン RC-6 と同一のため、overview 自体は追加対応しない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview は変更サマリと、インラインコメント 4152623414 へのリンクです。データの戻りは RC-6 で必須修正として直し、overview 向けの別差分はありません。

---

**識別子**: RC-6（GitHub id: 4152623414）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/TagSettingsDialog.vue:48`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,66 +1,187 @@
 <script setup lang="ts">
-import { computed, ref } from 'vue'
+import { ref, watch } from 'vue'
 import { useI18n } from 'vue-i18n'
 import { useDisplay } from 'vuetify'
-import { mdiTagOutline } from '@mdi/js'
+import { mdiClose } from '@mdi/js'
 import TagInput from '@shokujii/base/components/TagInput.vue'
 import { useCurrentUserStore } from '@shokujii/base/stores/currentUser.js'
-import { addTagToMyProfile, removeTagFromMyProfile } from '@shokujii/base/apis/userTags.js'
-import { useNotification } from '@shokujii/base/composable/notification.js'
+import { updateUserTags } from '@shokujii/base/apis/userTags.js'
+import { reportClientError } from '@shokujii/base/utils/reportClientError.js'

 const model = defineModel<boolean>({ required: true })
-
 const { t: $t } = useI18n()
 const { smAndDown } = useDisplay()
 const currentUserStore = useCurrentUserStore()
-const notification = useNotification()

+const errorMessage = ref('')
 const isUpdating = ref(false)
+const tagsReady = ref(false)
+const tags = ref<string[]>([])

-const tags = computed(() => currentUserStore.user?.user_tags ?? [])
+watch(
+  [model, () => currentUserStore.user],
+  ([isOpen], previous) => {
+    const openedNow = isOpen && previous?.[0] !== true
+    const user = currentUserStore.user
+    if (isOpen && (openedNow || user == null)) {
+      tagsReady.value = false
+      tags.value = []
+      if (openedNow) {
+        errorMessage.value = ''
+      }
+    }
+    if (isOpen && !tagsReady.value && user != null) {
+      tags.value = [...(user.user_tags ?? [])]
+      tagsReady.value = true
+    }
+  },
+  { immediate: true },
+)

-const onAddTag = async (tag: string) => {
-  if (isUpdating.value) return
+const saveTags = async (): Promise<void> => {
+  if (isUpdating.value || !tagsReady.value) return
   isUpdating.value = true
+  errorMessage.value = ''
   try {
-    await addTagToMyProfile(tag)
-  } catch (e: unknown) {
-    const msg = e instanceof Error ? e.message : $t('user_tags.save_failed')
-    notification.show(msg, 'error')
-  } finally {
-    isUpdating.value = false
-  }
-}
-
-const onRemoveTag = async (tag: string) => {
-  if (isUpdating.value) return
-  isUpdating.value = true
-  try {
-    await removeTagFromMyProfile(tag)
-  } catch (e: unknown) {
-    const msg = e instanceof Error ? e.message : $t('user_tags.save_failed')
-    notification.show(msg, 'error')
+    const response = await updateUserTags([...tags.value])
+    if (!response.data.success) throw new Error(response.data.message)
+    model.value = false
```

**レビュワーのコメント（原文）**:

```
[must] `updateUserTags` は Pinia を同期更新せず、`currentUserStore.user` の更新は別経路の Firestore 購読待ちです。Callable 成功直後に閉じて購読反映前に再度開くと、21〜36行の初期化が古い `user_tags` をコピーし、後から新しいスナップショットが届いても `tagsReady` が true のため下書きを更新しません。そのまま保存すると、直前の更新を古い配列で戻せます。成功した配列を購読反映まで初期値として保持するか、購読値との同期完了を待ってから次回初期化できるようにしてください。
```

**コメント要約**: 保存直後の再表示が古い購読値で上書きし得る。
成功した配列を購読が一致するまで初期値にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `updateUserTags` は `{ success, message }` のみを返し、Pinia は `useUserStore` の `onSnapshot` でユーザードキュメント全体を差し替えます。成功直後に閉じ、購読前に開き直すと古い `user_tags` を下書きにし、`tagsReady` が true のあと届く新しいスナップショットは無視されます。再保存で直前の更新が戻ります。保存成功時の正規化済み配列を保持し、購読の `user_tags` が一致するまで次回オープンの初期値にしました。ログアウトで `user` が null のときはその保持を捨てます。編集中の下書きは、一致後も上書きしません。

---

## 評価セッション（2026-10-01 17:06・review-comments-evaluate auto / PR #2383）

- **評価日時**: 2026-10-01 17:06 JST
- **評価者**: Cursor Agent（review-comments-evaluate auto）
- **ブランチ名**: ui/2375
- **PR**: #2383（since: 2026-10-01T07:56:26Z）
- **Issue**: #2375
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5927247800、Copilot overview 5927327436 — インライン RC-7〜9 と重複）
- **手順 4a 自動修正**: RC-7（🟡 1件）、RC-8（🚨 1件）、RC-9（🚨 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | RC-7 | 4153146199 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 検索中にカテゴリ閲覧すると見出しが「検索結果」のまま<br>`isBrowsingGenres` を見出し判定で検索より優先 |
| [x] | RC-8 | 4153146204 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 購読が先に反映済みでも保存後に待機配列を残し得る<br>保存時点で `user_tags` と一致なら待機値を設定しない |
| [x] | RC-9 | 4153146195 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 手編集した `tags.ts` が再生成で消える<br>`build-tags-constants.mjs` に3タグを追加して再生成 |

---

**識別子**: RC-7（GitHub id: 4153146199）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/TagInput.vue:127`

**該当コード（レビュー時点の diff）**:

```diff
         {{
           $t(
             isSearching
               ? 'user_tags.search_results'
               : isBrowsingGenres
                 ? 'user_tags.browse_genres'
                 : 'user_tags.choose_tags',
           )
         }}
```

（API の diff_hunk はファイル先頭からの大きな hunk のため、指摘行付近を抜粋）

**レビュワーのコメント（原文）**:

```
**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  カテゴリ表示ではカテゴリ用見出しを優先してください**

検索語を入力したまま「ほかの候補を見る」を押すと、`showGenres` と `isSearching` が同時に true になりますが、この条件順ではカテゴリ一覧を表示しているのに見出しが「検索結果」のままになります。検索結果が0件なら一覧下部にも「一致するタグはありません」が残るため、検索中からカテゴリを閲覧する仕様で表示内容と案内が矛盾します。カテゴリ表示状態を検索状態より優先してください。

Useful? React with 👍 / 👎.
```

**コメント要約**: 検索中にカテゴリ閲覧すると見出しが「検索結果」のまま。
`isBrowsingGenres` を見出し判定で検索より優先。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 見出しの `$t` 分岐で `isSearching` を先に評価していたため、カテゴリ一覧表示中も「検索結果」になっていた。`isBrowsingGenres` を先に判定するよう変更した。

---

**識別子**: RC-8（GitHub id: 4153146204）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/TagSettingsDialog.vue:71`

**該当コード（レビュー時点の diff）**:

```diff
+    savedTagsAwaitingSnapshot.value = savedTags
```

**レビュワーのコメント（原文）**:

```
**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  購読反映済みなら待機タグを残さないでください**

Firestore の購読が Callable の応答より先に保存済み配列を反映した場合、watch 実行時点では `savedTagsAwaitingSnapshot` がまだ null なので一致を処理できず、その後ここで待機値だけが設定されます。以降に同じ配列のスナップショットは来ないため待機値が残り、別画面や別端末からタグが更新されても不一致として保持され、次回オープン時に古い保存値で初期化して新しい変更を巻き戻せます。代入時にも現在の `user_tags` と比較して、すでに一致している場合は待機値を設定しないようにしてください。

Useful? React with 👍 / 👎.
```

**コメント要約**: 購読が先に反映済みでも保存後に待機配列を残し得る。
保存時点で `user_tags` と一致なら待機値を設定しない。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-6 の待機配列は購読遅延向けだが、購読が先に一致した場合も無条件に待機値を立てると不要な保留が残る。保存成功時に `user_tags` が既に同一なら `null` にする。

---

**識別子**: RC-9（GitHub id: 4153146195）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/src/constants/tags.ts:393`

**該当コード（レビュー時点の diff）**:

```diff
       '多拠点生活',
+      '二拠点生活',
```

**レビュワーのコメント（原文）**:

```
**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  マスタタグを生成元にも追加してください**

`common/src/constants/tags.ts` は自動生成ファイルですが、生成元の `common/scripts/build-tags-constants.mjs` に3件のタグが追加されていません。このコミットで生成スクリプトを実行すると「二拠点生活」「地域創生」「ボディメイク」がすべて削除され、さらに `STARTER_TAGS` が削除後の `MasterTag` を参照するため型検査も失敗します。生成元の埋め込みCSVを更新してから成果物を再生成してください。

Useful? React with 👍 / 👎.
```

**コメント要約**: 手編集した `tags.ts` が再生成で消える。
`build-tags-constants.mjs` に3タグを追加して再生成。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ファイル先頭の AUTO-GENERATED 注記どおり、埋め込み CSV に「二拠点生活」「地域創生」「ボディメイク」を追加し `node common/scripts/build-tags-constants.mjs` で `tags.ts` を再生成した。
