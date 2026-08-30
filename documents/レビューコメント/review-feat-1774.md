# ブランチ feat/1774 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | `failed-precondition` のサーバーメッセージをそのまま UI に表示している<br>`メニューが選択されていません: {menu_id}` 等の内部 ID を含む文言も露出する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | `:disabled` 追加でカート追加ボタンの `@click` が発火せず、無効理由アラートが到達不能になる<br>本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` も含め仕様 §4.3.2 を満たさない |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `watch(cart)` の非同期コールバックに try/catch がなく unhandled rejection になる<br>`getLoadedMenus()` は 5 秒 timeout で reject するため売切・残数表示が無言で止まる |
| [ ] | RC-4 | なし, 3888809799, 3889327188 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カート連続更新時に古い非同期結果が後勝ちする（stale write）<br>開始時のカート内容と一致するかを確認してから代入する |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `checkCart` に存在しない `eventId` を参照しており型エラー（CI Typecheck が失敗する）<br>`event.event_id` が正しい |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 🐛 実害 | 🔧 微修正 | S | `loadMenuLimitRemainingMap` が setup 外（watch・非同期ハンドラ）から `inject` を呼んでいる<br>enterprise スコープが解決できず、誤ったスコープの store を生成する |
| [ ] | RC-7 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | `waitForConfirmedOrders` が 10 秒 timeout で `resolve([])` し、取得失敗を「注文 0 件」として扱う<br>残数が満数表示になり、カート側の事前チェックもすり抜ける |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `skipOrdersEnterpriseFilter` のとき pinia ID が options を無視した固定値になる<br>events 側の enterprise フィルタ差が store ID に反映されない |
| [x] | RC-9 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `findEventMenu` が 3 ファイルに重複定義されている<br>common に 1 つ置いて共有する |
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `findUnorderableMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [x] | RC-11 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `countOrderedByMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [ ] | RC-12 | なし, 3889337016 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 対象イベント全件へ並列度無制限で read + write している<br>イベント数が増えると Firestore 書き込みが一斉に走る |
| [x] | RC-13 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `assertNoSoldOutMenus` を try/catch で包んでメッセージを捨てる同形コードが 4 箇所ある<br>`findSoldOutMenuIds` で判定すれば try/catch 自体が不要 |
| [ ] | RC-14 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 非 enterprise 経路に追加した read-only トランザクションが直前の検証と重複している<br>書き込みがないため競合防止にならず、仕様 §8.3 でも Stripe 経路の超過は範囲外としている |
| [x] | RC-15 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 限定食数入力を watch 2 本で双方向同期している<br>同ファイルの `dateStart` / `dateEnd` と同じ `computed` の get/set に揃える |
| [ ] | RC-16 | 3889026056 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 💰 金銭, 💾 データ | 📋 仕様追加 | M | Checkout 〜 Webhook 間に限定食数枠が確保されない<br>§8.3 で Stripe 超過は別 Issue。予約 or Webhook 再検証は別対応 |
| [x] | RC-17 | 3889026059 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📄 ドキュメントのみ | S | 受付中イベントへ上限変更が反映されない旨を UI に未明示<br>§5.2 に沿い将来イベントのみ対象であることを hint で示す |
| [x] | RC-18 | 3889026071 | 👌 修正不要 | — | — | 🐛 実害, 📑 仕様書 | 📋 仕様追加 | M | 締切過ぎ `accepting_order` イベントが売切同期対象外<br>締切延長後も EventMenu が古い販売中のまま注文可能 |
| [ ] | RC-19 | 3889026074 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | 上限未設定イベントでも `confirmedOrders` 購読が開始される<br>限定メニュー確認後に購読し、集計も `ordered` に絞る |
| [x] | RC-20 | 3889252198, 3889259721 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 限定食数完売時も `event_menu.sold_out` を表示している<br>`limit_sold_out`（完売）に分岐する |
| [x] | RC-21 | 3889252207 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カート残数 0 時に `sold_out` を表示している<br>限定食数由来は `limit_sold_out` を使う |
| [x] | RC-22 | 3889259717 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | ダイアログ表示中に売切変更されても古い `props.menu` を参照<br>`eventStore.menus` から最新メニューを解決する |
| [x] | RC-23 | 3889259722 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📏 規約 | 🔧 微修正 | S | `formatLimitedPeriodRange` が端末 TZ 依存<br>`common` の JST 固定変換へ移行 |
| [x] | RC-24 | 3889327167 | 👌 修正不要 | — | — | 👤 UX, 📑 仕様書 | 👀 確認のみ | — | `EventMenuList` の v-btn に `:disabled` を付ける提案<br>親の `selectMenu` がクリックで無効理由アラートを出す設計のため RC-2 と矛盾 |
| [x] | RC-25 | 3889337013 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 🔧 微修正 | S | ダイアログ内で残数0時にステータス chip が消え無言無効化<br>§4.4.2 に沿い売切/完売 chip を表示する |
| [ ] | RC-26 | 3888809794 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カートの売切表示が初回スナップショットのまま<br>`eventStore.menus` 更新時にも `menuSoldOutByEvent` を再構築する |
| [x] | RC-27 | 3889076389 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | `skipOrdersEnterpriseFilter` で CG クエリが Rules と不整合<br>1 イベント単位の限定食数スコープでは enterprise フィルタ外しは問題なし |
| [x] | RC-28 | 3888809796 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | M | 売切同期が `saveMenu` で EventMenu 全体を書き戻し<br>Transaction 内再取得の `updateMenuSoldOut` で最新フィールドを反映 |
| [ ] | RC-29 | 3888809792 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | トリガー実行順で古い売切状態が後勝ちしうる<br>同期時に PartnerMenu を再取得するか世代比較が必要 |
| [ ] | RC-30 | 3888809790 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭, 🐛 実害 | 📋 仕様追加 | L | 同時 `confirmOrder` で読取のみの上限チェックが競合<br>メニュー単位の共有カウンタ更新で直列化が必要 |

---

## 評価セッション（2026-08-30 18:33・shokujii-code-review）

- **評価日時**: 2026-08-30 18:33 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/1774`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2341
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | `failed-precondition` のサーバーメッセージをそのまま UI に表示している<br>`メニューが選択されていません: {menu_id}` 等の内部 ID を含む文言も露出する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | `:disabled` 追加でカート追加ボタンの `@click` が発火せず、無効理由アラートが到達不能になる<br>本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` も含め仕様 §4.3.2 を満たさない |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `watch(cart)` の非同期コールバックに try/catch がなく unhandled rejection になる<br>`getLoadedMenus()` は 5 秒 timeout で reject するため売切・残数表示が無言で止まる |
| [ ] | RC-4 | なし, 3888809799, 3889327188 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カート連続更新時に古い非同期結果が後勝ちする（stale write）<br>開始時のカート内容と一致するかを確認してから代入する |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `checkCart` に存在しない `eventId` を参照しており型エラー（CI Typecheck が失敗する）<br>`event.event_id` が正しい |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 🐛 実害 | 🔧 微修正 | S | `loadMenuLimitRemainingMap` が setup 外（watch・非同期ハンドラ）から `inject` を呼んでいる<br>enterprise スコープが解決できず、誤ったスコープの store を生成する |
| [ ] | RC-7 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | `waitForConfirmedOrders` が 10 秒 timeout で `resolve([])` し、取得失敗を「注文 0 件」として扱う<br>残数が満数表示になり、カート側の事前チェックもすり抜ける |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `skipOrdersEnterpriseFilter` のとき pinia ID が options を無視した固定値になる<br>events 側の enterprise フィルタ差が store ID に反映されない |
| [x] | RC-9 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `findEventMenu` が 3 ファイルに重複定義されている<br>common に 1 つ置いて共有する |
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `findUnorderableMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [x] | RC-11 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `countOrderedByMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [ ] | RC-12 | なし, 3889337016 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 対象イベント全件へ並列度無制限で read + write している<br>イベント数が増えると Firestore 書き込みが一斉に走る |
| [x] | RC-13 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `assertNoSoldOutMenus` を try/catch で包んでメッセージを捨てる同形コードが 4 箇所ある<br>`findSoldOutMenuIds` で判定すれば try/catch 自体が不要 |
| [ ] | RC-14 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 非 enterprise 経路に追加した read-only トランザクションが直前の検証と重複している<br>書き込みがないため競合防止にならず、仕様 §8.3 でも Stripe 経路の超過は範囲外としている |
| [x] | RC-15 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 限定食数入力を watch 2 本で双方向同期している<br>同ファイルの `dateStart` / `dateEnd` と同じ `computed` の get/set に揃える |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventCartDialog.vue:106`

**該当コード（レビュー時点の diff）**:

```diff
+const getAddToCartErrorMessage = (error: unknown): string | null => {
+  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
+    return error.message
+  }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `functions/failed-precondition` のサーバーメッセージを無条件で UI に表示している。`addToCart` は `メニューが選択されていません: ${menu.menu_id}` のように内部 ID を含むメッセージも同じコードで返すため、利用者に無意味な文字列と内部識別子が出る → 売切・限定食数のメッセージ（`SOLD_OUT_MENU_ERROR_MESSAGE` / `MENU_LIMIT_EXCEEDED_MESSAGE`）に一致する場合だけ生表示し、それ以外は `ja.ts` の汎用文言にフォールバックする。

**コメント要約**: `failed-precondition` のサーバーメッセージをそのまま UI に表示している
`メニューが選択されていません: {menu_id}` 等の内部 ID を含む文言も露出する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `common/src/utils/failedPreconditionMessage.ts` の `getUserFacingFailedPreconditionMessage` で売切・限定食数メッセージのみ生表示し、`EventCartDialog.vue` / `cart.vue` はそれ以外を `ja.ts` 汎用文言へフォールバックするよう修正した。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventMenuList.vue:104`

**該当コード（レビュー時点の diff）**:

```diff
                   <v-btn
                     class="menu-button menu-button-single"
-                    :class="{ 'disable-menu-button': disabled }"
+                    :class="{ 'disable-menu-button': isMenuAddDisabled(menu) }"
                     color="primary"
                     rounded="pill"
                     elevation="5"
                     :prepend-icon="mdiFoodForkDrink"
+                    :disabled="isMenuAddDisabled(menu)"
                     @click="emit('selectMenu', menu)"
                   >
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: 変更前の `disabled` prop はスタイル（`opacity: 0.6`）だけに使われ、クリック自体は通していた。親（`user` / `enterprise` の `e/[eventId]/index.vue`）が `selectMenu` を受けて「注文受付開始前」「定員に達しました」等の理由を `menu_disabled_reason.*` でアラート表示する設計になっている。ここに `:disabled` を付けると `@click` が発火しなくなり、既存の理由アラートがすべて出なくなる。さらに本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` の分岐も到達不能になり、仕様 §4.3.2 の「無効理由: 『限定食数に達しました。カートに追加できません』」を満たせない → `:disabled` を外し、`:class` によるグレーアウトとボタンラベルの「売り切れ」「完売」表示のみに留める。

**コメント要約**: `:disabled` 追加でカート追加ボタンの `@click` が発火せず、無効理由アラートが到達不能になる
本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` も含め仕様 §4.3.2 を満たさない

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 既存 UX の回帰かつ本 PR の仕様（無効理由の表示）を満たさない。修正方針が一意のため手順 3a で自動修正した（横長・グリッド両レイアウトの 2 箇所）。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/pages/cart.vue:293`

**該当コード（レビュー時点の diff）**:

```diff
+watch(
+  cart,
+  async (cartItems) => {
+    clearMenuLimitWatches()
+    ...
+    const eventStoreOptions = await resolveEventStoreOptions()
+    ...
+        const eventMenus = await eventStore.getLoadedMenus()
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `watch` の async コールバック全体に try/catch がない。`getLoadedMenus()` は 5 秒でタイムアウトして reject する実装のため、読み込みが遅いと unhandled rejection になり、`menuSoldOutByEvent` / `menuLimitRemainingByEvent` への代入も行われず売切・残数表示が無言で止まる → try/catch で囲み、`reportClientError` に送る。`confirmedOrders` の watch から呼ぶ `refreshLimits` も同様。

**コメント要約**: `watch(cart)` の非同期コールバックに try/catch がなく unhandled rejection になる
`getLoadedMenus()` は 5 秒 timeout で reject するため売切・残数表示が無言で止まる

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: チェックリスト「イベントハンドラ・ライフサイクルフックから呼ぶ非同期処理に try/catch があるか」「握りつぶすと調査不能になる catch 節で `reportClientError` を呼んでいるか」に該当。方針が一意のため手順 3a で自動修正した。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/pages/cart.vue:303`

**該当コード（レビュー時点の diff）**:

```diff
+    await Promise.all(
+      cartItems.map(async (cartItem) => {
+        ...
+      }),
+    )
+    menuSoldOutByEvent.value = nextSoldOut
+    menuLimitRemainingByEvent.value = nextLimit
+  },
+  { immediate: true, deep: true },
+)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: `deep: true` の watch でカートが短時間に複数回変わると、先行実行の `Promise.all` が後から解決して古い `nextSoldOut` / `nextLimit` を上書きしうる（stale write）。個数の +/- を連打したときに表示が巻き戻る → 実行ごとに世代カウンタを持ち、代入前に最新世代か確認する。

**コメント要約**: カート連続更新時に古い非同期結果が後勝ちする（stale write）
開始時のカート内容と一致するかを確認してから代入する

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 種別が 📐 リファクタで工数 M のため、auto-fix-policy の条件付き自動修正（S + 🔧/📄）に該当しない。

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/pages/cart.vue:436`

**該当コード（レビュー時点の diff）**:

```diff
+  const limitMap = await loadMenuLimitRemainingMap(eventId)
+  if (limitMap.size > 0) {
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `checkCart` のスコープに `eventId` は存在しない（分割代入しているのは `event` と `orders`）。`vue-tsc` で `error TS2552: Cannot find name 'eventId'` になり、CI の Typecheck が失敗する → `event.event_id` を渡す。

**コメント要約**: `checkCart` に存在しない `eventId` を参照しており型エラー（CI Typecheck が失敗する）
`event.event_id` が正しい

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ビルドが通らない明確な不具合で、正しい値が一意に決まるため手順 3a で自動修正した。

---

**識別子**: RC-6（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/composable/useMenuLimitRemaining.ts:20`

**該当コード（レビュー時点の diff）**:

```diff
+/** limit_per_event はイベント全体の注文数で計算するため、enterprise 注文フィルタを外した store を使う */
+export function getMenuLimitOrderEventStore(eventId: string): EventStore {
+  const enterpriseId = resolveInjectedCommunityScope()?.enterpriseId
+  ...
+export async function loadMenuLimitRemainingMap(eventId: string): Promise<Map<string, MenuLimitRemainingInfo>> {
+  const eventStore = getMenuLimitOrderEventStore(eventId)
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `resolveInjectedCommunityScope` は「setup 内でのみ呼ぶ」と明記された `inject` ラッパーだが、`loadMenuLimitRemainingMap` は `cart.vue` の `watch` コールバックと `checkCart`（注文確定ハンドラ）から呼ばれており、いずれも setup 外。`inject` は警告とともに `undefined` を返すため、enterprise アプリでもテナントスコープが解決できず、意図と異なる store（別 pinia ID・別フィルタ）を生成する。AGENTS.md / チェックリストの「`inject()` を内部で使う composable を computed getter・watch コールバック・非同期ハンドラから呼んでいないか」にも反する → `cart.vue` が既に持つ `resolveEventStoreOptions()`（ID トークン claim 由来）の結果を引数で渡す形にし、`loadMenuLimitRemainingMap(eventId, options)` にする。setup から使う `useMenuLimitRemaining` 側だけ inject を解決する。

**コメント要約**: `loadMenuLimitRemainingMap` が setup 外（watch・非同期ハンドラ）から `inject` を呼んでいる
enterprise スコープが解決できず、誤ったスコープの store を生成する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 規約違反かつテナントスコープの誤りにつながる。`cart.vue` に既存の解決パターン（`resolveEventStoreOptions`）があり修正方針が一意のため、手順 3a で自動修正した。あわせて `getMenuLimitOrderEventStore` を `toMenuLimitEventStoreOptions` に置き換え、PF スコープ（`ordersEnterpriseId == null`）ではフィルタを外さない従来挙動を維持している。

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/composable/useMenuLimitRemaining.ts:100`

**該当コード（レビュー時点の diff）**:

```diff
+    timeoutId = setTimeout(() => {
+      stop()
+      resolve([])
+    }, 10_000)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: 注文の購読が 10 秒で完了しなかったとき空配列で resolve している。呼び出し側は「確定注文 0 件」と解釈するため残数が上限そのまま（満数）で表示され、`checkCart` の事前チェックも通ってしまう。チェックリストの「『対象外・未設定』と『取得失敗』を同一表示にしていないか」に該当する → タイムアウト時は reject するか `null` を返し、残数表示を「取得できませんでした」相当に分岐させる。上限判定自体はサーバー側が正本なので実害は表示と事前チェックに限られる。

**コメント要約**: `waitForConfirmedOrders` が 10 秒 timeout で `resolve([])` し、取得失敗を「注文 0 件」として扱う
残数が満数表示になり、カート側の事前チェックもすり抜ける

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: reject / `null` 返却のどちらを採るかで呼び出し側の分岐が変わり、修正方針が一意でないため自動修正の対象外とした。

---

**識別子**: RC-8（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/event.ts:210`

**該当コード（レビュー時点の diff）**:

```diff
 const resolveEventStorePiniaId = (eventId: string, options: EventStoreOptions): string => {
+  if (options.skipOrdersEnterpriseFilter === true) {
+    return `/events/${eventId}/menu-limit-orders`
+  }
   const hasOrdersFilter = 'ordersEnterpriseId' in options
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: 他の分岐は options の内容を ID に反映しているのに、この分岐だけ `eventsEnterpriseId` を無視した固定 ID を返す。現状は同一 `eventId` に複数テナントのスコープが同時に来ないため実害はないが、store ID を決める要素が options と一致しないのは将来のバグ源（チェックリスト「store ID を決める要素を複数箇所に手書きコピーしていないか」） → 既存の ID 組み立てにサフィックスを足す形にして、events 側フィルタも ID に含める。

**コメント要約**: `skipOrdersEnterpriseFilter` のとき pinia ID が options を無視した固定値になる
events 側の enterprise フィルタ差が store ID に反映されない

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: `resolveEventStorePiniaId` で通常 ID を組み立てたうえで `skipOrdersEnterpriseFilter` 時のみ `/menu-limit-orders` サフィックスを付与する形に変更し、events 側フィルタ差を ID に反映した。

---

**識別子**: RC-9（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/utils/assertEventMenusOrderable.ts:5`

**該当コード（レビュー時点の diff）**:

```diff
+function findEventMenu(eventMenus: EventMenu[], menuId: string): EventMenu | undefined {
+  return eventMenus.find((m) => m.menu_id === menuId || m.id === menuId)
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: 同一実装の `findEventMenu` が `common/src/utils/assertEventMenusOrderable.ts` / `common/src/utils/menuLimit.ts` / `functions/default/src/utils/menuLimitValidation.ts` の 3 箇所にコピーされている。`menu_id` と `id` の両方で照合するという仕様が分散するとずれたときに気づけない → common に 1 つ置いて 3 箇所から使う。

**コメント要約**: `findEventMenu` が 3 ファイルに重複定義されている
common に 1 つ置いて共有する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: `common/src/utils/findEventMenu.ts` に共通化し、`assertEventMenusOrderable.ts` / `menuLimit.ts` / `menuLimitValidation.ts` から import するよう修正した。

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/utils/assertEventMenusOrderable.ts:12`

**該当コード（レビュー時点の diff）**:

```diff
+/**
+ * 注文対象 menu_id のうち、is_selected かつ !is_sold_out を満たさない ID を返す（addToCart 用）。
+ */
+export function findUnorderableMenuIds(eventMenus: EventMenu[], menuIds: readonly string[]): string[] {
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `findUnorderableMenuIds` はどこからも呼ばれていない（`addToCart` は `eventMenu.is_selected` / `is_sold_out` をループ内で直接判定している）。チェックリスト「置換・刷新後に旧実装・未使用 export が残っていないか」に該当する → 削除する。

**コメント要約**: `findUnorderableMenuIds` がどこからも呼ばれていない
デッドコードのため削除する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 📌 スコープ内 + S + 🔧 微修正 + 方針一意のため、手順 3b で自動修正した。

---

**識別子**: RC-11（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/utils/menuLimit.ts:14`

**該当コード（レビュー時点の diff）**:

```diff
+export function countOrderedByMenuIds(
+  orders: readonly EventMemberOrder[],
+  menuIds: readonly string[],
+): Map<string, number> {
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `countOrderedByMenuIds` はどこからも呼ばれていない（クライアントは `countOrderedByMenuId`（単数）、Functions は `countOrderedMenus`（Firestore クエリ）を使う）。テストもない → 削除する。

**コメント要約**: `countOrderedByMenuIds` がどこからも呼ばれていない
デッドコードのため削除する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 📌 スコープ内 + S + 🔧 微修正 + 方針一意のため、手順 3b で自動修正した。

---

**識別子**: RC-12（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/eventMenusSoldOutSync.ts:24`

**該当コード（レビュー時点の diff）**:

```diff
+  const results = await Promise.allSettled(
+    events.map(async (event) => syncSoldOutToEventMenu(event, menuId, isSoldOut)),
+  )
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: 注文受付中イベント全件に対して並列度の制限なく `getMenus()` + `saveMenu()` を走らせている。人気店で受付中イベントが数十〜数百件あると Firestore への読み書きが一斉に発生し、リトライ時も同数が再実行される（トリガーは `retry: true`）。チェックリストの「ループ内で Firestore の read/write を逐次 await していないか（並列度を制限した実行を検討する）」に該当する → 並列度を制限したバッチ実行にする。

**コメント要約**: 対象イベント全件へ並列度無制限で read + write している
イベント数が増えると Firestore 書き込みが一斉に走る

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 並列度の値を決める判断が要り、方針が一意でないため自動修正の対象外とした。ラベルは実害が顕在化していない規模のため `—`。

---

**識別子**: RC-13（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/memberOrders.ts:303`

**該当コード（レビュー時点の diff）**:

```diff
+      const eventMenus = await eventData.getMenus(transaction)
+      try {
+        assertNoSoldOutMenus(
+          eventMenus,
+          orders.map((order) => order.menu_id),
+        )
+      } catch {
+        throw new HttpsError('failed-precondition', SOLD_OUT_MENU_ERROR_MESSAGE)
+      }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: 「throw する関数を呼んで catch し、捨てて別の例外を投げ直す」同形コードが `memberOrders.ts` と `stripe.ts` に計 4 箇所ある。`findSoldOutMenuIds(eventMenus, menuIds).length > 0` で判定すれば try/catch 自体が不要で、超過メニュー名をエラーに含める余地も残る（チェックリスト「インターフェースが統一されている関数群を個別に try-catch で囲んでいないか」） → `findSoldOutMenuIds` による判定に置き換えるか、`HttpsError` へ変換するヘルパーを 1 つ作って 4 箇所から呼ぶ。

**コメント要約**: `assertNoSoldOutMenus` を try/catch で包んでメッセージを捨てる同形コードが 4 箇所ある
`findSoldOutMenuIds` で判定すれば try/catch 自体が不要

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: `memberOrders.ts` / `stripe.ts` の 4 箇所を `findSoldOutMenuIds` による判定に置き換え、try/catch でメッセージを捨てる同形コードを削除した。

---

**識別子**: RC-14（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/stripe.ts:182`

**該当コード（レビュー時点の diff）**:

```diff
+      await db.runTransaction(async (transaction) => {
+        const ordersInTx = await getOrdersByIds(community_id, event_id, uid, order_ids, transaction)
+        ...
+        await assertMenuLimitsForConfirm({
+          eventId: event_id,
+          eventMenus: eventMenusInTx,
+          orders: ordersInTx,
+          transaction,
+        })
+      })
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: 非 enterprise 経路に追加したこのトランザクションは書き込みを一切行わないため、Firestore のコミット時競合検知が働かず、同時決済に対する保護にならない。直前（103〜115 行）の非トランザクション検証と実質同じチェックを 28 行複製しているだけで、注文が `ordered` になるのは Stripe webhook 側であり、仕様書 §8.3 も「事前クレカ決済での超過は本仕様の範囲外」と明記している → トランザクションを外して直前の早期失敗チェックに `assertMenuLimitsForConfirm` を足す形に寄せるか、webhook 側での最終検証として設計し直す。

**コメント要約**: 非 enterprise 経路に追加した read-only トランザクションが直前の検証と重複している
書き込みがないため競合防止にならず、仕様 §8.3 でも Stripe 経路の超過は範囲外としている

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 決済経路の検証をどこに置くかは仕様判断（webhook 側の最終検証を含む）を伴うため、自動修正の対象外とした。

---

**識別子**: RC-15（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `partner/src/components/MenuEditCard.vue:53`

**該当コード（レビュー時点の diff）**:

```diff
+const limitPerEventInput = ref<string | number>('')
+
+watch(
+  () => menu.value.limit_per_event,
+  (value) => {
+    limitPerEventInput.value = value ?? ''
+  },
+  { immediate: true },
+)
+
+watch(limitPerEventInput, (value) => {
+  if (value === '' || value == null) {
+    menu.value.limit_per_event = null
+    return
+  }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/S]: 同じファイルの `dateStart` / `dateEnd` は `computed` の get/set で双方向同期しているのに、限定食数だけ watch 2 本で組んでいる（チェックリスト「`watch` の多用をしていないか（`computed` で代替できる場合）」）。加えて不正値のときに `menu.limit_per_event` を更新しないため、入力欄の表示とモデルが乖離した状態が残る → 既存の `computed` パターンに揃える。

**コメント要約**: 限定食数入力を watch 2 本で双方向同期している
同ファイルの `dateStart` / `dateEnd` と同じ `computed` の get/set に揃える

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: `limitPerEventInput` の watch 2 本を `dateStart` / `dateEnd` と同様の `computed` get/set（`limitPerEvent`）に置き換えた。

---

## 評価セッション（2026-08-30 18:50・review-comments-evaluate）

- **評価日時**: 2026-08-30 18:50 JST
- **ブランチ名**: `feat/1774`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2341
- **REVIEW_REQUEST_SINCE**: 2026-08-30T09:40:30Z
- **partial**: false（Copilot 実質レビュー + Codex substantive あり）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（レビュー依頼定型文 #5467939399、Copilot 承知返信 #5467946376、Codex 接続案内 #5467947005）
- **既存 RC への外部レビュー補強**（新規採番なし）: RC-1 ← #3889021813, #3889021823, #3889026067 / RC-7 ← #3889021791, #3889026063 / RC-8 ← #3889021800 / RC-12 ← #3889021847 / RC-14 ← #3889021840
- **手順 4a 自動修正**: なし（新規 🚨 / 条件付き 🟡 なし。既存未着手 RC も M・📐・👤 UX 等で対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-16 | 3889026056 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 💰 金銭, 💾 データ | 📋 仕様追加 | M | Checkout 〜 Webhook 間に限定食数枠が確保されない<br>§8.3 で Stripe 超過は別 Issue。予約 or Webhook 再検証は別対応 |
| [x] | RC-17 | 3889026059 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📄 ドキュメントのみ | S | 受付中イベントへ上限変更が反映されない旨を UI に未明示<br>§5.2 に沿い将来イベントのみ対象であることを hint で示す |
| [x] | RC-18 | 3889026071 | 👌 修正不要 | — | — | 🐛 実害, 📑 仕様書 | 📋 仕様追加 | M | 締切過ぎ `accepting_order` イベントが売切同期対象外<br>締切延長後も EventMenu が古い販売中のまま注文可能 |
| [ ] | RC-19 | 3889026074 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📐 リファクタ | M | 上限未設定イベントでも `confirmedOrders` 購読が開始される<br>限定メニュー確認後に購読し、集計も `ordered` に絞る |

---

**識別子**: RC-16（GitHub id: 3889026056）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stripe.ts:208`

**該当コード（レビュー時点の diff）**:

```diff
+      await db.runTransaction(async (transaction) => {
+        const ordersInTx = await getOrdersByIds(community_id, event_id, uid, order_ids, transaction)
+        ...
+        await assertMenuLimitsForConfirm({
+          eventId: event_id,
+          eventMenus: eventMenusInTx,
+          orders: ordersInTx,
+          transaction,
+        })
+      })
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  決済完了まで限定食数を予約する**

事前カード決済や PayPay で Checkout Session を作成してから支払いが完了するまでに、別ユーザーが残枠を確定すると、この読み取り専用トランザクションは既に終了しているため限定食数を確保できません。確認した `functions/default/src/stripeWebhook.ts` の確定処理（321–429 行）は限定食数を再検証せず注文を `ordered` にするため、支払い済み注文が上限を超えます。Session 作成時に共有在庫を予約するか、Webhook で原子的に再検証して超過時の返金・補償処理を行ってください。

Useful? React with 👍 / 👎.

**コメント要約**: Checkout Session 作成時の read-only 検証は決済完了まで枠を確保しない
Webhook 側も限定食数を再検証しないため、支払い済み注文が上限超過しうる

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📤 スコープ外

**ラベル**: 💰 金銭, 💾 データ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 指摘は妥当だが、`documents/04_飲食店向け/14_限定食数機能.md` §8.3 で事前クレカ決済の超過・返金は本仕様範囲外と明記されている（定員と同構造で別 Issue）。RC-14 と同系統。予約機構 or Webhook 再検証は設計判断を伴うため本 PR では 📤 とした。

---

**識別子**: RC-17（GitHub id: 3889026059）

**レビュワー**: Codex

**指摘箇所**: `partner/src/components/MenuEditCard.vue:204`

**該当コード（レビュー時点の diff）**:

```diff
+      <v-card-text>
+        <v-text-field
+          v-model="limitPerEventInput"
+          type="number"
+          min="1"
+          clearable
+          :label="$t('menu_edit_card.limit_per_event')"
+          :placeholder="$t('menu_edit_card.limit_per_event_placeholder')"
+          :hint="$t('menu_edit_card.limit_per_event_hint')"
+          persistent-hint
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  受付中イベントへ上限変更が反映されないことを明示する**

既に `accepting_order` のイベントがある状態で店舗がこの値を変更しても、EventMenu はスナップショットのままで、追加された同期 Trigger も `is_sold_out` しか更新しません。そのため、このヒントだけでは店舗が現在受付中のイベントにも新しい上限が適用されたと誤認し、古い上限で受注が継続します。仕様書 `documents/04_飲食店向け/14_限定食数機能.md` §5.2 にも差し戻しが必要な旨を明示するとあるため、入力欄付近に対象が将来のイベントのみであることと変更手順を表示してください。

Useful? React with 👍 / 👎.

**コメント要約**: 受付中イベントには `limit_per_event` 変更が反映されない
入力欄 hint に将来イベントのみ対象である旨と手順を明示すべき

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: `partner/src/locales/messages/ja.ts` の `limit_per_event_hint` に、受付中イベントへは反映されない旨と差し戻し手順（仕様 §5.2）を追記した。

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stores/event.ts:392`

**該当コード（レビュー時点の diff）**:

```diff
+export const getAcceptingOrderEventsByPartner = async (
+  partnerId: string,
+  nowDateTimeMillis: number,
+): Promise<ShokujiiEvent[]> => {
+  ...
+    .where('event_status.value', '==', 'accepting_order')
+    .where('is_deleted', '==', false)
+    .where('event_deadline_datetime', '>', Timestamp.fromMillis(nowDateTimeMillis))
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  締切延長で再開するイベントも売り切れ同期する**

保存上のステータスが `accepting_order` のまま締切を過ぎたイベントで店舗が売り切れを切り替えると、この条件により同期対象から除外されます。その後、主催者が締切を延長して注文受付を再開しても、`updateEventMenus` は `accepting_order` では `is_selected` しか更新しないため、EventMenu は古い販売中状態のままです。Callable 側も EventMenu を正本にしているので売り切れメニューの注文が通ります。締切延長時に現在の PartnerMenu 状態を再同期するか、後で再開可能なイベントをこの同期から除外しないでください。

Useful? React with 👍 / 👎.

**コメント要約**: 締切過ぎの `accepting_order` イベントは売切同期クエリから除外される
締切延長で再開しても EventMenu の `is_sold_out` が更新されず注文可能なまま

**評価**: 🚨 必須修正

**ステータス**: —

**PRスコープ**: —

**ラベル**: 🐛 実害, 📑 仕様書

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 指摘の再現経路は「主催者が締切を延長して注文受付を再開する」ケースだが、本プロダクトでは主催者による締切延長はできない。よって実運用上の実害はなく、本 PR では対応不要とする（評価は Codex 指摘のまま維持）。

---

**識別子**: RC-19（GitHub id: 3889026074）

**レビュワー**: Codex

**指摘箇所**: `base/src/composable/useMenuLimitRemaining.ts:36`

**該当コード（レビュー時点の diff）**:

```diff
+  const remainingByMenuId = computed(() => {
+    const menus = eventStore.menus
+    const confirmedOrders = eventStore.confirmedOrders
+    if (menus == null || confirmedOrders == null) {
+      return null
+    }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  上限未設定イベントで注文全件の購読を開始しない**

`remainingByMenuId` はメニューに `limit_per_event` があるか確認する前に `eventStore.confirmedOrders` を参照するため、限定食数を一件も設定していない通常イベントでも `member_orders` のリアルタイム購読が開始されます。実際の `subscribeOrders` は `status` を絞らずイベント内のカート・処理中・キャンセル済みを含む全注文ドキュメントを取得するので、イベントページを開くだけで不要な読み取りと更新課金が発生し、大規模イベントほど表示負荷が増えます。限定メニューの存在を確認してから購読を開始し、集計クエリも `status == 'ordered'` と対象メニューに絞ってください。

Useful? React with 👍 / 👎.

**コメント要約**: 上限未設定イベントでも `confirmedOrders` 参照で全注文購読が走る
限定メニュー有無を先に確認し、購読・集計を絞るべき

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: パフォーマンス改善として妥当。store 購読タイミングの設計変更を伴い 📐 + M のため自動修正対象外。

---

## 評価セッション（2026-08-30 20:43・review-comments-evaluate auto）

- **評価日時**: 2026-08-30 20:43 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/1774`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2341
- **REVIEW_REQUEST_SINCE**: 2026-08-30T11:33:34Z
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（Copilot 承知返信・Codex connect 案内・レビュー依頼定型文）
- **新規 RC**: 4 件（RC-20〜RC-23）
- **自動修正**: RC-20〜23 すべて対応済み

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-20 | 3889252198, 3889259721 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 限定食数完売時も `event_menu.sold_out` を表示している<br>`limit_sold_out`（完売）に分岐する |
| [x] | RC-21 | 3889252207 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カート残数 0 時に `sold_out` を表示している<br>限定食数由来は `limit_sold_out` を使う |
| [x] | RC-22 | 3889259717 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | ダイアログ表示中に売切変更されても古い `props.menu` を参照<br>`eventStore.menus` から最新メニューを解決する |
| [x] | RC-23 | 3889259722 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📏 規約 | 🔧 微修正 | S | `formatLimitedPeriodRange` が端末 TZ 依存<br>`common` の JST 固定変換へ移行 |

---

**識別子**: RC-20（GitHub id: 3889252198, 3889259721）

**レビュワー**: Copilot / Codex

**指摘箇所**: `base/src/components/EventMenuList.vue:36`

**該当コード（レビュー時点の diff）**:

```diff
+const getMenuJoinButtonLabel = (menu: BokudeliEventMenu): string => {
+  if (menu.is_sold_out || isMenuLimitSoldOut(menu)) {
+    return $t('event_menu.sold_out')
+  }
```

**レビュワーのコメント（原文）**:

[must] 限定食数で完売（`isMenuLimitSoldOut`）のケースでもボタン文言が `event_menu.sold_out`（売り切れ）になっています。`event_menu.limit_sold_out`（完売）が用意されているので、売り切れと限定食数完売でラベルを分けたほうが利用者の理解が一致します。

（Codex 3889259721 も同一指摘）

**コメント要約**: 限定食数完売時も手動売切と同じ `sold_out` 文言になる
`is_sold_out` と `isMenuLimitSoldOut` を分岐し `limit_sold_out` を使う

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: i18n に `limit_sold_out`（完売）が定義済み。手順 4a で `getMenuJoinButtonLabel` を分岐修正。

---

**識別子**: RC-21（GitHub id: 3889252207）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/pages/cart.vue:921`

**該当コード（レビュー時点の diff）**:

```diff
+                            : $t('event_menu.sold_out')
```

**レビュワーのコメント（原文）**:

[must] 限定食数の残数が 0 の場合に `event_menu.sold_out`（売り切れ）を表示していますが、i18n に `event_menu.limit_sold_out: 完売` を追加しているので文言が混同します。限定食数由来の 0 のときは `limit_sold_out` を使うほうが仕様・表示意図に合います。

**コメント要約**: カートの限定食数残数 0 表示が `sold_out` になっている
限定食数由来は `limit_sold_out` に変更

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 手順 4a で残数 0 分岐の文言を `limit_sold_out` に変更。

---

**識別子**: RC-22（GitHub id: 3889259717）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/EventCartDialog.vue:51`

**該当コード（レビュー時点の diff）**:

```diff
+const isAddDisabled = computed(
+  () => props.menu.is_sold_out || isMenuLimitSoldOut(props.menu) || countOptions.value.length === 0,
+)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ダイアログでも最新の売り切れ状態を参照する**

カート追加ダイアログを開いたまま店舗がメニューを売り切れにすると、親画面の `selectedMenuState.menu` は選択時のオブジェクトを保持する一方、メニュー購読は配列を新しいオブジェクトで置換するため、ここでは古い `is_sold_out` が参照され続けます。その結果、ダイアログの追加ボタンが有効なままとなり、利用者は追加後のサーバーエラーで初めて売り切れを知るため、`eventStore.menus` から `menu_id` で最新メニューを解決して判定してください。

**コメント要約**: ダイアログが古い `props.menu` を参照し売切後も追加可能
`eventStore.menus` から `menu_id` で最新状態を解決する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: リアルタイム売切同期後に UI が古い状態のまま注文可能になる実害あり。手順 4a で `currentMenu` computed を追加し判定・表示を最新メニューに統一。

---

**識別子**: RC-23（GitHub id: 3889259722）

**レビュワー**: Codex

**指摘箇所**: `base/src/utils/datetime.ts:9`

**該当コード（レビュー時点の diff）**:

```diff
+export const formatLimitedPeriodRange = (startMillis: number, endMillis: number): string => {
+  const startFormatted = format(startMillis, 'yyyy/M/d')
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  販売期間をJSTで整形する**

ブラウザのタイムゾーンが Asia/Tokyo 以外の場合、`date-fns` の `format` は端末のローカルタイムゾーンで epoch millis を整形するため、JST の日付境界で保存された販売期間が前日などにずれて表示されます。プロジェクト共通の日時ユーティリティは Asia/Tokyo を既定値としているため、この整形処理も `common/src/utils/datetime.ts` 側へ移し、共通変換を利用してください。

**コメント要約**: `date-fns format` が端末 TZ 依存で販売期間表示がずれる
`common` の JST 固定変換へ移行する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: AGENTS.md の日時表示規約に沿い `formatLimitedPeriodRange` を `common/src/utils/datetime.ts` に移し、`base/src/utils/datetime.ts` を削除。`MenuStatusChips` の import を更新。

---

## 評価セッション（2026-08-30 21:14・auto / wait-ai-pr-review）

- **評価日時**: 2026-08-30 21:14 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/1774`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2341
- **REVIEW_REQUEST_SINCE**: 2026-08-30T12:06:22Z
- **partial**: true（Codex 接続案内のみ。Copilot インライン 2 件）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（Codex 接続案内 1、Copilot トップレベル確認コメント 1）
- **新規 RC**: 1 件（RC-24）。RC-4 は Copilot id 3889327188 が同一指摘のため重複 RC 化せず GitHub id を追記
- **自動修正**: 該当なし（RC-24 は 👌。RC-4 は 📐 M で auto-fix 対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-24 | 3889327167 | 👌 修正不要 | — | — | 👤 UX, 📑 仕様書 | 👀 確認のみ | — | `EventMenuList` の v-btn に `:disabled` を付ける提案<br>親の `selectMenu` がクリックで無効理由アラートを出す設計のため RC-2 と矛盾 |

---

**識別子**: RC-24（GitHub id: 3889327167）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventMenuList.vue:113`

**該当コード（レビュー時点の diff）**:

```diff
                 <div class="d-flex align-center justify-end flex-shrink-0">
                   <v-btn
                     class="menu-button menu-button-single"
-                    :class="{ 'disable-menu-button': disabled }"
+                    :class="{ 'disable-menu-button': isMenuAddDisabled(menu) }"
                     color="primary"
                     rounded="pill"
                     elevation="5"
                     :prepend-icon="mdiFoodForkDrink"
                     @click="emit('selectMenu', menu)"
```

**レビュワーのコメント（原文）**:

[must] isMenuAddDisabled(menu) を見た目（opacity）にしか反映しておらず、ボタン自体はクリック可能なままです。disabled=true のときは EventMenuList 側で v-btn を実際に disabled にしないと、親側の実装次第でモーダルが開く・二重アクション等が起きえます。

**コメント要約**: `EventMenuList` の参加ボタンに `:disabled` を付け、見た目だけでなくクリック自体を無効化すべき
親実装次第でモーダルが開くリスクがある

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 👤 UX, 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: `user` / `enterprise` の `e/[eventId]/index.vue` は `selectMenu` 内で `menu.is_sold_out` / `isMenuLimitSoldOut` を検知し `menu_disabled_reason.sold_out` / `menu_limit` をアラート表示する（仕様 §4.3.2）。RC-2 で `:disabled` を外し opacity + ラベル変更のみにしたのは、このクリック経路を維持するため。`:disabled` を付けると RC-2 の回帰になり無効理由が表示不能になる。Copilot トップレベルコメントも resolved 済み RC-20/21 を確認しており、本指摘は設計理解不足。

---

## 評価セッション（2026-08-30 21:32・review-comments-evaluate）

- **評価日時**: 2026-08-30 21:32 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` manual）
- **ブランチ名**: `feat/1774`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2341
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 11（レビュー依頼定型文 3、Codex 接続案内 3、Copilot 承知/確認コメント 3、PR 説明 1、Copilot エラー返信 1）
- **新規 RC**: 6 件（RC-25〜RC-30）。RC-4 ← #3888809799、RC-12 ← #3889337016 は重複 RC 化せず GitHub id 追記
- **自動修正**: RC-25 を手順 4a で対応（`MenuStatusChips` に `isLimitSoldOut`、`EventCartDialog` で完売 chip 表示）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-25 | 3889337013 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 🔧 微修正 | S | ダイアログ内で残数0時にステータス chip が消え無言無効化<br>§4.4.2 に沿い売切/完売 chip を表示する |
| [ ] | RC-26 | 3888809794 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カートの売切表示が初回スナップショットのまま<br>`eventStore.menus` 更新時にも `menuSoldOutByEvent` を再構築する |
| [x] | RC-27 | 3889076389 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | `skipOrdersEnterpriseFilter` で CG クエリが Rules と不整合<br>1 イベント単位の限定食数スコープでは enterprise フィルタ外しは問題なし |
| [x] | RC-28 | 3888809796 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | M | 売切同期が `saveMenu` で EventMenu 全体を書き戻し<br>Transaction 内再取得の `updateMenuSoldOut` で最新フィールドを反映 |
| [ ] | RC-29 | 3888809792 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | トリガー実行順で古い売切状態が後勝ちしうる<br>同期時に PartnerMenu を再取得するか世代比較が必要 |
| [ ] | RC-30 | 3888809790 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭, 🐛 実害 | 📋 仕様追加 | L | 同時 `confirmOrder` で読取のみの上限チェックが競合<br>メニュー単位の共有カウンタ更新で直列化が必要 |

---

**識別子**: RC-25（GitHub id: 3889337013）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/EventCartDialog.vue:39`

**該当コード（レビュー時点の diff）**: （diff 先頭省略・末尾優先）

```diff
+const currentMenu = computed(() => {
+  const menus = eventStore.menus
+  if (menus == null) {
+    return props.menu
+  }
+  return menus.find((m) => m.menu_id === props.menu.menu_id) ?? props.menu
+})
+
+const remainingInfo = computed(() => getRemainingForMenu(currentMenu.value))
+
+const showRemainingChip = computed(
+  () =>
+    !currentMenu.value.is_sold_out &&
+    !isMenuLimitSoldOut(currentMenu.value) &&
+    remainingInfo.value != null &&
+    remainingInfo.value.remaining > 0,
+)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  完売理由をダイアログ内に表示する**

ダイアログを開いた後に別ユーザーが最後の1食を確定するか、店舗がメニューを売り切れにすると、この条件でステータスチップが消える一方、追加ボタンは無言で無効化されます。個数欄も残数0では消えるため、利用者には操作できない理由が分かりません。`documents/04_飲食店向け/14_限定食数機能.md` §4.4.2 が残数0時の「完売」表示を要求しているため、手動売り切れまたは限定食数完売のチップを表示してください。

**コメント要約**: ダイアログ内で残数0・売切時にステータス chip が消え、追加ボタンだけ無効化される
§4.4.2 に沿い手動売切または限定食数完売の chip を表示すべき

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 §4.4.2 の「完売」表示要件に該当。`MenuStatusChips` に `isLimitSoldOut` を追加し、`EventCartDialog` で残数 chip 非表示時に売切/完売 chip を出すよう手順 4a で修正した。

---

**識別子**: RC-26（GitHub id: 3888809794）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/pages/cart.vue`（インライン行 outdated）

**該当コード（レビュー時点の diff）**: `(diff_hunk 未取得・position null)`

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  カート内の売り切れ表示をメニュー更新に追従させる**

カートを開いた後に店舗がメニューを売り切れへ変更しても、ここで作成した `menuSoldOutByEvent` は初回ロード時のスナップショットのままです。後続では `confirmedOrders` だけを監視しており `eventStore.menus` の変更では再計算されないため、カート画面は販売中表示を維持し、確定操作を始めて初めてエラーになります。メニュー購読の更新時にも売り切れマップを再構築してください。

**コメント要約**: カートの売切表示が初回ロードのスナップショット固定で、`menus` 更新に追従しない
確定時まで UI が販売中のまま残る。`eventStore.menus` 監視で再構築が必要

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: RC-22 でダイアログ側は `currentMenu` 解決済みだが、カート一覧は `menuSoldOutByEvent` の再計算が `confirmedOrders` のみに依存。店舗売切変更の UX ギャップとして妥当。工数 M のため auto-fix 対象外。

---

**識別子**: RC-27（GitHub id: 3889076389）

**レビュワー**: Codex

**指摘箇所**: `base/src/composable/useMenuLimitRemaining.ts:21`

**該当コード（レビュー時点の diff）**:

```diff
+/** limit_per_event はイベント全体の注文数で計算するため、enterprise 注文フィルタを外す */
+export function toMenuLimitEventStoreOptions(options: EventStoreOptions): EventStoreOptions {
+  if (options.ordersEnterpriseId != null) {
+    return { ...options, skipOrdersEnterpriseFilter: true }
+  }
+  return options
+}
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  エンタープライズ注文のテナント条件を外さない**

エンタープライズ版ではこの指定により `subscribeOrders` が `enterprise_id` 条件なしの collection-group クエリ（`event_id` のみ）になりますが、`firestore.rules` 462–470 行の read 条件は各注文がログイン中の enterprise と一致することを要求しており、クエリ自体が他テナントの注文を返さないと保証できないため permission-denied になります。その結果、enterprise のイベント一覧・モーダル・カートでは限定食数の購読が成立せず、残数や完売状態を表示できません。イベントは単一 enterprise に属するため、ここでは既存の `enterprise_id` 条件を維持してください。

**コメント要約**: `skipOrdersEnterpriseFilter` により enterprise CG クエリが Rules と不整合
permission-denied で残数購読不能。enterprise_id 条件維持または別経路が必要

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 限定食数は 1 イベント内の全注文で数える仕様（§5.2）。本 PR スコープでは enterprise テナント横断の CG クエリ問題は発生しない前提とし、Codex 指摘は本 PR では対応不要と確定（ユーザー判断 2026-08-30）。

---

**識別子**: RC-28（GitHub id: 3888809796）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/eventMenusSoldOutSync.ts:68`

**該当コード（レビュー時点の diff）**:

```diff
+  const updatedMenu = new EventMenu(event.id, menuId, {
+    ...targetMenu,
+    is_sold_out: isSoldOut,
+  })
+  await event.saveMenu(updatedMenu)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  売り切れ同期で他のメニューフィールドを上書きしない**

注文受付中に主催者が `is_selected` を変更する処理とこの同期が重なると、同期側は変更前に取得した `targetMenu` 全体を `saveMenu` で書き戻すため、主催者が無効化したメニューを再び選択済みに戻す可能性があります。特に `confirmOrder` は `is_selected` を再検証しないため、その後も注文が通ります。EventMenu をトランザクション内で再取得して最新フィールドを引き継ぐなど、`is_sold_out` の変更が同時更新を巻き戻さない形にしてください。

**コメント要約**: 売切同期が取得時点の EventMenu 全体を `saveMenu` で書き戻し、同時の `is_selected` 変更を巻き戻しうる
トランザクション再取得または部分更新が必要

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: `ShokujiiEvent.updateMenuSoldOut` を追加し、Transaction 内で最新 EventMenu を再取得してから `is_sold_out` のみ変更して save するよう `eventMenusSoldOutSync` を修正。金額・`is_selected` 等は再取得時点の最新値を引き継ぐため、古いスナップショットによる巻き戻しを防止。

---

**識別子**: RC-29（GitHub id: 3888809792）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/eventMenusSoldOutSync.ts:109`

**該当コード（レビュー時点の diff）**: （`syncPartnerMenuSoldOutToEvents` 末尾・retry: true 付きトリガ）

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  最新の売り切れ状態だけをイベントへ反映する**

店舗が短時間に「販売中→売り切れ→販売中」と切り替えた場合、Firestore トリガーの実行順序やリトライ順序は更新順と一致する保証がなく、古いイベントの `afterSoldOut` が最後に書き込まれて EventMenu が売り切れのまま残る可能性があります。サーバー側の注文可否もこの EventMenu を参照するため、同期時に PartnerMenu の現在値を再取得するか更新世代を比較して、古いトリガーが最新状態を上書きしないようにしてください。

**コメント要約**: トリガー実行順・リトライ順で古い売切状態が後勝ちしうる
同期時に PartnerMenu 再取得または世代比較で最新のみ反映すべき

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: レアだが再現可能。RC-28 と合わせて sold-out sync の書き込み戦略を見直すのが自然。工数 M のため auto-fix 対象外。

---

**識別子**: RC-30（GitHub id: 3888809790）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stores/memberOrder.ts:235`

**該当コード（レビュー時点の diff）**:

```diff
+/** イベント内の menu_id ごとの確定済み（ordered）食数を返す */
+export const countOrderedMenus = async (
+  eventId: string,
+  menuIds: readonly string[],
+  transaction?: Transaction,
+```
（続く `assertMenuLimitsForConfirm` からの読取のみ検証）

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  共有在庫を更新して同時確定を直列化する**

残り1食の状態で複数ユーザーが同時に `confirmOrder` を実行すると、各トランザクションは同じ `ordered` 件数を読み取った後、互いに異なる注文ドキュメントだけを更新するため、双方が上限内と判定されてコミットできます。読み取った既存注文は更新されず競合点にならないので、上限超過を確実に防ぐにはメニュー単位の共有カウンタ／ロック用ドキュメントを同じトランザクションで更新する必要があります。

**コメント要約**: 同時 `confirmOrder` で読取のみの上限チェックは競合を防げない
メニュー単位カウンタの tx 更新で直列化が必要（RC-16 の Stripe 経路とは別）

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 🐛 実害

**変更種別**: 📋 仕様追加

**想定工数**: L

**判断理由**: 指摘は技術的に妥当。RC-16（Checkout〜Webhook 枠未確保）とは経路が異なるが、同種の同時確定問題。§5.5 カウンタ採用または tx 内ロック設計が必要で L。auto-fix 対象外。

---
