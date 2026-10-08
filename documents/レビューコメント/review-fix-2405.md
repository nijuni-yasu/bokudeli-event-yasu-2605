# ブランチ fix/2405 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | 6052579010 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | 画面を開いたまま開始時刻を過ぎると「進む」が有効のまま残る<br>`EventEdit.vue` の `isDraftEventStartInPast` が `Date.now()` を computed 内で見ている<br>押下時の検証では進まないが、ボタンとエラー文言は更新されない<br>定期的な現在時刻か開始時刻での再評価が提案されている。方針が複数あるため未着手 |
| [x] | RC-2 | 5451617821 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘の目次<br>リンク先は `#discussion_r4214885266` と `#discussion_r4214885330`<br>実体は RC-4 と RC-5 で評価する<br>目次自体に追加の修正要求はない |
| [ ] | RC-3 | 4214883108 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Codex も同じ非リアクティブな `Date.now()` を指摘している<br>`EventEdit.vue:318` の `isDraftEventStartInPast`<br>画面滞在中に開始時刻を過ぎるとボタン無効化が遅れる<br>時計のリアクティブ化か開始時刻での再評価の二択で、未着手 |
| [ ] | RC-4 | 4214885266 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | Copilot は同じ時刻経過の再計算漏れを [must] で指摘している<br>`EventEdit.vue:318`。押下時検証ではステップは進まない<br>開いた時点で未来だった開始日時が滞在中に過去になると見た目が遅れる<br>定期更新する現在時刻を渡す案。表示の更新間隔は UX 判断のため未着手 |
| [x] | RC-5 | 4214885330 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 等値境界のテストが `rejectPastStartDatetime` 無しで通っていた<br>`eventEditValidationMessages.test.ts` の「現在以降」ケース<br>比較が `<=` に変わっても検知できない<br>フラグを有効にして、開始日時が現在と同じときはメッセージ無しを検証する |
| [x] | RC-6 | 5452539661 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘の目次<br>新しいリンク先は `#discussion_r4215661884`、既存は `#discussion_r4214885266`<br>実体は RC-4 と RC-9 で評価する<br>目次自体に追加の修正要求はない |
| [x] | RC-7 | 4215671308 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 選択肢 2 を削除して追加すると「選択肢 3」が重複する<br>`addOption` が配列長 + 1 を番号にしていた<br>同じラベルの選択肢が保存できる<br>既存ラベルと重ならない番号を初期値にする |
| [x] | RC-8 | 4215671313 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | コミュニティを切り替えると自動生成したフォーム名が前の名前のまま残る<br>`name` が空でないと初期値の更新を止めていた<br>保存先だけ新しいコミュニティになる<br>自動生成のままなら新しいコミュニティ名へ更新する |
| [x] | RC-9 | 4215661884 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 長いコミュニティ名では「のフォーム」まで切り捨てられる<br>`formatDefaultFormName` が整形後の文字列全体を slice していた<br>上限 100 文字の名前で接尾辞が消える<br>接尾辞の長さを残してコミュニティ名だけ切り詰める |

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

## 評価セッション（2026-10-08 15:40・review-comments-evaluate）

- **評価日時**: 2026-10-08 15:40 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `fix/2405`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2406
- **since**: 2026-10-08T06:29:15Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（6053870895 レビュー依頼定型文、5452552320 Codex の suggestions 定型と接続案内のみ）
- **重複除外**: 4215671299 → RC-3 および RC-4、差分なし。6053984728 → RC-4・RC-7・RC-8・RC-9 の再掲、差分なし
- **手順 4a 自動修正**: RC-7・RC-8・RC-9（🚨 0件 / 🟡 3件）。RC-1・RC-3・RC-4 は 👤 UX と方針が複数のため自動修正しない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-6 | 5452539661 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘の目次<br>新しいリンク先は `#discussion_r4215661884`、既存は `#discussion_r4214885266`<br>実体は RC-4 と RC-9 で評価する<br>目次自体に追加の修正要求はない |
| [x] | RC-7 | 4215671308 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 選択肢 2 を削除して追加すると「選択肢 3」が重複する<br>`addOption` が配列長 + 1 を番号にしていた<br>同じラベルの選択肢が保存できる<br>既存ラベルと重ならない番号を初期値にする |
| [x] | RC-8 | 4215671313 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | コミュニティを切り替えると自動生成したフォーム名が前の名前のまま残る<br>`name` が空でないと初期値の更新を止めていた<br>保存先だけ新しいコミュニティになる<br>自動生成のままなら新しいコミュニティ名へ更新する |
| [x] | RC-9 | 4215661884 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 長いコミュニティ名では「のフォーム」まで切り捨てられる<br>`formatDefaultFormName` が整形後の文字列全体を slice していた<br>上限 100 文字の名前で接尾辞が消える<br>接尾辞の長さを残してコミュニティ名だけ切り詰める |

---

**識別子**: RC-6（GitHub id: 5452539661）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR review overview

**該当コード**:

```
### 🟡 Changes recommended
時刻経過でボタン状態が更新されず、長いコミュニティ名では指定されたフォーム名の接尾辞が欠落します。
リンク: #discussion_r4215661884 #discussion_r4214885266
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

時刻経過でボタン状態が更新されず、長いコミュニティ名では指定されたフォーム名の接尾辞が欠落します。

<details open>
<summary><strong>2 open findings</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [長いコミュニティ名でフォームの接尾辞が切り詰められる](#discussion_r4215661884) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Date.now() が非リアクティブで開始日時判定が更新されない](#discussion_r4214885266)
</details>

🧠 **Review effort:** Balanced

---

Give feedback about Copilot approvals in [this survey](https://survey.alchemer.com/s3/9011660/CCR-Public-Preview-Autoapprove-feedback-survey) to enter a drawing for a $150 gift card.

**コメント要約**: Copilot overview は指摘の目次
新しいリンク先は `#discussion_r4215661884`、既存は `#discussion_r4214885266`
実体は RC-4 と RC-9 で評価する
目次自体に追加の修正要求はない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 目次であり、リンク先のインラインは RC-4 と RC-9 で評価する。目次自体に別の修正要求はない。

---

**識別子**: RC-7（GitHub id: 4215671308）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/forms/FormFieldsEditor.vue:109`

**該当コード**:

```
@@ -101,7 +104,10 @@ const removeField = (): void => {
 const addOption = (index: number): void => {
   const options = [...(editableFields.value[index].options ?? [])]
   if (options.length >= FORM_FIELD_LIMITS.maxOptions) return
-  options.push({ label: '', hidden_for_new: false })
+  options.push({
+    label: $t('manage.forms.default_option_label', { number: options.length + 1 }),
+    hidden_for_new: false,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  削除後に追加する選択肢の初期ラベルを重複させない**

初期状態の「選択肢 1〜3」から中央の「選択肢 2」を削除して追加ボタンを押すと、現在の配列長は 2 なので再び「選択肢 3」が追加され、同じラベルが2件になります。選択肢ラベルの重複は保存時にも拒否されないため、そのまま参加者に区別不能な選択肢を表示できてしまいます。既存ラベルと衝突しない番号を選ぶなど、削除後も一意になる初期値を生成してください。

**コメント要約**: 選択肢 2 を削除して追加すると「選択肢 3」が重複する
`addOption` が配列長 + 1 を番号にしていた
同じラベルの選択肢が保存できる
既存ラベルと重ならない番号を初期値にする

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 配列長ではなく、既存ラベルに無い「選択肢 N」を選ぶ。`nextDefaultOptionNumber` で「選択肢 1」「選択肢 3」の次は 2、「選択肢 1」「選択肢 2」「選択肢 3」の次は 4 になることをテストした。

---

**識別子**: RC-8（GitHub id: 4215671313）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/manage/community/CommunityFormEditor.vue:49`

**該当コード**:

```
@@ -40,6 +41,25 @@ const communityStore = computed(() => createCommunityStore(communityAccount.valu
 const communityId = computed(() => communityStore.value.community?.community_id ?? '')

 const name = ref('')
+
+watch(
+  () => communityStore.value.community?.community_name ?? '',
+  (communityName) => {
+    if (props.formId != null || name.value !== '') {
+      return
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  コミュニティ切替時に自動生成したフォーム名を更新する**

同じ `/manage/community/:communityAccount/form/new` ルート上でコミュニティ A から B へ直接遷移すると Vue Router はコンポーネントを再利用するため、B の `community_name` を受け取っても、A 用に設定済みの `name.value` が空でないことでここから早期 return します。その後の保存先 `communityId` は B に切り替わる一方、フォーム名は「Aのフォーム」のままになり、別コミュニティ名を含むフォームが作成されます。手入力済みの名前は維持しつつ、自動生成値のままなら `communityAccount` の変更時に新しいコミュニティ名へ更新してください。

**コメント要約**: コミュニティを切り替えると自動生成したフォーム名が前の名前のまま残る
`name` が空でないと初期値の更新を止めていた
保存先だけ新しいコミュニティになる
自動生成のままなら新しいコミュニティ名へ更新する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 最後に自動生成した文字列を覚えておき、フォーム名がそれと一致するあいだはコミュニティ名の更新に追従する。手入力で一致しなくなった名前は上書きしない。既存フォーム（`formId` あり）は対象外。

---

**識別子**: RC-9（GitHub id: 4215661884）

**レビュワー**: Copilot

**指摘箇所**: `base/src/utils/formFieldEditor.ts:17`

**該当コード**:

```
@@ -1,7 +1,31 @@
 import type { FormFieldInput } from '@shokujii/common/apis/form.js'
 import { isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'

-export function changeFormFieldType(field: FormFieldInput, type: FormFieldInput['type']): FormFieldInput {
+export function formatDefaultFormName(
+  communityName: string,
+  format: (communityName: string) => string,
+  maxLength: number,
+): string {
+  const trimmed = communityName.trim()
+  if (trimmed === '') {
+    return ''
+  }
+  const name = format(trimmed)
+  if (name.length <= maxLength) {
+    return name
+  }
+  return name.slice(0, maxLength)
```

**レビュワーのコメント（原文）**:

[must] 上限超過時に整形後の文字列全体を `slice` すると、例えば100文字のコミュニティ名では接尾辞「のフォーム」がすべて消え、Issue #2410 の初期値「{コミュニティ名}のフォーム」を満たしません。固定文言分の長さを予約してコミュニティ名部分だけを切り詰め、長さテストでも接尾辞が残ることを検証してください。

**コメント要約**: 長いコミュニティ名では「のフォーム」まで切り捨てられる
`formatDefaultFormName` が整形後の文字列全体を slice していた
上限 100 文字の名前で接尾辞が消える
接尾辞の長さを残してコミュニティ名だけ切り詰める

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 整形結果がコミュニティ名で始まるときは、末尾の接尾辞を残して名前側だけを上限まで切る。100 文字の名前でも結果が「のフォーム」で終わることをテストした。

---
