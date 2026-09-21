# ブランチ feat/2350 レビュー記録

このファイルはブランチ `feat/2350` のレビュー記録です。パス解決の正本は `.agents/skills/review-comments-evaluate/references/review-doc-path.md`。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | §4.1 / §4.7 に #2090 時点の旧文言が残る<br>#2350 の着地・email 欠落時の戻り先と不一致。仕様書を更新済み |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | OTP 切替がメモリ上の `mode` のみで `history.state` を更新しない<br>リロード後に register 判定へ戻り、ログイン OTP が通らない。`replaceState` で永続化済み |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | `/register` 着地で stale pending を検証しない<br>#2350 でデフォルト入口が `/login` から移り、離脱済み SNS 連携が次ログインで発火しうる。login と同じヘルパーを呼ぶよう修正済み |
| [ ] | RC-4 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 👤 UX | 📋 仕様追加 | M | already-exists を常にログイン OTP へ切り替えると Auth-only ユーザーで復旧不能<br>requestEmailLogin は Firestore メール解決前提。origin の 20:02 レビューを RC-4 として統合 |
| [x] | RC-5 | 5652886035 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot SWE の作業報告<br>Auth-only 指摘は RC-4 と同一。新規のコード指摘なし |
| [x] | RC-6 | 5190484172 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | existingProviderId が password でも pid2 に載る<br>SNS 以外は pass-code へ。`isProviderIdType` 判定を追加済み |
| [x] | RC-7 | 3999450580 | 👌 修正不要 | — | — | — | 📐 リファクタ | M | 人気イベントで members 全件購読する<br>#2352 を rebase でドロップし当 PR に該当差分なし |
| [ ] | RC-8 | 3999464283 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | M | 17_SNS自動連携が #2090 の `/login` のみ記述のまま<br>15_アカウント作成 §3.2 と矛盾。関連仕様の URL 表・フローを揃える |
| [x] | RC-9 | 5652927046 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot SWE の作業報告<br>未解決は RC-4 / RC-7 と同一。新規のコード指摘なし |
| [ ] | RC-10 | 5190497690 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 📋 仕様追加 | M | base の参加・キャンセル・問い合わせが `getLogin()` のまま<br>#2350 の未ログイン着地が `/login` に残る。注入設計が必要 |
| [ ] | RC-11 | 4056738193 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | failure policy 文言だけで名前指定 `--force` する<br>同じ関数の minInstances / 危険トリガー確認もまとめて YES になる |
| [x] | RC-12 | 4056738207 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `"${ONLY_ARGS}"` が `--only functions:name` を1引数にする<br>`--only` と selector を分割して渡すよう修正済み |
| [x] | RC-13 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | CLI 実ログは関数名の直後に `. Retried executions...` が続く<br>トークン全体一致だと抽出失敗。先頭トークン列だけ取るよう修正済み |

---

## 評価セッション（2026-09-13 20:02・shokujii-code-review）

- **評価日時**: 2026-09-13 20:02 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/2350
- **PR**: 番号不明（レビュー依頼コメントあり。origin/feat/2350 の記録を RC-4 として統合）
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 0
- **注記**: 別 worktree では RC-1。本ファイルでは通し番号のため RC-4

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-4 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 👤 UX | 📋 仕様追加 | M | already-exists を常にログイン OTP へ切り替えると Auth-only ユーザーで復旧不能<br>requestEmailLogin は Firestore メール解決前提。origin の 20:02 レビューを RC-4 として統合 |

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー。origin 記録では RC-1）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `user/src/pages/register/index.vue:55`, `user/src/pages/pass-code.vue:126`, `user/src/pages/pass-code.vue:217`

**該当コード（レビュー時点の diff）**:

```diff
diff --git a/user/src/pages/pass-code.vue b/user/src/pages/pass-code.vue
@@ -102,15 +117,19 @@ const reSendPassCode = async () => {
   } catch (error) {
-    if (mode === 'register' && error instanceof FirebaseError && error.code === 'functions/already-exists') {
-      notification.show($t('register.already_registered'), 'warning')
-      await router.push(getLogin())
+    if (mode.value === 'register' && isAlreadyRegisteredEmailError(error)) {
+      try {
+        await switchRegisterOtpToLogin()
+      } catch (loginError) {
+        console.warn('Error switching register OTP to login:', loginError)
+        notification.show($t('passcode.send_code_failed'), 'error')
+      }
       return
     }
diff --git a/user/src/pages/register/index.vue b/user/src/pages/register/index.vue
@@ -53,9 +51,15 @@ const handleRegister = async (providerId: ProviderIdType | 'custom', emailInput?
   } catch (error) {
     console.error(error)
-    if (providerId === 'custom' && error instanceof FirebaseError && error.code === 'functions/already-exists') {
-      notification.show($t('register.already_registered'), 'warning')
-      await router.push(getLogin())
+    if (providerId === 'custom' && emailInput != null && isAlreadyRegisteredEmailError(error)) {
+      try {
+        await requestEmailLogin({ email: emailInput })
+        notification.show($t('register.already_registered_login_code'), 'info')
+        await router.push(getPassCode(emailInput, 'login'))
+      } catch (loginError) {
+        console.error(loginError)
+        notification.show($t('login.login_fail_generic'), 'error')
+      }
       return
     } else {
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📋仕様追加/M]: `functions/already-exists` を受けたら必ず `requestEmailLogin` に切り替える実装になっていますが、`requestEmailLogin` は Firestore の `users_personal_information` にメールがあるユーザーにしか OTP を送れません。`confirmEmailRegistration` 側は Auth にだけ同メールのユーザーが残っている場合でも `auth/email-already-exists` を `functions/already-exists` に変換するため、このケースでは登録画面/OTP画面の両方で「ログイン用コード送信」に切り替えた直後に `not-found` で失敗し、ユーザーが先に進めなくなります。 → `already-exists` からの復旧を `requestEmailLogin` 前提にしないで、少なくとも `requestEmailLogin` の `not-found` を別扱いして明示的な復旧導線を出すか、サーバー側で Auth-only ユーザーも解決できるようにしてください。

**コメント要約**: already-exists を常にログイン OTP へ切り替えると Auth-only ユーザーで復旧不能。<br>requestEmailLogin は Firestore メール解決前提。origin の 20:02 レビューを RC-4 として統合。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 今回の変更で追加したクライアント分岐が、Functions 側の既存仕様と噛み合っていません。`requestEmailLogin` は Firestore の個人情報コレクションに対応ユーザーがいないと `not-found` を返す一方、`confirmEmailRegistration` は Auth-only の重複も `already-exists` に変換するため、登録中ユーザーを復旧不能状態にする実害があります。

---

## 評価セッション（2026-09-13 20:04・review-comments-evaluate）

- **評価日時**: 2026-09-13 20:04 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1
- **新規 RC なし**
- **partial**: false（Codex は reviewer 追加 API 失敗。インライン・レビュー本文なし。watcher は Copilot `no_issues` 完了として評価起動）
- **手順 4a 自動修正**: なし（🚨 0件 / 🟡 0件）
- **REVIEW_REQUEST_SINCE**: 2026-09-13T11:01:53Z

### レビュー非該当スキップ

- GitHub id 5652859513（issue comment）: 手順 12 のレビュー依頼定型文

### RC 一覧（サマリ）

このセッションで RC を付けたコメントはありません。

---

## 評価セッション（2026-09-13 20:08・shokujii-code-review）

- **評価日時**: 2026-09-13 20:08 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a/3b 自動修正**: RC-1〜RC-3（🚨 1件 / 🟡 2件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | §4.1 / §4.7 に #2090 時点の旧文言が残る<br>#2350 の着地・email 欠落時の戻り先と不一致。仕様書を更新済み |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | OTP 切替がメモリ上の `mode` のみで `history.state` を更新しない<br>リロード後に register 判定へ戻り、ログイン OTP が通らない。`replaceState` で永続化済み |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | `/register` 着地で stale pending を検証しない<br>#2350 でデフォルト入口が `/login` から移り、離脱済み SNS 連携が次ログインで発火しうる。login と同じヘルパーを呼ぶよう修正済み |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/03_参加者獲得/15_アカウント作成.md:215`

**該当コード（レビュー時点の diff）**:

```diff
@@ -210,9 +210,9 @@
 ### 4.1 URL 一覧
 
 | パス | 役割 | ログイン要否 |
 |------|------|-------------|
 | `/login` | ログイン専用 | 不要 |
-| `/register` | **新規登録専用（本仕様の中心）** | 不要 |
+| `/register` | **新規登録専用（本仕様の中心）** | 不要 |
 | `/pass-code` | OTP（6 桁）入力。未ログイン時は login/register mode、ログイン済み時はメール変更 | 不要（メール変更時はログイン済み）
```

```diff
- email が state に無い場合: 未ログインなら `/login` または `/register` へ戻す。ログイン済みなら `/`
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: `15_アカウント作成.md` §4.1 が `/register` を「新規登録専用」と書いており、§4.7 も email 欠落時の戻り先を「`/login` または `/register`」のまま残している。§1.2・§3.2.4・§4.10 では未ログイン着地を `/register` に統一しており、同一仕様書内で矛盾する。→ §4.1 を新規+既存ログイン（デフォルト着地）に直し、§4.7 の戻り先を `getUnauthenticatedEntry`（`/register`）に揃える。

**コメント要約**: §4.1 / §4.7 に #2090 時点の旧文言が残る。<br>#2350 の着地・email 欠落時の戻り先と不一致。仕様書を更新済み。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 本 PR で更新した同一仕様書の §1.2 / §3.2.4 と矛盾する。#2350 の着地変更の説明漏れであり、仕様判断は不要。手順 3b で §4.1・§4.7 を更新した。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `user/src/pages/pass-code.vue:70`

**該当コード（レビュー時点の diff）**:

```diff
+const switchRegisterOtpToLogin = async (): Promise<void> => {
+  await requestEmailLogin({ email })
+  mode.value = 'login'
+  passCode.value = ''
+  notification.show($t('register.already_registered_login_code'), 'info')
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `switchRegisterOtpToLogin` は `mode` ref だけを `'login'` にしており、`history.state.mode` は `'register'` のまま。リロードすると `parsePassCodeMode(history.state?.mode)` が再び register になり、送信済みのログイン OTP を `confirmEmailRegistration` に渡して失敗する。→ `history.replaceState` で `mode: 'login'`（と email）を永続化する。

**コメント要約**: OTP 切替がメモリ上の `mode` のみで `history.state` を更新しない。<br>リロード後に register 判定へ戻り、ログイン OTP が通らない。`replaceState` で永続化済み。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: #2350 で追加した mode 切替の永続化漏れ。再現はリロード時に限るが、仕様の「mode=login に切替」が不完全。修正方針は `replaceState` 一意。手順 3b で対応した。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `user/src/pages/register/index.vue:24`

**該当コード（レビュー時点の diff）**:

```diff
+import { isAlreadyRegisteredEmailError } from '@/utils/emailAuthError'
+
 const route = useRoute()
 const router = useRouter()
 const notification = useNotification()
 const { t: $t } = useI18n()
 const { requiredValidator, emailValidator } = useValidators()
 
 const isLoading = ref<ProviderIdType | 'custom' | null>(null)
 const isValid = ref(false)
 const email = ref('')
 const linkRequestDialogParams = computed<{
   tryRegisterProviderId: ProviderIdType
   linkProviderId: ProviderIdType
 } | null>(() => {
   return route.query.pid1 == null || route.query.pid2 == null
     ? null
     : {
         tryRegisterProviderId: route.query.pid1 as ProviderIdType,
         linkProviderId: route.query.pid2 as ProviderIdType,
       }
 })
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: #2350 で未ログインのデフォルト着地が `/login` から `/register` に移ったが、`register/index.vue` は `runLoginPageMountAutoLinkage`（`clearStalePendingLinkRequestOutsideAutoLinkage`）を呼ばない。離脱済みの `pendingLinkRequestProviderId` が残ったまま `/register` から既存 SNS ログインすると、`handleRedirect` が stale pending を消費して別 SNS を自動連携しうる（`17_SNSアカウント自動連携.md` RC-29）。加えて pid1/pid2 を `as ProviderIdType` でキャストしており、#2350 で到達可能になった連携ダイアログの入力検証が `/login` より弱い。→ マウント時に login と同じヘルパーを呼び、pid 正規化も `parseLoginQueryPids` / `getLinkRequestDialogParams` に揃える。

**コメント要約**: `/register` 着地で stale pending を検証しない。<br>#2350 でデフォルト入口が `/login` から移り、離脱済み SNS 連携が次ログインで発火しうる。login と同じヘルパーを呼ぶよう修正済み。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: #2185 RC-29 で `/login` マウント時の stale pending 検証が必須になった。本 PR はその入口を `/register` に移したため、同等の検証漏れは認可・アカウント連携の回帰になる。既存ヘルパーの呼び出しで方針は一意。手順 3a で `onMounted` 追加と `as` 除去を行った。影響は login と同じ検証を新着地へ移植する範囲に閉じる。

---

## 評価セッション（2026-09-13 20:16・review-comments-evaluate）

- **評価日時**: 2026-09-13 20:16 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3
- **重複除外**: 4（同一指摘が RC-1〜RC-4 に記録済み）
- **partial**: false
- **手順 4a 自動修正**: RC-6（🚨 1件 / 🟡 0件）
- **REVIEW_REQUEST_SINCE**: 2026-09-13T11:01:53Z

### レビュー非該当スキップ

- GitHub id 5652859513（issue comment）: 手順 12 のレビュー依頼定型文
- GitHub id 5652886551（issue comment）: Codex 接続案内のみ
- GitHub id 5652914879（issue comment）: 手順 12 のレビュー依頼定型文

### 重複除外（RC 採番なし）

- GitHub id 3999450577: RC-4 と同一（Auth-only を login OTP へ切り替えない）
- GitHub id 3999450582: RC-1 と同一（仕様書の `/register` 役割）
- GitHub id 3999450584: RC-2 と同一（history.state の mode）
- GitHub id 3999450586: RC-3 と同一（`/register` の stale pending）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-5 | 5652886035 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot SWE の作業報告<br>Auth-only 指摘は RC-4 と同一。新規のコード指摘なし |
| [x] | RC-6 | 5190484172 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害, 👤 UX | 🔧 微修正 | S | existingProviderId が password でも pid2 に載る<br>SNS 以外は pass-code へ。`isProviderIdType` 判定を追加済み |
| [x] | RC-7 | 3999450580 | 👌 修正不要 | — | — | — | 📐 リファクタ | M | 人気イベントで members 全件購読する<br>#2352 を rebase でドロップし当 PR に該当差分なし |

---

**識別子**: RC-5（GitHub id: 5652886035）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
>
> @copilot この PR ��...

レビューし、RC-1 を `documents/レビューコメント/review-feat-2350.md` に記録しました。`already-exists` 時に常にログインOTPへ切り替える実装は、Firestore 未作成の Auth-only ユーザーで `requestEmailLogin` が `not-found` になり復旧不能になるため、必須修正と判断しています。対応コミット: `30221aef`

**コメント要約**: Copilot SWE の作業報告。<br>Auth-only 指摘は RC-4 と同一。新規のコード指摘なし。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: コード差分への新規指摘ではなく、既存 RC-4 と同じ判断を作業報告したコメント。

---

**識別子**: RC-6（GitHub id: 5190484172）

**レビュワー**: Copilot

**指摘箇所**: `user/src/router/index.ts:209`

**該当コード（レビュー時点の diff）**:

```diff
@@ -216,7 +206,7 @@ export const setupRouter = (router: Router) => {
             }
           } else {
             return {
-              path: '/login',
+              path: getUnauthenticatedEntry(),
               query: { ...to.query, pid1: pendingCred?.providerId, pid2: existingProviderId },
```

**レビュワーのコメント（原文）**:

### 🔵 Needs a closer look

Unresolved authentication-routing and OTP issues, plus documentation mismatches, remain.

Suppressed comments より該当箇所:

**user/src/router/index.ts:209**
* [must] `existingProviderId` は Firebase の `password` なども返し得ますが、ここでは null 以外をすべて SNS の `pid2` として `/register` に渡しています。`register/index.vue` はこれを `ProviderIdType` とみなして `signInByProviderService` を呼ぶため、メール認証アカウントでは無効 provider 例外になり、仕様の「メールのみは `/pass-code`」から外れます。SNS provider の場合だけこの分岐にし、それ以外は pass-code にしてください。

レビュー全文: https://github.com/nijuniinc/bokudeli-event-new/pull/2353#pullrequestreview-5190484172

**コメント要約**: existingProviderId が password でも pid2 に載る。<br>SNS 以外は pass-code へ。`isProviderIdType` 判定を追加済み。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: メール既存アカウントを SNS 連携ダイアログに流すと例外になり、#2350 の「メールのみは pass-code」から外れる。`isProviderIdType` で分岐する方針は一意のため手順 4a で修正した。同一レビュー内の EventDetailsCard 等が `getLogin()` のまま、という指摘は共通コンポーネント設計を含むため本 RC では扱わず要確認。

---

**識別子**: RC-7（GitHub id: 3999450580）

**レビュワー**: Codex

**指摘箇所**: `user/src/pages/index.vue:50`

**該当コード（レビュー時点の diff）**:

```diff
@@ -47, 7 +47, 7 @@ const popularEvents = computed(
         if (s.event == null) {
           return []
         }
-        return { event: s.event }
+        return { event: s.event, members: s.members ?? [] }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  表示上限より前に参加者購読を絞ってください**

参加者が15人を超える人気イベントでは、ここで `s.members` を評価すると `base/src/stores/event.ts` の computed が全 member ID に対して `useUserStore` を生成し、各ユーザードキュメントの `onSnapshot` を開始します。一方、`EventCard.vue` が実際に描画するのは `.slice(0, 15)` のみなので、トップページを開くだけで表示されない参加者まで全件購読され、人気イベントの規模に比例して初期 read 数・通信量・再計算負荷が増えます。購読を開始する前に15件へ制限できる取得経路にしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 人気イベントで members 全件購読する。<br>カードは15件のみ描画。購読制限は既存 EventStore の設計変更。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: #2352（人気イベントの参加者アイコン表示）を rebase でドロップしたため、指摘の `s.members` 評価は本 PR の差分に含まれない。EventStore の購読最適化は将来 #2352 を再開する際に検討。

---

## 評価セッション（2026-09-13 20:22・review-comments-evaluate）

- **評価日時**: 2026-09-13 20:22 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3
- **重複除外**: 3（Auth-only は RC-4 と同一）
- **partial**: false
- **手順 4a 自動修正**: なし（🚨 0件適用 / 🟡 1件は 📑 仕様書のため対象外）
- **REVIEW_REQUEST_SINCE**: 2026-09-13T11:14:11Z

### レビュー非該当スキップ

- GitHub id 5652914879（issue comment）: 手順 12 のレビュー依頼定型文
- GitHub id 5652927743（issue comment）: Codex 接続案内のみ
- GitHub id 5190496053（review）: Codex レビューヘッダと接続案内のみ。具体指摘なし

### 重複除外（RC 採番なし）

- GitHub id 3999466171: RC-4 と同一（pass-code の Auth-only → `not-found`）
- GitHub id 3999466190: RC-4 と同一（register 切替の Auth-only → `not-found`）
- Review 5190497690 の suppressed（`15_アカウント作成.md:134`）: RC-4 と同一（仕様表と `requestEmailLogin` の矛盾）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-8 | 3999464283 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | M | 17_SNS自動連携が #2090 の `/login` のみ記述のまま<br>15_アカウント作成 §3.2 と矛盾。関連仕様の URL 表・フローを揃える |
| [x] | RC-9 | 5652927046 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot SWE の作業報告<br>未解決は RC-4 / RC-7 と同一。新規のコード指摘なし |
| [ ] | RC-10 | 5190497690 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害, 👤 UX | 📋 仕様追加 | M | base の参加・キャンセル・問い合わせが `getLogin()` のまま<br>#2350 の未ログイン着地が `/login` に残る。注入設計が必要 |

---

**識別子**: RC-8（GitHub id: 3999464283）

**レビュワー**: Codex

**指摘箇所**: `documents/03_参加者獲得/15_アカウント作成.md:167`

**該当コード（レビュー時点の diff）**:

```diff
@@ -162,8 +164,7 @@ PF版（一般ユーザーアプリ）で、**新規ユーザーが明示的な
 | 入口 | 状況 | 挙動 | #2090 |
 |------|------|------|-------|
-| `/login` | `account-exists-with-different-credential`（別 SNS と同じメール） | 既存がメールのみ → `/pass-code` mode=login / 既存が SNS → `/login?pid1=&pid2=`（連携ダイアログ） | 変更なし |
-| `/register` | 同上 | 警告 → **`/login` のみ**（pass-code ログインには進まない） | **変更** |
+| `/login` / `/register` | `account-exists-with-different-credential`（別 SNS と同じメール） | 既存がメールのみ → `/pass-code` mode=login / 既存が SNS → `/register?pid1=&pid2=`（連携ダイアログ） | **#2350**（#2090 の `/register` は `/login` のみ） |
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P3 Badge](https://img.shields.io/badge/P3-lightgrey?style=flat)</sub></sub>  SNS自動連携仕様も新しい遷移先に揃えてください**

この行では `/register` 起点の credential 衝突も自動連携へ進む仕様に変更していますが、リポジトリ全体を確認すると `documents/03_参加者獲得/17_SNSアカウント自動連携.md` の220〜228行は、同じフローについて「pending を破棄して `/login` のみに遷移し、自動連携には進まない」と引き続き定義しています。認証連携の実装・テストで参照される仕様が正反対になるため、関連仕様書のURL表、フロー図、`/register` 起点の説明も今回の挙動に合わせて更新してください。

Useful? React with 👍 / 👎.

**コメント要約**: 17_SNS自動連携が #2090 の `/login` のみ記述のまま<br>15_アカウント作成 §3.2 と矛盾。関連仕様の URL 表・フローを揃える

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: M

**判断理由**: #2350 で 15 側の衝突フローを変えた以上、17 の §4.4 / L-1 / T-4 等が旧仕様のままでは実装判断が割れる。範囲は仕様書横断のため M。📑 のため手順 4a の自動修正対象外。

---

**識別子**: RC-9（GitHub id: 5652927046）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
>
> @copilot この PR ��...

レビューし、`documents/レビューコメント/review-feat-2350.md` に RC-5 を追記しました。現時点では RC-4（Auth-only ユーザーで `already-exists` 後に復旧不能）と RC-5（人気イベントで表示外メンバーまで購読）が未解決です。対応コミット: `19d8aa2`

**コメント要約**: Copilot SWE の作業報告<br>未解決は RC-4 / RC-7 と同一。新規のコード指摘なし

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: コード差分への新規指摘ではなく、既存 RC の進捗報告。SWE 側の「RC-5」は本ファイルの RC-7（members 購読）を指す。

---

**識別子**: RC-10（GitHub id: 5190497690）

**レビュワー**: Copilot

**指摘箇所**: `user/src/router/utils.ts:56`（suppressed。関連: `base/src/components/CommunityMembershipButton.vue:123-126`、`CancelPolicyDialog.vue:9-11`、`EventDetailsCard.vue:130-133`）

**該当コード（レビュー時点の diff）**:

```diff
/** 未ログイン時のデフォルト着地。ナビ・要認証ガードを含む全導線で使う（#2350） */
export const getUnauthenticatedEntry = () => getRegister()
```

**レビュワーのコメント（原文）**:

### 🟡 Changes recommended

Auth-only OTP recovery and remaining `/login` unauthenticated routes must be addressed.

*Get a fresh assessment by requesting another Copilot review.*

<details>
<summary>Review details</summary>

### Suppressed comments (2)

**documents/03_参加者獲得/15_アカウント作成.md:134**
* [must] この仕様表は Auth-only ユーザーでもログイン OTP に切り替わると記載していますが、現行の `requestEmailLogin` は Firestore のメール情報がないと `not-found` を返すため、実装と矛盾します。Auth-only の復旧仕様を実装するまで実際の挙動に合わせるか、コード修正と同時にこの記述を更新してください。
**user/src/router/utils.ts:56**
* [must] このヘルパーを追加しただけでは #2350 の未ログイン導線が全体で統一されていません。`base/src/components/CommunityMembershipButton.vue:123-126`、`CancelPolicyDialog.vue:9-11`、`EventDetailsCard.vue:130-133` は依然 `getLogin()` を返すため、コミュニティ参加・注文履歴リンク・イベント詳細の問い合わせ確認から `/login` に着地します。ユーザー側の遷移先を注入するなど、共有 base がアプリごとの入口を選べるようにしてこれらの導線も `/register` に揃えてください。
```
/** 未ログイン時のデフォルト着地。ナビ・要認証ガードを含む全導線で使う（#2350） */
export const getUnauthenticatedEntry = () => getRegister()
```

- **Files reviewed:** 20/20 changed files
- **Comments generated:** 2
- **Review effort level:** Lite
</details>

**コメント要約**: base の参加・キャンセル・問い合わせが `getLogin()` のまま<br>#2350 の未ログイン着地が `/login` に残る。注入設計が必要

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: #2350 完了条件は強制認証ダイアログも含め未ログイン着地を `/register` に揃える。base 共有コンポーネントを直書きで `getRegister()` にすると enterprise の入口まで変わるため、注入方針の確認が必要。仕様判断・設計のため手順 4a の自動修正対象外。Auth-only の suppressed は RC-4 と同一のため本 RC では扱わない。

---

## 評価セッション（2026-09-19・#2352 取りやめ）

- **評価日時**: 2026-09-19 JST
- **評価者**: Cursor Agent
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **操作**: `git rebase --onto c84c126cc bd2ab9d30` により #2352 の doc / user コミット 2 本を履歴から削除
- **RC 更新**: RC-7 を 👌 修正不要（該当差分なし）に更新

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-7 | 3999450580 | 👌 修正不要 | — | — | — | 📐 リファクタ | M | 人気イベントで members 全件購読する<br>#2352 を rebase でドロップし当 PR に該当差分なし |

---

## 評価セッション（2026-09-19 22:12・review-comments-evaluate auto）

- **評価日時**: 2026-09-19 22:12 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto・PR review wake）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **REVIEW_REQUEST_SINCE**: 2026-09-19T13:02:12Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2
- **重複除外（RC 採番なし）**: 3
- **新規 RC**: 0
- **手順 4a 自動修正**: なし（🚨 RC-4 / RC-10 は 📋 仕様追加・M のため対象外）

### レビュー非該当スキップ

- GitHub id 5742091538（issue comment）: 手順 12 のレビュー依頼定型文
- GitHub id 5742102374（issue comment）: Copilot 進捗報告（未解決は RC-4 / RC-10 と同一。新規のコード指摘なし）

### 重複除外（RC 採番なし）

- GitHub id 4053269948（Copilot inline）: RC-10 と同一（base の `getLogin()` 残存）
- GitHub id 4053273849（Codex inline）: RC-10 と同一（base 未ログイン導線の注入）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| — | （新規 RC なし） | — | — | — | — | — | — | — | 本セッションは RC-10 再確認のみ |

---

## 評価セッション（2026-09-20 19:57・review-comments-evaluate auto）

- **評価日時**: 2026-09-20 19:57 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto・PR review wake）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **REVIEW_REQUEST_SINCE**: 2026-09-20T10:28:43Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2
- **重複除外（RC 採番なし）**: 4
- **新規 RC**: RC-11 / RC-12
- **手順 4a 自動修正**: RC-12（🚨 1件）。RC-11 は 🔒 のため対象外

### レビュー非該当スキップ

- GitHub id 5749234771（issue comment）: 手順 12 のレビュー依頼定型文
- GitHub id 5260373242（Codex review 本体）: 接続案内ボイラープレートのみ（指摘は inline）

### 重複除外（RC 採番なし）

- GitHub id 5749272964（Copilot issue comment）: RC-4 / RC-10 と同一
- GitHub id 5260370002（Copilot overview）: RC-4 / RC-10 / RC-11 / RC-12 の再掲
- GitHub id 4056741381（Codex inline）: RC-11 と同一
- GitHub id 4056741379（Codex inline）: RC-12 と同一

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-11 | 4056738193 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | failure policy 文言だけで名前指定 `--force` する<br>同じ関数の minInstances / 危険トリガー確認もまとめて YES になる |
| [x] | RC-12 | 4056738207 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `"${ONLY_ARGS}"` が `--only functions:name` を1引数にする<br>`--only` と selector を分割して渡すよう修正済み |

---

**識別子**: RC-11（GitHub id: 4056738193）

**レビュワー**: Copilot

**指摘箇所**: `.github/scripts/firebase-deploy-functions.sh:50`

**該当コード（レビュー時点の diff）**:

```diff
+if ! grep -Fq "Pass the --force option to deploy functions with a failure policy" "${LOG}"; then
```

**レビュワーのコメント（原文）**:

[must] この条件は failure policy の文言の有無しか見ていません。`--force` は failure policy だけでなく minInstances 増加や危険なトリガー変更も承認する単一フラグなので、同じ対象に別の確認が必要な場合でも後続の名前指定 `--force` が自動実行されます。failure policy 以外の確認を検出して abort するか、安全な扱いを明示的に分離してください。

**コメント要約**: failure policy 文言だけで名前指定 `--force` する<br>同じ関数の minInstances / 危険トリガー確認もまとめて YES になる

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 案 C は orphan 削除を避けるために関数名へ `--force` を限定した。同じ関数に他の確認が同時に乗るケースは稀だが、`--force` が単一フラグである指摘は妥当。どの CLI 文言で abort するかは影響範囲の確認が要るため自動修正しない。

---

**識別子**: RC-12（GitHub id: 4056738207）

**レビュワー**: Copilot

**指摘箇所**: `.github/scripts/firebase-deploy-functions.sh:73`

**該当コード（レビュー時点の diff）**:

```diff
+echo "failure policy: 対象関数のみ --force でデプロイします: ${ONLY_ARGS}"
+"${FIREBASE_BIN}" --project "${PROJECT_ID}" deploy --force "${ONLY_ARGS}"
```

**レビュワーのコメント（原文）**:

[must] `ONLY_ARGS` は `--only functions:<name>` という文字列全体を 1 つの argv として渡しています。Firebase CLI では `--only` と selector を別引数にする必要があるため、failure policy の名前指定リトライ自体が失敗します。現在のモックテストは `$*` しか見ておらず、この境界を検出できません。

**コメント要約**: `"${ONLY_ARGS}"` が `--only functions:name` を1引数にする<br>`--only` と selector を分割して渡すよう修正済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: Firebase CLI は `--only` と selector を別 argv とする。引用した1引数だと名前指定デプロイが失敗する。`read` で分割し、テストは `arg` 単位で境界を見るよう直した。

---

## 評価セッション（2026-09-20 19:57・shokujii-code-review）

- **評価日時**: 2026-09-20 19:57 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/2350
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2353
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 0
- **新規 RC**: RC-13

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-13 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | CLI 実ログは関数名の直後に `. Retried executions...` が続く<br>トークン全体一致だと抽出失敗。先頭トークン列だけ取るよう修正済み |

---

**識別子**: RC-13（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `.agents/scripts/parse_failure_policy_functions.py:31`

**該当コード（レビュー時点の diff）**:

```diff
-FUNC_TOKEN_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*)(?:\([^)]*\))?$")
+FUNC_TOKEN_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*)(?:\([^)]*\))?")
```

**レビュワーのコメント（原文）**:

🚨 CLI 実ログは `onPartnerMenuSoldOutChanged(asia-northeast1). Retried executions are billed...` と同一行に説明文が続く。トークン全体一致だと抽出 0 件になり、名前指定 `--force` に進めない。

**コメント要約**: CLI 実ログは関数名の直後に `. Retried executions...` が続く<br>トークン全体一致だと抽出失敗。先頭トークン列だけ取るよう修正済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: sandbox run 35505209554 で再現済み。先頭の `name(region)` 列だけ取り、カンマ以外で打ち切る。実ログをテストに追加した。

---

