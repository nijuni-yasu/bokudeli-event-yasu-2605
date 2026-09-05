# ブランチ feat/2087 レビュー記録

運営管理画面（`support` パッケージ）の Vue 3 再実装。仕様は [documents/09_運営向け機能/03_managerパッケージの再実装.md](../09_運営向け機能/03_managerパッケージの再実装.md)。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-1 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 新規クエリに対応する複合インデックスが `firestore.indexes.json` に無い<br>イベント一覧・注文一覧・ダッシュボード集計が本番で failed-precondition になる。5 件追加した |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `updateShopStatus` / `updateCommunityStatus` が withConverter 無しの ref を使っていた<br>AGENTS.md「xxxRef は必ず withConverter 付き」に反する。converter 付き ref に変更 |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | ルート `npm run format` が `base/materio/` を整形していた<br>materio は変更禁止。復元し、対象ファイルのみ prettier をかける運用に戻した |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | ダッシュボードの件数カードが「取得中」と「取得失敗」を同一表示にしていた<br>チェックリスト「対象外・未設定と取得失敗を同一表示にしない」。`null` / `undefined` で区別した |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `supportCounts.countOf` の引数型が `ReturnType<typeof collection>` の union だった<br>`Query` 型で受ければ十分。可読性のため単純化した |
| [x] | RC-6 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書 §7 の「CG クエリが Rules で拒否される」という記述がエミュレータ実測と食い違っていた<br>拒否されるのは個別 read。実測に合わせて §7 を書き直した |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📐 リファクタ | M | `useOrderListStore` が取得失敗を握りつぶすため、注文一覧が永久ローディングになる<br>base store 側の変更が必要。`reportClientError` + エラー状態の公開を検討 |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📋 仕様追加 | M | 店舗一覧が全件取得（`useShopListStore` に `limit` が無い）<br>仕様書 §4.4 の申し送り。店舗件数を見てページング要否を判断する |
| [x] | RC-9 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | URL フィルタ切替時に `orderedCounts` / `eventSummaries` / `counts` Map をクリアしていない<br>前フィルタの集計値が混在表示される。watch 内で Map を初期化した |
| [x] | RC-10 | 3935067586 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | userList の Firestore 取得が try/catch されず永久ローディングになり得る<br>`loadError` + 空配列 + `reportClientError` を追加 |
| [x] | RC-11 | 3935067633 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | catch-all ルートの `error` param が配列のとき誤判定<br>`parseErrorCodeFromRoute` で正規化 |
| [x] | RC-12 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 注文一覧の並びは updated_at だが列表示が ordered_at<br>「更新日時」列に変更 |
| [x] | RC-13 | 5542276372 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | userList store ID に JSON.stringify(filters) を使用<br>呼び出し元から storeId を渡す方式に変更 |
| [x] | RC-14 | 5542276372 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 注文一覧でイベント取得失敗時に行スピナーが残留<br>failedEventIds で失敗 sentinel を追加 |

---

## 評価セッション（2026-09-01 20:20・shokujii-code-review）

- **評価日時**: 2026-09-01 20:20 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2087`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-1 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🐛 実害 | 🔧 微修正 | S | 新規クエリに対応する複合インデックスが無い<br>5 件追加した |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | withConverter 無しの ref で `updateDoc` していた<br>converter 付き ref に変更 |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `base/materio/` を整形してしまっていた<br>復元した |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 取得中と取得失敗が同一表示<br>`null` / `undefined` で区別 |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `countOf` の引数型が冗長<br>`Query` に単純化 |
| [x] | RC-6 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書 §7 が実測と食い違い<br>書き直した |
| [ ] | RC-7 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 📐 リファクタ | M | 注文一覧が失敗時に永久ローディング<br>base store の変更が必要 |
| [ ] | RC-8 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 📋 仕様追加 | M | 店舗一覧が全件取得<br>件数を見て判断 |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `firestore.indexes.json`

**該当コード（レビュー時点の diff）**:

```diff
+const eventListStore = useEventListStore([orderBy('event_start_datetime', 'desc')], PAGE_SIZE, {
+  autoContinue: false,
+})
+const orderListStore = useOrderListStore(
+  'support/orders',
+  [where('status', '!=', 'in_cart'), orderBy('status'), orderBy('updated_at', 'desc')],
+  PAGE_SIZE,
+)
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: 新規に追加した横断クエリのうち、次の 5 パターンが `firestore.indexes.json` に存在しない → イベント一覧・コミュニティのイベント数・注文一覧・ダッシュボードの承認待ち店舗／直近注文が、本番で `failed-precondition` になる。インデックスを追加すること。

- CG `events`: `is_deleted` ASC + `event_start_datetime` DESC（既存の類似は `community_account` / `partner_id` / `event_status.value` 等が先頭に付く別物）
- CG `events`: `community_id` ASC + `is_deleted` ASC（既存は `community_id` + `event_id`）
- CG `member_orders`: `status` ASC + `updated_at` DESC（既存は `updated_at` ASC で、混合方向は別インデックスが要る）
- CG `member_orders`: `status` ASC + `ordered_at` ASC
- CG `shops` 単一フィールド: `is_approved` ASC（CG スコープの単一フィールドインデックスは自動生成されない）

**コメント要約**: 新規クエリに対応する複合インデックスが `firestore.indexes.json` に無い。
イベント一覧・注文一覧・ダッシュボード集計が本番で failed-precondition になる。5 件追加した。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: インデックス不足はローカルのエミュレータでは検知されず、本番デプロイ後に一覧が丸ごと表示されない形で顕在化する。チェックリスト「新規の複合クエリに対応する `firestore.indexes.json` の追加漏れ」に該当し、修正方針も一意なので自動修正した。仕様書 §4.2.1 に一覧を追記した。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/partner.ts:68`, `base/src/stores/community.ts:204`

**該当コード（レビュー時点の diff）**:

```diff
+export const updateShopStatus = async (
+  partnerId: string,
+  shopId: string,
+  status: { is_open?: boolean; is_approved?: boolean },
+): Promise<void> => {
+  const shopRef = doc(db, 'partners', partnerId, 'shops', shopId)
+  await updateDoc(shopRef, { ...status, updatedAt: Timestamp.now() })
+}
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `doc()` で取得した DocumentReference に `withConverter` を付けていない → AGENTS.md の「xxxRef は必ず withConverter 付き」に反する。既存の `updateAlbumSortOrder` 等は converter 付き ref に対して部分 `updateDoc` を行っており、そちらに揃えること。`shopConverter` / `communityConverter` はいずれも export 済み。

**コメント要約**: `updateShopStatus` / `updateCommunityStatus` が withConverter 無しの ref を使っていた。
AGENTS.md「xxxRef は必ず withConverter 付き」に反する。converter 付き ref に変更した。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: プロジェクト必須ルールで、修正方針も一意（既存 export の converter を付けるだけ）。型チェックも通ることを確認済み。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/materio/**`（`git status` 上の意図しない変更）

**該当コード（レビュー時点の diff）**:

```diff
 M base/materio/@core/scss/base/_components.scss
 M base/materio/@core/utils/validators.ts
 M base/materio/@layouts/components/TransitionExpand.vue
 （ほか 50 ファイル以上）
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: ルートで `npm run format` を実行した結果、`base/materio/`（`@core` / `@layouts`）60 ファイル超と `.agents/skills/**`・`terraform/`・無関係な firestore-rules テストが整形されている → AGENTS.md「`base/materio/` は原則変更禁止」に反し、PR が本題と無関係な差分で埋まる。復元し、以後は対象ファイルを指定して prettier をかけること。

**コメント要約**: ルート `npm run format` が `base/materio/` を整形していた。
materio は変更禁止。復元し、対象ファイルのみ prettier をかける運用に戻した。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: テンプレート更新時の diff・マージ容易性を守るための明文ルール。`git checkout` で復元し、`npx prettier --write <対象>` に切り替えた。AGENTS.md も併せて復元し、目的の 3 箇所だけ再適用した。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/index.vue`

**該当コード（レビュー時点の diff）**:

```diff
+const load = async (target: Ref<number | null>, fetch: () => Promise<number>): Promise<void> => {
+  try {
+    target.value = await fetch()
+  } catch (error) {
+    console.warn(error)
+  }
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 集計に失敗しても `null` のままなので、スピナーが回り続けて「取得中」と区別できない → チェックリスト「『対象外・未設定』と『取得失敗』を同一表示にしていないか」に該当。失敗を別の状態で表し、エラー表示に切り替えること。

**コメント要約**: ダッシュボードの件数カードが「取得中」と「取得失敗」を同一表示にしていた。
チェックリスト「対象外・未設定と取得失敗を同一表示にしない」。`null` / `undefined` で区別した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 📌 スコープ内 + S + 🔧 微修正で修正方針が一意のため、auto-fix-policy の条件付き自動修正に該当。`reactive` で `number | null | undefined` を保持し、失敗時は `common.load_failed` を表示するようにした。あわせて template から `ref.value` を直接参照する構成もやめた。

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/supportCounts.ts:22`

**該当コード（レビュー時点の diff）**:

```diff
+const countOf = async (collectionRef: ReturnType<typeof collection> | ReturnType<typeof collectionGroup>, filters: QueryConstraint[]): Promise<number> => {
+  return (await getCountFromServer(query(collectionRef, ...filters))).data().count
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `ReturnType<typeof collection> | ReturnType<typeof collectionGroup>` は、実質 `Query` で受ければ足りる（`CollectionReference` は `Query` を継承する）→ 型を `Query` に単純化すること。

**コメント要約**: `supportCounts.countOf` の引数型が `ReturnType<typeof collection>` の union だった。
`Query` 型で受ければ十分。可読性のため単純化した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 📌 + S + 🔧 で方針が一意のため自動修正。

---

**識別子**: RC-6（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/09_運営向け機能/03_managerパッケージの再実装.md`（§7）

**該当コード（レビュー時点の diff）**:

```diff
+`communities` / `events` の read 条件は `resource.data` に依存するため、
+Firestore は一覧クエリ側に `where('enterprise_id', '==', ...)` を要求する。
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: エミュレータで実測すると、`collection('communities')` / `collectionGroup('events')` のクエリ自体は Rules 変更前でも非運営アカウントで成功し、拒否されるのは**個別 `get`** の方だった → 仕様書 §7 の「クエリが要求される／拒否される」という説明が実態と食い違う。実測に合わせて記述を直し、権限の根拠を個別 read に置くこと。

**コメント要約**: 仕様書 §7 の「CG クエリが Rules で拒否される」という記述がエミュレータ実測と食い違っていた。
拒否されるのは個別 read。実測に合わせて §7 を書き直した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 📄 ドキュメントのみ + S で条件付き自動修正の対象。誤った前提が残ると後続フェーズの設計判断を誤らせる。`isSupport()` の read 追加が必要である結論自体は変わらない（一覧 store は community / event ごとに個別 read を行うため）。

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/orderList.ts:68`

**該当コード（レビュー時点の diff）**:

```diff
        } catch (error) {
          console.error('Failed to fetch orders:', error)
        }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: `useOrderListStore` は取得失敗時に `console.error` だけで `orders` を `null` のままにするため、注文一覧が永久ローディングになる → チェックリスト「`catch` 節でローディング状態を解除しているか」「握りつぶすと調査不能になる catch で `reportClientError` を呼んでいるか」に該当。ただし既存 store の共有挙動を変えるため、影響範囲（user / enterprise のマイページ注文一覧）の確認が要る。

**コメント要約**: `useOrderListStore` が取得失敗を握りつぶすため、注文一覧が永久ローディングになる。
base store 側の変更が必要。`reportClientError` + エラー状態の公開を検討。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: `loadError` を公開し、初回失敗時は `orders` を空配列にして永久ローディングを解消。`reportClientError` を追加。注文一覧 UI にエラーアラートと再試行を表示。既存 caller は `loadError` 未参照のため後方互換。

---

**識別子**: RC-8（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/shops/index.vue`

**該当コード（レビュー時点の diff）**:

```diff
+const shopListStore = useShopListStore([orderBy('createdAt', 'desc')])
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📋仕様追加/M]: `useShopListStore` は `limit` がコメントアウトされており全件取得になる → 店舗数が増えると初回表示が重くなる。仕様書 §4.4 の申し送りどおり、実データの件数を見てページングの要否を判断すること。

**コメント要約**: 店舗一覧が全件取得（`useShopListStore` に `limit` が無い）。
仕様書 §4.4 の申し送り。店舗件数を見てページング要否を判断する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: `useShopListStore(filters, pageSize?)` に optional ページングを追加。support は `PAGE_SIZE=30`、`EventEdit` は pageSize 省略で従来どおり全件。`hasMore` / `loadError` も公開。

---

## 評価セッション（2026-09-04 22:52・shokujii-code-review）

- **評価日時**: 2026-09-04 22:52 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2087`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📐 リファクタ | M | 注文一覧が失敗時に永久ローディング<br>`loadError` + UI エラー表示を追加 |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 📋 仕様追加 | M | 店舗一覧が全件取得<br>optional pageSize でページング |
| [x] | RC-9 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | フィルタ切替時に派生 Map が残る<br>watch で Map を初期化 |

---

**識別子**: RC-9（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/events/index.vue`, `support/src/pages/orders/index.vue`, `support/src/pages/communities/index.vue`

**該当コード（レビュー時点の diff）**:

```diff
+watch(
+  () => route.query.status,
+  () => {
+    eventListStore.value = useEventListStore(buildFilters(), PAGE_SIZE, { autoContinue: false })
+  },
+)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: URL クエリでフィルタを切り替えても `orderedCounts` / `eventSummaries` / `counts` の Map をクリアしていない → 前フィルタの集計値が混在表示される。store 再生成の watch 内で Map を `new Map()` に初期化すること。

**コメント要約**: フィルタ切替時に派生 Map が残り、注文状況・イベント名・メンバー数が誤表示される。
watch 内で Map を初期化した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ダッシュボードからの絞り込み遷移後にフィルタ解除すると、別条件の count が残る実害がある。修正方針が一意なため自動修正した。

---

## 評価セッション（2026-09-04 23:42 JST・Copilot レビュー・partial）

- **評価日時**: 2026-09-04 23:42 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2087`
- **PR**: #2345
- **REVIEW_REQUEST_SINCE**: 2026-09-04T14:29:24Z
- **partial**: true（Codex レビューなし。Copilot のみ）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（レビュー依頼コメント）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-10 | 3935067586 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | userList 取得失敗時に永久ローディング<br>try/catch + loadError を追加 |
| [x] | RC-11 | 3935067633 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | catch-all error param の配列未対応<br>parseErrorCodeFromRoute を追加 |

---

**識別子**: RC-10（GitHub id: 3935067586）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/userList.ts`

**レビュワーのコメント（原文）**:

[must] userList のページング処理で Firestore 呼び出し全体が try/catch されていないため、getCountFromServer/getDocs が失敗すると例外が上位に伝播して users が null のままになり、画面が永久ローディングになり得ます（TaskExecutor 側でも例外は吸収されません）。取得処理を try/catch で囲み、失敗時は users を空配列にしてローディングを解除しつつ reportClientError で記録してください。

**コメント要約**: userList 取得失敗時に永久ローディング。try/catch + loadError + 空配列 + reportClientError。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: orderList と同パターンの実害。修正方針が一意なため自動修正した。

---

**識別子**: RC-11（GitHub id: 3935067633）

**レビュワー**: Copilot

**指摘箇所**: `support/src/pages/[[...error]].vue`

**レビュワーのコメント（原文）**:

[must] catch-all ルートの params は `string | string[]` になり得ますが、`route.params.error as string` で固定キャストすると配列ケースで意図しないコード判定になります。配列も扱えるように正規化してから 3 桁判定してください。

**コメント要約**: catch-all error param の配列未対応。parseErrorCodeFromRoute で正規化。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: user アプリと同様の正規化が必要。修正方針が一意なため自動修正した。

---

## 評価セッション（2026-09-04 23:48 JST・shokujii-code-review）

- **評価日時**: 2026-09-04 23:48 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2087`
- **PR**: #2345
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-12 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 注文一覧 sort=updated_at と表示列 ordered_at の不一致<br>更新日時列に変更 |

---

**識別子**: RC-12（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `support/src/pages/orders/index.vue`

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 注文一覧の Firestore クエリを `updated_at` 降順に変更したが、テーブル第 2 列は `ordered_at` を表示している → 一覧上の並び順と日時列が一致せず運営が混乱する。「更新日時」列に `order.updated_at` を表示する。

**コメント要約**: 並び順と表示列の不一致。更新日時列に変更した。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ユーザー要望（updated 順）と UI の整合。修正方針が一意なため自動修正した。

---

## 評価セッション（2026-09-05 00:34 JST・Copilot レビュー・partial）

- **評価日時**: 2026-09-05 00:34 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto・watcher 失敗後手動起動）
- **ブランチ名**: `feat/2087`
- **PR**: #2345
- **REVIEW_REQUEST_SINCE**: 2026-09-04T14:52:51Z
- **partial**: true（Codex レビューなし。Copilot のみ。watcher は GitHub API 接続エラーで exit 1）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（レビュー依頼コメント）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-13 | 5542276372 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | userList store ID の JSON.stringify(filters) 衝突<br>storeId 引数方式に変更 |
| [x] | RC-14 | 5542276372 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | イベント取得失敗時の行スピナー残留<br>failedEventIds sentinel を追加 |

---

**識別子**: RC-13（GitHub id: 5542276372）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/userList.ts:38`

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `base/src/stores/userList.ts:38` の `JSON.stringify(filters)` は `QueryConstraint` を安定シリアライズできず、異なる条件でも store ID が衝突します。ID 生成方式の見直しが必要です。

**コメント要約**: store ID 生成に JSON.stringify(filters) を使うと QueryConstraint の衝突が起きる。orderList と同様に呼び出し元から storeId を渡す。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: orderList と同パターンで storeId を明示渡しに変更。修正方針が一意なため自動修正した。

---

**識別子**: RC-14（GitHub id: 5542276372）

**レビュワー**: Copilot

**指摘箇所**: `support/src/pages/orders/index.vue:55-74,138`

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `support/src/pages/orders/index.vue:55-74,138` はイベント取得失敗時に行単位でローディング解除できず、スピナーが残留します。失敗状態を保持してエラー表示可能にすることを推奨します。

**コメント要約**: イベント取得失敗/null 時に Map へ未登録のためスピナーが永久表示。failedEventIds で失敗を記録し「—」表示。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 取得失敗時の UX 実害。修正方針が一意なため自動修正した。
