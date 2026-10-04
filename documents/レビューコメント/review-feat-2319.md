# ブランチ feat/2319 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `clearShopSelectionForDraft` で `_noOrderParticipationSelected` の null 代入が2行重複<br>コピペミス。1行削除 |
| [x] | RC-2 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 📄 ドキュメントのみ | S | `countOrderedFoodsForUser` が count aggregation から全件取得+メモリフィルタに変更<br>`item_type` 未設定の既存注文を落とさないため全件読みを維持し、理由をコメントに明記 |
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
| [x] | RC-13 | 4173589672 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 📑 仕様書 | 🔧 微修正 | S | `item_type` 未設定の 0 円メニューが `partner_menu` 既定のあと価格拒否で読めない<br>エミュレータの 0 円フィクスチャに `organizer_menu` を付けた |
| [x] | RC-14 | 4173589682 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 確定済みの注文なし参加があっても店舗メニューを追加できる<br>店舗メニュー確定時に注文なし参加ドキュメントを削除する |
| [x] | RC-15 | 5970583745 | 👌 修正不要 | — | — | 💾 データ, 📑 仕様書 | 👀 確認のみ | — | 注文スキーマが 0 円の partner_menu を拒否しない<br>0 円の注文は許可する。メニュー側の拒否は維持 |
| [x] | RC-16 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 注文なし参加のキャンセルが補助の月次注文件数を減らす<br>店舗発注分だけ減算する |
| [x] | RC-17 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 注文なし参加だけでも補助設定の読み込みが必須<br>店舗メニューを足すときだけ読む |
| [x] | RC-18 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 同一リクエストの複数行で注文なし参加を重複作成できる<br>合計数量が 1 のときだけ許可 |
| [x] | RC-19 | 5970583745 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 確定済みの店舗注文があっても注文なし参加を追加できる<br>確定済みと決済中の店舗注文があるときは追加を拒否する |
| [x] | RC-20 | 5970583745 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | 確定時にメニューが選択中かを再確認していない<br>選択確認はカート追加時のまま |
| [x] | RC-21 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 最小催行の中止と参加者同期が店舗注文だけを見ている<br>人数判定だけ店舗注文にし、中止と同期は全注文 |
| [x] | RC-22 | 5970583745 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | リマインドとプロフィール一覧が注文なし参加を店舗注文として扱う<br>主催者リマインドは店舗の確定注文があるときだけ。食事一覧も店舗注文だけ |
| [x] | RC-23 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 店舗の注文詳細で小計と合計が注文なし参加を含む<br>明細と同じ店舗発注分だけを集計する |
| [x] | RC-24 | 5404430702 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>個別指摘は各インラインと既存 RC で扱う |
| [x] | RC-25 | 4176246983 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 🔧 微修正 | S | カート追加ダイアログで注文なし参加の価格が隠れる<br>数量だけ隠し、価格行は ¥0 を出す |
| [x] | RC-26 | 4176246981 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 事前アンケートがあると注文なし参加の確定文言にならない<br>フォーム画面でも参加確定のボタンと確認文にする |
| [x] | RC-27 | 4176237530 | 👌 修正不要 | — | — | 💾 データ | 👀 確認のみ | — | メニュー再生成と予約更新が別 Transaction<br>同一内容は RC-3 で未着手のまま追う |
| [x] | RC-28 | 4176246977 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 小数の複数行で注文なし参加を2件作れる<br>1行かつ整数1だけ許可する |
| [x] | RC-29 | 4176237550 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | count 0 の注文なし参加が通り参加だけ残る<br>1行かつ整数1以外は拒否する |
| [ ] | RC-30 | 4176237558 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 🔧 微修正 | M | 注文なし参加削除の統合テストが無い<br>エミュレータで確定成功と再計算スキップの2経路 |
| [x] | RC-31 | 5977270873 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 数量の正負が相殺されると注文なし参加がカートに残る<br>`replaceInCartNoOrderParticipation` の合算判定<br>店舗メニューと注文なし参加が in_cart で併存する<br>正数の店舗行が1件でもあれば削除する |
| [x] | RC-32 | 5404599240 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>新規は数量相殺、決済中、挨拶文。既存リンクは記録済み RC<br>目次自体に追加の修正要求はない<br>リンク先は各 RC で評価する |
| [x] | RC-33 | 4176398555 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | 表示名変更で挨拶文の除外が外れる<br>`chatGreetingPrompt` が旧名称だけを見ている<br>食事は持参が注文メニューとして挨拶に入る<br>menu_id と現行・旧名称の両方で除外する |
| [x] | RC-34 | 4176401322 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | 満席だと既存の注文なし参加者が店舗注文へ切り替えられない<br>`addToCart` と `confirmOrder` の定員判定、満席 UI<br>仕様書は定員チェックを現行のまま維持すると書いてある<br>人数を増やさない切替の免除は仕様に無い |
| [x] | RC-35 | 4176398525 | 👌 修正不要 | — | — | 💰 金銭 | 👀 確認のみ | — | Stripe Checkout 中も注文が in_cart のまま<br>カート内の店舗注文は `hasExistingPartnerInCart` が先に拒否する<br>Checkout を processing にする必要はない |
| [x] | RC-36 | 5405315857 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>新規は予約メニューの item_type 既定と addToCart の統合テスト<br>目次自体に追加の修正要求はない<br>リンク先は各 RC で評価する |
| [x] | RC-37 | 4176968988 | 👌 修正不要 | — | — | 💾 データ | 👀 確認のみ | — | 予約メニューに item_type が無いと店舗品目になる<br>addToCart の addingPartnerMenu が予約 ID でも true になる<br>価格 0 の未設定ドキュメントはスキーマで読めない<br>書き込みは常に organizer_menu。判定の誤作動は起きない |
| [ ] | RC-38 | 4176969020 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 🔧 微修正 | M | addToCart の排他がエミュレータで未検証<br>カート内・確定済み・決済中の拒否とカート内置換<br>純粋関数テストだけでは不足という指摘<br>RC-8 の続き。統合テストは工数 M のため未着手 |

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
| [x] | RC-2 | 5435157935 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 📄 ドキュメントのみ | S | `countOrderedFoodsForUser` が count aggregation から全件取得+メモリフィルタに変更<br>`item_type` 未設定の既存注文を落とさないため全件読みを維持し、理由をコメントに明記 |
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

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: count aggregation や `item_type == partner_menu` の where に戻すと、`item_type` 未設定の既存注文が件数から落ちる。欠落フィールドは where に一致せず、コンバータの既定値は読み取り後にしか付かない。仕様はバックフィルしない。当該ユーザーの確定注文を読んでから店舗発注分だけ数える実装を維持し、その理由を `countOrderedFoodsForUser` のコメントに明記した。

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

## 評価セッション（2026-10-03 22:34・review-comments-evaluate）

- **評価日時**: 2026-10-03 22:34 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 GitHub id 5969612686、Copilot 具体指摘なしの完了報告 GitHub id 5969639053）
- **重複除外**: 1（GitHub id 4173367420 は RC-3 と同一指摘のため新規 RC なし）
- **新規 RC なし**
- **partial**: false
- **REVIEW_REQUEST_SINCE**: 2026-10-03T13:26:52Z
- **手順 4a 自動修正**: 対象なし

### RC 一覧（サマリ）

新規 RC なし。Codex インライン（`functions/default/src/eventMenusSelection.ts` の再生成経路で、店舗メニュー保存と注文なし参加 upsert が別 Transaction）は RC-3 として記録済み。

---

## 評価セッション（2026-10-03 23:48・review-comments-evaluate）

- **評価日時**: 2026-10-03 23:48 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 GitHub id 5970180218、Codex 問題なしサマリ GitHub id 5970218727）
- **partial**: true
- **REVIEW_REQUEST_SINCE**: 2026-10-03T14:38:59Z
- **手順 4a 自動修正**: 対象なし（RC-13 は仕様判断、RC-14 は修正方針が一意でない）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-13 | 4173589672 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 📑 仕様書 | 🔧 微修正 | S | `item_type` 未設定の 0 円メニューが `partner_menu` 既定のあと価格拒否で読めない<br>エミュレータの 0 円フィクスチャに `organizer_menu` を付けた |
| [x] | RC-14 | 4173589682 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 確定済みの注文なし参加があっても店舗メニューを追加できる<br>店舗メニュー確定時に注文なし参加ドキュメントを削除する |

**識別子**: RC-13（GitHub id: 4173589672）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/EventMenu.ts:15`

**該当コード（レビュー時点の diff）**:

```diff
@@ -3,33 +3,49 @@ import { TimestampSchema } from './firebase/index.js'
 import { LimitPerEventAppFieldSchema, LimitPerEventDbFieldSchema } from './limitPerEventField.js'
 import { MenuDescriptionAppFieldSchema, MenuDescriptionDbFieldSchema } from './menuDescriptionField.js'
 import { EventMenuOptionSchema } from './menuOption.js'
+import { EventItemTypeSchema, type EventItemTypeType } from './EventItemType.js'

-const EventMenuDbSchema = z.object({
-  updatedAt: TimestampSchema,
-  menu_description: MenuDescriptionDbFieldSchema,
-  menu_name: z.string().nonempty(),
-  // 0 は「注文なしで参加」。負数は拒否する。
-  menu_price: z.number().int().nonnegative(),
-  is_sold_out: z.boolean(),
-  menu_sort_number: z.number().int().nonnegative(),
-  is_selected: z.boolean(),
-  limit_per_event: LimitPerEventDbFieldSchema,
-  options: z.array(EventMenuOptionSchema).optional(),
-})
+const partnerMenuPriceRefine = (data: { item_type: EventItemTypeType; menu_price: number }, ctx: z.RefinementCtx) => {
+  if (data.item_type === 'partner_menu' && data.menu_price <= 0) {
+    ctx.addIssue({
+      code: z.ZodIssueCode.custom,
+      message: 'partner_menu requires menu_price > 0',
+      path: ['menu_price'],
+    })
+  }
```

**レビュワーのコメント（原文）**:

[must] この `superRefine` は読み取り時の `AppSchema.parse` にも適用されるため、`item_type` 未設定のドキュメントは既定値の `partner_menu` が入った直後に `menu_price: 0` として拒否されます。現在の `memberOrders.emulator.test.ts` は `item_type` なし・0 円のメニューを Firestore に作るため、`confirmOrder` のメニュー読み込みが失敗します。既存の 0 円データをどう扱うかを決め、該当データ／テストとスキーマの互換性を揃えてください。

**コメント要約**: `item_type` 未設定の 0 円メニューが `partner_menu` 既定のあと価格拒否で読めない。<br>既存データとエミュレータテストの扱いが仕様判断。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 価格拒否は維持する。未設定は `partner_menu` のままで、本番の既存メニューは正の価格なので読み取れる。壊れていたのはエミュレータの 0 円フィクスチャなので、メニューと注文に `item_type: 'organizer_menu'` を付けた。

---

**識別子**: RC-14（GitHub id: 4173589682）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:137`

**該当コード（レビュー時点の diff）**:

```diff
@@ -109,10 +112,42 @@ export const addToCart = onCall<AddToCartRequest, Promise<void>>(async (request)

     const existingMember = await getMember(community_id, event_id, uid, transaction)

-    const existingCartOrders =
-      eventData.event_payment === 'enterprise_subsidy'
-        ? await getOrdersInCart(community_id, event_id, uid, transaction)
-        : undefined
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
+
+    const existingCartOrders = await getOrdersInCart(community_id, event_id, uid, transaction)
+
+    for (const menu of menus) {
+      if (menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID && menu.count !== 1) {
+        throw new HttpsError('failed-precondition', '注文なし参加は数量1のみ指定できます')
+      }
+    }
+
+    const hasExistingNoOrderInCart = existingCartOrders.some((o) => o.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const hasExistingPartnerInCart = existingCartOrders.some((o) => isPartnerSuppliedItem(o.item_type))
+
+    if (addingNoOrder && (hasExistingPartnerInCart || addingPartnerMenu)) {
+      throw new HttpsError('failed-precondition', '注文なし参加と店舗メニューは同時にカートに追加できません')
+    }
+    if (addingPartnerMenu && hasExistingNoOrderInCart) {
+      throw new HttpsError('failed-precondition', '注文なし参加と店舗メニューは同時にカートに追加できません')
+    }
```

**レビュワーのコメント（原文）**:

排他確認が `hasExistingNoOrderInCart` だけなので、すでに `ordered` の注文なし参加は検出されません。注文なし参加を確定した後に店舗メニューを追加でき、同一ユーザーに参加用の確定注文と店舗注文が併存します。仕様は「注文なし参加をキャンセルしてから注文」の2段階なので、店舗メニュー追加時もTransaction内で確定済みの予約注文を確認して拒否（または明示的な切替処理）してください。

**コメント要約**: 確定済みの注文なし参加があっても店舗メニューを追加できる。<br>拒否するか切替を許すかは仕様の読み分けが必要。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: カート内の排他は維持する。確定済みの注文なし参加がある状態で店舗メニューを確定したら、同じ Transaction で注文なし参加ドキュメントを削除する。`canceled` には残さない。カート追加だけでは削除しない。`confirmOrder` と Stripe Webhook の確定成功時に行う。後から店舗注文をキャンセルしても注文なし参加は戻さない。

---

## 評価セッション（2026-10-04 00:40・review-comments-evaluate）

- **評価日時**: 2026-10-04 00:40 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 GitHub id 5970561634、Codex 問題なしサマリ GitHub id 5970605014）
- **重複除外**: 2（プロフィール再集計の全件取得は RC-2、メニュー再生成の別 Transaction は RC-3）
- **partial**: true
- **REVIEW_REQUEST_SINCE**: 2026-10-03T15:26:09Z
- **手順 4a 自動修正**: RC-16、RC-17、RC-18、RC-21、RC-23。RC-15 と RC-20 は修正不要。RC-19 と RC-22 は方針確定後に対応済み

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-15 | 5970583745 | 👌 修正不要 | — | — | 💾 データ, 📑 仕様書 | 👀 確認のみ | — | 注文スキーマが 0 円の partner_menu を拒否しない<br>0 円の注文は許可する。メニュー側の拒否は維持 |
| [x] | RC-16 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 注文なし参加のキャンセルが補助の月次注文件数を減らす<br>店舗発注分だけ減算する |
| [x] | RC-17 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 注文なし参加だけでも補助設定の読み込みが必須<br>店舗メニューを足すときだけ読む |
| [x] | RC-18 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 同一リクエストの複数行で注文なし参加を重複作成できる<br>合計数量が 1 のときだけ許可 |
| [x] | RC-19 | 5970583745 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 確定済みの店舗注文があっても注文なし参加を追加できる<br>確定済みと決済中の店舗注文があるときは追加を拒否する |
| [x] | RC-20 | 5970583745 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | 確定時にメニューが選択中かを再確認していない<br>選択確認はカート追加時のまま |
| [x] | RC-21 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 最小催行の中止と参加者同期が店舗注文だけを見ている<br>人数判定だけ店舗注文にし、中止と同期は全注文 |
| [x] | RC-22 | 5970583745 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | リマインドとプロフィール一覧が注文なし参加を店舗注文として扱う<br>主催者リマインドは店舗の確定注文があるときだけ。食事一覧も店舗注文だけ |
| [x] | RC-23 | 5970583745 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 店舗の注文詳細で小計と合計が注文なし参加を含む<br>明細と同じ店舗発注分だけを集計する |

**識別子**: RC-15（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/EventMemberOrder.ts:84`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `common/src/schemas/EventMemberOrder.ts:84-86,108-117` 0円を許容しつつ `item_type` の既定値は `partner_menu` のままです。Db/App schema で品目種別と価格の整合性を検証しないと、不正な0円店舗注文を保存できます。

**コメント要約**: 注文スキーマが 0 円の partner_menu を拒否しない。<br>未設定を partner_menu とみなす既存方針との両立が必要。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💾 データ, 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 0 円の注文は許可する。メニューの partner_menu は 0 円を拒否したままにする。注文スキーマに同じ拒否を足すと、item_type 未設定の既存 0 円注文が読めなくなる。

---

**識別子**: RC-16（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/cancelOrders.ts:105`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `functions/default/src/cancelOrders.ts:105-112` 注文なし参加のキャンセルでも補助の月次注文件数を減算します。加算していない件数を引くため、同月の他注文の使用数まで誤って減ります。

**コメント要約**: 注文なし参加のキャンセルが補助の月次注文件数を減らす。<br>店舗発注分だけ減算する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘は妥当。減算対象を isPartnerSuppliedItem の注文に限った。注文なし参加だけなら減算しない。

---

**識別子**: RC-17（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:108`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `functions/default/src/memberOrders.ts:108-114` 注文なし参加だけを追加する場合も補助設定を必須ロードします。設定がない月に補助対象外の参加まで失敗します。

**コメント要約**: 注文なし参加だけでも補助設定の読み込みが必須。<br>店舗メニューを足すときだけ読む。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: loadResolvedSubsidySettings は設定が無い月に failed-precondition を投げる。店舗メニューを追加するときだけ読むようにした。企業メンバー確認は既存の assertActiveEnterpriseMember が先に行う。

---

**識別子**: RC-18（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:127`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `functions/default/src/memberOrders.ts:127-130` 同一リクエストに予約メニューを複数回含めると、各 `count: 1` が通り重複注文を作れます。

**コメント要約**: 同一リクエストの複数行で注文なし参加を重複作成できる。<br>合計数量が 1 のときだけ許可。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 行ごとの count だけでなく、リクエスト内の合計が 1 のときだけ通すようにした。

---

**識別子**: RC-19（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:133`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `functions/default/src/memberOrders.ts:133-146` 店舗注文が確定済みでも注文なし参加を追加・確定できる経路があります。今回の削除処理は「注文なし参加→店舗注文」の切替だけを扱い、逆方向の排他は担保していません。

**コメント要約**: 確定済みの店舗注文があっても注文なし参加を追加できる。<br>逆方向の扱いは今回の削除方針と別に判断が必要。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 確定済みまたは決済中の店舗注文があるときは、注文なし参加の追加を拒否する。店舗注文は自動では消さない。キャンセル後は追加できる。

---

**識別子**: RC-20（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:352`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `functions/default/src/memberOrders.ts:352-359` 確定時にメニューが現在も選択中か確認していません。追加後に主催者が選択解除した予約注文を確定できるため、サーバー側で再検証してください。

**コメント要約**: 確定時にメニューが選択中かを再確認していない。<br>仕様の検証タイミングはカート追加時。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 選択中かの確認はカート追加時のままにする。確定時の再確認は通常メニューも含めた仕様追加になる。

---

**識別子**: RC-21（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/minimumParticipantsJudgment.ts:56`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `functions/default/src/minimumParticipantsJudgment.ts:56-80,87` 店舗注文だけに絞った配列を一括キャンセルとメンバー同期にも使っています。注文なし参加がキャンセルされず、参加者一覧からも外れる可能性があります。

**コメント要約**: 最小催行の中止と参加者同期が店舗注文だけを見ている。<br>人数判定だけ店舗注文にし、中止と同期は全注文。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 人数判定は店舗注文のまま。一括中止へ渡す注文と参加者同期は全 ordered に戻した。

---

**識別子**: RC-22（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/orderRemindMail.ts:232`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

併せて、注文リマインドの送信条件、未注文リマインド、プロフィールのフード注文一覧も `organizer_menu` を店舗注文として扱う箇所が残っています（`functions/default/src/orderRemindMail.ts:232-240`、`functions/default/src/remindUnorderedMail.ts:54-56`、`functions/default/src/stores/memberOrder.ts:426-442`）。

**コメント要約**: リマインドとプロフィール一覧が注文なし参加を店舗注文として扱う。<br>hasOrderedOrders は中止判定と共有のため出口ごとの切り分けが必要。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: hasOrderedOrders は変更しない。主催者向け注文リマインドは店舗の確定注文が 1 件以上あるときだけ送る。プロフィールの食事一覧は店舗注文だけにする。未注文リマインドは注文なし参加を参加とみなし、現状のまま送らない。

---

**識別子**: RC-23（GitHub id: 5970583745）

**レビュワー**: Copilot

**指摘箇所**: `partner/src/pages/order/[eventId].vue:379`

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `partner/src/pages/order/[eventId].vue:323-417` 詳細行と異なり表示条件・小計・合計が全注文を参照し、注文なし参加が店舗向け集計に混ざります。

**コメント要約**: 店舗の注文詳細で小計と合計が注文なし参加を含む。<br>明細と同じ店舗発注分だけを集計する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 明細は既に店舗発注分だけだった。表示条件・小計・件数・合計を同じ sortedConfirmedOrders に揃えた。評価は実害があるため必須修正とした。

---

## 評価セッション（2026-10-04 14:18・review-comments-evaluate）

- **評価日時**: 2026-10-04 14:18 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 GitHub id 5976785837、Codex 接続案内のみ GitHub id 5404440025）
- **重複除外**: 1（GitHub id 5976852251 → 既存 RC-2 と RC-3、差分なし）
- **partial**: false
- **REVIEW_REQUEST_SINCE**: 2026-10-04T05:03:52Z
- **手順 4a 自動修正**: RC-25、RC-26、RC-28、RC-29。RC-30 は工数 M のため未着手。RC-24 と RC-27 は修正不要

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-24 | 5404430702 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>個別指摘は各インラインと既存 RC で扱う |
| [x] | RC-25 | 4176246983 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 🔧 微修正 | S | カート追加ダイアログで注文なし参加の価格が隠れる<br>数量だけ隠し、価格行は ¥0 を出す |
| [x] | RC-26 | 4176246981 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 事前アンケートがあると注文なし参加の確定文言にならない<br>フォーム画面でも参加確定のボタンと確認文にする |
| [x] | RC-27 | 4176237530 | 👌 修正不要 | — | — | 💾 データ | 👀 確認のみ | — | メニュー再生成と予約更新が別 Transaction<br>同一内容は RC-3 で未着手のまま追う |
| [x] | RC-28 | 4176246977 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 小数の複数行で注文なし参加を2件作れる<br>1行かつ整数1だけ許可する |
| [x] | RC-29 | 4176237550 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | count 0 の注文なし参加が通り参加だけ残る<br>1行かつ整数1以外は拒否する |
| [ ] | RC-30 | 4176237558 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 🔧 微修正 | M | 注文なし参加削除の統合テストが無い<br>エミュレータで確定成功と再計算スキップの2経路 |

**識別子**: RC-24（GitHub id: 5404430702）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: （レビュー本文）

**該当コード（レビュー時点の diff）**: （インライン指摘なし）

**レビュワーのコメント（原文）**:

## Copilot review overview

### 🟡 Changes recommended

未解決のmoderateおよびcriticalな指摘があり、非原子的更新、数量検証、店舗一覧フィルタなどの修正が必要です。

**Review effort:** Lite  
**Findings:** 6  · 9  · 2 

<details open>
<summary><strong>Open (17)</strong></summary>

-  [店舗メニューと予約更新が別Transactionで不整合になる](#discussion_r4176237530) · New
-  [確定済み注文なし参加との併存をトランザクションで防止する](#discussion_r4173589682)
-  [既存の0円データとスキーマ検証の互換性を確保する](#discussion_r4173589672)
-  [0円注文の品目種別と価格整合性検証が不足](#discussion_r4173376354)
-  [\[must\] メニュー再生成パスで `savePartnerMenusToEventMenus`（内部 Transaction）と、注文なし参加の upsert（別…](#discussion_r3934369485)
-  [\[must\] イベントコピー時に、店舗メニュー再生成（`savePartnerMenusToEventMenus`）と注文なし参加メニューの作成が別 Transaction…](#discussion_r3934369415)
-  [注文なし参加で数量0や負数が許可される](#discussion_r4176237550) · New
-  [注文なし参加削除の成功・再計算時挙動を検証していない](#discussion_r4176237558) · New
-  [メニュー再生成と予約更新の失敗時に状態不整合が起きる](#discussion_r4173376380)
-  [注文なし参加除外後の一覧を空状態と名札表示にも適用する](#discussion_r4151936570)
-  [プロフィール再集計で全注文ドキュメント取得を避ける](#discussion_r4151936540)
-  [\[must\] `countOrderedFoodsForUser` が collectionGroup を全件 `get()`…](#discussion_r3934369615)
-  [\[must\] `confirmOrder` の `user_advance` 例外（全件が店舗発注対象外かつ合計0円なら確定OK）は決済・参加確定に直結する重要ロジックなので、Functions…](#discussion_r3934369563)
-  [\[must\] `isPartnerSuppliedItem` が `undefined` を `partner_menu` と同等に扱うため、`item_type`…](#discussion_r3934369519)
-  [現状の `upsertNoOrderParticipationMenu` は `isSelected=false` でも `existing == null`…](#discussion_r3869290052)
-  [バリデーションエラーメッセージが英語固定になっており、他のエラーメッセージ（日本語）と混在します。ユーザー入力に近い層で露出する可能性があるなら、日本語化するか、少なくともプロジェクト内で一貫した言語…](#discussion_r3869290103)
-  [テスト名が実際の期待値と矛盾しています（`undefined` も `true` を期待しているため「partner_menu のみ…](#discussion_r3869290081)
</details>

<details>
<summary><strong>Resolved since last review (3)</strong></summary>

-  [注文なし参加で確定ボタンまで非表示になる](#discussion_r4173376315)
-  [注文なし参加エントリをリクエスト内で1件に制限する](#discussion_r4151936481)
-  [注文なし参加で補助設定の不要な読み込みが失敗する](#discussion_r4173376400)
</details>

**コメント要約**: Copilot の未解決指摘一覧。<br>個別指摘は各インラインと既存 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 目次であり、修正要求そのものはリンク先にある。新規リンクは RC-25 以降、既存リンクは記録済み RC で扱う。

---

**識別子**: RC-25（GitHub id: 4176246983）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/EventCartDialog.vue:342`

**該当コード（レビュー時点の diff）**:

```
…（diff 先頭省略）
-        <div class="d-flex align-center justify-space-between ga-4 mb-4">
+        <div v-if="!isNoOrderParticipation" class="d-flex align-center justify-space-between ga-4 mb-4">
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  注文なし参加でもダイアログに価格を表示する**

注文なし参加ではこの `v-if` が数量セレクトだけでなく、同じ行にある価格表示までまとめて非表示にします。そのためメニュー一覧では「¥0」と表示されていても、最終的にカートへ追加するダイアログでは価格を確認できず、仕様書の「カート追加ダイアログの価格行も¥0表示」と一致しません。数量入力だけを隠し、価格部分は注文なし参加でも表示してください。

Useful? React with 👍 / 👎.

**コメント要約**: カート追加ダイアログで注文なし参加の価格が隠れる。<br>数量だけ隠し、価格行は ¥0 を出す。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 4.3 はダイアログの価格行も ¥0。数量セレクトだけを隠し、価格行は残した。

---

**識別子**: RC-26（GitHub id: 4176246981）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/pages/cart.vue:503`

**該当コード（レビュー時点の diff）**:

```
  if (formPresenceOf(item.event) === 'yes') {
    return $t('cart.answer_pre_event_form')
  }
+  if (isNoOrderParticipationOnly(item.orders)) {
+    return $t('cart.confirm_no_order_participation_button')
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  事前フォーム経路にも注文なし参加の文言を適用する**

事前アンケートがある注文なし参加では、この分岐より先にフォーム経路へ進むため、追加した注文なし参加向け文言が適用されません。遷移先の `CartFormAnswer.vue` はボタンを常に「注文してイベントに参加する」とし、確認文も `user_on_day` 以外では「主催者請求書払い」とするため、たとえば `user_advance` の注文なし参加者に存在しない支払い方法を案内します。フォーム側でもカート品目を判定し、同じ参加確定ボタンと確認文へ分岐してください。

Useful? React with 👍 / 👎.

**コメント要約**: 事前アンケートがあると注文なし参加の確定文言にならない。<br>フォーム画面でも参加確定のボタンと確認文にする。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: カートのボタンはフォームへ進むため、文言の分岐は `CartFormAnswer.vue` に置いた。注文なし参加だけなら決済にも進まない。

---

**識別子**: RC-27（GitHub id: 4176237530）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/eventMenusSelection.ts:169`

**該当コード（レビュー時点の diff）**:

```
      await getFirestore().runTransaction(async (transaction) => {
        const event = await getEventInCommunity(communityId, eventId, transaction)
        if (event == null) {
          throw new HttpsError('not-found', `Event ${eventId} not found`)
        }
        const existingMenus = await event.getMenus(transaction)
        await upsertNoOrderParticipationMenu(event, existingMenus, regenerateParams.noOrderSelected, transaction)
      })
```

**レビュワーのコメント（原文）**:

[must] メニュー再生成経路では、`savePartnerMenusToEventMenus` 内の Transaction が完了した後に、注文なし参加の upsert を別 Transaction で実行しています。後者が失敗すると店舗メニューだけ更新されて注文なし参加の選択状態が旧状態のまま残り、Callable はエラーを返すため再試行でも不整合が起こり得ます。店舗メニュー保存と予約ドキュメント更新を同一 Transaction に含め、Firestore 上の更新を原子的にしてください。

**コメント要約**: メニュー再生成と予約更新が別 Transaction。<br>同一内容は RC-3 で未着手のまま追う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💾 データ

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: RC-3 と同一。原子化は API 変更を伴い工数 M のため、このコメントでは重ねて自動修正しない。

---

**識別子**: RC-28（GitHub id: 4176246977）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/memberOrders.ts:131`

**該当コード（レビュー時点の diff）**:

```
    const noOrderUnits = menus
      .filter((menu) => menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
      .reduce((sum, menu) => sum + menu.count, 0)
    if (noOrderUnits > 0 && noOrderUnits !== 1) {
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  各注文なし参加行を整数1件に制約する**

Callable を直接呼び出して注文なし参加を `count: 0.5` の2行で送ると、合計値は1なのでこの検査を通過しますが、後段の各 `for (let i = 0; i < menu.count; i++)` はそれぞれ1回実行され、注文ドキュメントが2件作成されます。既存の重複入力指摘後に追加された合計ガードにもこの新しい迂回経路が残っているため、予約IDの出現数を1件に制限し、その行の `count` が整数の1であることを個別に検証してください。

Useful? React with 👍 / 👎.

**コメント要約**: 小数の複数行で注文なし参加を2件作れる。<br>1行かつ整数1だけ許可する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-18 の合計チェックを、1行かつ整数の 1 だけに変えた。RC-29 と同じ修正。

---

**識別子**: RC-29（GitHub id: 4176237550）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:132`

**該当コード（レビュー時点の diff）**:

```
    const noOrderUnits = menus
      .filter((menu) => menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
      .reduce((sum, menu) => sum + menu.count, 0)
    if (noOrderUnits > 0 && noOrderUnits !== 1) {
      throw new HttpsError('failed-precondition', '注文なし参加は数量1のみ指定できます')
```

**レビュワーのコメント（原文）**:

[must] 仕様は注文なし参加の同一リクエスト合計数量を **1 のみ**許可していますが、`noOrderUnits > 0` の条件では `count: 0` や負数が通ります。単独の `count: 0` は注文を作成せずに成功し、参加者だけ作成され得ます。`addingNoOrder` のときは `noOrderUnits !== 1` を無条件に拒否してください。

**コメント要約**: count 0 の注文なし参加が通り参加だけ残る。<br>1行かつ整数1以外は拒否する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 0 や負数は合計チェックを素通りし、参加だけ作られ得る。行数と整数 1 で拒否する。

---

**識別子**: RC-30（GitHub id: 4176237558）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:410`

**該当コード（レビュー時点の diff）**:

```
        if (!finalized.recalculated) {
          await deleteOrderedNoOrderParticipation(community_id, event_id, uid, noOrderIdsToDelete, transaction)
        }
```

**レビュワーのコメント（原文）**:

[must] この条件分岐は、店舗メニュー確定時に ordered の注文なし参加を削除する一方、企業補助の再計算で確定しなかった場合は削除しないというデータ整合性に関わる挙動を追加しています。しかし現状のテストは純粋関数の削除対象 ID 判定だけで、`confirmOrderHandler` の成功時に同一 Transaction で削除されることや `recalculated === true` では削除されないことを検証していません。Firestore Emulator 等でこの2経路を統合テストしてください。

**コメント要約**: 注文なし参加削除の統合テストが無い。<br>エミュレータで確定成功と再計算スキップの2経路。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 削除判定の単体テストはある。Callable とエミュレータをまたぐ統合テストは工数 M のため自動修正しない。

---

---

## 評価セッション（2026-10-04 15:30・review-comments-evaluate）

- **評価日時**: 2026-10-04 15:30 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 GitHub id 5977200419、Codex 接続案内のみ GitHub id 5404602228）
- **重複除外**: 1（GitHub id 4176398543 → RC-31、差分なし）
- **partial**: false
- **REVIEW_REQUEST_SINCE**: 2026-10-04T06:10:15Z
- **手順 4a 自動修正**: RC-31、RC-33（🚨 2件）。RC-35 は決済状態の変更で自動修正しない。RC-32 と RC-34 は修正不要

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-31 | 5977270873 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 数量の正負が相殺されると注文なし参加がカートに残る<br>`replaceInCartNoOrderParticipation` の合算判定<br>店舗メニューと注文なし参加が in_cart で併存する<br>正数の店舗行が1件でもあれば削除する |
| [x] | RC-32 | 5404599240 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>新規は数量相殺、決済中、挨拶文。既存リンクは記録済み RC<br>目次自体に追加の修正要求はない<br>リンク先は各 RC で評価する |
| [x] | RC-33 | 4176398555 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | 表示名変更で挨拶文の除外が外れる<br>`chatGreetingPrompt` が旧名称だけを見ている<br>食事は持参が注文メニューとして挨拶に入る<br>menu_id と現行・旧名称の両方で除外する |
| [x] | RC-34 | 4176401322 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | 満席だと既存の注文なし参加者が店舗注文へ切り替えられない<br>`addToCart` と `confirmOrder` の定員判定、満席 UI<br>仕様書は定員チェックを現行のまま維持すると書いてある<br>人数を増やさない切替の免除は仕様に無い |
| [x] | RC-35 | 4176398525 | 👌 修正不要 | — | — | 💰 金銭 | 👀 確認のみ | — | Stripe Checkout 中も注文が in_cart のまま<br>カート内の店舗注文は `hasExistingPartnerInCart` が先に拒否する<br>Checkout を processing にする必要はない |

**識別子**: RC-31（GitHub id: 5977270873）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/utils/replaceInCartNoOrderParticipation.ts:26`

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

現行差分を確認しました。🚨 必須修正 [🔧微修正/S]: `functions/default/src/utils/replaceInCartNoOrderParticipation.ts:26-34` で店舗メニューの `count` を合算して置換対象を判定しています。`count: 1` と `count: -1` が相殺されると、後続ループは `count: 1` の注文を作成する一方、既存の注文なし参加を削除せず、カート内で両品目が併存します。全行の数量を正の整数に検証するか、店舗注文を作成する正数行が1件でもあるかで判定してください。

利用可能な GitHub 操作には Files changed への新規インラインレビュー投稿がないため、この依頼コメントへの返信で該当箇所を報告しています。

**コメント要約**: 数量の正負が相殺されると注文なし参加がカートに残る。<br>`replaceInCartNoOrderParticipation` の合算判定。<br>店舗メニューと注文なし参加が in_cart で併存する。<br>正数の店舗行が1件でもあれば削除する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 合算だと count 1 と count -1 で削除判定が落ち、正数行だけ注文が作られて注文なし参加が残る。正数の店舗行が1件でもあれば削除するよう直し、相殺のテストを足した。

---

**識別子**: RC-32（GitHub id: 5404599240）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR レビュー本文

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Unresolved checkout exclusivity and cart validation findings, along with transaction and compatibility concerns, block approval.

**Review effort:** Lite  
**Findings:** 8 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 9 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 2 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (19)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Checkout開始中の注文なし参加追加を防止できない](#discussion_r4176398525) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [注文数量の相殺で注文なし参加の削除判定を誤る](#discussion_r4176398543) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [店舗メニューと予約更新が別Transactionで不整合になる](#discussion_r4176237530)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [確定済み注文なし参加との併存をトランザクションで防止する](#discussion_r4173589682)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [既存の0円データとスキーマ検証の互換性を確保する](#discussion_r4173589672)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円注文の品目種別と価格整合性検証が不足](#discussion_r4173376354)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [\[must\] メニュー再生成パスで `savePartnerMenusToEventMenus`（内部 Transaction）と、注文なし参加の upsert（別…](#discussion_r3934369485)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [\[must\] イベントコピー時に、店舗メニュー再生成（`savePartnerMenusToEventMenus`）と注文なし参加メニューの作成が別 Transaction…](#discussion_r3934369415)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [参加専用メニューの除外判定が旧定数のまま](#discussion_r4176398555) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加削除の成功・再計算時挙動を検証していない](#discussion_r4176237558)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [メニュー再生成と予約更新の失敗時に状態不整合が起きる](#discussion_r4173376380)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加除外後の一覧を空状態と名札表示にも適用する](#discussion_r4151936570)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [プロフィール再集計で全注文ドキュメント取得を避ける](#discussion_r4151936540)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `countOrderedFoodsForUser` が collectionGroup を全件 `get()`…](#discussion_r3934369615)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `confirmOrder` の `user_advance` 例外（全件が店舗発注対象外かつ合計0円なら確定OK）は決済・参加確定に直結する重要ロジックなので、Functions…](#discussion_r3934369563)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `isPartnerSuppliedItem` が `undefined` を `partner_menu` と同等に扱うため、`item_type`…](#discussion_r3934369519)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [現状の `upsertNoOrderParticipationMenu` は `isSelected=false` でも `existing == null`…](#discussion_r3869290052)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [バリデーションエラーメッセージが英語固定になっており、他のエラーメッセージ（日本語）と混在します。ユーザー入力に近い層で露出する可能性があるなら、日本語化するか、少なくともプロジェクト内で一貫した言語…](#discussion_r3869290103)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [テスト名が実際の期待値と矛盾しています（`undefined` も `true` を期待しているため「partner_menu のみ…](#discussion_r3869290081)
</details>

<details>
<summary><strong>Resolved since last review (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加で数量0や負数が許可される](#discussion_r4176237550)
</details>

**コメント要約**: Copilot の未解決指摘一覧。<br>新規は数量相殺、決済中、挨拶文。既存リンクは記録済み RC。<br>目次自体に追加の修正要求はない。<br>リンク先は各 RC で評価する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 目次である。新規リンクは RC-31、RC-33、RC-35 と重複除外 4176398543。それ以外は既存 RC の再掲。

---

**識別子**: RC-33（GitHub id: 4176398555）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/EventItemType.ts:12`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,19 @@
+import { z } from 'zod'
+
+export const EVENT_ITEM_TYPE_VALUES = ['partner_menu', 'organizer_menu', 'ticket'] as const
+export type EventItemTypeType = (typeof EVENT_ITEM_TYPE_VALUES)[number]
+
+export const EventItemTypeSchema = z.enum(EVENT_ITEM_TYPE_VALUES).default('partner_menu')
+
+/** 予約ドキュメント ID（注文なし参加） */
+export const NO_ORDER_PARTICIPATION_MENU_ID = 'no_order_participation'
+
+/** 予約 EventMenu の表示名（Firestore 永続・参加者向け UI） */
+export const NO_ORDER_PARTICIPATION_MENU_NAME = '食事は持参'
```

**レビュワーのコメント（原文）**:

[must] この定数を「食事は持参」に変更すると、既存の `base/src/utils/chatGreetingPrompt.ts` が旧文字列「注文なしで参加」で参加専用メニューを除外しているため、注文なし参加者の挨拶文に「食事は持参」がメニューとして混入します。除外判定を予約 menu_id/item_type またはこの定数参照に更新してください。

**コメント要約**: 表示名変更で挨拶文の除外が外れる。<br>`chatGreetingPrompt` が旧名称だけを見ている。<br>食事は持参が注文メニューとして挨拶に入る。<br>menu_id と現行・旧名称の両方で除外する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 挨拶文は注文の menu_id を受け取れる。予約 ID、現行の表示名、保存済みの旧名称のどれかで除外した。

---

**識別子**: RC-34（GitHub id: 4176401322）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/memberOrders.ts:135`

**該当コード（レビュー時点の diff）**:

```diff
@@ -99,21 +107,62 @@ export const addToCart = onCall<AddToCartRequest, Promise<void>>(async (request)
       transaction,
     })
 
+    const existingMember = await getMember(community_id, event_id, uid, transaction)
+
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
+
     let resolvedSubsidySettings: EnterpriseSubsidySettingsType | undefined
-    if (eventData.event_payment === 'enterprise_subsidy') {
+    if (eventData.event_payment === 'enterprise_subsidy' && addingPartnerMenu) {
       if (enterpriseId == null || enterpriseMember == null) {
         throw new HttpsError('failed-precondition', 'enterprise_id is required for enterprise_subsidy')
       }
       const eventMonth = formatYearMonth(eventData.event_start_datetime)
       resolvedSubsidySettings = await loadResolvedSubsidySettings(enterpriseId, eventMonth, transaction)
     }
 
-    const existingMember = await getMember(community_id, event_id, uid, transaction)
+    const existingCartOrders = await getOrdersInCart(community_id, event_id, uid, transaction)
 
-    const existingCartOrders =
-      eventData.event_payment === 'enterprise_subsidy'
-        ? await getOrdersInCart(community_id, event_id, uid, transaction)
-        : undefined
+    const noOrderLines = menus.filter((menu) => menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    if (noOrderLines.length > 1 || noOrderLines.some((menu) => !Number.isInteger(menu.count) || menu.count !== 1)) {
+      throw new HttpsError('failed-precondition', '注文なし参加は数量1のみ指定できます')
+    }
+
+    const hasExistingPartnerInCart = existingCartOrders.some((o) => isPartnerSuppliedItem(o.item_type))
+    const replacedNoOrderIds = inCartNoOrderIdsToReplace(menus, eventMenus, existingCartOrders)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  既存参加者の切替では定員チェックを免除する**

`ordered` の注文なし参加者はすでに `event.members` に含まれていますが、イベントが満席になると `addToCart` の定員判定（88–90行）でこの置換処理へ到達できず、満席になる前にカートへ追加できても `confirmOrder` の同じ判定（348–350行）で確定できません。さらに user / enterprise のイベントページも `calculatedEventStatus === 'full'` でメニュー全体を無効化します。`documents/03_参加者獲得/18_注文なし参加.md` §5.4.4・§9.2 が規定する店舗注文への切替は参加人数を増やさないため、UI・追加・確定の定員判定はいずれも既存メンバーの `uid` を除外してください。

Useful? React with 👍 / 👎.

**コメント要約**: 満席だと既存の注文なし参加者が店舗注文へ切り替えられない。<br>`addToCart` と `confirmOrder` の定員判定、満席 UI。<br>仕様書は定員チェックを現行のまま維持すると書いてある。<br>人数を増やさない切替の免除は仕様に無い。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 仕様書 §5.4.3 は定員チェックを現行のまま適用すると書き、§9.1.2 も定員は変更しない。§5.4.4 と §9.2 に既存メンバーの定員免除はない。

---

**識別子**: RC-35（GitHub id: 4176398525）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:152`

**該当コード（レビュー時点の diff）**:

```diff
@@ -99,21 +107,62 @@ export const addToCart = onCall<AddToCartRequest, Promise<void>>(async (request)
       transaction,
     })
 
+    const existingMember = await getMember(community_id, event_id, uid, transaction)
+
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
+
     let resolvedSubsidySettings: EnterpriseSubsidySettingsType | undefined
-    if (eventData.event_payment === 'enterprise_subsidy') {
+    if (eventData.event_payment === 'enterprise_subsidy' && addingPartnerMenu) {
       if (enterpriseId == null || enterpriseMember == null) {
         throw new HttpsError('failed-precondition', 'enterprise_id is required for enterprise_subsidy')
       }
       const eventMonth = formatYearMonth(eventData.event_start_datetime)
       resolvedSubsidySettings = await loadResolvedSubsidySettings(enterpriseId, eventMonth, transaction)
     }
 
-    const existingMember = await getMember(community_id, event_id, uid, transaction)
+    const existingCartOrders = await getOrdersInCart(community_id, event_id, uid, transaction)
 
-    const existingCartOrders =
-      eventData.event_payment === 'enterprise_subsidy'
-        ? await getOrdersInCart(community_id, event_id, uid, transaction)
-        : undefined
+    const noOrderLines = menus.filter((menu) => menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    if (noOrderLines.length > 1 || noOrderLines.some((menu) => !Number.isInteger(menu.count) || menu.count !== 1)) {
+      throw new HttpsError('failed-precondition', '注文なし参加は数量1のみ指定できます')
+    }
+
+    const hasExistingPartnerInCart = existingCartOrders.some((o) => isPartnerSuppliedItem(o.item_type))
+    const replacedNoOrderIds = inCartNoOrderIdsToReplace(menus, eventMenus, existingCartOrders)
+
+    if (addingNoOrder && (hasExistingPartnerInCart || addingPartnerMenu)) {
+      throw new HttpsError('failed-precondition', '注文なし参加と店舗メニューは同時にカートに追加できません')
+    }
+
+    const deleteReplacedNoOrders = async () => {
+      for (const orderId of replacedNoOrderIds) {
+        await deleteOrder(community_id, event_id, uid, orderId, transaction)
+      }
+    }
+
+    if (addingNoOrder) {
+      const memberOrders = await getMemberOrders(community_id, event_id, uid, transaction)
+      const hasActivePartnerOrder = memberOrders.some(
+        (order) =>
+          isPartnerSuppliedItem(order.item_type) && (order.status === 'ordered' || order.status === 'processing'),
+      )
```

**レビュワーのコメント（原文）**:

[must] ここでは `ordered` / `processing` だけを決済中として扱っていますが、通常の Stripe Checkout は `stripe.ts` でセッション作成後も Webhook が来るまで注文の `status` が `in_cart` のままです。その間に別タブ等から注文なし参加を追加でき、後で店舗注文の決済が確定すると両方の注文が併存します。Checkout 開始中を識別してこの追加を拒否するか、決済開始時に注文を原子的に `processing` へ遷移させてください。

**コメント要約**: Stripe Checkout 中も注文が in_cart のまま。<br>`addToCart` は ordered と processing だけを決済中とみなす。<br>その間に注文なし参加を足すと確定後に両方が残る。<br>決済開始の識別が必要。決済状態の変更なので未着手。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💰 金銭

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `createStripeCheckoutSession` はセッション作成後も status を in_cart のままにする。注文なし参加の追加は、その in_cart の店舗注文を `hasExistingPartnerInCart` が見つけた時点で拒否する。ordered と processing の判定は、カートを出たあとの注文向け。Webhook 確定時には `deleteOrderedNoOrderParticipation` も走る。Checkout 中の注文を processing に変える必要はない。

---

## 評価セッション（2026-10-04 18:40・review-comments-evaluate）

- **評価日時**: 2026-10-04 18:40 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2319
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2328
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼定型文 5978527638、Codex 問題なし 5978559371）
- **重複除外**: なし
- **partial**: true（sentinel。Codex は `Didn't find any major issues` を返しており、limits/connect 文面ではない）
- **REVIEW_REQUEST_SINCE**: 2026-10-04T09:29:46Z
- **手順 4a 自動修正**: なし（🚨 なし。RC-38 は工数 M のため未着手）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-36 | 5405315857 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の未解決指摘一覧<br>新規は予約メニューの item_type 既定と addToCart の統合テスト<br>目次自体に追加の修正要求はない<br>リンク先は各 RC で評価する |
| [x] | RC-37 | 4176968988 | 👌 修正不要 | — | — | 💾 データ | 👀 確認のみ | — | 予約メニューに item_type が無いと店舗品目になる<br>addToCart の addingPartnerMenu が予約 ID でも true になる<br>価格 0 の未設定ドキュメントはスキーマで読めない<br>書き込みは常に organizer_menu。判定の誤作動は起きない |
| [ ] | RC-38 | 4176969020 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 🔧 微修正 | M | addToCart の排他がエミュレータで未検証<br>カート内・確定済み・決済中の拒否とカート内置換<br>純粋関数テストだけでは不足という指摘<br>RC-8 の続き。統合テストは工数 M のため未着手 |

**識別子**: RC-36（GitHub id: 5405315857）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: （レビュー本文・インライン行なし）

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Resolve legacy menu compatibility and non-atomic state transitions, and add the requested transaction-level integration tests.

**Review effort:** Lite  
**Findings:** 8 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 10 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 2 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (20)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [旧予約メニューが店舗品目として誤処理される](#discussion_r4176968988) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Checkout開始中の注文なし参加追加を防止できない](#discussion_r4176398525)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [店舗メニューと予約更新が別Transactionで不整合になる](#discussion_r4176237530)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [確定済み注文なし参加との併存をトランザクションで防止する](#discussion_r4173589682)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [既存の0円データとスキーマ検証の互換性を確保する](#discussion_r4173589672)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円注文の品目種別と価格整合性検証が不足](#discussion_r4173376354)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [\[must\] メニュー再生成パスで `savePartnerMenusToEventMenus`（内部 Transaction）と、注文なし参加の upsert（別…](#discussion_r3934369485)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [\[must\] イベントコピー時に、店舗メニュー再生成（`savePartnerMenusToEventMenus`）と注文なし参加メニューの作成が別 Transaction…](#discussion_r3934369415)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加のカート排他を実経路で検証していない](#discussion_r4176969020) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [参加専用メニューの除外判定が旧定数のまま](#discussion_r4176398555)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加削除の成功・再計算時挙動を検証していない](#discussion_r4176237558)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [メニュー再生成と予約更新の失敗時に状態不整合が起きる](#discussion_r4173376380)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [注文なし参加除外後の一覧を空状態と名札表示にも適用する](#discussion_r4151936570)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [プロフィール再集計で全注文ドキュメント取得を避ける](#discussion_r4151936540)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `countOrderedFoodsForUser` が collectionGroup を全件 `get()`…](#discussion_r3934369615)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `confirmOrder` の `user_advance` 例外（全件が店舗発注対象外かつ合計0円なら確定OK）は決済・参加確定に直結する重要ロジックなので、Functions…](#discussion_r3934369563)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [\[must\] `isPartnerSuppliedItem` が `undefined` を `partner_menu` と同等に扱うため、`item_type`…](#discussion_r3934369519)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [現状の `upsertNoOrderParticipationMenu` は `isSelected=false` でも `existing == null`…](#discussion_r3869290052)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [バリデーションエラーメッセージが英語固定になっており、他のエラーメッセージ（日本語）と混在します。ユーザー入力に近い層で露出する可能性があるなら、日本語化するか、少なくともプロジェクト内で一貫した言語…](#discussion_r3869290103)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [テスト名が実際の期待値と矛盾しています（`undefined` も `true` を期待しているため「partner_menu のみ…](#discussion_r3869290081)
</details>

<details>
<summary><strong>Resolved since last review (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [注文数量の相殺で注文なし参加の削除判定を誤る](#discussion_r4176398543)
</details>
**コメント要約**: Copilot の未解決指摘一覧。<br>新規は予約メニューの item_type 既定と addToCart の統合テスト。<br>目次自体に追加の修正要求はない。<br>リンク先は各 RC で評価する。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 目次である。新規リンクは RC-37 と RC-38。それ以外は既存 RC または前回セッションで重複除外済みの再掲。目次自体に追加の修正要求はない。

---

**識別子**: RC-37（GitHub id: 4176968988）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:116`

**該当コード（レビュー時点の diff）**:

```diff
@@ -99,21 +107,62 @@ export const addToCart = onCall<AddToCartRequest, Promise<void>>(async (request)
       transaction,
     })
 
+    const existingMember = await getMember(community_id, event_id, uid, transaction)
+
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
```

**レビュワーのコメント（原文）**:

[must] 予約メニューの既存ドキュメントに `item_type` がない場合、スキーマの既定値で `partner_menu` になるため、`menu_id === no_order_participation` でもここで `addingPartnerMenu` が `true` になります。その結果、`enterprise_subsidy` で補助設定の読み込みを要求し、後続の注文にも店舗品目として割引・`item_type` を付けて店舗向け出口へ流れる可能性があります。予約 ID を優先して `organizer_menu` として扱うか、既存予約ドキュメントを必ず正規化してください。

**コメント要約**: 予約メニューに item_type が無いと店舗品目になる。<br>addToCart の addingPartnerMenu が予約 ID でも true になる。<br>価格 0 の未設定ドキュメントはスキーマで読めない。<br>書き込みは常に organizer_menu。判定の誤作動は起きない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💾 データ

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `EventMenu` は `item_type` 未設定を `partner_menu` にしたあと、価格 0 を拒否する。予約メニューは価格 0 なので、未設定ドキュメントは店舗品目として読み込まれず、`addingPartnerMenu` は true にならない。この機能の upsert は予約メニューを常に `organizer_menu` で書く。本番にこの ID の既存ドキュメントはない。

---

**識別子**: RC-38（GitHub id: 4176969020）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/memberOrders.ts:141`

**該当コード（レビュー時点の diff）**:

```diff
@@ -99,21 +107,62 @@ export const addToCart = onCall<AddToCartRequest, Promise<void>>(async (request)
       transaction,
     })

+    const existingMember = await getMember(community_id, event_id, uid, transaction)
+
+    const addingNoOrder = menus.some((m) => m.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    const addingPartnerMenu = menus.some((m) => {
+      const eventMenu = eventMenus.find((em) => em.id === m.menu_id)
+      return eventMenu != null && isPartnerSuppliedItem(eventMenu.item_type)
+    })
+
     let resolvedSubsidySettings: EnterpriseSubsidySettingsType | undefined
-    if (eventData.event_payment === 'enterprise_subsidy') {
+    if (eventData.event_payment === 'enterprise_subsidy' && addingPartnerMenu) {
       if (enterpriseId == null || enterpriseMember == null) {
         throw new HttpsError('failed-precondition', 'enterprise_id is required for enterprise_subsidy')
       }
       const eventMonth = formatYearMonth(eventData.event_start_datetime)
       resolvedSubsidySettings = await loadResolvedSubsidySettings(enterpriseId, eventMonth, transaction)
     }
 
-    const existingMember = await getMember(community_id, event_id, uid, transaction)
+    const existingCartOrders = await getOrdersInCart(community_id, event_id, uid, transaction)
 
-    const existingCartOrders =
-      eventData.event_payment === 'enterprise_subsidy'
-        ? await getOrdersInCart(community_id, event_id, uid, transaction)
-        : undefined
+    const noOrderLines = menus.filter((menu) => menu.menu_id === NO_ORDER_PARTICIPATION_MENU_ID)
+    if (noOrderLines.length > 1 || noOrderLines.some((menu) => !Number.isInteger(menu.count) || menu.count !== 1)) {
+      throw new HttpsError('failed-precondition', '注文なし参加は数量1のみ指定できます')
+    }
+
+    const hasExistingPartnerInCart = existingCartOrders.some((o) => isPartnerSuppliedItem(o.item_type))
+    const replacedNoOrderIds = inCartNoOrderIdsToReplace(menus, eventMenus, existingCartOrders)
+
+    if (addingNoOrder && (hasExistingPartnerInCart || addingPartnerMenu)) {
+      throw new HttpsError('failed-precondition', '注文なし参加と店舗メニューは同時にカートに追加できません')
+    }
+
+    const deleteReplacedNoOrders = async () => {
```

**レビュワーのコメント（原文）**:

[imo] ここで追加した注文なし参加のカート排他・既存注文（ordered / processing）チェックは Transaction を伴う重要な分岐ですが、現在のテストは判定用の純粋関数テストに留まり、`addToCart` 経由で店舗注文との併存を拒否し、カート内の注文なし参加だけを置換することを検証していません。Firestore Emulator 等で、カート内・確定済み・決済中の店舗注文それぞれのケースを追加してください。

**コメント要約**: addToCart の排他がエミュレータで未検証。<br>カート内・確定済み・決済中の拒否とカート内置換。<br>純粋関数テストだけでは不足という指摘。<br>RC-8 の続き。統合テストは工数 M のため未着手。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: RC-8 の続き。増えた点は、`addToCart` をエミュレータで通し、カート内・確定済み・決済中の拒否と、カート内の注文なし参加だけを置換することを見ること。Callable とエミュレータの統合は工数 M のため自動修正しない。

---
