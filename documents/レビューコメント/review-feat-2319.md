# ブランチ feat/2319 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `clearShopSelectionForDraft` で `_noOrderParticipationSelected` の null 代入が2行重複<br>コピペミス。1行削除 |
| [ ] | RC-2 | 5435157935 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | `countOrderedFoodsForUser` が count aggregation から全件取得+メモリフィルタに変更<br>読み取りコスト増。設計再検討または許容範囲の明記が必要 |
| [ ] | RC-3 | 5435157935 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | メニュー再生成パスで店舗メニュー保存と no-order upsert が別 Transaction<br>片方失敗時の不整合リスク。単一 Transaction 化を検討 |
| [x] | RC-4 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `EventMenu.item_type` の型を `EventItemTypeType` に統一<br>`EventMemberOrder` と揃える |
| [x] | RC-5 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | `buildNoOrderParticipationEventMenu` の menu_name/description を EventItemType 定数化<br>文言・アイコン・ボタン分岐も更新 |
| [x] | RC-6 | 5449283518 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | トグル OFF・未作成時に予約ドキュメントを作成しない<br>`upsertNoOrderParticipationMenu` で early return |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `selectedMenuCount` の直前に `selectedMenuIdsForSave` 用コメントが重複残存<br>誤解を招くコメント。1行削除 |
| [ ] | RC-8 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 📏 規約 | 🔧 微修正 | M | 仕様書 §7.1 で要求されたテストが未追加<br>`EventMemberOrder` の item_type、`addToCart` 排他、`confirmOrder` の user_advance 例外、`minimumParticipantsJudgment` の除外 |
| [ ] | RC-9 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 🔧 微修正 | S | `isPartnerSuppliedItem` が `undefined` を受け入れ `true` を返す<br>仕様書 §5.3 の型定義から逸脱し、item_type 渡し漏れが型で検出できない |
| [x] | RC-10 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | `updateEventMenus` の accepting_order 経路で Transaction の read が write より後<br>選択変更のある保存が必ず失敗する。既読 menus を引数で渡す形に修正 |
| [ ] | RC-11 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📐 リファクタ | M | 品目判定が `menu_id` 比較と `item_type` 判定の二重軸<br>`organizer_menu` が増えたとき排他・文言分岐が漏れる |
| [x] | RC-12 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `memberOrders` の三項演算子の else 側が未使用<br>`addingNoOrder` の分岐内で読むよう整理 |

---

## 評価セッション（2026-08-27 15:25・review-comments-evaluate）

- **評価日時**: 2026-08-27 15:25 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 1、Codex 接続案内 1）
- **partial**: true（Codex substantive レビューなし・limits/connect のみ）
- **REVIEW_REQUEST_SINCE**: 2026-08-27T06:16:18Z
- **手順 4a 自動修正**: RC-1, RC-4（🚨 1件 / 🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `clearShopSelectionForDraft` で `_noOrderParticipationSelected` の null 代入が2行重複<br>コピペミス。1行削除 |
| [ ] | RC-2 | 5435157935 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | `countOrderedFoodsForUser` が count aggregation から全件取得+メモリフィルタに変更<br>読み取りコスト増。設計再検討または許容範囲の明記が必要 |
| [ ] | RC-3 | 5435157935 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | メニュー再生成パスで店舗メニュー保存と no-order upsert が別 Transaction<br>片方失敗時の不整合リスク。単一 Transaction 化を検討 |
| [x] | RC-4 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `EventMenu.item_type` の型を `EventItemTypeType` に統一<br>`EventMemberOrder` と揃える |
| [x] | RC-5 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | `buildNoOrderParticipationEventMenu` の menu_name/description を EventItemType 定数化<br>文言・アイコン・ボタン分岐も更新 |

---

**識別子**: RC-1（GitHub id: 5435157935・Copilot トップレベル内抜粋）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventEdit.vue:418-419`

**該当コード（レビュー時点の diff）**:

```diff
   _userSelectedMenuIds.value = null
+  _noOrderParticipationSelected.value = null
+  _noOrderParticipationSelected.value = null
```

**レビュワーのコメント（原文）**:

**`base/src/components/EventEdit.vue` L418–419**  
`_noOrderParticipationSelected.value = null` が2行連続で重複しています。コピペミスと思われます。1行削除してください。

```ts
// clearShopSelectionForDraft 内
_noOrderParticipationSelected.value = null
_noOrderParticipationSelected.value = null  // ← 削除
```

**コメント要約**: 下書き店舗クリア時に ref リセット行が重複しているコピペミス。<br>1行削除で解消。動作への実害は小さいが明確なバグ。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同一代入の重複は明らかなコピペミス。削除のみで修正方針が一意。手順 4a で自動修正済み。

---

**識別子**: RC-2（GitHub id: 5435157935・Copilot トップレベル内抜粋）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/memberOrder.ts:517-534`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし・トップレベル要約のみ）

**レビュワーのコメント（原文）**:

**`functions/default/src/stores/memberOrder.ts` L517–534（`countOrderedFoodsForUser`）**  
Firestore の count aggregation（`.count().get()`）から全件ドキュメント取得＋メモリフィルタに変更されています。`collectionGroup('member_orders')` はユーザーの注文履歴すべてを対象にするため、アクティブユーザーほど読み取りコストが増大します。

`no_order_participation` を除外するためにこの変更が必要なのは理解できますが、全件取得は過剰です。`.where('menu_id', '!=', NO_ORDER_PARTICIPATION_MENU_ID)` を追加する方法も Firestore の `!=` クエリの制限（`orderBy` 強制）があるため簡単ではありませんが、少なくとも後方互換対応として `.where('item_type', 'in', ['partner_menu'])` を試す余地があります（未設定ドキュメントはヒットしないため別途対処が必要ですが）。  
→ count aggregation に戻す方向で設計を再検討するか、暫定として現実装の許容範囲・想定規模をコメントに明記してください。

**コメント要約**: 注文数カウントが aggregation から全件読み取りに変わりスケール懸念。<br>Firestore クエリ制約下での代替設計または許容根拠の明記が必要。仕様判断を要する。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: パフォーマンス懸念は妥当。ただし `item_type` 未設定ドキュメントの後方互換と Firestore クエリ制約により、count aggregation への単純復帰は設計判断が必要。自動修正対象外（仕様判断）。

---

**識別子**: RC-3（GitHub id: 5435157935・Copilot トップレベル内抜粋）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventMenusSelection.ts:142-159`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし・トップレベル要約のみ）

**レビュワーのコメント（原文）**:

**`functions/default/src/eventMenusSelection.ts` L142–159（メニュー再生成パス）**  
`savePartnerMenusToEventMenus`（内部 Transaction）と `upsertNoOrderParticipationMenu`（別 Transaction）が **2つの独立したトランザクション** で実行されています。前者が成功した後に後者が失敗すると、店舗メニューは更新済みなのに注文なし参加の選択状態だけ旧状態のまま残る不整合が発生します。

`accepting_order` ステータスのパスは単一 Transaction になっているため、再生成パスも同様に原子化することが望ましいです。`savePartnerMenusToEventMenus` に外部 Transaction を受け取るオプションを追加するか、再生成後の no-order upsert を同一トランザクション内で行う設計に変更を検討してください。

**コメント要約**: メニュー再生成時の2 Transaction 実行で中間不整合リスク。<br>`accepting_order` パスと同様の原子化が望ましい。リファクタ工数 M。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 指摘は妥当だが Transaction 統合は API 変更を伴う。工数 M・複数案併記のため自動修正対象外。

---

**識別子**: RC-4（GitHub id: 5435157935・Copilot トップレベル内抜粋）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/EventMenu.ts:62`

**該当コード（レビュー時点の diff）**:

```diff
+  item_type!: (typeof EVENT_ITEM_TYPE_VALUES)[number]
```

**レビュワーのコメント（原文）**:

**`common/src/schemas/EventMenu.ts` L62（`item_type` フィールド型）**  
`EventMenu` クラスのフィールド定義が:

```ts
item_type!: (typeof EVENT_ITEM_TYPE_VALUES)[number]
```

になっていますが、`EventMemberOrder.ts` では `EventItemTypeType` を使っています。同じ型を指しているため動作上は問題ありませんが、`EventItemTypeType` に統一してください。

**コメント要約**: 同一意味の型表記がクラス間で不一致。<br>`EventItemTypeType` への統一で規約整合。手順 4a で自動修正済み。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 型エイリアス統一は一意の修正方針。自動修正実施済み。

---

**識別子**: RC-5（GitHub id: 5435157935・Copilot トップレベル内抜粋）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/eventMenuConverter.ts:82-92`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし・トップレベル要約のみ）

**レビュワーのコメント（原文）**:

**`common/src/utils/eventMenuConverter.ts` L82–92（`buildNoOrderParticipationEventMenu`）**  
`menu_name: '注文なしで参加'`・`menu_description: '食事の注文なしでイベントに参加します。'` がハードコードされています。これらは DB に永続化される値で UI 表示とは別系統ですが、将来的なデータ確認・管理画面での表示を考えると、定数として `EventItemType.ts` 等にまとめておくと変更箇所が1箇所に絞られます。現時点では日本語固定なので緊急度は低いですが、検討をお勧めします。

**コメント要約**: 予約メニューの名称・説明が converter 内ハードコード。<br>定数化は改善だが緊急度低。マージブロッカーではない。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `NO_ORDER_PARTICIPATION_MENU_NAME` / `_DESCRIPTION` を `EventItemType.ts` に定義し converter から参照。参加者向け文言・アイコン（`mdiFoodOffOutline`）・ボタン分岐も同一タスクで更新済み。

---

## 評価セッション（2026-08-27 15:40・review-comments-evaluate）

- **評価日時**: 2026-08-27 15:40 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 1、Codex 接続案内 1）
- **partial**: true（Codex substantive レビューなし）
- **REVIEW_REQUEST_SINCE**: 2026-08-27T06:33:12Z
- **新規 RC なし**: Copilot 5435270180 は前回セッション（RC-1〜RC-5）と同一指摘の再要約。RC-1・RC-4 は push 済み（bc08e60f8, 6182e35bd）で ✅ 対応済みのまま

### RC 一覧（サマリ）

（本セッションで新規 RC なし）

---

## 評価セッション（2026-08-28 15:42・review-comments-evaluate）

- **評価日時**: 2026-08-28 15:42 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 5449274008、Codex 接続案内 5449284375）
- **partial**: true（Codex substantive レビューなし）
- **REVIEW_REQUEST_SINCE**: 2026-08-28T06:34:26Z
- **手順 4a 自動修正**: RC-6（🚨 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-6 | 5449283518 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | トグル OFF・未作成時に予約ドキュメントを作成しない<br>`upsertNoOrderParticipationMenu` で early return |

---

**識別子**: RC-6（GitHub id: 5449283518）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventMenusSelection.ts:27-35`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし・トップレベル要約のみ）

**レビュワーのコメント（原文）**:

**`functions/default/src/eventMenusSelection.ts` L27–35（`upsertNoOrderParticipationMenu`）**

`copilot-pull-request-reviewer` の指摘と同様に確認しました。`isSelected === false` かつ予約ドキュメントが未作成の場合でも `saveMenu` が呼ばれます。初回の `updateEventMenus` 呼び出し時点でトグルが OFF でも予約ドキュメントが作成されます。  
意図的に「常に予約ドキュメントを存在させる」設計であれば問題ありませんが、そうでなければ以下のように `isSelected === false && existing == null` のケースはスキップする実装が望ましいです：

```ts
// isSelected=false かつ未作成は作成しない
if (existing == null && !isSelected) return
if (
  existing == null ||
  existing.is_selected !== isSelected ||
  existing.menu_name !== menu.menu_name ||
  existing.menu_description !== menu.menu_description
) {
  await event.saveMenu(menu, transaction)
}
```

**コメント要約**: 初回保存でトグル OFF でも予約 menus ドキュメントが作成される。<br>UI は doc 無しでも false 扱いのため、未作成かつ OFF は skip が妥当。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `EventEdit` は予約 doc 無しで `is_selected ?? false` とし、OFF 時は `selectedMenuIds` に予約 ID を含めない。不要な Firestore 書き込みを避ける early return が仕様と整合。手順 4a で自動修正済み。

**補足（既存 RC 再確認）**: Copilot は RC-1/RC-4/RC-5 の ✅ 対応を確認。RC-2・RC-3 は未着手のまま（新規 RC 化なし）。

---

## 評価セッション（2026-08-29 10:35・shokujii-code-review）

- **評価日時**: 2026-08-29 10:35 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **レビュー範囲**: `git diff origin/development...HEAD` + 未コミット差分（`functions/default/src/eventMenusSelection.ts`）
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a/3b 自動修正**: RC-10（🚨 1件）、RC-7・RC-12（🟡 2件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `selectedMenuCount` の直前に `selectedMenuIdsForSave` 用コメントが重複残存<br>誤解を招くコメント。1行削除 |
| [ ] | RC-8 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 📏 規約 | 🔧 微修正 | M | 仕様書 §7.1 で要求されたテストが未追加<br>`EventMemberOrder` の item_type、`addToCart` 排他、`confirmOrder` の user_advance 例外、`minimumParticipantsJudgment` の除外 |
| [ ] | RC-9 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 💰 金銭 | 🔧 微修正 | S | `isPartnerSuppliedItem` が `undefined` を受け入れ `true` を返す<br>仕様書 §5.3 の型定義から逸脱し、item_type 渡し漏れが型で検出できない |
| [x] | RC-10 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | `updateEventMenus` の accepting_order 経路で Transaction の read が write より後<br>選択変更のある保存が必ず失敗する。既読 menus を引数で渡す形に修正 |
| [ ] | RC-11 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📐 リファクタ | M | 品目判定が `menu_id` 比較と `item_type` 判定の二重軸<br>`organizer_menu` が増えたとき排他・文言分岐が漏れる |
| [x] | RC-12 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `memberOrders` の三項演算子の else 側が未使用<br>`addingNoOrder` の分岐内で読むよう整理 |

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventEdit.vue:506-517`

**該当コード（レビュー時点の diff）**:

```diff
+// 保存時はこのselectedMenuIdsForSave.valueをバックエンドに送信する
+const selectedMenuIdsForSave = computed(() => { ... })
+
+// 保存時はこの selectedMenuIdsForSave.value をバックエンドに送信する
+
+const selectedMenuCount = computed(() => partnerEventMenus.value.filter((m) => m.is_selected).length)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `selectedMenuIds` → `selectedMenuIdsForSave` へのリネーム時に、同じ趣旨のコメントが 2 箇所に残っています。2 つ目は `selectedMenuCount`（選択件数の算出）の直前にあり、「保存時にバックエンドへ送信する」という説明が対応しない別の computed を指してしまっています → 2 つ目のコメント行を削除してください。

**コメント要約**: リネーム時のコメント重複が `selectedMenuCount` を誤って説明している。<br>2 行目のコメントを削除するのみ。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 「誤ったコメントを書いていないか」に該当。削除のみで方針が一意のため手順 3b で自動修正した。

---

**識別子**: RC-8（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/schemas/EventMemberOrder.test.ts:1`

**該当コード（レビュー時点の diff）**:

（本ブランチで追加されたテストは `EventItemType` 系 3 ファイルと `invoice` / `validateReservationRequest` の追記のみ）

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/M]: 仕様書 [18_注文なし参加.md](../03_参加者獲得/18_注文なし参加.md) §7.1 が挙げるテストのうち、次が未追加です。

- `common/src/schemas/EventMemberOrder.test.ts`: `item_type` 未指定で `partner_menu` になること・`menu_price: 0` が通ること（既存ファイルに `item_type` の記述なし）
- `common/src/utils/eventMenuConverter.test.ts`: `applyDefaultSelectedMenuIds` が予約 ID を全選択に含めないこと
- `functions` 側: `addToCart` の排他 / 重複 / 数量エラー、`confirmOrder` の `user_advance` 例外、`minimumParticipantsJudgment` が注文なし参加を数えないこと（`minimumParticipantsJudgment.test.ts` / `eventCopy.test.ts` は既存だが本変更分は未カバー）

いずれも Transaction・排他・金額に関わる分岐で、テスト方針の「ビジネスロジック・純粋関数」に該当します → 上記を追加してください。

**コメント要約**: 仕様書 §7.1 が要求するテストのうち EventMemberOrder・addToCart・confirmOrder・minimumParticipantsJudgment 分が未追加。<br>排他・0 円確定という影響の大きい分岐が未カバー。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 複数ファイルにまたがるテスト新規作成で工数 M。自動修正の対象条件（工数 S）を満たさないため未着手として記録する。

---

**識別子**: RC-9（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/utils/eventItemType.ts:5-7`

**該当コード（レビュー時点の diff）**:

```diff
+/** 店舗に発注し、店舗へ支払う品目か（発注情報・主催者請求書の対象判定） */
+export function isPartnerSuppliedItem(itemType: EventItemTypeType | undefined): boolean {
+  return itemType === undefined || itemType === 'partner_menu'
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 仕様書 §5.3 の定義は `itemType: EventItemTypeType` で `undefined` を受けません。`EventMenu` / `EventMemberOrder` はどちらも `item_type: EventItemTypeSchema`（`.default('partner_menu')`）を持ち、converter / コンストラクタ経由の読み取りで必ず値が入るため（§5.2.4）、`| undefined` は不要な緩和です。この緩和により `item_type` の渡し漏れが型で検出できなくなり、請求・発注の集計対象判定が暗黙に「店舗発注対象」へ倒れます → 仕様書どおり `EventItemTypeType` のみを受ける形に絞るか、`undefined` を許容する理由（どの呼び出し元で欠損しうるか）をコメントに明記してください。

**コメント要約**: 仕様書の型定義から外れた `undefined` 許容で、item_type 欠損が型検査をすり抜ける。<br>型を絞るか、許容理由を明記するかの判断が必要。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 修正方針が「型を絞る」と「許容理由を明記する」の 2 案あり一意でない。かつ型を絞った場合、実行時に `item_type` が欠損した注文は請求・発注の対象外へ倒れるため金額影響の確認が必要。自動修正の対象外として未着手で記録する。

---

**識別子**: RC-10（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/eventMenusSelection.ts:114-124`

**該当コード（レビュー時点の diff）**:

```diff
       if (shouldUpdateExistingMenusOnly(eventStatus)) {
         const existingEventMenus = await event.getMenus(transaction)
         const { changedMenus } = updateEventMenusIsSelected(existingEventMenus, selectedMenuIds)

         await Promise.all(
           changedMenus.map(async (menu) => {
             await event.saveMenu(menu, transaction)
           }),
         )

+        await upsertNoOrderParticipationMenu(event, noOrderSelected, transaction)
```

（`upsertNoOrderParticipationMenu` は先頭で `await event.getMenus(transaction)` を実行する）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `accepting_order` 経路で `event.saveMenu`（`transaction.set`）を実行した**後**に `upsertNoOrderParticipationMenu` が `event.getMenus(transaction)`（`transaction.get`）を呼んでいます。Firestore の Transaction は write 後の read を拒否するため（`Transaction.get` が `Firestore transactions require all reads to be executed before all writes.` を throw）、`changedMenus` が 1 件以上ある保存はすべて `internal` エラーになります。注文なし参加の ON/OFF に限らず、**受付中イベントの店舗メニュー選択変更が保存できない既存機能の退行**です → `upsertNoOrderParticipationMenu` から read を外し、既に読み込んだ `existingEventMenus` を引数で受け取る形にしてください（再生成経路も同様に read を write より前に置く）。

**コメント要約**: 受付中イベントのメニュー保存で Transaction の read-after-write により必ず失敗する。<br>既読 menus を引数で渡し、read を write より前に揃える。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様判断・スコープ外設計・セキュリティ確認のいずれにも該当せず、修正方針が一意のため手順 3a で自動修正した。`upsertNoOrderParticipationMenu` の引数に `existingMenus: EventMenu[]` を追加し、再生成経路では同一 Transaction 内で write 前に `getMenus` を実行する形に変更した。

---

**識別子**: RC-11（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/memberOrders.ts:102`

**該当コード（レビュー時点の diff）**:

```diff
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: 品目の判定軸が 2 系統に分かれています。店舗発注側は `isPartnerSuppliedItem(item_type)` を使う一方、注文なし参加側は `menu_id === NO_ORDER_PARTICIPATION_MENU_ID` で判定しています（`addToCart` の `addingNoOrder`、`slackOrderNotification` の `allNoOrderParticipation`、`cart.vue` の `isNoOrderParticipationOnly`、`EventMenuList` / `EventCartDialog` の表示分岐）。仕様書 §5.3 は「呼び出し側で `item_type === 'partner_menu'` と直接比較してはならない（値の追加時に判定漏れが発生する）」としており、`menu_id` 固定比較は同じ問題を持ちます。Phase 2 で主催者が任意メニューを追加すると（品目モデル §9）、`organizer_menu` でありながら `menu_id` が異なる品目が生まれ、排他チェック・文言分岐・数量固定がすべて抜けます → `isMenuItem` と対になる `isOrganizerSuppliedItem(item_type)` 等の判定ヘルパーを `eventItemType.ts` に追加し、`menu_id` 比較は「表示名・説明の予約ドキュメント特定」が必要な箇所に限定してください。

**コメント要約**: 注文なし参加の判定が `menu_id` 固定比較で、`item_type` 軸と二重化している。<br>Phase 2 で organizer_menu が増えたとき排他・文言・数量固定が漏れる。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: Phase 1 では `organizer_menu` が予約ドキュメント 1 件のみで実害はない。判定ヘルパー追加と 5 ファイル以上の置換で工数 M、かつ `menu_id` 比較を残す境界の設計判断を伴うため自動修正の対象外。

---

**識別子**: RC-12（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/memberOrders.ts:108-111`

**該当コード（レビュー時点の diff）**:

```diff
+    const existingCartOrders = await getOrdersInCart(community_id, event_id, uid, transaction)
+    const memberOrders = addingNoOrder
+      ? await getMemberOrders(community_id, event_id, uid, transaction)
+      : existingCartOrders
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `memberOrders` は `if (addingNoOrder)` ブロック内でしか参照されないため、三項演算子の else 側（`existingCartOrders`）は決して使われません。読み手に「カート内注文でも重複判定する経路がある」と誤解させます → `getMemberOrders` の呼び出しを `if (addingNoOrder)` ブロック内へ移してください（write より前のままなので Transaction の read 順序は保たれます）。

**コメント要約**: 三項演算子の else 側が未使用で、不要な変数中継になっている。<br>`addingNoOrder` 分岐内で読むよう移動する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 「不要な変数への代入を中継していないか」に該当。移動のみで挙動不変・方針が一意のため手順 3b で自動修正した。read は `saveMember` より前に位置し、Transaction の read-before-write は維持されている。

---

