# ブランチ feat/2366 レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション説明の表示判定が falsy<br>`!= null` と空文字で判定する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 説明クリア時に merge で旧値が残る<br>`setDoc` を全置換にする |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | PartnerOption が utils を import する<br>重複判定を schema 側へ移す |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | options / menu 新フィールドの Rules テストが無い<br>`partnerOptions.test.ts` を追加する |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション削除時にメニュー更新を逐次 await する<br>`Promise.all` で並列化する |
| [x] | RC-6 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | アレルギーとバッジの重複を拒否していない<br>スキーマと Rules で一意にする |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 金額差分の範囲外入力にエラーが出ない<br>整数範囲の rules を付ける |
| [x] | RC-8 | 5833215861 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | オプション未読込と保存失敗でメニューが消える<br>未読込は拒否し、成功時だけダイアログを閉じる |
| [x] | RC-9 | 4104985390 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | option_ids の重複で差額が二重になる<br>スキーマで一意にする |
| [x] | RC-10 | 4104985456 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | item_id の重複で差額が二重になる<br>項目 ID をスキーマで一意にする |
| [ ] | RC-11 | 4104985498 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 存在しない option_id を黙って捨てる<br>欠落メニューの扱いを仕様で決めてから直す |
| [x] | RC-12 | 4104985534 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 🔒 セキュリティ | 🔧 微修正 | S | Rules が option_ids の型と重複を見ない<br>文字列かつ一意にする |
| [x] | RC-13 | 4104985569 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | is_vegan / is_halal の型を Rules が見ない<br>bool 以外を拒否する |
| [x] | RC-14 | 4104985599 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | option_items の中身を Rules で検証してほしい<br>仕様 5.3 は Rules の対象外 |
| [x] | RC-15 | 4104985632 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | メニュー未読込のままオプションを消せる<br>読込完了まで削除しない |
| [x] | RC-16 | 4104985666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | オプション欄にメニュー名が重複する<br>項目名だけを出す |
| [x] | RC-17 | 4105006874 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | オプション編集で既存メニューが 1 円未満になる<br>参照メニューの最小合計を保存前に見る |
| [x] | RC-18 | 4105006882 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 詳細のオプション欄がメニュー名付きになる<br>項目名だけを出す |
| [ ] | RC-19 | 4105006888 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe 明細が 100 件を超えると決済できない<br>上限の扱いを仕様で決める |
| [x] | RC-20 | 4105006894 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | Rules が option_ids の重複を許す<br>RC-12 と同じく一意にする |
| [x] | RC-21 | 5318264543 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書が未実装のまま<br>Phase 1 実装済みに更新する |
| [x] | RC-22 | 5324935902 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存のインライン指摘の再掲<br>個別 RC で扱う |
| [x] | RC-23 | 4110466923 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items が配列以外だと 500 になる<br>配列と要素を見て invalid-argument にする |
| [x] | RC-24 | 4110466941 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 区切り文字を含む ID でまとめキーが衝突する<br>選択の組を JSON にして境界を固定する |
| [x] | RC-25 | 5844335856 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は RC-11 と RC-19 の再掲<br>個別 RC で扱う |
| [x] | RC-26 | 4110615850 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | S | オプション未取得を空配列にしている<br>再生成では読込完了まで保存しない |
| [x] | RC-27 | 4110615817 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 🔧 微修正 | S | option_description の型と長さを Rules が見ない<br>存在時は 200 文字以下の文字列にする |
| [x] | RC-28 | 4110615872 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション設定へのリンクがパス直書き<br>getOptionsPath を使う |

---

## 評価セッション（2026-09-25 21:46・shokujii-code-review）

- **評価日時**: 2026-09-25 21:46 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **新規 RC**: RC-1〜RC-5
- **手順 3a / 3b 自動修正**: RC-2（🚨 1件）、RC-1 / RC-3 / RC-4 / RC-5（🟡 4件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション説明の表示判定が falsy<br>`!= null` と空文字で判定する |
| [x] | RC-2 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 説明クリア時に merge で旧値が残る<br>`setDoc` を全置換にする |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | PartnerOption が utils を import する<br>重複判定を schema 側へ移す |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | options / menu 新フィールドの Rules テストが無い<br>`partnerOptions.test.ts` を追加する |
| [x] | RC-5 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション削除時にメニュー更新を逐次 await する<br>`Promise.all` で並列化する |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventCartDialog.vue:245`

**該当コード（レビュー時点の diff）**:

```diff
+          <p v-if="option.option_description" class="text-caption text-medium-emphasis mb-2">
+            {{ option.option_description }}
+          </p>
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: オプション説明の表示判定が `v-if="option.option_description"` の falsy チェックになっている → `option.option_description != null && option.option_description !== ''` で判定する

**コメント要約**: オプション説明の表示判定が falsy。
`!= null` と空文字で判定する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 文字列の falsy 判定はチェックリスト禁止。空文字と未設定を明示比較する修正方針は一意。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/stores/partner.ts:277`

**該当コード（レビュー時点の diff）**:

```diff
+    const updateOption = async (data: BokudeliPartnerOption) => {
+      const optionRef = getPartnerOptionRef(partnerId, data.option_id)
+      return await setDoc(optionRef, data, { merge: true })
+    }
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: `convertToDb` は空の `option_description` を省略するが `setDoc(..., { merge: true })` のため、説明を消しても Firestore の旧値が残る → `setDoc(optionRef, data)` でドキュメント全体を書き戻す

**コメント要約**: 説明クリア時に merge で旧値が残る。
`setDoc` を全置換にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 省略フィールドが merge で残ると編集結果と DB が食い違う。新規コレクションなので全置換でよい。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `common/src/schemas/PartnerOption.ts:4`

**該当コード（レビュー時点の diff）**:

```diff
+import { OptionItemSchema, OptionSelectionSchema } from './menuOption.js'
+import { hasDuplicateOptionItemNames } from '../utils/menuOption.js'
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `PartnerOption` スキーマが `utils/menuOption` を import しており schema → util の層が逆転する → 重複名判定を `schemas/menuOption.ts` に置き、schema は schema 内だけを参照する

**コメント要約**: PartnerOption が utils を import する。
重複判定を schema 側へ移す。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 循環依存の芽になる。関数は純粋で schema 側へ移せる。utils からは再 export して UI の import を維持した。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `firestore.rules:249`

**該当コード（レビュー時点の diff）**:

```diff
+            function isValidAllergenList(value) {
+                return value is list
+                    && value.size() <= 8
+                    && value.hasOnly(['ebi', 'kani', 'kurumi', 'komugi', 'soba', 'tamago', 'milk', 'peanuts']);
+            }
+            function optionWriteFieldsValid() {
+                return request.resource.data.option_name is string
+                    && request.resource.data.option_name.size() >= 1
+                    && request.resource.data.option_items is list
+                    && request.resource.data.option_items.size() >= 1
+                    && request.resource.data.option_items.size() <= 20;
+            }
             match /options/{option} {
                 allow read: if true
-                allow create, update, delete: if request.auth != null && request.auth.uid == partner_id
+                allow create, update: if request.auth != null && request.auth.uid == partner_id && optionWriteFieldsValid()
+                allow delete: if request.auth != null && request.auth.uid == partner_id
             }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `firestore.rules` に options / allergens / badges の書き込み制約を足したが `tests/firestore-rules` が無い → 自店舗許可・他店舗拒否・空名拒否・allergens 不正拒否のテストを追加する

**コメント要約**: options / menu 新フィールドの Rules テストが無い。
`partnerOptions.test.ts` を追加する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: チェックリストは Rules 変更時のテスト追加を求める。許可/拒否の方針は一意で、emulator で 9 件 pass を確認した。

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `partner/src/pages/menu.vue:116`

**該当コード（レビュー時点の diff）**:

```diff
+    const attachedMenus = menus.value.filter((menu) => (menu.option_ids ?? []).includes(option.option_id))
+    for (const menu of attachedMenus) {
+      const next = new BokudeliPartnerMenu(partnerId, menu.menu_id, {
+        ...menu,
+        option_ids: (menu.option_ids ?? []).filter((id) => id !== option.option_id),
+      })
+      await partnerStore.updateMenu(next)
+    }
+    await partnerStore.deleteOption(option.option_id)
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: オプション削除時に付与先メニューの `updateMenu` をループ内で逐次 `await` している → `Promise.all` で並列化する

**コメント要約**: オプション削除時にメニュー更新を逐次 await する。
`Promise.all` で並列化する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: チェックリストは Firestore write の逐次 await を避ける。メニュー同士に順序依存は無い。

---

## 評価セッション（2026-09-25 22:00・shokujii-code-review）

- **評価日時**: 2026-09-25 22:00 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: 未作成
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **新規 RC**: RC-6〜RC-7
- **手順 3a / 3b 自動修正**: RC-6 / RC-7（🟡 2件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-6 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | アレルギーとバッジの重複を拒否していない<br>スキーマと Rules で一意にする |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 金額差分の範囲外入力にエラーが出ない<br>整数範囲の rules を付ける |

---

**識別子**: RC-6（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `firestore.rules:249`

**該当コード（レビュー時点の diff）**:

```diff
+            function isValidAllergenList(value) {
+                return value is list
+                    && value.size() <= 8
+                    && value.hasOnly(['ebi', 'kani', 'kurumi', 'komugi', 'soba', 'tamago', 'milk', 'peanuts']);
+            }
+            function isValidBadgeList(value) {
+                return value is list
+                    && value.size() <= 3
+                    && value.hasOnly(['recommended', 'new', 'limited']);
+            }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 仕様はアレルギーとバッジを重複なしとしているが、Zod 配列と Rules の `hasOnly` は同一値の重複を通す → リストスキーマで一意にし、Rules は `toSet().size()` と一致させる

**コメント要約**: アレルギーとバッジの重複を拒否していない。
スキーマと Rules で一意にする。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 5.1 の「重複なし」に対し、クライアントと Rules の両方が重複を保存できた。`MenuAllergenListSchema` / `MenuBadgeListSchema` と Rules の集合サイズ比較で拒否する方針は一意。

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `partner/src/components/OptionEditCard.vue:91`

**該当コード（レビュー時点の diff）**:

```diff
+            <v-text-field
+              v-model.number="item.price_delta"
+              type="number"
+              :label="$t('option_edit_card.price_delta')"
+              :min="PRICE_DELTA_MIN"
+              :max="PRICE_DELTA_MAX"
+              density="compact"
+            />
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 金額差分の入力欄に rules が無く、小数や範囲外でも項目エラーが出ず保存ボタンだけ無効になる → `-100000〜100000` の整数ルールを付ける

**コメント要約**: 金額差分の範囲外入力にエラーが出ない。
整数範囲の rules を付ける。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `isValidForDatabase` で保存は止まるが、入力欄に理由が出ない。整数範囲のバリデーションを足す方針は一意。

---

## 評価セッション（2026-09-25 22:35・review-comments-evaluate）

- **評価日時**: 2026-09-25 22:35 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-25T13:20:41Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5833087357、Codex 状態サマリ 5833088440）
- **新規 RC**: RC-8〜RC-21
- **手順 4a 自動修正**: RC-8, RC-9, RC-10, RC-12, RC-13, RC-15, RC-16, RC-17, RC-18, RC-20, RC-21
- **未着手**: RC-11, RC-19

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-8 | 5833215861 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | オプション未読込と保存失敗でメニューが消える<br>未読込は拒否し、成功時だけダイアログを閉じる |
| [x] | RC-9 | 4104985390 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | option_ids の重複で差額が二重になる<br>スキーマで一意にする |
| [x] | RC-10 | 4104985456 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | item_id の重複で差額が二重になる<br>項目 ID をスキーマで一意にする |
| [ ] | RC-11 | 4104985498 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 存在しない option_id を黙って捨てる<br>欠落メニューの扱いを仕様で決めてから直す |
| [x] | RC-12 | 4104985534 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 🔒 セキュリティ | 🔧 微修正 | S | Rules が option_ids の型と重複を見ない<br>文字列かつ一意にする |
| [x] | RC-13 | 4104985569 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | is_vegan / is_halal の型を Rules が見ない<br>bool 以外を拒否する |
| [x] | RC-14 | 4104985599 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | option_items の中身を Rules で検証してほしい<br>仕様 5.3 は Rules の対象外 |
| [x] | RC-15 | 4104985632 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | メニュー未読込のままオプションを消せる<br>読込完了まで削除しない |
| [x] | RC-16 | 4104985666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | オプション欄にメニュー名が重複する<br>項目名だけを出す |
| [x] | RC-17 | 4105006874 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | オプション編集で既存メニューが 1 円未満になる<br>参照メニューの最小合計を保存前に見る |
| [x] | RC-18 | 4105006882 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 詳細のオプション欄がメニュー名付きになる<br>項目名だけを出す |
| [ ] | RC-19 | 4105006888 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe 明細が 100 件を超えると決済できない<br>上限の扱いを仕様で決める |
| [x] | RC-20 | 4105006894 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | Rules が option_ids の重複を許す<br>RC-12 と同じく一意にする |
| [x] | RC-21 | 5318264543 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書が未実装のまま<br>Phase 1 実装済みに更新する |

---

**識別子**: RC-8（GitHub id: 5833215861）

**レビュワー**: Copilot

**指摘箇所**: PR コメント

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

差分を確認しました。主な指摘は 3 点です。
1. options 未読込時に最小合計チェックをすり抜け、本来保存すべきでないメニューが承認時スナップショットで落ちます。
2. firestore.rules が option_ids の重複や option_items の shape を十分に検証しておらず、不正データを保存できます。
3. メニュー保存失敗時でもダイアログが閉じ、入力内容が失われます。

**コメント要約**: オプション未読込と保存失敗でメニューが消える。
未読込は拒否し、成功時だけダイアログを閉じる。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 未読込を空配列扱いすると最小合計を過小評価する。保存は options の購読完了後に限り、ダイアログは保存成功時だけ閉じる。option_items の Rules 全面検証は RC-14 で仕様対象外。

---

**識別子**: RC-9（GitHub id: 4104985390）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/PartnerMenu.ts:26`

**該当コード（レビュー時点の diff）**: （option_ids は配列長のみ）

**レビュワーのコメント（原文）**:

[must] option_ids は配列長しか検証しておらず、同じオプション ID の重複を許しています。重複したメニューをスナップショットすると同じ定義が複数回入り、カート検証後の selected_options と差額が二重になります。App/Db スキーマと Rules で一意性を保証してください。

**コメント要約**: option_ids の重複で差額が二重になる。
スキーマで一意にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同一 ID が二度入ると price_delta が二重加算される。OptionIdListSchema で一意にした。Rules は RC-12。

---

**識別子**: RC-10（GitHub id: 4104985456）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/menuOption.ts:32`

**該当コード（レビュー時点の diff）**: （OptionItemSchema は item_id の一意性なし）

**レビュワーのコメント（原文）**:

[must] OptionItemSchema では item_id の重複を検証していません。重複した項目定義を許すと、buildSelectedOptionsInDefinitionOrder が同じ選択を複数回生成し、price_delta と menu_price を二重計上できます。項目 ID の一意性をスキーマと Rules の両方で拒否してください。

**コメント要約**: item_id の重複で差額が二重になる。
項目 ID をスキーマで一意にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: スキーマで item_id を一意にした。ネストした option_items の Rules 全面検証は仕様 5.3 で対象外（RC-14）。

---

**識別子**: RC-11（GitHub id: 4104985498）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/menuOption.ts:226`

**該当コード（レビュー時点の diff）**: （存在しない option_id を flatMap で捨てる）

**レビュワーのコメント（原文）**:

[must] 存在しない option_id を flatMap で黙って捨てるため、削除済み・不整合なオプションを参照するメニューが EventMenu にコピーされます。必須オプションの定義まで消えて、参加者は本体価格のまま注文できるため、欠落を検出したメニューはスナップショット対象外にするなど明示的に失敗させてください。

**コメント要約**: 存在しない option_id を黙って捨てる。
欠落メニューの扱いを仕様で決めてから直す。

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 欠落時にメニューごと落とすか承認を失敗させるかは仕様に無く、自動修正すると注文可否が変わる。仕様判断が必要なため未着手。

---

**識別子**: RC-12（GitHub id: 4104985534）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:263`

**該当コード（レビュー時点の diff）**: （option_ids は list と件数のみ）

**レビュワーのコメント（原文）**:

[must] option_ids は list と件数しか検証していないため、数値や同じ ID の重複が Rules を通ります。要素を non-empty string として検証し、重複も拒否するよう schema と Rules を揃えてください。

**コメント要約**: Rules が option_ids の型と重複を見ない。
文字列かつ一意にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: toSet と各要素の non-empty string を Rules に追加した。

---

**識別子**: RC-13（GitHub id: 4104985569）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:265`

**該当コード（レビュー時点の diff）**: （is_vegan / is_halal の型検証なし）

**レビュワーのコメント（原文）**:

[must] PartnerMenu に追加した is_vegan / is_halal は Zod では boolean ですが、ここでは型を検証していません。直接書き込みで文字列などを保存でき、メニュー converter が読み込み時に失敗してメニューが表示・承認対象から消えます。両フィールドが存在する場合の boolean 検証を追加してください。

**コメント要約**: is_vegan / is_halal の型を Rules が見ない。
bool 以外を拒否する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 不正型で読込が落ちる。存在する場合だけ bool を要求する方針は一意。評価は必須の金銭バグではないため 🟡。

---

**識別子**: RC-14（GitHub id: 4104985599）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:275`

**該当コード（レビュー時点の diff）**: （option_items は件数のみ）

**レビュワーのコメント（原文）**:

[must] option_items は list で件数が範囲内であることしか検証されていません。直接書き込まれた空の name、範囲外の price_delta、不正な item_id などが保存でき、PartnerOption の converter が読み込み時に例外を投げて承認処理や options の購読を壊します。各項目の型・範囲・重複を Rules 側でも拒否するか、検証済みの Callable 経由だけに制限してください。

**コメント要約**: option_items の中身を Rules で検証してほしい。
仕様 5.3 は Rules の対象外。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 仕様 5.3 は金額と項目の組み合わせ検査をクライアント Zod、承認スナップショット、addToCart に置き、Rules だけでは全組み合わせを見ない。item_id の一意性はスキーマ側（RC-10）で拒否する。

---

**識別子**: RC-15（GitHub id: 4104985632）

**レビュワー**: Copilot

**指摘箇所**: `partner/src/pages/menu.vue:116`

**該当コード（レビュー時点の diff）**: （menus 未取得を空配列扱い）

**レビュワーのコメント（原文）**:

[must] menus の初期値は null ですが、ここでは未取得を [] と同じに扱っています。メニュー購読が完了する前に削除すると attachedMenus が空のままオプションだけが削除され、後から読み込まれたメニューに stale な option_ids が残ります。ロード完了を確認してから削除するか、参照解除と削除をサーバー側で原子的に処理してください。

**コメント要約**: メニュー未読込のままオプションを消せる。
読込完了まで削除しない。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 未読込時は削除しない。サーバー側の原子化は今回の範囲を超える。

---

**識別子**: RC-16（GitHub id: 4104985666）

**レビュワー**: Copilot

**指摘箇所**: `support/src/pages/orders/index.vue:278`

**該当コード（レビュー時点の diff）**: （オプション欄に formatOrderMenuDisplayName）

**レビュワーのコメント（原文）**:

[must] 「オプション」欄なのに formatOrderMenuDisplayName を使っているため、値がメニュー名まで重複表示されます。CSV と同じ formatSelectedOptionItemNames を使い、項目名だけを表示してください。

**コメント要約**: オプション欄にメニュー名が重複する。
項目名だけを出す。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: タイトルがすでに表示名なので、欄は項目名だけにする。表示バグであり決済額は変わらないため 🟡。

---

**識別子**: RC-17（GitHub id: 4105006874）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `partner/src/pages/menu.vue:100`

**該当コード（レビュー時点の diff）**: （オプション保存は単体スキーマのみ）

**レビュワーのコメント（原文）**:

参照中メニューを無効にするオプション編集を拒否する。既存メニューがこのオプションを参照している状態で price_delta を大きな負値へ編集すると、オプション単体のスキーマだけを検証して保存するため、合計額が 1 円未満になる既存メニューを作れてしまいます。保存前に、このオプションを参照する全メニューの最小合計も再検証し、無効になる編集を拒否してください。

**コメント要約**: オプション編集で既存メニューが 1 円未満になる。
参照メニューの最小合計を保存前に見る。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 1.2 は 1 円未満の組み合わせを保存不可としている。参照メニューを再計算して拒否する。

---

**識別子**: RC-18（GitHub id: 4105006882）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `support/src/pages/orders/index.vue:278`

**該当コード（レビュー時点の diff）**: （RC-16 と同じ）

**レビュワーのコメント（原文）**:

オプション欄には選択項目名だけを表示する。オプション付き注文を詳細ドロワーで開くと、この欄にも formatOrderMenuDisplayName を使うためメニュー名まで再表示されます。formatSelectedOptionItemNames を使って項目名だけを表示してください。

**コメント要約**: 詳細のオプション欄がメニュー名付きになる。
項目名だけを出す。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-16 と同じ修正で解消する。

---

**識別子**: RC-19（GitHub id: 4105006888）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `functions/default/src/utils/enterpriseSubsidyOrders.ts:454`

**該当コード（レビュー時点の diff）**: （まとめキーに選択を含めた）

**レビュワーのコメント（原文）**:

100件を超える Stripe 明細を事前に拒否する。同じメニューでもオプションの組み合わせごとに別キーとなったため、利用者が101種類の組み合わせをカートへ追加すると line_items が101個になる。payment mode は最大100件のため Checkout が必ず失敗する。カート追加時またはセッション作成前に制限し、利用者向けエラーを返してください。

**コメント要約**: Stripe 明細が 100 件を超えると決済できない。
上限の扱いを仕様で決める。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 上限の置き場所（カート追加か決済前か）と文言が仕様に無い。自動修正すると注文導線の仕様追加になる。

---

**識別子**: RC-20（GitHub id: 4105006894）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `firestore.rules:263`

**該当コード（レビュー時点の diff）**: （RC-12 と同じ）

**レビュワーのコメント（原文）**:

option_ids の重複を保存時に拒否する。リスト型と10件以下であることしか検証されないため重複を保存できる。snapshot で同じ定義が2回コピーされ price_delta が二重加算される。Zod と Rules の両方で一意性を検証してください。

**コメント要約**: Rules が option_ids の重複を許す。
RC-12 と同じく一意にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-9 と RC-12 の修正でスキーマと Rules の両方を一意にした。

---

**識別子**: RC-21（GitHub id: 5318264543）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `documents/04_飲食店向け/02_オプションメニュー.md:3`

**該当コード（レビュー時点の diff）**: （ステータスが未実装）

**レビュワーのコメント（原文）**:

実装状況を Phase 1 実装済みに更新する。このコミットではオプションのスキーマ、編集UI、注文、決済、表示まで Phase 1 の実装を同時に追加していますが、仕様書の先頭は引き続き未実装と断定しています。実装済みの範囲と未実装の後続フェーズが区別できるステータスへ更新してください。

**コメント要約**: 仕様書が未実装のまま。
Phase 1 実装済みに更新する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 先頭ステータスを Phase 1 実装済みにし、メニューリストと業態は Phase 2 と分けた。

---

## 評価セッション（2026-09-26 15:40・review-comments-evaluate）

- **評価日時**: 2026-09-26 15:40 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-26T06:30:00Z
- **partial**: true（wake。Codex は問題なしサマリ 5843938408 を投稿済みで、limits ではない）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5843910222、Codex 問題なし 5843938408）
- **同一指摘のため採番しない**: 5843922372（RC-11 と RC-14）、4110466957（RC-19）
- **新規 RC**: RC-22〜RC-24
- **手順 4a 自動修正**: RC-23, RC-24（🚨 2件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-22 | 5324935902 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存のインライン指摘の再掲<br>個別 RC で扱う |
| [x] | RC-23 | 4110466923 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items が配列以外だと 500 になる<br>配列と要素を見て invalid-argument にする |
| [x] | RC-24 | 4110466941 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 区切り文字を含む ID でまとめキーが衝突する<br>選択の組を JSON にして境界を固定する |

---

**識別子**: RC-22（GitHub id: 5324935902）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR レビュー概要

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Unresolved must-fix findings remain in input validation, option snapshot/key handling, loading guards, Rules validation, and Stripe line-item limits.

**Review effort:** Lite  
**Findings:** 4 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (5)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [区切り文字連結による選択キー衝突](#discussion_r4110466941) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [存在しないoption_idを検出してスナップショットを失敗させる](#discussion_r4104985498)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Stripe明細上限超過時の制御されたエラー処理がない](#discussion_r4110466957) · New
</details>

<details>
<summary><strong>Resolved since last review (6)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [is_veganとis_halalのboolean型をRulesで検証する](#discussion_r4104985569)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_idsの要素型と重複をスキーマおよびRulesで検証する](#discussion_r4104985534)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [OptionItemSchemaでitem_idの重複を拒否する](#discussion_r4104985456)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_idsの重複をスキーマとRulesで拒否する](#discussion_r4104985390)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [オプション表示に項目名のみのフォーマッターを使用する](#discussion_r4104985666)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [メニュー読込完了前の削除によるstale参照を防止する](#discussion_r4104985632)
</details>

**コメント要約**: 概要は既存のインライン指摘の再掲。
個別 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 概要は入力検証、まとめキー、Rules、Stripe 上限を再掲している。新規の修正指示はインライン側にあり、ここでは採番だけ残す。

---

**識別子**: RC-23（GitHub id: 4110466923）

**レビュワー**: Copilot

**指摘箇所**: `common/src/apis/order.ts:4`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,7 +1,14 @@
+export type AddToCartMenuRequest = {
+  menu_id: string
+  count: number
+  selected_items?: { option_id: string; item_id: string }[]
```

**レビュワーのコメント（原文）**:

[must] これは型定義だけで、Callable の `request.data` は実行時検証されないまま `selected_items` が `resolveEventMenuCartOrder` に渡されます。外部から配列以外（例: オブジェクト）を送ると `validateCartOptionSelection` の反復で TypeError になり、入力エラーではなく Functions 500 になります。Callable 境界で配列と各要素を検証して `invalid-argument` に変換してください。

**コメント要約**: selected_items が配列以外だと 500 になる。
配列と要素を見て invalid-argument にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 型だけでは実行時の形を保証しない。`resolveEventMenuCartOrder` で配列と各要素の文字列 ID を見て、不正なら invalid-argument を返す。

---

**識別子**: RC-24（GitHub id: 4110466941）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/menuOption.ts:71`

**該当コード（レビュー時点の diff）**:

```diff
+  const selectedPart = selected.map((item) => `${item.option_id}:${item.item_id}`).join(',')
+  return `${order.menu_id}\u0000${selectedPart}\u0000${order.menu_price}`
```

**レビュワーのコメント（原文）**:

[must] まとめキーを `:` と `,` の連結で作っているため、スキーマ上許可されている ID に区切り文字が含まれると異なる選択が同じキーになります（例: `item_id = "b,c:d"` と `item_id = "b"` + 別項目 `c:d`）。その場合、注文・請求・Stripe 明細が別の選択を同じ行へ集約します。区切り文字をエスケープするか、配列を `JSON.stringify` するなど、要素境界が曖昧にならない形式にしてください。

**コメント要約**: 区切り文字を含む ID でまとめキーが衝突する。
選択の組を JSON にして境界を固定する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: スキーマは ID に区切り文字を許す。選択の組を JSON 配列にして、別の選択が同じキーにならないようにした。

---

---

## 評価セッション（2026-09-26 16:50・review-comments-evaluate）

- **評価日時**: 2026-09-26 16:50 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-26T07:39:09Z
- **partial**: true（wake。Codex は問題なしサマリ 5844355070 を投稿済みで、limits ではない）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5844324763、Codex 問題なし 5844355070）
- **新規 RC**: RC-25〜RC-28
- **手順 4a 自動修正**: RC-26, RC-27（🚨 2件）、RC-28（🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-25 | 5844335856 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は RC-11 と RC-19 の再掲<br>個別 RC で扱う |
| [x] | RC-26 | 4110615850 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | S | オプション未取得を空配列にしている<br>再生成では読込完了まで保存しない |
| [x] | RC-27 | 4110615817 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 🔧 微修正 | S | option_description の型と長さを Rules が見ない<br>存在時は 200 文字以下の文字列にする |
| [x] | RC-28 | 4110615872 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション設定へのリンクがパス直書き<br>getOptionsPath を使う |

---

**識別子**: RC-25（GitHub id: 5844335856）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

レビューしました。現時点の差分では新規の追加指摘はなく、未解決の必須修正は次の 2 点です。

- 🚨 `common/src/utils/menuOption.ts:246`
  `snapshotPartnerOptionsForMenu` が未存在 `option_id` を黙って捨てており、参照切れオプションを含むメニューでも EventMenu 化されます。欠落を検出したらメニュー変換を失敗扱いにしてください。
- 🚨 `functions/default/src/stripe.ts:248`
  オプション組み合わせごとに line item が増えるため、101 種類以上あると Stripe Checkout の上限 100 件を超えて `sessions.create` が失敗します。セッション作成前に上限を検査して `HttpsError` を返してください。

**コメント要約**: 概要は RC-11 と RC-19 の再掲。
個別 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 未存在 option_id の黙殺は RC-11、Stripe 明細 100 件は RC-19 として未着手のまま残している。このコメントに新しい指摘はない。

---

**識別子**: RC-26（GitHub id: 4110615850）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventEdit.vue:342`

**該当コード（レビュー時点の diff）**:

```diff
@@ -333,6 +333,14 @@ const partnerMenus = computed<BokudeliPartnerMenu[] | null>(() => {
   return partnerStore.menus ?? null
 })
 
+const partnerOptions = computed(() => {
+  const partnerId = event.value?.partner_id
+  if (partnerId == null || partnerId === '') {
+    return []
+  }
+  return usePartnerStore(partnerId).options ?? []
+})
```

**レビュワーのコメント（原文）**:

[must] ここではオプション未取得を `[]` に変換していますが、`isLoadingMenu` は `partnerMenus` の null しか見ていません。メニュー購読が先に完了すると、options なしの EventMenu を表示・予約処理へ進められ、必須オプションや価格が欠落したスナップショットになり得ます。オプションの未取得状態を保持し、再生成系では options の読込完了もローディング／保存ガードに含めてください。

**コメント要約**: オプション未取得を空配列にしている。
再生成では読込完了まで保存しない。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: メニュー購読だけ先に終わると、必須オプションと込み単価が抜けた EventMenu を保存できる。未取得は null のままにし、再生成中はメニューと同様にローディングと保存を止めた。

---

**識別子**: RC-27（GitHub id: 4110615817）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:292`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,15 +246,59 @@ service cloud.firestore {
                 // サポートアカウントであれば、運営マネージャーから店舗の開店設定と承認設定を変更できる
                 allow create, update, delete: if isSupport()
             }
+            function isValidAllergenList(value) {
+                return value is list
+                    && value.size() <= 8
+                    && value.size() == value.toSet().size()
+                    && value.hasOnly(['ebi', 'kani', 'kurumi', 'komugi', 'soba', 'tamago', 'milk', 'peanuts']);
+            }
+            function isValidBadgeList(value) {
+                return value is list
+                    && value.size() <= 3
+                    && value.size() == value.toSet().size()
+                    && value.hasOnly(['recommended', 'new', 'limited']);
+            }
+            function isValidOptionIdList(value) {
+                return value is list
+                    && value.size() <= 10
+                    && value.size() == value.toSet().size()
+                    && (value.size() < 1 || (value[0] is string && value[0].size() > 0))
+                    && (value.size() < 2 || (value[1] is string && value[1].size() > 0))
+                    && (value.size() < 3 || (value[2] is string && value[2].size() > 0))
+                    && (value.size() < 4 || (value[3] is string && value[3].size() > 0))
+                    && (value.size() < 5 || (value[4] is string && value[4].size() > 0))
+                    && (value.size() < 6 || (value[5] is string && value[5].size() > 0))
+                    && (value.size() < 7 || (value[6] is string && value[6].size() > 0))
+                    && (value.size() < 8 || (value[7] is string && value[7].size() > 0))
+                    && (value.size() < 9 || (value[8] is string && value[8].size() > 0))
+                    && (value.size() < 10 || (value[9] is string && value[9].size() > 0));
+            }
+            function menuWriteFieldsValid() {
+                return (!('option_ids' in request.resource.data) || isValidOptionIdList(request.resource.data.option_ids))
+                    && (!('allergens' in request.resource.data) || isValidAllergenList(request.resource.data.allergens))
+                    && (!('badges' in request.resource.data) || isValidBadgeList(request.resource.data.badges))
+                    && (!('is_vegan' in request.resource.data) || request.resource.data.is_vegan is bool)
+                    && (!('is_halal' in request.resource.data) || request.resource.data.is_halal is bool);
+            }
+            function optionWriteFieldsValid() {
+                return request.resource.data.option_name is string
+                    && request.resource.data.option_name.size() >= 1
+                    && request.resource.data.option_name.size() <= 40
+                    && request.resource.data.selection in ['single', 'multiple']
+                    && request.resource.data.required is bool
+                    && request.resource.data.option_items is list
+                    && request.resource.data.option_items.size() >= 1
+                    && request.resource.data.option_items.size() <= 20;
+            }
```

**レビュワーのコメント（原文）**:

[must] `option_description` が存在する場合の型と最大長が Rules で検査されていません。直接書き込みで非文字列や 200 文字超を保存でき、Functions の `PartnerOption` converter が読み込み時に失敗してオプション取得や承認処理を壊します。`option_name` と同様に、存在時は string かつ 200 文字以下であることを検証してください。

**コメント要約**: option_description の型と長さを Rules が見ない。
存在時は 200 文字以下の文字列にする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: スキーマは説明を 200 文字以下の文字列にしている。Functions の getOptions は 1 件の変換失敗で承認時の取得全体が落ちる。フィールドがあるときだけ string かつ 200 文字以下を Rules で拒否し、Rules テストを足した。

---

**識別子**: RC-28（GitHub id: 4110615872）

**レビュワー**: Copilot

**指摘箇所**: `partner/src/components/MenuEditCard.vue:284`

**該当コード（レビュー時点の diff）**:

```diff
@@ -203,6 +277,59 @@ const handleSubmit = () => {
             {{ $t('menu_edit_card.limit_per_event_hint') }}
           </p>
         </div>
+        <div class="menu-edit-card__section">
+          <div class="menu-edit-card__section-label">{{ $t('menu_edit_card.options') }}</div>
+          <div v-if="options.length === 0" class="menu-edit-card__hint">
+            {{ $t('menu_edit_card.options_empty') }}
+            <RouterLink class="ms-1" to="/options">{{ $t('navigation.option') }}</RouterLink>
```

**レビュワーのコメント（原文）**:

[imo] この partner コンポーネントでは新設した `getOptionsPath()` を使わず `/options` を直書きしています。ルート変更時にナビゲーション定義とこのリンクが不整合になるため、navigation utility を import して `:to` に渡してください。

**コメント要約**: オプション設定へのリンクがパス直書き。
getOptionsPath を使う。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: サイドメニューは getOptionsPath を使っている。編集カードのリンクも同じ関数にし、パスの定義を 1 箇所にした。

---
