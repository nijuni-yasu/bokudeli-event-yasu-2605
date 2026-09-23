# ブランチ feat/2354 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | `notification_states` の client 拒否を Rules テストで固定する<br>仕様 §8.4。`tests/firestore-rules/src/chatUnreadMailState.test.ts` を追加 |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | SendGrid 失敗ログの `error` が `{}` になる<br>`error.message` / `String(error)` に正規化 |
| [x] | RC-3 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | `deleteUserAccount` テストが新 store を mock していない<br>cleanup 例外が握りつぶされ、状態削除を検証できない |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 送信枠の TZ を `'Asia/Tokyo'` 直書きしている<br>`DEFAULT_TIME_ZONE` を使う |

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
