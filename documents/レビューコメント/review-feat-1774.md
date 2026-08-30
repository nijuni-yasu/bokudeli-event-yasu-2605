# ブランチ feat/1774 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-1 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | `failed-precondition` のサーバーメッセージをそのまま UI に表示している<br>`メニューが選択されていません: {menu_id}` 等の内部 ID を含む文言も露出する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | `:disabled` 追加でカート追加ボタンの `@click` が発火せず、無効理由アラートが到達不能になる<br>本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` も含め仕様 §4.3.2 を満たさない |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `watch(cart)` の非同期コールバックに try/catch がなく unhandled rejection になる<br>`getLoadedMenus()` は 5 秒 timeout で reject するため売切・残数表示が無言で止まる |
| [ ] | RC-4 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カート連続更新時に古い非同期結果が後勝ちする（stale write）<br>開始時のカート内容と一致するかを確認してから代入する |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `checkCart` に存在しない `eventId` を参照しており型エラー（CI Typecheck が失敗する）<br>`event.event_id` が正しい |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 🐛 実害 | 🔧 微修正 | S | `loadMenuLimitRemainingMap` が setup 外（watch・非同期ハンドラ）から `inject` を呼んでいる<br>enterprise スコープが解決できず、誤ったスコープの store を生成する |
| [ ] | RC-7 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | `waitForConfirmedOrders` が 10 秒 timeout で `resolve([])` し、取得失敗を「注文 0 件」として扱う<br>残数が満数表示になり、カート側の事前チェックもすり抜ける |
| [ ] | RC-8 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `skipOrdersEnterpriseFilter` のとき pinia ID が options を無視した固定値になる<br>events 側の enterprise フィルタ差が store ID に反映されない |
| [ ] | RC-9 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `findEventMenu` が 3 ファイルに重複定義されている<br>common に 1 つ置いて共有する |
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `findUnorderableMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [x] | RC-11 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `countOrderedByMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [ ] | RC-12 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 対象イベント全件へ並列度無制限で read + write している<br>イベント数が増えると Firestore 書き込みが一斉に走る |
| [ ] | RC-13 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `assertNoSoldOutMenus` を try/catch で包んでメッセージを捨てる同形コードが 4 箇所ある<br>`findSoldOutMenuIds` で判定すれば try/catch 自体が不要 |
| [ ] | RC-14 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 非 enterprise 経路に追加した read-only トランザクションが直前の検証と重複している<br>書き込みがないため競合防止にならず、仕様 §8.3 でも Stripe 経路の超過は範囲外としている |
| [ ] | RC-15 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 限定食数入力を watch 2 本で双方向同期している<br>同ファイルの `dateStart` / `dateEnd` と同じ `computed` の get/set に揃える |

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
| [ ] | RC-1 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | `failed-precondition` のサーバーメッセージをそのまま UI に表示している<br>`メニューが選択されていません: {menu_id}` 等の内部 ID を含む文言も露出する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 🐛 実害 | 🔧 微修正 | S | `:disabled` 追加でカート追加ボタンの `@click` が発火せず、無効理由アラートが到達不能になる<br>本 PR で追加した `menu_disabled_reason.sold_out` / `menu_limit` も含め仕様 §4.3.2 を満たさない |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `watch(cart)` の非同期コールバックに try/catch がなく unhandled rejection になる<br>`getLoadedMenus()` は 5 秒 timeout で reject するため売切・残数表示が無言で止まる |
| [ ] | RC-4 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | カート連続更新時に古い非同期結果が後勝ちする（stale write）<br>開始時のカート内容と一致するかを確認してから代入する |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `checkCart` に存在しない `eventId` を参照しており型エラー（CI Typecheck が失敗する）<br>`event.event_id` が正しい |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 🐛 実害 | 🔧 微修正 | S | `loadMenuLimitRemainingMap` が setup 外（watch・非同期ハンドラ）から `inject` を呼んでいる<br>enterprise スコープが解決できず、誤ったスコープの store を生成する |
| [ ] | RC-7 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | `waitForConfirmedOrders` が 10 秒 timeout で `resolve([])` し、取得失敗を「注文 0 件」として扱う<br>残数が満数表示になり、カート側の事前チェックもすり抜ける |
| [ ] | RC-8 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `skipOrdersEnterpriseFilter` のとき pinia ID が options を無視した固定値になる<br>events 側の enterprise フィルタ差が store ID に反映されない |
| [ ] | RC-9 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `findEventMenu` が 3 ファイルに重複定義されている<br>common に 1 つ置いて共有する |
| [x] | RC-10 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `findUnorderableMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [x] | RC-11 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `countOrderedByMenuIds` がどこからも呼ばれていない<br>デッドコードのため削除する |
| [ ] | RC-12 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 対象イベント全件へ並列度無制限で read + write している<br>イベント数が増えると Firestore 書き込みが一斉に走る |
| [ ] | RC-13 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | `assertNoSoldOutMenus` を try/catch で包んでメッセージを捨てる同形コードが 4 箇所ある<br>`findSoldOutMenuIds` で判定すれば try/catch 自体が不要 |
| [ ] | RC-14 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 非 enterprise 経路に追加した read-only トランザクションが直前の検証と重複している<br>書き込みがないため競合防止にならず、仕様 §8.3 でも Stripe 経路の超過は範囲外としている |
| [ ] | RC-15 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 📐 リファクタ | S | 限定食数入力を watch 2 本で双方向同期している<br>同ファイルの `dateStart` / `dateEnd` と同じ `computed` の get/set に揃える |

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

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 表示文言の設計（どこまで生メッセージを通すか）に選択肢があり修正方針が一意でないため、自動修正の対象外とした。`cart.vue` の `getOrderErrorMessage` も同じ構造。

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

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: 種別が 📐 リファクタのため条件付き自動修正（🔧 微修正 / 📄 ドキュメントのみ）の対象外。

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

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: 種別が 📐 リファクタのため条件付き自動修正の対象外。

---

**識別子**: RC-10（GitHub id: なし・エージェントレビュー）

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

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: 種別が 📐 リファクタのため条件付き自動修正の対象外。`menuLimitValidation.ts` の `try/catch` + `error instanceof Error` によるメッセージ復元も同じ構造。

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

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 📐 リファクタ

**想定工数**: S

**判断理由**: 種別が 📐 リファクタのため条件付き自動修正の対象外。不正値時のフォールバック挙動（前値維持 / null 化）の選択も残る。
