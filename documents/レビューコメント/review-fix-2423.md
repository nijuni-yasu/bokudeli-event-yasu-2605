# ブランチ fix/2423 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | タグ設定を保存しても参加者プレビューに新しいタグが反映されない。<br>`EventDetailsCard.vue` の一覧は `previewMembers` の一括取得結果を表示する。<br>画面を開いたまま保存した場合、参加者のタグが古いままになる。<br>保存後にプレビューのプロフィールを更新するか、本人の最新タグを合成する。 |

---

## 評価セッション（2026-10-10 00:31・shokujii-code-review）

- **評価日時**: 2026-10-10 00:31 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: fix/2423
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2425
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **重複除外**: なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | タグ設定を保存しても参加者プレビューに新しいタグが反映されない。<br>`EventDetailsCard.vue` の一覧は `previewMembers` の一括取得結果を表示する。<br>画面を開いたまま保存した場合、参加者のタグが古いままになる。<br>保存後にプレビューのプロフィールを更新するか、本人の最新タグを合成する。 |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventDetailsCard.vue:556`

**該当コード（レビュー時点の diff）**:

```diff
@@ -515,6 +552,8 @@ const shareButtonElevation = computed(() => (display.xs.value ? 'small' : 'large'))
   <confirm-dialog v-model="isOpenConfirmDialog" :is-confirm="false" :ok-click="login">
     {{ $t('event_details.contact_community_after_login') }}
   </confirm-dialog>
   <calendar-add-dialog v-model="isOpenCalendarAddDialog" :event="event!" />
+  <TagSetupPromptDialog v-model="showTagSetupPrompt" @confirm="onConfirmTagSetupPrompt" />
+  <TagSettingsDialog v-model="showTagSettings" />
   <show-dialog v-model="isShowQrCode">
     <v-card class="justify-center text-center" elevation="0">
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: タグ設定を保存しても、開いたままのイベント詳細の参加者一覧には新しいタグが反映されません。`EventMemberList` は `eventStore.previewMembers` の一括取得結果を表示し、そのプロフィールは参加者 ID が変わらない限り再取得されません。設定保存後にプレビューのプロフィールを更新するか、本人の最新タグを一覧へ合成してください。

**コメント要約**: タグ設定を保存しても参加者プレビューに新しいタグが反映されない。<br>
`EventDetailsCard.vue` の一覧は `previewMembers` の一括取得結果を表示する。<br>
画面を開いたまま保存した場合、参加者のタグが古いままになる。<br>
保存後にプレビューのプロフィールを更新するか、本人の最新タグを合成する。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `TagSettingsDialog` の保存はタグ設定側の更新に留まり、イベント詳細で `EventMemberList` に渡す `previewMembers` の一括取得キャッシュは参加者 ID が変わらない限り更新されません。追加した設定導線の保存後も古いタグが表示されるため、プレビュー更新または本人の最新タグの合成が必要です。

---
