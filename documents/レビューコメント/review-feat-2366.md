# ブランチ feat/2366 レビュー記録

### RC 一覧（サマリ）

冒頭表は最新評価を示す。2026-10-01 のリリース前方針による再評価は末尾に記録し、各過去セッションの評価は履歴として保持する。既存指摘は同じ RC 番号で追跡する。

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
| [x] | RC-14 | 4104985599, 4115300334 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 📋 仕様追加 | M | 検証付き Callable に保存を集約し、全項目の型・範囲・ID/名前の重複を Zod で検証。Rules は直接書き込みを禁止した。 |
| [x] | RC-15 | 4104985632 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | メニュー未読込のままオプションを消せる<br>読込完了まで削除しない |
| [x] | RC-16 | 4104985666 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | オプション欄にメニュー名が重複する<br>項目名だけを出す |
| [x] | RC-17 | 4105006874 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | オプション編集で既存メニューが 1 円未満になる<br>参照メニューの最小合計を保存前に見る |
| [x] | RC-18 | 4105006882 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 詳細のオプション欄がメニュー名付きになる<br>項目名だけを出す |
| [x] | RC-19 | 4105006888 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 📋 仕様追加 | M | Stripe 明細が 100 件を超えると決済できない<br>セッション作成前に上限超過を failed-precondition で返す |
| [x] | RC-20 | 4105006894 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | Rules が option_ids の重複を許す<br>RC-12 と同じく一意にする |
| [x] | RC-21 | 5318264543 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 仕様書が未実装のまま<br>Phase 1 実装済みに更新する |
| [x] | RC-22 | 5324935902 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は既存のインライン指摘の再掲<br>個別 RC で扱う |
| [x] | RC-23 | 4110466923 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 👀 確認のみ | — | selected_items の不正入力は修正済み<br>配列・要素・件数を確認し invalid-argument を返す |
| [x] | RC-24 | 4110466941 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 区切り文字を含む ID でまとめキーが衝突する<br>選択の組を JSON にして境界を固定する |
| [x] | RC-25 | 5844335856 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 概要は RC-11 と RC-19 の再掲<br>個別 RC で扱う |
| [x] | RC-26 | 4110615850 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | S | オプション未取得を空配列にしている<br>再生成では読込完了まで保存しない |
| [x] | RC-27 | 4110615817 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 🔧 微修正 | S | option_description の型と長さを Rules が見ない<br>存在時は 200 文字以下の文字列にする |
| [x] | RC-28 | 4110615872 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | オプション設定へのリンクがパス直書き<br>getOptionsPath を使う |
| [x] | RC-29 | 4111286766, 4114702066, 4114702084, 4114702108 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 独立デプロイに関する3件はコード対応不要<br>メンテナンス中に全対象を反映してから利用を再開する |
| [x] | RC-30 | 4111286772 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 🔧 微修正 | S | selected_items を走査前に件数制限していない<br>正規の上限で切ってから検証する |
| [x] | RC-31 | 5325821161, 4114702125 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 👤 UX | 📋 仕様追加 | M | Stripe product_data.name のみ250コードポイントに制限（超過時は249文字＋…）。注文スナップショット・金額・集約キーは維持した。 |
| [x] | RC-32 | 4111286768, 4114702139 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | M | サーバートランザクションで実際の参照メニューを読み、参照解除と本体削除を一括確定。メニュー保存も参照先を読み、同時参照追加と古い編集による復活を拒否した。 |
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
| [x] | RC-46 | 4144224625 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 👤 UX | 📋 仕様追加 | M | user_advance の支払合計0円だけ confirmOrder で確定可能にした。サーバー再計算・既存の確定条件・確定後処理を維持し、有料混在は拒否した。 |
| [x] | RC-47 | 4144265403 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 削除済みオプション ID が保存で戻る<br>欠落 ID があるメニューは保存しない |
| [x] | RC-48 | 5911293633 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 返信は既存の未解消指摘の再掲<br>個別 RC で扱う |
| [x] | RC-49 | 5366192698 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-50 で扱う |
| [x] | RC-50 | 4144582288 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 📋 仕様追加 | M | 認証 UID 配下の option ドキュメントを保存トランザクション内で取得し、欠落・他店舗の参照を拒否。クライアント直書きも禁止した。 |
| [x] | RC-51 | 5374647587 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存の未解消指摘の再掲<br>新しい指摘はない |
| [x] | RC-52 | 5374647675 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex レビュー本体は案内のみ<br>具体指摘はインライン RC-53 で扱う |
| [x] | RC-53 | 4151569102 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 別オプションの同時追加で限定数を超える<br>増加ロックをイベントとメニューで共有する |
| [x] | RC-54 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | M | 正の必須オプション削除で残りの最小金額が1円未満になる<br>削除前に残存構成を検証し、失敗時は全体を中止する |
| [x] | RC-55 | 5375385918 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-57〜RC-60 で扱う |
| [x] | RC-56 | 5925550697 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | トップレベル返信は4件のインライン指摘の再掲<br>個別 RC で扱う |
| [ ] | RC-57 | 4152199953 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | 保存失敗でもメニュー画像だけ更新される<br>成功後アップロードか補償が必要。方式選択のため未修正 |
| [ ] | RC-58 | 4152199771 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 末尾空白違いの項目名を別物として通す<br>trim 後の長さと重複検証が必要。表示の扱いのため未修正 |
| [ ] | RC-59 | 4152199895 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 参照500件超の削除がトランザクション上限で失敗する<br>§5.4 は全体失敗を許容。明示拒否か分割かの選択が残る |
| [x] | RC-60 | 4152199773 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 保存中も送信でき、二重作成で誤エラーになる<br>保存完了まで loading で再送信できない |
| [x] | RC-61 | 4152662508 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | NUL 連結の選択キーが別項目を加算する<br>option_id ごとの Set で照合する |
| [ ] | RC-62 | 4152662502 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 名札のメニュー名を UTF-16 単位で切る<br>絵文字境界で孤立サロゲートになる |
| [x] | RC-63 | 4152871098 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | __proto__ を選択キーにすると必須選択が消える<br>参照 ID は __ で囲む値を既に拒否する |
| [x] | RC-64 | 5926768347 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | カート追加中に閉じると二重注文できる<br>追加中は閉じられず、開始時にも実行中を拒否する |
| [ ] | RC-65 | 4152871178 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 📋 仕様追加 | L | legacy manager のメニュー直書きが Rules で失敗する<br>移行か配信停止かの判断が残る |

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


## 評価セッション（2026-09-30 21:36・review-comments-evaluate）

- **評価日時**: 2026-09-30 21:36 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-09-30T12:23:09Z
- **partial**: true。Codex の新規レビューは無い
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（依頼コメント 5911225364）
- **新規 RC**: RC-48〜RC-50
- **手順 4a 自動修正**: なし（👌 のみ）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-48 | 5911293633 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 返信は既存の未解消指摘の再掲<br>個別 RC で扱う |
| [x] | RC-49 | 5366192698 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-50 で扱う |
| [x] | RC-50 | 4144582288 | 👌 修正不要 | — | — | 📑 仕様書 | 👀 確認のみ | — | Rules で option_ids の実在を見てほしい<br>仕様 5.3 は配列長まで。存在確認は承認時 |

---

**識別子**: RC-48（GitHub id: 5911293633）

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

現行 HEAD を確認しました。以下の既存指摘は未解消です（同じ箇所に既存の未解決インラインスレッドがあるため、重複投稿はしていません）。

- 🚨 **必須修正** [🔧微修正/S] `firestore.rules:276-278` — `option_items` の要素形状を検証せず、空の `name` や不正な `item_id` / `price_delta` を保存できます。Rules 側の要素検証と拒否テストが必要です。
- 🚨 **必須修正** [🔧微修正/S] `functions/default/src/stripe.ts:258` — 選択項目名を連結した `product_data.name` に上限がなく、選択数が多いと Stripe Checkout のセッション作成に失敗します。
- 🚨 **必須修正** [📋仕様追加/M] `common/src/apis/order.ts:4-5` / `base/src/components/EventCartDialog.vue:204-205` — Functions と UI のデプロイは独立しており、片方だけ先に反映される間、金額不整合または必須オプション注文不可が発生します。互換 rollout または機能ゲートが必要です。
- 🟡 **修正提案** [🔧微修正/M] `partner/src/pages/options.vue:115-124` — メニュー参照解除とオプション削除が別書き込みのため、競合時に参照切れが生じます。単一 batch / transaction で実行してください。
- 🟡 **修正提案** [📋仕様追加/M] `common/src/utils/menuOption.ts:282-284` — 0円注文を許可しますが、`user_advance` は常に Stripe Checkout に進み、Functions 側が0円を拒否します。0円の事前決済を確定する経路、または対象支払い方式の制限が必要です。

同一 PR の verify run #653 は確認時点で実行中で、失敗ジョブはありませんでした。利用可能な GitHub ツールに新規 Files changed インラインレビューを投稿する機能がないため、既存コメントへの返信で結果を報告しています。

**コメント要約**: Copilot 返信は既存の未解消指摘の再掲。
個別 RC で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: option_items の Rules、Stripe 商品名、デプロイ順、オプション削除、0 円事前決済は RC-14・RC-31・RC-29・RC-32・RC-46 の再掲。新しいコード指摘はない。

---

**識別子**: RC-49（GitHub id: 5366192698）

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

Unresolved critical and moderate findings remain in Rules, rollout compatibility, payment flow, and data consistency.

**Review effort:** Lite  
**Findings:** 10 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (10)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_idsの存在とパートナー所属を検証していない](#discussion_r4144582288) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円事前決済注文が確定できない支払い方式の不整合](#discussion_r4144224625)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各要素をRulesで検証していない](#discussion_r4115300334)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [オプション削除と参照解除が原子的に実行されない](#discussion_r4114702139)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Stripe商品名が長さ制限を超えて決済に失敗する](#discussion_r4114702125)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [EventMenuとFunctionsの独立デプロイで互換性が崩れる](#discussion_r4114702108)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [新API拡張が旧Functionsと後方互換になっていない](#discussion_r4114702084)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [デプロイ順序の不整合でカート金額と注文可否が変わる](#discussion_r4114702066)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
</details>

<details>
<summary><strong>Resolved since last review (2)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [同一メニューの別選択行を合算せず上限超過を許す](#discussion_r4115300308)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [selected_itemsの件数上限を検証前に制限していない](#discussion_r4114702181)
</details>

**コメント要約**: Copilot 概要は既存スレッドと新規インラインの再掲。
新規は RC-50 で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 未解決一覧の大半は既存 RC の再掲。新規の option_ids 実在確認は RC-50 で扱う。

---

**識別子**: RC-50（GitHub id: 4144582288）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:268`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,15 +246,49 @@ service cloud.firestore {
                 // サポートアカウントであれば、運営マネージャーから店舗の開店設定と承認設定を変更できる
                 allow create, update, delete: if isSupport()
             }
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
+                return request.resource.data.menu_description is string
+                    && request.resource.data.menu_description.size() >= 1
+                    && request.resource.data.menu_description.size() <= 300
+                    && (!('option_ids' in request.resource.data) || isValidOptionIdList(request.resource.data.option_ids));
```

**レビュワーのコメント（原文）**:

[must] `option_ids` は配列の形しか検証されておらず、削除済み・存在しない ID や別パートナーの ID を直接 Firestore に保存できます。UI の `saveMenu` 検証を経由しない書き込みでは、承認時にこのメニューが `EventMenu` から黙って除外されるため、メニュー保存時点で同一パートナー配下のオプション参照を検証するか、少なくとも無効参照を拒否するサーバー側経路を追加してください。

**コメント要約**: Rules で option_ids の実在を見てほしい。
仕様 5.3 は配列長まで。存在確認は承認時。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: 📑 仕様書

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 仕様 5.3 はメニューの option_ids を現行の write 条件のままにし、Rules では配列長だけを見る。存在しない ID は承認スナップショットが null を返し、そのメニューはイベントにコピーされない。画面保存では欠落 ID を既に拒否している。

---

---

## 評価セッション（2026-10-01 12:35・review-comments-evaluate）

- **評価日時**: 2026-10-01 12:35 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate` auto）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-10-01T03:26:31Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼コメント 5924114207、Copilot 処理エラー 5924115896）
- **新規 RC**: RC-51〜RC-53
- **手順 4a 自動修正**: RC-53（🚨 0件 / 🟡 1件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-51 | 5374647587 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存の未解消指摘の再掲<br>新しい指摘はない |
| [x] | RC-52 | 5374647675 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex レビュー本体は案内のみ<br>具体指摘はインライン RC-53 で扱う |
| [x] | RC-53 | 4151569102 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 別オプションの同時追加で限定数を超える<br>増加ロックをイベントとメニューで共有する |

---

**識別子**: RC-51（GitHub id: 5374647587）

**レビュワー**: copilot-pull-request-reviewer[bot]

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🔵 Needs a closer look

未解決の必須レビュー指摘があり、互換性・決済・検証・削除処理の修正が必要です。

**Review effort:** Lite  
**Findings:** 10 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (10)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_idsの存在とパートナー所属を検証していない](#discussion_r4144582288)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円事前決済注文が確定できない支払い方式の不整合](#discussion_r4144224625)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各要素をRulesで検証していない](#discussion_r4115300334)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [オプション削除と参照解除が原子的に実行されない](#discussion_r4114702139)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Stripe商品名が長さ制限を超えて決済に失敗する](#discussion_r4114702125)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [EventMenuとFunctionsの独立デプロイで互換性が崩れる](#discussion_r4114702108)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [新API拡張が旧Functionsと後方互換になっていない](#discussion_r4114702084)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [デプロイ順序の不整合でカート金額と注文可否が変わる](#discussion_r4114702066)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
</details>

**コメント要約**: Copilot 概要は既存の未解消指摘の再掲。
新しい指摘はない。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 列挙された 10 件は既存スレッドの再掲。今回の差分に対する新しい指摘はない。

---

**識別子**: RC-52（GitHub id: 5374647675）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


### 💡 Codex Review

Here are some automated review suggestions for this pull request.

**Reviewed commit:** `da5f68e528`
    

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
具体指摘はインライン RC-53 で扱う。

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: レビュー本文は自動レビューである旨と接続案内だけで、コード上の指摘はインライン RC-53 にある。

---

**識別子**: RC-53（GitHub id: 4151569102）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `base/src/components/pages/cart.vue:704`

**該当コード（レビュー時点の diff）**:

```diff
@@ -681,7 +701,7 @@ const showDeleteConfirm = (event: BokudeliEvent, orderId: string) => {
 }
 
 const incrementMenuCount = async (event: BokudeliEvent, menu: GroupedMenu) => {
-  const menuKey = `add_${menu.menu_id}`
+  const menuKey = `add_${menu.group_key}`
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  同一メニューの増加操作を同じロックで直列化する**

限定食数が残り1食で、同じ `menu_id` のオプション構成A/Bがカートにある場合、両方の「＋」を最初の通信完了前に押すと、ロックが `group_key` ごとなので2件の `addToCart` が並行実行されます。サーバー側の `assertMenuLimitsForCartAdd` は既存カート数を含めず各リクエストの1件だけを検査するため両方が成功し、注文確定時まで上限超過に気づけません。以前の限定食数指摘への修正後も、更新キーが `menu_id` から `group_key` に変更されたことがこの競合を残す新しい根拠です。同じイベント・メニューの増加中は全オプション構成を共通ロックして二重追加を防いでください。

Useful? React with 👍 / 👎.

**コメント要約**: 別オプションの同時追加で限定数を超える。
増加ロックをイベントとメニューで共有する。

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 増加ロックが group_key 単位だと、同じメニューの別オプションを通信完了前に両方押したとき、サーバーはカート内の数を見ないため両方成功しうる。増加中はイベントと menu_id で共通ロックする。手順 4a で修正済み。

---

---

## 評価セッション（2026-10-01 13:55・review-comments-evaluate）

- **評価日時**: 2026-10-01 13:55 JST
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **対象**: ユーザー指定の Open 10件。対象外スレッドは今回の再評価に含めない
- **照合した PR HEAD**: `2d02d19bd121f06ceb0ed4eed2750d6265378f8a`
- **ローカル HEAD**: `1ac9da3d16656bc7fefd56f6f9740217273e2064`。PR より1コミット先行するが、追加差分はお名前シート用の表示調整であり、対象の保存・削除・決済処理の差は無い
- **Outdated 除外件数**: 1件（GraphQL の isOutdated で判定）
- **レビュー非該当スキップ件数**: 0件（指定10件内）
- **新規 RC**: なし。同一論点の重複採番をせず、既存 RC-14 / 23 / 29 / 31 / 32 / 46 / 50 を再評価
- **前提変更**: オプションは未リリース。後からスキーマ変更・backfill が必要になる設計課題はリリース前に解消する。デプロイはメンテナンス下で同時反映する。オプション削除時は店舗メニューの参照も解除する
- **初回評価時の手順4a**: 自動修正0件。未着手5項目は仕様判断または認可経路の影響確認が必要であり、[自動修正ポリシー](../../.agents/skills/review-comments-evaluate/references/auto-fix-policy.md)の共通対象外。今回の成果物は評価と実装方針。ソースコード変更なし
- **初回評価時の検証**: `npm -w common run test -- src/utils/menuOption.test.ts` → 30件成功。Rules エミュレータ、実際の同時削除、Stripe 接続、実データ調査は未実施

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-14 | 4104985599, 4115300334 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 📋 仕様追加 | M | 検証付き Callable に保存を集約し、全項目の型・範囲・ID/名前の重複を Zod で検証。Rules は直接書き込みを禁止した。 |
| [x] | RC-23 | 4110466923 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ | 👀 確認のみ | — | selected_items の不正入力は修正済み<br>配列・要素・件数を確認し invalid-argument を返す |
| [x] | RC-29 | 4111286766, 4114702066, 4114702084, 4114702108 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 独立デプロイに関する3件はコード対応不要<br>メンテナンス中に全対象を反映してから利用を再開する |
| [x] | RC-31 | 5325821161, 4114702125 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 👤 UX | 📋 仕様追加 | M | Stripe product_data.name のみ250コードポイントに制限（超過時は249文字＋…）。注文スナップショット・金額・集約キーは維持した。 |
| [x] | RC-32 | 4111286768, 4114702139 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | M | サーバートランザクションで実際の参照メニューを読み、参照解除と本体削除を一括確定。メニュー保存も参照先を読み、同時参照追加と古い編集による復活を拒否した。 |
| [x] | RC-46 | 4144224625 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 👤 UX | 📋 仕様追加 | M | user_advance の支払合計0円だけ confirmOrder で確定可能にした。サーバー再計算・既存の確定条件・確定後処理を維持し、有料混在は拒否した。 |
| [x] | RC-50 | 4144582288 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 💾 データ | 📋 仕様追加 | M | 認証 UID 配下の option ドキュメントを保存トランザクション内で取得し、欠落・他店舗の参照を拒否。クライアント直書きも禁止した。 |

### 初回評価時の推奨案（下記の実装結果を参照）

1. **RC-14 / RC-50 / RC-32 を一体で対応**。オプション保存・削除、およびメニューのオプション参照を変更する操作を検証付き Callable に集約する案を推奨する。認証した partner と保存先をサーバーで確定し、store の converter 付き ref を使う。オプション項目の完全な検証、同一 partner 内での参照先の実在、メニューの最小合計金額を検査する。UI の検査は操作支援として残す。
2. **削除と参照保存の競合対策**。サーバーのトランザクション内で対象オプションと実際の参照メニューを読み、最新の option_ids から対象を除去して本体削除とまとめて確定する。メニュー保存側も同じオプションをトランザクション内で確認し、同時の参照追加を防ぐ。Rules ではこの経路を迂回する直接変更を禁止する。削除対象をクライアントのキャッシュだけで決めない。原子処理の上限を超える場合も途中まで削除しない。メニュー全体の古い値を再保存せず、必要な参照フィールドだけを更新する。
3. **RC-31**。Stripe に送る商品名だけを250文字以内に省略する。注文スナップショットの完全な選択内容・確定額・集約キーは保持する。
4. **RC-46**。支払合計が0円の user_advance を決済なしで確定できる経路を推奨する。サーバーで合計を確認し、正額を無決済で確定できないことを検証する。0円単独・有料との混在・キャンセルまでを対象にする。

**保存スキーマの変更は、この10件からは必須ではない。** `option_items` 配列、`option_ids` 配列、EventMenu の options、注文の selected_options を維持したまま上記を実現できる。Rules のためだけに項目をサブコレクション化したり、逆引きの参照配列を追加したりする必要はない。新規 Callable の入力 Zod スキーマは common/src/apis に置くが、これは Firestore の保存形式変更とは別である。

この案では形式移行の backfill は原則不要。ただし既存データに不正項目・無効参照が存在しないことは、実データを読んでいないため断定しない。検証環境等で既に作成したデータは、締め付け前に監査し必要なら補正する。補正バッチが必要な場合は AGENTS.md に従い `bokudeli-event-batch` 側で実施し、アプリ本体には schema / converter / store / Rules / テストを整備する。未リリースという理由だけで既存データが空だとは扱わない。

**削除時に残すもの**: 店舗メニューの option_ids からは取り除く。一方、承認済み EventMenu と確定済み注文はその時点の契約内容なので残す。将来の承認・再生成では削除後の店舗メニューをコピーする。既に存在するカートの扱いは承認済み EventMenu のスナップショット方針を維持する。

**リリース運用**: 全対象の更新・確認が完了するまでメンテナンスを維持する。古いタブの再読込と、適用中の注文・承認の停止も手順に含める。この前提が崩れる運用に変更する場合に限り、RC-29 の互換性対策を再検討する。

**実装前に仕様書へ反映する決め**: §5.3・§5.4 の書き込み経路、§4.3.3 の Stripe 用省略ルール、0円参加の確定方法。推奨案の段階であり、今回これらのプロダクト仕様を実装済みに書き換えてはいない。

**公式資料**:

- [Firebase: 各フィールドの型検証](https://firebase.google.com/docs/firestore/security/rules-fields) — list / map 全要素を一括で型検証する短縮記法は無い。最大20要素を個別に検証する Rules 案も可能であり、「Rules では不可能」だから保存形式を変更するという判断はしない。
- [Firebase: トランザクションとバッチ](https://firebase.google.com/docs/firestore/manage-data/transactions) — 原子的な更新と getAfter、Rules のアクセス上限を確認。クライアントで参照先検証を増やす場合は1操作10回・バッチ全体20回の上限も設計に含める。
- [Stripe: 商品名の250文字制限](https://docs.stripe.com/changelog/2018-10-31/names-products-character-limit)

---

**識別子**: RC-14（GitHub id: 4115300334。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:278`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,15 +246,46 @@ service cloud.firestore {
                 // サポートアカウントであれば、運営マネージャーから店舗の開店設定と承認設定を変更できる
                 allow create, update, delete: if isSupport()
             }
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
+                return !('option_ids' in request.resource.data) || isValidOptionIdList(request.resource.data.option_ids);
+            }
+            function optionWriteFieldsValid() {
+                return request.resource.data.option_name is string
+                    && request.resource.data.option_name.size() >= 1
+                    && request.resource.data.option_name.size() <= 40
+                    && request.resource.data.selection in ['single', 'multiple']
+                    && request.resource.data.required is bool
+                    && request.resource.data.option_items is list
+                    && request.resource.data.option_items.size() >= 1
+                    && request.resource.data.option_items.size() <= 20
```

**レビュワーのコメント（原文）**:

`option_items` はリスト型と件数しか検証しておらず、要素ごとの `item_id`・`name`・`price_delta` の型、空文字、差分の範囲を Rules で制限していません。認証済みクライアントが不正な要素を書き込めるため、`PartnerOption` の変換や承認時の `getOptions()` が Zod エラーで失敗し、店舗のオプション／イベント承認を壊せます。各要素を Rules で検証し、その拒否テストも追加してください。

**対応要約**: 検証付き Callable に保存を集約し、全項目の型・範囲・ID/名前の重複を Zod で検証。Rules は直接書き込みを禁止した。

**コメント要約**: option_items の型・範囲・重複を保存時に検証する
旧「仕様対象外」評価をリリース前の方針で再評価

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 💾 データ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 2026-10-01 のユーザーによる修正指示に基づき対応済み。検証付き Callable に保存を集約し、全項目の型・範囲・ID/名前の重複を Zod で検証。Rules は直接書き込みを禁止した。

再評価時点の判断:  Rules はリスト型と件数のみを検証しており、price_delta の非数値・範囲外や不正な item_id などを直書きできる。PartnerOption の AppSchema の parse、getOptions() の全件変換を失敗させる値が保存可能。項目名の空文字など、保存用 DbSchema と読込用 AppSchema で許容範囲が異なる値もあるため、すべての不正値が直ちに読込例外になるとは限らない。旧評価の「§5.3 の対象外」は欠陥が無い根拠にはならず、今回は §5.3・§5.4 の見直しを含めて対応対象とする。項目は 1〜20 件、item_id の非空・一意、name の 1〜40 文字・重複不可、price_delta の整数・-10000〜10000 をサーバーで検証する案を推奨。partner_id と認証・保存先の一致、必要な日時フィールドも確認する。既存配列の保存形式は維持できる。

初回評価時の自動修正判定: 保存を Callable に集約する案は §5.4 の直書き方針と認可境界を変更する。セキュリティ影響範囲と仕様の決定が必要なため自動修正対象外。 後続のユーザー指示「必須事項について修正を進めてください」により実装した。

---

**識別子**: RC-23（GitHub id: 4110466923。既存 RC の再評価）

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

**コメント要約**: selected_items の不正入力は修正済み
配列・要素・件数を確認し invalid-argument を返す

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: common/src/utils/menuOption.ts の resolveEventMenuCartOrder は unknown を受け取り、最大200件の検査、Array.isArray、各要素の option_id/item_id の型・非空を検査してから走査する。memberOrders.ts と enterpriseSubsidyOrders.ts は失敗結果を HttpsError に変換している。今回 common の menuOption.test.ts 30件を実行し全件成功した。指摘の selected_items に関する追加修正は不要。Callable の全入力を包括的に監査したという意味ではない。

自動修正の判定: 既対応のため自動修正不要。

---

**識別子**: RC-29（GitHub id: 4114702066。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventCartDialog.vue:205`

**該当コード（レビュー時点の diff）**:

```diff
@@ -128,6 +205,8 @@ const addCart = async () => {
         {
           menu_id,
           count: selectedCount.value,
+          selected_items: selectedItems.value,
+          presented_menu_price: displayedPrice.value,
```

**レビュワーのコメント（原文）**:

[must] カート画面と Functions のデプロイが独立しているため、片方だけ先に反映される時間帯に金額不整合が起きます。新しい画面を先に配布すると旧 `addToCart` は `selected_items` / `presented_menu_price` を無視して本体価格を保存し、Functions を先に配布すると旧画面は必須オプションを送らず注文できません。互換 rollout または feature gate を用意し、オプション利用を両側が揃った後だけ有効化してください。

**コメント要約**: 独立デプロイに関する3件はコード対応不要
メンテナンス中に全対象を反映してから利用を再開する

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: ユーザーがメンテナンスモード下の同時反映を指定したため、異なるバージョンが通常利用されるリリース窓を許容しない運用とする。Functions・Rules・partner・user・enterprise および承認スナップショットを書き込む画面を反映し、確認後に解除する前提で、互換 API や feature gate は追加しない。適用中の注文・承認を止めることと、再開後の古いタブを更新させることはリリース手順に含める。既存のメンテナンス機構がこの条件を実際に満たすかは本評価では実機確認していない。3コメントは既存 RC-29 と同一論点のため重複採番しない。

自動修正の判定: ユーザー指定の運用方針で対応不要。実デプロイは本タスクの対象外。

---

**識別子**: RC-29（GitHub id: 4114702084。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `common/src/apis/order.ts:5`

**該当コード（レビュー時点の diff）**:

```diff
@@ -1,7 +1,14 @@
+export type AddToCartMenuRequest = {
+  menu_id: string
+  count: number
+  selected_items?: { option_id: string; item_id: string }[]
+  presented_menu_price?: number
```

**レビュワーのコメント（原文）**:

[must] この API 拡張は旧 Functions と後方互換ではありません。新しい画面が先に配信されると、旧 `addToCart` は `selected_items` と `presented_menu_price` を解釈せず本体価格で注文を保存するため、画面表示額と確定注文額が不一致になります。Functions を先にデプロイする順序を CI/運用で保証するか、未対応バックエンドでは新 UI を有効化しない機能ゲートを追加してください。

**コメント要約**: 独立デプロイに関する3件はコード対応不要
メンテナンス中に全対象を反映してから利用を再開する

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: ユーザーがメンテナンスモード下の同時反映を指定したため、異なるバージョンが通常利用されるリリース窓を許容しない運用とする。Functions・Rules・partner・user・enterprise および承認スナップショットを書き込む画面を反映し、確認後に解除する前提で、互換 API や feature gate は追加しない。適用中の注文・承認を止めることと、再開後の古いタブを更新させることはリリース手順に含める。既存のメンテナンス機構がこの条件を実際に満たすかは本評価では実機確認していない。3コメントは既存 RC-29 と同一論点のため重複採番しない。

自動修正の判定: ユーザー指定の運用方針で対応不要。実デプロイは本タスクの対象外。

---

**識別子**: RC-29（GitHub id: 4114702108。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/eventMenuConverter.ts:87`

**該当コード（レビュー時点の diff）**:

```diff
@@ -74,9 +84,24 @@ export function convertFromPartnerMenuToEventMenu(
     menu_sort_number: partnerMenu.menu_sort_number,
     limit_per_event: partnerMenu.limit_per_event,
     is_selected: selectedMenuIds.includes(partnerMenu.menu_id),
+    options,
```

**レビュワーのコメント（原文）**:

[imo] 承認時に `EventMenu.options` を追加する一方、`addToCart` は新しい必須オプションに対して `selected_items` を要求します。各 package のデプロイが独立しているため、旧 Functions が新しい EventMenu の options を無視したり、新 Functions が旧 user/enterprise UI のリクエストを拒否したりするリリース窓があり、料金や注文可否がバージョン順で変わります。UI 先行→Functions 有効化など、互換 rollout または feature gate を定めてください。

**コメント要約**: 独立デプロイに関する3件はコード対応不要
メンテナンス中に全対象を反映してから利用を再開する

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: ユーザーがメンテナンスモード下の同時反映を指定したため、異なるバージョンが通常利用されるリリース窓を許容しない運用とする。Functions・Rules・partner・user・enterprise および承認スナップショットを書き込む画面を反映し、確認後に解除する前提で、互換 API や feature gate は追加しない。適用中の注文・承認を止めることと、再開後の古いタブを更新させることはリリース手順に含める。既存のメンテナンス機構がこの条件を実際に満たすかは本評価では実機確認していない。3コメントは既存 RC-29 と同一論点のため重複採番しない。

自動修正の判定: ユーザー指定の運用方針で対応不要。実デプロイは本タスクの対象外。

---

**識別子**: RC-31（GitHub id: 4114702125。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stripe.ts:243`

**該当コード（レビュー時点の diff）**:

```diff
@@ -236,7 +238,7 @@ export const createStripeCheckoutSession = onCall<
         existing.quantity++
       } else {
         grouped.set(groupKey, {
-          menuName: order.menu_name,
+          menuName: formatOrderMenuDisplayName(order.menu_name, order.selected_options),
```

**レビュワーのコメント（原文）**:

[must] `formatOrderMenuDisplayName` はメニュー名に選択項目名をすべて連結するため、複数選択を多数付けると 250 文字を超え得ます。その値をそのまま Stripe の `product_data.name` に渡すと Checkout Session 作成が Stripe の商品名長制限で失敗し、正しい注文でも決済できません。Stripe 用の名前を上限内にする方針（切り詰め、または明細分割）を決めて適用してください。

**対応要約**: Stripe product_data.name のみ250コードポイントに制限（超過時は249文字＋…）。注文スナップショット・金額・集約キーは維持した。

**コメント要約**: 選択項目の連結で Stripe 商品名の250文字上限を超える
Stripe 用表示名だけを短縮し注文の完全な選択内容は保持する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 2026-10-01 のユーザーによる修正指示に基づき対応済み。Stripe product_data.name のみ250コードポイントに制限（超過時は249文字＋…）。注文スナップショット・金額・集約キーは維持した。

再評価時点の判断:  formatOrderMenuDisplayName は選択項目をすべて連結し、stripe.ts は上限処理なく product_data.name に渡している。項目名40文字を7つ選ぶだけでも上限を超え得る。Stripe 公式仕様で商品名は250文字まで。§4.3.3 に Stripe 用の省略ルールを追加し、メニュー名優先・省略記号込み250文字以内を推奨する。Unicode の途中で切らないこと、短縮した名前で明細を再集約しないこと、Firestore の selected_options・確定金額・共通の完全表示名を変えないことを条件とする。保存スキーマと backfill は不要。

初回評価時の自動修正判定: §4.3.3 は完全表示名を指定しており、省略箇所・表示形式は新たな仕様判断になるため自動修正対象外。 後続のユーザー指示「必須事項について修正を進めてください」により実装した。

---

**識別子**: RC-32（GitHub id: 4114702139。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `partner/src/pages/options.vue:124`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・46 行）
+}
+
+const targetOption: Ref<BokudeliPartnerOption | null> = ref(null)
+const optionDialog = computed({
+  get: () => targetOption.value != null,
+  set: (value) => {
+    if (!value) {
+      targetOption.value = null
+    }
+  },
+})
+
+const createBlankOption = () =>
+  new BokudeliPartnerOption(partnerId, null, {
+    option_items: [{ item_id: crypto.randomUUID(), name: '', price_delta: 0 }],
+  })
+
+const openOptionDialog = (option: BokudeliPartnerOption) => {
+  targetOption.value = new BokudeliPartnerOption(partnerId, option.option_id, {
+    ...option,
+    option_items: option.option_items.map((item) => ({ ...item })),
+  })
+}
+
+const saveOption = async (option: BokudeliPartnerOption) => {
+  try {
+    if (partnerStore.menus == null) {
+      notification.show($t('options.save_error'), 'error')
+      return
+    }
+    if (!option.isValidForDatabase()) {
+      notification.show($t('options.save_error'), 'error')
+      return
+    }
+    const invalidMenu = menus.value.find((menu) => {
+      if (!(menu.option_ids ?? []).includes(option.option_id)) {
+        return false
+      }
+      const attached = (menu.option_ids ?? [])
+        .map((optionId) =>
+          optionId === option.option_id ? option : options.value.find((item) => item.option_id === optionId),
+        )
+        .filter((item): item is BokudeliPartnerOption => item != null)
+      return !isMenuMinTotalValid(menu.menu_price, attached)
+    })
+    if (invalidMenu != null) {
+      notification.show($t('menu_edit_card.error_min_total'), 'error')
+      return
+    }
+    await partnerStore.updateOption(option)
+    notification.show($t('options.saved'), 'success')
+    optionDialog.value = false
+  } catch (e) {
+    console.error(e)
+    notification.show($t('options.save_error'), 'error')
+  }
+}
+
+const onDeleteOption = async (option: BokudeliPartnerOption) => {
+  const result = window.confirm($t('options.delete_confirm'))
+  if (!result) {
+    return
+  }
+  if (partnerStore.menus == null) {
+    notification.show($t('options.delete_error'), 'error')
+    return
+  }
+  try {
+    const attachedMenus = menus.value.filter((menu) => (menu.option_ids ?? []).includes(option.option_id))
+    await Promise.all(
+      attachedMenus.map((menu) => {
+        const next = new BokudeliPartnerMenu(partnerId, menu.menu_id, {
+          ...menu,
+          option_ids: (menu.option_ids ?? []).filter((id) => id !== option.option_id),
+        })
+        return partnerStore.updateMenu(next)
+      }),
+    )
+    await partnerStore.deleteOption(option.option_id)
```

**レビュワーのコメント（原文）**:

[ask] 使用中オプションの参照解除とオプション削除が別々の書き込みです。複数メニューの更新途中で失敗した場合や、更新後に別クライアントが参照を追加した場合、参照を残したままオプションだけ削除する競合が起き、次回の EventMenu スナップショットでメニューが欠落し得ます。メニュー更新と削除を単一の batch / transaction にまとめてください。

**対応要約**: サーバートランザクションで実際の参照メニューを読み、参照解除と本体削除を一括確定。メニュー保存も参照先を読み、同時参照追加と古い編集による復活を拒否した。

**コメント要約**: 参照解除とオプション削除を一体化する
途中失敗と同時参照追加を防ぎ、承認済みの内容は保持する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 2026-10-01 のユーザーによる修正指示に基づき対応済み。サーバートランザクションで実際の参照メニューを読み、参照解除と本体削除を一括確定。メニュー保存も参照先を読み、同時参照追加と古い編集による復活を拒否した。

再評価時点の判断:  現状は参照メニューごとの updateMenu を Promise.all で実行し、すべて成功した後に deleteOption を実行する。正常時は参照解除される。一部更新が失敗した場合、deleteOption には進まないが、成功したメニューの変更は戻らず部分更新が残る。参照一覧取得後に別クライアントが追加した参照や、古い画面からの保存では削除後の参照が残り得る。参照欠落を snapshotPartnerOptionsForMenu が null とし、convertFromPartnerMenuToEventMenu がメニュー全体を除外する。単一 batch は取得済み参照の途中失敗には有効だが、新たな参照追加や直接 delete の抜け道を単独では防げない。RC-50 と一体でサーバー上のトランザクション、保存時の同一オプションの参照検証、クライアント直書き制限を設計する。承認済み EventMenu と確定済み EventMemberOrder のスナップショットは当時の金額・内容のため変更しない。

初回評価時の自動修正判定: 単純な batch 化だけでは要件を満たさず、RC-14/50 と合わせた保存・削除の認可経路変更が必要なため自動修正対象外。 後続のユーザー指示「必須事項について修正を進めてください」により実装した。

---

**識別子**: RC-46（GitHub id: 4144224625。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/menuOption.ts:289`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・196 行）
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
+  const isAttendanceOnlyMenu = input.eventMenu.menu_price === 0 && menu_price === 0
+  if (menu_price < MENU_OPTION_MIN_TOTAL && !isAttendanceOnlyMenu) {
+    return { ok: false, httpsCode: 'invalid-argument', reason: INVALID_MENU_PRICE_MESSAGE }
+  }
+  if (input.presentedMenuPrice != null && input.presentedMenuPrice !== menu_price) {
+    return { ok: false, httpsCode: 'failed-precondition', reason: INVALID_MENU_PRICE_MESSAGE }
+  }
+  return { ok: true, selected_options: validation.selected_options, menu_price }
```

**レビュワーのコメント（原文）**:

[must] 0円の注文なし参加をここで許可すると、`user_advance` のカートでも 0円注文が通りますが、画面側は事前決済を常に Stripe Checkout へ送り、`stripe.ts` は `totalPayment <= 0` を拒否し、`confirmOrder` は `user_advance` を拒否します。この組み合わせでは注文を確定できません。0円の事前決済を決済なしで確定する経路を追加するか、対象の支払い方式をカート検証で明確に制限してください。

**対応要約**: user_advance の支払合計0円だけ confirmOrder で確定可能にした。サーバー再計算・既存の確定条件・確定後処理を維持し、有料混在は拒否した。

**コメント要約**: user_advance の支払合計0円を確定する経路が無い
サーバー再計算で0円の場合のみ決済なし確定を推奨

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 2026-10-01 のユーザーによる修正指示に基づき対応済み。user_advance の支払合計0円だけ confirmOrder で確定可能にした。サーバー再計算・既存の確定条件・確定後処理を維持し、有料混在は拒否した。

再評価時点の判断:  カートは本体0円かつ合計0円を許可するが、cart.vue は user_advance なら常に Stripe、stripe.ts は totalPayment <= 0 を拒否、confirmOrder は user_advance を金額検査前に拒否する。したがって0円メニューだけの注文が確定不能。有料注文と混在して支払合計が正なら同じ条件ではない。既存の「注文なしで参加」を維持するため、確定対象の合計をサーバーが再計算して0円のときだけ confirmOrder を許可し、正額のときは引き続き Checkout を必須にする案を推奨。画面分岐・ボタン文言、キャンセル・通知・決済記録が無い注文の扱いも確認する。EventMenu と EventMemberOrder は既に0円を許容するので、この修正のための必須フィールド追加や backfill は原則不要。

初回評価時の自動修正判定: 支払い方式ごとの無料参加可否と決済なし確定の仕様を決める必要があるため自動修正対象外。 後続のユーザー指示「必須事項について修正を進めてください」により実装した。

---

**識別子**: RC-50（GitHub id: 4144582288。既存 RC の再評価）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:268`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,15 +246,49 @@ service cloud.firestore {
                 // サポートアカウントであれば、運営マネージャーから店舗の開店設定と承認設定を変更できる
                 allow create, update, delete: if isSupport()
             }
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
+                return request.resource.data.menu_description is string
+                    && request.resource.data.menu_description.size() >= 1
+                    && request.resource.data.menu_description.size() <= 300
+                    && (!('option_ids' in request.resource.data) || isValidOptionIdList(request.resource.data.option_ids));
```

**レビュワーのコメント（原文）**:

[must] `option_ids` は配列の形しか検証されておらず、削除済み・存在しない ID や別パートナーの ID を直接 Firestore に保存できます。UI の `saveMenu` 検証を経由しない書き込みでは、承認時にこのメニューが `EventMenu` から黙って除外されるため、メニュー保存時点で同一パートナー配下のオプション参照を検証するか、少なくとも無効参照を拒否するサーバー側経路を追加してください。

**対応要約**: 認証 UID 配下の option ドキュメントを保存トランザクション内で取得し、欠落・他店舗の参照を拒否。クライアント直書きも禁止した。

**コメント要約**: option_ids の実在と同一パートナー所属を保存時に検証する
承認時の除外だけでは参照不整合を防げない

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 💾 データ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 2026-10-01 のユーザーによる修正指示に基づき対応済み。認証 UID 配下の option ドキュメントを保存トランザクション内で取得し、欠落・他店舗の参照を拒否。クライアント直書きも禁止した。

再評価時点の判断:  Rules は配列の件数・非空文字列・重複のみを検証し、参照先を確認していない。Rules テストにも option ドキュメント無しで menu に opt-1 を保存できるケースがある。自店舗の partners/{partnerId}/options/{optionId} の実在を検証し、削除処理と競合しても無効な参照を保存できないようにする。別店舗の ID を書けば別店舗からオプションを読み出す実装ではなく、自店舗配下に対応する ID が無ければ参照欠落になる。§4.2.2 の同一パートナー要件とデータ整合性のため、旧「§5.3 の対象外」判断を見直す。RC-14/32 とまとめて書き込み入口をサーバーへ集約する案を推奨。option_ids 配列を変更する必要はない。

初回評価時の自動修正判定: 認可経路変更と §5.3・§5.4 の仕様見直しが必要なため自動修正対象外。 後続のユーザー指示「必須事項について修正を進めてください」により実装した。

---

## 評価セッション（2026-10-01 14:11・shokujii-code-review）

- **評価日時**: 2026-10-01 14:11 JST
- **評価者**: Codex Agent（`/shokujii-code-review`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **Outdated / レビュー非該当**: 該当なし（ローカル変更のセルフレビュー）
- **実装結果**: ユーザー指示に基づき RC-14 / RC-31 / RC-32 / RC-46 / RC-50 を対応。RC-23 は既存修正を維持、RC-29 は同時メンテナンスデプロイ前提を維持。
- **保存形式**: option_items / option_ids / EventMenu / 注文の保存形式は維持。形式移行の backfill は不要。実環境の不正データ監査・補正は未実施。
- **検証**: lint-and-format 指定の deploy verifier・Vue 型検査ゲート・ビルド・lint・format・各パッケージテストを実施。common lint のテスト内 braces 指摘は修正後再実行して成功。変更後の追加チェックは下記結果に追記。
- **エミュレータ**: 店舗操作8件（参照存在/所属、入力、削除、競合、ロールバック、編集、並び替え等）と0円注文3件に成功。Rules の直書き拒否・公開読取8件に成功。実際の Stripe API・メール送信・ブラウザ操作は未実施（注文確定後処理は呼び出しを検証）。
- **再レビュー**: RC-54 修正後、入力境界・認証店舗固定・直接書き込み禁止・全読取後の一括書込・保存項目維持・0円/正額経路・Functions export・UI エラー処理を再確認。

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-54 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭, 💾 データ | 🔧 微修正 | M | 正の必須オプション削除で残りの最小金額が1円未満になる<br>削除前に残存構成を検証し、失敗時は全体を中止する |

**識別子**: RC-54（GitHub id: なし・エージェントレビュー）

**レビュワー**: Codex Agent（shokujii-code-review）

**指摘箇所**: `functions/default/src/utils/partnerMenuOperations.ts:90`

**該当コード（修正前）**:

```typescript
const menus = await partner.getMenusUsingOption(optionId, transaction)
for (const menu of menus) {
  menu.option_ids = menu.option_ids.filter((id) => id !== optionId)
  await partner.saveMenu(menu, transaction)
}
partner.deleteOption(optionId, transaction)
```

**レビュワーのコメント（原文）**: 正の必須オプションを削除すると、残った値引きオプションとの最小合計が1円未満になる場合があります。削除後の構成を同じトランザクション内で検証し、成立しない場合は本体削除も参照解除も中止してください。

**コメント要約**: オプション削除時も残った構成の最低価格を保証する。

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭, 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 残存オプションを取得して全アクティブ参照メニューを検証後に書き込む。削除拒否の説明を画面に追加した。本体100円・必須加算1000円・値引き500円の構成から必須加算を消すテストで、削除と参照解除が両方とも行われないことを確認した。

**最終チェック結果**: 指定パッケージの通常テスト計1293件成功（common 485 / base 153 / user 45 / partner 1 / enterprise 47 / functions 562）。通常実行でスキップしたエミュレータ依存11件はローカルエミュレータで別途全件成功。Rules 8件も成功。追加した Rules テストファイル単体の lint / format は成功。Rules テスト用ワークスペース全体は既存未変更ファイルの lint 警告（minimumParticipants.test.ts の未使用 context）および format 差異（chatReactions.test.ts、enterprise.test.ts）で失敗し、今回の変更には含めない。ブラウザ実操作、実環境へのデプロイは未実施。

---

## 評価セッション（2026-10-01 15:10・review-comments-evaluate）

- **評価日時**: 2026-10-01 15:10 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **対象**: pending wake `since` 2026-10-01T05:29:52Z 以降（`partial: false`）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（5925368393 レビュー依頼定型文、5375385755 Codex レビュー本体は接続案内のみ）
- **手順 4a 自動修正**: なし（RC-57 は補償方式の選択が必要。RC-58 / RC-60 は 👤 UX。RC-59 は工数 M かつ拒否と分割の二案）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-55 | 5375385918 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot 概要は既存スレッドと新規インラインの再掲<br>新規は RC-57〜RC-60 で扱う |
| [x] | RC-56 | 5925550697 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | トップレベル返信は4件のインライン指摘の再掲<br>個別 RC で扱う |
| [ ] | RC-57 | 4152199953 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | 保存失敗でもメニュー画像だけ更新される<br>成功後アップロードか補償が必要。方式選択のため未修正 |
| [ ] | RC-58 | 4152199771 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 末尾空白違いの項目名を別物として通す<br>trim 後の長さと重複検証が必要。表示の扱いのため未修正 |
| [ ] | RC-59 | 4152199895 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | 参照500件超の削除がトランザクション上限で失敗する<br>§5.4 は全体失敗を許容。明示拒否か分割かの選択が残る |
| [x] | RC-60 | 4152199773 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 保存中も送信でき、二重作成で誤エラーになる<br>保存完了まで loading で再送信できない |

---

**識別子**: RC-55（GitHub id: 5375385918）

**レビュワー**: Copilot

**指摘箇所**: PR レビュー概要

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

画像アップロードの補償処理、500件超の削除処理、仕様書の不整合を解消する必要があります。

**Review effort:** Lite  
**Findings:** 8 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (9)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [参照メニュー500件超でFirestoreトランザクションが失敗する](#discussion_r4152199895) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [0円事前決済注文が確定できない支払い方式の不整合](#discussion_r4144224625)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [オプション削除と参照解除が原子的に実行されない](#discussion_r4114702139)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Stripe商品名が長さ制限を超えて決済に失敗する](#discussion_r4114702125)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [EventMenuとFunctionsの独立デプロイで互換性が崩れる](#discussion_r4114702108)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [新API拡張が旧Functionsと後方互換になっていない](#discussion_r4114702084)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [デプロイ順序の不整合でカート金額と注文可否が変わる](#discussion_r4114702066)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Callable入力の未検証でTypeErrorが500エラーになる](#discussion_r4110466923)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [画像アップロード先行により失敗編集の画像が公開される](#discussion_r4152199953) · New
</details>

<details>
<summary><strong>Resolved since last review (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_idsの存在とパートナー所属を検証していない](#discussion_r4144582288)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各要素をRulesで検証していない](#discussion_r4115300334)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [option_itemsの各項目をRulesで厳格に検証する](#discussion_r4104985599)
</details>

**コメント要約**: Copilot 概要は既存スレッドと新規インラインの再掲
新規は RC-57〜RC-60 で扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 未解決一覧の大半は既存 RC（RC-23 / RC-29 / RC-31 / RC-32 / RC-46 など）の再掲。新規は画像の先行アップロード（RC-57）と削除トランザクション上限（RC-59）。冒頭の「仕様書の不整合」に対応する独立した差分指摘は概要内に無い。

---

**識別子**: RC-56（GitHub id: 5925550697）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル

**該当コード（レビュー時点の diff）**:

（インライン指摘なし）

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

現行差分をチェックリストに沿って確認しました。利用可能な GitHub 操作には新規のインライン review comment を作成する機能がないため、この返信で指摘箇所を報告します。

- 🟡 **修正提案** [🔧微修正/M] `functions/default/src/utils/partnerMenuOperations.ts:100,127-132` — 削除は参照メニューごとに1書込＋オプション削除、並び替えも入力メニューごとに1書込を同一 transaction に追加します。Firestore の transaction は500書込が上限のため、参照数またはメニュー数が上限を超えると削除・並び替えを実行できません。上限超過を明示的に拒否するか、上限を踏まえた更新方式が必要です。
- 🚨 **必須修正** [🔧微修正/M] `base/src/stores/partner.ts:251-254` — メニュー画像を既存の固定 Storage パスへ上書きした後に Callable を呼びます。Callable が競合やサーバー検証で失敗しても画像は戻らず、旧メニュー情報のまま画像だけが変わります。このパスは承認時のスナップショットにも使われるため、一時パスまたは失敗時の補償が必要です。
- 🟡 **修正提案** [🔧微修正/S] `common/src/schemas/menuOption.ts:20,61-64` — 項目名の重複判定は完全一致のみです。末尾空白などの違いは画面上で同じ選択肢に見え得るため、trim 後に長さと重複を検証することを推奨します。
- 🟡 **修正提案** [🔧微修正/S] `partner/src/components/OptionEditCard.vue:130` — 保存中も送信ボタンが有効なため、新規オプションを連続送信すると片方の Callable が `already-exists` になり、保存成功後にエラー通知が出る可能性があります。保存中は loading/disabled にしてください。

CI は PR verify #662 と Test Firestore Rules #727 が成功しており、確認した範囲で失敗はありません。

**コメント要約**: トップレベル返信は4件のインライン指摘の再掲
個別 RC で扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 画像（RC-57）、項目名の空白（RC-58）、トランザクション上限（RC-59）、二重送信（RC-60）と同じ内容。並び替えも 500 書込に当たる点は RC-59 の判断に含めた。

---

**識別子**: RC-57（GitHub id: 4152199953）

**レビュワー**: Copilot

**指摘箇所**: `base/src/stores/partner.ts:254`

**該当コード（レビュー時点の diff）**:

```diff
@@ -209,43 +251,58 @@ export const usePartnerStore = (partnerId: string) => {
         await uploadImage(image, getMenuImageStoragePath(partnerRef.id, data.menu_id))
         _menuImageCacheBusters.value = new Map(_menuImageCacheBusters.value).set(data.menu_id, Date.now())
       }
-      const menuRef = doc(partnerRef, 'menus', data.menu_id).withConverter(menuConverter)
-      return await setDoc(menuRef, data, { merge: true })
+      return await savePartnerMenu({
```

**レビュワーのコメント（原文）**:

[must] 画像を Storage にアップロードしてから Callable を呼ぶため、Callable がオプション欠落・最低価格違反・競合などで拒否されても、メニュー文書は旧値のまま画像だけが更新されます。画像パスは menu_id 固定で承認時のスナップショットが後からコピーするため、失敗した編集の画像が公開され得ます。成功後にアップロードするか、失敗時に新規画像を削除する補償処理／一時パスを導入してください。

**コメント要約**: 保存失敗でもメニュー画像だけ更新される
成功後アップロードか補償が必要。方式選択のため未修正

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `updateMenu` は固定 Storage パスへ上書きしてから `savePartnerMenu` を呼ぶ。Callable がオプション欠落・最小合計・競合で拒否しても画像は戻り、承認時スナップショット（`eventMenusSnapshot.ts`）がそのパスをコピーする。失敗した編集の画像が公開され得る。成功後アップロード、失敗時削除、一時パスのどれにするかは仕様書に無く、失敗時削除は上書き済みの旧画像を戻せない。方式の選択が必要なため自動修正しない。

---

**識別子**: RC-58（GitHub id: 4152199771）

**レビュワー**: Codex

**指摘箇所**: `common/src/schemas/menuOption.ts:20`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,64 @@
+import { z } from 'zod'
+
+export const OPTION_SELECTION_VALUES = ['single', 'multiple'] as const
+export type OptionSelectionType = (typeof OPTION_SELECTION_VALUES)[number]
+
+export const PRICE_DELTA_MIN = -10000
+export const PRICE_DELTA_MAX = 10000
+export const MENU_OPTION_IDS_MAX = 10
+export const OPTION_ITEMS_MAX = 20
+
+function hasUniqueValues(values: readonly string[]): boolean {
+  return new Set(values).size === values.length
+}
+
+export const OptionIdListSchema = z.array(z.string().nonempty()).max(MENU_OPTION_IDS_MAX).refine(hasUniqueValues)
+export const OptionSelectionSchema = z.enum(OPTION_SELECTION_VALUES)
+
+export const OptionItemSchema = z.object({
+  item_id: z.string().nonempty(),
+  name: z.string().min(1).max(40),
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  空白を正規化して項目名の重複を拒否する**

`「大盛」` と `「大盛 」` のように末尾空白だけが異なる項目名は、現在のスキーマと `hasDuplicateOptionItemNames` を通過しますが、画面では空白が折り畳まれて同じ選択肢に見えます。異なる価格差を持つ見分け不能な項目を注文できてしまうため、項目名を `trim()` してから長さと重複を検証してください。

Useful? React with 👍 / 👎.

**コメント要約**: 末尾空白違いの項目名を別物として通す
trim 後の長さと重複検証が必要。表示の扱いのため未修正

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: `OptionItemSchema` と `hasDuplicateOptionItemNames` は完全一致のみで、末尾空白違いを別項目として保存できる。画面上は同じに見え、価格差だけが異なる選択肢になり得る。指摘は妥当。保存値を trim するか比較だけ trim するかで既存データとスナップショットの見た目が変わるため、👤 UX の自動修正対象外とした。

---

**識別子**: RC-59（GitHub id: 4152199895）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/utils/partnerMenuOperations.ts:101`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・22 行）
+function authenticatedPartner(request: PartnerRequest): Partner {
+  const uid = request.auth?.uid
+  if (uid == null) throw new HttpsError('unauthenticated', '認証が必要です')
+  // 保存先をリクエストから受け取らず、認証した店舗に固定する。
+  return new Partner(uid)
+}
+
+function assertMenuOptions(menu: PartnerMenu, options: PartnerOption[]): void {
+  if (findMissingOptionIds(menu.option_ids, options).length > 0) {
+    throw new HttpsError('failed-precondition', '削除済み、または自店舗に存在しないオプションが含まれています')
+  }
+  const attached = options.filter((option) => menu.option_ids.includes(option.id))
+  if (!isMenuMinTotalValid(menu.menu_price, attached)) {
+    throw new HttpsError('invalid-argument', MENU_MIN_TOTAL_INVALID_MESSAGE)
+  }
+}
+
+export async function savePartnerMenuHandler(request: PartnerRequest): Promise<void> {
+  const partner = authenticatedPartner(request)
+  const parsed = SavePartnerMenuRequestSchema.safeParse(request.data)
+  if (!parsed.success) throw new HttpsError('invalid-argument', 'メニューの入力が正しくありません')
+  const input = parsed.data
+  await getFirestore().runTransaction(async (transaction) => {
+    const existing = await partner.getMenu(input.menu_id, transaction)
+    if (existing?.is_deleted === true) throw new HttpsError('not-found', 'メニューは削除されています')
+    // オプションの読取を同じトランザクションに含め、削除・編集と直列化する。
+    const loaded = await Promise.all(input.option_ids.map((id) => partner.getOption(id, transaction)))
+    const options = loaded.filter((option): option is PartnerOption => option != null)
+    const menu = new PartnerMenu(partner.id, input.menu_id, {
+      ...existing,
+      ...input,
+      menu_sort_number: existing?.menu_sort_number ?? input.menu_sort_number,
+    })
+    assertMenuOptions(menu, options)
+    await partner.saveMenu(menu, transaction)
+  })
+}
+
+export async function savePartnerOptionHandler(request: PartnerRequest): Promise<void> {
+  const partner = authenticatedPartner(request)
+  const parsed = SavePartnerOptionRequestSchema.safeParse(request.data)
+  if (!parsed.success) throw new HttpsError('invalid-argument', 'オプションの入力が正しくありません')
+  const input = parsed.data
+  await getFirestore().runTransaction(async (transaction) => {
+    const existing = await partner.getOption(input.option_id, transaction)
+    if (input.create && existing != null) throw new HttpsError('already-exists', 'オプションは既に存在します')
+    if (!input.create && existing == null) throw new HttpsError('not-found', 'オプションは削除されています')
+    const option = new PartnerOption(partner.id, input.option_id, {
+      ...existing,
+      ...input,
+      option_description: input.option_description,
+    })
+    const menus = await partner.getMenusUsingOption(input.option_id, transaction)
+    const options = await partner.getOptions(transaction)
+    const nextOptions = [...options.filter((item) => item.id !== option.id), option]
+    for (const menu of menus) {
+      if (!menu.is_deleted) assertMenuOptions(menu, nextOptions)
+    }
+    partner.saveOption(option, transaction)
+  })
+}
+
+export async function deletePartnerOptionHandler(request: PartnerRequest): Promise<void> {
+  const partner = authenticatedPartner(request)
+  const parsed = DeletePartnerOptionRequestSchema.safeParse(request.data)
+  if (!parsed.success) throw new HttpsError('invalid-argument', 'オプションIDが正しくありません')
+  const { option_id: optionId } = parsed.data
+  await getFirestore().runTransaction(async (transaction) => {
+    // 参照追加側と同じドキュメントを読む。キャッシュに無いメニューも解除対象にする。
+    await partner.getOption(optionId, transaction)
+    const menus = await partner.getMenusUsingOption(optionId, transaction)
+    const options = await partner.getOptions(transaction)
+    const remainingOptions = options.filter((option) => option.id !== optionId)
+    for (const menu of menus) {
+      menu.option_ids = menu.option_ids.filter((id) => id !== optionId)
+      if (!menu.is_deleted) assertMenuOptions(menu, remainingOptions)
+    }
+    // store 内では同じ transaction に write を追加し、全件を一度に commit する。
+    await Promise.all(menus.map((menu) => partner.saveMenu(menu, transaction)))
+    partner.deleteOption(optionId, transaction)
```

**レビュワーのコメント（原文）**:

[must] 参照メニューを全件 `transaction.set` したうえでオプション本体を1件書き込むため、参照するメニューが500件以上あると Firestore のトランザクション書き込み上限（500件）を超えて削除が常に失敗します。オプションは複数メニューで共有でき、参照数の上限もこのAPIにないため、削除可能件数を明示的に拒否するか、原子性要件を含めて分割・非同期化を設計してください。

**コメント要約**: 参照500件超の削除がトランザクション上限で失敗する
§5.4 は全体失敗を許容。明示拒否か分割かの選択が残る

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 削除は参照メニューごとの `saveMenu` とオプション削除を同一トランザクションに載せる。500 書込を超えると Firestore が拒否し、部分更新は残らない。仕様 §5.4 は「トランザクション上限超過時は全体を失敗させる」と明記しており、サイレントな不整合ではない。並び替え（RC-56 で併記）も `menu_ids` の件数上限が無く同じ上限に当たる。明示的な `failed-precondition` にするか、原子性を保った分割にするかは方針選択であり、工数 M のため自動修正しない。

---

**識別子**: RC-60（GitHub id: 4152199773）

**レビュワー**: Codex

**指摘箇所**: `partner/src/components/OptionEditCard.vue:130`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・51 行）
+
+const handleSubmit = () => {
+  if (!isValid.value || !option.value.isValidForDatabase()) {
+    return
+  }
+  emit('save', option.value)
+}
+</script>
+
+<template>
+  <v-form v-model="isValid" @submit.prevent="handleSubmit">
+    <v-card class="pa-4">
+      <template #title>
+        <div class="text-h4">
+          <slot name="title" />
+        </div>
+      </template>
+      <v-card-text class="d-flex flex-column ga-4">
+        <v-text-field
+          v-model="option.option_name"
+          :label="$t('option_edit_card.name')"
+          :rules="[requiredValidator, (v: string) => maxLengthValidator(v, 40)]"
+        />
+        <v-textarea
+          v-model="option.option_description"
+          :label="$t('option_edit_card.description')"
+          :rules="[(v: string) => maxLengthValidator(v ?? '', 200)]"
+          rows="2"
+        />
+        <div>
+          <v-radio-group v-model="option.selection" :label="$t('option_edit_card.selection')" inline hide-details>
+            <v-radio :label="$t('option_edit_card.selection_single')" value="single" />
+            <v-radio :label="$t('option_edit_card.selection_multiple')" value="multiple" />
+          </v-radio-group>
+          <p class="option-edit-card__hint option-edit-card__hint--lines">
+            {{ $t('option_edit_card.selection_hint') }}
+          </p>
+        </div>
+        <div>
+          <v-switch v-model="option.required" :label="$t('option_edit_card.required')" color="primary" hide-details />
+          <p class="option-edit-card__hint">{{ $t('option_edit_card.required_hint') }}</p>
+        </div>
+        <div>
+          <div class="text-subtitle-2 mb-2">{{ $t('option_edit_card.items') }}</div>
+          <div
+            v-for="item in option.option_items"
+            :key="item.item_id"
+            class="option-edit-card__item d-flex align-start ga-2 mb-2"
+          >
+            <v-text-field
+              v-model="item.name"
+              class="option-edit-card__item-name"
+              :label="$t('option_edit_card.item_name')"
+              :rules="[requiredValidator, (v: string) => maxLengthValidator(v, 40), uniqueItemNameRule]"
+              density="compact"
+            />
+            <v-text-field
+              v-model.number="item.price_delta"
+              class="option-edit-card__price-delta"
+              type="number"
+              :label="$t('option_edit_card.price_delta')"
+              :min="PRICE_DELTA_MIN"
+              :max="PRICE_DELTA_MAX"
+              :rules="[priceDeltaRule]"
+              density="compact"
+            />
+            <v-btn class="flex-shrink-0" variant="text" @click="removeItem(item.item_id)">
+              {{ $t('option_edit_card.remove_item') }}
+            </v-btn>
+          </div>
+          <v-btn variant="tonal" :disabled="option.option_items.length >= 20" @click="addItem">
+            {{ $t('option_edit_card.add_item') }}
+          </v-btn>
+          <p class="text-caption text-medium-emphasis mt-2">{{ itemCountRule() === true ? '' : itemCountRule() }}</p>
+        </div>
+      </v-card-text>
+      <template #actions>
+        <v-spacer />
+        <v-btn variant="plain" @click="$emit('cancel')">{{ $t('option_edit_card.close') }}</v-btn>
+        <v-btn type="submit" :disabled="!isValid || !option.isValidForDatabase()" variant="tonal">
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  保存中はオプションフォームの再送信を防ぐ**

新規オプションの保存通信中も送信ボタンが有効なため、ダブルクリックすると同じ ID と `create: true` で Callable が2回実行されます。先に完了した処理で作成された後、もう一方は `already-exists` になり、実際には保存済みなのに汎用の保存エラーが表示されるため、保存完了までボタンを loading/disabled にして再送信を防いでください。

Useful? React with 👍 / 👎.

**コメント要約**: 保存中も送信でき、二重作成で誤エラーになる
保存完了まで loading で再送信できない

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 送信開始で `isSaving` を立て、完了まで保存ボタンを loading/disabled にする。Enter による再送信も `handleSubmit` で止める。失敗時はフラグを戻して再保存できる。メニュー編集も同じにした。

---

## 評価セッション（2026-10-01 15:13・review-comments-evaluate）

- **評価日時**: 2026-10-01 15:13 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 0
- **新規 RC なし**: Copilot overview（GitHub id: 5375385918、RC-55）の Open 9 件は、いずれも既存 RC と同一 GitHub id。`created_at` が 2026-10-01 15:10 セッションより新しいコメントは 0 件。現行コードで再確認した。
- **手順 4a 自動修正**: なし（新規の自動修正対象なし。未着手は RC-57 / RC-58 / RC-59 / RC-60 のまま）

### Open 9 件の再確認

| Copilot の項目 | GitHub id | 既存 RC | 現行の判断 |
| :--- | :--- | :--- | :--- |
| 参照メニュー500件超で Firestore トランザクションが失敗する | 4152199895 | RC-59 | 🟡 未着手。§5.4 は全体失敗を許容。明示拒否か分割かは未決 |
| 0円事前決済注文が確定できない支払い方式の不整合 | 4144224625 | RC-46 | ✅ 対応済み。`user_advance` かつ支払合計 0 円だけ `confirmOrder` で確定する |
| オプション削除と参照解除が原子的に実行されない | 4114702139 | RC-32 | ✅ 対応済み。参照解除と本体削除は同一トランザクション |
| Stripe 商品名が長さ制限を超えて決済に失敗する | 4114702125 | RC-31 | ✅ 対応済み。`formatStripeProductName` が 250 コードポイントで切る |
| EventMenu と Functions の独立デプロイで互換性が崩れる | 4114702108 | RC-29 | 👌 修正不要。メンテナンス中の同時反映 |
| 新 API 拡張が旧 Functions と後方互換になっていない | 4114702084 | RC-29 | 👌 修正不要。同上 |
| デプロイ順序の不整合でカート金額と注文可否が変わる | 4114702066 | RC-29 | 👌 修正不要。同上 |
| Callable 入力の未検証で TypeError が 500 エラーになる | 4110466923 | RC-23 | ✅ 対応済み。`selected_items` は配列・要素を見て `invalid-argument` |
| 画像アップロード先行により失敗編集の画像が公開される | 4152199953 | RC-57 | 🚨 未着手。`updateMenu` は今も Callable の前に固定パスへ上書きする |

GitHub 上で Open のままなのは、スレッドが Resolve されていないため。コード未対応なのは RC-57 と RC-59（および概要外の RC-58）。RC-60 は保存中の再送信防止を実装済み。

---

---

## 評価セッション（2026-10-01 16:05・review-comments-evaluate）

- **評価日時**: 2026-10-01 16:05 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-10-01T06:47:13Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼定型文 GitHub id 5926216735、Codex 接続案内 GitHub id 5375925183）
- **同一指摘のため RC 採番しない**: Copilot 返信 5926250156、Copilot overview 5375898003、インライン 4152639336（RC-58）、4152639410（RC-59）、4152662493（RC-57）
- **手順 4a 自動修正**: RC-61（🚨 1件）。RC-62 は 👤 UX のため自動修正しない

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-61 | 4152662508 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | NUL 連結の選択キーが別項目を加算する<br>option_id ごとの Set で照合する |
| [ ] | RC-62 | 4152662502 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 名札のメニュー名を UTF-16 単位で切る<br>絵文字境界で孤立サロゲートになる |

---

**識別子**: RC-61（GitHub id: 4152662508）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/src/utils/menuOption.ts:133`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・54 行）
+export function computeMenuMinTotal(menuPrice: number, options: readonly MenuOptionDefinition[]): number {
+  return menuPrice + options.reduce((sum, option) => sum + computeOptionMinDelta(option), 0)
+}
+
+export function isMenuMinTotalValid(menuPrice: number, options: readonly MenuOptionDefinition[]): boolean {
+  return computeMenuMinTotal(menuPrice, options) >= MENU_OPTION_MIN_TOTAL
+}
+
+export function getSelectedOptionsForGroupKey(
+  selectedOptions?: readonly SelectedOptionType[] | null,
+): SelectedOptionType[] {
+  if (selectedOptions == null || selectedOptions.length === 0) {
+    return []
+  }
+  return [...selectedOptions].sort((a, b) => {
+    if (a.option_id === b.option_id) {
+      return a.item_id > b.item_id ? 1 : a.item_id < b.item_id ? -1 : 0
+    }
+    return a.option_id > b.option_id ? 1 : -1
+  })
+}
+
+export function getOrderMenuGroupKey(order: OrderMenuGroupInput): string {
+  const selected = getSelectedOptionsForGroupKey(order.selected_options)
+  const selectedPart = JSON.stringify(selected.map((item) => [item.option_id, item.item_id]))
+  return `${order.menu_id}\u0000${selectedPart}\u0000${order.menu_price}`
+}
+
+export function getStripeLineItemGroupKey(order: OrderMenuGroupInput, selfPayUnitAmount: number): string {
+  return `${getOrderMenuGroupKey(order)}\u0000${selfPayUnitAmount}`
+}
+
+export function sumSelectedPriceDelta(selectedOptions: readonly SelectedOptionType[]): number {
+  return selectedOptions.reduce((sum, item) => sum + item.price_delta, 0)
+}
+
+export type MenuPriceSplit = {
+  basePrice: number
+  optionPrice: number
+}
+
+/** 注文に保存された込み単価を、当時の本体とオプション差額合計に分ける。選択が無いときはオプション 0。 */
+export function splitMenuPrice(
+  menuPrice: number,
+  selectedOptions?: readonly SelectedOptionType[] | null,
+): MenuPriceSplit {
+  const optionPrice = sumSelectedPriceDelta(selectedOptions ?? [])
+  return { basePrice: menuPrice - optionPrice, optionPrice }
+}
+
+export type MenuPriceLine = {
+  name: string
+  amount: number
+}
+
+/** 選択があるとき、メニュー本体と各項目の金額行を定義順で返す。選択が無いときは空。 */
+export function buildMenuPriceLines(
+  menuName: string,
+  menuPrice: number,
+  selectedOptions?: readonly SelectedOptionType[] | null,
+): MenuPriceLine[] {
+  if (selectedOptions == null || selectedOptions.length === 0) {
+    return []
+  }
+  const split = splitMenuPrice(menuPrice, selectedOptions)
+  return [
+    { name: menuName, amount: split.basePrice },
+    ...selectedOptions.map((item) => ({ name: item.item_name, amount: item.price_delta })),
+  ]
+}
+
+export function buildSelectedOptionsInDefinitionOrder(
+  optionDefs: readonly MenuOptionDefinition[],
+  selectedItems: readonly CartSelectedItemType[],
+): SelectedOptionType[] {
+  const selected = new Set(selectedItems.map((item) => `${item.option_id}\u0000${item.item_id}`))
+  const result: SelectedOptionType[] = []
+  for (const option of optionDefs) {
+    for (const item of option.option_items) {
+      if (selected.has(`${option.option_id}\u0000${item.item_id}`)) {
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  選択キーを区切り文字の連結で生成しない**

`option_id` と `item_id` はどちらも `\u0000` を拒否していないため、例えば選択した組 `('a', 'b\u0000c')` と未選択の組 `('a\u0000b', 'c')` が同じキーになります。この定義で前者だけを選んでも `buildSelectedOptionsInDefinitionOrder` が後者まで `selected_options` に追加し、その `price_delta` も請求額へ加算します。タプルをJSON化するか、オプションIDごとの入れ子のSetで選択を照合してください。

Useful? React with 👍 / 👎.

**コメント要約**: NUL 連結の選択キーが別項目を加算する。
option_id ごとの Set で照合する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: スキーマは option_id と item_id に NUL を許す。連結した文字列を Set にすると、選択した組と別定義の組が同じキーになり、選んでいない項目の price_delta が加算される。option_id をキーにした item_id の Set で照合し、衝突する ID のテストを追加した。

---

**識別子**: RC-62（GitHub id: 4152662502）

**レビュワー**: chatgpt-codex-connector[bot]

**指摘箇所**: `common/src/utils/menuOption.ts:219`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・140 行）
+        })
+      }
+    }
+  }
+  return result
+}
+
+export type CartOptionValidationResult =
+  | { ok: true; selected_options: SelectedOptionType[]; price_delta: number }
+  | { ok: false; reason: string }
+
+export function validateCartOptionSelection(
+  optionDefs: readonly MenuOptionDefinition[],
+  selectedItems: readonly CartSelectedItemType[],
+): CartOptionValidationResult {
+  if (selectedItems.length > CART_SELECTED_ITEMS_MAX) {
+    return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+  }
+  const optionById = new Map(optionDefs.map((option) => [option.option_id, option]))
+  for (const selected of selectedItems) {
+    const option = optionById.get(selected.option_id)
+    if (option == null) {
+      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+    }
+    if (!option.option_items.some((item) => item.item_id === selected.item_id)) {
+      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+    }
+  }
+
+  for (const option of optionDefs) {
+    const chosen = selectedItems.filter((item) => item.option_id === option.option_id)
+    const uniqueItemIds = new Set(chosen.map((item) => item.item_id))
+    if (uniqueItemIds.size !== chosen.length) {
+      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+    }
+    if (option.selection === 'single' && chosen.length > 1) {
+      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+    }
+    if (option.required && chosen.length === 0) {
+      return { ok: false, reason: INVALID_OPTION_SELECTION_MESSAGE }
+    }
+  }
+
+  const selected_options = buildSelectedOptionsInDefinitionOrder(optionDefs, selectedItems)
+  return { ok: true, selected_options, price_delta: sumSelectedPriceDelta(selected_options) }
+}
+
+export function computeOrderMenuPrice(basePrice: number, selectedOptions: readonly SelectedOptionType[]): number {
+  return basePrice + sumSelectedPriceDelta(selectedOptions)
+}
+
+export const NAMES_PRINT_MAX_MENU_LABEL_LENGTH = 32
+
+/** 名札のユーザー名。2行に収まる文字数で、超えた分は末尾を … にする */
+export const NAMES_PRINT_MAX_USER_NAME_LENGTH = 13
+
+export function formatNamesPrintUserName(userName: string, maxLength = NAMES_PRINT_MAX_USER_NAME_LENGTH): string {
+  const normalized = userName.normalize('NFKC')
+  if (normalized.length <= maxLength) {
+    return normalized
+  }
+  const ellipsis = '…'
+  return `${normalized.slice(0, Math.max(0, maxLength - ellipsis.length))}${ellipsis}`
+}
+
+export function formatSelectedOptionItemNames(selectedOptions?: readonly SelectedOptionType[] | null): string {
+  if (selectedOptions == null || selectedOptions.length === 0) {
+    return ''
+  }
+  return selectedOptions.map((item) => item.item_name).join('、')
+}
+
+export function formatNamesPrintMenuLabel(
+  menuName: string,
+  selectedOptions?: readonly SelectedOptionType[] | null,
+  maxLength = NAMES_PRINT_MAX_MENU_LABEL_LENGTH,
+): string {
+  const normalizedName = menuName.normalize('NFKC')
+  if (normalizedName.length >= maxLength) {
+    return normalizedName.slice(0, maxLength)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Unicode 文字をコードポイント単位で切り詰める**

メニュー名の32文字境界に絵文字などのサロゲートペアが掛かる場合、UTF-16コードユニット単位の `slice` がペアの途中で文字列を切断します。例えば「あ」31文字の後に絵文字がある名前は末尾が孤立した高位サロゲートになり、お名前シートで置換文字や不正な表示になります。`Array.from(normalizedName)` などでコードポイント配列にしてから上限まで切り詰めてください。

Useful? React with 👍 / 👎.

**コメント要約**: 名札のメニュー名を UTF-16 単位で切る。
絵文字境界で孤立サロゲートになる

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: formatNamesPrintMenuLabel は String.length と slice で切るため、絵文字が 32 文字境界に掛かると高位サロゲートだけが残る。formatNamesPrintUserName も同じ切り方である。名札の見た目の切り詰めは 👤 UX のため自動修正しない。直すならコードポイント配列で切る。

---

---

## 評価セッション（2026-10-01 16:33・review-comments-evaluate）

- **評価日時**: 2026-10-01 16:33 JST
- **評価者**: Cursor Agent（`/review-comments-evaluate`）
- **ブランチ名**: `feat/2366`
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2367
- **since**: 2026-10-01T07:21:45Z
- **partial**: true（sentinel）。Codex は `Didn't find any major issues` の問題なしサマリ。limits 文言は無い
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 2（依頼定型文 GitHub id 5926693376、Codex 問題なし GitHub id 5926757074）
- **同一指摘のため RC 採番しない**: Copilot overview 5376201574。インライン 4152871227 とトップレベル 5926768347 の名札切りは RC-62。同コメントの画像先行は RC-57、項目名 trim は RC-58、削除と並び替えの 500 件上限は RC-59
- **手順 4a 自動修正**: RC-64（🚨 1件）。RC-65 は legacy manager の扱いが仕様判断のため自動修正しない。RC-63 は 👌

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | RC-63 | 4152871098 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | __proto__ を選択キーにすると必須選択が消える<br>参照 ID は __ で囲む値を既に拒否する |
| [x] | RC-64 | 5926768347 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | カート追加中に閉じると二重注文できる<br>追加中は閉じられず、開始時にも実行中を拒否する |
| [ ] | RC-65 | 4152871178 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 🔒 セキュリティ | 📋 仕様追加 | L | legacy manager のメニュー直書きが Rules で失敗する<br>移行か配信停止かの判断が残る |

---

**識別子**: RC-63（GitHub id: 4152871098）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventCartDialog.vue:81`

**該当コード（レビュー時点の diff）**:

```diff
@@ -65,16 +68,83 @@ const countOptions = computed(() => {
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
```

**レビュワーのコメント（原文）**:

[must] `option_id` は Callable の `PartnerDocumentIdSchema` で `__proto__` を拒否しておらず、Firestore から来る有効な ID がこの plain object の特殊キーに入る可能性があります。`initial['__proto__'] = ...` は通常の own property にならないため、必須選択が `Object.entries` から消えてカート追加が失敗します。選択状態を `Map` で管理するなど、プロトタイプを持たないキー管理にしてください。

**コメント要約**: __proto__ を選択キーにすると必須選択が消える。
参照 ID は __ で囲む値を既に拒否する

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: PartnerDocumentIdSchema は `__` で始まり `__` で終わる ID を拒否し、テストも `__reserved__` を拒否している。Firestore のドキュメント ID も同じ制約のため、option_id が `__proto__` になる経路はない。

---

**識別子**: RC-64（GitHub id: 5926768347）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/EventCartDialog.vue:160`

**該当コード（レビュー時点）**:

```ts
const closeDialog = () => {
  isAddingOrder.value = false
  selectedCount.value = 1
  addErrorMessage.value = ''
  isOpen.value = false
}

const addCart = async () => {
  if (eventStore.event == null) {
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

現行 HEAD `17f521b5` の差分を確認しました。利用可能な GitHub 操作では Files changed へのインライン投稿ができないため、該当箇所ごとに指摘します。

- 🚨 **必須修正** `base/src/components/EventCartDialog.vue:160-194` — `closeDialog()` が通信中に `isAddingOrder` を解除し、`addCart()` の開始時にも二重実行ガードがありません。追加中に閉じて再度開く、または連打すると同じ Callable が並行し、注文が二重登録され得ます。実行中は閉じる操作を止め、ハンドラ先頭でも実行中を拒否してください。
- 🚨 **必須修正** `base/src/stores/partner.ts:251-254` — メニュー保存 Callable の前に既存と同じ Storage パスへ画像を上書きしています。Callable が検証・競合で失敗しても画像だけ変わり、既存メニュー／承認時スナップショットと不整合になります。成功後に参照を切り替える方式か、失敗時に旧画像を維持する補償が必要です。
- 🟡 **修正提案** `functions/default/src/utils/partnerMenuOperations.ts:99-101` — 参照メニューを全件書き込んだ後にオプションも削除するため、参照が500件以上だと transaction の書込上限を超えて削除が失敗します。原子性を保つ方式を設計するか、上限超過を明示的に拒否してください。
- 🟡 **修正提案** `common/src/apis/partnerMenu.ts:54-57` — 並び替え ID 数に上限がなく、501件以上で transaction の書込上限を超えます。入力 schema で許容件数を制限し、上限超過を利用者に分かるエラーにしてください。
- 🟡 **修正提案** `common/src/schemas/menuOption.ts:20,61-64` — `name` は空白のみでも通り、重複判定も trim 前の完全一致です。例えば末尾空白だけ異なる項目を別項目として保存でき、選択肢が表示上同じに見える場合があります。trim 後に空文字・長さ・重複を検証してください。
- 🟡 **修正提案** `common/src/utils/menuOption.ts:226-228,242-244` — `length` / `slice` は UTF-16 コード単位で切るため、絵文字の途中で切れて孤立サロゲートが生成されます。コードポイント単位で上限を適用してください。

CI は確認時点で Test Firestore Rules #732 が成功、PR verify #666 は lint 成功後の残りの検証が実行中でした。

**コメント要約**: カート追加中に閉じると二重注文できる。
追加中は閉じられず、開始時にも実行中を拒否する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: closeDialog が通信中に isAddingOrder を下ろすと、同じ Callable が並行して注文が二重になる。追加中はダイアログを persistent にし、閉じる操作と addCart の先頭で実行中を拒否する。成功時だけ resetAndClose で閉じる。同じコメントの画像先行、項目名、500 件上限、名札の文字切りは RC-57、RC-58、RC-59、RC-62 の再掲である。

---

**識別子**: RC-65（GitHub id: 4152871178）

**レビュワー**: Copilot

**指摘箇所**: `firestore.rules:253`

**該当コード（レビュー時点の diff）**:

```diff
@@ -246,15 +246,15 @@ service cloud.firestore {
                 // サポートアカウントであれば、運営マネージャーから店舗の開店設定と承認設定を変更できる
                 allow create, update, delete: if isSupport()
             }
+            // オプションの参照整合性・項目検証・原子的な削除は Callable で保証する。
+            // 店舗本人も直書きでは保存・削除できない。
             match /menus/{menu} {
                 allow read: if true
-                // メニュー情報はログインした店舗アカウントでないと create/update/deleteできない
-                allow create, update, delete: if request.auth != null && request.auth.uid == partner_id
+                allow write: if false
```

**レビュワーのコメント（原文）**:

[must] `allow write: if false` にすると、まだ `firebase.json:37-38` で配信対象になっている legacy `manager` の `Menu.vue` / `ModalMenuForm.vue` が行っている menus への create/update/delete がすべて失敗します。manager を同時に Callable 経由へ移行するか、配信停止を同じ変更で完了するまで、この Rules 変更はマージできません。

**コメント要約**: legacy manager のメニュー直書きが Rules で失敗する。
移行か配信停止かの判断が残る

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: L

**判断理由**: firebase.json は manager を配信対象のままにしている。menus の直書き禁止は店舗画面を Callable に移すこの PR の意図だが、legacy manager の Menu.vue はまだ直書きする。Rules を戻すと直書き禁止が崩れ、manager の移行は本 PR の範囲を超える。配信停止か移行かの判断が必要なため自動修正しない。

---
