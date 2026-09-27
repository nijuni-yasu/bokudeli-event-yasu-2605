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
| [ ] | RC-15 | 4101548011 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | store テスト6件は追加済み。同時 claim の競合を再現する永続テストは残る |
| [x] | RC-16 | 4101553835 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 再送の 15 分待ちが古い未読で満たされる<br>新しい未読自身が 15 分以上のときだけ送る |
| [x] | RC-17 | 4102983197 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | ユーザー切替後も挨拶案内の処理済みが残る<br>ChatApp はページ遷移で破棄される |
| [x] | RC-18 | 4102991768 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | キャンセル後の再訪で挨拶案内が出ない<br>次の注文完了遷移ではインスタンスが新しくなる |
| [x] | RC-19 | 4102983182 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 投稿履歴の取得失敗時に started を戻し、history は成功後に消費する（別作業の変更） |
| [ ] | RC-20 | 4102991653 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | release が3回失敗すると送信権が残る<br>RC-14 の期限付き claim と一緒に扱う |
| [x] | RC-21 | 4102991708 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 未読メール状態の削除失敗でチャット cleanup が止まる<br>削除失敗はログして membership 削除は続ける |
| [x] | RC-22 | 4114764531 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 送信開始時にリクエスト番号を進め、遅い取得結果による案内表示を抑止 |
| [ ] | RC-23 | 4114764534 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | scheduleTime と通知済み境界のずれ<br>ジョブ遅延で再送されうる |
| [x] | RC-24 | 4115282670 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 挨拶案内の対象ルーム固定（別作業の変更） |
| [x] | RC-25 | 4115282677 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | history state と Router の同期（別作業の変更） |
| [ ] | RC-26 | 4115142488 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX / 📑 仕様書 | 🔧 微修正 | S | 実送信直前の時間帯チェックを推奨。予定時刻基準の現仕様とは別の判断。 |

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
| [ ] | RC-15 | 4101548011 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | store テスト6件は追加済み。同時 claim の競合を再現する永続テストは残る |
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

## 評価セッション（2026-09-25 18:17・review-comments-evaluate）

- **評価日時**: 2026-09-25 18:17 JST
- **評価者**: Cursor Agent（review-comments-evaluate）
- **ブランチ名**: feat/2354
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2362
- **since**: 2026-09-25T09:04:57Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 3（依頼コメント 5829803281、Copilot 5829921970 は RC-6 と RC-12 の同一指摘、インライン 4102991738 は RC-14 の同一指摘）
- **手順 4a 自動修正**: RC-21（🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-17 | 4102983197 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | ユーザー切替後も挨拶案内の処理済みが残る<br>ChatApp はページ遷移で破棄される |
| [x] | RC-18 | 4102991768 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | キャンセル後の再訪で挨拶案内が出ない<br>次の注文完了遷移ではインスタンスが新しくなる |
| [x] | RC-19 | 4102983182 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 投稿履歴の取得失敗時に started を戻し、history は成功後に消費する（別作業の変更） |
| [ ] | RC-20 | 4102991653 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | release が3回失敗すると送信権が残る<br>RC-14 の期限付き claim と一緒に扱う |
| [x] | RC-21 | 4102991708 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 未読メール状態の削除失敗でチャット cleanup が止まる<br>削除失敗はログして membership 削除は続ける |

---

**識別子**: RC-17（GitHub id: 4102983197）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/chat/ChatApp.vue:505`

**該当コード（レビュー時点の diff）**:

```diff
  if (greetingPromptStartedRoomIds.has(roomId)) {
    return
  }
  greetingPromptStartedRoomIds.add(roomId)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ユーザー変更時に挨拶案内の処理済み状態を分離する**

同じ `ChatApp` インスタンス上で Firebase UID が切り替わり、切り替え前後のユーザーが同じイベントルームに参加している場合、この集合には前ユーザーが確認した `roomId` が残るため、後ユーザーが注文完了導線から遷移してもここで終了して挨拶案内が表示されません。実際に下部の UID watcher は下書きだけを初期化しており、この集合はリセットしていません。処理済みキーをユーザー ID とルーム ID の組にするか、UID 変更時に集合をクリアしてください。

**コメント要約**: ユーザー切替後も挨拶案内の処理済みが残る
ChatApp はページ遷移で破棄される

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: アカウント切替はチャット画面を離れる。ChatApp はアンマウントされ、処理済み集合は次の表示では空になる。

---

**識別子**: RC-18（GitHub id: 4102991768）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/chat/ChatApp.vue:505`

**該当コード（レビュー時点の diff）**:

```diff
  if (greetingPromptStartedRoomIds.has(roomId)) {
    return
  }
  greetingPromptStartedRoomIds.add(roomId)
```

**レビュワーのコメント（原文）**:

[must] `greetingPromptStartedRoomIds` はルーム ID を永続的に保持し、注文完了ダイアログから同じルームを再度開いたときにも削除されません。そのため、1回キャンセルした後に別の注文完了導線から再訪しても、未投稿・下書きなしでも案内が再表示されず、仕様の「次回は再表示してよい」に反します。遷移ごとの一意なトークンで開始済み状態を管理するか、次の注文完了遷移でこの集合をリセットしてください。

**コメント要約**: キャンセル後の再訪で挨拶案内が出ない
次の注文完了遷移ではインスタンスが新しくなる

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 集合は ChatApp のインスタンスだけが持つ。注文完了へ戻ると /chat はアンマウントされ、次の「グループチャットをひらく」は新しい history state と空の集合で案内を出せる。

---

**識別子**: RC-19（GitHub id: 4102983182）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/chat/ChatApp.vue:506`

**該当コード（レビュー時点の diff）**:

```diff
  greetingPromptStartedRoomIds.add(roomId)
  clearChatGreetingPromptState()
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Firestore 確認成功前に挨拶案内を消費しない**

この直後の `hasOwnUserChatMessage` が一時的な通信障害や Firestore エラーで失敗すると、`catch` で終了する時点では history の案内対象が既に削除され、`greetingPromptStartedRoomIds` にも対象ルームが残っています。そのため再評価もリロード後の再試行もできず、注文完了導線から来た未投稿ユーザーに挨拶案内が一度も表示されません。投稿有無の取得が成功して表示要否を確定した後に state を消費するか、失敗時には started 状態を戻して再試行可能にしてください。

**コメント要約**: 重要度は任意の案内の復旧改善。同時進行の変更で対応済み。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: HEAD 時点では取得前に history を消費しており、同じ遷移でのリロードや再判定から回復しなかった。ただしチャット送信自体は利用でき、注文完了画面からの新しい遷移なら別の history state / インスタンスになるため、「二度と出ない」は範囲が広すぎる。従来どおり改善提案と評価。今回の評価中に別作業が成功判定後の history 消費、catch 内の started 集合解除を追加した。こちらで重複修正はしていない。即時・自動でクエリを再実行する仕組みは追加されておらず、再判定やリロードで再試行可能になる変更。

---

**識別子**: RC-20（GitHub id: 4102991653）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:92`

**該当コード（レビュー時点の diff）**:

```diff
const CLAIM_RELEASE_ATTEMPTS = 3

const releaseClaim = async (userId: string, previousLastSentAt: number | undefined): Promise<void> => {
  for (let attempt = 1; attempt <= CLAIM_RELEASE_ATTEMPTS; attempt += 1) {
    try {
      await releaseChatUnreadMailSendSlot(userId, previousLastSentAt)
      return
    } catch (error) {
      if (attempt === CLAIM_RELEASE_ATTEMPTS) {
        logger.error('Failed to release chat unread mail claim', {
```

**レビュワーのコメント（原文）**:

[must] release を3回試しても失敗した場合、ここではログだけ出して正常に戻るため、claim の `last_sent_at` が残ったままです。外側の処理も失敗を再送可能な状態として扱わず終了するので、SendGrid 失敗時に release も失敗すると同一枠の再試行が抑止されます。release 失敗を回復可能なエラーとして扱うか、期限付き claim／後続の補償処理で送信権を復旧できるようにしてください。

**コメント要約**: release が3回失敗すると送信権が残る
RC-14 の期限付き claim と一緒に扱う

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 指摘は妥当。復旧には RC-14 と同じく期限付きの送信権が要る。ログを残して戻る現状のままでは再送が止まる。工数 M のため自動修正していない。

---

**識別子**: RC-21（GitHub id: 4102991708）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/deleteUserAccount.ts:24`

**該当コード（レビュー時点の diff）**:

```diff
const cleanupUserChatData = async (uid: string): Promise<void> => {
  await deleteChatUnreadMailState(uid)
  const memberships = await listChatMembershipsForUser(uid)
```

**レビュワーのコメント（原文）**:

[must] この状態削除を chat membership の cleanup より先に実行しているため、Firestore の一時的な delete 失敗で `cleanupUserChatData` 全体が throw します。呼び出し側は例外を握りつぶしてアカウント削除を続行するため、その場合は room の `member_user_ids` とユーザーの `chat_memberships` が残ります。通知状態の削除は既存のチャット cleanup と分離するか、他の cleanup を止めないよう個別に失敗隔離してください。

**コメント要約**: 未読メール状態の削除失敗でチャット cleanup が止まる
削除失敗はログして membership 削除は続ける

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 状態削除の失敗で membership 削除まで止まると、退会後にチャット参加が残る。削除だけ try/catch してログし、続きの cleanup は実行する。

---

## 評価セッション（2026-09-27 18:13・review-comments-evaluate）

- **評価日時**: 2026-09-27 18:13 JST
- **評価者**: Cursor Agent（review-comments-evaluate・auto）
- **ブランチ名**: feat/2354
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2362
- **since**: 2026-09-27T09:02:25Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5854462062、Copilot 承知返信 5854474810 内の依頼引用部分は除き同コメント本体は RC 重複として下記）
- **同一指摘のため新規 RC なし**: 5854474810 → RC-12 / RC-6 / RC-20 / RC-14 / RC-18、4114753517 → RC-19
- **手順 4a 自動修正**: なし（重複・工数 M・👤 UX ラベル付き RC-19 等）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-22 | 4114764531 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 送信開始時にリクエスト番号を進め、遅い取得結果による案内表示を抑止 |
| [ ] | RC-23 | 4114764534 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | scheduleTime と通知済み境界のずれ<br>ジョブ遅延で再送されうる |

---

**識別子**: RC-22（GitHub id: 4114764531）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/chat/ChatApp.vue:113`

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 送信可能かの検証を通過した直後に greetingPromptRequestId を進め、表示中の案内を閉じた。既存の requestId 比較で遅い取得結果を破棄できるため、新しい状態管理や再クエリは不要。変更前 HEAD から実際の sendMessage / maybeOfferGreetingPrompt を抽出した一時検証で、履歴判定 false が送信成功後に返ると案内が出ることを再現し、修正後は出ないことを確認。未投稿時の表示と送信失敗時の入力保持も確認した。

---

**識別子**: RC-23（GitHub id: 4114764534）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:267`

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: `event.scheduleTime` を境界にすると cron 遅延時に `last_sent_at` と実通知内容がずれ、同一新着が次枠で再送されうる。通知済みウォーターマークを別フィールドで持つ設計が妥当。工数 M のため自動修正していない。

---

## 評価セッション（2026-09-27 21:14・wait-ai-pr-review auto）

- **評価日時**: 2026-09-27 21:14 JST
- **PR**: #2362
- **REVIEW_REQUEST_SINCE**: 2026-09-27T12:03:47Z
- **partial**: false
- **Outdated 除外**: 0
- **レビュー非該当スキップ**: 1（依頼コメント 5855653442）
- **手順 4a 自動修正**: RC-19 / RC-24 / RC-25（🚨 1 / 🟡 2）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | 要約 |
|:----:|:---|:---|:---|:---|:---|
| [x] | RC-24 | 4115282670 | 🚨 | ✅ 対応済み | 挨拶案内の対象 roomId 固定・ルーム変更で閉じる |
| [x] | RC-25 | 4115282677 | 🟡 | ✅ 対応済み | `clearChatGreetingPromptState(router)` で Router 同期 |
| [x] | RC-19 | 4102983182 | 🟡 | ✅ 対応済み | 投稿履歴の取得失敗時に started を戻し、history は成功後に消費する（別作業の変更） |

**Copilot 5855665644**（トップレベル）: 既存 RC-6 / RC-12 / RC-14 / RC-20 / RC-22 および挨拶 `startedRoomIds` 永続化（未着手・別途 RC 化検討）への再指摘。新規 RC 採番なし。

---

**識別子**: RC-24（GitHub id: 4115282670）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/chat/ChatApp.vue:463`

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**判断理由**: `greetingPromptTargetRoomId` を案内表示時に固定し、確定時・ルーム watch で active と不一致なら閉じるよう修正。

---

**識別子**: RC-25（GitHub id: 4115282677）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/utils/chatGreetingPrompt.ts:95`

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**判断理由**: `clearChatGreetingPromptState` に optional `Router` を渡し `router.replace` で state を同期。ChatApp から `router` を渡す。

---


## 評価セッション（2026-09-27 21:16・review-comments-evaluate）

- **評価日時**: 2026-09-27 21:16 JST
- **評価者**: Codex（manual・ユーザー指定8件）
- **ブランチ名**: feat/2354
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2362
- **対象 HEAD**: 83f8dcda7ac9ff99a59cae291bb9c34395579d2c
- **Outdated 除外件数**: 0（指定8件を現コードで再評価）
- **レビュー非該当スキップ件数**: 0（今回の指定対象内）
- **手順 4a 自動修正**: RC-22（🚨 1件）。RC-19 / RC-24 / RC-25 の同時進行変更は別作業によるものとして保持。
- **既存 RC 再利用**: RC-6 / RC-14 / RC-15 / RC-18 / RC-19 / RC-20 / RC-22。送信時間帯の観点は通知済み境界を扱う RC-23 とは異なるため RC-26 を新規採番。
- **検証**: PR verify 相当の 30 項目を実行。Vitest は全6パッケージ計 1,216 件成功。途中の別作業による型エラー修正後、base lint / format / test と base / user / partner / enterprise の型チェックを再実行。挨拶競合は実コードを使う一時スクリプトで変更前の再現と変更後の解消を確認（リポジトリ内の永続テスト追加ではない）。
- **セルフレビュー範囲**: 今回の送信開始時の無効化3行。RC-24 / RC-25 の新規レビュー指摘・設計評価は今回指定の8件に含めない。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-6 | 4101547970 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | — | 📐 リファクタ | M | 同時実行数は改善推奨。負荷の実測なしにマージ必須とはしない。 |
| [ ] | RC-14 | 4102991738 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🐛 実害 | 📐 リファクタ | M | 送信前停止で、そのルームを読むまで通知が止まる。RC-20 と同じ原因。 |
| [ ] | RC-15 | 4101548011 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | store テスト6件は追加済み。同時 claim の競合を再現する永続テストは残る |
| [x] | RC-18 | 4102991768 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 注文完了導線への再訪では ChatApp が作り直される。 |
| [x] | RC-19 | 4114753517 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 投稿履歴の取得失敗時に started を戻し、history は成功後に消費する（別作業の変更） |
| [ ] | RC-20 | 4102991653 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | RC-14 と共通の復旧を優先。release 再試行回数の追加では解消しない。 |
| [x] | RC-22 | 4115142479 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 送信開始時にリクエスト番号を進め、遅い取得結果による案内表示を抑止 |
| [ ] | RC-26 | 4115142488 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX / 📑 仕様書 | 🔧 微修正 | S | 実送信直前の時間帯チェックを推奨。予定時刻基準の現仕様とは別の判断。 |

### 通知復旧の最小設計案（RC-14 / RC-20、未実装）

1. 既存 `users/{userId}/notification_states/chat_unread_mail` に、予約を識別する token と期限（例: 最大実行時間 540 秒を上回る 15 分）を持つ pending 情報を追加する。別 collection や配送キューは作らない。lease の期限は実時刻で判定する。
2. claim は pending のみをトランザクションで確保し、まだ `last_sent_at` / membership の `last_unread_mail_sent_at` は進めない。初回は成功時刻が未設定でも表現できる schema にする。
3. SendGrid の受理確認後、同じ token を保持している場合だけ成功時刻と対象 membership の通知時刻を確定して pending を解除する。既読・新着・退会後の削除を壊さない。成功記録が失敗した場合は DB 確定を再試行し、同一実行内でメールを再送しない。
4. 未送信のまま停止、または release 失敗で pending が残っても、期限切れ後の既存ジョブで再確保する。古い token で新しい予約を確定・解除できないようにする。

**判断が残る点**: SendGrid に受理された後、成功記録前にプロセスが停止した場合は、期限切れの再送で重複し得る。Firestore と SendGrid をまたぐ一度だけの配信を、この変更だけで保証することはできない。欠落からの自動復旧を優先するなら上記を採用できるが、通知頻度を減らしたい今回の目的では重複許容も確認すべき。現仕様の「成功後は追加書き込みしない」を変えるため、[自動修正ポリシー](../../.agents/skills/review-comments-evaluate/references/auto-fix-policy.md) の「仕様判断が必要（仕様書に無い挙動・要件の解釈）」に該当し、ここでは採用済みとして扱わない。フル outbox / Cloud Tasks / 汎用配送基盤までは不要。

---

**識別子**: RC-6（GitHub id: 4101547970）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:210` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4101547970)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+    }
+
+    const firstRoomName = rooms[0]?.room_name ?? CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME
+    const dynamicTemplateData = buildChatUnreadMailTemplateData({
+      userName: user.user_name,
+      rooms,
+      unreadRoomCount: sorted.length,
+      ctaUrl,
+    })
+
+    await sgMail.send({
+      to,
+      from: DEFAULT_FROM,
+      replyTo: SUPPORT_MAIL,
+      templateId: CHAT_UNREAD_MAIL_TEMPLATE_ID,
+      subject: buildChatUnreadMailSubject(sorted.length, firstRoomName),
+      dynamicTemplateData,
+      ...(CHAT_UNREAD_MAIL_ASM_GROUP_ID > 0 ? { asm: { groupId: CHAT_UNREAD_MAIL_ASM_GROUP_ID } } : {}),
+    })
+    return 'sent'
+  } catch (error) {
+    logger.error('Failed to send chat unread mail', {
+      userId,
+      error: error instanceof Error ? error.message : String(error),
+    })
+    await releaseClaim(userId, claim.previousLastSentAt)
+    return 'failed'
+  }
+}
+
+export const sendChatUnreadMails = async (nowMillis: number): Promise<void> => {
+  if (resolveChatMailSlot(nowMillis) == null) {
+    logger.info('Skip chat unread mail job', { reason: 'outside_slot' })
+    return
+  }
+
+  const rows = await listActiveUnreadChatMemberships()
+  const grouped = groupMembershipsByUserId(rows)
+  const results = await Promise.allSettled(
+    [...grouped.entries()].map(async ([userId, memberships]) => {
```

**レビュワーのコメント（原文）**:

[must] 未読ユーザー数に上限がないまま、各ユーザーの Firestore 読み取りと SendGrid 送信をすべて同時開始しています。対象者が増えるとメモリ・接続・SendGrid のレート制限や 540 秒の実行時間に達しやすく、ジョブ全体の信頼性を落とします。既存の worker パターンのように同時実行数を固定して処理してください。

**コメント要約**: 同時実行数は改善推奨。負荷の実測なしにマージ必須とはしない。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: Promise.allSettled はユーザー数分を同時開始する。maxInstances / concurrency はジョブ単位なので内部の並列数を制限しない。対象者増加時に負荷が集中する指摘は妥当。ただし、現在の対象数やレート制限発生の証拠はなく、必須扱いはしない。実装するなら既存の friendsService の小分け処理に倣い、固定数（例: 8 ユーザー）ずつ処理する程度でよい。キュー基盤の追加は不要。固定数にしても総実行時間の上限を保証するわけではない。

---

**識別子**: RC-14（GitHub id: 4102991738）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/chatUnreadMailState.ts:107` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4102991738)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+  } else {
+    transaction.set(ref, state)
+  }
+}
+
+export const deleteChatUnreadMailState = async (userId: string, transaction?: Transaction): Promise<void> => {
+  const ref = getChatUnreadMailStateRef(userId)
+  if (transaction === undefined) {
+    await ref.delete()
+  } else {
+    transaction.delete(ref)
+  }
+}
+
+export type ChatUnreadMailSendClaim =
+  | { claimed: false; reason: ChatUnreadMailSkipReason }
+  | { claimed: true; previousLastSentAt: number | undefined }
+
+/** 送信条件を再評価し、通る場合だけ `last_sent_at` を今に進めて送信権を取る */
+export const claimChatUnreadMailSendSlot = async (
+  userId: string,
+  nowMillis: number,
+  unreadMemberships: Pick<ChatMembership, 'last_message_at' | 'unread_count' | 'is_active'>[],
+): Promise<ChatUnreadMailSendClaim> => {
+  return getFirestore().runTransaction(async (transaction) => {
+    const state = await getChatUnreadMailState(userId, transaction)
+    const decision = shouldSendChatUnreadMail({
+      nowMillis,
+      lastSentAt: state?.last_sent_at,
+      unreadMemberships,
+    })
+    if (!decision.send) {
+      return { claimed: false, reason: decision.reason }
+    }
+
+    await saveChatUnreadMailState(
+      userId,
+      new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: nowMillis }),
+      transaction,
+    )
```

**レビュワーのコメント（原文）**:

[must] claim の transaction が commit された直後にプロセスが落ちると、SendGrid は未送信なのに `last_sent_at` だけが現在時刻になります。その後は同一枠で抑止されるだけでなく、既存の未読の `last_message_at` もこの時刻より新しくないため、次の枠でも再送されず通知が永久に失われます。送信中であることと有効期限を表す lease／outbox など、クラッシュ後に回復できる状態管理に変更してください。

**コメント要約**: 送信前停止で、そのルームを読むまで通知が止まる。RC-20 と同じ原因。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 📐 リファクタ

**想定工数**: M

**判断理由**: 旧コメントは last_message_at と last_sent_at の比較を説明しているが、現行でも送信前に last_unread_mail_sent_at を書くため、未送信のままそのルームの既読待ちになる。72 時間経過や新着だけでは復旧しない。先行実装の仕様 §5.7.2 で方式の限界は記載済みだが、影響は単発の通知欠落にとどまらないため優先して解消したい。RC-20 と共通の期限付き予約で扱うのが最小案。送信結果不明時の重複と欠落のどちらを許容するかが現仕様では未確定で、成功後書き込み禁止（RC-9 対応）も変更するため、仕様判断を要する自動修正対象外として設計案を下記に記載する。

---

**識別子**: RC-15（GitHub id: 4101548011）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/chatUnreadMailState.ts:87` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4101548011)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+    transaction.set(ref, state)
+  }
+}
+
+export const deleteChatUnreadMailState = async (userId: string, transaction?: Transaction): Promise<void> => {
+  const ref = getChatUnreadMailStateRef(userId)
+  if (transaction === undefined) {
+    await ref.delete()
+  } else {
+    transaction.delete(ref)
+  }
+}
+
+export type ChatUnreadMailSendClaim =
+  | { claimed: false; reason: ChatUnreadMailSkipReason }
+  | { claimed: true; previousLastSentAt: number | undefined }
+
+/** 送信条件を再評価し、通る場合だけ `last_sent_at` を今に進めて送信権を取る */
+export const claimChatUnreadMailSendSlot = async (
+  userId: string,
+  nowMillis: number,
+  unreadMemberships: Pick<ChatMembership, 'last_message_at' | 'unread_count' | 'is_active'>[],
+): Promise<ChatUnreadMailSendClaim> => {
+  return getFirestore().runTransaction(async (transaction) => {
+    const state = await getChatUnreadMailState(userId, transaction)
+    const decision = shouldSendChatUnreadMail({
+      nowMillis,
+      lastSentAt: state?.last_sent_at,
+      unreadMemberships,
+    })
+    if (!decision.send) {
+      return { claimed: false, reason: decision.reason }
+    }
+
+    await saveChatUnreadMailState(
+      userId,
+      new ChatUnreadMailState(CHAT_UNREAD_MAIL_STATE_DOC_ID, { last_sent_at: nowMillis }),
+      transaction,
+    )
+    return { claimed: true, previousLastSentAt: state?.last_sent_at }
```

**レビュワーのコメント（原文）**:

🟡 [test_coverage] 送信枠の claim/release の中心である Firestore トランザクションが、この PR ではテストされていません。`last_sent_at` が同時 claim で一度だけ進むこと、初回失敗時に state を削除し既存値を復元することは、今回の重複送信防止の不変条件なので、Firestore store のテストを追加してください。

**コメント要約**: store テスト6件は追加済み。同時 claim の競合を再現する永続テストは残る。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: aca5feb15 で chatUnreadMailState.test.ts が追加され、初回 state 削除、既存値復元、既読・新着の保持、削除済み membership 非復活、先行 claim の抑止などを検証している。「テストがない」という前提は古い。一方 runTransaction はモックで、同時トランザクションの競合・再試行自体を再現するテストではない。前回のローカル Emulator 検証はリポジトリに残る自動テストとは区別する。残りは改善提案として、期限付き予約の設計を変える際にその設計の競合・期限切れ・旧予約の遅延完了を含めて追加する。

---

**識別子**: RC-18（GitHub id: 4102991768）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/chat/ChatApp.vue:505` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4102991768)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+  }
+  const choice = pickChatGreeting(currentUserStore.user?.user_name ?? '')
+  const body = t(choice.key, choice.name != null ? { name: choice.name } : {})
+  msg.value = body
+  composeDraftStore.upsertDraft(roomId, { body, attachments: [] })
+  isGreetingPromptVisible.value = false
+  nextTick(() => {
+    composeInputRef.value?.focus()
+  })
+}
+
+const dismissGreetingPrompt = (): void => {
+  isGreetingPromptVisible.value = false
+}
+
+const maybeOfferGreetingPrompt = async (roomId: string): Promise<void> => {
+  if (readChatGreetingPromptRoomId() !== roomId) {
+    return
+  }
+  const room = store.activeRoom
+  if (room == null || room.roomId !== roomId) {
+    return
+  }
+  if (room.roomType !== 'event' || room.isReadonly === true) {
+    clearChatGreetingPromptState()
+    return
+  }
+  const userId = currentUserId.value
+  if (userId === '') {
+    return
+  }
+  const draft = composeDraftStore.getDraft(roomId)
+  if ((draft != null && !isChatComposeDraftEmpty(draft)) || !isLocalComposeEmpty()) {
+    clearChatGreetingPromptState()
+    return
+  }
+  if (greetingPromptStartedRoomIds.has(roomId)) {
+    return
+  }
+  greetingPromptStartedRoomIds.add(roomId)
```

**レビュワーのコメント（原文）**:

[must] `greetingPromptStartedRoomIds` はルーム ID を永続的に保持し、注文完了ダイアログから同じルームを再度開いたときにも削除されません。そのため、1回キャンセルした後に別の注文完了導線から再訪しても、未投稿・下書きなしでも案内が再表示されず、仕様の「次回は再表示してよい」に反します。遷移ごとの一意なトークンで開始済み状態を管理するか、次の注文完了遷移でこの集合をリセットしてください。

**コメント要約**: 注文完了導線への再訪では ChatApp が作り直される。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 集合は script setup のインスタンス変数であり、永続ストアではない。注文完了ダイアログは orders / profile 側にあり、そこへ移動してから chat に戻る。共通 layout の RouterView は Component を描画しており KeepAlive はない。したがって通常の注文完了導線では新しい集合になる。チャット内のルーム切替だけを注文完了からの再訪と同一視しない。追加の遷移トークンは不要。

---

**識別子**: RC-19（GitHub id: 4114753517）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/chat/ChatApp.vue:517` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4114753517)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+  isGreetingPromptVisible.value = false
+}
+
+const maybeOfferGreetingPrompt = async (roomId: string): Promise<void> => {
+  if (readChatGreetingPromptRoomId() !== roomId) {
+    return
+  }
+  const room = store.activeRoom
+  if (room == null || room.roomId !== roomId) {
+    return
+  }
+  if (room.roomType !== 'event' || room.isReadonly === true) {
+    clearChatGreetingPromptState()
+    return
+  }
+  const userId = currentUserId.value
+  if (userId === '') {
+    return
+  }
+  const draft = composeDraftStore.getDraft(roomId)
+  if ((draft != null && !isChatComposeDraftEmpty(draft)) || !isLocalComposeEmpty()) {
+    clearChatGreetingPromptState()
+    return
+  }
+  if (greetingPromptStartedRoomIds.has(roomId)) {
+    return
+  }
+  greetingPromptStartedRoomIds.add(roomId)
+  clearChatGreetingPromptState()
+  const requestId = ++greetingPromptRequestId
+  let hasSent: boolean
+  try {
+    hasSent = await hasOwnUserChatMessage(roomId, userId)
+  } catch (error) {
+    reportClientError(error, {
+      componentInfo: 'ChatApp.maybeOfferGreetingPrompt',
+      documentPath: `chat_rooms/${roomId}/messages`,
+      severity: 'warn',
+    })
+    return
```

**レビュワーのコメント（原文）**:

[must] `hasOwnUserChatMessage` の呼び出し前に history state を消費し、`catch` でも `greetingPromptStartedRoomIds` を残しています。一時的な Firestore 失敗が起きると、同じ注文完了導線で再試行しても対象ルームとして認識されず、未投稿ユーザーに案内が二度と出ません。取得成功後に state を消費し、失敗時は started 状態を戻して再試行可能にしてください。

**コメント要約**: 重要度は任意の案内の復旧改善。同時進行の変更で対応済み。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: HEAD 時点では取得前に history を消費しており、同じ遷移でのリロードや再判定から回復しなかった。ただしチャット送信自体は利用でき、注文完了画面からの新しい遷移なら別の history state / インスタンスになるため、「二度と出ない」は範囲が広すぎる。従来どおり改善提案と評価。今回の評価中に別作業が成功判定後の history 消費、catch 内の started 集合解除を追加した。こちらで重複修正はしていない。即時・自動でクエリを再実行する仕組みは追加されておらず、再判定やリロードで再試行可能になる変更。

---

**識別子**: RC-20（GitHub id: 4102991653）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:94` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4102991653)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+
+const resolveRoomName = async (membership: ChatMembership): Promise<string> => {
+  const room = await getChatRoom(membership.room_id)
+  const title = room?.title?.trim()
+  if (title != null && title !== '') {
+    return title
+  }
+
+  if (membership.room_type === 'event' && membership.community_id != null && membership.event_id != null) {
+    const event = await getEventInCommunity(membership.community_id, membership.event_id)
+    const eventName = event?.event_name?.trim()
+    if (eventName != null && eventName !== '') {
+      return eventName
+    }
+  }
+
+  if (membership.community_id != null && membership.community_id !== '') {
+    const community = await getCommunity(membership.community_id)
+    const communityName = community?.community_name?.trim()
+    if (communityName != null && communityName !== '') {
+      return communityName
+    }
+  }
+
+  return CHAT_UNREAD_MAIL_FALLBACK_ROOM_NAME
+}
+
+const CLAIM_RELEASE_ATTEMPTS = 3
+
+const releaseClaim = async (userId: string, previousLastSentAt: number | undefined): Promise<void> => {
+  for (let attempt = 1; attempt <= CLAIM_RELEASE_ATTEMPTS; attempt += 1) {
+    try {
+      await releaseChatUnreadMailSendSlot(userId, previousLastSentAt)
+      return
+    } catch (error) {
+      if (attempt === CLAIM_RELEASE_ATTEMPTS) {
+        logger.error('Failed to release chat unread mail claim', {
+          userId,
+          error: error instanceof Error ? error.message : String(error),
+        })
```

**レビュワーのコメント（原文）**:

[must] release を3回試しても失敗した場合、ここではログだけ出して正常に戻るため、claim の `last_sent_at` が残ったままです。外側の処理も失敗を再送可能な状態として扱わず終了するので、SendGrid 失敗時に release も失敗すると同一枠の再試行が抑止されます。release 失敗を回復可能なエラーとして扱うか、期限付き claim／後続の補償処理で送信権を復旧できるようにしてください。

**コメント要約**: RC-14 と共通の復旧を優先。release 再試行回数の追加では解消しない。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: SendGrid 失敗後、release が 3 回とも失敗すると、通知済みの時刻が残る。現行では同一枠だけでなく、そのルームを読むまで抑止される。例外を上へ投げるだけでは保存済み状態を修復できない。従来の評価は維持するが、対応の優先度は RC-14 と一体で高い。別々の補償基盤は作らず、期限付きの送信予約へまとめる。送信結果不明時の扱いの判断を先に要する。

---

**識別子**: RC-22（GitHub id: 4115142479）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/chat/ChatApp.vue:510` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4115142479)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+  isGreetingPromptVisible.value = false
+  nextTick(() => {
+    composeInputRef.value?.focus()
+  })
+}
+
+const dismissGreetingPrompt = (): void => {
+  isGreetingPromptVisible.value = false
+}
+
+const maybeOfferGreetingPrompt = async (roomId: string): Promise<void> => {
+  if (readChatGreetingPromptRoomId() !== roomId) {
+    return
+  }
+  const room = store.activeRoom
+  if (room == null || room.roomId !== roomId) {
+    return
+  }
+  if (room.roomType !== 'event' || room.isReadonly === true) {
+    clearChatGreetingPromptState()
+    return
+  }
+  const userId = currentUserId.value
+  if (userId === '') {
+    return
+  }
+  const draft = composeDraftStore.getDraft(roomId)
+  if ((draft != null && !isChatComposeDraftEmpty(draft)) || !isLocalComposeEmpty()) {
+    clearChatGreetingPromptState()
+    return
+  }
+  if (greetingPromptStartedRoomIds.has(roomId)) {
+    return
+  }
+  greetingPromptStartedRoomIds.add(roomId)
+  clearChatGreetingPromptState()
+  const requestId = ++greetingPromptRequestId
+  let hasSent: boolean
+  try {
+    hasSent = await hasOwnUserChatMessage(roomId, userId)
```

**レビュワーのコメント（原文）**:

[must] `hasOwnUserChatMessage` は非同期なので、この処理中にユーザーが挨拶を送信すると、最初の取得が `false` のまま完了し、送信後に入力欄が空へ戻った時点で案内が表示されます。注文完了導線の「未送信時のみ」に反するため、表示直前に自分の投稿を再検証するか、送信開始・成功時にこのリクエストを無効化してください。

**コメント要約**: 送信開始時に確認リクエストを無効化する3行の修正。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 送信可能かの検証を通過した直後に greetingPromptRequestId を進め、表示中の案内を閉じた。既存の requestId 比較で遅い取得結果を破棄できるため、新しい状態管理や再クエリは不要。変更前 HEAD から実際の sendMessage / maybeOfferGreetingPrompt を抽出した一時検証で、履歴判定 false が送信成功後に返ると案内が出ることを再現し、修正後は出ないことを確認。未投稿時の表示と送信失敗時の入力保持も確認した。

---

**識別子**: RC-26（GitHub id: 4115142488）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/chatUnreadMail.ts:274` — [コメント](https://github.com/nijuniinc/bokudeli-event-new/pull/2362#discussion_r4115142488)

**該当コード（レビュー時点の diff）**: （末尾40行抜粋）

```diff
+    } else {
+      skippedCount += 1
+    }
+  }
+
+  if (failedCount > 0) {
+    logger.warn('Failed to send chat unread mail', {
+      successCount: sentCount,
+      failedCount,
+      skippedCount,
+      totalUsers: grouped.size,
+    })
+    return
+  }
+
+  logger.info('Chat unread mail job finished', {
+    successCount: sentCount,
+    skippedCount,
+    totalUsers: grouped.size,
+  })
+}
+
+export const chatUnreadMail = onSchedule(
+  {
+    schedule: '*/5 * * * *',
+    timeZone: CHAT_UNREAD_MAIL_TIME_ZONE,
+    region: 'asia-northeast1',
+    secrets: ['SENDGRID_API_KEY'],
+    memory: '1GiB',
+    timeoutSeconds: 540,
+    maxInstances: 1,
+    concurrency: 1,
+  },
+  async (event) => {
+    if (!isChatUnreadMailDeliveryConfigured()) {
+      logger.warn('Chat unread mail delivery is not configured')
+      return
+    }
+    const nowMillis = DateTime.fromISO(event.scheduleTime, { zone: CHAT_UNREAD_MAIL_TIME_ZONE }).toMillis()
+    await sendChatUnreadMails(nowMillis)
```

**レビュワーのコメント（原文）**:

[imo] `event.scheduleTime` はジョブの予定時刻なので、11:55 の実行が遅延して12:00以降に実際の送信を行う場合でも morning と判定され、許可時間帯外にメールが届きます。実際の実行時刻とのずれを検知して古いイベントをスキップするなど、遅延時に枠外送信しない扱いを追加してください。

**コメント要約**: 実送信直前の時間帯チェックを推奨。予定時刻基準の現仕様とは別の判断。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX / 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 予定時刻が 11:55 / 22:55 のジョブが遅れれば、12:00 / 23:00 を過ぎて送信できる。実害の指摘は妥当。ただし現仕様 §5.7.2 は scheduleTime で枠を決めると明記しており、実装がその明示ルールに反しているわけではないため、必須ではなく改善推奨。最小案は判定用 scheduleTime を維持しつつ、SendGrid 呼び出し直前に実時刻で枠外を検知して release + skip する。ジョブ開始時のチェックだけでは本文生成中の越境を防げない。実際の受信時刻はメール配送の遅延もあるため保証対象は送信 API の呼び出し時刻とする。この仕様の補足とテストを一緒に更新する。

