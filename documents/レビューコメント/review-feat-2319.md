# ブランチ feat/2319 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `clearShopSelectionForDraft` で `_noOrderParticipationSelected` の null 代入が2行重複<br>コピペミス。1行削除 |
| [ ] | RC-2 | 5435157935 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | `countOrderedFoodsForUser` が count aggregation から全件取得+メモリフィルタに変更<br>読み取りコスト増。設計再検討または許容範囲の明記が必要 |
| [ ] | RC-3 | 5435157935 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | メニュー再生成パスで店舗メニュー保存と no-order upsert が別 Transaction<br>片方失敗時の不整合リスク。単一 Transaction 化を検討 |
| [x] | RC-4 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `EventMenu.item_type` の型を `EventItemTypeType` に統一<br>`EventMemberOrder` と揃える |
| [x] | RC-5 | 5435157935 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | `buildNoOrderParticipationEventMenu` の menu_name/description を EventItemType 定数化<br>文言・アイコン・ボタン分岐も更新 |

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
