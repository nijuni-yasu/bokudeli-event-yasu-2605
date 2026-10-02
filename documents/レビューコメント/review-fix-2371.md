# ブランチ fix/2371 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | 4165565932 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | アンマウント後も挨拶取得が下書きを書く<br>取得完了後の書き込みを中止する。UX 指摘のため自動修正していない |
| [x] | RC-2 | 4165521871 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 注文なしでも挨拶の自己紹介と一言が独立抽選になる<br>#2371 の従来7文面を対にして1回の抽選に戻した |
| [ ] | RC-3 | 4165565928 | 🟡 修正提案 | 未着手 | ❓ 要確認 | — | 🔧 微修正 | S | 参加専用メニューを表示名ではなく0円で判定すべき<br>#2371 は表示名「注文なしで参加」を指定しており、価格判定は仕様判断 |
| [ ] | RC-4 | 4165565917 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 生成AIの並びが生成スクリプトのソートと一致しない<br>順序定義を足すか生成結果をコミットするかは一意でない |

---

## 評価セッション（2026-10-02 21:19・review-comments-evaluate）

- **評価日時**: 2026-10-02 21:19 JST
- **評価者**: Cursor Agent（review-comments-evaluate）
- **ブランチ名**: fix/2371
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2390
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（依頼定型文 5951914342、Codex 活動サマリ 5951914566、Copilot の指摘なし返信 5951951070）
- **partial**: false
- **手順 4a 自動修正**: RC-2（🚨 1件 / 🟡 0件）。RC-1 は 👤 UX のため対象外。RC-3 は仕様判断。RC-4 は修正方針が二通り

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | 4165565932 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | アンマウント後も挨拶取得が下書きを書く<br>取得完了後の書き込みを中止する。UX 指摘のため自動修正していない |
| [x] | RC-2 | 4165521871 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 注文なしでも挨拶の自己紹介と一言が独立抽選になる<br>#2371 の従来7文面を対にして1回の抽選に戻した |
| [ ] | RC-3 | 4165565928 | 🟡 修正提案 | 未着手 | ❓ 要確認 | — | 🔧 微修正 | S | 参加専用メニューを表示名ではなく0円で判定すべき<br>#2371 は表示名「注文なしで参加」を指定しており、価格判定は仕様判断 |
| [ ] | RC-4 | 4165565917 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 生成AIの並びが生成スクリプトのソートと一致しない<br>順序定義を足すか生成結果をコミットするかは一意でない |

---

**識別子**: RC-1（GitHub id: 4165565932）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/chat/ChatApp.vue:488`

**該当コード（レビュー時点の diff）**:

```diff
@@ -465,20 +467,63 @@ const isLocalComposeEmpty = (): boolean => {
   return msg.value.trim() === '' && selectedImages.value.length === 0
 }

-const acceptGreetingPrompt = (): void => {
+const acceptGreetingPrompt = async (): Promise<void> => {
+  if (isApplyingGreeting.value) {
+    return
+  }
   const roomId = greetingPromptTargetRoomId.value ?? store.activeRoomId
   if (roomId == null || store.activeRoomId !== roomId || !isLocalComposeEmpty()) {
     dismissGreetingPrompt()
     return
   }
-  const choice = pickChatGreeting(currentUserStore.user?.user_name ?? '')
-  const body = t(choice.key, { name: choice.name ?? '', emoji: t(choice.emojiKey) })
-  msg.value = body
-  composeDraftStore.upsertDraft(roomId, { body, attachments: [] })
-  dismissGreetingPrompt()
-  nextTick(() => {
-    composeInputRef.value?.focus()
-  })
+  const room = store.activeRoom
+  const userId = currentUserId.value
+  const communityId = room?.roomId === roomId ? room.communityId : undefined
+  const eventId = room?.roomId === roomId ? room.eventId : undefined
+  isApplyingGreeting.value = true
+  try {
+    let orders: Awaited<ReturnType<typeof fetchMemberOrdersForUser>> | null = null
+    if (communityId != null && communityId !== '' && eventId != null && eventId !== '' && userId !== '') {
+      try {
+        orders = await fetchMemberOrdersForUser(communityId, eventId, userId)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  アンマウント時に挨拶取得を無効化する**

注文取得中にブラウザバックなどで `ChatApp` がアンマウントされても、このリクエストは無効化されず、`onBeforeUnmount` も `greetingPromptTargetRoomId` をクリアしません。チャットストアの `activeRoomId` はアンマウント時に解除されないため、取得完了後の検査を通過して共有の下書きストアへ挨拶を書き込み、後でチャットへ戻ると離脱後に生成された下書きが復元されます。アンマウント時に対象をクリアするかリクエストIDを更新し、`await` 後の書き込みを中止してください。

Useful? React with 👍 / 👎.

**コメント要約**: アンマウント後も挨拶取得が下書きを書く
取得完了後の書き込みを中止する。UX 指摘のため自動修正していない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `onBeforeUnmount` は下書き保存のみで、挨拶取得中の世代を無効化していない。指摘どおり離脱後に下書きが残る。P2 の UX 指摘であり、自動修正の除外ラベルに当たるため未着手のまま残す。

---

**識別子**: RC-2（GitHub id: 4165521871）

**レビュワー**: Copilot

**指摘箇所**: `base/src/utils/chatGreetingPrompt.ts:88`

**該当コード（レビュー時点の diff）**:

```diff
@@ -60,10 +83,75 @@ const pickIndex = (length: number, random: () => number): number => {

 export const pickChatGreeting = (userName: string, random: () => number = Math.random): ChatGreetingChoice => {
   const name = userName.trim()
-  const keys = name === '' ? CHAT_GREETING_UNNAMED_KEYS : CHAT_GREETING_NAMED_KEYS
-  const key = keys[pickIndex(keys.length, random)]
+  const introKeys = name === '' ? CHAT_GREETING_UNNAMED_INTRO_KEYS : CHAT_GREETING_NAMED_INTRO_KEYS
+  const introKey = introKeys[pickIndex(introKeys.length, random)] ?? null
+  const closingKey = CHAT_GREETING_CLOSING_KEYS[pickIndex(CHAT_GREETING_CLOSING_KEYS.length, random)]
```

**レビュワーのコメント（原文）**:

[must] `introKey` と `closingKey` を別々に抽選すると、注文が0件・取得失敗の場合にも従来7種類の挨拶ではなく最大35通りの新しい組み合わせになります（例: 「参加します！山田です。どうぞよろしくお願いします」）。#2371 の「対象が0件／取得失敗時は現行の挨拶文のまま」という条件を満たすため、従来の intro/closing の対応をペアとして1回の抽選で選び、注文文だけを間に挿入してください。

**コメント要約**: 注文なしでも挨拶の自己紹介と一言が独立抽選になる
#2371 の従来7文面を対にして1回の抽選に戻した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 変更前は挨拶文を7種類から1つ選んでいた。分割抽選は注文が無いときも文面の組み合わせを増やす。#2371 の完了条件に反するため必須。`CHAT_GREETING_VARIANTS` で従来の7対を1回抽選し、絵文字だけ別抽選にした。

---

**識別子**: RC-3（GitHub id: 4165565928）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/utils/chatGreetingPrompt.ts:98`

**該当コード（レビュー時点の diff）**:

```diff
+export const formatChatGreetingMenuPhrase = (orders: readonly ChatGreetingOrderLine[]): string => {
+  const menuCounts = new Map<string, number>()
+  const menuNameOrder: string[] = []
+  for (const order of orders) {
+    if (order.status !== 'ordered' || order.menu_name === PARTICIPATION_ONLY_MENU_NAME) {
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  参加専用メニューを価格で判定する**

`EventMenu` と `EventMemberOrder` では `menu_price: 0` を「注文なしで参加」の識別条件として扱っていますが、ここでは変更可能な表示名だけで除外しています。そのため、0円の参加専用メニューを「食事なし」などへ改名したイベントでは挨拶に誤って表示され、逆に有料メニューへ偶然「注文なしで参加」と付けると実際の注文が表示されません。`ChatGreetingOrderLine` に `menu_price` を含め、既存の注文ロジックと同じく0円かどうかで判定してください。

Useful? React with 👍 / 👎.

**コメント要約**: 参加専用メニューを表示名ではなく0円で判定すべき
#2371 は表示名「注文なしで参加」を指定しており、価格判定は仕様判断

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: ❓ 要確認

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: スキーマは 0 円を参加専用の識別に使っている。一方 #2371 の完了条件は表示名「注文なしで参加」をメニュー文から外すことである。価格へ切り替えると Issue の文言とずれるため、仕様判断が必要で自動修正していない。

---

**識別子**: RC-4（GitHub id: 4165565917）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/scripts/build-tags-constants.mjs:250`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,7 +246,8 @@ const RAW = `コミュニティ／イベント,食／グルメ,ベンチャー
 ,カクテル,,,,,,,,,,,,,,,,,,,,,,,
 ,紅茶,,,,,,,,,,,,,,,,,,,,,,,
 ,デザート,,,,,,,,,,,,,,,,,,,,,,,
-,洋菓子,,,,,,,,,,,,,,,,,,,,,,,`
+,洋菓子,,,,,,,,,,,,,,,,,,,,,,,
+,,,,,,生成AI`
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  自動生成結果とタグ順を一致させる**

この行でテクノロジー列へ追加しても、このジャンルは後段の `localeCompare` でソートされるため、`node common/scripts/build-tags-constants.mjs` と Prettier を実行すると、今回コミットした `common/src/constants/tags.ts` の「生成AI」が `AI` の直後から「数学」の後へ移動します。自動生成物と生成元が一致しておらず、次回のタグ更新で意図しない順序変更が混入するため、テクノロジー用の順序定義を追加するか、実際の生成結果をコミットしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 生成AIの並びが生成スクリプトのソートと一致しない
順序定義を足すか生成結果をコミットするかは一意でない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `ja` の `localeCompare` では「生成AI」は「数学」の後になる。コミット済みの `tags.ts` は `AI` の直後なので、次回生成で順序が変わる。指摘は妥当だが、順序定義の追加と生成結果のコミットのどちらにするかは一意でないため自動修正していない。
