# ブランチ fix/2423 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6082067806 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot は差分に指摘がないと返した。<br>PR の会話コメント。対象ファイルの変更要求はない。<br>Vitest 未実行はレビュー環境の制約で、製品の不具合ではない。<br>コード変更は不要。ローカルの Vitest は PR 作成前に成功している。 |
| [x] | RC-2 | 5470826445 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要は承認推奨で、未解決の指摘は 0 件。<br>PR レビュー本文。インライン指摘はない。<br>マージを止める不具合の指摘はない。<br>概要自体に修正要求がないため、コード変更は不要。 |
| [x] | RC-3 | 5471765114 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要。未解決は RC-4 / RC-5 の 2 件。<br>目次自体に追加の修正要求はない。 |
| [ ] | RC-4 | 4231499377 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | タグ設定後も、開いた参加者行のプレビューが古い `user_tags` のまま。 |
| [x] | RC-5 | 4231499439 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 本人が参加者ならプレビュー取得前でもボタンを出すのは確定仕様。 |
| [x] | RC-6 | 4231830188 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 常時表示にしたあと、`arePreviewMemberProfilesReady` が未使用のまま残っていた。 |

---

## 評価セッション（2026-10-09 22:41・review-comments-evaluate）

- **評価日時**: 2026-10-09 22:41 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2423`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2425
- **since**: 2026-10-09T13:36:53Z
- **partial**: true（watcher の sentinel。取得したコメントでは Codex は指摘なしで完了している。GitHub id 6082065463）
- **新規 RC**: RC-1、RC-2
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（Codex 接続案内の要約 6082031082、レビュー依頼定型文 6082031372、Codex の指摘なし 6082065463）
- **重複除外**: なし
- **自動修正**: 対象なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 6082067806 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot は差分に指摘がないと返した。<br>PR の会話コメント。対象ファイルの変更要求はない。<br>Vitest 未実行はレビュー環境の制約で、製品の不具合ではない。<br>コード変更は不要。ローカルの Vitest は PR 作成前に成功している。 |
| [x] | RC-2 | 5470826445 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要は承認推奨で、未解決の指摘は 0 件。<br>PR レビュー本文。インライン指摘はない。<br>マージを止める不具合の指摘はない。<br>概要自体に修正要求がないため、コード変更は不要。 |

---

**識別子**: RC-1（GitHub id: 6082067806）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
>
> @copilot この PR ��...

差分をレビューしましたが、指摘事項はありません。変更ファイルの Prettier 検査は通過しました。該当 Vitest は実行を試みましたが、この環境に `vitest` がなく実行できませんでした。

**コメント要約**: Copilot は差分に指摘がないと返した。PR の会話コメント。対象ファイルの変更要求はない。Vitest 未実行はレビュー環境の制約で、製品の不具合ではない。コード変更は不要。ローカルの Vitest は PR 作成前に成功している。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 修正を求める不具合の指摘ではない。Vitest が動かなかったのは Copilot 側の実行環境であり、この PR の作成前にローカルの Vitest は成功している。

---

**識別子**: RC-2（GitHub id: 5470826445）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR レビュー本文

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟢 Approval recommended

変更は参加者カードに限定され、既存の自動選択を維持したままテストで境界値と上書き動作を確認できています。

**0 open findings**

<details>
<summary><strong>What changed in this PR</strong></summary>

参加者一覧の表示サイズを維持しつつ、プロフィール画像を large サムネイルへ切り替える変更です。

**Changes:**
- `UserAvatar` にサムネイルサイズ指定を追加
- 参加者カードで large を指定
- サイズ解決ロジックと単体テストを追加

| File | Description |
| ---- | ----------- |
| `common/​src/​utils/​buildThumbnailsLinks.ts` | サムネイルサイズ解決関数を追加 |
| `common/​src/​utils/​buildThumbnailsLinks.test.ts` | 自動選択と明示指定を検証 |
| `base/​src/​components/​UserAvatar.vue` | 明示されたサイズを画像選択に反映 |
| `base/​src/​components/​EventMemberCard.vue` | 参加者画像に large を指定 |
</details>

🧠 **Review effort:** Balanced

---

💡 <a href="/nijuniinc/bokudeli-event-new/new/development?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

**コメント要約**: Copilot のレビュー概要は承認推奨で、未解決の指摘は 0 件。PR レビュー本文。インライン指摘はない。マージを止める不具合の指摘はない。概要自体に修正要求がないため、コード変更は不要。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 承認推奨と変更概要のみで、直すべき行や不具合は示されていない。

---

## 評価セッション（2026-10-10 00:07・review-comments-evaluate）

- **評価日時**: 2026-10-10 00:07 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2423`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2425
- **since**: 2026-10-09T14:54:36Z
- **partial**: true（watcher の sentinel。Codex は指摘なしで完了。GitHub id 6083469580）
- **新規 RC**: RC-3、RC-4、RC-5
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（レビュー依頼定型文 6083388143、Copilot 会話の指摘なし 6083439849、Codex の指摘なし 6083469580）
- **重複除外**: なし
- **自動修正**: 対象なし（RC-4 は 🟡 かつ 👤 UX のため手順 4a 対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-3 | 5471765114 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot のレビュー概要。未解決は RC-4 / RC-5 の 2 件。<br>目次自体に追加の修正要求はない。 |
| [ ] | RC-4 | 4231499377 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | タグ設定後も、開いた参加者行のプレビューが古い `user_tags` のまま。 |
| [x] | RC-5 | 4231499439 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 本人が参加者ならプレビュー取得前でもボタンを出すのは確定仕様。 |

---

**識別子**: RC-3（GitHub id: 5471765114）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR レビュー本文

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

プロフィール取得完了前のボタン表示と、タグ設定後に参加者行へ反映されない問題が残っています。

<details open>
<summary><strong>2 open findings</strong></summary>

- [タグ保存後も開いた参加者行に新しいタグが反映されない](https://github.com/nijuniinc/bokudeli-event-new/pull/2425#discussion_r4231499377) · New
- [プロフィール取得中でも本人参加者のボタンが表示される](https://github.com/nijuniinc/bokudeli-event-new/pull/2425#discussion_r4231499439) · New
</details>

🧠 **Review effort:** Balanced

**コメント要約**: Copilot のレビュー概要。未解決は RC-4 / RC-5 の 2 件。目次自体に追加の修正要求はない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 本文は目次で、`#discussion_r4231499377` と `#discussion_r4231499439` は RC-4 / RC-5 として評価済み。概要自体に追加の修正要求はない。

---

**識別子**: RC-4（GitHub id: 4231499377）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventDetailsCard.vue` 566 行付近

**該当コード（レビュー時点の diff）**:

```diff
@@ -515,6 +562,8 @@ const shareButtonElevation = computed(() => (display.xs.value ? 0 : 2))
     {{ $t('event_details.contact_community_after_login') }}
   </confirm-dialog>
   <calendar-add-dialog v-model="isOpenCalendarAddDialog" :event="event!" />
+  <TagSetupPromptDialog v-model="showTagSetupPrompt" @confirm="onConfirmTagSetupPrompt" />
+  <TagSettingsDialog v-model="showTagSettings" />
```

**レビュワーのコメント（原文）**:

[must] この設定ダイアログでタグを保存しても、開いたままの参加者行には新しいタグが反映されません。`TagSettingsDialog` が更新するのは `currentUserStore.user` ですが、この画面の `members` は `fetchUsersByIds` の一括取得結果で固定され、settled 後は再取得されないためです。現在のユーザーだけライブ値を合成するか、保存成功時に preview profile を更新／再取得してください。

**コメント要約**: タグ設定後も、開いた参加者行のプレビューが古い `user_tags` のまま。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 案内から設定したあと、自分の行だけ古いタグのまま残るのは実際のずれ。`#2421` の一括取得を全員リアルタイムに戻す話ではなく、自分の保存結果をプレビューへ載せる範囲なら本 PR で足せる。修正案が合成と再取得の 2 つあり、👤 UX のため手順 4a では自動修正しない。

---

**識別子**: RC-5（GitHub id: 4231499439）

**レビュワー**: Copilot

**指摘箇所**: `base/src/utils/participantTagsButton.ts` 15 行付近

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,31 @@
+export type ParticipantTagsButtonClickAction = 'reveal-and-prompt' | 'reveal' | 'hide'
+
+export function shouldShowParticipantTagsButton(input: {
+  isShowMember: boolean
+  isCurrentUserParticipant: boolean
+  previewProfilesReady: boolean
+  previewHasAnyTags: boolean
+}): boolean {
+  if (!input.isShowMember) {
+    return false
+  }
+  if (input.isCurrentUserParticipant) {
+    return true
+  }
+  return input.previewProfilesReady && input.previewHasAnyTags
```

**レビュワーのコメント（原文）**:

[must] `isCurrentUserParticipant` を先に返しているため、本人が参加者ならプロフィール一括取得中でもボタンが表示されます。追加された仕様書の「プロフィール未取得の間はボタンを出さない」と、この PR の確認観点に反するため、`previewProfilesReady` は参加者本人を含む全分岐の前提条件にしてください。あわせて現在 `true` を期待しているテストも更新が必要です。

**コメント要約**: 本人が参加者ならプレビュー取得前でもボタンを出すのは確定仕様。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 確定した表示条件は、自分が `event.members` にいるときはプレビューの成否を待たずに出す。プロフィール未取得でボタンを出さないのは、非参加者側で「タグなし」と誤判定しないための条件。仕様書 4.2.2 の「自分が `event.members` にいるときは出す」がこちらを正とする。テスト「タグが無くても自分が参加者なら表示」も `previewProfilesReady: false` で true を固定している。

---

## 評価セッション（2026-10-10 00:38・review-comments-evaluate）

- **評価日時**: 2026-10-10 00:38 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2423`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2425
- **since**: 2026-10-09T15:28:30Z
- **partial**: false
- **新規 RC**: RC-6
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 6083975623、Codex の接続案内のみ 5472165379）
- **重複除外**: GitHub id 6084057304 → 既存 RC-4、差分なし
- **自動修正**: 手順 4a 自動修正: RC-6（🚨 0件 / 🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-6 | 4231830188 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 常時表示にしたあと、`arePreviewMemberProfilesReady` が未使用のまま残っていた。 |

---

**識別子**: RC-6（GitHub id: 4231830188）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/stores/event.ts` 438 行付近

**該当コード（レビュー時点の diff）**:

```diff
@@ -434,6 +434,16 @@ export const useEventStore = (target: string | BokudeliEvent, options: EventStor
       return buildMembers(_memberIds.value)
     })
 
+    /** 参加者プロフィールの一括取得が終わったか。未取得をタグなしと扱わないため */
+    const arePreviewMemberProfilesReady = computed(() => {
+      if (_memberIds.value == null) {
+        return false
+      }
+      const ids = _memberIds.value
+      const users = previewUsers.value
+      return previewUsersSettledKey === previewMemberKey(ids) && ids.every((id) => users.has(id))
+    })
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P3 Badge](https://img.shields.io/badge/P3-lightgrey?style=flat)</sub></sub>  未使用のプロフィール準備状態を削除する**

`arePreviewMemberProfilesReady` はリポジトリ全体で宣言・store の公開・専用テストからしか参照されておらず、最終的なタグ表示条件は `isShowMember` のみになっています。このままでは実際の挙動に寄与しない公開 API と非同期状態管理・テストだけが残り、参加者取得ロジック変更時の保守対象を増やすため、この computed と公開プロパティおよび専用テストを削除してください。

AGENTS.md reference: [AGENTS.md:L294-L297](https://github.com/nijuniinc/bokudeli-event-new/blob/733f5399e2865af390cecd34aea67318a0c07e97/AGENTS.md#L294-L297)

Useful? React with 👍 / 👎.

**コメント要約**: 常時表示にしたあと、`arePreviewMemberProfilesReady` が未使用のまま残っていた。computed と公開プロパティ、専用テストを削除した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 表示条件を `isShowMember` だけにしたあと、このフラグは store の公開と専用テスト以外から参照されていない。削除してよい。手順 4a で computed・export・専用テストを削除した。

---

## 評価セッション（2026-10-10 00:31・shokujii-code-review・リモート取り込み）

- **評価日時**: 2026-10-10 00:31 JST
- **評価者**: Cursor Agent（`shokujii-code-review`。`copilot-swe-agent` が `origin/fix/2423` へ記録）
- **ブランチ名**: `fix/2423`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2425
- **新規 RC**: なし
- **重複除外**: Copilot セルフレビューの RC-1 → 既存 RC-4。タグ設定後も開いたプレビュー行が古い `user_tags` のまま、という同一指摘。通し番号は RC-4 を正本とする。

---
