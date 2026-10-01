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
| [x] | RC-30 | 4153960889 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答画面が communityAccount を捨てている<br>RC-13 で props とカート照合にコミュニティを追加済み |
| [ ] | RC-31 | 4153960971 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 👤 UX, 🔒 セキュリティ | 📋 仕様追加 | M | フォーム経路が showConfirm のプロフィール確認を迂回する<br>共通化は仕様・UX・セキュリティ影響確認が必要なため自動修正しない |
| [x] | RC-32 | 4153961037 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | user_advance を常に Stripe 扱いにしている<br>支払合計が正のときだけ Checkout へ進むよう揃えた |
| [x] | RC-33 | 4153961111 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 削除済み設問が initial_answers に残る<br>RC-20 で表示可能な設問・選択肢へ絞り込済み |
| [x] | RC-34 | 4153961178 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 試行クエリが status を絞らず全履歴を読む<br>pending/frozen を Firestore 側で絞り複合インデックスを追加した |
| [x] | RC-35 | 5377550104 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview（09:37）は個別指摘の要約<br>実体は RC-30 以降のインラインで扱う |
| [x] | RC-36 | 5928841169 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 再依頼スレッドに旧指摘を再掲している<br>複合キー・Transaction・ID再採番等は RC-10〜18 で対応済み |
| [x] | RC-37 | 4154073678 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答形が設問タイプと違っても受理される<br>型不一致を type として拒否するよう検証した |
| [ ] | RC-38 | 4154073753 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | 試行回答に TTL や削除手段が無い<br>保持期間は仕様判断が必要なため自動修正しない |
| [x] | RC-39 | 4154073807 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CartFormAnswer が @/router/utils を直接 import している<br>ResolveEventPathFn を props 注入した |
| [x] | RC-40 | 4154073893 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CommunityFormEditor が @/router/utils を直接 import している<br>一覧パス resolver を props 注入した |
| [x] | RC-41 | 4154073944 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CommunityFormsPanel が @/router/utils を直接 import している<br>新規・編集パス resolver を props 注入した |
| [x] | RC-42 | 5377683596 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview（09:50）は個別指摘の要約<br>実体は RC-37〜41 のインラインで扱う |
| [x] | RC-43 | 5928905072 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 回答一覧 watch に community_id が無い<br>監視キーへ community_id を追加した。他残件は個別 RC |
| [x] | RC-44 | 4154080587 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 0円の事前決済を Stripe に送っている<br>RC-32 と同じ修正で対応済み |
| [x] | RC-45 | 4154080601 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 同じ field_id のラベル変更前後が CSV 1 列に潰れる<br>列キーを field_id と確定時ラベルの組にした |
| [ ] | RC-46 | 4154080609 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | フォーム API が中止・期限を検証しない<br>受付条件の置き場所は仕様判断のため自動修正しない |
| [x] | RC-47 | 4154080620 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 必須選択設問で表示選択肢が無くても保存できる<br>表示可能な選択肢を1件以上要求するよう正規化した |
| [ ] | RC-48 | 4154080629 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 回答一覧の並行 load が古い結果で上書きしうる<br>UX ラベルのため自動修正せず未着手 |
| [x] | RC-49 | 4154080641 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 未確定試行だけを Firestore クエリで取得する<br>RC-34 の status in クエリで対応済み |
| [x] | RC-50 | 4154080654 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 空白だけの設問ラベルを保存できてしまう<br>入力スキーマと正規化で trim 後に拒否した |
| [x] | RC-51 | 5377692040 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex overview は個別指摘の要約<br>実体は RC-44〜50 のインラインで扱う |
| [ ] | RC-52 | 4154240363 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | アカウント削除時にフォーム回答が残る<br>匿名化範囲はセキュリティ影響確認が必要なため自動修正しない |
| [ ] | RC-53 | 4154240377 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🆕 新機能 | M | 設問・選択肢の並べ替えUIが無い<br>MVPの並べ替えは仕様・UX付きのため自動修正しない |
| [x] | RC-54 | 4154240386 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | confirmOrder 成功後の遷移失敗を注文失敗と表示する<br>確定と遷移の try を分けた |
| [x] | RC-55 | 4154240400 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | フォームなしキャッシュが永続し後から追加したフォームを見落とす<br>注文ボタン押下時に no なら再取得する |
| [x] | RC-56 | 4154240407 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | カート購読のオブジェクト更新で入力中回答が消える<br>community_id と event_id だけを watch する |
| [x] | RC-57 | 4154240414 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 追加注文確定で hidden_for_new の過去回答が消える<br>非表示設問のスナップショットを既存回答から引き継ぐ |
| [x] | RC-58 | 5929156777 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 再依頼スレッドの残件まとめ<br>showConfirm は RC-31、版リセットは RC-27、revision_basis は RC-28、TTL は RC-38 |
| [x] | RC-59 | 5377884131 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex overview は個別指摘の要約<br>実体は RC-52〜57 のインラインで扱う |

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


## 評価セッション（2026-10-01 18:56・review-comments-evaluate）

- **評価日時**: 2026-10-01 18:56 JST
- **評価者**: Cursor Agent（review-comments-evaluate / auto）
- **ブランチ名**: feat/957-form
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2384
- **REVIEW_REQUEST_SINCE**: 2026-10-01T09:30:24Z
- **partial**: true（Codex が sentinel 時刻付近に到着）
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 4（依頼定型 5928674422 / 5928860291、Copilot エラー 5928677107、Codex unknown error 5928813203）
- **手順 4a 自動修正**: RC-32 / RC-34 / RC-37 / RC-39 / RC-40 / RC-41 / RC-43 / RC-44 / RC-47（🚨 9件）と RC-45 / RC-49 / RC-50（🟡 3件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [x] | RC-30 | 4153960889 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答画面が communityAccount を捨てている<br>RC-13 で props とカート照合にコミュニティを追加済み |
| [ ] | RC-31 | 4153960971 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 👤 UX, 🔒 セキュリティ | 📋 仕様追加 | M | フォーム経路が showConfirm のプロフィール確認を迂回する<br>共通化は仕様・UX・セキュリティ影響確認が必要なため自動修正しない |
| [x] | RC-32 | 4153961037 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | user_advance を常に Stripe 扱いにしている<br>支払合計が正のときだけ Checkout へ進むよう揃えた |
| [x] | RC-33 | 4153961111 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📑 仕様書 | 🔧 微修正 | S | 削除済み設問が initial_answers に残る<br>RC-20 で表示可能な設問・選択肢へ絞り込済み |
| [x] | RC-34 | 4153961178 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 試行クエリが status を絞らず全履歴を読む<br>pending/frozen を Firestore 側で絞り複合インデックスを追加した |
| [x] | RC-35 | 5377550104 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview（09:37）は個別指摘の要約<br>実体は RC-30 以降のインラインで扱う |
| [x] | RC-36 | 5928841169 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 再依頼スレッドに旧指摘を再掲している<br>複合キー・Transaction・ID再採番等は RC-10〜18 で対応済み |
| [x] | RC-37 | 4154073678 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 回答形が設問タイプと違っても受理される<br>型不一致を type として拒否するよう検証した |
| [ ] | RC-38 | 4154073753 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | 試行回答に TTL や削除手段が無い<br>保持期間は仕様判断が必要なため自動修正しない |
| [x] | RC-39 | 4154073807 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CartFormAnswer が @/router/utils を直接 import している<br>ResolveEventPathFn を props 注入した |
| [x] | RC-40 | 4154073893 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CommunityFormEditor が @/router/utils を直接 import している<br>一覧パス resolver を props 注入した |
| [x] | RC-41 | 4154073944 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 📏 規約 | 🔧 微修正 | S | CommunityFormsPanel が @/router/utils を直接 import している<br>新規・編集パス resolver を props 注入した |
| [x] | RC-42 | 5377683596 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Copilot overview（09:50）は個別指摘の要約<br>実体は RC-37〜41 のインラインで扱う |
| [x] | RC-43 | 5928905072 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 回答一覧 watch に community_id が無い<br>監視キーへ community_id を追加した。他残件は個別 RC |
| [x] | RC-44 | 4154080587 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💰 金銭 | 🔧 微修正 | S | 0円の事前決済を Stripe に送っている<br>RC-32 と同じ修正で対応済み |
| [x] | RC-45 | 4154080601 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 同じ field_id のラベル変更前後が CSV 1 列に潰れる<br>列キーを field_id と確定時ラベルの組にした |
| [ ] | RC-46 | 4154080609 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 📋 仕様追加 | M | フォーム API が中止・期限を検証しない<br>受付条件の置き場所は仕様判断のため自動修正しない |
| [x] | RC-47 | 4154080620 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 必須選択設問で表示選択肢が無くても保存できる<br>表示可能な選択肢を1件以上要求するよう正規化した |
| [ ] | RC-48 | 4154080629 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 👤 UX | 🔧 微修正 | S | 回答一覧の並行 load が古い結果で上書きしうる<br>UX ラベルのため自動修正せず未着手 |
| [x] | RC-49 | 4154080641 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 未確定試行だけを Firestore クエリで取得する<br>RC-34 の status in クエリで対応済み |
| [x] | RC-50 | 4154080654 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | 空白だけの設問ラベルを保存できてしまう<br>入力スキーマと正規化で trim 後に拒否した |
| [x] | RC-51 | 5377692040 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex overview は個別指摘の要約<br>実体は RC-44〜50 のインラインで扱う |

---

**識別子**: RC-30（GitHub id: 4153960889）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue`

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
```

**レビュワーのコメント（原文）**:

[must] 回答画面ではカート項目を `event_id` だけで選んでいるため、別コミュニティに同じ ID のイベントがあると、URL の `communityAccount` と異なる注文へ回答・確定します。ルートに既に含まれる communityAccount も props で渡し、`community_account` と `event_id` の両方で照合してください。

**コメント要約**: 回答画面が communityAccount を捨てている
RC-13 で props とカート照合にコミュニティを追加済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同一指摘は RC-13 で対応済み。今回の Files changed でも communityAccount 照合が残っている。
---

**識別子**: RC-31（GitHub id: 4153960971）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/pages/cart.vue:519`

**該当コード（レビュー時点の diff）**:

```diff
@@ -447,6 +451,75 @@ const enrichedCart = computed<EnrichedCartItem[] | null>(() => {
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
+    formPresenceByEventId.value = {
+      ...formPresenceByEventId.value,
+      [eventId]: response.data.has_form ? 'yes' : 'no',
+    }
+  } catch {
+    formPresenceByEventId.value = { ...formPresenceByEventId.value, [eventId]: 'error' }
+  }
+}
+
+watch(
+  () => enrichedCart.value?.map((item) => item.event.event_id).join(',') ?? '',
+  () => {
+    for (const item of enrichedCart.value ?? []) {
+      void loadFormPresence(item.event)
+    }
+  },
+  { immediate: true },
+)
+
+const formPresenceOf = (eventId: string): FormPresence => formPresenceByEventId.value[eventId] ?? 'loading'
+
+const primaryCartButtonLabel = (item: EnrichedCartItem): string => {
+  if (formPresenceOf(item.event.event_id) === 'yes') {
+    return $t('cart.answer_pre_event_form')
+  }
+  return needsStripeCheckoutForItem(item) ? $t('cart.proceed_to_payment') : $t('cart.order_and_attend_event')
+}
+
+const onPrimaryCartButton = async (item: EnrichedCartItem) => {
+  const presence = formPresenceOf(item.event.event_id)
+  if (presence === 'loading') {
+    return
+  }
+  if (presence === 'error') {
+    alertBody.value = $t('cart.form_presence_failed')
+    return
+  }
+  if (presence === 'yes') {
+    const path = props.resolveFormAnswerPath
+    if (path == null) {
+      alertBody.value = $t('cart.form_presence_failed')
+      return
```

**レビュワーのコメント（原文）**:

[must] フォームありの場合は既存の `showConfirm` を通らず遷移するため、同関数が必須としているユーザー名・画像・メールの確認（`cart.vue:708-723`）がすべて迂回されます。フォーム回答後にも同じ事前条件を適用できる共通処理へ切り出し、未登録ユーザーがこの経路だけ注文できないようにしてください。

**コメント要約**: フォーム経路が showConfirm のプロフィール確認を迂回する
共通化は仕様・UX・セキュリティ影響確認が必要なため自動修正しない

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX, 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 指摘は妥当。未登録プロフィールでの注文防止は既存カート経路との共通化が必要で、UX/セキュリティの影響確認が要る。自動修正対象外。
---

**識別子**: RC-32（GitHub id: 4153961037）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:61`

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
```

**レビュワーのコメント（原文）**:

[must] `user_advance` を常に Stripe 扱いにすると、0円の事前決済イベントまで Checkout に送られ、既存カートの `confirmOrder` 経路（`cart.vue:523-528`）と挙動が変わります。0円注文は既存のエミュレータテストでも `confirmOrder` 対象です。支払合計が正のときだけ Stripe を使ってください。

**コメント要約**: user_advance を常に Stripe 扱いにしている
支払合計が正のときだけ Checkout へ進むよう揃えた

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 0円の事前決済は既存カートが confirmOrder へ進む。フォーム画面も computeTotalPayment > 0 に揃えた。
---

**識別子**: RC-33（GitHub id: 4153961111）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/formOrder.ts:102`

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
```

**レビュワーのコメント（原文）**:

[must] 既存回答を定義バージョンに関係なく返すと、設問削除後は未知の field_id、選択肢非表示後は未知の option_id が `saveOrderFormAttempt` に再送され、回答画面を編集しても保存できません。現在の可視設問・選択肢に適用できる値だけへ正規化するか、バージョン不一致時の復元方針を明示して処理してください。

**コメント要約**: 削除済み設問が initial_answers に残る
RC-20 で表示可能な設問・選択肢へ絞り込済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 同一指摘は RC-20 で対応済み。
---

**識別子**: RC-34（GitHub id: 4153961178）

**レビュワー**: Copilot

**指摘箇所**: `functions/default/src/stores/form.ts:241`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・242 行）
+  eventId: string,
+  userId: string,
+  transaction?: Transaction,
+): Promise<FormResponse | undefined> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(userId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const listFormResponses = async (communityId: string, eventId: string): Promise<FormResponse[]> => {
+  const snapshot = await formResponsesCollection(communityId, eventId).get()
+  return snapshot.docs.map((doc) => doc.data())
+}
+
+export const saveFormResponse = async (
+  communityId: string,
+  eventId: string,
+  response: FormResponse,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(response.id)
+  if (transaction === undefined) {
+    await ref.set(response)
+  } else {
+    transaction.set(ref, response)
+  }
+}
+
+export const createFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  src: Partial<FormCheckoutAttempt>,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc()
+  const attempt = new FormCheckoutAttempt(ref.id, src)
+  if (transaction === undefined) {
+    await ref.set(attempt)
+  } else {
+    transaction.set(ref, attempt)
+  }
+  return attempt
+}
+
+export const getFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  attemptId: string,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt | undefined> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc(attemptId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const saveFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  attempt: FormCheckoutAttempt,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc(attempt.id)
+  if (transaction === undefined) {
+    await ref.set(attempt)
+  } else {
+    transaction.set(ref, attempt)
+  }
+}
+
+export const listPendingFormCheckoutAttemptsForUser = async (
+  communityId: string,
+  eventId: string,
+  userId: string,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt[]> => {
+  const query = formAttemptsCollection(communityId, eventId).where('user_id', '==', userId)
+  const snapshot = await (transaction === undefined ? query.get() : transaction.get(query))
+  return snapshot.docs
+    .map((doc) => doc.data())
+    .filter((attempt) => attempt.status === 'pending' || attempt.status === 'frozen')
```

**レビュワーのコメント（原文）**:

[must] このクエリは status を Firestore 側で絞らず、消費済み試行も含む全履歴を毎回読み込んでからメモリで除外します。試行は削除されず保存操作ごとに増えるため、再注文を重ねるほど読み取り件数と遅延が無制限に増えます。pending/frozen のみを updated_at 降順・limit(1) で取得してください。

**コメント要約**: 試行クエリが status を絞らず全履歴を読む
pending/frozen を Firestore 側で絞り複合インデックスを追加した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 消費済みを毎回読むのは妥当。limit(1) は現行の版一致探索と合わないため入れず、status in クエリにした。
---

**識別子**: RC-35（GitHub id: 5377550104）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル（Copilot overview）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

0円注文の決済経路、旧回答の復元、複合イベント識別、CSV欠落、デプロイ順序などに未解決の問題があります。

**Review effort:** Balanced  
**Findings:** 6 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 8 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (15)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [communityAccountとevent_idの複合条件で回答対象を照合する](#discussion_r4153960889) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [フォーム回答後もshowConfirm相当の事前確認を適用する](#discussion_r4153960971) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [communityAccount欠落による別コミュニティのカート項目誤選択](#discussion_r4153855187)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Webhook更新とセッション作成の競合による状態上書き](#discussion_r4153855119)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [definition_version更新の競合による版番号重複](#discussion_r4153855054)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [event_id単独キーによる別コミュニティ間のフォーム状態混同](#discussion_r4153854964)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [0円注文ではStripeを使わず既存のconfirmOrder経路を維持する](#discussion_r4153961037) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [定義バージョンに応じて既存回答を有効な値へ正規化する](#discussion_r4153961111) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [pending/frozenのみをFirestoreで絞りupdated_at降順で1件取得する](#discussion_r4153961178) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [回答者ごとのgetUser呼び出しによるN+1読取](#discussion_r4153855465)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問ラベル重複と版変更による回答列の上書き](#discussion_r4153855410)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Functions未デプロイ時に注文全体が停止するデプロイ順序問題](#discussion_r4153855345)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [取得失敗時に前回の回答一覧が残る](#discussion_r4153855298)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問タイプ変更時に既存field_idが残り保存できない](#discussion_r4153855235)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [注文確定の状態遷移と競合処理を検証するテスト不足](#discussion_r4153855528)
</details>

**コメント要約**: Copilot overview（09:37）は個別指摘の要約
実体は RC-30 以降のインラインで扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview のみ。個別指摘はインライン RC で評価する。
---

**識別子**: RC-36（GitHub id: 5928841169）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル（再依頼スレッド）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

現行の Files changed を確認しました。この環境には新規インライン review comment を作成する操作がないため、該当箇所を明記して本スレッドに報告します。

🚨 **必須修正** [🔧微修正/M]: カートのフォーム有無キャッシュと回答画面のカート項目検索が `event_id` 単独です。同じIDを持つ異なるコミュニティのイベントがある場合、フォーム有無・設問・回答対象が混線します。`community_id` と `event_id` でキャッシュ・watch・参照を統一し、回答画面にもコミュニティを渡してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/pages/cart.vue:451-493`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/forms/CartFormAnswer.vue:21-46`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/user/src/pages/cart/form/[communityAccount]/[eventId].vue:5-9`

🚨 **必須修正** [🔧微修正/M]: イベント設定の `definition_version` をトランザクション外で読み、加算して保存しています。同時更新で同じ版が発行され、試行回答が別定義に対して版一致扱いになります。設定・更新の両経路で読取と版加算・保存をトランザクションに含めてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/formAdmin.ts:216-223,239-253`

🚨 **必須修正** [🔧微修正/M]: Stripe セッション作成後の attempt 読取・全体 set が非トランザクションです。Webhook が先に `consumed` にした後、古い `frozen` を書き戻す競合が残ります。状態を維持したまま session ID を記録するトランザクション更新にし、競合時は再読込してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/stripe.ts:340-345`

🚨 **必須修正** [🔧微修正/S]: 設問種別を変えても既存 `field_id` が残ります。`normalizeFormFields` は同じIDの種別変更を拒否するため、既存設問の種別変更を含むフォームは保存できません。種別変更時はIDを外して新設問として採番してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/forms/FormFieldsEditor.vue:76-85`

🚨 **必須修正** [🔧微修正/S]: 回答一覧の再取得失敗時に前回の `responses` と `selected` が残ります。フィルター・イベント変更後に取得が失敗すると旧条件の回答を新条件の結果として表示・CSV出力でき、詳細も古いままです。load 開始時に両方をクリアし、イベント監視には `community_id` も含めてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/manage/event/EventFormResponsesPanel.vue:17-46`

🚨 **必須修正** [🔧微修正/S]: CSV列の重複排除・行内Mapが `field_label` だけをキーにしています。同じラベルの別設問は1列に潰れ、回答値は後勝ちで欠落します。また版ごとにラベルが違う同一設問も別列化されます。APIから `field_id` を保持し、列キーを `field_id` と確定時ラベルの組にしてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/composable/memberCsvExport.ts:129-169`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/manage/event/EventFormResponsesPanel.vue:52-65`

🚨 **必須修正** [🔧微修正/M]: 新 Callable の Functions デプロイ完了前に user/base が先行デプロイされる可能性が残っています。PF カートは `getEventFormPresence` の失敗を `error` として注文停止するため、その時間帯はフォーム有無に関係なく注文不能になります。既存 `deploy_functions` と `deploy_user` は同じ push で独立起動するため、Functions 成功後だけ新 UI を有効化する等、順序を保証する移行策が必要です。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/pages/cart.vue:469-480`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/.github/workflows/deploy_functions.yml:7-20,76-88`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/.github/workflows/deploy_user.yml:3-11`

🟡 **修正提案** [📐リファクタ/M]: `formConfirm.ts` の新しい確定・再利用・版不一致・revision競合の分岐を検証する Functions 側テストがありません。注文確定のデータ整合性を担うため、状態遷移・再送・競合時に既存回答を上書きしないケースを追加してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/utils/formConfirm.ts:26-125`

🟡 **修正提案** [📐リファクタ/S]: 一覧取得で回答ごとに `getUser` を発行しています。回答数に比例する読み取りになるため、既存の `getUsersByUserIds` でまとめて取得する形を検討してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/formAdmin.ts:285-310`

確認できた点: Firestore Rules は新規フォームコレクションへのクライアント直アクセスを拒否しており、申込者向け Callable はイベント側の `form_config` を参照しています。confirmOrder と Webhook の回答確定はそれぞれ注文確定トランザクション内にあり、参加状態は ordered 注文から導出されています。PR verify と Firestore Rules の最新 run は成功、PR verify の failed jobs はありませんでした。


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

レビュー結果は再依頼コメント #5928674422 のスレッドに、該当ファイル・行とともにまとめて返信しました。この環境では新規インライン review comment を作成できないため、依頼コメントへの返信で報告しています。

**コメント要約**: 再依頼スレッドに旧指摘を再掲している
複合キー・Transaction・ID再採番等は RC-10〜18 で対応済み

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: スレッドまとめ。新規の固有指摘は後続インライン / RC-43 で扱う。
---

**識別子**: RC-37（GitHub id: 4154073678）

**レビュワー**: Copilot

**指摘箇所**: `common/src/utils/validateFormAnswers.ts:80`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・81 行）
+import { DateTime } from 'luxon'
+import { isValidEmail, isValidPhone } from './contactFormat.js'
+import { FORM_DATE_ANSWER_PATTERN, FORM_FIELD_LIMITS, type FormField, type FormOption } from '../schemas/formFields.js'
+import type { FormAnswerSnapshot } from '../schemas/FormResponse.js'
+
+export type FormAnswerInput = {
+  field_id: string
+  text_value?: string
+  option_id?: string
+  option_ids?: string[]
+}
+
+export type FormValidationIssue = {
+  field_id?: string
+  code:
+    | 'required'
+    | 'type'
+    | 'unknown_field'
+    | 'unknown_option'
+    | 'too_long'
+    | 'invalid_email'
+    | 'invalid_phone'
+    | 'invalid_date'
+    | 'version_mismatch'
+}
+
+export type FormValidationResult =
+  | { ok: true; answers: FormAnswerSnapshot[] }
+  | { ok: false; issues: FormValidationIssue[] }
+
+function isBlank(value: string | undefined): boolean {
+  return value == null || value.trim() === ''
+}
+
+function visibleFields(fields: FormField[]): FormField[] {
+  return fields.filter((field) => !field.hidden_for_new)
+}
+
+function visibleOptions(options: FormOption[]): FormOption[] {
+  return options.filter((option) => !option.hidden_for_new)
+}
+
+function isValidDateString(value: string): boolean {
+  if (!FORM_DATE_ANSWER_PATTERN.test(value)) {
+    return false
+  }
+  const parsed = DateTime.fromISO(value, { zone: 'utc' })
+  return parsed.isValid && parsed.toISODate() === value
+}
+
+function findAnswer(answers: FormAnswerInput[], fieldId: string): FormAnswerInput | undefined {
+  return answers.find((answer) => answer.field_id === fieldId)
+}
+
+export function validateFormAnswers(params: {
+  fields: FormField[]
+  answers: FormAnswerInput[]
+  definitionVersion: number
+  expectedDefinitionVersion?: number
+}): FormValidationResult {
+  const issues: FormValidationIssue[] = []
+  if (params.expectedDefinitionVersion != null && params.expectedDefinitionVersion !== params.definitionVersion) {
+    issues.push({ code: 'version_mismatch' })
+    return { ok: false, issues }
+  }
+
+  const knownIds = new Set(params.fields.map((field) => field.field_id))
+  for (const answer of params.answers) {
+    if (!knownIds.has(answer.field_id)) {
+      issues.push({ field_id: answer.field_id, code: 'unknown_field' })
+    }
+  }
+
+  const snapshots: FormAnswerSnapshot[] = []
+  for (const field of visibleFields(params.fields)) {
+    const answer = findAnswer(params.answers, field.field_id)
+    if (field.type === 'checkbox' || field.type === 'radio' || field.type === 'select') {
+      const options = visibleOptions(field.options)
+      if (field.type === 'checkbox') {
+        const optionIds = answer?.option_ids ?? []
```

**レビュワーのコメント（原文）**:

[must] 回答値の形が設問タイプと一致するかを検証していません。例えば任意の checkbox に `{ field_id, text_value: 'x' }` を送ると `option_ids` が空として扱われ、`ok: true` で黙って受理されます。`FormValidationIssue` に `type` が定義済みなので、選択式では対応する option 値だけ、自由入力式では `text_value` だけを許可し、不一致を `type` として拒否してください。

**コメント要約**: 回答形が設問タイプと違っても受理される
型不一致を type として拒否するよう検証した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 任意 checkbox に text_value だけ送ると空回答扱いで通るのは不具合。shape 検査を追加した。
---

**識別子**: RC-38（GitHub id: 4154073753）

**レビュワー**: Copilot

**指摘箇所**: `common/src/schemas/FormCheckoutAttempt.ts:16`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,77 @@
+import { z } from 'zod'
+import { EpochMillisSchema, NonEmptyStringSchema, TimestampSchema } from './firebase/index.js'
+import { FormAnswerSnapshotSchema, type FormAnswerSnapshot } from './FormResponse.js'
+
+export const FORM_CHECKOUT_ATTEMPT_STATUS_VALUES = ['pending', 'frozen', 'consumed'] as const
+export type FormCheckoutAttemptStatus = (typeof FORM_CHECKOUT_ATTEMPT_STATUS_VALUES)[number]
+
+const FormCheckoutAttemptDbSchema = z.object({
+  user_id: z.string().min(1),
+  definition_version: z.number().int().positive(),
+  revision_basis: z.number().int().nonnegative(),
+  answers: z.array(FormAnswerSnapshotSchema),
+  status: z.enum(FORM_CHECKOUT_ATTEMPT_STATUS_VALUES),
+  stripe_session_id: NonEmptyStringSchema.optional(),
+  created_at: TimestampSchema,
+  updated_at: TimestampSchema,
```

**レビュワーのコメント（原文）**:

[must] `form_checkout_attempts` にはアンケートの個人情報が保存されますが、作成日時だけで失効時刻や削除処理がなく、決済離脱・失敗の試行が無期限に蓄積します。同PRの仕様案でも未決済回答の保持・削除手段を公開前に決めるとしているため、保持期間を確定し、TTL用フィールドまたは定期削除と必要な設定を追加してください。

**コメント要約**: 試行回答に TTL や削除手段が無い
保持期間は仕様判断が必要なため自動修正しない

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 個人情報の保持は公開前に決める項目。TTL フィールドや定期削除は仕様追加であり自動修正しない。
---

**識別子**: RC-39（GitHub id: 4154073807）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:16`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,238 @@
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
```

**レビュワーのコメント（原文）**:

[must] 注文履歴・カートの遷移先は props で注入している一方、フォールバック先だけ `@/router/utils` を直接 import しており、`base` が user のルートへ依存しています。`ResolveEventPathFn` を props に追加し、user の回答ページから `getEventPath` を渡してください。

**コメント要約**: CartFormAnswer が @/router/utils を直接 import している
ResolveEventPathFn を props 注入した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: base が user ルートへ依存するのは規約違反。既存の path resolver 注入に揃えた。
---

**識別子**: RC-40（GitHub id: 4154073893）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/manage/community/CommunityFormEditor.vue:14`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,186 @@
+<script setup lang="ts">
+import FormFieldsEditor from '@shokujii/base/components/forms/FormFieldsEditor.vue'
+import FormAnswerFields from '@shokujii/base/components/forms/FormAnswerFields.vue'
+import { useAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
+import { useNotification } from '@shokujii/base/composable/notification.js'
+import { createCommunityForm, getCommunityForm, updateCommunityForm } from '@shokujii/base/apis/form.js'
+import type { FormFieldInput } from '@shokujii/common/apis/form.js'
+import {
+  FORM_FIELD_LIMITS,
+  FormFieldSchema,
+  isChoiceFieldType,
+  type FormField,
+} from '@shokujii/common/schemas/formFields.js'
+import { getManageCommunityFormsPath } from '@/router/utils'
```

**レビュワーのコメント（原文）**:

[must] この `base` コンポーネントも user の `@/router/utils` へ直接依存しています。共有層の依存方向を維持するため、一覧へ戻る resolver を props で受け取り、ページ shell から渡してください（既存例: `base/src/types/profilePathResolvers.ts:3-10`）。

**コメント要約**: CommunityFormEditor が @/router/utils を直接 import している
一覧パス resolver を props 注入した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 共有層の依存方向を維持するため、ページ shell からパスを渡す。
---

**識別子**: RC-41（GitHub id: 4154073944）

**レビュワー**: Copilot

**指摘箇所**: `base/src/components/manage/community/CommunityFormsPanel.vue:7`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,113 @@
+<script setup lang="ts">
+import { useAppCommunityStore } from '@shokujii/base/composable/useAppCommunityStore.js'
+import { useNotification } from '@shokujii/base/composable/notification.js'
+import { archiveCommunityForm, duplicateCommunityForm, listCommunityForms } from '@shokujii/base/apis/form.js'
+import type { CommunityFormSummary } from '@shokujii/common/apis/form.js'
+import { convertToDatetime } from '@shokujii/common/utils/datetime.js'
+import { getManageCommunityFormEditPath, getManageCommunityFormNewPath } from '@/router/utils'
```

**レビュワーのコメント（原文）**:

[must] `base` コンポーネントから app 固有の `@/router/utils` を直接参照しており、共有層が user のルート構成へ依存しています。`base/src/types/profilePathResolvers.ts:3-10` の既存パターンどおり、新規・編集パスの resolver を props で受け取り、user 側の shell から注入してください。

**コメント要約**: CommunityFormsPanel が @/router/utils を直接 import している
新規・編集パス resolver を props 注入した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 📏 規約

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: RC-39 / RC-40 と同じ規約違反。user のコミュニティ管理画面から渡す。
---

**識別子**: RC-42（GitHub id: 5377683596）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル（Copilot overview）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

0円注文の失敗、回答型検証の不足、個人情報を含む試行回答の保持問題が残っています。

**Review effort:** Balanced  
**Findings:** 2 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 5 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 4 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (11)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [設問タイプと異なる回答形式を検証せず受理している](#discussion_r4154073678) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [フォーム回答後もshowConfirm相当の事前確認を適用する](#discussion_r4153960971)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [決済失敗試行の個人情報が無期限に蓄積する](#discussion_r4154073753) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [pending/frozenのみをFirestoreで絞りupdated_at降順で1件取得する](#discussion_r4153961178)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [0円注文ではStripeを使わず既存のconfirmOrder経路を維持する](#discussion_r4153961037)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問ラベル重複と版変更による回答列の上書き](#discussion_r4153855410)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Functions未デプロイ時に注文全体が停止するデプロイ順序問題](#discussion_r4153855345)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [イベント遷移のフォールバックがuserのルーターへ直接依存している](#discussion_r4154073807) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [baseコンポーネントが一覧遷移でuserのルーターへ直接依存している](#discussion_r4154073893) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [baseコンポーネントがuserのルーターへ直接依存している](#discussion_r4154073944) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [注文確定の状態遷移と競合処理を検証するテスト不足](#discussion_r4153855528)
</details>

<details>
<summary><strong>Resolved since last review (9)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [communityAccountとevent_idの複合条件で回答対象を照合する](#discussion_r4153960889)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [communityAccount欠落による別コミュニティのカート項目誤選択](#discussion_r4153855187)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Webhook更新とセッション作成の競合による状態上書き](#discussion_r4153855119)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [definition_version更新の競合による版番号重複](#discussion_r4153855054)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [event_id単独キーによる別コミュニティ間のフォーム状態混同](#discussion_r4153854964)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [定義バージョンに応じて既存回答を有効な値へ正規化する](#discussion_r4153961111)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [回答者ごとのgetUser呼び出しによるN+1読取](#discussion_r4153855465)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [取得失敗時に前回の回答一覧が残る](#discussion_r4153855298)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [設問タイプ変更時に既存field_idが残り保存できない](#discussion_r4153855235)
</details>

**コメント要約**: Copilot overview（09:50）は個別指摘の要約
実体は RC-37〜41 のインラインで扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview のみ。
---

**識別子**: RC-43（GitHub id: 5928905072）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル（再依頼スレッド）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

8コミット時点の Files changed を確認しました。前回指摘のうち、フォーム有無の複合キー、版更新とStripe attempt更新のTransaction、設問種別変更時のID再採番、一覧ロード時クリア、communityAccountの照合、初期回答の絞り込み、ユーザー一括取得、重複ラベルのCSV列分離は反映されています。

この環境では新規インライン review comment を作成する操作がないため、残件を該当箇所付きで報告します。

🚨 **必須修正** [🔧微修正/S]: フォーム回答画面では `user_advance` を金額に関係なく Stripe Checkout に送ります。一方、`createStripeCheckoutSession` は支払額0円を拒否するため、0円の事前決済イベントでフォーム付き注文を確定できません。共有カートと同様に支払合計が正のときだけ Stripe を使い、0円は `confirmOrder` に進めてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/forms/CartFormAnswer.vue:54-65`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/stripe.ts:229-235`

🚨 **必須修正** [🔧微修正/M]: フォームありイベントではカートの `showConfirm` を通らず回答画面へ進み、回答送信後に直接注文確定できます。`showConfirm` が確認しているユーザー名・画像・メールの必須条件をこの経路は確認していません。注文確定前にも同じ条件を適用し、未登録プロフィールでフォーム経由だけ注文できる状態を防いでください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/pages/cart.vue:515-524,712-729`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/forms/CartFormAnswer.vue:179-211`

🚨 **必須修正** [🔧微修正/M]: Functions と user hosting は同一 push で独立起動します。`deploy_functions` の成功後にアプリを dispatch する処理があっても、`deploy_user` の push 起動自体は止まらないため、新Callableのデプロイ前に新UIが公開され得ます。その時間帯はCallable失敗をフォーム取得エラーとして扱い、PF注文を停止します。Functions成功後だけアプリを公開するなど、初回デプロイを直列化してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/.github/workflows/deploy_functions.yml:7-20,76-88`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/.github/workflows/deploy_user.yml:3-11`、`/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/pages/cart.vue:471-482`

🚨 **必須修正** [🔧微修正/S]: CSV列を `field_id` だけで統合し、ヘッダーの設問文言は最初に出た回答のラベルだけを使います。同じ設問のラベル変更前後の確定回答が混在すると、過去回答まで新旧どちらか一方の文言の列に入り、回答時点のスナップショットをCSVで識別できません。列識別を `field_id` と確定時 `field_label` の組にしてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/composable/memberCsvExport.ts:142-177`

🚨 **必須修正** [🔧微修正/S]: 回答一覧パネルの再取得監視が `event_id` とフィルターだけで、`community_id` を含みません。同一 `event_id` の別コミュニティに切り替わっても再取得されず、前のイベントの回答が残る可能性があります。監視キーに `community_id` も加えてください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/base/src/components/manage/event/EventFormResponsesPanel.vue:22-50`

🟡 **修正提案** [📐リファクタ/S]: `listPendingFormCheckoutAttemptsForUser` はユーザーの全試行履歴を読み込んでから、メモリ上で pending/frozen を抽出しています。試行は保存のたびに蓄積するため、継続利用で読み取り件数が増え続けます。状態をFirestoreクエリで絞り、最新の必要件数だけを取得する方法を検討してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/stores/form.ts:231-242`

🟡 **修正提案** [📐リファクタ/M]: 注文確定を担う `formConfirm.ts` に、consumed・版不一致・revision競合・既存回答再利用および再送時のテストが見当たりません。状態遷移ごとのテスト追加を検討してください。対象: `/home/runner/work/bokudeli-event-new/bokudeli-event-new/functions/default/src/utils/formConfirm.ts:26-125`

確認状況: Firestore Rules テストは最新コミットで成功。最新PR verify は確認時点で実行中（lint・format・Functions deploy verifier は成功、typecheck以降は未完了）です。

**コメント要約**: 回答一覧 watch に community_id が無い
監視キーへ community_id を追加した。他残件は個別 RC

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 残件まとめのうち、community_id 監視はこのコメント固有。0円は RC-32、showConfirm は RC-31、デプロイ順は RC-16、CSV 世代は RC-45、試行クエリは RC-34。
---

**識別子**: RC-44（GitHub id: 4154080587）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:61`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,238 @@
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
+  communityAccount: string
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
+const cartItem = computed(() =>
+  cart.value?.find(
+    (item) => item.event.event_id === props.eventId && item.event.community_account === props.communityAccount,
+  ),
+)
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
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  0円の事前決済注文を通常の確定処理へ戻す**

`user_advance` を金額に関係なく Stripe 扱いにしているため、無料メニューだけのフォーム付きイベントでも `createStripeCheckoutSession` が呼ばれます。同 API は支払額が 0 円なら拒否する一方、通常カートは `totalPrice > 0` の場合だけ Stripe を使うため、このケースでは利用者が回答後の注文を完了できません。合計額も含めて判定し、0円なら `confirmOrder` へ進めてください。

Useful? React with 👍 / 👎.

**コメント要約**: 0円の事前決済を Stripe に送っている
RC-32 と同じ修正で対応済み

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💰 金銭

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: Copilot RC-32 と同一。支払合計が正のときだけ Stripe。
---

**識別子**: RC-45（GitHub id: 4154080601）

**レビュワー**: Codex

**指摘箇所**: `base/src/composable/memberCsvExport.ts:150`

**該当コード（レビュー時点の diff）**:

```diff
@@ -125,3 +125,57 @@ export const buildEventMemberCsv = (
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
+    field_id: string
+    field_label: string
+    display_value: string
+  }>
+}
+
+export const buildEventFormResponseCsv = (rows: EventFormResponseCsvRow[]): string => {
+  const columns: Array<{ field_id: string; field_label: string }> = []
+  const seen = new Set<string>()
+  for (const row of rows) {
+    for (const answer of row.answers) {
+      if (!seen.has(answer.field_id)) {
+        seen.add(answer.field_id)
+        columns.push({ field_id: answer.field_id, field_label: answer.field_label })
+      }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  ラベル変更前後の回答をCSVの別列として保持する**

既存指摘の「同名だが別IDの設問」は修正されていますが、同じ `field_id` のラベルを受付中に変更できる今回の仕様では、変更前後の回答スナップショットが異なる `field_label` を持ちます。ここで `field_id` だけを重複排除すると最初のラベルしかヘッダーに残らず、変更後の回答が別の設問文の列へ出力されて確定時の文言を判別できません。列の識別にラベルまたは定義世代も含めてください。

Useful? React with 👍 / 👎.

**コメント要約**: 同じ field_id のラベル変更前後が CSV 1 列に潰れる
列キーを field_id と確定時ラベルの組にした

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: P2 だが確定時スナップショットを識別できない実害がある。📌 S 🔧 で列キーを組に変更した。
---

**識別子**: RC-46（GitHub id: 4154080609）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/formOrder.ts:64`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,155 @@
+import { onCall, HttpsError } from 'firebase-functions/https'
+import {
+  GetOrderFormForCartRequestSchema,
+  SaveOrderFormAttemptRequestSchema,
+  type GetOrderFormForCartResponse,
+  type SaveOrderFormAttemptResponse,
+} from '@shokujii/common/apis/form.js'
+import {
+  answersToInputs,
+  validateFormAnswers,
+  type FormAnswerInput,
+} from '@shokujii/common/utils/validateFormAnswers.js'
+import type { FormField } from '@shokujii/common/schemas/formFields.js'
+import type { FormAnswerSnapshot } from '@shokujii/common/schemas/FormResponse.js'
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
+function initialAnswersForVisibleFields(answers: FormAnswerSnapshot[], fields: FormField[]): FormAnswerInput[] {
+  const fieldById = new Map(fields.map((field) => [field.field_id, field]))
+  return answersToInputs(answers).flatMap((answer) => {
+    const field = fieldById.get(answer.field_id)
+    if (field == null) {
+      return []
+    }
+    if (field.type === 'checkbox') {
+      const allowed = new Set(
+        field.options.filter((option) => !option.hidden_for_new).map((option) => option.option_id),
+      )
+      return [{ ...answer, option_ids: (answer.option_ids ?? []).filter((id) => allowed.has(id)) }]
+    }
+    if (field.type === 'radio' || field.type === 'select') {
+      const allowed = new Set(
+        field.options.filter((option) => !option.hidden_for_new).map((option) => option.option_id),
+      )
+      if (answer.option_id != null && !allowed.has(answer.option_id)) {
+        return [{ field_id: answer.field_id }]
+      }
+    }
+    return [answer]
+  })
+}
+
+async function requireInCart(communityId: string, eventId: string, userId: string): Promise<void> {
+  const cartOrders = await getOrdersInCart(communityId, eventId, userId)
+  if (cartOrders.length === 0) {
+    throw new HttpsError('failed-precondition', 'カートに注文があるときだけ回答できます')
+  }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  フォームAPIでもイベントの注文受付条件を検証する**

イベント中止後や注文期限経過後でも `in_cart` の注文が残っている場合、この関数は通過するため、`getOrderFormForCart` で過去回答を取得し、`saveOrderFormAttempt` で新しい試行も保存できます。最終的な注文確定は別処理で拒否されるため、利用者は完了不能な回答画面へ進めてしまい、注文フロー中だけ取得・編集を許す制約も満たしません。カート存在に加えて中止状態と注文期限などの受付条件を両APIで検証してください。

Useful? React with 👍 / 👎.

**コメント要約**: フォーム API が中止・期限を検証しない
受付条件の置き場所は仕様判断のため自動修正しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: 最終確定は別処理で拒否される。回答画面の受付条件をどこまで揃えるかは仕様判断。自動修正対象外。
---

**識別子**: RC-47（GitHub id: 4154080620）

**レビュワー**: Codex

**指摘箇所**: `common/src/utils/normalizeFormFields.ts:54`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,103 @@
+import {
+  FORM_FIELD_LIMITS,
+  FormFieldSchema,
+  isChoiceFieldType,
+  type FormField,
+  type FormOption,
+} from '../schemas/formFields.js'
+import type { FormFieldInput } from '../apis/form.js'
+
+export type NormalizeFormFieldsResult = { ok: true; fields: FormField[] } | { ok: false; message: string }
+
+function createEntityId(prefix: string): string {
+  const bytes = new Uint8Array(8)
+  if (typeof globalThis.crypto?.getRandomValues === 'function') {
+    globalThis.crypto.getRandomValues(bytes)
+  } else {
+    for (let i = 0; i < bytes.length; i++) {
+      bytes[i] = Math.floor(Math.random() * 256)
+    }
+  }
+  return `${prefix}_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
+}
+
+function existingTypeById(existing: FormField[] | undefined): Map<string, FormField['type']> {
+  const map = new Map<string, FormField['type']>()
+  for (const field of existing ?? []) {
+    map.set(field.field_id, field.type)
+  }
+  return map
+}
+
+export function normalizeFormFields(inputs: FormFieldInput[], existing?: FormField[]): NormalizeFormFieldsResult {
+  if (inputs.length > FORM_FIELD_LIMITS.maxFields) {
+    return { ok: false, message: `設問は${FORM_FIELD_LIMITS.maxFields}件までです` }
+  }
+
+  const usedFieldIds = new Set<string>()
+  const typeById = existingTypeById(existing)
+  const fields: FormField[] = []
+
+  for (const input of inputs) {
+    let fieldId = input.field_id
+    if (fieldId != null && typeById.has(fieldId) && typeById.get(fieldId) !== input.type) {
+      return { ok: false, message: '同じ設問IDの項目タイプは変更できません' }
+    }
+    if (fieldId == null || fieldId === '' || usedFieldIds.has(fieldId)) {
+      fieldId = createEntityId('fld')
+    }
+    usedFieldIds.add(fieldId)
+
+    if (isChoiceFieldType(input.type)) {
+      const optionInputs = input.options ?? []
+      if (optionInputs.length === 0) {
+        return { ok: false, message: '選択肢を1件以上入力してください' }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  必須選択設問に表示可能な選択肢を要求する**

ここでは選択肢の総数しか検証しないため、必須のチェックボックス・ラジオ・プルダウンで全選択肢を `hidden_for_new` にしたフォームも保存できます。この設定では回答画面に選択肢が一つも出ない一方、`validateFormAnswers` は必須未回答として常に拒否するため、そのイベントでは全利用者が注文を完了できません。新規回答に表示する必須選択設問には少なくとも1件の表示可能な選択肢があることを保存時に検証してください。

Useful? React with 👍 / 👎.

**コメント要約**: 必須選択設問で表示選択肢が無くても保存できる
表示可能な選択肢を1件以上要求するよう正規化した

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 全 hidden だと利用者が注文できない。保存時検証を追加した。
---

**識別子**: RC-48（GitHub id: 4154080629）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/manage/event/EventFormResponsesPanel.vue:37`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,132 @@
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
+    responses.value = []
+    selected.value = null
+    return
+  }
+  loading.value = true
+  responses.value = []
+  selected.value = null
+  try {
+    const response = await listEventFormResponses({
+      community_id: props.event.community_id,
+      event_id: props.event.event_id,
+      filter: filter.value,
+    })
+    responses.value = response.data.responses
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  最新のフィルター要求だけを回答一覧へ反映する**

参加確定と全取消を素早く切り替えた場合���イベントが切り替わった場合、複数の `load` が並行し、古いリクエストが後から完了すると現在のフィルターとは異なる回答で `responses` を上書きします。その状態では表示中のタブと一覧が食い違い、CSVも意図しない参加状態の回答を出力できます。要求時のイベントIDとフィルターを保持し、完了時点でも一致する最新リクエストだけを反映してください。

Useful? React with 👍 / 👎.

**コメント要約**: 回答一覧の並行 load が古い結果で上書きしうる
UX ラベルのため自動修正せず未着手

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 👤 UX

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: レースは妥当だがリクエスト世代管理は UX ラベル付き 🟡 のため自動修正しない。
---

**識別子**: RC-49（GitHub id: 4154080641）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stores/form.ts:241`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・242 行）
+  eventId: string,
+  userId: string,
+  transaction?: Transaction,
+): Promise<FormResponse | undefined> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(userId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const listFormResponses = async (communityId: string, eventId: string): Promise<FormResponse[]> => {
+  const snapshot = await formResponsesCollection(communityId, eventId).get()
+  return snapshot.docs.map((doc) => doc.data())
+}
+
+export const saveFormResponse = async (
+  communityId: string,
+  eventId: string,
+  response: FormResponse,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(response.id)
+  if (transaction === undefined) {
+    await ref.set(response)
+  } else {
+    transaction.set(ref, response)
+  }
+}
+
+export const createFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  src: Partial<FormCheckoutAttempt>,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc()
+  const attempt = new FormCheckoutAttempt(ref.id, src)
+  if (transaction === undefined) {
+    await ref.set(attempt)
+  } else {
+    transaction.set(ref, attempt)
+  }
+  return attempt
+}
+
+export const getFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  attemptId: string,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt | undefined> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc(attemptId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const saveFormCheckoutAttempt = async (
+  communityId: string,
+  eventId: string,
+  attempt: FormCheckoutAttempt,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formAttemptsCollection(communityId, eventId).doc(attempt.id)
+  if (transaction === undefined) {
+    await ref.set(attempt)
+  } else {
+    transaction.set(ref, attempt)
+  }
+}
+
+export const listPendingFormCheckoutAttemptsForUser = async (
+  communityId: string,
+  eventId: string,
+  userId: string,
+  transaction?: Transaction,
+): Promise<FormCheckoutAttempt[]> => {
+  const query = formAttemptsCollection(communityId, eventId).where('user_id', '==', userId)
+  const snapshot = await (transaction === undefined ? query.get() : transaction.get(query))
+  return snapshot.docs
+    .map((doc) => doc.data())
+    .filter((attempt) => attempt.status === 'pending' || attempt.status === 'frozen')
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  未確定試行だけをFirestoreクエリで取得する**

関数名とは異なり、クエリは `user_id` だけで全試行を読み、その後に `pending` と `frozen` をメモリ上で抽出しています。試行は回答保存のたびに新規ドキュメントとして作成され、消費済み試行を削除する処理もないため、追加注文や決済再試行を重ねた利用者ほど回答画面を開くたびに全履歴を読み続け、レイテンシとFirestore読み取り料金が増加します。`status` をクエリ条件に含め、必要なら対応する複合インデックスを追加してください。

Useful? React with 👍 / 👎.

**コメント要約**: 未確定試行だけを Firestore クエリで取得する
RC-34 の status in クエリで対応済み

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: P2 だが RC-34 と同じ読み取り肥大化。status 絞り込みで解消した。
---

**識別子**: RC-50（GitHub id: 4154080654）

**レビュワー**: Codex

**指摘箇所**: `common/src/apis/form.ts:17`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,224 @@
+import { z } from 'zod'
+import { FORM_FIELD_LIMITS, FORM_FIELD_TYPE_VALUES } from '../schemas/formFields.js'
+import type { FormField } from '../schemas/formFields.js'
+import type { FormAnswerInput, FormValidationIssue } from '../utils/validateFormAnswers.js'
+import type { FormAnswerSnapshot } from '../schemas/FormResponse.js'
+
+export const FormOptionInputSchema = z.object({
+  option_id: z.string().min(1).optional(),
+  label: z.string().min(1).max(FORM_FIELD_LIMITS.maxLabel),
+  hidden_for_new: z.boolean().optional(),
+})
+
+export const FormFieldInputSchema = z.object({
+  field_id: z.string().min(1).optional(),
+  type: z.enum(FORM_FIELD_TYPE_VALUES),
+  label: z.string().min(1).max(FORM_FIELD_LIMITS.maxLabel),
+  description: z.string().max(FORM_FIELD_LIMITS.maxDescription).optional(),
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  空白だけの設問ラベルを保存前に拒否する**

`z.string().min(1)` は空白文字だけのラベルを有効とみなし、エディタも設問ラベルを trim せず送信するため、通常の画面操作で表示上は無題の設問を保存できます。プレビュー側は `field.label.trim() === ''` の設問を除外する一方、実際の回答画面ではその設問が表示されるため、管理者はプレビューで確認できなかった無題の必須入力を申込者へ要求でき、CSVの列名も判別不能になります。スキーマまたは正規化処理で trim 後の非空文字列を要求してください。

Useful? React with 👍 / 👎.

**コメント要約**: 空白だけの設問ラベルを保存できてしまう
入力スキーマと正規化で trim 後に拒否した

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 📌 S 🔧 で方針が一意。Zod trim と normalize の空文字拒否を入れた。
---

**識別子**: RC-51（GitHub id: 5377692040）

**レビュワー**: Codex

**指摘箇所**: `PR トップレベル（Codex overview）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


### 💡 Codex Review

Here are some automated review suggestions for this pull request.

**Reviewed commit:** `31f29be2be`
    

<details> <summary>ℹ️ About Codex in GitHub</summary>
<br/>

[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review".

If Codex has suggestions, it will comment; otherwise it will react with 👍.




Codex can also answer questions or update the PR. Try commenting "@codex address that feedback".
            
</details>

**コメント要約**: Codex overview は個別指摘の要約
実体は RC-44〜50 のインラインで扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview / wrapper。個別指摘はインライン RC で評価する。


## 評価セッション（2026-10-01 19:14・review-comments-evaluate）

- **評価日時**: 2026-10-01 19:14 JST
- **評価者**: Cursor Agent（review-comments-evaluate / auto）
- **ブランチ名**: feat/957-form
- **PR**: https://github.com/nijuniinc/bokudeli-event-new/pull/2384
- **REVIEW_REQUEST_SINCE**: 2026-10-01T09:59:51Z
- **partial**: false
- **Outdated 除外件数**: 0
- **レビュー非該当スキップ件数**: 1（依頼定型 5929109852）
- **手順 4a 自動修正**: RC-57（🚨 1件）と RC-54 / RC-55 / RC-56（🟡 3件）

### RC 一覧（サマリ）

| 対応 | RC | GitHub id | 評価 | ステータス | PRスコープ | ラベル | 種別 | 工数 | 要約 |
|:----:|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| [ ] | RC-52 | 4154240363 | 🚨 必須修正 | 未着手 | 📌 スコープ内 | 💾 データ, 🔒 セキュリティ | 📋 仕様追加 | M | アカウント削除時にフォーム回答が残る<br>匿名化範囲はセキュリティ影響確認が必要なため自動修正しない |
| [ ] | RC-53 | 4154240377 | 🟡 修正提案 | 未着手 | 📌 スコープ内 | 📑 仕様書, 👤 UX | 🆕 新機能 | M | 設問・選択肢の並べ替えUIが無い<br>MVPの並べ替えは仕様・UX付きのため自動修正しない |
| [x] | RC-54 | 4154240386 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | confirmOrder 成功後の遷移失敗を注文失敗と表示する<br>確定と遷移の try を分けた |
| [x] | RC-55 | 4154240400 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | フォームなしキャッシュが永続し後から追加したフォームを見落とす<br>注文ボタン押下時に no なら再取得する |
| [x] | RC-56 | 4154240407 | 🟡 修正提案 | ✅ 対応済み | 📌 スコープ内 | 🐛 実害 | 🔧 微修正 | S | カート購読のオブジェクト更新で入力中回答が消える<br>community_id と event_id だけを watch する |
| [x] | RC-57 | 4154240414 | 🚨 必須修正 | ✅ 対応済み | 📌 スコープ内 | 💾 データ | 🔧 微修正 | S | 追加注文確定で hidden_for_new の過去回答が消える<br>非表示設問のスナップショットを既存回答から引き継ぐ |
| [x] | RC-58 | 5929156777 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | 再依頼スレッドの残件まとめ<br>showConfirm は RC-31、版リセットは RC-27、revision_basis は RC-28、TTL は RC-38 |
| [x] | RC-59 | 5377884131 | 👌 修正不要 | — | — | — | 👀 確認のみ | — | Codex overview は個別指摘の要約<br>実体は RC-52〜57 のインラインで扱う |

---

**識別子**: RC-52（GitHub id: 4154240363）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/stores/form.ts:184`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・185 行）
+  const created = new CommunityForm(ref.id, form)
+  await ref.set(created)
+  return created
+}
+
+export const saveCommunityForm = async (
+  communityId: string,
+  form: CommunityForm,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formsCollection(communityId).doc(form.id)
+  if (transaction === undefined) {
+    await ref.set(form)
+  } else {
+    transaction.set(ref, form)
+  }
+}
+
+export const getEventFormConfig = async (
+  communityId: string,
+  eventId: string,
+  transaction?: Transaction,
+): Promise<EventFormConfig | undefined> => {
+  const ref = eventFormConfigRef(communityId, eventId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const saveEventFormConfig = async (
+  communityId: string,
+  eventId: string,
+  config: EventFormConfig,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = eventFormConfigRef(communityId, eventId)
+  if (transaction === undefined) {
+    await ref.set(config)
+  } else {
+    transaction.set(ref, config)
+  }
+}
+
+export const deleteEventFormConfig = async (
+  communityId: string,
+  eventId: string,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = eventFormConfigRef(communityId, eventId)
+  if (transaction === undefined) {
+    await ref.delete()
+  } else {
+    transaction.delete(ref)
+  }
+}
+
+export const getFormResponse = async (
+  communityId: string,
+  eventId: string,
+  userId: string,
+  transaction?: Transaction,
+): Promise<FormResponse | undefined> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(userId)
+  const snapshot = await (transaction === undefined ? ref.get() : transaction.get(ref))
+  return snapshot.exists ? snapshot.data() : undefined
+}
+
+export const listFormResponses = async (communityId: string, eventId: string): Promise<FormResponse[]> => {
+  const snapshot = await formResponsesCollection(communityId, eventId).get()
+  return snapshot.docs.map((doc) => doc.data())
+}
+
+export const saveFormResponse = async (
+  communityId: string,
+  eventId: string,
+  response: FormResponse,
+  transaction?: Transaction,
+): Promise<void> => {
+  const ref = formResponsesCollection(communityId, eventId).doc(response.id)
+  if (transaction === undefined) {
+    await ref.set(response)
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  アカウント削除時にフォーム回答も匿名化する**

回答者がアカウント削除を実行しても、ここで保存した `form_responses` には UID と自由入力・メール・電話などの回答スナップショットが残り続けます。リポジトリ全体を検索した範囲では `deleteUserAccount` は `users` と個人情報を匿名化するだけでこの新規コレクションを処理しないため、削除後もコミュニティ管理者が `listEventFormResponses` 経由で本人の回答を閲覧できます。Auth アカウントを削除する前に、このユーザーの確定回答と未確定試行を削除または不可逆に匿名化してください。

Useful? React with 👍 / 👎.

**コメント要約**: アカウント削除時にフォーム回答が残る
匿名化範囲はセキュリティ影響確認が必要なため自動修正しない

**評価**: 🚨 必須修正

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ, 🔒 セキュリティ

**変更種別**: 📋 仕様追加

**想定工数**: M

**判断理由**: deleteUserAccount への form_responses / attempts 処理追加は個人情報削除の影響確認が要る。自動修正対象外。
---

**識別子**: RC-53（GitHub id: 4154240377）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/FormFieldsEditor.vue:35`

**該当コード（レビュー時点の diff）**:

```diff
@@ -0,0 +1,184 @@
+<script setup lang="ts">
+import { FORM_FIELD_LIMITS, FORM_FIELD_TYPE_VALUES, isChoiceFieldType } from '@shokujii/common/schemas/formFields.js'
+import type { FormFieldInput } from '@shokujii/common/apis/form.js'
+import { mdiDelete, mdiPlus } from '@mdi/js'
+
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
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  設問と選択肢を並べ替えられる操作を追加する**

今回追加された仕様書のMVP範囲では設問設定に「並べ替え」が含まれていますが、このエディタは末尾への追加と削除・編集しか提供しておらず、リポジトリ全体を検索してもフォーム用の並べ替え処理はありません。作成後に設問や選択肢の順序を修正できず、削除して作り直すと不変であるべきIDまで変わるため、ドラッグ操作または上下移動で配列順を更新できるようにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: 設問・選択肢の並べ替えUIが無い
MVPの並べ替えは仕様・UX付きのため自動修正しない

**評価**: 🟡 修正提案

**ステータス**: 未着手

**PRスコープ**: 📌 スコープ内

**ラベル**: 📑 仕様書, 👤 UX

**変更種別**: 🆕 新機能

**想定工数**: M

**判断理由**: 仕様書に並べ替えはあるがドラッグ/上下移動の追加は新機能。自動修正対象外。
---

**識別子**: RC-54（GitHub id: 4154240386）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:178`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・179 行）
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
+        isPosted: false,
+        origin: window.location.origin,
+        form_attempt_id: attemptId,
+      })
+      window.location.href =
+        response.data.url ?? props.resolveEventPath(item.event.community_account, item.event.event_id)
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
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  注文確定後の遷移失敗を注文失敗として扱わない**

非Stripe注文では `confirmOrder` の成功後に `router.push` が例外を投げた場合も同じ `catch` に入り、「注文処理に失敗しました」と表示されます。この時点で注文とフォーム回答は既にサーバー上で確定済みなので、利用者は未確定だと誤認して再試行し、消費済み回答などの別エラーに遭遇します。注文APIと画面遷移のエラー処理を分け、遷移失敗を注文失敗として表示しないでください。

Useful? React with 👍 / 👎.

**コメント要約**: confirmOrder 成功後の遷移失敗を注文失敗と表示する
確定と遷移の try を分けた

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 注文は成功しているのに失敗表示になる。📌 S 🔧 で catch を分離した。
---

**識別子**: RC-55（GitHub id: 4154240400）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/pages/cart.vue:469`

**該当コード（レビュー時点の diff）**:

```diff
@@ -447,6 +451,79 @@ const enrichedCart = computed<EnrichedCartItem[] | null>(() => {
 const findEnrichedCartItem = (cartItem: CartItem): EnrichedCartItem | undefined =>
   enrichedCart.value?.find((item) => item.event.event_id === cartItem.event.event_id)
 
+type FormPresence = 'loading' | 'yes' | 'no' | 'error'
+const formPresenceByKey = ref<Record<string, FormPresence>>({})
+
+const formPresenceKey = (communityId: string, eventId: string): string => `${communityId}\^@${eventId}`
+
+const isPfEvent = (event: BokudeliEvent): boolean => event.enterprise_id == null || event.enterprise_id === ''
+
+const loadFormPresence = async (event: BokudeliEvent) => {
+  const key = formPresenceKey(event.community_id, event.event_id)
+  if (!isPfEvent(event) || props.resolveFormAnswerPath == null) {
+    formPresenceByKey.value = { ...formPresenceByKey.value, [key]: 'no' }
+    return
+  }
+  if (formPresenceByKey.value[key] === 'yes' || formPresenceByKey.value[key] === 'no') {
+    return
+  }
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  フォーム未設定のキャッシュを注文前に再検証する**

カートを開いた時点でフォームが未設定だと `no` を永続的にキャッシュするため、その後管理者が受付中イベントへフォームを追加しても再取得されません。この状態で利用者が従来の注文ボタンを押すと、確定APIは回答必須として拒否しますが、画面には回答ページへ進む導線が現れず、再読み込みするまで注文できません。フォーム追加が受付中にも許可される仕様なので、注文ボタン押下時に再検証するか、少なくとも `no` を失効可能なキャッシュにしてください。

Useful? React with 👍 / 👎.

**コメント要約**: フォームなしキャッシュが永続し後から追加したフォームを見落とす
注文ボタン押下時に no なら再取得する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 受付中にフォームを足すとカートの no キャッシュで回答を飛ばす。クリック時に再検証した。
---

**識別子**: RC-56（GitHub id: 4154240407）

**レビュワー**: Codex

**指摘箇所**: `base/src/components/forms/CartFormAnswer.vue:98`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・99 行）
+
+const props = defineProps<{
+  eventId: string
+  communityAccount: string
+  resolveOrdersPath: ResolveOrdersPathFn
+  resolveCartPath: () => string
+  resolveEventPath: ResolveEventHrefFn
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
+const cartItem = computed(() =>
+  cart.value?.find(
+    (item) => item.event.event_id === props.eventId && item.event.community_account === props.communityAccount,
+  ),
+)
+const fields = computed<FormField[]>(() => form.value?.fields ?? [])
+
+const needsStripe = computed(() => {
+  const item = cartItem.value
+  if (item == null) {
+    return false
+  }
+  if (item.event.event_payment === 'user_advance') {
+    return computeTotalPayment(item.orders) > 0
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
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  カート更新時に入力中の回答を上書きしない**

回答中に同じイベントのカート注文が別タブなどで追加・削除されると、Firestore購読が新しい `CartItem` オブジェクトを生成するため、この watch が再発火して `load()` 内で `answers` を保存済み初期値へ戻します。利用者が入力していた未送信の内容が警告なしで失われるので、初回のカート読込だけを待つか、安定したイベント識別子だけを監視し、編集開始後は回答を再初期化しないでください。

Useful? React with 👍 / 👎.

**コメント要約**: カート購読のオブジェクト更新で入力中回答が消える
community_id と event_id だけを watch する

**評価**: 🟡 修正提案

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 🐛 実害

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: CartItem 再生成で load が走り answers を初期化する。安定キー監視に変えた。
---

**識別子**: RC-57（GitHub id: 4154240414）

**レビュワー**: Codex

**指摘箇所**: `functions/default/src/utils/formConfirm.ts:118`

**該当コード（レビュー時点の diff）**:

```diff
…（diff 先頭省略・119 行）
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
+  }
+  if (
+    params.ignoreDefinitionMismatch !== true &&
+    existing != null &&
+    existing.definition_version > params.attempt.definition_version
+  ) {
+    params.attempt.status = 'consumed'
+    await saveFormCheckoutAttempt(params.event.community_id, params.event.id, params.attempt, params.transaction)
+    return
+  }
+
+  const now = Date.now()
+  const nextRevision = (existing?.revision ?? 0) + 1
+  const confirmed = new FormResponse(params.userId, {
+    user_id: params.userId,
+    definition_version: params.attempt.definition_version,
+    revision: nextRevision,
+    answers: params.attempt.answers,
```

**レビュワーのコメント（原文）**:

**<sub><sub>![P1 Badge](https://img.shields.io/badge/P1-orange?style=flat)</sub></sub>  非表示設問の確定済み回答を引き継ぐ**

既存回答者が追加注文する際、`hidden_for_new` にした設問は試行回答から除外されますが、ここでは確定済み回答全体を試行の `answers` だけで置き換えています。そのため追加注文が確定した瞬間に、非表示設問への過去回答が `form_responses` から永久に消え、回答一覧とCSVからも欠落します。仕様で求めている「新規では出さなくしても確定済み回答を一覧・CSVに残す」を満たすため、現在表示されない設問のスナップショットは既存回答から引き継いだうえで、今回編集可能だった設問だけを更新してください。

Useful? React with 👍 / 👎.

**コメント要約**: 追加注文確定で hidden_for_new の過去回答が消える
非表示設問のスナップショットを既存回答から引き継ぐ

**評価**: 🚨 必須修正

**ステータス**: ✅ 対応済み

**PRスコープ**: 📌 スコープ内

**ラベル**: 💾 データ

**変更種別**: 🔧 微修正

**想定工数**: S

**判断理由**: 仕様どおり非表示設問は一覧・CSVに残す。確定時に hidden 回答をマージした。
---

**識別子**: RC-58（GitHub id: 5929156777）

**レビュワー**: Copilot

**指摘箇所**: `PR トップレベル（再依頼スレッド）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


> @codex この PR の Files changed をコードレビューしてください。指摘は shokujii-code-review チェックリストに沿って日本語でお願いします。
> 
> @copilot この PR ��...

現行ツールでは新規インライン review comment を作成できないため、該当箇所を明記して報告します。

🚨 **必須修正** [🔧微修正/M]: フォーム回答画面は `showConfirm` を通さず `startOrder` から注文・決済へ進むため、ユーザー名・画像・メールの必須確認を迂回できます。フォームなし経路と同じ事前条件を注文開始前にも適用してください。対象: `base/src/components/forms/CartFormAnswer.vue:180-212`（確認元: `base/src/components/pages/cart.vue:712-727`）。

🚨 **必須修正** [💾データ/🔒セキュリティ・仕様追加/M]: `clearEventFormConfig` は設定だけを削除し、再設定時の版番号は `1` に戻ります。削除前の試行は残るため、新定義も版 `1` になると古い回答が版一致として取得・確定され得ます。設定削除後も世代を単調増加させるか、旧試行を無効化してください。対象: `functions/default/src/formAdmin.ts:227-235,274-281`。

🚨 **必須修正** [💾データ/🔧微修正/M]: 複数の試行を同じ確定回答リビジョンから作ると、全て同じ `revision_basis` になります。先に確定した試行が回答リビジョンを進めると、後から完了した試行は `existing.revision > revision_basis` で破棄されるため、後発の決済でも新しい回答が反映されません。試行の新旧を識別する世代を付けるか、同一ユーザー・イベントで有効試行を一つに制限してください。対象: `functions/default/src/formOrder.ts:140-147`、`functions/default/src/utils/formConfirm.ts:97-101`。

🚨 **必須修正** [💾データ/🔒セキュリティ・仕様追加/M]: `form_checkout_attempts` に回答本文を保存しますが、`expires_at` 等の期限・削除処理がなく、決済離脱や失敗の試行が無期限に残ります。保持期間と削除方法を確定し、TTL または定期削除を実装してください。対象: `common/src/schemas/FormCheckoutAttempt.ts:8-17`、`functions/default/src/formOrder.ts:140-147`。

**コメント要約**: 再依頼スレッドの残件まとめ
showConfirm は RC-31、版リセットは RC-27、revision_basis は RC-28、TTL は RC-38

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: 個別指摘は既存 RC で記録済み。
---

**識別子**: RC-59（GitHub id: 5377884131）

**レビュワー**: Codex

**指摘箇所**: `PR トップレベル（Codex overview）`

**該当コード（レビュー時点の diff）**:

```diff
（インライン指摘なし）
```

**レビュワーのコメント（原文）**:


### 💡 Codex Review

Here are some automated review suggestions for this pull request.

**Reviewed commit:** `4e7ddafcb9`
    

<details> <summary>ℹ️ About Codex in GitHub</summary>
<br/>

[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review".

If Codex has suggestions, it will comment; otherwise it will react with 👍.




Codex can also answer questions or update the PR. Try commenting "@codex address that feedback".
            
</details>

**コメント要約**: Codex overview は個別指摘の要約
実体は RC-52〜57 のインラインで扱う

**評価**: 👌 修正不要

**ステータス**: —

**PRスコープ**: —

**ラベル**: —

**変更種別**: 👀 確認のみ

**想定工数**: —

**判断理由**: overview / wrapper。

