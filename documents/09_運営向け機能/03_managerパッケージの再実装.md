# managerパッケージの再実装（運営管理画面 / support パッケージ）

関連 Issue: [#2087](https://github.com/nijuniinc/bokudeli-event/issues/2087)
移行の背景・レガシー資産の棚卸し: [24_managerパッケージの移行.md](../07_リファクタリング/24_managerパッケージの移行.md)

## 課題と概要

- manager 画面が Vue 2 で実装されており、レガシーすぎて現在は使うことができない。
- Vue 3（現行標準スタック）で再実装したい。
- `manager` という名前はコミュニティ主催者（community manager）およびエンタープライズ全社管理者（admin）と衝突するため、
  **パッケージ名は `support`**（運営権限 `isSupport()` / `configs/global.support_user_ids` と整合）とする。
  UI・ドキュメント上の表示名は **「運営管理画面」** とする。

> 用語注: `SUPPORT_MAIL`（問い合わせ窓口）や `support_user_ids`（運営 UID リスト）と語根が同じだが、
> パッケージ名 `support` は **運営管理画面アプリ**を指す。

## フェーズ構成

| フェーズ | 内容 |
| :-- | :-- |
| **フェーズ1** | 旧 manager の実機能を現行スタックで再実装（本ドキュメント §1〜§10） |
| フェーズ2 | 店舗管理機能（店舗設定・メニュー設定・承認設定の代行）|
| フェーズ3 | 請求書払い管理 |
| フェーズ4 | 店舗明細一覧の管理（bokudeli-event-payment 相当）|
| フェーズ5 | レガシー `manager/` の削除 |

---

# フェーズ1 仕様

## 1. スコープ

| # | 画面 | 旧 manager | フェーズ1 | 備考 |
| :-: | :-- | :-- | :-: | :-- |
| 1 | ログイン | `/pages/login` | ✅ | 認可を `isSupport()` に置換 |
| 2 | ダッシュボード | `/`（静的 TODO） | ✅ | 静的 TODO は廃止し、件数カード＋各一覧への入口に作り直す |
| 3 | イベント一覧 | `/EventList` | ✅ | ステータス＋注文状況を追加 |
| 4 | コミュニティ一覧 | `/CommunityList` | ✅ | イベント数・メンバー数を追加 |
| 5 | 店舗一覧 | `/ShopList` | ✅ | 開店・承認スイッチ |
| 6 | 注文一覧 | `/OrderList` | ✅ | read only。旧は廃止済み `orders` 参照のため要移植 |
| 7 | ユーザー一覧 | `/UserList` | ✅ | read only |
| 8 | メニュー管理 | `/ShopList/Menu` | ❌ | **フェーズ2**。現行 Rules で `partners/{id}/menus` の write は partner 本人のみ |

旧 manager の `views/dashboard/**` / `views/pages/**`（購入テンプレートのデモ群）は移植しない。

### 旧 manager の画面名の混乱について

`UserList.vue` / `CommunityList.vue` はどちらも表示タイトルが「コミュニティ一覧」になっている。
再実装では画面名・ファイル名・表示タイトルを一致させる。

## 2. パッケージ構成

雛形は **`partner`** を使う（ページ数・email/password 認証・`main.ts` の単純さが最も近い）。

```
support/
  package.json                    # name: "support", type: module
  vite.config.ts / vite.alias.ts / vitest.config.ts
  tsconfig.{json,app,node,types}.json
  eslint.config.mjs / .prettierignore / env.d.ts / index.html
  .gitignore / README.md
  src/
    @core -> ../../base/materio/@core        # symlink
    @layouts -> ../../base/materio/@layouts  # symlink
    main.ts / App.vue / themeConfig.ts / themes/
    router/index.ts               # setupRouter（メンテ → 認証 → isSupport の 3 ガード）
    layouts/{default,blank}.vue
    navigation/vertical/index.ts  # サイドメニュー定義
    pages/
      login.vue                   # layout: blank
      index.vue                   # ダッシュボード
      events/index.vue
      communities/index.vue
      shops/index.vue
      orders/index.vue
      users/index.vue
      maintenance.vue
      [[...error]].vue
    components/                   # 一覧テーブル用コンポーネント
    locales/messages/ja.ts        # ja のみ（en.ts は作らない）
    styles/
```

URL は旧のキャメルケース（`/ShopList`）から **小文字・複数形**（`/shops`）へ整理する。
運営のブックマークが変わるため、リリース時に周知する。

## 3. 認証・認可

### ログイン

`partner/src/pages/login.vue` と同型の `signInWithEmailAndPassword`。パスワードリセットも同様に提供する。

### 認可

旧実装のメールアドレス直書き（`support+admin@nijuni.jp`）は**廃止**し、
`configs/global.support_user_ids` を正本にする（`ConfigGlobal.isSupport(uid)`）。

`support/src/router/index.ts` のガード構成（`partner` の `setupRouter` に 1 段追加）:

1. **メンテナンスモード判定** — support は bypass（partner と同一）
2. **認証必須判定** — 未ログインは `/login?redirect=` へ
3. **support 判定（新規）** — `config.isSupport(uid)` が false なら `signOut()` → `/login` へ戻し、ログイン画面でエラー表示

フロント判定だけに依存させず、Firestore Rules 側の `isSupport()` と二重にする（§7）。

## 4. 画面仕様

### 4.1 ダッシュボード `/`

`getCountFromServer` による件数カードを並べ、各一覧への入口にする。

| カード | クエリ |
| :-- | :-- |
| 承認待ちコミュニティ | `communities` の `is_approved == false` |
| 承認待ち店舗 | `collectionGroup('shops')` の `is_approved == false` |
| 受付中イベント | `collectionGroup('events')` の `event_status.value == 'accepting_order'` |
| 直近 7 日の注文 | `collectionGroup('member_orders')` の `status == 'ordered'` かつ `ordered_at >= 7日前` |

### 4.2 イベント一覧 `/events`

**データ源**: `useEventListStore`（`collectionGroup('events')` + `eventConverter`。`is_deleted == false` は store 内で付与済み）

**filters**: `orderBy('event_start_datetime', 'desc')`。
CG `events` の `is_deleted ASC` + `event_start_datetime DESC` は既存インデックスに無いため新規追加する
（既存の類似インデックスはすべて `community_account` / `partner_id` / `event_status.value` 等を先頭に含む）。

| 列 | 値 |
| :-- | :-- |
| コミュニティ名 | `community_name`（`/c/{account}` へリンク） |
| イベント名 | `event_name`（`/c/{account}/e/{eventId}` へリンク） |
| ステータス | `calculatedEventStatus` |
| 注文状況 | 注文済み件数 / 定員 |
| 開催日時 | `event_start_datetime` 〜 `event_end_datetime` |
| 注文締切 | `event_deadline_datetime` |
| 定員・参加数 | `event_max_people` / `event_num_members` |
| 支払い | `event_payment` |
| 公開 | `is_public` |
| 店舗 | `shop_name` |
| 主催者連絡先 | `organizer_*` |

**ステータス**: `Event.calculatedEventStatus` を使う（DB 生値 5 種に加え、時刻から算出される
`order_closed` / `finished` / `full`）。旧 manager は生値のみ表示していたため、これが改善点になる。

**日時整形**: `common/src/utils/datetime.ts` の `convertToXxx` を使う。
旧実装の `toDate().toLocaleString()` / 独自ミリ秒計算は廃止する。

**注文状況の集計**: Event ドキュメントに注文の集計フィールドは無い（`event_num_members` は参加者数）。
表示中の行ごとに count 集計する。

```ts
getCountFromServer(
  query(
    collectionGroup(db, 'member_orders'),
    where('event_id', '==', eventId),
    where('status', '==', 'ordered'),
  ),
)
```

`member_orders` の `event_id` + `status` 複合インデックスは既存。
件数集計は 1000 ドキュメントあたり 1 read 相当のためコストは実用範囲。
Functions で Event に集計フィールドを持たせる案はフェーズ1のスコープ外とする。

### 4.2.1 追加する Firestore インデックス

| collection group | scope | フィールド | 用途 |
| :-- | :-- | :-- | :-- |
| `events` | CG | `is_deleted` ASC, `event_start_datetime` DESC | イベント一覧 |
| `events` | CG | `community_id` ASC, `is_deleted` ASC | コミュニティ一覧のイベント数 |
| `member_orders` | CG | `status` ASC, `updated_at` DESC | 注文一覧 |
| `member_orders` | CG | `status` ASC, `ordered_at` ASC | ダッシュボードの直近 7 日注文 |
| `shops` | CG（単一フィールド） | `is_approved` ASC | ダッシュボードの承認待ち店舗 |

`event_status.value` + `is_deleted` の等価 2 条件（受付中イベント数）は、既存の
`event_status.value, is_deleted, event_deadline_datetime` 等の**先頭プレフィックス**で賄える。

### 4.3 コミュニティ一覧 `/communities`

**データ源**: `useCommunityListStore`（`collection('communities')`）

| 列 | 値 |
| :-- | :-- |
| アカウント | `community_account` |
| コミュニティ名 | `community_name`（`/c/{account}` へリンク） |
| 会社/団体名・担当者 | `community_company` / `community_manager_fullname` |
| 連絡先・SNS・利用目的 | `community_postalcode` / `community_address` / `community_phone` / `community_email` / `community_sns_*` / `community_use_purpose` |
| 作成日・更新日 | `created_at` / `updated_at` |
| メンバー数 | `community_num_members`（取得できない場合は `members` サブコレクションの count） |
| イベント数 | `collectionGroup('events')` を `community_id` で count |
| 公開 / 承認 | `is_public` / `is_approved` スイッチ |

**更新操作**: `useCommunityStore().updateCommunity()` 経由。
Rules の `allow update: if isSupport() || isManager()` で許可済み。
旧実装の `window.alert` はスナックバーに置き換える。

### 4.4 店舗一覧 `/shops`

**データ源**: `useShopListStore`（`collectionGroup('shops')` + `shopConverter`）

| 列 | 値 |
| :-- | :-- |
| PARTNER ID | `partner_id` |
| 店舗名 | `shop_name` |
| 住所 | `shop_postcode` / `shop_address` |
| 連絡先 | `shop_phone` / `shop_email` ほか |
| 注文締切 | `shop_deadline_datetime` |
| 距離と最小個数 | `shop_range_min_orders` |
| 営業時間 | `shop_time[7]`（曜日別） |
| 作成日・更新日 | `createdAt` / `updatedAt` |
| 開店 / 承認 | `is_open` / `is_approved` スイッチ |

**更新操作**: 開店・承認の 2 項目のみを更新する専用関数を `base/src/stores/partner.ts` に追加して使う。
既存 `updateShop()` は `setDoc(..., { merge: true })` にコンバータ経由の全フィールドを渡すため、
レガシーデータで Zod バリデーションに落ちるリスクがある。

**ページング**: `useShopListStore` は現在 `limit` がコメントアウトされており全件取得。
「承認待ちのみ」などの絞り込みを効かせたいので、実装時に店舗件数を見て `limit` 対応の要否を判断する。

### 4.5 注文一覧 `/orders`

旧 manager は廃止済みの `collectionGroup('orders')`（Rules で `allow read, write: if false`）を
参照していたため、**現行の `member_orders` へ移植が必要**。

**データ源**: `useOrderListStore(storeId, filters, pageSize)`（`collectionGroup('member_orders')`）

| 列 | 値 |
| :-- | :-- |
| 注文日時 | `ordered_at` |
| イベント名 | `event_id` から解決（リンク） |
| コミュニティ名 | 同上 |
| 店舗名 | 同上 |
| ユーザー | `user_id` |
| メニュー | `menu_name` / `menu_price` / 数量 |
| ステータス | `in_cart` / `processing` / `ordered` / `canceled` |
| 各日時 | `carted_at` / `ordered_at` / `canceled_at` |
| キャンセル理由 | `cancel_source` |

**旧実装との差**: 旧は 1 注文に複数メニュー（`menus[]`）だったが、現行 `EventMemberOrder` は
**1 メニュー = 1 ドキュメント**。合計金額・合計個数は「イベント × ユーザー」でグルーピングして算出する。

**イベント名・店舗名の解決**: `member_orders` に非正規化されていない項目は、
旧実装のように全コミュニティ → 全イベントを走査（N+1 の重い処理）せず、
表示行の `event_id` に対して `useEventStore` で遅延解決する。

### 4.6 ユーザー一覧 `/users`

`users` は `allow read: if true` のため取得可能。
旧実装は `collectionGroup('users')` だったが、トップレベルコレクションなので
`collection('users')` + `orderBy('created_at', 'desc')` に直す。

| 列 | 値 |
| :-- | :-- |
| ユーザー名 | `user_name` |
| MyPage | `/u/{user_id}` へのリンク |
| プロフィール | `user_description` |
| SNS | `user_sns_twitter` / `user_sns_facebook` / `user_sns_instagram` |
| 参加イベント数 | `participated_event_count` |
| 作成日・更新日 | `created_at` / `updated_at` |
| 削除 | `is_deleted` |

**除外**: `users_personal_information` は `allow read: if request.auth.uid == user_id` のため運営も読めない。
個人情報は表示対象外とする。旧実装の `user_email` 列は `users` に載っている範囲でのみ表示する。

## 5. base store の追加・変更

| 対象 | 現状 | フェーズ1で必要な対応 |
| :-- | :-: | :-- |
| `eventList.ts` | ✅ 再利用可 | 変更不要（テナント条件なしで呼ぶ。§7 の Rules 変更が前提） |
| `communityList.ts` | ✅ 再利用可 | 同上 |
| `orderList.ts` | ✅ 再利用可 | 運営用 filters を渡すだけ |
| `shopList.ts` | △ | `limit` 対応（ページング）を検討 |
| `partner.ts` | △ | 開店・承認のみ更新する軽量関数を追加 |
| ユーザー一覧 store | ❌ 無し | `base/src/stores/userList.ts` を新設 |
| イベント注文数集計 | ❌ 無し | count 集計ヘルパーを新設 |

`db.collection()` の直呼びは禁止。すべて store 経由・withConverter 付きで実装する（`/shokujii-firestore`）。

## 6. i18n・表示

- 文言は `support/src/locales/messages/ja.ts` と `base` 共通の `ja.ts` に集約。`en.ts` は作らない
- 日付は `common/src/utils/datetime.ts` の `convertToXxx` を使用
- `window.alert` / `confirm` はスナックバー・確認ダイアログに置換

## 7. Firestore Rules の変更（フェーズ1の前提条件）

`communities` / `events` / `member_orders` の read 条件は
`enterprise_id == null || isSameEnterprise(...)` になっている。サポーターアカウントは
PF テナント所属で `isSameEnterprise` が成立しないため、
**現行 Rules のままではエンタープライズ配下のドキュメントを個別に読めない**
（エミュレータで検証済み。`tests/firestore-rules/src/supportCrossTenantRead.test.ts` を
Rules 変更前に流すと `support can read enterprise community / event / member_order` の 3 件が落ちる）。

一覧表示に効いてくるのはこの**個別 read**の方である。`useCommunityListStore` は
非 lightweight モードで community ごとに store（`getDoc` / `onSnapshot`）を張り、
`useEventListStore` も event ごとに store を張るため、テナント横断の一覧はここで失敗する。

`isSupport()` は request 単位で評価できる条件なので、read 側に追加すれば横断read が許可される。

> 補足: `collection('communities')` や `collectionGroup('events')` の**クエリ自体**は、
> エミュレータ上では Rules 変更前でも非運営アカウントで成功してしまう（個別 `get` は拒否される）。
> クエリ結果に対する per-document 評価が期待どおりに効いていないように見えるため、
> **クエリが通ること自体を権限の根拠にしない**。運営横断の可否は個別 read の許可で担保する。

| 対象 | 現状の read | 変更後 |
| :-- | :-- | :-- |
| `communities/{c}` | `enterprise_id == null \|\| isSameEnterprise` | `\|\| isSupport()` を追加 |
| `communities/{c}/events/{e}` | 同上 | 同上 |
| CG `events` | 同上 | 同上 |
| CG `member_orders` | PF は誰でも可 / エンプラは同一テナント or 本人 | `\|\| isSupport()` を追加 |
| `partners/{p}/menus` write | partner 本人のみ | **フェーズ2**で `isSupport()` を追加 |

`update` 側には既に `isSupport()` が入っており（communities / events / shops）、
read だけが非対称に残っていた状態を是正する変更にあたる。

**テスト**: `tests/firestore-rules/` に support 用テストを追加する
（`letters.test.ts` の `support_user_ids` seed パターンを流用）。

> **留意**: CG `member_orders` の read は PF 分が未認証でも読める状態で、Rules 内に
> 「機微情報を追加しないこと。公開範囲の見直しは #2282」というコメントがある。
> `isSupport()` の追加自体は公開範囲を広げないが、この行を触る PR では #2282 との関係を確認する。

## 8. CI / Firebase 設定

| ファイル | 変更内容 |
| :-- | :-- |
| ルート `package.json` | `workspaces` に `support` を追加 |
| `package-lock.json` | `npm install` で更新 |
| `firebase.json` | hosting に `support` ターゲット追加（`public: "support/dist"`、`noindex`） |
| `.github/workflows/deploy_support.yml` | 新規（`deploy_partner.yml` 同型、`vars.SUPPORT_ENV`） |
| `.github/workflows/pr-verify.yml` | `support/**` フィルタ＋ lint / format / build:types / test を追加 |
| `AGENTS.md` | コミット接頭辞タグ `[support]` を追加 |

**手動作業**（エージェントでは実行不可。PR 9 の前提）:

- GitHub Variables に `SUPPORT_ENV` を各環境で登録
- 各 Firebase プロジェクトで `firebase target:apply hosting support <siteId>`

レガシー `manager/` はフェーズ1では残し、フェーズ5で削除する。

## 9. PR 分割（実装順序）

| PR | 内容 | 完了条件 |
| :-: | :-- | :-- |
| 1 | `support/` 足場作り（partner 雛形、workspaces 追加、空アプリがビルド通る） | `/lint-and-format` 通過 |
| 2 | Rules 変更（`isSupport()` の read 追加）＋ firestore-rules テスト | テスト通過 |
| 3 | ログイン＋ガード（`isSupport` 判定）＋ layouts / navigation | 非運営アカウントで拒否される |
| 4 | イベント一覧（ステータス＋注文状況集計ヘルパー） | 件数・内容が旧 manager と一致 |
| 5 | コミュニティ一覧（イベント数・メンバー数＋公開/承認スイッチ） | 同上 |
| 6 | 店舗一覧（開店/承認スイッチ＋軽量更新関数） | 同上 |
| 7 | 注文一覧・ユーザー一覧（`member_orders` へ移植、userList store 新設） | 同上 |
| 8 | ダッシュボード（件数カード） | — |
| 9 | CI / hosting（`deploy_support.yml`、`firebase.json`、pr-verify） | sandbox デプロイ成功 |

PR 2 は早い段階に置く。これが入るまでイベント一覧・コミュニティ一覧・注文一覧が
横断表示できず、後続の画面 PR がすべてブロックされる。

コミット接頭辞は `[support]`（足場ができるまでは `[doc]` / `[ci]` / `[firebase]`）。

## 10. 検証

- **ローカル**: `npm -w support run dev -- -m development` で全画面が表示・操作できる
- **PR verify 相当**: `/lint-and-format`（build / lint / format / 型 / vitest）が通る
- **権限**: 非運営アカウントでログイン拒否、`support_user_ids` 登録済みアカウントで全機能可
- **データ整合**: 旧 manager と同一データで各一覧の件数・内容が一致。
  `common` の Zod 適用でバリデーション落ちが出た場合は、`eventList.ts` の
  `reportClientError` でスキップする既存パターンに倣う
- **sandbox デプロイ**: hosting が更新される

---

# 今後の機能（フェーズ2 以降）

## 店舗管理機能（フェーズ2）

- サポートアカウントで、店舗設定・メニュー設定・承認設定などを行うことができる。
- 店舗アカウントでログインし直すことなく、閲覧と設定を行うことができる。
- **前提**: `partners/{id}/shops` `partners/{id}/menus` `partners/{id}/options` の write に
  `isSupport()` を追加する（現状 shops のみ許可済み）。

## 請求書払い管理（フェーズ3）

- イベントの「請求書払い」の状況を管理することができる。
- 未確認、支払い済み、未払いか。
- 再度請求書を発行することができる。
- 配送料の請求を行うようになった際には、配送料請求についても請求書再発行できる。

## 店舗明細一覧の管理（フェーズ4）

- bokudeli-event-payment 相当の機能を実装する。
- 店舗明細書を生成する。サポーターが確認する。問題なければ発行とメール送付を行う。
