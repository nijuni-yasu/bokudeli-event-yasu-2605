# ブランチ fix/2405 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | 6052579010 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | 画面を開いたまま開始時刻を過ぎると「進む」が有効のまま残る<br>`EventEdit.vue` の `isDraftEventStartInPast` が `Date.now()` を computed 内で見ている<br>押下時の検証では進まないが、ボタンとエラー文言は更新されない<br>定期的な現在時刻か開始時刻での再評価が提案されている。方針が複数あるため未着手 |
| [x] | RC-2 | 5451617821 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘の目次<br>リンク先は `#discussion_r4214885266` と `#discussion_r4214885330`<br>実体は RC-4 と RC-5 で評価する<br>目次自体に追加の修正要求はない |
| [ ] | RC-3 | 4214883108 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Codex も同じ非リアクティブな `Date.now()` を指摘している<br>`EventEdit.vue:318` の `isDraftEventStartInPast`<br>画面滞在中に開始時刻を過ぎるとボタン無効化が遅れる<br>時計のリアクティブ化か開始時刻での再評価の二択で、未着手 |
| [ ] | RC-4 | 4214885266 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Copilot は同じ時刻経過の再計算漏れを [must] で指摘している<br>`EventEdit.vue:318`。押下時検証ではステップは進まない<br>開いた時点で未来だった開始日時が滞在中に過去になると見た目が遅れる<br>定期更新する現在時刻を渡す案。表示の更新間隔は UX 判断のため未着手 |
| [x] | RC-5 | 4214885330 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 等値境界のテストが `rejectPastStartDatetime` 無しで通っていた<br>`eventEditValidationMessages.test.ts` の「現在以降」ケース<br>比較が `<=` に変わっても検知できない<br>フラグを有効にして、開始日時が現在と同じときはメッセージ無しを検証する |

---

## 評価セッション（2026-10-08 13:59・review-comments-evaluate）

- **評価日時**: 2026-10-08 13:59 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2405`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2406
- **since**: 2026-10-08T04:52:39Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（6052549035 Codex 活動サマリと接続案内、6052549289 レビュー依頼定型文、5451615323 Codex の suggestions 定型と接続案内のみ）
- **重複除外**: なし
- **手順 4a 自動修正**: RC-5（🚨 0件 / 🟡 1件）。RC-1・RC-3・RC-4 は 👤 UX と方針が複数（定期更新か開始時刻での再評価）のため自動修正しない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | 6052579010 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | 画面を開いたまま開始時刻を過ぎると「進む」が有効のまま残る<br>`EventEdit.vue` の `isDraftEventStartInPast` が `Date.now()` を computed 内で見ている<br>押下時の検証では進まないが、ボタンとエラー文言は更新されない<br>定期的な現在時刻か開始時刻での再評価が提案されている。方針が複数あるため未着手 |
| [x] | RC-2 | 5451617821 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘の目次<br>リンク先は `#discussion_r4214885266` と `#discussion_r4214885330`<br>実体は RC-4 と RC-5 で評価する<br>目次自体に追加の修正要求はない |
| [ ] | RC-3 | 4214883108 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Codex も同じ非リアクティブな `Date.now()` を指摘している<br>`EventEdit.vue:318` の `isDraftEventStartInPast`<br>画面滞在中に開始時刻を過ぎるとボタン無効化が遅れる<br>時計のリアクティブ化か開始時刻での再評価の二択で、未着手 |
| [ ] | RC-4 | 4214885266 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Copilot は同じ時刻経過の再計算漏れを [must] で指摘している<br>`EventEdit.vue:318`。押下時検証ではステップは進まない<br>開いた時点で未来だった開始日時が滞在中に過去になると見た目が遅れる<br>定期更新する現在時刻を渡す案。表示の更新間隔は UX 判断のため未着手 |
| [x] | RC-5 | 4214885330 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 等値境界のテストが `rejectPastStartDatetime` 無しで通っていた<br>`eventEditValidationMessages.test.ts` の「現在以降」ケース<br>比較が `<=` に変わっても検知できない<br>フラグを有効にして、開始日時が現在と同じときはメッセージ無しを検証する |

---

**識別子**: RC-1（GitHub id: 6052579010）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル`（本文は `base/src/components/EventEdit.vue:318`）

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `base/src/components/EventEdit.vue:318` の `Date.now()` はリアクティブではないため、画面を開いた時点では未来だった開始日時が滞在中に過去になっても、この computed は再評価されません。その場合「進む」は有効のまま、エラー文言も表示されません（押下時の検証では止まります）。時刻の経過でも判定が更新されるよう、リアクティブな現在時刻を使うことをご検討ください。

**コメント要約**: 画面を開いたまま開始時刻を過ぎると「進む」が有効のまま残る
`EventEdit.vue` の `isDraftEventStartInPast` が `Date.now()` を computed 内で見ている
押下時の検証では進まないが、ボタンとエラー文言は更新されない
定期的な現在時刻か開始時刻での再評価が提案されている。方針が複数あるため未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘は妥当。`computed` は `event` が変わらない限り `Date.now()` を読み直さない。押下時の `collectEventBasicInfoValidationMessages` はクリック時点の `Date.now()` で止めるので、ステップ進行そのものは防げる。開いた時点で既に過去の下書き（今回の報告）は初回評価で「進む」が無効になる。滞在中に時刻をまたぐ場合の見た目だけが遅れる。原文が「ご検討ください」で、Codex は定期更新と開始時刻での再評価の二択を出している。👤 UX のため自動修正しない。

---

**識別子**: RC-2（GitHub id: 5451617821）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: `PR レビュー本文`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

時刻経過だけではボタン状態が更新されず、境界値テストも日時検証を有効化できていません。

<details open>
<summary><strong>2 open findings</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Date.now() が非リアクティブで開始日時判定が更新されない](#discussion_r4214885266) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [rejectPastStartDatetime 未指定で現在時刻境界を検証できない](#discussion_r4214885330) · New

</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

下書きイベントの過去日時によるステップ進行を防ぐ修正です。

**Changes:**
- 過去日時の検証を追加
- 「進む」の無効化とエラー表示を追加
- 境界条件のテストを追加

| File | Description |
| ---- | ----------- |
| `base/​src/​utils/​eventEditValidationMessages.ts` | 過去日時の検証を追加 |
| `base/​src/​utils/​eventEditValidationMessages.test.ts` | 日時検証のテストを追加 |
| `base/​src/​components/​EventEdit.vue` | 進行制御とエラー連携を追加 |
| `base/​src/​components/​eventcreate/​EventBasicInfoCard.vue` | 日付下にエラーを表示 |
</details>

**コメント要約**: Copilot overview は指摘の目次
リンク先は `#discussion_r4214885266` と `#discussion_r4214885330`
実体は RC-4 と RC-5 で評価する
目次自体に追加の修正要求はない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 本文の2件はインライン `#discussion_r4214885266`（RC-4）と `#discussion_r4214885330`（RC-5）にある。overview はそれらの目次で、追加の修正要求はない。

---

**識別子**: RC-3（GitHub id: 4214883108）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/EventEdit.vue:318`

**該当コード（レビュー時点の diff）**:

```diff
@@ -308,6 +309,19 @@ const currentUserStore = useCurrentUserStore()
  */
 const minEventStartDate = computed<string>(() => getReservationLeadTimeMinDateString(Date.now()))

+/** 下書きの開始日時が過去のあいだは step=1 の「進む」を押せない */
+const isDraftEventStartInPast = computed(() => {
+  const ev = event.value
+  if (ev == null || ev.event_status.value !== 'in_draft') {
+    return false
+  }
+  return isEventStartDatetimeInPast(ev.event_start_datetime, Date.now())
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  現在時刻の経過で無効状態を再計算する**

`computed` 内の `Date.now()` はリアクティブな依存ではないため、未来の開始日時で画面を開いたまま開始時刻を過ぎても、この値は再計算されません。その場合、「進む」は有効表示のままでエラーメッセージも出ず、押下後の検証で初めて停止するため、本変更の目的である過去日時でのボタン無効化を満たせません。リアクティブな時計を参照するか、開始時刻に再評価を予約してください。

Useful? React with 👍 / 👎.

**コメント要約**: Codex も同じ非リアクティブな `Date.now()` を指摘している
`EventEdit.vue:318` の `isDraftEventStartInPast`
画面滞在中に開始時刻を過ぎるとボタン無効化が遅れる
時計のリアクティブ化か開始時刻での再評価の二択で、未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-1 と同じ箇所。P2 であり、押下時検証は残っている。修正案が「リアクティブな時計」と「開始時刻に再評価を予約」の二択で、更新間隔や `setTimeout` の上限も仕様判断になる。👤 UX かつ方針が一意でないため自動修正しない。

---

**識別子**: RC-4（GitHub id: 4214885266）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventEdit.vue:318`

**該当コード（レビュー時点の diff）**:

```diff
@@ -308,6 +309,19 @@ const currentUserStore = useCurrentUserStore()
  */
 const minEventStartDate = computed<string>(() => getReservationLeadTimeMinDateString(Date.now()))

+/** 下書きの開始日時が過去のあいだは step=1 の「進む」を押せない */
+const isDraftEventStartInPast = computed(() => {
+  const ev = event.value
+  if (ev == null || ev.event_status.value !== 'in_draft') {
+    return false
+  }
+  return isEventStartDatetimeInPast(ev.event_start_datetime, Date.now())
```

**レビュワーのコメント（原文）**:

[must] `Date.now()` はリアクティブな依存ではないため、この computed はイベント値が変わらない限り再評価されません。画面を開いた時点では未来だった開始日時がそのまま過去になった場合、「進む」は有効のままで開始日の文言も表示されず、完了条件を満たしません（押下時検証だけは止めます）。現在時刻を定期更新するリアクティブ値にし、その値をこの判定へ渡してください。

**コメント要約**: Copilot は同じ時刻経過の再計算漏れを [must] で指摘している
`EventEdit.vue:318`。押下時検証ではステップは進まない
開いた時点で未来だった開始日時が滞在中に過去になると見た目が遅れる
定期更新する現在時刻を渡す案。表示の更新間隔は UX 判断のため未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: [must] だが、進めてしまう不具合ではなく表示の更新遅れ。開いた時点で過去の下書きは初回の computed で「進む」が無効になる。定期更新の間隔は原文に無く、Codex の別案もある。🚨 には上げず、👤 UX のため自動修正しない。

---

**識別子**: RC-5（GitHub id: 4214885330）

**レビュワー**: Copilot

**指摘箇所**: `base/src/utils/eventEditValidationMessages.test.ts:83`

**該当コード（レビュー時点の diff）**:

```diff
@@ -50,6 +50,64 @@ describe('collectEventBasicInfoValidationMessages', () => {
       'event_edit.step1_validation.place_url_invalid',
     ])
   })
+
+  it('開始日時が現在より前なら進むを止めるメッセージを返す', () => {
+    const messages = collectEventBasicInfoValidationMessages({
+      event: {
+        event_postalcode: '1010032',
+        event_address_base: '東京都千代田区岩本町',
+        event_address_detail: '33',
+        event_place_url: '',
+        event_start_datetime: 1_000,
+      },
+      nowMillis: 2_000,
+      rejectPastStartDatetime: true,
+      requiredValidator: alwaysValid,
+      postalCodeValidator: alwaysValid,
+      urlValidator: alwaysValid,
+      t,
+    })
+
+    expect(messages).toEqual(['reservation_request_reason.event_start_past'])
+  })
+
+  it('開始日時が現在以降なら日時のメッセージを返さない', () => {
+    const messages = collectEventBasicInfoValidationMessages({
+      event: {
+        event_postalcode: '1010032',
+        event_address_base: '東京都千代田区岩本町',
+        event_address_detail: '33',
+        event_place_url: '',
+        event_start_datetime: 2_000,
+      },
+      nowMillis: 2_000,
```

**レビュワーのコメント（原文）**:

[must] このケースは `rejectPastStartDatetime` を渡していないため、開始日時が現在以降だから通るのではなく日時検証自体が無効なので通っています。`< now` の境界が誤って `<= now` に変わっても検出できないため、フラグを有効にして等値境界を実際に検証してください。

**コメント要約**: 等値境界のテストが `rejectPastStartDatetime` 無しで通っていた
`eventEditValidationMessages.test.ts` の「現在以降」ケース
比較が `<=` に変わっても検知できない
フラグを有効にして、開始日時が現在と同じときはメッセージ無しを検証する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘どおり、フラグ無しでは比較式を見ていない。`rejectPastStartDatetime: true` を付け、`event_start_datetime === nowMillis` でメッセージが空であることを検証するよう直した。`<=` に変わるとこのテストが落ちる。

---
