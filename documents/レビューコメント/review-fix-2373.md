# ブランチ fix/2373 レビュー記録

このファイルはブランチ `fix/2373` のレビュー記録です。パス解決の正本は `.agents/skills/review-comments-evaluate/references/review-doc-path.md`。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-1 | 4151674349 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `getUnauthenticatedEntry` のコメントがヘッダー導線を含んだまま<br>要認証ガードと強制認証ダイアログの説明へ更新済み |
| [x] | RC-2 | 5924437680 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | 参加者CSVの自己紹介・タグが数式として解釈されうる<br>先頭の = + - @ タブ 復帰に単一引用符を付けて対応済み |
| [x] | RC-3 | 4151708630 | 👌 修正不要 | — | — | 💰 金銭 | 🔧 微修正 | — | user と partner のデプロイが料金定数の変更で走らない<br>110円も220円も本番未リリースのため、このリリースでは修正しない |
| [x] | RC-4 | 4151708584 | 👌 修正不要 | — | — | 💰 金銭 | 📋 仕様追加 | — | カート表示と Checkout 作成の反映順が保証されていない<br>本番に220円の旧 Function が無いため修正しない |
| [x] | RC-5 | 4151716901 | 👌 修正不要 | — | — | 💰 金銭 | 📋 仕様追加 | — | 新 Checkout と旧 Webhook の組み合わせで金額不一致になりうる<br>本番に220円の旧 Webhook が無いため修正しない |

---

## 評価セッション（2026-10-01 12:56・review-comments-evaluate）

- **評価日時**: 2026-10-01 12:56 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: fix/2373（作業ツリーは fix/2370。両ブランチは載せ替え時点で同一コミット）
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2374
- **since**: 2026-10-01T03:51:09Z
- **partial**: true（wake フラグ。Codex は旧コミット `56e82e25e` に対し問題なしと返却。載せ替え後の再レビューは別監視が継続中）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 5（依頼定型 2、Codex ステータス 1、Copilot 問題なしサマリ 1、Codex 問題なし 1）
- **手順 4a 自動修正**: RC-1（🚨 0件 / 🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-1 | 4151674349 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `getUnauthenticatedEntry` のコメントがヘッダー導線を含んだまま<br>要認証ガードと強制認証ダイアログの説明へ更新済み |

---

**識別子**: RC-1（GitHub id: 4151674349）

**レビュワー**: Copilot

**指摘箇所**: `user/src/layouts/default.vue:15`

**該当コード（レビュー時点の diff）**:

```diff
@@ -12,7 +12,7 @@ import UserProfile from '@/components/UserProfile.vue'
 import Footer from '@/components/Footer.vue'
 import { useNavItems } from '@/navigation'
 import type { Notification } from '@shokujii/base/types/index.js'
-import { getManagePath, getManageNewCommunityPath, getUnauthenticatedEntry } from '@/router/utils'
+import { getLogin, getManagePath, getManageNewCommunityPath } from '@/router/utils'
```

**レビュワーのコメント（原文）**:

[nits] `getUnauthenticatedEntry` の定義コメント（`user/src/router/utils.ts:55`）は現在も「ナビ・要認証ガードを含む全導線で使う」と説明しており、この変更後はヘッダー導線について誤りになります。再び同ヘルパーへ統一されないよう、「要認証ガード・強制認証ダイアログ等のデフォルト着地」の説明へ更新してください。

**コメント要約**: `getUnauthenticatedEntry` のコメントがヘッダー導線を含んだまま<br>要認証ガードと強制認証ダイアログの説明へ更新済み

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ヘッダーのログインは `getLogin` に変わったため、「ナビを含む全導線」というコメントは実装と食い違う。修正方針は指摘どおり一意なので、手順 4a で `user/src/router/utils.ts` のコメントを要認証ガードと強制認証ダイアログ向けに更新した。

---

## 評価セッション（2026-10-01 13:04・review-comments-evaluate）

- **評価日時**: 2026-10-01 13:04 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: fix/2373
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2374
- **since**: 2026-10-01T03:56:04Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（依頼定型 1、Copilot overview はインライン指摘の索引 1、Codex レビュー本文はインライン指摘の案内のみ 1）
- **手順 4a 自動修正**: なし（🚨 4件はセキュリティ影響確認または反映順の設計判断が必要なため対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :--: | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [x] | RC-2 | 5924437680 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | 参加者CSVの自己紹介・タグが数式として解釈されうる<br>先頭の = + - @ タブ 復帰に単一引用符を付けて対応済み |
| [x] | RC-3 | 4151708630 | 👌 修正不要 | — | — | 💰 金銭 | 🔧 微修正 | — | user と partner のデプロイが料金定数の変更で走らない<br>110円も220円も本番未リリースのため、このリリースでは修正しない |
| [x] | RC-4 | 4151708584 | 👌 修正不要 | — | — | 💰 金銭 | 📋 仕様追加 | — | カート表示と Checkout 作成の反映順が保証されていない<br>本番に220円の旧 Function が無いため修正しない |
| [x] | RC-5 | 4151716901 | 👌 修正不要 | — | — | 💰 金銭 | 📋 仕様追加 | — | 新 Checkout と旧 Webhook の組み合わせで金額不一致になりうる<br>本番に220円の旧 Webhook が無いため修正しない |

---

**識別子**: RC-2（GitHub id: 5924437680）

**レビュワー**: Copilot

**指摘箇所**: `base/src/composable/memberCsvExport.ts:88`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: `user/src/router/utils.ts:55` の `getUnauthenticatedEntry` の説明に「ナビ…を含む全導線」とありますが、この変更後はヘッダーが `getLogin()` を使うため記述が不正確です。「要認証ガード・強制認証ダイアログ等のデフォルト着地」に絞る説明へ更新してください。ヘッダーの遷移先変更自体は意図どおりで、要認証導線と `/register` での既存アカウントのログイン処理は維持されています。


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

🚨 **必須修正** [🔧微修正/S]: `base/src/composable/memberCsvExport.ts:88` で、利用者が編集できるプロフィール等を CSV セルにそのまま追加しています。既存の `escapeCsvCell` は引用符をエスケープするだけなので、`=` などで始まる値を表計算ソフトで開くと数式として解釈される可能性があります。CSV 出力時に数式として評価される先頭文字を無害化してください。

**コメント要約**: 参加者CSVの自己紹介・タグが数式として解釈されうる<br>先頭の = + - @ タブ 復帰に単一引用符を付けて対応済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `escapeCsvCell` で、セル先頭が `=` `+` `-` `@`、タブ、復帰のときに単一引用符を前置する。プロフィールとタグは名前などと同じ経路で出力されるため、列ごとの分岐ではなく共通のエスケープで無害化する。コミュニティメンバー CSV も同じ関数を使う。表計算で開いたとき先頭の引用符は文字として残る。

---

**識別子**: RC-3（GitHub id: 4151708630）

**レビュワー**: Copilot

**指摘箇所**: `.github/workflows/deploy_terms.yml:10`

**該当コード（レビュー時点の diff）**:

```diff
@@ -7,6 +7,7 @@ on:
       - development
     paths:
       - 'terms/**'
+      - 'common/src/utils/paymentUserFee.ts'
```

**レビュワーのコメント（原文）**:

[must] `common` 変更で terms は再デプロイされますが、同じ定数をバンドルする `deploy_user.yml` と `deploy_partner.yml` の paths には `common/**` がありません。次回、方針どおりこの定数だけを変更すると、Functions・terms は新料金になる一方、user のカート表示や base の案内文は旧料金のまま残ります。両 workflow にこのファイル（または `common/**`）のトリガーも追加してください。

**コメント要約**: user と partner のデプロイが料金定数の変更で走らない<br>110円も220円も本番未リリースのため、このリリースでは修正しない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: —

**判断理由**: 指摘どおり、定数ファイルだけの次回変更では user と partner が再デプロイされない。ただし本番の origin/production（v2.12.0）には paymentUserFee.ts が無く、110円一律も上限220円も本番未リリースである。今回のリリースで表示と実課金がずれる状態ではないため、修正しない。

---

**識別子**: RC-4（GitHub id: 4151708584）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/paymentUserFee.ts:10`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,52 +1,44 @@
 /**
  * Stripe 実課金の自己負担額に対するシステム利用料（画面上の名称）。
- * `MIN(220, MAX(110, FLOOR(自己負担 × 0.1, 100) × 1.1))` と同等。自己負担 0 以下は 0。
+ * 自己負担がある場合は定額。自己負担 0 以下は 0。
  *
  * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
  */
 import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'
 
-/** 1,000 円刻みの税込手数料単位（最低額でもある） */
-export const USER_PAYMENT_FEE_UNIT = 110
-/** 1 セッションあたりの手数料上限 */
-export const USER_PAYMENT_FEE_MAX = 220
+/** 新規 Checkout 1 セッションあたりの税込手数料。料金改定はこの定数を変更する。 */
+export const USER_PAYMENT_FEE_AMOUNT = 110
```

**レビュワーのコメント（原文）**:

[must] この定数はカート表示（`base/src/components/pages/cart.vue:438-441`）と Checkout 作成 Function の両方へビルド時に取り込まれますが、`deploy_user.yml` と `deploy_functions.yml` は push 後に独立実行されます。user が先に反映されると、カートは 110 円を表示する一方、旧 Function は 220 円の Checkout を作る時間帯が生じ、決済前表示と実課金が食い違います。互換バックエンドの先行デプロイと料金定数/UIの反映を別段階に分けるなど、反映順を仕組みで保証してください。

**コメント要約**: カート表示と Checkout 作成の反映順が保証されていない<br>本番に220円の旧 Function が無いため修正しない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: —

**判断理由**: カートが先に110円を表示し、旧 Function が220円の Checkout を作る、という並走は、本番にその旧 Function があるときに起きる。origin/production には料金計算の実装が無く、110円も220円も本番未リリースである。初回に110円側をまとめて出せば、この不整合は起きないため修正しない。

---

**識別子**: RC-5（GitHub id: 4151716901）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/src/utils/paymentUserFee.ts:14`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,52 +1,44 @@
 /**
  * Stripe 実課金の自己負担額に対するシステム利用料（画面上の名称）。
- * `MIN(220, MAX(110, FLOOR(自己負担 × 0.1, 100) × 1.1))` と同等。自己負担 0 以下は 0。
+ * 自己負担がある場合は定額。自己負担 0 以下は 0。
  *
  * @see documents/01_マネタイズと決済/02_ユーザー決済手数料.md
  */
 import type { CommunityBillSettingsType, EventPaymentType } from '../schemas/Event.js'
 
-/** 1,000 円刻みの税込手数料単位（最低額でもある） */
-export const USER_PAYMENT_FEE_UNIT = 110
-/** 1 セッションあたりの手数料上限 */
-export const USER_PAYMENT_FEE_MAX = 220
+/** 新規 Checkout 1 セッションあたりの税込手数料。料金改定はこの定数を変更する。 */
+export const USER_PAYMENT_FEE_AMOUNT = 110
 
 export function computeUserPaymentFeeFromSelfPay(selfPay: number): number {
   if (selfPay <= 0) return 0
-  return Math.min(
-    USER_PAYMENT_FEE_MAX,
-    Math.max(USER_PAYMENT_FEE_UNIT, Math.floor(selfPay / 1000) * USER_PAYMENT_FEE_UNIT),
-  )
+  return USER_PAYMENT_FEE_AMOUNT
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  Webhook を先に段階デプロイしてください**

自己負担額が2,000円以上の決済がデプロイ中に新しい `stripe` と古い `stripeWebhook` の組み合わせへ当たると、新Checkoutは手数料110円で作成される一方、旧Webhookは220円または手数料なししか受理しないため金額不一致で400を返し、支払い済み注文がStripeの再試行まで未確定になります。変更後の仕様書もWebhook先行が必要と認識していますが、`.github/workflows/deploy_functions.yml` の Deploy to Firebase は `--only functions` で全関数を一括更新しており、この順序を保証していません。先に新旧料金を受理するWebhookだけを互換リリースし、その反映後にこの定数とCheckout作成処理を切り替える段階デプロイに分けてください。

AGENTS.md reference: [AGENTS.md:L183-L185](https://github.com/nijuniinc/bokudeli-event-new/blob/bd4f1097f3036838197003345447d123fdafffdc/AGENTS.md#L183-L185)

Useful? React with 👍 / 👎.

**コメント要約**: 新 Checkout と旧 Webhook の組み合わせで金額不一致になりうる<br>本番に220円の旧 Webhook が無いため修正しない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: —

**判断理由**: 新 Checkout の110円を、220円だけを受理する旧 Webhook が拒む、という組み合わせは本番にその旧 Webhook があるときに起きる。origin/production にはその実装が無く、110円も220円も本番未リリースである。初回リリースで段階デプロイを分けないため修正しない。

---

## 評価セッション（2026-10-01 14:26・review-comments-evaluate）

- **評価日時**: 2026-10-01 14:26 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: fix/2373（作業ツリーは fix/2370。両ブランチは同一コミット `78e14d1c7`）
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2374
- **since**: 2026-10-01T05:14:26Z
- **partial**: true（wake フラグ。Codex は commit `78e14d1c7` に対し問題なしと返却。limits や接続案内のみではない）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼定型 5925207089、Codex 問題なし 5925294489）
- **重複除外**: Copilot の issue コメント 5925239732 は RC-3 と RC-4 と同一指摘。Copilot overview 5375253720 は既存インライン RC-1、RC-3、RC-4 の索引
- **新規 RC なし**
- **手順 4a 自動修正**: なし

### RC 一覧（サマリ）

新規 RC なし。

