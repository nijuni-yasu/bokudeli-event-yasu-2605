# ブランチ feat/2391 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📋 仕様追加 | S | 詳細カードの12人は members 配列の先頭である<br>注文の並びで選ばないため、後から参加した人がアバターに出ない |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | S | メニュー購読がメニューを表示しない event store でも始まる<br>一覧の listener がイベント数だけ残り、今回の枯渇対策と逆方向になる |
| [x] | RC-3 | 5977222000 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | プレビュー選択が注文の古い順になっている<br>`selectPreviewMemberIds` の昇順比較<br>PR 本文の「新しい順」とは逆だが、既存の詳細カードも昇順である<br>並びを反転せず、既存の表示順を維持する |
| [x] | RC-4 | 5404597170 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘本文ではなく目次<br>購読上限と注文順の3件はインライン側で評価する<br>目次自体に追加の修正要求はない |
| [ ] | RC-5 | 4176402553 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | コミット停止条件に gh 未認証が含まれていない<br>AGENTS.md の Git ルールと issue-resolution.md<br>未認証の環境では「コミットして」が手順どおり完走しない<br>番号なしで進めるか、停止条件へ認証不足を明記するかは方針が二つある |
| [x] | RC-6 | 4176396332 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 詳細カードの参加者表示も注文の古い順のままである<br>EventDetailsCard の members 並び<br>development でも同じ昇順で、プレビュー選択と一致している<br>画面の並びを新しい順へ変える必要はない |
| [ ] | RC-7 | 4176402548 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | コミュニティ購読がエラーで終わると再接続しない<br>chatRoomDisplay の ensureCommunityListener<br>参加者一覧ボタンがセッション中消えたままになる<br>再試行を足すか、失敗した購読をマップから外すかは実装が分かれる |
| [x] | RC-8 | 4176396346 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 上限超えのとき古い注文の参加者がプレビューに残る<br>selectPreviewMemberIds の昇順<br>これは詳細カードと同じ順で、テストもその順を期待している<br>降順への変更は既存の表示順を反転する |
| [x] | RC-9 | 4176402547 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 注文のない参加者と古い注文が先頭12人に入る<br>selectPreviewMemberIds の比較<br>詳細カードの既存順と一致しており、PR 本文の「新しい順」が説明違いである<br>並びの反転はしない |
| [ ] | RC-10 | 4176396351 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | プレビュー対象が変わっても外れた users 購読が残る<br>previewMembers が buildMembers するたびに useUserStore が増える<br>注文更新で選出が変わると購読が12人を超えて累積し得る<br>共有 store の解除は他画面にも効くため、解除方法は未着手のまま |
| [ ] | RC-11 | 4176402545 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 注文取得後に別の12人へ切り替わっても前の購読が残る<br>getMemberUserStore が作った useUserStore<br>同時購読を12人に抑える対策が注文更新で崩れる<br>解除は Pinia の共有 store に波及するため、この評価では直していない |

---

## 評価セッション（2026-10-04 00:02・shokujii-code-review）

- **評価日時**: 2026-10-04 00:02 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/2391
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📋 仕様追加 | S | 詳細カードの12人は members 配列の先頭である<br>注文の並びで選ばないため、後から参加した人がアバターに出ない |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | S | メニュー購読がメニューを表示しない event store でも始まる<br>一覧の listener がイベント数だけ残り、今回の枯渇対策と逆方向になる |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/event.ts:349`

**該当コード（レビュー時点の diff）**:

```diff
+    /** イベント詳細の初期表示用。人数に比例して users 購読を張らない */
+    const previewMembers = computed<BokudeliEventMember[] | null>(() => {
+      if (_memberIds.value == null) {
+        return null
+      }
+      return buildMembers(_memberIds.value.slice(0, EVENT_DETAIL_MEMBER_PREVIEW_LIMIT))
+    })
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📋仕様追加/S]: イベント詳細の参加者プレビューは `_memberIds` の先頭 12 人だけ `useUserStore` している。カード側の sort はその 12 人の中だけで、注文 `updated_at` が新しくても配列の後ろにいる人はアバターに出ない。見出しの人数は `event.members.length` の全員分なので、一覧と顔ぶれが食い違う。 → `member_orders` は 1 購読のまま読み、詳細カードと同じ並びの先頭 12 人だけ user 購読する。注文未取得の間だけ配列先頭でよい。

**コメント要約**: 詳細カードの12人は members 配列の先頭である
注文の並びで選ばないため、後から参加した人がアバターに出ない

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: S

**判断理由**: #2391 段階2は初期表示の user 購読を上限することで満たしている。誰を残すかは仕様に無いため必須修正にはしない。参加者が自分をカード上で見つけられないので、表示順と選択順を揃える余地がある。対応として `selectPreviewMemberIds` を追加し、注文未取得の間は配列先頭、取得後は詳細カードと同じ順の先頭だけ `useUserStore` する。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/event.ts:667`

**該当コード（レビュー時点の diff）**:

```diff
           _eventRef.value = eventRef
           subscribeEvent(eventRef)
-          // 遅延評価なので以下を呼ぶ必要はない
-          // subscribeOrders(eventRef)
+          // メニューは computed の副作用にしない。失敗時に再評価されずスピナーが残るため
+          subscribeMenus(eventRef)
         })
...
     } else {
-      subscribeEvent(toRaw(_eventRef.value))
+      const eventRef = toRaw(_eventRef.value)
+      subscribeEvent(eventRef)
+      subscribeMenus(eventRef)
     }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: `subscribeMenus` を event ref 解決の直後に必ず呼んでいる。メニューを表示しないコミュニティ一覧や管理一覧の `useEventStore` でも `menus` の onSnapshot が Pinia store の寿命まで残る。今回の不具合は listener の積み上がりが原因なので、閲覧したイベント数だけ購読が増えるのは逆方向になる。 → 初回の `ensure` は `menus` 参照か `getLoadedMenus` のときだけにする。失敗後の張り直しは `createFirestoreListenRetry` が行うので、computed の再評価には依存しない。Issue の「computed の副作用から外す」はその形でも満たせる。

**コメント要約**: メニュー購読がメニューを表示しない event store でも始まる
一覧の listener がイベント数だけ残り、今回の枯渇対策と逆方向になる

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: #2391 段階1は購読を computed の副作用から外し、失敗時に再試行することである。store 初期化で全消費者に張るのはその一実装であり、イベント詳細のスピナー解消には十分である。一覧への波及は別の listener 増なので、初回参照に寄せるかは実装判断として残す。対応として `menus` 参照と `getLoadedMenus` のときだけ購読を始め、event ref が後から解決した場合もその要求があるときだけ張る。失敗後の張り直しは `createFirestoreListenRetry` のまま。

---

## 評価セッション（2026-10-04 15:24・review-comments-evaluate）

- **評価日時**: 2026-10-04 15:24 JST
- **評価者**: Cursor Agent（review-comments-evaluate）
- **ブランチ名**: feat/2391
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2394
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（5977199548 レビュー依頼定型文、5977199829 Codex の完了サマリと接続案内、5404603367 Codex review 本文が接続案内のみ）
- **重複除外**: なし
- **partial**: false
- **手順 4a 自動修正**: なし（RC-5 は方針が二つ、RC-7 は 👤 UX かつ方針が二つ、RC-10 と RC-11 は共有 store の解除方法が仕様判断）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-3 | 5977222000 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | プレビュー選択が注文の古い順になっている<br>`selectPreviewMemberIds` の昇順比較<br>PR 本文の「新しい順」とは逆だが、既存の詳細カードも昇順である<br>並びを反転せず、既存の表示順を維持する |
| [x] | RC-4 | 5404597170 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview は指摘本文ではなく目次<br>購読上限と注文順の3件はインライン側で評価する<br>目次自体に追加の修正要求はない |
| [ ] | RC-5 | 4176402553 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📄 ドキュメントのみ | S | コミット停止条件に gh 未認証が含まれていない<br>AGENTS.md の Git ルールと issue-resolution.md<br>未認証の環境では「コミットして」が手順どおり完走しない<br>番号なしで進めるか、停止条件へ認証不足を明記するかは方針が二つある |
| [x] | RC-6 | 4176396332 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 詳細カードの参加者表示も注文の古い順のままである<br>EventDetailsCard の members 並び<br>development でも同じ昇順で、プレビュー選択と一致している<br>画面の並びを新しい順へ変える必要はない |
| [ ] | RC-7 | 4176402548 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | コミュニティ購読がエラーで終わると再接続しない<br>chatRoomDisplay の ensureCommunityListener<br>参加者一覧ボタンがセッション中消えたままになる<br>再試行を足すか、失敗した購読をマップから外すかは実装が分かれる |
| [x] | RC-8 | 4176396346 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 上限超えのとき古い注文の参加者がプレビューに残る<br>selectPreviewMemberIds の昇順<br>これは詳細カードと同じ順で、テストもその順を期待している<br>降順への変更は既存の表示順を反転する |
| [x] | RC-9 | 4176402547 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 注文のない参加者と古い注文が先頭12人に入る<br>selectPreviewMemberIds の比較<br>詳細カードの既存順と一致しており、PR 本文の「新しい順」が説明違いである<br>並びの反転はしない |
| [ ] | RC-10 | 4176396351 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | プレビュー対象が変わっても外れた users 購読が残る<br>previewMembers が buildMembers するたびに useUserStore が増える<br>注文更新で選出が変わると購読が12人を超えて累積し得る<br>共有 store の解除は他画面にも効くため、解除方法は未着手のまま |
| [ ] | RC-11 | 4176402545 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 注文取得後に別の12人へ切り替わっても前の購読が残る<br>getMemberUserStore が作った useUserStore<br>同時購読を12人に抑える対策が注文更新で崩れる<br>解除は Pinia の共有 store に波及するため、この評価では直していない |
---

**識別子**: RC-3（GitHub id: 5977222000）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `base/src/stores/event.ts:88` の比較が昇順のため `slice(0, limit)` は注文日時が古い参加者（注文なしは 0）を選びます。PR本文の「注文の新しい順の先頭」と逆なので、降順にし、テストも最新注文の参加者が選ばれることを確認してください。この環境では既存コメントへの返信のみ可能で、Files changed への新規インラインコメントは投稿できません。

**コメント要約**: プレビュー選択が注文の古い順になっている。`selectPreviewMemberIds` の昇順比較。PR 本文の「新しい順」とは逆だが、既存の詳細カードも昇順である。並びを反転せず、既存の表示順を維持する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: development の EventDetailsCard は注文 updated_at の昇順である。selectPreviewMemberIds とテストは「詳細カードと同じ順の先頭」を選んでおり、PR 本文の「新しい順」は説明の誤りである。並びを反転すると既存のイベント詳細の顔ぶれが逆になる。


---

**識別子**: RC-4（GitHub id: 5404597170）

**レビュワー**: Copilot

**指摘箇所**: `PR レビュー本文`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

参加者プレビューの購読上限が保証されず、注文順も要件と逆になっています。

**Review effort:** Balanced  
**Findings:** 3 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [画面表示順が昇順で古い注文から表示される](#discussion_r4176396332) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文参加者の選択順が昇順で新しい注文が除外される](#discussion_r4176396346) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [対象外ユーザーの購読解除漏れで購読数が累積する](#discussion_r4176396351) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Firestore 購読の安定化、チャット参加者導線、参加者・カート UI を改善する PR です。

**Changes:**
- メニュー・バナー購読の再試行と参加者プレビュー上限を追加
- チャットに参加者ドロワーと一覧ページ導線を追加
- 参加者カード、カート説明、Git 運用手順を更新

| File | Description |
| ---- | ----------- |
| `user/​src/​router/​utils.ts` | 参加者一覧パスを追加 |
| `user/​src/​pages/​chat/​index.vue` | 一覧への遷移を接続 |
| `user/​src/​pages/​chat/​[roomId].vue` | 個別チャット画面にも遷移を接続 |
| `enterprise/​src/​router/​utils.ts` | 参加者一覧パスを追加 |
| `enterprise/​src/​pages/​chat/​index.vue` | 一覧への遷移を接続 |
| `enterprise/​src/​pages/​chat/​[roomId].vue` | 個別チャット画面にも遷移を接続 |
| `documents/​レビューコメント/​review-feat-2391.md` | セルフレビュー記録を追加 |
| `documents/​05_コミュニケーションと通知/​01_チャット機能_01.md` | チャット参加者 UI の仕様を追記 |
| `base/​src/​utils/​visibleCountWithinLines.ts` | タグ表示行数の計算を追加 |
| `base/​src/​utils/​visibleCountWithinLines.test.ts` | 行数計算をテスト |
| `base/​src/​utils/​groupEventMemberOrders.ts` | 注文メニュー集約を共通化 |
| `base/​src/​utils/​groupEventMemberOrders.test.ts` | 注文集約をテスト |
| `base/​src/​utils/​firestoreListenRetry.ts` | Firestore 購読再試行を追加 |
| `base/​src/​utils/​firestoreListenRetry.test.ts` | 再試行・停止条件をテスト |
| `base/​src/​utils/​displayMemberName.ts` | ゲスト名判定を追加 |
| `base/​src/​utils/​displayMemberName.test.ts` | 表示名判定をテスト |
| `base/​src/​utils/​chatEventParticipantsVisibility.ts` | チャット参加者の表示条件を追加 |
| `base/​src/​utils/​chatEventParticipantsVisibility.test.ts` | 表示条件をテスト |
| `base/​src/​stores/​event.ts` | メニュー・注文購読と参加者プレビューを変更 |
| `base/​src/​stores/​event.test.ts` | 遅延購読とプレビュー選択をテスト |
| `base/​src/​stores/​community.ts` | converter 付き参照を公開 |
| `base/​src/​stores/​chatRoomDisplay.ts` | イベント・コミュニティ表示情報を購読 |
| `base/​src/​stores/​chatEventParticipants.ts` | ドロワー表示中のユーザー購読を追加 |
| `base/​src/​stores/​chat.ts` | 参加者表示情報をチャット状態へ保持 |
| `base/​src/​stores/​banner.ts` | バナー購読の再試行を追加 |
| `base/​src/​locales/​messages/​ja.ts` | 新しい日本語文言を追加 |
| `base/​src/​composable/​useChatOpenEvent.ts` | 参加者一覧への遷移処理を追加 |
| `base/​src/​components/​UserBioPanel.vue` | 名前と SNS 表示を調整 |
| `base/​src/​components/​pages/​cart.vue` | 主催者負担説明をヘルプへ移動 |
| `base/​src/​components/​pages/​c/​[communityAccount]/​e/​[eventId]/​members.vue` | 参加者一覧レイアウトを刷新 |
| `base/​src/​components/​EventMemberList.vue` | 注文集約 util を利用 |
| `base/​src/​components/​EventMemberCard.vue` | 席札型カードへ刷新 |
| `base/​src/​components/​EventDetailsCard.vue` | 上限制の参加者プレビューへ変更 |
| `base/​src/​components/​CommunityBillHelpButton.vue` | 主催者負担説明ダイアログを追加 |
| `base/​src/​components/​chat/​types.ts` | 参加者メタデータ型を追加 |
| `base/​src/​components/​chat/​ChatEventParticipantsDrawer.vue` | 参加者ドロワーを追加 |
| `base/​src/​components/​chat/​ChatApp.vue` | 参加者ボタンとドロワーを統合 |
| `AGENTS.md` | コミット実行ルールを明確化 |
| `.agents/​skills/​git-squash/​SKILL.md` | squash の自動実行方針を更新 |
| `.agents/​skills/​git-split-commit/​SKILL.md` | 分割コミットの実行モードを追加 |
| `.agents/​skills/​git-fixup/​SKILL.md` | fixup の自動実行方針を更新 |
| `.agents/​skills/​git-commit-workflow/​SKILL.md` | 承認待ちなしの実行手順へ変更 |
| `.agents/​skills/​git-commit-workflow/​references/​classification.md` | 判断不能時の扱いを更新 |
| `.agents/​skills/​git-commit-message/​SKILL.md` | 呼び出し元との責務を明確化 |
| `.agents/​skills/​git-commit-message/​references/​issue-resolution.md` | Issue 不確定時の処理を更新 |
</details>

---

💡 Configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

**コメント要約**: Copilot overview は指摘本文ではなく目次。購読上限と注文順の3件はインライン側で評価する。目次自体に追加の修正要求はない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 本文の #discussion_r4176396332、#discussion_r4176396346、#discussion_r4176396351 はインラインとして取得でき、それぞれ RC-6、RC-8、RC-10 で評価する。目次の要約以外に追加の修正要求はない。


---

**識別子**: RC-5（GitHub id: 4176402553）

**レビュワー**: Codex

**指摘箇所**: `AGENTS.md:207`

**該当コード（レビュー時点の diff）**:

```diff
@@ -203,6 +204,8 @@ PR verify（`pr-verify.yml`）と同じ verify:functions-deploy / build / lint /
 
 ## Git ルール
 
+- 「コミットして」「コミットお願い」「コミット整理して」「レビュー修正をコミットに反映して」「fixupして」「squashして」「分割コミットして」「コミットを分けて」は実行依頼である。メッセージ・分割案・吸収先の承認を待たず、`/git-commit-workflow` を同じターンで最後まで実行する。止めるのは `main` / `development` への直コミット、`tree/` 上（先に作業ブランチを切る）、秘密情報、rebase コンフリクトのときだけ。分類が判断不能のとき、およびイシュー候補が一つに決まらないときは、確認せず新規コミット・番号なしで進める
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  gh 未認証時は番号なしでコミットを続行する**

新しいルールはコミット実行依頼を同じターンで完走し、停止条件を保護ブランチ・`tree/`・秘密情報・rebase コンフリクトに限定していますが、全新規コミットが通る `issue-resolution.md` は依然として `gh` 未認証時に中断するよう要求しています。`GH_TOKEN` がない環境では通常の「コミットして」でも必ず途中停止して今回の変更目的を満たせないため、認証不足時は Issue 番号なしへフォールバックするか、停止条件の記述と処理を一致させてください。

AGENTS.md reference: [AGENTS.md:L207-L207](https://github.com/nijuniinc/bokudeli-event-new/blob/37617a7408a3d3cc932e71627f221e1340c48e7e/AGENTS.md#L207-L207)

Useful? React with 👍 / 👎.

**コメント要約**: コミット停止条件に gh 未認証が含まれていない。AGENTS.md の Git ルールと issue-resolution.md。未認証の環境では「コミットして」が手順どおり完走しない。番号なしで進めるか、停止条件へ認証不足を明記するかは方針が二つある。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: この PR の AGENTS.md 更新は停止条件を保護ブランチ、tree/、秘密情報、rebase コンフリクトに限っている。issue-resolution.md は gh 認証不足で中断する。指摘はフォールバックと停止条件の追記を併記しており、どちらに揃えるかは手順の正本の判断なので自動修正しない。


---

**識別子**: RC-6（GitHub id: 4176396332）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventDetailsCard.vue:149`

**該当コード（レビュー時点の diff）**:

```diff
@@ -94,12 +98,59 @@ const twitterHashTagSearchUrl = computed(() => {
 // TODO コンポーネントを分割する
 const eventStore = useAppEventStore(props.event)
 
-const members = computed(() =>
-  [...(eventStore.members ?? [])].sort(
-    (a, b) =>
-      a.orders.reduce((max, order) => Math.max(max, order.updated_at), 0) -
-      b.orders.reduce((max, order) => Math.max(max, order.updated_at), 0),
-  ),
+/** メニュー購読より後に、人数が多いときの users 購読を始める。メニューが来ないときも待ち続けない */
+const MEMBER_PREVIEW_FALLBACK_MS = 2000
+const allowMemberListeners = ref(false)
+let memberPreviewFallbackTimer: ReturnType<typeof setTimeout> | undefined
+
+const clearMemberPreviewFallback = () => {
+  if (memberPreviewFallbackTimer != null) {
+    clearTimeout(memberPreviewFallbackTimer)
+    memberPreviewFallbackTimer = undefined
+  }
+}
+
+const participantCount = computed(() => props.event.members.length)
+
+const enableMemberListeners = () => {
+  allowMemberListeners.value = true
+  clearMemberPreviewFallback()
+}
+
+watch(
+  [() => eventStore.menus, participantCount],
+  ([menus, count]) => {
+    // 少人数は従来どおりすぐ購読する。多人数はメニュー購読のあと（または待っても来ないとき）に限る
+    if (menus != null || count <= EVENT_DETAIL_MEMBER_PREVIEW_LIMIT) {
+      enableMemberListeners()
+    }
+  },
+  { immediate: true },
+)
+
+onMounted(() => {
+  if (allowMemberListeners.value) {
+    return
+  }
+  memberPreviewFallbackTimer = setTimeout(() => {
+    enableMemberListeners()
+  }, MEMBER_PREVIEW_FALLBACK_MS)
+})
+
+onUnmounted(() => {
+  clearMemberPreviewFallback()
+})
+
+const members = computed(() => {
+  if (!allowMemberListeners.value) {
+    return []
+  }
+  const preview = eventStore.previewMembers ?? []
+  return [...preview].sort((a, b) => latestOrderUpdatedAt(a.orders) - latestOrderUpdatedAt(b.orders))
```

**レビュワーのコメント（原文）**:

[must] ここでも `updated_at` を昇順に並べ直しているため、選択処理を修正しても画面上は古い注文から表示され、PR 説明の「注文の新しい順」になりません。`latestOrderUpdatedAt(b.orders) - latestOrderUpdatedAt(a.orders)` の降順にしてください。

**コメント要約**: 詳細カードの参加者表示も注文の古い順のままである。EventDetailsCard の members 並び。development でも同じ昇順で、プレビュー選択と一致している。画面の並びを新しい順へ変える必要はない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 差分前の members も latest updated_at の昇順である。今回の sort はその比較を latestOrderUpdatedAt に置き換えただけで、表示順は変えていない。RC-3 と同じく、PR 本文に合わせた降順化は既存画面の反転になる。


---

**識別子**: RC-7（GitHub id: 4176402548）

**レビュワー**: Codex

**指摘箇所**: `base/src/stores/chatRoomDisplay.ts:120`

**該当コード（レビュー時点の diff）**:

```diff
@@ -31,6 +82,93 @@ const notifySubscribers = (key: string, meta: RoomDisplayMeta): void => {
   }
 }
 
+const notifyCommunity = (communityId: string): void => {
+  const keys = eventKeysByCommunity.get(communityId)
+  if (keys == null) {
+    return
+  }
+  for (const key of keys) {
+    notifySubscribers(key)
+  }
+}
+
+const ensureCommunityListener = (communityId: string): void => {
+  if (communityListeners.has(communityId)) {
+    return
+  }
+  const unsubscribe = onSnapshot(
+    getCommunityRef(communityId),
+    (snapshot) => {
+      try {
+        if (!snapshot.exists()) {
+          showMemberByCommunity.set(communityId, false)
+        } else {
+          showMemberByCommunity.set(communityId, snapshot.data().is_show_member)
+        }
+      } catch (err) {
+        console.error(err)
+        reportClientError(err, { documentPath: `communities/${communityId}`, severity: 'warn' })
+        showMemberByCommunity.set(communityId, false)
+      }
+      notifyCommunity(communityId)
+    },
+    (err) => {
+      console.error('subscribe community for chat participants', err)
+      reportClientError(err, { documentPath: `communities/${communityId}`, severity: 'warn' })
+      showMemberByCommunity.set(communityId, false)
+      notifyCommunity(communityId)
+    },
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  コミュニティ購読の終了エラーから再接続する**

user/enterprise のチャットでコミュニティ購読が `resource-exhausted` などの再試行可能なエラーで終了すると、ここでは `isShowMember` を `false` にするだけで、終了済みの購読が `communityListeners` に残ります。そのため同じコミュニティのルームが購読され続ける間は `ensureCommunityListener` が再接続せず、参加者一覧ボタンがセッション中ずっと消えたままになります。今回追加した `createFirestoreListenRetry` をこの購読にも適用するか、エラー時にマップから削除して再購読できる状態にしてください。

Useful? React with 👍 / 👎.

**コメント要約**: コミュニティ購読がエラーで終わると再接続しない。chatRoomDisplay の ensureCommunityListener。参加者一覧ボタンがセッション中消えたままになる。再試行を足すか、失敗した購読をマップから外すかは実装が分かれる。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: エラーコールバックは showMember を false にするだけで communityListeners に終了済みの購読を残す。ensureCommunityListener はマップにあれば再接続しない。指摘は createFirestoreListenRetry の適用と、マップから外す再購読の二案なので、方針が一意になるまで自動修正しない。


---

**識別子**: RC-8（GitHub id: 4176396346）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/event.ts:89`

**該当コード（レビュー時点の diff）**:

```diff
@@ -53,6 +54,41 @@ import { uploadImage, convertStoragePathToURL } from '@shokujii/base/utils/stora
 
 const TINYMCE_MAX_IMAGE_SIZE = 600
 
+/** イベント詳細で同時に users/{uid} を購読する人数。全員分張るとメニュー・バナー購読が失敗しやすい。 */
+export const EVENT_DETAIL_MEMBER_PREVIEW_LIMIT = 12
+
+/** 詳細カードの並びと同じ。注文 updated_at の最大。注文が無い参加者は 0。 */
+export const latestOrderUpdatedAt = (orders: readonly { updated_at: number }[]): number => {
+  return orders.reduce((max, order) => Math.max(max, order.updated_at), 0)
+}
+
+/**
+ * イベント詳細に出す参加者 id。
+ * 上限以下はそのまま。注文未取得の間は配列の先頭。取得後は詳細カードと同じ順の先頭だけ。
+ */
+export const selectPreviewMemberIds = (
+  memberIds: readonly string[],
+  orders: readonly { user_id: string; updated_at: number }[] | null,
+  limit: number = EVENT_DETAIL_MEMBER_PREVIEW_LIMIT,
+): string[] => {
+  if (memberIds.length <= limit) {
+    return [...memberIds]
+  }
+  if (orders == null) {
+    return memberIds.slice(0, limit)
+  }
+  const latestByUserId = new Map<string, number>()
+  for (const order of orders) {
+    const latest = latestByUserId.get(order.user_id)
+    if (latest == null || order.updated_at > latest) {
+      latestByUserId.set(order.user_id, order.updated_at)
+    }
+  }
+  return [...memberIds]
+    .sort((memberIdA, memberIdB) => (latestByUserId.get(memberIdA) ?? 0) - (latestByUserId.get(memberIdB) ?? 0))
+    .slice(0, limit)
```

**レビュワーのコメント（原文）**:

[must] PR 説明の「注文の新しい順」と逆順です。この昇順比較では注文なし（0）と古い注文の参加者から `slice` されるため、直近注文の参加者がプレビュー対象外になります。`memberIdB - memberIdA` の降順比較に変更し、対応する期待値も更新してください。

**コメント要約**: 上限超えのとき古い注文の参加者がプレビューに残る。selectPreviewMemberIds の昇順。これは詳細カードと同じ順で、テストもその順を期待している。降順への変更は既存の表示順を反転する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 関数コメントと event.test.ts は詳細カードと同じ昇順の先頭を期待している。development のカードも同じ比較である。#2391 は購読数の上限が主目的で、新しい順への変更は求めていない。


---

**識別子**: RC-9（GitHub id: 4176402547）

**レビュワー**: Codex

**指摘箇所**: `base/src/stores/event.ts:89`

**該当コード（レビュー時点の diff）**:

```diff
@@ -53,6 +54,41 @@ import { uploadImage, convertStoragePathToURL } from '@shokujii/base/utils/stora
 
 const TINYMCE_MAX_IMAGE_SIZE = 600
 
+/** イベント詳細で同時に users/{uid} を購読する人数。全員分張るとメニュー・バナー購読が失敗しやすい。 */
+export const EVENT_DETAIL_MEMBER_PREVIEW_LIMIT = 12
+
+/** 詳細カードの並びと同じ。注文 updated_at の最大。注文が無い参加者は 0。 */
+export const latestOrderUpdatedAt = (orders: readonly { updated_at: number }[]): number => {
+  return orders.reduce((max, order) => Math.max(max, order.updated_at), 0)
+}
+
+/**
+ * イベント詳細に出す参加者 id。
+ * 上限以下はそのまま。注文未取得の間は配列の先頭。取得後は詳細カードと同じ順の先頭だけ。
+ */
+export const selectPreviewMemberIds = (
+  memberIds: readonly string[],
+  orders: readonly { user_id: string; updated_at: number }[] | null,
+  limit: number = EVENT_DETAIL_MEMBER_PREVIEW_LIMIT,
+): string[] => {
+  if (memberIds.length <= limit) {
+    return [...memberIds]
+  }
+  if (orders == null) {
+    return memberIds.slice(0, limit)
+  }
+  const latestByUserId = new Map<string, number>()
+  for (const order of orders) {
+    const latest = latestByUserId.get(order.user_id)
+    if (latest == null || order.updated_at > latest) {
+      latestByUserId.set(order.user_id, order.updated_at)
+    }
+  }
+  return [...memberIds]
+    .sort((memberIdA, memberIdB) => (latestByUserId.get(memberIdA) ?? 0) - (latestByUserId.get(memberIdB) ?? 0))
+    .slice(0, limit)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  更新日時が新しい参加者を先に選ぶ**

参加者が上限を超える場合、この昇順比較では注文のない参加者（`0`）と最も古い `updated_at` の参加者が先頭12人に選ばれ、今回追加する「注文の新しい順」のプレビューから最近注文・参加した人が除外されます。新しい注文を優先するよう比較方向を反転し、注文なしの参加者をどこへ置くかも明示してください。

Useful? React with 👍 / 👎.

**コメント要約**: 注文のない参加者と古い注文が先頭12人に入る。selectPreviewMemberIds の比較。詳細カードの既存順と一致しており、PR 本文の「新しい順」が説明違いである。並びの反転はしない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: RC-8 と同じ比較である。注文なしを 0 として昇順の末尾に置かないのは、詳細カードが注文なしを先頭側に出す既存順に合わせるためである。


---

**識別子**: RC-10（GitHub id: 4176396351）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/event.ts:387`

**該当コード（レビュー時点の diff）**:

```diff
@@ -341,6 +366,25 @@ export const useEventStore = (target: string | BokudeliEvent, options: EventStor
         m.orders = orders
         return m
       })
+    }
+
+    const members = computed<BokudeliEventMember[] | null>(() => {
+      if (_memberIds.value == null) {
+        return null
+      }
+      return buildMembers(_memberIds.value)
+    })
+
+    /** イベント詳細の初期表示用。人数に比例して users 購読を張らない */
+    const previewMembers = computed<BokudeliEventMember[] | null>(() => {
+      if (_memberIds.value == null) {
+        return null
+      }
+      // 並び替えに注文が要る。collection group は 1 購読のまま、user 文書は選んだ人数だけ張る。
+      if (_memberIds.value.length > EVENT_DETAIL_MEMBER_PREVIEW_LIMIT) {
+        subscribeOrders()
+      }
+      return buildMembers(selectPreviewMemberIds(_memberIds.value, _orders.value, EVENT_DETAIL_MEMBER_PREVIEW_LIMIT))
```

**レビュワーのコメント（原文）**:

[must] これは表示人数を 12 人にしているだけで、users 購読数の上限にはなっていません。`_orders` が `null` の初回評価では配列先頭を `buildMembers` して 12 購読を開始し、非同期で注文が届いて別の 12 人が選ばれると追加購読されます。`_memberUserStores` は外れた store を unsubscribe せず、`useUserStore` も明示解除まで購読を維持するため、注文更新のたびに最終的には全参加者分まで累積し得ます。注文取得後に選択対象を一度確定するか、対象差分に応じて不要な user 購読を確実に解除し、同時購読数を上限内に保ってください。

**コメント要約**: プレビュー対象が変わっても外れた users 購読が残る。previewMembers が buildMembers するたびに useUserStore が増える。注文更新で選出が変わると購読が12人を超えて累積し得る。共有 store の解除は他画面にも効くため、解除方法は未着手のまま。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: #2391 の完了条件は初期表示の users 購読を参加者数に比例させないことである。注文未取得の先頭12人と、取得後の別の12人が両方 useUserStore され、外れた側の onSnapshot は残る。useUserStore はユーザー id 単位の共有 Pinia で、unsubscribe は他画面の購読も止める。選出を一度固定するか、プレビュー専用の購読にするかは影響確認が必要なので自動修正しない。


---

**識別子**: RC-11（GitHub id: 4176402545）

**レビュワー**: Codex

**指摘箇所**: `base/src/stores/event.ts:387`

**該当コード（レビュー時点の diff）**:

```diff
@@ -341,6 +366,25 @@ export const useEventStore = (target: string | BokudeliEvent, options: EventStor
         m.orders = orders
         return m
       })
+    }
+
+    const members = computed<BokudeliEventMember[] | null>(() => {
+      if (_memberIds.value == null) {
+        return null
+      }
+      return buildMembers(_memberIds.value)
+    })
+
+    /** イベント詳細の初期表示用。人数に比例して users 購読を張らない */
+    const previewMembers = computed<BokudeliEventMember[] | null>(() => {
+      if (_memberIds.value == null) {
+        return null
+      }
+      // 並び替えに注文が要る。collection group は 1 購読のまま、user 文書は選んだ人数だけ張る。
+      if (_memberIds.value.length > EVENT_DETAIL_MEMBER_PREVIEW_LIMIT) {
+        subscribeOrders()
+      }
+      return buildMembers(selectPreviewMemberIds(_memberIds.value, _orders.value, EVENT_DETAIL_MEMBER_PREVIEW_LIMIT))
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  プレビュー切替時に古いユーザー購読を解除する**

参加者が12人を超える場合、最初の評価では注文が未取得なので先頭12人を `buildMembers` に渡し、その後の注文スナップショットで別の12人へ再評価されます。しかし `getMemberUserStore` が作成した `useUserStore` は自動購読されたままキャッシュされ、選外になったユーザーの購読は解除されません。注文更新で選出メンバーが変わるたびにリスナーが累積し、「同時に users を12人まで」という今回の枯渇対策が成立しないため、選出集合から外れた購読を停止するか、参照数を管理できるローカル購読にしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 注文取得後に別の12人へ切り替わっても前の購読が残る。getMemberUserStore が作った useUserStore。同時購読を12人に抑える対策が注文更新で崩れる。解除は Pinia の共有 store に波及するため、この評価では直していない。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: RC-10 と同じ購読の残りである。Codex は選出集合から外れた購読の停止か、参照数を持つローカル購読かを併記している。共有 store の unsubscribe をそのまま呼ぶとチャットやプロフィールの users 購読も切れるため、この評価では実装しない。

