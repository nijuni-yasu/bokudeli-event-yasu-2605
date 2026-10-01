# ブランチ feat/957-form レビュー記録

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 📄 ドキュメントのみ | S | 事前アンケートはカート全体の1ステップでは足りない<br>イベントごとの「事前アンケートに回答する」から回答画面へ進む |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 📑 仕様書 | 📄 ドキュメントのみ | S | 試行回答と確定回答が両方あるときの初期表示が未定義<br>取得できるのは `in_cart` のときだけにする |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | CSV の回答値は選択肢IDではなくスナップショットのラベル<br>複数選択の区切りと、アカウント項目と回答項目の列名を決める |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 設問の変更可否は保存値 `in_draft` だけにする<br>予約申請中・申請中・受付中の変更を許可し、確定済み回答は回答時点の文言のまま残す |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | 参加確定記録と「ordered が1件以上」が二重定義<br>一部取消と一括中止のトランザクションでも同じ規則にする |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 👤 UX | 📄 ドキュメントのみ | S | 権限エラーをフォームなしにしない原則が、共有カートのエンタープライズ注文を止めうる<br>PF かつ form_config ありのときだけ適用し、not-found だけをフォームなしとする |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 📑 仕様書 | 📄 ドキュメントのみ | S | コミュニティのフォーム定義は管理者だけが読める<br>申込者に見せるのはイベントへコピーした設問だけにする |
| [x] | RC-8 | 5928557279 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | CSV が field_label で列を潰す<br>field_id で列を分け、同名時はヘッダーへ ID を付ける |
| [x] | RC-9 | 5377418000 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview は個別指摘の要約<br>実体は RC-10 以降のインラインで扱う |
| [x] | RC-10 | 4153854964 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | カートのフォーム有無キャッシュが event_id 単独<br>community_id と event_id の複合キーに変更した |
| [x] | RC-11 | 4153855054 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | definition_version の加算が Transaction 外<br>設定・更新を Firestore Transaction に閉じた |
| [x] | RC-12 | 4153855119 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 💰 金銭 | 🔧 微修正 | S | stripe_session_id 追記が Webhook と競合しうる<br>consumed なら書き戻さない Transaction にした |
| [x] | RC-13 | 4153855187 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答画面が communityAccount を捨てている<br>props とカート照合にコミュニティを追加した |
| [x] | RC-14 | 4153855235 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 設問タイプ変更後も field_id が残る<br>種類変更時は ID を外して新規設問として採番する |
| [x] | RC-15 | 4153855298 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | 回答一覧の再取得失敗で前回結果が残る<br>ロード開始時に一覧と詳細をクリアした |
| [x] | RC-16 | 4153855345 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Callable 未デプロイ時に注文が止まる<br>仕様どおり通信失敗は注文を止める。デプロイ順の移行策は採らない |
| [x] | RC-17 | 4153855410 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | CSV のラベル重複は RC-8 と同じ指摘<br>RC-8 で field_id 列に直した |
| [x] | RC-18 | 4153855465 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 回答一覧が getUser の N+1<br>getUsersByUserIds でまとめて取得した |
| [ ] | RC-19 | 4153855528 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | formConfirm の状態遷移に Vitest が無い<br>工数 M のため自動修正せず、テスト追加は未着手 |
| [x] | RC-20 | 4153874723 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 削除済み設問が initial_answers に残る<br>§5.2 どおり表示可能な設問・選択肢へ絞り込んだ |
| [ ] | RC-21 | 4153874740 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | version_mismatch が画面に出ない<br>UX ラベルのため自動修正せず、再読込案内は未着手 |
| [x] | RC-22 | 4153874752 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex の CSV 列重複は RC-8 と同じ<br>RC-8 で対応済み |
| [ ] | RC-23 | 4153874760 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 回答画面が is_selected 解除メニューを止めない<br>工数 M。確定 API 側の検証方針が必要で自動修正しない |
| [ ] | RC-24 | 4153874774 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | cart が null の間に読込失敗アラートが出る<br>UX ラベルのため自動修正せず未着手 |
| [ ] | RC-25 | 4153874790 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 任意ラジオを未回答に戻せない<br>UX ラベルのため自動修正せず未着手 |
| [ ] | RC-26 | 4153874798 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🔧 微修正 | S | 回答画面に community_name が無い<br>§4 どおりだが UX/仕様書ラベルのため自動修正せず未着手 |
| [ ] | RC-27 | 4153874807 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ | 📋 仕様追加 | M | 解除後の再設定で definition_version が 1 に戻る<br>世代の持ち方は仕様判断が必要なため自動修正しない |
| [ ] | RC-28 | 4153874814 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📋 仕様追加 | M | revision_basis だけでは試行の新旧が決まらない<br>世代割当は仕様判断が必要なため自動修正しない |
| [x] | RC-29 | 4153874818 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 複製名が 100 文字を超えて失敗する<br>接尾辞込みで maxName に収まるよう切り詰めた |

---

## 評価セッション（2026-10-01 16:12・shokujii-code-review）

- **評価日時**: 2026-10-01 16:12 JST
- **評価者**: Cursor Agent（shokujii-code-review）
- **ブランチ名**: feat/957-form
- **PR**: 未作成
- **対象**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md`（未追跡。`git diff origin/development...HEAD` は空のため、該当コードはレビュー時点の本文を引用）
- **Outdated 除外件数**: 該当なし
- **レビュー非該当スキップ件数**: 該当なし
- **手順 3a/3b 自動修正**: なし（🚨 は導出かトランザクション更新か、適用条件の切り方など仕様判断が必要。🟡 は 📑 仕様書 / 🔒 セキュリティ / 👤 UX のいずれかが付き、自動修正対象外）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-1 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 👤 UX, 📑 仕様書 | 📄 ドキュメントのみ | S | 事前アンケートはカート全体の1ステップでは足りない<br>イベントごとの「事前アンケートに回答する」から回答画面へ進む |
| [x] | RC-2 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 📑 仕様書 | 📄 ドキュメントのみ | S | 試行回答と確定回答が両方あるときの初期表示が未定義<br>取得できるのは `in_cart` のときだけにする |
| [x] | RC-3 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | CSV の回答値は選択肢IDではなくスナップショットのラベル<br>複数選択の区切りと、アカウント項目と回答項目の列名を決める |
| [x] | RC-4 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 📄 ドキュメントのみ | S | 設問の変更可否は保存値 `in_draft` だけにする<br>予約申請中・申請中・受付中の変更を許可し、確定済み回答は回答時点の文言のまま残す |
| [x] | RC-5 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | 参加確定記録と「ordered が1件以上」が二重定義<br>一部取消と一括中止のトランザクションでも同じ規則にする |
| [x] | RC-6 | なし | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 👤 UX | 📄 ドキュメントのみ | S | 権限エラーをフォームなしにしない原則が、共有カートのエンタープライズ注文を止めうる<br>PF かつ form_config ありのときだけ適用し、not-found だけをフォームなしとする |
| [x] | RC-7 | なし | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🔒 セキュリティ, 📑 仕様書 | 📄 ドキュメントのみ | S | コミュニティのフォーム定義は管理者だけが読める<br>申込者に見せるのはイベントへコピーした設問だけにする |

---

**識別子**: RC-1（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:53`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

申込者: メニュー選択 → カート → 事前アンケート → 注文確認 → 決済／注文確定
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: 事前アンケートがカート全体の次ステップになっている。現行のカートは `base/src/components/pages/cart.vue` を user と enterprise が共有し、イベントごとに注文ボタンがある。1つのカートに、フォームありのイベントとフォームなしのイベントが同時に入る。 → 事前アンケートはイベントごとに、そのイベントの `confirmOrder` または `createStripeCheckoutSession` の直前に置く。

**コメント要約**: 事前アンケートはカート全体の1ステップでは足りない
イベントごとの「事前アンケートに回答する」から回答画面へ進む

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: データモデルはイベント単位だが、画面遷移の図がカート全体の直線になっている。このままだと複数イベントのカートで、フォームがないイベントの注文までアンケート待ちになる。現行 UI は `showConfirm(cartItem)` でイベント単位に決済または注文確定へ進む。2026-10-01 のユーザー指定で、フォームがあるイベントの「お支払いに進む」「注文を確定する」を「事前アンケートに回答する」に置き換え、回答画面の末尾に元のボタンを置く、と仕様へ書いた。

---

**識別子**: RC-2（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:67`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- 決済開始前にサーバー保存した有効な回答は、決済から戻った際に復元する。入力途中の自動保存・別端末同期は MVP に含めない。
- 再注文時は保存済みの回答を初期値として表示し、変更せず利用することも、その場で編集することもできる。
- 再注文の途中離脱・決済失敗では、前回の確定済み回答を維持する。決済前の一時保存は確定済み回答と区別する。
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: 決済中断時は試行中の回答を復元し、再注文の初期値は過去の回答、途中離脱では確定済み回答を維持する、とある。試行と確定が両方あるときの初期表示が決まっていない。回答取得の条件も「有効なカート注文」のままで、`processing` 中に編集できると進行中の Checkout に紐づくスナップショットと画面の内容がずれる。 → 回答を返すのは、対象イベントに本人の `in_cart` があるときだけにする。`processing` 中は取得も編集もしない。初期表示は、未確定の試行が残っている復帰ではその試行、それ以外は主催者に公開している確定回答にする。注文確定は、画面上の未保存の編集を使わない。

**コメント要約**: 試行回答と確定回答が両方あるときの初期表示が未定義
取得できるのは `in_cart` のときだけにする

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 反映時点自体は推奨案として未合意である。その推奨案の中で、申込者に見せる値と主催者に公開する値が同時に存在しうる。現行の注文は Checkout 開始で `processing` になり、遅延決済の失敗で `in_cart` に戻る。取得条件を status まで書かないと、進行中の決済と編集が重なる。2026-10-01 のユーザー指定で、`in_cart` のときだけ取得し、決済中断時は試行、それ以外は確定済み回答を初期表示する、と仕様へ書いた。

---

**識別子**: RC-3（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:69`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- CSV は回答者1人につき1行とし、ユーザーID、表示名、参加状態、回答日時、更新日時、各設問の回答を出力する。複数選択は1セルにまとめる。
- 回答値は項目タイプごとの文字列・選択肢ID・選択肢ID配列等で型付けする。
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: CSV は各設問の回答を出すとある。保存値は選択肢IDと選択肢ID配列である。IDのまま出すと主催者にはどの選択肢か分からない。複数選択を1セルにまとめる区切りが未定義で、カンマ区切りは選択肢ラベル内のカンマと衝突する。表示名はアカウント、氏名やメールは設問回答であり、列の出所が混ざる。 → 出力値はイベントに保存した設問スナップショットのラベルにする。複数選択のセル内区切りを決め、既存の引用符処理に乗せる。ユーザーIDと表示名はアカウント側、設問の回答は設問ラベル側と分かる列名にする。

**コメント要約**: CSV の回答値は選択肢IDではなくスナップショットのラベル
複数選択の区切りと、アカウント項目と回答項目の列名を決める

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 仕様は回答キーをラベルや配列位置にしないと決めており、CSV だけ「各設問の回答」と書いている。エクスポート時にスナップショットへ解決する指定がないと、主催者向けの一覧と CSV の文言が揃わない。2026-10-01 のユーザー指定で、確定時のラベルを `設問:{ラベル}` 列へ出し、複数選択は「、」で1セル、ユーザーIDと表示名はアカウント列とする、と仕様へ書いた。

---

**識別子**: RC-4（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:76`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- MVP ではフォームの追加・差替え・解除・設問変更を **イベントの下書き中のみ** 可能とする。予約申請後は固定する。
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: 変更できる時期が「下書き中」と「予約申請後」の両方で書かれている。保存されるステータスには `in_draft` のほか `applying_reservation`（予約申請中）と `applying_to_admin`（申請中）がある。予約申請を経由せず `applying_to_admin` に進む経路もある。店舗差し戻しでは `applying_reservation` から `in_draft` に戻る。算出ステータスの `order_closed` / `full` / `finished` は保存値ではない。 → 変更可否は `event_status.value === 'in_draft'` だけにする。差し戻しで `in_draft` に戻ったときだけ再編集できる。`applying_reservation` と `applying_to_admin` 以降は変更しない。注文 UI は算出ステータスが `accepting_order` のときだけ有効なので、受付開始前の再編集では確定済み回答は付いていない。

**コメント要約**: 設問の変更可否は保存値 `in_draft` だけにする
予約申請中・申請中・受付中の変更を許可し、確定済み回答は回答時点の文言のまま残す

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 「予約申請後」だけをゲートにすると、`applying_to_admin` の間は変更できてしまう。差し戻しで下書きに戻ったあとも永久に固定する、と読むこともできる。2026-10-01 のユーザー指定は、参加受付中に加え、予約申請中（`applying_reservation`）と申請中（`applying_to_admin`）も設問を変更できる、である。下書き固定は採用していない。確定済み回答へ確定時のラベルをコピーし、最新設問への読み替えをしないことで、変更後も確定済みの文言が残るように仕様へ書いた。変更できる保存値は `in_draft`・`applying_reservation`・`applying_to_admin`・`accepting_order`。`event_canceled` では変更しない。

---

**識別子**: RC-5（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:88`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- 一部注文が取消済みでも、有効な確定注文が1件以上残っていれば参加確定として扱う。
- 全取消後も回答を即時消去せず、取消済みとして区別する案とする。
- 確定済みの最新回答、定義バージョン、回答・更新日時、競合検知用リビジョン、参加確定記録。
- 回答を参加確定済みにする処理は、失敗を握りつぶす通知等の後処理だけに置かない。
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📋仕様追加/M]: 参加状態を回答ドキュメントの参加確定記録に持たせつつ、有効な確定注文が1件以上なら参加確定とも定義している。`ordered` になるのは `confirmOrder`（当日払いと、支払額0の主催者負担を含む）、`stripeWebhook`、福利厚生の確定処理である。`canceled` になるのは `cancelOrders` と `applyBulkEventCancelInTransaction`（イベント中止と最小催行人数の自動中止）である。一部取消で記録を落とすと、残っている確定注文の回答が主催者から消える。一括中止で記録を更新しないと、取消済みが参加確定の一覧に残る。 → 参加状態は、表示時にそのユーザーの注文 status から導出する。記録を保存する場合は、上記の確定と取消のトランザクション内で「`ordered` が1件以上なら参加確定、0件なら取消済み」を再計算する。`applyOrderConfirmedSideEffects` だけの更新は採用しない。

**コメント要約**: 参加確定記録と「ordered が1件以上」が二重定義
一部取消と一括中止のトランザクションでも同じ規則にする

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 実装では回答ドキュメントに参加状態を保存せず、一覧表示時に `member_orders` の `ordered` 有無から導出する。一部取消・一括中止のたびに回答を書き戻さない。

---

**識別子**: RC-6（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:108`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- フォーム設定が存在しないイベントは「フォームなし」とする。ただし権限エラー・読み込み失敗を「フォームなし」と解釈しない。
- エンタープライズの利用は API でも明示的に対象外とし、UI 非表示だけに依存しない。
- 初期対象は通常のコミュニティイベント。エンタープライズでの提供は後続候補
```

**レビュワーのコメント（原文）**:

🚨 **必須修正** [📄ドキュメントのみ/S]: 権限エラーと読み込み失敗をフォームなしと解釈しない、エンタープライズは API でも対象外、フォーム未設定は従来どおり注文できる、が同時に書かれている。カートとイベント編集は user と enterprise が base を共有している。共有カートが常に設問取得を呼び、エンタープライズ向けに権限エラーを返すと、そのエラーをフォームなしにできない原則でエンタープライズの注文が止まる。エラーを無視すると、PF で設問取得に失敗した必須フォームをスキップできる。 → フォームを適用するのは、イベントの `enterprise_id == null` かつ form_config があるときだけにする。エンタープライズでは設問取得を呼ばず、現行の注文フローのままにする。PF では not-found だけをフォームなしとし、権限エラーと通信失敗では注文確定と Checkout 開始を止める。Callable はエンタープライズからのフォーム作成・設定・回答を拒否する。イベント編集のフォーム選択も、PF の `in_draft` だけに出す。

**コメント要約**: 権限エラーをフォームなしにしない原則が、共有カートのエンタープライズ注文を止めうる
PF かつ form_config ありのときだけ適用し、not-found だけをフォームなしとする

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 👤 UX

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: 共有カートは `enterprise_id` があるイベントでは設問取得を呼ばない。PF では `has_form: false` だけをフォームなしとし、通信失敗は注文ボタンを止める。Callable はエンプライベントを拒否する。

---

**識別子**: RC-7（GitHub id: なし・エージェントレビュー）

**レビュワー**: Cursor Agent（shokujii-code-review）

**指摘箇所**: `documents/02_主催者獲得と継続/01_フォーム機能_Issue957更新案.md:130`

**該当コード（レビュー時点の diff）**:

```
（origin/development...HEAD に差分なし。未追跡ファイルの該当行）

- 公開用の設問取得と非公開の回答取得を分ける。フォーム定義の下書き一覧も公開しない。
```

**レビュワーのコメント（原文）**:

🟡 **修正提案** [📄ドキュメントのみ/S]: 「下書き一覧も公開しない」だと、下書き以外のコミュニティフォームは公開してよいように読める。申込者に必要なのは、イベントへコピーした設問である。再利用元のフォームには利用目的や未使用の設問が残る。 → `communities/{communityId}/forms` は、そのコミュニティの `members/{uid}.roles` に `manager` を持つ人だけが読める。申込者に見せるのは `events/{eventId}/form_configs/current` の公開用設問だけにする。回答ドキュメントはクライアントの Rules で read も write も拒否し、`{path=**}` の collection group 許可にも入れない。

**コメント要約**: コミュニティのフォーム定義は管理者だけが読める
申込者に見せるのはイベントへコピーした設問だけにする

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🔒 セキュリティ, 📑 仕様書

**変更種別**: 📄 ドキュメントのみ

**想定工数**: S

**判断理由**: コミュニティ `forms` は管理者 Callable のみ。申込者はイベントへコピーした設問だけを `getOrderFormForCart` で見る。Rules で forms / form_configs / form_responses / form_checkout_attempts のクライアント直読み書きを拒否した。

---

---

## 評価セッション（2026-10-01 18:37・review-comments-evaluate）

- **評価日時**: 2026-10-01 18:37 JST
- **評価者**: Cursor Agent（review-comments-evaluate / auto）
- **ブランチ名**: feat/957-form
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2384
- **REVIEW_REQUEST_SINCE**: 2026-10-01T09:18:13Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 5（依頼定型 5928467353 / 5928674422、Codex running 5928468161、Copilot エラー 5928677107、Codex wrapper 5377442339）
- **手順 4a 自動修正**: RC-8 / RC-10 / RC-11 / RC-12 / RC-13 / RC-14 / RC-15 / RC-20（🚨 8件）と RC-18 / RC-29（🟡 2件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-8 | 5928557279 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | CSV が field_label で列を潰す<br>field_id で列を分け、同名時はヘッダーへ ID を付ける |
| [x] | RC-9 | 5377418000 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot の overview は個別指摘の要約<br>実体は RC-10 以降のインラインで扱う |
| [x] | RC-10 | 4153854964 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | カートのフォーム有無キャッシュが event_id 単独<br>community_id と event_id の複合キーに変更した |
| [x] | RC-11 | 4153855054 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | M | definition_version の加算が Transaction 外<br>設定・更新を Firestore Transaction に閉じた |
| [x] | RC-12 | 4153855119 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 💰 金銭 | 🔧 微修正 | S | stripe_session_id 追記が Webhook と競合しうる<br>consumed なら書き戻さない Transaction にした |
| [x] | RC-13 | 4153855187 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答画面が communityAccount を捨てている<br>props とカート照合にコミュニティを追加した |
| [x] | RC-14 | 4153855235 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 設問タイプ変更後も field_id が残る<br>種類変更時は ID を外して新規設問として採番する |
| [x] | RC-15 | 4153855298 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ, 👤 UX | 🔧 微修正 | S | 回答一覧の再取得失敗で前回結果が残る<br>ロード開始時に一覧と詳細をクリアした |
| [x] | RC-16 | 4153855345 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Callable 未デプロイ時に注文が止まる<br>仕様どおり通信失敗は注文を止める。デプロイ順の移行策は採らない |
| [x] | RC-17 | 4153855410 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | CSV のラベル重複は RC-8 と同じ指摘<br>RC-8 で field_id 列に直した |
| [x] | RC-18 | 4153855465 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | — | 🔧 微修正 | S | 回答一覧が getUser の N+1<br>getUsersByUserIds でまとめて取得した |
| [ ] | RC-19 | 4153855528 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | M | formConfirm の状態遷移に Vitest が無い<br>工数 M のため自動修正せず、テスト追加は未着手 |
| [x] | RC-20 | 4153874723 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 削除済み設問が initial_answers に残る<br>§5.2 どおり表示可能な設問・選択肢へ絞り込んだ |
| [ ] | RC-21 | 4153874740 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | version_mismatch が画面に出ない<br>UX ラベルのため自動修正せず、再読込案内は未着手 |
| [x] | RC-22 | 4153874752 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex の CSV 列重複は RC-8 と同じ<br>RC-8 で対応済み |
| [ ] | RC-23 | 4153874760 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | M | 回答画面が is_selected 解除メニューを止めない<br>工数 M。確定 API 側の検証方針が必要で自動修正しない |
| [ ] | RC-24 | 4153874774 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | cart が null の間に読込失敗アラートが出る<br>UX ラベルのため自動修正せず未着手 |
| [ ] | RC-25 | 4153874790 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 任意ラジオを未回答に戻せない<br>UX ラベルのため自動修正せず未着手 |
| [ ] | RC-26 | 4153874798 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🔧 微修正 | S | 回答画面に community_name が無い<br>§4 どおりだが UX/仕様書ラベルのため自動修正せず未着手 |
| [ ] | RC-27 | 4153874807 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ | 📋 仕様追加 | M | 解除後の再設定で definition_version が 1 に戻る<br>世代の持ち方は仕様判断が必要なため自動修正しない |
| [ ] | RC-28 | 4153874814 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 💾 データ | 📋 仕様追加 | M | revision_basis だけでは試行の新旧が決まらない<br>世代割当は仕様判断が必要なため自動修正しない |
| [x] | RC-29 | 4153874818 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 複製名が 100 文字を超えて失敗する<br>接尾辞込みで maxName に収まるよう切り詰めた |

---

**識別子**: RC-8（GitHub id: 5928557279）

**レビュワー**: Copilot

**指摘箇所**: PR トップレベル（`base/src/composable/memberCsvExport.ts:130` 言及）

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

レビュー所見を1件確認しました。`base/src/composable/memberCsvExport.ts:130` では `field_label` を列キーとして重複排除し、同じラベルの別設問は1列にまとめられ、`byLabel` で後の回答が前の回答を上書きします。設問ラベルの重複はスキーマで禁止されていないため、CSVから回答が欠落します。列を `field_id` で識別してください。現行の連携ツールでは新規インラインレビューコメントを作成できないため、この依頼コメントへの返信として報告しています。

**コメント要約**: CSV が field_label で列を潰す
field_id で列を分け、同名時はヘッダーへ ID を付ける

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: ラベル一意制約は無く、仕様書 §4 も同名時は設問IDで列を分ける。buildEventFormResponseCsv を field_id キーに変更し、同名時は `設問:{label} ({field_id})` にした。

---

**識別子**: RC-9（GitHub id: 5377418000）

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

複合イベントキー、設定版の競合、Stripe更新競合、デプロイ順など注文・回答整合性に関わる問題があります。

**Review effort:** Balanced  
**Findings:** 4 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 5 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (10)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [event_id単独キーによる別コミュニティ間のフォーム状態混同](#discussion_r4153854964) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [definition_version更新の競合による版番号重複](#discussion_r4153855054) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Webhook更新とセッション作成の競合による状態上書き](#discussion_r4153855119) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [communityAccount欠落による別コミュニティのカート項目誤選択](#discussion_r4153855187) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問タイプ変更時に既存field_idが残り保存できない](#discussion_r4153855235) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [取得失敗時に前回の回答一覧が残る](#discussion_r4153855298) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Functions未デプロイ時に注文全体が停止するデプロイ順序問題](#discussion_r4153855345) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問ラベル重複と版変更による回答列の上書き](#discussion_r4153855410) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [回答者ごとのgetUser呼び出しによるN+1読取](#discussion_r4153855465) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [注文確定の状態遷移と競合処理を検証するテスト不足](#discussion_r4153855528) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

イベント申込の事前アンケートを、定義・回答・注文確定・管理画面・CSVまで一貫して追加するPRです。

**Changes:**
- フォーム定義、回答検証、Firestore保存モデルを追加
- 注文確定・Stripe決済と回答確定を連携
- 管理画面、カート回答画面、回答CSVを追加

| File | Description |
| ---- | ----------- |
| `user/​src/​router/​utils.ts` | フォーム画面のパスを追加 |
| `user/​src/​pages/​manage/​event/​[eventId]/​[tab].vue` | イベントフォームタブを追加 |
| `user/​src/​pages/​manage/​community/​[communityAccount]/​form/​new.vue` | 新規作成画面を追加 |
| `user/​src/​pages/​manage/​community/​[communityAccount]/​form/​[formId].vue` | 編集画面を追加 |
| `user/​src/​pages/​manage/​community/​[communityAccount]/​[tab].vue` | コミュニティフォームタブを追加 |
| `user/​src/​pages/​cart/​form/​[communityAccount]/​[eventId].vue` | 回答画面のshellを追加 |
| `user/​src/​pages/​cart.vue` | カートから回答画面への導線を追加 |
| `user/​src/​pages/​c/​[communityAccount]/​e/​[eventId]/​index.vue` | アンケート案内を追加 |
| `user/​src/​locales/​messages/​ja.ts` | タブ文言を追加 |
| `user/​src/​components/​manage/​event/​member.vue` | 回答一覧を参加者画面へ追加 |
| `tests/​firestore-rules/​src/​formCollections.test.ts` | フォームコレクションのアクセス拒否を検証 |
| `functions/​default/​src/​utils/​formConfirm.ts` | 回答確定の状態遷移を実装 |
| `functions/​default/​src/​utils/​formAccess.ts` | 認証・認可・イベント制約を共通化 |
| `functions/​default/​src/​stripeWebhook.ts` | 決済確定時に回答を確定 |
| `functions/​default/​src/​stripe.ts` | Checkoutへ回答試行を関連付け |
| `functions/​default/​src/​stores/​form.ts` | フォーム用Firestore storeを追加 |
| `functions/​default/​src/​memberOrders.ts` | 通常注文確定へ回答確定を統合 |
| `functions/​default/​src/​index.ts` | 新規Callableをexport |
| `functions/​default/​src/​formOrder.ts` | カート向け回答APIを追加 |
| `functions/​default/​src/​formAdmin.ts` | 管理・回答参照APIを追加 |
| `functions/​default/​src/​eventCopy.ts` | イベントコピー時にフォームを複製 |
| `firestore.rules` | クライアント直アクセスを拒否 |
| `documents/​レビューコメント/​review-feat-957-form.md` | レビュー記録を追加 |
| `common/​src/​utils/​validateFormAnswers.ts` | 回答検証と表示変換を追加 |
| `common/​src/​utils/​validateFormAnswers.test.ts` | 回答検証をテスト |
| `common/​src/​utils/​normalizeFormFields.ts` | 設問IDと入力を正規化 |
| `common/​src/​schemas/​FormResponse.ts` | 確定回答スキーマを追加 |
| `common/​src/​schemas/​formFields.ts` | 設問・選択肢スキーマを追加 |
| `common/​src/​schemas/​FormCheckoutAttempt.ts` | 回答試行スキーマを追加 |
| `common/​src/​schemas/​EventFormConfig.ts` | イベント用フォームスキーマを追加 |
| `common/​src/​schemas/​CommunityForm.ts` | コミュニティフォームスキーマを追加 |
| `common/​src/​apis/​stripe.ts` | 回答試行IDをCheckout APIへ追加 |
| `common/​src/​apis/​order.ts` | 回答試行IDを注文APIへ追加 |
| `common/​src/​apis/​form.ts` | フォームAPI契約を追加 |
| `base/​src/​types/​profilePathResolvers.ts` | 回答画面resolver型を追加 |
| `base/​src/​stubs/​app/​router/​utils.ts` | フォーム用ルータースタブを追加 |
| `base/​src/​locales/​messages/​ja.ts` | フォーム関連文言を追加 |
| `base/​src/​composable/​memberCsvExport.ts` | 回答CSV生成を追加 |
| `base/​src/​composable/​memberCsvExport.test.ts` | 回答CSVをテスト |
| `base/​src/​components/​pages/​cart.vue` | フォーム有無確認と導線を追加 |
| `base/​src/​components/​manage/​event/​EventFormSettingsPanel.vue` | イベントフォーム設定UIを追加 |
| `base/​src/​components/​manage/​event/​EventFormResponsesPanel.vue` | 回答一覧・CSV UIを追加 |
| `base/​src/​components/​manage/​community/​CommunityFormsPanel.vue` | フォーム一覧UIを追加 |
| `base/​src/​components/​manage/​community/​CommunityFormEditor.vue` | フォーム編集UIを追加 |
| `base/​src/​components/​forms/​FormFieldsEditor.vue` | 設問編集部品を追加 |
| `base/​src/​components/​forms/​FormAnswerFields.vue` | 回答入力部品を追加 |
| `base/​src/​components/​forms/​CartFormAnswer.vue` | カート回答・注文処理を追加 |
| `base/​src/​apis/​form.ts` | Callableクライアントを追加 |
</details>

---

💡 Configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

**コメント要約**: Copilot の overview は個別指摘の要約
実体は RC-10 以降のインラインで扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 概要コメント自体に追加の独立指摘はなく、列挙された Finding は各インライン RC で評価する。

---

**識別子**: RC-10（GitHub id: 4153854964）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/pages/cart.vue:455`

**該当コード（レビュー時点の diff）**:

```diff
@@ -427,6 +431,75 @@ const enrichedCart = computed<EnrichedCartItem[] | null>(() => {
 const findEnrichedCartItem = (cartItem: CartItem): EnrichedCartItem | undefined =>
   enrichedCart.value?.find((item) => item.event.event_id === cartItem.event.event_id)
 
+type FormPresence = 'loading' | 'yes' | 'no' | 'error'
+const formPresenceByEventId = ref<Record<string, FormPresence>>({})
```

**レビュワーのコメント（原文）**:

[must] `event_id` だけをキーにすると、別コミュニティに同じ ID のイベントが入ったカートでフォーム有無が相互に上書きされます。その結果、必須フォームを飛ばして注文できたり、フォームなしイベントを回答画面へ送ったりします。`community_id` と `event_id` の複合キーでキャッシュ・watch・参照を統一してください（`common/src/utils/dashboardAggregation.ts:109-116` も同じ複合キーです）。

**コメント要約**: カートのフォーム有無キャッシュが event_id 単独
community_id と event_id の複合キーに変更した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 別コミュニティで event_id が衝突すると必須フォームを飛ばせる。formPresenceKey(community_id, event_id) に統一した。

---

**識別子**: RC-11（GitHub id: 4153855054）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/formAdmin.ts:220`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・141 行）
+    fields: normalized.fields,
+    archived: data.archived ?? existing.archived,
+    updated_by: uid,
+  })
+  await saveCommunityForm(data.community_id, updated)
+  return { form: toCommunityFormDetail(updated) }
+})
+
+export const duplicateCommunityForm = onCall(async (request): Promise<DuplicateCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id } = parseOrThrow(DuplicateCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const existing = await getCommunityForm(community_id, form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const duplicated = new CommunityForm('', {
+    community_id,
+    name: `${existing.name} のコピー`,
+    description: existing.description,
+    purpose: existing.purpose,
+    fields: cloneFormFields(existing.fields),
+    archived: false,
+    created_by: uid,
+    updated_by: uid,
+  })
+  const created = await createCommunityFormDoc(community_id, duplicated)
+  return { form: toCommunityFormDetail(created) }
+})
+
+export const archiveCommunityForm = onCall(async (request): Promise<ArchiveCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id, archived } = parseOrThrow(ArchiveCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const existing = await getCommunityForm(community_id, form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const updated = new CommunityForm(existing.id, { ...existing, archived, updated_by: uid })
+  await saveCommunityForm(community_id, updated)
+  return { form: toCommunityFormDetail(updated) }
+})
+
+export const getEventFormPresence = onCall(async (request): Promise<GetEventFormPresenceResponse> => {
+  const { community_id, event_id } = parseOrThrow(GetEventFormPresenceRequestSchema, request.data)
+  const event = await getEventInCommunity(community_id, event_id)
+  if (event == null) {
+    throw new HttpsError('not-found', 'イベントが見つかりません')
+  }
+  if (getEventEnterpriseId(event) != null) {
+    return { has_form: false }
+  }
+  const config = await getEventFormConfig(community_id, event_id)
+  return { has_form: config != null }
+})
+
+export const getEventFormConfigCallable = onCall(async (request): Promise<GetEventFormConfigResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id } = parseOrThrow(GetEventFormConfigRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  await requirePfEventForForm(community_id, event_id)
+  const config = await getEventFormConfig(community_id, event_id)
+  return { config: config == null ? null : toEventFormConfigDto(config) }
+})
+
+export const setEventFormFromCommunity = onCall(async (request): Promise<SetEventFormFromCommunityResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id, form_id } = parseOrThrow(SetEventFormFromCommunityRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const event = await requirePfEventForForm(community_id, event_id)
+  assertEventFormEditable(event)
+  const form = await getCommunityForm(community_id, form_id)
+  if (form == null || form.archived) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const existing = await getEventFormConfig(community_id, event_id)
+  const config = new EventFormConfig('current', {
+    source_form_id: form.id,
+    definition_version: (existing?.definition_version ?? 0) + 1,
+    purpose: form.purpose,
```

**レビュワーのコメント（原文）**:

[must] `definition_version` の読取・加算・保存がトランザクション外なので、複数管理者の同時差し替えがどちらも同じ版番号を保存できます。その間に作られた回答 attempt は版番号が一致したまま別の設問定義へ確定できるため、この read-modify-write を Firestore Transaction に閉じてください。

This issue also appears on line 239 of the same file.

**コメント要約**: definition_version の加算が Transaction 外
設定・更新を Firestore Transaction に閉じた

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 同時差し替えで同一版番号になり得る。setEventFormFromCommunity / updateEventFormConfig を runTransaction にした。

---

**識別子**: RC-12（GitHub id: 4153855119）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stripe.ts:346`

**該当コード（レビュー時点の diff）**:

```diff
@@ -325,11 +340,20 @@ export const createStripeCheckoutSession = onCall<
         communityId: community_id,
         userId: uid,
         ...(enterpriseId != null ? { enterpriseId } : {}),
+        ...(frozenFormAttemptId != null ? { formAttemptId: frozenFormAttemptId } : {}),
         ...buildOrderIdChunks(order_ids),
       },
     }
     const session = await stripe.checkout.sessions.create(sessionParams)
 
+    if (frozenFormAttemptId != null) {
+      const attempt = await getFormCheckoutAttempt(community_id, event_id, frozenFormAttemptId)
+      if (attempt != null) {
+        attempt.stripe_session_id = session.id
+        await saveFormCheckoutAttempt(community_id, event_id, attempt)
+      }
+    }
```

**レビュワーのコメント（原文）**:

[must] セッション作成直後に Webhook が attempt を `consumed` へ更新すると、この非トランザクションの read→全体 set が古い `frozen` 状態を書き戻す競合が起こります。`stripe_session_id` の追記もトランザクション化し、Webhook の更新と競合したら再読込してください。

**コメント要約**: stripe_session_id 追記が Webhook と競合しうる
consumed なら書き戻さない Transaction にした

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: セッション作成直後の全体 set が consumed を巻き戻す。Transaction 内で再読込し consumed なら更新しない。

---

**識別子**: RC-13（GitHub id: 4153855187）

**レビュワー**: Copilot

**指摘箇所**: `user/src/pages/cart/form/[communityAccount]/[eventId].vue:5`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,10 @@
+<script setup lang="ts">
+import CartFormAnswer from '@shokujii/base/components/forms/CartFormAnswer.vue'
+import { getCartPath, getOrdersPathAfterOrder } from '@/router/utils'
+
+const eventId = useRoute().params.eventId as string
```

**レビュワーのコメント（原文）**:

[must] URL の `communityAccount` を捨てて `eventId` だけを渡しているため、回答画面側は同じ `event_id` を持つ別コミュニティのカート項目を選び得ます。`communityAccount` も props に渡し、コミュニティとイベントの両方で対象を特定してください。

**コメント要約**: 回答画面が communityAccount を捨てている
props とカート照合にコミュニティを追加した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同一 event_id の別コミュニティ項目を選び得る。communityAccount を渡しカート照合に使った。

---

**識別子**: RC-14（GitHub id: 4153855235）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/forms/FormFieldsEditor.vue:85`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・6 行）
+const props = defineProps<{
+  modelValue: FormFieldInput[]
+}>()
+
+const emit = defineEmits<{
+  'update:modelValue': [value: FormFieldInput[]]
+}>()
+
+const { t: $t } = useI18n()
+
+const typeItems = FORM_FIELD_TYPE_VALUES.map((value) => ({
+  value,
+  title: $t(`manage.forms.types.${value}`),
+}))
+
+const updateField = (index: number, patch: Partial<FormFieldInput>) => {
+  emit(
+    'update:modelValue',
+    props.modelValue.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
+  )
+}
+
+const addField = () => {
+  if (props.modelValue.length >= FORM_FIELD_LIMITS.maxFields) {
+    return
+  }
+  emit('update:modelValue', [
+    ...props.modelValue,
+    {
+      type: 'text',
+      label: '',
+      description: '',
+      required: false,
+      hidden_for_new: false,
+    },
+  ])
+}
+
+const removeField = (index: number) => {
+  emit(
+    'update:modelValue',
+    props.modelValue.filter((_, fieldIndex) => fieldIndex !== index),
+  )
+}
+
+const addOption = (index: number) => {
+  const field = props.modelValue[index]
+  const options = [...(field.options ?? [])]
+  if (options.length >= FORM_FIELD_LIMITS.maxOptions) {
+    return
+  }
+  options.push({ label: '', hidden_for_new: false })
+  updateField(index, { options })
+}
+
+const updateOption = (fieldIndex: number, optionIndex: number, patch: { label?: string; hidden_for_new?: boolean }) => {
+  const field = props.modelValue[fieldIndex]
+  const options = (field.options ?? []).map((option, index) =>
+    index === optionIndex ? { ...option, ...patch } : option,
+  )
+  updateField(fieldIndex, { options })
+}
+
+const removeOption = (fieldIndex: number, optionIndex: number) => {
+  const field = props.modelValue[fieldIndex]
+  updateField(fieldIndex, {
+    options: (field.options ?? []).filter((_, index) => index !== optionIndex),
+  })
+}
+
+const onTypeChange = (index: number, type: FormFieldInput['type']) => {
+  if (isChoiceFieldType(type)) {
+    updateField(index, {
+      type,
+      options: props.modelValue[index].options ?? [{ label: '', hidden_for_new: false }],
+    })
+    return
+  }
+  updateField(index, { type, options: undefined })
+}
```

**レビュワーのコメント（原文）**:

[must] 既存設問の種類を変更しても `field_id` が残るため、保存時に `normalizeFormFields` が「同じ設問IDの項目タイプは変更できません」で必ず拒否します。種類変更時は ID を外して新しい設問として採番させてください。

**コメント要約**: 設問タイプ変更後も field_id が残る
種類変更時は ID を外して新規設問として採番する

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: normalizeFormFields がタイプ変更を拒否する。onTypeChange で field_id を外した。

---

**識別子**: RC-15（GitHub id: 4153855298）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/manage/event/EventFormResponsesPanel.vue:26`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,127 @@
+<script setup lang="ts">
+import { useNotification } from '@shokujii/base/composable/notification.js'
+import { listEventFormResponses } from '@shokujii/base/apis/form.js'
+import { buildEventFormResponseCsv, downloadMemberCsv } from '@shokujii/base/composable/memberCsvExport.js'
+import type { EventFormResponseFilter, EventFormResponseListItem } from '@shokujii/common/apis/form.js'
+import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
+import type { BokudeliEvent } from '@shokujii/base/stores/event.js'
+import { mdiDownload } from '@mdi/js'
+
+const props = defineProps<{
+  event: BokudeliEvent
+}>()
+
+const { t: $t } = useI18n()
+const notification = useNotification()
+
+const filter = ref<EventFormResponseFilter>('confirmed')
+const responses = ref<EventFormResponseListItem[]>([])
+const loading = ref(false)
+const selected = ref<EventFormResponseListItem | null>(null)
+
+const load = async () => {
+  if (props.event.enterprise_id != null && props.event.enterprise_id !== '') {
+    return
+  }
+  loading.value = true
```

**レビュワーのコメント（原文）**:

[must] フィルターまたはイベント変更後の取得が失敗すると、前回成功時の `responses` が残り、新しいフィルターの一覧として表示・CSV出力されます。ロード開始時に一覧と選択中詳細をクリアしてください。

**コメント要約**: 回答一覧の再取得失敗で前回結果が残る
ロード開始時に一覧と詳細をクリアした

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 失敗時に誤った CSV を出せる。load 開始時とエンタープライズ切替時に responses / selected を空にした。

---

**識別子**: RC-16（GitHub id: 4153855345）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/pages/cart.vue:473`

**該当コード（レビュー時点の diff）**:

```diff
@@ -427,6 +431,75 @@ const enrichedCart = computed<EnrichedCartItem[] | null>(() => {
 const findEnrichedCartItem = (cartItem: CartItem): EnrichedCartItem | undefined =>
   enrichedCart.value?.find((item) => item.event.event_id === cartItem.event.event_id)
 
+type FormPresence = 'loading' | 'yes' | 'no' | 'error'
+const formPresenceByEventId = ref<Record<string, FormPresence>>({})
+
+const isPfEvent = (event: BokudeliEvent): boolean => event.enterprise_id == null || event.enterprise_id === ''
+
+const loadFormPresence = async (event: BokudeliEvent) => {
+  const eventId = event.event_id
+  if (!isPfEvent(event) || props.resolveFormAnswerPath == null) {
+    formPresenceByEventId.value = { ...formPresenceByEventId.value, [eventId]: 'no' }
+    return
+  }
+  if (formPresenceByEventId.value[eventId] === 'yes' || formPresenceByEventId.value[eventId] === 'no') {
+    return
+  }
+  formPresenceByEventId.value = { ...formPresenceByEventId.value, [eventId]: 'loading' }
+  try {
+    const response = await getEventFormPresence({
+      community_id: event.community_id,
+      event_id: eventId,
+    })
```

**レビュワーのコメント（原文）**:

[must] この新規 Callable が未デプロイだと catch 側の `error` になり、PF の全カートで注文ボタンが停止します。Functions と user hosting は同じ push から別 workflow で独立起動するため、hosting が先に反映される時間帯に注文障害が発生します。Functions 完了後だけ新 UI を有効化するなど、デプロイ順を保証する移行策が必要です。

**コメント要約**: Callable 未デプロイ時に注文が止まる
仕様どおり通信失敗は注文を止める。デプロイ順の移行策は採らない

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: RC-6 / 仕様は権限エラーと通信失敗で注文を止める。未デプロイは通信失敗と同じ扱い。フィーチャーフラグで握りつぶすと必須フォームを飛ばせる。

---

**識別子**: RC-17（GitHub id: 4153855410）

**レビュワー**: Copilot

**指摘箇所**: `base/src/composable/memberCsvExport.ts:161`

**該当コード（レビュー時点の diff）**:

```diff
@@ -111,3 +111,48 @@ export const buildEventMemberCsv = (
 export const downloadMemberCsv = (filename: string, content: string): void => {
   downloadCsv(filename, content)
 }
+
+export type EventFormResponseCsvRow = {
+  user_id: string
+  display_name: string
+  participation_label: string
+  answered_at: string
+  updated_at: string
+  answers: Array<{
+    field_label: string
+    display_value: string
+  }>
+}
+
+export const buildEventFormResponseCsv = (rows: EventFormResponseCsvRow[]): string => {
+  const labels: string[] = []
+  const seen = new Set<string>()
+  for (const row of rows) {
+    for (const answer of row.answers) {
+      if (!seen.has(answer.field_label)) {
+        seen.add(answer.field_label)
+        labels.push(answer.field_label)
+      }
+    }
+  }
+  const headers = [
+    'ユーザーID',
+    '表示名',
+    '参加状態',
+    '回答日時',
+    '更新日時',
+    ...labels.map((label) => `設問:${label}`),
+  ]
+  const csvRows = rows.map((row) => {
+    const byLabel = new Map(row.answers.map((answer) => [answer.field_label, answer.display_value]))
```

**レビュワーのコメント（原文）**:

[must] 設問ラベルは一意制約がないため、同名の設問が複数あると `Map` の後勝ちで回答が1列に潰れます。さらに版ごとにラベルが変わるため、列キーは `field_id` と確定時ラベルの組にして、各設問の回答を別列として保持してください。

**コメント要約**: CSV のラベル重複は RC-8 と同じ指摘
RC-8 で field_id 列に直した

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: RC-8 と同一内容のインライン重複。

---

**識別子**: RC-18（GitHub id: 4153855465）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/formAdmin.ts:293`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・214 行）
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const existing = await getEventFormConfig(community_id, event_id)
+  const config = new EventFormConfig('current', {
+    source_form_id: form.id,
+    definition_version: (existing?.definition_version ?? 0) + 1,
+    purpose: form.purpose,
+    fields: cloneFormFields(form.fields),
+  })
+  await saveEventFormConfig(community_id, event_id, config)
+  logger.info('イベントへフォームを設定した', {
+    communityId: community_id,
+    eventId: event_id,
+    formId: form.id,
+    userId: uid,
+  })
+  return { config: toEventFormConfigDto(config) }
+})
+
+export const updateEventFormConfig = onCall(async (request): Promise<UpdateEventFormConfigResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const data = parseOrThrow(UpdateEventFormConfigRequestSchema, request.data)
+  await requireCommunityManager(data.community_id, uid)
+  const event = await requirePfEventForForm(data.community_id, data.event_id)
+  assertEventFormEditable(event)
+  const existing = await getEventFormConfig(data.community_id, data.event_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'イベントにフォームが設定されていません')
+  }
+  const normalized = normalizeFormFields(data.fields, existing.fields)
+  if (!normalized.ok) {
+    throw new HttpsError('invalid-argument', normalized.message)
+  }
+  const config = new EventFormConfig('current', {
+    ...existing,
+    purpose: data.purpose ?? existing.purpose,
+    fields: normalized.fields,
+    definition_version: existing.definition_version + 1,
+  })
+  await saveEventFormConfig(data.community_id, data.event_id, config)
+  return { config: toEventFormConfigDto(config) }
+})
+
+export const clearEventFormConfig = onCall(async (request): Promise<ClearEventFormConfigResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id } = parseOrThrow(ClearEventFormConfigRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const event = await requirePfEventForForm(community_id, event_id)
+  assertEventFormEditable(event)
+  await deleteEventFormConfig(community_id, event_id)
+  return { cleared: true }
+})
+
+function toResponseItem(
+  userId: string,
+  displayName: string,
+  participation: 'confirmed' | 'canceled',
+  answeredAt: number,
+  updatedAt: number,
+  answers: EventFormResponseListItem['answers'],
+): EventFormResponseListItem {
+  return {
+    user_id: userId,
+    display_name: displayName,
+    participation,
+    answered_at: answeredAt,
+    updated_at: updatedAt,
+    answers,
+  }
+}
+
+async function buildResponseItems(communityId: string, eventId: string): Promise<EventFormResponseListItem[]> {
+  const [responses, ordered, canceled] = await Promise.all([
+    listFormResponses(communityId, eventId),
+    getOrders(communityId, eventId, 'ordered'),
+    getOrders(communityId, eventId, 'canceled'),
+  ])
+  const orderedUsers = new Set(ordered.map((order) => order.user_id))
+  const canceledUsers = new Set(canceled.map((order) => order.user_id))
+  const users = await Promise.all(responses.map((response) => getUser(response.user_id, false)))
```

**レビュワーのコメント（原文）**:

[imo] 回答者ごとに `getUser` を同時発行する N+1 読取になり、回答数が多いイベントで Callable の接続数と待ち時間が増えます。既存の `getUsersByUserIds`（`stores/user.ts:63-84`）でまとめて取得し、Map から表示名を解決してください。

**コメント要約**: 回答一覧が getUser の N+1
getUsersByUserIds でまとめて取得した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: —

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 既存 store の一括取得に置き換える方針が一意。📌 S 🔧 で自動修正した。

---

**識別子**: RC-19（GitHub id: 4153855528）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/utils/formConfirm.ts:64`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,125 @@
+import { HttpsError } from 'firebase-functions/https'
+import type { Transaction } from 'firebase-admin/firestore'
+import { FormResponse } from '@shokujii/common/schemas/FormResponse.js'
+import type { FormCheckoutAttempt } from '@shokujii/common/schemas/FormCheckoutAttempt.js'
+import type { EventFormConfig } from '@shokujii/common/schemas/EventFormConfig.js'
+import {
+  getEventFormConfig,
+  getFormCheckoutAttempt,
+  getFormResponse,
+  saveFormCheckoutAttempt,
+  saveFormResponse,
+} from '../stores/form.js'
+import { getEventEnterpriseId } from './enterpriseSubsidyOrders.js'
+import type { ShokujiiEvent } from '../stores/event.js'
+
+export async function loadEventFormConfigIfPf(
+  event: ShokujiiEvent,
+  transaction?: Transaction,
+): Promise<EventFormConfig | undefined> {
+  if (getEventEnterpriseId(event) != null) {
+    return undefined
+  }
+  return getEventFormConfig(event.community_id, event.id, transaction)
+}
+
+export async function requireAttemptForLatestForm(params: {
+  event: ShokujiiEvent
+  userId: string
+  attemptId: string | undefined
+  config: EventFormConfig
+  transaction: Transaction
+}): Promise<FormCheckoutAttempt> {
+  if (params.attemptId == null || params.attemptId === '') {
+    throw new HttpsError('failed-precondition', '事前アンケートの回答が必要です')
+  }
+  const attempt = await getFormCheckoutAttempt(
+    params.event.community_id,
+    params.event.id,
+    params.attemptId,
+    params.transaction,
+  )
+  if (attempt == null || attempt.user_id !== params.userId) {
+    throw new HttpsError('failed-precondition', '事前アンケートの回答が見つかりません')
+  }
+  if (attempt.status === 'consumed') {
+    throw new HttpsError('failed-precondition', 'この回答はすでに使用されています')
+  }
+  if (attempt.definition_version !== params.config.definition_version) {
+    throw new HttpsError('failed-precondition', '設問が更新されています。回答画面でやり直してください')
+  }
+  return attempt
+}
+
+export type FormConfirmPlan =
+  | { kind: 'none' }
+  | { kind: 'reuse'; existing: FormResponse }
+  | { kind: 'apply'; attempt: FormCheckoutAttempt; existing?: FormResponse }
+
+export async function planFormConfirmation(params: {
+  event: ShokujiiEvent
+  userId: string
+  attemptId: string | undefined
+  transaction: Transaction
+}): Promise<FormConfirmPlan> {
```

**レビュワーのコメント（原文）**:

[must] 注文確定の中核となる新しい状態遷移（consumed、版不一致、revision 競合、既存回答再利用）に Functions 側のテストがありません。`functions/default/src/utils` には同種の Vitest が整備されているため、各分岐と再送・競合時に古い回答を上書きしないケースを追加してください。

**コメント要約**: formConfirm の状態遷移に Vitest が無い
工数 M のため自動修正せず、テスト追加は未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: 分岐が多く工数 M。条件付き自動修正の S 要件を満たさない。

---

**識別子**: RC-20（GitHub id: 4153874723）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/formOrder.ts:75`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,124 @@
+import { onCall, HttpsError } from 'firebase-functions/https'
+import {
+  GetOrderFormForCartRequestSchema,
+  SaveOrderFormAttemptRequestSchema,
+  type GetOrderFormForCartResponse,
+  type SaveOrderFormAttemptResponse,
+} from '@shokujii/common/apis/form.js'
+import { answersToInputs, validateFormAnswers } from '@shokujii/common/utils/validateFormAnswers.js'
+import { createModuleLogger } from './utils/logger.js'
+import { requireAuthUid, requirePfEventForForm, visibleFieldsForNewAnswers } from './utils/formAccess.js'
+import { getOrdersInCart } from './stores/memberOrder.js'
+import {
+  createFormCheckoutAttempt,
+  getEventFormConfig,
+  getFormResponse,
+  listPendingFormCheckoutAttemptsForUser,
+} from './stores/form.js'
+
+const logger = createModuleLogger('formOrder')
+
+function parseOrThrow<T>(schema: { parse: (value: unknown) => T }, data: unknown): T {
+  try {
+    return schema.parse(data)
+  } catch {
+    throw new HttpsError('invalid-argument', '必須パラメータが不足しています')
+  }
+}
+
+async function requireInCart(communityId: string, eventId: string, userId: string): Promise<void> {
+  const cartOrders = await getOrdersInCart(communityId, eventId, userId)
+  if (cartOrders.length === 0) {
+    throw new HttpsError('failed-precondition', 'カートに注文があるときだけ回答できます')
+  }
+}
+
+export const getOrderFormForCart = onCall(async (request): Promise<GetOrderFormForCartResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id } = parseOrThrow(GetOrderFormForCartRequestSchema, request.data)
+  const event = await requirePfEventForForm(community_id, event_id)
+  await requireInCart(community_id, event_id, uid)
+
+  const config = await getEventFormConfig(community_id, event_id)
+  if (config == null) {
+    return { has_form: false, community_name: event.community_name, purpose: '' }
+  }
+
+  const [pendingAttempts, confirmed] = await Promise.all([
+    listPendingFormCheckoutAttemptsForUser(community_id, event_id, uid),
+    getFormResponse(community_id, event_id, uid),
+  ])
+  const latestPending = pendingAttempts
+    .filter((attempt) => attempt.definition_version === config.definition_version)
+    .sort((a, b) => b.updated_at - a.updated_at)[0]
+
+  const fields = visibleFieldsForNewAnswers(config.fields)
+  if (latestPending != null) {
+    return {
+      has_form: true,
+      community_name: event.community_name,
+      purpose: config.purpose,
+      definition_version: config.definition_version,
+      fields,
+      initial_answers: answersToInputs(latestPending.answers),
+      source: 'attempt',
+    }
+  }
+  if (confirmed != null) {
+    return {
+      has_form: true,
+      community_name: event.community_name,
+      purpose: config.purpose,
+      definition_version: config.definition_version,
+      fields,
+      initial_answers: answersToInputs(confirmed.answers),
+      source: 'confirmed',
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  旧回答を最新定義の設問だけに絞り込む**

イベント設定から設問を削除した後に既存回答者が追加注文すると、ここで削除済み設問を含む確定回答をそのまま `initial_answers` に返します。送信時には `validateFormAnswers` がその値を `unknown_field` として拒否しますが、削除済み設問は画面に存在しないため利用者が取り除けず、再注文を完了できません。同コミットの仕様書 §5.2 にある「最新定義にもある設問IDだけを初期値にする」よう、返却前に現在表示可能な設問・選択肢へ絞り込んでください。

Useful? React with 👍 / 👎.

**コメント要約**: 削除済み設問が initial_answers に残る
§5.2 どおり表示可能な設問・選択肢へ絞り込んだ

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様書 §5.2 の初期値フィルタ不足。画面に無い unknown_field で再注文不能になる。visible fields / options へ絞り込んだ。

---

**識別子**: RC-21（GitHub id: 4153874740）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:126`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・47 行）
+const fields = computed<FormField[]>(() => form.value?.fields ?? [])
+
+const needsStripe = computed(() => {
+  const item = cartItem.value
+  if (item == null) {
+    return false
+  }
+  if (item.event.event_payment === 'user_advance') {
+    return true
+  }
+  if (item.event.event_payment === 'community_bill' && item.event.community_bill_settings?.type === 'discount') {
+    return computeTotalPayment(item.orders) > 0
+  }
+  return false
+})
+
+const load = async () => {
+  const item = cartItem.value
+  if (item == null) {
+    loading.value = false
+    showAlert($t('cart.form_load_failed'))
+    return
+  }
+  loading.value = true
+  try {
+    const response = await getOrderFormForCart({
+      community_id: item.event.community_id,
+      event_id: item.event.event_id,
+    })
+    form.value = response.data
+    answers.value = response.data.initial_answers ?? []
+    if (!response.data.has_form) {
+      void router.replace(props.resolveCartPath())
+    }
+  } catch {
+    showAlert($t('cart.form_load_failed'))
+  } finally {
+    loading.value = false
+  }
+}
+
+watch(
+  cartItem,
+  () => {
+    void load()
+  },
+  { immediate: true },
+)
+
+const getOrderErrorMessage = (error: unknown): string | null => {
+  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
+    return getUserFacingFailedPreconditionMessage(error.message)
+  }
+  if (error instanceof Error) {
+    return getUserFacingFailedPreconditionMessage(error.message)
+  }
+  return null
+}
+
+const persistAttempt = async (): Promise<string | null> => {
+  const item = cartItem.value
+  const current = form.value
+  if (item == null || current?.definition_version == null) {
+    return null
+  }
+  const response = await saveOrderFormAttempt({
+    community_id: item.event.community_id,
+    event_id: item.event.event_id,
+    definition_version: current.definition_version,
+    answers: answers.value,
+  })
+  if (response.data.issues != null && response.data.issues.length > 0) {
+    issues.value = response.data.issues
+    return null
+  }
+  issues.value = []
+  return response.data.attempt_id
+}
+
+const startOrder = async (attemptId: string) => {
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  定義バージョン不一致を画面で処理する**

回答画面を開いてから管理者が設問を更新した場合、保存APIは `field_id` を持たない `version_mismatch` を返しますが、ここでは `issues` に格納するだけです。`FormAnswerFields` は各設問IDに一致する問題しか表示せず、さらに `onPrimary` は issue があると汎用アラートも出さないため、ボタンを押しても何も起きないように見えます。このコードを検出して最新フォームを再読込するか、少なくとも再読込を促す全体エラーを表示してください。

Useful? React with 👍 / 👎.

**コメント要約**: version_mismatch が画面に出ない
UX ラベルのため自動修正せず、再読込案内は未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 指摘は妥当だが 👤 UX があり条件付き自動修正の対象外。

---

**識別子**: RC-22（GitHub id: 4153874752）

**レビュワー**: Codex

**指摘箇所**: `base/src/composable/memberCsvExport.ts:161`

**該当コード（レビュー時点の diff）**:

```diff
@@ -111,3 +111,48 @@ export const buildEventMemberCsv = (
 export const downloadMemberCsv = (filename: string, content: string): void => {
   downloadCsv(filename, content)
 }
+
+export type EventFormResponseCsvRow = {
+  user_id: string
+  display_name: string
+  participation_label: string
+  answered_at: string
+  updated_at: string
+  answers: Array<{
+    field_label: string
+    display_value: string
+  }>
+}
+
+export const buildEventFormResponseCsv = (rows: EventFormResponseCsvRow[]): string => {
+  const labels: string[] = []
+  const seen = new Set<string>()
+  for (const row of rows) {
+    for (const answer of row.answers) {
+      if (!seen.has(answer.field_label)) {
+        seen.add(answer.field_label)
+        labels.push(answer.field_label)
+      }
+    }
+  }
+  const headers = [
+    'ユーザーID',
+    '表示名',
+    '参加状態',
+    '回答日時',
+    '更新日時',
+    ...labels.map((label) => `設問:${label}`),
+  ]
+  const csvRows = rows.map((row) => {
+    const byLabel = new Map(row.answers.map((answer) => [answer.field_label, answer.display_value]))
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  CSV列を設問IDで一意にする**

異なる設問に同じラベルを設定できるため、ラベルをキーにしたこの `Map` は同名設問の回答を後勝ちで上書きします。ヘッダー側もラベルで重複排除しているので、CSVでは一方の回答が欠落します。同コミットの仕様書 §4 でも同名時は設問IDをヘッダーへ付けて列を分ける要件になっているため、CSV入力に `field_id` を残し、IDで列を管理してください。

Useful? React with 👍 / 👎.

**コメント要約**: Codex の CSV 列重複は RC-8 と同じ
RC-8 で対応済み

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: RC-8 と同一内容。

---

**識別子**: RC-23（GitHub id: 4153874760）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:141`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・62 行）
+
+const load = async () => {
+  const item = cartItem.value
+  if (item == null) {
+    loading.value = false
+    showAlert($t('cart.form_load_failed'))
+    return
+  }
+  loading.value = true
+  try {
+    const response = await getOrderFormForCart({
+      community_id: item.event.community_id,
+      event_id: item.event.event_id,
+    })
+    form.value = response.data
+    answers.value = response.data.initial_answers ?? []
+    if (!response.data.has_form) {
+      void router.replace(props.resolveCartPath())
+    }
+  } catch {
+    showAlert($t('cart.form_load_failed'))
+  } finally {
+    loading.value = false
+  }
+}
+
+watch(
+  cartItem,
+  () => {
+    void load()
+  },
+  { immediate: true },
+)
+
+const getOrderErrorMessage = (error: unknown): string | null => {
+  if (error instanceof FirebaseError && error.code === 'functions/failed-precondition') {
+    return getUserFacingFailedPreconditionMessage(error.message)
+  }
+  if (error instanceof Error) {
+    return getUserFacingFailedPreconditionMessage(error.message)
+  }
+  return null
+}
+
+const persistAttempt = async (): Promise<string | null> => {
+  const item = cartItem.value
+  const current = form.value
+  if (item == null || current?.definition_version == null) {
+    return null
+  }
+  const response = await saveOrderFormAttempt({
+    community_id: item.event.community_id,
+    event_id: item.event.event_id,
+    definition_version: current.definition_version,
+    answers: answers.value,
+  })
+  if (response.data.issues != null && response.data.issues.length > 0) {
+    issues.value = response.data.issues
+    return null
+  }
+  issues.value = []
+  return response.data.attempt_id
+}
+
+const startOrder = async (attemptId: string) => {
+  const item = cartItem.value
+  if (item == null) {
+    return
+  }
+  if (!isWithinOrderDeadline(item.event.event_deadline_datetime)) {
+    showAlert($t('cart.cannot_order_deadline'))
+    return
+  }
+  const orderIds = sortOrderIdsForEnterpriseSubsidyReplay(item.orders)
+  if (needsStripe.value) {
+    try {
+      const response = await createStripeCheckoutSession({
+        community_id: item.event.community_id,
+        event_id: item.event.event_id,
+        order_ids: orderIds,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  回答画面でも選択解除済みメニューを拒否する**

フォーム付きイベントでは通常のカートにある `showConfirm` / `checkCart` を通らず、ここから直接注文処理へ進みます。このため、カート追加後に主催者がメニューの `is_selected` を解除した場合でも注文できてしまいます。`confirmOrder` と `createStripeCheckoutSession` のサーバー側再検証も売り切れと個数制限だけで `is_selected` を確認していないためです。回答画面でも共通のカート検証を実行するか、確定API側で選択中メニューであることを必ず検証してください。

Useful? React with 👍 / 👎.

**コメント要約**: 回答画面が is_selected 解除メニューを止めない
工数 M。確定 API 側の検証方針が必要で自動修正しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: M

**判断理由**: カート検証の抜けは妥当だが、UI だけ直すか confirmOrder / Checkout 側か方針が分かれ、工数 M。自動修正しない。

---

**識別子**: RC-24（GitHub id: 4153874774）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:74`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,233 @@
+<script setup lang="ts">
+import { storeToRefs } from 'pinia'
+import { FirebaseError } from 'firebase/app'
+import FormAnswerFields from '@shokujii/base/components/forms/FormAnswerFields.vue'
+import ConfirmDialog from '@shokujii/base/components/ConfirmDialog.vue'
+import { getOrderFormForCart, saveOrderFormAttempt } from '@shokujii/base/apis/form.js'
+import { createStripeCheckoutSession } from '@shokujii/base/apis/stripe'
+import { useCurrentUserStore } from '@shokujii/base/stores/currentUser'
+import { useEventStore, buildEventStoreOptions } from '@shokujii/base/stores/event'
+import { getAuth } from 'firebase/auth'
+import { computeTotalPayment } from '@shokujii/common/utils/paymentCommunityBillOffAmount.js'
+import { isWithinOrderDeadline } from '@shokujii/common/utils/orderDeadline.js'
+import { sortOrderIdsForEnterpriseSubsidyReplay } from '@shokujii/common/utils/eventMemberOrderSort.js'
+import { getUserFacingFailedPreconditionMessage } from '@shokujii/common/utils/failedPreconditionMessage.js'
+import { getEventPath } from '@/router/utils'
+import type { ResolveOrdersPathFn } from '@shokujii/base/types/profilePathResolvers.js'
+import type { FormAnswerInput, FormValidationIssue } from '@shokujii/common/utils/validateFormAnswers.js'
+import type { FormField } from '@shokujii/common/schemas/formFields.js'
+import type { GetOrderFormForCartResponse } from '@shokujii/common/apis/form.js'
+
+const props = defineProps<{
+  eventId: string
+  resolveOrdersPath: ResolveOrdersPathFn
+  resolveCartPath: () => string
+}>()
+
+const { t: $t } = useI18n()
+const router = useRouter()
+const { cart } = storeToRefs(useCurrentUserStore())
+
+const loading = ref(true)
+const saving = ref(false)
+const form = ref<GetOrderFormForCartResponse | null>(null)
+const answers = ref<FormAnswerInput[]>([])
+const issues = ref<FormValidationIssue[]>([])
+const alertMessage = ref('')
+const isOpenAlert = ref(false)
+const openConfirmOrder = ref(false)
+const confirmDialogMessage = ref('')
+
+const showAlert = (message: string) => {
+  alertMessage.value = message
+  isOpenAlert.value = true
+}
+
+const cartItem = computed(() => cart.value?.find((item) => item.event.event_id === props.eventId))
+const fields = computed<FormField[]>(() => form.value?.fields ?? [])
+
+const needsStripe = computed(() => {
+  const item = cartItem.value
+  if (item == null) {
+    return false
+  }
+  if (item.event.event_payment === 'user_advance') {
+    return true
+  }
+  if (item.event.event_payment === 'community_bill' && item.event.community_bill_settings?.type === 'discount') {
+    return computeTotalPayment(item.orders) > 0
+  }
+  return false
+})
+
+const load = async () => {
+  const item = cartItem.value
+  if (item == null) {
+    loading.value = false
+    showAlert($t('cart.form_load_failed'))
+    return
+  }
+  loading.value = true
+  try {
+    const response = await getOrderFormForCart({
+      community_id: item.event.community_id,
+      event_id: item.event.event_id,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  カートの未読込状態を注文なしと判定しない**

回答画面を直接再読み込みした場合、`currentUserStore.cart` の初期値は購読完了まで `null` なので、immediate watch から呼ばれた `load` はここで読込失敗アラートを開きます。その後カートが取得されてフォームの読込に成功してもアラートは閉じられず、正常な回答画面上に誤ったエラーダイアログが残ります。`cart === null` はローディングとして待機し、購読完了後に対象イベントが無い場合だけ失敗扱いにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: cart が null の間に読込失敗アラートが出る
UX ラベルのため自動修正せず未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 購読完了前の null を失敗扱いしている。👤 UX のため自動修正対象外。

---

**識別子**: RC-25（GitHub id: 4153874790）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/FormAnswerFields.vue:95`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・16 行）
+)
+
+const emit = defineEmits<{
+  'update:modelValue': [value: FormAnswerInput[]]
+}>()
+
+const { t: $t } = useI18n()
+
+const issueMessage = (fieldId: string): string => {
+  const issue = props.issues.find((item) => item.field_id === fieldId)
+  if (issue == null) {
+    return ''
+  }
+  return $t(`manage.forms.issues.${issue.code}`)
+}
+
+const answerFor = (fieldId: string): FormAnswerInput => {
+  return props.modelValue.find((answer) => answer.field_id === fieldId) ?? { field_id: fieldId }
+}
+
+const upsert = (next: FormAnswerInput) => {
+  const rest = props.modelValue.filter((answer) => answer.field_id !== next.field_id)
+  emit('update:modelValue', [...rest, next])
+}
+
+const setText = (fieldId: string, textValue: string) => {
+  upsert({ field_id: fieldId, text_value: textValue })
+}
+
+const setOption = (fieldId: string, optionId: string) => {
+  upsert({ field_id: fieldId, option_id: optionId })
+}
+
+const setOptions = (fieldId: string, optionIds: string[]) => {
+  upsert({ field_id: fieldId, option_ids: optionIds })
+}
+
+const visibleOptions = (field: FormField) => {
+  if (field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'select') {
+    return []
+  }
+  return field.options.filter((option) => !option.hidden_for_new)
+}
+</script>
+
+<template>
+  <div class="d-flex flex-column ga-4">
+    <div v-for="field in fields" :key="field.field_id">
+      <div class="text-subtitle-1 font-weight-medium mb-1">
+        {{ field.label }}
+        <span v-if="field.required" class="text-error">*</span>
+      </div>
+      <div v-if="field.description !== ''" class="text-body-2 text-medium-emphasis mb-2">
+        {{ field.description }}
+      </div>
+      <v-text-field
+        v-if="field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'date'"
+        :model-value="answerFor(field.field_id).text_value ?? ''"
+        :type="field.type === 'text' ? 'text' : field.type"
+        :disabled="disabled"
+        :error-messages="issueMessage(field.field_id)"
+        hide-details="auto"
+        variant="outlined"
+        @update:model-value="setText(field.field_id, String($event ?? ''))"
+      />
+      <v-textarea
+        v-else-if="field.type === 'textarea'"
+        :model-value="answerFor(field.field_id).text_value ?? ''"
+        :disabled="disabled"
+        :error-messages="issueMessage(field.field_id)"
+        hide-details="auto"
+        variant="outlined"
+        rows="4"
+        @update:model-value="setText(field.field_id, String($event ?? ''))"
+      />
+      <v-radio-group
+        v-else-if="field.type === 'radio'"
+        :model-value="answerFor(field.field_id).option_id ?? ''"
+        :disabled="disabled"
+        :error-messages="issueMessage(field.field_id)"
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  任意の単一選択回答を未回答へ戻せるようにする**

任意のラジオ設問に一度回答すると、このグループには選択解除手段がないため、再注文時に表示された過去の回答を未回答へ戻せません。任意設問は未回答を許可し、再注文フローでは過去回答を編集できる仕様なので、「未回答」の選択肢または回答をクリアする操作を用意してください。

Useful? React with 👍 / 👎.

**コメント要約**: 任意ラジオを未回答に戻せない
UX ラベルのため自動修正せず未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 任意設問のクリア操作は妥当な UX 改善。👤 UX のため自動修正対象外。

---

**識別子**: RC-26（GitHub id: 4153874798）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:223`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・144 行）
+        form_attempt_id: attemptId,
+      })
+      window.location.href = response.data.url ?? getEventPath(item.event.community_account, item.event.event_id)
+    } catch (error) {
+      showAlert(getOrderErrorMessage(error) ?? $t('cart.payment_failed'))
+    }
+    return
+  }
+  try {
+    const auth = getAuth()
+    const user = auth.currentUser
+    const token = user == null ? undefined : await user.getIdTokenResult()
+    const eventStore = useEventStore(
+      item.event.event_id,
+      buildEventStoreOptions(token?.claims.enterprise_id as string | undefined),
+    )
+    await eventStore.confirmOrder({
+      community_id: item.event.community_id,
+      event_id: item.event.event_id,
+      order_ids: orderIds,
+      form_attempt_id: attemptId,
+    })
+    await router.push(
+      props.resolveOrdersPath({ eventId: item.event.event_id, communityAccount: item.event.community_account }),
+    )
+  } catch (error) {
+    showAlert(getOrderErrorMessage(error) ?? $t('cart.order_failed'))
+  }
+}
+
+const onPrimary = async () => {
+  saving.value = true
+  try {
+    const attemptId = await persistAttempt()
+    if (attemptId == null) {
+      if (issues.value.length === 0) {
+        showAlert($t('cart.form_save_failed'))
+      }
+      return
+    }
+    if (needsStripe.value) {
+      await startOrder(attemptId)
+      return
+    }
+    confirmDialogMessage.value =
+      cartItem.value?.event.event_payment === 'user_on_day'
+        ? $t('cart.confirm_order_participant_on_day')
+        : $t('cart.confirm_order_community_bill')
+    pendingAttemptId.value = attemptId
+    openConfirmOrder.value = true
+  } catch (error) {
+    showAlert(getOrderErrorMessage(error) ?? $t('cart.form_save_failed'))
+  } finally {
+    saving.value = false
+  }
+}
+
+const pendingAttemptId = ref('')
+
+const confirmOrderNow = async () => {
+  saving.value = true
+  try {
+    await startOrder(pendingAttemptId.value)
+  } finally {
+    saving.value = false
+    openConfirmOrder.value = false
+  }
+}
+</script>
+
+<template>
+  <v-container class="manage-container py-8" style="max-width: 720px">
+    <div class="text-h5 mb-2">{{ $t('cart.form_page_title') }}</div>
+    <div v-if="form?.purpose" class="text-body-1 mb-6">{{ form.purpose }}</div>
+    <v-progress-circular v-if="loading" indeterminate color="primary" />
+    <template v-else-if="form?.has_form">
+      <FormAnswerFields v-model="answers" :fields="fields" :issues="issues" />
+      <v-btn class="mt-8" color="grey-900" size="x-large" rounded="pill" block :loading="saving" @click="onPrimary">
+        {{ needsStripe ? $t('cart.proceed_to_payment') : $t('cart.order_and_attend_event') }}
+      </v-btn>
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  回答の送信先コミュニティ名を表示する**

`getOrderFormForCart` は個人情報を受け取る主体として `community_name` を返していますが、回答画面ではタイトルと利用目的しか描画しておらず、利用者はどのコミュニティへ回答を送るのか確認できません。同コミットの仕様書 §4 でも受取先コミュニティ名の表示が明記されているため、フォームの冒頭に `form.community_name` を表示してください。

Useful? React with 👍 / 👎.

**コメント要約**: 回答画面に community_name が無い
§4 どおりだが UX/仕様書ラベルのため自動修正せず未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様書 §4 の受取先コミュニティ名表示。📑 と 👤 があるため自動修正対象外。

---

**識別子**: RC-27（GitHub id: 4153874807）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/formAdmin.ts:219`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・140 行）
+    purpose: data.purpose ?? '',
+    fields: normalized.fields,
+    archived: data.archived ?? existing.archived,
+    updated_by: uid,
+  })
+  await saveCommunityForm(data.community_id, updated)
+  return { form: toCommunityFormDetail(updated) }
+})
+
+export const duplicateCommunityForm = onCall(async (request): Promise<DuplicateCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id } = parseOrThrow(DuplicateCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const existing = await getCommunityForm(community_id, form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const duplicated = new CommunityForm('', {
+    community_id,
+    name: `${existing.name} のコピー`,
+    description: existing.description,
+    purpose: existing.purpose,
+    fields: cloneFormFields(existing.fields),
+    archived: false,
+    created_by: uid,
+    updated_by: uid,
+  })
+  const created = await createCommunityFormDoc(community_id, duplicated)
+  return { form: toCommunityFormDetail(created) }
+})
+
+export const archiveCommunityForm = onCall(async (request): Promise<ArchiveCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id, archived } = parseOrThrow(ArchiveCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const existing = await getCommunityForm(community_id, form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const updated = new CommunityForm(existing.id, { ...existing, archived, updated_by: uid })
+  await saveCommunityForm(community_id, updated)
+  return { form: toCommunityFormDetail(updated) }
+})
+
+export const getEventFormPresence = onCall(async (request): Promise<GetEventFormPresenceResponse> => {
+  const { community_id, event_id } = parseOrThrow(GetEventFormPresenceRequestSchema, request.data)
+  const event = await getEventInCommunity(community_id, event_id)
+  if (event == null) {
+    throw new HttpsError('not-found', 'イベントが見つかりません')
+  }
+  if (getEventEnterpriseId(event) != null) {
+    return { has_form: false }
+  }
+  const config = await getEventFormConfig(community_id, event_id)
+  return { has_form: config != null }
+})
+
+export const getEventFormConfigCallable = onCall(async (request): Promise<GetEventFormConfigResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id } = parseOrThrow(GetEventFormConfigRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  await requirePfEventForForm(community_id, event_id)
+  const config = await getEventFormConfig(community_id, event_id)
+  return { config: config == null ? null : toEventFormConfigDto(config) }
+})
+
+export const setEventFormFromCommunity = onCall(async (request): Promise<SetEventFormFromCommunityResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, event_id, form_id } = parseOrThrow(SetEventFormFromCommunityRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const event = await requirePfEventForForm(community_id, event_id)
+  assertEventFormEditable(event)
+  const form = await getCommunityForm(community_id, form_id)
+  if (form == null || form.archived) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const existing = await getEventFormConfig(community_id, event_id)
+  const config = new EventFormConfig('current', {
+    source_form_id: form.id,
+    definition_version: (existing?.definition_version ?? 0) + 1,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  削除後も定義バージョンを再利用しない**

フォーム設定を解除すると `form_configs/current` だけが削除され、既存の回答と試行は残ります。その後に別フォームを設定すると、ここで `existing` が無いためバージョンが再び `1` になり、旧フォームの確定回答や未消費試行も新フォームと同じバージョンとして扱われます。その結果、`planFormConfirmation` が新しい必須設問へ未回答の旧データを再利用・受理できます。解除を挟んでも単調増加する世代番号を別途保持するか、試行と定義を衝突しない識別子で照合してください。

Useful? React with 👍 / 👎.

**コメント要約**: 解除後の再設定で definition_version が 1 に戻る
世代の持ち方は仕様判断が必要なため自動修正しない

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 旧回答・試行と新フォームの版衝突は妥当。カウンタを残すか照合キーを変えるかは仕様判断。自動修正対象外。

---

**識別子**: RC-28（GitHub id: 4153874814）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/utils/formConfirm.ts:100`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・21 行）
+    return undefined
+  }
+  return getEventFormConfig(event.community_id, event.id, transaction)
+}
+
+export async function requireAttemptForLatestForm(params: {
+  event: ShokujiiEvent
+  userId: string
+  attemptId: string | undefined
+  config: EventFormConfig
+  transaction: Transaction
+}): Promise<FormCheckoutAttempt> {
+  if (params.attemptId == null || params.attemptId === '') {
+    throw new HttpsError('failed-precondition', '事前アンケートの回答が必要です')
+  }
+  const attempt = await getFormCheckoutAttempt(
+    params.event.community_id,
+    params.event.id,
+    params.attemptId,
+    params.transaction,
+  )
+  if (attempt == null || attempt.user_id !== params.userId) {
+    throw new HttpsError('failed-precondition', '事前アンケートの回答が見つかりません')
+  }
+  if (attempt.status === 'consumed') {
+    throw new HttpsError('failed-precondition', 'この回答はすでに使用されています')
+  }
+  if (attempt.definition_version !== params.config.definition_version) {
+    throw new HttpsError('failed-precondition', '設問が更新されています。回答画面でやり直してください')
+  }
+  return attempt
+}
+
+export type FormConfirmPlan =
+  | { kind: 'none' }
+  | { kind: 'reuse'; existing: FormResponse }
+  | { kind: 'apply'; attempt: FormCheckoutAttempt; existing?: FormResponse }
+
+export async function planFormConfirmation(params: {
+  event: ShokujiiEvent
+  userId: string
+  attemptId: string | undefined
+  transaction: Transaction
+}): Promise<FormConfirmPlan> {
+  const config = await loadEventFormConfigIfPf(params.event, params.transaction)
+  if (config == null) {
+    return { kind: 'none' }
+  }
+  const existing = await getFormResponse(params.event.community_id, params.event.id, params.userId, params.transaction)
+  if (params.attemptId != null && params.attemptId !== '') {
+    const attempt = await requireAttemptForLatestForm({
+      event: params.event,
+      userId: params.userId,
+      attemptId: params.attemptId,
+      config,
+      transaction: params.transaction,
+    })
+    return { kind: 'apply', attempt, existing }
+  }
+  if (existing != null && existing.definition_version === config.definition_version) {
+    return { kind: 'reuse', existing }
+  }
+  throw new HttpsError('failed-precondition', '事前アンケートの回答が必要です')
+}
+
+export async function applyAttemptToConfirmedResponse(params: {
+  event: ShokujiiEvent
+  userId: string
+  attempt: FormCheckoutAttempt
+  transaction: Transaction
+  existing?: FormResponse
+  ignoreDefinitionMismatch?: boolean
+}): Promise<void> {
+  const existing =
+    params.existing ??
+    (await getFormResponse(params.event.community_id, params.event.id, params.userId, params.transaction))
+  if (existing != null && existing.revision > params.attempt.revision_basis) {
+    params.attempt.status = 'consumed'
+    await saveFormCheckoutAttempt(params.event.community_id, params.event.id, params.attempt, params.transaction)
+    return
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  試行の新旧を確定順と混同しない**

同じ確定回答を基準に複数タブで試行 A、B の順に作成すると、両方の `revision_basis` は同じになります。古い A の Webhook が先に確定した場合、後から作成された B はここで単に破棄され、B に入力した最新回答がその後の注文確定時にも反映されません。逆順なら期待どおり A が破棄されるため、現状は回答の新旧ではなく Webhook の到着順で内容が決まります。試行作成時の世代を原子的に割り当て、確定済み回答がどの世代から作られたかと比較してください。

Useful? React with 👍 / 👎.

**コメント要約**: revision_basis だけでは試行の新旧が決まらない
世代割当は仕様判断が必要なため自動修正しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 複数タブ試行の到着順問題は妥当だが、原子的世代の追加はスキーマ変更を伴う仕様判断。自動修正対象外。

---

**識別子**: RC-29（GitHub id: 4153874818）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/formAdmin.ts:159`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・80 行）
+        name: form.name,
+        description: form.description,
+        purpose: form.purpose,
+        archived: form.archived,
+        field_count: form.fields.length,
+        updated_at: form.updated_at,
+      })),
+  }
+})
+
+export const getCommunityFormCallable = onCall(async (request): Promise<GetCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id } = parseOrThrow(GetCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const form = await getCommunityForm(community_id, form_id)
+  if (form == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  return { form: toCommunityFormDetail(form) }
+})
+
+export const createCommunityForm = onCall(async (request): Promise<CreateCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const data = parseOrThrow(CreateCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(data.community_id, uid)
+  const normalized = normalizeFormFields(data.fields)
+  if (!normalized.ok) {
+    throw new HttpsError('invalid-argument', normalized.message)
+  }
+  const form = new CommunityForm('', {
+    community_id: data.community_id,
+    name: data.name,
+    description: data.description ?? '',
+    purpose: data.purpose ?? '',
+    fields: normalized.fields,
+    archived: false,
+    created_by: uid,
+    updated_by: uid,
+  })
+  const created = await createCommunityFormDoc(data.community_id, form)
+  logger.info('コミュニティフォームを作成した', { communityId: data.community_id, formId: created.id, userId: uid })
+  return { form: toCommunityFormDetail(created) }
+})
+
+export const updateCommunityForm = onCall(async (request): Promise<UpdateCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const data = parseOrThrow(UpdateCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(data.community_id, uid)
+  const existing = await getCommunityForm(data.community_id, data.form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const normalized = normalizeFormFields(data.fields, existing.fields)
+  if (!normalized.ok) {
+    throw new HttpsError('invalid-argument', normalized.message)
+  }
+  const updated = new CommunityForm(existing.id, {
+    ...existing,
+    name: data.name,
+    description: data.description ?? '',
+    purpose: data.purpose ?? '',
+    fields: normalized.fields,
+    archived: data.archived ?? existing.archived,
+    updated_by: uid,
+  })
+  await saveCommunityForm(data.community_id, updated)
+  return { form: toCommunityFormDetail(updated) }
+})
+
+export const duplicateCommunityForm = onCall(async (request): Promise<DuplicateCommunityFormResponse> => {
+  const uid = await requireAuthUid(request.auth?.uid)
+  const { community_id, form_id } = parseOrThrow(DuplicateCommunityFormRequestSchema, request.data)
+  await requireCommunityManager(community_id, uid)
+  const existing = await getCommunityForm(community_id, form_id)
+  if (existing == null) {
+    throw new HttpsError('not-found', 'フォームが見つかりません')
+  }
+  const duplicated = new CommunityForm('', {
+    community_id,
+    name: `${existing.name} のコピー`,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  複製後のフォーム名を上限内に収める**

フォーム名は100文字まで許可されていますが、複製時に無条件で ` のコピー` を追加するため、上限付近の名前を複製すると `CommunityFormAppSchema.parse` が例外を投げ、複製操作が失敗します。接尾辞を含めて最大長になるよう元の名前を切り詰めるか、重複名の生成規則を上限内に収めてください。

Useful? React with 👍 / 👎.

**コメント要約**: 複製名が 100 文字を超えて失敗する
接尾辞込みで maxName に収まるよう切り詰めた

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 上限付近の複製が Zod で落ちる。📌 S 🔧 で接尾辞込み切り詰めを入れた。

