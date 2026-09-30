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
| [x] | RC-11 | 4104985498 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 存在しない option_id を黙って捨てる<br>欠落 ID を検出して EventMenu 変換を失敗扱いにする |
| [x] | RC-12 | 4104985534 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 🔒 セキュリティ | 🔧 微修正 | S | Rules が option_ids の型と重複を見ない<br>文字列かつ一意にする |
| [x] | RC-13 | 4104985569 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | is_vegan / is_halal の型を Rules が見ない<br>bool 以外を拒否する |
| [x] | RC-14 | 4104985599 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | option_items の中身を Rules で検証してほしい<br>仕様 5.3 は Rules の対象外 |
| [x] | RC-15 | 4104985632 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | メニュー未読込のままオプションを消せる<br>読込完了まで削除しない |
| [x] | RC-16 | 4104985666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | オプション欄にメニュー名が重複する<br>項目名だけを出す |
| [x] | RC-17 | 4105006874 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | オプション編集で既存メニューが 1 円未満になる<br>参照メニューの最小合計を保存前に見る |
| [x] | RC-18 | 4105006882 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 詳細のオプション欄がメニュー名付きになる<br>項目名だけを出す |
| [x] | RC-19 | 4105006888 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe 明細が 100 件を超えると決済できない<br>セッション作成前に上限超過を failed-precondition で返す |
| [x] | RC-20 | 4105006894 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | Rules が option_ids の重複を許す<br>RC-12 と同じく一意にする |
| [x] | RC-21 | 5318264543 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書が未実装のまま<br>Phase 1 実装済みに更新する |
| [x] | RC-22 | 5324935902 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存のインライン指摘の再掲<br>個別 RC で扱う |
| [x] | RC-23 | 4110466923 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items が配列以外だと 500 になる<br>配列と要素を見て invalid-argument にする |
| [x] | RC-24 | 4110466941 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 区切り文字を含む ID でまとめキーが衝突する<br>選択の組を JSON にして境界を固定する |
| [x] | RC-25 | 5844335856 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は RC-11 と RC-19 の再掲<br>個別 RC で扱う |
| [x] | RC-26 | 4110615850 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | S | オプション未取得を空配列にしている<br>再生成では読込完了まで保存しない |
| [x] | RC-27 | 4110615817 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 🔧 微修正 | S | option_description の型と長さを Rules が見ない<br>存在時は 200 文字以下の文字列にする |
| [x] | RC-28 | 4110615872 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション設定へのリンクがパス直書き<br>getOptionsPath を使う |
| [ ] | RC-29 | 4111286766 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 画面と Functions のデプロイ順で金額がずれる<br>同時反映か機能ゲートを決める |
| [x] | RC-30 | 4111286772 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items を走査前に件数制限していない<br>正規の上限で切ってから検証する |
| [ ] | RC-31 | 5325821161 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe の商品名が 250 文字を超える<br>切り詰め方を決めてから実装する |
| [ ] | RC-32 | 4111286768 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | オプション削除がメニュー更新と別書き込み<br>参照解除と削除を同じ batch にする |
| [x] | RC-33 | 5325813791 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存の未解決スレッドの再掲<br>個別 RC で扱う |
| [x] | RC-34 | 5846025147 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot が RC-11 と RC-19 を実装した報告<br>新しい指摘はない |
| [x] | RC-35 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 1食あたり文言を依存のない computed で中継している<br>テンプレートの `$t` に置く |
| [x] | RC-36 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 任意の単一選択から「選ばない」が消えている<br>ラジオと文言を戻す |
| [x] | RC-37 | 5329573969 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>個別 RC で扱う |
| [x] | RC-38 | 5329588949 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex レビュー本体は案内のみ<br>具体指摘はインライン RC で扱う |
| [x] | RC-39 | 4114702159 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | ラジオラベルを ¥0 形式にしてほしい<br>仕様の ¥0 は内訳行。MenuPriceBreakdown で出している |
| [x] | RC-40 | 4114711280 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カートの + が同じ menu_id の他構成を数えない<br>増加可否は同一 menu_id の合計で見る |
| [x] | RC-41 | 4114711275 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 0円の注文なし参加がカート検証で落ちる<br>本体0円かつ合計0円のときだけ通す |
| [x] | RC-42 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カートモーダル初回だけ選択初期化が走らない<br>`watch(isOpen)` に `immediate: true` を付ける |
| [x] | RC-43 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | スマホの参加者メニュー一覧が説明文を出す<br>仕様どおり xs では説明文を出さない |
| [x] | RC-44 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Rules がメニュー説明文の 300 文字を見ない<br>`menuWriteFieldsValid` で長さを制限する |
| [x] | RC-45 | 5365750304 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-46 で扱う |
| [ ] | RC-46 | 4144224625 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 0円の事前決済がカート後に確定できない<br>決済なし確定か、対象の支払い方式を制限する |
| [x] | RC-47 | 4144265403 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 削除済みオプション ID が保存で戻る<br>欠落 ID があるメニューは保存しない |

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
| [x] | RC-11 | 4104985498 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 存在しない option_id を黙って捨てる<br>欠落 ID を検出して EventMenu 変換を失敗扱いにする |
| [x] | RC-12 | 4104985534 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 🔒 セキュリティ | 🔧 微修正 | S | Rules が option_ids の型と重複を見ない<br>文字列かつ一意にする |
| [x] | RC-13 | 4104985569 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | is_vegan / is_halal の型を Rules が見ない<br>bool 以外を拒否する |
| [x] | RC-14 | 4104985599 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | option_items の中身を Rules で検証してほしい<br>仕様 5.3 は Rules の対象外 |
| [x] | RC-15 | 4104985632 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | メニュー未読込のままオプションを消せる<br>読込完了まで削除しない |
| [x] | RC-16 | 4104985666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | オプション欄にメニュー名が重複する<br>項目名だけを出す |
| [x] | RC-17 | 4105006874 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | オプション編集で既存メニューが 1 円未満になる<br>参照メニューの最小合計を保存前に見る |
| [x] | RC-18 | 4105006882 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 詳細のオプション欄がメニュー名付きになる<br>項目名だけを出す |
| [x] | RC-19 | 4105006888 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe 明細が 100 件を超えると決済できない<br>セッション作成前に上限超過を failed-precondition で返す |
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
欠落 ID を検出して EventMenu 変換を失敗扱いにする。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 参照切れオプションを含むメニューを EventMenu に出すと必須選択が消えたまま注文できる。欠落 ID を検出したら変換自体を `null` にし、承認スナップショットではエラーログを残して対象外にする。

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
セッション作成前に上限超過を failed-precondition で返す。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: Checkout Session 作成前なら既存の注文導線を崩さず利用者向けエラーへ変換できる。Stripe の line_items 上限を超える前に `failed-precondition` を返す実装で被害を防ぐ。

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

**判断理由**: このコメント時点での内容は RC-11 と RC-19 の再掲であり、新しい指摘はない。現在は RC-11 / RC-19 とも対応済み。

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
---

## 対応セッション（2026-09-26 20:46・RC-11/RC-19 実装）

- **対応日時**: 2026-09-26 20:46 JST
- **対象 RC**: RC-11, RC-19
- **変更ファイル**:
  - `common/src/utils/menuOption.ts` — 欠落 option_id の検出ヘルパとスナップショット失敗判定を追加
  - `common/src/utils/eventMenuConverter.ts` — 参照切れオプションを含むメニューを EventMenu へ変換しないよう変更
  - `functions/default/src/eventMenusSnapshot.ts` — 承認スナップショット時に欠落 option_id をログ出力
  - `functions/default/src/stripe.ts` — Checkout Session 作成前に line item 上限チェックを追加
  - `functions/default/src/utils/stripeCheckoutLineItems.ts` — Stripe line item 上限の共通ガードを追加
  - `common/src/utils/menuOption.test.ts` / `common/src/utils/eventMenuConverter.test.ts` / `functions/default/src/utils/stripeCheckoutLineItems.test.ts` — 回帰テストを追加

---

## 評価セッション（2026-09-26 20:53・review-comments-evaluate）

- **評価日時**: 2026-09-26 20:53 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-26T11:40:42Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（依頼コメント 5845965868）
- **新規 RC**: RC-29〜RC-34
- **手順 4a 自動修正**: なし（🚨 0件。🟡 は 💰 / 🔒 / 工数 M / 仕様判断のため対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | RC-29 | 4111286766 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 画面と Functions のデプロイ順で金額がずれる<br>同時反映か機能ゲートを決める |
| [x] | RC-30 | 4111286772 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items を走査前に件数制限していない<br>正規の上限で切ってから検証する |
| [ ] | RC-31 | 5325821161 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe の商品名が 250 文字を超える<br>切り詰め方を決めてから実装する |
| [ ] | RC-32 | 4111286768 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | オプション削除がメニュー更新と別書き込み<br>参照解除と削除を同じ batch にする |
| [x] | RC-33 | 5325813791 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存の未解決スレッドの再掲<br>個別 RC で扱う |
| [x] | RC-34 | 5846025147 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot が RC-11 と RC-19 を実装した報告<br>新しい指摘はない |

---

**識別子**: RC-29（GitHub id: 4111286766）

**レビュワー**: Codex

**指摘箇所**: `common/src/utils/eventMenuConverter.ts:84`

**該当コード（レビュー時点の diff）**:

```diff
@@ -74,9 +81,25 @@ export function convertFromPartnerMenuToEventMenu(
     menu_sort_number: partnerMenu.menu_sort_number,
     limit_per_event: partnerMenu.limit_per_event,
     is_selected: selectedMenuIds.includes(partnerMenu.menu_id),
+    options,
```

**レビュワーのコメント（原文）**:

段階的デプロイでオプション有効化を分離する。承認スナップショットが直ちにオプション定義を持つようになるが、partner / functions / user / enterprise の workflow は同じ push から独立実行され順序保証がない。partner が先なら旧 Functions は option_ids を無視した EventMenu を固定して追加料金なしの注文を許す。Functions が先なら旧版の user/enterprise は selected_items を送らないため必須オプション付きメニューを注文できない。UI を先行配布してから Functions で有効化する互換 rollout、または feature gate を用意してほしい。

**コメント要約**: 画面と Functions のデプロイ順で金額がずれる。
同時反映か機能ゲートを決める。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 段階リリースの窓で金額がずれる指摘は妥当。機能ゲートにするか、本番は画面と Functions を揃えて出すかは仕様判断なので自動修正しない。

---

**識別子**: RC-30（GitHub id: 4111286772）

**レビュワー**: Codex

**指摘箇所**: `common/src/utils/menuOption.ts:199`

**該当コード（レビュー時点の diff）**:

```diff
（selected_items を配列として全件走査している箇所）
```

**レビュワーのコメント（原文）**:

認証済みクライアントは selected_items に任意件数を送れる。正規は最大 10 オプション×20 項目なので、走査前に 200 件以下などの上限を検証してほしい。

**コメント要約**: selected_items を走査前に件数制限していない。
正規の上限で切ってから検証する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 上限チェック自体は小さいが、セキュリティラベルのため自動修正の対象外。上限値を仕様の 200 にするかは確認してから入れる。確認の結果、正規の上限は `MENU_OPTION_IDS_MAX * OPTION_ITEMS_MAX`（200）で一意だったため、走査前に超えた配列を拒否するよう実装した。

---

**識別子**: RC-31（GitHub id: 5325821161）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stripe.ts:255`

**該当コード（レビュー時点の diff）**:

```diff
（Checkout の商品名に menuName を渡している）
```

**レビュワーのコメント（原文）**:

複数選択を多数選ぶと item.menuName が項目名の連結で 250 文字を超え、Stripe Product name の上限で sessions.create が拒否される。表示名を上限内に切るか、短い商品名と別の明細に分けてほしい。

**コメント要約**: Stripe の商品名が 250 文字を超える。
切り詰め方を決めてから実装する。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 決済名を切ると選択内容がレシートから消える。切り詰めと明細分割のどちらにするかは仕様判断なので自動修正しない。

---

**識別子**: RC-32（GitHub id: 4111286768）

**レビュワー**: Codex

**指摘箇所**: `partner/src/pages/options.vue:115`

**該当コード（レビュー時点の diff）**:

```diff
（付けているメニューを updateMenu したあと deleteOption している）
```

**レビュワーのコメント（原文）**:

使用中オプションの削除で、各 updateMenu のあと deleteOption するため、途中失敗だと一部メニューだけ外れた状態が残る。参照解除と削除を単一の batch か transaction にしてほしい。

**コメント要約**: オプション削除がメニュー更新と別書き込み。
参照解除と削除を同じ batch にする。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 部分更新は起きうる。store をまたぐ batch は書き方の設計が必要なので、この評価では直さない。

---

**識別子**: RC-33（GitHub id: 5325813791）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし。既存スレッドの再掲）
```

**レビュワーのコメント（原文）**:

Copilot review overview。未解決として selected_items の検証、option_items の Rules、存在しない option_id、Stripe 明細上限を再掲している。

**コメント要約**: 概要は既存の未解決スレッドの再掲。
個別 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 新しい差分指摘ではなく、RC-23、RC-14、RC-11、RC-19 の再掲。RC-11 と RC-19 は 4d35f8e で対応済み。

---

**識別子**: RC-34（GitHub id: 5846025147）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（実装報告。新規の修正依頼ではない）
```

**レビュワーのコメント（原文）**:

4d35f8e で未対応だった指摘を反映した。参照切れ option_id を含むメニューは EventMenu 変換対象外にし、Stripe Checkout の明細が 100 件を超える場合はセッション作成前に failed-precondition を返す。

**コメント要約**: Copilot が RC-11 と RC-19 を実装した報告。
新しい指摘はない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 対応報告であり、追加の修正依頼ではない。実装は origin の 4d35f8e に入っている。

---

## 評価セッション（2026-09-26 23:00・shokujii-code-review）

- **評価日時**: 2026-09-26 23:00 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **新規 RC**: RC-35
- **手順 3a / 3b 自動修正**: RC-35（🟡 1件）
- **再レビュー**: 2 周目は指摘 0 件

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-35 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | 1食あたり文言を依存のない computed で中継している<br>テンプレートの `$t` に置く |

---

**識別子**: RC-35（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/MenuPriceBreakdown.vue:21`

**該当コード（レビュー時点の diff）**:

```diff
+const perMealLabel = computed(() => t('menu_price_breakdown.per_meal'))
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: `perMealLabel` が `t()` の結果を、リアクティブ依存のない `computed` で中継している → テンプレートで `$t('menu_price_breakdown.per_meal')` を直接出す

**コメント要約**: 1食あたり文言を依存のない computed で中継している。
テンプレートの `$t` に置く。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: チェックリストは依存のない computed 中継を禁止している。表示文言はテンプレートの `$t` に置けば足り、修正方針は一意。locale は日本語固定のため表示結果は変わらない。

---

## 評価セッション（2026-09-27 14:56・shokujii-code-review）

- **評価日時**: 2026-09-27 14:56 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **新規 RC**: RC-36
- **手順 3a / 3b 自動修正**: RC-36（🚨 1件）
- **再レビュー**: 2 周目は指摘 0 件

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-36 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 任意の単一選択から「選ばない」が消えている<br>ラジオと文言を戻す |

---

**識別子**: RC-36（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventCartDialog.vue:267`

**該当コード（レビュー時点の diff）**:

```diff
-            <v-radio v-if="!option.required" :label="$t('cart_dialog.no_selection')" :value="''" />
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [🔧微修正/S]: 任意の単一選択から「選ばない」が削除され、一度選ぶと外せない。仕様は `single` の任意を 0 または 1 とする → ラジオと `cart_dialog.no_selection` を戻す

**コメント要約**: 任意の単一選択から「選ばない」が消えている。
ラジオと文言を戻す。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様 §4.2.3 は任意の単一選択を未選択のままにできる。空文字は `setSingleValue` が選択解除として扱っており、戻し方は一意。

---

## 評価セッション（2026-09-27 17:57・review-comments-evaluate）

- **評価日時**: 2026-09-27 17:57 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-27T08:43:34Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（依頼コメント 5854303653）
- **重複除外**: 7（5854318932=RC-14、4114702066/4114702084/4114702108=RC-29、4114702181=RC-30、4114702125=RC-31、4114702139=RC-32）
- **新規 RC**: RC-37〜RC-41
- **手順 4a 自動修正**: RC-41（🚨 1件）。🟡 は 👤 UX のため対象外（RC-40）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-37 | 5329573969 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>個別 RC で扱う |
| [x] | RC-38 | 5329588949 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex レビュー本体は案内のみ<br>具体指摘はインライン RC で扱う |
| [x] | RC-39 | 4114702159 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | ラジオラベルを ¥0 形式にしてほしい<br>仕様の ¥0 は内訳行。MenuPriceBreakdown で出している |
| [x] | RC-40 | 4114711280 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カートの + が同じ menu_id の他構成を数えない<br>増加可否は同一 menu_id の合計で見る |
| [x] | RC-41 | 4114711275 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 0円の注文なし参加がカート検証で落ちる<br>本体0円かつ合計0円のときだけ通す |

---

**識別子**: RC-37（GitHub id: 5329573969）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Unresolved rollout compatibility, validation, Rules, Stripe naming, display, and deletion-consistency issues remain.

**Review effort:** Lite  
**Findings:** 7 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 2 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (9)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [デプロイ順序の不整合でカート金額と注文可否が変わる](#discussion_r4114702066) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [新API拡張が旧Functionsと後方互換になっていない](#discussion_r4114702084) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [EventMenuとFunctionsの独立デプロイで互換性が崩れる](#discussion_r4114702108) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Stripe商品名が長さ制限を超えて決済に失敗する](#discussion_r4114702125) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [オプション削除と参照解除が原子的に実行されない](#discussion_r4114702139) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [差額表示に円記号と¥0が反映されていない](#discussion_r4114702159) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [selected_itemsの件数上限を検証前に制限していない](#discussion_r4114702181) · New
</details>

<details>
<summary><strong>Resolved since last review (2)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [存在しないoption_idを検出してスナップショットを失敗させる](#discussion_r4104985498)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Stripe明細上限超過時の制御されたエラー処理がない](#discussion_r4110466957)
</details>

**コメント要約**: Copilot 概要は既存スレッドと新規インラインの再掲。
個別 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 新規の独立した指摘はなく、インラインと既存 RC の一覧である。個別は RC-29〜RC-32・RC-14・RC-23・RC-39 で扱う。

---

**識別子**: RC-38（GitHub id: 5329588949）

**レビュワー**: Codex

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


### 💡 Codex Review

Here are some automated review suggestions for this pull request.

**Reviewed commit:** `247b89b395`
    

<details> <summary>ℹ️ About Codex in GitHub</summary>
<br/>

[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review".

If Codex has suggestions, it will comment; otherwise it will react with 👍.




Codex can also answer questions or update the PR. Try commenting "@codex address that feedback".
            
</details>

**コメント要約**: Codex レビュー本体は案内のみ。
具体指摘はインライン RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: レビュー本文にコード指摘はなく、インライン（RC-40・RC-41）へ誘導する案内である。

---

**識別子**: RC-39（GitHub id: 4114702159）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventCartDialog.vue:143`

**該当コード（レビュー時点の diff）**:

```diff
@@ -65,14 +69,84 @@ const countOptions = computed(() => {
   return Array.from({ length: max }, (_, i) => i + 1)
 })
 
+const menuOptions = computed(() => currentMenu.value.options ?? [])
+
+const resetOptionSelection = () => {
+  const initial: Record<string, string[]> = {}
+  for (const option of menuOptions.value) {
+    initial[option.option_id] =
+      option.required && option.selection === 'single' && option.option_items[0] != null
+        ? [option.option_items[0].item_id]
+        : []
+  }
+  selectedByOption.value = initial
+}
+
+const selectedItems = computed((): CartSelectedItemType[] =>
+  Object.entries(selectedByOption.value).flatMap(([option_id, itemIds]) =>
+    itemIds.map((item_id) => ({ option_id, item_id })),
+  ),
+)
+
+const resolvedSelection = computed(() =>
+  resolveEventMenuCartOrder({
+    eventMenu: currentMenu.value,
+    selectedItems: selectedItems.value,
+  }),
+)
+
+const displayedPrice = computed(() =>
+  resolvedSelection.value.ok ? resolvedSelection.value.menu_price : currentMenu.value.menu_price,
+)
+
+const priceBreakdownLines = computed(() => {
+  const resolved = resolvedSelection.value
+  if (!resolved.ok) {
+    return []
+  }
+  return buildMenuPriceLines(currentMenu.value.menu_name, resolved.menu_price, resolved.selected_options)
+})
+
 const isAddDisabled = computed(
-  () => currentMenu.value.is_sold_out || isMenuLimitSoldOut(currentMenu.value) || countOptions.value.length === 0,
+  () =>
+    currentMenu.value.is_sold_out ||
+    isMenuLimitSoldOut(currentMenu.value) ||
+    countOptions.value.length === 0 ||
+    !resolvedSelection.value.ok,
 )
 
+const getSingleValue = (optionId: string): string | null => selectedByOption.value[optionId]?.[0] ?? null
+
+const setSingleValue = (optionId: string, itemId: string | null) => {
+  selectedByOption.value = { ...selectedByOption.value, [optionId]: itemId == null || itemId === '' ? [] : [itemId] }
+}
+
+const isMultipleChecked = (optionId: string, itemId: string): boolean =>
+  selectedByOption.value[optionId]?.includes(itemId) === true
+
+const toggleMultiple = (optionId: string, itemId: string, checked: boolean) => {
+  const current = new Set(selectedByOption.value[optionId] ?? [])
+  if (checked) {
+    current.add(itemId)
+  } else {
+    current.delete(itemId)
+  }
+  selectedByOption.value = { ...selectedByOption.value, [optionId]: [...current] }
+}
+
+const formatDelta = (delta: number): string => {
+  if (delta === 0) {
+    return $t('cart_dialog.price_delta_zero')
+  }
+  const sign = delta > 0 ? '+' : ''
+  return `${sign}${priceString(delta)}`
+}
```

**レビュワーのコメント（原文）**:

[must] 仕様では差額 0 は `¥0`、正負の差額も円記号付きで表示しますが、ここでは 0 を「差額なし」に置き換え、非 0 は `+100` / `-100` のように円記号なしで表示しています。`¥0`、`+¥100`、`-¥100` の形式で表示してください。

**コメント要約**: ラジオラベルを ¥0 形式にしてほしい。
仕様の ¥0 は内訳行。MenuPriceBreakdown で出している。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 仕様 §4.2.3 / §4.3 の「差額 0 も ¥0」は選択内訳の金額行であり、ラジオ／チェックの項目ラベルではない。内訳は `MenuPriceBreakdown` が `¥0` / `-¥n` で出している。

---

**識別子**: RC-40（GitHub id: 4114711280）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/pages/cart.vue:128`

**該当コード（レビュー時点の diff）**:

```diff
@@ -99,34 +106,44 @@ async function resolveEventStoreOptions(): Promise<EventStoreOptions> {
 }
 
 type GroupedMenu = {
+  group_key: string
   menu_id: string
   menu_name: string
   menu_price: number
+  price_lines: MenuPriceLine[]
   count: number
   order_ids: string[]
   totalPrice: number
   totalDiscount: number
   totalPayment: number
   /** 1個分の割引。enterprise_subsidy では品目ごとに異なり得るため表示は totalDiscount/count を使用 */
   offAmountPerUnit: number
+  selected_items?: { option_id: string; item_id: string }[]
 }
 
 const groupOrdersByMenu = (orders: EventMemberOrder[]): GroupedMenu[] => {
   const map = new Map<string, GroupedMenu>()
   for (const order of orders) {
     const discount = getMemberOrderDiscountAmount(order)
-    const existing = map.get(order.menu_id)
+    const key = getOrderMenuGroupKey(order)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  限定食数は全オプション組み合わせの個数で判定する**

同じ限定メニューを異なるオプション構成でカートに入れると、このキーによって別々の `GroupedMenu` になりますが、`canIncrementMenuCount` は現在のグループの `menu.count` しか加算していません。たとえば残り2食で構成AとBを1食ずつ入れた状態でも両方の追加ボタンが有効なままで、`assertMenuLimitsForCartAdd` も既存カート数を数えないため3食目を追加でき、注文確定時の `assertMenuLimitsForConfirm` で初めて拒否されます。増加可否には同じ `menu_id` を持つ全グループの個数合計を使用してください。

Useful? React with 👍 / 👎.

**コメント要約**: カートの + が同じ menu_id の他構成を数えない。
増加可否は同一 menu_id の合計で見る。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 限定食数はメニュー単位（仕様 02 §3.3 / 14）。確定時の `assertMenuLimitsForConfirm` は menu_id 合計なので在庫は守られる。カート投入は在庫を確保しない（仕様 14 §3.2）ため、`assertMenuLimitsForCartAdd` にはカート数を足していない。UI の + は同じ `menu_id` の合計で無効化するよう実装した。

---

**識別子**: RC-41（GitHub id: 4114711275）

**レビュワー**: Codex

**指摘箇所**: `common/src/utils/menuOption.ts:268`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・189 行）
+  menuName: string,
+  selectedOptions?: readonly SelectedOptionType[] | null,
+  maxLength = NAMES_PRINT_MAX_MENU_LABEL_LENGTH,
+): string {
+  const normalizedName = menuName.normalize('NFKC')
+  if (normalizedName.length >= maxLength) {
+    return normalizedName.slice(0, maxLength)
+  }
+  if (selectedOptions == null || selectedOptions.length === 0) {
+    return normalizedName
+  }
+  const prefix = `${normalizedName}（`
+  const suffix = '）'
+  const remaining = maxLength - prefix.length - suffix.length
+  if (remaining < 1) {
+    return normalizedName
+  }
+  const itemPart = formatSelectedOptionItemNames(selectedOptions)
+  if (itemPart.length <= remaining) {
+    return `${prefix}${itemPart}${suffix}`
+  }
+  const ellipsis = '…'
+  const keep = Math.max(0, remaining - ellipsis.length)
+  return `${prefix}${itemPart.slice(0, keep)}${ellipsis}${suffix}`
+}
+
+export { hasDuplicateOptionItemNames } from '../schemas/menuOption.js'
+
+function isCartSelectedItem(value: unknown): value is CartSelectedItemType {
+  if (typeof value !== 'object' || value == null) {
+    return false
+  }
+  if (!('option_id' in value) || !('item_id' in value)) {
+    return false
+  }
+  return (
+    typeof value.option_id === 'string' &&
+    value.option_id.length > 0 &&
+    typeof value.item_id === 'string' &&
+    value.item_id.length > 0
+  )
+}
+
+function isCartSelectedItemList(value: unknown): value is CartSelectedItemType[] {
+  return Array.isArray(value) && value.every(isCartSelectedItem)
+}
+
+export type ResolveEventMenuCartOrderInput = {
+  eventMenu: {
+    menu_id: string
+    menu_name: string
+    menu_price: number
+    is_selected?: boolean
+    options?: readonly MenuOptionDefinition[] | null
+  }
+  selectedItems?: unknown
+  presentedMenuPrice?: number
+}
+
+export type ResolveEventMenuCartOrderResult =
+  | { ok: true; selected_options: SelectedOptionType[]; menu_price: number }
+  | { ok: false; httpsCode: 'invalid-argument' | 'failed-precondition'; reason: string }
+
+export function resolveEventMenuCartOrder(input: ResolveEventMenuCartOrderInput): ResolveEventMenuCartOrderResult {
+  const optionDefs = input.eventMenu.options ?? []
+  const rawSelected = input.selectedItems ?? []
+  if (!isCartSelectedItemList(rawSelected)) {
+    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_OPTION_SELECTION_MESSAGE }
+  }
+  const selectedItems = rawSelected
+  if (optionDefs.length === 0 && selectedItems.length > 0) {
+    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_OPTION_SELECTION_MESSAGE }
+  }
+  const validation = validateCartOptionSelection(optionDefs, selectedItems)
+  if (!validation.ok) {
+    return { ok: false, httpsCode: 'invalid-argument', reason: validation.reason }
+  }
+  const menu_price = computeOrderMenuPrice(input.eventMenu.menu_price, validation.selected_options)
+  if (menu_price < MENU_OPTION_MIN_TOTAL) {
+    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_MENU_PRICE_MESSAGE }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  0円の注文なし参加をカート検証から除外する**

このコミットでは `EventMenu` と `EventMemberOrder` が「注文なしで参加」用の `menu_price: 0` を明示的に許容していますが、オプションなしの当該メニューもここで必ず `invalid-argument` になります。`EventCartDialog` でも同じ関数の失敗結果によって追加ボタンが無効になるため、利用者は0円参加メニューをカートへ追加できません。負のオプションによる不正価格は拒否しつつ、正規の0円参加メニューは通すよう条件を分けてください。

Useful? React with 👍 / 👎.

**コメント要約**: 0円の注文なし参加がカート検証で落ちる。
本体0円かつ合計0円のときだけ通す。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `EventMenu` / `EventMemberOrder` は 0円の注文なし参加を許容する。オプション仕様の「1円未満は不可」は有料メニューの組み合わせ向けで、既存の 0円参加を壊してはならない。`menu_price === 0` かつ計算結果も 0 のときだけ通し、有料メニューを差額で 0 円以下にはしない。手順 4a で修正済み。

---

## 評価セッション（2026-09-30 20:50・shokujii-code-review）

- **評価日時**: 2026-09-30 20:50 JST
- **評価者**: Cursor Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **新規 RC**: RC-42〜RC-44
- **手順 3a / 3b 自動修正**: なし（🟡 は 👤 UX または 🔒 セキュリティのため対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-42 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | カートモーダル初回だけ選択初期化が走らない<br>`watch(isOpen)` に `immediate: true` を付ける |
| [x] | RC-43 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | スマホの参加者メニュー一覧が説明文を出す<br>仕様どおり xs では説明文を出さない |
| [x] | RC-44 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | Rules がメニュー説明文の 300 文字を見ない<br>`menuWriteFieldsValid` で長さを制限する |

---

**識別子**: RC-42（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventCartDialog.vue:137`

**該当コード（レビュー時点の diff）**:

```diff
 watch(isOpen, (open) => {
   if (open) {
     addErrorMessage.value = ''
     selectedCount.value = countOptions.value[0] ?? 1
+    resetOptionSelection()
   }
 })
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: カート追加モーダルは `v-if` で作られ、初回は `isOpen === true` のままマウントされる。`watch(isOpen)` に `immediate: true` が無いので、初回は `resetOptionSelection` が走らず必須の単一選択が空のままになる。閉じたあとの再表示だけ先頭項目が入り、初回と 2 回目で小計と追加可否が変わる。 → `watch` に `immediate: true` を付け、開いた時点で必ず初期化する。

**コメント要約**: カートモーダル初回だけ選択初期化が走らない。
`watch(isOpen)` に `immediate: true` を付ける。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 親はメニュー選択と同時に `isOpen` を true にしてダイアログをマウントする。watch の既定は初回に発火しないため、必須 single の先頭選択が初回だけ欠ける。`watch(isOpen)` に `immediate: true` を付けて、開いた時点で初期化するよう実装した。

---

**識別子**: RC-43（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `base/src/components/EventMenuList.vue:155`

**該当コード（レビュー時点の diff）**:

```diff
 <v-card-text class="text-left text-subtitle-2 px-1 py-0 description-text flex-shrink-0">
   {{ menu.menu_description }}
 </v-card-text>
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: 参加者のメニュー一覧はスマホ（`display.xs`）でもグリッド側の説明文を出している。仕様 `documents/03_参加者獲得/12_イベントページのメニュー表示.md` の 4.2・4.4・5.4 は、スマホではカード幅を確保するため説明文を表示しない。説明文の上限が 300 文字になったので、2 行クランプでも狭いカードを圧迫する。 → xs では説明文を出さない。

**コメント要約**: スマホの参加者メニュー一覧が説明文を出す。
仕様どおり xs では説明文を出さない。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `useHorizontalLayout` は xs で false になり、グリッド模板が使われる。仕様の非表示は 2 件以下・3 件以上のスマホ両方に書いてある。xs では説明文を出さないよう実装した。

---

**識別子**: RC-44（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `firestore.rules:264`

**該当コード（レビュー時点の diff）**:

```diff
 function menuWriteFieldsValid() {
     return !('option_ids' in request.resource.data) || isValidOptionIdList(request.resource.data.option_ids);
 }
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [🔧微修正/S]: メニュー説明文の上限はスキーマと入力欄で 300 文字になったが、`menuWriteFieldsValid` は `option_ids` しか見ていない。Rules を迂回して 301 文字以上を書くと converter が拒否し、そのメニューが一覧から消える。オプション説明は 200 文字を Rules で見ている。 → `menu_description` が文字列で 1〜300 文字であることを `menuWriteFieldsValid` に加え、Rules テストを更新する。

**コメント要約**: Rules がメニュー説明文の 300 文字を見ない。
`menuWriteFieldsValid` で長さを制限する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 公式画面の `maxlength` は迂回できる。`option_description` は同じ PR で Rules の長さ検証がある。説明文だけクライアントスキーマ任せだと、不正な長さのドキュメントが読めなくなる。`menuWriteFieldsValid` で 1〜300 文字を必須にし、Rules テストを更新した。

---


## 評価セッション（2026-09-30 20:54・review-comments-evaluate）

- **評価日時**: 2026-09-30 20:54 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-30T11:39:38Z
- **partial**: sentinel は true。完了直後の Codex インラインを含めて評価した
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5910429089、Codex レビュー本体 5365800454 は案内のみ）
- **新規 RC**: RC-45〜RC-47
- **手順 4a 自動修正**: RC-47（🚨 1件）。RC-46 は 💰 金銭・仕様判断のため対象外

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-45 | 5365750304 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-46 で扱う |
| [ ] | RC-46 | 4144224625 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | 0円の事前決済がカート後に確定できない<br>決済なし確定か、対象の支払い方式を制限する |
| [x] | RC-47 | 4144265403 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 削除済みオプション ID が保存で戻る<br>欠落 ID があるメニューは保存しない |

---

**識別子**: RC-45（GitHub id: 5365750304）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Unresolved issues remain in zero-price payment handling, deployment compatibility, cart limits, validation, and atomic option deletion.

**Review effort:** Lite  
**Findings:** 10 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (11)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円事前決済注文が確定できない支払い方式の不整合](#discussion_r4144224625) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各要素をRulesで検証していない](#discussion_r4115300334)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [同一メニューの別選択行を合算せず上限超過を許す](#discussion_r4115300308)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [オプション削除と参照解除が原子的に実行されない](#discussion_r4114702139)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Stripe商品名が長さ制限を超えて決済に失敗する](#discussion_r4114702125)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [EventMenuとFunctionsの独立デプロイで互換性が崩れる](#discussion_r4114702108)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [新API拡張が旧Functionsと後方互換になっていない](#discussion_r4114702084)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [デプロイ順序の不整合でカート金額と注文可否が変わる](#discussion_r4114702066)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [selected_itemsの件数上限を検証前に制限していない](#discussion_r4114702181)
</details>

<details>
<summary><strong>Resolved since last review (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [差額表示に円記号と¥0が反映されていない](#discussion_r4114702159)
</details>

**コメント要約**: Copilot 概要は既存スレッドと新規インラインの再掲。
新規は RC-46 で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 未解決一覧の大半は RC-14・RC-23・RC-29〜RC-32 の再掲。新規の 0 円事前決済は RC-46 で扱う。

---

**識別子**: RC-46（GitHub id: 4144224625）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/menuOption.ts:274`

**該当コード（レビュー時点の diff）**:

```diff
  const menu_price = computeOrderMenuPrice(input.eventMenu.menu_price, validation.selected_options)
  const isAttendanceOnlyMenu = input.eventMenu.menu_price === 0 && menu_price === 0
  if (menu_price < MENU_OPTION_MIN_TOTAL && !isAttendanceOnlyMenu) {
    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_MENU_PRICE_MESSAGE }
  }
```

**レビュワーのコメント（原文）**:

[must] 0円の注文なし参加をここで許可すると、`user_advance` のカートでも 0円注文が通りますが、画面側は事前決済を常に Stripe Checkout へ送り、`stripe.ts` は `totalPayment <= 0` を拒否し、`confirmOrder` は `user_advance` を拒否します。この組み合わせでは注文を確定できません。0円の事前決済を決済なしで確定する経路を追加するか、対象の支払い方式をカート検証で明確に制限してください。

**コメント要約**: 0円の事前決済がカート後に確定できない。
決済なし確定か、対象の支払い方式を制限する。

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: `resolveEventMenuCartOrder` は本体 0 円かつ合計 0 円を通す。`confirmOrder` は `user_advance` を拒否し、`createStripeCheckoutSession` は支払額 0 円を拒否する。カート追加後に確定できない。決済なしで確定するか、事前決済では 0 円参加をカート検証で止めるかは仕様判断が要る。

---

**識別子**: RC-47（GitHub id: 4144265403）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `partner/src/pages/menu.vue:79`

**該当コード（レビュー時点の diff）**:

```diff
    const attached = (menu.option_ids ?? [])
      .map((optionId) => options.value.find((option) => option.option_id === optionId))
      .filter((option): option is BokudeliPartnerOption => option != null)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  欠落したオプション参照を保存前に拒否する**

別タブでオプションが削除された後に古いメニュー編集ダイアログから保存すると、削除済み ID はこの `filter` で検証対象から除外される一方、`menu.option_ids` には残ったまま `updateMenu` へ渡されるため、削除処理が外した参照を再登録できます。そのメニューは次回の承認時に `snapshotPartnerOptionsForMenu` が `null` を返してイベントメニューから消えるので、対応するオプションが全件存在することを確認してから保存してください。

**コメント要約**: 削除済みオプション ID が保存で戻る。
欠落 ID があるメニューは保存しない。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 最小合計の検査は存在するオプションだけを見るが、保存は `option_ids` をそのまま書く。欠落 ID が戻ると承認時のスナップショットが失敗し、メニューがイベントから消える。件数不一致で保存を拒否する。手順 4a で修正済み。

---
