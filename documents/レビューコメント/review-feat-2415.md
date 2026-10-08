# ブランチ feat/2415 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5453283697 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要が、タグ位置とエラー文言の対応を求めている<br>PR #2417 の review overview<br>本文の修正要求はリンク先3件と同じ<br>個別 RC で評価し、概要自体は追加対応しない |
| [ ] | RC-2 | 4216260183 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🔧 微修正 | S | タグ0件のカードでタグ領域が消え、先頭行が揃わない<br>`EventMemberCard.vue` の `showMemberTags` とタグ欄<br>仕様の固定スロットと `min-height: 48px` が未実装<br>タグ領域を常設し最小高さを付ける。自動修正の対象外 |
| [x] | RC-3 | 4216260300 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 挨拶文のコメントが、旧表示名の注文を除外するように読める<br>`chatGreetingPrompt.ts` の `resolveChatGreetingOrderSentence`<br>実際の除外は `menu_id` なので、保存済みの旧名も対象<br>表示名に触れず `menu_id` 判定だとコメントを直した |
| [ ] | RC-4 | 4216260244 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | エラー文言の置換で、更新前クライアントが汎用エラーになる<br>`noOrderParticipationMessages.ts` の failed-precondition 3文言<br>旧タブは完全一致しないと案内を捨てる<br>旧文言維持か新旧両方許可かで方針が分かれるため未着手 |
| [ ] | RC-5 | 4216300001 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 旧バンドルが変更後のエラーを未知扱いにする<br>`noOrderParticipationMessages.ts`（RC-4 と同じ箇所）<br>カートダイアログが排他理由ではなく汎用失敗を出す<br>RC-4 と同じ二択のため、この PR ではまだ直していない |

---

## 評価セッション（2026-10-08 16:45・review-comments-evaluate）

- **評価日時**: 2026-10-08 16:45 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2415
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2417
- **since**: 2026-10-08T07:32:07Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 4（6054971194 レビュー依頼定型文、6054972301 Codex 活動サマリと接続案内、6055019213 Copilot の問題なし返信、5453333950 Codex の "Here are some automated review suggestions" と接続案内）
- **重複除外**: なし
- **手順 4a 自動修正**: RC-3（🚨 0件 / 🟡 1件）。RC-2 は 📑 仕様書と 👤 UX のため対象外。RC-4 は方針が二択で仕様判断が必要なため対象外。RC-5 は 👤 UX かつ RC-4 と同じ二択のため対象外

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5453283697 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要が、タグ位置とエラー文言の対応を求めている<br>PR #2417 の review overview<br>本文の修正要求はリンク先3件と同じ<br>個別 RC で評価し、概要自体は追加対応しない |
| [ ] | RC-2 | 4216260183 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🔧 微修正 | S | タグ0件のカードでタグ領域が消え、先頭行が揃わない<br>`EventMemberCard.vue` の `showMemberTags` とタグ欄<br>仕様の固定スロットと `min-height: 48px` が未実装<br>タグ領域を常設し最小高さを付ける。自動修正の対象外 |
| [x] | RC-3 | 4216260300 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 挨拶文のコメントが、旧表示名の注文を除外するように読める<br>`chatGreetingPrompt.ts` の `resolveChatGreetingOrderSentence`<br>実際の除外は `menu_id` なので、保存済みの旧名も対象<br>表示名に触れず `menu_id` 判定だとコメントを直した |
| [ ] | RC-4 | 4216260244 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | エラー文言の置換で、更新前クライアントが汎用エラーになる<br>`noOrderParticipationMessages.ts` の failed-precondition 3文言<br>旧タブは完全一致しないと案内を捨てる<br>旧文言維持か新旧両方許可かで方針が分かれるため未着手 |
| [ ] | RC-5 | 4216300001 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 旧バンドルが変更後のエラーを未知扱いにする<br>`noOrderParticipationMessages.ts`（RC-4 と同じ箇所）<br>カートダイアログが排他理由ではなく汎用失敗を出す<br>RC-4 と同じ二択のため、この PR ではまだ直していない |

---

**識別子**: RC-1（GitHub id: 5453283697）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: （インライン指摘なし。review body）

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

タグ領域の位置揃えと、Functions・旧クライアント間のエラー文言互換性への対応が必要です。

<details open>
<summary><strong>3 open findings</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [タグ領域を常設しカードのタグ位置を揃える](#discussion_r4216260183) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Functionsと旧クライアント間のエラーメッセージ互換性を維持する](#discussion_r4216260244) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [表示名に依存しない除外判定のコメントに修正する](#discussion_r4216260300) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

注文なし参加の表示名を統一し、参加者カードですべてのプロフィールタグを表示する変更です。

**Changes:**
- 「食事は持参する」へ文言を統一
- タグの折りたたみ処理を削除
- 関連する不要なUI文言・ユーティリティを削除

| File | Description |
| ---- | ----------- |
| `documents/​03_参加者獲得/​18_注文なし参加.md` | 表示名と保存済みデータの扱いを更新 |
| `common/​src/​utils/​noOrderParticipationMessages.ts` | カート関連の案内文を更新 |
| `common/​src/​schemas/​EventItemType.ts` | 予約メニュー名の定数を更新 |
| `base/​src/​utils/​visibleCountWithinLines.ts` | 行数計算ユーティリティを削除 |
| `base/​src/​utils/​visibleCountWithinLines.test.ts` | 削除対象ユーティリティのテストを削除 |
| `base/​src/​utils/​chatGreetingPrompt.ts` | 注文なし参加に関するコメントを更新 |
| `base/​src/​locales/​messages/​ja.ts` | 表示名更新と折りたたみ文言の削除 |
| `base/​src/​components/​EventMemberCard.vue` | タグを全件表示するよう簡素化 |
</details>

**コメント要約**: Copilot のレビュー概要が、タグ位置とエラー文言の対応を求めている。PR #2417 の review overview。本文の修正要求はリンク先3件と同じ。個別 RC で評価し、概要自体は追加対応しない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `#discussion_r4216260183` `#discussion_r4216260244` `#discussion_r4216260300` はいずれもインラインとして取得済みで、RC-2〜RC-4 で評価する。概要にそれら以外の修正要求はない。

---

**識別子**: RC-2（GitHub id: 4216260183）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventMemberCard.vue:99`

**該当コード（レビュー時点の diff）**:

```diff
@@ -192,8 +95,8 @@ onUnmounted(() => {
     </router-link>

     <div v-if="showMemberTags" class="event-member-card__tags">
-      <div ref="tagsRoot" class="event-member-card__tag-list">
-        <span v-for="tag in shownTags" :key="tag" data-member-tag class="event-member-card__tag">
+      <div class="event-member-card__tag-list">
+        <span v-for="tag in orderedUserTags" :key="tag" class="event-member-card__tag">
```

**レビュワーのコメント（原文）**:

[must] 全件描画にはなりましたが、Issue #2416 の「タグが少ないカードと先頭行の位置を揃える」完了条件が未実装です。タグが0件の他ユーザーでは `showMemberTags` により領域自体が消え、`.event-member-card__tags` に仕様書の `min-height: 48px` もないため、カード間でタグ領域の開始位置を固定できません。タグ領域を常設し、仕様どおり固定スロットと最小高さを設けてください。

**コメント要約**: タグ0件のカードでタグ領域が消え、先頭行が揃わない。`EventMemberCard.vue` の `showMemberTags` とタグ欄。仕様の固定スロットと `min-height: 48px` が未実装。タグ領域を常設し最小高さを付ける。自動修正の対象外。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `documents/03_参加者獲得/04_プロフィールタグ機能.md` §4.2.3 は、タグ0件でもスロットを確保し、タグ欄に `min-height: 48px` を常設すると定めている。#2416 の完了条件にも先頭行の位置揃えがある。全件表示自体はできているためデータ不整合ではなく 🟡。ラベルが 📑 仕様書と 👤 UX のため手順 4a の自動修正対象外。

---

**識別子**: RC-3（GitHub id: 4216260300）

**レビュワー**: Copilot

**指摘箇所**: `base/src/utils/chatGreetingPrompt.ts:165`

**該当コード（レビュー時点の diff）**:

```diff
@@ -162,7 +162,7 @@ export const formatChatGreetingMenuPhrase = (orders: readonly ChatGreetingOrderL

 type ChatGreetingTranslate = (key: string, values?: Record<string, string>) => string

-/** 確定注文から挨拶の注文文を組み立てる。「食事は持参」のみのときは空（2行目を付けない） */
+/** 確定注文から挨拶の注文文を組み立てる。「食事は持参する」のみのときは空（2行目を付けない） */
```

**レビュワーのコメント（原文）**:

[nits] 保存済み注文は旧名「食事は持参」のまま残る一方、除外判定は表示名ではなく `menu_id` に基づくため、このコメントだと旧名の注文が対象外に見えます。名称に依存しない説明にしてください。

**コメント要約**: 挨拶文のコメントが、旧表示名の注文を除外するように読める。`chatGreetingPrompt.ts` の `resolveChatGreetingOrderSentence`。実際の除外は `menu_id` なので、保存済みの旧名も対象。表示名に触れず `menu_id` 判定だとコメントを直した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `isParticipationOnlyOrder` は `order.menu_id === NO_ORDER_PARTICIPATION_MENU_ID` で除外している。コメントだけが表示名依存に読める。方針は一意なのでコメントを「注文なし参加だけ（menu_id で判定）」に直した。

---

**識別子**: RC-4（GitHub id: 4216260244）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/noOrderParticipationMessages.ts:3`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,11 +1,11 @@
-/** カート内に店舗メニューがあるときに「食事は持参」を追加できない（addToCart failed-precondition） */
+/** カート内に店舗メニューがあるときに「食事は持参する」を追加できない（addToCart failed-precondition） */
 export const NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE =
-  'カートに店舗メニューが入っているため、「食事は持参」は追加できません。カートから店舗メニューを削除してから、もう一度「カートに追加」してください。'
+  'カートに店舗メニューが入っているため、「食事は持参する」は追加できません。カートから店舗メニューを削除してから、もう一度「カートに追加」してください。'
```

**レビュワーのコメント（原文）**:

[must] この文字列は Functions が返し、クライアントが `getUserFacingFailedPreconditionMessage` で許可判定する実質的なAPI契約です。3文言を同時に置換すると、更新前のクライアントが更新後の Functions を呼ぶ間は一致せず、具体的な案内ではなく汎用の「カート更新失敗」になります。wire用の旧文言は維持し、クライアント側で新しい表示文言へ変換するなど、デプロイ順や開いたままの旧タブでも互換性を保ってください。

**コメント要約**: エラー文言の置換で、更新前クライアントが汎用エラーになる。`noOrderParticipationMessages.ts` の failed-precondition 3文言。旧タブは完全一致しないと案内を捨てる。旧文言維持か新旧両方許可かで方針が分かれるため未着手。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `getUserFacingFailedPreconditionMessage` は3定数の `includes` で許可し、一致しなければ `null` を返す。更新後 Functions が新しい文言を返すと、開いたままの旧クライアントは `cart.update_failed` に落ちる。指摘は「旧文言を維持してクライアントで変換」と「新旧両方を許可」を併記しており、#2415 は表示名の変更を求めている。どちらを採るかは仕様判断が必要なため自動修正しない。

---

**識別子**: RC-5（GitHub id: 4216300001）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/src/utils/noOrderParticipationMessages.ts:3`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,11 +1,11 @@
-/** カート内に店舗メニューがあるときに「食事は持参」を追加できない（addToCart failed-precondition） */
+/** カート内に店舗メニューがあるときに「食事は持参する」を追加できない（addToCart failed-precondition） */
 export const NO_ORDER_PARTICIPATION_BLOCKED_PARTNER_IN_CART_MESSAGE =
-  'カートに店舗メニューが入っているため、「食事は持参」は追加できません。カートから店舗メニューを削除してから、もう一度「カートに追加」してください。'
+  'カートに店舗メニューが入っているため、「食事は持参する」は追加できません。カートから店舗メニューを削除してから、もう一度「カートに追加」してください。'
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  旧クライアントでも変更後のエラーを表示できるようにする**

デプロイ後も更新前から開いているページやキャッシュされた旧バンドルは、`getUserFacingFailedPreconditionMessage` で旧文言との完全一致だけを許可しています。その状態で新しい Functions がこの変更後の文言を返すと 3 種類すべてが未知のエラーと判定され、`EventCartDialog.vue` では本来の排他理由ではなく汎用の `cart.update_failed` が表示されます。表示名の変更を通信上の識別子へ波及させず旧文言を維持するか、新旧両方を許可してローリング更新中の互換性を保ってください。

Useful? React with 👍 / 👎.

**コメント要約**: 旧バンドルが変更後のエラーを未知扱いにする。`noOrderParticipationMessages.ts`（RC-4 と同じ箇所）。カートダイアログが排他理由ではなく汎用失敗を出す。RC-4 と同じ二択のため、この PR ではまだ直していない。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-4 の続き。増えた点は `EventCartDialog.vue` の `cart.update_failed` への落ち先と、P2 としての重要度。対処は「通信上は旧文言」か「新旧両方を許可」の二択で、👤 UX ラベルもあり自動修正しない。
