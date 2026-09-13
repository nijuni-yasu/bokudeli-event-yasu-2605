# ブランチ feat/2350 レビュー記録

このファイルはブランチ `feat/2350` のレビュー記録です。パス解決の正本は `.agents/skills/review-comments-evaluate/references/review-doc-path.md`。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | §4.1 / §4.7 に #2090 時点の旧文言が残る<br>#2350 の着地・email 欠落時の戻り先と不一致。仕様書を更新済み |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | OTP 切替がメモリ上の `mode` のみで `history.state` を更新しない<br>リロード後に register 判定へ戻り、ログイン OTP が通らない。`replaceState` で永続化済み |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | `/register` 着地で stale pending を検証しない<br>#2350 でデフォルト入口が `/login` から移り、離脱済み SNS 連携が次ログインで発火しうる。login と同じヘルパーを呼ぶよう修正済み |
| [ ] | RC-4 | なし | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 👤 UX | 📋 仕様追加 | M | already-exists を常にログイン OTP へ切り替えると Auth-only ユーザーで復旧不能<br>requestEmailLogin は Firestore メール解決前提。origin の 20:02 レビューを RC-4 として統合 |

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
