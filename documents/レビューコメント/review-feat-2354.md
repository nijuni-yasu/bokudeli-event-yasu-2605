# ブランチ feat/2354 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `notification_states` の client 拒否を Rules テストで固定する<br>仕様 §8.4。`tests/firestore-rules/src/chatUnreadMailState.test.ts` を追加 |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | SendGrid 失敗ログの `error` が `{}` になる<br>`error.message` / `String(error)` に正規化 |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `deleteUserAccount` テストが新 store を mock していない<br>cleanup 例外が握りつぶされ、状態削除を検証できない |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 送信枠の TZ を `'Asia/Tokyo'` 直書きしている<br>`DEFAULT_TIME_ZONE` を使う |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | テンプレ ID だけ入れると配信停止なしで送れる<br>ASM グループ ID 0 のあいだはジョブを止める |
| [ ] | RC-6 | 4079928881 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 未読ユーザーを無制限に同時送信している<br>Codex P2 でも指摘。件数次第でタイムアウトや SendGrid 制限に当たる |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | ユーザー処理の例外が userId なしで落ちる<br>catch して userId とメッセージをログする |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 5分周期と実行時間 540 秒が重なると二重送信しうる<br>`maxInstances: 1` で同時実行を1に制限する |
| [x] | RC-9 | 4079892175 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | SendGrid 成功後に `last_sent_at` 保存失敗で同一枠再送しうる<br>送信前に枠を確保し、成功後は追加書き込みしない |
| [x] | RC-10 | 4079928876 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | 同一ユーザーの送信権を原子的に確保する<br>`concurrency: 1` とトランザクションで `last_sent_at` を先に書く |
| [x] | RC-11 | 4079928886 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 停止済みエンタープライズ利用者を送信対象から除外<br>Enterprise と EnterpriseMember の `is_active` を確認 |
| [ ] | RC-12 | 4079928895 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 送信直前に membership の有効性を再検証 |
| [ ] | RC-13 | 4079928889 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 📏 規約 | 📐 リファクタ | L | タイムゾーン依存の枠計算を common へ |
| [ ] | RC-14 | 4101553828 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | 送信権がクラッシュで成功扱いに残る<br>期限付き予約が必要。last_sent_at の先書きだけでは足りない |
| [ ] | RC-15 | 4101548011 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | claim / release のトランザクションをテストする |
| [x] | RC-16 | 4101553835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 再送の 15 分待ちが古い未読で満たされる<br>新しい未読自身が 15 分以上のときだけ送る |

---

## 評価セッション（2026-09-22 22:36・shokujii-code-review）

- **評価日時**: 2026-09-22 22:36 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/2354
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a/3b 自動修正**: RC-1〜4（🚨 1件 / 🟡 3件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `notification_states` の client 拒否を Rules テストで固定する<br>仕様 §8.4。`tests/firestore-rules/src/chatUnreadMailState.test.ts` を追加 |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | SendGrid 失敗ログの `error` が `{}` になる<br>`error.message` / `String(error)` に正規化 |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `deleteUserAccount` テストが新 store を mock していない<br>cleanup 例外が握りつぶされ、状態削除を検証できない |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 送信枠の TZ を `'Asia/Tokyo'` 直書きしている<br>`DEFAULT_TIME_ZONE` を使う |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `firestore.rules:380`

**該当コード（レビュー時点の diff）**:

```diff
             match /friends/{friendUserId} {
                 allow read: if request.auth != null && request.auth.uid == user_id;
                 allow write: if false;
             }
+            match /notification_states/{stateId} {
+                allow read, write: if false;
+            }
         }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `firestore.rules` に `users/{user_id}/notification_states` の client `read, write: if false` を追加したが、`tests/firestore-rules` 側のテストが無い。チェックリスト「rules 変更時は emulator テストを追加」および仕様 §8.4 に反する → 所有者・他ユーザー・未認証で get/set/delete が拒否されるテストを追加する

**コメント要約**: `notification_states` の client 拒否を Rules テストで固定する
仕様 §8.4。`tests/firestore-rules/src/chatUnreadMailState.test.ts` を追加

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 新規 match の deny を回帰で固定できる。テスト追加方針は一意。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:144`

**該当コード（レビュー時点の diff）**:

```diff
   } catch (error) {
-    logger.error('Failed to send chat unread mail', { userId, error })
+    logger.error('Failed to send chat unread mail', {
+      userId,
+      error: error instanceof Error ? error.message : String(error),
+    })
     return 'failed'
   }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `logger.error(..., { error })` だと Error が JSON で `{}` になり、SendGrid 失敗理由が Cloud Logging で追えない → `error instanceof Error ? error.message : String(error)` に揃える

**コメント要約**: SendGrid 失敗ログの `error` が `{}` になる
`error.message` / `String(error)` に正規化

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 既存メール系 Function と同じ正規化。方針は一意。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/deleteUserAccount.test.ts:104`

**該当コード（レビュー時点の diff）**:

```diff
+const deleteChatUnreadMailStateMock = vi.fn()
+
+vi.mock('./stores/chatUnreadMailState.js', () => ({
+  deleteChatUnreadMailState: (...args: unknown[]) => deleteChatUnreadMailStateMock(...args),
+}))
+
 vi.mock('./stores/chatMembership.js', () => ({
   listChatMembershipsForUser: (...args: unknown[]) => listChatMembershipsForUserMock(...args),
   getChatMembershipRef: vi.fn(() => ({ path: 'users/uid/chat_memberships/room1' })),
 }))
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `cleanupUserChatData` が `deleteChatUnreadMailState` を呼ぶようになったが、テストは当該 store を mock していない。Firestore mock の `doc()` に `collection()` が無く、削除は例外になっても `cleanupUserChatData` の try/catch で握りつぶされる。退会時の状態削除が検証されない → store を mock し、成功パスで呼ばれることを assert する

**コメント要約**: `deleteUserAccount` テストが新 store を mock していない
cleanup 例外が握りつぶされ、状態削除を検証できない

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 退会 cleanup の回帰がテストで見えない。仕様どおり状態ドキュメントを消す経路なので本タスク内で直す。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/utils/chatUnreadMail.ts:5`

**該当コード（レビュー時点の diff）**:

```diff
 import { DateTime } from 'luxon'
 import type { ChatMembership } from '@shokujii/common/schemas/ChatMembership.js'
+import { DEFAULT_TIME_ZONE } from '@shokujii/common/utils/datetime.js'
 
-export const CHAT_UNREAD_MAIL_TIME_ZONE = 'Asia/Tokyo'
+export const CHAT_UNREAD_MAIL_TIME_ZONE = DEFAULT_TIME_ZONE
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 新規の枠判定が `'Asia/Tokyo'` を直書きしている。日付・時刻チェックリストは functions への TZ 新規追加を `common` の `DEFAULT_TIME_ZONE` に閉じる → 定数を common から参照する

**コメント要約**: 送信枠の TZ を `'Asia/Tokyo'` 直書きしている
`DEFAULT_TIME_ZONE` を使う

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 枠ロジック自体は functions に残してよい。zone 文字列だけ common 正本に揃える方針は一意。

---

## 評価セッション（2026-09-23 15:55・shokujii-code-review）

- **評価日時**: 2026-09-23 15:55 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/2354
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3b 自動修正**: RC-5、RC-7、RC-8（🟡 3件）。RC-6 は 📐 リファクタかつ並列数の方針が未確定のため未着手

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | テンプレ ID だけ入れると配信停止なしで送れる<br>ASM グループ ID 0 のあいだはジョブを止める |
| [ ] | RC-6 | なし | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 未読ユーザーを無制限に同時送信している<br>件数次第でタイムアウトや SendGrid 制限に当たる。並列数は要検討 |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | ユーザー処理の例外が userId なしで落ちる<br>catch して userId とメッセージをログする |
| [x] | RC-8 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 5分周期と実行時間 540 秒が重なると二重送信しうる<br>`maxInstances: 1` で同時実行を1に制限する |

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:33`

**該当コード（レビュー時点の diff）**:

```diff
+/** コンソールでグループ作成後に差し替える。0 のあいだは送らない */
+export const CHAT_UNREAD_MAIL_ASM_GROUP_ID = 0
+
+export const isChatUnreadMailDeliveryConfigured = (): boolean => {
+  return isChatUnreadMailTemplateConfigured() && CHAT_UNREAD_MAIL_ASM_GROUP_ID > 0
+}
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 既存の会員向けメールは SendGrid ASM の groupId を付けている。チャット未読メールはテンプレ ID のプレースホルダだけを見て、ID を実値に差し替えると配信停止なしで送れる → グループ ID が 0 のあいだはジョブを止め、0 より大きいときだけ asm を付ける

**コメント要約**: テンプレ ID だけ入れると配信停止なしで送れる
ASM グループ ID 0 のあいだはジョブを止める

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 採番前は送らない、というテンプレ ID と同じ止め方で一意。仕様 §4.5 のプレースホルダも 0 に揃えた。

---

**識別子**: RC-6（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:174`

**該当コード（レビュー時点の diff）**:

```diff
  const results = await Promise.allSettled(
    [...grouped.entries()].map(async ([userId, memberships]) => {
      try {
        return await sendChatUnreadMailToUser(userId, memberships, nowMillis)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📐リファクタ/M]: 未読ユーザー全員を Promise.allSettled で同時に送っている。ユーザーごとにルーム名・host の Firestore 読みもある。未読が多いと 540 秒や SendGrid の制限に当たる → 同時実行数の上限を検討する。上限の数は仕様に無いので本レビューでは変えない

**コメント要約**: 未読ユーザーを無制限に同時送信している
件数次第でタイムアウトや SendGrid 制限に当たる。並列数は要検討

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 仕様は Promise.allSettled を指定している。上限値は一意でないため自動修正しない。

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:178`

**該当コード（レビュー時点の diff）**:

```diff
      try {
        return await sendChatUnreadMailToUser(userId, memberships, nowMillis)
      } catch (error) {
        logger.error('Failed to send chat unread mail', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        })
        return 'failed'
      }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: getUser や状態保存が throw すると Promise.allSettled の rejected になり、件数だけ増えて userId が残らない → ユーザー単位で catch し、メッセージをログして failed を返す

**コメント要約**: ユーザー処理の例外が userId なしで落ちる
catch して userId とメッセージをログする

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 既存メールの error 正規化と同じ。失敗しても他ユーザーは続行する。

---

**識別子**: RC-8（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:230`

**該当コード（レビュー時点の diff）**:

```diff
     timeoutSeconds: 540,
+    maxInstances: 1,
   },
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: スケジュールは 5 分、timeout は 540 秒。前の実行が残っているあいだに次が起動すると、同じ枠で last_sent_at 更新前に二重送信しうる → onSchedule の maxInstances を 1 にする

**コメント要約**: 5分周期と実行時間 540 秒が重なると二重送信しうる
`maxInstances: 1` で同時実行を1に制限する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 送信成功後に last_sent_at を書く仕様は維持したまま、同時実行だけ止める。

---

## 評価セッション（2026-09-23 16:15・review-comments-evaluate）

- **評価日時**: 2026-09-23 16:15 JST
- **評価者**: Cursor Agent（review-comments-evaluate・auto）
- **ブランチ名**: feat/2354
- **PR**: #2362
- **REVIEW_REQUEST_SINCE**: 2026-09-23T07:01:30Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 4（依頼コメント 5790516392、Copilot エラー 5790517285、Copilot 概要 5790627629、RC-6 重複 Codex 4079928881）
- **手順 4a 自動修正**: なし（🚨 は工数 M・設計判断を含む）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-9 | 4079892175 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | SendGrid 成功後に `last_sent_at` 保存失敗で同一枠再送しうる |
| [x] | RC-10 | 4079928876 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | ユーザー単位の送信権を原子的に確保する |
| [x] | RC-11 | 4079928886 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 停止済みエンタープライズ利用者を送信対象から除外 |
| [ ] | RC-12 | 4079928895 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 送信直前に membership の有効性を再検証 |
| [ ] | RC-13 | 4079928889 | 🟡 修正提案 | 未着手 | 📤 スコープ外 | 📏 規約 | 📐 リファクタ | L | タイムゾーン依存の枠計算を common へ |

**識別子**: RC-9（GitHub id: 4079892175）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:162`

**該当コード（レビュー時点の diff）**: `(diff_hunk 全文は GitHub API。saveChatUnreadMailState 直後の return 'sent')`

**レビュワーのコメント（原文）**:

[must] SendGrid が受理した後に `saveChatUnreadMailState` が失敗すると、ユーザー単位の catch は `failed` を返すだけで `last_sent_at` は未記録のままです。次の 5 分実行は初回送信扱いで同じ枠に再送し、1 日最大 2 通・同一枠 1 通の制約を破り得ます。状態書き込みの再試行・回復、または同一送信を識別して重複を抑止する運用を追加してください。

**コメント要約**: SendGrid 成功後の状態保存失敗で同一枠再送しうる

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 仕様の 1 日 2 通・同一枠 1 通と矛盾。再試行または idempotency が必要で自動修正の方針は一意に決めにくい。

---

**識別子**: RC-10（GitHub id: 4079928876）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:103`

**レビュワーのコメント（原文）**: （Codex P1・同一ユーザーの送信権を原子的に確保する。`concurrency: 1` とトランザクションで送信予約またはリース）

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**判断理由**: RC-8 の maxInstances だけでは同一インスタンス内の競合を防げない。Firestore トランザクション設計が必要。対応として `concurrency: 1` と送信前トランザクションを入れた。

---

**識別子**: RC-11（GitHub id: 4079928886）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:89`

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**判断理由**: 退職者等へのメール漏洩リスク。Enterprise 停止状態の参照先と仕様への追記が必要。`enterprise_id` があるとき Enterprise と EnterpriseMember の `is_active` を見てから送信する。

---

**識別子**: RC-12（GitHub id: 4079928895）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:173`

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**判断理由**: 大量ユーザー時の既読レース。送信直前の再取得は妥当だが RC-6 と合わせて実装順を検討。

---

**識別子**: RC-13（GitHub id: 4079928889）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/chatUnreadMail.ts:3`

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📤 スコープ外

**判断理由**: 規約上の理想形だが #2354 の必須要件ではない。別リファクタ可。

---

## 評価セッション（2026-09-25 14:55・review-comments-evaluate）

- **評価日時**: 2026-09-25 14:55 JST
- **評価者**: Cursor Agent（review-comments-evaluate・auto）
- **ブランチ名**: feat/2354
- **PR**: #2362
- **REVIEW_REQUEST_SINCE**: 2026-09-25T05:46:00Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 4（依頼 5827478673、Copilot エラー 5827479739、Codex サマリ 5827482093、Copilot 概要 5827542419）
- **同一指摘のため新規 RC なし**: 4101547920 は RC-12、4101547970 は RC-6
- **手順 4a 自動修正**: RC-16

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-14 | 4101553828 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | 送信権がクラッシュで成功扱いに残る |
| [ ] | RC-15 | 4101548011 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | claim / release のトランザクションをテストする |
| [x] | RC-16 | 4101553835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 再送の 15 分待ちが古い未読で満たされる |

**識別子**: RC-14（GitHub id: 4101553828）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/stores/chatUnreadMailState.ts:85`

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: claim 後にプロセスが落ちると last_sent_at が成功時刻のまま残り、未送信の通知が抑止される。期限付き予約はスキーマ追加が必要なのでこの場では直していない。

---

**識別子**: RC-15（GitHub id: 4101548011）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/chatUnreadMailState.ts:87`

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 送信権のトランザクション自体のテストが無い。モック方針の確定が必要なので未着手。

---

**識別子**: RC-16（GitHub id: 4101553835）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/chatUnreadMail.ts:94`

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 再送時は前回送信より新しい未読自身が 15 分以上のときだけ送る。純関数と仕様の条件表を合わせた。

---

